'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetBody } from '@/components/space/PlanetBody';
import { EarthDayNightShader, NASA_TEXTURES, SaturnGlobeShader, SaturnRingShader, loadNasaTexture } from '@/components/space/nasaTextures';
import { heroScene, scaled } from './heroScene';

/* ---------- Güneş'e bakan atmosfer halkası ---------- */

const ATMO_VERTEX = /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const ATMO_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSun;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(cameraPosition - vW);
    float f = pow(1.0 - abs(dot(n, v)), uPower);
    float lit = clamp(dot(n, normalize(uSun)) * 0.9 + 0.3, 0.0, 1.0);
    float a = f * lit * uStrength;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

function atmosphereMaterial(color: string, power: number, strength: number) {
  return new THREE.ShaderMaterial({
    vertexShader: ATMO_VERTEX,
    fragmentShader: ATMO_FRAGMENT,
    uniforms: { uColor: { value: new THREE.Color(color) }, uSun: { value: new THREE.Vector3(1, 0, 0) }, uPower: { value: power }, uStrength: { value: strength } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** Sahnede Güneş dünya merkezinde: bir nesneden Güneş'e doğru birim yön. */
function sunDirection(obj: THREE.Object3D, out: THREE.Vector3) {
  obj.getWorldPosition(_p);
  return out.copy(_p).negate().normalize();
}

/** Güneş tarafı parlayan ince atmosfer kabuğu. */
export function Atmosphere({ radius, color, scale = 1.05, power = 2.4, strength = 1.1 }: { radius: number; color: string; scale?: number; power?: number; strength?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => atmosphereMaterial(color, power, strength), [color, power, strength]);
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame(() => {
    if (mesh.current) sunDirection(mesh.current, mat.uniforms.uSun.value);
  });
  return (
    <mesh ref={mesh} scale={scale} material={mat}>
      <sphereGeometry args={[radius, scaled(64, 32), scaled(64, 32)]} />
    </mesh>
  );
}

/* ---------- Dünya: gündüz/gece, şehir ışıkları, okyanus parıltısı, bulutlar ---------- */

export function HeroEarth({ radius }: { radius: number }) {
  const body = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          dayMap: { value: loadNasaTexture(NASA_TEXTURES.earthMap) },
          nightMap: { value: loadNasaTexture(NASA_TEXTURES.earthNight) },
          specularMap: { value: loadNasaTexture(NASA_TEXTURES.earthSpecular) },
          sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        },
        vertexShader: EarthDayNightShader.vertexShader,
        // Gece yüzü tamamen kararmasın: kıtalar ve bulutlar seçilsin, şehir ışıkları yine parlasın
        fragmentShader: EarthDayNightShader.fragmentShader.replace('float diffuse = clamp(NdotL, 0.04, 1.0);', 'float diffuse = 0.14 + 0.86 * clamp(NdotL, 0.0, 1.0);'),
      }),
    []
  );
  const cloudMap = useMemo(() => loadNasaTexture(NASA_TEXTURES.earthClouds), []);
  useEffect(() => () => surface.dispose(), [surface]);

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    if (body.current) {
      sunDirection(body.current, surface.uniforms.sunDirection.value);
      if (!heroScene.frozen) body.current.rotation.y += delta * 0.25;
    }
    if (clouds.current && !heroScene.frozen) clouds.current.rotation.y += delta * 0.31;
  });

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(23.4)]}>
      <mesh ref={body} material={surface}>
        <sphereGeometry args={[radius, scaled(72, 36), scaled(72, 36)]} />
      </mesh>
      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[radius, scaled(64, 32), scaled(64, 32)]} />
        <meshStandardMaterial map={cloudMap} transparent opacity={0.95} depthWrite={false} roughness={1} />
      </mesh>
      <Atmosphere radius={radius} color="#6fb4ff" scale={1.07} power={2.2} strength={1.4} />
    </group>
  );
}

/* ---------- Satürn: halka gölgesi düşen küre ve gezegen gölgesi düşen halkalar ---------- */

