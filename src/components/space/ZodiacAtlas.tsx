'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Droplets, Flame, Globe2, Wind } from 'lucide-react';
import { ZODIAC_SIGNS, type ZodiacElement } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';

const ELEMENTS = ['Tümü', 'Ateş', 'Toprak', 'Hava', 'Su'] as const;
const ELEMENT_ICON: Record<ZodiacElement, typeof Flame> = { Ateş: Flame, Toprak: Globe2, Hava: Wind, Su: Droplets };

/** The twelve archetypes as engraved star-atlas cards; each opens the sign's own dossier page. */
export function ZodiacAtlas() {
  const [element, setElement] = useState<(typeof ELEMENTS)[number]>('Tümü');
  const grid = useRef<HTMLDivElement>(null);
  const signs = useMemo(() => ZODIAC_SIGNS.filter((s) => element === 'Tümü' || s.element === element), [element]);

  useGsap(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      gsap.from(grid.current.querySelectorAll('[data-sign]'), { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.04, ease: 'mg.out' });
    },
    [element]
  );

  return (
    <div>
      <div className="mb-10 flex w-fit max-w-full gap-1.5 overflow-x-auto no-scrollbar border border-white/[0.08] bg-ink-2/60 p-1" role="group" aria-label="Element filtresi">
        {ELEMENTS.map((el) => (
          <button
            key={el}
            type="button"
            aria-pressed={element === el}
            onClick={() => setElement(el)}
            className={`shrink-0 px-4 py-1.5 font-mono text-xs transition-all ${
              element === el ? 'bg-gold font-semibold text-ink' : 'text-paper/70 hover:bg-white/[0.04] hover:text-paper'
            }`}
          >
            {el}
          </button>
        ))}
      </div>

      <div ref={grid} className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-3 lg:max-xl:fill-row-3 xl:grid-cols-4 xl:fill-row-4">
        {signs.map((s) => {
          const Icon = ELEMENT_ICON[s.element];
          const image = DOC_IMAGES[`sign-${s.id}` as DocImageKey];
          return (
            <Link key={s.id} href={`/astroloji/burclar/${s.id}`} data-sign className="doc-episode group relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden bg-ink-2">
              {image && <Image src={image.src} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="-z-10 object-cover opacity-80 sepia-[.35]" />}
              <div aria-hidden className="doc-shade-card absolute inset-0 -z-10" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="doc-title text-4xl text-paper/90">{String(ZODIAC_SIGNS.indexOf(s) + 1).padStart(2, '0')}</span>
                <span className="doc-kicker inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink/50 px-3 py-1.5 text-[10px] text-paper/80 backdrop-blur-md">
                  <Icon size={11} className="text-gold" /> {s.element}
                </span>
              </div>
              <div className="p-5">
                <ZodiacGlyph sign={s.id} size={40} className="text-gold" />
                <span className="doc-title mt-4 block text-4xl text-paper">{s.name}</span>
                <span className="doc-serif block text-lg text-gold">{s.latinName}</span>
                <span className="doc-caption mt-2 block">{s.dates}</span>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-paper/70">{s.overview}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="doc-caption">Yönetici · {s.rulingPlanet}</span>
                  <span className="doc-arrow grid h-9 w-9 place-items-center rounded-full border border-white/25 text-paper transition-colors">
                    <ArrowUpRight size={15} />
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
