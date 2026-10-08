'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react';
import { gsap, useGsap, prefersReducedMotion, whenIntroDone } from '@/components/motion/gsap';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { MoonOrb } from '@/components/space/PlanetOrb';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';
import type { EventType } from '@/data/events';
import { useIdleReady } from '@/lib/useIdleReady';
import { heroScene, resetHeroScene } from './heroScene';

// three.js sahnesi ilk boyamayı geciktirmesin: sayfa boşa çıkınca ayrı parça olarak yüklenir
const HeroCosmos3D = dynamic(() => import('./HeroCosmos3D').then((m) => m.HeroCosmos3D), { ssr: false });

export interface HomeHeroProps {
  moon: { fraction: number; illumination: number; name: string };
  next: { days: number; title: string; type: EventType; href: string } | null;
}

/** Ana sayfanın açılışı: belgesel başlığı, yoğun 3D Güneş Sistemi, Ay evresi ve sıradaki olay. */
export function HomeHero({ moon, next }: HomeHeroProps) {
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const scene3d = useIdleReady();

  // Açılış ekrandan çıkınca WebGL çizimi durur
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px 0px' });
    io.observe(el);
    return () => io.disconnect();
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

  useGsap(
    () => {
      const el = root.current!;
      resetHeroScene();
      if (prefersReducedMotion()) {
        Object.assign(heroScene, { intro: 1, frozen: true });
        return;
      }

      // Güneş parlar, gezegenler ve yörüngeler belirir, yazılar yukarı süzülür
      gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 24 });
      const intro = gsap
        .timeline({ paused: true })
        .to(heroScene, { intro: 1, duration: 2.6, ease: 'power3.out' })
        .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5);
      const cancelIntro = whenIntroDone(() => intro.play());

      // Kaydırırken hafif paralaks: sabitleme ya da kaydırma gaspı yok
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
              heroScene.scroll = self.progress;
            },
          },
        })
        .to('[data-hero-copy]', { y: -50, autoAlpha: 0.1, ease: 'none' }, 0)
        .to('[data-hero-bottom]', { y: 30, autoAlpha: 0.2, ease: 'none' }, 0);

      return cancelIntro;
    },
    [],
    root
  );

  return (
    <section ref={root} aria-labelledby="evren" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink" style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      {/* Katmanlar: Samanyolu fotoğrafı, 3D sahne, okunurluk gölgeleri */}
      <Image src="/images/space/eso-milky-way-23ddfc.jpg" alt="" fill priority sizes="100vw" quality={60} className="-z-30 object-cover opacity-35 mix-blend-screen motion-safe:animate-[hero-drift_38s_ease-in-out_infinite_alternate] max-lg:object-[70%_center]" />
      <div aria-hidden className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_62%_55%,rgb(255_150_60/0.16),transparent_55%)] max-lg:bg-[radial-gradient(ellipse_at_45%_62%,rgb(255_150_60/0.18),transparent_50%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        {scene3d && (
          <div className="absolute inset-0 animate-[fade-in_1.4s_ease-out_both]">
            <HeroCosmos3D active={inView} />
          </div>
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(5_5_8/0.82)_0%,rgb(5_5_8/0.45)_34%,transparent_58%)] max-lg:bg-[linear-gradient(180deg,rgb(5_5_8/0.55)_0%,rgb(5_5_8/0.2)_38%,transparent_50%,transparent_72%,rgb(5_5_8/0.75)_88%,rgb(5_5_8/0.95)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative flex flex-1 flex-col px-[var(--gutter)] pb-8 pt-24 sm:pt-28 lg:justify-center lg:pb-10">
        <div data-hero-copy className="lg:max-w-[52rem]">
          <div data-hero-fade className="flex items-center gap-4 whitespace-nowrap">
            <span className="doc-kicker text-gold">Bölüm 01</span>
            <span aria-hidden className="h-px w-24 bg-gradient-to-r from-gold to-gold/0 sm:w-28" />
            <span className="doc-kicker text-paper/60 max-sm:hidden">Bir uzay belgeseli</span>
          </div>

          <h1 id="evren" className="mt-7 sm:mt-9">
            <SplitReveal as="span" className="doc-title block whitespace-nowrap pt-[0.06em] text-[clamp(3.4rem,13.5vw,6.5rem)] text-paper lg:text-[clamp(6rem,8.4vw,9.25rem)]" trigger="intro" effect="rise">
              Evren
            </SplitReveal>
            <span data-hero-fade className="doc-serif -mt-[0.04em] block bg-[linear-gradient(100deg,#e39b2d_0%,var(--gold)_22%,#f8e09a_38%,#fff6d8_46%,#f8e09a_54%,var(--gold)_70%,#e39b2d_100%)] bg-[length:200%_100%] bg-clip-text motion-safe:animate-[hero-sheen_7s_linear_infinite] pb-[0.12em] pr-[0.1em] whitespace-nowrap text-[clamp(3.1rem,12.4vw,6rem)] leading-[1.02] text-transparent lg:text-[clamp(5rem,6.8vw,7.5rem)]">
              hiç durmaz.
            </span>
          </h1>

          <p data-hero-fade className="mt-5 max-w-[30rem] text-[15px] leading-[1.75] tracking-[0.05em] text-paper/85 sm:text-[17px]">
            Yedi bölümlük bir gökyüzü belgeseli. Güneş Sistemi’ni 3D gezin, 3D gök küresinde gökyüzünü okuyun, tutulmaları takviminize ekleyin. NASA ve ESA verileriyle.
          </p>
        </div>

        {/* Dikey ekranda sahne bu boşlukta görünür */}
        <div aria-hidden className="min-h-[28svh] flex-1 lg:hidden" />

        <div data-hero-bottom className="lg:mt-10">
          <div data-hero-fade className="flex items-center gap-3 sm:gap-4">
            <a
              href="#bolumler"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('bolumler')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-gradient-to-b from-[#ffdc74] to-gold py-2 pl-5 pr-2 text-[15px] font-bold text-ink shadow-[0_12px_40px_-12px_rgb(233_196_106/0.7)] transition-transform hover:scale-[1.03] sm:gap-4 sm:py-2.5 sm:pl-7 sm:pr-2.5 sm:text-lg"
            >
              Belgeseli başlat
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-gold transition-transform group-hover:translate-x-0.5 sm:h-11 sm:w-11">
                <ArrowRight size={18} />
              </span>
            </a>
            <Link
              href="/harita/planetaryum"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-ink/40 px-4 py-[0.8rem] text-[15px] text-paper backdrop-blur-md transition-colors hover:border-gold/60 hover:text-gold sm:gap-3 sm:px-7 sm:py-[1.05rem] sm:text-lg"
            >
              3D gök küresi <ArrowUpRight size={18} />
            </Link>
          </div>

          <dl data-hero-fade className="mt-8 grid max-w-[40rem] grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-3 sm:mt-10 sm:gap-8">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <span className="rounded-full shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_0_24px_rgb(239_236_230/0.08)]">
                <MoonOrb fraction={moon.fraction} className="h-11 w-11 sm:h-14 sm:w-14" />
              </span>
              <div>
                <dt className="doc-kicker whitespace-nowrap text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-paper/60">Ay evresi</dt>
                <dd>
                  <span className="doc-title mt-1 block text-[1.65rem] leading-none text-paper sm:text-4xl">%{Math.round(moon.illumination * 100)}</span>
                  <span className="doc-kicker mt-1.5 block whitespace-nowrap text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-paper/60">{moon.name}</span>
                </dd>
              </div>
            </div>
            <span aria-hidden className="h-14 w-px bg-white/15" />
            <div className="flex items-start gap-2.5 sm:gap-4">
              <CalendarDays aria-hidden size={20} className="mt-0.5 shrink-0 text-gold" />
              <div className="min-w-0">
                <dt className="doc-kicker whitespace-nowrap text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-paper/60">Sıradaki olay</dt>
                <dd>
                  {next ? (
                    <Link href={next.href} className="group block">
                      <span className="doc-title mt-1 block whitespace-nowrap text-[1.65rem] leading-none text-gold sm:text-4xl">{next.days === 0 ? 'Bugün' : next.days === 1 ? 'Yarın' : `${next.days} gün`}</span>
                      <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-paper/80 group-hover:text-paper">
                        <AstronomicalEventGlyph type={next.type} size={14} className="shrink-0 text-gold" />
                        <span className="truncate">{next.title}</span>
                      </span>
                    </Link>
                  ) : (
                    <Link href="/takvim" className="mt-1 block text-sm text-paper/80 hover:text-gold">
                      Gök olayları takvimi
                    </Link>
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
