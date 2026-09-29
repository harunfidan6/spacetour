'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpace, DESTINATIONS, DestinationId } from './SpaceContext';
import {
  NASA_TEXTURES,
  loadNasaTexture,
  AccretionDiskShader,
  EarthDayNightShader,
  SaturnGlobeShader,
  SaturnRingShader,
  SolarGranulationShader,
} from './nasaTextures';
import {
  computePlanetState,
  PLANET_EPHEMERIS,
} from '@/lib/astrophysics/keplerEphemeris';

// Static scratch vectors for zero-allocation 60fps render loop
const _scratchVecA = new THREE.Vector3();
const _scratchVecB = new THREE.Vector3();
const _zeroVec = new THREE.Vector3(0, 0, 0);

// -------------------------------------------------------------
// 1. CINEMATIC FLIGHT CONTROLLER (Smooth Lerp + Dynamic Orbit Drift)
// -------------------------------------------------------------
function FlightCameraController() {
  const { currentDestination, isWarping, autoPilot, setDestination, orbitMode } = useSpace();
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 40, 70));
  const mouse = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // Memoized destination offsets for J2000 mode
  const j2000Offsets = useMemo(() => {
    const map: Record<string, { target: [number, number, number]; lookAt: [number, number, number] }> = {};
    for (const key of Object.keys(PLANET_EPHEMERIS)) {
      const pState = computePlanetState(key as keyof typeof PLANET_EPHEMERIS);
      const dest = DESTINATIONS[key as DestinationId];
      if (dest) {
        const offX = dest.targetPosition[0] - dest.coords[0];
        const offY = dest.targetPosition[1] - dest.coords[1];
        const offZ = dest.targetPosition[2] - dest.coords[2];
        map[key] = {
          target: [pState.sceneX + offX, pState.sceneY + offY, pState.sceneZ + offZ],
          lookAt: [pState.sceneX, pState.sceneY, pState.sceneZ],
        };
      }
    }
    return map;
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

    let targetBase = currentDestination.targetPosition;
    let lookBase = currentDestination.lookAt;

    if (orbitMode === 'j2000' && j2000Offsets[currentDestination.id]) {
      targetBase = j2000Offsets[currentDestination.id].target;
      lookBase = j2000Offsets[currentDestination.id].lookAt;
    }

    _scratchVecA.set(...targetBase);
    _scratchVecB.set(...lookBase);

    // Natural subtle space float (orbital drift)
    const driftX = Math.sin(timeRef.current * 0.12) * 0.5;
    const driftY = Math.cos(timeRef.current * 0.1) * 0.3;
    const driftZ = Math.sin(timeRef.current * 0.08) * 0.4;

    const lerpFactor = isWarping ? Math.min(4.5 * delta, 0.22) : Math.min(1.2 * delta, 0.06);

    if (!isWarping) {
      _scratchVecA.x += mouse.current.x * 2.0 + driftX;
      _scratchVecA.y -= mouse.current.y * 1.5 - driftY;
      _scratchVecA.z += driftZ;
    } else {
      const shake = 0.6;
      _scratchVecA.x += (Math.random() - 0.5) * shake;
      _scratchVecA.y += (Math.random() - 0.5) * shake;
      _scratchVecA.z += (Math.random() - 0.5) * shake;
    }

    currentPos.current.lerp(_scratchVecA, lerpFactor);
    lookAtTarget.current.lerp(_scratchVecB, Math.min(lerpFactor * 1.3, 0.25));

    camera.position.copy(currentPos.current);
    camera.lookAt(lookAtTarget.current);

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
// 3. ZERO-CPU WARP STARFIELD (GPU-optimized transform)
// -------------------------------------------------------------
function WarpStars() {
  const { isWarping, throttle } = useSpace();
  const groupRef = useRef<THREE.Group>(null);
  const count = 1800;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 360;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 360;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 360;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speedMult = (isWarping ? 140.0 : 1.2) * throttle;
    groupRef.current.position.z += speedMult * delta * 12;
    if (groupRef.current.position.z > 180) {
      groupRef.current.position.z = -180;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isWarping ? 2.4 : 0.8}
          color={isWarping ? '#d4ff3d' : '#e6f0ff'}
          transparent
          opacity={isWarping ? 0.9 : 0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// -------------------------------------------------------------
// 4. THE SUN: NASA SDO Plasma + Granulation & Eddington Limb Darkening
// -------------------------------------------------------------
function Sun() {
  const sunMesh = useRef<THREE.Mesh>(null);
  const innerCoronaRef = useRef<THREE.Mesh>(null);
  const outerCoronaRef = useRef<THREE.Mesh>(null);
  const [sunTex, setSunTex] = useState<THREE.Texture | null>(null);

  const sunShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        sunMap: { value: null },
      },
      vertexShader: SolarGranulationShader.vertexShader,
      fragmentShader: SolarGranulationShader.fragmentShader,
    });
  }, []);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.sun);
    if (tex) {
      setSunTex(tex);
      sunShaderMaterial.uniforms.sunMap.value = tex;
    }
  }, [sunShaderMaterial]);

  useFrame((_, delta) => {
    sunShaderMaterial.uniforms.time.value += delta;
    if (sunMesh.current) sunMesh.current.rotation.y += delta * 0.02;
    if (innerCoronaRef.current) {
      innerCoronaRef.current.rotation.z -= delta * 0.015;
    }
    if (outerCoronaRef.current) {
      outerCoronaRef.current.rotation.z += delta * 0.01;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Photosphere Sphere with Convective Granulation Shader */}
      <mesh ref={sunMesh} material={sunTex ? sunShaderMaterial : undefined}>
        <sphereGeometry args={[5, 96, 96]} />
        {!sunTex && <meshBasicMaterial color="#ffaa00" />}
      </mesh>

      {/* 2. Inner Hot Coronal Atmosphere */}
      <mesh ref={innerCoronaRef}>
        <sphereGeometry args={[5.35, 48, 48]} />
        <meshBasicMaterial
          color="#fff5e6"
          transparent
          opacity={0.38}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Outer Solar Halo */}
      <mesh ref={outerCoronaRef}>
        <sphereGeometry args={[6.6, 48, 48]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Solar Illuminator for the entire solar system */}
      <pointLight color="#fff8ea" intensity={6.5} distance={550} decay={1.05} />
    </group>
  );
}

