import type { CSSProperties, ReactNode } from 'react';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Marquee } from '@/components/motion/Marquee';
import { Reveal, LiveClock } from '@/components/motion/primitives';

/* --------------------------------------------------------------------------
   PageHero — Modern Luxury Mission Control header for inner pages
   -------------------------------------------------------------------------- */
export function PageHero({
  index,
  section,
  accent = 'var(--solar)',
  lines,
  size = 'clamp(2.4rem, 5.2vw, 4.5rem)',
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
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-ink via-ink-2/30 to-ink" style={{ '--page-accent': accent } as CSSProperties}>
      {/* Subtle radial ambient glow behind hero */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[100px]"
        style={{ background: accent }}
        aria-hidden
      />

      <div className="relative px-[var(--gutter)] pt-24 sm:pt-28 pb-12 sm:pb-16">
        {/* Breadcrumb pill bar */}
        <div className="flex items-center gap-3 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-ink-2/80 px-3.5 py-1.5 backdrop-blur-md">
            <span className="font-mono text-xs font-semibold" style={{ color: accent }}>
              {index}
            </span>
            <span className="h-3 w-[1px] bg-white/20" />
            <span className="font-mono text-xs uppercase tracking-wider text-paper/90">{section}</span>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full border border-white/[0.06] bg-ink-2/50 px-3 py-1 font-mono text-[11px] text-muted sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>İstanbul Telemetri · <LiveClock /></span>
          </div>
        </div>

        {/* Title area */}
        <div className="relative grid gap-8 pt-4 lg:grid-cols-12 lg:items-center">
          <div className={`${graphic ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <h1 className="display font-semibold tracking-tight text-paper" style={{ fontSize: size }}>
              {lines.map((line, i) => (
                <SplitReveal key={i} as="span" className="block" trigger="intro" delay={i * 0.1} effect="fade">
                  {line}
                </SplitReveal>
              ))}
            </h1>
          </div>
          {graphic && (
            <div className="relative hidden items-center justify-end lg:col-span-4 lg:flex">
              <div className="relative rounded-2xl border border-white/[0.08] bg-ink-2/50 p-6 backdrop-blur-md shadow-2xl">
                {graphic}
              </div>
            </div>
          )}
        </div>

        {/* Lede and Telemetry Stats */}
        {(lede || meta.length > 0) && (
          <div className="mt-8 grid gap-8 border-t border-white/[0.06] pt-8 lg:grid-cols-12 lg:items-end">
            {lede && (
              <SplitReveal as="p" by="lines" trigger="intro" delay={0.25} className="max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg lg:col-span-6">
                {lede}
              </SplitReveal>
            )}
            {meta.length > 0 && (
              <Reveal items="[data-meta]" stagger={0.05} y={16} className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-6 lg:col-start-7">
                {meta.map((m) => (
                  <div key={m.k} data-meta className="group rounded-xl border border-white/[0.08] bg-ink-2/70 p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-ink-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted group-hover:text-paper/70 transition-colors">
                      {m.k}
                    </div>
                    <div className="mt-2 font-mono text-xl sm:text-2xl font-bold tracking-tight" style={{ color: accent }}>
                      {m.v}
                    </div>
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        )}
      </div>

      {/* Subtle modern ticker bar */}
      {ticker && ticker.length > 0 && (
        <div className="border-t border-white/[0.06] bg-ink-2/40 py-2.5 backdrop-blur-sm">
          <Marquee speed={35}>
            {ticker.map((t) => (
              <span key={t} className="flex items-center gap-4 px-5 font-mono text-[11px] uppercase tracking-widest text-paper/60">
                <span>{t}</span>
                <span className="text-[8px] opacity-40" style={{ color: accent }}>✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------------------------------
   SectionHead — Clean, modern chapter header
   -------------------------------------------------------------------------- */
export function SectionHead({
  index,
  kicker,
  title,
  lede,
  aside,
  size = 'clamp(1.8rem, 3.6vw, 2.6rem)',
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
    <header id={id} className={`mb-8 scroll-mt-28 sm:mb-12 ${className}`}>
      <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <span className="inline-flex items-center rounded border border-white/[0.08] bg-ink-2 px-2 py-0.5 font-mono text-[10px] font-semibold" style={{ color: 'var(--page-accent)' }}>
          {index}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-paper/80">{kicker}</span>
        {aside && <span className="ml-auto text-right font-mono text-xs text-muted">{aside}</span>}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:items-end">
        <SplitReveal as="h2" className="display font-semibold tracking-tight text-paper lg:col-span-8" style={{ fontSize: size }}>
          {title}
        </SplitReveal>
        {lede && (
          <SplitReveal as="p" by="lines" className="max-w-md text-sm leading-relaxed text-paper/70 lg:col-span-4">
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
    <span className="serif-i text-gradient font-normal italic" style={{ color: color ?? 'var(--page-accent)' }}>
      {children}
    </span>
  );
}
