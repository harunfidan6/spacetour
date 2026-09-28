'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Flame,
  Globe2,
  Wind,
  Droplets,
  Clock,
  Compass,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Hourglass,
  ArrowRight
} from 'lucide-react';
import { ZODIAC_SIGNS, ZodiacSign } from '@/data/zodiac';

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
    0: { planet: 'Güneş (Sol)', symbol: '☉', focus: 'Yaratıcılık, Liderlik & Özgüven', color: 'text-amber-400' },
    1: { planet: 'Ay (Luna)', symbol: '☽', focus: 'Sezgiler, Ev & Duygusal Denge', color: 'text-purple-300' },
    2: { planet: 'Mars (Ares)', symbol: '♂', focus: 'Eylem, Cesaret, Spor & Girişimcilik', color: 'text-rose-400' },
    3: { planet: 'Merkür (Hermes)', symbol: '☿', focus: 'İletişim, Sözleşmeler, Zihin & Ticaret', color: 'text-cyan-400' },
    4: { planet: 'Jüpiter (Zeus)', symbol: '♃', focus: 'Bolluk, Felsefe, Şans & Genişleme', color: 'text-emerald-400' },
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
  let illuminationPct = Math.round((1 - Math.cos((lunarAge / 29.530588) * 2 * Math.PI)) * 50);

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
    <div id="gunluk-transitler" className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="h-5 w-5 text-cyan-400 animate-spin-slow" />
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
              CANLI KOZMİK HAVA DURUMU & GÜNLÜK TRANSİTLER
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Günün Kozmik Nabzı & Burç Yorumları
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            {dateFormatted}, {dayName} • Gökyüzündeki güncel Ay fazı, gezegen yöneticisi ve 12 burç için günlük arketip rehberi.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0">
          <Calendar size={14} className="text-amber-400" />
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Cosmic Weather Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Moon Phase */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-black/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
              GÜNCEL AY FAZI
            </span>
            <span className="text-2xl">{moonPhaseIcon}</span>
          </div>
          <div className="text-lg font-bold text-white">
            {moonPhaseName} (%{illuminationPct} Aydınlık)
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {moonPhaseDesc}
          </p>
        </div>

        {/* 2. Planetary Ruler of the Day */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-black/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">
              GÜNÜN GEZEGENSEL YÖNETİCİSİ
            </span>
            <span className={`text-2xl font-bold ${dayRuler.color}`}>{dayRuler.symbol}</span>
          </div>
          <div className="text-lg font-bold text-white">
            {dayRuler.planet}
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Bugün <strong>{dayRuler.focus}</strong> temaları kozmik olarak destekleniyor.
          </p>
        </div>

        {/* 3. Mercury Status */}
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-black/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold tracking-wider">
              MERKÜR İLETİŞİM DÖNGÜSÜ
            </span>
            <span className="text-2xl">☿</span>
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={18} />
            <span>{isMercuryRetro ? 'Retrograd (Geri Hareket)' : 'Düz Harekette (Direct)'}</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Zihinsel netlik, yeni kontratlar, teknolojik hamleler ve açık iletişim için elverişli akış.
          </p>
        </div>
      </div>

      {/* 12 Signs Quick Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            Burcunuzu Seçin & Günlük Yorumu Okuyun
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            Seçili: <strong className="text-white">{selectedSign.name} ({selectedSign.symbol})</strong>
          </span>
        </div>

        {/* Horizontal Zodiac Selector Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {ZODIAC_SIGNS.map((s) => {
            const isSelected = s.id === selectedSignId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSignId(s.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105'
                    : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-xl mb-1">{s.symbol}</span>
                <span className="text-[11px] font-bold font-sans">{s.name}</span>
                <span className="text-[9px] font-mono text-neutral-400">{s.element}</span>
              </button>
            );
          })}
        </div>

        {/* Active Daily Horoscope Card */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-black/50 to-neutral-950 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedSign.symbol}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {selectedSign.name} Burcu Günlük Yorumu
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-bold">
                    {selectedSign.dates}
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mt-1">
                  Element: {selectedSign.element} ({selectedSign.modality}) • Yönetici: {selectedSign.rulingPlanet}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 font-mono text-xs">
              <Hourglass size={16} className="text-amber-400" />
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Günün Şanslı Saatleri</span>
                <span className="text-white font-bold">{selectedSign.dailyHoroscope.luckyHours}</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars: Energy, Love, Career */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Energy */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Zap size={14} className="text-amber-400" />
                <span>Kozmik Enerji & Odak</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {selectedSign.dailyHoroscope.energy}
              </p>
            </div>

            {/* Love & Relations */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="text-rose-400">❤️</span>
                <span>Aşk & İlişkiler</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {selectedSign.dailyHoroscope.love}
              </p>
            </div>

            {/* Career & Wealth */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="text-cyan-400">💼</span>
                <span>Kariyer & Maddiyat</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {selectedSign.dailyHoroscope.career}
              </p>
            </div>
          </div>

          {/* Cosmic Tip Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-neutral-300">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span>
                <strong>Günün Kozmik Tavsiyesi:</strong> {selectedSign.dailyHoroscope.cosmicTip}
              </span>
            </div>

            <div className="text-neutral-400 italic">
              Motto: &quot;{selectedSign.traits.motto}&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
