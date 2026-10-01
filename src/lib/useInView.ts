'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * True while the element is on (or near) screen. Render loops use it to stop
 * burning GPU/CPU once their lab is scrolled out of view.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = '200px'): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
