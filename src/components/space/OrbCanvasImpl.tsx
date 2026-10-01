'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { View } from '@react-three/drei';

/**
 * Views only draw while their slot is on screen. When every orb has scrolled
 * away nothing is drawn, the browser keeps presenting the last frame, and an
 * orb lingers frozen over the page. Clearing first (priority 0 runs before the
 * views) guarantees each frame starts from an empty canvas.
 */
function ClearEachFrame() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true, false);
  }, 0);
  return null;
}

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
      <ClearEachFrame />
      <View.Port />
    </Canvas>
  );
}
