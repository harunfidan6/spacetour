'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useInView } from '@/lib/useInView';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { createAccretionDiskTexture } from './textures';
import { seededRandom } from '@/lib/random';

// Ortak görünüm sınıfları
const PANEL = 'border border-line bg-ink-2 p-4 sm:p-5';
const FIELD_LABEL = 'text-sm text-paper/70';
const BODY_TEXT = 'mt-2 text-sm leading-relaxed text-paper/85';
const READOUT_VALUE = 'mt-1 font-mono text-2xl font-semibold leading-tight tabular-nums';
const CANVAS_BUTTON =
  'pointer-events-auto inline-flex min-h-9 shrink-0 items-center border border-line bg-ink/85 px-3 text-sm text-paper transition-colors hover:border-violet cursor-pointer';

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
      ? { level: 'Kritik / ölümcül', desc: 'Aşırı kütleçekimsel gelgit dalgası bedeninizi atomlarına ayırır.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
      : distanceRs < 5.0
      ? { level: 'Yüksek gelgit etkisi', desc: 'Miller Gezegeni yörüngesi. Devasa zaman genleşmesi ve devasa gelgit dalgaları.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
      : { level: 'Güvenli yörünge', desc: 'İstikrarlı dairesel yörünge. Güvenli bilimsel gözlem mesafesi.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Başlık */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Gargantua ve zaman genleşmesi
        </h3>
        <p className="mt-2 text-sm text-paper/70">
          Genel görelilik · Schwarzschild metriği:{' '}
          <span className="whitespace-nowrap font-mono text-paper/85">γ = 1/√(1-r_s/r)</span>
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
          Albert Einstein&apos;ın kütleçekimsel zaman bükülmesini ve süper kütleli bir kara deliğin etrafındaki ışık merceklenmesini deneyimleyin.
        </p>
      </div>

      {/* Main 3D Canvas & Simulation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
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

          {/* Renkli halkanın anlamı ve geminin uzaklığı */}
          <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] bg-ink/85 px-2.5 py-1.5 text-xs leading-snug text-paper sm:left-4 sm:top-4 sm:text-sm">
            Renkli halka: gözlem gemisi yörüngesi ·{' '}
            <span className="whitespace-nowrap font-mono tabular-nums">{distanceRs.toFixed(1)} r_s</span>
          </div>

          {/* Kullanım ipucu ve disk dönüşü düğmesi */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
            <span className="min-w-0 bg-ink/70 px-2 py-1 text-xs leading-snug text-paper/80">
              360° sürükle · yakınlaştır
            </span>
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className={CANVAS_BUTTON}
            >
              {isRotating ? 'Döndürmeyi duraklat' : 'Döndür'}
            </button>
          </div>
        </div>

        {/* Telemetry & Time Dilation Cockpit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Distance Slider */}
          <div className={`${PANEL} space-y-3`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-paper/80">Olay ufkuna uzaklık</span>
              <span className="whitespace-nowrap font-mono text-base font-semibold tabular-nums text-violet">
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

            <div className="grid grid-cols-3 gap-2 text-xs leading-snug">
              <span className="flex flex-col text-rose-signal">
                <span className="font-mono">1.1 r<sub>s</sub></span>
                <span>Kritik</span>
              </span>
              <span className="flex flex-col items-center text-paper/70">
                <span className="font-mono">6.0 r<sub>s</sub></span>
                <span>ISCO</span>
              </span>
              <span className="flex flex-col items-end text-lime">
                <span className="font-mono">20.0 r<sub>s</sub></span>
                <span>Güvenli</span>
              </span>
            </div>
          </div>

          {/* Time Dilation Readout Grid */}
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <div className={FIELD_LABEL}>Burada geçen</div>
              <div className={`${READOUT_VALUE} text-violet`}>1.0 Saat</div>
            </div>
            <div className="bg-ink p-4">
              <div className={FIELD_LABEL}>Dünya’da geçen</div>
              <div className={`${READOUT_VALUE} text-paper`}>{timeDilationText}</div>
            </div>
          </div>

          {/* Zaman faktörü ve gelgit kuvveti */}
          <div className={PANEL}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-violet">Genel görelilik zaman faktörü</span>
              <span className="whitespace-nowrap font-mono text-sm tabular-nums text-paper">
                γ = {timeDilationFactor > 1000 ? '∞' : timeDilationFactor.toFixed(2)}x
              </span>
            </div>

            <p className={BODY_TEXT}>
              {distanceRs < 2.0
                ? 'Olay ufkuna o kadar yakınsınız ki uzay-zaman neredeyse donmuş durumda. Dünya’da uygarlıklar yükselip yıkılırken siz yalnızca dakikalar yaşarsınız.'
                : distanceRs < 6.0
                ? 'Interstellar filmindeki Miller Gezegeni fiziği. Burada 1 saatlik araştırma Dünya’daki sevdikleriniz için yıllar demektir.'
                : 'Zaman genleşmesi fark edilir ancak kararlıdır. Dünya ile iletişim gecikmesi düşüktür.'}
            </p>

            {/* Spaghettification / Tidal Force Alert */}
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-medium text-paper/85">Gelgit kuvveti</span>
                <span className={`border px-2 py-0.5 text-xs font-medium ${spaghettificationRisk.color}`}>
                  {spaghettificationRisk.level}
                </span>
              </div>
              <p className={BODY_TEXT}>
                {spaghettificationRisk.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
