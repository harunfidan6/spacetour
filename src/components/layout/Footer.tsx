'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { FitText } from '@/components/motion/FitText';
import { Marquee } from '@/components/motion/Marquee';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { LiveClock, Magnetic } from '@/components/motion/primitives';
import { SITE_ROUTES, TELEMETRY_ROUTE } from '@/lib/routes';

const SOURCES = [
  { label: 'NASA Open APIs', href: 'https://api.nasa.gov/' },
  { label: 'ESA / Hubble', href: 'https://esahubble.org/' },
  { label: 'NOAA SWPC', href: 'https://www.swpc.noaa.gov/' },
  { label: 'JPL Horizons', href: 'https://ssd.jpl.nasa.gov/horizons/' },
];

export function Footer() {
  const pathname = usePathname();
  // The planetarium is a full-viewport instrument; it gets no footer.
  if (pathname.startsWith('/harita')) return null;

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-ink">
      <div className="border-b border-line bg-solar py-3 text-ink">
        <Marquee speed={70}>
          {['Gökyüzü bu gece açık', 'Yukarı bak', 'Evren hiç durmaz'].map((t) => (
            <span key={t} className="display flex items-center gap-8 px-8 pb-[0.04em] pt-[0.16em] text-[clamp(1.6rem,3.4vw,3rem)]">
              {t}
              <span aria-hidden>✺</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="grid gap-12 px-[var(--gutter)] py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SplitReveal as="p" className="display text-[clamp(2.2rem,5vw,4.5rem)]">
            Bakmaya <span className="serif-i text-solar">hazır</span> mısın?
          </SplitReveal>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/harita"
               
                className="grid h-32 w-32 place-items-center rounded-full bg-paper text-center text-ink transition-colors hover:bg-lime"
              >
                <span className="label font-semibold leading-snug">
                  Gök
                  <br />
                  haritası
                  <br />→
                </span>
              </Link>
            </Magnetic>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Bulunduğun şehrin gökyüzünü canlı hesaplıyoruz. Kamerayı aç, gökyüzüne tut, takımyıldızları gör.
            </p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6" aria-label="Alt menü">
          <div>
            <div className="label mb-4 text-muted">Keşfet</div>
            <ul className="space-y-2">
              {[...SITE_ROUTES, TELEMETRY_ROUTE].map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="group flex items-center gap-2 text-sm text-paper/80">
                    <span className="label text-[9px]" style={{ color: r.accent }}>
                      {r.index}
                    </span>
                    <span className="roll">
                      <span>{r.label}</span>
                      <span style={{ color: r.accent }}>{r.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label mb-4 text-muted">Veri</div>
            <ul className="space-y-2">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm text-paper/80 hover:text-solar">
                    {s.label}
                    <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="label mb-4 text-muted">Durum</div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-paper/80">
                <span className="live-dot" /> Tüm sistemler çalışıyor
              </div>
              <div>
                <dt className="label text-[9px] text-muted">İstanbul</dt>
                <dd className="font-mono text-paper">
                  <LiveClock />
                </dd>
              </div>
              <div>
                <dt className="label text-[9px] text-muted">Koordinat</dt>
                <dd className="font-mono text-paper">41.0082°K · 28.9784°D</dd>
              </div>
            </dl>
          </div>
        </nav>
      </div>

      <div className="px-[var(--gutter)]">
        <FitText className="display select-none leading-[0.78] text-paper" fallback="17vw">
          <SplitReveal as="span" effect="rise" stagger={0.04} duration={1.3}>
            Spacetour
          </SplitReveal>
        </FitText>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-[var(--gutter)] py-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="label text-muted">© 2026 SpaceTour TR · spacetour.com.tr</span>
        <span className="label text-muted">NASA / ESA / USGS açık veri lisanslı</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="label self-start text-paper transition-colors hover:text-solar sm:self-auto"
        >
          Yukarı ↑
        </button>
      </div>
    </footer>
  );
}
