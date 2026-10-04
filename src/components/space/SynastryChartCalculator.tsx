'use client';

import React, { useState, useId } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import {
  ZODIAC_SIGNS,
  getSunSign,
  calculateAscendant,
  calculateMoonSign,
  daysInMonth,
  innerPlanetSignIndices,
  localSolarHour
} from '@/data/zodiac';
import { Ticks } from '@/components/motion/primitives';
import { NumericInput } from '@/components/ui/NumericInput';

// Birth times are read as Turkish clock time at İstanbul, matching the natal chart's default city
const IST_LONGITUDE = 28.9784;
const TR_UTC_OFFSET = 3;

import {
  ZodiacGlyph,
  PlanetGlyph,
  AscendantGlyph
} from '@/components/ui/CosmicGlyphs';

export function SynastryChartCalculator() {
  // Person 1 State
  const [p1Name, setP1Name] = useState('1. Partner');
  const [p1Day, setP1Day] = useState(21);
  const [p1Month, setP1Month] = useState(3); // March (Aries)
  const [p1Year, setP1Year] = useState(1996);
  const [p1Hour, setP1Hour] = useState(12);

  // Person 2 State
  const [p2Name, setP2Name] = useState('2. Partner');
  const [p2Day, setP2Day] = useState(8);
  const [p2Month, setP2Month] = useState(8); // August (Leo)
  const [p2Year, setP2Year] = useState(1997);
  const [p2Hour, setP2Hour] = useState(18);

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

  // Calculate Person 1 Astrological Placements
  const p1Sun = getSunSign(p1Month, p1Day);
  const p1SunIdx = ZODIAC_SIGNS.findIndex((s) => s.id === p1Sun.id);
  const p1Rising = calculateAscendant(p1SunIdx, localSolarHour(p1Hour, 0, IST_LONGITUDE, TR_UTC_OFFSET));
  const p1Moon = calculateMoonSign(p1SunIdx, p1Day);
  const p1Inner = innerPlanetSignIndices(p1SunIdx, p1Day);
  const p1Venus = ZODIAC_SIGNS[p1Inner.venus];
  const p1Mars = ZODIAC_SIGNS[p1Inner.mars];

  // Calculate Person 2 Astrological Placements
  const p2Sun = getSunSign(p2Month, p2Day);
  const p2SunIdx = ZODIAC_SIGNS.findIndex((s) => s.id === p2Sun.id);
  const p2Rising = calculateAscendant(p2SunIdx, localSolarHour(p2Hour, 0, IST_LONGITUDE, TR_UTC_OFFSET));
  const p2Moon = calculateMoonSign(p2SunIdx, p2Day);
  const p2Inner = innerPlanetSignIndices(p2SunIdx, p2Day);
  const p2Venus = ZODIAC_SIGNS[p2Inner.venus];
  const p2Mars = ZODIAC_SIGNS[p2Inner.mars];

  // Synastry Aspect Computations
  // 1. Sun-Moon Harmony (Soul Connection)
  const isSunMoonHarmonious =
    p1Sun.element === p2Moon.element ||
    p2Sun.element === p1Moon.element ||
    (p1Sun.element === 'Ateş' && p2Moon.element === 'Hava') ||
    (p1Sun.element === 'Hava' && p2Moon.element === 'Ateş') ||
    (p1Sun.element === 'Toprak' && p2Moon.element === 'Su') ||
    (p1Sun.element === 'Su' && p2Moon.element === 'Toprak');

  // 2. Venus-Mars Passion & Chemistry
  const isVenusMarsFiery =
    p1Venus.element === p2Mars.element ||
    p2Venus.element === p1Mars.element ||
    p1Venus.element === p2Venus.element;

  // 3. Sun-Sun Core Identity Chemistry
  const isSunSunCompatible = p1Sun.loveCompatibility.includes(p2Sun.id);
  const isSunSunSameElement = p1Sun.element === p2Sun.element;

  // Overall Score Calculation (Scale: 68 - 98)
  let synastryScore = 72;
  if (isSunSunCompatible) synastryScore += 10;
  if (isSunSunSameElement) synastryScore += 6;
  if (isSunMoonHarmonious) synastryScore += 8;
  if (isVenusMarsFiery) synastryScore += 6;
  synastryScore = Math.min(synastryScore, 98);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  return (
    <div id="sinastri-analizi" className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-rose-signal">
            <Heart className="h-4 w-4 animate-pulse" />
            <span>İKİLİ DOĞUM HARİTASI ÇAPRAZ ANALİZİ</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Sinastri <span className="serif-i text-rose-signal">& Kozmik İlişki Uyumu</span>
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            İki kişinin doğum anlarındaki Güneş, Ay, Yükselen ve Venüs-Mars fasetlerini karşılaştırarak ruhsal çekim ve uzun vadeli dinamikleri hesaplayın.
          </p>
        </div>

        <div className="flex items-center gap-2 label text-rose-signal bg-ink-2 border border-line px-4 py-2 shrink-0">
          <Sparkles size={14} />
          <span>Sinastri Çapraz Algoritması</span>
        </div>
      </div>

      {/* Input Columns for Both Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Person 1 Inputs */}
        <div className="border border-line bg-ink-2 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              <input aria-label="Birinci partnerin adı"
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="min-w-0 w-full bg-transparent font-bold text-paper text-base outline-none border-b border-dashed border-line focus:border-gold"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap label text-gold font-bold">
              <ZodiacGlyph sign={p1Sun.id} size={16} className="text-gold" />
              <span>{p1Sun.name} Burcu</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs font-mono sm:grid-cols-4">
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
          </div>

          {/* Person 1 Planetary Snapshot with Bespoke Glyphs */}
          <div className="grid grid-cols-3 gap-px border border-line bg-line pt-0 text-[11px] font-mono">
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="sun" size={11} className="text-gold" />
                Güneş
              </span>
              <span className="font-bold text-gold flex items-center gap-1">
                <ZodiacGlyph sign={p1Sun.id} size={13} />
                {p1Sun.name}
              </span>
            </div>
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="moon" size={11} className="text-violet" />
                Ay
              </span>
              <span className="font-bold text-violet flex items-center gap-1">
                <ZodiacGlyph sign={p1Moon.id} size={13} />
                {p1Moon.name}
              </span>
            </div>
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <AscendantGlyph size={11} className="text-paper" />
                Yükselen
              </span>
              <span className="font-bold text-paper flex items-center gap-1">
                <ZodiacGlyph sign={p1Rising.id} size={13} />
                {p1Rising.name}
              </span>
            </div>
          </div>
        </div>

        {/* Person 2 Inputs */}
        <div className="border border-line bg-ink-2 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-signal" />
              <input aria-label="İkinci partnerin adı"
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="min-w-0 w-full bg-transparent font-bold text-paper text-base outline-none border-b border-dashed border-line focus:border-rose-signal"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap label text-rose-signal font-bold">
              <ZodiacGlyph sign={p2Sun.id} size={16} className="text-rose-signal" />
              <span>{p2Sun.name} Burcu</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line text-xs font-mono sm:grid-cols-4">
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
          </div>

          {/* Person 2 Planetary Snapshot with Bespoke Glyphs */}
          <div className="grid grid-cols-3 gap-px border border-line bg-line pt-0 text-[11px] font-mono">
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="sun" size={11} className="text-gold" />
                Güneş
              </span>
              <span className="font-bold text-rose-signal flex items-center gap-1">
                <ZodiacGlyph sign={p2Sun.id} size={13} />
                {p2Sun.name}
              </span>
            </div>
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <PlanetGlyph planet="moon" size={11} className="text-violet" />
                Ay
              </span>
              <span className="font-bold text-violet flex items-center gap-1">
                <ZodiacGlyph sign={p2Moon.id} size={13} />
                {p2Moon.name}
              </span>
            </div>
            <div className="p-2.5 bg-ink text-center flex flex-col items-center gap-1">
              <span className="label text-[10px] text-muted flex items-center gap-1">
                <AscendantGlyph size={11} className="text-paper" />
                Yükselen
              </span>
              <span className="font-bold text-paper flex items-center gap-1">
                <ZodiacGlyph sign={p2Rising.id} size={13} />
                {p2Rising.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Synastry Score Banner */}
      <div className="border border-line bg-ink-2 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="h-20 w-20 bg-rose-signal/15 border border-rose-signal flex flex-col items-center justify-center text-center shrink-0">
            <span className="text-2xl font-black text-rose-signal font-mono">%{synastryScore}</span>
            <span className="label text-[10px] text-rose-signal">SİNASTRİ</span>
          </div>

          <div>
            <div className="label text-rose-signal mb-1">
              KOZMİK KİMYA & RUHSAL REZONANS RAPORU
            </div>
            <h3 className="display display-tight text-2xl sm:text-3xl font-black text-paper">
              {p1Name} ({p1Sun.name}) & {p2Name} ({p2Sun.name})
            </h3>
            <p className="text-xs text-paper/75 mt-1 max-w-xl leading-relaxed">
              {synastryScore >= 90
                ? 'Nadir rastlanan manyetik bir çekim! Element ahenginiz ve duygusal dalga boyunuz birbirinizi doğal bir bütünlük hissiyle besliyor.'
                : synastryScore >= 80
                ? 'Çok güçlü bir ortaklık potansiyeli. Birbirinizin eksik yönlerini tamamlayan yapıcı bir sinerji hakim.'
                : 'Farklı elementlerin dinamik gerilimi. Birbirinize yeni ufuklar katabilir, sabır ve açık iletişimle çok derin bir bağ kurabilirsiniz.'}
            </p>
          </div>
        </div>

        <div className="w-full text-left md:w-auto md:text-right shrink-0 font-mono text-xs text-muted bg-ink p-4 border border-line space-y-1">
          <div>Güneş-Güneş: <strong className="text-paper">{p1Sun.element} + {p2Sun.element}</strong></div>
          <div>Ay Uyumu: <strong className="text-violet">{isSunMoonHarmonious ? 'Yüksek Rezonans' : 'Dengeli'}</strong></div>
          <div>Venüs-Mars: <strong className="text-rose-signal">{isVenusMarsFiery ? 'Yoğun Tutku' : 'Duygusal Uyum'}</strong></div>
        </div>
      </div>

      {/* 4 Deep Synastry Aspect Cards with Bespoke Glyphs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-line bg-line">
        {/* Aspect 1: Sun-Moon Soul Accord */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="label text-gold flex items-center gap-1.5">
              <PlanetGlyph planet="sun" size={13} className="text-gold" />
              <PlanetGlyph planet="moon" size={13} className="text-violet" />
              RUH BAĞI
            </span>
            <span className="label text-muted">Güneş / Ay</span>
          </div>
          <h4 className="display display-tight text-sm font-bold text-paper">
            {isSunMoonHarmonious ? 'Duygusal Güven & Yuva Hissi' : 'Öğrenme & Olgunlaşma Bağı'}
          </h4>
          <p className="text-xs text-paper/75 leading-relaxed font-sans">
            {isSunMoonHarmonious
              ? `${p1Name} ve ${p2Name} arasında temel karakter ile içsel duygusal gereksinimler derin bir huzur içinde örtüşüyor.`
              : 'Duygusal tepkilerinizi ifade ederken birbirinizin diline saygı göstermeniz bağı güçlendirir.'}
          </p>
        </div>

        {/* Aspect 2: Venus-Mars Chemistry */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="label text-rose-signal flex items-center gap-1.5">
              <PlanetGlyph planet="venus" size={13} className="text-pink-400" />
              <PlanetGlyph planet="mars" size={13} className="text-rose-signal" />
              ÇEKİM GÜCÜ
            </span>
            <span className="label text-muted">Venüs / Mars</span>
          </div>
          <h4 className="display display-tight text-sm font-bold text-paper">
            {isVenusMarsFiery ? 'Manyetik Romantizm & Tutku' : 'Zarif & Saygılı Yakınlık'}
          </h4>
          <p className="text-xs text-paper/75 leading-relaxed font-sans">
            {isVenusMarsFiery
              ? 'Fiziksel çekim ve flört enerjisi ilişkinin başında kendini çok belirgin hissettirir.'
              : 'Birbirinizin estetik ve duygusal sınırlarına duyulan derin saygı kalıcı bir sevgi inşa eder.'}
          </p>
        </div>

        {/* Aspect 3: Mercury Communication */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="label text-primary flex items-center gap-1.5">
              <PlanetGlyph planet="mercury" size={13} className="text-primary" />
              İLETİŞİM DİLİ
            </span>
            <span className="label text-muted">Merkür Ahengi</span>
          </div>
          <h4 className="display display-tight text-sm font-bold text-paper">
            Zihinsel Frekans & Sohbet
          </h4>
          <p className="text-xs text-paper/75 leading-relaxed font-sans">
            Saatlerce konuşabilme, espri anlayışını paylaşma ve kriz anlarında orta yolu bulma kabiliyetiniz.
          </p>
        </div>

        {/* Aspect 4: Long-term Jupiter/Saturn */}
        <div className="bg-ink-2 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="label text-violet flex items-center gap-1.5">
              <PlanetGlyph planet="jupiter" size={13} className="text-lime" />
              <PlanetGlyph planet="saturn" size={13} className="text-violet" />
              KARMİK GELECEK
            </span>
            <span className="label text-muted">Jüpiter / Satürn</span>
          </div>
          <h4 className="display display-tight text-sm font-bold text-paper">
            Birlikte Büyüme & Sadakat
          </h4>
          <p className="text-xs text-paper/75 leading-relaxed font-sans">
            Gelecek vizyonunu paylaşma, ortak hedeflere doğru el ele yürüme ve zor zamanlarda birbirine sığınabilme gücü.
          </p>
        </div>
      </div>
    </div>
  );
}
