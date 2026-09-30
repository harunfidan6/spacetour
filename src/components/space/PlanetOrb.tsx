'use client';

import dynamic from 'next/dynamic';
import { useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { View, PerspectiveCamera } from '@react-three/drei';
import type * as THREE from 'three';
import { planetVisual } from './planetVisuals';
import { PlanetBody } from './PlanetBody';

const FOV = 30;
const HALF_TAN = Math.tan(((FOV / 2) * Math.PI) / 180);

/**
 * The shared canvas paints over the page, so an orb must disappear whenever
 * its DOM slot is hidden (e.g. faded out by GSAP) — otherwise it floats alone.
 */
function FollowSlotVisibility({ slot, children }: { slot: RefObject<HTMLElement | null>; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const el = slot.current;
    if (!group.current || !el) return;
    try {
      group.current.visible = el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
    } catch {
      group.current.visible = true;
    }
  });
  return <group ref={group}>{children}</group>;
}

function OrbView({ distance, children, className }: { distance: number; children: ReactNode; className: string }) {
  const slot = useRef<HTMLElement>(null);
  return (
    <View ref={slot} className={className}>
      <PerspectiveCamera makeDefault position={[0, 0, distance]} fov={FOV} />
      <FollowSlotVisibility slot={slot}>{children}</FollowSlotVisibility>
    </View>
  );
}

/**
 * A small live 3D planet that sits in normal page flow. It renders through the
 * page's shared <OrbCanvas /> (one WebGL context for every orb on the page);
 * without that canvas the CSS placeholder disc is shown instead.
 */
export function PlanetOrb({ id, className = '', spin = 1 }: { id: string; className?: string; spin?: number }) {
  const v = planetVisual(id);
  // Frame the body (or body + ring) at ~90% of the slot.
  const extent = v.ring ? v.ring.outer * 1.02 : 1;
  const distance = extent / (HALF_TAN * 0.9);
  const bodyShare = 1 / (distance * HALF_TAN); // body diameter as a fraction of the slot
  const inset = `${((1 - bodyShare) / 2) * 100}%`;

  return (
    <div className={`relative shrink-0 ${className}`}>
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{ inset, background: `radial-gradient(circle at 35% 30%, ${v.color}, #000 78%)`, boxShadow: v.emissive ? `0 0 24px ${v.color}` : undefined }}
      />
      <OrbView distance={distance} className="absolute inset-0">
        <ambientLight intensity={0.18} />
        <directionalLight position={[-4, 2, 3]} intensity={3} />
        <PlanetBody id={id} spin={spin} glow={false} />
      </OrbView>
    </div>
  );
}

/** Shared fixed canvas that paints every <PlanetOrb /> on the page. */
export const OrbCanvas = dynamic(() => import('./OrbCanvasImpl').then((m) => m.OrbCanvasImpl), { ssr: false });

/**
 * The Moon lit for a given synodic phase (0 → new, 0.5 → full), as seen from
 * the northern hemisphere: waxing light comes from the right.
 */
export function MoonOrb({ fraction, className = '' }: { fraction: number; className?: string }) {
  const theta = fraction * Math.PI * 2;
  const distance = 1 / (HALF_TAN * 0.9);
  return (
    <div className={`relative shrink-0 ${className}`}>
      <span aria-hidden className="absolute inset-[5%] rounded-full bg-ink-3" />
      <OrbView distance={distance} className="absolute inset-0">
        <ambientLight intensity={0.03} />
        <directionalLight position={[Math.sin(theta) * 5, 0.4, -Math.cos(theta) * 5]} intensity={3.2} />
        <PlanetBody id="ay" spin={0.4} glow={false} />
      </OrbView>
    </div>
  );
}
