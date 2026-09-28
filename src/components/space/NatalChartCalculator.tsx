'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  Flame,
  Globe2,
  Wind,
  Droplets,
  Calendar,
  Clock,
  MapPin,
  Telescope
} from 'lucide-react';
import {
  ZODIAC_SIGNS,
  ZodiacSign,
  getSunSign,
  calculateAscendant,
  calculateMoonSign
} from '@/data/zodiac';
import { POPULAR_LOCATIONS } from '@/utils/astronomy';

export function NatalChartCalculator() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(1998);
  const [hour, setHour] = useState(14);
  const [minute, setMinute] = useState(30);
  const [city, setCity] = useState(POPULAR_LOCATIONS[0].city);

  // Compute Signs
  const sunSign = getSunSign(month, day);
  const sunSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === sunSign.id);
  const risingSign = calculateAscendant(sunSignIndex, hour);
  const moonSign = calculateMoonSign(sunSignIndex, day);

  const elementIcons = {
    Ateş: <Flame className="text-amber-400" size={14} />,
    Toprak: <Globe2 className="text-emerald-400" size={14} />,
    Hava: <Wind className="text-cyan-400" size={14} />,
    Su: <Droplets className="text-blue-400" size={14} />
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-widest">
              GÖKYÜZÜ ARKETİPLERİ & DOĞUM HARİTASI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Doğum Haritası & Yükselen Hesaplayıcı
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Doğum anınızdaki gökyüzü konumlarını, Güneş, Yükselen ve Ay burcunuzun astrolojik ve astronomik kesişimini keşfedin.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          Zodyak Koordinat Sistemi
        </div>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono text-xs">
        {/* Day */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">GÜN</label>
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value) || 1)}
            className="w-full bg-transparent text-sm font-bold text-white outline-none"
          />
        </div>

        {/* Month */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">AY</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
          >
            {[
              'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
              'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
            ].map((mName, idx) => (
              <option key={mName} value={idx + 1} className="bg-neutral-900 text-white">
                {mName}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">YIL</label>
          <input
            type="number"
            min={1920}
            max={2030}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || 2000)}
            className="w-full bg-transparent text-sm font-bold text-white outline-none"
          />
        </div>

        {/* Hour */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">SAAT (0-23)</label>
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value) || 0)}
            className="w-full bg-transparent text-sm font-bold text-white outline-none"
          />
        </div>

        {/* Minute */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">DAKİKA</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
            className="w-full bg-transparent text-sm font-bold text-white outline-none"
          />
        </div>

        {/* City */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="text-[10px] text-neutral-400 block mb-1">ŞEHİR</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <option key={loc.city} value={loc.city} className="bg-neutral-900 text-white">
                {loc.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Results: Big Trinity Cards (Güneş, Yükselen, Ay) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Sun Sign */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sun className="text-amber-400" size={18} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-300">
                GÜNEŞ BURCU (ÖZ BENLİK)
              </span>
            </div>
            <span className="text-3xl">{sunSign.symbol}</span>
          </div>

          <h3 className="text-3xl font-black text-white">{sunSign.name}</h3>
          <div className="text-xs font-mono text-neutral-400 mt-1">{sunSign.dates}</div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Element:</span>
              <span className="text-white font-bold flex items-center gap-1">
                {elementIcons[sunSign.element]}
                {sunSign.element} ({sunSign.modality})
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Yönetici Gezegen:</span>
              <span className="text-cyan-400 font-bold">{sunSign.rulingPlanet}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Motto:</span>
              <span className="text-amber-200 italic font-sans">{sunSign.traits.motto}</span>
            </div>
          </div>
        </div>

        {/* 2. Rising Sign (Ascendant) */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="text-cyan-400" size={18} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-300">
                YÜKSELEN BURÇ (DIŞ DÜNYA MASKESİ)
              </span>
            </div>
            <span className="text-3xl">{risingSign.symbol}</span>
          </div>

          <h3 className="text-3xl font-black text-white">{risingSign.name}</h3>
          <div className="text-xs font-mono text-neutral-400 mt-1">Doğu Ufku Yükseleni (ASC)</div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Element:</span>
              <span className="text-white font-bold flex items-center gap-1">
                {elementIcons[risingSign.element]}
                {risingSign.element} ({risingSign.modality})
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Dış Algı:</span>
              <span className="text-white font-bold">{risingSign.traits.archetype}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Motto:</span>
              <span className="text-cyan-200 italic font-sans">{risingSign.traits.motto}</span>
            </div>
          </div>
        </div>

        {/* 3. Moon Sign */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-black/40 to-black/60 p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="text-purple-400" size={18} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-purple-300">
                AY BURCU (İÇ DÜNYA & DUYGULAR)
              </span>
            </div>
            <span className="text-3xl">{moonSign.symbol}</span>
          </div>

          <h3 className="text-3xl font-black text-white">{moonSign.name}</h3>
          <div className="text-xs font-mono text-neutral-400 mt-1">Bilinçdışı & Ruh Hali</div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Element:</span>
              <span className="text-white font-bold flex items-center gap-1">
                {elementIcons[moonSign.element]}
                {moonSign.element} ({moonSign.modality})
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Duygusal Tepki:</span>
              <span className="text-purple-200 font-bold">{moonSign.traits.strengths[0]}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-neutral-400">Motto:</span>
              <span className="text-purple-200 italic font-sans">{moonSign.traits.motto}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 360° Natal Wheel Visualization (SVG) */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8">
        {/* The 12-House Radial Wheel */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0">
          <svg viewBox="0 0 320 320" className="w-full h-full transform -rotate-90">
            {/* Outer Ring */}
            <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <circle cx="160" cy="160" r="115" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="160" cy="160" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* 12 House Sectors */}
            {ZODIAC_SIGNS.map((s, idx) => {
              const startAngle = (idx * 30 * Math.PI) / 180;
              const midAngle = ((idx * 30 + 15) * Math.PI) / 180;
              const x1 = 160 + 150 * Math.cos(startAngle);
              const y1 = 160 + 150 * Math.sin(startAngle);
              const xText = 160 + 132 * Math.cos(midAngle);
              const yText = 160 + 132 * Math.sin(midAngle);

              const isSun = s.id === sunSign.id;
              const isAsc = s.id === risingSign.id;

              return (
                <g key={s.id}>
                  {/* Divider Line */}
                  <line
                    x1="160"
                    y1="160"
                    x2={x1}
                    y2={y1}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                  {/* Zodiac Symbol */}
                  <text
                    x={xText}
                    y={yText}
                    fill={isSun ? '#fbbf24' : isAsc ? '#38bdf8' : '#a3a3a3'}
                    fontSize={isSun || isAsc ? '17' : '13'}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="transform rotate-90"
                    style={{ transformOrigin: `${xText}px ${yText}px` }}
                  >
                    {s.symbol}
                  </text>
                </g>
              );
            })}

            {/* Center Core Circle */}
            <circle cx="160" cy="160" r="45" fill="#09090f" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </svg>

          {/* Center Info Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl">✨</span>
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
              KOZMİK HARİTA
            </span>
          </div>
        </div>

        {/* Narrative & Deep Interpretation */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <h4 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Kişisel Kozmik İmza
            </h4>
          </div>

          <p>
            Güneş burcunuz <strong>{sunSign.name}</strong>, yaşam enerjinizi ve temel karakterinizi belirler. 
            Yükselen burcunuz <strong>{risingSign.name}</strong>, hayatı karşılama biçiminizi ve insanların sizi ilk gördüğünde hissettiği auranızı şekillendirir. 
            Ay burcunuz <strong>{moonSign.name}</strong> ise sadece en yakınlarınızın bildiği içsel duygusal derinliğinizi temsil eder.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Şanslı Sayılar:</span>
              <span className="text-white font-bold">{sunSign.details.luckyNumbers.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Kozmik Taş:</span>
              <span className="text-amber-300 font-bold">{sunSign.details.stone}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Mitolojik Arketip:</span>
              <span className="text-cyan-300 font-bold">{sunSign.traits.archetype}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/harita"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-white font-mono font-bold transition-colors"
            >
              <Telescope size={14} />
              <span>3D Gökyüzünde {sunSign.name} Takımyıldızını Gör</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
