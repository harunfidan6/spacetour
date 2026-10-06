'use client';

import { useId } from 'react';
import { LOGO_BANDS, LOGO_TILT } from '@/lib/logoSvg';

// Ay, halkadan daha eğik bir düzlemde döner: bir yanda halkanın üstüne, öbür yanda altına geçer
const MOON_TILT = 'rotate(-30 200 200)';
const MOON_ORBIT = 'M390 200 A190 30 0 1 1 10 200 A190 30 0 1 1 390 200';
const RINGS = [
  { rx: 126, ry: 27, w: 4, o: 0.35 },
  { rx: 146, ry: 32, w: 16, o: 1 },
  { rx: 168, ry: 37, w: 9, o: 0.85 },
  { rx: 181, ry: 40, w: 2, o: 0.5 },
];

/**
 * Menüdeki hareketli logo: onaylanan büyük logonun (src/lib/logoSvg.ts) yakın kadrajı.
 * Canlılık: gezegen üzerinde kayan fırtına lekesi (kendi ekseninde dönüş), halkada dolaşan
 * parıltı, nefes alan ışıma, yanıp sönen yıldız ve halkanın arkasından/önünden geçen ay.
 * Hareket azaltma tercihinde hepsi durur (globals.css: .logo-*).
 */
export function LogoMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const u = (name: string) => `url(#${id}${name})`;
  const tilt = `rotate(${LOGO_TILT} 200 200)`;

  const ring = (half: 'back' | 'front') => (
    <g transform={tilt}>
      <g clipPath={u(half)}>
        {RINGS.map((r) => (
          <ellipse key={r.rx} cx="200" cy="200" rx={r.rx} ry={r.ry} fill="none" stroke={u('ring')} strokeWidth={r.w} opacity={r.o} />
        ))}
        {/* Cassini aralığı */}
        <ellipse cx="200" cy="200" rx="157" ry="34.5" fill="none" stroke="#050508" strokeWidth="3" opacity=".6" />
        <ellipse cx="200" cy="200" rx="146" ry="32" pathLength={100} fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" className="logo-glint" />
      </g>
    </g>
  );
  const moon = (half: 'back' | 'front') => (
    <g transform={MOON_TILT} className="logo-moon-anim">
      <g clipPath={u(half)}>
        <g>
          <circle r="17" fill="#38bdf8" opacity=".3" />
          <circle r="11" fill="#e0f2fe" />
          <animateMotion dur="14s" repeatCount="indefinite" path={MOON_ORBIT} />
        </g>
      </g>
    </g>
  );

  return (
    <svg viewBox="4 98 392 204" className={`overflow-visible ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${id}pl`} cx=".34" cy=".3" r=".78">
          <stop offset="0" stopColor="#fff4cc" />
          <stop offset=".22" stopColor="#fbbf24" />
          <stop offset=".55" stopColor="#ea580c" />
          <stop offset=".85" stopColor="#7c2d12" />
          <stop offset="1" stopColor="#2a0e05" />
        </radialGradient>
        <radialGradient id={`${id}halo`}>
          <stop offset=".55" stopColor="#f59e0b" stopOpacity=".55" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}shade`} x1=".2" y1=".15" x2=".85" y2=".95">
          <stop offset=".45" stopColor="#050508" stopOpacity="0" />
          <stop offset="1" stopColor="#050508" stopOpacity=".75" />
        </linearGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff4cc" stopOpacity=".95" />
          <stop offset=".4" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}ring`} x1="0" x2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity=".45" />
          <stop offset=".35" stopColor="#bae6fd" />
          <stop offset=".55" stopColor="#ffffff" />
          <stop offset=".8" stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#818cf8" stopOpacity=".6" />
        </linearGradient>
        <clipPath id={`${id}back`}><rect x="-200" y="-200" width="800" height="400" /></clipPath>
        <clipPath id={`${id}front`}><rect x="-200" y="200" width="800" height="400" /></clipPath>
        <clipPath id={`${id}disc`}><circle cx="200" cy="200" r="92" /></clipPath>
      </defs>

      <circle cx="200" cy="200" r="122" fill={u('halo')} className="logo-halo" />
      {moon('back')}
      {ring('back')}

      <circle cx="200" cy="200" r="92" fill={u('pl')} />
      <g clipPath={u('disc')}>
        <g transform={tilt}>
          {LOGO_BANDS.map(([dy, w, c, o]) => (
            <ellipse key={dy} cx="200" cy={200 + dy} rx="150" ry={18 + Math.abs(dy) * 0.1} fill="none" stroke={c} strokeWidth={w} opacity={o} />
          ))}
          {/* Fırtına lekesi: diskin önünden geçip arkaya saklanır */}
          <g className="logo-spot-move">
            <g className="logo-spot-fade">
              <ellipse cx="200" cy="222" rx="17" ry="8" fill="#7c2d12" />
              <ellipse cx="200" cy="221" rx="10" ry="4.5" fill="#fdba74" opacity=".8" />
            </g>
          </g>
        </g>
        <circle cx="200" cy="200" r="92" fill={u('shade')} />
      </g>
      <circle cx="200" cy="200" r="91" fill="none" stroke={u('rim')} strokeWidth="3" />

      {ring('front')}
      {moon('front')}
      <path className="logo-twinkle" d="M44 106 Q46.6 117.4 58 120 Q46.6 122.6 44 134 Q41.4 122.6 30 120 Q41.4 117.4 44 106Z" fill="#ffffff" />
      {/* Hareket azaltılınca: sabit ay */}
      <g transform={MOON_TILT} className="logo-moon-static">
        <circle cx="357" cy="183" r="17" fill="#38bdf8" opacity=".3" />
        <circle cx="357" cy="183" r="11" fill="#e0f2fe" />
      </g>
    </svg>
  );
}
