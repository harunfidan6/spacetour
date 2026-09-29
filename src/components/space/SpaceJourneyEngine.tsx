'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpace, DESTINATIONS, DestinationId } from './SpaceContext';
import {
  NASA_TEXTURES,
  loadNasaTexture,
  AccretionDiskShader
} from './nasaTextures';

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
    }, 10000);
    return () => clearInterval(timer);
  }, [autoPilot, currentDestination.id, setDestination]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const target = new THREE.Vector3(...currentDestination.targetPosition);
    const targetLook = new THREE.Vector3(...currentDestination.lookAt);

    // Natural subtle space float (orbital drift)
    const driftX = Math.sin(timeRef.current * 0.12) * 0.5;
    const driftY = Math.cos(timeRef.current * 0.1) * 0.3;
    const driftZ = Math.sin(timeRef.current * 0.08) * 0.4;

    const lerpFactor = isWarping ? Math.min(4.5 * delta, 0.22) : Math.min(1.2 * delta, 0.06);

    if (!isWarping) {
      target.x += mouse.current.x * 2.0 + driftX;
      target.y -= mouse.current.y * 1.5 - driftY;
      target.z += driftZ;
    } else {
      // Relativistic high-speed metric vibration
      const shake = 0.85;
      target.x += (Math.random() - 0.5) * shake;
      target.y += (Math.random() - 0.5) * shake;
      target.z += (Math.random() - 0.5) * shake;
    }

    currentPos.current.lerp(target, lerpFactor);
    lookAtTarget.current.lerp(targetLook, Math.min(lerpFactor * 1.3, 0.25));

    camera.position.copy(currentPos.current);
    camera.lookAt(lookAtTarget.current);

    // Dynamic FOV distortion (warp stretch)
    if ('fov' in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      const targetFov = isWarping ? 82 : 45;
      persp.fov = THREE.MathUtils.lerp(persp.fov, targetFov, delta * (isWarping ? 6.5 : 3.5));
      persp.updateProjectionMatrix();
    }
  });

  return null;
}

// -------------------------------------------------------------
// 2. REAL MILKY WAY SKYBOX & DEEP SPACE PANORAMA
// -------------------------------------------------------------
function DeepSpaceMilkyWay() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.milkyWay);
    if (tex) setTexture(tex);
  }, []);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[900, 32, 32]} />
      {texture ? (
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      ) : (
        <meshBasicMaterial color="#020206" side={THREE.BackSide} />
      )}
    </mesh>
  );
}

// -------------------------------------------------------------
// 3. WARP SPEED STARFIELD PARTICLES
// -------------------------------------------------------------
function WarpStars() {
  const { isWarping, throttle } = useSpace();
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3500;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 350;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 350;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 350;
      spd[i] = Math.random() * 0.5 + 0.2;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speedMult = (isWarping ? 110.0 : 0.6) * throttle;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += speeds[i] * speedMult * delta * 20;
      if (pos[i * 3 + 2] > 180) {
        pos[i * 3 + 2] = -180;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isWarping ? 3.2 : 0.8}
        color={isWarping ? '#d4ff3d' : '#e6f0ff'}
        transparent
        opacity={isWarping ? 1.0 : 0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// 4. THE SUN: NASA SDO Plasma Texture & Atmospheric Corona
// -------------------------------------------------------------
function Sun() {
  const sunMesh = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const [sunTex, setSunTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.sun);
    if (tex) setSunTex(tex);
  }, []);

  useFrame((_, delta) => {
    if (sunMesh.current) sunMesh.current.rotation.y += delta * 0.02;
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.z -= delta * 0.015;
      const s = 1.08 + Math.sin(Date.now() * 0.0018) * 0.02;
      innerCoronaRef.current.scale.set(s, s, s);
    }
    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.z += delta * 0.01;
      const s = 1.28 + Math.cos(Date.now() * 0.0012) * 0.03;
      outerCoronaRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Photosphere Sphere */}
      <mesh ref={sunMesh}>
        <sphereGeometry args={[5, 64, 64]} />
        {sunTex ? (
          <meshBasicMaterial map={sunTex} />
        ) : (
          <meshBasicMaterial color="#ffaa00" />
        )}
      </mesh>

      {/* 2. Inner Hot Coronal Atmosphere */}
      <mesh ref={innerCoronaRef}>
        <sphereGeometry args={[5.4, 32, 32]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Outer Solar Halo */}
      <mesh ref={outerCoronaRef}>
        <sphereGeometry args={[6.5, 32, 32]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Solar Illuminator for the entire solar system */}
      <pointLight color="#fff8ea" intensity={5.5} distance={400} decay={1.1} />
    </group>
  );
}

