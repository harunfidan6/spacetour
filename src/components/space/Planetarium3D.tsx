'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { stars, constellationLines, deepSkyObjects, StarData, DeepSkyObject } from '@/data/stars';
import {
  Compass,
  Sparkles,
  Layers,
  Search,
  Eye,
  Crosshair,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Globe,
  Star
} from 'lucide-react';

const SPHERE_RADIUS = 90;

// Convert Celestial RA (0-360) and Dec (-90 to +90) to 3D Cartesian coordinates on celestial sphere
function celestialToCartesian(ra: number, dec: number, radius: number): [number, number, number] {
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);
  return [x, y, z];
}

// -------------------------------------------------------------
// 1. THE 3D MILKY WAY ARCH & GALACTIC PLANE
// -------------------------------------------------------------
function MilkyWayArch({ nightVision }: { nightVision: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 12000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Galactic plane tilted relative to celestial equator (inclination ~63 deg)
    // Sgr A* (Galactic Center) is at RA ~ 266.4 deg, Dec ~ -29.0 deg
    for (let i = 0; i < count; i++) {
      // Longitude along galactic plane
      const gLon = Math.random() * Math.PI * 2;
      // Latitude clustered heavily around galactic equator (Gaussian-like spread)
      const gLat = (Math.random() - 0.5 + (Math.random() - 0.5)) * 0.22;

      // Transform galactic coords (gLon, gLat) to Cartesian on sphere
      const rad = SPHERE_RADIUS * (0.97 + Math.random() * 0.02);
      
      // Rotate galactic plane into equatorial frame
      const v = new THREE.Vector3(
        rad * Math.cos(gLat) * Math.cos(gLon),
        rad * Math.sin(gLat),
        rad * Math.cos(gLat) * Math.sin(gLon)
      );

      // Galactic plane tilt rotation
      v.applyAxisAngle(new THREE.Vector3(1, 0, 0), 1.09); // 62.8 deg tilt
      v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.5);

      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;

      // Galactic core (near Sagittarius) is warmer and denser
      const isCore = Math.abs(gLon - 0) < 0.8;
      if (nightVision) {
        col[i * 3] = 0.8;
        col[i * 3 + 1] = 0.1;
        col[i * 3 + 2] = 0.1;
      } else if (isCore) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.78;
        col[i * 3 + 2] = 0.45; // Amber golden core
      } else {
        const shade = 0.5 + Math.random() * 0.5;
        col[i * 3] = 0.65 * shade;
        col[i * 3 + 1] = 0.75 * shade;
        col[i * 3 + 2] = 0.95 * shade; // Pale cosmic cyan/blue
      }
    }

    return [pos, col];
  }, [count, nightVision]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={nightVision ? 1.0 : 1.25}
        vertexColors
        transparent
        opacity={nightVision ? 0.35 : 0.48}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 2. CELESTIAL STARS WITH DIFFRACTION SPIKES & FLARES
