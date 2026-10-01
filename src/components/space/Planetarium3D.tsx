'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useInView } from '@/lib/useInView';
import { matchesQuery } from '@/lib/text';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  stars,
  constellationLines,
  deepSkyObjects,
  StarData,
  DeepSkyObject,
  DetailedConstellation,
  DETAILED_CONSTELLATIONS
} from '@/data/stars';
import {
  UserLocation,
  POPULAR_LOCATIONS,
  getLocalSiderealTime,
  raDecToAltAz,
  altAzToCartesian
} from '@/utils/astronomy';
import {
  computeSkyDomeSolarSystem,
  CelestialBodyDomeState,
  galacticToEquatorial,
  generateMilkyWayParticles
} from '@/lib/astrophysics/skyDomeEphemeris';
import {
  PlanetGlyph,
  TelescopeGlyph,
  GalaxySpiralGlyph,
  VectorMoonPhase,
  ConstellationGlyph
} from '@/components/ui/CosmicGlyphs';
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
  Moon,
  Sparkles,
  Orbit
} from 'lucide-react';

const SPHERE_RADIUS = 90;

let cachedStarTexture: THREE.Texture | null = null;
function getStarTexture(): THREE.Texture {
  if (cachedStarTexture) return cachedStarTexture;
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.12, 'rgba(255, 255, 255, 0.98)');
  gradient.addColorStop(0.32, 'rgba(235, 245, 255, 0.6)');
  gradient.addColorStop(0.65, 'rgba(180, 220, 255, 0.18)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 10);
  ctx.lineTo(32, 54);
  ctx.moveTo(10, 32);
  ctx.lineTo(54, 32);
  ctx.stroke();

  cachedStarTexture = new THREE.CanvasTexture(canvas);
  cachedStarTexture.needsUpdate = true;
  return cachedStarTexture;
}

let cachedMwTexture: THREE.Texture | null = null;
function getMilkyWayTexture(): THREE.Texture {
  if (cachedMwTexture) return cachedMwTexture;
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.35, 'rgba(210, 230, 255, 0.35)');
  gradient.addColorStop(0.7, 'rgba(160, 190, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  cachedMwTexture = new THREE.CanvasTexture(canvas);
  cachedMwTexture.needsUpdate = true;
  return cachedMwTexture;
}

