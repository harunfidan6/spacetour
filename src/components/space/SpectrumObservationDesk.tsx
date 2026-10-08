'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { DEEP_SKY_TARGETS, type DeepSkyTarget, type WavelengthMode } from '@/data/deepSky';
import type { AstroImage } from '@/data/astroImages';
import { Scramble } from '@/components/motion/primitives';
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
    <div className="space-y-8 sm:space-y-10">
      {/* Targets */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {DEEP_SKY_TARGETS.map((t) => {
          const on = t.id === target.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => change(t, mode)}
              aria-pressed={on}
              className={`group flex min-w-0 flex-col border p-4 text-left transition-colors sm:p-5 ${
                on ? 'border-rose/60 bg-ink-2' : 'border-line bg-ink-2/60 hover:border-paper/30 hover:bg-ink-2'
              }`}
            >
              <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-paper/70">{t.catalog}</span>
                {on && <span className="text-xs font-medium text-rose">Seçili</span>}
              </span>
              <span className="mt-2 font-display text-xl font-semibold leading-tight text-paper transition-colors group-hover:text-rose sm:text-2xl">
                {t.name}
              </span>
              <span className="mt-1 text-sm text-paper/75">{t.type}</span>
            </button>
          );
        })}
      </div>

      {/* Spectrum selector */}
      <div>
        <div className="relative h-14 overflow-hidden bg-[linear-gradient(90deg,#3b1d7a_0%,#7a5cff_18%,#ff3d7f_36%,#ff5b22_50%,#ffc53d_58%,#d4ff3d_64%,#8fd3ff_74%,#efece6_100%)]">
          <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-multiply" aria-hidden>
            <path d={WAVE_PATH} fill="none" stroke="#09090b" strokeWidth="1.5" />
          </svg>
          <span
            className="absolute inset-y-0 w-[3px] bg-white shadow-[0_0_0_1px_rgba(9,9,11,0.55)] transition-[left] duration-700 ease-[cubic-bezier(.76,0,.24,1)]"
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
                className={`min-w-0 border p-3 text-left transition-colors sm:p-4 ${
                  on ? 'border-rose/60 bg-rose/10 text-paper' : 'border-line bg-transparent text-paper/80 hover:border-paper/30 hover:bg-white/[0.03]'
                }`}
              >
                <span className="block font-mono text-xs text-paper/70">{b.band}</span>
                <span className="mt-1.5 block font-display text-base font-semibold leading-tight text-paper lg:text-lg">{b.label}</span>
                <span className="mt-1 block text-[13px] leading-snug text-paper/70 sm:text-sm">{b.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Observation */}
      <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-12">
        <div ref={viewport} className="relative min-h-[360px] overflow-hidden bg-black sm:min-h-[520px] lg:col-span-7">
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
          <span data-wipe-edge aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px] bg-paper opacity-0 shadow-[0_0_6px_rgba(244,243,238,0.5)]" />

          <svg viewBox="-100 -100 200 200" className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 sm:h-40 sm:w-40" aria-hidden>
            <circle r="40" fill="none" stroke="var(--paper)" strokeOpacity="0.3" />
            <path d="M-96 0H-52M52 0H96M0 -96V-52M0 52V96" stroke="var(--paper)" strokeOpacity="0.45" strokeWidth="1.2" />
          </svg>

          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 bg-ink/80 px-3 py-1.5 backdrop-blur-md sm:left-4 sm:top-4">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: view.color }} />
            <span className="text-sm text-paper">
              <Scramble key={mode} text={`${band.label} · ${band.band}`} onView={false} />
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 bg-ink/80 px-3 py-2 backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:px-4">
            <span className="text-xs text-paper/70">Teleskop</span>
            <span className="min-w-0 text-sm font-medium text-paper">
              <Scramble text={view.telescope} onView={false} />
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-8 bg-ink-2 p-5 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
              <span className="font-mono text-xs font-semibold text-rose">{target.catalog}</span>
              <span className="font-mono text-xs text-paper/70">{target.distance}</span>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">{target.name}</h2>
            <p className="doc-serif mt-1 text-lg text-rose/90">{target.type}</p>
            <p className="mt-4 text-base leading-relaxed text-paper/85">{target.description}</p>
          </div>
          <div className="border-l-2 pl-4" style={{ borderColor: view.color }}>
            <div className="text-sm font-medium text-paper/80">Bu dalgaboyunda görülen</div>
            <p className="mt-1.5 text-base leading-relaxed text-paper/85">{view.highlights}</p>
            <div className="mt-3 text-sm text-paper/70">
              Spektrum: <span className="font-mono text-xs text-paper/80">{view.wavelength}</span>
            </div>
            <div className="mt-1.5 text-xs text-paper/70">Görsel: {view.image.credit}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
