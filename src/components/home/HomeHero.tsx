'use client';

import Link from 'next/link';
import { useRef, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion, whenIntroDone } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Magnetic } from '@/components/motion/primitives';
import { moonPhase, upcomingEvents, daysUntil } from '@/lib/sky';
import { useNow } from '@/lib/useNow';

const TILT = 0.34;
/** Shared frame for the orrery and the zoom disc so the two stay registered. */
const STAGE =
  'pointer-events-none absolute left-1/2 top-[40%] w-[165vw] max-w-[1500px] -translate-x-1/2 -translate-y-1/2 sm:top-[56%] sm:w-[120vw] lg:w-[92vw]';
const SUN_R = 64;

const ORBITERS = [
  { id: 'merkur', name: 'Merkür', au: '0.39 AU', rx: 140, r: 5, color: 'var(--paper)', period: 8, phase: 0.15 },
  { id: 'venus', name: 'Venüs', au: '0.72 AU', rx: 196, r: 9, color: 'var(--gold)', period: 12, phase: 0.62 },
  { id: 'dunya', name: 'Dünya', au: '1.00 AU', rx: 256, r: 10, color: 'var(--violet)', period: 17, phase: 0.02, moon: true },
  { id: 'mars', name: 'Mars', au: '1.52 AU', rx: 318, r: 7, color: 'var(--rose)', period: 24, phase: 0.4 },
  { id: 'jupiter', name: 'Jüpiter', au: '5.20 AU', rx: 398, r: 22, color: 'var(--paper)', period: 38, phase: 0.78, bands: true },
  { id: 'saturn', name: 'Satürn', au: '9.58 AU', rx: 478, r: 15, color: 'var(--gold)', period: 56, phase: 0.93, ring: true },
] as const;

