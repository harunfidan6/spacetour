'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, SplitText, markIntroDone, prefersReducedMotion } from './gsap';

const SESSION_KEY = 'spacetour:intro';

/**
 * Title-sequence preloader. Plays the full sequence once per session;
 * afterwards it only fades the SSR cover away.
 */
export function Preloader() {
  const [active, setActive] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const orbit = useRef<SVGCircleElement>(null);
  const planet = useRef<SVGGElement>(null);
  const panels = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable */
    }

    const finish = () => {
      markIntroDone();
      setActive(false);
    };

    if (seen || prefersReducedMotion()) {
      const tw = gsap.to(el, { autoAlpha: 0, duration: 0.45, delay: 0.05, ease: 'power2.out', onStart: markIntroDone, onComplete: finish });
      return () => {
        tw.kill();
      };
    }

    const ctx = gsap.context(() => {
      const split = SplitText.create(word.current!, { type: 'chars', mask: 'chars' });
      const state = { v: 0 };
      const tl = gsap.timeline({ defaults: { ease: 'mg.out' } });

      tl.set(word.current, { visibility: 'visible' })
        .from(split.chars, { yPercent: 110, duration: 1, stagger: 0.045 })
        .fromTo(orbit.current, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'mg.inOut' }, 0)
        .to(planet.current, { rotate: 360, svgOrigin: '60 60', duration: 1.8, ease: 'mg.inOut' }, 0)
        .to(
          state,
          {
            v: 100,
            duration: 1.8,
            ease: 'mg.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(state.v)).padStart(3, '0');
            },
          },
          0
        )
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'mg.inOut' }, 0)
        .to(split.chars, { yPercent: -110, duration: 0.6, stagger: 0.025, ease: 'mg.inOut' }, '+=0.15')
        .fromTo(
          panels.current!.children,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, stagger: 0.09, ease: 'mg.inOut' },
          '<0.1'
        )
        .add(markIntroDone, '+=0.05')
        .to(el, { yPercent: -100, duration: 0.9, ease: 'mg.inOut' }, '<')
        .call(finish);
    }, el);

    return () => ctx.revert();
  }, []);

  if (!active) return null;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[250] hidden flex-col justify-between overflow-hidden bg-ink p-[var(--gutter)] text-paper [.js_&]:flex"
      aria-hidden
    >
      <div className="flex items-start justify-between">
        <span className="label text-muted">SpaceTour TR — Kinetik Uzay Atlası</span>
        <svg viewBox="0 0 120 120" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
          <circle cx="60" cy="60" r="10" fill="var(--solar)" />
          <circle ref={orbit} cx="60" cy="60" r="44" fill="none" stroke="var(--paper)" strokeWidth="1" />
          <g ref={planet}>
            <circle cx="104" cy="60" r="5" fill="var(--lime)" />
          </g>
        </svg>
      </div>

      <div ref={word} className="display invisible text-[clamp(3rem,15vw,15rem)] leading-[0.8]">
        Spacetour
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="label max-w-[16rem] text-muted">Yörünge hesaplanıyor · Gökyüzü yükleniyor · NASA / ESA açık veri</div>
        <span ref={count} className="display text-[clamp(2.5rem,8vw,7rem)] tabular-nums text-solar">
          000
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
        <div ref={bar} className="h-full origin-left bg-solar" style={{ transform: 'scaleX(0)' }} />
      </div>

      <div ref={panels} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-solar" style={{ transform: 'translateY(100%)' }} />
        <div className="absolute inset-0 bg-violet" style={{ transform: 'translateY(100%)' }} />
        <div className="absolute inset-0 bg-ink" style={{ transform: 'translateY(100%)' }} />
      </div>
    </div>
  );
}
