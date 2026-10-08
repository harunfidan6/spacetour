'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowUpRight, Sparkles, Compass, Orbit, Moon, Telescope, Radio, BarChart3, Shield, Search } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/components/motion/gsap';
import { LiveClock } from '@/components/motion/primitives';
import { SITE_ROUTES } from '@/lib/routes';
import { LogoMark } from './LogoMark';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function InstagramIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

// Curated highlights for each section so users can jump straight to popular tools
const SECTION_HIGHLIGHTS: Record<string, { label: string; href: string; icon: string; tag: string }[]> = {
  '/': [
    { label: '3D Güneş Sistemi', href: '/#bolumler', icon: '🪐', tag: 'Simülasyon' },
    { label: '7 Bölümlük Belgesel', href: '/#bolumler', icon: '🌌', tag: 'Keşif' },
    { label: '35+ Etkileşimli Araç', href: '/harita', icon: '⚡', tag: 'Araçlar' },
  ],
  '/harita': [
    { label: '3D Gök Küresi', href: '/harita/planetaryum', icon: '🌐', tag: '3D Küre' },
    { label: '3D Samanyolu Galaksisi', href: '/harita/samanyolu', icon: '🌌', tag: '28.000 Yıldız' },
    { label: 'En Parlak 8 Yıldız', href: '/harita/parlak-yildizlar', icon: '⭐', tag: 'Kerteriz' },
    { label: 'Messier Derin Uzay', href: '/harita/messier', icon: '🔭', tag: '110 Hedef' },
    { label: 'Bortle Işık Kirliliği', href: '/harita/bortle', icon: '💡', tag: 'Simülasyon' },
    { label: 'Kutup Yıldızı & Presesyon', href: '/harita/polaris', icon: '🧭', tag: 'Rehber' },
  ],
  '/takvim': [
    { label: 'Güneş & Ay Tutulmaları', href: '/takvim', icon: '🌒', tag: 'Tutulmalar' },
    { label: 'Meteor Yağmurları', href: '/takvim', icon: '🌠', tag: 'Perseid & Geminid' },
    { label: 'Gezegen Kavuşumları', href: '/takvim', icon: '🪐', tag: 'Efemeris' },
    { label: 'Ekinoks & Gündönümü', href: '/takvim', icon: '☀️', tag: 'Dönenceler' },
  ],
  '/ansiklopedi': [
    { label: 'Gök Cisimleri 3D', href: '/ansiklopedi/gok-cisimleri', icon: '🪐', tag: 'Güneş Sistemi' },
    { label: '88 Takımyıldız Atlası', href: '/ansiklopedi/takimyildizlar', icon: '✨', tag: 'Atlas' },
    { label: '3D Kepler Orrery', href: '/ansiklopedi/laboratuvar/kepler-orrery', icon: '⚙️', tag: 'Laboratuvar' },
    { label: 'Kara Delik & Zaman', href: '/ansiklopedi/laboratuvar/kara-delik', icon: '🕳️', tag: 'Relativite' },
    { label: 'Kütleçekim Hesaplayıcı', href: '/ansiklopedi/laboratuvar/kutlecekim', icon: '⚖️', tag: 'Fizik' },
    { label: 'Asteroit Çarpışması', href: '/ansiklopedi/laboratuvar/asteroit-carpmasi', icon: '💥', tag: 'Simülatör' },
  ],
  '/astroloji': [
    { label: 'Doğum Haritası Analizi', href: '/astroloji/dogum-haritasi', icon: '🔮', tag: 'Güneş-Ay-Yükselen' },
    { label: 'Sinastri & İkili Çekim', href: '/astroloji/sinastri', icon: '💫', tag: 'İkili Harita' },
    { label: '78 Burç İkilisi Uyumu', href: '/astroloji/burc-uyumu', icon: '💖', tag: 'Çekim Skoru' },
    { label: 'Kozmik Tarot Açılımı', href: '/astroloji/tarot', icon: '🃏', tag: '22 Majör Arkana' },
    { label: '12 Burç Günlük Falı', href: '/astroloji/gunluk-burc', icon: '♈', tag: 'Günlük Yorum' },
    { label: 'Canlı Efemeris Transitleri', href: '/astroloji/transitler', icon: '⚡', tag: 'Canlı Veri' },
    { label: 'Gezegen Retroları Radarı', href: '/astroloji/retrolar', icon: '🔄', tag: 'Retro Radarı' },
    { label: 'Pisagor Numeroloji', href: '/astroloji/numeroloji', icon: '🔢', tag: 'Yaşam Yolu' },
  ],
  '/gozlemevi': [
    { label: 'Webb vs Hubble', href: '/gozlemevi/webb-hubble', icon: '🔭', tag: 'Karşılaştırma' },
    { label: 'Dört Spektrum Masası', href: '/gozlemevi/spektrum', icon: '🌈', tag: 'Çok Dalgaboyu' },
    { label: 'Pulsar Radyo Spektrografı', href: '/gozlemevi/radyo', icon: '📻', tag: 'Ses Sentezi' },
    { label: 'Mega Teleskoplar Atlası', href: '/gozlemevi/gozlemevleri', icon: '🌐', tag: 'ELT & DAG' },
    { label: 'Astrofizik Akademisi', href: '/gozlemevi/akademi', icon: '🎓', tag: 'Sınav & Sertifika' },
  ],
  '/canli': [
    { label: 'ISS Canlı Konum & İrtifa', href: '/canli/iss', icon: '🛰️', tag: 'Canlı Yörünge' },
    { label: 'NOAA Uzay Hava Durumu', href: '/canli/uzay-havasi', icon: '☀️', tag: 'Güneş Rüzgârı' },
    { label: 'Bu Gece Gökyüzü', href: '/canli/bu-gece', icon: '🌙', tag: 'Gözlem Rehberi' },
    { label: 'Derin Uzay Sondaları', href: '/canli/sondalar', icon: '🚀', tag: 'Voyager & Webb' },
  ],
  '/yolculuk': [
    { label: 'J2000 Gerçek Efemeris', href: '/yolculuk', icon: '🪐', tag: '3D Simülasyon' },
    { label: 'Didaktik Gezegenler', href: '/yolculuk', icon: '🔭', tag: 'Güneş Sistemi' },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progress = useRef<HTMLDivElement>(null);

  // Scroll state: grounded glass bar, hide on scroll down, progress line.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      setScrolled(y > 30);
      if (y < 90) setHidden(false);
      else if (y > last + 3) setHidden(true);
      else if (y < last - 3) setHidden(false);
      last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Close the menu once navigation commits
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[120] transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'border-b border-white/[0.08] bg-ink/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.65)]'
            : 'border-b border-white/[0.05] bg-ink/40 backdrop-blur-md'
        }`}
      >
        <div className="flex h-16 items-center gap-4 sm:gap-6 px-[var(--gutter)]">
          {/* Logo Brand */}
          <Link href="/" className="group flex items-center gap-2.5 text-paper shrink-0" aria-label="Spacetour.tr ana sayfa">
            <LogoMark className="h-[38px] w-[73px] shrink-0" />
            <span className="display text-[17px] leading-none tracking-[-0.02em]">
              Spacetour<span className="text-gold">.tr</span>
            </span>
          </Link>

          {/* Desktop Chapter Nav Items — Responsive on lg (1024px+) & xl */}
          <div className="ml-auto hidden items-center gap-2.5 lg:flex lg:gap-3.5 xl:gap-5.5">
            {SITE_ROUTES.slice(1).map((r) => {
              const active = isActive(pathname, r.href);
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex items-start gap-1 whitespace-nowrap text-[13px] font-medium py-1 px-1 rounded transition-colors hover:text-paper"
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="label mt-[1px] text-[10px]" style={{ color: active ? 'var(--gold)' : 'var(--muted)' }}>
                    {r.index}
                  </span>
                  <span className={`roll ${active ? 'text-paper font-semibold' : 'text-paper/70'}`}>
                    <span>{r.short}</span>
                    <span style={{ color: 'var(--gold)' }}>{r.short}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Clean Action & Menu Button */}
          <div className="ml-auto lg:ml-2 flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.04] py-1.5 pl-3.5 pr-2 text-paper backdrop-blur-md transition-all hover:border-gold/50 hover:bg-gold/15 hover:text-gold cursor-pointer shadow-sm"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <span className="font-mono text-xs font-semibold">Menü</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.08] transition-colors group-hover:bg-gold/25">
                <span className="flex flex-col gap-[3px]">
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-gold" />
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:bg-gold" />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Reading / Scroll progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px]">
          <div ref={progress} className="h-full origin-left bg-gold shadow-[0_0_8px_rgba(245,197,66,0.5)]" style={{ transform: 'scaleX(0)' }} />
        </div>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

/* --------------------------------------------------------------------------
   Mega Menu Overlay — Calm, Ergonomic & Complete Portal Explorer
   -------------------------------------------------------------------------- */
function MenuOverlay({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number>(() => {
    const idx = SITE_ROUTES.findIndex((r) => r.href !== '/' && pathname.startsWith(r.href));
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: 'mg.inOut' },
          onReverseComplete: () => {
            el.style.visibility = 'hidden';
          },
        })
        // Deep cosmic indigo wipe curtain followed by dark ink panel
        .fromTo('[data-menu-panel]', { yPercent: -100 }, { yPercent: 0, duration: 0.65, stagger: 0.06 })
        .fromTo('[data-menu-link]', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.03, ease: 'mg.out' }, '-=0.25')
        .fromTo('[data-menu-fade]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'mg.out' }, '<0.1');
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      document.documentElement.style.overflow = 'hidden';
      root.current!.style.visibility = 'visible';
      if (prefersReducedMotion()) t.progress(1);
      else t.timeScale(1).play();
      closeBtn.current?.focus({ preventScroll: true });
    } else {
      document.documentElement.style.overflow = '';
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
      if (t.progress() > 0) {
        if (prefersReducedMotion()) {
          t.progress(0);
          root.current!.style.visibility = 'hidden';
        } else t.timeScale(1.8).reverse();
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !root.current) return;
      const focusables = [...root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
        (el) => el.tabIndex >= 0
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const items = SITE_ROUTES;
  const currentSection = items[hoveredIndex] || items[0];
  const highlights = SECTION_HIGHLIGHTS[currentSection.href] || SECTION_HIGHLIGHTS['/'];

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menüsü"
      aria-hidden={!open}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ visibility: 'hidden' }}
    >
      {/* Deep cosmic transition curtain (midnight indigo -> deep ink) */}
      <div data-menu-panel className="absolute inset-0 bg-[#090d1a]" />
      <div data-menu-panel className="absolute inset-0 bg-ink">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      </div>

      <div className="relative flex min-h-full flex-col px-[var(--gutter)] py-6 sm:py-8 justify-between">
        {/* Top Header Bar inside Menu */}
        <div className="flex h-14 items-center justify-between border-b border-white/[0.08] pb-4">
          <div data-menu-fade className="flex items-center gap-3">
            <span className="label text-paper/80 font-mono text-xs flex items-center gap-2">
              <span className="live-dot" />
              <span>Kozmik Keşif Portalı</span>
            </span>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="label text-muted text-[11px] hidden sm:inline">84 Sayfa · 35+ Etkileşimli Araç</span>
          </div>

          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            data-menu-fade
            className="flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.04] py-1.5 pl-4 pr-2 text-paper transition-all hover:border-gold hover:text-gold cursor-pointer"
          >
            <span className="font-mono text-xs">Kapat</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.08] text-xs text-paper group-hover:bg-gold/20">✕</span>
          </button>
        </div>

        {/* Main Content Explorer Grid */}
        <div className="grid flex-1 gap-8 lg:gap-12 py-6 lg:py-8 lg:grid-cols-12 items-center">
          {/* Left Column: Calm, Non-Overwhelming Chapter Navigation */}
          <nav className="flex flex-col justify-center lg:col-span-6" onMouseLeave={() => {}}>
            <span data-menu-fade className="doc-kicker text-muted text-[10px] uppercase tracking-wider mb-2">
              Bölümler & Tematik Alanlar
            </span>
            <ul className="divide-y divide-white/[0.06]">
              {items.map((r, i) => {
                const active = r.href === '/' ? pathname === '/' : pathname.startsWith(r.href);
                const isHovered = hoveredIndex === i;
                return (
                  <li key={r.href} onMouseEnter={() => setHoveredIndex(i)}>
                    <Link
                      href={r.href}
                      data-menu-link
                      className="group flex items-center justify-between py-2 sm:py-2.5 transition-all"
                      tabIndex={open ? 0 : -1}
                      onClick={() => {
                        if (active) onClose();
                      }}
                    >
                      <div className="flex items-baseline gap-3 sm:gap-4">
                        <span className="font-mono text-xs w-6 shrink-0 font-semibold" style={{ color: r.accent }}>
                          {r.index}
                        </span>
                        <span
                          className={`display text-xl sm:text-2xl lg:text-[1.8rem] transition-[transform,color] duration-300 ease-out group-hover:translate-x-2 ${
                            isHovered
                              ? 'text-paper font-bold'
                              : active
                              ? 'text-paper/95'
                              : 'text-paper/70'
                          }`}
                          style={{ color: isHovered ? r.accent : active ? r.accent : undefined }}
                        >
                          {r.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted group-hover:text-paper transition-colors hidden sm:inline">
                        {r.blurb} →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Column: Dynamic Section Explorer Deck with Curated Tools */}
          <aside className="flex flex-col justify-between gap-6 lg:col-span-6 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0">
            {/* Visual Section Preview Card */}
            <div data-menu-fade className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden rounded-xl border border-white/[0.1] bg-ink-2">
              {items.map((r, i) => (
                <Image
                  key={r.href}
                  src={r.image.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover transition-opacity duration-500"
                  style={{ opacity: hoveredIndex === i ? 0.85 : 0 }}
                />
              ))}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                <div>
                  <span className="doc-kicker text-xs font-mono" style={{ color: currentSection.accent }}>
                    Bölüm {currentSection.index} · {currentSection.label}
                  </span>
                  <p className="text-xs text-paper/80 mt-1 max-w-sm line-clamp-1">{currentSection.blurb}</p>
                </div>
                <Link
                  href={currentSection.href}
                  onClick={onClose}
                  className="rounded-full bg-paper text-ink font-semibold text-xs px-3.5 py-1.5 flex items-center gap-1.5 hover:bg-gold transition-colors shrink-0 shadow-lg"
                >
                  <span>Bölüme Git</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Quick Direct Tool Launcher for the Hovered Section */}
            <div data-menu-fade>
              <div className="flex items-center justify-between mb-2.5">
                <span className="doc-kicker text-muted text-[10px] uppercase tracking-wider">
                  Öne Çıkan Araçlar & Modüller
                </span>
                <span className="text-[10px] font-mono text-muted">Doğrudan Başlat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {highlights.map((tool) => (
                  <Link
                    key={tool.label}
                    href={tool.href}
                    onClick={onClose}
                    className="group flex items-center justify-between p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-gold/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm shrink-0">{tool.icon}</span>
                      <span className="text-xs font-medium text-paper/90 group-hover:text-gold transition-colors truncate">
                        {tool.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted px-1.5 py-0.5 rounded border border-white/[0.06] shrink-0">
                      {tool.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Explorer Footer — Trust, Social & Telemetry */}
        <div data-menu-fade className="border-t border-white/[0.08] pt-4 mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://instagram.com/spacetourtr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-paper/70 hover:text-gold transition-colors"
            >
              <InstagramIcon size={13} />
              <span>@spacetourtr</span>
            </a>
            <span className="text-white/20">|</span>
            <Link href="/admin/analitik" onClick={onClose} className="flex items-center gap-1.5 text-paper/70 hover:text-lime transition-colors">
              <BarChart3 size={13} />
              <span>Canlı Telemetri</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/hakkinda" onClick={onClose} className="hover:text-paper transition-colors">Hakkında</Link>
            <Link href="/yontem" onClick={onClose} className="hover:text-paper transition-colors">Yöntem</Link>
            <Link href="/iletisim" onClick={onClose} className="hover:text-paper transition-colors">İletişim</Link>
            <Link href="/gizlilik" onClick={onClose} className="hover:text-paper transition-colors">Gizlilik & KVKK</Link>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>İstanbul · 41.00°K 28.97°D</span>
            <span className="text-white/20">|</span>
            <span className="text-paper/90 font-mono">
              <LiveClock />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
