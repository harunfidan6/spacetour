import type { CSSProperties, ReactNode } from 'react';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Marquee } from '@/components/motion/Marquee';
import { Reveal, LiveClock } from '@/components/motion/primitives';

/* --------------------------------------------------------------------------
   PageHero — opening title card for every inner page
   -------------------------------------------------------------------------- */
export function PageHero({
  index,
  section,
  accent = 'var(--solar)',
  lines,
  size = 'clamp(3.2rem, 11vw, 11.5rem)',
  lede,
  meta = [],
  graphic,
  ticker,
}: {
  index: string;
  section: string;
  accent?: string;
  lines: ReactNode[];
  size?: string;
  lede?: ReactNode;
  meta?: { k: string; v: ReactNode }[];
  graphic?: ReactNode;
  ticker?: string[];
}) {
  return (
    <section className="relative" style={{ '--page-accent': accent } as CSSProperties}>
      <div className="px-[var(--gutter)] pt-28 sm:pt-32">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="label" style={{ color: accent }}>
            ({index})
          </span>
          <span className="label text-paper">{section}</span>
          <span className="label ml-auto hidden text-muted sm:inline">
            İstanbul · <LiveClock />
          </span>
        </div>

        <div className="relative grid gap-10 pt-10 sm:pt-14 lg:grid-cols-12">
          <h1 className={`display ${graphic ? 'lg:col-span-9' : 'lg:col-span-12'}`} style={{ fontSize: size }}>
            {lines.map((line, i) => (
              <SplitReveal key={i} as="span" className="block" trigger="intro" delay={i * 0.12} effect="tilt">
                {line}
              </SplitReveal>
            ))}
          </h1>
          {graphic && <div className="relative hidden items-center justify-end lg:col-span-3 lg:flex">{graphic}</div>}
        </div>

        {(lede || meta.length > 0) && (
          <div className="grid gap-8 pb-12 pt-10 sm:pt-14 lg:grid-cols-12">
            {lede && (
              <SplitReveal as="p" by="lines" trigger="intro" delay={0.35} className="max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg lg:col-span-6">
                {lede}
              </SplitReveal>
            )}
            {meta.length > 0 && (
              <Reveal items="[data-meta]" stagger={0.07} y={24} className="grid grid-cols-2 gap-px self-end border border-line bg-line sm:grid-cols-4 lg:col-span-6 lg:col-start-7 shadow-xl">
                {meta.map((m) => (
                  <div key={m.k} data-meta className="bg-ink-2 p-4 sm:p-5">
                    <div className="label text-muted">{m.k}</div>
                    <div className="display display-tight mt-3 text-2xl sm:text-3xl font-bold" style={{ color: accent }}>
                      {m.v}
                    </div>
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        )}
      </div>

      {ticker && ticker.length > 0 && (
        <div className="border-y border-line bg-ink py-3">
          <Marquee speed={45}>
            {ticker.map((t) => (
              <span key={t} className="label flex items-center gap-6 px-6 text-paper/80">
                {t}
                <span style={{ color: accent }}>✺</span>
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------------------------------
   SectionHead — numbered chapter header
   -------------------------------------------------------------------------- */
export function SectionHead({
  index,
  kicker,
  title,
  lede,
  aside,
  size = 'clamp(2.4rem, 6.6vw, 6.2rem)',
  className = '',
  id,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  size?: string;
  className?: string;
  id?: string;
}) {
  return (
    <header id={id} className={`mb-10 scroll-mt-28 sm:mb-14 ${className}`}>
      <div className="flex items-center gap-3 border-t border-line pt-4">
        <span className="label text-[var(--page-accent)]">({index})</span>
        <span className="label text-paper">{kicker}</span>
        {aside && <span className="label ml-auto text-right text-muted">{aside}</span>}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
        <SplitReveal as="h2" className="display lg:col-span-8" style={{ fontSize: size }}>
          {title}
        </SplitReveal>
        {lede && (
          <SplitReveal as="p" by="lines" className="max-w-md text-sm leading-relaxed text-paper/65 sm:text-base lg:col-span-4">
            {lede}
          </SplitReveal>
        )}
      </div>
    </header>
  );
}

/** Serif italic accent inside display type. */
export function Em({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="serif-i" style={{ color: color ?? 'var(--page-accent)' }}>
      {children}
    </span>
  );
}
