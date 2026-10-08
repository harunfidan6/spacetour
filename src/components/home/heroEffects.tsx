'use client';
/* eslint-disable react-hooks/immutability -- the R3F frame loop mutates three.js objects (uniforms, pooled vectors, buffers) by design */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { heroScene } from './heroScene';

/** Gezegenlerin sahnedeki grupları: meteorlar hedef seçerken buradan okur. */
export type PlanetRegistry = Map<string, { group: THREE.Group; radius: number }>;

/* ---------- Ortak parçalar ---------- */

const radialCache = new Map<string, THREE.CanvasTexture>();
/** Yumuşak, yuvarlak ışık lekesi (parıltı, kıvılcım, toz). */
function radialTexture(stops: [number, string][]) {
  const key = JSON.stringify(stops);
  const hit = radialCache.get(key);
  if (hit) return hit;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  radialCache.set(key, tex);
  return tex;
}

const HOT = [
  [0, 'rgba(255,255,255,1)'],
  [0.2, 'rgba(255,236,200,0.9)'],
  [0.5, 'rgba(255,150,70,0.35)'],
  [1, 'rgba(255,110,40,0)'],
] as [number, string][];
const SOFT = [
  [0, 'rgba(255,255,255,0.9)'],
  [0.45, 'rgba(255,255,255,0.25)'],
  [1, 'rgba(255,255,255,0)'],
] as [number, string][];

const STREAK_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const STREAK_FRAGMENT = /* glsl */ `
  uniform vec3 uHead;
  uniform vec3 uTail;
  uniform float uOpacity;
  uniform float uSharp;
  uniform float uHot;
  varying vec2 vUv;
  void main() {
    float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float a = pow(vUv.x, uSharp) * pow(across, 1.6);
    a += smoothstep(0.9, 1.0, vUv.x) * pow(across, 5.0) * uHot;
    a *= uOpacity;
    gl_FragColor = vec4(mix(uTail, uHead, vUv.x) * a, a);
  }
`;

