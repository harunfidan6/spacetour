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
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık ve şu an retroda olan gezegen sayısı */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <h3 className="min-w-0 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
          Gezegen retroları ve gölge dönemleri{' '}
          <span className="whitespace-nowrap font-mono text-sm font-normal text-paper/70">({years})</span>
        </h3>

        <div className="flex shrink-0 items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${isMounted && activeRetros.length > 0 ? 'bg-rose-signal' : 'bg-lime'}`}
          />
          <div>
            <div className="text-xs text-paper/70">Şu an aktif retrolar</div>
            <div className="text-sm font-semibold text-paper">
              {isMounted ? (
                <>
                  <span className="font-mono">{activeRetros.length}</span> gezegen retro harekette
                </>
              ) : (
                'Hesaplanıyor…'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Retro seçimi */}
      <div ref={railRef} className="choice-rail grid gap-px border border-line bg-line sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-3 lg:fill-row-3" style={{ '--rail-w': '78%' } as React.CSSProperties}>
        {calendar.map((retro) => {
          const isSelected = selectedRetro.id === retro.id;
          return (
            <button
              key={retro.id}
              type="button"
              onClick={() => setSelectedRetroId(retro.id)}
              className={`flex cursor-pointer flex-col justify-between gap-3 p-4 text-left transition-colors ${
                isSelected
                  ? 'bg-ink-2 border-l-4 border-l-rose-signal'
                  : 'bg-ink hover:bg-ink-2'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <PlanetGlyph planet={retro.planetGlyphKey} size={20} className="shrink-0 text-gold" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-sm font-semibold leading-snug text-paper">
                      <span>{retro.planet}</span>
                      <RetrogradeGlyph size={12} className="shrink-0 text-rose-signal" />
                    </div>
                    <div className="font-mono text-xs text-paper/70">{retro.signRange}</div>
                  </div>
                </div>

                {isMounted ? (
                  retro.isCurrentlyRetrograde ? (
                    <span className="shrink-0 bg-rose-signal/15 px-2 py-0.5 text-xs font-semibold text-rose-signal">
                      Aktif
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 text-xs text-paper/70">
                      Planlı
                    </span>
                  )
                ) : (
                  <span className="shrink-0 text-xs text-paper/70">—</span>
                )}
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-paper/70">
                <span>{retro.startDate}</span>
                <span aria-hidden="true">→</span>
                <span>{retro.endDate}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Seçili retronun ayrıntıları */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <PlanetGlyph planet={selectedRetro.planetGlyphKey} size={30} className="mt-0.5 shrink-0 text-gold" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                  {selectedRetro.planet}
                </h4>
                <RetrogradeGlyph size={20} className="shrink-0 text-rose-signal" />
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/70">
                <span>
                  Zodyak aralığı: <span className="whitespace-nowrap font-mono text-paper/85">{selectedRetro.signRange}</span>
                </span>
                <span>
                  İstasyon derecesi: <span className="whitespace-nowrap font-mono text-paper/85">{selectedRetro.stationDegrees}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRetro.coreThemes.map((theme, i) => (
              <span key={i} className="border border-line px-2.5 py-1 text-sm text-paper/80">
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Gölge dönemleri ve istasyon tarihleri */}
        <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {[
            { label: 'Ön gölge (pre-shadow)', value: selectedRetro.preShadowStart, desc: 'İlk sinyallerin belirdiği tarih' },
            { label: 'Retro başlangıcı (Rx station)', value: selectedRetro.startDate, desc: 'Gezegenin geri harekete başladığı an' },
            { label: 'Direkt dönüş (direct station)', value: selectedRetro.endDate, desc: 'İleri seyrin yeniden başladığı gün' },
            { label: 'Gölge çıkışı (post-shadow)', value: selectedRetro.postShadowEnd, desc: 'Konuların tamamen netleştiği kapanış' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1 bg-ink-2 p-3 sm:p-4">
              <dt className="text-sm leading-snug text-paper/70">{item.label}</dt>
              <dd className="font-mono text-base font-semibold text-paper">{item.value}</dd>
              <div className="text-sm leading-snug text-paper/80">{item.desc}</div>
            </div>
          ))}
        </dl>

        {/* Yapılacaklar ve kaçınılacaklar */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0 text-lime" />
              <span className="text-base font-semibold text-paper">Bu dönemde önerilenler</span>
            </div>
            <ul className="space-y-2.5">
              {selectedRetro.guidance.whatToDo.map((todo, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-base leading-relaxed text-paper/85">
                  <span className="shrink-0 font-bold text-lime">+</span>
                  <span>{todo}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle size={18} className="shrink-0 text-rose-signal" />
              <span className="text-base font-semibold text-paper">Kaçınılması gerekenler</span>
            </div>
            <ul className="space-y-2.5">
              {selectedRetro.guidance.whatToAvoid.map((avoid, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-base leading-relaxed text-paper/85">
                  <span className="shrink-0 font-bold text-rose-signal">−</span>
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

        {/* Dönemin dersi */}
        <div className="border-l-2 border-gold py-1 pl-4">
          <span className="text-sm text-paper/70">Dönemin dersi</span>
          <p className="doc-serif mt-1 text-lg leading-snug text-paper sm:text-xl">
            “{selectedRetro.guidance.cosmicLesson}”
          </p>
        </div>
      </div>
      <nav aria-label="Yıllık retro takvimleri" className="flex flex-wrap gap-2 border-t border-line pt-6 text-sm">
        {[['merkur', 'Merkür'], ['venus', 'Venüs'], ['mars', 'Mars'], ['jupiter', 'Jüpiter'], ['saturn', 'Satürn']].flatMap(([slug, name]) =>
          ['2026', '2027'].map((y) => (
            <Link key={`${slug}-${y}`} href={`/astroloji/retrolar/${slug}-${y}`} className="inline-flex min-h-9 items-center border border-line px-3 py-1.5 text-paper/80 hover:border-gold hover:text-gold">{name} retrosu {y}</Link>
          ))
        )}
      </nav>
    </div>
  );
}
