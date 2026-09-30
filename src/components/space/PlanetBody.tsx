'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadNasaTexture } from './nasaTextures';
import { planetVisual } from './planetVisuals';

/** Cached NASA texture plus a flag that flips once its image has arrived. */
function useNasaTexture(url?: string) {
  const tex = useMemo(() => (url ? loadNasaTexture(url) : null), [url]);
  const [ready, setReady] = useState(() => Boolean(tex?.image));
  useFrame(() => {
    if (!ready && tex?.image) setReady(true);
  });
  return ready ? tex : null;
}

let glowTexture: THREE.CanvasTexture | null = null;
function getGlowTexture() {
  if (glowTexture || typeof document === 'undefined') return glowTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,220,170,0.85)');
  g.addColorStop(0.42, 'rgba(255,120,40,0.28)');
  g.addColorStop(1, 'rgba(255,90,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}

/** Additive halo sprite for self-lit bodies. */
export function SunGlow({ radius = 1, strength = 1 }: { radius?: number; strength?: number }) {
  const tex = useMemo(() => getGlowTexture(), []);
  return (
    <sprite scale={[radius * 5.2, radius * 5.2, 1]} renderOrder={-1}>
      <spriteMaterial map={tex} color="#ffb070" transparent opacity={0.9 * strength} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
}

function PlanetRing({ inner, outer, map, alpha, opacity }: { inner: number; outer: number; map: string; alpha?: string; opacity: number }) {
  // Remap UVs so u runs radially — ring textures are 1-D radial strips.
  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(inner, outer, 160, 1);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [inner, outer]);
  const tex = useNasaTexture(map);
  const alphaTex = useNasaTexture(alpha);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        key={`${tex ? 't' : 'p'}${alphaTex ? 'a' : ''}`}
        map={tex}
        alphaMap={alphaTex}
        color={tex ? '#ffffff' : '#c9b187'}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

/**
 * A textured, spinning planet (or the Sun) built from the shared NASA maps.
 * Radius is in scene units; rings scale with it.
 */
export function PlanetBody({
  id,
  radius = 1,
  spin = 1,
  detail = 64,
  glow = true,
}: {
  id: string;
  radius?: number;
  spin?: number;
  detail?: number;
  glow?: boolean;
}) {
  const v = planetVisual(id);
  const body = useRef<THREE.Mesh>(null);
  const map = useNasaTexture(v.map);

  useFrame((_, delta) => {
    if (body.current) body.current.rotation.y += delta * v.spin * spin;
  });

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(v.tilt)]}>
      <mesh ref={body}>
        <sphereGeometry args={[radius, detail, detail]} />
        {v.emissive ? (
          <meshBasicMaterial key={map ? 't' : 'p'} map={map} color={map ? '#ffa45c' : v.color} toneMapped={false} />
        ) : (
          <meshStandardMaterial key={map ? 't' : 'p'} map={map} color={map ? (v.tint ?? '#ffffff') : v.color} roughness={0.92} metalness={0} />
        )}
      </mesh>
      {v.atmosphere && (
        <mesh scale={1.045}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial color={v.atmosphere} transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      {v.ring && <PlanetRing inner={v.ring.inner * radius} outer={v.ring.outer * radius} map={v.ring.map} alpha={v.ring.alpha} opacity={v.ring.opacity} />}
      {v.emissive && glow && <SunGlow radius={radius} />}
    </group>
  );
}
