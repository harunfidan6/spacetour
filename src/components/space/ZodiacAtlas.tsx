'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ZODIAC_SIGNS, type ZodiacElement } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';
import {
  ZodiacGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph
} from '@/components/ui/CosmicGlyphs';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';

const ELEMENTS = ['Tümü', 'Ateş', 'Toprak', 'Hava', 'Su'] as const;

const ELEMENT_GLYPHS: Record<ZodiacElement, React.ComponentType<{ size?: number; className?: string }>> = {
  Ateş: FireElementGlyph,
  Toprak: EarthElementGlyph,
  Hava: AirElementGlyph,
  Su: WaterElementGlyph,
};

/** The twelve archetypes as engraved star-atlas cards; each opens the sign's own dossier page. */
export function ZodiacAtlas() {
  const [element, setElement] = useState<(typeof ELEMENTS)[number]>('Tümü');
  const grid = useRef<HTMLDivElement>(null);
  const signs = useMemo(
    () => ZODIAC_SIGNS.filter((s) => element === 'Tümü' || s.element === element),
    [element]
  );

  useGsap(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      // fromTo: bitiş değeri açık; yarıda yeniden başlasa bile kart yarı saydam kalmaz
      gsap.fromTo(
        grid.current.querySelectorAll('[data-sign]'),
        { y: 35, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.04, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }
      );
    },
    [element]
  );

  return (
    <div className="space-y-8">
      {/* Sacred Element Filter Sanctuary Tabs */}
      <div
        className="flex w-fit max-w-full gap-2 overflow-x-auto no-scrollbar border border-gold/25 bg-ink-2/90 p-1.5 shadow-[0_0_20px_rgba(245,197,66,0.06)]"
        role="group"
        aria-label="Element filtresi"
      >
        {ELEMENTS.map((el) => {
          const Glyph = el !== 'Tümü' ? ELEMENT_GLYPHS[el] : null;
          const count = el === 'Tümü' ? 12 : ZODIAC_SIGNS.filter((s) => s.element === el).length;
          const isSelected = element === el;
          return (
            <button
              key={el}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setElement(el)}
              className={`shrink-0 px-4 py-2 font-mono text-xs transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                isSelected
                  ? 'bg-gold font-bold text-ink shadow-[0_0_12px_rgba(245,197,66,0.35)]'
                  : 'text-paper/70 hover:bg-gold/10 hover:text-gold border border-transparent'
              }`}
            >
              {Glyph && <Glyph size={14} className={isSelected ? 'text-ink' : 'text-gold'} />}
              <span>{el}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-ink/20 text-ink' : 'bg-white/10 text-paper/60'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 12 Archetypes Engraved Slate Cards */}
      <div
        ref={grid}
        className="grid grid-cols-1 gap-px bg-gold/15 sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-3 lg:max-xl:fill-row-3 xl:grid-cols-4 xl:fill-row-4 border border-gold/20"
      >
        {signs.map((s) => {
          const ElementIcon = ELEMENT_GLYPHS[s.element];
          const image = DOC_IMAGES[`sign-${s.id}` as DocImageKey];
          return (
            <Link
              key={s.id}
              href={`/astroloji/burclar/${s.id}`}
              data-sign
              className="doc-episode group relative isolate flex min-h-[400px] flex-col justify-end overflow-hidden bg-ink-2 transition-[background-color,box-shadow] hover:bg-ink hover:shadow-[0_0_30px_rgba(245,197,66,0.15)]"
            >
              {image && (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-10 object-cover opacity-75 sepia-[.4] transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div aria-hidden className="doc-shade-card absolute inset-0 -z-10" />

              {/* Card Top Metadata Badge */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="doc-title text-4xl text-paper/90 font-mono">
                  {String(ZODIAC_SIGNS.indexOf(s) + 1).padStart(2, '0')}
                </span>
                <span className="doc-kicker inline-flex items-center gap-1.5 border border-gold/30 bg-ink/75 px-3 py-1.5 text-[10px] text-paper/90 backdrop-blur-md uppercase tracking-wider">
                  <ElementIcon size={12} className="text-gold" /> {s.element}
                </span>
              </div>

              {/* Card Bottom Body */}
              <div className="p-5 space-y-2 border-t border-gold/15 bg-gradient-to-t from-ink via-ink/90 to-transparent">
                <div className="flex items-center justify-between">
                  <ZodiacGlyph sign={s.id} size={42} className="text-gold transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-mono text-[10px] text-gold/80 border border-gold/20 px-2 py-0.5">
                    {s.rulingPlanet}
                  </span>
                </div>
                <div>
                  <span className="doc-title block text-3xl text-paper tracking-tight">{s.name}</span>
                  <span className="doc-serif block text-base text-gold mt-0.5 italic">{s.latinName}</span>
                </div>
                <span className="doc-caption block text-[11px] text-paper/60 font-mono">{s.dates}</span>
                <p className="line-clamp-2 text-xs leading-relaxed text-paper/75 font-sans pt-1">
                  {s.overview}
                </p>
                <div className="flex items-center justify-between border-t border-gold/15 pt-3 mt-3">
                  <span className="font-mono text-[11px] text-muted">
                    Tarot: <span className="text-paper">{s.tarotCard.name}</span>
                  </span>
                  <span className="doc-arrow grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-gold transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
