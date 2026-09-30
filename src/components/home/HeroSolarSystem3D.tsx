'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Line2 } from 'three-stdlib';
import { PlanetBody } from '@/components/space/PlanetBody';

/** Mutable state shared with the DOM hero (GSAP writes, the render loop reads). */
interface HeroSceneState {
  /** 0 → 1 entrance */
  intro: number;
  /** 0 → 1 scroll fly-in toward the Sun */
  scroll: number;
  /** pointer, -0.5 … 0.5 */
  px: number;
  py: number;
  /** freeze orbital motion (reduced motion) */
  frozen: boolean;
}

/** Only one hero is mounted at a time, so a module-level store is enough. */
export const heroScene: HeroSceneState = { intro: 0, scroll: 0, px: 0, py: 0, frozen: false };

export function resetHeroScene() {
  Object.assign(heroScene, { intro: 0, scroll: 0, px: 0, py: 0, frozen: false });
}

/** Receives each planet's screen position so the DOM can pin its label. */
export type LabelProjector = (index: number, x: number, y: number, alpha: number) => void;

export const HERO_BODIES = [
  { id: 'merkur', name: 'Merkür', au: '0.39 AU', dist: 5.4, r: 0.3, period: 9, phase: 0.15 },
  { id: 'venus', name: 'Venüs', au: '0.72 AU', dist: 7.3, r: 0.52, period: 13, phase: 0.62 },
  { id: 'dunya', name: 'Dünya', au: '1.00 AU', dist: 9.4, r: 0.56, period: 18, phase: 0.02 },
  { id: 'mars', name: 'Mars', au: '1.52 AU', dist: 11.5, r: 0.42, period: 25, phase: 0.4 },
  { id: 'jupiter', name: 'Jüpiter', au: '5.20 AU', dist: 15.2, r: 1.4, period: 40, phase: 0.78 },
  { id: 'saturn', name: 'Satürn', au: '9.58 AU', dist: 19.6, r: 1.1, period: 58, phase: 0.93 },
] as const;

const SUN_R = 2.5;
const BASE_CAM = new THREE.Vector3(0, 11, 42);
const LOOK = new THREE.Vector3(0, 2.4, 0);
const FLY_CAM = new THREE.Vector3(0, 0.25, SUN_R + 0.9);

function circlePoints(radius: number, segments = 160) {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
}

/** Tick dial around the Sun — the motion-graphics signature, now in 3D. */
function SunDial() {
  const state = heroScene;
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const r0 = SUN_R * 1.75;
      const r1 = r0 + (i % 10 === 0 ? 0.55 : 0.22);
      pts.push(Math.cos(a) * r0, 0, Math.sin(a) * r0, Math.cos(a) * r1, 0, Math.sin(a) * r1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!state.frozen) ref.current.rotation.y -= delta * 0.08;
    (ref.current.material as THREE.LineBasicMaterial).opacity = 0.45 * state.intro * (1 - state.scroll);
  });
  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#efece6" transparent opacity={0} depthWrite={false} />
    </lineSegments>
  );
}

function Orbiter({ body, index, project }: { body: (typeof HERO_BODIES)[number]; index: number; project: LabelProjector }) {
  const state = heroScene;
  const group = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const orbit = useRef<Line2>(null);
  const clock = useRef(body.phase * body.period);
  const points = useMemo(() => circlePoints(body.dist), [body.dist]);
  const projected = useRef(new THREE.Vector3());
  const { camera, size } = useThree();

  useFrame((_, delta) => {
    if (!state.frozen) clock.current += delta;
    const a = (clock.current / body.period) * Math.PI * 2;
    const g = group.current;
    if (!g) return;
    g.position.set(Math.cos(a) * body.dist, 0, Math.sin(a) * body.dist);
    const appear = THREE.MathUtils.clamp((state.intro - 0.25 - index * 0.06) / 0.5, 0, 1);
    g.scale.setScalar(Math.max(appear, 0.0001));
    if (moon.current) moon.current.rotation.y += delta * (state.frozen ? 0 : 1.6);

    const mat = orbit.current?.material;
    if (mat) mat.opacity = 0.22 * THREE.MathUtils.clamp(state.intro * 1.4 - index * 0.08, 0, 1) * (1 - state.scroll);

    // Hand the screen position to the DOM label
    const p = g.getWorldPosition(projected.current).project(camera);
    const visible = p.z < 1 && appear > 0.9 && state.scroll < 0.35;
    project(index, (p.x * 0.5 + 0.5) * size.width, (-p.y * 0.5 + 0.5) * size.height, visible ? 0.8 * (1 - state.scroll / 0.35) : 0);
  });

  return (
    <>
      <Line ref={orbit} points={points} color="#efece6" lineWidth={1} transparent opacity={0} depthWrite={false} />
      <group ref={group}>
        <PlanetBody id={body.id} radius={body.r} detail={body.r > 1 ? 64 : 40} spin={2} />
        {body.id === 'dunya' && (
          <group ref={moon}>
            <group position={[body.r + 0.55, 0.1, 0]}>
              <PlanetBody id="ay" radius={0.15} detail={24} />
            </group>
          </group>
        )}
      </group>
    </>
  );
}

function Rig() {
  const state = heroScene;
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const smooth = useRef({ px: 0, py: 0 });

  useFrame(() => {
    const s = smooth.current;
    s.px += (state.px - s.px) * 0.04;
    s.py += (state.py - s.py) * 0.04;
    // Portrait screens pull back so the inner system still fits.
    const aspect = size.width / size.height;
    const pullback = THREE.MathUtils.clamp(1.25 / aspect, 1, 1.9);
    const fly = THREE.MathUtils.smootherstep(state.scroll, 0, 1);

    const t = target.current.copy(BASE_CAM).multiplyScalar(pullback);
    t.x += s.px * 3;
    t.y -= s.py * 2;
    t.lerp(FLY_CAM, fly);
    camera.position.copy(t);
    camera.lookAt(look.current.copy(LOOK).multiplyScalar(1 - fly));
  });
  return null;
}

function Scene({ project }: { project: LabelProjector }) {
  const state = heroScene;
  const sun = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!sun.current) return;
    // Elastic-ish pop driven by the intro tween
    sun.current.scale.setScalar(Math.max(state.intro, 0.0001));
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={3.4} decay={0} color="#fff1dc" />
      {/* Soft camera-side fill so night hemispheres read as planets, not holes */}
      <directionalLight position={[-6, 10, 30]} intensity={0.55} color="#b9c6ff" />
      <group rotation={[0, 0, -0.06]}>
        <group ref={sun}>
          <PlanetBody id="gunes" radius={SUN_R} detail={96} spin={0.6} />
        </group>
        <SunDial />
        {HERO_BODIES.map((b, i) => (
          <Orbiter key={b.id} body={b} index={i} project={project} />
        ))}
      </group>
      <Rig />
    </>
  );
}

export function HeroSolarSystem3D({ project, active }: { project: LabelProjector; active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: BASE_CAM.toArray(), fov: 34, near: 0.1, far: 400 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene project={project} />
    </Canvas>
  );
}
