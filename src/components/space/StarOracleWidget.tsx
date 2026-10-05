'use client';

import React, { useMemo, useState } from 'react';
import { useNow } from '@/lib/useNow';
import {
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ShieldAlert,
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
const FIELD = 'w-full bg-ink border border-line px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none';

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
    <div className="relative border border-line bg-ink p-6 sm:p-10 space-y-8" id="yildiz-fali">
      {/* Header — Cinematic Doc Style */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        <div>
          <span className="doc-kicker text-gold">Geleneksel Astroloji · Keldani Sırası</span>
          <h3 className="doc-title text-2xl sm:text-3xl text-paper mt-1">
            Gezegen Saatleri <span className="doc-serif text-gold">& Sabit Yıldızlar</span>
          </h3>
          <p className="doc-caption text-paper/70 mt-1 max-w-2xl leading-relaxed">
            Gündoğumundan itibaren eşit olmayan saatlerle değişen gökyüzü yöneticileri, Ay’ın bugün yaklaştığı baş yıldız ve doğum Güneşine göre senin yıldızın.
          </p>
        </div>

        {/* Günün yıldızına dön */}
        <button
          type="button"
          onClick={() => setPickedStarId(null)}
          disabled={!todayStar || isToday}
          className="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-gold"
        >
          <Sparkles size={14} />
          <span>Günün Yıldızı</span>
        </button>
      </div>

      {/* Sana özel: doğum Güneşi, senin saatlerin ve senin yıldızın */}
      <div className="grid gap-6 border border-line bg-ink-2 p-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-3">
          <span className="doc-kicker text-gold">Sana özel</span>
          <p className="text-xs leading-relaxed text-paper/70">Doğum tarihini gir: doğum anındaki Güneş’e göre yıldızın ve gün içindeki saatlerin hesaplanır.</p>
          <div className="grid grid-cols-3 gap-3">
            <label className="space-y-1.5">
              <span className="doc-kicker text-paper/60 text-[10px] uppercase block">Gün</span>
              <NumericInput value={day} min={1} max={maxDay} onValueChange={setDay} className={FIELD} />
            </label>
            <label className="space-y-1.5">
              <span className="doc-kicker text-paper/60 text-[10px] uppercase block">Ay</span>
              <NumericInput
                value={month}
                min={1}
                max={12}
                onValueChange={(v) => { setMonth(v); setDay((d) => Math.min(d, daysInMonth(v, year))); }}
                className={FIELD}
              />
            </label>
            <label className="space-y-1.5">
              <span className="doc-kicker text-paper/60 text-[10px] uppercase block">Yıl</span>
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

        <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2 font-mono text-xs" aria-live="polite">
          <div className="border border-line bg-ink p-4 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted">Doğum Güneşin</span>
            <div className="text-base font-bold text-paper">{SIGN_NAMES[natalSign]} {formatDegrees(natalSun % 30)}</div>
            <p className="text-[11px] leading-relaxed text-paper/70">
              Burcunun geleneksel yöneticisi {BODY_NAMES[myRuler]}; onun yönettiği gezegen saatleri senin saatlerin (çizelgede ★).
            </p>
            {myHourText && <p className="text-[11px] leading-relaxed text-gold">{myHourText}</p>}
          </div>
          <button
            type="button"
            onClick={() => setPickedStarId(myStar.star.id)}
            className="border border-line bg-ink p-4 space-y-1.5 text-left hover:border-gold transition-colors cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-wider text-muted block">Senin yıldızın</span>
            <span className="text-base font-bold text-paper block">{myStar.star.name}</span>
            <span className="text-[11px] leading-relaxed text-paper/70 block">
              {Math.abs(myStar.gap) <= 5
                ? `Doğum Güneşin bu yıldızla kavuşumda (${formatDegrees(myStar.gap)} uzakta).`
                : `Doğum Güneşine ekliptikte en yakın baş yıldız; aradaki uzaklık ${formatDegrees(myStar.gap)}.`}
            </span>
            <span className="text-[11px] text-gold block">Yorumunu göster →</span>
          </button>
        </div>
      </div>

      {/* Section 1: Live Planetary Hours Module */}
      <div className="border border-line bg-ink-2 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-gold" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-paper">
              Gezegen Saati Çizelgesi
            </h4>
            {currentSlotIndex !== null && (
              <span className="h-2 w-2 rounded-full bg-lime animate-ping" title="Canlı Saat" />
            )}
          </div>
          <div className="font-mono text-xs text-muted">
            İstanbul Yerel Saati: <strong className="text-paper">{now ? formatTime(now) : '—'}</strong>
          </div>
        </div>

        {/* Active Selected Slot Information Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Active Hour Badge */}
          <div className="lg:col-span-4 p-5 border border-line bg-ink flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border border-line bg-ink-2 flex items-center justify-center p-3 mb-3 shadow-inner">
              <PlanetGlyph planet={activeHourDetails.rulerId} size={36} className="text-gold" />
            </div>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
              {activeSlot.isDay ? 'Gündüz Saati' : 'Gece Saati'} ({activeSlot.isDay ? activeSlot.index + 1 : activeSlot.index - 11} / 12)
            </span>
            <h4 className="font-mono text-lg font-bold text-paper mt-1">
              {activeHourDetails.ruler}
            </h4>
            <div className="font-mono text-xs text-gold font-semibold mt-1">
              {formatTime(activeSlot.start)} — {formatTime(activeSlot.end)}
            </div>
            <p className="font-mono text-[11px] text-muted mt-1">
              {activeHourDetails.title}
            </p>
            {activeSlot.ruler === myRuler && (
              <span className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">★ Senin saatin</span>
            )}
          </div>

          {/* Right: Favorability Recommendations */}
          <div className="lg:col-span-8 space-y-3 font-mono text-xs">
            <p className="text-paper/85 leading-relaxed bg-ink p-3.5 border border-line">
              <strong className="text-gold uppercase block text-[10px] mb-1">Kozmik Tema:</strong>
              {activeHourDetails.theme}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 border border-lime/30 bg-lime/5 space-y-2">
                <span className="text-lime font-bold uppercase flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 size={13} />
                  Şu Anda Ne Yapmak Uğurlu?
                </span>
                <ul className="space-y-1 text-muted text-[11px]">
                  {activeHourDetails.favorableFor.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-paper/80">
                      <span className="text-lime">✔</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 border border-rose/30 bg-rose/5 space-y-2">
                <span className="text-rose font-bold uppercase flex items-center gap-1.5 text-[11px]">
                  <XCircle size={13} />
                  Nelerden Kaçınmalı?
                </span>
                <ul className="space-y-1 text-muted text-[11px]">
                  {activeHourDetails.unfavorableFor.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-paper/80">
                      <span className="text-rose">✖</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 24 Unequal Hours Timeline: 12 Daytime + 12 Nighttime */}
        <div className="pt-4 border-t border-line space-y-4 font-mono">
          {/* Daytime Row (0..11) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span className="flex items-center gap-1.5 text-gold font-bold">
                <Sun size={13} />
                <span>GÜNDÜZ SAATLERİ (Gündoğumu — Günbatımı)</span>
              </span>
              <span className="text-[10px]">12 Eşit Olmayan Saat</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {slots.slice(0, 12).map((s) => {
                const details = PLANETARY_HOUR_DETAILS[s.ruler];
                const isCurrent = s.index === currentSlotIndex;
                const isSelected = s.index === activeSlotIndex;

                return (
                  <button
                    key={s.index}
                    onClick={() => setPickedSlotIndex(s.index)}
                    className={`relative p-1.5 text-center border transition-all cursor-pointer text-[10px] flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-gold bg-gold text-ink font-bold shadow-md scale-102 z-10'
                        : isCurrent
                        ? 'border-lime bg-lime/15 text-lime font-bold'
                        : 'border-line bg-ink text-muted hover:border-paper hover:text-paper'
                    }`}
                    title={`Gündüz ${s.index + 1}. Saat (${formatTime(s.start)} - ${formatTime(s.end)}) · ${details.ruler}${s.ruler === myRuler ? ' · senin saatin' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full text-[10px] px-0.5 opacity-75">
                      <span>G{s.index + 1}</span>
                      <span>{formatTime(s.start)}</span>
                    </div>
                    {s.ruler === myRuler && <span aria-hidden className="absolute -top-1.5 -right-1 text-[11px] leading-none text-gold">★</span>}
                    <PlanetGlyph planet={details.rulerId} size={13} className="my-1" />
                    <span className="text-[10px] truncate w-full">{details.ruler.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nighttime Row (12..23) */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span className="flex items-center gap-1.5 text-violet font-bold">
                <Moon size={13} />
                <span>GECE SAATLERİ (Günbatımı — Gündoğumu)</span>
              </span>
              <span className="text-[10px]">12 Eşit Olmayan Saat</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {slots.slice(12, 24).map((s) => {
                const details = PLANETARY_HOUR_DETAILS[s.ruler];
                const isCurrent = s.index === currentSlotIndex;
                const isSelected = s.index === activeSlotIndex;

                return (
                  <button
                    key={s.index}
                    onClick={() => setPickedSlotIndex(s.index)}
                    className={`relative p-1.5 text-center border transition-all cursor-pointer text-[10px] flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-gold bg-gold text-ink font-bold shadow-md scale-102 z-10'
                        : isCurrent
                        ? 'border-lime bg-lime/15 text-lime font-bold'
                        : 'border-line bg-ink text-muted hover:border-paper hover:text-paper'
                    }`}
                    title={`Gece ${s.index - 11}. Saat (${formatTime(s.start)} - ${formatTime(s.end)}) · ${details.ruler}${s.ruler === myRuler ? ' · senin saatin' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full text-[10px] px-0.5 opacity-75">
                      <span>N{s.index - 11}</span>
                      <span>{formatTime(s.start)}</span>
                    </div>
                    {s.ruler === myRuler && <span aria-hidden className="absolute -top-1.5 -right-1 text-[11px] leading-none text-gold">★</span>}
                    <PlanetGlyph planet={details.rulerId} size={13} className="my-1" />
                    <span className="text-[10px] truncate w-full">{details.ruler.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Fixed Stars & Royal Stars Oracle */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-gold" />
            <h4 className="font-mono text-sm font-bold text-paper uppercase tracking-wider">
              Sabit Yıldızlar ve Kraliyet Muhafızları
            </h4>
          </div>
          <span className="font-mono text-xs text-muted">
            8 Baş Kerteriz Yıldızı
          </span>
        </div>

        {/* Star Selector Buttons */}
        <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {FIXED_STARS_CATALOG.map((star) => {
            const isSelected = selectedStar.id === star.id;
            return (
              <button
                key={star.id}
                onClick={() => setPickedStarId(star.id)}
                className={`p-2.5 border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gold bg-gold text-ink font-bold shadow-md'
                    : 'border-line bg-ink-2 text-muted hover:border-paper hover:text-paper'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-widest opacity-80">
                    {star.id === todayStar?.star.id ? 'Bugün' : star.id === myStar.star.id ? 'Senin' : star.royalStar ?? 'Yıldız'}
                  </span>
                  <span className="text-[10px]">{star.magnitude}m</span>
                </div>
                <div className="text-xs font-bold truncate">{star.name}</div>
                <div className="text-[10px] opacity-75 truncate">{star.constellation}</div>
              </button>
            );
          })}
        </div>

        {/* Active Fixed Star Showcase Card */}
        <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-line pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {isToday && (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-lime/50 bg-lime/10 text-lime uppercase tracking-widest">Günün yıldızı</span>
                )}
                {isMine && (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-rose/50 bg-rose/10 text-rose uppercase tracking-widest">Senin yıldızın</span>
                )}
                {selectedStar.royalStar && (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-gold/50 bg-gold/10 text-gold uppercase tracking-widest">
                    4 Kraliyet Yıldızı · {selectedStar.royalStar}
                  </span>
                )}
                <span className="font-mono text-xs text-muted">
                  Doğa: {selectedStar.nature} · Boylam: {selectedStar.eclipticLongitude}
                </span>
              </div>
              <h4 className="doc-title text-2xl sm:text-3xl text-paper">
                {selectedStar.name} <span className="doc-serif text-lg sm:text-xl text-gold">({selectedStar.arabicName})</span>
              </h4>
              <p className="font-mono text-xs text-gold font-semibold mt-1">
                {selectedStar.title}
              </p>
              {moonGap !== null && (
                <p className="font-mono text-[11px] text-paper/70 mt-1">
                  {Math.abs(moonGap) < 1
                    ? 'Ay şu an bu yıldızla kavuşumda.'
                    : moonGap > 0
                      ? `Ay bu yıldıza ${formatDegrees(moonGap)} uzakta ve yaklaşıyor; kavuşuma ${moonEta(moonGap)} var.`
                      : `Ay bu yıldızı ${formatDegrees(moonGap)} geride bıraktı.`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 bg-ink p-3 border border-line font-mono text-xs shrink-0">
              <div className="text-right">
                <span className="text-muted block text-[10px] uppercase">Ay’a uzaklık</span>
                <span className="font-bold text-lime text-base">{moonGap === null ? '—' : formatDegrees(moonGap)}</span>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <span className="text-muted block text-[10px] uppercase">Takımyıldız</span>
                <span className="font-bold text-paper">{selectedStar.constellation}</span>
              </div>
            </div>
          </div>

          {/* Deep Interpretation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Left: Oracle Message & Gift */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 border border-line bg-ink space-y-2">
                <span className="text-gold uppercase font-bold text-[10px] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Günün Yıldız Mesajı & Kehaneti
                </span>
                <p className="text-paper/90 text-sm leading-relaxed italic font-serif">
                  &quot;{selectedStar.guidance.oracleMessage}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 border border-line bg-ink space-y-1.5">
                  <span className="text-lime uppercase font-bold text-[10px] block">İlahi Hediye & Kudret</span>
                  <p className="text-paper/80 leading-relaxed text-[11px]">
                    {selectedStar.guidance.gift}
                  </p>
                </div>

                <div className="p-3.5 border border-line bg-ink space-y-1.5">
                  <span className="text-rose uppercase font-bold text-[10px] flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Kozmik Sınav & Uyarı
                  </span>
                  <p className="text-paper/80 leading-relaxed text-[11px]">
                    {selectedStar.guidance.test}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Practical Action & Favorable Fields */}
            <div className="lg:col-span-4 border border-line bg-ink p-5 space-y-4">
              <span className="text-[10px] text-muted uppercase tracking-widest block border-b border-line pb-2">
                UYGULAMALI REHBERLİK
              </span>

              <div className="space-y-3">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Eylem Tavsiyesi:</span>
                  <p className="text-paper/85 text-xs leading-relaxed mt-1">
                    {selectedStar.guidance.actionAdvice}
                  </p>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-muted block text-[10px] uppercase mb-1.5">Desteklenen Eylemler:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStar.favorableActivities.map((act) => (
                      <span key={act} className="px-2 py-0.5 bg-ink-2 border border-line text-gold text-[10px]">
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
    </div>
  );
}
