'use client';

import React, { useMemo, useState } from 'react';
import {
  Clock,
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
import { Ticks } from '@/components/motion/primitives';
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
    <div id="gunluk-transitler" className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4 animate-spin-slow" />
            <span>CANLI KOZMİK HAVA DURUMU & GÜNLÜK TRANSİTLER</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Günün Kozmik Nabzı <span className="serif-i text-primary">& Burç Yorumları</span>
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            {sky ? `${dateFormatted}, ${dayName} • ` : ''}Gökyüzündeki güncel Ay fazı, gezegen yöneticisi ve 12 burç için günlük arketip rehberi.
          </p>
        </div>

        <div className="flex items-center gap-2 label text-paper bg-ink-2 border border-line px-4 py-2 shrink-0">
          <Calendar size={14} className="text-gold" />
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Cosmic Weather Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-line bg-line">
        {/* 1. Moon Phase (Bespoke Vector Moon) */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label text-violet">
              GÜNCEL AY FAZI
            </span>
            <VectorMoonPhase illumination={illuminationPct} waning={sky ? !sky.moon.waxing : false} size={30} className="text-paper" />
          </div>
          <div className="display display-tight text-lg font-bold text-paper">
            {moonPhaseName}{sky && ` (%${illuminationPct} Aydınlık)`}
          </div>
          <p className="text-xs text-paper/75 leading-relaxed">
            {moonPhaseDesc}
          </p>
        </div>

        {/* 2. Planetary Ruler of the Day */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label text-gold">
              GÜNÜN GEZEGENSEL YÖNETİCİSİ
            </span>
            <PlanetGlyph planet={dayRuler.planetId} size={22} className={dayRuler.color} />
          </div>
          <div className="display display-tight text-lg font-bold text-paper">
            {dayRuler.planet}
          </div>
          <p className="text-xs text-paper/75 leading-relaxed">
            Bugün <strong className="text-paper">{dayRuler.focus}</strong> temaları kozmik olarak destekleniyor.
          </p>
        </div>

        {/* 3. Mercury Status */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label text-primary">
              MERKÜR İLETİŞİM DÖNGÜSÜ
            </span>
            <PlanetGlyph planet="mercury" size={20} className="text-primary" />
          </div>
          <div className="display display-tight text-lg font-bold text-paper flex items-center gap-2">
            {isMercuryRetro ? <Hourglass className="text-solar" size={18} /> : <ShieldCheck className="text-lime" size={18} />}
            <span>{!sky ? 'Hesaplanıyor' : isMercuryRetro ? 'Retrograd (Geri Hareket)' : 'Düz Harekette'}</span>
          </div>
          <p className="text-xs text-paper/75 leading-relaxed">
            {isMercuryRetro
              ? 'Gökyüzünde geri gidiyor gibi görünüyor: sözleşmeleri, yazışmaları ve teknik planları bir kez daha gözden geçir.'
              : 'Zihinsel netlik, yeni kontratlar, teknolojik hamleler ve açık iletişim için elverişli akış.'}
          </p>
        </div>
      </div>

      {/* 12 Signs Quick Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="label text-paper flex items-center gap-2">
            <PlanetGlyph planet="sun" size={14} className="text-gold" />
            Burcunuzu Seçin & Günlük Yorumu Okuyun
          </h3>
          <span className="label text-muted">
            Seçili: <strong className="text-paper">{selectedSign.name}</strong>
          </span>
        </div>

        {/* Horizontal Zodiac Selector Buttons with Bespoke Glyphs */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-px border border-line bg-line">
          {ZODIAC_SIGNS.map((s) => {
            const isSelected = s.id === selectedSignId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSignId(s.id)}
                className={`flex flex-col items-center justify-center p-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-gold text-ink'
                    : 'bg-ink-2 text-muted hover:text-paper hover:bg-ink-3'
                }`}
              >
                <ZodiacGlyph
                  sign={s.id}
                  size={20}
                  className={`mb-1.5 ${isSelected ? 'text-ink' : 'text-paper/70'}`}
                />
                <span className="text-xs font-bold font-sans">{s.name}</span>
                <span className="label text-[9px] mt-0.5 opacity-70">{s.element}</span>
              </button>
            );
          })}
        </div>

        {/* Active Daily Horoscope Card */}
        <div className="border border-line bg-ink-2 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-6">
            <div className="flex items-center gap-4">
              <ZodiacGlyph sign={selectedSign.id} size={48} className="text-gold shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="display display-tight text-2xl sm:text-3xl font-black text-paper">
                    {selectedSign.name} Burcu Günlük Yorumu
                  </h3>
                  <span className="label px-2.5 py-0.5 border border-gold/40 bg-gold/10 text-gold font-bold">
                    {selectedSign.dates}
                  </span>
                </div>
                <div className="label text-muted mt-1">
                  Element: {selectedSign.element} ({selectedSign.modality}) • Yönetici: {selectedSign.rulingPlanet}
                </div>
                {reading && (
                  <div className="label mt-1 text-paper/70">
                    Ay bugün {reading.moonIn} · {reading.house}. ev: {reading.houseArea}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-ink border border-line px-4 py-2.5 shrink-0 font-mono text-xs">
              <Hourglass size={16} className="text-gold" />
              <div>
                <span className="label text-[10px] text-muted block">Günün Şanslı Saatleri</span>
                <span className="text-paper font-bold">{reading ? reading.luckyHours : '—'}</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars: Energy, Love, Career */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line mt-6">
            {/* Energy */}
            <div className="bg-ink p-5 space-y-2">
              <div className="label text-gold flex items-center gap-2">
                <Zap size={14} className="text-gold" />
                <span>Kozmik Enerji & Odak</span>
              </div>
              <p className="text-xs text-paper/75 leading-relaxed font-sans">
                {reading ? reading.energy : pending}
              </p>
            </div>

            {/* Love & Relations */}
            <div className="bg-ink p-5 space-y-2">
              <div className="label text-rose-signal flex items-center gap-2">
                <Heart size={14} className="text-rose-signal" />
                <span>Aşk & İlişkiler</span>
              </div>
              <p className="text-xs text-paper/75 leading-relaxed font-sans">
                {reading ? reading.love : pending}
              </p>
            </div>

            {/* Career & Wealth */}
            <div className="bg-ink p-5 space-y-2">
              <div className="label text-paper flex items-center gap-2">
                <Briefcase size={14} className="text-paper" />
                <span>Kariyer & Maddiyat</span>
              </div>
              <p className="text-xs text-paper/75 leading-relaxed font-sans">
                {reading ? reading.career : pending}
              </p>
            </div>
          </div>

          {/* Cosmic Tip Footer */}
          <div className="mt-6 pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-paper/75">
              <span className="text-gold font-bold">Rehber Not:</span>
              <span>{reading ? reading.tip : pending}</span>
            </div>

            <div className="label text-muted serif-i">
              Motto: &quot;{selectedSign.traits.motto}&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
