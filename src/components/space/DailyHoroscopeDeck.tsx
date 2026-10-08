'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Briefcase,
  Zap,
  Calendar,
  AlertTriangle,
  Clock,
  Gem,
  Award
} from 'lucide-react';
import {
  ZodiacGlyph,
  PlanetGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph
} from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS, type ZodiacElement } from '@/data/zodiac';
import { useNow } from '@/lib/useNow';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';

type Category = 'genel' | 'ask' | 'kariyer' | 'tilsim';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'genel', label: 'Genel' },
  { id: 'ask', label: 'Aşk' },
  { id: 'kariyer', label: 'Kariyer ve para' },
  { id: 'tilsim', label: 'Tılsımlar' }
];

// Ortak görünüm sınıfları
const LABEL = 'text-sm text-paper/70';
const SUBHEAD = 'block text-sm font-semibold text-gold';
const BODY = 'text-sm leading-relaxed text-paper/85';
const LEAD = 'text-base leading-relaxed text-paper/85';
const TAB = 'min-h-9 cursor-pointer border px-3 text-sm transition-colors';
const TAB_ON = 'border-gold bg-gold font-medium text-ink';
const TAB_OFF = 'border-line text-paper/80 hover:border-paper/40 hover:text-paper';

export function DailyHoroscopeDeck() {
  const [selectedSignId, setSelectedSignId] = useState<string>('koc');
  const railRef = useRevealOnChange(selectedSignId);
  const [activeCategory, setActiveCategory] = useState<Category>('genel');

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Today's reading from the real sky; only known after mount so the static HTML never freezes a date
  const now = useNow(60_000);
  const reading = React.useMemo(() => (now ? dailyReading(selectedSign.id, now) : null), [now, selectedSign.id]);
  const dailyScores = reading?.scores ?? { love: 0, career: 0, vitality: 0, luck: 0 };
  const pending = 'Bugünün gökyüzü hesaplanıyor…';
  const today = now ? now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : '—';

  const elementGlyphMap: Record<ZodiacElement, React.ReactNode> = {
    Ateş: <FireElementGlyph size={14} className="text-gold" />,
    Toprak: <EarthElementGlyph size={14} className="text-lime" />,
    Hava: <AirElementGlyph size={14} className="text-cyan-400" />,
    Su: <WaterElementGlyph size={14} className="text-blue-400" />
  };

  const gauges = [
    { key: 'love', label: 'Aşk', note: 'Çekim ve duygusal uyum', value: dailyScores.love, Icon: Heart, icon: 'text-rose', bar: 'bg-rose' },
    { key: 'career', label: 'Kariyer ve para', note: 'Verimlilik ve fırsatlar', value: dailyScores.career, Icon: Briefcase, icon: 'text-gold', bar: 'bg-gold' },
    { key: 'vitality', label: 'Canlılık', note: 'Motivasyon ve dayanıklılık', value: dailyScores.vitality, Icon: Zap, icon: 'text-lime', bar: 'bg-lime' },
    { key: 'luck', label: 'Şans', note: 'Eşzamanlılık ve fırsatlar', value: dailyScores.luck, Icon: Sparkles, icon: 'text-gold', bar: 'bg-gold' }
  ];

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8" id="gunluk-burc-fali">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Günlük burç yorumu
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
            Burcunuzu seçerek bugünün aşk, kariyer, zihinsel odak ve gezegensel etkileşimlerini inceleyin.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm text-paper/70">
          <Calendar size={16} className="text-gold" />
          <span>Bugün: <strong className="font-medium text-paper">{today}</strong></span>
        </div>
      </div>

      {/* 12 Zodiac Sign Selector Carousel / Grid */}
      <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2" style={{ '--rail-w': '27%' } as React.CSSProperties}>
        {ZODIAC_SIGNS.map((sign) => {
          const isSelected = sign.id === selectedSign.id;
          return (
            <button
              key={sign.id}
              onClick={() => setSelectedSignId(sign.id)}
              className={`flex min-w-0 cursor-pointer flex-col items-center border px-2 py-2.5 text-center transition-colors ${
                isSelected
                  ? 'border-gold bg-gold text-ink'
                  : 'border-line bg-ink-2 text-paper/80 hover:border-paper/40 hover:text-paper'
              }`}
            >
              <ZodiacGlyph sign={sign.id} size={22} className={`mb-1.5 ${isSelected ? 'text-ink' : 'text-gold'}`} />
              <span className="text-sm font-semibold lg:text-xs">{sign.name}</span>
              <span className="mt-0.5 w-full truncate text-xs opacity-80">{sign.element}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sign */}
      <div className="space-y-8 border-t border-line pt-8">
        {/* Sign summary */}
        <div className="flex items-start gap-4 sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line sm:h-16 sm:w-16">
            <ZodiacGlyph sign={selectedSign.id} size={36} className="text-gold" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
              {selectedSign.name} burcu <span className="doc-serif text-lg text-gold/90 sm:text-xl">({selectedSign.latinName})</span>
            </h4>
            <p className="mt-1 text-sm text-paper/70">
              {selectedSign.dates} · {selectedSign.element} elementi · {selectedSign.modality} nitelik
            </p>
            <p className="mt-1 text-sm text-paper/70">
              Yönetici gezegen: <strong className="font-medium text-paper">{selectedSign.rulingPlanet}</strong> · Arketip: <strong className="font-medium text-paper">{selectedSign.traits.archetype}</strong>
            </p>
            <Link href={`/astroloji/gunluk-burc/${selectedSign.id}`} className="mt-1 inline-flex min-h-9 items-center text-sm font-medium text-gold hover:underline">
              {selectedSign.name} burcunun bugünkü tam yorumu →
            </Link>
          </div>
        </div>

        {/* Daily scores */}
        <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {gauges.map(({ key, label, note, value, Icon, icon, bar }) => (
            <div key={key} className="space-y-2 bg-ink p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 text-sm text-paper/85">
                  <Icon size={15} className={`shrink-0 ${icon}`} />
                  {label}
                </span>
                <span className="font-mono text-sm font-semibold text-paper">%{value}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden bg-paper/10">
                <div className={`h-full ${bar} transition-all duration-700`} style={{ width: `${value}%` }} />
              </div>
              <span className="block text-sm leading-snug text-paper/70">{note}</span>
            </div>
          ))}
        </div>

        {/* Today's sky behind the reading */}
        {reading && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="border border-line px-3 py-1.5 text-paper/80">Ay bugün <strong className="font-medium text-paper">{reading.moonIn}</strong></span>
              <span className="border border-line px-3 py-1.5 text-paper/80">Senin <strong className="font-medium text-paper">{reading.house}. evin</strong> · {reading.houseArea}</span>
              <span className="border border-line px-3 py-1.5 text-paper/80">{reading.phaseName}</span>
              <span className="border border-line px-3 py-1.5 text-paper/80">Günün yöneticisi: {reading.dayRuler}</span>
              {reading.mercuryRetro && <span className="border border-rose/50 bg-rose/10 px-3 py-1.5 text-rose">Merkür geri harekette</span>}
            </div>
            {reading.moonChange && <p className="text-sm leading-relaxed text-paper/70">{reading.moonChange}</p>}
          </div>
        )}

        {/* Dynamic Detail Panel */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Interpretation */}
          <div className="min-w-0 space-y-4 lg:col-span-8">
            <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`${TAB} ${activeCategory === c.id ? TAB_ON : TAB_OFF}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {activeCategory === 'genel' && (
              <div className="space-y-6 border border-line p-5 sm:p-6">
                <div>
                  <span className={SUBHEAD}>Günün akışı</span>
                  <p className={`mt-2 ${LEAD}`}>
                    {reading ? reading.energy : pending}
                  </p>
                </div>

                {reading && (
                  <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                    <div>
                      <span className={SUBHEAD}>Ay {reading.moonIn}: günün duygusal iklimi</span>
                      <p className={`mt-2 ${BODY}`}>{reading.moonMood}</p>
                      <p className="mt-2 text-sm leading-relaxed text-paper/80">{reading.moonFocus}</p>
                    </div>
                    <div>
                      <span className={SUBHEAD}>Sağlık ve enerji</span>
                      <p className={`mt-2 ${BODY}`}>{reading.wellbeing}</p>
                      <span className={`mt-4 ${SUBHEAD}`}>Sosyal hayat</span>
                      <p className={`mt-2 ${BODY}`}>{reading.social}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 border-t border-line pt-6">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <span className={SUBHEAD}>Günün tavsiyesi</span>
                    <p className={`mt-1 ${BODY}`}>
                      {reading ? reading.tip : pending}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'ask' && (
              <div className="space-y-3 border border-line p-5 sm:p-6">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-rose">
                  <Heart size={15} />
                  Aşk yorumu
                </span>
                <p className={LEAD}>
                  {reading ? reading.love : pending}
                </p>
                <p className="border-t border-line pt-3 text-sm text-paper/80">
                  <strong className="font-medium text-paper">En uyumlu burçlar:</strong> {selectedSign.loveCompatibility.map((id) => {
                    const compSign = ZODIAC_SIGNS.find((s) => s.id === id);
                    return compSign ? compSign.name : id;
                  }).join(', ')} burçlarıyla derin uyum.
                </p>
              </div>
            )}

            {activeCategory === 'kariyer' && (
              <div className="space-y-3 border border-line p-5 sm:p-6">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gold">
                  <Briefcase size={15} />
                  Kariyer ve para
                </span>
                <p className={LEAD}>
                  {reading ? reading.career : pending}
                </p>
                <div className="flex items-start gap-2 border-t border-line pt-3 text-sm text-paper/80">
                  <Clock size={15} className="mt-0.5 shrink-0 text-gold" />
                  <span>En verimli saatler: <strong className="font-medium tabular-nums text-paper">{reading ? reading.luckyHours : '—'}</strong></span>
                </div>
              </div>
            )}

            {activeCategory === 'tilsim' && (
              <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
                <div className="space-y-1 bg-ink p-4">
                  <span className={`block ${LABEL}`}>Uğurlu taş</span>
                  <div className="flex items-center gap-2">
                    <Gem size={15} className="shrink-0 text-lime" />
                    <span className="text-base font-semibold text-paper">{selectedSign.details.stone}</span>
                  </div>
                  <span className={`block ${LABEL}`}>Toprak ve beden rezonansını güçlendirir.</span>
                </div>

                <div className="space-y-1 bg-ink p-4">
                  <span className={`block ${LABEL}`}>Uğurlu sayılar</span>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="shrink-0 text-gold" />
                    <span className="font-mono text-base font-semibold text-paper">
                      {selectedSign.details.luckyNumbers.join(', ')}
                    </span>
                  </div>
                  <span className={`block ${LABEL}`}>Kozmik numerolojik uyum frekansları.</span>
                </div>

                <div className="space-y-1 bg-ink p-4">
                  <span className={`block ${LABEL}`}>Uğurlu renkler</span>
                  <span className="block text-base font-semibold text-paper">
                    {selectedSign.details.colors.join(', ')}
                  </span>
                  <span className={`block ${LABEL}`}>Aura katmanını besleyen tonlar.</span>
                </div>

                <div className="space-y-1 bg-ink p-4">
                  <span className={`block ${LABEL}`}>Motto ve olumlama</span>
                  <span className="block font-serif text-lg italic leading-snug text-paper/90">
                    &quot;{selectedSign.traits.motto}&quot;
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sign profile */}
          <div className="space-y-4 border border-line p-5 text-sm lg:col-span-4">
            <span className="block font-semibold text-paper">Burç kimliği</span>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-paper/70">Element</span>
                <span className="flex items-center gap-1.5 font-medium text-paper">
                  {elementGlyphMap[selectedSign.element]}
                  {selectedSign.element}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-paper/70">Nitelik</span>
                <span className="font-medium text-paper">{selectedSign.modality}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-paper/70">Yönetici gezegen</span>
                <span className="flex items-center gap-1.5 text-right font-medium text-paper">
                  <PlanetGlyph planet={selectedSign.rulingPlanetId} size={14} className="shrink-0 text-gold" />
                  {selectedSign.rulingPlanet}
                </span>
              </div>

              <div className="border-t border-line pt-3">
                <span className="mb-2 block text-paper/70">Güçlü yönler</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSign.traits.strengths.slice(0, 3).map((st) => (
                    <span key={st} className="bg-lime/10 px-2 py-1 text-xs text-lime">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-line pt-3">
                <span className="mb-2 block text-paper/70">Gölge yönler</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSign.traits.shadows.slice(0, 2).map((sh) => (
                    <span key={sh} className="bg-rose/10 px-2 py-1 text-xs text-rose">
                      {sh}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
