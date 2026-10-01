'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Telescope,
  BookOpen,
  Orbit,
  Info
} from 'lucide-react';
import {
  ZODIAC_SIGNS,
  ASTROLOGICAL_HOUSES,
  AstrologicalHouse,
  getSunSign,
  calculateAscendant,
  calculateMoonSign,
  calculatePlanetaryPlacements,
  calculateLifePathNumber,
  daysInMonth,
  localSolarHour
} from '@/data/zodiac';
import {
  ZodiacGlyph,
  PlanetGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph,
  AscendantGlyph
} from '@/components/ui/CosmicGlyphs';
import { POPULAR_LOCATIONS } from '@/utils/astronomy';
import { Ticks } from '@/components/motion/primitives';
import { NumericInput } from '@/components/ui/NumericInput';

interface AspectInfo {
  p1: string;
  p2: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  name: string;
  angle: number;
  exactAngle: number;
  orb: number;
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  interpretation: string;
}

// SVG Chart Geometry Constants
const WHEEL_SIZE = 420;
const CENTER = WHEEL_SIZE / 2;
const R_OUTER = 195;
const R_ZODIAC = 165;
const R_HOUSES = 135;
const R_PLANETS = 110;
const R_INNER = 75;

// Standard UTC offsets for the selectable birth cities (Turkey: UTC+3)
const CITY_UTC_OFFSET: Record<string, number> = {
  'Londra (Greenwich)': 0,
  'New York': -5,
  Tokyo: 9,
};

