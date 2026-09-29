'use client';

import Link from 'next/link';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGsap } from '@/components/motion/gsap';
import { SectionHead, Em } from '@/components/ui/Headings';
import { SITE_ROUTES } from '@/lib/routes';
import { AnsiklopediGraphic, AstrolojiGraphic, GozlemeviGraphic, HaritaGraphic, TakvimGraphic } from './ModuleGraphics';

const MODULES: { href: string; title: ReactNode; text: string; tags: string[]; graphic: ReactNode }[] = [
  {
    href: '/harita',
    title: 'Gök haritası',
    text: 'Konumuna göre anlık hesaplanan 360° planetaryum. Takımyıldız çizgileri, Messier nesneleri ve kamerayla artırılmış gerçeklik.',
    tags: ['Alt-Az', 'AR kamera', 'Messier'],
    graphic: <HaritaGraphic />,
  },
  {
    href: '/takvim',
    title: 'Olay takvimi',
    text: 'Tutulmalar, meteor yağmurları, gezegen kavuşumları ve süper aylar — gözlem ipuçlarıyla birlikte gün gün.',
    tags: ['Tutulma', 'Meteor', 'Kavuşum'],
    graphic: <TakvimGraphic />,
  },
  {
    href: '/ansiklopedi',
    title: 'Ansiklopedi',
    text: 'Gezegen kayıtları, 3D hologramlar, Kepler orrery’si, ölçek karşılaştırma, çekim hesaplayıcı ve asteroit çarpışma simülatörü.',
    tags: ['Orrery', 'Ötegezegen', 'Laboratuvar'],
    graphic: <AnsiklopediGraphic />,
  },
  {
    href: '/astroloji',
    title: 'Astroloji',
    text: 'Doğum haritası çarkı, yükselen burç, numeroloji, günlük transitler, kozmik tarot ve iki kişilik sinastri analizi.',
    tags: ['Natal', 'Tarot', 'Sinastri'],
    graphic: <AstrolojiGraphic />,
  },
  {
    href: '/gozlemevi',
    title: 'Gözlemevi',
    text: 'Aynı nesneye dört farklı gözle bak: Hubble’ın görünür ışığı, Webb’in kızılötesi, Chandra’nın X-ışını ve radyo çanakları.',
    tags: ['JWST', 'Chandra', 'VLA'],
    graphic: <GozlemeviGraphic />,
  },
];

export function ModulesRail() {
  const root = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = root.current!.querySelector<HTMLElement>('[data-rail-pin]')!;
        const track = pin.querySelector<HTMLElement>('[data-rail-track]')!;
        const bar = pin.querySelector<HTMLElement>('[data-rail-bar]')!;
        const counter = pin.querySelector<HTMLElement>('[data-rail-count]')!;
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

        const rail = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              bar.style.transform = `scaleX(${self.progress})`;
              counter.textContent = String(Math.min(MODULES.length, Math.floor(self.progress * MODULES.length) + 1)).padStart(2, '0');
            },
          },
        });

        gsap.utils.toArray<HTMLElement>('[data-rail-card]', track).forEach((card) => {
          const art = card.querySelector('[data-rail-art]');
          const title = card.querySelector('[data-rail-title]');
          gsap.fromTo(art, { xPercent: 18, rotate: 8 }, { xPercent: -8, rotate: -4, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: rail, start: 'left right', end: 'right left', scrub: true } });
          gsap.from(title, { yPercent: 40, autoAlpha: 0, ease: 'mg.out', duration: 1, scrollTrigger: { trigger: card, containerAnimation: rail, start: 'left 75%' } });
        });
      });
      return () => mm.revert();
    },
    [],
    root
  );

  const routes = MODULES.map((m) => SITE_ROUTES.find((r) => r.href === m.href)!);

  return (
    <section ref={root} className="relative bg-ink" style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <div className="px-[var(--gutter)] pt-24 sm:pt-32">
        <SectionHead
          index="03"
          kicker="Modüller"
          aside="Kaydırdıkça sağa akar"
          title={
            <>
              Beş <Em>alet</Em>, tek gökyüzü
            </>
          }
          lede="Her biri ayrı bir enstrüman. Hepsi aynı gökyüzüne bakıyor — farklı zaman ölçeklerinde, farklı dalgaboylarında."
        />
      </div>

      <div data-rail-pin className="relative md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-hidden">
        <div data-rail-track className="flex flex-col gap-4 px-[var(--gutter)] pb-24 md:w-max md:flex-row md:gap-6 md:pb-0">
          {MODULES.map((m, i) => {
            const r = routes[i];
            return (
              <Link
                key={m.href}
                href={m.href}
                data-rail-card
                data-cursor="Aç"
                className="group relative flex shrink-0 flex-col overflow-hidden text-ink md:h-[72svh] md:max-h-[680px] md:min-h-[480px] md:w-[min(76vw,1080px)] lg:flex-row"
                style={{ background: r.accent }}
              >
                <div className="relative z-10 flex flex-1 flex-col justify-between gap-8 p-6 sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="label font-semibold">
                      {r.index} / 0{MODULES.length}
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/40 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-paper">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <div>
                    <h3 data-rail-title className="display display-tight text-[clamp(2.4rem,4.8vw,5rem)]">
                      {m.title}
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/75 sm:text-base">{m.text}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {m.tags.map((t) => (
                        <span key={t} className="label rounded-full border border-ink/35 px-3 py-1.5 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative flex min-h-[260px] flex-1 items-center justify-center p-6 md:min-h-0">
                  <div data-rail-art className="aspect-square w-full max-w-[440px]">
                    {m.graphic}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden items-center gap-4 md:flex">
          <span className="label text-paper">
            <span data-rail-count>01</span> / 0{MODULES.length}
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-rail-bar className="absolute inset-0 origin-left bg-paper" style={{ transform: 'scaleX(0)' }} />
          </span>
        </div>
      </div>
    </section>
  );
}
