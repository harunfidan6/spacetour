'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  Zap,
  RotateCcw,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { createAccretionDiskTexture } from './textures';

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
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const isTop = i % 2 === 0;
      const y = isTop ? Math.random() * 8 + 2 : -(Math.random() * 8 + 2);
      const spread = (Math.abs(y) / 8) * 0.4;
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
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
    <div className="rounded-3xl border border-purple-500/30 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-widest">
              GENEL GÖRELİLİK & ASTROFİZİK LABORATUVARI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Kara Delik & Zaman Genleşmesi Simülatörü
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Albert Einstein&apos;ın kütleçekimsel zaman genişlemesini ve Interstellar filmindeki Gargantua benzeri süper kütleli bir kara deliğin etrafındaki ışık bükülmesini interaktif deneyimleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1.5 rounded-full">
          <span>Schwarzschild Metriği</span>
        </div>
      </div>

      {/* Main 3D Canvas & Simulation Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Black Hole Canvas (7 cols) */}
        <div className="lg:col-span-7 relative h-80 sm:h-[440px] w-full rounded-3xl border border-white/10 bg-black/80 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          <Canvas camera={{ position: [0, 2.5, 9.5], fov: 45 }}>
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
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">
              3D GARGANTUA • GÖZLEM GEMİSİ YÖRÜNGESİ
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              {isRotating ? 'Döndürmeyi Duraklat' : 'Döndür'}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-neutral-400 pointer-events-none">
            <span>Mavi Halkalar: Gözlemcinin Anlık Yörüngesi</span>
            <span>🖱️ 360° Çevir • Tekerlek ile Yakınlaş</span>
          </div>
        </div>

        {/* Telemetry & Time Dilation Cockpit (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Distance Slider */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-purple-400" />
                Olay Ufkuna Uzaklık
              </span>
              <span className="text-purple-300 font-black text-sm">
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
              className="w-full accent-purple-400 cursor-pointer h-2 bg-white/10 rounded-lg"
            />

            <div className="flex justify-between text-[10px] text-neutral-500">
              <span className="text-rose-400">1.1 r<sub>s</sub> (Tehlikeli)</span>
              <span>6.0 r<sub>s</sub> (ISCO)</span>
              <span className="text-emerald-400">20.0 r<sub>s</sub> (Güvenli)</span>
            </div>
          </div>

          {/* Big Time Dilation Readout Card */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/40 to-black/60 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Clock size={16} className="text-amber-400" />
                <span>Kütleçekimsel Zaman Genleşmesi</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                γ = {timeDilationFactor > 1000 ? '∞' : timeDilationFactor.toFixed(2)}x
              </span>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-neutral-400 block font-mono">
                Bu yörüngede geçireceğiniz her 1 Saat =
              </span>
              <div className="text-3xl font-black text-white font-mono mt-0.5">
                Dünya&apos;da {timeDilationText}
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1">
              {distanceRs < 2.0
                ? 'Olay ufkuna o kadar yakınsınız ki uzay-zaman neredeyse donmuş durumda. Dünya’da uygarlıklar yükselip yıkılırken siz yalnızca dakikalar yaşarsınız.'
                : distanceRs < 6.0
                ? 'Interstellar filmindeki Miller Gezegeni fiziği. Burada 1 saatlik araştırma Dünya’daki sevdikleriniz için yıllar demektir.'
                : 'Zaman genleşmesi fark edilir ancak kararlıdır. Dünya ile iletişim gecikmesi düşüktür.'}
            </p>
          </div>

          {/* Spaghettification / Tidal Force Alert */}
          <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${spaghettificationRisk.color}`}>
            <div className="flex items-center gap-2 font-bold uppercase">
              <ShieldAlert size={15} />
              <span>Gelgit Kuvveti & Spagettileşme: {spaghettificationRisk.level}</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              {spaghettificationRisk.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
