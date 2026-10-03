'use client';

import React, { useState, useMemo } from 'react';
import {
  PLANETARY_RETROGRADES,
  RetrogradeCycle,
  getActiveRetrogrades
} from '@/data/retrogrades';
import {
  RetrogradeGlyph,
  PlanetGlyph
} from '@/components/ui/CosmicGlyphs';
import { Ticks } from '@/components/motion/primitives';
import { CheckCircle2, XCircle } from 'lucide-react';

export function CosmicRetrogradeRadar() {
  const [selectedRetroId, setSelectedRetroId] = useState<string>(PLANETARY_RETROGRADES[2].id); // Mercury Autumn 2026 default

  const activeRetros = useMemo(() => {
    return getActiveRetrogrades(new Date());
  }, []);

  const selectedRetro: RetrogradeCycle = useMemo(() => {
    return (
      PLANETARY_RETROGRADES.find((r) => r.id === selectedRetroId) ||
      PLANETARY_RETROGRADES[0]
    );
  }, [selectedRetroId]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-10">
      <Ticks />

      {/* Header & Live Retrograde Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <RetrogradeGlyph size={18} className="text-rose-signal animate-pulse" />
            <span className="label text-rose-signal">KOZMİK İSTASYON & RETROGRAD RADARI</span>
          </div>
          <h3 className="display display-tight text-3xl sm:text-4xl text-paper mt-1">
            Gezegen Retroları & Gölge Fazları (2026 – 2027)
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-line bg-ink-2 px-4 py-2 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-signal" />
            </span>
            <div>
              <div className="label text-muted text-[9px] uppercase">GÜNCEL AKTİF RETROLAR</div>
              <div className="text-xs font-bold text-paper">
                {activeRetros.length} Gezegen Retro Harekette
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retrograde List Grid Selector */}
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {PLANETARY_RETROGRADES.map((retro) => {
          const isSelected = selectedRetro.id === retro.id;
          return (
            <button
              key={retro.id}
              type="button"
              onClick={() => setSelectedRetroId(retro.id)}
              className={`p-5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-ink-2 border-l-4 border-l-rose-signal'
                  : 'bg-ink hover:bg-ink-2 text-paper/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center h-8 w-8 rounded-full border border-line bg-ink">
                    <PlanetGlyph planet={retro.planetGlyphKey} size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-paper flex items-center gap-1.5">
                      <span>{retro.planet}</span>
                      <RetrogradeGlyph size={12} className="text-rose-signal" />
                    </div>
                    <div className="label text-muted text-[10px]">{retro.signRange}</div>
                  </div>
                </div>

                {retro.isCurrentlyRetrograde ? (
                  <span className="label px-2 py-0.5 border border-rose-signal/50 bg-rose-signal/15 text-rose-signal text-[9px] font-bold">
                    AKTİF
                  </span>
                ) : (
                  <span className="label px-2 py-0.5 border border-line bg-ink text-muted text-[9px]">
                    PLANLI
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-muted">
                <span>{retro.startDate}</span>
                <span className="text-paper/60">→</span>
                <span>{retro.endDate}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Retrograde Detailed Dossier */}
      <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-8">
        {/* Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center h-14 w-14 border border-line bg-ink rounded-full">
              <PlanetGlyph planet={selectedRetro.planetGlyphKey} size={32} className="text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="display display-tight text-2xl sm:text-3xl text-paper">
                  {selectedRetro.planet}
                </h4>
                <RetrogradeGlyph size={22} className="text-rose-signal" />
              </div>
              <div className="label text-muted text-xs mt-1">
                Zodyak Aralığı: {selectedRetro.signRange} · İstasyon Derecesi: {selectedRetro.stationDegrees}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRetro.coreThemes.map((theme, i) => (
              <span key={i} className="label px-3 py-1 rounded-full border border-line bg-ink text-paper/85 text-[10px]">
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Shadow Periods & Dates Timeline */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-line bg-line">
          {[
            { label: 'Ön Gölge (Pre-Shadow)', value: selectedRetro.preShadowStart, desc: 'İlk sinyallerin belirdiği tarih' },
            { label: 'Retro Başlangıcı (Rx Station)', value: selectedRetro.startDate, desc: 'Gezegenin geri harekete başladığı an' },
            { label: 'Direkt Dönüş (Direct Station)', value: selectedRetro.endDate, desc: 'İleri seyrin yeniden başladığı gün' },
            { label: 'Gölge Çıkışı (Post-Shadow)', value: selectedRetro.postShadowEnd, desc: 'Konuların tamamen netleştiği kapanış' }
          ].map((item, idx) => (
            <div key={idx} className="bg-ink p-4 space-y-1">
              <dt className="label text-muted text-[10px]">{item.label}</dt>
              <dd className="text-sm font-bold text-paper font-mono">{item.value}</dd>
              <div className="text-[10px] text-muted leading-tight">{item.desc}</div>
            </div>
          ))}
        </dl>

        {/* Guidance: What to do vs What to avoid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Green / What to do */}
          <div className="border border-line bg-ink p-6 space-y-4">
            <div className="flex items-center gap-2 text-lime">
              <CheckCircle2 size={18} />
              <span className="label text-lime">BU DÖNEMDE YAPILMASI TAVSİYE EDİLENLER</span>
            </div>
            <ul className="space-y-3">
              {selectedRetro.guidance.whatToDo.map((todo, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-paper/85 leading-relaxed">
                  <span className="text-lime font-bold shrink-0 mt-0.5">+</span>
                  <span>{todo}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red / What to avoid */}
          <div className="border border-rose-signal/30 bg-rose-signal/5 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-signal">
              <XCircle size={18} />
              <span className="label text-rose-signal">KESİNLİKLE KAÇINILMASI GEREKENLER</span>
            </div>
            <ul className="space-y-3">
              {selectedRetro.guidance.whatToAvoid.map((avoid, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-paper/85 leading-relaxed">
                  <span className="text-rose-signal font-bold shrink-0 mt-0.5">−</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cosmic Lesson Quote */}
        <div className="border-l-2 border-gold pl-5 py-2 bg-ink/60">
          <span className="label text-gold text-[10px]">KOZMİK ŞİFA DERSİ</span>
          <p className="serif-i text-lg sm:text-xl text-paper mt-1">
            “{selectedRetro.guidance.cosmicLesson}”
          </p>
        </div>
      </div>
    </div>
  );
}
