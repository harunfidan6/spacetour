'use client';

import { useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { View, PerspectiveCamera } from '@react-three/drei';
import type * as THREE from 'three';
import { PlanetBody } from './PlanetBody';

// PlanetOrb / MoonOrb'un three.js kısmı: sayfa boşa çıkınca ayrı bir parça olarak yüklenir

const FOV = 30;

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

/** Gezegen küresinin 3D görünümü (PlanetOrb'un içinde, yer tutucu diskin üstünde çizilir) */
export function PlanetOrbView({ id, spin, distance }: { id: string; spin: number; distance: number }) {
  return (
    <OrbView distance={distance} className="absolute inset-0">
      <ambientLight intensity={0.18} />
      <directionalLight position={[-4, 2, 3]} intensity={3} />
      <PlanetBody id={id} spin={spin} glow={false} />
    </OrbView>
  );
}

/** Ay'ın verilen evrede aydınlatılmış 3D görünümü */
export function MoonOrbView({ fraction, distance }: { fraction: number; distance: number }) {
  const theta = fraction * Math.PI * 2;
  return (
    <OrbView distance={distance} className="absolute inset-0">
      {/* Ay ışıltısı: hilal günlerinde karanlık yüz de seçilsin */}
      <ambientLight intensity={0.14} />
      <directionalLight position={[Math.sin(theta) * 5, 0.4, -Math.cos(theta) * 5]} intensity={3.2} />
      <PlanetBody id="ay" spin={0.4} glow={false} />
    </OrbView>
  );
}
