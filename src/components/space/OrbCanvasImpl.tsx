'use client';

import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

/**
 * Fixed, click-through canvas that renders all <PlanetOrb /> views into their
 * DOM slots (scissored), so a page with many planets uses one WebGL context.
 */
export function OrbCanvasImpl() {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 15 }}
    >
      <View.Port />
    </Canvas>
  );
}
