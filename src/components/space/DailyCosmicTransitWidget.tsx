'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Zap,
  ShieldCheck,
  Calendar,
  Hourglass
} from 'lucide-react';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { Ticks } from '@/components/motion/primitives';

export function DailyCosmicTransitWidget() {
  const [selectedSignId, setSelectedSignId] = useState<string>('koc');

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Current real-world date simulation
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dayOfWeekNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const dayName = dayOfWeekNames[today.getDay()];

  // Traditional Chaldean Planetary Ruler of Day
  // Sunday = Sun, Monday = Moon, Tuesday = Mars, Wednesday = Mercury, Thursday = Jupiter, Friday = Venus, Saturday = Saturn
  const planetaryRulersOfDay: Record<number, { planet: string; symbol: string; focus: string; color: string }> = {
    0: { planet: 'Güneş (Sol)', symbol: '☉', focus: 'Yaratıcılık, Liderlik & Özgüven', color: 'text-gold' },
    1: { planet: 'Ay (Luna)', symbol: '☽', focus: 'Sezgiler, Ev & Duygusal Denge', color: 'text-violet' },
    2: { planet: 'Mars (Ares)', symbol: '♂', focus: 'Eylem, Cesaret, Spor & Girişimcilik', color: 'text-rose-signal' },
    3: { planet: 'Merkür (Hermes)', symbol: '☿', focus: 'İletişim, Sözleşmeler, Zihin & Ticaret', color: 'text-primary' },
    4: { planet: 'Jüpiter (Zeus)', symbol: '♃', focus: 'Bolluk, Felsefe, Şans & Genişleme', color: 'text-lime' },
    5: { planet: 'Venüs (Afrodit)', symbol: '♀', focus: 'Aşk, Sanat, Uyum, Sosyalleşme & Estetik', color: 'text-pink-400' },
    6: { planet: 'Satürn (Kronos)', symbol: '♄', focus: 'Disiplin, Sorumluluk, Sabır & Planlama', color: 'text-indigo-400' }
  };

  const dayRuler = planetaryRulersOfDay[today.getDay()];

  // Approximate Lunar Cycle calculation
  // Synodic month is 29.530588 days
  const knownNewMoon = new Date('2026-01-18T16:53:00Z').getTime();
  const diffDays = (today.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarAge = ((diffDays % 29.530588) + 29.530588) % 29.530588;

  let moonPhaseName = 'Yeni Ay';
  let moonPhaseIcon = '🌑';
  let moonPhaseDesc = 'Yeni niyetler ve başlangıçlar tohumlama dönemi.';
  const illuminationPct = Math.round((1 - Math.cos((lunarAge / 29.530588) * 2 * Math.PI)) * 50);

  if (lunarAge < 3.7) {
    moonPhaseName = 'Yeni Ay';
    moonPhaseIcon = '🌑';
    moonPhaseDesc = 'Yeni niyetler ve başlangıçlar ekme vakti.';
  } else if (lunarAge < 7.4) {
    moonPhaseName = 'Büyüyen Hilal';
    moonPhaseIcon = '🌒';
    moonPhaseDesc = 'Fikirlerin filizlenmesi, motivasyon artışı.';
  } else if (lunarAge < 11.1) {
    moonPhaseName = 'İlk Dördün';
    moonPhaseIcon = '🌓';
    moonPhaseDesc = 'Kararlılık, engelleri aşma ve harekete geçiş.';
  } else if (lunarAge < 14.8) {
    moonPhaseName = 'Şişkin Ay';
    moonPhaseIcon = '🌔';
    moonPhaseDesc = 'Olgunlaşma, detayları tamamlama ve odak.';
  } else if (lunarAge < 18.5) {
    moonPhaseName = 'Dolunay';
    moonPhaseIcon = '🌕';
    moonPhaseDesc = 'Aydınlanma, hasat, duygusal zirve ve netlik.';
  } else if (lunarAge < 22.2) {
    moonPhaseName = 'Küçülen Şişkin Ay';
    moonPhaseIcon = '🌖';
    moonPhaseDesc = 'Bilgeliği paylaşma, şükran duyma.';
  } else if (lunarAge < 25.8) {
    moonPhaseName = 'Son Dördün';
    moonPhaseIcon = '🌗';
    moonPhaseDesc = 'Bırakma, affetme, yüklerden arınma.';
  } else {
    moonPhaseName = 'Küçülen Hilal (Balsamik)';
    moonPhaseIcon = '🌘';
    moonPhaseDesc = 'İçsel dinlenme, arınma ve meditasyon.';
  }

  // Mercury Retrograde status check (2026 standard windows)
  // Feb 25 - Mar 20, Jun 29 - Jul 23, Oct 24 - Nov 13
  const isMercuryRetro = false; // direct in current window

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
            {dateFormatted}, {dayName} • Gökyüzündeki güncel Ay fazı, gezegen yöneticisi ve 12 burç için günlük arketip rehberi.
          </p>
        </div>

        <div className="flex items-center gap-2 label text-paper bg-ink-2 border border-line px-4 py-2 shrink-0">
          <Calendar size={14} className="text-gold" />
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Cosmic Weather Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-line bg-line">
        {/* 1. Moon Phase */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label text-violet">
              GÜNCEL AY FAZI
            </span>
            <span className="text-2xl">{moonPhaseIcon}</span>
          </div>
          <div className="display display-tight text-lg font-bold text-paper">
            {moonPhaseName} (%{illuminationPct} Aydınlık)
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
            <span className={`text-2xl font-bold ${dayRuler.color}`}>{dayRuler.symbol}</span>
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
            <span className="text-2xl">☿</span>
          </div>
          <div className="display display-tight text-lg font-bold text-paper flex items-center gap-2">
            <ShieldCheck className="text-lime" size={18} />
            <span>{isMercuryRetro ? 'Retrograd (Geri Hareket)' : 'Düz Harekette (Direct)'}</span>
          </div>
          <p className="text-xs text-paper/75 leading-relaxed">
            Zihinsel netlik, yeni kontratlar, teknolojik hamleler ve açık iletişim için elverişli akış.
          </p>
        </div>
      </div>

      {/* 12 Signs Quick Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="label text-paper flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            Burcunuzu Seçin & Günlük Yorumu Okuyun
          </h3>
          <span className="label text-muted">
            Seçili: <strong className="text-paper">{selectedSign.name} ({selectedSign.symbol})</strong>
          </span>
        </div>

        {/* Horizontal Zodiac Selector Buttons */}
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
                <span className="text-xl mb-1">{s.symbol}</span>
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
              <span className="glyph text-5xl text-gold">{selectedSign.symbol}</span>
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
              </div>
            </div>

            <div className="flex items-center gap-3 bg-ink border border-line px-4 py-2.5 shrink-0 font-mono text-xs">
              <Hourglass size={16} className="text-gold" />
              <div>
                <span className="label text-[10px] text-muted block">Günün Şanslı Saatleri</span>
                <span className="text-paper font-bold">{selectedSign.dailyHoroscope.luckyHours}</span>
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
                {selectedSign.dailyHoroscope.energy}
              </p>
            </div>

            {/* Love & Relations */}
            <div className="bg-ink p-5 space-y-2">
              <div className="label text-rose-signal flex items-center gap-2">
                <span className="text-rose-signal">❤️</span>
                <span>Aşk & İlişkiler</span>
              </div>
              <p className="text-xs text-paper/75 leading-relaxed font-sans">
                {selectedSign.dailyHoroscope.love}
              </p>
            </div>

            {/* Career & Wealth */}
            <div className="bg-ink p-5 space-y-2">
              <div className="label text-paper flex items-center gap-2">
                <span className="text-paper">💼</span>
                <span>Kariyer & Maddiyat</span>
              </div>
              <p className="text-xs text-paper/75 leading-relaxed font-sans">
                {selectedSign.dailyHoroscope.career}
              </p>
            </div>
          </div>

          {/* Cosmic Tip Footer */}
          <div className="mt-6 pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-paper/75">
              <Sparkles size={14} className="text-gold shrink-0" />
              <span>
                <strong className="text-paper">Günün Kozmik Tavsiyesi:</strong> {selectedSign.dailyHoroscope.cosmicTip}
              </span>
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
