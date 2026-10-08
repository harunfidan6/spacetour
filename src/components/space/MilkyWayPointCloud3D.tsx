'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { MapPin, Play, Pause } from 'lucide-react';
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

// Ortak görünüm sınıfları
const VIEW_BUTTON =
  'inline-flex min-h-9 items-center gap-1.5 border px-3 text-sm transition-colors cursor-pointer';
const VIEW_BUTTON_IDLE = 'border-line bg-ink text-paper/80 hover:border-paper/40 hover:text-paper';
const VIEW_BUTTON_ACTIVE = 'border-star-gold bg-star-gold text-ink font-medium';

// Galaksinin temel verileri (sayı ve birimler olduğu gibi)
const GALAXY_FACTS: { label: string; value: string; mono?: boolean; solar?: boolean }[] = [
  { label: 'Galaksi', value: 'Samanyolu (Via Lactea)' },
  { label: 'Çap', value: '~105.700 Işık Yılı', mono: true },
  { label: 'Yıldız sayısı', value: '100 - 400 Milyar', mono: true },
  { label: 'Güneş uzaklığı', value: '26.670 Işık Yılı (8.2 kpc)', mono: true, solar: true },
  { label: 'Güneş orbital hızı', value: '828.000 km/sa (230 km/s)', mono: true },
  { label: 'Galaktik yıl', value: '~230 Milyon Yıl', mono: true },
];

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
      className="relative border border-line bg-ink text-paper overflow-hidden"
    >
      {/* Başlık ve görünüm seçimi */}
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
            Samanyolu Galaksisi ve Güneş’in konumu
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">
            3D galaksi haritası · 28.000+ yıldız noktası
          </p>
        </div>

        {/* View preset pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCameraPreset('cinematic');
              setActiveRegionId('all');
            }}
            className={`${VIEW_BUTTON} ${
              cameraPreset === 'cinematic' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_IDLE
            }`}
          >
            Açılı bakış
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('top');
              setActiveRegionId('all');
            }}
            className={`${VIEW_BUTTON} ${
              cameraPreset === 'top' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_IDLE
            }`}
          >
            Kuşbakışı disk
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('sun');
              setActiveRegionId('orion');
            }}
            className={`${VIEW_BUTTON} ${
              cameraPreset === 'sun' ? 'border-solar bg-solar text-ink font-medium' : VIEW_BUTTON_IDLE
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Güneş (biz)
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('core');
              setActiveRegionId('core');
            }}
            className={`${VIEW_BUTTON} ${
              cameraPreset === 'core' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_IDLE
            }`}
          >
            Sgr A* çekirdek
          </button>
          <button
            type="button"
            onClick={() => {
              setCameraPreset('edge');
              setActiveRegionId('all');
            }}
            className={`${VIEW_BUTTON} ${
              cameraPreset === 'edge' ? VIEW_BUTTON_ACTIVE : VIEW_BUTTON_IDLE
            }`}
          >
            Yandan profil
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
          <div className="flex h-full items-center justify-center text-sm text-paper/70">
            3D galaksi yükleniyor…
          </div>
        )}

        {/* Floating Bottom-Left Controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="inline-flex min-h-9 items-center gap-1.5 border border-line bg-ink/85 px-3 text-sm text-paper transition-colors hover:border-star-gold cursor-pointer"
          >
            {isRotating ? <Pause className="h-3.5 w-3.5 text-star-gold" /> : <Play className="h-3.5 w-3.5 text-star-gold" />}
            <span>{isRotating ? 'Dönüşü durdur' : 'Dönüşü başlat'}</span>
          </button>
        </div>
      </div>

      {/* Galaksi verileri ve Güneş işareti açıklaması */}
      <div className="border-t border-line p-5 sm:p-6 space-y-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          {GALAXY_FACTS.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-sm text-paper/70">{fact.label}</dt>
              <dd
                className={`mt-0.5 text-sm ${fact.mono ? 'font-mono' : 'font-medium'} ${
                  fact.solar ? 'text-solar' : 'text-paper'
                }`}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-paper/80">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-solar" aria-hidden="true" />
          <span>
            <span className="font-medium text-solar">Güneş Sistemi, biz buradayız.</span>{' '}
            Sarı halka ve dikey fener çizgisi Güneşimizin Orion Mahmuzu’ndaki 26.670 ışık yılı uzaklıktaki konumunu gösterir.
          </span>
        </p>
      </div>

      {/* Region / Spiral Arm Selector Bar */}
      <div className="border-t border-line p-5 sm:p-6 space-y-4">
        <div className="text-sm font-medium text-paper/80">Sarmal kollar ve galaktik bölgeler</div>

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
                className={`flex min-w-0 flex-col gap-1 border p-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-star-gold bg-ink-2'
                    : 'border-line bg-ink hover:border-paper/40'
                }`}
              >
                <span className="text-xs font-medium" style={{ color: region.color }}>
                  {region.type}
                </span>
                <span className="text-sm font-medium leading-snug text-paper">
                  {region.name}
                </span>
                <span className="mt-auto pt-1 text-xs text-paper/70">
                  {region.starsCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Region Explanatory Dossier */}
        <div className="border-t border-line pt-4 space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="flex items-center gap-2 text-lg font-semibold leading-snug text-paper">
              <span
                className="w-2.5 h-2.5 shrink-0 rounded-full inline-block"
                style={{ backgroundColor: activeRegion.color }}
              />
              {activeRegion.name}
            </h4>
            <span className="text-sm text-paper/70">{activeRegion.type}</span>
          </div>
          <p className="text-sm text-star-gold">{activeRegion.starsCount}</p>
          <p className="text-base leading-relaxed text-paper/85">
            {activeRegion.description}
          </p>
        </div>
      </div>
    </div>
  );
}
