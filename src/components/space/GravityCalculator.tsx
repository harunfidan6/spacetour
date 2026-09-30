'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowUp, Target } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { PlanetGlyph } from '@/components/ui/CosmicGlyphs';

interface GravityBody {
  id: string;
  name: string;
  gravityRatio: number;
  jumpMultiplier: number;
  funFact: string;
  color: string;
}

const BODIES: GravityBody[] = [
  { id: 'moon', name: 'Ay', gravityRatio: 0.166, jumpMultiplier: 6.0, funFact: 'Apollo astronotlarının kanguru gibi zıplamasının nedeni budur.', color: 'text-paper/75' },
  { id: 'mercury', name: 'Merkür', gravityRatio: 0.38, jumpMultiplier: 2.6, funFact: 'Kütlesi küçük olmasına rağmen demir çekirdeği çok yoğundur.', color: 'text-gold' },
  { id: 'venus', name: 'Venüs', gravityRatio: 0.91, jumpMultiplier: 1.1, funFact: 'Dünya’ya yerçekimi olarak en çok benzeyen ikiz gezegendir.', color: 'text-yellow-400' },
  { id: 'earth', name: 'Dünya', gravityRatio: 1.0, jumpMultiplier: 1.0, funFact: 'Alıştığınız 1g (9.81 m/s²) standart yerçekimi.', color: 'text-primary' },
  { id: 'mars', name: 'Mars', gravityRatio: 0.38, jumpMultiplier: 2.6, funFact: 'Olimpos Dağı gibi devasa yanardağlar düşük yerçekimi sayesinde yükseldi.', color: 'text-[#ff5722]' },
  { id: 'jupiter', name: 'Jüpiter', gravityRatio: 2.53, jumpMultiplier: 0.39, funFact: 'Vücudunuz 2.5 kat ağırlaşır, ayakta durmak dahi muazzam efor gerektirir.', color: 'text-[#ff9800]' },
  { id: 'saturn', name: 'Satürn', gravityRatio: 1.06, jumpMultiplier: 0.94, funFact: 'Devasa boyutuna rağmen gaz yoğunluğu sudan az olduğu için yerçekimi Dünya’ya yakındır.', color: 'text-yellow-200' },
  { id: 'pluto', name: 'Plüton', gravityRatio: 0.063, jumpMultiplier: 15.8, funFact: 'Hafif bir zıplamayla 2 katlı bir binanın üzerine çıkabilirsiniz!', color: 'text-[#a855f7]' },
  { id: 'sun', name: 'Güneş', gravityRatio: 27.9, jumpMultiplier: 0.03, funFact: 'Kemikleriniz kendi ağırlığınızı taşıyamaz ve anında ezilirdiniz.', color: 'text-yellow-500' },
];

export function GravityCalculator() {
  const [earthWeight, setEarthWeight] = useState<number>(70);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-violet">
            <Target className="h-4 w-4 animate-spin-slow" />
            <span>NEWTON ÇEKİM KANUNLARI LABORATUVARI</span>
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Kütleçekim <span className="serif-i text-violet">Hesaplayıcı</span>
          </h3>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Kendi kütlenizle Güneş Sistemi&apos;nin farklı gök cisimlerinde ne kadar ağır geleceğinizi ve ne kadar yükseğe zıplayabileceğinizi hesaplayın.
          </p>
        </div>

        {/* Weight Input Box */}
        <div className="flex items-center gap-3 font-mono bg-ink-2 p-2 pr-4 border border-line shrink-0">
          <div className="p-2 bg-ink border border-line">
            <Fingerprint className="text-violet h-4 w-4" />
          </div>
          <span className="label text-muted">REFERANS KÜTLE:</span>
          <div className="relative group">
            <input
              type="number"
              min="20"
              max="250"
              value={earthWeight}
              onChange={(e) => setEarthWeight(Math.max(1, Number(e.target.value)))}
              className="w-24 bg-ink border border-line px-3 py-1.5 text-center text-lg font-black text-paper focus:outline-none focus:border-violet transition-colors"
            />
            <span className="absolute right-2 top-2 text-xs text-violet font-bold">kg</span>
          </div>
        </div>
      </div>

      {/* Grid of Celestial Bodies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-line bg-line">
        {BODIES.map((body) => {
          const weightOnBody = (earthWeight * body.gravityRatio).toFixed(1);
          const jumpHeightCm = Math.round(50 * body.jumpMultiplier);
          const barWidth = Math.min(100, Math.max(5, (body.gravityRatio / 2.53) * 100));

          return (
            <div
              key={body.id}
              className="p-5 bg-ink-2 hover:bg-ink-3 transition-colors flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-ink border border-line flex items-center justify-center">
                    <PlanetGlyph planet={body.id} size={22} className="text-violet" />
                  </div>
                  <div>
                    <h4 className="display display-tight text-paper text-base font-bold">{body.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="label text-[10px] text-violet bg-ink px-1.5 py-0.5 border border-line">
                        {body.gravityRatio}G
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="display display-tight text-xl font-black text-paper">
                    {weightOnBody} <span className="label text-xs text-violet font-normal">kg</span>
                  </div>
                </div>
              </div>

              {/* Gravity Wave Bar */}
              <div className="h-1 w-full bg-ink border border-line">
                <div 
                  className="h-full bg-violet transition-all duration-700 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-ink border border-line">
                    <ArrowUp size={12} className="text-paper" />
                  </div>
                  <span className="label text-[10px] text-muted">Zıplama İrtifası</span>
                </div>
                <span className="label font-bold text-paper text-xs bg-ink px-2 py-0.5 border border-line">
                  {jumpHeightCm >= 100 ? `${(jumpHeightCm / 100).toFixed(1)} m` : `${jumpHeightCm} cm`}
                </span>
              </div>

              <p className="label text-muted leading-relaxed serif-i pt-1">
                {body.funFact}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
