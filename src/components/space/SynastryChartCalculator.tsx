'use client';

import React, { useState, useMemo, useId } from 'react';
import {
  Flame,
  Shield,
  Brain,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRightLeft,
  MapPin,
  Layers
} from 'lucide-react';
import { daysInMonth } from '@/data/zodiac';
import { NumericInput } from '@/components/ui/NumericInput';
import {
  ZodiacGlyph,
  PlanetGlyph,
  AscendantGlyph,
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

// Ortak görünüm sınıfları: form alanları ve sekmeler
const FIELD_LABEL = 'mb-1 block text-xs text-paper/70';
const FIELD_CONTROL =
  'h-10 w-full min-w-0 border border-line bg-ink px-2.5 text-sm text-paper outline-none transition-colors';
const TAB_BASE = 'inline-flex min-h-10 items-center gap-2 border px-3.5 py-2 text-sm transition-colors';
const TAB_ACTIVE = 'border-rose-signal bg-rose-signal font-semibold text-ink';
const TAB_IDLE = 'border-line bg-ink-2 text-paper/75 hover:bg-ink hover:text-paper';

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
    <div id="sinastri-analizi" className="border border-line bg-ink p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Sinastri ve ilişki uyumu
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
          NASA JPL efemeris algoritmasıyla her iki partnerin Güneş, Ay, Yükselen, Venüs, Mars, Merkür, Jüpiter ve Satürn koordinatlarını hesaplayarak gerçek Ptolemaic çapraz açıları ve ruhsal rezonansı keşfedin.
        </p>
      </div>

      {/* Dual Partner Input Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partner 1 Inputs */}
        <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-1 basis-32 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gold shrink-0" />
              <input
                aria-label="Birinci partnerin adı"
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="1. Partner"
                className="h-10 min-w-0 w-full bg-transparent text-base font-semibold text-paper outline-none border-b border-dashed border-line focus:border-gold"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gold">
              <ZodiacGlyph sign={p1Chart.sun.signId} size={16} className="text-gold" />
              <span>{p1Chart.sun.signName} burcu</span>
            </div>
          </div>

          {/* Date, Time & City Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] gap-2">
              <div>
                <label htmlFor={`${fid}-p1-day`} className={FIELD_LABEL}>Gün</label>
                <NumericInput
                  id={`${fid}-p1-day`}
                  min={1}
                  max={p1MaxDay}
                  value={p1Day}
                  onValueChange={setP1Day}
                  className={`${FIELD_CONTROL} font-mono focus:border-gold`}
                />
              </div>

              <div>
                <label htmlFor={`${fid}-p1-month`} className={FIELD_LABEL}>Ay</label>
                <select
                  id={`${fid}-p1-month`}
                  value={p1Month}
                  onChange={(e) => changeP1Month(parseInt(e.target.value, 10))}
                  className={`${FIELD_CONTROL} cursor-pointer focus:border-gold`}
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx + 1} className="bg-ink-2 text-paper">{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${fid}-p1-year`} className={FIELD_LABEL}>Yıl</label>
                <NumericInput
                  id={`${fid}-p1-year`}
                  min={1920}
                  max={2030}
                  value={p1Year}
                  onValueChange={changeP1Year}
                  className={`${FIELD_CONTROL} font-mono focus:border-gold`}
                />
              </div>
            </div>

            <div className="grid grid-cols-[4.5rem_4.5rem_minmax(0,1fr)] gap-2">
              <div>
                <label htmlFor={`${fid}-p1-hour`} className={FIELD_LABEL}>Saat</label>
                <NumericInput
                  id={`${fid}-p1-hour`}
                  min={0}
                  max={23}
                  value={p1Hour}
                  onValueChange={setP1Hour}
                  className={`${FIELD_CONTROL} font-mono focus:border-gold`}
                />
              </div>

              <div>
                <label htmlFor={`${fid}-p1-minute`} className={FIELD_LABEL}>Dakika</label>
                <NumericInput
                  id={`${fid}-p1-minute`}
                  min={0}
                  max={59}
                  value={p1Minute}
                  onValueChange={setP1Minute}
                  className={`${FIELD_CONTROL} font-mono focus:border-gold`}
                />
              </div>

              <div className="min-w-0">
                <label htmlFor={`${fid}-p1-city`} className={`${FIELD_LABEL} flex items-center gap-1`}>
                  <MapPin size={12} className="text-gold shrink-0" />
                  Şehir
                </label>
                <select
                  id={`${fid}-p1-city`}
                  value={p1City}
                  onChange={(e) => setP1City(e.target.value)}
                  className={`${FIELD_CONTROL} cursor-pointer focus:border-gold`}
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">{loc.city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Partner 1 Ephemeris Placements */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3 border-t border-line pt-4">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="sun" size={12} className="text-gold" />
                Güneş
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-gold">
                <ZodiacGlyph sign={p1Chart.sun.signId} size={13} className="shrink-0" />
                {p1Chart.sun.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="moon" size={12} className="text-violet" />
                Ay
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-violet">
                <ZodiacGlyph sign={p1Chart.moon.signId} size={13} className="shrink-0" />
                {p1Chart.moon.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <AscendantGlyph size={12} className="text-paper" />
                Yükselen
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-paper">
                <ZodiacGlyph sign={p1Chart.ascendant.signId} size={13} className="shrink-0" />
                {p1Chart.ascendant.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="venus" size={12} className="text-rose-signal" />
                Venüs
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-rose-signal">
                <ZodiacGlyph sign={p1Chart.venus.signId} size={13} className="shrink-0" />
                {p1Chart.venus.formatted}
              </dd>
            </div>
          </dl>
        </div>

        {/* Partner 2 Inputs */}
        <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-1 basis-32 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-signal shrink-0" />
              <input
                aria-label="İkinci partnerin adı"
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="2. Partner"
                className="h-10 min-w-0 w-full bg-transparent text-base font-semibold text-paper outline-none border-b border-dashed border-line focus:border-rose-signal"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-rose-signal">
              <ZodiacGlyph sign={p2Chart.sun.signId} size={16} className="text-rose-signal" />
              <span>{p2Chart.sun.signName} burcu</span>
            </div>
          </div>

          {/* Date, Time & City Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] gap-2">
              <div>
                <label htmlFor={`${fid}-p2-day`} className={FIELD_LABEL}>Gün</label>
                <NumericInput
                  id={`${fid}-p2-day`}
                  min={1}
                  max={p2MaxDay}
                  value={p2Day}
                  onValueChange={setP2Day}
                  className={`${FIELD_CONTROL} font-mono focus:border-rose-signal`}
                />
              </div>

              <div>
                <label htmlFor={`${fid}-p2-month`} className={FIELD_LABEL}>Ay</label>
                <select
                  id={`${fid}-p2-month`}
                  value={p2Month}
                  onChange={(e) => changeP2Month(parseInt(e.target.value, 10))}
                  className={`${FIELD_CONTROL} cursor-pointer focus:border-rose-signal`}
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx + 1} className="bg-ink-2 text-paper">{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${fid}-p2-year`} className={FIELD_LABEL}>Yıl</label>
                <NumericInput
                  id={`${fid}-p2-year`}
                  min={1920}
                  max={2030}
                  value={p2Year}
                  onValueChange={changeP2Year}
                  className={`${FIELD_CONTROL} font-mono focus:border-rose-signal`}
                />
              </div>
            </div>

            <div className="grid grid-cols-[4.5rem_4.5rem_minmax(0,1fr)] gap-2">
              <div>
                <label htmlFor={`${fid}-p2-hour`} className={FIELD_LABEL}>Saat</label>
                <NumericInput
                  id={`${fid}-p2-hour`}
                  min={0}
                  max={23}
                  value={p2Hour}
                  onValueChange={setP2Hour}
                  className={`${FIELD_CONTROL} font-mono focus:border-rose-signal`}
                />
              </div>

              <div>
                <label htmlFor={`${fid}-p2-minute`} className={FIELD_LABEL}>Dakika</label>
                <NumericInput
                  id={`${fid}-p2-minute`}
                  min={0}
                  max={59}
                  value={p2Minute}
                  onValueChange={setP2Minute}
                  className={`${FIELD_CONTROL} font-mono focus:border-rose-signal`}
                />
              </div>

              <div className="min-w-0">
                <label htmlFor={`${fid}-p2-city`} className={`${FIELD_LABEL} flex items-center gap-1`}>
                  <MapPin size={12} className="text-rose-signal shrink-0" />
                  Şehir
                </label>
                <select
                  id={`${fid}-p2-city`}
                  value={p2City}
                  onChange={(e) => setP2City(e.target.value)}
                  className={`${FIELD_CONTROL} cursor-pointer focus:border-rose-signal`}
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.city} value={loc.city} className="bg-ink-2 text-paper">{loc.city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Partner 2 Ephemeris Placements */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3 border-t border-line pt-4">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="sun" size={12} className="text-rose-signal" />
                Güneş
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-rose-signal">
                <ZodiacGlyph sign={p2Chart.sun.signId} size={13} className="shrink-0" />
                {p2Chart.sun.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="moon" size={12} className="text-violet" />
                Ay
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-violet">
                <ZodiacGlyph sign={p2Chart.moon.signId} size={13} className="shrink-0" />
                {p2Chart.moon.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <AscendantGlyph size={12} className="text-paper" />
                Yükselen
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-paper">
                <ZodiacGlyph sign={p2Chart.ascendant.signId} size={13} className="shrink-0" />
                {p2Chart.ascendant.formatted}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-paper/70">
                <PlanetGlyph planet="venus" size={12} className="text-pink-400" />
                Venüs
              </dt>
              <dd className="mt-1 flex items-center gap-1 font-mono text-[13px] font-medium text-pink-400">
                <ZodiacGlyph sign={p2Chart.venus.signId} size={13} className="shrink-0" />
                {p2Chart.venus.formatted}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Synastry Score & Summary */}
      <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex min-w-0 flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
            <div className="flex items-baseline gap-2 sm:block shrink-0">
              <div className="font-mono text-4xl font-bold leading-none text-rose-signal sm:text-5xl">
                %{analysis.overallScore}
              </div>
              <div className="text-xs text-paper/70 sm:mt-2">Sinastri puanı</div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-medium text-rose-signal">{analysis.compatibilityLevel}</p>
              <h3 className="font-display text-xl font-semibold leading-tight text-paper break-words sm:text-2xl">
                {p1Profile.name} & {p2Profile.name}
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-paper/85">
                {analysis.summaryText}
              </p>
            </div>
          </div>

          {/* Quick Core Placements */}
          <dl className="w-full md:w-64 shrink-0 space-y-2 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/70">Güneş uyumu</dt>
              <dd className="text-right font-medium text-paper">{p1Chart.sun.signName} + {p2Chart.sun.signName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/70">Ay ahengi</dt>
              <dd className="text-right font-medium text-violet">{p1Chart.moon.signName} + {p2Chart.moon.signName}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/70">Venüs – Mars</dt>
              <dd className="text-right font-medium text-rose-signal">{p1Chart.venus.signName} / {p2Chart.mars.signName}</dd>
            </div>
          </dl>
        </div>

        {/* 4 Dimension Rating Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 border-t border-line pt-6">
          {/* Dimension 1: Soul */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-violet">
                <PlanetGlyph planet="moon" size={14} className="text-violet" />
                Ruhsal güven
              </span>
              <span className="font-mono text-sm font-semibold text-violet">%{analysis.dimensionScores.soul}</span>
            </div>
            <div className="h-1.5 w-full bg-ink overflow-hidden">
              <div
                className="h-full bg-violet transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.soul}%` }}
              />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              Ay ve Güneş etkileşimi: İçsel sığınak, derin empati ve savunmasız kalabilme rahatlığı.
            </p>
          </div>

          {/* Dimension 2: Passion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-rose-signal">
                <Flame size={14} className="text-rose-signal" />
                Romantizm ve tutku
              </span>
              <span className="font-mono text-sm font-semibold text-rose-signal">%{analysis.dimensionScores.passion}</span>
            </div>
            <div className="h-1.5 w-full bg-ink overflow-hidden">
              <div
                className="h-full bg-rose-signal transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.passion}%` }}
              />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              Venüs ve Mars kimyası: Fiziksel arzu, flört kıvılcımı ve tensel çekim frekansı.
            </p>
          </div>

          {/* Dimension 3: Mind */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Brain size={14} className="text-primary" />
                Zihinsel uyum
              </span>
              <span className="font-mono text-sm font-semibold text-primary">%{analysis.dimensionScores.mind}</span>
            </div>
            <div className="h-1.5 w-full bg-ink overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.mind}%` }}
              />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              Merkür ekseni: Saatlerce sohbet edebilme, ortak espri anlayışı ve kriz çözme.
            </p>
          </div>

          {/* Dimension 4: Karma & Longevity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gold">
                <Shield size={14} className="text-gold" />
                Karmik sadakat
              </span>
              <span className="font-mono text-sm font-semibold text-gold">%{analysis.dimensionScores.karma}</span>
            </div>
            <div className="h-1.5 w-full bg-ink overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${analysis.dimensionScores.karma}%` }}
              />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              Satürn ve Jüpiter bağları: Sorumluluk, sadakat, birlikte büyüme ve gelecek ortaklığı.
            </p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <button
          onClick={() => setActiveTab('aspects')}
          className={`${TAB_BASE} ${activeTab === 'aspects' ? TAB_ACTIVE : TAB_IDLE}`}
        >
          <ArrowRightLeft size={14} />
          <span>Çapraz açılar ({analysis.aspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('placements')}
          className={`${TAB_BASE} ${activeTab === 'placements' ? TAB_ACTIVE : TAB_IDLE}`}
        >
          <Layers size={14} />
          <span>Gezegen karşılaştırması</span>
        </button>

        <button
          onClick={() => setActiveTab('dynamics')}
          className={`${TAB_BASE} ${activeTab === 'dynamics' ? TAB_ACTIVE : TAB_IDLE}`}
        >
          <Compass size={14} />
          <span>İlişki dinamikleri</span>
        </button>
      </div>

      {/* Tab 1: Çapraz açılar */}
      {activeTab === 'aspects' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-paper/70">Filtre</span>
            {[
              { id: 'all', label: 'Tüm açılar' },
              { id: 'soul', label: 'Ruh ve duygu (Güneş/Ay)' },
              { id: 'passion', label: 'Tutku ve romantizm (Venüs/Mars)' },
              { id: 'mind', label: 'Zihin ve iletişim (Merkür)' },
              { id: 'karma', label: 'Karmik bağ (Satürn/Jüpiter)' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setAspectFilter(chip.id as 'all' | AspectCategory)}
                className={`min-h-9 border px-3 py-1.5 text-sm transition-colors ${
                  aspectFilter === chip.id
                    ? 'border-rose-signal/50 bg-line font-medium text-rose-signal'
                    : 'border-line text-paper/75 hover:text-paper'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Aspect Cards Grid */}
          {filteredAspects.length === 0 ? (
            <div className="border border-line bg-ink-2 p-6 text-center text-sm text-paper/70">
              Bu kategoride tespit edilen majör Ptolemaic açı bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAspects.map((asp) => (
                <div
                  key={asp.id}
                  className="border border-line bg-ink-2 p-4 sm:p-5 space-y-3 transition-colors hover:border-rose-signal/40"
                >
                  {/* Planets Involved & Aspect */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="flex items-center gap-1 text-gold">
                        <PlanetGlyph planet={asp.p1Planet.id} size={14} />
                        {asp.p1Planet.name}
                      </span>
                      <span className="text-paper/50">⟷</span>
                      <span className="flex items-center gap-1 text-rose-signal">
                        <PlanetGlyph planet={asp.p2Planet.id} size={14} />
                        {asp.p2Planet.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 text-sm">
                      <span
                        className={`font-medium ${
                          asp.nature === 'harmonious'
                            ? 'text-emerald-400'
                            : asp.nature === 'challenging'
                            ? 'text-rose-400'
                            : 'text-primary'
                        }`}
                      >
                        {asp.aspectSymbol} {asp.aspectName} ({asp.angle}°)
                      </span>
                      <span className="font-mono text-xs text-paper/70">
                        {asp.orb}° orb
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h4 className="font-display text-lg font-semibold leading-snug text-paper">
                      {asp.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-paper/80">
                      {asp.summary}
                    </p>
                  </div>

                  {/* Detailed Astrological Interpretation */}
                  <p className="border-t border-line pt-3 text-base leading-relaxed text-paper/85">
                    {asp.detailedInterpretation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Gezegen karşılaştırması */}
      {activeTab === 'placements' && (
        <div className="border border-line bg-ink-2 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-paper/70">
                <th className="px-3 py-3 font-medium">Yerleşim</th>
                <th className="px-3 py-3 font-medium text-gold">{p1Profile.name}</th>
                <th className="px-3 py-3 text-center font-medium">Element etkisi</th>
                <th className="px-3 py-3 font-medium text-rose-signal">{p2Profile.name}</th>
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
                    <td className="px-3 py-3">
                      <div className="flex items-start gap-2">
                        <PlanetGlyph planet={p1Body.id} size={15} className="mt-0.5 shrink-0 text-paper/70" />
                        <div>
                          <div className="font-medium text-paper">{p1Body.name}</div>
                          <div className="text-[13px] leading-snug text-paper/70">{p1Body.meaning}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-gold">
                        <ZodiacGlyph sign={p1Body.signId} size={14} className="shrink-0" />
                        <span className="font-mono font-medium">{p1Body.formatted}</span>
                        <span className="text-xs text-paper/70">({p1Body.element})</span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-sm font-medium ${
                          isHarmonious ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {isSameElement
                          ? 'Aynı element'
                          : isHarmonious
                          ? 'Uyumlu akış'
                          : 'Dinamik gerilim'}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5 text-rose-signal">
                        <ZodiacGlyph sign={p2Body.signId} size={14} className="shrink-0" />
                        <span className="font-mono font-medium">{p2Body.formatted}</span>
                        <span className="text-xs text-paper/70">({p2Body.element})</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: İlişki dinamikleri */}
      {activeTab === 'dynamics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Strengths */}
          <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-base font-semibold text-emerald-400">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>İlişkinin güçlü yönleri</span>
            </div>
            <ol className="space-y-3">
              {analysis.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base leading-relaxed text-paper/85">
                  <span className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-emerald-400">{idx + 1}.</span>
                  <div className="min-w-0">{str}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Column: Growth Areas */}
          <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-base font-semibold text-rose-signal">
              <AlertTriangle size={18} className="shrink-0" />
              <span>Dikkat edilmesi gereken alanlar</span>
            </div>
            <ol className="space-y-3">
              {analysis.growthAreas.map((grow, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base leading-relaxed text-paper/85">
                  <span className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-rose-signal">{idx + 1}.</span>
                  <div className="min-w-0">{grow}</div>
                </li>
              ))}
            </ol>
          </div>

          {/* Advice */}
          <div className="lg:col-span-2 border border-line bg-ink-2 p-4 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 text-base font-semibold text-gold">
              <Lightbulb size={18} className="shrink-0" />
              <span>İlişki tavsiyesi</span>
            </div>
            <p className="text-base leading-relaxed text-paper/85">
              {analysis.advice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
