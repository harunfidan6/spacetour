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

  // GLSL Shader Material for Relativistic Accretion Disk with Doppler Beaming
  const accretionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: diskTexture },
        uDoppler: { value: 0.85 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform float uDoppler;
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 d = vUv - center;
          float r = length(d);
          float angle = atan(d.y, d.x);

          // Relativistic differential rotation: inner disk spins faster
          float spin = angle + (uTime * 0.45) / max(r * 2.0, 0.4);
          vec2 uvSample = center + vec2(cos(spin), sin(spin)) * r;

          vec4 base = texture2D(uTexture, uvSample);

          // Doppler Beaming: Approaching side (left) is brighter and blue-shifted
          float doppler = clamp(sin(angle) * uDoppler + 1.0, 0.3, 2.2);

          // Spectral shift: blue-shift approaching, red-shift receding
          vec3 blueShift = vec3(0.9, 1.15, 1.4);
          vec3 redShift = vec3(1.3, 0.8, 0.45);
          vec3 shift = mix(redShift, blueShift, clamp(sin(angle) * 0.5 + 0.5, 0.0, 1.0));

          vec3 color = base.rgb * doppler * shift;
          float alpha = base.a * smoothstep(0.12, 0.22, r) * (1.0 - smoothstep(0.46, 0.5, r));

          gl_FragColor = vec4(color, alpha * 0.95);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [diskTexture]);

  // GLSL Shader Material for Gravitational Lensing Halo (Far side Einstein bending)
  const lensHaloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: lensTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 d = vUv - center;
          float r = length(d);
          float angle = atan(d.y, d.x);

          float spin = angle + uTime * 0.3;
          vec2 uvSample = center + vec2(cos(spin), sin(spin)) * r;
          vec4 base = texture2D(uTexture, uvSample);

          // Gravitational lensing upper and lower arches
          float arch = abs(sin(angle));
          float intensity = smoothstep(0.18, 0.28, r) * (1.0 - smoothstep(0.42, 0.5, r)) * arch;

          gl_FragColor = vec4(base.rgb * 1.4, base.a * intensity * 0.45);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
  }, [lensTexture]);

  const lensRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (isAccretionRotating) {
      const dMat = diskRef.current?.material as THREE.ShaderMaterial | undefined;
      if (dMat?.uniforms?.uTime) dMat.uniforms.uTime.value += dt;
      const lMat = lensRef.current?.material as THREE.ShaderMaterial | undefined;
      if (lMat?.uniforms?.uTime) lMat.uniforms.uTime.value += dt;
    }
    // The photon ring and the lensed image of the far side of the disk always face the
    // observer: they are images formed by bent light, not objects lying in a plane.
    for (const m of [photonRingRef.current, lensRef.current]) {
      if (m) m.quaternion.copy(camera.quaternion);
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

      {/* 2. Photon Sphere / Einstein Lensing Shadow Ring */}
      <mesh ref={photonRingRef}>
        <ringGeometry args={[1.84, 2.0, 128]} />
        <meshBasicMaterial
          color="#ffd9a8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Swirling Relativistic Accretion Disk (Gargantua Style with Doppler Beaming Shader) */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2.3, 0, 0]} material={accretionMaterial}>
        <ringGeometry args={[2.4, 7.5, 96]} />
      </mesh>

      {/* Lensed image of the disk's far side (Einstein Gravitational Lensing Halo Shader), always facing the observer */}
      <mesh ref={lensRef} renderOrder={2} material={lensHaloMaterial}>
        <ringGeometry args={[2.2, 4.2, 128]} />
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
