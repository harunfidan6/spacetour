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
  BookOpen,
  Orbit
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
import { Ticks } from '@/components/motion/primitives';

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
    Ateş: <Flame className="text-gold" size={14} />,
    Toprak: <Globe2 className="text-lime" size={14} />,
    Hava: <Wind className="text-primary" size={14} />,
    Su: <Droplets className="text-blue-400" size={14} />
  };

  return (
    <div id="dogum-haritasi" className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>GÖKYÜZÜ KOORDİNATLARI & DOĞUM HARİTASI</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Doğum Haritası, Gezegenler <span className="serif-i text-gold">& Numeroloji</span>
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Doğum anınızdaki gökyüzü konumlarını, Güneş, Yükselen, Ay ve 7 kadim gezegenin ev yerleşimlerini ve Pisagor yaşam yolu sayınızı anında hesaplayın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 border border-line bg-ink-2 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('trinity')}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'trinity'
                ? 'bg-gold text-ink'
                : 'text-muted hover:text-paper'
            }`}
          >
            Üçlü Benlik (Güneş/Ay/ASC)
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'planets'
                ? 'bg-paper text-ink'
                : 'text-muted hover:text-paper'
            }`}
          >
            7 Gezegen Konumu
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'houses'
                ? 'bg-violet text-ink'
                : 'text-muted hover:text-paper'
            }`}
          >
            12 Astrolojik Ev
          </button>
        </div>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line font-mono text-xs">
        {/* Day */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">GÜN</label>
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value) || 1)}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Month */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">AY</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none cursor-pointer"
          >
            {[
              'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
              'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
            ].map((mName, idx) => (
              <option key={mName} value={idx + 1} className="bg-ink-2 text-paper">
                {mName}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">YIL</label>
          <input
            type="number"
            min={1920}
            max={2030}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || 2000)}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Hour */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">SAAT (0-23)</label>
          <input
            type="number"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value) || 0)}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Minute */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">DAKİKA</label>
          <input
            type="number"
            min={0}
            max={59}
            value={minute}
            onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* City */}
        <div className="bg-ink-2 p-3">
          <label className="label text-muted block mb-1 text-[10px]">DOĞUM ŞEHRİ</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none cursor-pointer"
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">
                {loc.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Numerology Life Path Number Bar */}
      <div className="border border-line bg-ink-2 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-violet/20 border border-violet/40 flex items-center justify-center text-violet font-mono text-2xl font-black">
            {lifePath.number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="label text-[10px] text-violet font-bold">
                PİSAGOR YAŞAM YOLU SAYISI (NUMEROLOJİ)
              </span>
              <span className="label text-[10px] bg-violet/20 text-violet px-2 py-0.5 border border-violet/30 font-mono font-bold">
                No: {lifePath.number}
              </span>
            </div>
            <h4 className="display display-tight text-base font-bold text-paper mt-1">
              {lifePath.title}
            </h4>
            <p className="text-xs text-paper/75 mt-0.5">
              {lifePath.description}
            </p>
          </div>
        </div>

        <div className="label text-muted bg-ink px-3 py-1.5 border border-line shrink-0">
          {day} + {month} + {year} = Yaşam Titreşimi: <strong className="text-paper">{lifePath.number}</strong>
        </div>
      </div>

      {/* TAB 1: Core Trinity (Güneş, Yükselen, Ay) */}
      {activeTab === 'trinity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
            {/* 1. Sun Sign */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="text-gold" size={16} />
                  <span className="label text-gold">
                    GÜNEŞ BURCU (ÖZ BENLİK)
                  </span>
                </div>
                <span className="glyph text-3xl text-gold">{sunSign.symbol}</span>
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{sunSign.name}</h3>
              <div className="label text-muted mt-1">{sunSign.dates}</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1">
                    {elementIcons[sunSign.element]}
                    {sunSign.element} ({sunSign.modality})
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Yönetici Gezegen:</span>
                  <span className="text-paper font-bold">{sunSign.rulingPlanet}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Motto:</span>
                  <span className="text-gold serif-i">{sunSign.traits.motto}</span>
                </div>
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-muted">Tarot Arketipi:</span>
                  <span className="text-gold font-bold">{sunSign.tarotCard.name} ({sunSign.tarotCard.number})</span>
                </div>
              </div>
            </div>

            {/* 2. Rising Sign (Ascendant) */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="text-lime" size={16} />
                  <span className="label text-lime">
                    YÜKSELEN BURÇ (DIŞ DÜNYA MASKESİ)
                  </span>
                </div>
                <span className="glyph text-3xl text-lime">{risingSign.symbol}</span>
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{risingSign.name}</h3>
              <div className="label text-muted mt-1">Doğu Ufku Yükseleni (ASC - 1. Ev)</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1">
                    {elementIcons[risingSign.element]}
                    {risingSign.element} ({risingSign.modality})
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Dış Algı & Arketip:</span>
                  <span className="text-paper font-bold">{risingSign.traits.archetype}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Motto:</span>
                  <span className="text-lime serif-i">{risingSign.traits.motto}</span>
                </div>
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-muted">Yönetici:</span>
                  <span className="text-paper font-bold">{risingSign.rulingPlanet}</span>
                </div>
              </div>
            </div>

            {/* 3. Moon Sign */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Moon className="text-violet" size={16} />
                  <span className="label text-violet">
                    AY BURCU (İÇ DÜNYA & DUYGULAR)
                  </span>
                </div>
                <span className="glyph text-3xl text-violet">{moonSign.symbol}</span>
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{moonSign.name}</h3>
              <div className="label text-muted mt-1">Bilinçdışı Güvenlik & Duygular</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1">
                    {elementIcons[moonSign.element]}
                    {moonSign.element} ({moonSign.modality})
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Duygusal Tepki:</span>
                  <span className="text-violet font-bold">{moonSign.traits.strengths[0]}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-muted">Motto:</span>
                  <span className="text-violet serif-i">{moonSign.traits.motto}</span>
                </div>
                <div className="flex justify-between font-mono pt-1">
                  <span className="text-muted">Gölge Yön:</span>
                  <span className="text-rose-signal font-bold">{moonSign.traits.shadows[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 360° Natal Wheel Visualization (SVG) */}
          <div className="border border-line bg-ink-2 p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8">
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
                {planetaryPlacements.map((p) => {
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
                <span className="label text-[10px] text-muted font-bold mt-0.5">
                  DOĞUM ÇARKI
                </span>
                <span className="label text-[9px] text-gold font-bold">
                  {sunSign.symbol} ☉ {risingSign.symbol} ↑
                </span>
              </div>
            </div>

            {/* Narrative & Deep Interpretation */}
            <div className="space-y-4 text-xs font-sans leading-relaxed text-paper/75">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <h4 className="display display-tight text-base font-bold text-paper uppercase tracking-wide">
                  Kozmik İmzanızın Bütünsel Analizi
                </h4>
              </div>

              <p>
                Güneş burcunuz <strong className="text-paper">{sunSign.name}</strong>, yaşam enerjinizi ve temel karakterinizi belirler. 
                Yükselen burcunuz <strong className="text-paper">{risingSign.name}</strong> (1. Ev), dünyaya sunduğunuz maske ve ilk intibadır. 
                Ay burcunuz <strong className="text-paper">{moonSign.name}</strong> ise sadece en yakınlarınızın bildiği içsel duygusal derinliğinizi temsil eder.
              </p>

              <div className="border border-line bg-ink p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-muted">
                  <span>Şanslı Sayılar:</span>
                  <span className="text-paper font-bold">{sunSign.details.luckyNumbers.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <span>Kozmik Taş:</span>
                  <span className="text-gold font-bold">{sunSign.details.stone}</span>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <span>Mitolojik Arketip:</span>
                  <span className="text-paper font-bold">{sunSign.traits.archetype}</span>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <span>Tarot Rehberi:</span>
                  <span className="text-violet font-bold">{sunSign.tarotCard.guidance}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/harita"
                  className="inline-flex items-center gap-2 text-gold hover:text-paper font-mono text-xs font-bold transition-colors"
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
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="display display-tight text-lg font-bold text-paper flex items-center gap-2">
                <Orbit className="text-paper" size={18} />
                7 Klasik Gezegen Yerleşimi & Ev Dağılımı
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Doğum anınızdaki gezegenlerin bulunduğu burçlar, dereceler ve hayat alanları (evler).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-line bg-line">
            {planetaryPlacements.map((p) => (
              <div
                key={p.planet}
                className="bg-ink-2 p-4 hover:bg-ink-3 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 bg-ink border border-line text-paper flex items-center justify-center text-lg font-bold">
                      {p.planetSymbol}
                    </span>
                    <div>
                      <h4 className="display display-tight text-sm font-bold text-paper">{p.planet}</h4>
                      <span className="label text-[10px] text-muted">
                        {p.degree}° {p.sign} {p.signSymbol}
                      </span>
                    </div>
                  </div>

                  <span className="label text-xs font-bold px-2.5 py-1 bg-ink text-gold border border-line">
                    {p.house}. Ev
                  </span>
                </div>

                <p className="text-xs text-paper/75 leading-relaxed pt-1">
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
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="display display-tight text-lg font-bold text-paper flex items-center gap-2">
                <BookOpen className="text-violet" size={18} />
                12 Astrolojik Ev (Dodekatemoria)
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Her ev insanın yaşamındaki belirli bir alanı yönetir. İncelemek istediğiniz eve tıklayın.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-line bg-line">
            {ASTROLOGICAL_HOUSES.map((h) => {
              const isSelected = selectedHouse?.number === h.number;
              return (
                <div
                  key={h.number}
                  onClick={() => setSelectedHouse(h)}
                  className={`p-4 cursor-pointer transition-all duration-300 space-y-2 ${
                    isSelected
                      ? 'bg-violet/15 text-paper'
                      : 'bg-ink-2 hover:bg-ink-3 text-paper'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="label text-xs font-bold text-violet">
                      {h.title}
                    </span>
                    <span className="label text-[10px] text-muted">
                      {h.traditionalName}
                    </span>
                  </div>

                  <div className="display display-tight text-sm font-bold text-paper">
                    {h.area}
                  </div>

                  <p className="text-xs text-paper/75 line-clamp-2 leading-relaxed">
                    {h.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between label text-[10px] text-muted border-t border-line">
                    <span>Doğal Yöneticisi: <strong className="text-paper">{h.governingSign}</strong></span>
                    <span className="text-violet">Detay Gör →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected House Modal / Drawer */}
          {selectedHouse && (
            <div className="p-5 border border-violet bg-ink-2 flex flex-col sm:flex-row items-start justify-between gap-4 mt-4">
              <div className="space-y-1">
                <div className="label text-xs text-violet font-bold">
                  Seçili Ev Analizi: {selectedHouse.title} ({selectedHouse.traditionalName})
                </div>
                <h4 className="display display-tight text-base font-bold text-paper">
                  {selectedHouse.area}
                </h4>
                <p className="text-xs text-paper/75 max-w-2xl leading-relaxed">
                  {selectedHouse.description} Bu ev doğum haritanızda hangi gezegenle kesişiyorsa, o hayat alanında yoğun bir bilinç ve deneyim yaşanır.
                </p>
              </div>

              <button
                onClick={() => setSelectedHouse(null)}
                className="label px-3 py-1.5 border border-line bg-ink hover:bg-ink-3 text-paper shrink-0 cursor-pointer"
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
