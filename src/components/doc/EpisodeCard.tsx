import { DocImage } from '@/components/ui/DocImage';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { AstroImage } from '@/data/astroImages';

/**
 * One "episode" of a section: the photograph on top, then the kind, title and synopsis on a plain
 * background below it (no type over the picture). The whole card links to the sub-page.
 * `md` photographs have a fixed height (a card stretched over several columns stays a strip);
 * `lg` photographs grow to fill the row, so neighbouring cards end level.
 */
export function EpisodeCard({
  href,
  title,
  blurb,
  kind,
  image,
  accent = 'var(--gold)',
  size = 'md',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
}: {
  href: string;
  /** Eski görsel üstü numara ("01", "04.1.1"); artık gösterilmiyor */
  index?: string;
  title: string;
  blurb: string;
  kind: string;
  image: AstroImage;
  accent?: string;
  size?: 'md' | 'lg';
  sizes?: string;
}) {
  const lg = size === 'lg';
  return (
    <Link
      href={href}
      data-ep
      style={{ '--ep-accent': accent } as CSSProperties}
      className="doc-episode group flex h-full min-w-0 flex-col bg-ink transition-colors duration-300 hover:bg-ink-2"
    >
      {/* Görsel üstte, yazısız */}
      <div
        className={`relative w-full overflow-hidden bg-ink-2 ${
          lg ? 'min-h-[220px] flex-1 sm:min-h-[280px]' : 'h-52 shrink-0 sm:h-56 lg:h-60'
        }`}
      >
        <DocImage src={image.src} alt="" fill sizes={sizes} className="object-cover" />
      </div>

      {/* Yazı altta, düz zeminde */}
      <div className={`flex flex-col p-5 sm:p-6 ${lg ? '' : 'flex-1'}`}>
        <span className="text-sm font-medium" style={{ color: accent }}>
          {kind}
        </span>
        <h3 className={`doc-title mt-2 text-paper ${lg ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>{title}</h3>
        <p className="mt-3 line-clamp-3 max-w-xl text-[15px] leading-relaxed text-paper/80">{blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <span className="doc-caption min-w-0 truncate">{image.credit}</span>
          <span
            aria-hidden
            className="doc-arrow grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-paper transition-colors duration-300"
          >
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
