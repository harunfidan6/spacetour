'use client';

import { useId } from 'react';
import { LOGO_MOON_TILT, LOGO_TILT } from '@/lib/logoSvg';

// Ayın yörüngesi (64'lük görünümde, eğik düzlemde elips): sağdan başlayıp önden geçer
const ORBIT = 'M60 32 A28 10 0 1 1 4 32 A28 10 0 1 1 60 32';

/**
 * Menüdeki hareketli logo: halkalı gezegen, çevresinde dönen ay. Ay arka yarıda gezegenin
 * ve halkanın arkasından, ön yarıda önünden geçer (iki kopya, yarım düzlemlere kırpılmış).
 * Hareketi azaltma tercihinde ay sabit durur (globals.css: .logo-moon-*).
 */
export function LogoMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const moon = (half: 'back' | 'front') => (
    <g transform={`rotate(${LOGO_MOON_TILT} 32 32)`} className="logo-moon-anim">
      <g clipPath={`url(#${id}${half})`}>
        <circle r="3.6" fill="#38bdf8">
          <animateMotion dur="9s" repeatCount="indefinite" path={ORBIT} />
        </circle>
      </g>
    </g>
  );
  const ring = (half: 'back' | 'front') => (
    <g transform={`rotate(${LOGO_TILT} 32 32)`}>
      <ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke={`url(#${id}ring)`} strokeWidth="4" clipPath={`url(#${id}${half})`} />
    </g>
  );
  return (
    <svg viewBox="0 0 64 64" className={`overflow-visible ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${id}pl`} cx=".34" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff4cc" />
          <stop offset=".3" stopColor="#fbbf24" />
          <stop offset=".7" stopColor="#ea580c" />
          <stop offset="1" stopColor="#7c2d12" />
        </radialGradient>
        <linearGradient id={`${id}ring`} x1="0" x2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset=".55" stopColor="#ffffff" />
          <stop offset="1" stopColor="#a5b4fc" />
        </linearGradient>
        <clipPath id={`${id}back`}><rect x="-40" y="-40" width="144" height="72" /></clipPath>
        <clipPath id={`${id}front`}><rect x="-40" y="32" width="144" height="72" /></clipPath>
      </defs>
      {moon('back')}
      {ring('back')}
      <circle cx="32" cy="32" r="15.5" fill={`url(#${id}pl)`} />
      {ring('front')}
      {moon('front')}
      <circle cx="52" cy="13" r="3.6" fill="#38bdf8" className="logo-moon-static" />
    </svg>
  );
}
