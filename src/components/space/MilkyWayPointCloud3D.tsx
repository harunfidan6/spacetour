'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  MapPin,
  Play,
  Pause,
  Layers,
  Disc
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useInView } from '@/lib/useInView';
import { seededRandom } from '@/lib/random';

// -------------------------------------------------------------
// Astronomical Consts & Presets
// 1 unit in 3D scene = ~1,000 light-years (kly)
// Milky Way diameter = ~100 kly (radius = ~50 units)
// Sun's distance from Galactic Center = ~26.67 kly (radius = 26.67 units)
// Sun's angle in galactic coordinates: ~82 degrees
// -------------------------------------------------------------
const SUN_DISTANCE_KLY = 26.67;
const SUN_ANGLE_RAD = (82 * Math.PI) / 180;
const SUN_POS: [number, number, number] = [
  SUN_DISTANCE_KLY * Math.cos(SUN_ANGLE_RAD),
  0.5, // ~20 pc above midplane
  SUN_DISTANCE_KLY * Math.sin(SUN_ANGLE_RAD),
];

export type CameraPreset = 'cinematic' | 'top' | 'sun' | 'core' | 'edge';

interface ArmData {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
  starsCount: string;
}

const GALACTIC_REGIONS: ArmData[] = [
  {
    id: 'all',
    name: 'Tüm Samanyolu Galaksisi',
    type: 'Çubuklu Sarmal (SBbc)',
    description: '100.000 ile 120.000 ışık yılı çapında, 100-400 milyar yıldız ve karanlık madde halesi içeren ana galaksimiz.',
    color: '#f5c542',
    starsCount: '100-400 Milyar',
  },
  {
    id: 'core',
    name: 'Galaktik Çekirdek (Sagittarius A*)',
    type: 'Süper Kütleli Karadelik & Şişkinlik',
    description: '4.3 milyon Güneş kütlesine sahip Sagittarius A* karadeliğinin etrafında aşırı yoğunlaşmış yaşlı yıldızlar ve dev çekirdek çubuğu.',
    color: '#ffd980',
    starsCount: '10+ Milyar Çekirdek Yıldızı',
  },
  {
    id: 'orion',
    name: 'Orion Mahmuzu (Bizim Konumumuz)',
    type: 'Yerel Sarmal Kol Mahmuzu',
    description: 'Yay ve Kahraman kolları arasında köprü oluşturan 10.000 ışık yılı uzunluğundaki yerel yapı. Güneş Sistemi burada yer alır.',
    color: '#00d4ff',
    starsCount: 'Güneş Sistemi & Yerel Kabarcık',
  },
  {
    id: 'perseus',
    name: 'Kahraman (Perseus) Kolu',
    type: 'Ana Sarmal Kol',
    description: 'Samanyolu’nun iki büyük ana kolundan biri. Çekirdek çubuğunun ucundan başlayıp dış sınırlara kadar uzanan yoğun yıldız oluşum bölgesi.',
    color: '#70a4ff',
    starsCount: 'Milyarlarca Genç O/B Yıldızı',
  },
  {
    id: 'scutum',
    name: 'Kalkan-Erboğa (Scutum-Centaurus)',
    type: 'Ana Sarmal Kol',
    description: 'Çekirdeğe en yakın diğer devasa ana kol. Yoğun moleküler gaz bulutları ve parlak genç süperdevler barındırır.',
    color: '#a855f7',
    starsCount: 'Dev Moleküler Bulutlar',
  },
  {
    id: 'sagittarius',
    name: 'Yay-Karina (Sagittarius-Carina)',
    type: 'İkincil Sarmal Kol',
    description: 'Güneş Sistemi ile Galaktik Çekirdek arasında uzanan, Karina Bulutsusu gibi görkemli H-II iyonize hidrojen bölgelerini içeren kol.',
    color: '#ff6b35',
    starsCount: 'Karina Bulutsusu & H-II Bölgeleri',
  },
];

