'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useInView } from '@/lib/useInView';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Orbit, Play, Pause, Eye } from 'lucide-react';
import { NASA_TEXTURES, loadNasaTexture } from './nasaTextures';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture
} from './textures';

// Ortak görünüm sınıfları
const ICON_BUTTON =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors cursor-pointer';
const SPEED_BUTTON =
  'inline-flex h-9 min-w-9 shrink-0 items-center justify-center border px-2.5 font-mono text-sm tabular-nums transition-colors cursor-pointer';
const DATA_LABEL = 'block text-sm text-paper/70';
const DATA_VALUE = 'mt-1 block font-mono text-sm font-semibold tabular-nums text-paper sm:text-base';

interface OrreryPlanet {
  id: string;
  name: string;
  color: string;
  size: number;
  distance: number; // scaled AU
  orbitalPeriod: number; // in Earth years
  rotationSpeed: number;
  description: string;
  actualDistanceAU: string;
  periodDays: string;
  hasRings?: boolean;
}

const PLANETS_DATA: OrreryPlanet[] = [
  {
    id: 'mercury',
    name: 'Merkür',
    color: '#a8a8a8',
    size: 0.38,
    distance: 7,
    orbitalPeriod: 0.24,
    rotationSpeed: 0.02,
    description: 'Güneş’e en yakın ve en küçük gezegen. Yüzeyinde aşırı sıcaklık farkları yaşanır.',
    actualDistanceAU: '0.39 AU (57.9M km)',
    periodDays: '88 Gün'
  },
  {
    id: 'venus',
    name: 'Venüs',
    color: '#e3bb76',
    size: 0.75,
    distance: 11,
    orbitalPeriod: 0.62,
    rotationSpeed: 0.01,
    description: 'Sera etkisiyle Güneş Sistemi’nin en sıcak gezegeni. Yoğun sülfürik asit bulutları barındırır.',
    actualDistanceAU: '0.72 AU (108.2M km)',
    periodDays: '225 Gün'
  },
  {
    id: 'earth',
    name: 'Dünya',
    color: '#3498db',
    size: 0.8,
    distance: 16,
    orbitalPeriod: 1.0,
    rotationSpeed: 0.05,
    description: 'Yüzeyinde sıvı su, tektonik hareket ve zengin bir biyoçeşitlilik barındıran yaşam beşiğimiz.',
    actualDistanceAU: '1.00 AU (149.6M km)',
    periodDays: '365.25 Gün'
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#e74c3c',
    size: 0.53,
    distance: 21,
    orbitalPeriod: 1.88,
    rotationSpeed: 0.04,
    description: 'Kızıl toz fırtınaları, Güneş Sistemi’nin en yüksek volkanı ve devasa kanyonlara sahip komşu.',
    actualDistanceAU: '1.52 AU (227.9M km)',
    periodDays: '687 Gün'
  },
  {
    id: 'jupiter',
    name: 'Jüpiter',
    color: '#d39c55',
    size: 1.8,
    distance: 30,
    orbitalPeriod: 11.86,
    rotationSpeed: 0.08,
    description: 'Gaz devi. Tüm diğer gezegenlerin toplamından 2.5 kat daha ağırdır.',
    actualDistanceAU: '5.20 AU (778.5M km)',
    periodDays: '11.86 Yıl'
  },
  {
    id: 'saturn',
    name: 'Satürn',
    color: '#e5d198',
    size: 1.5,
    distance: 40,
    orbitalPeriod: 29.46,
    rotationSpeed: 0.07,
    description: 'Göz kamaştırıcı buz halkaları ve yoğun atmosferiyle bilinen büyüleyici dev.',
    actualDistanceAU: '9.58 AU (1.43B km)',
    periodDays: '29.46 Yıl',
    hasRings: true
  },
  {
    id: 'uranus',
    name: 'Uranüs',
    color: '#70d6ff',
    size: 1.1,
    distance: 50,
    orbitalPeriod: 84.01,
    rotationSpeed: 0.03,
    description: 'Buz devi. Eksen eğikliği 98 derecedir, adeta yörüngesinde yuvarlanarak döner.',
    actualDistanceAU: '19.22 AU (2.87B km)',
    periodDays: '84 Yıl'
  },
  {
    id: 'neptune',
    name: 'Neptün',
    color: '#2b59c3',
    size: 1.05,
    distance: 60,
    orbitalPeriod: 164.79,
    rotationSpeed: 0.03,
    description: 'Sistemimizin en dış gezegeni. Saatte 2,000 km’ye varan süpersonik rüzgarlara sahiptir.',
    actualDistanceAU: '30.05 AU (4.50B km)',
    periodDays: '164.8 Yıl'
  }
];

