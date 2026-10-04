import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AstroImage } from '@/data/astroImages';

/**
 * One "episode" of a section: a photograph with the episode number, kind,
 * title and synopsis laid over it. The whole card links to the sub-page.
 */
export function EpisodeCard({
  href,
  index,
  title,
  blurb,
  kind,
  image,
  accent = 'var(--gold)',
  size = 'md',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: {
  href: string;
  index: string;
  title: string;
  blurb: string;
  kind: string;
  image: AstroImage;
  accent?: string;
  size?: 'md' | 'lg';
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      data-ep
      style={{ '--ep-accent': accent } as CSSProperties}
      className={`doc-episode group relative isolate flex flex-col justify-end overflow-hidden bg-ink-2 ${
        size === 'lg' ? 'min-h-[440px] sm:min-h-[520px]' : 'min-h-[360px] sm:min-h-[400px]'
      }`}
    >
      <Image src={image.src} alt="" fill sizes={sizes} className="-z-10 object-cover" />
      <div aria-hidden className="doc-shade-card absolute inset-0 -z-10" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        <span className="doc-title text-4xl text-paper/90 sm:text-5xl">{index}</span>
        <span className="doc-kicker rounded-full border border-white/20 bg-ink/50 px-3 py-1.5 text-[10px] text-paper/80 backdrop-blur-md">
          {kind}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <span aria-hidden className="mb-4 block h-px w-10 transition-all duration-500 group-hover:w-24" style={{ background: accent }} />
        <h3 className={`doc-title text-paper ${size === 'lg' ? 'text-[clamp(1.9rem,3.6vw,3.2rem)]' : 'text-[clamp(1.5rem,2.4vw,2.1rem)]'}`}>
          {title}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-paper/70">{blurb}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="doc-caption min-w-0 truncate">{image.credit}</span>
          <span
            aria-hidden
            className="doc-arrow grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 text-paper transition-colors duration-300"
          >
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