// -------------------------------------------------------------
// 1. REAL-TIME STARS WITH ATMOSPHERIC EXTINCTION
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

        // Realistic atmospheric airmass extinction factor
        // Stars close to 0° horizon dim significantly due to thick atmosphere
        const extinction = isVisible
          ? Math.min(1.0, Math.max(0.18, Math.sin((alt * Math.PI) / 180) * 1.45))
          : 0.05;

        const c = new THREE.Color(star.color);
        if (nightVision) {
          col[idx * 3] = 0.9 * extinction;
          col[idx * 3 + 1] = 0.08 * extinction;
          col[idx * 3 + 2] = 0.08 * extinction;
        } else {
          col[idx * 3] = c.r * extinction;
          col[idx * 3 + 1] = c.g * extinction;
          col[idx * 3 + 2] = c.b * extinction;
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

  const starTexture = useMemo(() => getStarTexture(), []);

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={3.6}
          vertexColors
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Interactive Selection Rings for the 25 Brightest Stars */}
      {stars.slice(0, 25).map((star) => {
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
              opacity={isSelected ? 0.95 : 0.35}
            />
          </mesh>
        );
      })}

      {/* Selected star tracking label */}
      <Html position={(selectedStar && starPositionsMap.get(selectedStar.name)) || [0, 0, 0]} distanceFactor={40} center>
        <div
          className={`pointer-events-none select-none rounded-full border border-primary/80 bg-ink/90 px-3 py-1 text-[10px] font-mono font-bold text-primary shadow-[0_0_15px_rgba(255,91,34,0.6)] backdrop-blur-md ${
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
// 2. PROCEDURAL MILKY WAY (SAMANYOLU) DUST BELT
// -------------------------------------------------------------
function MilkyWayDustBelt({
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
  const mwData = useMemo(() => generateMilkyWayParticles(3400), []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(mwData.galacticCoords.length * 3);
    const col = new Float32Array(mwData.galacticCoords.length * 3);

    mwData.galacticCoords.forEach((p, idx) => {
      // 1. Transform Galactic (l, b) to Equatorial (RA, Dec)
      const eq = galacticToEquatorial(p.l, p.b);
      let x = 0, y = 0, z = 0;
      let extinction = 1.0;

      if (useLocalHorizon) {
        const altAz = raDecToAltAz(eq.ra, eq.dec, location.latitude, lst);
        [x, y, z] = altAzToCartesian(altAz.alt, altAz.az, SPHERE_RADIUS * 0.985);
        extinction = altAz.isVisible ? Math.min(1.0, Math.sin((altAz.alt * Math.PI) / 180) * 1.6) : 0.02;
      } else {
        const raRad = (eq.ra * Math.PI) / 180;
        const decRad = (eq.dec * Math.PI) / 180;
        x = SPHERE_RADIUS * 0.985 * Math.cos(decRad) * Math.cos(raRad);
        y = SPHERE_RADIUS * 0.985 * Math.sin(decRad);
        z = SPHERE_RADIUS * 0.985 * Math.cos(decRad) * Math.sin(raRad);
      }

      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;

      // Color tint: core is warmer amber-gold, outer arms are icy silver-blue
      const baseR = p.isCore ? 0.95 : 0.72;
      const baseG = p.isCore ? 0.82 : 0.80;
      const baseB = p.isCore ? 0.65 : 0.98;

      if (nightVision) {
        col[idx * 3] = 0.8 * p.brightness * extinction;
        col[idx * 3 + 1] = 0.05 * p.brightness * extinction;
        col[idx * 3 + 2] = 0.05 * p.brightness * extinction;
      } else {
        col[idx * 3] = baseR * p.brightness * extinction;
        col[idx * 3 + 1] = baseG * p.brightness * extinction;
        col[idx * 3 + 2] = baseB * p.brightness * extinction;
      }
    });

    return { positions: pos, colors: col };
  }, [mwData, location, lst, useLocalHorizon, nightVision]);

  const mwTexture = useMemo(() => getMilkyWayTexture(), []);

  if (!visible) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={mwTexture}
        size={5.2}
        vertexColors
        transparent
        opacity={opacity * 0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 3. CONSTELLATION LINES (Connected in 3D Celestial Space)
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

  useEffect(() => () => linesGeometry.dispose(), [linesGeometry]);

  return (
    <lineSegments geometry={linesGeometry} visible={visible}>
      <lineBasicMaterial
        color={nightVision ? '#ff4444' : '#38bdf8'}
        transparent
        opacity={nightVision ? 0.45 : 0.42 * opacity}
      />
    </lineSegments>
  );
}

// -------------------------------------------------------------
// 3.5 ANIMATED CONSTELLATION TRACER & STAR-HOPPING ENGINE
// -------------------------------------------------------------
function AnimatedConstellationTracer({
  constellation,
  location,
  lst,
  useLocalHorizon,
  nightVision,
  showGuide,
  animTrigger
}: {
  constellation: DetailedConstellation | null;
  location: UserLocation;
  lst: number;
  useLocalHorizon: boolean;
  nightVision: boolean;
  showGuide: boolean;
  animTrigger: number;
}) {
  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    if (!constellation) {
      setAnimProgress(0);
      return;
    }
    setAnimProgress(0);
    let startTime: number | null = null;
    const duration = 2200; // 2.2s smooth laser stroke

    let reqId: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAnimProgress(progress);
      if (progress < 1) {
        reqId = requestAnimationFrame(animate);
      }
    };
    reqId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId);
  }, [constellation?.id, animTrigger]);

  const getCoords = (starIdx: number): THREE.Vector3 => {
    const star = stars[starIdx] ?? stars[0];
    if (useLocalHorizon) {
      const { alt, az } = raDecToAltAz(star.ra, star.dec, location.latitude, lst);
      const [x, y, z] = altAzToCartesian(alt, az, SPHERE_RADIUS * 0.985);
      return new THREE.Vector3(x, y, z);
    } else {
      const raRad = (star.ra * Math.PI) / 180;
      const decRad = (star.dec * Math.PI) / 180;
      return new THREE.Vector3(
        SPHERE_RADIUS * 0.985 * Math.cos(decRad) * Math.cos(raRad),
        SPHERE_RADIUS * 0.985 * Math.sin(decRad),
        SPHERE_RADIUS * 0.985 * Math.cos(decRad) * Math.sin(raRad)
      );
    }
  };

  const { linePoints, starNodes, centroid, guideLinePoints } = useMemo(() => {
    if (!constellation) {
      return { linePoints: [], starNodes: [], centroid: new THREE.Vector3(), guideLinePoints: [] };
    }

    const nodes = constellation.starIndices.map((idx) => ({
      idx,
      star: stars[idx],
      pos: getCoords(idx)
    }));

    const sum = nodes.reduce((acc, n) => acc.add(n.pos.clone()), new THREE.Vector3());
    const center = sum.divideScalar(nodes.length || 1);

    const fullPathPoints: THREE.Vector3[] = constellation.animatedPath.map((idx) => getCoords(idx));
    const numSegments = fullPathPoints.length - 1;
    const currentSegmentIndex = Math.min(numSegments - 1, Math.floor(animProgress * numSegments));
    const segmentFraction = (animProgress * numSegments) - currentSegmentIndex;

    const drawnPoints: THREE.Vector3[] = [];
    for (let i = 0; i < currentSegmentIndex; i++) {
      drawnPoints.push(fullPathPoints[i], fullPathPoints[i + 1]);
    }
    if (currentSegmentIndex >= 0 && currentSegmentIndex < numSegments) {
      const pA = fullPathPoints[currentSegmentIndex];
      const pB = fullPathPoints[currentSegmentIndex + 1];
      const interpolated = pA.clone().lerp(pB, segmentFraction);
      drawnPoints.push(pA, interpolated);
    }

    const guidePoints: THREE.Vector3[] = [];
    if (showGuide && constellation.pointerGuide) {
      const gPath = constellation.pointerGuide.path;
      for (let i = 0; i < gPath.length - 1; i++) {
        guidePoints.push(getCoords(gPath[i]), getCoords(gPath[i + 1]));
      }
    }

    return {
      linePoints: drawnPoints,
      starNodes: nodes,
      centroid: center,
      guideLinePoints: guidePoints
    };
  }, [constellation, animProgress, location, lst, useLocalHorizon, showGuide]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  const guideGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(guideLinePoints);
  }, [guideLinePoints]);

  if (!constellation) return null;

  return (
    <group>
      {/* 1. Animated Glowing Constellation Lines */}
      {linePoints.length > 0 && (
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial
            color={nightVision ? '#ff2222' : '#00e5ff'}
            transparent
            opacity={0.95}
          />
        </lineSegments>
      )}

      {/* 2. Star-Hopping Guide Line (Merak -> Dubhe -> Polaris) */}
      {showGuide && guideLinePoints.length > 0 && (
        <group>
          <lineSegments geometry={guideGeometry}>
            <lineBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.85}
            />
          </lineSegments>
          {guideLinePoints[1] && guideLinePoints[2] && (
            <Html position={guideLinePoints[1].clone().lerp(guideLinePoints[2], 0.5)} center distanceFactor={45}>
              <div className="pointer-events-none select-none rounded-full border border-gold/80 bg-ink/90 px-2.5 py-1 text-[9px] font-mono font-bold text-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] backdrop-blur-md whitespace-nowrap animate-pulse">
                5x Kılavuz Doğrusu → Polaris
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 3. Glowing Target Rings around each Star in the Constellation */}
      {starNodes.map(({ star, pos }) => (
        <group key={star.name} position={pos}>
          <mesh>
            <ringGeometry args={[1.2, 1.8, 24]} />
            <meshBasicMaterial
              color={nightVision ? '#ff3333' : star.name === 'Polaris' ? '#ffd700' : '#00e5ff'}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Html center distanceFactor={42}>
            <div className={`pointer-events-none select-none rounded px-1.5 py-0.5 text-[8px] font-mono font-bold whitespace-nowrap mt-4 ${
              star.name === 'Polaris'
                ? 'bg-gold text-ink border border-gold font-extrabold shadow-[0_0_12px_rgba(255,215,0,0.9)]'
                : 'bg-ink/85 text-paper/90 border border-line'
            }`}>
              {star.turkishName || star.name}
            </div>
          </Html>
        </group>
      ))}

      {/* 4. Constellation Title Badge at Centroid */}
      <Html position={centroid} center distanceFactor={50}>
        <div className="pointer-events-none select-none flex flex-col items-center gap-1">
          <div className="rounded-full border border-primary/80 bg-ink/95 px-4 py-1 text-xs font-mono font-bold text-primary shadow-[0_0_20px_rgba(0,229,255,0.6)] backdrop-blur-md uppercase tracking-widest whitespace-nowrap">
            {constellation.name} · {constellation.latinName}
          </div>
          <span className="label text-[9px] text-paper/70 font-mono">
            {constellation.starIndices.length} Ana Yıldız
          </span>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// 3.6 CAMERA CONSTELLATION DIRECTOR (Orient Camera to Constellation)
// -------------------------------------------------------------
function CameraConstellationDirector({
  targetConstellation,
  location,
  lst,
  useLocalHorizon
}: {
  targetConstellation: DetailedConstellation | null;
  location: UserLocation;
  lst: number;
  useLocalHorizon: boolean;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!targetConstellation) return;

    let targetDir: THREE.Vector3;
    if (useLocalHorizon) {
      const { alt, az } = raDecToAltAz(
        targetConstellation.centerRa,
        targetConstellation.centerDec,
        location.latitude,
        lst
      );
      const [x, y, z] = altAzToCartesian(alt, az, 1);
      targetDir = new THREE.Vector3(x, y, z).normalize();
    } else {
      const raRad = (targetConstellation.centerRa * Math.PI) / 180;
      const decRad = (targetConstellation.centerDec * Math.PI) / 180;
      targetDir = new THREE.Vector3(
        Math.cos(decRad) * Math.cos(raRad),
        Math.sin(decRad),
        Math.cos(decRad) * Math.sin(raRad)
      ).normalize();
    }

    camera.position.set(-targetDir.x * 0.1, -targetDir.y * 0.1, -targetDir.z * 0.1);
    camera.lookAt(targetDir.x * 10, targetDir.y * 10, targetDir.z * 10);
  }, [targetConstellation?.id, location, lst, useLocalHorizon, camera]);

  return null;
}

// -------------------------------------------------------------
// 4. SOLAR SYSTEM BODIES IN TOPOCENTRIC ALT-AZ COORDINATES
// -------------------------------------------------------------
function RealTimeSolarSystem({
  visible,
  currentTime,
  location,
  lst,
  nightVision,
  onSelectBody,
  selectedBody
}: {
  visible: boolean;
  currentTime: Date;
  location: UserLocation;
  lst: number;
  nightVision: boolean;
  onSelectBody: (body: CelestialBodyDomeState) => void;
  selectedBody: CelestialBodyDomeState | null;
}) {
  const bodies = useMemo(() => {
    return computeSkyDomeSolarSystem(currentTime, location.latitude, lst, SPHERE_RADIUS);
  }, [currentTime, location.latitude, lst]);

  if (!visible) return null;

  return (
    <group>
      {bodies.map((body) => {
        const isSelected = selectedBody?.id === body.id;
        const [x, y, z] = body.cartesian;

        return (
          <group key={body.id} position={[x, y, z]}>
            {/* Clickable hit mesh */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectBody(body);
              }}
            >
              <sphereGeometry args={[body.type === 'sun' ? 3.0 : body.type === 'moon' ? 2.5 : 1.6, 16, 16]} />
              <meshBasicMaterial
                color={nightVision ? '#ff4444' : body.color}
                transparent
                opacity={body.isVisible ? 0.95 : 0.15}
              />
            </mesh>

            {/* Sun Solar Corona Glow Ring */}
            {body.type === 'sun' && body.isVisible && (
              <mesh>
                <ringGeometry args={[3.2, 5.0, 32]} />
                <meshBasicMaterial
                  color="#ffa940"
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Interactive HTML Badge */}
            <Html distanceFactor={42} center>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBody(body);
                }}
                className={`cursor-pointer pointer-events-auto select-none rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-wide border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-gold bg-gold/20 text-gold scale-110 shadow-[0_0_15px_rgba(255,180,0,0.7)]'
                    : body.isVisible
                    ? 'border-paper/20 bg-ink/80 text-paper hover:border-paper/50'
                    : 'border-line/40 bg-ink/50 text-muted opacity-40'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: body.color }} />
                <span>{body.name.split(' ')[0]}</span>
                {body.type === 'moon' && body.phaseFraction !== undefined && (
                  <span className="text-[8px] opacity-75">%{Math.round(body.phaseFraction * 100)}</span>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// 5. SWISS TECHNICAL HORIZON & ALT-AZ COMPASS GRID
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
    { label: 'KD (45°)', az: 45, color: '#ffffff' },
    { label: 'D (90°)', az: 90, color: '#ffffff' },
    { label: 'GD (135°)', az: 135, color: '#ffb470' },
    { label: 'G (180°)', az: 180, color: '#ffb470' },
    { label: 'GB (225°)', az: 225, color: '#ffffff' },
    { label: 'B (270°)', az: 270, color: '#ffffff' },
    { label: 'KB (315°)', az: 315, color: '#ffffff' },
  ];

  // Altitude ring circles at 30° and 60°
  const altRings = [
    { alt: 30, label: 'İrtifa +30°' },
    { alt: 60, label: 'İrtifa +60°' }
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

      {/* 2. Luminous Horizon Baseline Ring (0° Altitude) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SPHERE_RADIUS * 0.97, SPHERE_RADIUS * 0.99, 64]} />
        <meshBasicMaterial
          color={nightVision ? '#660000' : '#1a4466'}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Altitude Concentric Rings (+30° and +60°) */}
      {altRings.map((r) => {
        const ringRad = SPHERE_RADIUS * Math.cos((r.alt * Math.PI) / 180) * 0.98;
        const ringY = SPHERE_RADIUS * Math.sin((r.alt * Math.PI) / 180) * 0.98;
        return (
          <group key={r.alt} position={[0, ringY, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[ringRad - 0.2, ringRad + 0.2, 64]} />
              <meshBasicMaterial
                color={nightVision ? '#440000' : '#1b344b'}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Zenith (Başucu +90°) Center Point Reticle */}
      <group position={[0, SPHERE_RADIUS * 0.98, 0]}>
        <mesh>
          <ringGeometry args={[0.8, 1.2, 24]} />
          <meshBasicMaterial color={nightVision ? '#ff4444' : '#00e5ff'} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <Html center>
          <div className="pointer-events-none select-none text-[8px] font-mono text-muted tracking-widest uppercase">
            Başucu (90°)
          </div>
        </Html>
      </group>

      {/* 5. 8 Cardinal Direction Markers */}
      {cardinals.map((c) => {
        const [x, y, z] = altAzToCartesian(1.2, c.az, SPHERE_RADIUS * 0.92);
        return (
          <Html key={c.label} position={[x, y, z]} center>
            <div className={`pointer-events-none select-none rounded-md px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest border backdrop-blur-md ${visible ? '' : 'hidden'} ${
              nightVision
                ? 'border-red-800 bg-red-950/80 text-red-400'
                : 'border-paper/10 bg-ink/75 text-paper shadow-[0_0_10px_rgba(0,0,0,0.8)]'
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
// 6. DEEP SKY MESSIER OBJECTS
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
                className={`cursor-pointer pointer-events-auto select-none rounded-full px-2 py-0.5 text-[9px] font-mono font-bold tracking-wide border whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary scale-110 shadow-[0_0_15px_rgba(255,91,34,0.7)]'
                    : 'border-paper/10 bg-ink/60 text-paper/75 hover:text-paper'
                }`}
              >
                <GalaxySpiralGlyph size={10} className="text-gold" />
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
// MAIN 3D PLANETARIUM COMPONENT
// -------------------------------------------------------------
export function Planetarium3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation>(POPULAR_LOCATIONS[0]);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeFlowRate, setTimeFlowRate] = useState(1);
  const [useLocalHorizon, setUseLocalHorizon] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showMilkyWay, setShowMilkyWay] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [nightVision, setNightVision] = useState(false);
  const [isArActive, setIsArActive] = useState(false);
  const [arOpacity, setArOpacity] = useState(0.85);

  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [selectedDso, setSelectedDso] = useState<DeepSkyObject | null>(null);
  const [selectedBody, setSelectedBody] = useState<CelestialBodyDomeState | null>(null);
  const [activeConstellation, setActiveConstellation] = useState<DetailedConstellation | null>(
    DETAILED_CONSTELLATIONS[0] // Default to Küçük Ayı (Ursa Minor) with animated 7-star tracer
  );
  const [showStarHoppingGuide, setShowStarHoppingGuide] = useState(true);
  const [animTrigger, setAnimTrigger] = useState(0);
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
      setGpsError('Cihazınızda GPS konumu desteklenmiyor.');
      return;
    }
    setGpsError(null);
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
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? 'Konum izni verilmedi. Şehir listesinden seçim yapabilirsiniz.'
            : 'Konum alınamadı. Şehir listesinden seçim yapabilirsiniz.'
        );
        setIsGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const starMatches = stars
      .filter((s) => matchesQuery(searchQuery, s.name, s.turkishName))
      .slice(0, 4)
      .map((s) => ({ type: 'star' as const, data: s }));
    const dsoMatches = deepSkyObjects
      .filter((d) => matchesQuery(searchQuery, d.name, d.catalog))
      .slice(0, 3)
      .map((d) => ({ type: 'dso' as const, data: d }));
    return [...starMatches, ...dsoMatches];
  }, [searchQuery]);

  return (
    <div ref={stageRef} className={`relative h-full w-full overflow-hidden select-none ${nightVision ? 'bg-[#090000]' : 'bg-[#020206]'}`}>
      {/* 1. Optional Live AR Camera Overlay */}
      <ArCameraOverlay
        isActive={isArActive}
        onClose={() => setIsArActive(false)}
        opacity={arOpacity}
        setOpacity={setArOpacity}
      />

      {/* 2. 3D WebGL Canvas */}
      <Canvas
        frameloop={stageVisible ? 'always' : 'never'}
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

        {/* Real-Time Milky Way (Samanyolu) Dust Belt */}
        <MilkyWayDustBelt
          visible={showMilkyWay}
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
          nightVision={nightVision}
          opacity={isArActive ? arOpacity : 1.0}
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
            setSelectedBody(null);
          }}
          selectedStar={selectedStar}
        />

        {/* Solar System Bodies (Sun, Moon with Live Phase, Venus, Mars, Jupiter, Saturn) */}
        <RealTimeSolarSystem
          visible={showPlanets}
          currentTime={currentTime}
          location={selectedLocation}
          lst={currentLst}
          nightVision={nightVision}
          onSelectBody={(body) => {
            setSelectedBody(body);
            setSelectedStar(null);
            setSelectedDso(null);
          }}
          selectedBody={selectedBody}
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

        {/* Animated Constellation Tracer & Star-Hopping Guide */}
        <AnimatedConstellationTracer
          constellation={activeConstellation}
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
          nightVision={nightVision}
          showGuide={showStarHoppingGuide}
          animTrigger={animTrigger}
        />

        {/* Camera Director: Orient camera to selected constellation */}
        <CameraConstellationDirector
          targetConstellation={activeConstellation}
          location={selectedLocation}
          lst={currentLst}
          useLocalHorizon={useLocalHorizon}
        />

        {/* Ground Horizon & Compass Cardinals */}
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
            setSelectedBody(null);
          }}
          selectedDso={selectedDso}
        />
      </Canvas>

      {/* 3. TOP TELEMETRY & LOCATION CONTROL BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Location & Real-Time Sidereal Indicator */}
        <div className="pointer-events-auto relative">
          <button
            type="button"
            aria-expanded={isLocDropdownOpen}
            aria-haspopup="true"
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
                {Math.abs(selectedLocation.latitude)}°{selectedLocation.latitude >= 0 ? 'K' : 'G'} · LST: {(currentLst / 15).toFixed(1)}h
              </div>
            </div>
          </button>

          {/* Location Selector Dropdown */}
          {isLocDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 border border-line bg-ink/95 p-2 shadow-2xl backdrop-blur-2xl z-30 space-y-1 font-mono text-xs">
              <button
                type="button"
                onClick={handleAutoGps}
                disabled={isGpsLoading}
                className="w-full flex items-center gap-2 border border-line bg-ink-2 text-lime p-2 hover:bg-ink-3 transition-colors label text-left cursor-pointer"
              >
                <RefreshCw size={12} className={isGpsLoading ? 'animate-spin' : ''} />
                <span>{isGpsLoading ? 'GPS Alınıyor...' : 'Otomatik GPS Konumu Al'}</span>
              </button>
              {gpsError && (
                <p role="alert" className="border border-rose/40 bg-rose/10 px-2 py-1.5 text-[10px] leading-snug text-rose">
                  {gpsError}
                </p>
              )}

              <div className="label text-[9px] text-muted uppercase px-2 pt-2">
                Hazır Şehirler
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    type="button"
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
            <input aria-label="Yıldız veya derin uzay nesnesi ara"
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
              {searchResults.map((res) => (
                <button
                  type="button"
                  key={`${res.type}-${res.data.name}`}
                  onClick={() => {
                    if (res.type === 'star') {
                      setSelectedStar(res.data);
                      setSelectedDso(null);
                      setSelectedBody(null);
                    } else {
                      setSelectedDso(res.data);
                      setSelectedStar(null);
                      setSelectedBody(null);
                    }
                    setSearchQuery('');
                  }}
                  className="flex w-full items-center justify-between p-2 text-left cursor-pointer hover:bg-ink-2 focus-visible:bg-ink-2 text-paper transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {res.type === 'star' ? (
                      <TelescopeGlyph size={12} className="text-lime" />
                    ) : (
                      <GalaxySpiralGlyph size={12} className="text-gold" />
                    )}
                    <span className="font-bold">{res.data.name}</span>
                  </span>
                  <span className="label text-[10px] text-muted">
                    {res.type === 'star' ? `Mag ${res.data.magnitude}` : res.data.type}
                  </span>
                </button>
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

          {/* Milky Way Toggle */}
          <button
            type="button"
            aria-pressed={showMilkyWay}
            onClick={() => setShowMilkyWay(!showMilkyWay)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              showMilkyWay
                ? 'border-line bg-paper text-ink font-bold'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Samanyolu Toz Kuşağı"
          >
            <Sparkles size={13} />
            <span className="hidden lg:inline">Samanyolu</span>
          </button>

          {/* Solar System Bodies Toggle */}
          <button
            type="button"
            aria-pressed={showPlanets}
            onClick={() => setShowPlanets(!showPlanets)}
            className={`label flex items-center gap-1.5 border px-3 py-1.5 backdrop-blur-xl transition-colors cursor-pointer ${
              showPlanets
                ? 'border-gold bg-gold text-ink font-bold'
                : 'border-line bg-ink/90 text-muted hover:text-paper'
            }`}
            title="Güneş & Gezegenler"
          >
            <Orbit size={13} />
            <span className="hidden lg:inline">Gezegenler</span>
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

          {/* Red night-vision mode */}
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

      {/* 3.1 CONSTELLATION QUICK-SELECTION PILLS BAR */}
      <div className="absolute top-16 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            setActiveConstellation(null);
          }}
          className={`label px-3 py-1 border rounded-full backdrop-blur-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
            !activeConstellation
              ? 'border-lime bg-lime text-ink font-bold'
              : 'border-line bg-ink/90 text-paper/70 hover:text-paper'
          }`}
        >
          ⭐ Serbest Bakış
        </button>

        {DETAILED_CONSTELLATIONS.map((c) => {
          const isSelected = activeConstellation?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveConstellation(c);
                setSelectedStar(null);
                setSelectedDso(null);
                setSelectedBody(null);
                setAnimTrigger((t) => t + 1);
              }}
              className={`label px-3.5 py-1 border rounded-full backdrop-blur-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs ${
                isSelected
                  ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                  : 'border-line bg-ink/90 text-paper/80 hover:border-gold/50 hover:text-gold'
              }`}
            >
              <ConstellationGlyph id={c.glyphId} size={14} className={isSelected ? 'text-ink' : 'text-gold'} />
              <span>{c.name}</span>
              {c.id === 'ursa-minor' && (
                <span className={`label text-[9px] px-1.5 py-0.2 rounded border ${
                  isSelected
                    ? 'bg-ink text-gold border-gold/60'
                    : 'bg-rose-signal/20 text-rose-signal border-rose-signal/40'
                }`}>
                  Kutup Yıldızı
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. STAR INSPECTION PANEL */}
      {selectedStar && (
        <div className="ticks absolute bottom-6 left-6 z-20 max-w-sm border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper font-mono">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <span className="label text-lime flex items-center gap-1.5">
              <TelescopeGlyph size={14} />
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

      {/* 5. SOLAR SYSTEM BODY INSPECTION PANEL */}
      {selectedBody && (
        <div className="ticks absolute bottom-6 left-6 z-20 max-w-sm border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper font-mono">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <div className="flex items-center gap-2">
              <PlanetGlyph planet={selectedBody.id} size={16} className="text-gold" />
              <span className="label text-gold">Güneş Sistemi Cismi</span>
            </div>
            <button onClick={() => setSelectedBody(null)} className="label text-muted hover:text-paper cursor-pointer">✕</button>
          </div>

          <h2 className="display display-tight text-xl font-bold mb-1">{selectedBody.name}</h2>
          <div className="label text-muted mb-3">
            {selectedBody.isVisible ? 'Ufkun Üzerinde (Gözlemlenebilir)' : 'Ufkun Altında'}
          </div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs">
            <div className="bg-ink p-2.5">
              <span className="label text-muted block text-[10px]">İrtifa (Alt)</span>
              <span className={`font-bold ${selectedBody.alt > 0 ? 'text-lime' : 'text-rose-signal'}`}>
                {selectedBody.alt.toFixed(1)}°
              </span>
            </div>
            <div className="bg-ink p-2.5">
              <span className="label text-muted block text-[10px]">Azimut (Az)</span>
              <span className="font-bold text-paper">{selectedBody.az.toFixed(1)}°</span>
            </div>
            <div className="bg-ink p-2.5">
              <span className="label text-muted block text-[10px]">Sağ Açıklık (RA)</span>
              <span className="font-bold text-paper">{(selectedBody.ra / 15).toFixed(2)}h</span>
            </div>
            <div className="bg-ink p-2.5">
              <span className="label text-muted block text-[10px]">Görünür Kadir</span>
              <span className="font-bold text-gold">{selectedBody.magnitude.toFixed(1)} mag</span>
            </div>
          </div>

          {selectedBody.type === 'moon' && selectedBody.phaseFraction !== undefined && (
            <div className="mt-3 border border-line bg-ink-2 p-3 flex items-center justify-between">
              <div className="text-xs">
                <span className="label text-muted block text-[10px]">Ay Aydınlanma Oranı</span>
                <span className="font-bold text-paper">%{Math.round(selectedBody.phaseFraction * 100)}</span>
              </div>
              <VectorMoonPhase illumination={Math.round(selectedBody.phaseFraction * 100)} waning={(selectedBody.phaseAngle ?? 0) > 180} size={32} className="text-paper" />
            </div>
          )}
        </div>
      )}

      {/* 6. DSO INSPECTION PANEL */}
      {selectedDso && (
        <div className="ticks absolute bottom-6 left-6 z-20 max-w-sm border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <div className="flex items-center gap-2">
              <GalaxySpiralGlyph size={14} className="text-lime" />
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
                src={selectedDso.image.src}
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

      {/* 7. CONSTELLATION DETAILED INSPECTION DOSSIER */}
      {activeConstellation && (
        <div className="ticks absolute bottom-6 right-6 z-20 max-w-sm sm:max-w-md border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-2xl transition-all text-paper font-mono">
          <Ticks />
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <div className="flex items-center gap-2">
              <ConstellationGlyph id={activeConstellation.glyphId} size={16} className="text-gold" />
              <span className="label text-gold">Takımyıldız Çizimi & Kılavuzu</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveConstellation(null)}
              className="label text-muted hover:text-paper cursor-pointer"
              title="Serbest Bakışa Dön"
            >
              ✕
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <h2 className="display display-tight text-xl font-bold text-paper">
              {activeConstellation.name}
            </h2>
            <span className="label text-muted italic text-xs">{activeConstellation.latinName}</span>
          </div>

          <div className="label text-gold/90 text-xs mb-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-gold" />
            <span>Ana Yıldız: {activeConstellation.mainStar}</span>
          </div>

          <p className="text-xs text-paper/85 leading-relaxed mb-3">
            {activeConstellation.description}
          </p>

          <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs mb-3">
            <div className="bg-ink p-2">
              <span className="label text-muted block text-[10px]">Çizilen Yıldız</span>
              <span className="font-bold text-gold">{activeConstellation.starIndices.length} Yıldız</span>
            </div>
            <div className="bg-ink p-2">
              <span className="label text-muted block text-[10px]">Merkez Sağ Açıklık</span>
              <span className="font-bold text-paper">{(activeConstellation.centerRa / 15).toFixed(1)}h</span>
            </div>
            <div className="bg-ink p-2">
              <span className="label text-muted block text-[10px]">Merkez Dik Açıklık</span>
              <span className="font-bold text-paper">+{activeConstellation.centerDec.toFixed(1)}°</span>
            </div>
            <div className="bg-ink p-2">
              <span className="label text-muted block text-[10px]">Gözlem Durumu</span>
              <span className="font-bold text-lime">Sirkumpolar</span>
            </div>
          </div>

          {/* Star-Hopping Guide for Ursa Minor / Polaris */}
          {activeConstellation.pointerGuide && (
            <div className="border border-gold/30 bg-gold/5 p-3 mb-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="label text-gold font-bold flex items-center gap-1.5">
                  <Orbit size={12} className="text-gold" />
                  Yıldız Atlama (Star-Hopping)
                </span>
                <button
                  type="button"
                  onClick={() => setShowStarHoppingGuide(!showStarHoppingGuide)}
                  className={`label text-[10px] px-2 py-0.5 border rounded cursor-pointer transition-colors ${
                    showStarHoppingGuide
                      ? 'border-gold bg-gold text-ink font-bold'
                      : 'border-line bg-ink text-muted hover:text-paper'
                  }`}
                >
                  {showStarHoppingGuide ? 'Kılavuz Açık' : 'Kılavuzu Aç'}
                </button>
              </div>
              <p className="text-[11px] text-paper/75 leading-relaxed">
                {activeConstellation.pointerGuide.description}
              </p>
            </div>
          )}

          {/* Observation & Mythology Tips */}
          <div className="border border-line bg-ink-2 p-2.5 mb-3 text-[11px] text-paper/75 leading-snug">
            <span className="label text-muted block text-[9px] mb-1 uppercase tracking-wider">Mitoloji & Gözlem</span>
            {activeConstellation.observationTip}
          </div>

          {/* Re-trigger animation button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAnimTrigger((t) => t + 1)}
              className="flex-1 flex items-center justify-center gap-2 border border-line bg-ink-2 hover:bg-gold hover:text-ink hover:border-gold py-2 text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Çizim Animasyonunu Yeniden Başlat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveConstellation(null)}
              className="border border-line bg-ink-2 hover:bg-ink-3 px-3 py-2 text-xs text-muted hover:text-paper transition-all cursor-pointer"
              title="Serbest Bakışa Dön"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

