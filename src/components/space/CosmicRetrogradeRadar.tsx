'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { RetrogradeCycle } from '@/data/retrogrades';
import { retrogradeCalendar } from '@/lib/astrology/retrogradeCalendar';
import {
  RetrogradeGlyph,
  PlanetGlyph
} from '@/components/ui/CosmicGlyphs';
import { useNow } from '@/lib/useNow';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import { SignHouseInsight } from '@/components/astrology/SignHouseInsight';
import { SIGN_NAMES } from '@/lib/astrology/dailySky';

// What each retrograde stirs up (accusative, for "… hayatının … alanında gündeme getirir")
const RETRO_THEME: Record<string, string> = {
  merkur: 'yanlış anlaşılmaları, gecikmeleri ve yarım kalan planları yeniden gözden geçirmeyi',
  venus: 'eski ilişkileri, değerlerini ve para alışkanlıklarını sorgulamayı',
  mars: 'motivasyonunu, öfkeni ve yarım kalan işleri yeniden ele almayı',
  jupiter: 'inançlarını, hedeflerini ve büyüme planlarını içe dönerek tartmayı',
  saturn: 'sorumluluklarını, sınırlarını ve uzun vadeli yapılarını sağlamlaştırmayı',
  pluto: 'derin dönüşümleri, güç ilişkilerini ve bırakman gerekenleri',
};
import { CheckCircle2, XCircle } from 'lucide-react';

const FIRST_FRAME = new Date('2026-10-01T09:00:00Z');

