'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// -------------------------------------------------------------
// 1. PROCEDURAL TURBULENT PHOTOSPHERE SHADER (KAYNAYAN GÜNEŞ YÜZEYİ)
// Convective solar granulation, limb darkening, and thermal hotspots
// -------------------------------------------------------------
const photosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const photosphereFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;

  // Ashima Arts Simplex 3D Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractal Brownian Motion for turbulent granulation
  float fbm(vec3 p) {
    float total = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      total += amp * snoise(p * freq);
      p += vec3(12.3, 4.5, 7.8);
      freq *= 2.08;
      amp *= 0.52;
    }
    return total;
  }

  void main() {
    vec3 normPos = normalize(vPosition);

    // Convective boiling movement across solar coordinates
    float t = uTime * 0.18;
    vec3 flowCoord = normPos * 2.8 + vec3(sin(t * 0.4), t * 0.5, cos(t * 0.3));

    // Multi-scale convective granulation
    float n1 = fbm(flowCoord);
    float n2 = fbm(normPos * 7.2 - vec3(t * 0.6, sin(t * 0.7), t * 0.4));
    float granulation = n1 * 0.65 + n2 * 0.35;

    // High-temperature color mapping
    vec3 deepRed = vec3(0.92, 0.22, 0.05);     // 3500K cooler filaments
    vec3 brightAmber = vec3(1.0, 0.62, 0.12);  // 5500K solar surface
    vec3 coreGold = vec3(1.0, 0.88, 0.42);     // 6200K convective centers
    vec3 whiteHot = vec3(1.0, 0.98, 0.92);     // 7000K+ incandescent flash peaks

    // Surface gradient
    vec3 plasma = mix(deepRed, brightAmber, smoothstep(-0.35, 0.15, granulation));
    plasma = mix(plasma, coreGold, smoothstep(0.15, 0.48, granulation));
    plasma = mix(plasma, whiteHot, smoothstep(0.48, 0.82, granulation));

    // Limb darkening physics: glancing angles appear deeper, center radiates intense white-gold
    float NdotV = max(0.0, dot(vNormal, vViewDir));
    float limbFactor = pow(1.0 - NdotV, 2.2);

    vec3 limbColor = vec3(0.95, 0.32, 0.04);
    vec3 finalColor = mix(plasma, limbColor, limbFactor * 0.65);

    // Dynamic solar incandescent emission boost
    finalColor *= 1.25 + 0.18 * sin(uTime * 1.8 + granulation * 4.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// -------------------------------------------------------------
// 2. ATMOSPHERIC CORONA & CHROMOSPHERE HALO
// -------------------------------------------------------------
const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float NdotV = max(0.0, dot(vNormal, vViewDir));
    // Inverted rim factor for soft, ethereal atmospheric boundary
    float rim = pow(1.0 - NdotV, 3.2);

    // Subtle rhythmic pulsing of the solar chromosphere
    float pulse = 0.92 + 0.12 * sin(uTime * 1.4);

    vec3 coronaColor = vec3(1.0, 0.68, 0.22);
    vec3 outerCorona = vec3(0.98, 0.35, 0.08);
    vec3 col = mix(coronaColor, outerCorona, rim * 0.5);

    gl_FragColor = vec4(col, rim * 0.85 * pulse);
  }
`;

// -------------------------------------------------------------
// 3. MAGNETIC PROMINENCE LOOPS (MANİK PLAZMA ARK/İLMEK SİSTEMİ)
// Toroidal arcs of glowing ionized plasma bursting off the solar limb
// -------------------------------------------------------------
interface ProminenceArc {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  radius: number;
  tubeRadius: number;
  rotation: THREE.Euler;
  speed: number;
  phase: number;
}

function MagneticProminenceLoops({ sunRadius }: { sunRadius: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-generate 5 distinct magnetic prominence loop structures
  const arcs = useMemo<ProminenceArc[]>(() => {
    const list: ProminenceArc[] = [];
    const angles = [0.3, 1.4, 2.7, 4.1, 5.2];
    for (let i = 0; i < angles.length; i++) {
      const theta = angles[i];
      const phi = (i % 2 === 0 ? 0.35 : -0.25) * Math.PI;
      const x = Math.cos(theta) * Math.cos(phi) * sunRadius;
      const y = Math.sin(phi) * sunRadius;
      const z = Math.sin(theta) * Math.cos(phi) * sunRadius;

      list.push({
        center: new THREE.Vector3(x, y, z),
        normal: new THREE.Vector3(x, y, z).normalize(),
        radius: 0.35 + (i * 0.08),
        tubeRadius: 0.024 + (i * 0.005),
        rotation: new THREE.Euler(0.4 * i, 0.8 * i, 0.3 * i),
        speed: 0.8 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }, [sunRadius]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const arc = arcs[idx];
        if (arc) {
          // Prominence breathe and flare slightly
          const breath = 1.0 + 0.18 * Math.sin(time * arc.speed + arc.phase);
          child.scale.set(breath, breath, breath);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => (
        <group key={i} position={arc.center} rotation={arc.rotation}>
          <mesh>
            <torusGeometry args={[arc.radius, arc.tubeRadius, 16, 32, Math.PI * 1.15]} />
            <meshBasicMaterial
              color="#ff6b2b"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Inner white-hot magnetic core filament */}
          <mesh>
            <torusGeometry args={[arc.radius, arc.tubeRadius * 0.45, 12, 24, Math.PI * 1.15]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// 4. SPONTANEOUS SOLAR FLARE ERUPTION ENGINE (GÜNEŞ PATLAMALARI - CME)
// Cataclysmic X-Class flare flashes, Coronal Mass Ejection plasma waves, and ejecta
// -------------------------------------------------------------
interface ActiveSolarFlare {
  id: number;
  origin: THREE.Vector3;
  normal: THREE.Vector3;
  startTime: number;
  duration: number; // typically 1.6 to 2.4 seconds
  maxRadius: number;
  sparks: { dir: THREE.Vector3; speed: number; size: number }[];
}

function SolarFlareEruptions({ sunRadius }: { sunRadius: number }) {
  const containerRef = useRef<THREE.Group>(null);
  const activeFlares = useRef<ActiveSolarFlare[]>([]);
  const nextFlareTime = useRef<number>(1.2); // First flare launches 1.2s after mount

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const container = containerRef.current;
    if (!container) return;

    // 1. Spontaneously trigger a massive solar flare every 2.8 to 4.8 seconds
    if (time >= nextFlareTime.current && activeFlares.current.length < 2) {
      // Pick random latitude & longitude on solar sphere
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI * 0.7; // Visible disc bias
      const normal = new THREE.Vector3(
        Math.cos(v) * Math.cos(u),
        Math.sin(v),
        Math.cos(v) * Math.sin(u)
      ).normalize();

      const origin = normal.clone().multiplyScalar(sunRadius);

      // Pre-compute coronal ejecta sparks blasted along magnetic field
      const sparkList = [];
      const sparkCount = 24;
      for (let s = 0; s < sparkCount; s++) {
        const spkDir = normal.clone().add(
          new THREE.Vector3((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2)
        ).normalize();
        sparkList.push({
          dir: spkDir,
          speed: 1.8 + Math.random() * 3.5,
          size: 0.04 + Math.random() * 0.05
        });
      }

      activeFlares.current.push({
        id: Math.random(),
        origin,
        normal,
        startTime: time,
        duration: 1.8 + Math.random() * 0.6,
        maxRadius: sunRadius * (1.6 + Math.random() * 0.8),
        sparks: sparkList
      });

      nextFlareTime.current = time + 2.8 + Math.random() * 2.0;
    }

    // 2. Render all active flare explosions & CME shockwaves
    while (container.children.length > 0) {
      const child = container.children[0] as THREE.Mesh;
      container.remove(child);
      child.geometry?.dispose();
    }

    const alive: ActiveSolarFlare[] = [];

    for (const flare of activeFlares.current) {
      const age = time - flare.startTime;
      if (age < flare.duration) {
        alive.push(flare);
        const progress = age / flare.duration; // 0 -> 1
        const intensity = Math.sin(progress * Math.PI); // Smooth peak

        // STAGE A: Nuclear Flare Thermal Flash (at origin)
        const flashScale = (sunRadius * 0.14) + Math.sin(Math.min(1.0, progress * 3.0) * Math.PI) * (sunRadius * 0.22);
        const flashGeom = new THREE.SphereGeometry(flashScale, 16, 16);
        const flashMat = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          transparent: true,
          opacity: Math.max(0, 1.0 - progress * 1.8) * 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const flashMesh = new THREE.Mesh(flashGeom, flashMat);
        flashMesh.position.copy(flare.origin);
        container.add(flashMesh);

        // STAGE B: Coronal Mass Ejection (CME) Expanding Shockwave Ring
        const cmeDist = (flare.maxRadius - sunRadius) * progress;
        const wavePos = flare.origin.clone().addScaledVector(flare.normal, cmeDist);
        const ringScale = sunRadius * (0.2 + progress * 0.85);

        const ringGeom = new THREE.RingGeometry(ringScale * 0.92, ringScale * 1.05, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(progress < 0.35 ? '#ffffff' : '#fb923c'),
          transparent: true,
          opacity: intensity * 0.55,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(wavePos);
        ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), flare.normal);
        container.add(ringMesh);

        // STAGE C: High-velocity Coronal Spark Ejecta Shower
        const spkPts: number[] = [];
        const spkColors: number[] = [];
        const colHot = new THREE.Color('#ffffff');
        const colAmber = new THREE.Color('#ea580c');

        for (const spk of flare.sparks) {
          const spkPos = flare.origin.clone().addScaledVector(spk.dir, spk.speed * age * 1.8);
          spkPts.push(spkPos.x, spkPos.y, spkPos.z);
          const c = colHot.clone().lerp(colAmber, Math.min(1.0, progress * 1.4));
          spkColors.push(c.r, c.g, c.b);
        }

        const spkGeo = new THREE.BufferGeometry();
        spkGeo.setAttribute('position', new THREE.Float32BufferAttribute(spkPts, 3));
        spkGeo.setAttribute('color', new THREE.Float32BufferAttribute(spkColors, 3));

        const spkMat = new THREE.PointsMaterial({
          size: 0.14 * (1.0 - progress * 0.5),
          transparent: true,
          opacity: intensity * 0.9,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const spkPoints = new THREE.Points(spkGeo, spkMat);
        container.add(spkPoints);
      }
    }

    activeFlares.current = alive;
  });

  return <group ref={containerRef} />;
}

let sunGlowTexture: THREE.CanvasTexture | null = null;
function getSunGlowTexture() {
  if (sunGlowTexture || typeof document === 'undefined') return sunGlowTexture;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255, 235, 185, 0.95)');
  g.addColorStop(0.15, 'rgba(255, 180, 80, 0.65)');
  g.addColorStop(0.38, 'rgba(255, 110, 30, 0.2)');
  g.addColorStop(0.68, 'rgba(230, 50, 15, 0.04)');
  g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  sunGlowTexture = new THREE.CanvasTexture(canvas);
  sunGlowTexture.colorSpace = THREE.SRGBColorSpace;
  return sunGlowTexture;
}

// -------------------------------------------------------------
// 5. MASTER REALISTIC SUN ENGINE COMPONENT
// -------------------------------------------------------------
export function RealisticSunEngine({ radius = 2.5 }: { radius?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const glowMap = useMemo(() => getSunGlowTexture(), []);

  // Photosphere Shader Material
  const photosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: photosphereVertexShader,
      fragmentShader: photosphereFragmentShader,
      toneMapped: false
    });
  }, []);

  // Atmospheric Corona Rim Material
  const coronaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: coronaVertexShader,
      fragmentShader: coronaFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    photosphereMaterial.uniforms.uTime.value = time;
    coronaMaterial.uniforms.uTime.value = time;

    // Slow solar differential rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* 1. Turbulent Convective Photosphere Sphere */}
      <mesh ref={meshRef} material={photosphereMaterial}>
        <sphereGeometry args={[radius, 96, 96]} />
      </mesh>

      {/* 2. Soft Atmospheric Chromosphere Rim Shell */}
      <mesh ref={coronaRef} material={coronaMaterial} scale={1.08}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {/* 3. Volumetric Outer Corona Ethereal Halo (Sprite with Radial Gradient) */}
      <sprite scale={[radius * 5.4, radius * 5.4, 1]} renderOrder={-1}>
        <spriteMaterial
          map={glowMap}
          color="#ffa658"
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* 4. Magnetic Prominence Loops (Plazma Arkları) */}
      <MagneticProminenceLoops sunRadius={radius} />

      {/* 5. Spontaneous Solar Flares & CME Ejection Engine */}
      <SolarFlareEruptions sunRadius={radius} />
    </group>
  );
}
