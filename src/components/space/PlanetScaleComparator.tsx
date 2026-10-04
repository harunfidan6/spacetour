'use client';

import React, { useState } from 'react';
import { Layers, Crosshair, Sparkles } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { PlanetGlyph } from '@/components/ui/CosmicGlyphs';

interface ScaleItem {
  id: string;
  name: string;
  diameterKm: number;
  color: string;
  gradient: string;
  glow: string;
  hasRings?: boolean;
}

const SCALE_DATA: ScaleItem[] = [
  {
    id: 'ay',
    name: 'Ay',
    diameterKm: 3474,
    color: '#b0b5bc',
    gradient: 'radial-gradient(circle at 35% 30%, #f0f3f8 0%, #a4adb8 40%, #20242b 85%, #05070a 100%)',
    glow: 'rgba(200, 215, 235, 0.45)'
  },
  {
    id: 'merkur',
    name: 'Merkür',
    diameterKm: 4879,
    color: '#9e9e9e',
    gradient: 'radial-gradient(circle at 35% 30%, #e2d1c3 0%, #9a7d68 45%, #2a1b14 85%, #080504 100%)',
    glow: 'rgba(210, 185, 160, 0.4)'
  },
  {
    id: 'mars',
    name: 'Mars',
    diameterKm: 6779,
    color: '#ff5722',
    gradient: 'radial-gradient(circle at 35% 30%, #ff8a65 0%, #e64a19 45%, #421005 85%, #100200 100%)',
    glow: 'rgba(255, 87, 34, 0.55)'
  },
  {
    id: 'venus',
    name: 'Venüs',
    diameterKm: 12104,
    color: '#ffb74d',
    gradient: 'radial-gradient(circle at 35% 30%, #ffe082 0%, #ffa726 45%, #663d00 85%, #1f1000 100%)',
    glow: 'rgba(255, 183, 77, 0.5)'
  },
  {
    id: 'dunya',
    name: 'Dünya',
    diameterKm: 12742,
    color: '#00d4ff',
    gradient: 'radial-gradient(circle at 35% 30%, #b3e5fc 0%, #0288d1 35%, #0d47a1 70%, #001026 100%)',
    glow: 'rgba(0, 212, 255, 0.7)'
  },
  {
    id: 'neptun',
    name: 'Neptün',
    diameterKm: 49244,
    color: '#2979ff',
    gradient: 'radial-gradient(circle at 35% 30%, #82b1ff 0%, #2979ff 45%, #0d276b 85%, #02071a 100%)',
    glow: 'rgba(41, 121, 255, 0.6)'
  },
  {
    id: 'uranus',
    name: 'Uranüs',
    diameterKm: 50724,
    color: '#00e5ff',
    gradient: 'radial-gradient(circle at 35% 30%, #b2ebf2 0%, #00b4d8 45%, #00364d 85%, #00111a 100%)',
    glow: 'rgba(0, 229, 255, 0.55)',
    hasRings: true
  },
  {
    id: 'saturn',
    name: 'Satürn',
    diameterKm: 116460,
    color: '#ffd54f',
    gradient: 'radial-gradient(circle at 35% 30%, #fff9c4 0%, #fbc02d 40%, #7f5100 85%, #231200 100%)',
    glow: 'rgba(255, 213, 79, 0.55)',
    hasRings: true
  },
  {
    id: 'jupiter',
    name: 'Jüpiter',
    diameterKm: 139820,
    color: '#ff9800',
    gradient: 'radial-gradient(circle at 35% 30%, #ffe0b2 0%, #fb8c00 35%, #b25000 65%, #2b1100 100%)',
    glow: 'rgba(255, 152, 0, 0.65)'
  },
  {
    id: 'gunes',
    name: 'Güneş',
    diameterKm: 1392700,
    color: '#ffeb3b',
    gradient: 'radial-gradient(circle at 45% 45%, #ffffff 0%, #fff59d 25%, #ff9800 65%, #bf360c 100%)',
    glow: 'rgba(255, 170, 0, 0.95)'
  },
];

