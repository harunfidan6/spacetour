'use client';

import React, { useEffect, useRef, useState } from 'react';

export function CinematicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if target is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, select, textarea, [role="button"], .cinematic-interactive');
        setIsHovering(!!interactive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      // Smooth interpolation for outer reticle ring
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* 1. Precise Center Dot */}
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#f5c542] will-change-transform"
        aria-hidden
      />

      {/* 2. Outer Kinetic HUD Reticle */}
      <div
        ref={ringRef}
        className={`absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 will-change-transform ${
          isHovering
            ? 'scale-125 border-gold bg-gold/10 shadow-[0_0_16px_rgba(245,197,66,0.3)]'
            : 'border-white/30 bg-transparent'
        }`}
        aria-hidden
      >
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Viewfinder crosshairs */}
            <span className="absolute -left-1 h-0.5 w-1 bg-gold" />
            <span className="absolute -right-1 h-0.5 w-1 bg-gold" />
            <span className="absolute -top-1 h-1 w-0.5 bg-gold" />
            <span className="absolute -bottom-1 h-1 w-0.5 bg-gold" />
          </div>
        )}
      </div>
    </div>
  );
}
