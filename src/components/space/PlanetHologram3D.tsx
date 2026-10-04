'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useInView } from '@/lib/useInView';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  NASA_TEXTURES,
  loadNasaTexture
} from './nasaTextures';
import { Ticks } from '@/components/motion/primitives';
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
  Play,
  Pause,
  Layers,
  Sparkles,
  Eye,
  Compass
} from 'lucide-react';

export const PLANET_AXIAL_TILTS: Record<string, number> = {
  gunes: 7.25,
  merkur: 0.034,
  venus: 177.36,
  dunya: 23.44,
  ay: 1.54,
  mars: 25.19,
  jupiter: 3.13,
  saturn: 26.73,
  uranus: 97.77,
  neptun: 28.32,
  pluton: 122.53,
};

interface PlanetHologramProps {
  id: string;
}

function HologramMesh({
  id,
  isWireframe,
  showAtmosphere,
  isPaused,
  isTilted
}: {
  id: string;
  isWireframe: boolean;
  showAtmosphere: boolean;
  isPaused: boolean;
  isTilted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // NASA map per body with an instant procedural fallback; re-derived whenever
  // the body changes so clouds/rings never leak from the previous planet.
  const { texture, cloudsTexture, ringTexture } = useMemo(() => {
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
    } else if (id === 'pluton') {
      // No public Pluto map in the texture set: tinted procedural surface.
      baseTex = createPlutoTexture();
    } else {
      baseTex = createMercuryTexture();
    }

    return { texture: baseTex, cloudsTexture: cloudTex, ringTexture: rTex };
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

  const tiltAngle = isTilted ? (((PLANET_AXIAL_TILTS[id] ?? 0) * Math.PI) / 180) : 0;

  // 1. THE SUN
  if (id === 'gunes') {
    return (
      <group rotation={[tiltAngle, 0, 0]}>
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
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.2, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.45}
            metalness={0.15}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && cloudsTexture && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.23, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
        {showAtmosphere && (
          <mesh scale={1.06}>
            <sphereGeometry args={[2.2, 32, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
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

  // Concentric Radial Ring Geometries (remaps UVs so textures wrap around circularly)
  const saturnRingGeometry = useMemo(() => {
    const inner = 2.22;
    const outer = 5.2;
    const g = new THREE.RingGeometry(inner, outer, 128);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    return g;
  }, []);

  const uranusRingGeometry = useMemo(() => {
    const inner = 2.45;
    const outer = 3.6;
    const g = new THREE.RingGeometry(inner, outer, 96);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    return g;
  }, []);

  // 3. SATURN
  if (id === 'saturn') {
    return (
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.0, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.7}
            wireframe={isWireframe}
          />
        </mesh>
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} geometry={saturnRingGeometry}>
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
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.1, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.6}
            wireframe={isWireframe}
          />
        </mesh>
        {ringTexture && (
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} geometry={uranusRingGeometry}>
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
      <group rotation={[tiltAngle, 0, 0]}>
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
      <group rotation={[tiltAngle, 0, 0]}>
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

  // 7. MARS (Dusty Atmosphere Glow)
  if (id === 'mars') {
    return (
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.1, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.75}
            metalness={0.08}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && (
          <mesh scale={1.04}>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial
              color="#d1603d"
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

  // 8. JUPITER (Gas Giant Haze)
  if (id === 'jupiter') {
    return (
      <group rotation={[tiltAngle, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2.3, 64, 64]} />
          <meshStandardMaterial
            map={texture || undefined}
            roughness={0.55}
            wireframe={isWireframe}
          />
        </mesh>
        {showAtmosphere && (
          <mesh scale={1.03}>
            <sphereGeometry args={[2.3, 32, 32]} />
            <meshBasicMaterial
              color="#e3a857"
              transparent
              opacity={0.16}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    );
  }

  // 9. MERCURY, MOON, PLUTO & OTHERS
  return (
    <group rotation={[tiltAngle, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          roughness={id === 'merkur' || id === 'ay' ? 0.9 : 0.65}
          metalness={id === 'merkur' ? 0.2 : 0.05}
          wireframe={isWireframe}
        />
      </mesh>
    </group>
  );
}

export function PlanetHologram3D({ id }: PlanetHologramProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showAtmosphere, setShowAtmosphere] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTilted, setIsTilted] = useState<boolean>(true);

  return (
    <div ref={stageRef} className="relative ticks h-80 sm:h-[420px] w-full border border-line bg-ink overflow-hidden">
      <Ticks />

      {/* 3D WebGL Canvas */}
      <Canvas
        frameloop={stageVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.2, 5.8], fov: 45 }}
      >
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
          isTilted={isTilted}
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
      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 max-w-[190px] sm:max-w-none">
        <span className="h-2 w-2 shrink-0 bg-solar animate-ping" />
        <span className="font-mono text-[10px] tracking-widest text-solar font-bold uppercase truncate">
          NASA FOTOGERÇEKÇİ 3D HOLOGRAM · 360° ETKİLEŞİMLİ
        </span>
      </div>

      {/* Interactive Control Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-ink/90 border border-line p-1 text-xs font-mono">
        <button type="button" aria-label={isPaused ? 'Döndürmeyi başlat' : 'Döndürmeyi duraklat'}
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? 'Döndürmeyi Başlat' : 'Döndürmeyi Duraklat'}
          className={`p-1.5 transition-colors cursor-pointer border ${
            isPaused
              ? 'border-solar bg-solar text-ink font-bold'
              : 'border-transparent text-muted hover:text-paper'
          }`}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
        </button>

        <button type="button" aria-label="Eksen eğikliği modu" aria-pressed={isTilted}
          onClick={() => setIsTilted(!isTilted)}
          title={`Eksen Eğikliği (${PLANET_AXIAL_TILTS[id] ?? 0}°): ${isTilted ? 'Açık' : 'Kapalı'}`}
          className={`p-1.5 transition-colors cursor-pointer border ${
            isTilted
              ? 'border-gold bg-gold text-ink font-bold'
              : 'border-transparent text-muted hover:text-paper'
          }`}
        >
          <Compass size={13} />
        </button>

        <button type="button" aria-label="Tel kafes (wireframe) modu" aria-pressed={isWireframe}
          onClick={() => setIsWireframe(!isWireframe)}
          title="3D Tel Kafes (Wireframe) Modu"
          className={`p-1.5 transition-colors cursor-pointer border ${
            isWireframe
              ? 'border-solar bg-solar text-ink font-bold'
              : 'border-transparent text-muted hover:text-paper'
          }`}
        >
          <Layers size={13} />
        </button>

        <button type="button" aria-label="Atmosfer efekti" aria-pressed={showAtmosphere}
          onClick={() => setShowAtmosphere(!showAtmosphere)}
          title="Atmosfer & Saçılma Efektini Aç/Kapat"
          className={`p-1.5 transition-colors cursor-pointer border ${
            showAtmosphere
              ? 'border-violet bg-violet text-ink font-bold'
              : 'border-transparent text-muted hover:text-paper'
          }`}
        >
          <Sparkles size={13} />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <Eye size={12} className="text-solar" />
          <span>Sol tuş ile döndürün · Tekerlek ile yakınlaşın</span>
        </span>
        <span className="hidden sm:inline uppercase tracking-wider">
          USGS / NASA Planetary Science Division
        </span>
      </div>
    </div>
  );
}
