import { DocImage } from '@/components/ui/DocImage';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import type { AstroImage } from '@/data/astroImages';

/** End-of-episode slate: a full-bleed teaser for the next part plus previous / index links. */
export function NextChapter({
  next,
  prev,
  indexHref,
  indexLabel,
}: {
  next: { href: string; label: string; title: string; image: AstroImage; number: string };
  prev: { href: string; title: string };
  indexHref: string;
  indexLabel: string;
}) {
  return (
    <nav aria-label="Kısımlar arası gezinme" className="border-t border-white/10">
      <Link href={next.href} className="doc-episode group relative isolate flex min-h-[52svh] items-end overflow-hidden">
        <DocImage src={next.image.src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="doc-shade-b absolute inset-0 -z-10" />
        <div className="flex w-full flex-col gap-6 px-[var(--gutter)] pb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="doc-kicker" style={{ color: 'var(--page-accent)' }}>
              {next.label} · {next.number}
            </span>
            <span className="doc-title mt-4 block text-[clamp(2.4rem,7vw,6.5rem)] text-paper">{next.title}</span>
          </div>
          <span className="doc-arrow grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/30 text-paper transition-colors">
            <ArrowRight size={24} />
          </span>
        </div>
      </Link>
      <div className="grid gap-px bg-white/10 sm:grid-cols-2">
        <Link href={prev.href} className="group flex items-center gap-4 bg-ink px-[var(--gutter)] py-6 transition-colors hover:bg-ink-2">
          <ArrowLeft size={18} className="text-paper/60 transition-transform group-hover:-translate-x-1" />
          <span>
            <span className="doc-caption block">Önceki kısım</span>
            <span className="mt-1 block text-sm text-paper">{prev.title}</span>
          </span>
        </Link>
        <Link href={indexHref} className="group flex items-center justify-end gap-4 bg-ink px-[var(--gutter)] py-6 text-right transition-colors hover:bg-ink-2">
          <span>
            <span className="doc-caption block">Bölüm dizini</span>
            <span className="mt-1 block text-sm text-paper">{indexLabel}</span>
          </span>
          <LayoutGrid size={18} className="text-paper/60" />
        </Link>
      </div>
    </nav>
  );
}