// -------------------------------------------------------------
// 5. INTERNATIONAL SPACE STATION (ISS) - High-Poly Model
// -------------------------------------------------------------
function InternationalSpaceStation() {
  const issRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!issRef.current) return;
    const t = clock.getElapsedTime() * 0.35;
    const r = 2.15;
    const inc = 51.6 * (Math.PI / 180);
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r * Math.cos(inc);
    const y = Math.sin(t) * r * Math.sin(inc);
    issRef.current.position.set(x, y, z);
    issRef.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={issRef}>
      {/* Pressurized Modules */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.34, 12]} />
        <meshStandardMaterial color="#f0f2f5" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Integrated Truss Backbone */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.02, 0.88, 0.02]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Photovoltaic solar array wings */}
      <group position={[0, 0.28, 0]}>
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.26, 0.005, 0.11]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.26, 0.005, 0.11]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.85} />
        </mesh>
      </group>
      <group position={[0, -0.28, 0]}>
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.26, 0.005, 0.11]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.85} />
        </mesh>
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.26, 0.005, 0.11]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.85} />
        </mesh>
      </group>
      {/* Radiator */}
      <mesh position={[0, 0.08, 0.08]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.12, 0.004, 0.07]} />
        <meshStandardMaterial color="#fafafa" metalness={0.5} roughness={0.4} />
      </mesh>
      <pointLight color="#22c55e" intensity={0.35} distance={0.8} />
    </group>
  );
}

