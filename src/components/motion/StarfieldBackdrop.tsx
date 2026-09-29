'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './gsap';

type Star = { x: number; y: number; z: number; r: number; tw: number; hue: number };
type Streak = { x: number; y: number; vx: number; vy: number; life: number };

const HUES = ['239,236,230', '239,236,230', '239,236,230', '255,91,34', '122,92,255', '212,255,61'];

/**
 * Lightweight 2D star layer shared by every page: depth-parallax on scroll
 * and pointer, gentle twinkle, and the occasional shooting star.
 */
export function StarfieldBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;

    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const streaks: Streak[] = [];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = true;

    const seed = () => {
      const count = Math.round(Math.min(420, (w * h) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() ** 2,
        r: Math.random() * 1.1 + 0.25,
        tw: Math.random() * Math.PI * 2,
        hue: Math.floor(Math.random() * HUES.length),
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const scroll = window.scrollY;

      for (const s of stars) {
        const depth = 0.15 + s.z * 0.85;
        let y = (s.y - scroll * depth * 0.18 - pointer.y * depth * 14) % h;
        if (y < 0) y += h;
        const x = s.x - pointer.x * depth * 18;
        const twinkle = reduced ? 1 : 0.55 + Math.sin(t * 0.0012 + s.tw) * 0.45;
        const alpha = (0.18 + depth * 0.7) * twinkle;
        ctx.fillStyle = `rgba(${HUES[s.hue]},${alpha.toFixed(3)})`;
        const size = s.r * (0.6 + depth);
        ctx.fillRect(x, y, size, size);
      }

      if (!reduced) {
        if (Math.random() < 0.004 && streaks.length < 2) {
          streaks.push({ x: Math.random() * w, y: Math.random() * h * 0.5, vx: -(6 + Math.random() * 6), vy: 3 + Math.random() * 3, life: 1 });
        }
        for (let i = streaks.length - 1; i >= 0; i--) {
          const s = streaks[i];
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
          grad.addColorStop(0, `rgba(239,236,230,${s.life})`);
          grad.addColorStop(1, 'rgba(239,236,230,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
          ctx.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.012;
          if (s.life <= 0) streaks.splice(i, 1);
        }
      }
    };

    const loop = (t: number) => {
      if (running) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / w - 0.5;
      pointer.ty = e.clientY / h - 0.5;
    };
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
    };

    resize();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvas} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--ink)_78%)] opacity-70" />
    </div>
  );
}