function streakMaterial(head: string, tail: string, sharp = 2.2, hot = 0.8) {
  return new THREE.ShaderMaterial({
    vertexShader: STREAK_VERTEX,
    fragmentShader: STREAK_FRAGMENT,
    uniforms: {
      uHead: { value: new THREE.Color(head) },
      uTail: { value: new THREE.Color(tail) },
      uOpacity: { value: 0 },
      uSharp: { value: sharp },
      uHot: { value: hot },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _m = new THREE.Matrix4();
/** Kuyruktan başa uzanan, kameraya dönük ince şerit. */
function placeStreak(mesh: THREE.Mesh, tail: THREE.Vector3, head: THREE.Vector3, width: number, camera: THREE.Camera) {
  _x.subVectors(head, tail);
  const len = _x.length();
  if (len < 1e-4) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  _x.divideScalar(len);
  mesh.position.addVectors(tail, head).multiplyScalar(0.5);
  _z.subVectors(camera.position, mesh.position).normalize();
  _y.crossVectors(_z, _x).normalize();
  _z.crossVectors(_x, _y);
  _m.makeBasis(_x, _y, _z);
  mesh.quaternion.setFromRotationMatrix(_m);
  mesh.scale.set(len, width, 1);
}

const unit = new THREE.PlaneGeometry(1, 1);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------- Kayan yıldızlar ---------- */

interface Shot {
  active: boolean;
  t: number;
  life: number;
  start: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  length: number;
}

/** Arka plandaki gökyüzünde ara ara kayan yıldızlar. */
export function ShootingStars({ count = 3 }: { count?: number }) {
  const { camera } = useThree();
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const materials = useMemo(() => Array.from({ length: count }, () => streakMaterial('#ffffff', '#9fb8ff', 2.6)), [count]);
  const shots = useMemo<Shot[]>(
    () => Array.from({ length: count }, () => ({ active: false, t: 0, life: 1, start: new THREE.Vector3(), dir: new THREE.Vector3(), speed: 0, length: 0 })),
    [count]
  );
  const wait = useRef(1.5);
  const head = useMemo(() => new THREE.Vector3(), []);
  const tail = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    if (!heroScene.frozen && heroScene.intro > 0.6) {
      wait.current -= delta;
      const free = shots.find((s) => !s.active);
      if (wait.current <= 0 && free) {
        wait.current = rand(1.4, 3.6);
        // Kameranın önündeki uzak bir düzlemde, ekranın üst yarısından çapraz aşağı
        camera.matrixWorld.extractBasis(right, up, fwd);
        fwd.negate();
        const depth = rand(110, 150);
        const half = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)) * depth;
        const side = Math.random() < 0.5 ? -1 : 1;
        free.start
          .copy(camera.position)
          .addScaledVector(fwd, depth)
          .addScaledVector(right, rand(-1, 1) * half * 1.4)
          .addScaledVector(up, rand(0.1, 0.95) * half);
        free.dir.copy(right).multiplyScalar(side * rand(0.6, 1)).addScaledVector(up, -rand(0.35, 0.7)).normalize();
        free.speed = half * rand(1.1, 1.7);
        free.length = half * rand(0.18, 0.32);
        free.life = rand(0.7, 1.1);
        free.t = 0;
        free.active = true;
      }
    }

    shots.forEach((s, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      if (!s.active) {
        mesh.visible = false;
        return;
      }
      s.t += delta;
      const k = s.t / s.life;
      if (k >= 1) {
        s.active = false;
        mesh.visible = false;
        return;
      }
      head.copy(s.start).addScaledVector(s.dir, s.speed * s.t);
      tail.copy(head).addScaledVector(s.dir, -s.length * Math.min(1, k * 3));
      placeStreak(mesh, tail, head, s.length * 0.028, camera);
      materials[i].uniforms.uOpacity.value = Math.sin(Math.PI * k) * 0.95;
    });
  });

  return (
    <>
      {materials.map((m, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          geometry={unit}
          material={m}
          visible={false}
          frustumCulled={false}
        />
      ))}
    </>
  );
}

/* ---------- Gezegenlere düşen meteorlar ---------- */

const TARGETS = ['dunya', 'mars', 'jupiter', 'saturn', 'venus'];
const SPARKS = 18;

