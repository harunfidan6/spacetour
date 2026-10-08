'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/components/motion/gsap';
import { useIdleReady } from '@/lib/useIdleReady';
import { HERO_BODIES, heroScene, resetHeroScene } from './heroScene';

// three.js sahnesi ilk boyamayı geciktirmesin: sayfa boşa çıkınca ayrı parça olarak yüklenir
const HeroSolarSystem3D = dynamic(() => import('./HeroSolarSystem3D').then((m) => m.HeroSolarSystem3D), { ssr: false });

/** Ana sayfadaki 3D Güneş Sistemi bandı: görünür olunca canlanır, ekrandan çıkınca çizimi durur. */
export function SolarSystemBand() {
  const root = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [inView, setInView] = useState(false);
  const scene3d = useIdleReady();

  const placeLabel = useCallback((i: number, x: number, y: number, alpha: number) => {
    const el = labels.current[i];
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    el.style.opacity = alpha.toFixed(2);
  }, []);

  useEffect(() => {
    resetHeroScene();
    const el = root.current;
    if (!el) return;
    let played = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting || played) return;
        played = true;
        if (prefersReducedMotion()) Object.assign(heroScene, { intro: 1, frozen: true });
        else gsap.to(heroScene, { intro: 1, duration: 2.4, ease: 'power3.out' });
      },
      { rootMargin: '100px 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      gsap.killTweensOf(heroScene);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: PointerEvent) => {
      heroScene.px = e.clientX / window.innerWidth - 0.5;
      heroScene.py = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <section ref={root} aria-labelledby="gunes-sistemi" className="relative isolate h-[88svh] min-h-[620px] overflow-hidden sm:h-[82svh] sm:min-h-[560px] border-y border-white/10 bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[58%] sm:h-full">
        {scene3d && <HeroSolarSystem3D project={placeLabel} active={inView} />}
        {HERO_BODIES.map((b, i) => (
          <span
            key={b.id}
            ref={(node) => {
              labels.current[i] = node;
            }}
            aria-hidden
            className="absolute left-0 top-0 whitespace-nowrap pl-5 text-xs text-paper/75 will-change-transform"
            style={{ opacity: 0, marginTop: '-1.6em' }}
          >
            <span className="mr-1.5 inline-block h-px w-3 bg-paper/60 align-middle" />
            {b.name} · {b.au}
          </span>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(5_5_8/0.8)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent sm:h-2/3" />

      <div className="relative flex h-full items-end px-[var(--gutter)] pb-12 sm:pb-16">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm font-medium text-gold">Güneş Sistemi</p>
          <h2 id="gunes-sistemi" className="mt-3 max-w-2xl text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper">
            Gezegenler arasında <span className="doc-serif text-gold">üç boyutlu</span> bir yolculuk
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
            Güneş’ten Plüton’a durak durak ilerle; her gezegeni gerçek dokusu, uydusu ve yörüngesiyle yakından incele.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/yolculuk" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90">
              Yolculuğa çık <ArrowUpRight size={15} />
            </Link>
            <Link href="/ansiklopedi" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-paper backdrop-blur-xl transition-colors hover:border-gold/60 hover:text-gold">
              Gezegen ansiklopedisi <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
