'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Shuffle,
  Shield,
  Lightbulb,
  HeartHandshake,
  Compass,
  RotateCw,
  Eye,
  Layers,
  Flame,
  Globe2,
  Wind,
  Droplets
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import {
  ZodiacGlyph,
  PlanetGlyph,
  AstrolabeGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph
} from '@/components/ui/CosmicGlyphs';
import { MAJOR_ARCANA_DECK, type TarotCard } from '@/data/tarotDeck';

export type SpreadType = 'single' | 'three' | 'decision';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel: string;
  positionDesc: string;
}

export function CosmicTarotDrawer() {
  const [spreadType, setSpreadType] = useState<SpreadType>('three');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'genel' | 'ask' | 'kariyer' | 'ruhsal'>('genel');

  // Spread definitions
  const SPREAD_CONFIGS: Record<SpreadType, { name: string; count: number; desc: string; slots: { label: string; desc: string }[] }> = {
    single: {
      name: 'Günün Rehber Kartı',
      count: 1,
      desc: 'Bugünün temel enerjisini, içsel sınavını ve kozmik olumlamasını ortaya koyar.',
      slots: [
        { label: 'GÜNÜN REHBERİ', desc: 'Bugünün ana kozmik teması ve odak noktası' }
      ]
    },
    three: {
      name: 'Keltik Zaman Triadı',
      count: 3,
      desc: 'Geçmişin köklerini, şu anki eşiği ve geleceğin kadersel potansiyelini okur.',
      slots: [
        { label: '01. GEÇMİŞİN KÖKÜ', desc: 'Şu anki durumu hazırlayan temel dinamik' },
        { label: '02. ŞİMDİKİ EŞİK', desc: 'Aşılması gereken anlık sınav veya meydan okuma' },
        { label: '03. GELECEK POTANSİYELİ', desc: 'Eylemlerinizin evrileceği en yüksek sonuç' }
      ]
    },
    decision: {
      name: 'Karar & İkilem Aynası',
      count: 3,
      desc: 'İki farklı yol arasındaki enerjiyi ve her iki yolun sentezini çözümler.',
      slots: [
        { label: 'YOL A (BİRİNCİ SEÇENEK)', desc: 'İlk tercihin getireceği deneyim ve enerji' },
        { label: 'YOL B (İKİNCİ SEÇENEK)', desc: 'İkinci tercihin olası yansımaları ve bedeli' },
        { label: 'KOZMİK SENTEZ', desc: 'İki yolun ötesindeki en bilgece ortak payda' }
      ]
    }
  };

  // Perform draw
  const performDraw = (type: SpreadType) => {
    setIsShuffling(true);
    setTimeout(() => {
      const config = SPREAD_CONFIGS[type];
      const shuffled = [...MAJOR_ARCANA_DECK].sort(() => Math.random() - 0.5);
      const drawn: DrawnCard[] = [];

      for (let i = 0; i < config.count; i++) {
        const isReversed = Math.random() > 0.65; // 35% chance of reversed
        drawn.push({
          card: shuffled[i],
          isReversed,
          positionLabel: config.slots[i].label,
          positionDesc: config.slots[i].desc
        });
      }

      setDrawnCards(drawn);
      setSelectedCardIdx(0);
      setIsShuffling(false);
    }, 600);
  };

  // Initial draw on mount
  React.useEffect(() => {
    performDraw('three');
  }, []);

  const activeDrawnCard = drawnCards[selectedCardIdx] || drawnCards[0];

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8" id="kozmik-tarot">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-solar">
            <AstrolabeGlyph size={16} />
            <span>22 MAJÖR ARKANA · KUTSAL GEOMETRİ ORACULUM</span>
          </div>
          <h3 className="display display-tight text-3xl sm:text-4xl text-paper mt-2">
            Kozmik Tarot Açılımı
          </h3>
          <p className="text-sm text-paper/70 mt-1 max-w-2xl leading-relaxed">
            Kadim arketiplerin ve zodyak simyasının aynasında ruhsal rehberlik alın. Açılım türünü seçip desteyi karıştırın.
          </p>
        </div>

        {/* Spread Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 border border-line bg-ink-2">
          {(['single', 'three', 'decision'] as SpreadType[]).map((type) => {
            const isActive = spreadType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  setSpreadType(type);
                  performDraw(type);
                }}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                  isActive
                    ? 'border-solar bg-solar text-ink font-bold shadow-xs'
                    : 'border-transparent text-muted hover:text-paper hover:border-line'
                }`}
              >
                {SPREAD_CONFIGS[type].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-line/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted uppercase">
            AÇILIM DÜZENİ:
          </span>
          <span className="text-xs font-mono text-paper font-bold px-2 py-0.5 border border-line bg-ink-2">
            {SPREAD_CONFIGS[spreadType].name} ({SPREAD_CONFIGS[spreadType].count} KART)
          </span>
          <span className="hidden sm:inline text-xs font-mono text-muted">
            · {SPREAD_CONFIGS[spreadType].desc}
          </span>
        </div>

        <button
          onClick={() => performDraw(spreadType)}
          disabled={isShuffling}
          className="inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border border-solar text-solar hover:bg-solar hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
        >
          <Shuffle size={14} className={isShuffling ? 'animate-spin' : ''} />
          <span>{isShuffling ? 'Desteler Karıştırılıyor…' : 'Desteyi Yeniden Karıştır & Çek'}</span>
        </button>
      </div>

      {/* Cards Table Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {drawnCards.map((drawn, idx) => {
          const isSelected = selectedCardIdx === idx;
          const { card, isReversed, positionLabel } = drawn;

          return (
            <div
              key={`${card.id}-${idx}`}
              onClick={() => setSelectedCardIdx(idx)}
              className={`group relative flex flex-col p-6 border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-solar bg-ink-3 ring-1 ring-solar/40 shadow-lg shadow-solar/5'
                  : 'border-line bg-ink-2 hover:border-solar/40 hover:bg-ink-3/70'
              }`}
            >
              {/* Position Header */}
              <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <span className="font-mono text-[10px] text-solar font-bold uppercase tracking-wider">
                  {positionLabel}
                </span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 border uppercase font-bold tracking-wider ${
                    isReversed
                      ? 'border-rose/50 bg-rose/10 text-rose'
                      : 'border-lime/50 bg-lime/10 text-lime'
                  }`}
                >
                  {isReversed ? 'TERS (GÖLGE)' : 'DÜZ (AYDINLIK)'}
                </span>
              </div>

              {/* Tarot Card Frame */}
              <div className="relative aspect-[2/3] w-full border border-line bg-ink p-4 flex flex-col justify-between items-center overflow-hidden group-hover:border-solar/60 transition-colors">
                {/* Background Sacred Geometric Pattern */}
                <div className="absolute inset-2 border border-line/40 pointer-events-none" />
                <div className="absolute inset-3 border border-dashed border-line/20 pointer-events-none" />

                {/* Top Number & Element */}
                <div className="w-full flex items-center justify-between text-xs font-mono text-muted z-10">
                  <span className="font-bold text-paper">{card.number}</span>
                  <span className="text-[10px] text-solar border border-solar/30 px-1 py-0.2">
                    {card.element}
                  </span>
                </div>

                {/* Center Sacred Glyph Art */}
                <div className="my-auto flex flex-col items-center text-center z-10 py-3">
                  <div className={`p-4 rounded-full border border-line bg-ink-2/80 mb-3 shadow-inner transition-transform duration-500 ${isReversed ? 'rotate-180' : 'group-hover:scale-105'}`}>
                    {card.glyphType === 'zodiac' ? (
                      <ZodiacGlyph sign={card.glyphId} size={42} className="text-solar" />
                    ) : card.glyphType === 'planet' ? (
                      <PlanetGlyph planet={card.glyphId} size={42} className="text-solar" />
                    ) : (
                      <AstrolabeGlyph size={42} className="text-solar" />
                    )}
                  </div>
                  <h4 className="font-mono text-base font-bold text-paper tracking-wide">
                    {card.name}
                  </h4>
                  <span className="font-mono text-[10px] text-muted mt-0.5 italic">
                    {card.nameEn}
                  </span>
                </div>

                {/* Bottom Archetype */}
                <div className="w-full text-center border-t border-line/60 pt-2 z-10">
                  <span className="font-mono text-[10px] text-paper/80 line-clamp-1">
                    {card.archetype}
                  </span>
                </div>
              </div>

              {/* Click Indicator */}
              <div className="mt-4 pt-2 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted">
                <span>{card.associatedSignOrPlanet}</span>
                <span className={isSelected ? 'text-solar font-bold' : 'group-hover:text-paper'}>
                  {isSelected ? '● İNCELENİYOR' : 'Ayrıntıları Gör →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Card Deep Cosmic Dossier */}
      {activeDrawnCard && (
        <div className="border border-solar/40 bg-ink-2 p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Card Meta Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-solar font-bold uppercase tracking-widest">
                  SEÇİLİ KART TELEMETRİSİ · {activeDrawnCard.positionLabel}
                </span>
                <span className="text-muted">·</span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${
                  activeDrawnCard.isReversed ? 'border-rose/50 bg-rose/10 text-rose' : 'border-lime/50 bg-lime/10 text-lime'
                }`}>
                  {activeDrawnCard.isReversed ? 'TERS KONUM' : 'DÜZ KONUM'}
                </span>
              </div>
              <h4 className="display text-2xl sm:text-3xl text-paper">
                {activeDrawnCard.card.number}. {activeDrawnCard.card.name} ({activeDrawnCard.card.nameEn})
              </h4>
              <p className="font-mono text-xs text-gold mt-1">
                {activeDrawnCard.card.archetype} · {activeDrawnCard.card.associatedSignOrPlanet}
              </p>
            </div>

            {/* Sub-tab Switcher for Detailed Interpretation */}
            <div className="flex items-center gap-1 border border-line bg-ink p-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('genel')}
                className={`px-3 py-1 cursor-pointer transition-colors border uppercase ${
                  activeTab === 'genel' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                Genel Rehberlik
              </button>
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-3 py-1 cursor-pointer transition-colors border uppercase ${
                  activeTab === 'ask' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                Aşk & Kalp
              </button>
              <button
                onClick={() => setActiveTab('kariyer')}
                className={`px-3 py-1 cursor-pointer transition-colors border uppercase ${
                  activeTab === 'kariyer' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                Kariyer & Para
              </button>
              <button
                onClick={() => setActiveTab('ruhsal')}
                className={`px-3 py-1 cursor-pointer transition-colors border uppercase ${
                  activeTab === 'ruhsal' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                Ruhsal Simya
              </button>
            </div>
          </div>

          {/* Dossier Content Based on Tab */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              {activeTab === 'genel' && (
                <div className="space-y-4 font-mono">
                  <div className="p-4 border border-line bg-ink">
                    <span className="text-[11px] text-solar uppercase font-bold block mb-1">
                      {activeDrawnCard.isReversed ? activeDrawnCard.card.reversed.title : activeDrawnCard.card.upright.title}
                    </span>
                    <p className="text-sm text-paper/90 leading-relaxed">
                      {activeDrawnCard.isReversed
                        ? activeDrawnCard.card.reversed.warning
                        : activeDrawnCard.card.upright.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border border-line bg-ink">
                      <span className="text-muted block uppercase text-[10px]">Aydınlık Anahtarları</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activeDrawnCard.card.upright.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 bg-ink-2 border border-line text-paper">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 border border-line bg-ink">
                      <span className="text-muted block uppercase text-[10px]">Gölge Anahtarları</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activeDrawnCard.card.reversed.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 bg-ink-2 border border-line text-rose">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ask' && (
                <div className="p-5 border border-line bg-ink font-mono space-y-3">
                  <div className="flex items-center gap-2 text-rose">
                    <HeartHandshake size={16} />
                    <span className="text-xs uppercase font-bold">Aşk, Çekim & Duygusal Sinerji</span>
                  </div>
                  <p className="text-sm text-paper/90 leading-relaxed">
                    {activeDrawnCard.card.upright.loveGuidance}
                  </p>
                </div>
              )}

              {activeTab === 'kariyer' && (
                <div className="p-5 border border-line bg-ink font-mono space-y-3">
                  <div className="flex items-center gap-2 text-solar">
                    <Compass size={16} />
                    <span className="text-xs uppercase font-bold">Kariyer, Başarı & Maddi Fırsatlar</span>
                  </div>
                  <p className="text-sm text-paper/90 leading-relaxed">
                    {activeDrawnCard.card.upright.careerGuidance}
                  </p>
                </div>
              )}

              {activeTab === 'ruhsal' && (
                <div className="p-5 border border-line bg-ink font-mono space-y-3">
                  <div className="flex items-center gap-2 text-violet">
                    <Lightbulb size={16} />
                    <span className="text-xs uppercase font-bold">Ruhsal Evrim & Bilinç Seviyesi</span>
                  </div>
                  <p className="text-sm text-paper/90 leading-relaxed">
                    {activeDrawnCard.card.upright.spiritualGuidance}
                  </p>
                </div>
              )}

              {/* Cosmic Affirmation Banner */}
              <div className="p-4 border border-line bg-ink flex items-start gap-3">
                <Sparkles size={16} className="text-solar shrink-0 mt-0.5" />
                <div className="font-mono text-xs">
                  <span className="text-muted uppercase block text-[10px]">Günün Kutsal Olumlaması</span>
                  <p className="text-paper italic font-serif text-sm mt-0.5">
                    &quot;{activeDrawnCard.card.affirmation}&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Astrological Correspondences */}
            <div className="lg:col-span-4 border border-line bg-ink p-5 space-y-4 font-mono text-xs">
              <span className="text-[10px] text-muted uppercase tracking-widest block border-b border-line pb-2">
                ASTROLOJİK HİZALANMA
              </span>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Kozmik Element:</span>
                  <span className="text-paper font-bold flex items-center gap-1.5">
                    {activeDrawnCard.card.element === 'Ateş' && <FireElementGlyph size={14} className="text-solar" />}
                    {activeDrawnCard.card.element === 'Toprak' && <EarthElementGlyph size={14} className="text-lime" />}
                    {activeDrawnCard.card.element === 'Hava' && <AirElementGlyph size={14} className="text-cyan-400" />}
                    {activeDrawnCard.card.element === 'Su' && <WaterElementGlyph size={14} className="text-blue-400" />}
                    {activeDrawnCard.card.element}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted">Yönetici Prensip:</span>
                  <span className="text-paper font-bold">{activeDrawnCard.card.associatedSignOrPlanet}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted">Arkana Seviyesi:</span>
                  <span className="text-gold font-bold">Majör Arkana ({activeDrawnCard.card.numericValue}/21)</span>
                </div>

                <div className="pt-2 border-t border-line text-[11px] text-muted leading-relaxed">
                  <strong className="text-paper">Transit Etkisi:</strong> {activeDrawnCard.card.astrologicalAspect}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
