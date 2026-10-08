'use client';

import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { PlanetGlyph } from '@/components/ui/CosmicGlyphs';
import { NumericInput } from '@/components/ui/NumericInput';

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
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Kütleçekim hesaplayıcı
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">Newton’un kütleçekim yasası</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">
            Kendi kütlenizle Güneş Sistemi&apos;nin farklı gök cisimlerinde ne kadar ağır geleceğinizi ve ne kadar yükseğe zıplayabileceğinizi hesaplayın.
          </p>
        </div>

        {/* Weight Input */}
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm text-paper/70">Referans kütle</span>
          <div className="flex items-center gap-2">
            <NumericInput
              aria-label="Dünyadaki kütlen (kg)"
              min={20}
              max={250}
              value={earthWeight}
              onValueChange={setEarthWeight}
              className="min-h-10 w-24 border border-line bg-ink-2 px-3 py-1.5 text-center font-mono text-lg font-semibold tabular-nums text-paper focus:outline-none focus:border-violet transition-colors"
            />
            <span className="font-mono text-sm text-paper/70">kg</span>
          </div>
        </div>
      </div>

      {/* Grid of Celestial Bodies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-3 lg:fill-row-3 gap-px border border-line bg-line">
        {BODIES.map((body) => {
          const weightOnBody = (earthWeight * body.gravityRatio).toFixed(1);
          const jumpHeightCm = Math.round(50 * body.jumpMultiplier);
          const barWidth = Math.min(100, Math.max(5, (body.gravityRatio / 2.53) * 100));

          return (
            <div
              key={body.id}
              className="flex min-w-0 flex-col space-y-4 bg-ink-2 p-5 transition-colors hover:bg-ink-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <PlanetGlyph planet={body.id} size={22} className="shrink-0 text-violet" />
                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-semibold leading-tight text-paper">{body.name}</h4>
                    <span className="mt-0.5 block font-mono text-xs tabular-nums text-paper/70">
                      {body.gravityRatio}G
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right font-mono text-xl font-semibold tabular-nums text-paper">
                  {weightOnBody} <span className="text-sm font-normal text-paper/70">kg</span>
                </div>
              </div>

              {/* Gravity Wave Bar */}
              <div className="h-1 w-full bg-paper/10">
                <div 
                  className="h-full bg-violet transition-all duration-700 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
                <div className="flex items-center gap-2">
                  <ArrowUp size={14} className="shrink-0 text-paper/70" />
                  <span className="text-sm text-paper/70">Zıplama irtifası</span>
                </div>
                <span className="font-mono text-sm font-medium tabular-nums text-paper">
                  {jumpHeightCm >= 100 ? `${(jumpHeightCm / 100).toFixed(1)} m` : `${jumpHeightCm} cm`}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-paper/80">
                {body.funFact}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
