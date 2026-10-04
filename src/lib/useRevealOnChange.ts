'use client';

import { useEffect, useRef } from 'react';

/**
 * For "pick a tile, read the detail" tools: attach the returned ref to the tile grid.
 * When `key` changes (the user picked something) and the panel after the grid is
 * mostly below the fold, the page scrolls so the detail comes into view, keeping the
 * last row of tiles visible above it.
 */
export function useRevealOnChange<T extends HTMLElement = HTMLDivElement>(key: unknown) {
  const ref = useRef<T>(null);
  const prev = useRef(key);
  useEffect(() => {
    if (Object.is(prev.current, key)) return;
    prev.current = key;
    // the detail panel follows the grid, or follows the grid's wrapper
    const grid = ref.current;
    const next = (grid?.nextElementSibling ?? grid?.parentElement?.nextElementSibling) as HTMLElement | null;
    if (!next) return;
    const top = next.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.7) return; // already on screen
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top + window.scrollY - Math.min(150, window.innerHeight * 0.2), behavior: reduced ? 'auto' : 'smooth' });
  }, [key]);
  return ref;
}
