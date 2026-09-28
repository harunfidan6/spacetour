'use client';

import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Users,
  Flame,
  Globe2,
  Wind,
  Droplets,
  Zap,
  ShieldCheck,
  Compass,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ZODIAC_SIGNS,
  getSunSign,
  calculateAscendant,
  calculateMoonSign
} from '@/data/zodiac';

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

  // Calculate Person 1 Astrological Placements
  const p1Sun = getSunSign(p1Month, p1Day);
  const p1SunIdx = ZODIAC_SIGNS.findIndex((s) => s.id === p1Sun.id);
  const p1Rising = calculateAscendant(p1SunIdx, p1Hour);
  const p1Moon = calculateMoonSign(p1SunIdx, p1Day);
  // Venus approx (within ±2 signs of Sun)
  const p1VenusIdx = ((p1SunIdx + ((p1Day % 3) - 1)) + 12) % 12;
  const p1Venus = ZODIAC_SIGNS[p1VenusIdx];
  // Mars approx
  const p1MarsIdx = ((p1SunIdx + (p1Day % 5) - 2) + 12) % 12;
  const p1Mars = ZODIAC_SIGNS[p1MarsIdx];

  // Calculate Person 2 Astrological Placements
  const p2Sun = getSunSign(p2Month, p2Day);
  const p2SunIdx = ZODIAC_SIGNS.findIndex((s) => s.id === p2Sun.id);
  const p2Rising = calculateAscendant(p2SunIdx, p2Hour);
  const p2Moon = calculateMoonSign(p2SunIdx, p2Day);
  // Venus approx
  const p2VenusIdx = ((p2SunIdx + ((p2Day % 3) - 1)) + 12) % 12;
  const p2Venus = ZODIAC_SIGNS[p2VenusIdx];
  // Mars approx
  const p2MarsIdx = ((p2SunIdx + (p2Day % 5) - 2) + 12) % 12;
  const p2Mars = ZODIAC_SIGNS[p2MarsIdx];

  // Synastry Aspect Computations
  // 1. Sun-Moon Harmony (Soul Connection)
  const isSunMoonHarmonious =
    p1Sun.element === p2Moon.element ||
    p2Sun.element === p1Moon.element ||
    (p1Sun.element === 'Ateş' && p2Moon.element === 'Hava') ||
    (p1Sun.element === 'Hava' && p2Moon.element === 'Ateş') ||
    (p1Sun.element === 'Toprak' && p2Moon.element === 'Su') ||
    (p1Sun.element === 'Su' && p2Moon.element === 'Toprak');

  // 2. Venus-Mars Passion & Erotic Chemistry
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
    <div id="sinastri-analizi" className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Heart className="h-5 w-5 text-rose-400 animate-pulse" />
            <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-widest">
              İKİLİ DOĞUM HARİTASI ÇAPRAZ ANALİZİ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Sinastri & Kozmik İlişki Uyumu
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            İki kişinin doğum tarihlerini ve saatlerini karşılaştırarak Güneş-Ay ruh bağı, Venüs-Mars çekimi ve karmik ilişki dinamiğini hesaplayın.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-2xl text-xs font-mono font-bold">
          <Sparkles size={14} />
          <span>Sinastri Çapraz Algoritması</span>
        </div>
      </div>

      {/* Input Columns for Both Persons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Person 1 Inputs */}
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/20 via-black/40 to-black/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="bg-transparent font-bold text-white text-base outline-none border-b border-dashed border-white/20 focus:border-amber-400"
              />
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              {p1Sun.symbol} {p1Sun.name} Burcu
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">GÜN</label>
              <input
                type="number"
                min={1}
                max={31}
                value={p1Day}
                onChange={(e) => setP1Day(parseInt(e.target.value) || 1)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">AY</label>
              <select
                value={p1Month}
                onChange={(e) => setP1Month(parseInt(e.target.value))}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2 font-bold text-white outline-none cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">YIL</label>
              <input
                type="number"
                min={1920}
                max={2030}
                value={p1Year}
                onChange={(e) => setP1Year(parseInt(e.target.value) || 1995)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">SAAT</label>
              <input
                type="number"
                min={0}
                max={23}
                value={p1Hour}
                onChange={(e) => setP1Hour(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>
          </div>

          {/* Person 1 Planetary Snapshot */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">☉ Güneş</span>
              <span className="font-bold text-amber-300">{p1Sun.symbol} {p1Sun.name}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">☽ Ay</span>
              <span className="font-bold text-purple-300">{p1Moon.symbol} {p1Moon.name}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">↑ Yükselen</span>
              <span className="font-bold text-cyan-300">{p1Rising.symbol} {p1Rising.name}</span>
            </div>
          </div>
        </div>

        {/* Person 2 Inputs */}
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/20 via-black/40 to-black/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="bg-transparent font-bold text-white text-base outline-none border-b border-dashed border-white/20 focus:border-rose-400"
              />
            </div>
            <span className="text-xs font-mono text-rose-300 font-bold">
              {p2Sun.symbol} {p2Sun.name} Burcu
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">GÜN</label>
              <input
                type="number"
                min={1}
                max={31}
                value={p2Day}
                onChange={(e) => setP2Day(parseInt(e.target.value) || 1)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">AY</label>
              <select
                value={p2Month}
                onChange={(e) => setP2Month(parseInt(e.target.value))}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2 font-bold text-white outline-none cursor-pointer"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">YIL</label>
              <input
                type="number"
                min={1920}
                max={2030}
                value={p2Year}
                onChange={(e) => setP2Year(parseInt(e.target.value) || 1995)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">SAAT</label>
              <input
                type="number"
                min={0}
                max={23}
                value={p2Hour}
                onChange={(e) => setP2Hour(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2 font-bold text-white outline-none"
              />
            </div>
          </div>

          {/* Person 2 Planetary Snapshot */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">☉ Güneş</span>
              <span className="font-bold text-rose-300">{p2Sun.symbol} {p2Sun.name}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">☽ Ay</span>
              <span className="font-bold text-purple-300">{p2Moon.symbol} {p2Moon.name}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[9px] text-neutral-400 block">↑ Yükselen</span>
              <span className="font-bold text-cyan-300">{p2Rising.symbol} {p2Rising.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Synastry Score Banner */}
      <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-rose-500/20 border-2 border-rose-400 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <span className="text-2xl font-black text-rose-200 font-mono">%{synastryScore}</span>
            <span className="text-[8px] font-mono text-rose-300 uppercase tracking-widest">SİNASTRİ</span>
          </div>

          <div>
            <div className="text-xs font-mono text-rose-300 font-bold uppercase tracking-wider mb-1">
              KOZMİK KİMYA & RUHSAL REZONANS RAPORU
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {p1Name} ({p1Sun.name}) & {p2Name} ({p2Sun.name})
            </h3>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              {synastryScore >= 90
                ? 'Nadir rastlanan manyetik bir çekim! Element ahenginiz ve duygusal dalga boyunuz birbirinizi doğal bir bütünlük hissiyle besliyor.'
                : synastryScore >= 80
                ? 'Çok güçlü bir ortaklık potansiyeli. Birbirinizin eksik yönlerini tamamlayan yapıcı bir sinerji hakim.'
                : 'Farklı elementlerin dinamik gerilimi. Birbirinize yeni ufuklar katabilir, sabır ve açık iletişimle çok derin bir bağ kurabilirsiniz.'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 font-mono text-xs text-neutral-400 bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
          <div>Güneş-Güneş: <strong className="text-white">{p1Sun.element} + {p2Sun.element}</strong></div>
          <div>Ay Uyumu: <strong className="text-purple-300">{isSunMoonHarmonious ? '✓ Yüksek Rezonans' : 'Dengeli'}</strong></div>
          <div>Venüs-Mars: <strong className="text-rose-300">{isVenusMarsFiery ? '🔥 Yoğun Tutku' : 'Duygusal Uyum'}</strong></div>
        </div>
      </div>

      {/* 4 Deep Synastry Aspect Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aspect 1: Sun-Moon Soul Accord */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-300 font-bold uppercase">☉ - ☽ RUH BAĞI</span>
            <span className="text-neutral-400">Güneş / Ay</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {isSunMoonHarmonious ? 'Duygusal Güven & Yuva Hissi' : 'Öğrenme & Olgunlaşma Bağı'}
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {isSunMoonHarmonious
              ? `${p1Name}'in temel karakteri, ${p2Name}'in içsel duygusal gereksinimleriyle derin bir huzur içinde örtüşüyor.`
              : 'Duygusal tepkilerinizi ifade ederken birbirinizin diline saygı göstermeniz bağı güçlendirir.'}
          </p>
        </div>

        {/* Aspect 2: Venus-Mars Chemistry */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-300 font-bold uppercase">♀ - ♂ ÇEKİM GÜCÜ</span>
            <span className="text-neutral-400">Venüs / Mars</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {isVenusMarsFiery ? 'Manyetik Romantizm & Tutku' : 'Zarif & Saygılı Yakınlık'}
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {isVenusMarsFiery
              ? 'Fiziksel çekim ve flört enerjisi ilişkinin başında kendini çok belirgin hissettirir.'
              : 'Birbirinizin estetik ve duygusal sınırlarına duyulan derin saygı kalıcı bir sevgi inşa eder.'}
          </p>
        </div>

        {/* Aspect 3: Mercury Communication */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold uppercase">☿ - ☿ İLETİŞİM DİLİ</span>
            <span className="text-neutral-400">Merkür Ahengi</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Zihinsel Frekans & Sohbet
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Saatlerce konuşabilme, espri anlayışını paylaşma ve kriz anlarında orta yolu bulma kabiliyetiniz.
          </p>
        </div>

        {/* Aspect 4: Long-term Jupiter/Saturn */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300 font-bold uppercase">♃ - ♄ KARMİK GELECEK</span>
            <span className="text-neutral-400">Jüpiter / Satürn</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Birlikte Büyüme & Sadakat
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Gelecek vizyonunu paylaşma, ortak hedeflere doğru el ele yürüme ve zor zamanlarda birbirine sığınabilme gücü.
          </p>
        </div>
      </div>
    </div>
  );
}
