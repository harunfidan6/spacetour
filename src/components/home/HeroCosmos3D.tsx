'use client';
/* eslint-disable react-hooks/immutability -- the R3F frame loop mutates three.js objects (uniforms, tmp vectors, the camera) by design */

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetBody, SunGlow } from '@/components/space/PlanetBody';
import { NASA_TEXTURES, SolarGranulationShader, loadNasaTexture } from '@/components/space/nasaTextures';
import { heroScene } from './heroScene';
import { ForegroundDust, MeteorImpacts, ShootingStars, SunCorona, type PlanetRegistry } from './heroEffects';
import { Comet, SolarActivity, type CometOrbit } from './heroParticles';
import { HeroPlanetBody } from './heroPlanets';

type PlanetId = 'merkur' | 'venus' | 'dunya' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptun';

/** Gezegenin yörünge düzlemindeki yeri: açı (rad, +z kameraya doğru), yörünge yarıçapı, gezegen yarıçapı. */
type Placement = [angle: number, orbit: number, radius: number];

interface Layout {
  fov: number;
  camera: [number, number, number];
  /** Güneş'in ekrandaki kayması, genişlik/yükseklik oranı olarak (+x sağa, +y aşağı) */
  shift: [number, number];
  sun: number;
  belt: [number, number];
  planets: Record<PlanetId, Placement>;
  /** Kuyruklu yıldızlar: biri Güneş'in yakınından geçen büyük, diğeri eğik yörüngeli uzak ve küçük */
  comets: CometOrbit[];
}

// Yerleşimler, hedef ekran noktalarından ışın–düzlem kesişimiyle çözüldü (1440×900 ve 390×844 için)
/** Yatay ekran: metin solda, sistem sağda. */
const WIDE: Layout = {
  fov: 34,
  camera: [0, 6.5, 40],
  shift: [0.146, 0.078],
  sun: 2.9,
  belt: [11.1, 12.0],
  planets: {
    merkur: [2.93, 3.92, 0.22],
    venus: [-0.8, 6.06, 0.4],
    dunya: [1.11, 10.07, 0.58],
    mars: [1.96, 10.63, 0.44],
    jupiter: [-0.56, 12.42, 1.57],
    saturn: [1.19, 17.48, 1.15],
    uranus: [-1.13, 24.45, 0.72],
    neptun: [-1.95, 30, 0.7],
  },
  comets: [
    { a: 16, e: 0.72, omega: 2.35, start: -2.3, tilt: [0.2, 0, 0.13], scale: 1, pace: 26 },
    { a: 26, e: 0.82, omega: -0.7, start: -2.55, tilt: [0.75, 0.3, -0.35], scale: 0.75, pace: 34 },
  ],
};

/** Dikey ekran: metin üstte, sistem ortada, düğmeler altta. */
const TALL: Layout = {
  fov: 58,
  camera: [0, 5, 34],
  shift: [-0.09, 0.098],
  sun: 1.9,
  belt: [10.0, 10.9],
  planets: {
    merkur: [2.7, 2.92, 0.3],
    venus: [-0.74, 5.42, 0.48],
    dunya: [1.28, 7.78, 0.79],
    mars: [1.9, 9.57, 0.64],
    jupiter: [-0.65, 11.44, 1.6],
    saturn: [0.95, 12.4, 1.35],
    uranus: [-0.93, 20.73, 0.9],
    neptun: [-1.93, 24.14, 0.8],
  },
  comets: [
    { a: 12, e: 0.72, omega: 2.5, start: -2.3, tilt: [0.2, 0, 0.13], scale: 0.8, pace: 20 },
    { a: 19, e: 0.82, omega: -0.7, start: -2.55, tilt: [0.75, 0.3, -0.35], scale: 0.6, pace: 26 },
  ],
};

const ORDER: PlanetId[] = ['merkur', 'venus', 'dunya', 'mars', 'jupiter', 'saturn', 'uranus', 'neptun'];
/** Açısal hız (rad/s): Merkür ~24 saniyede, Dünya ~1 dakikada, Satürn ~6,5 dakikada bir tur atar */
const SPEED: Record<PlanetId, number> = { merkur: 0.26, venus: 0.16, dunya: 0.11, mars: 0.07, jupiter: 0.03, saturn: 0.016, uranus: 0.01, neptun: 0.007 };
/** Yörünge düzleminin eğimi: yakın taraf aşağı, sağ taraf yukarı */
const TILT = new THREE.Euler(0.2, 0, 0.13);

