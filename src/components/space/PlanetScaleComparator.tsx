'use client';

import React, { useState } from 'react';
import { Scale, ArrowRight, Sparkles, Globe, Layers } from 'lucide-react';

interface ScaleItem {
  id: string;
  name: string;
  diameterKm: number;
  color: string;
  image: string;
}

const SCALE_DATA: ScaleItem[] = [
  { id: 'ay', name: 'Ay', diameterKm: 3474, color: '#b0b5bc', image: '🌕' },
  { id: 'merkur', name: 'Merkür', diameterKm: 4879, color: '#9e9e9e', image: '🪨' },
  { id: 'mars', name: 'Mars', diameterKm: 6779, color: '#ff5722', image: '🔴' },
  { id: 'venus', name: 'Venüs', diameterKm: 12104, color: '#ffb74d', image: '✨' },
  { id: 'dunya', name: 'Dünya', diameterKm: 12742, color: '#00d4ff', image: '🌍' },
  { id: 'neptun', name: 'Neptün', diameterKm: 49244, color: '#2979ff', image: '🔵' },
  { id: 'uranus', name: 'Uranüs', diameterKm: 50724, color: '#00e5ff', image: '🧊' },
  { id: 'saturn', name: 'Satürn', diameterKm: 116460, color: '#ffd54f', image: '🪐' },
  { id: 'jupiter', name: 'Jüpiter', diameterKm: 139820, color: '#ff9800', image: '🟠' },
  { id: 'gunes', name: 'Güneş', diameterKm: 1392700, color: '#ffeb3b', image: '☀️' },
];

export function PlanetScaleComparator() {
  const [targetA, setTargetA] = useState<ScaleItem>(SCALE_DATA[4]); // Earth
  const [targetB, setTargetB] = useState<ScaleItem>(SCALE_DATA[8]); // Jupiter

  const ratio = (targetB.diameterKm / targetA.diameterKm).toFixed(2);
  const volumeRatio = Math.round(Math.pow(targetB.diameterKm / targetA.diameterKm, 3)).toLocaleString();

  const maxDisplayPx = 160;
  const ratioVisual = targetA.diameterKm / targetB.diameterKm;

  const sizeB = maxDisplayPx;
  const sizeA = Math.max(16, Math.min(maxDisplayPx, maxDisplayPx * ratioVisual));

  return (
    <div className="rounded-3xl border border-primary/30 bg-card-bg/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/40 backdrop-blur-md">
            <Layers className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-paper text-lg tracking-widest font-mono uppercase">
              Holografik Ölçek Güvertesi
            </h3>
            <span className="text-xs text-primary font-mono tracking-widest flex items-center gap-2">
              <Sparkles size={10} className="animate-spin" /> KOZMİK ÇAP & HACİM ORANLARI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-text-secondary bg-background/60 px-3 py-1.5 rounded-xl border border-card-border">
          <span>Lazer Kumpas Kalibrasyonu:</span>
          <span className="text-primary font-bold">1:1 HASSASİYET</span>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10 font-mono">
        <div className="p-4 rounded-2xl bg-background/50 border border-primary/20 space-y-2">
          <label className="text-xs text-primary font-bold tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" /> 1. CİSİM (REFERANS KÜTLE)
          </label>
          <select
            value={targetA.id}
            onChange={(e) => setTargetA(SCALE_DATA.find((x) => x.id === e.target.value) || targetA)}
            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id}>
                {item.image} {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-background/50 border border-secondary/20 space-y-2">
          <label className="text-xs text-secondary font-bold tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" /> 2. CİSİM (HEDEF KÜTLE)
          </label>
          <select
            value={targetB.id}
            onChange={(e) => setTargetB(SCALE_DATA.find((x) => x.id === e.target.value) || targetB)}
            className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-2.5 text-sm font-bold text-paper focus:outline-none focus:border-secondary transition-all cursor-pointer"
          >
            {SCALE_DATA.map((item) => (
              <option key={item.id} value={item.id}>
                {item.image} {item.name} ({item.diameterKm.toLocaleString()} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Holographic Comparison Deck */}
      <div className="relative rounded-2xl bg-background/60 p-8 border border-card-border flex flex-col md:flex-row items-center justify-around gap-8 min-h-[300px]">
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
            <span className="text-2xl select-none">{targetA.image}</span>
          </div>

          <div className="text-center bg-card-bg/80 border border-primary/30 px-4 py-2 rounded-xl">
            <div className="font-bold text-paper text-sm">{targetA.name}</div>
            <div className="text-xs font-mono text-primary">{targetA.diameterKm.toLocaleString()} km</div>
          </div>
        </div>

        {/* Telemetry Readout */}
        <div className="z-10 flex flex-col items-center gap-3 text-center px-6 py-4 rounded-2xl bg-card-bg border border-secondary/50 shadow-2xl">
          <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-widest">
            HACİMSEL ORAN
          </span>
          <div className="text-4xl font-black text-paper font-mono">
            {ratio}x <span className="text-xs text-text-secondary font-normal">kat çap</span>
          </div>
          <div className="h-px w-full bg-secondary/30" />
          <p className="text-xs text-text-secondary font-mono max-w-[200px] leading-relaxed">
            <strong className="text-paper">{targetB.name}</strong> içine tam <br />
            <strong className="text-secondary text-sm bg-secondary/10 px-2 py-0.5 rounded">{volumeRatio}</strong><br />
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
              boxShadow: `0 0 40px ${targetB.color}66`
            }}
          >
            <span className="text-5xl select-none">{targetB.image}</span>
          </div>

          <div className="text-center bg-card-bg/80 border border-secondary/30 px-4 py-2 rounded-xl">
            <div className="font-bold text-paper text-sm">{targetB.name}</div>
            <div className="text-xs font-mono text-secondary">{targetB.diameterKm.toLocaleString()} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
