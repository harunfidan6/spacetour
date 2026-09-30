'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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

  // Relativistic relativistic jet particles
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

  useFrame((_, delta) => {
    if (isAccretionRotating && diskRef.current) {
      diskRef.current.rotation.z += delta * 0.4;
    }
    if (photonRingRef.current) {
      photonRingRef.current.rotation.z -= delta * 0.2;
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
        <ringGeometry args={[1.85, 2.15, 64]} />
        <meshBasicMaterial
          color="#ffeedd"
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Swirling Relativistic Accretion Disk (Gargantua Style) */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[2.4, 7.5, 96]} />
        <meshBasicMaterial
          map={diskTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vertical Lensed Warp Ring (Gravitational Lensing Arc) */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[2.5, 6.8, 96]} />
        <meshBasicMaterial
          map={diskTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Relativistic Jets */}
      <points ref={jetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jetPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#80d4ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 5. Observer Ship Orbit Indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distanceRs * 0.16, distanceRs * 0.16 + 0.05, 64]} />
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
        <div className="lg:col-span-7 relative h-80 sm:h-[460px] w-full border border-line bg-black overflow-hidden">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.5, 9.5], fov: 45 }} gl={{ powerPreference: 'high-performance' }}>
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
              minDistance={4}
              maxDistance={15}
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
            <span className="label text-muted">Mavi Halka: Gözlemci Konumu</span>
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

            <input
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
