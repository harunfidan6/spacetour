'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpace, DESTINATIONS, DestinationId } from './SpaceContext';
import {
  createSunTexture,
  createEarthTexture,
  createJupiterTexture,
  createSaturnRingTexture,
  createSaturnTexture,
  createMarsTexture,
  createAccretionDiskTexture,
  createEarthNightTexture,
  createNebulaDustTexture
} from './textures';

// -------------------------------------------------------------
// 1. CINEMATIC FLIGHT CONTROLLER (Smooth Lerp + Dynamic Orbit Drift)
// -------------------------------------------------------------
function FlightCameraController() {
  const { currentDestination, isWarping, autoPilot, setDestination } = useSpace();
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 40, 70));
  const mouse = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto pilot cycle
  useEffect(() => {
    if (!autoPilot) return;
    const destKeys: DestinationId[] = ['sun', 'earth', 'mars', 'jupiter', 'saturn', 'blackhole', 'solar-overview'];
    let idx = destKeys.indexOf(currentDestination.id);
    const timer = setInterval(() => {
      idx = (idx + 1) % destKeys.length;
      setDestination(destKeys[idx]);
    }, 9000);
    return () => clearInterval(timer);
  }, [autoPilot, currentDestination.id, setDestination]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const target = new THREE.Vector3(...currentDestination.targetPosition);
    const targetLook = new THREE.Vector3(...currentDestination.lookAt);

    // Natural subtle space float (orbital drift)
    const driftX = Math.sin(timeRef.current * 0.15) * 0.6;
    const driftY = Math.cos(timeRef.current * 0.12) * 0.4;
    const driftZ = Math.sin(timeRef.current * 0.08) * 0.5;

    const lerpFactor = isWarping ? 3.0 * delta : 1.4 * delta;

    if (!isWarping) {
      target.x += mouse.current.x * 2.5 + driftX;
      target.y -= mouse.current.y * 1.8 - driftY;
      target.z += driftZ;
    } else {
      // Warp camera vibration
      target.x += (Math.random() - 0.5) * 0.6;
      target.y += (Math.random() - 0.5) * 0.6;
      target.z += (Math.random() - 0.5) * 0.6;
    }

    currentPos.current.lerp(target, Math.min(lerpFactor, 0.08));
    lookAtTarget.current.lerp(targetLook, Math.min(lerpFactor * 1.3, 0.1));

    camera.position.copy(currentPos.current);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

// -------------------------------------------------------------
// 2. HYPERSPACE & WARP SPEED STARFIELD
// -------------------------------------------------------------
function WarpStars() {
  const { isWarping, throttle } = useSpace();
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4500;

  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const palette = [
      [1.0, 1.0, 1.0],      // White
      [0.6, 0.85, 1.0],     // Light Cyan
      [1.0, 0.85, 0.6],     // Warm Gold
      [0.8, 0.7, 1.0],      // Pale Violet
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400;
      spd[i] = Math.random() * 0.6 + 0.2;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return [pos, spd, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speedMult = (isWarping ? 25.0 : 0.8) * throttle;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += speeds[i] * speedMult * delta * 20;
      if (pos[i * 3 + 2] > 200) {
        pos[i * 3 + 2] = -200;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isWarping ? 2.2 : 1.1}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 3. COSMIC DUST NEBULAE (Volumetric Clouds in Deep Space)
// -------------------------------------------------------------
function DeepSpaceNebulae() {
  const purpleTex = useMemo(() => createNebulaDustTexture('#8a3ffc'), []);
  const cyanTex = useMemo(() => createNebulaDustTexture('#00d4ff'), []);
  const goldTex = useMemo(() => createNebulaDustTexture('#ffaa00'), []);

  return (
    <group>
      {/* Distant Purple Nebula Cloud */}
      <sprite position={[-90, 40, -120]} scale={[140, 140, 1]}>
        <spriteMaterial map={purpleTex} transparent opacity={0.16} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Cyan Cosmic Dust Layer */}
      <sprite position={[110, -30, -140]} scale={[180, 180, 1]}>
        <spriteMaterial map={cyanTex} transparent opacity={0.14} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Golden Accretion Haze */}
      <sprite position={[60, 60, -90]} scale={[120, 120, 1]}>
        <spriteMaterial map={goldTex} transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Near Black Hole Cosmic Rift */}
      <sprite position={[-60, 20, 150]} scale={[160, 160, 1]}>
        <spriteMaterial map={purpleTex} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// -------------------------------------------------------------
// 4. THE SUN: Multi-layer Plasma, Solar Prominences & Dynamic Corona
// -------------------------------------------------------------
function Sun() {
  const sunMesh = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const prominenceRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createSunTexture(), []);

  useFrame((_, delta) => {
    if (sunMesh.current) sunMesh.current.rotation.y += delta * 0.04;
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.z -= delta * 0.02;
      const s = 1.12 + Math.sin(Date.now() * 0.002) * 0.03;
      innerCoronaRef.current.scale.set(s, s, s);
    }
    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.z += delta * 0.015;
      const s = 1.35 + Math.cos(Date.now() * 0.0015) * 0.05;
      outerCoronaRef.current.scale.set(s, s, s);
    }
    if (prominenceRef.current) {
      prominenceRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Photosphere Core */}
      <mesh ref={sunMesh}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* 2. Inner White-Hot Corona */}
      <mesh ref={innerCoronaRef}>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.45}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Outer Fiery Solar Atmosphere */}
      <mesh ref={outerCoronaRef}>
        <sphereGeometry args={[6.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Solar Prominence Loops */}
      <group ref={prominenceRef}>
        <mesh position={[4.8, 1.2, 0]} rotation={[0, 0, 0.4]}>
          <torusGeometry args={[1.2, 0.12, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[-4.5, -1.8, 1.0]} rotation={[0.4, 0.2, -0.6]}>
          <torusGeometry args={[0.9, 0.1, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Dynamic Solar Illumination */}
      <pointLight color="#fff8e7" intensity={5.0} distance={350} decay={1.1} />
    </group>
  );
}

// -------------------------------------------------------------
// 5. EARTH: Continents, Oceans, Rotating Clouds, Night Lights & Moon
// -------------------------------------------------------------
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const textures = useMemo(() => createEarthTexture(), []);
  const nightTexture = useMemo(() => createEarthNightTexture(), []);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.12;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.16;
    if (nightRef.current) nightRef.current.rotation.y += delta * 0.12;
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={DESTINATIONS.earth.coords}>
      {/* 1. Earth Day Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={textures.map}
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Earth Night Lights Overlay */}
      <mesh ref={nightRef} scale={1.002}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial
          map={nightTexture}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.53, 64, 64]} />
        <meshStandardMaterial
          map={textures.clouds}
          transparent
          opacity={0.68}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Rayleigh Atmospheric Blue Halo */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#00b4ff"
          transparent
          opacity={0.24}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Realistic Moon Orbit */}
      <group ref={moonOrbitRef}>
        <mesh position={[3.6, 0.4, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#c2c7cd" roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 6. MARS: Rust Basalt, Canyons, Polar Caps & Moons
// -------------------------------------------------------------
function Mars() {
  const marsRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createMarsTexture(), []);

  useFrame((_, delta) => {
    if (marsRef.current) marsRef.current.rotation.y += delta * 0.11;
    if (moonsRef.current) moonsRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={DESTINATIONS.mars.coords}>
      <mesh ref={marsRef}>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={0.78} />
      </mesh>

      {/* Thin Salmon Atmosphere Halo */}
      <mesh scale={1.07}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color="#ff4422"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Phobos & Deimos Moons */}
      <group ref={moonsRef}>
        <mesh position={[2.0, 0.2, 0]}>
          <dodecahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial color="#887766" roughness={0.9} />
        </mesh>
        <mesh position={[-2.8, -0.15, 0]}>
          <dodecahedronGeometry args={[0.05, 0]} />
          <meshStandardMaterial color="#776655" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 7. JUPITER: Zonal Bands, Great Red Spot & Galilean Moons
// -------------------------------------------------------------
function Jupiter() {
  const jupiterRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => createJupiterTexture(), []);

  useFrame((_, delta) => {
    if (jupiterRef.current) jupiterRef.current.rotation.y += delta * 0.26;
    if (moonsRef.current) moonsRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group position={DESTINATIONS.jupiter.coords}>
      <mesh ref={jupiterRef}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.55} />
      </mesh>

      {/* Warm Jovian Haze Halo */}
      <mesh scale={1.05}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial
          color="#d7a050"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Galilean Moons (Io, Europa, Ganymede, Callisto) */}
      <group ref={moonsRef}>
        <mesh position={[5.2, 0.1, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#e5c158" /> {/* Io */}
        </mesh>
        <mesh position={[6.6, -0.1, 1.2]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#cadbe8" /> {/* Europa */}
        </mesh>
        <mesh position={[8.4, 0.2, -1.5]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#8e8275" /> {/* Ganymede */}
        </mesh>
        <mesh position={[10.5, -0.2, 0.5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#554d46" /> {/* Callisto */}
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 8. SATURN: Creamy Bands, Icy Rings with Cassini Division & Shadow
// -------------------------------------------------------------
function Saturn() {
  const saturnRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const titanRef = useRef<THREE.Mesh>(null);
  const planetTexture = useMemo(() => createSaturnTexture(), []);
  const ringTexture = useMemo(() => createSaturnRingTexture(), []);

  useFrame((_, delta) => {
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.18;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.04;
    if (titanRef.current) titanRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group position={DESTINATIONS.saturn.coords} rotation={[0.42, 0.18, 0]}>
      {/* 1. Saturn Globe */}
      <mesh ref={saturnRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial map={planetTexture} roughness={0.62} />
      </mesh>

      {/* 2. Saturn Atmospheric Haze */}
      <mesh scale={1.06}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ebd59b"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. The Majestic Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.3, 6.8, 128]} />
        <meshStandardMaterial
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
          roughness={0.4}
        />
      </mesh>

      {/* 4. Giant Moon Titan with Orange Smog */}
      <group rotation={[0.1, 0, 0]}>
        <mesh ref={titanRef} position={[7.8, 0.5, 0]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#e89838" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 9. BLACK HOLE (GARGANTUA): Gravitational Lensing & Relativistic Accretion Disk
// -------------------------------------------------------------
function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const lensRingRef = useRef<THREE.Mesh>(null);
  const accretionTexture = useMemo(() => createAccretionDiskTexture(), []);

  useFrame((_, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.9;
    if (lensRingRef.current) lensRingRef.current.rotation.z -= delta * 0.6;
  });

  return (
    <group position={DESTINATIONS.blackhole.coords} rotation={[0.55, 0.35, 0]}>
      {/* 1. The Event Horizon: Pure Inky Blackness */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Gravitational Photon Ring (Ultra-sharp incandescent boundary) */}
      <mesh scale={1.04}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.5}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Equatorial Accretion Disk */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.7, 10.5, 96]} />
        <meshBasicMaterial
          map={accretionTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Kip Thorne Gravitational Lensing Vertical Arch (Interstellar visual hallmark) */}
      <mesh ref={lensRingRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[3.8, 7.8, 96]} />
        <meshBasicMaterial
          map={accretionTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 10. ORBIT TRAILS & ASTEROID BELT
// -------------------------------------------------------------
function OrbitLines() {
  const radii = [24, 34, 50, 70]; // Earth, Mars, Jupiter, Saturn
  const lineObjects = useMemo(() => {
    return radii.map((r) => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group>
      {lineObjects.map((geom, idx) => (
        <lineLoop key={idx} geometry={geom}>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.14} />
        </lineLoop>
      ))}
    </group>
  );
}

function AsteroidBelt() {
  const count = 750;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const minR = 39;
    const maxR = 45;

    for (let i = 0; i < count; i++) {
      const radius = minR + Math.random() * (maxR - minR);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.5;
      const scale = Math.random() * 0.22 + 0.06;

      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6a6258" roughness={0.9} />
    </instancedMesh>
  );
}

// -------------------------------------------------------------
// 11. MINIMALIST FLOATING CELESTIAL TRAVEL BAR (Clean & Modern Glass UI)
// -------------------------------------------------------------
export function SpaceTravelNav() {
  const { currentDestination, setDestination, autoPilot, toggleAutoPilot } = useSpace();

  const destinations: { id: DestinationId; name: string; icon: string }[] = [
    { id: 'sun', name: 'Güneş', icon: '☀️' },
    { id: 'earth', name: 'Dünya', icon: '🌍' },
    { id: 'mars', name: 'Mars', icon: '🔴' },
    { id: 'jupiter', name: 'Jüpiter', icon: '🪐' },
    { id: 'saturn', name: 'Satürn', icon: '🪐' },
    { id: 'blackhole', name: 'Gargantua', icon: '🕳️' },
    { id: 'solar-overview', name: 'Güneş Sistemi', icon: '🌌' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/80 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {destinations.map((d) => {
        const isActive = currentDestination.id === d.id;
        return (
          <button
            key={d.id}
            onClick={() => setDestination(d.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-primary/30 to-secondary/30 text-white border border-primary/40 shadow-[0_0_15px_rgba(0,212,255,0.35)] scale-105'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-sm">{d.icon}</span>
            <span className="hidden sm:inline">{d.name}</span>
          </button>
        );
      })}

      <div className="h-4 w-px bg-card-border/60 mx-1 hidden sm:block" />

      <button
        onClick={toggleAutoPilot}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
          autoPilot
            ? 'bg-secondary text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
            : 'border border-card-border/60 bg-card-bg/50 text-text-secondary hover:text-white'
        }`}
        title="Otomatik Tur Modu"
      >
        <span className="relative flex h-2 w-2">
          {autoPilot && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${autoPilot ? 'bg-white' : 'bg-text-secondary'}`} />
        </span>
        <span className="hidden sm:inline">Otomatik Tur</span>
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN 3D UNIVERSE CANVAS
// -------------------------------------------------------------
export function SpaceJourneyEngine() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto w-full h-full overflow-hidden bg-[#03030a]">
      <Canvas
        camera={{ position: [0, 35, 65], fov: 48, near: 0.1, far: 1200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#030309']} />

        {/* Ambient Cosmic Illumination */}
        <ambientLight intensity={0.28} />

        {/* Deep Space Background Nebulae */}
        <DeepSpaceNebulae />

        {/* Core Celestial Bodies */}
        <Sun />
        <Earth />
        <Mars />
        <Jupiter />
        <Saturn />
        <BlackHole />

        {/* Orbits & Asteroids */}
        <OrbitLines />
        <AsteroidBelt />

        {/* Dynamic Hyperspace Field */}
        <WarpStars />

        {/* Smooth Cinematic Camera Movement */}
        <FlightCameraController />
      </Canvas>

      {/* Floating Modern Space Travel Navigation Pill */}
      <SpaceTravelNav />
    </div>
  );
}
