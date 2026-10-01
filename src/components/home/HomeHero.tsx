'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion, whenIntroDone } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Magnetic } from '@/components/motion/primitives';
import { moonPhase, upcomingEvents, daysUntil } from '@/lib/sky';
import { useNow } from '@/lib/useNow';
import { HeroSolarSystem3D, HERO_BODIES, heroScene, resetHeroScene } from './HeroSolarSystem3D';
import { HeroKineticHUD } from './HeroKineticHUD';
import { MoonOrb } from '@/components/space/PlanetOrb';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [inView, setInView] = useState(true);
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
    <div>
    <section ref={root} className="relative isolate h-[100svh] min-h-[640px] overflow-hidden" style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      {/* 1. Motion Graphics Kinetic HUD Background */}
      <HeroKineticHUD />

      {/* 2. Live 3D solar system */}
      <div className="pointer-events-none absolute inset-0">
        <HeroSolarSystem3D project={placeLabel} active={inView} />
        {HERO_BODIES.map((b, i) => (
          <span
            key={b.id}
            ref={(node) => {
              labels.current[i] = node;
            }}
            aria-hidden
            className="label absolute left-0 top-0 whitespace-nowrap pl-5 text-[10px] text-paper will-change-transform"
            style={{ opacity: 0, marginTop: '-1.6em' }}
          >
            <span className="mr-1.5 inline-block h-px w-3 bg-paper/60 align-middle" />
            {b.name.toLocaleUpperCase('tr-TR')} · {b.au}
          </span>
        ))}
      </div>
      <div data-solar aria-hidden className="pointer-events-none absolute inset-0 bg-solar" style={{ visibility: 'hidden' }} />

      {/* Copy */}
      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-6 pt-24 sm:pt-28">
        <div data-hero-top>
          <div data-hero-fade className="flex items-center gap-3 pb-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-ink-2/80 px-3.5 py-1.5 backdrop-blur-md">
              <span className="font-mono text-xs font-semibold text-gold">00</span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-paper/90">Kozmik Gözlem Atlası</span>
            </div>
            <div className="ml-auto hidden items-center gap-2 rounded-full border border-white/[0.06] bg-ink-2/50 px-3 py-1 font-mono text-[11px] text-muted sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>J2000 Efemeris · Canlı Yörünge Ağı</span>
            </div>
          </div>
        </div>

        <h1 data-hero-title className="display mt-6 text-[clamp(2.8rem,6.2vw,5.5rem)] font-bold tracking-tight text-paper sm:mt-8">
          <SplitReveal as="span" className="block text-shimmer" trigger="intro" effect="fade">
            Evren
          </SplitReveal>
          <SplitReveal as="span" className="block" trigger="intro" effect="fade" delay={0.1}>
            <span className="serif-i text-gold font-normal">hiç</span> durmaz.
          </SplitReveal>
        </h1>

        <div data-hero-bottom className="mt-auto grid gap-6 pt-10 lg:grid-cols-12 lg:items-end">
          <div data-hero-fade className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
              Güneş Sistemi&apos;ni 3D olarak gezin, 360° planetaryumda gökyüzünü okuyun, tutulmaları takviminize işleyin. NASA ve ESA verileriyle, hareket halinde.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/harita"
                className="group flex items-center gap-3 rounded-full bg-gold py-3 pl-6 pr-3 text-sm font-bold text-ink transition-all hover:bg-paper hover:scale-105 shadow-2xl cursor-pointer"
              >
                <span>360° Planetaryumu Başlat</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-gold">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <a
                href="#istasyonlar"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('istasyonlar');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl px-5 py-3 text-sm font-medium text-paper transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold cursor-pointer"
              >
                <span>Kozmik İstasyonlar</span>
                <ArrowDown size={15} />
              </a>
            </div>
          </div>

          <dl data-hero-fade className="grid grid-cols-2 gap-3 lg:col-span-4 lg:col-start-7">
            <div className="rounded-2xl border border-white/[0.08] bg-ink-2/80 p-4.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/20">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">Ay evresi</dt>
              <dd className="mt-3 flex items-center gap-3">
                <MoonOrb fraction={moon?.fraction ?? 0.5} className="h-10 w-10" />
                <div>
                  <span className="display block text-xl sm:text-2xl font-semibold text-paper">%{moon ? Math.round(moon.illumination * 100) : '--'}</span>
                  <span className="text-xs text-muted">{moon?.name ?? 'Hesaplanıyor'}</span>
                </div>
              </dd>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-ink-2/80 p-4.5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-white/20">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">Sıradaki olay</dt>
              <dd className="mt-3">
                <span className="display block text-xl sm:text-2xl text-gold font-bold">{next && now ? `${daysUntil(next.date, now)} gün` : '—'}</span>
                <span className="flex items-center gap-1.5 text-xs text-paper/70 mt-1">
                  {next ? (
                    <>
                      <AstronomicalEventGlyph type={next.type} size={14} className="text-gold shrink-0" />
                      <span className="truncate">{next.title}</span>
                    </>
                  ) : (
                    'Takvim yükleniyor'
                  )}
                </span>
              </dd>
            </div>
          </dl>

          <div data-hero-fade className="hidden items-center justify-end gap-3 lg:col-span-2 lg:col-start-11 lg:flex">
            <span className="label text-muted">Kaydır</span>
            <span className="relative h-14 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_cubic-bezier(.76,0,.24,1)_infinite] bg-solar" />
            </span>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