/** Ara ara bir gezegene doğru inen meteor; çarpınca parlama, şok halkası ve kıvılcımlar. */
export function MeteorImpacts({ planets }: { planets: React.RefObject<PlanetRegistry> }) {
  const { camera } = useThree();
  const streak = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Mesh>(null);
  const sparks = useRef<THREE.Points>(null);
  const streakMat = useMemo(() => streakMaterial('#fff4dc', '#ff7a2a', 1.8), []);
  const hot = useMemo(() => radialTexture(HOT), []);
  const soft = useMemo(() => radialTexture(SOFT), []);
  const sparkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3));
    return g;
  }, []);
  const sparkVel = useMemo(() => Array.from({ length: SPARKS }, () => new THREE.Vector3()), []);
  const state = useRef({ phase: 'idle' as 'idle' | 'fall' | 'impact', wait: 3.5, t: 0, target: '', radius: 1 });
  const offset = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const head = useMemo(() => new THREE.Vector3(), []);
  const tail = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const FALL = 1.15;
  const IMPACT = 1.1;

  useEffect(
    () => () => {
      streakMat.dispose();
      sparkGeo.dispose();
    },
    [streakMat, sparkGeo]
  );

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    const s = state.current;
    const registry = planets.current;
    const target = registry?.get(s.target);

    if (s.phase === 'idle') {
      if (streak.current) streak.current.visible = false;
      if (heroScene.frozen || heroScene.intro < 0.95 || !registry) return;
      s.wait -= delta;
      if (s.wait > 0) return;
      const pick = TARGETS.filter((id) => registry.has(id));
      if (!pick.length) return;
      s.target = pick[Math.floor(Math.random() * pick.length)];
      s.radius = registry.get(s.target)!.radius;
      // Gezegene kameraya göre üst-yan taraftan, biraz da önden gelsin: çarpma noktası görünür yüzde kalır
      camera.matrixWorld.extractBasis(right, up, fwd);
      const reach = 6 + s.radius * 5;
      offset
        .copy(right)
        .multiplyScalar((Math.random() < 0.5 ? -1 : 1) * reach * rand(0.6, 1))
        .addScaledVector(up, reach * rand(0.55, 0.9))
        .addScaledVector(fwd, reach * rand(0.1, 0.4));
      s.t = 0;
      s.phase = 'fall';
      return;
    }

    if (!target) {
      s.phase = 'idle';
      return;
    }
    target.group.getWorldPosition(center);
    hit.copy(offset).normalize().multiplyScalar(s.radius * 1.01).add(center);
    s.t += delta;

    if (s.phase === 'fall') {
      const k = Math.min(s.t / FALL, 1);
      const eased = k * k;
      head.copy(hit).addScaledVector(offset, 1 - eased);
      tail.copy(head).addScaledVector(offset, 0.3 + 0.3 * k);
      if (streak.current) placeStreak(streak.current, tail, head, 0.09 + s.radius * 0.07, camera);
      streakMat.uniforms.uOpacity.value = Math.min(1, k * 4);
      if (k >= 1) {
        s.phase = 'impact';
        s.t = 0;
        if (streak.current) streak.current.visible = false;
        const arr = sparkGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < SPARKS; i++) {
          sparkVel[i]
            .set(rand(-1, 1), rand(-1, 1), rand(-1, 1))
            .normalize()
            .addScaledVector(offset, 0.9 / offset.length())
            .normalize()
            .multiplyScalar(s.radius * rand(1.2, 2.6));
          arr[i * 3] = hit.x;
          arr[i * 3 + 1] = hit.y;
          arr[i * 3 + 2] = hit.z;
        }
        sparkGeo.attributes.position.needsUpdate = true;
      }
    } else if (s.phase === 'impact') {
      const k = Math.min(s.t / IMPACT, 1);
      const fade = 1 - k;
      if (flash.current) {
        flash.current.visible = true;
        flash.current.position.copy(hit);
        flash.current.scale.setScalar(s.radius * (1.2 + 3.2 * Math.sqrt(k)));
        (flash.current.material as THREE.SpriteMaterial).opacity = Math.pow(fade, 1.6);
      }
      if (ring.current) {
        ring.current.visible = true;
        ring.current.position.copy(hit);
        ring.current.lookAt(camera.position);
        ring.current.scale.setScalar(s.radius * (0.4 + 3.4 * k));
        (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.75 * Math.pow(fade, 1.3);
      }
      if (sparks.current) {
        sparks.current.visible = true;
        const arr = sparkGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < SPARKS; i++) {
          arr[i * 3] += sparkVel[i].x * delta * fade;
          arr[i * 3 + 1] += sparkVel[i].y * delta * fade;
          arr[i * 3 + 2] += sparkVel[i].z * delta * fade;
        }
        sparkGeo.attributes.position.needsUpdate = true;
        (sparks.current.material as THREE.PointsMaterial).opacity = fade;
      }
      if (k >= 1) {
        s.phase = 'idle';
        s.wait = rand(3.5, 7);
        if (flash.current) flash.current.visible = false;
        if (ring.current) ring.current.visible = false;
        if (sparks.current) sparks.current.visible = false;
      }
    }
  });

  return (
    <>
      <mesh ref={streak} geometry={unit} material={streakMat} visible={false} frustumCulled={false} />
      <sprite ref={flash} visible={false}>
        <spriteMaterial map={hot} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <mesh ref={ring} visible={false}>
        <ringGeometry args={[0.92, 1, 64]} />
        <meshBasicMaterial color="#ffd9a8" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <points ref={sparks} geometry={sparkGeo} visible={false} frustumCulled={false}>
        <pointsMaterial map={soft} color="#ffc27a" size={0.28} sizeAttenuation transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}

