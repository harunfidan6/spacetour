'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBackgroundStarfield, type BackgroundStar } from '@/lib/astrophysics/starfieldCatalog';
import { HERO_BODIES } from './heroScene';

// -------------------------------------------------------------
// 1. PHOTOREALISTIC DUAL-LAYER HDR STARFIELD DOME WITH TWINKLE
// -------------------------------------------------------------
const STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aTwinkle;
  varying vec3 vColor;
  varying float vTwinkle;
  uniform float uTime;

  void main() {
    vColor = color;
    // Harmonic twinkling based on star phase
    float tw = sin(uTime * 1.8 + aTwinkle * 6.28318) * 0.35 + 0.65;
    vTwinkle = tw;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * tw * (180.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Photorealistic Airy disk profile + soft glow envelope
    float core = exp(-dist * 8.0);
    float halo = smoothstep(0.5, 0.0, dist) * 0.45;
    float intensity = (core + halo) * vTwinkle;

    gl_FragColor = vec4(vColor * (1.0 + core * 0.6), intensity);
  }
`;

function PhotorealisticStarfield({ count = 2400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, shaderMaterial } = useMemo(() => {
    const stars: BackgroundStar[] = getBackgroundStarfield(count);
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const twinkles: number[] = [];

    const R = 180.0; // Large background sphere beyond solar orbits

    for (const s of stars) {
      const raRad = THREE.MathUtils.degToRad(s.ra);
      const decRad = THREE.MathUtils.degToRad(s.dec);

      const x = R * Math.cos(decRad) * Math.sin(raRad);
      const y = R * Math.sin(decRad);
      const z = -R * Math.cos(decRad) * Math.cos(raRad);

      positions.push(x, y, z);
      colors.push(s.color[0], s.color[1], s.color[2]);

      // Brightness to size mapping: magnitude 3.0 -> size 2.8, mag 6.5 -> size 1.2
      const sz = Math.max(1.1, (6.8 - s.magnitude) * 0.55);
      sizes.push(sz);
      twinkles.push(s.twinklePhase);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    geo.setAttribute('aTwinkle', new THREE.Float32BufferAttribute(twinkles, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    return { geometry: geo, shaderMaterial: mat };
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (pointsRef.current) {
      // Very gentle, imperceptible cosmic drift
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.0015;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </points>
  );
}

// -------------------------------------------------------------
// 2. SUBTLE MILKY WAY COSMIC NEBULA DUST CLOUDS
// -------------------------------------------------------------
function CosmicNebulaDust() {
  const meshRef = useRef<THREE.Points>(null);

  const { geo, mat } = useMemo(() => {
    const pts: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const dustCount = 800;
    const R = 170.0;

    // Distribute along an inclined galactic plane (approx 60 deg inclination)
    for (let i = 0; i < dustCount; i++) {
      const u = (Math.random() - 0.5) * Math.PI * 2;
      const v = (Math.random() - 0.5) * 0.45; // Concentrated around galactic equator
      
      const rad = R + (Math.random() - 0.5) * 12.0;
      const x = rad * Math.cos(u) * Math.cos(v);
      const y = rad * Math.sin(v) * 0.9;
      const z = rad * Math.sin(u) * Math.cos(v);

      pts.push(x, y, z);

      // Deep interstellar dust palette: cyan-blue, magenta-violet, and amber dust
      const t = Math.random();
      if (t < 0.4) {
        colors.push(0.18, 0.32, 0.65); // Deep cyan/blue
      } else if (t < 0.75) {
        colors.push(0.35, 0.22, 0.58); // Cosmic violet
      } else {
        colors.push(0.55, 0.38, 0.25); // Warm golden dust
      }

      sizes.push(14.0 + Math.random() * 22.0);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));

    // Soft Gaussian dust puff shader
    const m = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (160.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * 0.16;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    return { geo: g, mat: m };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.001;
    }
  });

  return (
    <points ref={meshRef} geometry={geo} material={mat} rotation={[0.45, 0.2, 0.6]} />
  );
}

// -------------------------------------------------------------
// 3. DYNAMIC SHOOTING STARS (KAYAN YILDIZLAR) ENGINE
// -------------------------------------------------------------
interface ShootingStar {
  id: number;
  start: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  length: number;
  startTime: number;
  duration: number;
  color: THREE.Color;
}

function DeepSpaceShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const activeStars = useRef<ShootingStar[]>([]);
  const nextSpawnTime = useRef<number>(0.4);

  const starColors = useMemo(
    () => [
      new THREE.Color('#e0f2fe'), // Icy cyan-white
      new THREE.Color('#fef08a'), // Incandescent golden
      new THREE.Color('#86efac'), // Emerald magnesium trail
      new THREE.Color('#ffffff')  // Pure diamond white
    ],
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const grp = groupRef.current;
    if (!grp) return;

    // 1. Spawn new shooting star periodically
    if (time >= nextSpawnTime.current && activeStars.current.length < 4) {
      const R = 130 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      const start = new THREE.Vector3(
        R * Math.cos(phi) * Math.sin(theta),
        R * Math.sin(phi) + (Math.random() - 0.5) * 20,
        R * Math.cos(phi) * Math.cos(theta)
      );

      // Trajectory direction roughly perpendicular to radius (tangential sweep)
      const tangent = new THREE.Vector3(-start.z, (Math.random() - 0.5) * 40, start.x).normalize();
      const speed = 75 + Math.random() * 45; // High cosmic velocity
      const duration = 0.55 + Math.random() * 0.4;
      const col = starColors[Math.floor(Math.random() * starColors.length)];

      activeStars.current.push({
        id: Math.random(),
        start,
        dir: tangent,
        speed,
        length: 16 + Math.random() * 14,
        startTime: time,
        duration,
        color: col
      });

      // Next spawn in 0.8 to 2.2 seconds
      nextSpawnTime.current = time + 0.8 + Math.random() * 1.4;
    }

    // 2. Animate and update active streaks
    // Clean old children
    while (grp.children.length > 0) {
      const c = grp.children[0] as THREE.Line;
      grp.remove(c);
      c.geometry?.dispose();
    }

    const alive: ShootingStar[] = [];
    for (const star of activeStars.current) {
      const age = time - star.startTime;
      if (age < star.duration) {
        alive.push(star);
        const progress = age / star.duration;
        const currentDist = star.speed * age;

        const head = star.start.clone().addScaledVector(star.dir, currentDist);
        const tail = head.clone().addScaledVector(star.dir, -star.length * (1 - progress * 0.4));

        const geom = new THREE.BufferGeometry().setFromPoints([tail, head]);
        // Tapered opacity: quick surge, then gentle fade
        const opacity = Math.sin(progress * Math.PI) * 0.85;

        const mat = new THREE.LineBasicMaterial({
          color: star.color,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geom, mat);
        grp.add(line);

        // Blinding incandescent bolide head
        const headGeom = new THREE.SphereGeometry(0.24, 8, 8);
        const headMat = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          transparent: true,
          opacity: Math.min(1.0, opacity * 1.6),
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const headMesh = new THREE.Mesh(headGeom, headMat);
        headMesh.position.copy(head);
        grp.add(headMesh);

        // Trailing disintegration spark droplets
        const spkPts: number[] = [];
        for (let s = 1; s <= 5; s++) {
          const spkDist = currentDist - (star.length * 0.18 * s);
          if (spkDist > 0) {
            const jitter = (Math.sin(s * 8.4 + time * 14.0) - 0.5) * 0.35;
            const p = star.start.clone().addScaledVector(star.dir, spkDist);
            spkPts.push(p.x + jitter, p.y + jitter, p.z + jitter);
          }
        }
        if (spkPts.length > 0) {
          const spkGeo = new THREE.BufferGeometry();
          spkGeo.setAttribute('position', new THREE.Float32BufferAttribute(spkPts, 3));
          const spkMat = new THREE.PointsMaterial({
            size: 0.16,
            color: star.color,
            transparent: true,
            opacity: opacity * 0.75,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          grp.add(new THREE.Points(spkGeo, spkMat));
        }
      }
    }
    activeStars.current = alive;
  });

  return <group ref={groupRef} />;
}

// -------------------------------------------------------------
// 4. PLANETARY METEOR IMPACT SYSTEM (GEZEGENLERE METEOR DÜŞEN SİSTEM)
// -------------------------------------------------------------
interface ImpactEvent {
  id: number;
  planetId: string;
  planetName: string;
  dist: number;
  period: number;
  phase: number;
  radius: number;
  localNormal: THREE.Vector3;
  incomingDir: THREE.Vector3;
  startTime: number;
  flightDuration: number;
  impactTime: number;
  fadeDuration: number;
  colorHex: string;
  sparkCount: number;
  sparks: { dir: THREE.Vector3; speed: number; size: number }[];
}

export function PlanetaryMeteorStrikes() {
  const containerRef = useRef<THREE.Group>(null);
  const activeStrikes = useRef<ImpactEvent[]>([]);
  const nextStrikeTime = useRef<number>(0.6);

  // Targets eligible for dynamic meteor strikes:
  const STRIKE_TARGETS = useMemo(
    () => [
      { id: 'dunya', name: 'Dünya', dist: 9.4, r: 0.56, period: 18, phase: 0.02, color: '#38bdf8', sparks: 16 }, // Earth (Rayleigh cyan/gold)
      { id: 'mars', name: 'Mars', dist: 11.5, r: 0.42, period: 25, phase: 0.4, color: '#fb923c', sparks: 14 },  // Mars (Amber/crimson)
      { id: 'jupiter', name: 'Jüpiter', dist: 15.2, r: 1.4, period: 40, phase: 0.78, color: '#fef08a', sparks: 22 }, // Jupiter (Massive bolide)
      { id: 'venus', name: 'Venüs', dist: 7.3, r: 0.52, period: 13, phase: 0.62, color: '#fed7aa', sparks: 14 },  // Venus (Golden veil)
      { id: 'merkur', name: 'Merkür', dist: 5.4, r: 0.3, period: 9, phase: 0.15, color: '#ffffff', sparks: 12 }   // Mercury (Direct crater impact)
    ],
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const container = containerRef.current;
    if (!container) return;

    // 1. Spawn a new targeted meteor strike every 1.6 - 3.2 seconds
    if (time >= nextStrikeTime.current && activeStrikes.current.length < 4) {
      const target = STRIKE_TARGETS[Math.floor(Math.random() * STRIKE_TARGETS.length)];
      
      // Random surface normal on planet sphere
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const localNormal = new THREE.Vector3(
        Math.cos(v) * Math.cos(u),
        Math.sin(v),
        Math.cos(v) * Math.sin(u)
      ).normalize();

      // Incoming vector aimed inward from high orbit (16-24 units away)
      const incomingDir = localNormal.clone().add(
        new THREE.Vector3((Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7)
      ).normalize();

      const flightDuration = 0.7 + Math.random() * 0.3;
      const impactTime = time + flightDuration;
      const fadeDuration = 0.7;

      // Pre-compute spark explosion velocities
      const sparkList = [];
      const sparkCount = target.sparks;
      for (let s = 0; s < sparkCount; s++) {
        // Ejecta cone radiating away from impact site
        const spkDir = localNormal.clone().add(
          new THREE.Vector3((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6)
        ).normalize();
        sparkList.push({
          dir: spkDir,
          speed: 1.8 + Math.random() * 3.2,
          size: 0.05 + Math.random() * 0.06
        });
      }

      activeStrikes.current.push({
        id: Math.random(),
        planetId: target.id,
        planetName: target.name,
        dist: target.dist,
        period: target.period,
        phase: target.phase,
        radius: target.r,
        localNormal,
        incomingDir,
        startTime: time,
        flightDuration,
        impactTime,
        fadeDuration,
        colorHex: target.color,
        sparkCount,
        sparks: sparkList
      });

      nextStrikeTime.current = time + 1.6 + Math.random() * 1.8;
    }

    // 2. Render all active strikes & impact explosions
    while (container.children.length > 0) {
      const child = container.children[0] as THREE.Mesh;
      container.remove(child);
      child.geometry?.dispose();
    }

    const alive: ImpactEvent[] = [];

    for (const strike of activeStrikes.current) {
      const totalLifespan = strike.flightDuration + strike.fadeDuration;
      const age = time - strike.startTime;

      if (age < totalLifespan) {
        alive.push(strike);

        // Calculate planet's current world coordinate at this exact moment
        const clockNow = strike.phase * strike.period + time;
        const planetAngle = (clockNow / strike.period) * Math.PI * 2;
        const planetPos = new THREE.Vector3(
          Math.cos(planetAngle) * strike.dist,
          0,
          Math.sin(planetAngle) * strike.dist
        );

        // Impact coordinate on the planet's atmospheric boundary
        const impactPoint = planetPos.clone().addScaledVector(strike.localNormal, strike.radius * 1.02);

        // PHASE A: BALLISTIC ENTRY FLIGHT (Incoming streak)
        if (time < strike.impactTime) {
          const flightProgress = (time - strike.startTime) / strike.flightDuration; // 0 -> 1
          const approachDist = 18.0 * (1.0 - flightProgress); // 18 -> 0

          const meteorHead = impactPoint.clone().addScaledVector(strike.incomingDir, approachDist);
          const meteorTail = meteorHead.clone().addScaledVector(strike.incomingDir, Math.min(4.5, 1.5 + approachDist * 0.3));

          // Draw hypersonic plasma streak
          const lineGeom = new THREE.BufferGeometry().setFromPoints([meteorTail, meteorHead]);
          const lineMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(strike.colorHex),
            transparent: true,
            opacity: Math.min(1.0, flightProgress * 1.8),
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const trailLine = new THREE.Line(lineGeom, lineMat);
          container.add(trailLine);

          // Glowing meteoroid core
          const coreGeom = new THREE.SphereGeometry(0.12, 10, 10);
          const coreMat = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.98,
            blending: THREE.AdditiveBlending
          });
          const coreMesh = new THREE.Mesh(coreGeom, coreMat);
          coreMesh.position.copy(meteorHead);
          container.add(coreMesh);
        }

        // PHASE B: ATMOSPHERIC IMPACT EXPLOSION (Thermal Flash & Plasma Sparks)
        else {
          const impactAge = time - strike.impactTime;
          const impactProgress = impactAge / strike.fadeDuration; // 0 -> 1
          const intensity = Math.max(0, 1.0 - impactProgress);

          // 1. Thermal fireball flash (scales up rapidly then dissipates)
          const flashScale = strike.radius * (0.42 + impactProgress * 0.95);
          const flashGeom = new THREE.SphereGeometry(flashScale, 16, 16);
          const flashMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(strike.colorHex),
            transparent: true,
            opacity: intensity * 0.95,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const flashMesh = new THREE.Mesh(flashGeom, flashMat);
          flashMesh.position.copy(impactPoint);
          container.add(flashMesh);

          // Brilliant white nuclear core at impact point
          const innerCoreGeom = new THREE.SphereGeometry(flashScale * 0.48, 12, 12);
          const innerCoreMat = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: Math.max(0, 1.0 - impactProgress * 2.2),
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const innerCoreMesh = new THREE.Mesh(innerCoreGeom, innerCoreMat);
          innerCoreMesh.position.copy(impactPoint);
          container.add(innerCoreMesh);

          // 2. Primary expanding plasma shockwave ring
          const ringGeom = new THREE.RingGeometry(flashScale * 0.85, flashScale * 1.15, 32);
          const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(strike.colorHex),
            transparent: true,
            opacity: intensity * 0.75,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const ringMesh = new THREE.Mesh(ringGeom, ringMat);
          ringMesh.position.copy(impactPoint);
          ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), strike.localNormal);
          container.add(ringMesh);

          // Secondary wider rarefaction wave ring
          const ring2Geom = new THREE.RingGeometry(flashScale * 1.25, flashScale * 1.45, 32);
          const ring2Mat = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: intensity * 0.35,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const ring2Mesh = new THREE.Mesh(ring2Geom, ring2Mat);
          ring2Mesh.position.copy(impactPoint);
          ring2Mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), strike.localNormal);
          container.add(ring2Mesh);

          // 3. Cooling Thermal Crater Scar (Termal Kor): glowing crater cooling from white to gold to dark ember
          const craterScale = strike.radius * 0.32;
          const craterGeom = new THREE.SphereGeometry(craterScale, 12, 12);
          const craterColor = new THREE.Color('#ffffff')
            .lerp(new THREE.Color('#f59e0b'), Math.min(1.0, impactProgress * 1.5))
            .lerp(new THREE.Color('#b91c1c'), Math.min(1.0, Math.max(0.0, (impactProgress - 0.4) * 2.0)));
          const craterMat = new THREE.MeshBasicMaterial({
            color: craterColor,
            transparent: true,
            opacity: Math.max(0, 1.0 - impactProgress * 1.1) * 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          const craterMesh = new THREE.Mesh(craterGeom, craterMat);
          craterMesh.position.copy(impactPoint);
          container.add(craterMesh);

          // 4. Glowing debris sparks (flying outward in conical spray)
          for (const spk of strike.sparks) {
            const spkDist = spk.speed * impactAge;
            const spkPos = impactPoint.clone().addScaledVector(spk.dir, spkDist);
            const sparkGeom = new THREE.SphereGeometry(spk.size * intensity, 6, 6);
            const sparkMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color(strike.colorHex),
              transparent: true,
              opacity: intensity * 0.9,
              depthWrite: false,
              blending: THREE.AdditiveBlending
            });
            const sparkMesh = new THREE.Mesh(sparkGeom, sparkMat);
            sparkMesh.position.copy(spkPos);
            container.add(sparkMesh);
          }
        }
      }
    }

    activeStrikes.current = alive;
  });

  return <group ref={containerRef} />;
}

// -------------------------------------------------------------
// 5. MASTER COSMIC HERO BACKDROP COMPONENT
// -------------------------------------------------------------
export function CosmicHeroBackdrop() {
  return (
    <group>
      {/* 2,400+ Procedural Twinkling HDR Stars */}
      <PhotorealisticStarfield count={2400} />

      {/* Volumetric Cosmic Nebula & Interstellar Dust */}
      <CosmicNebulaDust />

      {/* Spontaneous Deep Space Shooting Stars */}
      <DeepSpaceShootingStars />

      {/* Dynamic Planetary Meteor Strikes & Atmosphere Impacts */}
      <PlanetaryMeteorStrikes />
    </group>
  );
}
