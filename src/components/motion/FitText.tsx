'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Full-bleed type: scales a single line so it spans its container's width.
 * `fallback` is the SSR font-size used before measurement.
 */
export function FitText({
  children,
  className = '',
  max = 360,
  min = 28,
  fallback = '12vw',
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  min?: number;
  fallback?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={outer} className={className}>
      <span ref={inner} className="inline-block whitespace-nowrap" style={{ fontSize: fallback }}>
        {children}
      </span>
    </div>
  );
}
