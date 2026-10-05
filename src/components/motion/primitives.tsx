'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from './gsap';

/* --------------------------------------------------------------------------
   RotatingBadge — circular type set on a path, slowly spinning
   -------------------------------------------------------------------------- */
export function RotatingBadge({
  text,
  size = 132,
  className = '',
  children,
  reverse = false,
}: {
  text: string;
  size?: number;
  className?: string;
  children?: ReactNode;
  reverse?: boolean;
}) {
  const pathId = `badge-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${reverse ? 'spin-rev' : 'spin-slow'}`} aria-hidden>
        <defs>
          <path id={pathId} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text fill="currentColor" style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          <textPath href={`#${pathId}`} textLength={500} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Magnetic — element leans toward the pointer
   -------------------------------------------------------------------------- */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Scramble — decodes to `text` on view, and re-decodes whenever it changes
   -------------------------------------------------------------------------- */
export function Scramble({
  text,
  className,
  chars = '01▚▞▙▟/<>#*+',
  duration = 0.9,
  onView = true,
}: {
  text: string;
  className?: string;
  chars?: string;
  duration?: number;
  onView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // React renders the first value only; GSAP owns later updates.
  const [initial] = useState(text);
  const seen = useRef(!onView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = text;
      return;
    }
    const run = () => gsap.to(el, { duration, ease: 'none', scrambleText: { text, chars, speed: 0.7, revealDelay: 0.15 } });
    if (seen.current) {
      const tw = run();
      return () => {
        tw.kill();
      };
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        seen.current = true;
        run();
      },
    });
    return () => st.kill();
  }, [text, chars, duration]);

  return (
    <>
      <span ref={ref} className={className} aria-hidden>
        {initial}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

/* --------------------------------------------------------------------------
   Counter — counts up when scrolled into view (SSR renders final value)
   -------------------------------------------------------------------------- */
const trNumber = (decimals: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export function Counter({
  to,
  from = 0,
  decimals = 0,
  duration = 2.2,
  prefix = '',
  suffix = '',
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = trNumber(decimals);

  useGsap(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const state = { v: from };
    const render = () => (el.textContent = `${prefix}${fmt.format(state.v)}${suffix}`);
    render();
    gsap.to(state, {
      v: to,
      duration,
      ease: 'mg.inOut',
      onUpdate: render,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  }, [to, from, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${fmt.format(to)}${suffix}`}
    </span>
  );
}

/* --------------------------------------------------------------------------
   Reveal — staggered entrance for blocks / children
   -------------------------------------------------------------------------- */
export function Reveal({
  as = 'div',
  children,
  className,
  style,
  y = 48,
  delay = 0,
  stagger = 0.08,
  /** CSS selector for children to stagger; defaults to the element itself. */
  items,
  mode = 'rise',
  start = 'top 88%',
  id,
}: {
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'section' | 'ul' | 'ol' | 'li' | 'dl' | 'header';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  y?: number;
  delay?: number;
  stagger?: number;
  items?: string;
  mode?: 'rise' | 'clip' | 'scale';
  start?: string;
  id?: string;
}) {
  const Tag = as as 'div';
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = items ? el.querySelectorAll(items) : [el];
      if (!targets.length) return;
      const from: gsap.TweenVars =
        mode === 'clip'
          ? { clipPath: 'inset(100% 0% 0% 0%)', y: y / 2 }
          : mode === 'scale'
            ? { scale: 0.86, autoAlpha: 0, y: y / 2 }
            : { y, autoAlpha: 0 };
      const to: gsap.TweenVars =
        mode === 'clip' ? { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { y: 0, scale: 1, autoAlpha: 1 };
      gsap.fromTo(targets, from, {
        ...to,
        duration: 1.1,
        delay,
        stagger,
        ease: 'mg.out',
        clearProps: mode === 'clip' ? 'clipPath,transform' : 'transform',
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    [items, mode],
    ref
  );

  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}

/* --------------------------------------------------------------------------
   Ticks — viewfinder corner marks (parent needs the `ticks` class)
   -------------------------------------------------------------------------- */
export function Ticks() {
  return (
    <>
      <span aria-hidden className="tick tick-tl" />
      <span aria-hidden className="tick tick-tr" />
      <span aria-hidden className="tick tick-bl" />
      <span aria-hidden className="tick tick-br" />
    </>
  );
}

/* --------------------------------------------------------------------------
   LiveClock — ticking local time, rendered client-side only
   -------------------------------------------------------------------------- */
export function LiveClock({ className, withSeconds = true }: { className?: string; withSeconds?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const text = now
    ? now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        ...(withSeconds ? { second: '2-digit' } : {}),
      })
    : withSeconds
      ? '--:--:--'
      : '--:--';
  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
