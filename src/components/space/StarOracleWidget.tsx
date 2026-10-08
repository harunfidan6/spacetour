'use client';

import React, { useMemo, useState } from 'react';
import { useNow } from '@/lib/useNow';
import {
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
} from 'lucide-react';
import {
  PlanetGlyph,
} from '@/components/ui/CosmicGlyphs';
import {
  FIXED_STARS_CATALOG,
  PLANETARY_HOUR_DETAILS,
} from '@/data/fixedStars';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import {
  planetaryHours,
  longitude,
  signIndex,
  SIGN_NAMES,
  BODY_NAMES,
  type PlanetaryHourSlot,
} from '@/lib/astrology/dailySky';
import { birthInstant } from '@/lib/astrology/natal';
import { nearestStar, starGap, TRADITIONAL_RULER, formatDegrees } from '@/lib/astrology/fixedStarSky';
import { NumericInput } from '@/components/ui/NumericInput';
import { daysInMonth } from '@/data/zodiac';

const wrap180 = (d: number) => ((d + 540) % 360) - 180;
const FIELD = 'w-full min-h-10 bg-ink-2 border border-line px-3 py-2 font-mono text-base text-paper focus:border-gold focus:outline-none';

// Ortak görünüm sınıfları
const SECTION_TITLE = 'font-display text-lg font-semibold leading-snug text-paper';
const LABEL = 'block text-xs text-paper/70';
const slotClass = (isSelected: boolean, isCurrent: boolean) =>
  `relative flex min-h-14 flex-col items-center justify-center border px-1.5 py-1.5 text-center transition-colors cursor-pointer ${
    isSelected
      ? 'border-gold bg-gold text-ink font-semibold'
      : isCurrent
        ? 'border-lime bg-lime/10 text-lime font-semibold'
        : 'border-line bg-ink-2 text-paper/75 hover:border-paper hover:text-paper'
  }`;