function useLayout() {
  const { size } = useThree();
  return size.width / size.height >= 1 ? WIDE : TALL;
}

function circle(radius: number, segments = 200) {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
}

/** Tohumlu sözde rastgele: kuşak her açılışta aynı görünsün, çizim saf kalsın. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Orbit({ radius, opacity = 0.3 }: { radius: number; opacity?: number }) {
  const points = useMemo(() => circle(radius), [radius]);
  const ref = useRef<{ material: THREE.Material & { opacity: number } } | null>(null);
  useFrame(() => {
    if (ref.current) ref.current.material.opacity = opacity * THREE.MathUtils.clamp(heroScene.intro * 1.3, 0, 1);
  });
  return <Line ref={ref as never} points={points} color="#e6c993" lineWidth={1} transparent opacity={0} depthWrite={false} />;
}

function AsteroidBelt({ inner, outer }: { inner: number; outer: number }) {
  const geometry = useMemo(() => {
    const rand = seeded(7);
    const count = 2600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = inner + (outer - inner) * (0.5 + (rand() - 0.5) * (rand() + 0.4));
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (rand() - 0.5) * 0.35;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [inner, outer]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!heroScene.frozen) ref.current.rotation.y += delta * 0.008;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.75 * THREE.MathUtils.clamp(heroScene.intro * 1.2 - 0.2, 0, 1);
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#cdb894" size={0.07} sizeAttenuation transparent opacity={0} depthWrite={false} />
    </points>
  );
}

/** Jüpiter'in dört Galile uydusu: uzaklık ve boyut gezegen yarıçapına göre, hız rad/s */
const GALILEAN = [
  { d: 1.55, r: 0.075, speed: 0.95, phase: 0.4, color: '#e9d27c' },
  { d: 1.95, r: 0.065, speed: 0.66, phase: 2.1, color: '#ddd2bf' },
  { d: 2.45, r: 0.095, speed: 0.45, phase: 3.9, color: '#a99c8b' },
  { d: 3.1, r: 0.088, speed: 0.28, phase: 5.2, color: '#7f7467' },
];