// -------------------------------------------------------------
// 6. EARTH & MOON: NASA Blue Marble + Night Lights + Specular Ocean
// -------------------------------------------------------------
function Earth() {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const { orbitMode } = useSpace();

  const j2000Pos = useMemo(() => {
    const st = computePlanetState('earth');
    return new THREE.Vector3(st.sceneX, st.sceneY, st.sceneZ);
  }, []);
  const didacticPos = useMemo(() => new THREE.Vector3(...DESTINATIONS.earth.coords), []);

  const [textures, setTextures] = useState<{
    map: THREE.Texture | null;
    night: THREE.Texture | null;
    clouds: THREE.Texture | null;
    specular: THREE.Texture | null;
    normal: THREE.Texture | null;
    moon: THREE.Texture | null;
  }>({
    map: null,
    night: null,
    clouds: null,
    specular: null,
    normal: null,
    moon: null,
  });

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: null },
        nightMap: { value: null },
        specularMap: { value: null },
        sunDirection: { value: new THREE.Vector3(-1, 0, 0) },
      },
      vertexShader: EarthDayNightShader.vertexShader,
      fragmentShader: EarthDayNightShader.fragmentShader,
    });
  }, []);

  useEffect(() => {
    const map = loadNasaTexture(NASA_TEXTURES.earthMap);
    const night = loadNasaTexture(NASA_TEXTURES.earthNight);
    const clouds = loadNasaTexture(NASA_TEXTURES.earthClouds);
    const specular = loadNasaTexture(NASA_TEXTURES.earthSpecular);
    const normal = loadNasaTexture(NASA_TEXTURES.earthNormal);
    const moon = loadNasaTexture(NASA_TEXTURES.moon);

    setTextures({ map, night, clouds, specular, normal, moon });
    if (map) earthMaterial.uniforms.dayMap.value = map;
    if (night) earthMaterial.uniforms.nightMap.value = night;
    if (specular) earthMaterial.uniforms.specularMap.value = specular;
  }, [earthMaterial]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetPos = orbitMode === 'j2000' ? j2000Pos : didacticPos;
      groupRef.current.position.lerp(targetPos, Math.min(delta * 2.5, 0.15));

      // Zero-allocation sun direction
      groupRef.current.getWorldPosition(_scratchVecA);
      _scratchVecB.copy(_zeroVec).sub(_scratchVecA).normalize();
      earthMaterial.uniforms.sunDirection.value.copy(_scratchVecB);
    }

    if (earthRef.current) earthRef.current.rotation.y += delta * 0.08;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.105;
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={groupRef} position={DESTINATIONS.earth.coords}>
      {/* 1. Earth Globe with Day/Night Terminator & Ocean Glint */}
      <mesh ref={earthRef} material={textures.map && textures.night ? earthMaterial : undefined}>
        <sphereGeometry args={[1.5, 96, 96]} />
        {(!textures.map || !textures.night) && (
          <meshStandardMaterial
            map={textures.map || undefined}
            roughnessMap={textures.specular || undefined}
            roughness={0.45}
            metalness={0.06}
            normalMap={textures.normal || undefined}
            normalScale={new THREE.Vector2(0.85, 0.85)}
          />
        )}
      </mesh>

      {/* 2. Independent Real Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.522, 96, 96]} />
        {textures.clouds && (
          <meshStandardMaterial
            map={textures.clouds}
            transparent
            opacity={0.82}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        )}
      </mesh>

      {/* 3. Atmospheric Rayleigh Scattering Blue Rim Glow */}
      <mesh scale={1.045}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={0.24}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Moon with NASA LRO Texture */}
      <group ref={moonOrbitRef}>
        <mesh position={[3.8, 0.4, 0]}>
          <sphereGeometry args={[0.38, 48, 48]} />
          <meshStandardMaterial
            map={textures.moon || undefined}
            color={textures.moon ? '#ffffff' : '#b0b5bc'}
            roughness={0.92}
          />
        </mesh>
      </group>

      {/* 5. International Space Station (ISS) */}
      <InternationalSpaceStation />
    </group>
  );
}

