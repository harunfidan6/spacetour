'use client';

import React, { useState, useMemo, useId } from 'react';
import {
  Heart,
  Sparkles,
  Flame,
  Shield,
  Brain,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRightLeft,
  Calendar,
  Clock,
  MapPin,
  Layers
} from 'lucide-react';
import { ZODIAC_SIGNS, daysInMonth } from '@/data/zodiac';
import { Ticks } from '@/components/motion/primitives';
import { NumericInput } from '@/components/ui/NumericInput';
import {
  ZodiacGlyph,
  PlanetGlyph,
  AscendantGlyph,
  AstrolabeGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph
} from '@/components/ui/CosmicGlyphs';
import { POPULAR_LOCATIONS } from '@/utils/astronomy';
import {
  calculateChartPlacements,
  analyzeSynastry,
  type BirthProfile,
  type AspectCategory
} from '@/lib/astrology/synastry';

export function SynastryChartCalculator() {
  // Person 1 State
  const [p1Name, setP1Name] = useState('1. Partner');
  const [p1Day, setP1Day] = useState(21);
  const [p1Month, setP1Month] = useState(3); // March (Aries)
  const [p1Year, setP1Year] = useState(1996);
  const [p1Hour, setP1Hour] = useState(12);
  const [p1Minute, setP1Minute] = useState(30);
  const [p1City, setP1City] = useState(POPULAR_LOCATIONS[0].city);

  // Person 2 State
  const [p2Name, setP2Name] = useState('2. Partner');
  const [p2Day, setP2Day] = useState(8);
  const [p2Month, setP2Month] = useState(8); // August (Leo)
  const [p2Year, setP2Year] = useState(1997);
  const [p2Hour, setP2Hour] = useState(18);
  const [p2Minute, setP2Minute] = useState(45);
  const [p2City, setP2City] = useState(POPULAR_LOCATIONS[0].city);

  // Active view tab & aspect filter
  const [activeTab, setActiveTab] = useState<'aspects' | 'placements' | 'dynamics'>('aspects');
  const [aspectFilter, setAspectFilter] = useState<'all' | AspectCategory>('all');

  const fid = useId();
  const p1MaxDay = daysInMonth(p1Month, p1Year);
  const p2MaxDay = daysInMonth(p2Month, p2Year);

  const changeP1Month = (m: number) => {
    setP1Month(m);
    setP1Day((d) => Math.min(d, daysInMonth(m, p1Year)));
  };
  const changeP1Year = (y: number) => {
    setP1Year(y);
    setP1Day((d) => Math.min(d, daysInMonth(p1Month, y)));
  };
  const changeP2Month = (m: number) => {
    setP2Month(m);
    setP2Day((d) => Math.min(d, daysInMonth(m, p2Year)));
  };
  const changeP2Year = (y: number) => {
    setP2Year(y);
    setP2Day((d) => Math.min(d, daysInMonth(p2Month, y)));
  };

  // Build authentic astronomical profiles
  const p1Profile: BirthProfile = useMemo(() => ({
    name: p1Name.trim() || '1. Partner',
    day: p1Day,
    month: p1Month,
    year: p1Year,
    hour: p1Hour,
    minute: p1Minute,
    city: p1City,
  }), [p1Name, p1Day, p1Month, p1Year, p1Hour, p1Minute, p1City]);

  const p2Profile: BirthProfile = useMemo(() => ({
    name: p2Name.trim() || '2. Partner',
    day: p2Day,
    month: p2Month,
    year: p2Year,
    hour: p2Hour,
    minute: p2Minute,
    city: p2City,
  }), [p2Name, p2Day, p2Month, p2Year, p2Hour, p2Minute, p2City]);

  // Compute authentic planetary placements from NASA JPL / Meeus ephemeris
  const p1Chart = useMemo(() => calculateChartPlacements(p1Profile), [p1Profile]);
  const p2Chart = useMemo(() => calculateChartPlacements(p2Profile), [p2Profile]);

  // Comprehensive Synastry Analysis
  const analysis = useMemo(() => analyzeSynastry(p1Chart, p2Chart), [p1Chart, p2Chart]);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Element Glyph helper
  const getElementGlyph = (elem: string, size = 12) => {
    switch (elem) {
      case 'Ateş': return <FireElementGlyph size={size} className="text-gold" />;
      case 'Toprak': return <EarthElementGlyph size={size} className="text-lime" />;
      case 'Hava': return <AirElementGlyph size={size} className="text-primary" />;
      case 'Su': return <WaterElementGlyph size={size} className="text-blue-400" />;
      default: return null;
    }
  };

  // Filtered aspects
  const filteredAspects = useMemo(() => {
    if (aspectFilter === 'all') return analysis.aspects;
    return analysis.aspects.filter((a) => a.category === aspectFilter);
  }, [analysis.aspects, aspectFilter]);

  return (
    <div id="sinastri-analizi" className="ticks relative border border-line bg-ink p-4 sm:p-8 lg:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-rose-signal">
            <Heart className="h-4 w-4 animate-pulse" />
            <span>İKİLİ DOĞUM HARİTASI ÇAPRAZ EFEMERİS ANALİZİ</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Sinastri <span className="serif-i text-rose-signal">& Kozmik İlişki Uyumu</span>
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-paper/70 font-sans">
            NASA JPL efemeris algoritmasıyla her iki partnerin Güneş, Ay, Yükselen, Venüs, Mars, Merkür, Jüpiter ve Satürn koordinatlarını hesaplayarak gerçek Ptolemaic çapraz açıları ve ruhsal rezonansı keşfedin.
          </p>
        </div>

        <div className="flex items-center gap-2 label text-rose-signal bg-ink-2 border border-line px-4 py-2 shrink-0">
          <AstrolabeGlyph size={16} className="text-rose-signal" />
          <span>Hassas Efemeris Motoru</span>
        </div>
      </div>

      {/* Dual Partner Input Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner 1 Inputs */}
        <div className="border border-line bg-ink-2 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gold shrink-0" />
              <input
                aria-label="Birinci partnerin adı"
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="1. Partner"
                className="min-w-0 w-full bg-transparent font-bold text-paper text-base outline-none border-b border-dashed border-line focus:border-gold"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap label text-gold font-bold">
              <ZodiacGlyph sign={p1Chart.sun.signId} size={16} className="text-gold" />
              <span>{p1Chart.sun.signName} Burcu</span>
            </div>
          </div>

          {/* Date & Time Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px border border-line bg-line text-xs font-mono">
            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p1-day`} className="label text-muted block mb-1 text-[10px]">GÜN</label>
              <NumericInput
                id={`${fid}-p1-day`}
                min={1}
                max={p1MaxDay}
                value={p1Day}
                onValueChange={setP1Day}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p1-month`} className="label text-muted block mb-1 text-[10px]">AY</label>
              <select
                id={`${fid}-p1-month`}
                value={p1Month}
                onChange={(e) => changeP1Month(parseInt(e.target.value, 10))}
                className="w-full bg-transparent font-bold text-paper outline-none cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-ink-2 text-paper">{m}</option>
                ))}
              </select>
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p1-year`} className="label text-muted block mb-1 text-[10px]">YIL</label>
              <NumericInput
                id={`${fid}-p1-year`}
                min={1920}
                max={2030}
                value={p1Year}
                onValueChange={changeP1Year}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p1-hour`} className="label text-muted block mb-1 text-[10px]">SAAT</label>
              <NumericInput
                id={`${fid}-p1-hour`}
                min={0}
                max={23}
                value={p1Hour}
                onValueChange={setP1Hour}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5 col-span-2 sm:col-span-1">
              <label htmlFor={`${fid}-p1-minute`} className="label text-muted block mb-1 text-[10px]">DAKİKA</label>
              <NumericInput
                id={`${fid}-p1-minute`}
                min={0}
                max={59}
                value={p1Minute}
                onValueChange={setP1Minute}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>
          </div>

          {/* City Selection */}
          <div className="flex items-center gap-2 border border-line bg-ink p-2 text-xs font-mono">
            <MapPin size={13} className="text-gold shrink-0" />
            <label htmlFor={`${fid}-p1-city`} className="label text-muted shrink-0 text-[10px]">ŞEHİR:</label>
            <select
              id={`${fid}-p1-city`}
              value={p1City}
              onChange={(e) => setP1City(e.target.value)}
              className="w-full bg-transparent font-mono text-paper outline-none cursor-pointer text-xs"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">{loc.city}</option>
              ))}
            </select>
          </div>

          {/* Partner 1 Ephemeris Placements Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-line bg-line text-[11px] font-mono">
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="sun" size={11} className="text-gold" />
                Güneş
              </span>
              <span className="font-bold text-gold flex items-center gap-1">
                <ZodiacGlyph sign={p1Chart.sun.signId} size={13} />
                {p1Chart.sun.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="moon" size={11} className="text-violet" />
                Ay
              </span>
              <span className="font-bold text-violet flex items-center gap-1">
                <ZodiacGlyph sign={p1Chart.moon.signId} size={13} />
                {p1Chart.moon.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <AscendantGlyph size={11} className="text-paper" />
                Yükselen
              </span>
              <span className="font-bold text-paper flex items-center gap-1">
                <ZodiacGlyph sign={p1Chart.ascendant.signId} size={13} />
                {p1Chart.ascendant.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="venus" size={11} className="text-rose-signal" />
                Venüs
              </span>
              <span className="font-bold text-rose-signal flex items-center gap-1">
                <ZodiacGlyph sign={p1Chart.venus.signId} size={13} />
                {p1Chart.venus.formatted}
              </span>
            </div>
          </div>
        </div>

        {/* Partner 2 Inputs */}
        <div className="border border-line bg-ink-2 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-signal shrink-0" />
              <input
                aria-label="İkinci partnerin adı"
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="2. Partner"
                className="min-w-0 w-full bg-transparent font-bold text-paper text-base outline-none border-b border-dashed border-line focus:border-rose-signal"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap label text-rose-signal font-bold">
              <ZodiacGlyph sign={p2Chart.sun.signId} size={16} className="text-rose-signal" />
              <span>{p2Chart.sun.signName} Burcu</span>
            </div>
          </div>

          {/* Date & Time Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px border border-line bg-line text-xs font-mono">
            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p2-day`} className="label text-muted block mb-1 text-[10px]">GÜN</label>
              <NumericInput
                id={`${fid}-p2-day`}
                min={1}
                max={p2MaxDay}
                value={p2Day}
                onValueChange={setP2Day}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p2-month`} className="label text-muted block mb-1 text-[10px]">AY</label>
              <select
                id={`${fid}-p2-month`}
                value={p2Month}
                onChange={(e) => changeP2Month(parseInt(e.target.value, 10))}
                className="w-full bg-transparent font-bold text-paper outline-none cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-ink-2 text-paper">{m}</option>
                ))}
              </select>
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p2-year`} className="label text-muted block mb-1 text-[10px]">YIL</label>
              <NumericInput
                id={`${fid}-p2-year`}
                min={1920}
                max={2030}
                value={p2Year}
                onValueChange={changeP2Year}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5">
              <label htmlFor={`${fid}-p2-hour`} className="label text-muted block mb-1 text-[10px]">SAAT</label>
              <NumericInput
                id={`${fid}-p2-hour`}
                min={0}
                max={23}
                value={p2Hour}
                onValueChange={setP2Hour}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>

            <div className="bg-ink p-2.5 col-span-2 sm:col-span-1">
              <label htmlFor={`${fid}-p2-minute`} className="label text-muted block mb-1 text-[10px]">DAKİKA</label>
              <NumericInput
                id={`${fid}-p2-minute`}
                min={0}
                max={59}
                value={p2Minute}
                onValueChange={setP2Minute}
                className="w-full bg-transparent font-bold text-paper outline-none"
              />
            </div>
          </div>

          {/* City Selection */}
          <div className="flex items-center gap-2 border border-line bg-ink p-2 text-xs font-mono">
            <MapPin size={13} className="text-rose-signal shrink-0" />
            <label htmlFor={`${fid}-p2-city`} className="label text-muted shrink-0 text-[10px]">ŞEHİR:</label>
            <select
              id={`${fid}-p2-city`}
              value={p2City}
              onChange={(e) => setP2City(e.target.value)}
              className="w-full bg-transparent font-mono text-paper outline-none cursor-pointer text-xs"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">{loc.city}</option>
              ))}
            </select>
          </div>

          {/* Partner 2 Ephemeris Placements Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-line bg-line text-[11px] font-mono">
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="sun" size={11} className="text-rose-signal" />
                Güneş
              </span>
              <span className="font-bold text-rose-signal flex items-center gap-1">
                <ZodiacGlyph sign={p2Chart.sun.signId} size={13} />
                {p2Chart.sun.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="moon" size={11} className="text-violet" />
                Ay
              </span>
              <span className="font-bold text-violet flex items-center gap-1">
                <ZodiacGlyph sign={p2Chart.moon.signId} size={13} />
                {p2Chart.moon.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <AscendantGlyph size={11} className="text-paper" />
                Yükselen
              </span>
              <span className="font-bold text-paper flex items-center gap-1">
                <ZodiacGlyph sign={p2Chart.ascendant.signId} size={13} />
                {p2Chart.ascendant.formatted}
              </span>
            </div>

            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="venus" size={11} className="text-pink-400" />
                Venüs
              </span>
              <span className="font-bold text-pink-400 flex items-center gap-1">
                <ZodiacGlyph sign={p2Chart.venus.signId} size={13} />
                {p2Chart.venus.formatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Synastry Score & Cosmic Synthesis Hero */}
      <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-line">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 bg-rose-signal/10 border-2 border-rose-signal flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_30px_rgba(255,75,130,0.15)]">
              <span className="text-3xl sm:text-4xl font-black text-rose-signal font-mono">
                %{analysis.overallScore}
              </span>
              <span className="label text-[9px] text-rose-signal uppercase tracking-widest mt-0.5">SİNASTRİ</span>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-rose-signal/15 text-rose-signal border border-rose-signal/30">
                <Sparkles size={11} />
                {analysis.compatibilityLevel}
              </div>
              <h3 className="display display-tight text-2xl sm:text-3xl font-black text-paper">
                {p1Profile.name} & {p2Profile.name}
              </h3>
              <p className="text-xs sm:text-sm text-paper/80 max-w-2xl leading-relaxed font-sans">
                {analysis.summaryText}
              </p>
            </div>
          </div>

          {/* Quick Core Placements Match Tag */}
          <div className="w-full md:w-auto shrink-0 font-mono text-xs text-muted bg-ink p-4 border border-line space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span>Güneş Uyumu:</span>
              <strong className="text-paper">{p1Chart.sun.signName} + {p2Chart.sun.signName}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Ay Ahengi:</span>
              <strong className="text-violet">{p1Chart.moon.signName} + {p2Chart.moon.signName}</strong>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Venüs - Mars:</span>
              <strong className="text-rose-signal">{p1Chart.venus.signName} / {p2Chart.mars.signName}</strong>
            </div>
          </div>
        </div>

        {/* 4 Dimension Rating Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dimension 1: Soul */}
          <div className="bg-ink p-4 border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="label text-violet flex items-center gap-1.5">
                <PlanetGlyph planet="moon" size={13} className="text-violet" />
                Ruhsal Güven
              </span>
              <span className="font-bold text-violet font-mono">%{analysis.dimensionScores.soul}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 overflow-hidden border border-line">
              <div
                className="h-full bg-violet transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.soul}%` }}
              />
            </div>
            <p className="text-[11px] text-paper/60 font-sans leading-tight">
              Ay ve Güneş etkileşimi: İçsel sığınak, derin empati ve savunmasız kalabilme rahatlığı.
            </p>
          </div>

          {/* Dimension 2: Passion */}
          <div className="bg-ink p-4 border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="label text-rose-signal flex items-center gap-1.5">
                <Flame size={13} className="text-rose-signal" />
                Romantik & Tutku
              </span>
              <span className="font-bold text-rose-signal font-mono">%{analysis.dimensionScores.passion}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 overflow-hidden border border-line">
              <div
                className="h-full bg-rose-signal transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.passion}%` }}
              />
            </div>
            <p className="text-[11px] text-paper/60 font-sans leading-tight">
              Venüs ve Mars kimyası: Fiziksel arzu, flört kıvılcımı ve tensel çekim frekansı.
            </p>
          </div>

          {/* Dimension 3: Mind */}
          <div className="bg-ink p-4 border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="label text-primary flex items-center gap-1.5">
                <Brain size={13} className="text-primary" />
                Zihinsel Uyum
              </span>
              <span className="font-bold text-primary font-mono">%{analysis.dimensionScores.mind}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 overflow-hidden border border-line">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.mind}%` }}
              />
            </div>
            <p className="text-[11px] text-paper/60 font-sans leading-tight">
              Merkür ekseni: Saatlerce sohbet edebilme, ortak espri anlayışı ve kriz çözme.
            </p>
          </div>

          {/* Dimension 4: Karma & Longevity */}
          <div className="bg-ink p-4 border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="label text-gold flex items-center gap-1.5">
                <Shield size={13} className="text-gold" />
                Karmik Sadakat
              </span>
              <span className="font-bold text-gold font-mono">%{analysis.dimensionScores.karma}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 overflow-hidden border border-line">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.karma}%` }}
              />
            </div>
            <p className="text-[11px] text-paper/60 font-sans leading-tight">
              Satürn ve Jüpiter bağları: Sorumluluk, sadakat, birlikte büyüme ve gelecek ortaklığı.
            </p>
          </div>
        </div>
      </div>

      {/* Chamber Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <button
          onClick={() => setActiveTab('aspects')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'aspects'
              ? 'bg-rose-signal text-ink font-bold shadow-sm'
              : 'bg-ink-2 text-paper/70 hover:text-paper hover:bg-ink border border-line'
          }`}
        >
          <ArrowRightLeft size={13} />
          <span>Çapraz Açı Matrisi ({analysis.aspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('placements')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'placements'
              ? 'bg-rose-signal text-ink font-bold shadow-sm'
              : 'bg-ink-2 text-paper/70 hover:text-paper hover:bg-ink border border-line'
          }`}
        >
          <Layers size={13} />
          <span>8 Faset Gezegen Karşılaştırması</span>
        </button>

        <button
          onClick={() => setActiveTab('dynamics')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'dynamics'
              ? 'bg-rose-signal text-ink font-bold shadow-sm'
              : 'bg-ink-2 text-paper/70 hover:text-paper hover:bg-ink border border-line'
          }`}
        >
          <Compass size={13} />
          <span>Kozmik İlişki Dinamikleri</span>
        </button>
      </div>

      {/* Tab 1: Çapraz Açı Matrisi */}
      {activeTab === 'aspects' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="label text-muted text-[10px] mr-1">FİLTRE:</span>
            {[
              { id: 'all', label: 'Tüm Açılar' },
              { id: 'soul', label: 'Ruh & Duygu (Güneş/Ay)' },
              { id: 'passion', label: 'Tutku & Romantizm (Venüs/Mars)' },
              { id: 'mind', label: 'Zihin & İletişim (Merkür)' },
              { id: 'karma', label: 'Karmik Bağ (Satürn/Jüpiter)' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setAspectFilter(chip.id as any)}
                className={`px-3 py-1 text-[11px] font-mono transition-colors ${
                  aspectFilter === chip.id
                    ? 'bg-line text-rose-signal font-bold border border-rose-signal/40'
                    : 'bg-ink text-paper/60 hover:text-paper border border-line'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Aspect Cards Grid */}
          {filteredAspects.length === 0 ? (
            <div className="border border-line bg-ink-2 p-8 text-center text-muted font-mono text-xs">
              Bu kategoride tespit edilen majör Ptolemaic açı bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAspects.map((asp) => (
                <div
                  key={asp.id}
                  className="border border-line bg-ink-2 p-5 space-y-3 relative group hover:border-rose-signal/40 transition-colors"
                >
                  {/* Top Bar: Planets Involved & Aspect Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
                    <div className="flex items-center gap-2 font-mono text-xs text-paper font-bold min-w-0">
                      <span className="flex items-center gap-1 shrink-0 text-gold">
                        <PlanetGlyph planet={asp.p1Planet.id} size={14} />
                        <span className="truncate">{asp.p1Planet.name}</span>
                      </span>
                      <span className="text-muted shrink-0">⟷</span>
                      <span className="flex items-center gap-1 shrink-0 text-rose-signal">
                        <PlanetGlyph planet={asp.p2Planet.id} size={14} />
                        <span className="truncate">{asp.p2Planet.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                          asp.nature === 'harmonious'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : asp.nature === 'challenging'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-primary/10 text-primary border-primary/30'
                        }`}
                      >
                        {asp.aspectSymbol} {asp.aspectName} ({asp.angle}°)
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-ink text-muted border border-line">
                        {asp.orb}° orb
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h4 className="display display-tight text-sm font-bold text-paper">
                      {asp.title}
                    </h4>
                    <p className="text-xs text-paper/70 font-sans mt-1 leading-relaxed">
                      {asp.summary}
                    </p>
                  </div>

                  {/* Detailed Astrological Interpretation */}
                  <div className="p-3 bg-ink border border-line text-xs font-sans text-paper/85 leading-relaxed">
                    {asp.detailedInterpretation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 8 Faset Gezegen Karşılaştırması */}
      {activeTab === 'placements' && (
        <div className="border border-line bg-ink-2 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-line bg-ink text-[11px] text-muted">
                <th className="p-3.5">KOZMİK FASET</th>
                <th className="p-3.5 text-gold">{p1Profile.name.toUpperCase()}</th>
                <th className="p-3.5 text-center">ELEMENT ETKİSİ</th>
                <th className="p-3.5 text-rose-signal">{p2Profile.name.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {p1Chart.all.map((p1Body, idx) => {
                const p2Body = p2Chart.all[idx];
                const isSameElement = p1Body.element === p2Body.element;
                const isHarmonious =
                  isSameElement ||
                  (p1Body.element === 'Ateş' && p2Body.element === 'Hava') ||
                  (p1Body.element === 'Hava' && p2Body.element === 'Ateş') ||
                  (p1Body.element === 'Toprak' && p2Body.element === 'Su') ||
                  (p1Body.element === 'Su' && p2Body.element === 'Toprak');

                return (
                  <tr key={p1Body.id} className="hover:bg-ink/50 transition-colors">
                    <td className="p-3.5 font-bold text-paper">
                      <div className="flex items-center gap-2">
                        <PlanetGlyph planet={p1Body.id} size={15} className="text-muted" />
                        <div>
                          <div>{p1Body.name}</div>
                          <div className="text-[10px] text-muted font-sans font-normal">{p1Body.meaning}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-gold">
                        <ZodiacGlyph sign={p1Body.signId} size={14} />
                        <span>{p1Body.formatted}</span>
                        <span className="text-[10px] text-muted font-normal">({p1Body.element})</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono border ${
                          isHarmonious
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isSameElement
                          ? 'Aynı Element'
                          : isHarmonious
                          ? 'Uyumlu Akış'
                          : 'Dinamik Gerilim'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-signal">
                        <ZodiacGlyph sign={p2Body.signId} size={14} />
                        <span>{p2Body.formatted}</span>
                        <span className="text-[10px] text-muted font-normal">({p2Body.element})</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Kozmik İlişki Dinamikleri */}
      {activeTab === 'dynamics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Strengths */}
          <div className="border border-line bg-ink-2 p-6 space-y-4">
            <div className="flex items-center gap-2 label text-emerald-400 border-b border-line pb-3">
              <CheckCircle2 size={16} />
              <span>İLİŞKİNİN DOĞAL GÜÇLÜ YÖNLERİ</span>
            </div>
            <div className="space-y-3">
              {analysis.strengths.map((str, idx) => (
                <div key={idx} className="p-3 bg-ink border border-line text-xs font-sans text-paper/85 leading-relaxed flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono font-bold mt-0.5 shrink-0">#{idx + 1}</span>
                  <div>{str}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Growth Areas */}
          <div className="border border-line bg-ink-2 p-6 space-y-4">
            <div className="flex items-center gap-2 label text-rose-signal border-b border-line pb-3">
              <AlertTriangle size={16} />
              <span>DİKKAT EDİLMESİ GEREKEN ALANLAR & BÜYÜME SINAVLARI</span>
            </div>
            <div className="space-y-3">
              {analysis.growthAreas.map((grow, idx) => (
                <div key={idx} className="p-3 bg-ink border border-line text-xs font-sans text-paper/85 leading-relaxed flex items-start gap-2.5">
                  <span className="text-rose-signal font-mono font-bold mt-0.5 shrink-0">#{idx + 1}</span>
                  <div>{grow}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Advice Banner */}
          <div className="col-span-1 lg:col-span-2 border border-line bg-ink p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center shrink-0">
              <Lightbulb size={20} className="text-gold" />
            </div>
            <div className="space-y-1">
              <div className="label text-gold">KOZMİK REHBERLİK & İLİŞKİ TAVSİYESİ</div>
              <p className="text-xs sm:text-sm text-paper/85 font-sans leading-relaxed">
                {analysis.advice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
