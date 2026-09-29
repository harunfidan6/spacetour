'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

const INTERACTIVE = 'a, button, [role="button"], label, summary, select, input[type="range"], [data-cursor]';

/**
 * Two-part cursor: an exact dot plus a lagging ring. Elements can set
 * `data-cursor="LABEL"` to morph the ring into a labelled disc.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const r = ring.current!;
    const d = dot.current!;
    const l = label.current!;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    gsap.set([r, d], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const rx = gsap.quickTo(r, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.45, ease: 'power3.out' });
    const dx = gsap.quickSetter(d, 'x', 'px');
    const dy = gsap.quickSetter(d, 'y', 'px');
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        gsap.set([r], { x: e.clientX, y: e.clientY });
        gsap.to([r, d], { autoAlpha: 1, duration: 0.3 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest?.('[data-cursor]') as HTMLElement | null;
      const interactive = target?.closest?.(INTERACTIVE);
      const text = labelled?.dataset.cursor ?? '';
      l.textContent = text;
      r.dataset.state = text ? 'label' : interactive ? 'hover' : 'idle';
    };

    const leaveWindow = () => {
      visible = false;
      gsap.to([r, d], { autoAlpha: 0, duration: 0.2 });
    };
    const down = () => gsap.to(r, { scale: 0.7, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerleave', leaveWindow);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leaveWindow);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        data-state="idle"
        className="fixed left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-paper/70 opacity-0 mix-blend-difference transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] data-[state=hover]:h-16 data-[state=hover]:w-16 data-[state=hover]:border-paper data-[state=label]:h-24 data-[state=label]:w-24 data-[state=label]:border-transparent data-[state=label]:bg-paper data-[state=label]:mix-blend-normal"
      >
        <span ref={label} className="label text-[10px] font-bold text-ink" />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper opacity-0 mix-blend-difference" />
    </div>
  );
}
