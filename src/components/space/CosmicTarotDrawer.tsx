'use client';

import React, { useState } from 'react';
import {
  Shuffle,
  Lightbulb,
  HeartHandshake,
  Compass
} from 'lucide-react';
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

// Spread definitions
const SPREAD_CONFIGS: Record<SpreadType, { name: string; count: number; desc: string; slots: { label: string; desc: string }[] }> = {
  single: {
    name: 'Günün rehber kartı',
    count: 1,
    desc: 'Bugünün temel enerjisini, içsel sınavını ve kozmik olumlamasını ortaya koyar.',
    slots: [
      { label: 'Günün rehberi', desc: 'Bugünün ana kozmik teması ve odak noktası' }
    ]
  },
  three: {
    name: 'Keltik zaman triadı',
    count: 3,
    desc: 'Geçmişin köklerini, şu anki eşiği ve geleceğin kadersel potansiyelini okur.',
    slots: [
      { label: 'Geçmişin kökü', desc: 'Şu anki durumu hazırlayan temel dinamik' },
      { label: 'Şimdiki eşik', desc: 'Aşılması gereken anlık sınav veya meydan okuma' },
      { label: 'Gelecek potansiyeli', desc: 'Eylemlerinizin evrileceği en yüksek sonuç' }
    ]
  },
  decision: {
    name: 'Karar ve ikilem aynası',
    count: 3,
    desc: 'İki farklı yol arasındaki enerjiyi ve her iki yolun sentezini çözümler.',
    slots: [
      { label: 'Yol A', desc: 'İlk tercihin getireceği deneyim ve enerji' },
      { label: 'Yol B', desc: 'İkinci tercihin olası yansımaları ve bedeli' },
      { label: 'Sentez', desc: 'İki yolun ötesindeki en bilgece ortak payda' }
    ]
  }
};

// Ayrıntı sekmeleri (yorum alanları)
const DETAIL_TABS = [
  { id: 'genel', label: 'Genel' },
  { id: 'ask', label: 'Aşk' },
  { id: 'kariyer', label: 'Kariyer' },
  { id: 'ruhsal', label: 'Ruhsal' },
] as const;

// Ortak görünüm sınıfları: seçim düğmeleri ve etiketler
const BTN_BASE = 'inline-flex min-h-10 items-center justify-center border px-3.5 py-2 text-sm transition-colors cursor-pointer';
const BTN_ACTIVE = 'border-gold bg-gold font-semibold text-ink';
const BTN_IDLE = 'border-line text-paper/80 hover:border-gold/50 hover:text-paper';
const LABEL = 'text-sm text-paper/70';

