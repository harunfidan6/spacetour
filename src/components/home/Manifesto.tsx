'use client';

import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { Counter, RotatingBadge } from '@/components/motion/primitives';
import { Marquee } from '@/components/motion/Marquee';

const COPY: (string | { em: string })[] = [
  'Bu', 'bir', 'galeri', 'değil,', 'bir', { em: 'yörünge.' },
  'Her', 'gezegen', 'bir', 'durak,', 'her', 'tutulma', 'bir', { em: 'randevu,' },
  'her', 'yıldız', 'bir', 'koordinat.', 'SpaceTour,', 'gökyüzünü', 'okumayı', 'öğrenmek', 'isteyenler', 'için',
  'hareket', 'eden', 'bir', { em: 'atlas' }, '—', 'NASA', 've', 'ESA', 'verisiyle,', 'gerçek', 'zamanlı.',
];

export function Manifesto({ stats }: { stats: { value: number; label: string }[] }) {
  const root = useRef<HTMLElement>(null);

  useGsap(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '[data-copy]', start: 'top 78%', end: 'bottom 50%', scrub: true },
        }
      );
      gsap.from('[data-stat]', {
        yPercent: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: '[data-stats]', start: 'top 88%', once: true },
      });
    },
    [],
    root
  );

  return (
    <section ref={root} className="relative bg-ink text-paper border-t border-line">
      <div className="px-[var(--gutter)] pb-20 pt-20 sm:pt-28">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="label text-gold">(01)</span>
          <span className="label text-paper">Manifesto</span>
          <span className="label ml-auto hidden text-muted sm:inline">Neden SpaceTour?</span>
        </div>

        <div className="relative grid gap-10 pt-12 lg:grid-cols-12">
          <p data-copy className="text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.035em] text-paper lg:col-span-10">
            {COPY.map((w, i) =>
              typeof w === 'string' ? (
                <span key={i} data-word className="inline-block pr-[0.24em]">
                  {w}
                </span>
              ) : (
                <span key={i} data-word className="serif-i inline-block pr-[0.24em] text-[1.08em] text-gold">
                  {w.em}
                </span>
              )
            )}
          </p>
          <div className="hidden justify-end lg:col-span-2 lg:flex">
            <RotatingBadge text="Yukarı bak · Hareket et · Keşfet · " size={150} className="text-paper/70">
              <ArrowDownRight size={34} strokeWidth={1.4} className="text-gold" />
            </RotatingBadge>
          </div>
        </div>

        <div data-stats className="mt-16 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="overflow-hidden bg-ink-2 p-6 sm:p-8">
              <div data-stat>
                <div className="display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.8] text-gold">
                  <Counter to={s.value} />
                </div>
                <div className="label mt-4 text-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANET_TAPE = ['Güneş', 'Merkür', 'Venüs', 'Dünya', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton'];
const FEATURE_TAPE = ['3D yolculuk', 'Canlı ISS', 'Planetaryum', 'Tutulmalar', 'Doğum haritası', 'Spektrum'];

/** Two rotated tapes crossing the cosmic seam. */
export function CrossTapes() {
  return (
    <div aria-hidden className="relative h-[28vw] max-h-[320px] min-h-[180px] overflow-hidden bg-gradient-to-b from-ink via-ink-2 to-ink border-y border-line">
      <div className="absolute left-[-10%] top-[38%] w-[120%] -translate-y-1/2 rotate-[-4deg] bg-ink-3 border-y border-line py-2 text-paper shadow-2xl sm:py-3">
        <Marquee speed={90}>
          {PLANET_TAPE.map((p) => (
            <span key={p} className="display flex items-center gap-6 px-6 pb-[0.04em] pt-[0.16em] text-[clamp(1.6rem,3.8vw,3.2rem)]">
              {p}
              <span className="text-gold">✺</span>
            </span>
          ))}
        </Marquee>
      </div>
      <div className="absolute left-[-10%] top-[64%] w-[120%] -translate-y-1/2 rotate-[3deg] bg-gold py-2 text-ink font-bold shadow-xl sm:py-2.5">
        <Marquee speed={70} reverse>
          {FEATURE_TAPE.map((p) => (
            <span key={p} className="label flex items-center gap-5 px-5 text-xs font-bold tracking-wider sm:text-sm">
              {p}
              <span>✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