export function CosmicRetrogradeRadar() {
  const now = useNow(60 * 60_000);
  const isMounted = now !== null;
  // Computed from the ephemeris around today; the prerendered frame uses a fixed instant
  const calendar = useMemo(() => retrogradeCalendar(now ?? FIRST_FRAME), [now]);
  const activeRetros = useMemo(() => (now ? calendar.filter((r) => r.isCurrentlyRetrograde) : []), [now, calendar]);
  const [pickedId, setSelectedRetroId] = useState<string | null>(null);

  // Default: a retrograde under way, otherwise the next one
  const selectedRetro: RetrogradeCycle = useMemo(() => {
    const today = (now ?? FIRST_FRAME).toISOString().slice(0, 10);
    return (
      calendar.find((r) => r.id === pickedId) ??
      calendar.find((r) => r.isCurrentlyRetrograde && r.planetGlyphKey !== 'pluto') ??
      calendar.find((r) => r.startDate >= today) ??
      calendar[0]
    );
  }, [calendar, pickedId, now]);
  const railRef = useRevealOnChange(selectedRetro.id);
  const years = `${calendar[0]?.startDate.slice(0, 4)} – ${calendar[calendar.length - 1]?.endDate.slice(0, 4)}`;

  return (
    <div className="relative border border-line bg-ink p-6 sm:p-10 space-y-10">
      {/* Header & Live Retrograde Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="doc-kicker text-rose-signal">Gezegen Hareketleri · Efemeris</span>
          <h3 className="doc-title text-2xl sm:text-3xl text-paper mt-1">
            Gezegen Retroları <span className="doc-serif text-gold">& Gölge Fazları</span> <span className="font-mono text-muted text-sm font-normal">({years})</span>
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-line bg-ink-2 px-4 py-2 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isMounted && activeRetros.length > 0 ? 'bg-rose-signal opacity-75' : 'bg-lime opacity-75'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isMounted && activeRetros.length > 0 ? 'bg-rose-signal' : 'bg-lime'}`} />
            </span>
            <div>
              <div className="font-mono text-muted text-[10px] uppercase">GÜNCEL AKTİF RETROLAR</div>
              <div className="text-xs font-bold text-paper font-mono">
                {isMounted ? `${activeRetros.length} Gezegen Retro Harekette` : 'Hesaplanıyor…'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retrograde List Grid Selector */}
      <div ref={railRef} className="choice-rail grid gap-px border border-line bg-line sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-3 lg:fill-row-3" style={{ '--rail-w': '78%' } as React.CSSProperties}>
        {calendar.map((retro) => {
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
                    <div className="font-mono text-muted text-[10px]">{retro.signRange}</div>
                  </div>
                </div>

                {isMounted ? (
                  retro.isCurrentlyRetrograde ? (
                    <span className="px-2 py-0.5 border border-rose-signal/50 bg-rose-signal/15 text-rose-signal text-[10px] font-bold font-mono">
                      AKTİF
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 border border-line bg-ink text-muted text-[10px] font-mono">
                      PLANLI
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-mono text-muted">—</span>
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
                <h4 className="doc-title text-2xl sm:text-3xl text-paper">
                  {selectedRetro.planet}
                </h4>
                <RetrogradeGlyph size={22} className="text-rose-signal" />
              </div>
              <div className="font-mono text-muted text-xs mt-1">
                Zodyak Aralığı: {selectedRetro.signRange} · İstasyon Derecesi: {selectedRetro.stationDegrees}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRetro.coreThemes.map((theme, i) => (
              <span key={i} className="px-3 py-1 rounded-full border border-line bg-ink text-paper/85 font-mono text-[10px]">
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
              <dt className="doc-caption text-muted text-[10px] font-mono">{item.label}</dt>
              <dd className="text-sm font-bold text-paper font-mono">{item.value}</dd>
              <div className="text-[10px] text-muted leading-tight font-mono">{item.desc}</div>
            </div>
          ))}
        </dl>

        {/* Guidance: What to do vs What to avoid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Green / What to do */}
          <div className="border border-line bg-ink p-6 space-y-4">
            <div className="flex items-center gap-2 text-lime">
              <CheckCircle2 size={18} />
              <span className="doc-caption text-lime font-bold">BU DÖNEMDE YAPILMASI TAVSİYE EDİLENLER</span>
            </div>
            <ul className="space-y-3 font-mono">
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
              <span className="doc-caption text-rose-signal font-bold">KESİNLİKLE KAÇINILMASI GEREKENLER</span>
            </div>
            <ul className="space-y-3 font-mono">
              {selectedRetro.guidance.whatToAvoid.map((avoid, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-paper/85 leading-relaxed">
                  <span className="text-rose-signal font-bold shrink-0 mt-0.5">−</span>
                  <span>{avoid}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What it means for the visitor's sign */}
        {SIGN_NAMES.indexOf(selectedRetro.signRange.split(' ')[0]) >= 0 && (
          <SignHouseInsight
            key={selectedRetro.id}
            targetSign={SIGN_NAMES.indexOf(selectedRetro.signRange.split(' ')[0])}
            subject={selectedRetro.planet.split(' (')[0]}
            theme={RETRO_THEME[selectedRetro.planetGlyphKey] ?? 'yeniden değerlendirmeyi'}
          />
        )}

        {/* Cosmic Lesson Quote */}
        <div className="border-l-2 border-gold pl-5 py-2 bg-ink/60">
          <span className="doc-caption text-gold text-[10px] uppercase font-mono">Kozmik Öğreti</span>
          <p className="doc-serif text-lg sm:text-xl text-paper mt-1">
            “{selectedRetro.guidance.cosmicLesson}”
          </p>
        </div>
      </div>
      <nav aria-label="Yıllık retro takvimleri" className="flex flex-wrap gap-2 border-t border-line pt-6 font-mono text-xs">
        {[['merkur', 'Merkür'], ['venus', 'Venüs'], ['mars', 'Mars'], ['jupiter', 'Jüpiter'], ['saturn', 'Satürn']].flatMap(([slug, name]) =>
          ['2026', '2027'].map((y) => (
            <Link key={`${slug}-${y}`} href={`/astroloji/retrolar/${slug}-${y}`} className="border border-line px-3 py-2 text-paper/80 hover:border-gold hover:text-gold">{name} retrosu {y}</Link>
          ))
        )}
      </nav>
    </div>
  );
}