export function HeroSaturn({ radius }: { radius: number }) {
  const group = useRef<THREE.Group>(null);
  const globe = useRef<THREE.Mesh>(null);
  const inner = radius * 1.24;
  const outer = radius * 2.3;
  const globeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          planetMap: { value: loadNasaTexture(NASA_TEXTURES.saturn) },
          sunDirectionLocal: { value: new THREE.Vector3(1, 0, 0) },
          ringInner: { value: inner },
          ringOuter: { value: outer },
        },
        vertexShader: SaturnGlobeShader.vertexShader,
        // Sahne için gece yüzüne hafif dolgu: ön plandaki Satürn kara bir disk gibi görünmesin
        fragmentShader: SaturnGlobeShader.fragmentShader.replace('float NdotL = max(0.08, dot(norm, sunDir));', 'float NdotL = 0.3 + 0.75 * max(0.0, dot(norm, sunDir));'),
      }),
    [inner, outer]
  );
  const ringMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          ringMap: { value: loadNasaTexture(NASA_TEXTURES.saturnRing) },
          sunDirectionLocal: { value: new THREE.Vector3(1, 0, 0) },
          saturnRadius: { value: radius },
          ringInner: { value: inner },
          ringOuter: { value: outer },
        },
        vertexShader: SaturnRingShader.vertexShader,
        fragmentShader: SaturnRingShader.fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [radius, inner, outer]
  );
  const ringGeo = useMemo(() => new THREE.RingGeometry(inner, outer, scaled(192, 96), 1), [inner, outer]);
  const dir = useMemo(() => new THREE.Vector3(), []);
  useEffect(
    () => () => {
      globeMat.dispose();
      ringMat.dispose();
      ringGeo.dispose();
    },
    [globeMat, ringMat, ringGeo]
  );

  useFrame((_, dt) => {
    if (!group.current || !globe.current) return;
    if (!heroScene.frozen) globe.current.rotation.y += Math.min(dt, 0.05) * 0.5;
    // Gölge hesapları gezegenin kendi ekseninde yapılır: dünya yönünü yerel çerçeveye çevir
    sunDirection(group.current, dir);
    globe.current.getWorldQuaternion(_q).invert();
    globeMat.uniforms.sunDirectionLocal.value.copy(dir).applyQuaternion(_q);
    group.current.getWorldQuaternion(_q).invert();
    ringMat.uniforms.sunDirectionLocal.value.copy(dir).applyQuaternion(_q);
  });

  return (
    <group ref={group} rotation={[0.12, 0, THREE.MathUtils.degToRad(26.7)]}>
      <mesh ref={globe} material={globeMat}>
        <sphereGeometry args={[radius, scaled(96, 40), scaled(96, 40)]} />
      </mesh>
      <mesh geometry={ringGeo} material={ringMat} rotation={[-Math.PI / 2, 0, 0]} />
      <Atmosphere radius={radius} color="#ffd9a0" scale={1.03} power={3} strength={0.6} />
    </group>
  );
}

/* ---------- Diğer gezegenler: NASA dokusu ve atmosfer ---------- */

const ATMOSPHERES: Record<string, { color: string; strength: number } | undefined> = {
  venus: { color: '#ffd9a0', strength: 1.2 },
  mars: { color: '#ff9a6b', strength: 0.8 },
  jupiter: { color: '#ffd8a8', strength: 0.7 },
  uranus: { color: '#9fe7f0', strength: 1.1 },
  neptun: { color: '#7fa0ff', strength: 1.2 },
};

/** Ana sayfa sahnesindeki gezegen gövdesi: Dünya ve Satürn özel gölgelendiriciyle, diğerleri dokulu. */
export function HeroPlanetBody({ id, radius }: { id: string; radius: number }) {
  if (id === 'dunya') return <HeroEarth radius={radius} />;
  if (id === 'saturn') return <HeroSaturn radius={radius} />;
  const atmo = ATMOSPHERES[id];
  return (
    <>
      <PlanetBody id={id} radius={radius} detail={scaled(radius > 1 ? 96 : 56, 28)} spin={1.5} glow={false} />
      {atmo && <Atmosphere radius={radius} color={atmo.color} strength={atmo.strength} />}
    </>
  );
}
