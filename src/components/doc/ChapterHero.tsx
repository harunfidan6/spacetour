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
 * Documentary title card: a full-bleed photograph that settles in, the location (breadcrumbs, or
 * the section name when there are none), a large headline and the photo credit as a caption.
 * `variant="full"` is tall (section hubs); `"band"` is shorter (sub-pages). Kept calm on purpose:
 * one slate, no fading copy, no looping cues.
 */
export function ChapterHero({
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
  /** Eski "Bölüm 04" künyesi; artık gösterilmiyor (çağıran sayfalar uyum için gönderebilir) */
  chapter?: string;
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

  // Scroll: the photograph drifts slower than the page (the copy stays put and readable).
  useGsap(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 } })
        .to('[data-hero-photo]', { yPercent: 18, ease: 'none' }, 0);
    },
    [],
    root
  );

  const full = variant === 'full';

  return (
    <section
      ref={root}
      className={`relative isolate flex overflow-hidden bg-ink ${full ? 'min-h-[88svh]' : 'min-h-[56svh]'}`}
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
        className={`relative flex w-full flex-col justify-end px-[var(--gutter)] ${full ? 'pb-14 pt-28 sm:pb-16' : 'pb-10 pt-28 sm:pb-12'}`}
      >
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Konum" className="mb-6 flex flex-wrap items-center gap-1.5 text-paper/70">
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

        {/* Konum zaten içerik yolunda yazıyorsa ikinci bir künye satırı eklenmez */}
        {!crumbs?.length && (
          <span className="doc-kicker" style={{ color: accent }}>
            {section}
          </span>
        )}

        <h1
          className={`doc-title text-paper ${crumbs?.length ? '' : 'mt-5'} ${full ? 'text-[clamp(3rem,9vw,8.5rem)]' : 'text-[clamp(2.25rem,6vw,5.25rem)]'}`}
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
            <p className="max-w-xl text-base leading-relaxed text-paper/90 sm:text-lg lg:col-span-6">{lede}</p>
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

        <p className="doc-caption mt-10 self-end text-right">Görsel · {image.credit}</p>
      </div>
    </section>
  );
}
