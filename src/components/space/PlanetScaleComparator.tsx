'use client';

import React, { useState } from 'react';
import { PlanetGlyph } from '@/components/ui/CosmicGlyphs';

// Ortak görünüm sınıfları
const FIELD_LABEL = 'flex items-center gap-2 text-sm text-paper/70';
const FIELD_INPUT =
  'w-full min-h-10 border border-line bg-ink px-3 py-2 text-base text-paper transition-colors cursor-pointer focus:outline-none';
const BODY_NAME = 'flex items-center justify-center gap-2 text-base font-semibold text-paper';
const BODY_DIAMETER = 'font-mono text-sm tabular-nums text-paper/70';
const RING_GRADIENT =
  'radial-gradient(ellipse at center, transparent 46%, rgba(220,190,140,0.5) 48%, rgba(200,165,110,0.7) 65%, transparent 68%, rgba(240,210,160,0.4) 75%, transparent 80%)';
const SPHERE_SHADING = 'inset -8px -8px 24px rgba(0,0,0,0.9), inset 4px 4px 16px rgba(255,255,255,0.4)';

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
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Gezegen ölçek karşılaştırıcı
        </h3>
        <p className="mt-1 text-sm text-paper/70">
          Çap ve hacim oranları · <span className="font-mono">1:1</span> ölçek
        </p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">
          Gök cisimlerini yan yana koyarak gerçek fiziksel çaplarını ve içine kaç tane sığabileceğini 1:1 ölçekle kıyaslayın.
        </p>
      </div>

      {/* Target Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>
            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" /> 1. cisim (baz)
          </label>
          <select
            aria-label="Birinci gök cismi"
            value={targetA.id}
            onChange={(e) => setTargetA(SCALE_DATA.find((x) => x.id === e.target.value) || targetA)}
            className={`${FIELD_INPUT} focus:border-gold`}
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={FIELD_LABEL}>
            <span className="h-2 w-2 shrink-0 rounded-full bg-violet" /> 2. cisim (hedef)
          </label>
          <select
            aria-label="İkinci gök cismi"
            value={targetB.id}
            onChange={(e) => setTargetB(SCALE_DATA.find((x) => x.id === e.target.value) || targetB)}
            className={`${FIELD_INPUT} focus:border-violet`}
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Arena */}
      <div className="relative border border-line bg-ink-2 p-4 sm:p-8 flex flex-col md:flex-row items-center justify-around gap-8 min-h-[360px] overflow-hidden">
        {/* Item A */}
        <div className="relative z-10 flex flex-col items-center gap-4 w-[220px]">
          <div className="relative flex items-center justify-center min-h-[190px]">
            {/* Ring representation */}
            {targetA.hasRings && (
              <div
                className="absolute pointer-events-none rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${sizeA * 2.3}px`,
                  height: `${sizeA * 0.72}px`,
                  background: RING_GRADIENT,
                  transform: 'rotate(-20deg)',
                  zIndex: 0
                }}
              />
            )}

            {/* Spherical Body */}
            <div
              className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full z-10"
              style={{
                width: `${sizeA}px`,
                height: `${sizeA}px`,
                background: targetA.gradient,
                boxShadow: `0 0 12px ${targetA.glow}, ${SPHERE_SHADING}`
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

          <div className="text-center">
            <div className={BODY_NAME}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span>{targetA.name}</span>
            </div>
            <div className={BODY_DIAMETER}>{targetA.diameterKm.toLocaleString()} km</div>
          </div>
        </div>

        {/* Ratio Readout */}
        <div className="z-10 flex w-full max-w-[260px] flex-col items-center gap-3 text-center">
          <span className="text-sm text-paper/70">Çap oranı</span>
          <div>
            <div className="font-mono text-4xl font-semibold leading-none tabular-nums text-paper">{ratio}x</div>
            <div className="mt-1.5 text-sm text-paper/70">kat fiziksel çap</div>
          </div>

          {/* Ratio bar */}
          <div className="w-full h-1.5 bg-line rounded-full overflow-hidden my-1">
            <div
              className="h-full bg-violet transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(8, (small.diameterKm / big.diameterKm) * 100))}%` }}
            />
          </div>

          {big.id === small.id ? (
            <p className="text-sm leading-relaxed text-paper/80">Aynı gök cismini karşılaştırıyorsun.</p>
          ) : (
            <p className="text-sm leading-relaxed text-paper/80">
              <strong className="font-semibold text-paper">{big.name}</strong> içine tam <br />
              <strong className="font-mono text-xl font-semibold tabular-nums text-violet">{volumeRatio}</strong><br />
              adet <strong className="font-semibold text-paper">{small.name}</strong> sığar
            </p>
          )}
        </div>

        {/* Item B */}
        <div className="relative z-10 flex flex-col items-center gap-4 w-[220px]">
          <div className="relative flex items-center justify-center min-h-[190px]">
            {/* Ring representation */}
            {targetB.hasRings && (
              <div
                className="absolute pointer-events-none rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${sizeB * 2.3}px`,
                  height: `${sizeB * 0.72}px`,
                  background: RING_GRADIENT,
                  transform: 'rotate(-20deg)',
                  zIndex: 0
                }}
              />
            )}

            {/* Spherical Body */}
            <div
              className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full z-10"
              style={{
                width: `${sizeB}px`,
                height: `${sizeB}px`,
                background: targetB.gradient,
                boxShadow: `0 0 12px ${targetB.glow}, ${SPHERE_SHADING}`
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

          <div className="text-center">
            <div className={BODY_NAME}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet" />
              <span>{targetB.name}</span>
            </div>
            <div className={BODY_DIAMETER}>{targetB.diameterKm.toLocaleString()} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
