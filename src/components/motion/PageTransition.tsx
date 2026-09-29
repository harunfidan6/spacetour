'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion, setCurtain } from './gsap';
import { routeFor } from '@/lib/routes';

type TransitionApi = { navigate: (href: string) => void };
const TransitionContext = createContext<TransitionApi>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Curtain wipe between routes. Every same-origin <a> click is intercepted,
 * the curtain covers the viewport, the route changes underneath, then the
 * curtain lifts once the new pathname has committed.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    if (failsafe.current) clearTimeout(failsafe.current);
    const layers = Array.from(panels.current?.children ?? []).reverse();
    gsap
      .timeline({
        delay: 0.12,
        onComplete: () => {
          busy.current = false;
          gsap.set(overlay.current, { visibility: 'hidden' });
          ScrollTrigger.refresh();
        },
      })
      .to(title.current, { yPercent: -110, duration: 0.45, ease: 'mg.inOut' })
      .to(layers, { yPercent: -100, duration: 0.8, stagger: 0.08, ease: 'mg.inOut' }, '<0.1')
      .call(() => setCurtain(false), [], '<0.35');
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (busy.current) return;
      if (prefersReducedMotion()) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }
      busy.current = true;
      setCurtain(true);
      const route = routeFor(url.pathname);
      if (title.current) title.current.textContent = route.label;
      if (index.current) index.current.textContent = `(${route.index}) — ${route.blurb}`;
      const layers = panels.current?.children;
      if (layers?.[0]) gsap.set(layers[0], { background: route.accent });

      gsap
        .timeline({
          onComplete: () => {
            router.push(url.pathname + url.search + url.hash);
            failsafe.current = setTimeout(reveal, 4000);
          },
        })
        .set(overlay.current, { visibility: 'visible' })
        .fromTo(layers ?? [], { yPercent: 100 }, { yPercent: 0, duration: 0.75, stagger: 0.08, ease: 'mg.inOut' })
        .fromTo(title.current, { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: 'mg.out' }, '-=0.35');
    },
    [router, reveal]
  );

  // Lift the curtain when the new route has committed.
  useEffect(() => {
    if (busy.current) reveal();
  }, [pathname, reveal]);

  // Intercept internal link clicks (Next <Link> bails out when defaultPrevented).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.getAttribute('href')) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: hash / search handled natively
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlay} aria-hidden className="pointer-events-none fixed inset-0 z-[240]" style={{ visibility: 'hidden' }}>
        <div ref={panels} className="absolute inset-0">
          <div className="absolute inset-0 bg-solar" style={{ transform: 'translateY(100%)' }} />
          <div className="absolute inset-0 bg-ink-3" style={{ transform: 'translateY(100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-end bg-ink p-[var(--gutter)]" style={{ transform: 'translateY(100%)' }}>
            <span ref={index} className="label mb-4 text-muted" />
            <div className="overflow-hidden pb-[0.06em] pt-[0.2em]">
              <div ref={title} className="display text-[clamp(3rem,11vw,11rem)] text-paper" />
            </div>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
