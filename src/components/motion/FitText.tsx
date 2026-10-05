'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Full-bleed type: scales a single line so it spans its container's width.
 * `fallback` is the SSR font-size used before measurement. `heading` renders the line as the page's <h1>.
 */
export function FitText({
  children,
  className = '',
  max = 360,
  min = 28,
  fallback = '12vw',
  heading = false,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  min?: number;
  fallback?: string;
  heading?: boolean;
}) {
  const outer = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    let lastWidth = -1;
    const fit = () => {
      if (o.clientWidth === lastWidth) return;
      lastWidth = o.clientWidth;
      i.style.fontSize = '100px';
      const natural = i.scrollWidth;
      if (!natural) return;
      const size = Math.max(min, Math.min(max, (o.clientWidth / natural) * 100 * 0.995));
      i.style.fontSize = `${size}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    document.fonts?.ready
      .then(() => {
        lastWidth = -1;
        fit();
      })
      .catch(() => {});
    return () => ro.disconnect();
  }, [min, max]);

  const line = (
    <span ref={inner} className="inline-block whitespace-nowrap" style={{ fontSize: fallback }}>
      {children}
    </span>
  );
  return heading ? (
    <h1 ref={outer as RefObject<HTMLHeadingElement>} className={className}>{line}</h1>
  ) : (
    <div ref={outer as RefObject<HTMLDivElement>} className={className}>{line}</div>
  );
}
