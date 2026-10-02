'use client';

import { useState } from 'react';
import { ZODIAC_SIGNS, type ZodiacSign } from '@/data/zodiac';
import { Ticks } from '@/components/motion/primitives';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';

function compatibilityScore(a: ZodiacSign, b: ZodiacSign) {
  if (a.loveCompatibility.includes(b.id)) return 94;
  if (a.element === b.element) return 88;
  const pair = new Set([a.element, b.element]);
  if (pair.has('Ateş') && pair.has('Hava')) return 91;
  if (pair.has('Toprak') && pair.has('Su')) return 93;
  return 74;
}

const RING = 2 * Math.PI * 88;

/** Two signs in, one attraction score out: element synergy and the classic compatibility tables. */
export function ZodiacCompatibility() {
  const [signA, setSignA] = useState('koc');
  const [signB, setSignB] = useState('aslan');
  const a = ZODIAC_SIGNS.find((s) => s.id === signA) ?? ZODIAC_SIGNS[0];
  const b = ZODIAC_SIGNS.find((s) => s.id === signB) ?? ZODIAC_SIGNS[4];
  const score = compatibilityScore(a, b);

  return (
    <div className="ticks relative grid items-center gap-8 border border-line bg-ink-2 p-6 sm:p-10 lg:grid-cols-12">
      <Ticks />
      {[
        { value: signA, set: setSignA, sign: a, label: '1. burç' },
        { value: signB, set: setSignB, sign: b, label: '2. burç' },
      ].map((side, i) => (
        <label key={side.label} className={`flex flex-col items-center text-center lg:col-span-4 ${i === 1 ? 'lg:order-3' : ''}`}>
          <span className="label text-muted">{side.label}</span>
          <div className="mt-4 flex h-24 items-center justify-center">
            <ZodiacGlyph sign={side.sign.id} size={80} className="text-gold" />
          </div>
          <div className="relative mt-4 w-full max-w-[16rem]">
            <select
              value={side.value}
              onChange={(e) => side.set(e.target.value)}
              className="display display-tight w-full cursor-pointer appearance-none border-b-2 border-line bg-transparent py-2 pl-3 pr-8 text-center text-2xl sm:text-3xl text-paper transition-colors focus:border-gold focus:outline-none"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.id} value={s.id} className="bg-ink font-sans text-base normal-case">
                  {s.name} ({s.latinName})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gold/70">▼</span>
          </div>
          <span className="label mt-3 text-muted">
            {side.sign.element} · {side.sign.modality}
          </span>
        </label>
      ))}
      <div className="relative mx-auto grid aspect-square w-full max-w-[240px] place-items-center lg:order-2 lg:col-span-4">
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle r="88" fill="none" stroke="var(--line)" strokeWidth="6" />
          <circle
            r="88"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - score / 100)}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.76,0,.24,1)' }}
          />
        </svg>
        <div className="text-center" aria-live="polite">
          <div className="label text-muted">Uyum skoru</div>
          <div className="display display-tight mt-2 text-6xl text-paper">%{score}</div>
          <div className="label mt-2 text-gold">{score >= 90 ? 'Kozmik çekim' : score >= 80 ? 'Güçlü ahenk' : 'Öğretici gerilim'}</div>
        </div>
      </div>
    </div>
  );
}
