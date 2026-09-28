'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Compass,
  Telescope,
  Flame,
  Globe2,
  Wind,
  Droplets,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Moon,
  Sun,
  Shield,
  Zap,
  Clock,
  Shuffle,
  Info
} from 'lucide-react';
import {
  ZODIAC_SIGNS,
  ZodiacSign,
  ZodiacElement
} from '@/data/zodiac';
import { NatalChartCalculator } from '@/components/space/NatalChartCalculator';
import { DailyCosmicTransitWidget } from '@/components/space/DailyCosmicTransitWidget';
import { CosmicTarotDrawer } from '@/components/space/CosmicTarotDrawer';
import { SynastryChartCalculator } from '@/components/space/SynastryChartCalculator';

export default function AstrolojiPage() {
  const [selectedElement, setSelectedElement] = useState<string>('Tümü');
  const [activeSignModal, setActiveSignModal] = useState<ZodiacSign | null>(null);

  // Compatibility state
  const [compSign1, setCompSign1] = useState<string>('koc');
  const [compSign2, setCompSign2] = useState<string>('aslan');

  const filteredSigns = ZODIAC_SIGNS.filter((s) => {
    if (selectedElement === 'Tümü') return true;
    return s.element === selectedElement;
  });

  const elementIcons: Record<ZodiacElement, any> = {
    Ateş: Flame,
    Toprak: Globe2,
    Hava: Wind,
    Su: Droplets
  };

  // Compatibility calculation
  const s1 = ZODIAC_SIGNS.find((s) => s.id === compSign1) || ZODIAC_SIGNS[0];
  const s2 = ZODIAC_SIGNS.find((s) => s.id === compSign2) || ZODIAC_SIGNS[4];

  const isHighlyCompatible = s1.loveCompatibility.includes(s2.id);
  const isSameElement = s1.element === s2.element;
  const compatibilityScore = isHighlyCompatible ? 94 : isSameElement ? 88 : (s1.element === 'Ateş' && s2.element === 'Hava') || (s1.element === 'Hava' && s2.element === 'Ateş') ? 91 : (s1.element === 'Toprak' && s2.element === 'Su') || (s1.element === 'Su' && s2.element === 'Toprak') ? 93 : 74;

  return (
    <div className="min-h-screen bg-black/40 text-foreground p-4 sm:p-8 lg:p-12 relative z-10 space-y-16 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-amber-300 backdrop-blur-xl">
          <Sparkles size={14} className="animate-pulse" />
          <span>GÖKYÜZÜ ARKETİPLERİ & KOZMİK REHBER</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
          Astroloji &{' '}
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-400 bg-clip-text text-transparent">
            Zodyak Atlası
          </span>
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-neutral-300 leading-relaxed">
          Kadim astronomi gözlemleriyle şekillenen 12 zodyak takımyıldızını, kişisel doğum haritanızı, gezegenlerin ev dağılımını ve kozmik arketipleri keşfedin.
        </p>

        {/* Quick Nav Anchor Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
          <a
            href="#dogum-haritasi"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-amber-400 hover:bg-amber-400/10 hover:text-amber-300 transition-all"
          >
            ☉ Doğum Haritası & Numeroloji
          </a>
          <a
            href="#gunluk-transitler"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 transition-all"
          >
            ⏱️ Günlük Transitler & Burçlar
          </a>
          <a
            href="#kozmik-tarot"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-purple-400 hover:bg-purple-400/10 hover:text-purple-300 transition-all"
          >
            🔮 Kozmik Tarot Arketipi
          </a>
          <a
            href="#zodyak-atlasi"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-rose-400 hover:bg-rose-400/10 hover:text-rose-300 transition-all"
          >
            ♈ 12 Zodyak Rehberi
          </a>
          <a
            href="#sinastri-analizi"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-rose-400 hover:bg-rose-400/10 hover:text-rose-300 transition-all"
          >
            💞 Sinastri & İkili İlişki
          </a>
          <a
            href="#burc-uyumu"
            className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-pink-400 hover:bg-pink-400/10 hover:text-pink-300 transition-all"
          >
            💖 Burç Uyumu & Kimya
          </a>
        </div>
      </div>

      {/* 1. Interactive Natal Chart Calculator Module */}
      <section>
        <NatalChartCalculator />
      </section>

      {/* 2. Daily Cosmic Transits & 12 Horoscopes Widget */}
      <section>
        <DailyCosmicTransitWidget />
      </section>

      {/* 3. Cosmic Tarot & Archetype Drawer */}
      <section>
        <CosmicTarotDrawer />
      </section>

      {/* 4. Zodiac Sign Directory */}
      <section id="zodyak-atlasi" className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">12 Zodyak Takımyıldızı & Burçlar</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Her burcun element, yönetici gezegen, mitolojik arketip ve tarot karşılıkları.
            </p>
          </div>

          {/* Element Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-black/60 p-1.5 border border-white/10 text-xs font-mono">
            {['Tümü', 'Ateş', 'Toprak', 'Hava', 'Su'].map((elem) => (
              <button
                key={elem}
                onClick={() => setSelectedElement(elem)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedElement === elem
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {elem}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Signs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSigns.map((sign) => {
            const Icon = elementIcons[sign.element];
            return (
              <div
                key={sign.id}
                onClick={() => setActiveSignModal(sign)}
                className="group rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{sign.symbol}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-neutral-300 flex items-center gap-1">
                      <Icon size={11} />
                      {sign.element}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {sign.name}
                  </h3>
                  <div className="text-[11px] font-mono text-neutral-400">{sign.dates}</div>

                  <p className="text-xs text-neutral-300 leading-relaxed mt-3 line-clamp-3">
                    {sign.overview}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Yönetici: <strong className="text-cyan-400">{sign.rulingPlanet}</strong></span>
                  <span className="text-amber-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    İncele <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Zodiac Compatibility Matrix */}
      <section id="burc-uyumu" className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Heart className="h-5 w-5 text-rose-400 animate-pulse" />
            <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-widest">
              KOZMİK KİMYA & İLİŞKİ SİNERJİSİ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Burç Uyumu & Element Dinamiği</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            İki burç arasındaki çekim gücünü, iletişim ahengini ve element sinerjisini hesaplayın.
          </p>
        </div>

        {/* Sign Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-[10px] font-mono text-neutral-400 block mb-2">1. BURÇ</label>
            <select
              value={compSign1}
              onChange={(e) => setCompSign1(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-sm font-bold text-white outline-none cursor-pointer"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} {s.name} ({s.dates})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-[10px] font-mono text-neutral-400 block mb-2">2. BURÇ</label>
            <select
              value={compSign2}
              onChange={(e) => setCompSign2(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-sm font-bold text-white outline-none cursor-pointer"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} {s.name} ({s.dates})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compatibility Output Banner */}
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black/60 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl">{s1.symbol} + {s2.symbol}</div>
            <div>
              <div className="text-xl font-bold text-white">
                {s1.name} & {s2.name} Sinerjisi
              </div>
              <div className="text-xs font-mono text-neutral-400 mt-1">
                {s1.element} ({s1.modality}) • {s2.element} ({s2.modality})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">Kozmik Uyum Skoru</span>
              <span className="text-3xl font-black text-rose-300 font-mono">%{compatibilityScore}</span>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-rose-400 flex items-center justify-center font-bold text-sm bg-rose-500/20 text-rose-200">
              {compatibilityScore >= 90 ? '⭐⭐⭐' : compatibilityScore >= 80 ? '⭐⭐' : '⭐'}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Advanced Synastry & Dual Birth Chart Synergy */}
      <section>
        <SynastryChartCalculator />
      </section>

      {/* Detailed Modal on Click */}
      {activeSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="max-w-2xl w-full rounded-3xl border border-white/15 bg-neutral-950 p-6 sm:p-8 space-y-6 text-white shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveSignModal(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-sm font-mono p-1 cursor-pointer"
            >
              ✕ Kapat
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <span className="text-5xl">{activeSignModal.symbol}</span>
              <div>
                <h3 className="text-3xl font-black">{activeSignModal.name}</h3>
                <div className="text-xs font-mono text-neutral-400">
                  {activeSignModal.latinName} • {activeSignModal.dates}
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {activeSignModal.overview}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-neutral-400 block">Element & Nitelik</span>
                <span className="font-bold text-white">{activeSignModal.element} • {activeSignModal.modality}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-neutral-400 block">Yönetici Gezegen</span>
                <span className="font-bold text-cyan-400">{activeSignModal.rulingPlanet}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-neutral-400 block">Uğurlu Taş</span>
                <span className="font-bold text-amber-300">{activeSignModal.details.stone}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-neutral-400 block">Mitolojik Arketip</span>
                <span className="font-bold text-rose-300">{activeSignModal.traits.archetype}</span>
              </div>
            </div>

            {/* Tarot & Guidance Box */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-mono font-bold uppercase">
                <Sparkles size={14} />
                <span>Tarot Arketipi: {activeSignModal.tarotCard.name} ({activeSignModal.tarotCard.number})</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                {activeSignModal.tarotCard.symbolism}
              </p>
              <p className="text-amber-200/90 italic pt-1">
                Kozmik Rehberlik: {activeSignModal.tarotCard.guidance}
              </p>
            </div>

            {/* Strengths & Shadows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase">Güçlü Yönler</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSignModal.traits.strengths.map((str) => (
                    <span key={str} className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      ✓ {str}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase">Gölge Yönler</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeSignModal.traits.shadows.map((shd) => (
                    <span key={shd} className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      ⚠ {shd}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-white/10 text-xs font-mono">
              <Link
                href="/harita"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors"
              >
                <Telescope size={14} />
                <span>3D Haritada {activeSignModal.name} Takımyıldızını Gör</span>
              </Link>

              <button
                onClick={() => setActiveSignModal(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
