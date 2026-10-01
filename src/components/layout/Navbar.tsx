'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/components/motion/gsap';
import { LiveClock, RotatingBadge } from '@/components/motion/primitives';
import { SITE_ROUTES } from '@/lib/routes';
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
      // Always visible near the top (also after a route change lands at y = 0).
      if (y < 120) setHidden(false);
      else if (y > last + 2) setHidden(true);
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
              Spacetour<span className="text-gold">.tr</span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-5 lg:flex xl:gap-7">
            {SITE_ROUTES.slice(1).map((r) => {
              const active = isActive(pathname, r.href);
              return (
                <Link key={r.href} href={r.href} className="group flex items-start gap-1.5 whitespace-nowrap text-[13px] font-medium" aria-current={active ? 'page' : undefined}>
                  <span className="label mt-[1px] text-[9px]" style={{ color: active ? 'var(--gold)' : 'var(--muted)' }}>
                    {r.index}
                  </span>
                  <span className={`roll ${active ? 'text-paper font-semibold' : 'text-paper/70'}`}>
                    <span>{r.label}</span>
                    <span style={{ color: 'var(--gold)' }}>{r.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-6">
            <CosmicAudioEngine />
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-cosmic-terminal'))}
              className="hidden h-9 items-center gap-1.5 rounded-full border border-line bg-ink/60 px-3 font-mono text-[11px] text-paper/80 transition-colors hover:border-gold hover:text-gold sm:flex cursor-pointer"
              title="Kozmik kumanda terminali (⌘K / Ctrl+K)"
              aria-label="Kozmik kumanda terminalini aç"
            >
              <Terminal size={12} className="text-gold" />
              <span>⌘K</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] py-1.5 pl-3.5 pr-2 text-paper backdrop-blur-md transition-all hover:border-gold/40 hover:bg-gold/10 hover:text-gold cursor-pointer"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
            >
              <span className="font-mono text-xs font-medium">Menü</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.08] transition-colors group-hover:bg-gold/20">
                <span className="flex flex-col gap-[3px]">
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-gold" />
                  <span className="block h-px w-3 bg-paper transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:bg-gold" />
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px]">
          <div ref={progress} className="h-full origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
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
  const returnFocus = useRef<HTMLElement | null>(null);
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
      returnFocus.current = document.activeElement as HTMLElement | null;
      document.documentElement.style.overflow = 'hidden';
      root.current!.style.visibility = 'visible';
      if (prefersReducedMotion()) t.progress(1);
      else t.timeScale(1).play();
      closeBtn.current?.focus({ preventScroll: true });
    } else {
      document.documentElement.style.overflow = '';
      // Hand focus back to whatever opened the menu (the toggle button)
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Keep Tab cycling inside the open dialog
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