export function PlanetScaleComparator() {
  const [targetA, setTargetA] = useState<ScaleItem>(SCALE_DATA[4]); // Earth
  const [targetB, setTargetB] = useState<ScaleItem>(SCALE_DATA[8]); // Jupiter

  // Always compare the larger body against the smaller one
  const [big, small] = targetA.diameterKm >= targetB.diameterKm ? [targetA, targetB] : [targetB, targetA];
  const diameterRatio = big.diameterKm / small.diameterKm;
  const ratio = diameterRatio.toFixed(2);
  const volumeRatio = Math.round(Math.pow(diameterRatio, 3)).toLocaleString('tr-TR');

  // Display size in pixels (max 175px)
  const maxDisplayPx = 175;
  const discSize = (item: ScaleItem) => Math.max(6, (maxDisplayPx * item.diameterKm) / big.diameterKm);
  const sizeA = discSize(targetA);
  const sizeB = discSize(targetB);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-violet">
            <Layers className="h-4 w-4 animate-pulse" />
            <span>KOZMİK ÇAP & HACİM ORANLARI</span>
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Gezegen <span className="serif-i text-violet">Ölçek Karşılaştırıcı</span>
          </h3>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Gök cisimlerini yan yana koyarak gerçek fiziksel çaplarını ve içine kaç tane sığabileceğini 1:1 ölçekle kıyaslayın.
          </p>
        </div>

        <div className="flex items-center gap-2 label text-paper bg-ink-2 border border-line px-4 py-2 shrink-0">
          <Crosshair className="h-3.5 w-3.5 text-violet animate-spin" style={{ animationDuration: '8s' }} />
          <span>Lazer Kumpas Kalibrasyonu:</span>
          <span className="text-violet font-bold font-mono">1:1 Hacim Metriği</span>
        </div>
      </div>

      {/* Target Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-ink-2 space-y-2 border border-line/60">
          <label className="label text-gold flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,0,0.8)]" /> 1. CİSİM (BAZ ALINAN)
          </label>
          <select
            aria-label="Birinci gök cismi"
            value={targetA.id}
            onChange={(e) => setTargetA(SCALE_DATA.find((x) => x.id === e.target.value) || targetA)}
            className="w-full bg-ink border border-line px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-gold transition-colors cursor-pointer font-mono"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-ink-2 space-y-2 border border-line/60">
          <label className="label text-violet flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-violet shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> 2. CİSİM (HEDEF KÜTLE)
          </label>
          <select
            aria-label="İkinci gök cismi"
            value={targetB.id}
            onChange={(e) => setTargetB(SCALE_DATA.find((x) => x.id === e.target.value) || targetB)}
            className="w-full bg-ink border border-line px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-violet transition-colors cursor-pointer font-mono"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Holographic Comparison Deck Arena */}
      <div className="relative border border-line bg-ink-2/80 p-8 flex flex-col md:flex-row items-center justify-around gap-8 min-h-[360px] overflow-hidden">
        {/* Futuristic Laser Caliper Horizontal Guide Lines */}
        <div className="absolute inset-x-8 top-12 border-b border-dashed border-violet/25 pointer-events-none flex items-center justify-between text-[9px] font-mono text-violet/50 px-2">
          <span>▲ ÜST TAYF SINIRI</span>
          <span>LAZER HİZALAMA KUMPASI</span>
          <span>▲ 1:1 ÖLÇEK</span>
        </div>
        <div className="absolute inset-x-8 bottom-24 border-b border-dashed border-violet/25 pointer-events-none flex items-center justify-between text-[9px] font-mono text-violet/50 px-2">
          <span>▼ TABAN SIFIR NOKTASI</span>
          <span>DENGE DÜZLEMİ</span>
          <span>▼ TABAN SIFIR NOKTASI</span>
        </div>

        {/* Item A */}
        <div className="relative flex flex-col items-center gap-6 z-10 w-[220px]">
          <div className="relative flex items-center justify-center min-h-[190px]">
            {/* Saturn Concentric 3D Rings representation */}
            {targetA.hasRings && (
              <div
                className="absolute pointer-events-none rounded-full border border-gold/40 transition-all duration-700 ease-out"
                style={{
                  width: `${sizeA * 2.3}px`,
                  height: `${sizeA * 0.72}px`,
                  background: 'radial-gradient(ellipse at center, transparent 46%, rgba(220,190,140,0.5) 48%, rgba(200,165,110,0.7) 65%, transparent 68%, rgba(240,210,160,0.4) 75%, transparent 80%)',
                  boxShadow: '0 0 15px rgba(255,215,0,0.2)',
                  transform: 'rotate(-20deg)',
                  zIndex: 0
                }}
              />
            )}

            {/* 3D Volumetric Spherical Body */}
            <div
              className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full z-10"
              style={{
                width: `${sizeA}px`,
                height: `${sizeA}px`,
                background: targetA.gradient,
                boxShadow: `0 0 35px ${targetA.glow}, inset -8px -8px 24px rgba(0,0,0,0.9), inset 4px 4px 16px rgba(255,255,255,0.4)`
              }}
            >
              {sizeA >= 28 && (
                <PlanetGlyph
                  planet={targetA.id}
                  size={Math.min(sizeA * 0.42, 42)}
                  className="text-paper/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              )}
            </div>
          </div>

          {/* Holographic Pedestal Base */}
          <div className="relative flex flex-col items-center">
            <div
              className="h-2 rounded-full border border-gold/40 bg-gold/10 transition-all duration-700"
              style={{ width: `${Math.max(60, sizeA * 0.85)}px`, boxShadow: '0 0 16px rgba(255,215,0,0.3)' }}
            />
            <div className="text-center bg-ink border border-line px-4 py-2 mt-2 w-full">
              <div className="display display-tight text-paper text-sm font-bold flex items-center justify-center gap-1.5">
                <span>{targetA.name}</span>
                {targetA.hasRings && <Sparkles size={11} className="text-gold" />}
              </div>
              <div className="label text-[10px] text-muted font-mono">{targetA.diameterKm.toLocaleString()} km</div>
            </div>
          </div>
        </div>

        {/* Telemetry Gauge Readout */}
        <div className="z-10 flex flex-col items-center gap-3 text-center px-6 py-5 bg-ink/95 border border-line/80 backdrop-blur-xl shadow-2xl max-w-[260px]">
          <span className="label text-violet font-mono tracking-widest text-[11px] flex items-center gap-1.5">
            <Crosshair size={12} className="text-violet" />
            ÇAP METRİĞİ
          </span>
          <div className="display display-tight text-4xl font-black text-paper font-mono">
            {ratio}x <span className="label text-muted font-normal text-xs block mt-1">kat fiziksel çap</span>
          </div>

          {/* Ratio bar */}
          <div className="w-full h-1.5 bg-ink-2 border border-line rounded-full overflow-hidden my-1">
            <div
              className="h-full bg-gradient-to-r from-violet to-primary transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(8, (small.diameterKm / big.diameterKm) * 100))}%` }}
            />
          </div>

          <div className="h-px w-full bg-line" />
          {big.id === small.id ? (
            <p className="label text-muted text-xs leading-relaxed">Aynı gök cismini karşılaştırıyorsun.</p>
          ) : (
            <p className="label text-muted text-xs leading-relaxed">
              <strong className="text-paper">{big.name}</strong> içine tam <br />
              <strong className="text-violet text-base font-mono font-bold">{volumeRatio}</strong><br />
              adet <strong className="text-paper">{small.name}</strong> sığar
            </p>
          )}
        </div>

        {/* Item B */}
        <div className="relative flex flex-col items-center gap-6 z-10 w-[220px]">
          <div className="relative flex items-center justify-center min-h-[190px]">
            {/* Saturn Concentric 3D Rings representation */}
            {targetB.hasRings && (
              <div
                className="absolute pointer-events-none rounded-full border border-violet/40 transition-all duration-700 ease-out"
                style={{
                  width: `${sizeB * 2.3}px`,
                  height: `${sizeB * 0.72}px`,
                  background: 'radial-gradient(ellipse at center, transparent 46%, rgba(220,190,140,0.5) 48%, rgba(200,165,110,0.7) 65%, transparent 68%, rgba(240,210,160,0.4) 75%, transparent 80%)',
                  boxShadow: '0 0 15px rgba(168,85,247,0.2)',
                  transform: 'rotate(-20deg)',
                  zIndex: 0
                }}
              />
            )}

            {/* 3D Volumetric Spherical Body */}
            <div
              className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full z-10"
              style={{
                width: `${sizeB}px`,
                height: `${sizeB}px`,
                background: targetB.gradient,
                boxShadow: `0 0 45px ${targetB.glow}, inset -8px -8px 24px rgba(0,0,0,0.9), inset 4px 4px 16px rgba(255,255,255,0.4)`
              }}
            >
              {sizeB >= 28 && (
                <PlanetGlyph
                  planet={targetB.id}
                  size={Math.min(sizeB * 0.42, 48)}
                  className="text-paper/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              )}
            </div>
          </div>

          {/* Holographic Pedestal Base */}
          <div className="relative flex flex-col items-center">
            <div
              className="h-2 rounded-full border border-violet/40 bg-violet/10 transition-all duration-700"
              style={{ width: `${Math.max(60, sizeB * 0.85)}px`, boxShadow: '0 0 16px rgba(168,85,247,0.3)' }}
            />
            <div className="text-center bg-ink border border-line px-4 py-2 mt-2 w-full">
              <div className="display display-tight text-paper text-sm font-bold flex items-center justify-center gap-1.5">
                <span>{targetB.name}</span>
                {targetB.hasRings && <Sparkles size={11} className="text-violet" />}
              </div>
              <div className="label text-[10px] text-muted font-mono">{targetB.diameterKm.toLocaleString()} km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
