'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ZodiacGlyph,
  PlanetGlyph,
  AstrolabeGlyph,
} from '@/components/ui/CosmicGlyphs';
import { DocImage } from '@/components/ui/DocImage';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { NextChapter } from '@/components/doc/NextChapter';
import { AstrologyBasics } from '@/components/doc/AstrologyBasics';
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { FAQS_BY_SECTION } from '@/data/faqs';
import { CelestialHorizonBar } from './CelestialHorizonBar';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { ELEMENT_INFO } from '@/data/zodiacProfiles';
import { DOC_IMAGES } from '@/data/docImages';
import { getSection } from '@/data/sections';
import type { AstroImage } from '@/data/astroImages';

/** Araç kartı: görsel üstte, tür, başlık ve açıklama altta düz zeminde (görselin üstüne yazı yok). */
function ToolCard({
  href,
  title,
  blurb,
  kind,
  image,
}: {
  href: string;
  title: string;
  blurb: string;
  kind: string;
  image: AstroImage;
}) {
  return (
    <Link
      href={href}
      data-ep
      className="doc-episode group flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-2/70 transition-colors duration-300 hover:border-gold/40"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-ink-3 sm:aspect-[16/9]">
        <DocImage
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-sm text-paper/70">{kind}</span>
        <h3 className="doc-title mt-1.5 text-xl text-paper transition-colors group-hover:text-gold">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-paper/80">{blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <span className="doc-caption min-w-0 truncate">{image.credit}</span>
          <span
            aria-hidden
            className="doc-arrow grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-paper transition-colors duration-300"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CelestialAstrolabeHub() {
  const section = getSection('astroloji');
  const [selectedSignIndex, setSelectedSignIndex] = useState(0);

  // Selected sign from zodiac signs
  const currentSign = ZODIAC_SIGNS[selectedSignIndex] || ZODIAC_SIGNS[0];

  const nextSign = () => setSelectedSignIndex((prev) => (prev + 1) % ZODIAC_SIGNS.length);
  const prevSign = () => setSelectedSignIndex((prev) => (prev - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative">
      {/* 1. Bölüm açılışı */}
      <ChapterHero
        variant="full"
        section="Astroloji"
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

      {/* 2. Canlı göksel ufuk şeridi */}
      <CelestialHorizonBar compact />

      {/* 3. 360° zodyak çarkı ve seçili burcun dosyası */}
      <section aria-label="360 Derece Zodyak Usturlabı" className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <PartHeading
            title="Kozmik Usturlap"
            serif="360° zodyak çarkı"
            description="Ekliptik çemberindeki 12 arketipi çevir. Bir burca dokunarak mitolojik dosyasını, yönetici gezegenini, element dengesini ve anlık kozmik enerjisini incele."
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Sol: çark */}
            <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center justify-center lg:col-span-6 lg:max-w-none">
              <div className="relative aspect-square w-[calc(100%-3rem)] max-w-[380px] sm:w-full sm:max-w-[440px]">
                {/* Seçili burcun elementine göre hafif zemin ışığı */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
                  style={{
                    backgroundColor:
                      currentSign.element === 'Ateş'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : currentSign.element === 'Su'
                        ? 'rgba(56, 189, 248, 0.12)'
                        : currentSign.element === 'Hava'
                        ? 'rgba(0, 212, 255, 0.12)'
                        : 'rgba(132, 204, 22, 0.12)',
                  }}
                />

                {/* Sabit dış çerçeve ve ana yön dereceleri */}
                <div className="absolute -inset-3.5 rounded-full border border-gold/20 pointer-events-none">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-gold/80 bg-ink px-1 border border-gold/30">0°</span>
                  <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-gold/80 bg-ink px-1 border border-gold/30">90°</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 font-mono text-[11px] text-gold/80 bg-ink px-1 border border-gold/30">180°</span>
                  <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-gold/80 bg-ink px-1 border border-gold/30">270°</span>
                </div>

                {/* Sabit üst nişan iğnesi */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30 flex flex-col items-center pointer-events-none">
                  <div className="w-1.5 h-3 bg-gold clip-triangle" />
                  <div className="w-0.5 h-6 bg-gradient-to-b from-gold to-transparent" />
                </div>

                {/* Dönen çark */}
                <div
                  className="relative h-full w-full rounded-full border border-gold/30 bg-gradient-to-br from-ink-2 via-ink to-ink-3 p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `rotate(-${selectedSignIndex * 30}deg)` }}
                >
                  {/* İç halkalar */}
                  <div className="absolute inset-2 rounded-full border border-white/[0.08]" />
                  <div className="absolute inset-8 rounded-full border border-dashed border-gold/20" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.06]" />

                  {/* 12 burç çember üzerinde */}
                  {ZODIAC_SIGNS.map((sign, idx) => {
                    const angleRad = (idx * 30 - 90) * (Math.PI / 180);
                    const radius = 42; // merkezden yüzde
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
                            ? 'scale-115 border-gold bg-gold text-ink z-20'
                            : 'border-white/15 bg-ink-2/90 text-paper/75 hover:scale-105 hover:border-gold/60 hover:text-gold z-10'
                        }`}
                      >
                        <span style={{ transform: `rotate(${selectedSignIndex * 30}deg)` }}>
                          <ZodiacGlyph sign={sign.id} size={20} className={isSelected ? 'text-ink' : ''} />
                        </span>
                      </button>
                    );
                  })}

                  {/* Merkez: seçili burcun derece aralığı */}
                  <div className="absolute inset-[30%] grid place-items-center rounded-full border border-gold/40 bg-ink-3/95 p-4 text-center">
                    <div style={{ transform: `rotate(${selectedSignIndex * 30}deg)` }} className="flex flex-col items-center">
                      <AstrolabeGlyph size={32} className="text-gold/60 mb-1" />
                      <span className="font-mono text-xs text-paper/75">{selectedSignIndex * 30}°–{(selectedSignIndex + 1) * 30}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Önceki / sonraki */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={prevSign}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-ink-2 px-3.5 py-2 text-[13px] text-paper transition-colors hover:border-gold hover:text-gold sm:px-4 sm:text-sm"
                >
                  <ChevronLeft size={16} /> Önceki Burç
                </button>
                <span className="font-mono text-sm text-gold">
                  {selectedSignIndex + 1} / {ZODIAC_SIGNS.length}
                </span>
                <button
                  type="button"
                  onClick={nextSign}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-ink-2 px-3.5 py-2 text-[13px] text-paper transition-colors hover:border-gold hover:text-gold sm:px-4 sm:text-sm"
                >
                  Sonraki Burç <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Sağ: seçili burcun dosyası */}
            <div className="lg:col-span-6">
              <article className="relative overflow-hidden rounded-2xl border border-gold/20 bg-ink-2/70 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold">
                      <ZodiacGlyph sign={currentSign.id} size={42} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 text-sm">
                        <span className="font-medium text-gold">{currentSign.latinName}</span>
                        <span className="text-paper/40">·</span>
                        <span className="text-paper/70">{currentSign.dates}</span>
                      </div>
                      <h3 className="doc-title mt-1 text-2xl text-paper">{currentSign.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-paper"
                      style={{ color: ELEMENT_INFO[currentSign.element].color }}
                    >
                      {currentSign.element}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13px] text-paper/75">
                      {currentSign.modality}
                    </span>
                  </div>
                </div>

                <div className="my-6 space-y-4">
                  <div>
                    <span className="block text-sm text-paper/70">Arketipsel ünvan & motto</span>
                    <h4 className="doc-serif text-xl sm:text-2xl text-paper mt-0.5">
                      {currentSign.traits.archetype}
                    </h4>
                    <p className="mt-1 text-base italic text-gold/90 font-serif">
                      {currentSign.traits.motto}
                    </p>
                  </div>

                  <p className="text-base leading-relaxed text-paper/85">
                    {currentSign.overview}
                  </p>

                  <div className="grid gap-x-6 gap-y-2.5 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-paper/70">Yönetici:</span>
                      <span className="font-semibold text-paper flex items-center gap-1.5">
                        <PlanetGlyph planet={currentSign.rulingPlanetId} size={14} className="text-gold" />
                        {currentSign.rulingPlanet}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-paper/70">Tarot Kartı:</span>
                      <span className="min-w-0 font-semibold text-paper truncate">{currentSign.tarotCard.name}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-paper/70">Uğurlu Taş:</span>
                      <span className="text-paper">{currentSign.details.stone}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-paper/70">Uğurlu Maden:</span>
                      <span className="text-paper">{currentSign.details.metal}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm leading-relaxed text-paper/80">
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

      {/*
        4. Araçlar, dört tematik grupta. Element kartları bölümü kaldırıldı: aynı element açıklamaları
        ve burç bağlantıları aşağıdaki "Astrolojinin temelleri" tablosunda zaten var.
      */}
      <section
        aria-label="Ezoterik Odalar ve Astroloji Araçları"
        className="border-t border-white/10 bg-ink-2/40 px-[var(--gutter)] py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <PartHeading
            title="Ezoterik Odalar"
            serif="on ritüel & hesaplama masası"
            description="Doğum haritasından sinastriye, kozmik tarottan Keldani gezegen saatlerine dört tematik salonda düzenlenmiş astroloji kütüphanesi."
          />

          <div className="space-y-12 sm:space-y-16">
            {section.groups?.map((group) => {
              const groupModules = section.modules.filter((m) => m.group === group.name);
              const groupCollections = (section.collections ?? []).filter((c) => c.group === group.name);
              const totalItems = groupModules.length + groupCollections.length;

              return (
                <div key={group.name}>
                  {/* Grup başlığı */}
                  <div className="mb-6 border-b border-white/10 pb-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="doc-title text-xl text-paper sm:text-2xl">{group.name}</p>
                      <span className="text-sm text-paper/70">{totalItems} Araç</span>
                    </div>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-paper/80">{group.description}</p>
                  </div>

                  {/* Gruptaki araçlar */}
                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {groupCollections.map((col) => (
                      <ToolCard
                        key={col.href}
                        href={col.href}
                        title={col.title}
                        blurb={col.blurb}
                        kind={col.kind}
                        image={col.image}
                      />
                    ))}

                    {groupModules.map((mod) => (
                      <ToolCard
                        key={mod.slug}
                        href={`/astroloji/${mod.slug}`}
                        title={mod.short}
                        blurb={mod.blurb}
                        kind={mod.kind}
                        image={mod.image}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Astrolojinin temelleri: element × nitelik tablosu, gezegenler, evler */}
      <section aria-label="Astrolojinin Temelleri" className="border-t border-white/10 px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <AstrologyBasics />
        </div>
      </section>

      {/* 6. Sıkça sorulan sorular */}
      <FaqAccordion
        items={FAQS_BY_SECTION.astroloji}
        title="Astroloji & Zodyak Rehberi"
        serif="sıkça sorulan sorular"
        kicker="SSS"
        description="Doğum haritası yorumlama, yükselen burç hesaplama, Keldani gezegen saatleri ve Ay döngüleri hakkında merak edilenler."
        accentColor="var(--gold)"
      />

      {/* 7. Sıradaki bölüm: Gözlemevi */}
      <NextChapter
        next={{
          href: '/gozlemevi',
          label: 'Sıradaki Bölüm',
          number: '05',
          title: 'Gözlemevi',
          image: DOC_IMAGES['sec-gozlemevi'],
        }}
        prev={{ href: '/ansiklopedi', title: 'Ansiklopedi' }}
        indexHref="/"
        indexLabel="SpaceTour TR · Ana Dizin"
      />
    </div>
  );
}
