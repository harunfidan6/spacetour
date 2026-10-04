'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { EpisodeCard } from '@/components/doc/EpisodeCard';
import { NextChapter } from '@/components/doc/NextChapter';
import { AstrologyBasics } from '@/components/doc/AstrologyBasics';
import { CelestialHorizonBar } from './CelestialHorizonBar';
import { ZODIAC_SIGNS, type ZodiacElement } from '@/data/zodiac';
import { ELEMENT_INFO } from '@/data/zodiacProfiles';
import { DOC_IMAGES } from '@/data/docImages';
import { getSection } from '@/data/sections';

const ELEMENT_ICONS: Record<ZodiacElement, React.ComponentType<{ size?: number; className?: string }>> = {
  Ateş: FireElementGlyph,
  Toprak: EarthElementGlyph,
  Hava: AirElementGlyph,
  Su: WaterElementGlyph,
};

export function CelestialAstrolabeHub() {
  const section = getSection('astroloji');
  const [selectedSignIndex, setSelectedSignIndex] = useState(0);
  const [activeElement, setActiveElement] = useState<ZodiacElement | 'all'>('all');

  // Selected sign from zodiac signs
  const currentSign = ZODIAC_SIGNS[selectedSignIndex] || ZODIAC_SIGNS[0];

  const nextSign = () => setSelectedSignIndex((prev) => (prev + 1) % ZODIAC_SIGNS.length);
  const prevSign = () => setSelectedSignIndex((prev) => (prev - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative">
      {/* 1. Cinematic Chapter Hero with bespoke metadata */}
      <ChapterHero
        variant="full"
        chapter="04"
        section="Astroloji · Zodyak Atlası & Göksel Çark"
        headline={['Zodyak', 'atlası']}
        lede="Babil zigguratlarından İskenderiye kütüphanesine on iki arketip. Doğum anının göksel geometrisini çıkar, anlık efemeris transitlerini oku, tarot çek ve gezegen saatlerini incele."
        accent="var(--gold)"
        image={DOC_IMAGES['sec-astroloji']}
        meta={[
          { k: 'Burç', v: 12 },
          { k: 'Element', v: 4 },
          { k: 'Ev', v: 12 },
          { k: 'Nitelik', v: 3 },
        ]}
      />

      {/* 2. Live Celestial Horizon Telemetry Bar */}
      <CelestialHorizonBar />

      {/* 3. CENTERPIECE: The 360° Interactive Celestial Astrolabe */}
      <section aria-label="360 Derece Zodyak Usturlabı" className="px-[var(--gutter)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <PartHeading
            part={1}
            title="Kozmik Usturlap"
            serif="360° zodyak çarkı"
            description="Ekliptik çemberindeki 12 arketipi çevir. Bir burca dokunarak mitolojik dosyasını, yönetici gezegenini, element dengesini ve anlık kozmik enerjisini incele."
            aside="360° · 12 Burç · Sidney Hall 1824"
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left: The Astrolabe Wheel Dial */}
            <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center justify-center lg:col-span-6 lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="relative aspect-square w-full max-w-[380px] sm:max-w-[440px]">
                {/* SVG Astrolabe Background Glow */}
                <div aria-hidden className="absolute inset-0 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

                {/* Rotating Wheel Ring */}
                <div
                  className="relative h-full w-full rounded-full border border-gold/30 bg-gradient-to-br from-ink-2 via-ink to-ink-3 p-4 shadow-[0_0_50px_rgba(245,197,66,0.08)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `rotate(-${selectedSignIndex * 30}deg)` }}
                >
                  {/* Concentric engraved hairline rings */}
                  <div className="absolute inset-2 rounded-full border border-white/[0.08]" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-gold/20" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.06]" />

                  {/* 12 Signs positioned precisely around the circular perimeter */}
                  {ZODIAC_SIGNS.map((sign, idx) => {
                    const angleRad = (idx * 30 - 90) * (Math.PI / 180);
                    const radius = 42; // percent from center
                    const left = 50 + radius * Math.cos(angleRad);
                    const top = 50 + radius * Math.sin(angleRad);
                    const isSelected = idx === selectedSignIndex;

                    return (
                      <button
                        key={sign.id}
                        type="button"
                        onClick={() => setSelectedSignIndex(idx)}
                        aria-label={`Burç seç: ${sign.name}`}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`group absolute grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full border transition-all duration-300 ${
                          isSelected
                            ? 'scale-115 border-gold bg-gold text-ink shadow-[0_0_20px_rgba(245,197,66,0.5)] z-20'
                            : 'border-white/15 bg-ink-2/90 text-paper/70 hover:scale-105 hover:border-gold/60 hover:text-gold z-10'
                        }`}
                      >
                        <span style={{ transform: `rotate(${selectedSignIndex * 30}deg)` }}>
                          <ZodiacGlyph sign={sign.id} size={20} className={isSelected ? 'text-ink' : ''} />
                        </span>
                      </button>
                    );
                  })}

                  {/* Central Astrolabe Hub */}
                  <div className="absolute inset-[30%] grid place-items-center rounded-full border border-gold/40 bg-ink-3/95 p-4 text-center shadow-inner">
                    <div style={{ transform: `rotate(${selectedSignIndex * 30}deg)` }} className="flex flex-col items-center">
                      <AstrolabeGlyph size={32} className="text-gold/60 mb-1" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold/80">360° ÇARK</span>
                      <span className="font-mono text-[11px] text-paper/60">{selectedSignIndex * 30}°–{(selectedSignIndex + 1) * 30}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev / Next controls below wheel */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={prevSign}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-ink-2 px-4 py-2 text-xs font-mono text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  <ChevronLeft size={16} /> Önceki Burç
                </button>
                <span className="font-mono text-xs text-gold">
                  {selectedSignIndex + 1} / {ZODIAC_SIGNS.length}
                </span>
                <button
                  type="button"
                  onClick={nextSign}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-ink-2 px-4 py-2 text-xs font-mono text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  Sonraki Burç <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: The Selected Archetype Dossier Card */}
            <div className="lg:col-span-6">
              <article className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-ink-2 to-ink p-7 sm:p-9 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                {/* Decorative corner ticks */}
                <div aria-hidden className="ticks absolute inset-0 pointer-events-none text-gold/40" />

                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-[0_0_25px_rgba(245,197,66,0.15)]">
                      <ZodiacGlyph sign={currentSign.id} size={42} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="doc-kicker text-gold">{currentSign.latinName}</span>
                        <span className="text-xs text-paper/40">·</span>
                        <span className="font-mono text-xs text-paper/60">{currentSign.dates}</span>
                      </div>
                      <h3 className="doc-title text-3xl sm:text-4xl text-paper mt-1">{currentSign.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-paper"
                      style={{ color: ELEMENT_INFO[currentSign.element].color }}
                    >
                      {currentSign.element}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-paper/70">
                      {currentSign.modality}
                    </span>
                  </div>
                </div>

                <div className="my-6 space-y-4">
                  <div>
                    <span className="doc-caption block text-[11px] text-paper/50">ARKETİPSEL ÜNVAN & MOTTO</span>
                    <h4 className="doc-serif text-xl sm:text-2xl text-paper mt-0.5">
                      {currentSign.traits.archetype}
                    </h4>
                    <p className="mt-1 text-sm italic text-gold/90 font-serif">
                      {currentSign.traits.motto}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-paper/75">
                    {currentSign.overview}
                  </p>

                  <div className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2 text-xs">
                    <div className="flex items-center gap-2 text-paper/70">
                      <span className="doc-caption text-paper/40">Yönetici:</span>
                      <span className="font-semibold text-paper flex items-center gap-1.5">
                        <PlanetGlyph planet={currentSign.rulingPlanetId} size={14} className="text-gold" />
                        {currentSign.rulingPlanet}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-paper/70">
                      <span className="doc-caption text-paper/40">Tarot Kartı:</span>
                      <span className="font-semibold text-paper truncate">{currentSign.tarotCard.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-paper/70">
                      <span className="doc-caption text-paper/40">Uğurlu Taş:</span>
                      <span className="text-paper">{currentSign.details.stone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-paper/70">
                      <span className="doc-caption text-paper/40">Uğurlu Maden:</span>
                      <span className="text-paper">{currentSign.details.metal}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-paper/50">
                    <span className="text-gold font-semibold">Günün Kozmik Tüyosu:</span>{' '}
                    <span className="italic">{currentSign.dailyHoroscope.cosmicTip}</span>
                  </div>

                  <Link
                    href={`/astroloji/burclar/${currentSign.id}`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/15 px-5 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    <span>{currentSign.name} Burcunun Tam Dosyasını Aç</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Four Sacred Elements Sanctuary */}
      <section aria-label="Dört Kutsal Element Mabedi" className="border-t border-white/10 bg-ink-2/50 px-[var(--gutter)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <PartHeading
            part={2}
            title="Dört Kutsal Element"
            serif="simyasal dengeler"
            description="Empedokles ve Aristoteles’ten günümüze evrenin dört temel yapıtaşı. Ateş inisiyatif alır, Toprak inşa eder, Hava idrak eder, Su hisseder."
            aside="Ateş · Toprak · Hava · Su"
          />

          {/* Element filter tabs */}
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveElement('all')}
              className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                activeElement === 'all'
                  ? 'border border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(245,197,66,0.25)]'
                  : 'border border-white/15 bg-ink text-paper/70 hover:border-white/30 hover:text-paper'
              }`}
            >
              Tüm Elementler (12 Burç)
            </button>
            {(['Ateş', 'Toprak', 'Hava', 'Su'] as ZodiacElement[]).map((elem) => {
              const Icon = ELEMENT_ICONS[elem];
              const isSelected = activeElement === elem;
              return (
                <button
                  key={elem}
                  type="button"
                  onClick={() => setActiveElement(elem)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'border border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(245,197,66,0.25)]'
                      : 'border border-white/15 bg-ink text-paper/70 hover:border-white/30 hover:text-paper'
                  }`}
                >
                  <Icon size={14} />
                  <span>{elem} Elementi</span>
                </button>
              );
            })}
          </div>

          {/* Element cards grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(['Ateş', 'Toprak', 'Hava', 'Su'] as ZodiacElement[]).map((elem) => {
              const info = ELEMENT_INFO[elem];
              const Icon = ELEMENT_ICONS[elem];
              const signsOfElement = ZODIAC_SIGNS.filter((s) => s.element === elem);
              const isHighlight = activeElement === 'all' || activeElement === elem;

              return (
                <div
                  key={elem}
                  className={`flex min-w-0 flex-col justify-between rounded-xl border p-5 sm:p-6 transition-all duration-300 ${
                    isHighlight
                      ? 'border-white/15 bg-ink-2 shadow-lg opacity-100'
                      : 'border-white/5 bg-ink/40 opacity-40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Icon size={22} className="text-gold" />
                        <span className="doc-title text-xl text-paper">{elem}</span>
                      </div>
                      <span className="doc-kicker text-[10px] text-paper/50">{info.polarity}</span>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-paper/70">{info.text}</p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4">
                    <span className="doc-caption block text-[10px] text-paper/50 mb-2">BURÇLARI</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {signsOfElement.map((s) => (
                        <Link
                          key={s.id}
                          href={`/astroloji/burclar/${s.id}`}
                          className="group/item flex items-center gap-1 rounded-md border border-white/10 bg-ink px-2 py-1 text-xs text-paper/80 transition-colors hover:border-gold hover:text-gold"
                        >
                          <ZodiacGlyph sign={s.id} size={13} />
                          <span>{s.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. The Four Esoteric Chambers (The 10 Instruments & Ritual Decks) */}
      <section aria-label="Ezoterik Odalar ve Astroloji Araçları" className="px-[var(--gutter)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <PartHeading
            part={3}
            title="Ezoterik Odalar"
            serif="on ritüel & hesaplama masası"
            description="Doğum haritasından sinastriye, kozmik tarottan Keldani gezegen saatlerine dört tematik salonda düzenlenmiş astroloji kütüphanesi."
            aside="10 Enstrüman · 4 Salon"
          />

          <div className="mt-14 space-y-20">
            {section.groups?.map((group, groupIdx) => {
              const groupModules = section.modules.filter((m) => m.group === group.name);
              const groupCollections = (section.collections ?? []).filter((c) => c.group === group.name);
              const totalItems = groupModules.length + groupCollections.length;

              return (
                <div key={group.name} className="space-y-6">
                  {/* Chamber sub-heading */}
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="doc-title text-xl text-gold">Salon 0{groupIdx + 1}</span>
                        <span className="text-paper/40">·</span>
                        <span className="doc-kicker text-paper/60">{group.name}</span>
                      </div>
                      <p className="mt-1 text-sm text-paper/70 max-w-2xl">{group.description}</p>
                    </div>
                    <span className="doc-caption text-paper/40">{totalItems} Araç</span>
                  </div>

                  {/* Cards in this chamber */}
                  <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                    {groupCollections.map((col) => (
                      <EpisodeCard
                        key={col.href}
                        href={col.href}
                        index={`04.${groupIdx + 1}.C`}
                        title={col.title}
                        blurb={col.blurb}
                        kind={col.kind}
                        image={col.image}
                        accent="var(--gold)"
                        size="md"
                      />
                    ))}

                    {groupModules.map((mod, modIdx) => (
                      <EpisodeCard
                        key={mod.slug}
                        href={`/astroloji/${mod.slug}`}
                        index={`04.${groupIdx + 1}.${modIdx + 1}`}
                        title={mod.short}
                        blurb={mod.blurb}
                        kind={mod.kind}
                        image={mod.image}
                        accent="var(--gold)"
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Astrological Foundations (AstrologyBasics matrix table) */}
      <section aria-label="Astrolojinin Temelleri" className="border-t border-white/10 bg-ink-2/40 px-[var(--gutter)] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <AstrologyBasics part={4} />
        </div>
      </section>

      {/* 7. Next Chapter Slate to Section 05: Gözlemevi */}
      <NextChapter
        next={{
          href: '/gozlemevi',
          label: 'Sıradaki Bölüm',
          number: '05',
          title: 'Gözlemevi',
          image: DOC_IMAGES['sec-gozlemevi'],
        }}
        prev={{ href: '/ansiklopedi', title: '03 · Ansiklopedi' }}
        indexHref="/"
        indexLabel="SpaceTour TR · Ana Dizin"
      />
    </div>
  );
}