/** Shuffle the major arcana and lay out one spread (random, so only ever run on the client). */
function dealSpread(type: SpreadType): DrawnCard[] {
  const config = SPREAD_CONFIGS[type];
  // Fisher–Yates: every order equally likely (sort with a random comparator is biased)
  const shuffled = [...MAJOR_ARCANA_DECK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return config.slots.slice(0, config.count).map((slot, i) => ({
    card: shuffled[i],
    isReversed: Math.random() > 0.65, // 35% chance of reversed
    positionLabel: slot.label,
    positionDesc: slot.desc,
  }));
}

export function CosmicTarotDrawer() {
  const [spreadType, setSpreadType] = useState<SpreadType>('three');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(true);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'genel' | 'ask' | 'kariyer' | 'ruhsal'>('genel');

  // Perform draw
  const performDraw = (type: SpreadType) => {
    setIsShuffling(true);
    setTimeout(() => {
      setDrawnCards(dealSpread(type));
      setSelectedCardIdx(0);
      setIsShuffling(false);
    }, 600);
  };

  // First spread once mounted — random cards can't be prerendered without a hydration mismatch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDrawnCards(dealSpread('three'));
      setIsShuffling(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const activeDrawnCard = drawnCards[selectedCardIdx] || drawnCards[0];

  return (
    <div className="border border-line bg-ink p-4 sm:p-6 lg:p-8 space-y-8" id="kozmik-tarot">
      {/* Header + spread controls */}
      <div className="space-y-5 border-b border-line pb-6">
        <div>
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper text-balance sm:text-3xl">
            Tarot kartı açılımı
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
            22 Majör Arkana kartıyla, kadim arketiplerin ve sembolizmin aynasında sezgisel bir perspektif edinin. Açılım türünü seçip desteyi karıştırın.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Spread Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['single', 'three', 'decision'] as SpreadType[]).map((type) => {
              const isActive = spreadType === type;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setSpreadType(type);
                    performDraw(type);
                  }}
                  className={`${BTN_BASE} ${isActive ? BTN_ACTIVE : BTN_IDLE}`}
                >
                  {SPREAD_CONFIGS[type].name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => performDraw(spreadType)}
            disabled={isShuffling}
            className="inline-flex min-h-10 items-center gap-2 border border-gold px-4 py-2 text-sm font-medium text-gold transition-colors cursor-pointer hover:bg-gold hover:text-ink disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold"
          >
            <Shuffle size={16} aria-hidden="true" />
            <span>{isShuffling ? 'Karıştırılıyor…' : 'Yeniden karıştır ve çek'}</span>
          </button>
        </div>

        <p className="text-sm leading-relaxed text-paper/75">
          {SPREAD_CONFIGS[spreadType].count} kart · {SPREAD_CONFIGS[spreadType].desc}
        </p>
      </div>

      {/* Cards Table Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {drawnCards.map((drawn, idx) => {
          const isSelected = selectedCardIdx === idx;
          const { card, isReversed, positionLabel } = drawn;

          return (
            <div
              key={`${card.id}-${idx}`}
              onClick={() => setSelectedCardIdx(idx)}
              className={`group flex flex-col border p-4 sm:p-5 transition-colors cursor-pointer ${
                isSelected
                  ? 'border-gold bg-ink-3'
                  : 'border-line bg-ink-2 hover:border-gold/50'
              }`}
            >
              {/* Position Header */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                <span className="text-sm font-medium text-gold">
                  {positionLabel}
                </span>
                <span
                  className={`border px-2 py-0.5 text-xs ${
                    isReversed
                      ? 'border-rose/50 text-rose'
                      : 'border-lime/50 text-lime'
                  }`}
                >
                  {isReversed ? 'Ters (gölge)' : 'Düz (aydınlık)'}
                </span>
              </div>

              {/* Tarot Card Frame */}
              <div className="mx-auto flex aspect-[2/3] w-full max-w-60 flex-col items-center justify-between overflow-hidden border border-gold/30 bg-ink p-4 transition-colors group-hover:border-gold/60 md:max-w-none">
                {isShuffling ? (
                  /* Card back while the deck is being shuffled */
                  <div className="my-auto grid h-16 w-16 place-items-center rounded-full border border-gold/30">
                    <AstrolabeGlyph size={28} className="text-gold/70" />
                  </div>
                ) : (
                  <>
                    {/* Top Number & Element */}
                    <div className="flex w-full items-center justify-between text-xs">
                      <span className="font-mono text-sm font-semibold text-paper">{card.number}</span>
                      <span className="text-gold">{card.element}</span>
                    </div>

                    {/* Center Glyph */}
                    <div className="my-auto flex flex-col items-center py-3 text-center">
                      <div className={`mb-3 rounded-full border border-gold/30 p-4 transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`}>
                        {card.glyphType === 'zodiac' ? (
                          <ZodiacGlyph sign={card.glyphId} size={42} className="text-gold" />
                        ) : card.glyphType === 'planet' ? (
                          <PlanetGlyph planet={card.glyphId} size={42} className="text-gold" />
                        ) : (
                          <AstrolabeGlyph size={42} className="text-gold" />
                        )}
                      </div>
                      <h4 className="font-display text-base font-semibold leading-snug text-paper text-balance sm:text-lg">
                        {card.name}
                      </h4>
                      <span className="mt-1 text-xs text-paper/70">
                        {card.nameEn}
                      </span>
                    </div>

                    {/* Bottom Archetype */}
                    <p className="w-full pt-2 text-center text-xs leading-snug text-paper/75 line-clamp-2">
                      {card.archetype}
                    </p>
                  </>
                )}
              </div>

              {/* Click Indicator */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-paper/70">
                <span>{card.associatedSignOrPlanet}</span>
                <span className={isSelected ? 'font-semibold text-gold' : 'group-hover:text-paper'}>
                  {isSelected ? 'İnceleniyor' : 'Ayrıntıları gör →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Card Details */}
      {activeDrawnCard && (
        <div className="border border-line bg-ink-2 p-4 sm:p-6 space-y-6">
          {/* Card Meta Row */}
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={LABEL}>
                  Seçili kart · {activeDrawnCard.positionLabel}
                </span>
                <span className={`border px-2 py-0.5 text-xs ${
                  activeDrawnCard.isReversed ? 'border-rose/50 text-rose' : 'border-lime/50 text-lime'
                }`}>
                  {activeDrawnCard.isReversed ? 'Ters konum' : 'Düz konum'}
                </span>
              </div>
              <h4 className="font-display text-xl font-semibold leading-tight text-paper text-balance sm:text-2xl">
                {activeDrawnCard.card.number}. {activeDrawnCard.card.name} <span className="font-sans text-base font-normal text-paper/70">({activeDrawnCard.card.nameEn})</span>
              </h4>
              <p className="mt-1 text-sm text-paper/80">
                {activeDrawnCard.card.archetype} · {activeDrawnCard.card.associatedSignOrPlanet}
              </p>
            </div>

            {/* Sub-tab Switcher for Detailed Interpretation */}
            <div className="flex flex-wrap gap-2">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${BTN_BASE} ${activeTab === tab.id ? BTN_ACTIVE : BTN_IDLE}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Based on Tab */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {activeTab === 'genel' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-base font-semibold text-gold">
                      {activeDrawnCard.isReversed ? activeDrawnCard.card.reversed.title : activeDrawnCard.card.upright.title}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-paper/90">
                      {activeDrawnCard.isReversed
                        ? activeDrawnCard.card.reversed.warning
                        : activeDrawnCard.card.upright.message}
                    </p>
                  </div>

                  <div>
                    <p className={LABEL}>Bu pozisyonda · {activeDrawnCard.positionLabel}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/85 sm:text-base">
                      {activeDrawnCard.positionDesc}: {activeDrawnCard.card.name.split(' (')[0]} burada{' '}
                      {activeDrawnCard.isReversed
                        ? `${activeDrawnCard.card.upright.keywords.slice(0, 2).join(' ve ').toLocaleLowerCase('tr-TR')} enerjisinin tıkandığını ya da içe döndüğünü gösterir.`
                        : `${activeDrawnCard.card.upright.keywords.slice(0, 2).join(' ve ').toLocaleLowerCase('tr-TR')} temalarını öne çıkarır.`}
                    </p>
                    {activeDrawnCard.isReversed && (
                      <p className="mt-2 text-sm leading-relaxed text-paper/80 sm:text-base">
                        <strong className="font-semibold text-paper">Ters kartın dersi:</strong> {activeDrawnCard.card.reversed.lesson}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <p className={LABEL}>Aydınlık anahtarlar</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {activeDrawnCard.card.upright.keywords.map((kw) => (
                          <li key={kw} className="border border-line px-2 py-0.5 text-sm text-paper/90">
                            {kw}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className={LABEL}>Gölge anahtarlar</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {activeDrawnCard.card.reversed.keywords.map((kw) => (
                          <li key={kw} className="border border-line px-2 py-0.5 text-sm text-rose">
                            {kw}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ask' && (
                <div>
                  <p className="flex items-center gap-2 text-base font-semibold text-rose">
                    <HeartHandshake size={16} aria-hidden="true" />
                    <span>Aşk ve ilişkiler</span>
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-paper/90">
                    {activeDrawnCard.card.upright.loveGuidance}
                    {activeDrawnCard.isReversed && <span className="mt-3 block text-sm text-paper/80 sm:text-base">Kart ters geldiği için bu enerji şu an tıkalı olabilir: önce {activeDrawnCard.card.reversed.keywords.slice(0, 2).join(' ve ').toLocaleLowerCase('tr-TR')} konusunu fark et.</span>}
                  </p>
                </div>
              )}

              {activeTab === 'kariyer' && (
                <div>
                  <p className="flex items-center gap-2 text-base font-semibold text-gold">
                    <Compass size={16} aria-hidden="true" />
                    <span>Kariyer ve para</span>
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-paper/90">
                    {activeDrawnCard.card.upright.careerGuidance}
                    {activeDrawnCard.isReversed && <span className="mt-3 block text-sm text-paper/80 sm:text-base">Kart ters geldiği için bu enerji şu an tıkalı olabilir: önce {activeDrawnCard.card.reversed.keywords.slice(0, 2).join(' ve ').toLocaleLowerCase('tr-TR')} konusunu fark et.</span>}
                  </p>
                </div>
              )}

              {activeTab === 'ruhsal' && (
                <div>
                  <p className="flex items-center gap-2 text-base font-semibold text-violet">
                    <Lightbulb size={16} aria-hidden="true" />
                    <span>Ruhsal gelişim</span>
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-paper/90">
                    {activeDrawnCard.card.upright.spiritualGuidance}
                    {activeDrawnCard.isReversed && <span className="mt-3 block text-sm text-paper/80 sm:text-base">Kart ters geldiği için bu enerji şu an tıkalı olabilir: önce {activeDrawnCard.card.reversed.keywords.slice(0, 2).join(' ve ').toLocaleLowerCase('tr-TR')} konusunu fark et.</span>}
                  </p>
                </div>
              )}

              {/* Affirmation */}
              <div className="border-l-2 border-gold/50 pl-4">
                <p className={LABEL}>Günün olumlaması</p>
                <p className="mt-1 font-serif text-lg italic leading-snug text-paper/90">
                  &quot;{activeDrawnCard.card.affirmation}&quot;
                </p>
              </div>
            </div>

            {/* Right Astrological Correspondences */}
            <div className="lg:col-span-4 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <p className="text-sm font-semibold text-paper">
                Astrolojik bağlantılar
              </p>

              <dl className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-paper/70">Element</dt>
                  <dd className="flex items-center gap-1.5 text-right font-medium text-paper">
                    {activeDrawnCard.card.element === 'Ateş' && <FireElementGlyph size={14} className="text-gold" />}
                    {activeDrawnCard.card.element === 'Toprak' && <EarthElementGlyph size={14} className="text-lime" />}
                    {activeDrawnCard.card.element === 'Hava' && <AirElementGlyph size={14} className="text-cyan-400" />}
                    {activeDrawnCard.card.element === 'Su' && <WaterElementGlyph size={14} className="text-blue-400" />}
                    {activeDrawnCard.card.element}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="shrink-0 text-paper/70">Yönetici</dt>
                  <dd className="text-right font-medium text-paper">{activeDrawnCard.card.associatedSignOrPlanet}</dd>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <dt className="shrink-0 text-paper/70">Arkana</dt>
                  <dd className="text-right font-medium text-gold">
                    Majör Arkana · <span className="font-mono">{activeDrawnCard.card.numericValue}/21</span>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed text-paper/80">
                <strong className="font-semibold text-paper">Transit etkisi:</strong> {activeDrawnCard.card.astrologicalAspect}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
