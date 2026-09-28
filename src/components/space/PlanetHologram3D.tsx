'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  createSunTexture,
  createEarthTexture,
  createJupiterTexture,
  createSaturnRingTexture,
  createMarsTexture
} from './textures';

interface PlanetHologramProps {
  id: string;
}

function HologramMesh({ id }: { id: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthTextures = useMemo(() => (id === 'dunya' ? createEarthTexture() : null), [id]);
  const jupiterTexture = useMemo(() => (id === 'jupiter' ? createJupiterTexture() : null), [id]);
  const marsTexture = useMemo(() => (id === 'mars' ? createMarsTexture() : null), [id]);
  const saturnRingTexture = useMemo(() => (id === 'saturn' ? createSaturnRingTexture() : null), [id]);
  const sunTexture = useMemo(() => (id === 'gunes' ? createSunTexture() : null), [id]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.25;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.05;
  });

  // SUN
  if (id === 'gunes') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshBasicMaterial map={sunTexture || undefined} />
        </mesh>
        <mesh scale={1.12}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    );
  }

  // EARTH
  if (id === 'dunya') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.2, 64, 64]} />
          <meshStandardMaterial
            map={earthTextures?.map}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.23, 64, 64]} />
          <meshStandardMaterial
            map={earthTextures?.clouds}
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh scale={1.06}>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    );
  }

  // SATURN
  if (id === 'saturn') {
    return (
      <group rotation={[0.4, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshStandardMaterial color="#e2c58a" roughness={0.7} />
        </mesh>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.7, 5.0, 64]} />
          <meshStandardMaterial
            map={saturnRingTexture || undefined}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    );
  }

  // JUPITER
  if (id === 'jupiter') {
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial map={jupiterTexture || undefined} roughness={0.6} />
      </mesh>
    );
  }

  // MARS
  if (id === 'mars') {
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial map={marsTexture || undefined} roughness={0.8} />
      </mesh>
    );
  }

  // OTHER / DEFAULT CELESTIAL BODY
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.0, 64, 64]} />
      <meshStandardMaterial
        color={
          id === 'venus'
            ? '#e3bb7b'
            : id === 'merkur'
            ? '#8a8a9a'
            : id === 'uranus'
            ? '#4b9cd3'
            : id === 'neptun'
            ? '#274687'
            : id === 'ay'
            ? '#b0b5bc'
            : '#708090'
        }
        roughness={0.7}
      />
    </mesh>
  );
}

export function PlanetHologram3D({ id }: PlanetHologramProps) {
  return (
    <div className="relative h-72 sm:h-96 w-full rounded-3xl border border-primary/20 bg-background/40 backdrop-blur-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)]">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} />
        <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#00d4ff" />

        <HologramMesh id={id} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minDistance={3.5}
          maxDistance={10}
        />
      </Canvas>

      {/* Hologram Overlay Accents */}
      <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        <span className="font-mono text-[10px] tracking-widest text-primary uppercase">
          3D HOLOGRAM TARAMASI • ETKİLEŞİMLİ
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono text-text-secondary">
        🖱️ 360° Döndürmek için sürükleyin
      </div>
    </div>
  );
}
