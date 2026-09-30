'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { PlanetGlyph } from '@/components/ui/CosmicGlyphs';

interface ScaleItem {
  id: string;
  name: string;
  diameterKm: number;
  color: string;
}

const SCALE_DATA: ScaleItem[] = [
  { id: 'ay', name: 'Ay', diameterKm: 3474, color: '#b0b5bc' },
  { id: 'merkur', name: 'Merkür', diameterKm: 4879, color: '#9e9e9e' },
  { id: 'mars', name: 'Mars', diameterKm: 6779, color: '#ff5722' },
  { id: 'venus', name: 'Venüs', diameterKm: 12104, color: '#ffb74d' },
  { id: 'dunya', name: 'Dünya', diameterKm: 12742, color: '#00d4ff' },
  { id: 'neptun', name: 'Neptün', diameterKm: 49244, color: '#2979ff' },
  { id: 'uranus', name: 'Uranüs', diameterKm: 50724, color: '#00e5ff' },
  { id: 'saturn', name: 'Satürn', diameterKm: 116460, color: '#ffd54f' },
  { id: 'jupiter', name: 'Jüpiter', diameterKm: 139820, color: '#ff9800' },
  { id: 'gunes', name: 'Güneş', diameterKm: 1392700, color: '#ffeb3b' },
];

export function PlanetScaleComparator() {
  const [targetA, setTargetA] = useState<ScaleItem>(SCALE_DATA[4]); // Earth
  const [targetB, setTargetB] = useState<ScaleItem>(SCALE_DATA[8]); // Jupiter

  const ratio = (targetB.diameterKm / targetA.diameterKm).toFixed(2);
  const volumeRatio = Math.round(Math.pow(targetB.diameterKm / targetA.diameterKm, 3)).toLocaleString();

  const maxDisplayPx = 160;
  const ratioVisual = targetA.diameterKm / targetB.diameterKm;

  const sizeB = maxDisplayPx;
  const sizeA = Math.max(20, Math.min(maxDisplayPx, maxDisplayPx * ratioVisual));

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
          <span>Lazer Kumpas Kalibrasyonu:</span>
          <span className="text-violet font-bold font-mono">1:1 Hacim Metriği</span>
        </div>
      </div>

      {/* Target Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-ink-2 space-y-2">
          <label className="label text-gold flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-gold" /> 1. CİSİM (BAZ ALINAN)
          </label>
          <select
            value={targetA.id}
            onChange={(e) => setTargetA(SCALE_DATA.find((x) => x.id === e.target.value) || targetA)}
            className="w-full bg-ink border border-line px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-gold transition-colors cursor-pointer"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-ink-2 space-y-2">
          <label className="label text-violet flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-violet" /> 2. CİSİM (HEDEF KÜTLE)
          </label>
          <select
            value={targetB.id}
            onChange={(e) => setTargetB(SCALE_DATA.find((x) => x.id === e.target.value) || targetB)}
            className="w-full bg-ink border border-line px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-violet transition-colors cursor-pointer"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id} className="bg-ink-2 text-paper">
                {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Holographic Comparison Deck */}
      <div className="relative border border-line bg-ink-2 p-8 flex flex-col md:flex-row items-center justify-around gap-8 min-h-[300px]">
        {/* Item A */}
        <div className="relative flex flex-col items-center gap-6 z-10 w-[200px]">
          <div
            className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full"
            style={{
              width: `${sizeA}px`,
              height: `${sizeA}px`,
              backgroundColor: targetA.color,
              boxShadow: `0 0 30px ${targetA.color}44`
            }}
          >
            <PlanetGlyph
              planet={targetA.id}
              size={Math.max(12, Math.min(sizeA * 0.45, 42))}
              className="text-ink"
            />
          </div>

          <div className="text-center bg-ink border border-line px-4 py-2">
            <div className="display display-tight text-paper text-sm font-bold">{targetA.name}</div>
            <div className="label text-[10px] text-muted">{targetA.diameterKm.toLocaleString()} km</div>
          </div>
        </div>

        {/* Telemetry Readout */}
        <div className="z-10 flex flex-col items-center gap-3 text-center px-6 py-4 bg-ink border border-line">
          <span className="label text-violet">
            HACİMSEL ORAN
          </span>
          <div className="display display-tight text-4xl font-black text-paper">
            {ratio}x <span className="label text-muted font-normal text-xs">kat çap</span>
          </div>
          <div className="h-px w-full bg-line" />
          <p className="label text-muted max-w-[200px] leading-relaxed">
            <strong className="text-paper">{targetB.name}</strong> içine tam <br />
            <strong className="text-violet text-sm font-mono">{volumeRatio}</strong><br />
            adet <strong className="text-paper">{targetA.name}</strong> sığar
          </p>
        </div>

        {/* Item B */}
        <div className="relative flex flex-col items-center gap-6 z-10 w-[200px]">
          <div
            className="relative flex items-center justify-center transition-all duration-700 ease-in-out rounded-full"
            style={{
              width: `${sizeB}px`,
              height: `${sizeB}px`,
              backgroundColor: targetB.color,
              boxShadow: `0 0 40px ${targetB.color}55`
            }}
          >
            <PlanetGlyph
              planet={targetB.id}
              size={Math.max(18, Math.min(sizeB * 0.45, 48))}
              className="text-ink"
            />
          </div>

          <div className="text-center bg-ink border border-line px-4 py-2">
            <div className="display display-tight text-paper text-sm font-bold">{targetB.name}</div>
            <div className="label text-[10px] text-muted">{targetB.diameterKm.toLocaleString()} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
