'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { stars, constellationLines, deepSkyObjects, StarData, DeepSkyObject } from '@/data/stars';
import {
  UserLocation,
  POPULAR_LOCATIONS,
  getLocalSiderealTime,
  raDecToAltAz,
  altAzToCartesian
} from '@/utils/astronomy';
import { ArCameraOverlay } from './ArCameraOverlay';
import { Ticks } from '@/components/motion/primitives';
import {
  Compass,
  Layers,
  Search,
  Camera,
  MapPin,
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  Moon
} from 'lucide-react';

const SPHERE_RADIUS = 90;

// -------------------------------------------------------------
// 1. CELESTIAL STARS LAYER (With Real-Time Location Alt-Az Transform)
// -------------------------------------------------------------
function RealTimeStars({
  location,
  lst,
  useLocalHorizon,
  nightVision,
  opacity,
  onSelectStar,
  selectedStar
}: {
  location: UserLocation;
  lst: number;
  useLocalHorizon: boolean;
  nightVision: boolean;
  opacity: number;
  onSelectStar: (star: StarData) => void;
  selectedStar: StarData | null;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Compute 3D positions and colors based on real-time Alt/Az or Equatorial
  const { positions, colors, starPositionsMap } = useMemo(() => {
    const pos = new Float32Array(stars.length * 3);
    const col = new Float32Array(stars.length * 3);
    const map = new Map<string, [number, number, number]>();

    stars.forEach((star, idx) => {
      let x = 0, y = 0, z = 0;

      if (useLocalHorizon) {
        // True Topocentric Alt-Azimuth projection
        const { alt, az, isVisible } = raDecToAltAz(star.ra, star.dec, location.latitude, lst);
        [x, y, z] = altAzToCartesian(alt, az, SPHERE_RADIUS);

        // Dim stars below the physical horizon
        const horizonFactor = isVisible ? 1.0 : 0.08;

        const c = new THREE.Color(star.color);
        if (nightVision) {
          col[idx * 3] = 0.9 * horizonFactor;
          col[idx * 3 + 1] = 0.1 * horizonFactor;
          col[idx * 3 + 2] = 0.1 * horizonFactor;
        } else {
          col[idx * 3] = c.r * horizonFactor;
          col[idx * 3 + 1] = c.g * horizonFactor;
          col[idx * 3 + 2] = c.b * horizonFactor;
        }
      } else {
        // Celestial Equatorial Sphere
        const raRad = (star.ra * Math.PI) / 180;
        const decRad = (star.dec * Math.PI) / 180;
        x = SPHERE_RADIUS * Math.cos(decRad) * Math.cos(raRad);
        y = SPHERE_RADIUS * Math.sin(decRad);
        z = SPHERE_RADIUS * Math.cos(decRad) * Math.sin(raRad);

        const c = new THREE.Color(star.color);
        if (nightVision) {
          col[idx * 3] = 0.9;
          col[idx * 3 + 1] = 0.1;
          col[idx * 3 + 2] = 0.1;
        } else {
          col[idx * 3] = c.r;
          col[idx * 3 + 1] = c.g;
          col[idx * 3 + 2] = c.b;
        }
      }

      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;
      map.set(star.name, [x, y, z]);
    });

    return { positions: pos, colors: col, starPositionsMap: map };
  }, [location, lst, useLocalHorizon, nightVision]);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.8}
          vertexColors
          transparent
          opacity={opacity}
          sizeAttenuation={true}
        />
      </points>

      {/* Clickable Interactive Target Markers for 25 Brightest Stars */}
      {stars.slice(0, 30).map((star) => {
        const coords = starPositionsMap.get(star.name);
        if (!coords) return null;
        const isSelected = selectedStar?.name === star.name;

        return (
          <mesh
            key={star.name}
            position={coords}
            onClick={(e) => {
              e.stopPropagation();
              onSelectStar(star);
            }}
          >
            <sphereGeometry args={[isSelected ? 1.6 : 0.8, 16, 16]} />
            <meshBasicMaterial
              color={isSelected ? '#00e5ff' : nightVision ? '#ff3333' : star.color}
              transparent
              opacity={isSelected ? 0.95 : 0.4}
            />

          </mesh>
        );
      })}

      {/* Selected star label — one persistent label that follows the selection */}
      <Html position={(selectedStar && starPositionsMap.get(selectedStar.name)) || [0, 0, 0]} distanceFactor={40} center>
        <div
          className={`pointer-events-none select-none rounded-full border border-primary/80 bg-ink/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-primary shadow-[0_0_15px_rgba(255,91,34,0.6)] backdrop-blur-md ${
            selectedStar ? '' : 'hidden'
          }`}
        >
          {selectedStar ? selectedStar.turkishName || selectedStar.name : ''}
        </div>
      </Html>
    </>
  );
}