export function NatalChartCalculator() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(1998);
  const [hour, setHour] = useState(14);
  const [minute, setMinute] = useState(30);
  const [city, setCity] = useState(POPULAR_LOCATIONS[0].city);
  const fid = useId();
  const maxDay = daysInMonth(month, year);

  const changeMonth = (next: number) => {
    setMonth(next);
    setDay((d) => Math.min(d, daysInMonth(next, year)));
  };
  const changeYear = (next: number) => {
    setYear(next);
    setDay((d) => Math.min(d, daysInMonth(month, next)));
  };

  // Local apparent solar hour: clock time corrected by the city's offset from its zone meridian
  const location = POPULAR_LOCATIONS.find((l) => l.city === city) ?? POPULAR_LOCATIONS[0];
  const zoneOffset = CITY_UTC_OFFSET[city] ?? 3;
  const solarHourNorm = localSolarHour(hour, minute, location.longitude, zoneOffset);

  // Active view tab: 'trinity' | 'planets' | 'houses' | 'poster'
  const [activeTab, setActiveTab] = useState<'trinity' | 'planets' | 'houses' | 'poster'>('trinity');
  const [selectedHouse, setSelectedHouse] = useState<AstrologicalHouse | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectInfo | null>(null);

  // Compute Core Signs & Planetary Placements
  const { sunSign, risingSign, risingSignIndex, moonSign, planetaryPlacements } = useMemo(() => {
    const sun = getSunSign(month, day);
    const sunIdx = ZODIAC_SIGNS.findIndex((s) => s.id === sun.id);
    const rising = calculateAscendant(sunIdx, solarHourNorm);
    const risingIdx = ZODIAC_SIGNS.findIndex((s) => s.id === rising.id);
    return {
      sunSign: sun,
      risingSign: rising,
      risingSignIndex: risingIdx,
      moonSign: calculateMoonSign(sunIdx, day),
      planetaryPlacements: calculatePlanetaryPlacements(sunIdx, risingIdx, day, year),
    };
  }, [month, day, solarHourNorm, year]);

  const lifePath = useMemo(() => {
    return calculateLifePathNumber(day, month, year);
  }, [day, month, year]);

  // Elemental vector glyph map
  const elementGlyphs = {
    Ateş: <FireElementGlyph size={14} className="text-gold" />,
    Toprak: <EarthElementGlyph size={14} className="text-lime" />,
    Hava: <AirElementGlyph size={14} className="text-primary" />,
    Su: <WaterElementGlyph size={14} className="text-blue-400" />
  };

  // Compute exact celestial angles for planets (0° - 360°)
  const planetPositions = useMemo(() => {
    return planetaryPlacements.map((p) => {
      // Find sign index
      const sIdx = ZODIAC_SIGNS.findIndex((s) => s.name === p.sign);
      const signDeg = (sIdx >= 0 ? sIdx : 0) * 30 + (p.degree || 15);
      // ASC is traditionally mapped to the Eastern Horizon (Left / 180° in standard chart projection)
      // Standard astrological wheel: Counter-clockwise from Ascendant at 9 o'clock (180°)
      const ascSignIdx = risingSignIndex >= 0 ? risingSignIndex : 0;
      const ascDeg = ascSignIdx * 30;
      const chartAngle = (signDeg - ascDeg + 180 + 360) % 360;
      const rad = (chartAngle * Math.PI) / 180;

      const px = CENTER + R_PLANETS * Math.cos(rad);
      const py = CENTER + R_PLANETS * Math.sin(rad);

      // Planet chord connection point on inner aspect circle
      const cx = CENTER + R_INNER * Math.cos(rad);
      const cy = CENTER + R_INNER * Math.sin(rad);

      return {
        ...p,
        chartAngle,
        rad,
        x: px,
        y: py,
        chordX: cx,
        chordY: cy,
        totalDeg: signDeg
      };
    });
  }, [planetaryPlacements, risingSignIndex]);

  // Compute Major Aspects between Planets
  const aspects = useMemo<AspectInfo[]>(() => {
    const list: AspectInfo[] = [];
    const aspectTypes = [
      { type: 'conjunction' as const, name: 'Kavuşum (0°)', target: 0, orb: 8, color: '#00d4ff', interp: 'Enerjilerin yoğunlaşması ve odaklı birlik' },
      { type: 'sextile' as const, name: 'Sekstil (60°)', target: 60, orb: 5, color: '#d4ff3d', interp: 'Fırsatlar, yetenekler ve akıcı iletişim' },
      { type: 'square' as const, name: 'Kare (90°)', target: 90, orb: 7, color: '#ff3d7f', interp: 'Dönüştürücü sürtüşme, dinamik gerilim ve büyüme' },
      { type: 'trine' as const, name: 'Üçgen (120°)', target: 120, orb: 8, color: '#e5c158', interp: 'Zahmetsiz uyum, doğal şans ve sanatsal akış' },
      { type: 'opposition' as const, name: 'Karşıt (180°)', target: 180, orb: 8, color: '#ff5b22', interp: 'Kutup dengesi, farkındalık ve yüzleşme' },
    ];

    for (let i = 0; i < planetPositions.length; i++) {
      for (let j = i + 1; j < planetPositions.length; j++) {
        const p1 = planetPositions[i];
        const p2 = planetPositions[j];

        let diff = Math.abs(p1.totalDeg - p2.totalDeg) % 360;
        if (diff > 180) diff = 360 - diff;

        for (const asp of aspectTypes) {
          const orb = Math.abs(diff - asp.target);
          if (orb <= asp.orb) {
            list.push({
              p1: p1.planet,
              p2: p2.planet,
              type: asp.type,
              name: asp.name,
              angle: asp.target,
              exactAngle: parseFloat(diff.toFixed(1)),
              orb: parseFloat(orb.toFixed(1)),
              color: asp.color,
              x1: p1.chordX,
              y1: p1.chordY,
              x2: p2.chordX,
              y2: p2.chordY,
              interpretation: `${p1.planet} & ${p2.planet} ${asp.name}: ${asp.interp}`
            });
            break;
          }
        }
      }
    }
    return list;
  }, [planetPositions]);

  return (
    <div id="dogum-haritasi" className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>GÖKYÜZÜ KOORDİNATLARI & NATAL ÇARK</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Doğum Haritası, Gezegenler <span className="serif-i text-gold">& Açı Şebekesi</span>
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Doğum anınızdaki gezegen açılarını, Placidus ev cusplarını ve 360° zodyak çarkını İsviçre hassasiyetindeki vektör çizimlerle inceleyin.
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
            Natal Çark & Üçlü Benlik
          </button>
          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'planets'
                ? 'bg-paper text-ink'
                : 'text-muted hover:text-paper'
            }`}
          >
            Gezegen Yerleşimleri
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
          <button
            onClick={() => setActiveTab('poster')}
            className={`px-3 py-1.5 font-bold transition-all cursor-pointer ${
              activeTab === 'poster'
                ? 'bg-gold text-ink'
                : 'text-gold hover:text-paper border border-gold/40'
            }`}
          >
            Doğum Kartı Posteri
          </button>
        </div>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line font-mono text-xs">
        {/* Day */}
        <div className="bg-ink-2 p-3">
          <label htmlFor={`${fid}-day`} className="label text-muted block mb-1 text-[10px]">GÜN</label>
          <NumericInput
            id={`${fid}-day`}
            min={1}
            max={maxDay}
            value={day}
            onValueChange={setDay}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Month */}
        <div className="bg-ink-2 p-3">
          <label htmlFor={`${fid}-month`} className="label text-muted block mb-1 text-[10px]">AY</label>
          <select
            id={`${fid}-month`}
            value={month}
            onChange={(e) => changeMonth(parseInt(e.target.value, 10))}
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
          <label htmlFor={`${fid}-year`} className="label text-muted block mb-1 text-[10px]">YIL</label>
          <NumericInput
            id={`${fid}-year`}
            min={1920}
            max={2030}
            value={year}
            onValueChange={changeYear}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Hour */}
        <div className="bg-ink-2 p-3">
          <label htmlFor={`${fid}-hour`} className="label text-muted block mb-1 text-[10px]">SAAT (0-23)</label>
          <NumericInput
            id={`${fid}-hour`}
            min={0}
            max={23}
            value={hour}
            onValueChange={setHour}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* Minute */}
        <div className="bg-ink-2 p-3">
          <label htmlFor={`${fid}-minute`} className="label text-muted block mb-1 text-[10px]">DAKİKA</label>
          <NumericInput
            id={`${fid}-minute`}
            min={0}
            max={59}
            value={minute}
            onValueChange={setMinute}
            className="w-full bg-transparent text-sm font-bold text-paper outline-none"
          />
        </div>

        {/* City */}
        <div className="bg-ink-2 p-3">
          <label htmlFor={`${fid}-city`} className="label text-muted block mb-1 text-[10px]">DOĞUM ŞEHRİ</label>
          <select
            id={`${fid}-city`}
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

      {/* Numerology Life Path Banner */}
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
          {day} + {month} + {year} = Titreşim: <strong className="text-paper">{lifePath.number}</strong>
        </div>
      </div>

      {/* TAB 1: Core Trinity & High-Precision Interactive Natal Wheel */}
      {activeTab === 'trinity' && (
        <div className="space-y-8">
          {/* Trinity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
            {/* 1. Sun Sign */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlanetGlyph planet="sun" size={18} className="text-gold" />
                  <span className="label text-gold">GÜNEŞ BURCU (ÖZ BENLİK)</span>
                </div>
                <ZodiacGlyph sign={sunSign.id} size={32} className="text-gold" />
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{sunSign.name}</h3>
              <div className="label text-muted mt-1">{sunSign.dates}</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1.5">
                    {elementGlyphs[sunSign.element]}
                    {sunSign.element} ({sunSign.modality})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Yönetici Gezegen:</span>
                  <span className="text-paper font-bold">{sunSign.rulingPlanet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Motto:</span>
                  <span className="text-gold serif-i">{sunSign.traits.motto}</span>
                </div>
              </div>
            </div>

            {/* 2. Rising Sign (Ascendant) */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AscendantGlyph size={18} className="text-lime" />
                  <span className="label text-lime">YÜKSELEN (DOĞU UFKU / 1. EV)</span>
                </div>
                <ZodiacGlyph sign={risingSign.id} size={32} className="text-lime" />
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{risingSign.name}</h3>
              <div className="label text-muted mt-1">1. Ev Başlangıcı (ASC)</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1.5">
                    {elementGlyphs[risingSign.element]}
                    {risingSign.element} ({risingSign.modality})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Dış Algı & Arketip:</span>
                  <span className="text-paper font-bold">{risingSign.traits.archetype}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Yönetici:</span>
                  <span className="text-lime font-bold">{risingSign.rulingPlanet}</span>
                </div>
              </div>
            </div>

            {/* 3. Moon Sign */}
            <div className="bg-ink-2 p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlanetGlyph planet="moon" size={18} className="text-violet" />
                  <span className="label text-violet">AY BURCU (İÇ DÜNYA)</span>
                </div>
                <ZodiacGlyph sign={moonSign.id} size={32} className="text-violet" />
              </div>

              <h3 className="display display-tight text-3xl font-black text-paper">{moonSign.name}</h3>
              <div className="label text-muted mt-1">Bilinçdışı Güvenlik & Ruh</div>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted">Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1.5">
                    {elementGlyphs[moonSign.element]}
                    {moonSign.element} ({moonSign.modality})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Duygusal Güç:</span>
                  <span className="text-violet font-bold">{moonSign.traits.strengths[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Motto:</span>
                  <span className="text-violet serif-i">{moonSign.traits.motto}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 360° Natal Wheel & Aspect Network */}
          <div className="border border-line bg-ink-2 p-6 lg:p-8 flex flex-col xl:flex-row items-center gap-8">
            {/* The SVG 360° Natal Wheel */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex-shrink-0 select-none">
              <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
                {/* 1. Concentric Degree & Guide Circles */}
                <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                <circle cx={CENTER} cy={CENTER} r={R_ZODIAC} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx={CENTER} cy={CENTER} r={R_HOUSES} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="#07070c" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

                {/* 2. 360° Fine Degree Ticks (Every 5° and 10°) */}
                {Array.from({ length: 72 }).map((_, i) => {
                  const deg = i * 5;
                  const rad = (deg * Math.PI) / 180;
                  const isMajor = deg % 30 === 0;
                  const isTen = deg % 10 === 0;
                  const tickLen = isMajor ? 8 : isTen ? 5 : 3;
                  const x1 = CENTER + R_OUTER * Math.cos(rad);
                  const y1 = CENTER + R_OUTER * Math.sin(rad);
                  const x2 = CENTER + (R_OUTER - tickLen) * Math.cos(rad);
                  const y2 = CENTER + (R_OUTER - tickLen) * Math.sin(rad);

                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={isMajor ? 1.5 : 0.8}
                    />
                  );
                })}

                {/* 3. 12 Zodiac Sign Ring Sectors */}
                {ZODIAC_SIGNS.map((s, idx) => {
                  const ascSignIdx = risingSignIndex >= 0 ? risingSignIndex : 0;
                  const ascDeg = ascSignIdx * 30;
                  const signStartAngle = (idx * 30 - ascDeg + 180 + 360) % 360;
                  const signMidAngle = (signStartAngle + 15) % 360;

                  const radStart = (signStartAngle * Math.PI) / 180;
                  const radMid = (signMidAngle * Math.PI) / 180;

                  // Divider line from R_HOUSES to R_OUTER
                  const x1 = CENTER + R_HOUSES * Math.cos(radStart);
                  const y1 = CENTER + R_HOUSES * Math.sin(radStart);
                  const x2 = CENTER + R_OUTER * Math.cos(radStart);
                  const y2 = CENTER + R_OUTER * Math.sin(radStart);

                  // Center position for sign icon
                  const rGlyph = (R_OUTER + R_ZODIAC) / 2;
                  const gx = CENTER + rGlyph * Math.cos(radMid);
                  const gy = CENTER + rGlyph * Math.sin(radMid);

                  const isSun = s.id === sunSign.id;
                  const isRising = s.id === risingSign.id;
                  const isMoon = s.id === moonSign.id;

                  const signColor = isSun
                    ? '#fbbf24'
                    : isRising
                    ? '#d4ff3d'
                    : isMoon
                    ? '#c084fc'
                    : 'rgba(255,255,255,0.45)';

                  return (
                    <g key={s.id}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      {/* Sign Glyph in sector */}
                      <g transform={`translate(${gx - 9}, ${gy - 9})`}>
                        <ZodiacGlyph sign={s.id} size={18} className="transition-transform hover:scale-125" style={{ color: signColor }} />
                      </g>
                    </g>
                  );
                })}

                {/* 4. 12 House Dividing Spokes and Roman Numerals */}
                {Array.from({ length: 12 }).map((_, hIdx) => {
                  const hAngle = hIdx * 30;
                  const rad = (hAngle * Math.PI) / 180;
                  const x1 = CENTER + R_INNER * Math.cos(rad);
                  const y1 = CENTER + R_INNER * Math.sin(rad);
                  const x2 = CENTER + R_HOUSES * Math.cos(rad);
                  const y2 = CENTER + R_HOUSES * Math.sin(rad);

                  // House label position
                  const labelRad = ((hAngle + 15) * Math.PI) / 180;
                  const rLabel = (R_HOUSES + R_INNER) / 2;
                  const lx = CENTER + rLabel * Math.cos(labelRad);
                  const ly = CENTER + rLabel * Math.sin(labelRad);

                  return (
                    <g key={hIdx}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                      <text
                        x={lx}
                        y={ly}
                        fill="rgba(255,255,255,0.3)"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {hIdx + 1}
                      </text>
                    </g>
                  );
                })}

                {/* 5. Major Chart Axes: ASC (Left), DSC (Right), MC (Top), IC (Bottom) */}
                <line x1={CENTER - R_OUTER - 6} y1={CENTER} x2={CENTER - R_INNER} y2={CENTER} stroke="#d4ff3d" strokeWidth="2.5" />
                <line x1={CENTER + R_INNER} y1={CENTER} x2={CENTER + R_OUTER + 6} y2={CENTER} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1={CENTER} y1={CENTER - R_OUTER - 6} x2={CENTER} y2={CENTER - R_INNER} stroke="#fbbf24" strokeWidth="2.5" />
                <line x1={CENTER} y1={CENTER + R_INNER} x2={CENTER} y2={CENTER + R_OUTER + 6} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Axis Labels */}
                <text x={CENTER - R_OUTER - 14} y={CENTER + 3} fill="#d4ff3d" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="end">ASC</text>
                <text x={CENTER + R_OUTER + 14} y={CENTER + 3} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="start">DSC</text>
                <text x={CENTER} y={CENTER - R_OUTER - 10} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="middle">MC</text>
                <text x={CENTER} y={CENTER + R_OUTER + 18} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="middle">IC</text>

                {/* 6. Aspect Chord Network in Central Void */}
                {aspects.map((asp, idx) => {
                  const isHovered = hoveredAspect === asp || hoveredPlanet === asp.p1 || hoveredPlanet === asp.p2;

                  return (
                    <line
                      key={idx}
                      x1={asp.x1}
                      y1={asp.y1}
                      x2={asp.x2}
                      y2={asp.y2}
                      stroke={asp.color}
                      strokeWidth={isHovered ? 2.5 : 1.2}
                      strokeOpacity={isHovered ? 0.95 : 0.45}
                      strokeDasharray={asp.type === 'square' || asp.type === 'opposition' ? '4 2' : undefined}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredAspect(asp)}
                      onMouseLeave={() => setHoveredAspect(null)}
                    />
                  );
                })}

                {/* 7. Planet Pins on Chart */}
                {planetPositions.map((p) => {
                  const isHovered = hoveredPlanet === p.planet;

                  return (
                    <g
                      key={p.planet}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPlanet(p.planet)}
                      onMouseLeave={() => setHoveredPlanet(null)}
                    >
                      {/* Connection ray from house radius to planet pin */}
                      <line x1={p.chordX} y1={p.chordY} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                      {/* Disc backing */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 14 : 11}
                        fill="#0e0e17"
                        stroke={isHovered ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
                        strokeWidth={isHovered ? 2 : 1}
                        className="transition-all"
                      />
                      {/* Planet Glyph */}
                      <g transform={`translate(${p.x - 7}, ${p.y - 7})`}>
                        <PlanetGlyph
                          planet={p.planet}
                          size={14}
                          className={isHovered ? 'text-gold' : 'text-paper'}
                        />
                      </g>
                    </g>
                  );
                })}

                {/* 8. Center Hub Core Overlay */}
                <circle cx={CENTER} cy={CENTER} r={42} fill="#06060c" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              </svg>

              {/* Center Info Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="label text-[9px] text-muted font-bold">
                  {sunSign.name} ☉
                </span>
                <span className="font-mono text-xs font-black text-gold">
                  {risingSign.name} ↑
                </span>
                <span className="label text-[8px] text-paper/50">
                  {aspects.length} Açı
                </span>
              </div>
            </div>

            {/* Side Aspect & Planetary Details Panel */}
            <div className="w-full space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="label text-gold flex items-center gap-1.5">
                  <Info size={13} />
                  Açı Şebekesi & Gezegen Fasetleri
                </span>
                <span className="label text-muted">{aspects.length} Aktif Majör Açı</span>
              </div>

              {/* Dynamic Aspect Telemetry Bar */}
              {hoveredAspect ? (
                <div className="border border-gold bg-gold/10 p-3 text-paper transition-all">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gold">{hoveredAspect.p1} & {hoveredAspect.p2}</span>
                    <span className="px-1.5 py-0.5 bg-gold text-ink text-[10px]">{hoveredAspect.name}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-paper/85 leading-relaxed font-sans">
                    {hoveredAspect.interpretation}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-[10px] text-muted">
                    <span>Açısal Fark: <strong className="text-paper">{hoveredAspect.exactAngle}°</strong></span>
                    <span>Tolerans (Orb): <strong className="text-paper">{hoveredAspect.orb}°</strong></span>
                  </div>
                </div>
              ) : (
                <div className="border border-line bg-ink p-3 text-muted text-[11px] leading-relaxed">
                  Çark üzerindeki renkli açı çizgilerine veya gezegen pinlerine gelerek Güneş, Ay ve gezegenler arasındaki majör açı geometrilerini (Üçgen, Kare, Sekstil, Karşıt) inceleyin.
                </div>
              )}

              {/* Aspect Legend Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                <span className="flex items-center gap-1 text-gold"><span className="h-2 w-2 rounded-full bg-gold" /> Üçgen (120°)</span>
                <span className="flex items-center gap-1 text-primary"><span className="h-2 w-2 rounded-full bg-primary" /> Kavuşum (0°)</span>
                <span className="flex items-center gap-1 text-lime"><span className="h-2 w-2 rounded-full bg-lime" /> Sekstil (60°)</span>
                <span className="flex items-center gap-1 text-rose-signal"><span className="h-2 w-2 rounded-full bg-rose-signal" /> Kare (90°)</span>
                <span className="flex items-center gap-1 text-solar"><span className="h-2 w-2 rounded-full bg-solar" /> Karşıt (180°)</span>
              </div>

              {/* Deep Narrative */}
              <div className="border border-line bg-ink p-4 space-y-2 text-xs font-sans text-paper/75 leading-relaxed">
                <p>
                  Doğum anınızdaki gök mekaniği, Güneş&apos;inizin <strong className="text-paper">{sunSign.name}</strong> burcundaki iradesi ile 1. Evinizi yöneten <strong className="text-paper">{risingSign.name}</strong> Yükseleninizi birleştirir.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[11px] border-t border-line">
                  <div>
                    <span className="text-muted block text-[10px]">Şanslı Sayılar</span>
                    <span className="text-gold font-bold">{sunSign.details.luckyNumbers.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Kozmik Taş</span>
                    <span className="text-paper font-bold">{sunSign.details.stone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
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
                Gezegen Yerleşimleri & Ev Dağılımı
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Doğum anınızdaki gezegenlerin bulunduğu burçlar, dereceler ve hayat alanları (evler).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-line bg-line">
            {planetaryPlacements.map((p) => {
              const signData = ZODIAC_SIGNS.find((s) => s.name === p.sign);

              return (
                <div
                  key={p.planet}
                  className="bg-ink-2 p-4 hover:bg-ink-3 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 bg-ink border border-line text-paper flex items-center justify-center">
                        <PlanetGlyph planet={p.planet} size={18} className="text-gold" />
                      </span>
                      <div>
                        <h4 className="display display-tight text-sm font-bold text-paper">{p.planet}</h4>
                        <div className="flex items-center gap-1.5 label text-[10px] text-muted">
                          {signData && <ZodiacGlyph sign={signData.id} size={12} className="text-paper/70" />}
                          <span>{p.degree}° {p.sign}</span>
                        </div>
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
              );
            })}
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
              const govSign = ZODIAC_SIGNS.find((s) => s.name === h.governingSign);

              return (
                <button
                  type="button"
                  key={h.number}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedHouse(h)}
                  className={`block w-full text-left p-4 cursor-pointer transition-all duration-300 space-y-2 ${
                    isSelected
                      ? 'bg-violet/15 text-paper border border-violet/50'
                      : 'bg-ink-2 hover:bg-ink-3 text-paper'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="label text-xs font-bold text-violet">
                      {h.title}
                    </span>
                    <span className="label text-[10px] text-muted">
                      {h.traditionalName}
                    </span>
                  </span>

                  <span className="block display display-tight text-sm font-bold text-paper">
                    {h.area}
                  </span>

                  <span className="block text-xs text-paper/75 line-clamp-2 leading-relaxed">
                    {h.description}
                  </span>

                  <span className="pt-2 flex items-center justify-between label text-[10px] text-muted border-t border-line">
                    <span className="flex items-center gap-1.5">
                      {govSign && <ZodiacGlyph sign={govSign.id} size={11} className="text-violet" />}
                      Doğal Yöneticisi: <strong className="text-paper">{h.governingSign}</strong>
                    </span>
                    <span className="text-violet">Detay Gör →</span>
                  </span>
                </button>
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

      {/* 4. TAB: POSTER / ARŞİV BELGESİ */}
      {activeTab === 'poster' && (
        <div className="space-y-6">
          <div className="border border-gold/40 bg-ink-2 p-6 sm:p-10 relative overflow-hidden text-paper space-y-8">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <ZodiacGlyph sign={sunSign.id} size={280} className="text-gold" />
            </div>

            {/* Poster Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
              <div>
                <div className="label text-gold text-xs tracking-widest uppercase">
                  ARŞİV BELGESİ № ASTRO-NATALIS-{year}{String(month).padStart(2, '0')}{String(day).padStart(2, '0')}
                </div>
                <h3 className="display display-tight text-3xl sm:text-5xl text-paper mt-1">
                  Doğum Gök Atlası & Kozmik İmzası
                </h3>
              </div>
              <div className="text-right font-mono text-xs text-muted">
                <div>DOĞUM KOORDİNATI</div>
                <div className="text-paper font-bold">{city}</div>
                <div>{location.latitude.toFixed(2)}°K, {location.longitude.toFixed(2)}°D</div>
              </div>
            </div>

            {/* Poster Core Grid */}
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Scaled Wheel */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-square border border-line rounded-full p-2 bg-ink/60 shadow-[0_0_30px_rgba(255,215,0,0.06)]">
                  {/* Wheel SVG */}
                  <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
                    <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <circle cx={CENTER} cy={CENTER} r={R_ZODIAC} fill="none" stroke="var(--line)" strokeWidth="0.8" />
                    <circle cx={CENTER} cy={CENTER} r={R_HOUSES} fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.4" />
                    <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="var(--ink)" stroke="var(--line)" strokeWidth="1" />

                    {/* 12 Zodiac Segments */}
                    {ZODIAC_SIGNS.map((s, idx) => {
                      const rot = idx * 30 - 90;
                      const rad = (rot * Math.PI) / 180;
                      const x = CENTER + (R_ZODIAC + 15) * Math.cos(rad + (15 * Math.PI) / 180);
                      const y = CENTER + (R_ZODIAC + 15) * Math.sin(rad + (15 * Math.PI) / 180);
                      return (
                        <g key={s.id}>
                          <line
                            x1={CENTER + R_HOUSES * Math.cos(rad)}
                            y1={CENTER + R_HOUSES * Math.sin(rad)}
                            x2={CENTER + R_OUTER * Math.cos(rad)}
                            y2={CENTER + R_OUTER * Math.sin(rad)}
                            stroke="var(--line)"
                            strokeWidth="0.8"
                          />
                          <g transform={`translate(${x - 9}, ${y - 9})`}>
                            <ZodiacGlyph sign={s.id} size={18} className="text-gold opacity-90" />
                          </g>
                        </g>
                      );
                    })}

                    <circle cx={CENTER} cy={CENTER} r={2} fill="var(--gold)" />
                    <circle cx={CENTER} cy={CENTER} r={18} fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="2 2" />
                  </svg>
                </div>
              </div>

              {/* Trinity & Placement Badges */}
              <div className="lg:col-span-6 space-y-6">
                <div className="grid grid-cols-2 gap-px border border-line bg-line">
                  <div className="bg-ink p-4 space-y-1">
                    <span className="label text-gold text-[10px]">GÜNEŞ (ÖZ KİMLİK)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <ZodiacGlyph sign={sunSign.id} size={22} className="text-gold" />
                      <div className="text-sm font-bold text-paper">{sunSign.name}</div>
                    </div>
                    <div className="text-[10px] text-muted">{sunSign.element} · {sunSign.modality}</div>
                  </div>

                  <div className="bg-ink p-4 space-y-1">
                    <span className="label text-paper text-[10px]">AY (DUYGU & BİLİNÇDIŞI)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <ZodiacGlyph sign={moonSign.id} size={22} className="text-paper" />
                      <div className="text-sm font-bold text-paper">{moonSign.name}</div>
                    </div>
                    <div className="text-[10px] text-muted">{moonSign.element} · {moonSign.modality}</div>
                  </div>

                  <div className="bg-ink p-4 space-y-1">
                    <span className="label text-violet text-[10px]">YÜKSELEN (ASC / MASKE)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <ZodiacGlyph sign={risingSign.id} size={22} className="text-violet" />
                      <div className="text-sm font-bold text-paper">{risingSign.name}</div>
                    </div>
                    <div className="text-[10px] text-muted">{risingSign.element} · {risingSign.modality}</div>
                  </div>

                  <div className="bg-ink p-4 space-y-1">
                    <span className="label text-gold text-[10px]">YAŞAM YOLU SAYISI</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="display display-tight text-2xl text-gold">{lifePath.number}</span>
                      <span className="text-xs font-semibold text-paper truncate">{lifePath.title}</span>
                    </div>
                    <div className="text-[10px] text-muted">Pisagor Kutsal Sayısı</div>
                  </div>
                </div>

                <div className="border-l-2 border-gold pl-4 py-2 bg-ink/40">
                  <div className="label text-gold text-[10px]">KOZMİK YAŞAM REHBERİ</div>
                  <p className="text-xs leading-relaxed text-paper/85 mt-1">
                    {sunSign.name} Güneşi’nin iradesi, {risingSign.name} Yükseleni’nin dış dünyayla kurduğu temas ve {moonSign.name} Ayı’nın sezgisel derinliğiyle birleşiyor. Yaşam yolunuzdaki {lifePath.title} misyonu sizi daima hakikate taşır.
                  </p>
                </div>
              </div>
            </div>

            {/* Poster Actions Footer */}
            <div className="border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="label text-muted text-xs">
                SPACETOUR.TR · İSVİÇRE GRAVÜR STANDARDI · {day}.{month}.{year} {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="label px-5 py-2.5 border border-gold bg-gold text-ink font-bold hover:bg-gold/90 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Posteri Yazdır / PDF Olarak Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
