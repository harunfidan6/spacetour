'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion, whenIntroDone } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { moonPhase, upcomingEvents, daysUntil } from '@/lib/sky';
import { useNow } from '@/lib/useNow';
import dynamic from 'next/dynamic';
import { HERO_BODIES, heroScene, resetHeroScene } from './heroScene';
import { useIdleReady } from '@/lib/useIdleReady';
import { MoonOrb } from '@/components/space/PlanetOrb';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';

// three.js sahnesi ilk boyamayı geciktirmesin: sayfa boşa çıkınca ayrı parça olarak yüklenir
const HeroSolarSystem3D = dynamic(() => import('./HeroSolarSystem3D').then((m) => m.HeroSolarSystem3D), { ssr: false });

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [inView, setInView] = useState(true);
  const scene3d = useIdleReady();
  const now = useNow(60_000);
  const moon = now ? moonPhase(now) : null;
  const next = now ? upcomingEvents(now, 1)[0] : undefined;

  const placeLabel = useCallback((i: number, x: number, y: number, alpha: number) => {
    const el = labels.current[i];
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    el.style.opacity = alpha.toFixed(2);
  }, []);

  // Stop rendering the WebGL scene once the hero has scrolled away.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const state = heroScene;
    const move = (e: PointerEvent) => {
      state.px = e.clientX / window.innerWidth - 0.5;
      state.py = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useGsap(
    () => {
      const el = root.current!;
      resetHeroScene();
      const state = heroScene;
      if (prefersReducedMotion()) {
        state.intro = 1;
        state.frozen = true;
        return;
      }

      // Entrance: the Sun pops, planets and orbits follow, copy fades up.
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 30 });
      const intro = gsap
        .timeline({ paused: true })
        .to(state, { intro: 1, duration: 2.4, ease: 'power3.out' })
        .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.6);
      const cancelIntro = whenIntroDone(() => intro.play());

      // Natural unpinned scroll parallax — no freezing or hijacking
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
              state.scroll = self.progress;
            },
          },
        })
        .to('[data-hero-top]', { autoAlpha: 0, ease: 'none' }, 0)
        .to('[data-hero-title]', { y: -40, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('[data-hero-bottom]', { y: 30, autoAlpha: 0.2, ease: 'none' }, 0);

      return cancelIntro;
    },
    [],
    root
  );

  return (
    <section ref={root} className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-ink" style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      {/* Live 3D solar system as the opening shot */}
      <div className="pointer-events-none absolute inset-0">
        {scene3d && (
          <div className="absolute inset-0 animate-[fade-in_1.2s_ease-out_both]">
            <HeroSolarSystem3D project={placeLabel} active={inView} />
          </div>
        )}
        {HERO_BODIES.map((b, i) => (
          <span
            key={b.id}
            ref={(node) => {
              labels.current[i] = node;
            }}
            aria-hidden
            className="doc-caption absolute left-0 top-0 whitespace-nowrap pl-5 text-paper/80 will-change-transform"
            style={{ opacity: 0, marginTop: '-1.6em' }}
          >
            <span className="mr-1.5 inline-block h-px w-3 bg-paper/60 align-middle" />
            {b.name.toLocaleUpperCase('tr-TR')} · {b.au}
          </span>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(5_5_8/0.85)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />

      {/* Title card */}
      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-8 pt-24 sm:pt-28">
        <div data-hero-top data-hero-fade className="flex items-center gap-4">
          <span className="doc-kicker text-gold">Bölüm 00</span>
          <span aria-hidden className="doc-rule w-16 sm:w-28" />
          <span className="doc-kicker text-paper/70">Bir uzay belgeseli</span>
        </div>

        <div data-hero-title>
          <h1 className="doc-title text-[clamp(3.6rem,12vw,12.5rem)] text-paper">
            <SplitReveal as="span" className="block pt-[0.08em]" trigger="intro" effect="rise">
              EVREN
            </SplitReveal>
            <SplitReveal as="span" className="doc-serif block lowercase text-gold" trigger="intro" effect="rise" delay={0.12}>
              hiç durmaz.
            </SplitReveal>
          </h1>
        </div>

        <div data-hero-bottom className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div data-hero-fade className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-paper/80 sm:text-lg">
              Yedi bölümlük bir gökyüzü belgeseli: Güneş Sistemi&apos;ni 3D gezin, 3D gök küresinde gökyüzünü okuyun, tutulmaları takviminize işleyin. NASA ve ESA verileriyle.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#bolumler"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('bolumler')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-3 rounded-full bg-gold py-3 pl-6 pr-3 text-sm font-bold text-ink transition-transform hover:scale-[1.03]"
              >
                <span>Belgeseli başlat</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-gold">
                  <ArrowDown size={16} />
                </span>
              </a>
              <Link
                href="/harita/planetaryum"
                className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-paper backdrop-blur-xl transition-colors hover:border-gold/60 hover:text-gold"
              >
                <span>3D gök küresi</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <dl data-hero-fade className="grid grid-cols-2 gap-x-8 lg:col-span-5 lg:col-start-8">
            <div className="border-t border-white/15 pt-3">
              <dt className="doc-caption">Ay evresi</dt>
              <dd className="mt-3 flex items-center gap-3">
                <MoonOrb fraction={moon?.fraction ?? 0.5} className="h-10 w-10" />
                <span>
                  <span className="doc-title block text-3xl text-paper">%{moon ? Math.round(moon.illumination * 100) : '--'}</span>
                  <span className="doc-caption block">{moon?.name ?? 'Hesaplanıyor'}</span>
                </span>
              </dd>
            </div>
            <div className="border-t border-white/15 pt-3">
              <dt className="doc-caption">Sıradaki olay</dt>
              <dd className="mt-3">
                <Link href="/takvim" className="group block">
                  <span className="doc-title block text-3xl text-gold">{next && now ? `${daysUntil(next.date, now)} gün` : '—'}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-paper/70 group-hover:text-paper">
                    {next ? (
                      <>
                        <AstronomicalEventGlyph type={next.type} size={14} className="shrink-0 text-gold" />
                        <span className="truncate">{next.title}</span>
                      </>
                    ) : (
                      'Takvim yükleniyor'
                    )}
                  </span>
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