// -------------------------------------------------------------
// 2. CONSTELLATION LINES (Connected accurately in Real-Time 3D)
// -------------------------------------------------------------
function RealTimeConstellationLines({
  visible,
  location,
  lst,
  useLocalHorizon,
  nightVision,
  opacity
}: {
  visible: boolean;
  location: UserLocation;
  lst: number;
  useLocalHorizon: boolean;
  nightVision: boolean;
  opacity: number;
}) {
  const linesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    const getStarCoords = (star: StarData): THREE.Vector3 => {
      if (useLocalHorizon) {
        const { alt, az } = raDecToAltAz(star.ra, star.dec, location.latitude, lst);
        const [x, y, z] = altAzToCartesian(alt, az, SPHERE_RADIUS * 0.99);
        return new THREE.Vector3(x, y, z);
      } else {
        const raRad = (star.ra * Math.PI) / 180;
        const decRad = (star.dec * Math.PI) / 180;
        return new THREE.Vector3(
          SPHERE_RADIUS * 0.99 * Math.cos(decRad) * Math.cos(raRad),
          SPHERE_RADIUS * 0.99 * Math.sin(decRad),
          SPHERE_RADIUS * 0.99 * Math.cos(decRad) * Math.sin(raRad)
        );
      }
    };

    const starMap = new Map<number, THREE.Vector3>();
    stars.forEach((s, idx) => {
      starMap.set(idx, getStarCoords(s));
    });

    constellationLines.forEach((c) => {
      c.lines.forEach(([i1, i2]) => {
        const p1 = starMap.get(i1);
        const p2 = starMap.get(i2);
        if (p1 && p2) {
          points.push(p1, p2);
        }
      });
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [location, lst, useLocalHorizon]);

  // lst ticks every second: free each superseded geometry's GPU buffers.
  useEffect(() => () => linesGeometry.dispose(), [linesGeometry]);

  return (
    <lineSegments geometry={linesGeometry} visible={visible}>
      <lineBasicMaterial
        color={nightVision ? '#880000' : '#4da6ff'}
        transparent
        opacity={nightVision ? 0.35 : 0.28 * opacity}
      />
    </lineSegments>
  );
}

// -------------------------------------------------------------
// 3. PHYSICAL GROUND HORIZON & COMPASS CARDINALS
// -------------------------------------------------------------
function LocalGroundHorizon({
  visible,
  nightVision
}: {
  visible: boolean;
  nightVision: boolean;
}) {
  const cardinals = [
    { label: 'K (0°)', az: 0, color: '#00e5ff' },
    { label: 'D (90°)', az: 90, color: '#ffffff' },
    { label: 'G (180°)', az: 180, color: '#ffb470' },
    { label: 'B (270°)', az: 270, color: '#ffffff' },
  ];

  return (
    <group visible={visible}>
      {/* 1. Ground Disk (Horizon Mask below feet) */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[SPHERE_RADIUS * 0.98, 64]} />
        <meshBasicMaterial
          color={nightVision ? '#150000' : '#03080e'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Luminous Horizon Ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SPHERE_RADIUS * 0.97, SPHERE_RADIUS * 0.99, 64]} />
        <meshBasicMaterial
          color={nightVision ? '#550000' : '#1a4466'}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Cardinal Direction Markers */}
      {cardinals.map((c) => {
        const [x, y, z] = altAzToCartesian(1.2, c.az, SPHERE_RADIUS * 0.92);
        return (
          <Html key={c.label} position={[x, y, z]} center>
            <div className={`pointer-events-none select-none rounded-md px-2 py-0.5 text-xs font-mono font-bold tracking-widest border backdrop-blur-md ${visible ? '' : 'hidden'} ${
              nightVision
                ? 'border-red-800 bg-red-950/80 text-red-400'
                : 'border-paper/10 bg-ink/60 text-paper shadow-[0_0_10px_rgba(0,0,0,0.8)]'
            }`}>
              {c.label}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// 4. DEEP SKY MESSIER OBJECTS (With Telescopic Real-Time Coords)
// -------------------------------------------------------------
function RealTimeDeepSky({
  location,
  lst,
  useLocalHorizon,
  nightVision,
  onSelectDso,
  selectedDso
}: {
  location: UserLocation;
  lst: number;
  useLocalHorizon: boolean;
  nightVision: boolean;
  onSelectDso: (dso: DeepSkyObject) => void;
  selectedDso: DeepSkyObject | null;
}) {
  return (
    <group>
      {deepSkyObjects.map((dso) => {
        let x = 0, y = 0, z = 0;
        let isVisible = true;

        if (useLocalHorizon) {
          const res = raDecToAltAz(dso.ra, dso.dec, location.latitude, lst);
          [x, y, z] = altAzToCartesian(res.alt, res.az, SPHERE_RADIUS * 0.98);
          isVisible = res.isVisible;
        } else {
          const raRad = (dso.ra * Math.PI) / 180;
          const decRad = (dso.dec * Math.PI) / 180;
          x = SPHERE_RADIUS * 0.98 * Math.cos(decRad) * Math.cos(raRad);
          y = SPHERE_RADIUS * 0.98 * Math.sin(decRad);
          z = SPHERE_RADIUS * 0.98 * Math.cos(decRad) * Math.sin(raRad);
        }

        const isSelected = selectedDso?.id === dso.id;

        return (
          <group key={dso.id} position={[x, y, z]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectDso(dso);
              }}
            >
              <sphereGeometry args={[isSelected ? 2.0 : 1.2, 16, 16]} />
              <meshBasicMaterial
                color={nightVision ? '#ff4444' : dso.color}
                transparent
                opacity={isVisible ? (isSelected ? 0.9 : 0.55) : 0.1}
              />
            </mesh>

            <Html distanceFactor={45} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDso(dso);
                }}
                className={`cursor-pointer pointer-events-auto select-none rounded-full px-2 py-0.5 text-[9px] font-mono font-bold tracking-wide border whitespace-nowrap transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary scale-110 shadow-[0_0_15px_rgba(255,91,34,0.7)]'
                    : 'border-paper/10 bg-ink/60 text-paper/75 hover:text-paper'
                }`}
              >
                <span>{dso.emoji} </span>
                <span>{dso.name}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// MAIN 3D PLANETARIUM VIEW
// -------------------------------------------------------------
export function Planetarium3D() {
  const [selectedLocation, setSelectedLocation] = useState<UserLocation>(POPULAR_LOCATIONS[0]); // Istanbul default
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeFlowRate, setTimeFlowRate] = useState(1); // 1 = Real-time, 60 = fast, 0 = paused
  const [useLocalHorizon, setUseLocalHorizon] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [isArActive, setIsArActive] = useState(false);
  const [arOpacity, setArOpacity] = useState(0.85);

  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [selectedDso, setSelectedDso] = useState<DeepSkyObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);

  // Live Time Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000 * timeFlowRate));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeFlowRate]);

  // Compute Current Local Sidereal Time (LST)
  const currentLst = useMemo(() => {
    return getLocalSiderealTime(currentTime, selectedLocation.longitude);
  }, [currentTime, selectedLocation]);

  // GPS Auto-detection
  const handleAutoGps = () => {
    if (!navigator.geolocation) {
      alert('Cihazınızda GPS konumu desteklenmiyor.');
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedLocation({
          city: 'Mevcut GPS Konumunuz',
          latitude: parseFloat(pos.coords.latitude.toFixed(4)),
          longitude: parseFloat(pos.coords.longitude.toFixed(4)),
          isCustomGps: true
        });
        setIsGpsLoading(false);
        setIsLocDropdownOpen(false);
      },
      (err) => {
        console.warn('GPS Error:', err);
        alert('Konum izni alınamadı. Şehir listesinden seçim yapabilirsiniz.');
        setIsGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const starMatches = stars
      .filter((s) => s.name.toLowerCase().includes(q) || s.turkishName?.toLowerCase().includes(q))
      .slice(0, 4)
      .map((s) => ({ type: 'star' as const, data: s }));
    const dsoMatches = deepSkyObjects
      .filter((d) => d.name.toLowerCase().includes(q) || d.catalog.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({ type: 'dso' as const, data: d }));
    return [...starMatches, ...dsoMatches];
  }, [searchQuery]);

  return (
    <div className={`relative h-full w-full overflow-hidden select-none ${nightVision ? 'bg-[#090000]' : 'bg-[#020206]'}`}>
      {/* 1. Optional Live AR Camera Overlay */}
      <ArCameraOverlay
        isActive={isArActive}
        onClose={() => setIsArActive(false)}
        opacity={arOpacity}
        setOpacity={setArOpacity}
      />

      {/* 2. 3D WebGL Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 0.1], fov: 65, near: 0.1, far: 300 }}
        className="h-full w-full cursor-grab active:cursor-grabbing z-10"
        gl={{ alpha: true, powerPreference: 'high-performance' }}
      >
        {!isArActive && <color attach="background" args={[nightVision ? '#090002' : '#020206']} />}

        {/* Look-around Orbit Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.45}
          zoomSpeed={0.8}
          minDistance={0.05}
          maxDistance={45}
        />

        {/* Real-time Alt-Az Stars */}
        <RealTimeStars
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
          nightVision={nightVision}
          opacity={isArActive ? arOpacity : 1.0}
          onSelectStar={(star) => {
            setSelectedStar(star);
            setSelectedDso(null);
          }}
          selectedStar={selectedStar}
        />

        {/* Constellation Lines */}
        <RealTimeConstellationLines
          visible={showConstellations}
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
          nightVision={nightVision}
          opacity={isArActive ? arOpacity : 1.0}
        />

        {/* Ground Horizon & Compass */}
        <LocalGroundHorizon
          visible={useLocalHorizon}
          nightVision={nightVision}
        />

        {/* Real-Time Deep Sky Objects */}
        <RealTimeDeepSky
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
          nightVision={nightVision}
          onSelectDso={(dso) => {
            setSelectedDso(dso);
            setSelectedStar(null);
          }}
          selectedDso={selectedDso}
        />
      </Canvas>

      {/* 3. TOP TELEMETRY & LOCATION CONTROL BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Location & Real-Time Sidereal Indicator */}
        <div className="pointer-events-auto relative">
          <button
            onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
            className="flex items-center gap-2.5 border border-line bg-ink/90 px-3.5 py-2 text-xs font-mono backdrop-blur-xl shadow-2xl hover:border-paper/40 transition-colors text-left cursor-pointer"
          >
            <MapPin size={13} className="text-lime animate-pulse" />
            <div>
              <div className="font-bold text-paper flex items-center gap-1.5">
                <span>{selectedLocation.city}</span>
                <ChevronDown size={11} className="text-muted" />
              </div>
              <div className="label text-[9px] text-muted">
                {selectedLocation.latitude}°K · LST: {(currentLst / 15).toFixed(1)}h
              </div>
            </div>
          </button>

          {/* Location Selector Dropdown */}
          {isLocDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 border border-line bg-ink/95 p-2 shadow-2xl backdrop-blur-2xl z-30 space-y-1 font-mono text-xs">
              <button
                onClick={handleAutoGps}
                disabled={isGpsLoading}
                className="w-full flex items-center gap-2 border border-line bg-ink-2 text-lime p-2 hover:bg-ink-3 transition-colors label text-left cursor-pointer"
              >
                <RefreshCw size={12} className={isGpsLoading ? 'animate-spin' : ''} />
                <span>{isGpsLoading ? 'GPS Alınıyor...' : 'Otomatik GPS Konumu Al'}</span>
              </button>

              <div className="label text-[9px] text-muted uppercase px-2 pt-2">
                Hazır Şehirler
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc.city}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 transition-colors flex justify-between cursor-pointer ${
                      selectedLocation.city === loc.city ? 'bg-lime text-ink font-bold' : 'text-paper/75 hover:bg-ink-2'
                    }`}
                  >
                    <span>{loc.city}</span>
                    <span className="label text-[9px] text-muted">{loc.latitude}°</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="pointer-events-auto relative w-60 sm:w-72">
          <div className="flex items-center gap-2 border border-line bg-ink/90 px-3 py-1.5 backdrop-blur-xl text-xs">
            <Search size={13} className="text-muted" />
            <input
              type="text"
              placeholder="Yıldız veya Bulutsu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-paper outline-none placeholder:text-muted font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-muted hover:text-paper cursor-pointer">
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto border border-line bg-ink/95 p-2 shadow-2xl backdrop-blur-2xl z-30 font-mono text-xs">
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
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-ink-2 text-paper transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{res.type === 'star' ? '⭐' : res.data.emoji}</span>
                    <span className="font-bold">{res.data.name}</span>
                  </div>
                  <span className="label text-[10px] text-muted">
                    {res.type === 'star' ? `Mag ${res.data.magnitude}` : res.data.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feature & AR Camera Toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* AR Camera Toggle Button */}
          <button
            onClick={() => setIsArActive(!isArActive)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              isArActive
                ? 'border-lime bg-lime text-ink font-bold'
                : 'border-line bg-ink/90 text-paper/75 hover:bg-ink-3'
            }`}
            title="Kamerayı Aç / AR Moduna Geç"
          >
            <Camera size={13} className={isArActive ? 'animate-bounce' : ''} />
            <span className="hidden sm:inline">{isArActive ? 'AR Açık' : 'AR Kamera'}</span>
          </button>

          {/* Horizon Toggle */}
          <button
            type="button"
            aria-pressed={useLocalHorizon}
            onClick={() => setUseLocalHorizon(!useLocalHorizon)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              useLocalHorizon
                ? 'border-line bg-paper text-ink font-bold'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Yerel Ufuk / Tüm Gök Küre"
          >
            <Compass size={13} />
            <span className="hidden md:inline">{useLocalHorizon ? 'Ufuk Aktif' : 'Tüm Küre'}</span>
          </button>

          {/* Constellation Toggle */}
          <button
            type="button"
            aria-pressed={showConstellations}
            aria-label="Takımyıldız çizgileri"
            onClick={() => setShowConstellations(!showConstellations)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              showConstellations
                ? 'border-line bg-paper text-ink font-bold'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Takımyıldız Çizgileri"
          >
            <Layers size={13} />
          </button>

          {/* Red night-vision mode (preserves dark adaptation at the eyepiece) */}
          <button
            type="button"
            aria-pressed={nightVision}
            aria-label="Kırmızı gece görüş modu"
            onClick={() => setNightVision(!nightVision)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              nightVision
                ? 'border-rose-signal bg-rose-signal/25 text-rose-signal font-bold'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Kırmızı Gece Görüş Modu"
          >
            <Moon size={13} />
          </button>

          {/* Time Flow Speed */}
          <button
            type="button"
            aria-label="Zaman hızı: canlı, 60 kat hızlı veya duraklatılmış"
            onClick={() => setTimeFlowRate((prev) => (prev === 1 ? 60 : prev === 60 ? 0 : 1))}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              timeFlowRate > 1
                ? 'border-lime bg-lime text-ink font-bold'
                : timeFlowRate === 0
                ? 'border-rose-signal bg-rose-signal/20 text-rose-signal'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Zaman Hızı (Canlı / Hızlı / Duraklat)"
          >
            {timeFlowRate === 0 ? <Pause size={12} /> : <Play size={12} />}
            <span className="hidden sm:inline">{timeFlowRate === 0 ? 'Durduruldu' : timeFlowRate > 1 ? '60x Hızlı' : 'Canlı'}</span>
          </button>
        </div>
      </div>

      {/* 4. STAR INSPECTION PANEL */}
      {selectedStar && (
        <div className="ticks absolute bottom-6 left-6 z-20 max-w-sm border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper font-mono">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <span className="label text-lime">
              Yıldız Spektrumu
            </span>
            <button onClick={() => setSelectedStar(null)} className="label text-muted hover:text-paper cursor-pointer">✕</button>
          </div>

          <h2 className="display display-tight text-xl font-bold">{selectedStar.turkishName || selectedStar.name}</h2>
          <div className="label text-muted mb-3">{selectedStar.constellation} Takımyıldızı</div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-2.5">
              <span className="label text-muted block">Görünür Kadir</span>
              <span className="font-bold text-lime">{selectedStar.magnitude} mag</span>
            </div>
            <div className="bg-ink p-2.5">
              <span className="label text-muted block">Sağ Açıklık (RA)</span>
              <span className="font-bold text-paper">{selectedStar.ra.toFixed(1)}°</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. DSO INSPECTION PANEL */}
      {selectedDso && (
        <div className="ticks absolute bottom-6 left-6 z-20 max-w-sm border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{selectedDso.emoji}</span>
              <span className="label text-lime">
                Derin Uzay Cismi
              </span>
            </div>
            <button onClick={() => setSelectedDso(null)} className="label text-muted hover:text-paper cursor-pointer">✕</button>
          </div>

          <h2 className="display display-tight text-xl font-bold mb-1">{selectedDso.name}</h2>
          <div className="label text-muted mb-3">{selectedDso.distanceLightYears}</div>

          {selectedDso.image && (
            <div className="relative h-32 w-full border border-line overflow-hidden mb-3 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedDso.image}
                alt={selectedDso.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-1 right-1 label px-2 py-0.5 bg-ink/80 border border-line text-[9px] text-paper/80">
                Hubble / JWST
              </div>
            </div>
          )}

          <p className="text-xs text-paper/75 leading-relaxed mb-3">
            {selectedDso.description}
          </p>

          <div className="grid grid-cols-2 gap-px border border-line bg-line font-mono text-xs">
            <div className="bg-ink p-2.5">
              <span className="label text-muted block">Tür</span>
              <span className="font-bold capitalize text-paper">{selectedDso.type}</span>
            </div>
            <div className="bg-ink p-2.5">
              <span className="label text-muted block">Katalog</span>
              <span className="font-bold text-lime">{selectedDso.catalog}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
