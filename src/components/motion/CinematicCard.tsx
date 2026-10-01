'use client';

import React, { useRef, useState, useCallback, type MouseEvent, type ReactNode } from 'react';

interface CinematicCardProps {
  children: ReactNode;
  accent?: string;
  className?: string;
  onClick?: () => void;
  showLaserBorder?: boolean;
}

export function CinematicCard({
  children,
  accent = '#f5c542',
  className = '',
  onClick,
  showLaserBorder = true,
}: CinematicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Subtle 3D tilt: max 7 degrees
    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 6;

    setCoords({ x: percentX, y: percentY });
    setRotate({ x: rotX, y: rotY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setCoords({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-2/90 backdrop-blur-xl transition-shadow duration-500 will-change-transform ${
        isHovered ? 'shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-white/20' : 'shadow-lg'
      } ${className}`}
    >
      {/* 1. Dynamic Cursor-following Specular Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `radial-gradient(600px circle at ${coords.x}% ${coords.y}%, ${accent}, transparent 55%)`,
        }}
        aria-hidden
      />

      {/* 2. Holographic Rim Lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.18 : 0.05,
          background: `radial-gradient(circle at 100% 0%, ${accent}, transparent 60%)`,
        }}
        aria-hidden
      />

      {/* 3. Subtle Holographic Scanline Overlay on Hover */}
      <div
        className="scanline-overlay pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      {/* 4. Animated Laser Border Highlight */}
      {showLaserBorder && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent}40, 0 0 20px ${accent}25`,
          }}
          aria-hidden
        />
      )}

      {/* 5. Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