function GalileanMoons({ radius }: { radius: number }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((_, delta) => {
    if (heroScene.frozen) return;
    refs.current.forEach((g, i) => {
      if (g) g.rotation.y += delta * GALILEAN[i].speed;
    });
  });
  return (
    <>
      {GALILEAN.map((m, i) => (
        <group
          key={m.d}
          rotation={[0, m.phase, 0]}
          ref={(node) => {
            refs.current[i] = node;
          }}
        >
          <mesh position={[radius * m.d, 0, 0]}>
            <sphereGeometry args={[radius * m.r, 16, 16]} />
            <meshStandardMaterial color={m.color} roughness={1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Planet({ id, place, index, registry }: { id: PlanetId; place: Placement; index: number; registry: React.RefObject<PlanetRegistry> }) {
  const [angle0, orbit, radius] = place;
  const group = useRef<THREE.Group | null>(null);
  const moon = useRef<THREE.Group>(null);
  const angle = useRef(angle0);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // Kuzeyden bakınca saat yönünün tersine, gerçek dolanma yönünde
    if (!heroScene.frozen) angle.current -= Math.min(delta, 0.05) * SPEED[id];
    g.position.set(Math.cos(angle.current) * orbit, 0, Math.sin(angle.current) * orbit);
    const appear = THREE.MathUtils.clamp((heroScene.intro - 0.2 - index * 0.05) / 0.45, 0, 1);
    g.scale.setScalar(Math.max(THREE.MathUtils.smootherstep(appear, 0, 1), 0.0001));
    if (moon.current && !heroScene.frozen) moon.current.rotation.y += delta * 0.9;
  });

  return (
    <group
      ref={(node) => {
        group.current = node;
        if (node) registry.current.set(id, { group: node, radius });
        else registry.current.delete(id);
      }}
    >
      <HeroPlanetBody id={id} radius={radius} />
      {id === 'jupiter' && <GalileanMoons radius={radius} />}
      {id === 'dunya' && (
        <group ref={moon}>
          <group position={[radius * 1.9, 0.12, 0]}>
            <PlanetBody id="ay" radius={radius * 0.3} detail={28} />
          </group>
        </group>
      )}
    </group>
  );
}

const RIM_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const RIM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor * f * 1.6, f * uOpacity);
  }
`;

function rimMaterial(color: string, power: number) {
  return new THREE.ShaderMaterial({
    vertexShader: RIM_VERTEX,
    fragmentShader: RIM_FRAGMENT,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uPower: { value: power } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** Kaynayan granüllü Güneş, sıcak taç halkası ve iki katlı ışıma. */
function HeroSun({ radius }: { radius: number }) {
  const body = useRef<THREE.Mesh>(null);
  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, sunMap: { value: loadNasaTexture(NASA_TEXTURES.sun) } },
        vertexShader: SolarGranulationShader.vertexShader,
        // Granül deseni bu boyutta ağ gibi görünmesin: genliği yarıya indir
        fragmentShader: SolarGranulationShader.fragmentShader.replace('0.85 + 0.15 * (c1', '0.93 + 0.07 * (c1'),
        toneMapped: false,
      }),
    []
  );
  const corona = useMemo(() => rimMaterial('#ff8a2a', 1.8), []);
  useFrame((_, delta) => {
    corona.uniforms.uOpacity.value = heroScene.intro;
    if (heroScene.frozen) return;
    surface.uniforms.time.value += delta;
    if (body.current) body.current.rotation.y += delta * 0.03;
  });
  useEffect(() => () => {
    surface.dispose();
    corona.dispose();
  }, [surface, corona]);
  return (
    <group>
      <mesh ref={body} material={surface}>
        <sphereGeometry args={[radius, 96, 96]} />
      </mesh>
      <mesh scale={1.06} material={corona}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>
      <SunGlow radius={radius * 1.15} strength={1} />
      <SunGlow radius={radius * 2.6} strength={0.42} />
    </group>
  );
}

function Rig({ layout }: { layout: Layout }) {
  const { camera, size } = useThree();
  const smooth = useRef({ px: 0, py: 0 });
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const s = smooth.current;
    s.px += (heroScene.px - s.px) * 0.04;
    s.py += (heroScene.py - s.py) * 0.04;
    const scroll = THREE.MathUtils.smoothstep(heroScene.scroll, 0, 1);

    if (cam.fov !== layout.fov) cam.fov = layout.fov;
    const [cx, cy, cz] = layout.camera;
    cam.position.set(cx + s.px * 2.4, cy - s.py * 1.6 + scroll * 3, cz * (1 - scroll * 0.18));
    cam.lookAt(look.set(0, scroll * 2, 0));
    // Güneş'i ekranda metnin yanına kaydır: görüntü penceresini ters yöne öteler
    cam.setViewOffset(size.width, size.height, -layout.shift[0] * size.width, -layout.shift[1] * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Scene() {
  const layout = useLayout();
  const sun = useRef<THREE.Group>(null);
  const registry = useRef<PlanetRegistry>(new Map());

  useFrame(() => {
    if (sun.current) sun.current.scale.setScalar(Math.max(THREE.MathUtils.smootherstep(heroScene.intro, 0, 0.7), 0.0001));
  });

  return (
    <>
      <Stars radius={140} depth={80} count={5000} factor={4.2} saturation={0} fade speed={1} />
      <ShootingStars />
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 0]} intensity={4.4} decay={0} color="#fff0d6" />
      {/* Kamera tarafından sıcak dolgu: kameraya bakan gece yüzleri delik gibi görünmesin */}
      <directionalLight position={[-6, 10, 40]} intensity={1.05} color="#ffe2bf" />
      <group rotation={TILT}>
        <group ref={sun}>
          <SunCorona radius={layout.sun} />
          <HeroSun radius={layout.sun} />
          <SolarActivity radius={layout.sun} />
        </group>
        {ORDER.map((id, i) => (
          <Orbit key={`o-${id}`} radius={layout.planets[id][1]} opacity={i > 5 ? 0.2 : 0.32} />
        ))}
        <Orbit radius={layout.belt[0]} opacity={0.12} />
        <Orbit radius={layout.belt[1]} opacity={0.12} />
        <AsteroidBelt inner={layout.belt[0]} outer={layout.belt[1]} />
        {ORDER.map((id, i) => (
          <Planet key={id} id={id} place={layout.planets[id]} index={i} registry={registry} />
        ))}
      </group>
      {layout.comets.map((c, i) => (
        <Comet key={i} orbit={c} />
      ))}
      <MeteorImpacts planets={registry} />
      <ForegroundDust />
      <Rig layout={layout} />
    </>
  );
}

/** Ana sayfa açılışındaki yoğun Güneş Sistemi sahnesi (NASA dokularıyla). */
export function HeroCosmos3D({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: WIDE.camera, fov: WIDE.fov, near: 0.1, far: 600 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
