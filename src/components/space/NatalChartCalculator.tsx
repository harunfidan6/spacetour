'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  ZODIAC_SIGNS,
  ASTROLOGICAL_HOUSES,
  AstrologicalHouse,
  calculatePlanetaryPlacements,
  calculateLifePathNumber,
  daysInMonth,
} from '@/data/zodiac';
import { longitude, signIndex } from '@/lib/astrology/dailySky';
import { ascendantLongitude, birthInstant, turkeyUtcOffset } from '@/lib/astrology/natal';
import { natalReading } from '@/lib/astrology/natalReading';
import { NatalReadingPanel } from '@/components/astrology/NatalReadingPanel';
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

type NatalTab = 'reading' | 'trinity' | 'planets' | 'houses' | 'poster';

const TABS: { id: NatalTab; label: string }[] = [
  { id: 'reading', label: 'Kişisel yorum' },
  { id: 'trinity', label: 'Üçlü ve çark' },
  { id: 'planets', label: 'Gezegenler' },
  { id: 'houses', label: '12 ev' },
  { id: 'poster', label: 'Doğum kartı' },
];

// Açı renk anahtarı: çarktaki açı çizgileriyle aynı renkler (aspects hesabındaki aspectTypes)
const ASPECT_LEGEND = [
  { name: 'Üçgen (120°)', color: '#e5c158' },
  { name: 'Kavuşum (0°)', color: '#00d4ff' },
  { name: 'Sekstil (60°)', color: '#d4ff3d' },
  { name: 'Kare (90°)', color: '#ff3d7f' },
  { name: 'Karşıt (180°)', color: '#ff5b22' },
];

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
  // Turkish cities follow Türkiye's historical rules (UTC+2 with summer time before Sep 2016)
  const zoneOffset = CITY_UTC_OFFSET[city] ?? turkeyUtcOffset(year, month, day, hour);
  const instant = birthInstant(year, month, day, hour, minute, zoneOffset);

  // Active view tab: 'trinity' | 'planets' | 'houses' | 'poster'
  const [activeTab, setActiveTab] = useState<NatalTab>('reading');
  const [selectedHouse, setSelectedHouse] = useState<AstrologicalHouse | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectInfo | null>(null);

  // Compute Core Signs & Planetary Placements
  const { sunSign, risingSign, risingSignIndex, moonSign, planetaryPlacements } = (() => {
    // Real positions at the birth moment: the Sun's true longitude settles cusp birthdays,
    // the Ascendant comes from local sidereal time and the birthplace latitude
    const sunIdx = signIndex(longitude('sun', instant));
    const risingIdx = signIndex(ascendantLongitude(instant, location.latitude, location.longitude));
    return {
      sunSign: ZODIAC_SIGNS[sunIdx],
      risingSign: ZODIAC_SIGNS[risingIdx],
      risingSignIndex: risingIdx,
      moonSign: ZODIAC_SIGNS[signIndex(longitude('moon', instant))],
      planetaryPlacements: calculatePlanetaryPlacements(sunIdx, risingIdx, day, year, month, hour, minute, zoneOffset),
    };
  })();

  // Long-form personal reading from the real sky at the birth moment
  const reading = natalReading(instant, location.latitude, location.longitude);

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
  const planetPositions = (() => {
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
  })();

  // Compute Major Aspects between Planets
  const aspects = ((): AspectInfo[] => {
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
  })();

  // Haritanın tam çarkı (gezegenler, evler, eksenler, açılar): harita sekmesi ve poster ortak kullanır
  const wheelSvg = (
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
  );

  return (
    <div id="dogum-haritasi" className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık ve sekmeler */}
      <div className="space-y-5 border-b border-line pb-6">
        <div>
          <h2 className="display text-2xl text-paper sm:text-3xl">
            Doğum haritası, gezegenler ve açılar
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
            Doğum anınızdaki gezegen açılarını, Yükselen burçtan başlayan on iki evi (tam burç ev sistemi) ve 360° zodyak çarkını inceleyin.
          </p>
        </div>

        <div className="flex w-fit max-w-full flex-wrap gap-1 border border-line bg-ink-2 p-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-9 cursor-pointer px-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold text-ink' : 'text-paper/75 hover:bg-ink-3 hover:text-paper'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doğum bilgileri */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {/* Day */}
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-day`} className="mb-1 block text-xs text-paper/70">Gün</label>
          <NumericInput
            id={`${fid}-day`}
            min={1}
            max={maxDay}
            value={day}
            onValueChange={setDay}
            className="w-full bg-transparent font-mono text-base font-semibold text-paper outline-none"
          />
        </div>

        {/* Month */}
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-month`} className="mb-1 block text-xs text-paper/70">Ay</label>
          <select
            id={`${fid}-month`}
            value={month}
            onChange={(e) => changeMonth(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer bg-transparent text-base font-semibold text-paper outline-none"
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
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-year`} className="mb-1 block text-xs text-paper/70">Yıl</label>
          <NumericInput
            id={`${fid}-year`}
            min={1920}
            max={2030}
            value={year}
            onValueChange={changeYear}
            className="w-full bg-transparent font-mono text-base font-semibold text-paper outline-none"
          />
        </div>

        {/* Hour */}
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-hour`} className="mb-1 block text-xs text-paper/70">Saat (0–23)</label>
          <NumericInput
            id={`${fid}-hour`}
            min={0}
            max={23}
            value={hour}
            onValueChange={setHour}
            className="w-full bg-transparent font-mono text-base font-semibold text-paper outline-none"
          />
        </div>

        {/* Minute */}
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-minute`} className="mb-1 block text-xs text-paper/70">Dakika</label>
          <NumericInput
            id={`${fid}-minute`}
            min={0}
            max={59}
            value={minute}
            onValueChange={setMinute}
            className="w-full bg-transparent font-mono text-base font-semibold text-paper outline-none"
          />
        </div>

        {/* City */}
        <div className="bg-ink-2 px-3 py-2.5 focus-within:bg-ink-3">
          <label htmlFor={`${fid}-city`} className="mb-1 block text-xs text-paper/70">Doğum şehri</label>
          <select
            id={`${fid}-city`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-base font-semibold text-paper outline-none"
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">
                {loc.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Yaşam yolu sayısı */}
      <div className="flex flex-col gap-4 border border-line bg-ink-2 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-violet/40 font-mono text-2xl font-bold text-violet">
            {lifePath.number}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-paper/70">Yaşam yolu sayısı (Pisagor numerolojisi)</div>
            <h4 className="mt-0.5 text-base font-semibold text-paper">
              {lifePath.title}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-paper/80">
              {lifePath.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-sm text-paper/70 sm:text-right">
          <span className="font-mono">{day} + {month} + {year}</span> → titreşim{' '}
          <strong className="font-mono text-paper">{lifePath.number}</strong>
        </div>
      </div>

      {/* Sekme: kişisel yorum */}
      {activeTab === 'reading' && <NatalReadingPanel reading={reading} />}

      {/* Sekme: üçlü ve çark */}
      {activeTab === 'trinity' && (
        <div className="space-y-10">
          {/* Güneş, Yükselen, Ay */}
          <div className="grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-3">
            {/* 1. Sun Sign */}
            <div className="bg-ink-2 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-gold">
                  <PlanetGlyph planet="sun" size={16} className="shrink-0 text-gold" />
                  Güneş burcu (öz benlik)
                </span>
                <ZodiacGlyph sign={sunSign.id} size={28} className="shrink-0 text-gold" />
              </div>

              <h3 className="display mt-3 text-2xl text-paper">{sunSign.name}</h3>
              <div className="mt-1 text-sm text-paper/70">{sunSign.dates}</div>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Element</span>
                  <span className="flex items-center gap-1.5 text-right text-paper">
                    {elementGlyphs[sunSign.element]}
                    {sunSign.element} ({sunSign.modality})
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Yönetici gezegen</span>
                  <span className="text-right text-paper">{sunSign.rulingPlanet}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 text-paper/70">Motto</span>
                  <span className="text-right text-paper/85">{sunSign.traits.motto}</span>
                </div>
              </div>
            </div>

            {/* 2. Rising Sign (Ascendant) */}
            <div className="bg-ink-2 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-lime">
                  <AscendantGlyph size={16} className="shrink-0 text-lime" />
                  Yükselen (doğu ufku, 1. ev)
                </span>
                <ZodiacGlyph sign={risingSign.id} size={28} className="shrink-0 text-lime" />
              </div>

              <h3 className="display mt-3 text-2xl text-paper">{risingSign.name}</h3>
              <div className="mt-1 text-sm text-paper/70">1. ev başlangıcı (ASC)</div>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Element</span>
                  <span className="flex items-center gap-1.5 text-right text-paper">
                    {elementGlyphs[risingSign.element]}
                    {risingSign.element} ({risingSign.modality})
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 text-paper/70">Dış algı ve arketip</span>
                  <span className="text-right text-paper">{risingSign.traits.archetype}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Yönetici</span>
                  <span className="text-right text-paper">{risingSign.rulingPlanet}</span>
                </div>
              </div>
            </div>

            {/* 3. Moon Sign */}
            <div className="bg-ink-2 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-violet">
                  <PlanetGlyph planet="moon" size={16} className="shrink-0 text-violet" />
                  Ay burcu (iç dünya)
                </span>
                <ZodiacGlyph sign={moonSign.id} size={28} className="shrink-0 text-violet" />
              </div>

              <h3 className="display mt-3 text-2xl text-paper">{moonSign.name}</h3>
              <div className="mt-1 text-sm text-paper/70">Bilinçdışı güvenlik ve ruh</div>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Element</span>
                  <span className="flex items-center gap-1.5 text-right text-paper">
                    {elementGlyphs[moonSign.element]}
                    {moonSign.element} ({moonSign.modality})
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-paper/70">Duygusal güç</span>
                  <span className="text-right text-paper">{moonSign.traits.strengths[0]}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 text-paper/70">Motto</span>
                  <span className="text-right text-paper/85">{moonSign.traits.motto}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 360° çark ve açılar */}
          <div className="flex flex-col items-center gap-8 xl:flex-row xl:items-start">
            <div className="relative aspect-square w-full max-w-[420px] shrink-0 select-none xl:w-[420px]">
              {wheelSvg}

              {/* Çarkın ortası */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                <span className="text-[11px] text-paper/70">{sunSign.name} ☉</span>
                <span className="text-xs font-semibold text-gold">{risingSign.name} ↑</span>
                <span className="text-[11px] text-paper/70">{aspects.length} açı</span>
              </div>
            </div>

            {/* Açı ayrıntıları */}
            <div className="w-full min-w-0 space-y-5">
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                <span className="text-base font-semibold text-paper">Açılar</span>
                <span className="text-sm text-paper/70">{aspects.length} majör açı</span>
              </div>

              {hoveredAspect ? (
                <div className="border border-gold/50 bg-ink-2 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm font-semibold">
                    <span className="text-gold">{hoveredAspect.p1} & {hoveredAspect.p2}</span>
                    <span className="text-paper/85">{hoveredAspect.name}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-paper/85">
                    {hoveredAspect.interpretation}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-paper/70">
                    <span>Açısal fark: <strong className="font-mono font-semibold text-paper">{hoveredAspect.exactAngle}°</strong></span>
                    <span>Tolerans (orb): <strong className="font-mono font-semibold text-paper">{hoveredAspect.orb}°</strong></span>
                  </div>
                </div>
              ) : (
                <p className="border border-line bg-ink-2 p-4 text-sm leading-relaxed text-paper/80">
                  Çark üzerindeki renkli açı çizgilerine veya gezegen pinlerine gelerek Güneş, Ay ve gezegenler arasındaki majör açı geometrilerini (Üçgen, Kare, Sekstil, Karşıt) inceleyin.
                </p>
              )}

              {/* Renk anahtarı: çarktaki çizgi renkleriyle aynı */}
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-paper/80">
                {ASPECT_LEGEND.map((a) => (
                  <li key={a.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </li>
                ))}
              </ul>

              <p className="text-sm leading-relaxed text-paper/80">
                Doğum anınızdaki gök mekaniği, Güneş&apos;inizin <strong className="font-semibold text-paper">{sunSign.name}</strong> burcundaki iradesi ile 1. Evinizi yöneten <strong className="font-semibold text-paper">{risingSign.name}</strong> Yükseleninizi birleştirir.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-paper/70">Şanslı sayılar</span>
                  <span className="font-mono font-semibold text-gold">{sunSign.details.luckyNumbers.join(', ')}</span>
                </div>
                <div>
                  <span className="block text-xs text-paper/70">Burç taşı</span>
                  <span className="font-semibold text-paper">{sunSign.details.stone}</span>
                </div>
              </div>

              <Link
                href="/harita"
                className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-paper"
              >
                <span>{sunSign.name} takımyıldızını 3D gökyüzünde gör</span>
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sekme: gezegen yerleşimleri */}
      {activeTab === 'planets' && (
        <div className="space-y-4">
          <div>
            <h3 className="display text-xl text-paper">Gezegen yerleşimleri ve evler</h3>
            <p className="mt-1 text-sm leading-relaxed text-paper/80">
              Doğum anınızdaki gezegenlerin bulunduğu burçlar, dereceler ve hayat alanları (evler).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            {planetaryPlacements.map((p) => {
              const signData = ZODIAC_SIGNS.find((s) => s.name === p.sign);

              return (
                <div key={p.planet} className="space-y-2 bg-ink-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PlanetGlyph planet={p.planet} size={20} className="shrink-0 text-gold" />
                      <div>
                        <h4 className="text-base font-semibold text-paper">{p.planet}</h4>
                        <div className="flex items-center gap-1.5 text-sm text-paper/70">
                          {signData && <ZodiacGlyph sign={signData.id} size={12} className="shrink-0 text-paper/70" />}
                          <span><span className="font-mono">{p.degree}°</span> {p.sign}</span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-gold">
                      {p.house}. ev
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-paper/80">
                    {p.meaning}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sekme: 12 ev */}
      {activeTab === 'houses' && (
        <div className="space-y-4">
          <div>
            <h3 className="display text-xl text-paper">12 astrolojik ev</h3>
            <p className="mt-1 text-sm leading-relaxed text-paper/80">
              Her ev insanın yaşamındaki belirli bir alanı yönetir. İncelemek istediğiniz eve tıklayın.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ASTROLOGICAL_HOUSES.map((h) => {
              const isSelected = selectedHouse?.number === h.number;
              const govSign = ZODIAC_SIGNS.find((s) => s.name === h.governingSign);

              return (
                <button
                  type="button"
                  key={h.number}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedHouse(h)}
                  className={`block w-full cursor-pointer space-y-2 p-4 text-left text-paper transition-colors ${
                    isSelected
                      ? 'bg-violet/15 ring-1 ring-inset ring-violet/60'
                      : 'bg-ink-2 hover:bg-ink-3'
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-violet">
                      {h.title}
                    </span>
                    <span className="shrink-0 text-xs text-paper/70">
                      {h.traditionalName}
                    </span>
                  </span>

                  <span className="block text-base font-semibold text-paper">
                    {h.area}
                  </span>

                  <span className="block text-sm leading-relaxed text-paper/80 line-clamp-2">
                    {h.description}
                  </span>

                  <span className="flex items-center justify-between gap-2 pt-1 text-xs text-paper/70">
                    <span className="flex items-center gap-1.5">
                      {govSign && <ZodiacGlyph sign={govSign.id} size={12} className="shrink-0 text-violet" />}
                      <span>Doğal yöneticisi: <strong className="font-semibold text-paper">{h.governingSign}</strong></span>
                    </span>
                    <span className="shrink-0 text-violet">Detay gör →</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Seçili ev */}
          {selectedHouse && (
            <div className="flex flex-col items-start justify-between gap-4 border border-violet/60 bg-ink-2 p-5 sm:flex-row">
              <div className="space-y-1">
                <div className="text-sm font-medium text-violet">
                  Seçili ev: {selectedHouse.title} ({selectedHouse.traditionalName})
                </div>
                <h4 className="text-lg font-semibold text-paper">
                  {selectedHouse.area}
                </h4>
                <p className="max-w-2xl text-sm leading-relaxed text-paper/80">
                  {selectedHouse.description} Bu ev doğum haritanızda hangi gezegenle kesişiyorsa, o hayat alanında yoğun bir bilinç ve deneyim yaşanır.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHouse(null)}
                className="min-h-9 shrink-0 cursor-pointer border border-line bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink-3"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sekme: doğum kartı (yazdırılabilir poster) */}
      {activeTab === 'poster' && (
        <div data-print-poster className="space-y-8 border border-gold/40 bg-ink-2 p-5 text-paper sm:p-10">
          {/* Kart başlığı */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <h3 className="display text-2xl text-paper sm:text-3xl">
              Doğum gök atlası
            </h3>
            <div className="text-sm sm:text-right">
              <div className="text-xs text-paper/70">Doğum yeri</div>
              <div className="font-semibold text-paper">{city}</div>
              <div className="font-mono text-xs text-paper/70">{location.latitude.toFixed(2)}°K, {location.longitude.toFixed(2)}°D</div>
            </div>
          </div>

          {/* Çark ve üçlü */}
          <div data-print-grid className="grid items-center gap-8 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-6">
              <div className="relative aspect-square w-full max-w-[340px]">
                {wheelSvg}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                  <span className="text-[11px] text-paper/70">{sunSign.name} ☉</span>
                  <span className="text-[11px] font-semibold text-gold">{risingSign.name} ↑</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-6">
              <div className="grid grid-cols-2 gap-px border border-line bg-line">
                <div className="space-y-1 bg-ink p-3 sm:p-4">
                  <span className="block text-xs text-gold">Güneş (öz kimlik)</span>
                  <div className="flex items-center gap-2">
                    <ZodiacGlyph sign={sunSign.id} size={20} className="shrink-0 text-gold" />
                    <div className="text-sm font-semibold text-paper">{sunSign.name}</div>
                  </div>
                  <div className="text-xs text-paper/70">{sunSign.element} · {sunSign.modality}</div>
                </div>

                <div className="space-y-1 bg-ink p-3 sm:p-4">
                  <span className="block text-xs text-paper">Ay (duygu ve bilinçdışı)</span>
                  <div className="flex items-center gap-2">
                    <ZodiacGlyph sign={moonSign.id} size={20} className="shrink-0 text-paper" />
                    <div className="text-sm font-semibold text-paper">{moonSign.name}</div>
                  </div>
                  <div className="text-xs text-paper/70">{moonSign.element} · {moonSign.modality}</div>
                </div>

                <div className="space-y-1 bg-ink p-3 sm:p-4">
                  <span className="block text-xs text-violet">Yükselen (ASC, maske)</span>
                  <div className="flex items-center gap-2">
                    <ZodiacGlyph sign={risingSign.id} size={20} className="shrink-0 text-violet" />
                    <div className="text-sm font-semibold text-paper">{risingSign.name}</div>
                  </div>
                  <div className="text-xs text-paper/70">{risingSign.element} · {risingSign.modality}</div>
                </div>

                <div className="space-y-1 bg-ink p-3 sm:p-4">
                  <span className="block text-xs text-gold">Yaşam yolu sayısı</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-gold">{lifePath.number}</span>
                    <span className="min-w-0 text-xs font-semibold leading-snug text-paper">{lifePath.title}</span>
                  </div>
                  <div className="text-xs text-paper/70">Pisagor numerolojisi</div>
                </div>
              </div>

              <div className="border-l-2 border-gold/70 pl-4">
                <div className="text-sm font-semibold text-gold">Yaşam rehberi</div>
                <p className="mt-1 text-sm leading-relaxed text-paper/85">
                  {sunSign.name} Güneşi’nin iradesi, {risingSign.name} Yükseleni’nin dış dünyayla kurduğu temas ve {moonSign.name} Ayı’nın sezgisel derinliğiyle birleşiyor. Yaşam yolunuzdaki {lifePath.title} misyonu sizi daima hakikate taşır.
                </p>
              </div>
            </div>
          </div>

          {/* Künye ve yazdır */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <div className="text-xs text-paper/70">
              spacetour.com.tr · Doğum haritası ·{' '}
              <span className="font-mono">{day}.{month}.{year} {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}</span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              data-print-hide
              className="inline-flex min-h-10 cursor-pointer items-center bg-gold px-5 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
            >
              Yazdır veya PDF olarak kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