/* ---------- Kuyruklu yıldız ---------- */

/**
 * Basık bir elips üzerinde Güneş'in yanından geçen kuyruklu yıldız. Hız Kepler'in ikinci yasası gibi
 * Güneş'e yaklaştıkça artar; iyon kuyruğu Güneş'in tersine, toz kuyruğu biraz geriye kıvrık uzanır.
 */
export function Comet({ tilt, a, e, omega, start }: { tilt: THREE.Euler; a: number; e: number; omega: number; start: number }) {
  const { camera } = useThree();
  const ion = useRef<THREE.Mesh>(null);
  const dust = useRef<THREE.Mesh>(null);
  const nucleus = useRef<THREE.Sprite>(null);
  const ionMat = useMemo(() => streakMaterial('#e8f3ff', '#5b8cff', 1.4, 0), []);
  const dustMat = useMemo(() => streakMaterial('#fff1cf', '#c98a3a', 1.2, 0), []);
  const glow = useMemo(() => radialTexture(SOFT), []);
  const hot = useMemo(() => radialTexture(HOT), []);
  const core = useRef<THREE.Sprite>(null);
  const nu = useRef(start);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const prev = useMemo(() => new THREE.Vector3(), []);
  const away = useMemo(() => new THREE.Vector3(), []);
  const vel = useMemo(() => new THREE.Vector3(), []);
  const tailEnd = useMemo(() => new THREE.Vector3(), []);
  const p = a * (1 - e * e);

  useEffect(
    () => () => {
      ionMat.dispose();
      dustMat.dispose();
    },
    [ionMat, dustMat]
  );

  const at = (angle: number, out: THREE.Vector3) => {
    const r = p / (1 + e * Math.cos(angle));
    return out.set(Math.cos(angle + omega) * r, 0, Math.sin(angle + omega) * r).applyEuler(tilt);
  };

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    const r = p / (1 + e * Math.cos(nu.current));
    at(nu.current, prev);
    if (!heroScene.frozen) nu.current += (delta * 16) / (r * r);
    if (nu.current > Math.PI) nu.current -= Math.PI * 2;
    at(nu.current, pos);
    vel.subVectors(pos, prev);

    const show = THREE.MathUtils.clamp(heroScene.intro * 1.5 - 0.5, 0, 1);
    const closeness = THREE.MathUtils.clamp(9 / r, 0.25, 1.6);
    away.copy(pos).normalize();

    if (nucleus.current) {
      nucleus.current.position.copy(pos);
      nucleus.current.scale.setScalar(1.3 + 0.9 * closeness);
      (nucleus.current.material as THREE.SpriteMaterial).opacity = 0.8 * show;
    }
    if (core.current) {
      core.current.position.copy(pos);
      core.current.scale.setScalar(0.45 + 0.25 * closeness);
      (core.current.material as THREE.SpriteMaterial).opacity = show;
    }
    if (ion.current) {
      tailEnd.copy(pos).addScaledVector(away, 10 * closeness + 3);
      placeStreak(ion.current, tailEnd, pos, 0.4 + 0.35 * closeness, camera);
      ionMat.uniforms.uOpacity.value = 0.85 * show;
    }
    if (dust.current && vel.lengthSq() > 1e-10) {
      vel.normalize();
      tailEnd.copy(away).multiplyScalar(0.85).addScaledVector(vel, -0.45).normalize();
      tailEnd.multiplyScalar(7 * closeness + 2).add(pos);
      placeStreak(dust.current, tailEnd, pos, 1 + 0.8 * closeness, camera);
      dustMat.uniforms.uOpacity.value = 0.55 * show;
    }
  });

  return (
    <>
      <mesh ref={dust} geometry={unit} material={dustMat} frustumCulled={false} />
      <mesh ref={ion} geometry={unit} material={ionMat} frustumCulled={false} />
      <sprite ref={nucleus}>
        <spriteMaterial map={glow} color="#cfe2ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={core}>
        <spriteMaterial map={hot} color="#f4f9ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </>
  );
}

