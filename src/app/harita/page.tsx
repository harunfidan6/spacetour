'use client';

import dynamic from 'next/dynamic';
import { useRef, type CSSProperties } from 'react';
import { gsap, useGsap, prefersReducedMotion, whenIntroDone } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { LiveClock, Ticks } from '@/components/motion/primitives';

const Planetarium3D = dynamic(() => import('@/components/space/Planetarium3D').then((mod) => mod.Planetarium3D), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <span className="label text-muted">Gök kubbesi hesaplanıyor…</span>
    </div>
  ),
});

/* Title card that plays over the dome, then lifts away to hand over control. */
function DomeIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      const tl = gsap
        .timeline({ paused: true, delay: 1.9 })
        .to('[data-intro-copy]', { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'mg.inOut' })
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'mg.inOut' }, '<0.2')
        .set(el, { display: 'none' });
      return whenIntroDone(() => tl.play());
    },
    [],
    root
  );

  return (
    <div ref={root} className="absolute inset-0 z-40 flex flex-col justify-between bg-ink/92 p-[var(--gutter)] backdrop-blur-sm" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <div data-intro-copy className="flex items-center gap-3 border-b border-line pb-4">
        <span className="label text-lime">(01)</span>
        <span className="label text-paper">Gök haritası</span>
        <span className="label ml-auto text-muted">
          İstanbul · <LiveClock />
        </span>
      </div>
      <div data-intro-copy>
        <SplitReveal as="h1" trigger="intro" effect="tilt" className="display text-[clamp(3.4rem,13vw,13rem)] text-paper">
          Gök <span className="serif-i text-lime">kubbesi</span>
        </SplitReveal>
        <p className="mt-6 max-w-lg text-base text-paper/70">Bulunduğun yerin gökyüzü, şu an. Sürükle, yakınlaştır, bir yıldıza dokun.</p>
      </div>
    </div>
  );
}

export default function HaritaPage() {
  return (
    <div className="relative h-[100svh] w-full bg-ink pt-16" style={{ '--page-accent': 'var(--lime)' } as CSSProperties}>
      <div className="ticks relative h-full w-full overflow-hidden border-t border-line">
        <Ticks />
        <Planetarium3D />
        <DomeIntro />
      </div>
    </div>
  );
}
