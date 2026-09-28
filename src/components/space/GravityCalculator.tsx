'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowUp, Zap, Target } from 'lucide-react';

interface GravityBody {
  id: string;
  name: string;
  gravityRatio: number;
  emoji: string;
  jumpMultiplier: number;
  funFact: string;
  color: string;
}

const BODIES: GravityBody[] = [
  { id: 'moon', name: 'Ay', gravityRatio: 0.166, emoji: '🌕', jumpMultiplier: 6.0, funFact: 'Apollo astronotlarının kanguru gibi zıplamasının nedeni budur.', color: 'text-gray-300' },
  { id: 'mercury', name: 'Merkür', gravityRatio: 0.38, emoji: '🪨', jumpMultiplier: 2.6, funFact: 'Kütlesi küçük olmasına rağmen demir çekirdeği çok yoğundur.', color: 'text-amber-400' },
  { id: 'venus', name: 'Venüs', gravityRatio: 0.91, emoji: '✨', jumpMultiplier: 1.1, funFact: 'Dünya’ya yerçekimi olarak en çok benzeyen ikiz gezegendir.', color: 'text-yellow-400' },
  { id: 'earth', name: 'Dünya', gravityRatio: 1.0, emoji: '🌍', jumpMultiplier: 1.0, funFact: 'Alıştığınız 1g (9.81 m/s²) standart yerçekimi.', color: 'text-[#00d4ff]' },
  { id: 'mars', name: 'Mars', gravityRatio: 0.38, emoji: '🔴', jumpMultiplier: 2.6, funFact: 'Olimpos Dağı gibi devasa yanardağlar düşük yerçekimi sayesinde yükseldi.', color: 'text-[#ff5722]' },
  { id: 'jupiter', name: 'Jüpiter', gravityRatio: 2.53, emoji: '🟠', jumpMultiplier: 0.39, funFact: 'Vücudunuz 2.5 kat ağırlaşır, ayakta durmak dahi muazzam efor gerektirir.', color: 'text-[#ff9800]' },
  { id: 'saturn', name: 'Satürn', gravityRatio: 1.06, emoji: '🪐', jumpMultiplier: 0.94, funFact: 'Devasa boyutuna rağmen gaz yoğunluğu sudan az olduğu için yerçekimi Dünya’ya yakındır.', color: 'text-yellow-200' },
  { id: 'pluto', name: 'Plüton', gravityRatio: 0.063, emoji: '🌑', jumpMultiplier: 15.8, funFact: 'Hafif bir zıplamayla 2 katlı bir binanın üzerine çıkabilirsiniz!', color: 'text-[#a855f7]' },
  { id: 'sun', name: 'Güneş', gravityRatio: 27.9, emoji: '☀️', jumpMultiplier: 0.03, funFact: 'Kemikleriniz kendi ağırlığınızı taşıyamaz ve anında ezilirdiniz.', color: 'text-yellow-500' },
];

export function GravityCalculator() {
  const [earthWeight, setEarthWeight] = useState<number>(70);

  return (
    <div className="rounded-3xl border border-secondary/40 bg-card-bg/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/20 rounded-2xl border border-secondary/40 backdrop-blur-md">
            <Target className="h-6 w-6 text-secondary animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-widest font-mono uppercase">
              Yerçekimi Alan Odası
            </h3>
            <span className="text-xs text-secondary font-mono tracking-widest flex items-center gap-2">
              <Zap size={10} className="animate-pulse" /> NEWTON ÇEKİM KANUNLARI LABORATUVARI
            </span>
          </div>
        </div>

        {/* Weight Input Box */}
        <div className="flex items-center gap-3 font-mono bg-background/80 p-2 pr-4 rounded-2xl border border-secondary/30 shadow-inner">
          <div className="p-2 bg-secondary/10 rounded-xl">
            <Fingerprint className="text-secondary h-4 w-4" />
          </div>
          <span className="text-xs text-gray-400">REFERANS KÜTLE:</span>
          <div className="relative group">
            <input
              type="number"
              min="20"
              max="250"
              value={earthWeight}
              onChange={(e) => setEarthWeight(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-lg bg-card-bg border border-secondary/50 px-3 py-1.5 text-center text-lg font-black text-white focus:outline-none focus:border-secondary transition-all"
            />
            <span className="absolute right-2 top-2 text-xs text-secondary font-bold">kg</span>
          </div>
        </div>
      </div>

      {/* Grid of Celestial Bodies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {BODIES.map((body) => {
          const weightOnBody = (earthWeight * body.gravityRatio).toFixed(1);
          const jumpHeightCm = Math.round(50 * body.jumpMultiplier);
          const barWidth = Math.min(100, Math.max(5, (body.gravityRatio / 2.53) * 100));

          return (
            <div
              key={body.id}
              className="group p-5 rounded-2xl bg-background/50 border border-secondary/20 hover:border-secondary hover:bg-card-bg/90 transition-all duration-300 flex flex-col space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform">{body.emoji}</span>
                  <div>
                    <h4 className="font-bold text-white text-base tracking-wide">{body.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono bg-secondary/20 text-secondary px-1.5 py-0.5 rounded border border-secondary/30">
                        {body.gravityRatio}G
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black font-mono text-white tracking-wider">
                    {weightOnBody} <span className="text-xs text-secondary font-normal">kg</span>
                  </div>
                </div>
              </div>

              {/* Gravity Wave Bar */}
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-secondary/20">
                <div 
                  className="h-full bg-gradient-to-r from-secondary/50 to-secondary rounded-full shadow-[0_0_10px_#a855f7] transition-all duration-1000 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="pt-3 border-t border-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/30">
                    <ArrowUp size={14} className="text-blue-400 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">Zıplama İrtifası</span>
                </div>
                <span className="font-bold text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                  {jumpHeightCm >= 100 ? `${(jumpHeightCm / 100).toFixed(1)} m` : `${jumpHeightCm} cm`}
                </span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed italic bg-black/20 p-2 rounded-lg border border-white/5">
                {body.funFact}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