export function StarOracleWidget() {
  const now = useNow(60_000);

  // Doğum tarihi → doğum Güneşi: kişisel yıldız ve burcun geleneksel yöneticisi ("senin saatlerin")
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(1998);
  const maxDay = daysInMonth(month, year);
  const natalSun = useMemo(() => longitude('sun', birthInstant(year, month, day, 12, 0)), [day, month, year]);
  const natalSign = signIndex(natalSun);
  const myRuler = TRADITIONAL_RULER[natalSign];
  const myStar = nearestStar(natalSun);

  // Günün yıldızı: Ay'ın bugün ekliptikte en yakın olduğu baş yıldız
  const moonLon = now ? longitude('moon', now) : null;
  const moonPerHour = now && moonLon !== null ? wrap180(longitude('moon', new Date(now.getTime() + 3_600_000)) - moonLon) : 0.55;
  const todayStar = moonLon === null ? null : nearestStar(moonLon);

  const [pickedStarId, setPickedStarId] = useState<string | null>(null);
  const selectedStar = FIXED_STARS_CATALOG.find((st) => st.id === pickedStarId) ?? todayStar?.star ?? FIXED_STARS_CATALOG[0];
  const railRef = useRevealOnChange(selectedStar);
  const moonGap = moonLon === null ? null : starGap(selectedStar, moonLon);
  const isToday = todayStar?.star.id === selectedStar.id;
  const isMine = myStar.star.id === selectedStar.id;

  // Calculate the 24 unequal planetary hours (12 day + 12 night) for Istanbul
  const slots: PlanetaryHourSlot[] = useMemo(() => {
    return planetaryHours(now ?? new Date());
  }, [now]);

  // Find which unequal slot is currently active
  const currentSlotIndex = useMemo(() => {
    if (!now) return null;
    const found = slots.findIndex((s) => now >= s.start && now < s.end);
    return found !== -1 ? found : null;
  }, [now, slots]);

  const [pickedSlotIndex, setPickedSlotIndex] = useState<number | null>(null);
  const activeSlotIndex = pickedSlotIndex ?? currentSlotIndex ?? 0;
  const activeSlot = slots[activeSlotIndex] ?? slots[0];
  const activeHourDetails = PLANETARY_HOUR_DETAILS[activeSlot.ruler];

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  // Bu gezegen gününde burcunun yöneticisine ait sıradaki (ya da şu anki) saat
  const nextMyHour = now ? slots.find((sl) => sl.ruler === myRuler && sl.end > now) ?? null : null;
  const myHourText = !now
    ? ''
    : !nextMyHour
      ? 'Bu gezegen gününde senin saatin kalmadı; yarın gündoğumundan sonra yeniden başlar.'
      : now >= nextMyHour.start
        ? `Şu an senin saatin; bitişi ${formatTime(nextMyHour.end)}.`
        : `Sıradaki saatinin başlangıcı: ${formatTime(nextMyHour.start)}.`;
  const moonEta = (gap: number) => {
    const h = gap / Math.max(0.3, moonPerHour);
    return h < 36 ? `yaklaşık ${Math.max(1, Math.round(h))} saat` : `yaklaşık ${Math.round(h / 24)} gün`;
  };

  return (
    <div className="relative border border-line bg-ink p-4 sm:p-8 space-y-8 sm:space-y-10" id="yildiz-fali">
      {/* Başlık */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="block text-sm text-paper/70">Geleneksel astroloji · Keldani sırası</span>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Gezegen saatleri ve sabit yıldızlar
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
            Gündoğumundan itibaren eşit olmayan saatlerle değişen gökyüzü yöneticileri, Ay’ın bugün yaklaştığı baş yıldız ve doğum Güneşine göre senin yıldızın.
          </p>
        </div>

        {/* Günün yıldızına dön */}
        <button
          type="button"
          onClick={() => setPickedStarId(null)}
          disabled={!todayStar || isToday}
          className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start border border-gold/60 px-4 py-2 text-sm font-medium text-gold transition-colors cursor-pointer hover:bg-gold hover:text-ink sm:self-auto disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gold"
        >
          <Sparkles size={16} />
          <span>Günün yıldızı</span>
        </button>
      </div>

      {/* Sana özel: doğum Güneşi, senin saatlerin ve senin yıldızın */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-3">
          <span className={`block ${SECTION_TITLE}`}>Sana özel</span>
          <p className="text-sm leading-relaxed text-paper/80">Doğum tarihini gir: doğum anındaki Güneş’e göre yıldızın ve gün içindeki saatlerin hesaplanır.</p>
          <div className="grid grid-cols-3 gap-3">
            <label className="space-y-1.5">
              <span className={LABEL}>Gün</span>
              <NumericInput value={day} min={1} max={maxDay} onValueChange={setDay} className={FIELD} />
            </label>
            <label className="space-y-1.5">
              <span className={LABEL}>Ay</span>
              <NumericInput
                value={month}
                min={1}
                max={12}
                onValueChange={(v) => { setMonth(v); setDay((d) => Math.min(d, daysInMonth(v, year))); }}
                className={FIELD}
              />
            </label>
            <label className="space-y-1.5">
              <span className={LABEL}>Yıl</span>
              <NumericInput
                value={year}
                min={1920}
                max={2030}
                onValueChange={(v) => { setYear(v); setDay((d) => Math.min(d, daysInMonth(month, v))); }}
                className={FIELD}
              />
            </label>
          </div>
        </div>

        <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2" aria-live="polite">
          <div className="border border-line bg-ink-2 p-4 space-y-2">
            <span className={LABEL}>Doğum Güneşin</span>
            <div className="text-lg font-semibold text-paper">
              {SIGN_NAMES[natalSign]} <span className="font-mono text-base">{formatDegrees(natalSun % 30)}</span>
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              Burcunun geleneksel yöneticisi {BODY_NAMES[myRuler]}; onun yönettiği gezegen saatleri senin saatlerin (çizelgede ★).
            </p>
            {myHourText && <p className="text-sm leading-relaxed text-gold">{myHourText}</p>}
          </div>
          <button
            type="button"
            onClick={() => setPickedStarId(myStar.star.id)}
            className="border border-line bg-ink-2 p-4 space-y-2 text-left transition-colors cursor-pointer hover:border-gold"
          >
            <span className={LABEL}>Senin yıldızın</span>
            <span className="block text-lg font-semibold text-paper">{myStar.star.name}</span>
            <span className="block text-sm leading-relaxed text-paper/80">
              {Math.abs(myStar.gap) <= 5
                ? `Doğum Güneşin bu yıldızla kavuşumda (${formatDegrees(myStar.gap)} uzakta).`
                : `Doğum Güneşine ekliptikte en yakın baş yıldız; aradaki uzaklık ${formatDegrees(myStar.gap)}.`}
            </span>
            <span className="block text-sm text-gold">Yorumunu göster →</span>
          </button>
        </div>
      </div>

      {/* Bölüm 1: Canlı gezegen saatleri */}
      <div className="border-t border-line pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="shrink-0 text-gold" />
            <h4 className={SECTION_TITLE}>
              Gezegen saati çizelgesi
            </h4>
            {currentSlotIndex !== null && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-lime" title="Canlı saat" />
            )}
          </div>
          <div className="text-sm text-paper/70">
            İstanbul yerel saati: <strong className="font-mono font-semibold text-paper">{now ? formatTime(now) : '—'}</strong>
          </div>
        </div>

        {/* Seçili saatin özeti */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 border border-line bg-ink-2 p-5 flex flex-col items-center text-center">
            <PlanetGlyph planet={activeHourDetails.rulerId} size={36} className="mb-3 text-gold" />
            <span className="text-sm text-paper/70">
              {activeSlot.isDay ? 'Gündüz saati' : 'Gece saati'} ({activeSlot.isDay ? activeSlot.index + 1 : activeSlot.index - 11} / 12)
            </span>
            <h4 className="mt-1 font-display text-xl font-semibold text-paper">
              {activeHourDetails.ruler}
            </h4>
            <div className="mt-1 font-mono text-sm font-semibold text-gold">
              {formatTime(activeSlot.start)} — {formatTime(activeSlot.end)}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-paper/80">
              {activeHourDetails.title}
            </p>
            {activeSlot.ruler === myRuler && (
              <span className="mt-2 text-sm font-medium text-gold">★ Senin saatin</span>
            )}
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <span className={LABEL}>Saatin teması</span>
              <p className="text-base leading-relaxed text-paper/85">
                {activeHourDetails.theme}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-lime/30 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-lime">
                  <CheckCircle2 size={15} className="shrink-0" />
                  Uğurlu işler
                </span>
                <ul className="space-y-1.5">
                  {activeHourDetails.favorableFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-snug text-paper/80">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-rose/30 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-rose">
                  <XCircle size={15} className="shrink-0" />
                  Kaçınılacaklar
                </span>
                <ul className="space-y-1.5">
                  {activeHourDetails.unfavorableFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-snug text-paper/80">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 24 eşit olmayan saat: 12 gündüz + 12 gece */}
        <div className="space-y-5">
          {/* Gündüz (0..11) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gold">
                <Sun size={15} className="shrink-0" />
                <span>Gündüz saatleri <span className="font-normal text-paper/70">(gündoğumu – günbatımı)</span></span>
              </span>
              <span className="text-xs text-paper/70">12 eşit olmayan saat</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-12 gap-1.5">
              {slots.slice(0, 12).map((s) => {
                const details = PLANETARY_HOUR_DETAILS[s.ruler];
                const isCurrent = s.index === currentSlotIndex;
                const isSelected = s.index === activeSlotIndex;

                return (
                  <button
                    key={s.index}
                    onClick={() => setPickedSlotIndex(s.index)}
                    className={slotClass(isSelected, isCurrent)}
                    title={`Gündüz ${s.index + 1}. saat (${formatTime(s.start)} - ${formatTime(s.end)}) · ${details.ruler}${s.ruler === myRuler ? ' · senin saatin' : ''}`}
                  >
                    <span className="flex w-full items-center justify-between gap-1 px-0.5 font-mono text-[11px] opacity-80">
                      <span>G{s.index + 1}</span>
                      <span>{formatTime(s.start)}</span>
                    </span>
                    {s.ruler === myRuler && <span aria-hidden className="absolute -top-1.5 -right-1 text-[11px] leading-none text-gold">★</span>}
                    <PlanetGlyph planet={details.rulerId} size={14} className="my-1" />
                    <span className="w-full truncate text-xs">{details.ruler.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gece (12..23) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-violet">
                <Moon size={15} className="shrink-0" />
                <span>Gece saatleri <span className="font-normal text-paper/70">(günbatımı – gündoğumu)</span></span>
              </span>
              <span className="text-xs text-paper/70">12 eşit olmayan saat</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-12 gap-1.5">
              {slots.slice(12, 24).map((s) => {
                const details = PLANETARY_HOUR_DETAILS[s.ruler];
                const isCurrent = s.index === currentSlotIndex;
                const isSelected = s.index === activeSlotIndex;

                return (
                  <button
                    key={s.index}
                    onClick={() => setPickedSlotIndex(s.index)}
                    className={slotClass(isSelected, isCurrent)}
                    title={`Gece ${s.index - 11}. saat (${formatTime(s.start)} - ${formatTime(s.end)}) · ${details.ruler}${s.ruler === myRuler ? ' · senin saatin' : ''}`}
                  >
                    <span className="flex w-full items-center justify-between gap-1 px-0.5 font-mono text-[11px] opacity-80">
                      <span>N{s.index - 11}</span>
                      <span>{formatTime(s.start)}</span>
                    </span>
                    {s.ruler === myRuler && <span aria-hidden className="absolute -top-1.5 -right-1 text-[11px] leading-none text-gold">★</span>}
                    <PlanetGlyph planet={details.rulerId} size={14} className="my-1" />
                    <span className="w-full truncate text-xs">{details.ruler.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bölüm 2: Sabit yıldızlar ve kraliyet yıldızları */}
      <div className="border-t border-line pt-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-2.5">
            <Star size={18} className="shrink-0 text-gold" />
            <h4 className={SECTION_TITLE}>
              Sabit yıldızlar ve kraliyet yıldızları
            </h4>
          </div>
          <span className="text-sm text-paper/70">
            8 baş kerteriz yıldızı
          </span>
        </div>

        {/* Yıldız seçimi */}
        <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {FIXED_STARS_CATALOG.map((star) => {
            const isSelected = selectedStar.id === star.id;
            return (
              <button
                key={star.id}
                onClick={() => setPickedStarId(star.id)}
                className={`min-w-0 p-2.5 border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold text-ink'
                    : 'border-line bg-ink-2 text-paper/75 hover:border-paper hover:text-paper'
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-1">
                  <span className="min-w-0 truncate text-xs opacity-80">
                    {star.id === todayStar?.star.id ? 'Bugün' : star.id === myStar.star.id ? 'Senin' : star.royalStar ?? 'Yıldız'}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] opacity-80">{star.magnitude}m</span>
                </div>
                <div className="truncate text-sm font-semibold">{star.name}</div>
                <div className="truncate text-xs opacity-75">{star.constellation}</div>
              </button>
            );
          })}
        </div>

        {/* Seçili yıldızın yorumu */}
        <div className="border border-line bg-ink-2 p-5 sm:p-6 space-y-6">
          <div className="flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              {(isToday || isMine || selectedStar.royalStar) && (
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {isToday && (
                    <span className="border border-lime/40 px-2 py-0.5 text-xs text-lime">Günün yıldızı</span>
                  )}
                  {isMine && (
                    <span className="border border-rose/40 px-2 py-0.5 text-xs text-rose">Senin yıldızın</span>
                  )}
                  {selectedStar.royalStar && (
                    <span className="border border-gold/40 px-2 py-0.5 text-xs text-gold">
                      Kraliyet yıldızı · {selectedStar.royalStar}
                    </span>
                  )}
                </div>
              )}
              <h4 className="font-display text-2xl font-semibold leading-tight text-paper">
                {selectedStar.name} <span className="text-base font-normal text-paper/70">({selectedStar.arabicName})</span>
              </h4>
              <p className="mt-1 text-sm font-medium text-gold sm:text-base">
                {selectedStar.title}
              </p>
              {moonGap !== null && (
                <p className="mt-2 text-sm leading-relaxed text-paper/80">
                  {Math.abs(moonGap) < 1
                    ? 'Ay şu an bu yıldızla kavuşumda.'
                    : moonGap > 0
                      ? `Ay bu yıldıza ${formatDegrees(moonGap)} uzakta ve yaklaşıyor; kavuşuma ${moonEta(moonGap)} var.`
                      : `Ay bu yıldızı ${formatDegrees(moonGap)} geride bıraktı.`}
                </p>
              )}
            </div>

            <dl className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 text-sm lg:w-72">
              <div>
                <dt className={LABEL}>Ay’a uzaklık</dt>
                <dd className="font-mono text-base font-semibold text-lime">{moonGap === null ? '—' : formatDegrees(moonGap)}</dd>
              </div>
              <div>
                <dt className={LABEL}>Takımyıldız</dt>
                <dd className="font-medium text-paper">{selectedStar.constellation}</dd>
              </div>
              <div>
                <dt className={LABEL}>Doğa</dt>
                <dd className="text-paper/85">{selectedStar.nature}</dd>
              </div>
              <div>
                <dt className={LABEL}>Boylam</dt>
                <dd className="font-mono text-paper/85">{selectedStar.eclipticLongitude}</dd>
              </div>
            </dl>
          </div>

          {/* Yorum */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-1.5">
                <span className={LABEL}>Yıldızın mesajı</span>
                <p className="border-l-2 border-gold/50 pl-4 text-base leading-relaxed text-paper/90">
                  &quot;{selectedStar.guidance.oracleMessage}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <span className="block text-sm font-medium text-lime">Armağan</span>
                  <p className="text-sm leading-relaxed text-paper/80">
                    {selectedStar.guidance.gift}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="block text-sm font-medium text-rose">Sınav ve uyarı</span>
                  <p className="text-sm leading-relaxed text-paper/80">
                    {selectedStar.guidance.test}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4 border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <div className="space-y-1">
                <span className={LABEL}>Eylem önerisi</span>
                <p className="text-sm leading-relaxed text-paper/85">
                  {selectedStar.guidance.actionAdvice}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className={LABEL}>Desteklenen eylemler</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStar.favorableActivities.map((act) => (
                    <span key={act} className="border border-line px-2 py-0.5 text-xs text-paper/85">
                      {act}
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