// Helper to generate star field
function generateMilkyWayParticles(count = 26000) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = seededRandom(1337);

  const colCore = new THREE.Color('#fff2cf'); // warm white/gold core
  const colBulge = new THREE.Color('#f5a623'); // orange/amber bulge
  const colArmBlue = new THREE.Color('#80b5ff'); // young hot blue stars in arms
  const colArmWhite = new THREE.Color('#f0f4ff'); // A/F stars
  const colDust = new THREE.Color('#b35422'); // warm reddish dust lane

  let idx = 0;

  // 1. Core Bulge + Bar (30% of stars)
  const coreCount = Math.floor(count * 0.3);
  for (let i = 0; i < coreCount; i++) {
    // Bar elongation along angle ~28 deg
    const barAngle = (28 * Math.PI) / 180;
    const u = rand();
    const r = Math.pow(u, 2.2) * 11; // concentrated in inner 11 kly
    const theta = rand() * Math.PI * 2;
    // Stretch along bar
    const x = r * Math.cos(theta) * 1.5;
    const z = r * Math.sin(theta) * 0.7;
    // Rotate by bar angle
    const rotX = x * Math.cos(barAngle) - z * Math.sin(barAngle);
    const rotZ = x * Math.sin(barAngle) + z * Math.cos(barAngle);
    // Vertical bulge thickness
    const ySpread = (1 - r / 12) * 3.8 + 0.4;
    const y = (rand() - 0.5) * ySpread * (rand() - 0.5) * 2;

    positions[idx * 3] = rotX;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = rotZ;

    // Bulge color gradient
    const mixFactor = Math.min(r / 10, 1);
    const starCol = colCore.clone().lerp(colBulge, mixFactor * 0.7);
    colors[idx * 3] = starCol.r;
    colors[idx * 3 + 1] = starCol.g;
    colors[idx * 3 + 2] = starCol.b;
    idx++;
  }

  // 2. Spiral Arms (4 Major + Local Spur) (60% of stars)
  const armConfigs = [
    { offset: 0, b: 0.22, maxR: 52, col: colArmBlue }, // Scutum-Centaurus
    { offset: Math.PI, b: 0.22, maxR: 52, col: colArmBlue }, // Perseus
    { offset: Math.PI * 0.5, b: 0.24, maxR: 46, col: colArmWhite }, // Sagittarius
    { offset: Math.PI * 1.5, b: 0.24, maxR: 44, col: colArmWhite }, // Outer/Norma
    { offset: (80 * Math.PI) / 180, b: 0.23, maxR: 32, col: colArmBlue }, // Orion Spur
  ];

  const armCount = Math.floor(count * 0.6);
  for (let i = 0; i < armCount; i++) {
    const arm = armConfigs[i % armConfigs.length];
    const t = Math.pow(rand(), 0.75); // radial progress
    const r = 8 + t * (arm.maxR - 8);
    // Logarithmic spiral angle: theta = ln(r/a) / b
    const baseTheta = Math.log(r / 6) / arm.b + arm.offset;
    // Dispersion away from arm central spine
    const armWidth = 1.4 + (r / arm.maxR) * 3.2;
    const spreadAngle = (rand() - 0.5) * (armWidth / r);
    const theta = baseTheta + spreadAngle;

    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    // Thin disk exponential thickness (~1 kly scale)
    const diskZ = (rand() - 0.5) * (0.8 + (r / 50) * 0.7);

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = diskZ;
    positions[idx * 3 + 2] = z;

    // Pick spectral color
    const isHotGiant = rand() < 0.25;
    const isDust = rand() < 0.15;
    const starCol = isDust ? colDust : isHotGiant ? arm.col : colArmWhite;

    colors[idx * 3] = starCol.r;
    colors[idx * 3 + 1] = starCol.g;
    colors[idx * 3 + 2] = starCol.b;
    idx++;
  }

  // 3. Diffuse Galactic Disk & Halo Stars (10% of stars)
  while (idx < count) {
    const r = Math.sqrt(rand()) * 52;
    const theta = rand() * Math.PI * 2;
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    const y = (rand() - 0.5) * (1.6 + (1 - r / 55) * 4.0);

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = 0.85;
    colors[idx * 3 + 1] = 0.88;
    colors[idx * 3 + 2] = 0.95;
    idx++;
  }

  return { positions, colors };
}

