'use client';

import { useEffect } from 'react';
import { gsap } from '@/components/motion/gsap';
import { isFilm, type FilmApi } from '@/lib/film';

/** Installs `window.__film` when the site runs in film mode (see src/lib/film.ts). Renders nothing. */
export function FilmMode() {
  useEffect(() => {
    if (!isFilm()) return;
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const scroll = { y: 0 };
    const api: FilmApi = {
      hazir() {
        if (document.readyState !== 'complete' || document.fonts.status !== 'loaded') return false;
        let done = true;
        for (const img of Array.from(document.images)) {
          if (img.loading === 'lazy') img.loading = 'eager';
          if (!img.complete) done = false;
        }
        return done;
      },
      kaydir(hedef, sure = 1, ofset = 0) {
        let y = Number(hedef) - ofset;
        if (typeof hedef === 'string') {
          const el = document.querySelector(hedef);
          if (!el) return;
          y = el.getBoundingClientRect().top + window.scrollY - ofset;
        }
        gsap.killTweensOf(scroll);
        if (sure <= 0) {
          window.scrollTo(0, y);
          return;
        }
        scroll.y = window.scrollY;
        gsap.to(scroll, { y, duration: sure, ease: 'power2.inOut', onUpdate: () => window.scrollTo(0, scroll.y) });
      },
      tikla(secici, sira = 0) {
        document.querySelectorAll<HTMLElement>(secici)[sira]?.click();
      },
      deger(secici, deger) {
        const el = document.querySelector<HTMLInputElement>(secici);
        if (!el) return;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, String(deger));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },
      eylemler: { ...window.__filmPending },
    };
    window.__film = api;
    return () => {
      delete window.__film;
    };
  }, []);

  return null;
}