/* ---------- Güneş tacı ---------- */

let rayTexture: THREE.CanvasTexture | null = null;
function getRayTexture() {
  if (rayTexture) return rayTexture;
  const size = 512;
  const c = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.globalCompositeOperation = 'lighter';
  // Tohumlu dağılım: ışınlar her yüklemede aynı
  let seed = 11;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2 + r() * 0.05;
    const len = c * (0.45 + r() * 0.55);
    const w = 1 + r() * 3.5;
    const g = ctx.createLinearGradient(c, c, c + Math.cos(a) * len, c + Math.sin(a) * len);
    g.addColorStop(0, `rgba(255,214,150,${0.2 + r() * 0.25})`);
    g.addColorStop(1, 'rgba(255,140,60,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(a) * len, c + Math.sin(a) * len);
    ctx.stroke();
  }
  rayTexture = new THREE.CanvasTexture(canvas);
  rayTexture.colorSpace = THREE.SRGBColorSpace;
  return rayTexture;
}

/** Güneş'in çevresinde ters yönlerde dönen iki ışın katmanı ve nabız gibi atan ışıma. */
export function SunCorona({ radius }: { radius: number }) {
  const a = useRef<THREE.Sprite>(null);
  const b = useRef<THREE.Sprite>(null);
  const tex = useMemo(() => getRayTexture(), []);
  const clock = useRef(0);
  useFrame((_, dt) => {
    if (!heroScene.frozen) clock.current += Math.min(dt, 0.05);
    const t = clock.current;
    const pulse = 1 + Math.sin(t * 1.3) * 0.04 + Math.sin(t * 0.47) * 0.03;
    const intro = heroScene.intro;
    if (a.current) {
      (a.current.material as THREE.SpriteMaterial).rotation = t * 0.035;
      a.current.scale.setScalar(radius * 5.4 * pulse * Math.max(intro, 0.001));
      (a.current.material as THREE.SpriteMaterial).opacity = 0.55 * intro;
    }
    if (b.current) {
      (b.current.material as THREE.SpriteMaterial).rotation = -t * 0.022 + 1.3;
      b.current.scale.setScalar(radius * 4.2 * (2 - pulse) * Math.max(intro, 0.001));
      (b.current.material as THREE.SpriteMaterial).opacity = 0.45 * intro;
    }
  });
  return (
    <>
      <sprite ref={a} renderOrder={-2}>
        <spriteMaterial map={tex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={b} renderOrder={-2}>
        <spriteMaterial map={tex} color="#ffd08a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </>
  );
}

/* ---------- Ön plan tozu ---------- */

/** Kameraya yakın, yavaşça süzülen sıcak toz: sahneye derinlik katar. */
const DUST_SPREAD: [number, number, number] = [26, 10, 9];
const DUST_CENTER: [number, number, number] = [0, 1, 22];

export function ForegroundDust({ count = 140, spread = DUST_SPREAD, center = DUST_CENTER }: { count?: number; spread?: [number, number, number]; center?: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(() => radialTexture(SOFT), []);
  const geometry = useMemo(() => {
    let seed = 3;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = center[0] + r() * spread[0];
      pos[i * 3 + 1] = center[1] + r() * spread[1];
      pos[i * 3 + 2] = center[2] + r() * spread[2];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, spread, center]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const clock = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!heroScene.frozen) clock.current += Math.min(dt, 0.05);
    const t = clock.current;
    ref.current.position.set(Math.sin(t * 0.07) * 1.2, Math.sin(t * 0.11) * 0.5, 0);
    (ref.current.material as THREE.PointsMaterial).opacity = 0.32 * heroScene.intro;
  });
  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial map={tex} color="#ffd9a6" size={0.32} sizeAttenuation transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
