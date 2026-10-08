'use client';

import React, { useMemo, useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Calendar,
  Hourglass,
  Heart,
  Briefcase
} from 'lucide-react';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { useNow } from '@/lib/useNow';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';
import { getMoonPhase, isRetrograde, type MoonPhaseKey } from '@/lib/astrophysics/skyDomeEphemeris';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import {
  VectorMoonPhase,
  ZodiacGlyph,
  PlanetGlyph
} from '@/components/ui/CosmicGlyphs';

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

// Traditional Chaldean Planetary Ruler of Day
const PLANETARY_RULERS_OF_DAY: Record<number, { planet: string; planetId: string; focus: string; color: string }> = {
  0: { planet: 'Güneş (Sol)', planetId: 'sun', focus: 'Yaratıcılık, Liderlik & Özgüven', color: 'text-gold' },
  1: { planet: 'Ay (Luna)', planetId: 'moon', focus: 'Sezgiler, Ev & Duygusal Denge', color: 'text-violet' },
  2: { planet: 'Mars (Ares)', planetId: 'mars', focus: 'Eylem, Cesaret, Spor & Girişimcilik', color: 'text-rose-signal' },
  3: { planet: 'Merkür (Hermes)', planetId: 'mercury', focus: 'İletişim, Sözleşmeler, Zihin & Ticaret', color: 'text-primary' },
  4: { planet: 'Jüpiter (Zeus)', planetId: 'jupiter', focus: 'Bolluk, Felsefe, Şans & Genişleme', color: 'text-lime' },
  5: { planet: 'Venüs (Afrodit)', planetId: 'venus', focus: 'Aşk, Sanat, Uyum, Sosyalleşme & Estetik', color: 'text-pink-400' },
  6: { planet: 'Satürn (Kronos)', planetId: 'saturn', focus: 'Disiplin, Sorumluluk, Sabır & Planlama', color: 'text-indigo-400' }
};

const MOON_PHASE_THEMES: Record<MoonPhaseKey, string> = {
  new: 'Yeni niyetler ve başlangıçlar ekme vakti.',
  'waxing-crescent': 'Fikirlerin filizlenmesi, motivasyon artışı.',
  'first-quarter': 'Kararlılık, engelleri aşma ve harekete geçiş.',
  'waxing-gibbous': 'Olgunlaşma, detayları tamamlama ve odak.',
  full: 'Aydınlanma, hasat, duygusal zirve ve netlik.',
  'waning-gibbous': 'Bilgeliği paylaşma, şükran duyma.',
  'last-quarter': 'Bırakma, affetme, yüklerden arınma.',
  'waning-crescent': 'İçsel dinlenme, arınma ve meditasyon.'
};

