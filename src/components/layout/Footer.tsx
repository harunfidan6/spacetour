'use client';

import Link from 'next/link';
import { INFO_PAGES, INSTAGRAM_URL } from '@/components/doc/InfoPage';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { FitText } from '@/components/motion/FitText';
import { Marquee } from '@/components/motion/Marquee';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { LiveClock } from '@/components/motion/primitives';
import { SITE_ROUTES } from '@/lib/routes';

const SOURCES = [
  { label: 'NASA Science', href: 'https://science.nasa.gov/' },
  { label: 'ESA / Hubble', href: 'https://esahubble.org/' },
  { label: 'NOAA SWPC', href: 'https://www.swpc.noaa.gov/' },
  { label: 'JPL yörünge elemanları', href: 'https://ssd.jpl.nasa.gov/planets/approx_pos.html' },
  { label: 'Where the ISS at?', href: 'https://wheretheiss.at/' },
];

export function Footer() {
  const pathname = usePathname();
  // The planetarium is a full-viewport instrument; it gets no footer.
  if (pathname.startsWith('/harita')) return null;

  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.08] bg-ink">
      <div className="border-b border-white/[0.06] bg-ink-2/40 py-2.5 backdrop-blur-sm">
        <Marquee speed={35}>
          {['Gökyüzü bu gece açık', 'Gerçek Zamanlı Kozmik Telemetri', 'NASA JPL Efemeris Algoritmaları', '88 Takımyıldızı · 110 Messier Hedefi'].map((t) => (
            <span key={t} className="flex items-center gap-6 px-6 font-mono text-xs uppercase tracking-widest text-paper/60">
              <span>{t}</span>
              <span className="text-gold text-[10px]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="grid gap-12 px-[var(--gutter)] py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SplitReveal as="p" className="display text-3xl sm:text-4xl font-semibold text-paper">
            Bakmaya <span className="serif-i text-gold">hazır</span> mısın?
          </SplitReveal>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Link
              href="/harita"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink shadow-lg transition-all duration-300 hover:bg-paper hover:shadow-[0_10px_30px_rgba(245,197,66,0.3)]"
            >
              <span>360° Gök Haritasını Başlat</span>
              <span className="text-sm">→</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-paper/60">
              Bulunduğun şehrin gökyüzünü canlı hesaplıyoruz. Haritayı çevir, takımyıldızları ve gezegenleri bul.
            </p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6" aria-label="Alt menü">
          <div>
            <div className="label mb-4 text-muted">Keşfet</div>
            <ul className="space-y-2">
              {SITE_ROUTES.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="group flex items-center gap-2 text-sm text-paper/80">
                    <span className="label text-[10px]" style={{ color: r.accent }}>
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
            <p className="mb-3 flex items-center gap-2 text-sm text-paper/80">
              <span className="live-dot" /> Tüm sistemler çalışıyor
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="label text-[10px] text-muted">İstanbul</dt>
                <dd className="font-mono text-paper">
                  <LiveClock />
                </dd>
              </div>
              <div>
                <dt className="label text-[10px] text-muted">Koordinat</dt>
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
        <nav aria-label="Kurumsal" className="flex flex-wrap gap-x-4 gap-y-2">
          {INFO_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="label text-muted transition-colors hover:text-paper">{p.label}</Link>
          ))}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener me" className="label inline-flex items-center gap-1 text-muted transition-colors hover:text-paper">
            Instagram <ArrowUpRight size={11} />
          </a>
        </nav>
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