// Single Planet in the 3D Orrery
function PlanetBody({
  planet,
  speedMultiplier,
  isPaused,
  showLabels,
  showOrbits,
  isSelected,
  onSelect,
  labelPortal
}: {
  planet: OrreryPlanet;
  speedMultiplier: number;
  isPaused: boolean;
  showLabels: boolean;
  showOrbits: boolean;
  isSelected: boolean;
  onSelect: () => void;
  /** Fixed DOM host for the labels; without it drei re-targets them once events connect, leaving a stale root behind. */
  labelPortal: React.RefObject<HTMLElement>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Keplerian angular speed (faster inside, slower outside)
  const angularSpeed = (2 * Math.PI) / (planet.orbitalPeriod * 24);

  // Planet texture loading with guaranteed procedural fallback
  const texture = useMemo(() => {
    switch (planet.id) {
      case 'mercury':
        return loadNasaTexture(NASA_TEXTURES.mercury) || createMercuryTexture();
      case 'venus':
        return loadNasaTexture(NASA_TEXTURES.venus) || createVenusTexture();
      case 'earth':
        return loadNasaTexture(NASA_TEXTURES.earthMap) || createEarthTexture().map;
      case 'mars':
        return loadNasaTexture(NASA_TEXTURES.mars) || createMarsTexture();
      case 'jupiter':
        return loadNasaTexture(NASA_TEXTURES.jupiter) || createJupiterTexture();
      case 'saturn':
        return loadNasaTexture(NASA_TEXTURES.saturn) || createSaturnTexture();
      case 'uranus':
        return loadNasaTexture(NASA_TEXTURES.uranus) || createUranusTexture();
      case 'neptune':
        return loadNasaTexture(NASA_TEXTURES.neptune) || createNeptuneTexture();
      default:
        return null;
    }
  }, [planet.id]);

  const ringTexture = useMemo(() => {
    if (!planet.hasRings) return null;
    return loadNasaTexture(NASA_TEXTURES.saturnRing) || createSaturnRingTexture();
  }, [planet.hasRings]);

  // Concentric radial UV remapping for Saturn rings
  const ringGeometry = useMemo(() => {
    if (!planet.hasRings) return null;
    const inner = planet.size * 1.25;
    const outer = planet.size * 2.45;
    const g = new THREE.RingGeometry(inner, outer, 96);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [planet.hasRings, planet.size]);

  useFrame((_, delta) => {
    if (!isPaused && orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += angularSpeed * speedMultiplier * delta;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * delta * 2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  // Static orbit circle geometry
  const orbitGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * planet.distance, 0, Math.sin(theta) * planet.distance));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [planet.distance]);

  return (
    <>
      {/* Orbital Path Trace */}
      {showOrbits && (
        <lineLoop geometry={orbitGeometry}>
          <lineBasicMaterial
            color={isSelected ? '#00d4ff' : '#ffffff'}
            transparent
            opacity={isSelected ? 0.4 : 0.1}
          />
        </lineLoop>
      )}

      {/* Orbit Rotating Group */}
      <group ref={orbitGroupRef}>
        <group position={[planet.distance, 0, 0]}>
          {/* Planet Sphere with High-Def Surface Map */}
          <mesh
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <sphereGeometry args={[planet.size, 48, 48]} />
            <meshStandardMaterial
              map={texture || undefined}
              color={texture ? '#ffffff' : planet.color}
              roughness={0.65}
              metalness={0.1}
              emissive={isSelected ? '#00d4ff' : '#000000'}
              emissiveIntensity={isSelected ? 0.35 : 0}
            />
          </mesh>

          {/* Concentric Photorealistic Saturn's Rings */}
          {planet.hasRings && ringGeometry && (
            <mesh ref={ringRef} rotation={[-Math.PI / 2.5, 0, 0]} geometry={ringGeometry}>
              <meshStandardMaterial
                map={ringTexture || undefined}
                color={ringTexture ? '#ffffff' : '#dfc58e'}
                side={THREE.DoubleSide}
                transparent
                opacity={0.92}
                roughness={0.4}
              />
            </mesh>
          )}

          {/* Selection Halo */}
          {isSelected && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.size * 1.5, planet.size * 1.7, 32]} />
              <meshBasicMaterial color="#00d4ff" side={THREE.DoubleSide} />
            </mesh>
          )}

          {/* Label */}
          {showLabels && (
            <Html portal={labelPortal} distanceFactor={45} position={[0, planet.size + 0.8, 0]} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`cursor-pointer pointer-events-auto select-none px-2 py-0.5 text-[11px] font-medium border whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'border-solar bg-solar/30 text-paper'
                    : 'border-line bg-ink/90 text-paper/75 hover:text-paper'
                }`}
              >
                {planet.name}
              </div>
            </Html>
          )}
        </group>
      </group>
    </>
  );
}

