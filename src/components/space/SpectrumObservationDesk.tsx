'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { DEEP_SKY_TARGETS, type DeepSkyTarget, type WavelengthMode } from '@/data/deepSky';
import type { AstroImage } from '@/data/astroImages';
import { Scramble, Ticks } from '@/components/motion/primitives';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';

/* Long → short wavelength, left to right, like a real EM spectrum chart. */
export const SPECTRUM_BANDS: { id: WavelengthMode; label: string; band: string; desc: string; stop: number }[] = [
  { id: 'radio', label: 'Radyo', band: '1 cm – 1 m', desc: 'Soğuk gaz & pulsar atımları', stop: 12.5 },
  { id: 'infrared', label: 'Kızılötesi', band: '1 – 30 µm', desc: 'Tozun ardı & yıldız doğumu', stop: 37.5 },
  { id: 'optical', label: 'Görünür', band: '400 – 700 nm', desc: 'İnsan gözünün penceresi', stop: 62.5 },
  { id: 'xray', label: 'X-ışını', band: '0.1 – 10 nm', desc: 'Aşırı enerji & kara delikler', stop: 87.5 },
];

const WAVE_PATH = Array.from({ length: 200 }, (_, i) => {
  const x = i * 2;
  const freq = 0.02 + (x / 400) ** 2 * 0.9;
  const y = 28 + Math.sin(x * freq * 6) * 16;
  return `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`;
}).join(' ');

