'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  NASA_TEXTURES,
  loadNasaTexture
} from './nasaTextures';
import {
  createSunTexture,
  createEarthTexture,
  createJupiterTexture,
  createSaturnRingTexture,
  createMarsTexture,
  createSaturnTexture,
  createMercuryTexture,
  createVenusTexture,
  createMoonTexture,
  createUranusTexture,
  createNeptuneTexture,
  createPlutoTexture
} from './textures';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Eye,
  Maximize2
} from 'lucide-react';

interface PlanetHologramProps {
  id: string;
}

function HologramMesh({
  id,
  isWireframe,
  showAtmosphere,
  isPaused
}: {
  id: string;
  isWireframe: boolean;
  showAtmosphere: boolean;
  isPaused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [cloudsTexture, setCloudsTexture] = useState<THREE.Texture | null>(null);
  const [ringTexture, setRingTexture] = useState<THREE.Texture | null>(null);

  // Initialize NASA texture with instant procedural fallback
  useEffect(() => {
    let baseTex: THREE.Texture | null = null;
    let cloudTex: THREE.Texture | null = null;
    let rTex: THREE.Texture | null = null;

    if (id === 'gunes') {
      baseTex = loadNasaTexture(NASA_TEXTURES.sun) || createSunTexture();
    } else if (id === 'merkur') {
      baseTex = loadNasaTexture(NASA_TEXTURES.mercury) || createMercuryTexture();
    } else if (id === 'venus') {
      baseTex = loadNasaTexture(NASA_TEXTURES.venus) || createVenusTexture();
      cloudTex = loadNasaTexture(NASA_TEXTURES.venusAtmosphere);
    } else if (id === 'dunya') {
      const pEarth = createEarthTexture();
      baseTex = loadNasaTexture(NASA_TEXTURES.earthMap) || pEarth.map;
      cloudTex = loadNasaTexture(NASA_TEXTURES.earthClouds) || pEarth.clouds;
    } else if (id === 'ay') {
      baseTex = loadNasaTexture(NASA_TEXTURES.moon) || createMoonTexture();
    } else if (id === 'mars') {
      baseTex = loadNasaTexture(NASA_TEXTURES.mars) || createMarsTexture();
    } else if (id === 'jupiter') {
      baseTex = loadNasaTexture(NASA_TEXTURES.jupiter) || createJupiterTexture();
    } else if (id === 'saturn') {
      baseTex = loadNasaTexture(NASA_TEXTURES.saturn) || createSaturnTexture();
      rTex = loadNasaTexture(NASA_TEXTURES.saturnRing) || createSaturnRingTexture();
    } else if (id === 'uranus') {
      baseTex = loadNasaTexture(NASA_TEXTURES.uranus) || createUranusTexture();
      rTex = loadNasaTexture(NASA_TEXTURES.uranusRing);
    } else if (id === 'neptun') {
      baseTex = loadNasaTexture(NASA_TEXTURES.neptune) || createNeptuneTexture();
    } else if (id === 'pluto' || id === 'cuce-gezegen') {
      baseTex = loadNasaTexture(NASA_TEXTURES.pluto) || createPlutoTexture();
    } else {
      baseTex = createMercuryTexture();
    }

    setTexture(baseTex);
    if (cloudTex) setCloudsTexture(cloudTex);
    if (rTex) setRingTexture(rTex);
  }, [id]);

  useFrame((_, delta) => {
    if (isPaused) return;
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.22;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.28;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.05;
    if (atmosphereRef.current && id === 'gunes') {
      const s = 1.08 + Math.sin(Date.now() * 0.002) * 0.02;
      atmosphereRef.current.scale.set(s, s, s);
    }
  });

  // 1. THE SUN
  if (id === 'gunes') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshBasicMaterial map={texture || undefined} wireframe={isWireframe} />
        </mesh>
        {showAtmosphere && (
          <mesh ref={atmosphereRef} scale={1.12}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshBasicMaterial
              color="#ff7700"
              transparent
              opacity={0.35}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 2. EARTH
  if (id === 'dunya') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.2, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.65}
            metalness={0.1}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && cloudsTexture && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.23, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
        {showAtmosphere && (
          <mesh scale={1.06}>
            <sphereGeometry args={[2.2, 32, 32]} />
            <meshBasicMaterial
              color="#00aaff"
              transparent
              opacity={0.25}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 3. SATURN
  if (id === 'saturn') {
    return (
      <group rotation={[0.42, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.7}
            wireframe={isWireframe}
          />
        </mesh>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.6, 5.2, 64]} />
          <meshStandardMaterial
            map={ringTexture || undefined}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
            roughness={0.5}
          />
        </mesh>
      </group>
    );
  }

  // 4. URANUS (Tilted with Ring)
  if (id === 'uranus') {
    return (
      <group rotation={[1.4, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.1, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.6}
            wireframe={isWireframe}
          />
        </mesh>
        {ringTexture && (
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.6, 64]} />
            <meshStandardMaterial
              map={ringTexture}
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>
        )}
        {showAtmosphere && (
          <mesh scale={1.05}>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial
              color="#5ae5ff"
              transparent
              opacity={0.2}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 5. VENUS (Atmosphere Glow)
  if (id === 'venus') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.1, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.7}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && (
          <mesh scale={1.05}>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial
              color="#e6be79"
              transparent
              opacity={0.25}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 6. NEPTUNE (Atmosphere Glow)
  if (id === 'neptun') {
    return (
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.1, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.6}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && (
          <mesh scale={1.06}>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial
              color="#2a52be"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 7. MARS, JUPITER, MERCURY, MOON, PLUTO & OTHERS
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.1, 64, 64]} />
      <meshStandardMaterial
        map={texture || undefined}
        roughness={id === 'merkur' || id === 'ay' ? 0.9 : 0.65}
        metalness={id === 'merkur' ? 0.2 : 0.05}
        wireframe={isWireframe}
      />
    </mesh>
  );
}

export function PlanetHologram3D({ id }: PlanetHologramProps) {
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showAtmosphere, setShowAtmosphere] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  return (
    <div className="relative h-80 sm:h-[420px] w-full rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 1.2, 5.8], fov: 45 }}>
        <ambientLight intensity={0.55} />
        {/* Main Sun Key Light */}
        <directionalLight position={[6, 3, 5]} intensity={2.8} color="#fff8e7" />
        {/* Fill Rim Light */}
        <directionalLight position={[-6, -2, -4]} intensity={0.6} color="#00d4ff" />

        <HologramMesh
          id={id}
          isWireframe={isWireframe}
          showAtmosphere={showAtmosphere}
          isPaused={isPaused}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!isPaused}
          autoRotateSpeed={0.7}
          minDistance={3.2}
          maxDistance={9.5}
        />
      </Canvas>

      {/* Top Hologram Telemetry Visor */}
      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-[10px] tracking-widest text-cyan-300 font-bold uppercase">
          NASA FOTOGERÇEKÇİ 3D HOLOGRAM • 360° ETKİLEŞİMLİ
        </span>
      </div>

      {/* Interactive Control Pill Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 text-xs font-mono">
        <button
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? 'Döndürmeyi Başlat' : 'Döndürmeyi Duraklat'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isPaused ? 'bg-amber-400 text-black' : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          title="3D Tel Kafes (Wireframe) Modu"
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isWireframe ? 'bg-cyan-400 text-black' : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers size={13} />
        </button>

        <button
          onClick={() => setShowAtmosphere(!showAtmosphere)}
          title="Atmosfer & Saçılma Efektini Aç/Kapat"
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            showAtmosphere ? 'bg-purple-400 text-black' : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles size={13} />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <span className="flex items-center gap-1">
          <Eye size={12} className="text-cyan-400" />
          <span>Sol tuş ile döndürün • Tekerlek ile yakınlaşın</span>
        </span>
        <span className="text-neutral-500 hidden sm:inline">
          USGS / NASA Planetary Science Division
        </span>
      </div>
    </div>
  );
}