/* Flat-vector orrery: planets travel tilted ellipses, swap depth behind/in front of the sun. */
function OrbitSystem() {
  return (
    <svg viewBox="-520 -260 1040 520" className="block h-full w-full overflow-visible" aria-hidden>
      <g data-orbits>
        {ORBITERS.map((p) => (
          <ellipse key={p.id} rx={p.rx} ry={p.rx * TILT} fill="none" stroke="var(--paper)" strokeOpacity={0.22} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g data-back />
      <g data-sun>
        <circle r={SUN_R * 2.3} fill="var(--solar)" opacity={0.08} />
        <g className="spin-slower">
          {Array.from({ length: 16 }, (_, i) => (
            <polygon key={i} points={`-5,-${SUN_R + 6} 5,-${SUN_R + 6} 0,-${SUN_R * 1.85}`} fill="var(--solar)" opacity={0.55} transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <g className="spin-rev">
          {Array.from({ length: 72 }, (_, i) => (
            <line
              key={i}
              y1={-(SUN_R * 2.05)}
              y2={-(SUN_R * 2.05 + (i % 6 === 0 ? 14 : 6))}
              stroke="var(--paper)"
              strokeOpacity={i % 6 === 0 ? 0.6 : 0.25}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              transform={`rotate(${i * 5})`}
            />
          ))}
        </g>
        <circle r={SUN_R} fill="var(--solar)" />
      </g>
      <g data-front>
        {ORBITERS.map((p) => (
          <g key={p.id} data-planet={p.id}>
            {'ring' in p && <ellipse rx={p.r * 2.2} ry={p.r * 0.6} fill="none" stroke="var(--gold)" strokeWidth={2.5} />}
            <circle r={p.r} fill={p.color} />
            {'bands' in p && (
              <>
                <rect x={-p.r} y={-p.r * 0.35} width={p.r * 2} height={p.r * 0.18} fill="var(--solar)" opacity={0.7} />
                <rect x={-p.r} y={p.r * 0.15} width={p.r * 2} height={p.r * 0.12} fill="var(--gold)" opacity={0.8} />
              </>
            )}
            {'moon' in p && <circle data-moon r={3} cx={p.r + 9} fill="var(--lime)" />}
            <text x={p.r + 10} y={-p.r - 6} fill="var(--paper)" opacity={0.75} style={{ font: '500 11px var(--font-mono)', letterSpacing: '0.12em' }}>
              {p.name.toLocaleUpperCase('tr-TR')} · {p.au}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const now = useNow(60_000);
  const moon = now ? moonPhase(now) : null;
  const next = now ? upcomingEvents(now, 1)[0] : undefined;

  useGsap(
    () => {
      const el = root.current!;
      const reduced = prefersReducedMotion();
      const planets = ORBITERS.map((p) => ({ p, node: el.querySelector<SVGGElement>(`[data-planet="${p.id}"]`)! }));
      const back = el.querySelector<SVGGElement>('[data-back]')!;
      const front = el.querySelector<SVGGElement>('[data-front]')!;

      // Orbital motion on the GSAP ticker
      let t = 0;
      const place = () => {
        for (const { p, node } of planets) {
          const a = (p.phase + t / p.period) * Math.PI * 2;
          const x = Math.cos(a) * p.rx;
          const y = Math.sin(a) * p.rx * TILT;
          const depth = Math.sin(a);
          const s = 0.82 + 0.18 * (depth + 1) * 0.5;
          node.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(3)})`);
          const parent = depth < 0 ? back : front;
          if (node.parentNode !== parent) parent.appendChild(node);
        }
      };
      const tick = (_time: number, dt: number) => {
        t += dt / 1000;
        place();
      };
      place();
      if (!reduced) gsap.ticker.add(tick);
      let cancelIntro = () => {};

      if (!reduced) {
        // Entrance
        gsap.set('[data-sun]', { scale: 0, svgOrigin: '0 0' });
        gsap.set('[data-orbits] ellipse', { drawSVG: '0%' });
        gsap.set('[data-front], [data-back]', { autoAlpha: 0 });
        gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 30 });
        const intro = gsap
          .timeline({ paused: true })
          .to('[data-sun]', { scale: 1, duration: 1.6, ease: 'elastic.out(1, 0.55)' })
          .to('[data-orbits] ellipse', { drawSVG: '100%', duration: 1.6, stagger: 0.08, ease: 'mg.inOut' }, 0.1)
          .to('[data-front], [data-back]', { autoAlpha: 1, duration: 0.8 }, 0.9)
          .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.6);
        cancelIntro = whenIntroDone(() => intro.play());

        // Scroll: the sun swallows the frame and hands over to the manifesto
        const zoom = el.querySelector<HTMLDivElement>('[data-zoom]')!;
        gsap.set(zoom, { xPercent: -50, yPercent: -50 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: '+=110%',
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(zoom, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02, immediateRender: false }, 0)
          .to(zoom, { scale: () => (Math.hypot(window.innerWidth, window.innerHeight) / zoom.offsetWidth) * 2.2, ease: 'power2.in', duration: 1 }, 0)
          .to('[data-hero-title]', { yPercent: -30, letterSpacing: '0.08em', autoAlpha: 0, ease: 'power1.in', duration: 0.7 }, 0)
          .to('[data-system]', { scale: 1.6, rotate: -8, autoAlpha: 0, ease: 'power1.in', duration: 0.8 }, 0)
          .to('[data-hero-bottom]', { y: 60, autoAlpha: 0, ease: 'power1.in', duration: 0.4 }, 0);
      }

      return () => {
        cancelIntro();
        gsap.ticker.remove(tick);
      };
    },
    [],
    root
  );

  return (
    <section ref={root} className="relative isolate h-[100svh] min-h-[640px] overflow-hidden" style={{ '--page-accent': 'var(--solar)' } as CSSProperties}>
      {/* Orrery */}
      <div className={STAGE}>
        <div data-system className="relative aspect-[2/1] w-full">
          <OrbitSystem />
        </div>
      </div>
      {/* Zoom disc — sits exactly on the SVG sun */}
      <div className={STAGE}>
        <div className="relative aspect-[2/1] w-full">
          <div
            data-zoom
            className="absolute left-1/2 top-1/2 aspect-square rounded-full bg-solar"
            style={{ width: `${((SUN_R * 2) / 1040) * 100}%`, visibility: 'hidden' }}
          />
        </div>
      </div>

      {/* Copy */}
      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-6 pt-24 sm:pt-28">
        <div data-hero-fade className="flex items-center gap-3 border-b border-line pb-4">
          <span className="label text-solar">(00)</span>
          <span className="label text-paper">Kinetik uzay atlası</span>
          <span className="label ml-auto hidden text-muted sm:inline">Sayı 01 · Sezon 2026 · Kuzey yarımküre</span>
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
                <MoonGlyph fraction={moon?.fraction ?? 0.5} />
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
                <span className="line-clamp-1 text-xs text-paper/60">{next ? `${next.emoji} ${next.title}` : 'Takvim yükleniyor'}</span>
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
  );
}

/** Tiny moon phase glyph: lit disc with a terminator ellipse. */
export function MoonGlyph({ fraction, size = 36 }: { fraction: number; size?: number }) {
  const phase = fraction * 2 * Math.PI;
  const k = Math.cos(phase); // 1 → new, -1 → full
  const waxing = fraction < 0.5;
  const rx = Math.abs(k) * 16;
  const lit = 'var(--paper)';
  const dark = 'var(--ink-3)';
  return (
    <svg viewBox="-18 -18 36 36" width={size} height={size} aria-hidden>
      <circle r={16} fill={dark} stroke="var(--line)" />
      {/* lit half */}
      <path d={waxing ? 'M0,-16 A16,16 0 0,1 0,16 Z' : 'M0,-16 A16,16 0 0,0 0,16 Z'} fill={lit} />
      {/* terminator */}
      <ellipse rx={rx} ry={16} fill={k > 0 ? dark : lit} />
    </svg>
  );
}
