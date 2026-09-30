'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { Scramble } from '@/components/motion/primitives';

export interface LabEntry {
  id: string;
  /** Short name for the index list. */
  short: string;
  title: string;
  blurb?: string;
  render: () => ReactNode;
}

/**
 * One instrument on stage at a time: an index of modules on the left, the
 * active module on the right. Only the active module is mounted, so pages with
 * many WebGL/canvas labs stay light. Deep-linkable via `#lab-<id>`.
 */
export function LabDeck({ labs, prefix = 'L', accent = 'var(--page-accent)' }: { labs: LabEntry[]; prefix?: string; accent?: string }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lab = labs[active];

  // Follow #lab-<id> (initial load and back/forward).
  useEffect(() => {
    const sync = (reveal: boolean) => {
      const m = window.location.hash.match(/^#lab-(.+)$/);
      const i = m ? labs.findIndex((l) => l.id === decodeURIComponent(m[1])) : -1;
      if (i < 0) return;
      setActive(i);
      // A shared link lands on the module, not the top of the page.
      if (reveal && root.current) window.scrollTo({ top: root.current.getBoundingClientRect().top + window.scrollY - 96 });
    };
    const onHash = () => sync(false);
    const timer = window.setTimeout(() => sync(true), 0);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', onHash);
    };
  }, [labs]);

  const select = (i: number) => {
    const next = (i + labs.length) % labs.length;
    setActive(next);
    window.history.replaceState(null, '', `#lab-${labs[next].id}`);
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' });
  };

  useGsap(
    () => {
      const el = stage.current;
      if (el && !prefersReducedMotion()) {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 0% 100% 0%)', y: 40 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 0.9, ease: 'mg.inOut', clearProps: 'clipPath,transform' }
        );
      }
      // Page height changed — re-measure scroll-driven animations below.
      gsap.delayedCall(0.2, () => ScrollTrigger.refresh());
    },
    [active]
  );

  const code = (i: number) => `${prefix}${i + 1}`;

  return (
    <div ref={root} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <nav aria-label="Modüller" className="min-w-0 lg:col-span-3">
        <div className="lg:sticky lg:top-24">
          <div className="label mb-3 flex items-center justify-between text-muted">
            <span>{labs.length} modül</span>
            <span>
              {String(active + 1).padStart(2, '0')} / {String(labs.length).padStart(2, '0')}
            </span>
          </div>
          <ol role="tablist" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0">
            {labs.map((l, i) => {
              const on = i === active;
              return (
                <li key={l.id} className="shrink-0 lg:border-b lg:border-line">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => select(i)}
                    className={`group relative flex w-full items-baseline gap-3 overflow-hidden rounded-full border px-4 py-2 text-left transition-colors lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5 ${
                      on ? 'border-transparent bg-paper text-ink lg:bg-transparent lg:text-paper' : 'border-line text-paper/60 hover:text-paper'
                    }`}
                  >
                    <span aria-hidden className="absolute inset-y-0 left-0 hidden w-[3px] origin-top transition-transform duration-500 lg:block" style={{ background: accent, transform: `scaleY(${on ? 1 : 0})` }} />
                    <span className="label w-8 shrink-0 text-[10px] transition-transform duration-500 lg:group-aria-selected:translate-x-3" style={{ color: on ? accent : undefined }}>
                      {code(i)}
                    </span>
                    <span className="whitespace-nowrap text-sm font-medium transition-transform duration-500 lg:whitespace-normal lg:group-aria-selected:translate-x-3 lg:group-hover:translate-x-1">
                      {l.short}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <div className="min-w-0 lg:col-span-9">
        <header className="mb-6 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="label" style={{ color: accent }}>
              ({code(active)})
            </div>
            <h3 className="display display-tight mt-3 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[0.95] text-paper">
              <Scramble key={lab.id} text={lab.title} onView={false} duration={0.8} />
            </h3>
            {lab.blurb && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/60">{lab.blurb}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => select(active - 1)} aria-label="Önceki modül" className="grid h-11 w-11 place-items-center rounded-full border border-line text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink">
              <ArrowLeft size={17} />
            </button>
            <button type="button" onClick={() => select(active + 1)} aria-label="Sonraki modül" className="grid h-11 w-11 place-items-center rounded-full border border-line text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink">
              <ArrowRight size={17} />
            </button>
          </div>
        </header>

        <div ref={stage} key={lab.id} className="module" role="tabpanel" aria-label={lab.title}>
          {lab.render()}
        </div>

        <button
          type="button"
          onClick={() => select(active + 1)}
          className="group mt-6 flex w-full items-center justify-between gap-4 border-y border-line py-5 text-left transition-colors hover:text-paper"
        >
          <span>
            <span className="label block text-muted">Sıradaki · {code((active + 1) % labs.length)}</span>
            <span className="display display-tight mt-2 block text-2xl text-paper/80 transition-colors group-hover:text-paper sm:text-3xl">{labs[(active + 1) % labs.length].short}</span>
          </span>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
