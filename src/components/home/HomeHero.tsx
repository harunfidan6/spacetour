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
import { HERO_BODIES, heroScene, resetHeroScene } from './HeroSolarSystem3D';
import { MoonOrb } from '@/components/space/PlanetOrb';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';

const HeroSolarSystem3D = dynamic(() => import('./HeroSolarSystem3D').then((m) => m.HeroSolarSystem3D), { ssr: false });

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

      // Scroll: the camera dives into the Sun, which hands over to the solar manifesto.
      const solar = el.querySelector<HTMLElement>('[data-solar]')!;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              state.scroll = self.progress;
              // Last 30% of the dive: flood to flat solar colour for the manifesto hand-off.
              const flood = gsap.utils.clamp(0, 1, (self.progress - 0.7) / 0.3);
              solar.style.opacity = String(flood * flood);
              solar.style.visibility = flood > 0 ? 'visible' : 'hidden';
            },
          },
        })
        .to('[data-hero-top]', { autoAlpha: 0, ease: 'power1.in', duration: 0.3 }, 0)
        .to('[data-hero-title]', { yPercent: -30, letterSpacing: '0.08em', autoAlpha: 0, ease: 'power1.in', duration: 0.6 }, 0)
        .to('[data-hero-bottom]', { y: 60, autoAlpha: 0, ease: 'power1.in', duration: 0.35 }, 0)
        .to({}, { duration: 1 }, 0);

      return cancelIntro;
    },
    [],
    root
  );

  return (
    // Stable wrapper: ScrollTrigger re-parents the pinned section into a spacer,
    // so React siblings must never be inserted relative to the section itself.
    <div>
    <section ref={root} className="relative isolate h-[100svh] min-h-[640px] overflow-hidden" style={{ '--page-accent': 'var(--solar)' } as CSSProperties}>
      {/* Live 3D solar system */}
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
        <div data-hero-fade className="flex items-center gap-3 border-b border-line pb-4">
          <span className="label text-solar">(00)</span>
          <span className="label text-paper">Kinetik uzay atlası</span>
          <span className="label ml-auto hidden text-muted sm:inline">Sayı 01 · Sezon 2026 · Kuzey yarımküre</span>
        </div>
        </div>

        <h1 data-hero-title className="display mt-6 text-[clamp(3.6rem,11.5vw,13rem)] text-paper mix-blend-difference sm:mt-8">
          <SplitReveal as="span" className="block" trigger="intro" effect="tilt">
            Evren
          </SplitReveal>
          <SplitReveal as="span" className="block" trigger="intro" effect="tilt" delay={0.12}>
            <span className="serif-i text-[0.9em]">hiç</span> Durmaz
          </SplitReveal>
        </h1>

        <div data-hero-bottom className="mt-auto grid gap-6 pt-10 lg:grid-cols-12 lg:items-end">
          <div data-hero-fade className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
              Güneş Sistemi&apos;ni 3D olarak gezin, 360° planetaryumda gökyüzünü okuyun, tutulmaları takviminize işleyin. NASA ve ESA verileriyle, hareket halinde.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.25}>
                <a
                  href="#yolculuk"
                  data-no-transition
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById('yolculuk');
                    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
                  }}
                  className="group flex items-center gap-3 rounded-full bg-paper py-3 pl-6 pr-3 text-sm font-semibold text-ink transition-colors hover:bg-solar"
                >
                  Yolculuğa başla
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-[-45deg]">
                    <ArrowDown size={15} />
                  </span>
                </a>
              </Magnetic>
              <Link href="/harita" className="group flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-paper transition-colors hover:border-lime hover:text-lime">
                Gök haritası
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <dl data-hero-fade className="grid grid-cols-2 gap-px border border-line bg-line lg:col-span-4 lg:col-start-7">
            <div className="bg-ink/85 p-4 backdrop-blur-sm">
              <dt className="label text-muted">Ay evresi</dt>
              <dd className="mt-3 flex items-center gap-3">
                <MoonOrb fraction={moon?.fraction ?? 0.5} className="h-10 w-10" />
                <span>
                  <span className="display display-tight block text-2xl text-paper">%{moon ? Math.round(moon.illumination * 100) : '--'}</span>
                  <span className="text-xs text-paper/60">{moon?.name ?? 'Hesaplanıyor'}</span>
                </span>
              </dd>
            </div>
            <div className="bg-ink/85 p-4 backdrop-blur-sm">
              <dt className="label text-muted">Sıradaki olay</dt>
              <dd className="mt-3">
                <span className="display display-tight block text-2xl text-solar">{next && now ? `${daysUntil(next.date, now)} gün` : '—'}</span>
                <span className="flex items-center gap-1.5 text-xs text-paper/60 mt-0.5">
                  {next ? (
                    <>
                      <AstronomicalEventGlyph type={next.type} size={13} className="text-solar shrink-0" />
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