// -------------------------------------------------------------
// 7. MARS: NASA Viking/MGS Texture & Topography
// -------------------------------------------------------------
function Mars() {
  const groupRef = useRef<THREE.Group>(null);
  const marsRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { orbitMode } = useSpace();

  const j2000Pos = useMemo(() => {
    const st = computePlanetState('mars');
    return new THREE.Vector3(st.sceneX, st.sceneY, st.sceneZ);
  }, []);
  const didacticPos = useMemo(() => new THREE.Vector3(...DESTINATIONS.mars.coords), []);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.mars);
    if (tex) setTexture(tex);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetPos = orbitMode === 'j2000' ? j2000Pos : didacticPos;
      groupRef.current.position.lerp(targetPos, Math.min(delta * 2.5, 0.15));
    }
    if (marsRef.current) marsRef.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={groupRef} position={DESTINATIONS.mars.coords}>
      <mesh ref={marsRef}>
        <sphereGeometry args={[1.0, 96, 96]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#b74418'}
          roughness={0.82}
          metalness={0.05}
        />
      </mesh>

      <mesh scale={1.035}>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshBasicMaterial
          color="#ff5533"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 8. JUPITER: NASA Cassini 2K Zonal Bands
// -------------------------------------------------------------
function Jupiter() {
  const groupRef = useRef<THREE.Group>(null);
  const jupiterRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { orbitMode } = useSpace();

  const j2000Pos = useMemo(() => {
    const st = computePlanetState('jupiter');
    return new THREE.Vector3(st.sceneX, st.sceneY, st.sceneZ);
  }, []);
  const didacticPos = useMemo(() => new THREE.Vector3(...DESTINATIONS.jupiter.coords), []);

  useEffect(() => {
    const tex = loadNasaTexture(NASA_TEXTURES.jupiter);
    if (tex) setTexture(tex);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetPos = orbitMode === 'j2000' ? j2000Pos : didacticPos;
      groupRef.current.position.lerp(targetPos, Math.min(delta * 2.5, 0.15));
    }
    if (jupiterRef.current) jupiterRef.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={groupRef} position={DESTINATIONS.jupiter.coords}>
      <mesh ref={jupiterRef}>
        <sphereGeometry args={[3.2, 96, 96]} />
        <meshStandardMaterial
          map={texture || undefined}
          color={texture ? '#ffffff' : '#c88b3a'}
          roughness={0.45}
          metalness={0.0}
        />
      </mesh>

      <mesh scale={1.025}>
        <sphereGeometry args={[3.2, 48, 48]} />
        <meshBasicMaterial
          color="#dca565"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 9. SATURN: NASA Cassini Globe & Analytical Ring Shadow
// -------------------------------------------------------------
function Saturn() {
  const groupRef = useRef<THREE.Group>(null);
  const saturnRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { orbitMode } = useSpace();

  const j2000Pos = useMemo(() => {
    const st = computePlanetState('saturn');
    return new THREE.Vector3(st.sceneX, st.sceneY, st.sceneZ);
  }, []);
  const didacticPos = useMemo(() => new THREE.Vector3(...DESTINATIONS.saturn.coords), []);

  const [textures, setTextures] = useState<{
    planet: THREE.Texture | null;
    ring: THREE.Texture | null;
  }>({
    planet: null,
    ring: null,
  });

  const saturnGlobeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        planetMap: { value: null },
        sunDirectionLocal: { value: new THREE.Vector3(-0.95, 0.18, 0.25) },
        ringInner: { value: 3.1 },
        ringOuter: { value: 7.2 },
      },
      vertexShader: SaturnGlobeShader.vertexShader,
      fragmentShader: SaturnGlobeShader.fragmentShader,
    });
  }, []);

  const saturnRingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ringMap: { value: null },
        sunDirectionLocal: { value: new THREE.Vector3(-0.95, 0.18, 0.25) },
        saturnRadius: { value: 2.5 },
      },
      vertexShader: SaturnRingShader.vertexShader,
      fragmentShader: SaturnRingShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, []);

  useEffect(() => {
    const planet = loadNasaTexture(NASA_TEXTURES.saturn);
    const ring = loadNasaTexture(NASA_TEXTURES.saturnRing);
    setTextures({ planet, ring });
    if (planet) saturnGlobeMaterial.uniforms.planetMap.value = planet;
    if (ring) saturnRingMaterial.uniforms.ringMap.value = ring;
  }, [saturnGlobeMaterial, saturnRingMaterial]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetPos = orbitMode === 'j2000' ? j2000Pos : didacticPos;
      groupRef.current.position.lerp(targetPos, Math.min(delta * 2.5, 0.15));

      // Zero allocation local sun direction
      _scratchVecA.copy(_zeroVec);
      groupRef.current.worldToLocal(_scratchVecA).normalize();
      saturnGlobeMaterial.uniforms.sunDirectionLocal.value.copy(_scratchVecA);
      saturnRingMaterial.uniforms.sunDirectionLocal.value.copy(_scratchVecA);
    }
    if (saturnRef.current) saturnRef.current.rotation.y += delta * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.02;
  });

  return (
    <group ref={groupRef} position={DESTINATIONS.saturn.coords} rotation={[0.42, 0.18, 0]}>
      {/* 1. Saturn Sphere with Analytical Ring Shadow */}
      <mesh ref={saturnRef} material={textures.planet ? saturnGlobeMaterial : undefined}>
        <sphereGeometry args={[2.5, 96, 96]} />
        {!textures.planet && (
          <meshStandardMaterial
            color="#e8dbb7"
            roughness={0.52}
            metalness={0.0}
          />
        )}
      </mesh>

      {/* 2. Saturn Haze */}
      <mesh scale={1.03}>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshBasicMaterial
          color="#ebd59b"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. The Rings - 128 Radial Segments with Analytical Globe Shadow */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={textures.ring ? saturnRingMaterial : undefined}
      >
        <ringGeometry args={[3.1, 7.2, 128]} />
        {!textures.ring && (
          <meshStandardMaterial
            color="#c7b48a"
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
            roughness={0.35}
          />
        )}
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 10. GARGANTUA: Relativistic Doppler Accretion Disk Shader
// -------------------------------------------------------------
function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const diskShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerRadius: { value: 3.2 },
        outerRadius: { value: 9.5 },
      },
      vertexShader: AccretionDiskShader.vertexShader,
      fragmentShader: AccretionDiskShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_, delta) => {
    diskShaderMaterial.uniforms.time.value += delta;
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.5;
    if (lensRef.current) lensRef.current.rotation.z -= delta * 0.3;
  });

  return (
    <group position={DESTINATIONS.blackhole.coords} rotation={[0.55, 0.35, 0]}>
      {/* 1. Event Horizon */}
      <mesh>
        <sphereGeometry args={[3.2, 96, 96]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Razor Sharp Photon Sphere */}
      <mesh scale={1.025}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial
          color="#fff5cc"
          transparent
          opacity={0.72}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Relativistic Accretion Disk */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2, 0, 0]} material={diskShaderMaterial}>
        <ringGeometry args={[3.45, 10.2, 128]} />
      </mesh>

      {/* 4. Gravitational Lensing Vertical Arch */}
      <mesh ref={lensRef} rotation={[0, 0, 0]} material={diskShaderMaterial}>
        <ringGeometry args={[3.55, 7.6, 128]} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// 11. SUBTLE CELESTIAL ORBIT PATHS (Didactic or J2000 Keplerian)