/** One object, four eyes: pick a target, slide across the spectrum, compare what each band reveals. */
export function SpectrumObservationDesk() {
  const [target, setTarget] = useState<DeepSkyTarget>(DEEP_SKY_TARGETS[0]);
  const [mode, setMode] = useState<WavelengthMode>('infrared');
  const [previous, setPrevious] = useState<AstroImage | null>(null);
  const viewport = useRef<HTMLDivElement>(null);

  const view = target.views[mode];
  const band = SPECTRUM_BANDS.find((b) => b.id === mode)!;

  const change = (nextTarget: DeepSkyTarget, nextMode: WavelengthMode) => {
    if (nextTarget.id === target.id && nextMode === mode) return;
    setPrevious(view.image);
    setTarget(nextTarget);
    setMode(nextMode);
  };

  // Wipe the new exposure over the previous one
  useGsap(
    () => {
      const el = viewport.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(el.querySelector('[data-exposure]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'mg.inOut' });
      gsap.fromTo(
        el.querySelector('[data-wipe-edge]'),
        { left: '0%', autoAlpha: 1 },
        { left: '100%', duration: 1.1, ease: 'mg.inOut', onComplete: () => void gsap.set(el.querySelector('[data-wipe-edge]'), { autoAlpha: 0 }) }
      );
    },
    [target.id, mode]
  );

  return (
    <div className="space-y-10">
      {/* Targets */}
      <div className="grid gap-4 sm:grid-cols-2">
        {DEEP_SKY_TARGETS.map((t, i) => {
          const on = t.id === target.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => change(t, mode)}
              aria-pressed={on}
              className={`group relative flex flex-col border p-6 text-left transition-all duration-300 ${
                on ? 'border-rose/60 bg-ink-2 ring-1 ring-rose/40' : 'border-white/[0.08] bg-ink-2/60 hover:border-white/20 hover:bg-ink-2'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="doc-caption">
                  Hedef {String(i + 1).padStart(2, '0')} · {t.catalog}
                </span>
                {on && <span className="doc-kicker text-[10px] text-rose">Aktif hedef</span>}
              </div>
              <span className="doc-title mt-4 text-3xl text-paper transition-colors group-hover:text-rose">{t.name}</span>
              <span className="doc-serif mt-1 text-lg text-rose/90">{t.type}</span>
            </button>
          );
        })}
      </div>

      {/* Spectrum selector */}
      <div className="border border-white/[0.08] bg-ink-2/50 p-2">
        <div className="relative h-14 overflow-hidden bg-[linear-gradient(90deg,#3b1d7a_0%,#7a5cff_18%,#ff3d7f_36%,#ff5b22_50%,#ffc53d_58%,#d4ff3d_64%,#8fd3ff_74%,#efece6_100%)]">
          <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-multiply" aria-hidden>
            <path d={WAVE_PATH} fill="none" stroke="#09090b" strokeWidth="1.5" />
          </svg>
          <span
            className="absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.8)] transition-[left] duration-700 ease-[cubic-bezier(.76,0,.24,1)]"
            style={{ left: `calc(${band.stop}% - 1.5px)` }}
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Dalgaboyu">
          {SPECTRUM_BANDS.map((b) => {
            const on = b.id === mode;
            return (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => change(target, b.id)}
                className={`border p-4 text-left transition-all ${
                  on ? 'border-rose/50 bg-rose/10 text-paper ring-1 ring-rose/30' : 'border-white/[0.06] bg-white/[0.02] text-paper/70 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <span className="doc-caption">{b.band}</span>
                <span className="doc-title mt-2 block text-2xl text-paper">{b.label}</span>
                <span className="mt-1 block text-xs text-paper/60">{b.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Observation */}
      <div className="grid gap-px overflow-hidden border border-white/[0.1] bg-white/[0.06] lg:grid-cols-12">
        <div ref={viewport} className="ticks relative min-h-[360px] overflow-hidden bg-black sm:min-h-[520px] lg:col-span-7">
          <Ticks />
          {previous && <Image src={previous.src} alt="" aria-hidden fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />}
          <div data-exposure className="absolute inset-0">
            <Image
              src={view.image.src}
              alt={`${target.name} — ${band.label} gözlemi`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 mix-blend-color" style={{ background: view.color, opacity: 0.28 }} />
          </div>
          <span data-wipe-edge aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px] bg-paper opacity-0 shadow-[0_0_24px_4px_var(--paper)]" />

          <svg viewBox="-100 -100 200 200" className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" aria-hidden>
            <g className="spin-slow">
              <circle r="70" fill="none" stroke="var(--paper)" strokeOpacity="0.6" strokeDasharray="2 6" />
            </g>
            <circle r="40" fill="none" stroke="var(--paper)" strokeOpacity="0.4" />
            <path d="M-96 0H-52M52 0H96M0 -96V-52M0 52V96" stroke="var(--paper)" strokeWidth="1.2" />
          </svg>

          <div className="absolute left-4 top-4 flex items-center gap-2 border border-white/10 bg-ink/80 px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full" style={{ background: view.color }} />
            <span className="font-mono text-xs text-paper">
              <Scramble key={mode} text={`${band.label} · ${band.band}`} onView={false} />
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-ink/80 px-4 py-2.5 backdrop-blur-md">
            <span className="doc-caption">Gözlem teleskobu</span>
            <span className="font-mono text-xs font-semibold text-paper">
              <Scramble text={view.telescope} onView={false} />
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 bg-ink-2 p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-mono text-xs font-semibold text-rose">{target.catalog}</span>
              <span className="font-mono text-xs text-muted">{target.distance}</span>
            </div>
            <h2 className="doc-title mt-6 text-4xl text-paper">{target.name}</h2>
            <p className="doc-serif mt-1 text-xl text-rose/90">{target.type}</p>
            <p className="mt-4 text-sm leading-relaxed text-paper/70">{target.description}</p>
          </div>
          <div className="border-l-2 bg-white/[0.02] p-4" style={{ borderColor: view.color }}>
            <div className="doc-kicker text-[10px] text-paper/80">Bu dalgaboyunda görülen</div>
            <p className="mt-2 text-sm leading-relaxed text-paper/90">{view.highlights}</p>
            <div className="mt-3 font-mono text-[11px] text-muted">Spektrum · {view.wavelength}</div>
            <div className="doc-caption mt-2">Görsel · {view.image.credit}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