// -------------------------------------------------------------
function CelestialStars({
  onSelectStar,
  selectedStar,
  nightVision
}: {
  onSelectStar: (star: StarData) => void;
  selectedStar: StarData | null;
  nightVision: boolean;
}) {
  return (
    <group>
      {stars.map((star, idx) => {
        const [x, y, z] = celestialToCartesian(star.ra, star.dec, SPHERE_RADIUS);
        const size = Math.max(0.7, 2.5 - star.magnitude * 0.38);
        const isSelected = selectedStar?.name === star.name;
        const isSuperBright = star.magnitude < 0.6;
        const color = nightVision ? '#ff2222' : star.color;

        return (
          <group key={idx} position={[x, y, z]}>
            {/* Star Core */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectStar(star);
              }}
            >
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? '#00ffff' : color}
                toneMapped={false}
              />
            </mesh>

            {/* Glowing Aura for bright stars */}
            {star.magnitude < 1.8 && (
              <mesh scale={2.6}>
                <sphereGeometry args={[size, 16, 16]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={nightVision ? 0.2 : 0.35}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}

            {/* 4-Point Diffraction Flare for the brightest stars */}
            {isSuperBright && !nightVision && (
              <group scale={size * 3.8}>
                {/* Horizontal Spike */}
                <mesh rotation={[0, 0, 0]}>
                  <planeGeometry args={[2.8, 0.14]} />
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                {/* Vertical Spike */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <planeGeometry args={[2.8, 0.14]} />
                  <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>
            )}

            {/* Selected Star Marker Rings */}
            {isSelected && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[size * 2.2, size * 2.5, 32]} />
                <meshBasicMaterial
                  color={nightVision ? '#ff0000' : '#00ffff'}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}

            {/* Labels for brightest landmark stars */}
            {star.magnitude < 1.3 && (
              <Html distanceFactor={65} position={[0, size + 1.4, 0]} center>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStar(star);
                  }}
                  className={`pointer-events-auto cursor-pointer select-none text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border transition-all ${
                    isSelected
                      ? 'bg-primary/40 border-primary text-white shadow-[0_0_12px_rgba(0,212,255,0.8)] scale-110'
                      : nightVision
                      ? 'bg-red-950/80 border-red-800 text-red-400'
                      : 'bg-background/80 border-card-border/80 text-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {star.turkishName || star.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// 3. DEEP SKY OBJECTS (Galaxies, Nebulae, Star Clusters)
// -------------------------------------------------------------
function DeepSkyLayer({
  onSelectDso,
  selectedDso,
  nightVision
}: {
  onSelectDso: (dso: DeepSkyObject) => void;
  selectedDso: DeepSkyObject | null;
  nightVision: boolean;
}) {
  return (
    <group>
      {deepSkyObjects.map((dso) => {
        const [x, y, z] = celestialToCartesian(dso.ra, dso.dec, SPHERE_RADIUS * 0.985);
        const isSelected = selectedDso?.id === dso.id;
        const color = nightVision ? '#ff3333' : dso.color;

        return (
          <group key={dso.id} position={[x, y, z]}>
            {/* Clickable Deep Sky Icon Marker */}
            <Html distanceFactor={70} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDso(dso);
                }}
                className={`group pointer-events-auto cursor-pointer flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/30 text-white shadow-[0_0_20px_rgba(255,107,53,0.8)] scale-110'
                    : nightVision
                    ? 'border-red-800 bg-red-950/80 text-red-300 hover:border-red-500'
                    : 'border-secondary/60 bg-secondary/20 text-white hover:border-secondary hover:bg-secondary/40 backdrop-blur-md'
                }`}
              >
                <span className="text-sm">{dso.emoji}</span>
                <span className="whitespace-nowrap">{dso.name}</span>
              </div>
            </Html>

            {/* Glowing Nebular Halo */}
            <mesh scale={isSelected ? 4.5 : 3.0}>
              <sphereGeometry args={[1.5, 24, 24]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={nightVision ? 0.2 : 0.4}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// 4. CONSTELLATION LASER CONNECTIONS & CENTROIDS
// -------------------------------------------------------------
function ConstellationLines({
  visible,
  nightVision
}: {
  visible: boolean;
  nightVision: boolean;
}) {
  const lineGeometries = useMemo(() => {
    if (!visible) return [];

    return constellationLines.map((c) => {
      const points: THREE.Vector3[] = [];
      let center = new THREE.Vector3(0, 0, 0);
      let count = 0;

      c.lines.forEach(([idx1, idx2]) => {
        if (stars[idx1] && stars[idx2]) {
          const p1 = celestialToCartesian(stars[idx1].ra, stars[idx1].dec, SPHERE_RADIUS * 0.99);
          const p2 = celestialToCartesian(stars[idx2].ra, stars[idx2].dec, SPHERE_RADIUS * 0.99);
          const v1 = new THREE.Vector3(...p1);
          const v2 = new THREE.Vector3(...p2);
          points.push(v1);
          points.push(v2);

          center.add(v1).add(v2);
          count += 2;
        }
      });

      if (count > 0) center.divideScalar(count);

      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return { geom, center, name: c.turkishName || c.constellation };
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <group>
      {lineGeometries.map((item, idx) => (
        <group key={idx}>
          <lineSegments geometry={item.geom}>
            <lineBasicMaterial
              color={nightVision ? '#ff1111' : '#00d4ff'}
              transparent
              opacity={nightVision ? 0.25 : 0.35}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>

          {/* Centroid Turkish Constellation Name */}
          <Html distanceFactor={60} position={[item.center.x, item.center.y, item.center.z]} center>
            <div
              className={`pointer-events-none select-none text-[11px] font-mono font-bold tracking-widest uppercase transition-opacity ${
                nightVision ? 'text-red-500/80' : 'text-primary/70'
              }`}
            >
              {item.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 5. OBSERVER HORIZON RING & CARDINAL COMPASS
// -------------------------------------------------------------
function CelestialCompass({ visible, nightVision }: { visible: boolean; nightVision: boolean }) {
  const directions = [
    { label: 'K (0°)', ra: 0, dec: 0, text: 'KUZEY' },
    { label: 'KD (45°)', ra: 45, dec: 0, text: 'KD' },
    { label: 'D (90°)', ra: 90, dec: 0, text: 'DOĞU' },
    { label: 'GD (135°)', ra: 135, dec: 0, text: 'GD' },
    { label: 'G (180°)', ra: 180, dec: 0, text: 'GÜNEY' },
    { label: 'GB (225°)', ra: 225, dec: 0, text: 'GB' },
    { label: 'B (270°)', ra: 270, dec: 0, text: 'BATI' },
    { label: 'KB (315°)', ra: 315, dec: 0, text: 'KB' },
  ];

  if (!visible) return null;

  return (
    <group>
      {/* Horizon Celestial Equator Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SPHERE_RADIUS * 0.98, SPHERE_RADIUS * 0.985, 128]} />
        <meshBasicMaterial
          color={nightVision ? '#ff2222' : '#00d4ff'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Compass Directions on Horizon */}
      {directions.map((d, i) => {
        const [x, y, z] = celestialToCartesian(d.ra, d.dec, SPHERE_RADIUS * 0.97);
        return (
          <Html key={i} distanceFactor={55} position={[x, y, z]} center>
            <div
              className={`pointer-events-none select-none rounded border px-2 py-0.5 text-[11px] font-mono font-bold tracking-widest ${
                nightVision
                  ? 'border-red-900 bg-red-950/70 text-red-400'
                  : 'border-primary/40 bg-background/80 text-primary backdrop-blur-xs'
              }`}
            >
              {d.text}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// 6. CELESTIAL ROTATION CONTROLLER (Diurnal Motion)
// -------------------------------------------------------------
function DiurnalMotionGroup({
  isRotating,
  children
}: {
  isRotating: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      // Rotate around Earth's celestial axis (Y)
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// -------------------------------------------------------------
// MAIN PLANETARIUM COMPONENT
// -------------------------------------------------------------
export function Planetarium3D() {
  const [selectedStar, setSelectedStar] = useState<StarData | null>(stars[0]);
  const [selectedDso, setSelectedDso] = useState<DeepSkyObject | null>(null);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const starMatches = stars
      .filter((s) => s.name.toLowerCase().includes(q) || (s.turkishName && s.turkishName.toLowerCase().includes(q)))
      .slice(0, 5)
      .map((s) => ({ type: 'star' as const, data: s }));
    const dsoMatches = deepSkyObjects
      .filter((d) => d.name.toLowerCase().includes(q) || d.catalog.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({ type: 'dso' as const, data: d }));
    return [...starMatches, ...dsoMatches];
  }, [searchQuery]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden select-none transition-colors duration-500 ${
        nightVision ? 'bg-[#090000]' : 'bg-[#030308]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 62, near: 0.1, far: 250 }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={[nightVision ? '#080002' : '#030309']} />

        {/* Inverted Orbit Controls looking outward at celestial sphere */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.45}
          zoomSpeed={0.8}
          minDistance={0.05}
          maxDistance={45}
        />

        {/* Diurnal Sky Rotation Group */}
        <DiurnalMotionGroup isRotating={isRotating}>
          {/* Milky Way Galactic Plane & Core */}
          <MilkyWayArch nightVision={nightVision} />

          {/* Stars */}
          <CelestialStars
            onSelectStar={(star) => {
              setSelectedStar(star);
              setSelectedDso(null);
            }}
            selectedStar={selectedStar}
            nightVision={nightVision}
          />

          {/* Deep Sky Objects */}
          <DeepSkyLayer
            onSelectDso={(dso) => {
              setSelectedDso(dso);
              setSelectedStar(null);
            }}
            selectedDso={selectedDso}
            nightVision={nightVision}
          />

          {/* Constellations */}
          <ConstellationLines visible={showConstellations} nightVision={nightVision} />

          {/* Horizon & Compass */}
          <CelestialCompass visible={showCompass} nightVision={nightVision} />
        </DiurnalMotionGroup>
      </Canvas>

      {/* TOP CONTROLS & SEARCH BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Title Badge */}
        <div
          className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all ${
            nightVision
              ? 'border-red-900 bg-red-950/85 text-red-400'
              : 'border-primary/25 bg-background/85 text-foreground'
          }`}
        >
          <Sparkles className={`h-5 w-5 animate-pulse ${nightVision ? 'text-red-500' : 'text-primary'}`} />
          <div>
            <h1 className="text-sm font-bold tracking-tight">3D Planetaryum & Gök Kubbe</h1>
            <p className={`text-[10px] ${nightVision ? 'text-red-400/80' : 'text-text-secondary'}`}>
              360° Etkileşimli Samanyolu, Takımyıldızlar & Derin Uzay
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pointer-events-auto relative w-72">
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 backdrop-blur-xl ${
              nightVision
                ? 'border-red-900 bg-red-950/80 text-red-300'
                : 'border-card-border bg-card-bg/80 text-foreground'
            }`}
          >
            <Search size={14} className={nightVision ? 'text-red-500' : 'text-text-secondary'} />
            <input
              type="text"
              placeholder="Yıldız veya Bulutsu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs outline-none placeholder:text-text-secondary/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-text-secondary hover:text-white">
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl z-30 ${
                nightVision ? 'border-red-900 bg-red-950/95' : 'border-card-border bg-card-bg/95'
              }`}
            >
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (res.type === 'star') {
                      setSelectedStar(res.data);
                      setSelectedDso(null);
                    } else {
                      setSelectedDso(res.data);
                      setSelectedStar(null);
                    }
                    setSearchQuery('');
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs cursor-pointer transition-all ${
                    nightVision ? 'hover:bg-red-900/50 text-red-300' : 'hover:bg-primary/20 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{res.type === 'star' ? '⭐' : res.data.emoji}</span>
                    <span className="font-bold">{res.data.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {res.type === 'star' ? `Mag ${res.data.magnitude}` : res.data.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature Toggles */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Constellation Toggle */}
          <button
            onClick={() => setShowConstellations(!showConstellations)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
              showConstellations
                ? nightVision
                  ? 'border-red-700 bg-red-900/40 text-red-400'
                  : 'border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                : 'border-card-border bg-card-bg/80 text-text-secondary hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Takımyıldızlar</span>
          </button>

          {/* Compass Toggle */}
          <button
            onClick={() => setShowCompass(!showCompass)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
              showCompass
                ? nightVision
                  ? 'border-red-700 bg-red-900/40 text-red-400'
                  : 'border-secondary bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'border-card-border bg-card-bg/80 text-text-secondary hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span className="hidden sm:inline">Pusula & Ufuk</span>
          </button>

          {/* Diurnal Earth Rotation Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
              isRotating
                ? 'border-star-gold bg-star-gold/20 text-star-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                : 'border-card-border bg-card-bg/80 text-text-secondary hover:text-white'
            }`}
            title="Gökyüzü Dönüşü"
          >
            {isRotating ? <Pause size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline">Zaman Akışı</span>
          </button>

          {/* Night Vision Mode */}
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
              nightVision
                ? 'border-red-600 bg-red-700 text-white shadow-[0_0_20px_rgba(255,0,0,0.6)]'
                : 'border-card-border bg-card-bg/80 text-text-secondary hover:text-white'
            }`}
            title="Gözlemevi Kırmızı Gece Görüş Modu"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Kırmızı Mod</span>
          </button>
        </div>
      </div>

      {/* QUICK JUMP CHIPS (Famous Landmarks) */}
      <div className="absolute top-18 left-4 z-20 pointer-events-none flex flex-wrap gap-1.5">
        {[
          { name: 'Sirius', type: 'star' },
          { name: 'Betelgeuse', type: 'star' },
          { name: 'Vega', type: 'star' },
          { name: 'Andromeda', type: 'dso' },
          { name: 'Orion Bulutsusu', type: 'dso' },
          { name: 'Pleiades', type: 'dso' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (item.type === 'star') {
                const s = stars.find((st) => st.name.toLowerCase().includes(item.name.toLowerCase()));
                if (s) {
                  setSelectedStar(s);
                  setSelectedDso(null);
                }
              } else {
                const d = deepSkyObjects.find((ds) => ds.name.toLowerCase().includes(item.name.toLowerCase()));
                if (d) {
                  setSelectedDso(d);
                  setSelectedStar(null);
                }
              }
            }}
            className={`pointer-events-auto rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium backdrop-blur-md transition-all ${
              nightVision
                ? 'border-red-900 bg-red-950/70 text-red-300 hover:border-red-600'
                : 'border-primary/20 bg-background/60 text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* STAR / DSO INSPECTION PANEL */}
      {selectedStar && (
        <div
          className={`absolute bottom-6 left-6 z-20 max-w-sm rounded-3xl border p-5 shadow-2xl backdrop-blur-2xl transition-all ${
            nightVision
              ? 'border-red-800 bg-red-950/90 text-red-200 shadow-[0_0_40px_rgba(255,0,0,0.2)]'
              : 'border-primary/30 bg-background/90 text-foreground shadow-[0_0_40px_rgba(0,0,0,0.8)]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-card-border/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Crosshair className={`h-4 w-4 animate-spin ${nightVision ? 'text-red-500' : 'text-primary'}`} />
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${nightVision ? 'text-red-400' : 'text-primary'}`}>
                YILDIZ SPEKTRAL ANALİZİ
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                nightVision
                  ? 'border-red-800 bg-red-900/40 text-red-300'
                  : 'border-primary/20 bg-primary/10 text-primary'
              }`}
            >
              MAG {selectedStar.magnitude}
            </span>
          </div>

          <h2 className="text-2xl font-black mb-0.5">
            {selectedStar.turkishName || selectedStar.name}
          </h2>
          {selectedStar.turkishName && (
            <div className={`text-xs font-mono italic mb-3 ${nightVision ? 'text-red-400' : 'text-secondary'}`}>
              Katalog: {selectedStar.name}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3">
            <div className={`rounded-xl p-2.5 border ${nightVision ? 'border-red-900 bg-red-900/20' : 'border-card-border bg-card-bg/80'}`}>
              <span className="text-[10px] text-text-secondary block">Sağ Açıklık (RA)</span>
              <span className="font-bold">{selectedStar.ra.toFixed(2)}°</span>
            </div>

            <div className={`rounded-xl p-2.5 border ${nightVision ? 'border-red-900 bg-red-900/20' : 'border-card-border bg-card-bg/80'}`}>
              <span className="text-[10px] text-text-secondary block">Dik Açıklık (DEC)</span>
              <span className="font-bold">{selectedStar.dec.toFixed(2)}°</span>
            </div>

            <div className={`rounded-xl p-2.5 border ${nightVision ? 'border-red-900 bg-red-900/20' : 'border-card-border bg-card-bg/80'}`}>
              <span className="text-[10px] text-text-secondary block">Parlaklık</span>
              <span className="font-bold text-star-gold">{selectedStar.magnitude} m</span>
            </div>

            <div className={`rounded-xl p-2.5 border ${nightVision ? 'border-red-900 bg-red-900/20' : 'border-card-border bg-card-bg/80'}`}>
              <span className="text-[10px] text-text-secondary block">Spektral Renk</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="h-3 w-3 rounded-full border border-white/20 inline-block"
                  style={{ backgroundColor: selectedStar.color }}
                />
                <span className="font-bold uppercase text-[11px]">{selectedStar.color}</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-text-secondary leading-relaxed">
            {selectedStar.constellation ? `${selectedStar.constellation} takımyıldızı bölgesinde parıldayan kilit referans yıldızı.` : 'Gökyüzü seyrüseferinin en parlak kılavuz yıldızlarından biridir.'}
          </p>
        </div>
      )}

      {/* DSO INSPECTION PANEL */}
      {selectedDso && (
        <div
          className={`absolute bottom-6 left-6 z-20 max-w-sm rounded-3xl border p-5 shadow-2xl backdrop-blur-2xl transition-all ${
            nightVision
              ? 'border-red-800 bg-red-950/90 text-red-200'
              : 'border-accent/40 bg-background/90 text-foreground'
          }`}
        >
          <div className="flex items-center justify-between border-b border-card-border/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedDso.emoji}</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-accent">
                DERİN UZAY CİSMİ (DSO)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-accent/30 bg-accent/10 text-accent">
              {selectedDso.catalog}
            </span>
          </div>

          <h2 className="text-xl font-black mb-1">{selectedDso.name}</h2>
          <div className="text-xs text-secondary font-mono mb-3">{selectedDso.distanceLightYears}</div>

          {selectedDso.image && (
            <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 border border-white/10 group">
              <img
                src={selectedDso.image}
                alt={selectedDso.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-mono text-white/80 backdrop-blur-xs">
                Hubble / JWST Spektrumu
              </div>
            </div>
          )}

          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            {selectedDso.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded-xl border border-card-border bg-card-bg/80 p-2">
              <span className="text-[10px] text-text-secondary block">Tür</span>
              <span className="font-bold capitalize">{selectedDso.type}</span>
            </div>
            <div className="rounded-xl border border-card-border bg-card-bg/80 p-2">
              <span className="text-[10px] text-text-secondary block">Görünür Parlaklık</span>
              <span className="font-bold text-star-gold">{selectedDso.magnitude} m</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