// Sun at the center with Solar Texture & Corona Glow
function OrrerySun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunTexture = useMemo(() => loadNasaTexture(NASA_TEXTURES.sun) || createSunTexture(), []);

  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Sphere with Solar Texture */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2.8, 48, 48]} />
        <meshBasicMaterial map={sunTexture || undefined} color={sunTexture ? '#ffffff' : '#ffaa00'} />
      </mesh>

      {/* Primary Corona Glow */}
      <mesh scale={1.18}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Golden Aura */}
      <mesh scale={1.42}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point Light illuminating the planets */}
      <pointLight color="#ffffff" intensity={4.5} distance={150} decay={1.1} />
    </group>
  );
}

// -------------------------------------------------------------
// MAIN SOLAR SYSTEM ORRERY EXPORT
// -------------------------------------------------------------
export function SolarSystemOrrery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef);
  const [selectedPlanet, setSelectedPlanet] = useState<OrreryPlanet>(PLANETS_DATA[2]); // Earth default
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  return (
    <div className="relative border border-line bg-ink overflow-hidden">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col gap-5 border-b border-line p-4 sm:p-6 md:flex-row md:items-end md:justify-between lg:p-8">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">3D Güneş Sistemi Çarkı</h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-paper/80">
            Gezegenlerin gerçek bağıl yörünge periyotlarını ve açısal hızlarını mekanik orrery modelinde inceleyin.
          </p>
          <p className="mt-2 text-sm text-paper/70">Kepler yörünge simülatörü (orrery)</p>
        </div>

        {/* Speed & View Controls */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button type="button" aria-label={isPaused ? 'Oynat' : 'Durdur'}
              onClick={() => setIsPaused(!isPaused)}
              className={`${ICON_BUTTON} ${
                isPaused
                  ? 'border-solar/60 bg-solar/15 text-solar'
                  : 'border-line bg-ink-2 text-paper hover:border-solar/50'
              }`}
              title={isPaused ? 'Oynat' : 'Durdur'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>

            {/* Speed Multipliers */}
            {[0.5, 1, 3, 10].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={speedMultiplier === s && !isPaused}
                onClick={() => {
                  setSpeedMultiplier(s);
                  setIsPaused(false);
                }}
                className={`${SPEED_BUTTON} ${
                  speedMultiplier === s && !isPaused
                    ? 'border-solar bg-solar text-ink font-semibold'
                    : 'border-line bg-ink-2 text-paper/75 hover:text-paper'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-1.5 sm:border-l sm:border-line sm:pl-3">
            <button type="button" aria-label="Yörünge izleri" aria-pressed={showOrbits}
              onClick={() => setShowOrbits(!showOrbits)}
              className={`${ICON_BUTTON} ${
                showOrbits
                  ? 'border-violet/60 bg-violet/15 text-violet'
                  : 'border-line bg-ink-2 text-paper/75 hover:text-paper'
              }`}
              title="Yörünge izleri"
            >
              <Orbit size={16} />
            </button>

            <button type="button" aria-label="Gezegen etiketleri" aria-pressed={showLabels}
              onClick={() => setShowLabels(!showLabels)}
              className={`${ICON_BUTTON} ${
                showLabels
                  ? 'border-solar/60 bg-solar/15 text-solar'
                  : 'border-line bg-ink-2 text-paper/75 hover:text-paper'
              }`}
              title="Gezegen isimleri"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas Arena */}
      <div ref={stageRef} className="relative h-[480px] w-full bg-[#03030a]">
        <Canvas
          frameloop={stageVisible ? 'always' : 'never'}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 45, 60], fov: 45, near: 0.1, far: 500 }}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#03030c']} />
          <ambientLight intensity={0.25} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            maxDistance={140}
            minDistance={10}
            maxPolarAngle={Math.PI / 2.1}
          />

          {/* Sun */}
          <OrrerySun />

          {/* Planets */}
          {PLANETS_DATA.map((p) => (
            <PlanetBody
              key={p.id}
              planet={p}
              speedMultiplier={speedMultiplier}
              isPaused={isPaused}
              showLabels={showLabels}
              showOrbits={showOrbits}
              isSelected={selectedPlanet.id === p.id}
              onSelect={() => setSelectedPlanet(p)}
              labelPortal={stageRef as React.RefObject<HTMLElement>}
            />
          ))}
        </Canvas>
      </div>

      {/* Selected Planet Data */}
      <div className="grid gap-5 border-t border-line p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-10 lg:p-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
            Gezegen verisi
          </div>
          <h4 className="mt-2 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
            {selectedPlanet.name}
          </h4>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-paper/85">
            {selectedPlanet.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:min-w-[18rem]">
          <div className="min-w-0">
            <span className={DATA_LABEL}>Güneş’e uzaklık</span>
            <span className={DATA_VALUE}>{selectedPlanet.actualDistanceAU}</span>
          </div>
          <div className="min-w-0">
            <span className={DATA_LABEL}>Yıl süresi</span>
            <span className={DATA_VALUE}>{selectedPlanet.periodDays}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