export function DailyCosmicTransitWidget() {
  const [selectedSignId, setSelectedSignId] = useState<string>('koc');
  const railRef = useRevealOnChange(selectedSignId);

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Real sky state; only known after mount so the static HTML never carries a stale date
  const now = useNow(60_000);
  const sky = useMemo(() => {
    if (!now) return null;
    return {
      dateFormatted: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }),
      dayName: DAY_NAMES[now.getDay()],
      dayRuler: PLANETARY_RULERS_OF_DAY[now.getDay()],
      moon: getMoonPhase(now),
      mercuryRetro: isRetrograde('mercury', now)
    };
  }, [now]);

  const reading = useMemo(() => (now ? dailyReading(selectedSign.id, now) : null), [now, selectedSign.id]);
  const pending = 'Bugünün gökyüzü hesaplanıyor…';
  const dateFormatted = sky?.dateFormatted ?? '—';
  const dayName = sky?.dayName ?? '';
  const dayRuler = sky?.dayRuler ?? PLANETARY_RULERS_OF_DAY[0];
  const moonPhaseName = sky?.moon.name ?? 'Ay fazı hesaplanıyor';
  const moonPhaseDesc = sky ? MOON_PHASE_THEMES[sky.moon.key] : '';
  const illuminationPct = sky ? Math.round(sky.moon.illumination * 100) : 0;
  const isMercuryRetro = sky?.mercuryRetro ?? false;

  return (
    <div id="gunluk-transitler" className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Günün gezegen hareketleri ve burç yorumları
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/80 sm:text-base">
            Gökyüzündeki güncel Ay fazı, gezegen yöneticisi ve 12 burç için günlük arketip rehberi.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm text-paper/80">
          <Calendar size={16} className="text-gold" />
          <span>{dateFormatted}{dayName && `, ${dayName}`}</span>
        </div>
      </div>

      {/* Gökyüzü durumu: Ay fazı, günün yöneticisi, Merkür */}
      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
        <div className="space-y-2 bg-ink-2 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-paper/70">Ay fazı</span>
            <VectorMoonPhase illumination={illuminationPct} waning={sky ? !sky.moon.waxing : false} size={28} className="shrink-0 text-paper" />
          </div>
          <div className="text-lg font-semibold leading-snug text-paper">
            {moonPhaseName}
            {sky && (
              <span className="font-normal text-paper/70">
                {' '}(%{illuminationPct} aydınlık)
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-paper/80">{moonPhaseDesc}</p>
        </div>

        <div className="space-y-2 bg-ink-2 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-paper/70">Günün yönetici gezegeni</span>
            <PlanetGlyph planet={dayRuler.planetId} size={22} className={`shrink-0 ${dayRuler.color}`} />
          </div>
          <div className="text-lg font-semibold leading-snug text-paper">{dayRuler.planet}</div>
          <p className="text-sm leading-relaxed text-paper/80">
            Bugün <strong className="font-medium text-paper">{dayRuler.focus}</strong> temaları kozmik olarak destekleniyor.
          </p>
        </div>

        <div className="space-y-2 bg-ink-2 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-paper/70">Merkür&apos;ün hareketi</span>
            <PlanetGlyph planet="mercury" size={20} className="shrink-0 text-gold" />
          </div>
          <div className="flex items-center gap-2 text-lg font-semibold leading-snug text-paper">
            {isMercuryRetro ? <Hourglass className="shrink-0 text-gold" size={18} /> : <ShieldCheck className="shrink-0 text-lime" size={18} />}
            <span>{!sky ? 'Hesaplanıyor' : isMercuryRetro ? 'Retrograd (geri hareket)' : 'Düz harekette'}</span>
          </div>
          <p className="text-sm leading-relaxed text-paper/80">
            {isMercuryRetro
              ? 'Gökyüzünde geri gidiyor gibi görünüyor: sözleşmeleri, yazışmaları ve teknik planları bir kez daha gözden geçir.'
              : 'Zihinsel netlik, yeni kontratlar, teknolojik hamleler ve açık iletişim için elverişli akış.'}
          </p>
        </div>
      </div>

      {/* Burç seçimi ve günlük yorum */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-base font-semibold text-paper">Burcunuzu seçin</h3>
          <span className="text-sm text-paper/70">
            Seçili: <strong className="font-medium text-paper">{selectedSign.name}</strong>
          </span>
        </div>

        <div ref={railRef} className="choice-rail grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-px border border-line bg-line" style={{ '--rail-w': '27%' } as React.CSSProperties}>
          {ZODIAC_SIGNS.map((s) => {
            const isSelected = s.id === selectedSignId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSignId(s.id)}
                className={`flex min-w-0 cursor-pointer flex-col items-center justify-center px-2 py-3 transition-colors ${
                  isSelected
                    ? 'bg-gold text-ink'
                    : 'bg-ink-2 text-paper/80 hover:bg-ink-3 hover:text-paper'
                }`}
              >
                <ZodiacGlyph
                  sign={s.id}
                  size={20}
                  className={`mb-1.5 ${isSelected ? 'text-ink' : 'text-paper/70'}`}
                />
                <span className="text-sm font-semibold lg:text-xs">{s.name}</span>
                <span className="mt-0.5 text-xs opacity-80">{s.element}</span>
              </button>
            );
          })}
        </div>

        {/* Seçili burcun günlük yorumu */}
        <div className="border border-line bg-ink-2 p-4 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-4 sm:items-center">
              <ZodiacGlyph sign={selectedSign.id} size={44} className="shrink-0 text-gold" />
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                  {selectedSign.name} burcu günlük yorumu
                </h3>
                <p className="mt-1 text-sm text-paper/70">
                  {selectedSign.dates} · Element: {selectedSign.element} ({selectedSign.modality}) · Yönetici: {selectedSign.rulingPlanet}
                </p>
                {reading && (
                  <p className="mt-1 text-sm text-paper/70">
                    Ay bugün {reading.moonIn} · {reading.house}. ev: {reading.houseArea}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-2.5 md:max-w-xs">
              <Hourglass size={16} className="mt-0.5 shrink-0 text-gold" />
              <div className="min-w-0">
                <span className="block text-sm text-paper/70">Günün şanslı saatleri</span>
                <span className="text-sm font-medium tabular-nums text-paper">{reading ? reading.luckyHours : '—'}</span>
              </div>
            </div>
          </div>

          {/* Enerji, aşk, kariyer */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                <Zap size={16} className="shrink-0 text-gold" />
                <span>Enerji ve odak</span>
              </div>
              <p className="text-base leading-relaxed text-paper/85">
                {reading ? reading.energy : pending}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                <Heart size={16} className="shrink-0 text-rose-signal" />
                <span>Aşk ve ilişkiler</span>
              </div>
              <p className="text-base leading-relaxed text-paper/85">
                {reading ? reading.love : pending}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                <Briefcase size={16} className="shrink-0 text-paper/80" />
                <span>Kariyer ve maddiyat</span>
              </div>
              <p className="text-base leading-relaxed text-paper/85">
                {reading ? reading.career : pending}
              </p>
            </div>
          </div>

          {reading && (
            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-3">
              <div>
                <span className="text-sm text-paper/70">Ay {reading.moonIn}</span>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{reading.moonMood}</p>
                <p className="mt-1 text-sm leading-relaxed text-paper/80">{reading.moonFocus}</p>
              </div>
              <div>
                <span className="text-sm text-paper/70">Sağlık ve enerji</span>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{reading.wellbeing}</p>
              </div>
              <div>
                <span className="text-sm text-paper/70">Sosyal hayat</span>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{reading.social}</p>
              </div>
            </div>
          )}
          {reading?.moonChange && <p className="mt-4 text-sm leading-relaxed text-paper/80">{reading.moonChange}</p>}

          {/* Rehber not ve motto */}
          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <p className="text-sm leading-relaxed text-paper/85">
              <span className="font-semibold text-gold">Rehber not:</span> {reading ? reading.tip : pending}
            </p>
            <p className="text-sm italic leading-relaxed text-paper/70 sm:max-w-xs sm:shrink-0 sm:text-right">
              Motto: &quot;{selectedSign.traits.motto}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
