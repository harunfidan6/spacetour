'use client';

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useInView } from '@/lib/useInView';
import { matchesQuery } from '@/lib/text';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { registerFilm } from '@/lib/film';
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
import { getBackgroundStarfield } from '@/lib/astrophysics/starfieldCatalog';
import {
  PlanetGlyph,
  TelescopeGlyph,
  GalaxySpiralGlyph,
  VectorMoonPhase,
  ConstellationGlyph
} from '@/components/ui/CosmicGlyphs';
import { ArCameraOverlay, type OffScreenTarget } from './ArCameraOverlay';
import { NASA_TEXTURES, loadNasaTexture } from './nasaTextures';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createMoonTexture
} from './textures';
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
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  gradient.addColorStop(0.2, 'rgba(220, 235, 255, 0.22)');
  gradient.addColorStop(0.5, 'rgba(170, 200, 255, 0.08)');
  gradient.addColorStop(0.8, 'rgba(130, 160, 240, 0.02)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  cachedMwTexture = new THREE.CanvasTexture(canvas);
  cachedMwTexture.needsUpdate = true;
  return cachedMwTexture;
}

// -------------------------------------------------------------
// 1. REAL-TIME STARS WITH PRECISION GPU SHADER & BACKGROUND STARFIELD
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
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  // Background Hipparcos Starfield (~2800 stars across the sky vault)
  const bgStarfield = useMemo(() => getBackgroundStarfield(2800), []);

  const totalStarCount = stars.length + bgStarfield.length;

  // Compute 3D positions, colors, sizes and twinkle phases
  const { positions, colors, sizes, twinkles, starPositionsMap } = useMemo(() => {
    const pos = new Float32Array(totalStarCount * 3);
    const col = new Float32Array(totalStarCount * 3);
    const sz = new Float32Array(totalStarCount);
    const tw = new Float32Array(totalStarCount);
    const map = new Map<string, [number, number, number]>();

    // 1. Major Named Navigational Stars (91 stars)
    stars.forEach((star, idx) => {
      let x = 0, y = 0, z = 0;
      let extinction = 1.0;

      if (useLocalHorizon) {
        const { alt, az, isVisible } = raDecToAltAz(star.ra, star.dec, location.latitude, lst);
        [x, y, z] = altAzToCartesian(alt, az, SPHERE_RADIUS);
        extinction = isVisible ? Math.min(1.0, Math.max(0.12, Math.sin((alt * Math.PI) / 180) * 1.5)) : 0.02;
      } else {
        const raRad = (star.ra * Math.PI) / 180;
        const decRad = (star.dec * Math.PI) / 180;
        x = SPHERE_RADIUS * Math.cos(decRad) * Math.cos(raRad);
        y = SPHERE_RADIUS * Math.sin(decRad);
        z = SPHERE_RADIUS * Math.cos(decRad) * Math.sin(raRad);
      }

      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;
      map.set(star.name, [x, y, z]);

      const c = new THREE.Color(star.color);
      if (nightVision) {
        col[idx * 3] = 0.95 * extinction;
        col[idx * 3 + 1] = 0.08 * extinction;
        col[idx * 3 + 2] = 0.08 * extinction;
      } else {
        col[idx * 3] = c.r * extinction;
        col[idx * 3 + 1] = c.g * extinction;
        col[idx * 3 + 2] = c.b * extinction;
      }

      // Pogson magnitude scaling for major stars: Sirius ~8.5, Vega ~6.8, Polaris ~4.6
      const pointSize = Math.max(2.8, Math.min(8.8, 7.2 - star.magnitude * 1.15));
      sz[idx] = pointSize;
      tw[idx] = (idx * 1.37) % (Math.PI * 2);
    });

    // 2. High-Density Background Stars (~2800 stars)
    const offset = stars.length;
    bgStarfield.forEach((bg, i) => {
      const idx = offset + i;
      let x = 0, y = 0, z = 0;
      let extinction = 1.0;

      if (useLocalHorizon) {
        const { alt, az, isVisible } = raDecToAltAz(bg.ra, bg.dec, location.latitude, lst);
        if (!isVisible) {
          extinction = 0.0;
        } else {
          extinction = Math.min(1.0, Math.max(0.15, Math.sin((alt * Math.PI) / 180) * 1.6));
        }
        [x, y, z] = altAzToCartesian(alt, az, SPHERE_RADIUS * 0.995);
      } else {
        const raRad = (bg.ra * Math.PI) / 180;
        const decRad = (bg.dec * Math.PI) / 180;
        x = SPHERE_RADIUS * 0.995 * Math.cos(decRad) * Math.cos(raRad);
        y = SPHERE_RADIUS * 0.995 * Math.sin(decRad);
        z = SPHERE_RADIUS * 0.995 * Math.cos(decRad) * Math.sin(raRad);
      }

      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;

      if (nightVision) {
        col[idx * 3] = 0.9 * extinction;
        col[idx * 3 + 1] = 0.06 * extinction;
        col[idx * 3 + 2] = 0.06 * extinction;
      } else {
        col[idx * 3] = bg.color[0] * extinction;
        col[idx * 3 + 1] = bg.color[1] * extinction;
        col[idx * 3 + 2] = bg.color[2] * extinction;
      }

      sz[idx] = Math.max(1.6, bg.size * 1.4);
      tw[idx] = bg.twinklePhase;
    });

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      twinkles: tw,
      starPositionsMap: map
    };
  }, [bgStarfield, location, lst, useLocalHorizon, nightVision]);

  // GPU Shader for Photorealistic Diamonds with Gaussian Cores and Diffraction Spikes
  const starShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aTwinkle;
        varying vec3 vColor;
        varying float vTwinkle;
        varying float vSize;
        uniform float uTime;

        void main() {
          vColor = color;
          vSize = aSize;
          // Subtle atmospheric scintillation
          float tw = 0.85 + 0.15 * sin(uTime * 3.2 + aTwinkle);
          vTwinkle = tw;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * tw * 2.8;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vTwinkle;
        varying float vSize;
        uniform float uOpacity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          // 1. Brilliant solid Gaussian stellar core
          float core = exp(-dist * dist * 24.0);
          // 2. Soft luminous Airy disk halo
          float halo = exp(-dist * 5.0) * 0.45;
          // 3. Delicate 4-point cross diffraction spike for bright stars
          float spike = 0.0;
          if (vSize > 3.8) {
            float spikeWeight = smoothstep(3.8, 8.5, vSize);
            float sX = exp(-abs(coord.x) * 36.0) * exp(-abs(coord.y) * 4.0);
            float sY = exp(-abs(coord.y) * 36.0) * exp(-abs(coord.x) * 4.0);
            spike = max(sX, sY) * 0.55 * spikeWeight;
          }

          float totalAlpha = clamp((core * 1.3 + halo + spike) * uOpacity, 0.0, 1.0);
          vec3 starCore = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.7);
          vec3 finalColor = starCore * (core * 2.2 + halo * 1.2 + spike * 1.0);
          gl_FragColor = vec4(finalColor, totalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(({ clock }) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderMatRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aTwinkle" args={[twinkles, 1]} />
        </bufferGeometry>
        <primitive object={starShaderMaterial} ref={shaderMatRef} attach="material" />
      </points>

      {/* Invisible Clickable Hit Targets & Sleek Selection Reticle for Major Stars */}
      {stars.map((star) => {
        const coords = starPositionsMap.get(star.name);
        if (!coords) return null;
        const isSelected = selectedStar?.name === star.name;

        return (
          <group key={star.name} position={coords}>
            {/* Invisible large click hitbox so stars are easy to tap/click */}
            <mesh
              visible={false}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStar(star);
              }}
            >
              <sphereGeometry args={[2.5, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Sleek Minimalist Targeting Reticle ONLY when star is selected */}
            {isSelected && (
              <mesh>
                <ringGeometry args={[0.9, 1.15, 32]} />
                <meshBasicMaterial
                  color={nightVision ? '#ff3333' : '#00e5ff'}
                  transparent
                  opacity={0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Selected star tracking label */}
      <Html position={(selectedStar && starPositionsMap.get(selectedStar.name)) || [0, 0, 0]} distanceFactor={40} center>
        <div
          className={`pointer-events-none select-none rounded-full border border-primary/80 bg-ink/90 px-3 py-1 text-[10px] font-mono font-bold text-primary shadow-[0_0_15px_rgba(0,229,255,0.6)] backdrop-blur-md ${
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
        size={1.5}
        vertexColors
        transparent
        opacity={opacity * 0.22}
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
    if (!constellation) return;
    // The first frame starts the stroke from zero, so no synchronous reset is needed
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
    const segmentFraction = animProgress * numSegments - currentSegmentIndex;

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
              <div className="pointer-events-none select-none rounded-full border border-gold/80 bg-ink/90 px-2.5 py-1 text-[10px] font-mono font-bold text-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] backdrop-blur-md whitespace-nowrap animate-pulse">
                5x Kılavuz Doğrusu → Polaris
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 3. Polaris Navigation Reticle (Clean & Uncluttered) */}
      {starNodes.map(({ star, pos }) => {
        const isPolaris = star.name === 'Polaris';
        if (!isPolaris) return null;
        return (
          <group key={star.name} position={pos}>
            <mesh>
              <ringGeometry args={[0.6, 0.85, 24]} />
              <meshBasicMaterial
                color="#ffd700"
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Html center distanceFactor={42}>
              <div className="pointer-events-none select-none rounded px-2 py-0.5 text-[10px] font-mono font-extrabold whitespace-nowrap mt-4 bg-gold text-ink border border-gold shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                Kutup Yıldızı (Polaris)
              </div>
            </Html>
          </group>
        );
      })}

      {/* 4. Constellation Title Badge at Centroid */}
      <Html position={centroid} center distanceFactor={50}>
        <div className="pointer-events-none select-none flex flex-col items-center gap-1">
          <div className="rounded-full border border-primary/80 bg-ink/95 px-4 py-1 text-xs font-mono font-bold text-primary shadow-[0_0_20px_rgba(0,229,255,0.6)] backdrop-blur-md uppercase tracking-widest whitespace-nowrap">
            {constellation.name} · {constellation.latinName}
          </div>
          <span className="label text-[10px] text-paper/70 font-mono">
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
  // Re-aim only when the target or the observer changes. Following every sidereal
  // tick snapped the view back once a second and made free looking impossible.
  const lstRef = useRef(lst);
  useEffect(() => {
    lstRef.current = lst;
  }, [lst]);

  useEffect(() => {
    if (!targetConstellation) return;

    let targetDir: THREE.Vector3;
    if (useLocalHorizon) {
      const { alt, az } = raDecToAltAz(
        targetConstellation.centerRa,
        targetConstellation.centerDec,
        location.latitude,
        lstRef.current
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
  }, [targetConstellation, location, useLocalHorizon, camera]);

  return null;
}

type OrientationSample = { alpha: number; beta: number; gamma: number };

/**
 * AR mode: points the sky camera where the phone points. The scene uses the same world frame as
 * the device-orientation spec (Y up, north = −Z, east = +X), so the standard
 * DeviceOrientationControls math applies directly. Calls `onTracking` once real sensor data arrives.
 */
function DeviceSkyControl({ active, onTracking }: { active: boolean; onTracking: (tracking: boolean) => void }) {
  const { camera } = useThree();
  const sample = useRef<OrientationSample | null>(null);
  const target = useRef(new THREE.Quaternion());
  const tmp = useRef({ euler: new THREE.Euler(), q0: new THREE.Quaternion(), q1: new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)), z: new THREE.Vector3(0, 0, 1) });

  useEffect(() => {
    if (!active) return;
    sample.current = null;
    onTracking(false);
    let reported = false;
    const handle = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      if (e.beta == null || e.gamma == null) return;
      // iOS reports a compass heading; Android's absolute event reports alpha against north
      const alpha = typeof e.webkitCompassHeading === 'number' ? (360 - e.webkitCompassHeading) % 360 : e.alpha;
      if (alpha == null) return;
      sample.current = { alpha, beta: e.beta, gamma: e.gamma };
      if (!reported) {
        reported = true;
        onTracking(true);
      }
    };
    const absolute = 'ondeviceorientationabsolute' in window;
    const type = absolute ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(type, handle as EventListener);
    return () => {
      window.removeEventListener(type, handle as EventListener);
      onTracking(false);
    };
  }, [active, onTracking]);

  useFrame(() => {
    const s = sample.current;
    if (!active || !s) return;
    const { euler, q0, q1, z } = tmp.current;
    const d = THREE.MathUtils.DEG2RAD;
    const screenAngle = (typeof screen !== 'undefined' && screen.orientation ? screen.orientation.angle : 0) * d;
    euler.set(s.beta * d, s.alpha * d, -s.gamma * d, 'YXZ');
    target.current.setFromEuler(euler).multiply(q1).multiply(q0.setFromAxisAngle(z, -screenAngle));
    // Gentle smoothing hides sensor jitter without lagging behind the hand
    camera.quaternion.slerp(target.current, 0.3);
  });

  return null;
}

/** Film mode: lets the promo recorder turn the sky through the real look-around controls. */
function FilmSkyControl() {
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  useEffect(() => {
    if (!controls) return;
    return registerFilm('gokyuzu', {
      aci: () => [controls.getAzimuthalAngle(), controls.getPolarAngle()],
      bak: (az, polar) => {
        controls.setAzimuthalAngle(Number(az));
        controls.setPolarAngle(Number(polar));
      },
    });
  }, [controls]);
  return null;
}

function ArTelemetryTracker({
  active,
  solarBodies,
  onUpdateTelemetry
}: {
  active: boolean;
  solarBodies: CelestialBodyDomeState[];
  onUpdateTelemetry: (azimuth: number, pitch: number, targets: OffScreenTarget[]) => void;
}) {
  const { camera } = useThree();
  const lastTime = useRef(0);
  const dir = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!active) return;
    const now = state.clock.getElapsedTime();
    if (now - lastTime.current < 0.08) return; // ~12 fps telemetry calculation
    lastTime.current = now;

    camera.getWorldDirection(dir.current);
    const pitch = THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, dir.current.y))));
    let az = THREE.MathUtils.radToDeg(Math.atan2(dir.current.x, -dir.current.z));
    if (az < 0) az += 360;

    const targets: OffScreenTarget[] = [];
    const camQuat = camera.quaternion;
    const invQuat = camQuat.clone().invert();

    for (const body of solarBodies) {
      if (!body.isVisible) continue;
      const bodyPos = new THREE.Vector3(...body.cartesian);
      const localPos = bodyPos.clone().applyQuaternion(invQuat);
      const angleFromCenter = THREE.MathUtils.radToDeg(localPos.angleTo(new THREE.Vector3(0, 0, -1)));
      if (angleFromCenter > 28) {
        let direction: 'left' | 'right' | 'up' | 'down' = 'right';
        if (Math.abs(localPos.x) > Math.abs(localPos.y)) {
          direction = localPos.x > 0 ? 'right' : 'left';
        } else {
          direction = localPos.y > 0 ? 'up' : 'down';
        }
        targets.push({
          id: body.id,
          name: body.name.split(' ')[0],
          type: body.type === 'sun' ? 'sun' : body.type === 'moon' ? 'moon' : 'planet',
          direction,
          degrees: Math.round(angleFromCenter),
          color: body.color
        });
      }
    }

    onUpdateTelemetry(Math.round(az), Math.round(pitch), targets.slice(0, 3));
  });

  return null;
}

// -------------------------------------------------------------
// 4. SOLAR SYSTEM BODIES IN TOPOCENTRIC ALT-AZ COORDINATES
// -------------------------------------------------------------
function PhotorealisticDomePlanet({
  body,
  isSelected,
  nightVision,
  onSelect
}: {
  body: CelestialBodyDomeState;
  isSelected: boolean;
  nightVision: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    switch (body.id) {
      case 'sun':
        return loadNasaTexture(NASA_TEXTURES.sun) || createSunTexture();
      case 'moon':
        return loadNasaTexture(NASA_TEXTURES.moon) || createMoonTexture();
      case 'mercury':
        return loadNasaTexture(NASA_TEXTURES.mercury) || createMercuryTexture();
      case 'venus':
        return loadNasaTexture(NASA_TEXTURES.venus) || createVenusTexture();
      case 'mars':
        return loadNasaTexture(NASA_TEXTURES.mars) || createMarsTexture();
      case 'jupiter':
        return loadNasaTexture(NASA_TEXTURES.jupiter) || createJupiterTexture();
      case 'saturn':
        return loadNasaTexture(NASA_TEXTURES.saturn) || createSaturnTexture();
      default:
        return null;
    }
  }, [body.id]);

  const saturnRingTexture = useMemo(() => {
    if (body.id !== 'saturn') return null;
    return loadNasaTexture(NASA_TEXTURES.saturnRing) || createSaturnRingTexture();
  }, [body.id]);

  const saturnRingGeom = useMemo(() => {
    if (body.id !== 'saturn') return null;
    const inner = 2.4;
    const outer = 4.8;
    const g = new THREE.RingGeometry(inner, outer, 64);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [body.id]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.03;
  });

  const [x, y, z] = body.cartesian;
  const radius =
    body.type === 'sun'
      ? 3.6
      : body.type === 'moon'
      ? 2.8
      : body.id === 'jupiter'
      ? 2.6
      : body.id === 'saturn'
      ? 2.1
      : 1.6;

  return (
    <group position={[x, y, z]}>
      {/* 3D Photorealistic Celestial Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={nightVision ? '#ff4444' : texture ? '#ffffff' : body.color}
          roughness={body.type === 'sun' ? 0.2 : 0.65}
          metalness={0.1}
          emissive={body.type === 'sun' ? '#ff9900' : isSelected ? '#00e5ff' : '#000000'}
          emissiveIntensity={body.type === 'sun' ? 0.75 : isSelected ? 0.5 : 0}
          transparent={!body.isVisible}
          opacity={body.isVisible ? 1.0 : 0.2}
        />
      </mesh>

      {/* Saturn's 3D Concentric Rings in the Sky Dome */}
      {body.id === 'saturn' && saturnRingGeom && body.isVisible && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2.3, 0, 0]} geometry={saturnRingGeom}>
          <meshStandardMaterial
            map={saturnRingTexture || undefined}
            color={saturnRingTexture ? '#ffffff' : '#dfc58e'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.88}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* Sun Solar Corona Flame Aura */}
      {body.type === 'sun' && body.isVisible && (
        <>
          <mesh scale={1.22}>
            <sphereGeometry args={[radius, 24, 24]} />
            <meshBasicMaterial
              color="#ff7700"
              transparent
              opacity={0.4}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh scale={1.45}>
            <sphereGeometry args={[radius, 24, 24]} />
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.18}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

      {/* Selection Halo */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.55, 32]} />
          <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Interactive HTML Badge */}
      <Html distanceFactor={44} center>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`cursor-pointer pointer-events-auto select-none rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wide border whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isSelected
              ? 'border-gold bg-gold/30 text-gold scale-110 shadow-[0_0_15px_rgba(255,180,0,0.8)]'
              : body.isVisible
              ? 'border-paper/30 bg-ink/85 text-paper hover:border-paper/60 backdrop-blur-md'
              : 'border-line/40 bg-ink/50 text-muted opacity-40'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: body.color }} />
          <span>{body.name.split(' ')[0]}</span>
          {body.type === 'moon' && body.phaseFraction !== undefined && (
            <span className="text-[10px] opacity-75">%{Math.round(body.phaseFraction * 100)}</span>
          )}
        </div>
      </Html>
    </group>
  );
}

function RealTimeSolarSystem({
  visible,
  bodies,
  nightVision,
  onSelectBody,
  selectedBody
}: {
  visible: boolean;
  bodies: CelestialBodyDomeState[];
  nightVision: boolean;
  onSelectBody: (body: CelestialBodyDomeState) => void;
  selectedBody: CelestialBodyDomeState | null;
}) {
  if (!visible) return null;

  return (
    <group>
      {bodies.map((body) => (
        <PhotorealisticDomePlanet
          key={body.id}
          body={body}
          isSelected={selectedBody?.id === body.id}
          nightVision={nightVision}
          onSelect={() => onSelectBody(body)}
        />
      ))}
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
          <div className="pointer-events-none select-none text-[10px] font-mono text-muted tracking-widest uppercase">
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
                className={`cursor-pointer pointer-events-auto select-none rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide border whitespace-nowrap transition-all flex items-center gap-1 ${
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
  const [arTracking, setArTracking] = useState(false);

  // AR needs motion-sensor permission on iOS, which can only be asked from a tap
  const toggleAr = async () => {
    if (isArActive) {
      setIsArActive(false);
      return;
    }
    const DOE = (typeof window !== 'undefined' ? window.DeviceOrientationEvent : undefined) as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> })
      | undefined;
    if (DOE?.requestPermission) {
      try {
        await DOE.requestPermission();
      } catch {
        /* denied: the sky can still be aligned by dragging */
      }
    }
    setIsArActive(true);
  };
  const [arOpacity, setArOpacity] = useState(0.85);
  const [arAzimuth, setArAzimuth] = useState(0);
  const [arPitch, setArPitch] = useState(0);
  const [arOffScreenTargets, setArOffScreenTargets] = useState<OffScreenTarget[]>([]);

  const handleUpdateTelemetry = useCallback((az: number, p: number, targets: OffScreenTarget[]) => {
    setArAzimuth(az);
    setArPitch(p);
    setArOffScreenTargets(targets);
  }, []);

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
  const [showConstellationPicker, setShowConstellationPicker] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const clearAllSelection = () => {
    setSelectedStar(null);
    setSelectedBody(null);
    setSelectedDso(null);
    setActiveConstellation(null);
  };

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

  // Real-time Solar System Bodies (Sun, Moon with live phase, Mercury, Venus, Mars, Jupiter, Saturn)
  const solarBodies = useMemo(() => {
    return computeSkyDomeSolarSystem(
      currentTime,
      selectedLocation.latitude,
      selectedLocation.longitude,
      SPHERE_RADIUS * 0.95
    );
  }, [currentTime, selectedLocation]);

  return (
    <div ref={stageRef} className={`relative h-full w-full overflow-hidden select-none ${nightVision ? 'bg-[#090000]' : 'bg-[#020206]'}`}>
      {/* 1. Optional Live AR Camera Overlay */}
      <ArCameraOverlay
        isActive={isArActive}
        tracking={arTracking}
        onClose={() => setIsArActive(false)}
        opacity={arOpacity}
        setOpacity={setArOpacity}
        azimuth={arAzimuth}
        pitch={arPitch}
        offScreenTargets={arOffScreenTargets}
        onRequestSensor={toggleAr}
        nightVision={nightVision}
        onToggleNightVision={() => setNightVision(!nightVision)}
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
          makeDefault
          enabled={!arTracking}
          enableZoom={true}
          enablePan={false}
          rotateSpeed={-0.45}
          zoomSpeed={0.8}
          minDistance={0.05}
          maxDistance={45}
        />

        <FilmSkyControl />
        <DeviceSkyControl active={isArActive} onTracking={setArTracking} />
        <ArTelemetryTracker
          active={isArActive}
          solarBodies={solarBodies}
          onUpdateTelemetry={handleUpdateTelemetry}
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
          bodies={solarBodies}
          nightVision={nightVision}
          onSelectBody={(body) => {
            setSelectedBody(body);
            setSelectedStar(null);
            setSelectedDso(null);
            setIsInspectorOpen(true);
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

      {/* 3. MINIMAL TOP BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        {/* Location & Sidereal Time Selector */}
        <div className="pointer-events-auto relative">
          <button
            type="button"
            aria-expanded={isLocDropdownOpen}
            aria-haspopup="true"
            onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
            className="flex items-center gap-2.5 border border-line bg-ink/90 px-3.5 py-1.5 text-xs font-mono backdrop-blur-xl shadow-xl hover:border-paper/40 transition-colors text-left cursor-pointer rounded-full"
          >
            <MapPin size={13} className="text-lime animate-pulse" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-paper">{selectedLocation.city}</span>
              <span className="text-[10px] text-muted hidden sm:inline">({(currentLst / 15).toFixed(1)}h LST)</span>
              <ChevronDown size={11} className="text-muted" />
            </div>
          </button>

          {/* Location Selector Dropdown */}
          {isLocDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 border border-line bg-ink/95 p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1 font-mono text-xs">
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

              <div className="label text-[10px] text-muted uppercase px-2 pt-2">
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
                    <span className="label text-[10px] text-muted">{loc.latitude}°</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="pointer-events-auto relative w-52 sm:w-64">
          <div className="flex items-center gap-2 border border-line bg-ink/90 px-3 py-1.5 backdrop-blur-xl text-xs rounded-full">
            <Search size={13} className="text-muted" />
            <input
              aria-label="Yıldız veya derin uzay nesnesi ara"
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
            <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto border border-line bg-ink/95 p-2 shadow-2xl backdrop-blur-2xl z-50 font-mono text-xs">
              {searchResults.map((res) => (
                <button
                  type="button"
                  key={`${res.type}-${res.data.name}`}
                  onClick={() => {
                    if (res.type === 'star') {
                      setSelectedStar(res.data);
                      setSelectedDso(null);
                      setSelectedBody(null);
                      setActiveConstellation(null);
                    } else {
                      setSelectedDso(res.data);
                      setSelectedStar(null);
                      setSelectedBody(null);
                      setActiveConstellation(null);
                    }
                    setIsInspectorOpen(true);
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

        {/* Selection Status & Inspector Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {(selectedStar || selectedBody || selectedDso || activeConstellation) ? (
            <div className="flex items-center gap-1 bg-ink/90 border border-line rounded-full p-0.5 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                className={`label px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isInspectorOpen
                    ? 'bg-gold text-ink font-bold'
                    : 'bg-ink text-gold hover:text-paper'
                }`}
                title="İnceleme Panelini Aç/Kapat"
              >
                <span>✦</span>
                <span className="max-w-[120px] truncate">
                  {selectedStar
                    ? selectedStar.turkishName || selectedStar.name
                    : selectedBody
                    ? selectedBody.name
                    : selectedDso
                    ? selectedDso.name
                    : activeConstellation
                    ? activeConstellation.name
                    : 'İnceleme'}
                </span>
              </button>
              <button
                type="button"
                onClick={clearAllSelection}
                className="px-2 py-1 text-muted hover:text-paper text-xs cursor-pointer"
                title="Seçimi Temizle"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 border border-line bg-ink/80 px-3 py-1 rounded-full text-[11px] text-muted font-mono backdrop-blur-xl">
              <span className="live-dot" />
              <span>360° Planetaryum</span>
              <span className="text-line">|</span>
              <Link href="/harita/samanyolu" className="text-gold hover:text-paper transition-colors flex items-center gap-1 font-semibold">
                <span>3D Galaksi</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. UNIFIED RIGHT INSPECTOR DRAWER */}
      {isInspectorOpen && (selectedStar || selectedBody || selectedDso || activeConstellation) && (
        <aside
          aria-label="Gök Cismi İnceleme Paneli"
          className="ticks absolute top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md z-40 border-l border-line bg-ink/95 p-6 shadow-2xl backdrop-blur-2xl flex flex-col font-mono text-paper overflow-y-auto"
        >
          <Ticks />

          {/* Drawer Top Header */}
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <div className="flex items-center gap-2">
              {activeConstellation ? (
                <>
                  <ConstellationGlyph id={activeConstellation.glyphId} size={16} className="text-gold" />
                  <span className="label text-gold">Takımyıldız Dosyası</span>
                </>
              ) : selectedStar ? (
                <>
                  <TelescopeGlyph size={15} className="text-lime" />
                  <span className="label text-lime">Yıldız Spektrumu</span>
                </>
              ) : selectedBody ? (
                <>
                  <PlanetGlyph planet={selectedBody.id} size={16} className="text-gold" />
                  <span className="label text-gold">Güneş Sistemi Cismi</span>
                </>
              ) : selectedDso ? (
                <>
                  <GalaxySpiralGlyph size={15} className="text-lime" />
                  <span className="label text-lime">Derin Uzay Cismi</span>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setIsInspectorOpen(false)}
              className="label text-muted hover:text-paper px-2 py-1 cursor-pointer transition-colors text-sm"
              title="Paneli Gizle"
            >
              ✕
            </button>
          </div>

          {/* A. CONSTELLATION DOSSIER VIEW */}
          {activeConstellation && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="display display-tight text-2xl font-bold text-paper">
                  {activeConstellation.name}
                </h2>
                <span className="label text-muted italic text-xs">{activeConstellation.latinName}</span>
              </div>

              <div className="label text-gold text-xs flex items-center gap-1.5 bg-gold/10 border border-gold/20 p-2 rounded">
                <Sparkles size={12} className="text-gold shrink-0" />
                <span>Ana Yıldız: <strong className="text-paper">{activeConstellation.mainStar}</strong></span>
              </div>

              <p className="text-xs text-paper/85 leading-relaxed">
                {activeConstellation.description}
              </p>

              <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs">
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Çizilen Yıldız</span>
                  <span className="font-bold text-gold">{activeConstellation.starIndices.length} Yıldız</span>
                </div>
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Merkez Sağ Açıklık</span>
                  <span className="font-bold text-paper">{(activeConstellation.centerRa / 15).toFixed(1)}h</span>
                </div>
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Merkez Dik Açıklık</span>
                  <span className="font-bold text-paper">+{activeConstellation.centerDec.toFixed(1)}°</span>
                </div>
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Gözlem Durumu</span>
                  <span className="font-bold text-lime">Sirkumpolar</span>
                </div>
              </div>

              {/* Star-Hopping Guide */}
              {activeConstellation.pointerGuide && (
                <div className="border border-gold/30 bg-gold/5 p-3 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="label text-gold font-bold flex items-center gap-1.5">
                      <Orbit size={12} className="text-gold" />
                      Yıldız Atlama Kılavuzu
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
                      {showStarHoppingGuide ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>
                  <p className="text-[11px] text-paper/75 leading-relaxed">
                    {activeConstellation.pointerGuide.description}
                  </p>
                </div>
              )}

              {/* Observation & Mythology Tips */}
              <div className="border border-line bg-ink-2 p-3 text-[11px] text-paper/75 leading-relaxed">
                <span className="label text-muted block text-[10px] mb-1 uppercase tracking-wider">Mitoloji & Gözlem</span>
                {activeConstellation.observationTip}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAnimTrigger((t) => t + 1)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gold bg-gold text-ink py-2 text-xs font-bold transition-all cursor-pointer hover:bg-gold/90"
                >
                  <RefreshCw size={13} />
                  <span>Çizimi Yeniden Oynat</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllSelection}
                  className="border border-line bg-ink-2 hover:bg-ink-3 px-3 py-2 text-xs text-muted hover:text-paper transition-all cursor-pointer"
                >
                  Serbest Bakış
                </button>
              </div>
            </div>
          )}

          {/* B. STAR INSPECTOR VIEW */}
          {selectedStar && (
            <div className="space-y-4">
              <div>
                <h2 className="display display-tight text-2xl font-bold text-paper">
                  {selectedStar.turkishName || selectedStar.name}
                </h2>
                <div className="label text-muted mt-1">{selectedStar.constellation} Takımyıldızı</div>
              </div>

              <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs">
                <div className="bg-ink p-3">
                  <span className="label text-muted block text-[10px]">Görünür Kadir</span>
                  <span className="font-bold text-lime text-base">{selectedStar.magnitude} mag</span>
                </div>
                <div className="bg-ink p-3">
                  <span className="label text-muted block text-[10px]">Sağ Açıklık (RA)</span>
                  <span className="font-bold text-paper text-base">{selectedStar.ra.toFixed(1)}°</span>
                </div>
                <div className="bg-ink p-3">
                  <span className="label text-muted block text-[10px]">Dik Açıklık (Dec)</span>
                  <span className="font-bold text-paper text-base">+{selectedStar.dec.toFixed(1)}°</span>
                </div>
                <div className="bg-ink p-3">
                  <span className="label text-muted block text-[10px]">Tayf Rengi</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="h-3 w-3 rounded-full border border-line" style={{ backgroundColor: selectedStar.color }} />
                    <span className="font-bold text-paper">{selectedStar.color}</span>
                  </div>
                </div>
              </div>

              <div className="border border-line bg-ink-2 p-3 text-xs text-paper/80 leading-relaxed">
                Bu yıldız Dünya’dan çıplak göz veya amatör teleskopla gözlemlenebilen önemli gökyüzü kerterizlerinden biridir.
              </div>
            </div>
          )}

          {/* C. SOLAR SYSTEM BODY VIEW */}
          {selectedBody && (
            <div className="space-y-4">
              <div>
                <h2 className="display display-tight text-2xl font-bold text-paper">{selectedBody.name}</h2>
                <div className="label text-muted mt-1">
                  {selectedBody.isVisible ? '🟢 Ufkun Üzerinde (Gözlemlenebilir)' : '🔴 Ufkun Altında'}
                </div>
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
                <div className="border border-line bg-ink-2 p-3 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="label text-muted block text-[10px]">Ay Aydınlanma Oranı</span>
                    <span className="font-bold text-paper text-lg">%{Math.round(selectedBody.phaseFraction * 100)}</span>
                  </div>
                  <VectorMoonPhase illumination={Math.round(selectedBody.phaseFraction * 100)} waning={(selectedBody.phaseAngle ?? 0) > 180} size={36} className="text-paper" />
                </div>
              )}
            </div>
          )}

          {/* D. DSO VIEW */}
          {selectedDso && (
            <div className="space-y-4">
              <div>
                <h2 className="display display-tight text-2xl font-bold text-paper">{selectedDso.name}</h2>
                <div className="label text-muted mt-1">{selectedDso.distanceLightYears}</div>
              </div>

              {selectedDso.image && (
                <div className="relative h-36 w-full border border-line overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedDso.image.src}
                    alt={selectedDso.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 label px-2 py-0.5 bg-ink/80 border border-line text-[10px] text-paper/80">
                    Hubble / JWST
                  </div>
                </div>
              )}

              <p className="text-xs text-paper/75 leading-relaxed">
                {selectedDso.description}
              </p>

              <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs">
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Tür</span>
                  <span className="font-bold capitalize text-paper">{selectedDso.type}</span>
                </div>
                <div className="bg-ink p-2.5">
                  <span className="label text-muted block text-[10px]">Katalog</span>
                  <span className="font-bold text-lime">{selectedDso.catalog}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 5. CENTERED BOTTOM OBSERVATORY CONTROL DOCK */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto max-w-[95vw]">
        {/* Constellation Selector Popover Strip */}
        {showConstellationPicker && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-2 border border-line bg-ink/95 backdrop-blur-2xl rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              type="button"
              onClick={() => {
                setActiveConstellation(null);
                setShowConstellationPicker(false);
              }}
              className={`label px-3 py-1 rounded-full border text-xs whitespace-nowrap cursor-pointer transition-all ${
                !activeConstellation
                  ? 'border-lime bg-lime text-ink font-bold'
                  : 'border-line bg-ink text-paper/70 hover:text-paper'
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
                    setIsInspectorOpen(true);
                    setAnimTrigger((t) => t + 1);
                    setShowConstellationPicker(false);
                  }}
                  className={`label px-3 py-1 rounded-full border text-xs whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                      : 'border-line bg-ink text-paper/80 hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <ConstellationGlyph id={c.glyphId} size={13} className={isSelected ? 'text-ink' : 'text-gold'} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Floating Dock Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 border border-line bg-ink/90 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-2xl text-xs font-mono">
          {/* Constellation Picker Trigger */}
          <button
            type="button"
            onClick={() => setShowConstellationPicker(!showConstellationPicker)}
            className={`label flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer border ${
              activeConstellation
                ? 'border-gold bg-gold/15 text-gold font-bold'
                : 'border-transparent text-paper/80 hover:text-paper'
            }`}
            title="Takımyıldız Seçici"
          >
            <ConstellationGlyph id={activeConstellation?.glyphId || 'ursa-minor'} size={14} className="text-gold" />
            <span className="hidden sm:inline">{activeConstellation ? activeConstellation.name : 'Takımyıldız'}</span>
            <ChevronDown size={11} className={showConstellationPicker ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          <span className="h-4 w-px bg-line" />

          {/* Milky Way Toggle */}
          <button
            type="button"
            aria-pressed={showMilkyWay}
            onClick={() => setShowMilkyWay(!showMilkyWay)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showMilkyWay ? 'text-paper bg-paper/10' : 'text-muted hover:text-paper'
            }`}
            title="Samanyolu Toz Kuşağı"
          >
            <Sparkles size={14} />
          </button>

          {/* Planets Toggle */}
          <button
            type="button"
            aria-pressed={showPlanets}
            onClick={() => setShowPlanets(!showPlanets)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showPlanets ? 'text-gold bg-gold/10' : 'text-muted hover:text-paper'
            }`}
            title="Güneş & Gezegenler"
          >
            <Orbit size={14} />
          </button>

          {/* Horizon Toggle */}
          <button
            type="button"
            aria-pressed={useLocalHorizon}
            onClick={() => setUseLocalHorizon(!useLocalHorizon)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              useLocalHorizon ? 'text-lime bg-lime/10' : 'text-muted hover:text-paper'
            }`}
            title={useLocalHorizon ? 'Ufuk Modu: Yerel Ufuk Aktif' : 'Ufuk Modu: Tüm Gök Küresi'}
          >
            <Compass size={14} />
          </button>

          {/* Constellation Lines Toggle */}
          <button
            type="button"
            aria-pressed={showConstellations}
            onClick={() => setShowConstellations(!showConstellations)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showConstellations ? 'text-paper bg-paper/10' : 'text-muted hover:text-paper'
            }`}
            title="Takımyıldız Çizgileri"
          >
            <Layers size={14} />
          </button>

          <span className="h-4 w-px bg-line" />

          {/* Red Night Vision Mode */}
          <button
            type="button"
            aria-pressed={nightVision}
            onClick={() => setNightVision(!nightVision)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              nightVision ? 'bg-rose-signal text-ink font-bold' : 'text-muted hover:text-paper'
            }`}
            title="Kırmızı Gece Görüş Modu"
          >
            <Moon size={14} />
          </button>

          {/* Time Flow Speed Toggle */}
          <button
            type="button"
            onClick={() => setTimeFlowRate((prev) => (prev === 1 ? 60 : prev === 60 ? 0 : 1))}
            className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors cursor-pointer ${
              timeFlowRate > 1
                ? 'bg-lime text-ink font-bold'
                : timeFlowRate === 0
                ? 'bg-rose-signal/20 text-rose-signal'
                : 'text-muted hover:text-paper'
            }`}
            title="Zaman Akışı (Canlı / 60x Hızlı / Duraklat)"
          >
            {timeFlowRate === 0 ? <Pause size={12} /> : <Play size={12} />}
            <span className="text-[10px] hidden md:inline">{timeFlowRate === 0 ? 'Durduruldu' : timeFlowRate > 1 ? '60x' : 'Canlı'}</span>
          </button>

          {/* AR Camera Toggle */}
          <button
            type="button"
            onClick={toggleAr}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              isArActive
                ? 'bg-lime text-ink font-bold'
                : 'text-muted hover:text-paper hover:bg-ink-2'
            }`}
            title="AR Kamera Modu"
          >
            <Camera size={13} />
            <span className="text-[10px] hidden md:inline">AR</span>
          </button>
        </div>
      </div>
    </div>
  );
}

