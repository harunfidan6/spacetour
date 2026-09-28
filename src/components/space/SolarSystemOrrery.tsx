'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Orbit,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Compass,
  Layers,
  Eye
} from 'lucide-react';

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
  onSelect
}: {
  planet: OrreryPlanet;
  speedMultiplier: number;
  isPaused: boolean;
  showLabels: boolean;
  showOrbits: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Keplerian angular speed (faster inside, slower outside)
  const angularSpeed = (2 * Math.PI) / (planet.orbitalPeriod * 24);

  useFrame((_, delta) => {
    if (!isPaused && orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += angularSpeed * speedMultiplier * delta;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * delta * 2;
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
          {/* Planet Sphere */}
          <mesh
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              roughness={0.6}
              metalness={0.2}
              emissive={isSelected ? planet.color : '#000000'}
              emissiveIntensity={isSelected ? 0.35 : 0}
            />
          </mesh>

          {/* Saturn's Rings */}
          {planet.hasRings && (
            <mesh ref={ringRef} rotation={[-Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2.3, 32]} />
              <meshBasicMaterial
                color="#dfc58e"
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
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
            <Html distanceFactor={45} position={[0, planet.size + 0.8, 0]} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`cursor-pointer pointer-events-auto select-none rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider border whitespace-nowrap transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/30 text-white shadow-[0_0_15px_rgba(0,212,255,0.7)] scale-110'
                    : 'border-card-border/60 bg-background/80 text-text-secondary hover:text-white'
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

// Sun at the center
function OrrerySun() {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>

      {/* Corona Glow */}
      <mesh scale={1.25}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.3}
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
  const [selectedPlanet, setSelectedPlanet] = useState<OrreryPlanet>(PLANETS_DATA[2]); // Earth default
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  return (
    <div className="rounded-3xl border border-primary/30 bg-card-bg/85 overflow-hidden backdrop-blur-2xl shadow-2xl relative">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-card-border/60 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Orbit className="h-5 w-5 text-primary animate-spin" />
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">
              KEPLERİAN YÖRÜNGE SİMÜLATÖRÜ (ORRERY)
            </span>
          </div>
          <h3 className="text-2xl font-black text-foreground">3D Güneş Sistemi Çarkı</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Gezegenlerin gerçek bağıl yörünge hızlarını 3D mekanik orrery modelinde inceleyin.
          </p>
        </div>

        {/* Speed & View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
              isPaused
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]'
            }`}
            title={isPaused ? 'Oynat' : 'Durdur'}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>

          {/* Speed Multipliers */}
          {[0.5, 1, 3, 10].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeedMultiplier(s);
                setIsPaused(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                speedMultiplier === s && !isPaused
                  ? 'bg-primary text-background shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                  : 'border border-card-border/70 bg-background/50 text-text-secondary hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}

          <div className="h-4 w-px bg-card-border/60 mx-1 hidden sm:block" />

          {/* Toggles */}
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              showOrbits
                ? 'border-secondary/60 bg-secondary/20 text-secondary'
                : 'border-card-border bg-card-bg/60 text-text-secondary'
            }`}
            title="Yörünge İzleri"
          >
            <Orbit size={15} />
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              showLabels
                ? 'border-primary/60 bg-primary/20 text-primary'
                : 'border-card-border bg-card-bg/60 text-text-secondary'
            }`}
            title="Gezegen İsimleri"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* 3D Canvas Arena */}
      <div className="relative h-[480px] w-full bg-[#03030a]">
        <Canvas
          camera={{ position: [0, 45, 60], fov: 45, near: 0.1, far: 500 }}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#03030c']} />
          <ambientLight intensity={0.2} />

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
            />
          ))}
        </Canvas>

        {/* Selected Planet HUD Card Overlay */}
        <div className="absolute bottom-4 left-4 z-10 max-w-xs rounded-2xl border border-primary/30 bg-background/90 p-4 shadow-2xl backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between border-b border-card-border/60 pb-2 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              GEZEGEN VERİSİ
            </span>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
          </div>

          <h4 className="text-xl font-black text-foreground">{selectedPlanet.name}</h4>
          <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
            <div className="p-2 rounded-lg bg-card-bg border border-card-border/60">
              <span className="text-[9px] text-text-secondary block">Güneş'e Uzaklık</span>
              <span className="font-bold text-foreground truncate block">{selectedPlanet.actualDistanceAU}</span>
            </div>
            <div className="p-2 rounded-lg bg-card-bg border border-card-border/60">
              <span className="text-[9px] text-text-secondary block">Yıl Süresi</span>
              <span className="font-bold text-foreground truncate block">{selectedPlanet.periodDays}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
