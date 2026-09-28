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
  Telescope,
  Hash,
  BookOpen,
  Info,
  Orbit,
  Star
} from 'lucide-react';
import {
  ZODIAC_SIGNS,
  ASTROLOGICAL_HOUSES,
  AstrologicalHouse,
  getSunSign,
  calculateAscendant,
  calculateMoonSign,
  calculatePlanetaryPlacements,
  calculateLifePathNumber
} from '@/data/zodiac';
import { POPULAR_LOCATIONS } from '@/utils/astronomy';

export function NatalChartCalculator() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(1998);
  const [hour, setHour] = useState(14);
  const [minute, setMinute] = useState(30);
  const [city, setCity] = useState(POPULAR_LOCATIONS[0].city);

  // Active view tab: 'trinity' | 'planets' | 'houses'
  const [activeTab, setActiveTab] = useState<'trinity' | 'planets' | 'houses'>('trinity');
  const [selectedHouse, setSelectedHouse] = useState<AstrologicalHouse | null>(null);

  // Compute Core Signs
  const sunSign = getSunSign(month, day);
  const sunSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === sunSign.id);
  const risingSign = calculateAscendant(sunSignIndex, hour);
  const risingSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === risingSign.id);
  const moonSign = calculateMoonSign(sunSignIndex, day);

  // Compute Planetary Placements & Numerology
  const planetaryPlacements = calculatePlanetaryPlacements(
    sunSignIndex,
    risingSignIndex,
    day,
    year
  );
  const lifePath = calculateLifePathNumber(day, month, year);

  const elementIcons = {
    Ateş: <Flame className="text-amber-400" size={14} />,
    Toprak: <Globe2 className="text-emerald-400" size={14} />,
    Hava: <Wind className="text-cyan-400" size={14} />,
    Su: <Droplets className="text-blue-400" size={14} />
  };

  return (
    <div id="dogum-haritasi" className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-widest">
              GÖKYÜZÜ KOORDİNATLARI & DOĞUM HARİTASI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Doğum Haritası, Gezegenler & Numeroloji
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Doğum anınızdaki gökyüzü konumlarını, Güneş, Yükselen, Ay ve 7 kadim gezegenin ev yerleşimlerini ve Pisagor yaşam yolu sayınızı anında hesaplayın.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('trinity')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'trinity'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Üçlü Benlik (Güneş/Ay/ASC)
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'planets'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            7 Gezegen Konumu
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'houses'
                ? 'bg-purple-400 text-black shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            12 Astrolojik Ev
          </button>
        </div>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
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
          <label className="text-[10px] text-neutral-400 block mb-1">DOĞUM ŞEHRİ</label>
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

      {/* Numerology Life Path Number Bar */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-black/40 to-indigo-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-mono text-2xl font-black">
            {lifePath.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                PİSAGOR YAŞAM YOLU SAYISI (NUMEROLOJİ)
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono font-bold">
                No: {lifePath.number}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              {lifePath.title}
            </h4>
            <p className="text-xs text-neutral-300 mt-0.5">
              {lifePath.description}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
          {day} + {month} + {year} = Yaşam Titreşimi: <strong>{lifePath.number}</strong>
        </div>
      </div>

      {/* TAB 1: Core Trinity (Güneş, Yükselen, Ay) */}
      {activeTab === 'trinity' && (
        <div className="space-y-6">
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
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-neutral-400">Tarot Arketipi:</span>
                  <span className="text-amber-300 font-bold">{sunSign.tarotCard.name} ({sunSign.tarotCard.number})</span>
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
              <div className="text-xs font-mono text-neutral-400 mt-1">Doğu Ufku Yükseleni (ASC - 1. Ev)</div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Element:</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    {elementIcons[risingSign.element]}
                    {risingSign.element} ({risingSign.modality})
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Dış Algı & Arketip:</span>
                  <span className="text-white font-bold">{risingSign.traits.archetype}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Motto:</span>
                  <span className="text-cyan-200 italic font-sans">{risingSign.traits.motto}</span>
                </div>
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-neutral-400">Yönetici:</span>
                  <span className="text-cyan-300 font-bold">{risingSign.rulingPlanet}</span>
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
              <div className="text-xs font-mono text-neutral-400 mt-1">Bilinçdışı Güvenlik & Duygular</div>

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
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-neutral-400">Gölge Yön:</span>
                  <span className="text-rose-300 font-bold">{moonSign.traits.shadows[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 360° Natal Wheel Visualization (SVG) */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8">
            {/* The 12-House Radial Wheel with Planet Glyphs */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex-shrink-0">
              <svg viewBox="0 0 360 360" className="w-full h-full transform -rotate-90">
                {/* Outer Ring */}
                <circle cx="180" cy="180" r="170" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <circle cx="180" cy="180" r="130" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="180" cy="180" r="95" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* 12 House Sectors */}
                {ZODIAC_SIGNS.map((s, idx) => {
                  const startAngle = (idx * 30 * Math.PI) / 180;
                  const midAngle = ((idx * 30 + 15) * Math.PI) / 180;
                  const x1 = 180 + 170 * Math.cos(startAngle);
                  const y1 = 180 + 170 * Math.sin(startAngle);
                  const xText = 180 + 150 * Math.cos(midAngle);
                  const yText = 180 + 150 * Math.sin(midAngle);

                  const isSun = s.id === sunSign.id;
                  const isAsc = s.id === risingSign.id;
                  const isMoon = s.id === moonSign.id;

                  return (
                    <g key={s.id}>
                      {/* House Divider Line */}
                      <line
                        x1="180"
                        y1="180"
                        x2={x1}
                        y2={y1}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                      />
                      {/* Zodiac Symbol */}
                      <text
                        x={xText}
                        y={yText}
                        fill={isSun ? '#fbbf24' : isAsc ? '#38bdf8' : isMoon ? '#c084fc' : '#888888'}
                        fontSize={isSun || isAsc || isMoon ? '18' : '13'}
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

                {/* Planet Placement Dots & Glyphs */}
                {planetaryPlacements.map((p, idx) => {
                  // Angle derived from house / degree
                  const angleDeg = (p.house - 1) * 30 + (p.degree || 15);
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const rPlanet = 112;
                  const px = 180 + rPlanet * Math.cos(angleRad);
                  const py = 180 + rPlanet * Math.sin(angleRad);

                  return (
                    <g key={p.planet}>
                      <circle cx={px} cy={py} r="10" fill="#181824" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                      <text
                        x={px}
                        y={py}
                        fill="#38bdf8"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="transform rotate-90"
                        style={{ transformOrigin: `${px}px ${py}px` }}
                      >
                        {p.planetSymbol}
                      </text>
                    </g>
                  );
                })}

                {/* Cardinal Axes: ASC (Left), DSC (Right), MC (Top), IC (Bottom) */}
                <line x1="10" y1="180" x2="350" y2="180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                <line x1="180" y1="10" x2="180" y2="350" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />

                {/* Center Core Circle */}
                <circle cx="180" cy="180" r="50" fill="#09090f" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              </svg>

              {/* Center Info Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl">✨</span>
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                  DOĞUM ÇARKI
                </span>
                <span className="text-[9px] font-mono text-amber-300 font-bold">
                  {sunSign.symbol} ☉ {risingSign.symbol} ↑
                </span>
              </div>
            </div>

            {/* Narrative & Deep Interpretation */}
            <div className="space-y-4 text-xs font-sans leading-relaxed text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <h4 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                  Kozmik İmzanızın Bütünsel Analizi
                </h4>
              </div>

              <p>
                Güneş burcunuz <strong>{sunSign.name}</strong>, yaşam enerjinizi ve temel karakterinizi belirler. 
                Yükselen burcunuz <strong>{risingSign.name}</strong> (1. Ev), dünyaya sunduğunuz maske ve ilk intibadır. 
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
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Tarot Rehberi:</span>
                  <span className="text-purple-300 font-bold">{sunSign.tarotCard.guidance}</span>
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
      )}

      {/* TAB 2: Planetary Placements Table */}
      {activeTab === 'planets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Orbit className="text-cyan-400" size={18} />
                7 Klasik Gezegen Yerleşimi & Ev Dağılımı
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Doğum anınızdaki gezegenlerin bulunduğu burçlar, dereceler ve hayat alanları (evler).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planetaryPlacements.map((p) => (
              <div
                key={p.planet}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-lg font-bold border border-cyan-500/30">
                      {p.planetSymbol}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.planet}</h4>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {p.degree}° {p.sign} {p.signSymbol}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10">
                    {p.house}. Ev
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                  {p.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 12 Astrological Houses Guide */}
      {activeTab === 'houses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="text-purple-400" size={18} />
                12 Astrolojik Ev (Dodekatemoria)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Her ev insanın yaşamındaki belirli bir alanı yönetir. İncelemek istediğiniz eve tıklayın.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ASTROLOGICAL_HOUSES.map((h) => {
              const isSelected = selectedHouse?.number === h.number;
              return (
                <div
                  key={h.number}
                  onClick={() => setSelectedHouse(h)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all duration-300 space-y-2 ${
                    isSelected
                      ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_20px_rgba(192,132,252,0.2)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {h.title}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {h.traditionalName}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    {h.area}
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {h.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/5">
                    <span>Doğal Yöneticisi: <strong>{h.governingSign}</strong></span>
                    <span className="text-purple-300">Detay Gör →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected House Modal / Drawer */}
          {selectedHouse && (
            <div className="p-5 rounded-2xl border border-purple-500/40 bg-purple-950/30 backdrop-blur-xl flex flex-col sm:flex-row items-start justify-between gap-4 mt-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
                  Seçili Ev Analizi: {selectedHouse.title} ({selectedHouse.traditionalName})
                </div>
                <h4 className="text-base font-bold text-white">
                  {selectedHouse.area}
                </h4>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  {selectedHouse.description} Bu ev doğum haritanızda hangi gezegenle kesişiyorsa, o hayat alanında yoğun bir bilinç ve deneyim yaşanır.
                </p>
              </div>

              <button
                onClick={() => setSelectedHouse(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs shrink-0 cursor-pointer"
              >
                Kapat ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
