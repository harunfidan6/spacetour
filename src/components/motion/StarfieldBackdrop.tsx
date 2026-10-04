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
      const count = Math.round(Math.min(420, (w * h) / (coarse ? 5200 : 4200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() ** 2,
        r: Math.random() * 1.1 + 0.25,
        tw: Math.random() * Math.PI * 2,
        hue: Math.floor(Math.random() * HUES.length),
      }));
    };

    // Phones: lower resolution and half frame rate; the layer is soft background texture
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const resize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      // Mobile browser bars change the height while scrolling: keep the stars where they are
      const reseed = !stars.length || nw !== w || Math.abs(nh - h) > 160;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      w = nw;
      h = nh;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reseed) seed();
    };

    let lastScroll = 0;
    let scrollVel = 0;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const scroll = window.scrollY;
      scrollVel = (scroll - lastScroll) * 0.2;
      lastScroll = scroll;

      // 1. Cinematic Volumetric Cosmic Nebula Layer
      if (!reduced) {
        const nebula1X = w * 0.25 + Math.sin(t * 0.0004) * 50 - pointer.x * 30;
        const nebula1Y = h * 0.35 + Math.cos(t * 0.0003) * 40 - pointer.y * 30;
        const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, w * 0.55);
        grad1.addColorStop(0, 'rgba(129, 140, 248, 0.045)');
        grad1.addColorStop(0.5, 'rgba(99, 102, 241, 0.02)');
        grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, w, h);

        const nebula2X = w * 0.75 + Math.cos(t * 0.0005) * 60 - pointer.x * 40;
        const nebula2Y = h * 0.65 + Math.sin(t * 0.0004) * 50 - pointer.y * 40;
        const grad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 10, nebula2X, nebula2Y, w * 0.6);
        grad2.addColorStop(0, 'rgba(245, 197, 66, 0.035)');
        grad2.addColorStop(0.5, 'rgba(244, 63, 94, 0.015)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Stars with twinkle, parallax and scroll motion blur
      const isWarping = Math.abs(scrollVel) > 2;

      for (const s of stars) {
        const depth = 0.15 + s.z * 0.85;
        let y = (s.y - scroll * depth * 0.18 - pointer.y * depth * 14) % h;
        if (y < 0) y += h;
        const x = s.x - pointer.x * depth * 18;
        const twinkle = reduced ? 1 : 0.55 + Math.sin(t * 0.0012 + s.tw) * 0.45;
        const alpha = (0.2 + depth * 0.75) * twinkle;
        ctx.fillStyle = `rgba(${HUES[s.hue]},${alpha.toFixed(3)})`;
        const size = s.r * (0.6 + depth);

        if (isWarping && !reduced) {
          ctx.fillRect(x, y, size, size + Math.min(Math.abs(scrollVel) * depth, 8));
        } else {
          ctx.fillRect(x, y, size, size);
        }
      }

      // 3. Shooting star meteors
      if (!reduced) {
        if (Math.random() < 0.006 && streaks.length < 3) {
          streaks.push({ x: Math.random() * w, y: Math.random() * h * 0.6, vx: -(8 + Math.random() * 8), vy: 4 + Math.random() * 4, life: 1 });
        }
        for (let i = streaks.length - 1; i >= 0; i--) {
          const s = streaks[i];
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 16, s.y - s.vy * 16);
          grad.addColorStop(0, `rgba(245, 197, 66, ${s.life})`);
          grad.addColorStop(0.3, `rgba(255, 255, 255, ${s.life * 0.8})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 16, s.y - s.vy * 16);
          ctx.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.015;
          if (s.life <= 0) streaks.splice(i, 1);
        }
      }
    };

    let frame = 0;
    const loop = (t: number) => {
      if (running && (!coarse || frame++ % 2 === 0)) draw(t);
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
