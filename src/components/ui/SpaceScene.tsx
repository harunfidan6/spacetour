// src/components/ui/SpaceScene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, OrbitControls, Html } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function SpaceScene() {
  const [isMobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 12], fov: 55 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      {/* Derin uzay fonu */}
      <color attach="background" args={['#060612']} />
      {/* Yıldızlar - yüksek performanslı parçacık */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      {/* Nebula / gaz bulutları – sparkles */}
      <Sparkles size={1} scale={[30, 30, 30]} speed={0.2} color="#ff6b35" opacity={0.6} />
      {/* Kamera kontrolü – scroll ile ileri/geri hareket */}
      <OrbitControls
        enableZoom={!isMobile}
        enablePan={false}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2}
        makeDefault
      />
      {/* Merkezde ufak bir bilgi */}
      <Html center>
        <p className="text-sm text-primary/80">🎮 Kaydır, yaklaştır, keşfet</p>
      </Html>
    </Canvas>
  );
}
