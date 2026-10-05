'use client';

import { DocImage } from '@/components/ui/DocImage';
import Link from 'next/link';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import type { AstroImage } from '@/data/astroImages';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Documentary title card: a full-bleed photograph that settles in, a chapter
 * slate, an oversized headline and the photo credit as a caption.
 * `variant="full"` fills the viewport (section hubs); `"band"` is shorter (sub-pages).
 */
export function ChapterHero({
  chapter,
  section,
  headline,
  lede,
  image,
  accent = 'var(--gold)',
  variant = 'full',
  crumbs,
  meta,
  children,
  imagePosition = 'center',
}: {
  chapter: string;
  section: string;
  headline: [string, string?];
  lede?: ReactNode;
  image: AstroImage;
  accent?: string;
  variant?: 'full' | 'band';
  crumbs?: Crumb[];
  meta?: { k: string; v: ReactNode }[];
  children?: ReactNode;
  imagePosition?: string;
}) {
  const root = useRef<HTMLElement>(null);

  // Scroll: the photograph drifts slower than the page and the copy fades out.
  useGsap(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 } })
        .to('[data-hero-photo]', { yPercent: 18, ease: 'none' }, 0)
        .to('[data-hero-copy]', { y: -60, autoAlpha: 0.1, ease: 'none' }, 0);
    },
    [],
    root
  );

  const full = variant === 'full';

  return (
    <section
      ref={root}
      className={`relative isolate flex overflow-hidden bg-ink ${full ? 'min-h-[100svh]' : 'min-h-[72svh]'}`}
      style={{ '--page-accent': accent } as CSSProperties}
    >
      <div data-hero-photo className="absolute inset-0 -z-10 overflow-hidden will-change-transform">
        <div className="doc-settle absolute inset-0">
          <DocImage
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>
      </div>
      <div aria-hidden className="doc-shade-b absolute inset-0 -z-10" />
      <div aria-hidden className="doc-shade-l absolute inset-0 -z-10 opacity-70" />

      <div
        data-hero-copy
        className={`relative flex w-full flex-col justify-end px-[var(--gutter)] ${full ? 'pb-16 pt-28 sm:pb-20' : 'pb-12 pt-28 sm:pb-14'}`}
      >
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Konum" className="mb-8 flex flex-wrap items-center gap-1.5 text-paper/60">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} aria-hidden className="text-paper/30" />}
                {c.href ? (
                  <Link href={c.href} className="doc-kicker inline-flex min-h-6 items-center px-1 text-[10px] transition-colors hover:text-paper">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="doc-kicker text-[10px] text-paper">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <span className="doc-kicker" style={{ color: accent }}>
            Bölüm {chapter}
          </span>
          <span className="doc-rule w-16 sm:w-28" aria-hidden />
          <span className="doc-kicker text-paper/70">{section}</span>
        </div>

        <h1
          className={`doc-title mt-6 text-paper ${full ? 'text-[clamp(3.4rem,11vw,11.5rem)]' : 'text-[clamp(2.6rem,7.5vw,7.5rem)]'}`}
        >
          <SplitReveal as="span" className="block pt-[0.08em]" trigger="intro" effect="rise">
            {headline[0]}
          </SplitReveal>
          {headline[1] && (
            <SplitReveal as="span" className="doc-serif block pt-[0.04em] lowercase" trigger="intro" effect="rise" delay={0.12}>
              <span style={{ color: accent }}>{headline[1]}</span>
            </SplitReveal>
          )}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          {lede && (
            <p className="max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg lg:col-span-6">{lede}</p>
          )}
          {meta && meta.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:col-span-6">
              {meta.map((m) => (
                <div key={m.k} className="border-t border-white/15 pt-3">
                  <dt className="doc-caption">{m.k}</dt>
                  <dd className="doc-title mt-2 text-xl text-paper sm:text-2xl">{m.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {children && <div className="mt-10">{children}</div>}

        <div className="mt-12 flex items-end justify-between gap-6">
          {full ? (
            <span className="flex items-center gap-3 text-paper/60" aria-hidden>
              <span className="relative h-10 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(.76,0,.24,1)_infinite]" style={{ background: accent }} />
              </span>
              <span className="doc-caption">Kaydır</span>
            </span>
          ) : (
            <span />
          )}
          <p className="doc-caption max-w-[60%] text-right">Görsel · {image.credit}</p>
        </div>
      </div>
    </section>
  );
}