// -------------------------------------------------------------
function OrbitLines() {
  const { orbitMode } = useSpace();

  const lineObjects = useMemo(() => {
    const keys: (keyof typeof PLANET_EPHEMERIS)[] = ['earth', 'mars', 'jupiter', 'saturn'];
    const segments = 96;

    return keys.map((key) => {
      const elem = PLANET_EPHEMERIS[key];
      const points: THREE.Vector3[] = [];

      if (orbitMode === 'didactic') {
        const r = elem.sceneRadius;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
        }
      } else {
        const a = elem.sceneRadius;
        const e = elem.e0;
        const inc = (elem.I0 * Math.PI) / 180;
        for (let i = 0; i <= segments; i++) {
          const nu = (i / segments) * Math.PI * 2;
          const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));
          const x = r * Math.cos(nu);
          const z = r * Math.sin(nu) * Math.cos(inc);
          const y = r * Math.sin(nu) * Math.sin(inc) * 1.5;
          points.push(new THREE.Vector3(x, y, z));
        }
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [orbitMode]);

  return (
    <group>
      {lineObjects.map((geom, idx) => (
        <lineLoop key={idx} geometry={geom}>
          <lineBasicMaterial color={orbitMode === 'j2000' ? '#d4ff3d' : '#4080bf'} transparent opacity={0.16} />
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
        dpr={[1, 1.25]}
        camera={{ position: [0, 35, 65], fov: 48, near: 0.1, far: 2500 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'default',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#000003']} />

        {/* Realistic subtle ambient light for shadow sides */}
        <ambientLight intensity={0.12} />

        {/* Real Milky Way 360 Skybox */}
        <DeepSpaceMilkyWay />

        {/* Core Celestial Bodies with Real NASA Maps & Shaders */}
        <Sun />
        <Earth />
        <Mars />
        <Jupiter />
        <Saturn />
        <BlackHole />

        {/* Dynamic Keplerian Orbit Guides */}
        <OrbitLines />

        {/* Relativistic Starfield */}
        <WarpStars />

        {/* Smooth Cinematic Orbit Controller */}
        <FlightCameraController />
      </Canvas>
    </div>
  );
}