// -------------------------------------------------------------
// 5. EARTH & MOON: NASA Blue Marble (Albedo + Specular + Normal + Clouds)
// -------------------------------------------------------------
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);

  const [textures, setTextures] = useState<{
    map: THREE.Texture | null;
    clouds: THREE.Texture | null;
    specular: THREE.Texture | null;
    normal: THREE.Texture | null;
    moon: THREE.Texture | null;
  }>({
    map: null,
    clouds: null,
    specular: null,
    normal: null,
    moon: null
  });

  useEffect(() => {
    setTextures({
      map: loadNasaTexture(NASA_TEXTURES.earthMap),
      clouds: loadNasaTexture(NASA_TEXTURES.earthClouds),
      specular: loadNasaTexture(NASA_TEXTURES.earthSpecular),
      normal: loadNasaTexture(NASA_TEXTURES.earthNormal),
      moon: loadNasaTexture(NASA_TEXTURES.moon),
    });
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.08;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.1;
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group position={DESTINATIONS.earth.coords}>
      {/* 1. Earth Globe with NASA PBR Maps */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={textures.map || undefined}
          roughnessMap={textures.specular || undefined}
          roughness={0.55}
          metalness={0.1}
          normalMap={textures.normal || undefined}
          normalScale={new THREE.Vector2(0.2, 0.2)}
        />
      </mesh>

      {/* 2. Independent Real Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.53, 64, 64]} />
        {textures.clouds && (
          <meshStandardMaterial
            map={textures.clouds}
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
          />
        )}
      </mesh>

      {/* 3. Atmospheric Rayleigh Scattering Blue Rim Glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Realistic Moon with NASA LRO Texture */}
      <group ref={moonOrbitRef}>
        <mesh position={[3.8, 0.4, 0]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial
            map={textures.moon || undefined}
            color={textures.moon ? '#ffffff' : '#b0b5bc'}
            roughness={0.88}
          />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 6. MARS: NASA Viking/MGS Texture & Topography
// -------------------------------------------------------------
function Mars() {
  const marsRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.mars);
    if (tex) setTexture(tex);
  }, []);

  useFrame((_, delta) => {
    if (marsRef.current) marsRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group position={DESTINATIONS.mars.coords}>
      <mesh ref={marsRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#b74418'}
          roughness={0.75}
        />
      </mesh>

      {/* Thin Salmon Atmospheric Rim */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color="#ff4422"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 7. JUPITER: NASA Cassini 2K Zonal Bands
// -------------------------------------------------------------
function Jupiter() {
  const jupiterRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.jupiter);
    if (tex) setTexture(tex);
  }, []);

  useFrame((_, delta) => {
    if (jupiterRef.current) jupiterRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group position={DESTINATIONS.jupiter.coords}>
      <mesh ref={jupiterRef}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#c88b3a'}
          roughness={0.5}
        />
      </mesh>

      {/* Soft Jovian Atmosphere Haze */}
      <mesh scale={1.03}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial
          color="#dca565"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 8. SATURN: NASA Cassini Globe & Translucent Rings
// -------------------------------------------------------------
function Saturn() {
  const saturnRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<{
    planet: THREE.Texture | null;
    ring: THREE.Texture | null;
  }>({
    planet: null,
    ring: null
  });

  useEffect(() => {
    setTextures({
      planet: loadNasaTexture(NASA_TEXTURES.saturn),
      ring: loadNasaTexture(NASA_TEXTURES.saturnRing)
    });
  }, []);

  useFrame((_, delta) => {
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.02;
  });

  return (
    <group position={DESTINATIONS.saturn.coords} rotation={[0.42, 0.18, 0]}>
      {/* 1. Saturn Sphere */}
      <mesh ref={saturnRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={textures.planet || undefined}
          color={textures.planet ? '#ffffff' : '#e8dbb7'}
          roughness={0.6}
        />
      </mesh>

      {/* 2. Saturn Haze */}
      <mesh scale={1.04}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ebd59b"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. The Majestic Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 6.8, 128]} />
        <meshStandardMaterial
          map={textures.ring || undefined}
          color={textures.ring ? '#ffffff' : '#c7b48a'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 9. GARGANTUA: Relativistic Doppler Accretion Disk Shader
// -------------------------------------------------------------
function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const diskShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerRadius: { value: 3.2 },
        outerRadius: { value: 9.5 }
      },
      vertexShader: AccretionDiskShader.vertexShader,
      fragmentShader: AccretionDiskShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((_, delta) => {
    diskShaderMaterial.uniforms.time.value += delta;
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.5;
    if (lensRef.current) lensRef.current.rotation.z -= delta * 0.3;
  });

  return (
    <group position={DESTINATIONS.blackhole.coords} rotation={[0.55, 0.35, 0]}>
      {/* 1. Pitch Black Event Horizon */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Razor Sharp Photon Sphere */}
      <mesh scale={1.03}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.65}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Relativistic Accretion Disk (Equatorial) */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2, 0, 0]} material={diskShaderMaterial}>
        <ringGeometry args={[3.5, 9.8, 96]} />
      </mesh>

      {/* 4. Gravitational Lensing Vertical Arch (Interstellar Hallmark) */}
      <mesh ref={lensRef} rotation={[0, 0, 0]} material={diskShaderMaterial}>
        <ringGeometry args={[3.6, 7.2, 96]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 10. SUBTLE CELESTIAL ORBIT PATHS
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
          <lineBasicMaterial color="#4080bf" transparent opacity={0.12} />
        </lineLoop>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// MAIN 3D UNIVERSE CANVAS
// -------------------------------------------------------------
export function SpaceJourneyEngine({ active = true, className = '' }: { active?: boolean; className?: string }) {
  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden bg-[#000003] ${className}`}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 35, 65], fov: 48, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05
        }}
      >
        <color attach="background" args={['#000003']} />

        {/* Realistic subtle ambient light for shadow sides */}
        <ambientLight intensity={0.12} />

        {/* Real Milky Way 360 Skybox */}
        <DeepSpaceMilkyWay />

        {/* Core Celestial Bodies with Real NASA Maps */}
        <Sun />
        <Earth />
        <Mars />
        <Jupiter />
        <Saturn />
        <BlackHole />

        {/* Subtle Orbit Guides */}
        <OrbitLines />

        {/* Relativistic Starfield */}
        <WarpStars />

        {/* Smooth Cinematic Orbit Controller */}
        <FlightCameraController />
      </Canvas>
    </div>
  );
}
