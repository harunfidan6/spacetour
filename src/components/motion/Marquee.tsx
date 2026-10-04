'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from './gsap';

type MarqueeProps = {
  children: ReactNode;
  /** Pixels per second at rest. */
  speed?: number;
  reverse?: boolean;
  /** Copies of `children` inside each half of the loop — raise for short content. */
  repeat?: number;
  className?: string;
  trackClassName?: string;
  /** Speeds up with scroll velocity. */
  reactive?: boolean;
};

export function Marquee({
  children,
  speed = 60,
  reverse = false,
  repeat = 4,
  className = '',
  trackClassName = '',
  reactive = true,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    const distance = el.scrollWidth / 2;
    const tween = gsap.fromTo(
      el,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, ease: 'none', duration: Math.max(distance / speed, 8), repeat: -1 }
    );

    // Pause off-screen
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()),
    });

    if (reactive) {
      const settle = gsap.quickTo(tween, 'timeScale', { duration: 0.9, ease: 'power3.out' });
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
          tween.timeScale(boost);
          settle(1);
        },
      });
    }
  }, [speed, reverse, reactive]);

  const half = (
    <div className={`flex shrink-0 items-center ${trackClassName}`}>
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className="flex shrink-0 items-center">
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`w-full max-w-full overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {half}
        <div aria-hidden className="flex shrink-0">
          {half}
        </div>
      </div>
    </div>
  );
}
