'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useInView } from '@/lib/useInView';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Clock, Sliders, ShieldAlert } from 'lucide-react';
import { createAccretionDiskTexture } from './textures';
import { Ticks } from '@/components/motion/primitives';
import { seededRandom } from '@/lib/random';

function BlackHole3DMesh({
  distanceRs,
  isAccretionRotating
}: {
  distanceRs: number;
  isAccretionRotating: boolean;
}) {
  const diskRef = useRef<THREE.Mesh>(null);
  const jetsRef = useRef<THREE.Points>(null);
  const photonRingRef = useRef<THREE.Mesh>(null);

  const diskTexture = useMemo(() => createAccretionDiskTexture(), []);
  // Soft round sprite: without it, points render as squares that balloon near the camera
  const dotTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  // Separate texture instance so the lensed halo can rotate independently of the disk
  const lensTexture = useMemo(() => {
    const t = createAccretionDiskTexture();
    t.center.set(0.5, 0.5);
    return t;
  }, []);

  // Relativistic jet particles
  const [jetPositions] = useMemo(() => {
    const rand = seededRandom(4209);
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const isTop = i % 2 === 0;
      const y = isTop ? rand() * 8 + 2 : -(rand() * 8 + 2);
      const spread = (Math.abs(y) / 8) * 0.4;
      pos[i * 3] = (rand() - 0.5) * spread;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = (rand() - 0.5) * spread;
    }
    return [pos];
  }, []);

  // Relativistic Accretion Disk Shader Material (Seamless Continuous Local Polar Geometry)
  const accretionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDoppler: { value: 0.85 },
        uInnerRadius: { value: 2.15 },
        uOuterRadius: { value: 7.6 },
      },
      vertexShader: `
        varying vec3 vLocalPos;
        varying vec3 vWorldPosition;
        void main() {
          vLocalPos = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uDoppler;
        uniform float uInnerRadius;
        uniform float uOuterRadius;
        varying vec3 vLocalPos;
        varying vec3 vWorldPosition;

        void main() {
          float r = length(vLocalPos.xy);
          float norm = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);

          // Continuous angle in [-PI, PI] (ZERO seam discontinuity!)
          float angle = atan(vLocalPos.y, vLocalPos.x);

          // Relativistic Keplerian differential rotation (omega ~ r^-1.4)
          float omega = (uTime * 2.2) / pow(max(r, 1.2), 1.25);
          float spinAngle = angle - omega;

          // Multi-frequency plasma filaments
          float wave1 = sin(spinAngle * 8.0 + r * 3.8);
          float wave2 = sin(spinAngle * 14.0 - r * 5.2 + uTime * 1.1);
          float wave3 = cos(spinAngle * 24.0 + r * 8.0);
          float plasma = 0.68 + 0.18 * wave1 + 0.10 * wave2 + 0.04 * wave3;

          // Relativistic Doppler beaming: approaching side (x < 0) boosted
          float approach = -sin(angle);
          float dopplerFactor = clamp(1.0 + approach * uDoppler * 0.85, 0.22, 2.7);

          // Relativistic temperature / color ramp:
          // Inner: Ultra-hot white-blue (25,000K) -> Radiant gold -> Amber -> Deep crimson
          vec3 colCore = vec3(1.0, 0.98, 0.92);
          vec3 colMid = vec3(1.0, 0.68, 0.18);
          vec3 colOuter = vec3(0.85, 0.22, 0.04);
          vec3 colSmoke = vec3(0.25, 0.04, 0.01);

          vec3 col = mix(colCore, colMid, smoothstep(0.0, 0.35, norm));
          col = mix(col, colOuter, smoothstep(0.35, 0.85, norm));
          col = mix(col, colSmoke, smoothstep(0.85, 1.0, norm));

          // Spectral shift
          vec3 dopplerCol = mix(vec3(0.8, 0.95, 1.25), vec3(1.2, 0.75, 0.4), clamp(-approach * 0.5 + 0.5, 0.0, 1.0));
          col *= plasma * dopplerFactor * dopplerCol;

          // Smooth inner rim & outer smoke falloff
          float alpha = smoothstep(0.0, 0.06, norm) * (1.0 - smoothstep(0.80, 1.0, norm));
          gl_FragColor = vec4(col * 1.35, alpha * 0.95);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Einstein Gravitational Lensing Arch Shader Material (Bent Light from the Far Side of Disk)
  const lensHaloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uInnerRadius: { value: 1.86 },
        uOuterRadius: { value: 4.8 },
      },
      vertexShader: `
        varying vec3 vLocalPos;
        void main() {
          vLocalPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uInnerRadius;
        uniform float uOuterRadius;
        varying vec3 vLocalPos;

        void main() {
          float r = length(vLocalPos.xy);
          float norm = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);
          float angle = atan(vLocalPos.y, vLocalPos.x);

          // Gravitational lensing arches concentrate light above and below the horizon (Y axis)
          float archIntensity = pow(abs(sin(angle)), 1.35);
          float horizontalMask = smoothstep(0.12, 0.52, abs(sin(angle)));

          // Swirling plasma along the bent arch
          float omega = (uTime * 1.4) / pow(max(r, 1.2), 1.2);
          float wave = sin((angle - omega) * 9.0 + r * 4.2);
          float plasma = 0.74 + 0.26 * wave;

          // Doppler asymmetry
          float approach = -cos(angle);
          float doppler = clamp(1.0 + approach * 0.55, 0.35, 1.8);

          vec3 colCore = vec3(1.0, 0.96, 0.90);
          vec3 colMid = vec3(1.0, 0.66, 0.16);
          vec3 colOuter = vec3(0.78, 0.18, 0.03);

          vec3 col = mix(colCore, colMid, smoothstep(0.0, 0.38, norm));
          col = mix(col, colOuter, smoothstep(0.38, 1.0, norm));
          col *= plasma * doppler * 1.45;

          // Soft smooth falloffs
          float alpha = smoothstep(0.0, 0.05, norm) * (1.0 - smoothstep(0.72, 1.0, norm)) * horizontalMask;
          gl_FragColor = vec4(col, alpha * 0.88);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const lensRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (isAccretionRotating) {
      if (accretionMaterial.uniforms.uTime) accretionMaterial.uniforms.uTime.value += dt;
      if (lensHaloMaterial.uniforms.uTime) lensHaloMaterial.uniforms.uTime.value += dt;
    }
    // Lensed arch and photon sphere softly orient towards camera
    if (lensRef.current) {
      lensRef.current.quaternion.copy(camera.quaternion);
    }
    if (photonRingRef.current) {
      photonRingRef.current.quaternion.copy(camera.quaternion);
    }
    if (jetsRef.current) {
      // particles stream outward along the poles and recycle
      const pos = jetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i);
        y += Math.sign(y) * dt * 2.2;
        if (Math.abs(y) > 10) y = Math.sign(y) * 2;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Black Hole Event Horizon (Schwarzschild Radius Sphere) */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Razor-Sharp Photon Sphere Glow Ring */}
      <mesh ref={photonRingRef}>
        <ringGeometry args={[1.82, 1.96, 160]} />
        <meshBasicMaterial
          color="#ffebc6"
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Swirling Relativistic Equatorial Accretion Disk */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2.3, 0, 0]} material={accretionMaterial}>
        <ringGeometry args={[2.15, 7.6, 160]} />
      </mesh>

      {/* 4. Gravitational Lensing Einstein Arch (Bent Light over and under the Horizon) */}
      <mesh ref={lensRef} renderOrder={2} material={lensHaloMaterial}>
        <ringGeometry args={[1.86, 4.8, 160]} />
      </mesh>

      {/* 4. Relativistic Jets */}
      <points ref={jetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jetPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          map={dotTexture}
          alphaTest={0.01}
          color="#80d4ff"
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Observer Ship Orbit Indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        {/* The black sphere is one Schwarzschild radius (1.8 units); beyond 8 r_s the ring is clamped to stay in view */}
        <ringGeometry args={[1.8 * Math.min(distanceRs, 8), 1.8 * Math.min(distanceRs, 8) + 0.06, 128]} />
        <meshBasicMaterial
          color={distanceRs < 2.5 ? '#ef4444' : distanceRs < 6 ? '#f59e0b' : '#38bdf8'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export function BlackHoleSimulator() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef);
  // Distance from event horizon in Schwarzschild radii (r / r_s)
  const [distanceRs, setDistanceRs] = useState<number>(3.5); // 3.5 r_s default
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Einstein Gravitational Time Dilation Calculation
  // gamma = 1 / sqrt(1 - 1 / distanceRs)
  const timeDilationFactor = useMemo(() => {
    if (distanceRs <= 1.01) return 999999;
    const factor = 1 / Math.sqrt(1 - 1 / distanceRs);
    return factor;
  }, [distanceRs]);

  // If 1 hour spent near black hole, how much time passes on Earth?
  const earthHours = timeDilationFactor * 1;
  const earthDays = earthHours / 24;
  const earthYears = earthDays / 365.25;

  let timeDilationText = '';
  if (earthYears >= 1) {
    timeDilationText = `${earthYears.toFixed(1)} Yıl`;
  } else if (earthDays >= 1) {
    timeDilationText = `${earthDays.toFixed(1)} Gün`;
  } else {
    timeDilationText = `${earthHours.toFixed(1)} Saat`;
  }

  // Tidal Spaghettification risk
  const spaghettificationRisk =
    distanceRs < 2.0
      ? { level: 'KRİTİK / ÖLÜMCÜL', desc: 'Aşırı kütleçekimsel gelgit dalgası bedeninizi atomlarına ayırır.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
      : distanceRs < 5.0
      ? { level: 'YÜKSEK GELGİT ETKİSİ', desc: 'Miller Gezegeni yörüngesi. Devasa zaman genleşmesi ve devasa gelgit dalgaları.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
      : { level: 'GÜVENLİ YÖRÜNGE', desc: 'İstikrarlı dairesel yörünge. Güvenli bilimsel gözlem mesafesi.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-violet">
            <span className="live-dot" /> Genel Görelilik & Astrofizik Laboratuvarı
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Gargantua <span className="serif-i text-violet">& zaman genleşmesi</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Albert Einstein&apos;ın kütleçekimsel zaman bükülmesini ve süper kütleli bir kara deliğin etrafındaki ışık merceklenmesini deneyimleyin.
          </p>
        </div>

        <div className="label border border-line bg-ink-2 px-3 py-1.5 text-violet">
          Schwarzschild metriği · γ = 1/√(1-r_s/r)
        </div>
      </div>

      {/* Main 3D Canvas & Simulation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Black Hole Canvas (7 cols) */}
        <div ref={stageRef} className="lg:col-span-7 relative h-80 sm:h-[460px] w-full border border-line bg-black overflow-hidden">
          <Canvas frameloop={stageVisible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 2.5, 9.5], fov: 45 }} gl={{ powerPreference: 'high-performance' }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fff" />

            <BlackHole3DMesh
              distanceRs={distanceRs}
              isAccretionRotating={isRotating}
            />

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={false}
              minDistance={5}
              maxDistance={15}
              // keep the camera out of the polar jets
              minPolarAngle={0.45}
              maxPolarAngle={Math.PI - 0.45}
            />
          </Canvas>

          {/* Interactive controls on canvas */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none bg-ink/80 px-3 py-1.5 backdrop-blur border border-line">
            <span className="h-2 w-2 rounded-full bg-violet animate-ping" />
            <span className="label text-paper">
              Gözlem gemisi yörüngesi · {distanceRs.toFixed(1)} r_s
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="label px-3 py-1.5 bg-ink/80 border border-line text-paper backdrop-blur hover:bg-ink-3 transition-colors cursor-pointer"
            >
              {isRotating ? 'Döndürmeyi Duraklat' : 'Döndür'}
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between bg-ink/80 px-4 py-2 border border-line backdrop-blur pointer-events-none">
            <span className="label text-muted">Renkli halka: gözlemci yörüngesi</span>
            <span className="label text-paper">360° Sürükle · Yakınlaştır</span>
          </div>
        </div>

        {/* Telemetry & Time Dilation Cockpit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Distance Slider */}
          <div className="border border-line bg-ink-2 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="label text-muted flex items-center gap-1.5">
                <Sliders size={13} className="text-violet" />
                Olay Ufkuna Uzaklık
              </span>
              <span className="label text-violet font-bold text-sm">
                {distanceRs.toFixed(1)} r<sub>s</sub>
              </span>
            </div>

            <input aria-label="Kara deliğe uzaklık (Schwarzschild yarıçapı)"
              type="range"
              min="1.1"
              max="20"
              step="0.1"
              value={distanceRs}
              onChange={(e) => setDistanceRs(parseFloat(e.target.value))}
              className="w-full accent-[var(--violet)] cursor-pointer h-1.5 bg-ink"
            />

            <div className="flex justify-between text-[10px] font-mono text-muted">
              <span className="text-rose-signal">1.1 r<sub>s</sub> (Kritik)</span>
              <span>6.0 r<sub>s</sub> (ISCO)</span>
              <span className="text-lime">20.0 r<sub>s</sub> (Güvenli)</span>
            </div>
          </div>

          {/* Time Dilation Readout Grid */}
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <span className="label text-muted">Burada geçen</span>
              <div className="display display-tight mt-2 text-2xl text-violet">1.0 Saat</div>
            </div>
            <div className="bg-ink p-4">
              <span className="label text-muted">Dünya’da geçen</span>
              <div className="display display-tight mt-2 text-2xl text-paper">{timeDilationText}</div>
            </div>
          </div>

          {/* Lorentz & Relativity Card */}
          <div className="border border-line bg-ink-2 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="label text-violet flex items-center gap-1.5">
                <Clock size={13} />
                Genel Görelilik Zaman Faktörü
              </span>
              <span className="label text-paper font-mono">
                γ = {timeDilationFactor > 1000 ? '∞' : timeDilationFactor.toFixed(2)}x
              </span>
            </div>

            <p className="text-xs leading-relaxed text-paper/75">
              {distanceRs < 2.0
                ? 'Olay ufkuna o kadar yakınsınız ki uzay-zaman neredeyse donmuş durumda. Dünya’da uygarlıklar yükselip yıkılırken siz yalnızca dakikalar yaşarsınız.'
                : distanceRs < 6.0
                ? 'Interstellar filmindeki Miller Gezegeni fiziği. Burada 1 saatlik araştırma Dünya’daki sevdikleriniz için yıllar demektir.'
                : 'Zaman genleşmesi fark edilir ancak kararlıdır. Dünya ile iletişim gecikmesi düşüktür.'}
            </p>
          </div>

          {/* Spaghettification / Tidal Force Alert */}
          <div className="border border-line bg-ink-2 p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-violet" />
              <span className="label text-paper">Gelgit kuvveti: {spaghettificationRisk.level}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-paper/70">
              {spaghettificationRisk.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