// -------------------------------------------------------------
// Three.js Scene Inside Canvas
// -------------------------------------------------------------
function MilkyWayScene({
  isRotating,
  cameraPreset,
}: {
  isRotating: boolean;
  cameraPreset: CameraPreset;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const { positions, colors } = useMemo(() => generateMilkyWayParticles(28000), []);

  // Soft glow sprite for star particles
  const starTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,245,220,0.8)');
    grad.addColorStop(0.7, 'rgba(200,225,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  // Smooth camera interpolation based on selected preset
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (cameraPreset) {
      case 'cinematic':
        camera.position.set(0, 65, 80);
        ctrl.target.set(0, 0, 0);
        break;
      case 'top':
        camera.position.set(0, 115, 0.5);
        ctrl.target.set(0, 0, 0);
        break;
      case 'sun':
        camera.position.set(SUN_POS[0] + 6, SUN_POS[1] + 8, SUN_POS[2] + 12);
        ctrl.target.set(SUN_POS[0], SUN_POS[1], SUN_POS[2]);
        break;
      case 'core':
        camera.position.set(0, 8, 22);
        ctrl.target.set(0, 0, 0);
        break;
      case 'edge':
        camera.position.set(90, 2, 0);
        ctrl.target.set(0, 0, 0);
        break;
    }
    ctrl.update();
  }, [cameraPreset, camera]);

  // Slow galactic rotation
  useFrame((_, delta) => {
    if (isRotating && pointsRef.current) {
      // 1 full turn in real world is 230 million years; slow rotation here
      pointsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={180}
        maxPolarAngle={Math.PI - 0.05}
      />

      <ambientLight intensity={0.4} />

      {/* Main Galaxy Point Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.3}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Supermassive Black Hole & Glowing Core (Sagittarius A*) */}
      <group position={[0, 0, 0]}>
        {/* Core glow mesh */}
        <mesh>
          <sphereGeometry args={[2.8, 32, 32]} />
          <meshBasicMaterial
            color="#fff0c0"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Event horizon dark core */}
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Sun / Solar System Golden Marker */}
      <group position={SUN_POS}>
        {/* Marker beacon vertical line */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, -8, 0, 0, 8, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#f5c542" transparent opacity={0.6} />
        </line>

        {/* Orbit indicator horizontal ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.45, 32]} />
          <meshBasicMaterial
            color="#f5c542"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Golden Sun sphere */}
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Soft yellow halo */}
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial
            color="#f5c542"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Solar System Galactic Orbit Path (Radius 26.67 kly) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SUN_DISTANCE_KLY - 0.08, SUN_DISTANCE_KLY + 0.08, 128]} />
        <meshBasicMaterial
          color="#f5c542"
          side={THREE.DoubleSide}
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------
export function MilkyWayPointCloud3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [isRotating, setIsRotating] = useState(true);
  const [activeRegionId, setActiveRegionId] = useState('all');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('cinematic');

  const activeRegion = useMemo(
    () => GALACTIC_REGIONS.find((r) => r.id === activeRegionId) || GALACTIC_REGIONS[0],
    [activeRegionId]
  );

  return (
    <div
      ref={containerRef}
      className="relative ticks border border-line bg-ink text-paper overflow-hidden"
    >
      <Ticks />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line p-5 sm:p-6 bg-ink-2/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded border border-star-gold/30 bg-star-gold/10 text-star-gold">
            <Disc className="h-4 w-4 animate-spin text-star-gold" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-star-gold uppercase tracking-widest font-semibold">
                3D GALAKTİK KARTOGRAFYA
              </span>
              <span className="px-1.5 py-0.2 border border-line text-[9px] font-mono text-muted uppercase">
                28.000+ YILDIZ NOKTASI
              </span>
            </div>
            <h3 className="display display-tight text-xl sm:text-2xl text-paper">
              Samanyolu Galaksisi & Güneş’in Konumu
            </h3>
          </div>
        </div>

        {/* View preset pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setCameraPreset('cinematic');
              setActiveRegionId('all');
            }}
            className={`px-2.5 py-1 transition-colors cursor-pointer border text-[11px] uppercase tracking-wider ${
              cameraPreset === 'cinematic'
                ? 'border-star-gold bg-star-gold text-ink font-bold'
                : 'border-line bg-ink text-muted hover:text-paper hover:border-line'
            }`}
          >
            Açılı Bakış
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('top');
              setActiveRegionId('all');
            }}
            className={`px-2.5 py-1 transition-colors cursor-pointer border text-[11px] uppercase tracking-wider ${
              cameraPreset === 'top'
                ? 'border-star-gold bg-star-gold text-ink font-bold'
                : 'border-line bg-ink text-muted hover:text-paper hover:border-line'
            }`}
          >
            Kuşbakışı Disk
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('sun');
              setActiveRegionId('orion');
            }}
            className={`px-2.5 py-1 transition-colors cursor-pointer border text-[11px] uppercase tracking-wider flex items-center gap-1 ${
              cameraPreset === 'sun'
                ? 'border-solar bg-solar text-ink font-bold'
                : 'border-line bg-ink text-muted hover:text-paper hover:border-line'
            }`}
          >
            <MapPin className="h-3 w-3" />
            Güneş (Biz)
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('core');
              setActiveRegionId('core');
            }}
            className={`px-2.5 py-1 transition-colors cursor-pointer border text-[11px] uppercase tracking-wider ${
              cameraPreset === 'core'
                ? 'border-star-gold bg-star-gold text-ink font-bold'
                : 'border-line bg-ink text-muted hover:text-paper hover:border-line'
            }`}
          >
            Sgr A* Çekirdek
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('edge');
              setActiveRegionId('all');
            }}
            className={`px-2.5 py-1 transition-colors cursor-pointer border text-[11px] uppercase tracking-wider ${
              cameraPreset === 'edge'
                ? 'border-star-gold bg-star-gold text-ink font-bold'
                : 'border-line bg-ink text-muted hover:text-paper hover:border-line'
            }`}
          >
            Yandan Profil
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative h-[480px] sm:h-[580px] w-full bg-[#030308]">
        {isInView ? (
          <Canvas
            camera={{ position: [0, 65, 80], fov: 48 }}
            gl={{ antialias: true, alpha: true }}
          >
            <MilkyWayScene
              isRotating={isRotating}
              cameraPreset={cameraPreset}
            />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted">
            3D Galaksi Yükleniyor…
          </div>
        )}

        {/* Floating Top-Left Telemetry Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] space-y-1.5 bg-ink/80 backdrop-blur-md p-3 border border-line max-w-[260px]">
          <div className="flex items-center justify-between border-b border-line pb-1">
            <span className="text-muted uppercase text-[9px]">GÖZLEMLENEN SİSTEM</span>
            <span className="text-star-gold font-bold">SAMANYOLU (VIA LACTEA)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">ÇAP:</span>
            <span className="text-paper font-semibold">~105.700 Işık Yılı</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">YILDIZ SAYISI:</span>
            <span className="text-paper font-semibold">100 - 400 Milyar</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">GÜNEŞ UZAKLIĞI:</span>
            <span className="text-solar font-semibold">26.670 Işık Yılı (8.2 kpc)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">GÜNEŞ ORBİTAL HIZI:</span>
            <span className="text-paper font-semibold">828.000 km/sa (230 km/s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">GALAKTİK YIL:</span>
            <span className="text-paper font-semibold">~230 Milyon Yıl</span>
          </div>
        </div>

        {/* Floating Bottom-Left Controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-xs z-10">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/90 backdrop-blur border border-line text-paper hover:border-star-gold transition-colors cursor-pointer text-[11px] uppercase"
          >
            {isRotating ? <Pause className="h-3 w-3 text-star-gold" /> : <Play className="h-3 w-3 text-star-gold" />}
            <span>{isRotating ? 'Dönüşü Durdur' : 'Dönüşü Başlat'}</span>
          </button>
        </div>

        {/* Sun Beacon Legend Marker (Bottom Right of Canvas) */}
        <div className="absolute bottom-4 right-4 pointer-events-none bg-ink/80 backdrop-blur border border-solar/40 p-2.5 font-mono text-[10px] space-y-1">
          <div className="flex items-center gap-1.5 text-solar font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-solar animate-ping" />
            <span>Güneş Sistemi / Biz Buradayız</span>
          </div>
          <p className="text-muted text-[9px] max-w-[200px]">
            Sarı halka ve dikey fener çizgisi Güneşimizin Orion Mahmuzu’ndaki 26.670 ışık yılı uzaklıktaki konumunu gösterir.
          </p>
        </div>
      </div>

      {/* Region / Spiral Arm Selector Bar */}
      <div className="border-t border-line bg-ink-2 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-star-gold" />
            SARMAL KOLLAR & GALAKTİK BÖLGELERİ KEŞFET
          </span>
          <span className="font-mono text-[10px] text-muted">
            Seçili Bölge: <span className="text-star-gold font-bold">{activeRegion.name}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {GALACTIC_REGIONS.map((region) => {
            const isSelected = activeRegionId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => {
                  setActiveRegionId(region.id);
                  if (region.id === 'core') setCameraPreset('core');
                  else if (region.id === 'orion') setCameraPreset('sun');
                  else if (region.id === 'all') setCameraPreset('cinematic');
                }}
                className={`p-2.5 text-left transition-all border font-mono text-xs cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-star-gold bg-ink text-paper shadow-[0_0_15px_rgba(245,197,66,0.15)]'
                    : 'border-line bg-ink/60 text-muted hover:border-line hover:text-paper'
                }`}
              >
                <div>
                  <span
                    className="block text-[9px] uppercase tracking-wider font-semibold"
                    style={{ color: region.color }}
                  >
                    {region.type}
                  </span>
                  <span className="font-bold text-[11px] text-paper mt-0.5 line-clamp-1">
                    {region.name}
                  </span>
                </div>
                <span className="text-[9px] text-muted block mt-1.5 font-mono">
                  {region.starsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Region Explanatory Dossier */}
        <div className="border border-line bg-ink p-4 space-y-2 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: activeRegion.color }}
              />
              <h4 className="font-bold text-paper text-sm">{activeRegion.name}</h4>
              <span className="text-muted text-[10px] uppercase">({activeRegion.type})</span>
            </div>
            <span className="text-[10px] text-star-gold font-bold uppercase tracking-wider">
              {activeRegion.starsCount}
            </span>
          </div>
          <p className="text-muted text-xs leading-relaxed font-sans">
            {activeRegion.description}
          </p>
        </div>
      </div>
    </div>
  );
}
