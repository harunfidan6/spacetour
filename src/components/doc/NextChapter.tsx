import { DocImage } from '@/components/ui/DocImage';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import type { AstroImage } from '@/data/astroImages';

/**
 * End-of-episode slate: a teaser for the next part (photograph beside / above the title, never
 * under it) plus previous / index links.
 */
export function NextChapter({
  next,
  prev,
  indexHref,
  indexLabel,
}: {
  /** `number`: eski "04.2" künyesi; artık gösterilmiyor */
  next: { href: string; label: string; title: string; image: AstroImage; number?: string };
  prev: { href: string; title: string };
  indexHref: string;
  indexLabel: string;
}) {
  return (
    <nav aria-label="Kısımlar arası gezinme" className="border-t border-white/10">
      <Link href={next.href} className="doc-episode group grid bg-ink transition-colors duration-300 hover:bg-ink-2 sm:grid-cols-12">
        {/* Görsel: mobilde üstte, geniş ekranda solda; üzerinde yazı yok */}
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-2 sm:col-span-6 sm:aspect-auto sm:min-h-[280px] lg:col-span-7 lg:min-h-[340px]">
          <DocImage
            src={next.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 58vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-between gap-6 px-[var(--gutter)] py-8 sm:col-span-6 sm:py-12 lg:col-span-5">
          <div className="min-w-0">
            <span className="block text-sm font-medium" style={{ color: 'var(--page-accent)' }}>
              {next.label}
            </span>
            <span className="doc-title mt-2 block text-[clamp(1.6rem,3vw,2.5rem)] text-paper">{next.title}</span>
          </div>
          <span className="doc-arrow grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-paper transition-colors">
            <ArrowRight size={20} />
          </span>
        </div>
      </Link>
      <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2">
        <Link href={prev.href} className="group flex items-center gap-4 bg-ink px-[var(--gutter)] py-6 transition-colors hover:bg-ink-2">
          <ArrowLeft size={18} className="shrink-0 text-paper/70 transition-transform group-hover:-translate-x-1" />
          <span className="min-w-0">
            <span className="block text-sm text-paper/70">Önceki kısım</span>
            <span className="mt-0.5 block text-base font-medium text-paper">{prev.title}</span>
          </span>
        </Link>
        <Link href={indexHref} className="group flex items-center justify-end gap-4 bg-ink px-[var(--gutter)] py-6 text-right transition-colors hover:bg-ink-2">
          <span className="min-w-0">
            <span className="block text-sm text-paper/70">Bölüm dizini</span>
            <span className="mt-0.5 block text-base font-medium text-paper">{indexLabel}</span>
          </span>
          <LayoutGrid size={18} className="shrink-0 text-paper/70" />
        </Link>
      </div>
    </nav>
  );
}
