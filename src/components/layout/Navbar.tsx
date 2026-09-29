'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/components/motion/gsap';
import { LiveClock, RotatingBadge } from '@/components/motion/primitives';
import { SITE_ROUTES, TELEMETRY_ROUTE } from '@/lib/routes';
import { Terminal } from 'lucide-react';
import { CosmicAudioEngine } from '@/components/space/CosmicAudioEngine';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="6" fill="var(--solar)" />
      <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <g className="origin-center spin-slow" style={{ transformBox: 'view-box', animationDuration: '6s' }}>
        <circle cx="35" cy="20" r="2.6" fill="var(--lime)" />
      </g>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progress = useRef<HTMLDivElement>(null);

  // Scroll state: solid bar after the fold, hide on scroll down, progress line.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      setScrolled(y > 40);
      if (y > 200 && y > last + 2) setHidden(true);
      else if (y < last - 2) setHidden(false);
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

  // Close the menu once a navigation has committed.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[120] transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}
      >
        <div className="flex h-16 items-center gap-6 px-[var(--gutter)]">
          <Link href="/" className="group flex items-center gap-2.5 text-paper" aria-label="SpaceTour TR ana sayfa">
            <LogoMark className="h-8 w-8" />
            <span className="display text-[17px] leading-none tracking-[-0.02em]">
              Spacetour<span className="text-solar">.tr</span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-7 lg:flex">
            {SITE_ROUTES.slice(1).map((r) => {
              const active = isActive(pathname, r.href);
              return (
                <Link key={r.href} href={r.href} className="group flex items-start gap-1.5 text-[13px] font-medium" aria-current={active ? 'page' : undefined}>
                  <span className="label mt-[1px] text-[9px]" style={{ color: active ? r.accent : 'var(--muted)' }}>
                    {r.index}
                  </span>
                  <span className={`roll ${active ? 'text-paper' : 'text-paper/70'}`}>
                    <span>{r.label}</span>
                    <span style={{ color: r.accent }}>{r.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-3 lg:ml-6">
            <CosmicAudioEngine />
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-cosmic-terminal'))}
              className="hidden items-center gap-2 rounded-full border border-line bg-ink/60 px-3 py-1.5 font-mono text-[11px] text-paper/80 transition-colors hover:border-solar hover:text-solar sm:flex cursor-pointer"
              title="Kozmik Kumanda Terminali (⌘K / Ctrl+K)"
            >
              <Terminal size={12} className="text-solar" />
              <span>⌘K</span>
            </button>
            <Link
              href={TELEMETRY_ROUTE.href}
              className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-paper/80 transition-colors hover:border-lime hover:text-lime xl:flex"
            >
              <span className="live-dot" /> Telemetri
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-3 rounded-full bg-paper py-2 pl-4 pr-2 text-ink transition-colors hover:bg-solar"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <span className="label font-semibold text-ink">Menü</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink">
                <span className="flex flex-col gap-[3px]">
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:-translate-x-0.5" />
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px]">
          <div ref={progress} className="h-full origin-left bg-solar" style={{ transform: 'scaleX(0)' }} />
        </div>
      </nav>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

/* --------------------------------------------------------------------------
   Fullscreen menu
   -------------------------------------------------------------------------- */
function MenuOverlay({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

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
        .fromTo('[data-menu-panel]', { yPercent: -100 }, { yPercent: 0, duration: 0.75, stagger: 0.08 })
        .fromTo('[data-menu-link]', { yPercent: 120 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'mg.out' }, '-=0.35')
        .fromTo('[data-menu-fade]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'mg.out' }, '<0.1');
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      root.current!.style.visibility = 'visible';
      if (prefersReducedMotion()) t.progress(1);
      else t.timeScale(1).play();
      closeBtn.current?.focus({ preventScroll: true });
    } else {
      document.documentElement.style.overflow = '';
      if (t.progress() > 0) {
        if (prefersReducedMotion()) {
          t.progress(0);
          root.current!.style.visibility = 'hidden';
        } else t.timeScale(1.6).reverse();
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const items = [...SITE_ROUTES, TELEMETRY_ROUTE];
  const preview = hovered !== null ? items[hovered] : null;

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
      <div data-menu-panel className="absolute inset-0 bg-solar" />
      <div data-menu-panel className="absolute inset-0 bg-ink">
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="relative flex min-h-full flex-col px-[var(--gutter)] pb-8">
        <div className="flex h-16 items-center justify-between">
          <span data-menu-fade className="label text-muted">
            Navigasyon · {items.length} durak
          </span>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            data-menu-fade
            className="flex items-center gap-3 rounded-full border border-line py-2 pl-4 pr-2 text-paper transition-colors hover:border-solar hover:text-solar"
          >
            <span className="label">Kapat</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-paper text-sm text-ink">✕</span>
          </button>
        </div>

        <div className="grid flex-1 gap-10 py-8 lg:grid-cols-12">
          <ul className="flex flex-col justify-center lg:col-span-8" onMouseLeave={() => setHovered(null)}>
            {items.map((r, i) => {
              const active = r.href === '/' ? pathname === '/' : pathname.startsWith(r.href);
              return (
                <li key={r.href} className="overflow-hidden border-b border-line" onMouseEnter={() => setHovered(i)}>
                  <Link
                    href={r.href}
                    data-menu-link
                    className="group flex items-baseline gap-4 py-2 sm:gap-6"
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      if (active) onClose();
                    }}
                  >
                    <span className="label w-8 shrink-0" style={{ color: r.accent }}>
                      {r.index}
                    </span>
                    <span
                      className="display pt-[0.14em] text-[clamp(2.2rem,6.4vw,6rem)] transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4"
                      style={{ color: active ? r.accent : undefined }}
                    >
                      {r.label}
                    </span>
                    <span className="label ml-auto hidden text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:inline">
                      {r.blurb} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <aside className="flex flex-col justify-between gap-10 lg:col-span-4 lg:pl-10">
            <div data-menu-fade className="hidden lg:block">
              <div
                className="relative grid aspect-square w-full max-w-[320px] place-items-center rounded-full transition-colors duration-500"
                style={{ background: preview?.accent ?? 'var(--ink-3)' }}
              >
                <RotatingBadge text="SpaceTour TR · Kinetik Uzay Atlası · 2026 · " size={300} className="absolute text-ink/80">
                  <span className="display text-[4.5rem] text-ink">{preview?.index ?? '✺'}</span>
                </RotatingBadge>
              </div>
            </div>
            <dl data-menu-fade className="grid grid-cols-2 gap-6 text-paper">
              <div>
                <dt className="label text-muted">Yerel saat</dt>
                <dd className="mt-2 font-mono text-lg">
                  <LiveClock />
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Konum</dt>
                <dd className="mt-2 font-mono text-lg">41.00°K 28.97°D</dd>
              </div>
              <div className="col-span-2">
                <dt className="label text-muted">Veri kaynakları</dt>
                <dd className="mt-2 text-sm text-paper/70">NASA · ESA · NOAA SWPC · JPL Horizons · USGS</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}
