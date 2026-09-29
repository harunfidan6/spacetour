'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import { useSpace, type DestinationId } from '@/components/space/SpaceContext';
import { Scramble, Ticks } from '@/components/motion/primitives';
import { SectionHead, Em } from '@/components/ui/Headings';

const JourneyEngine = dynamic(() => import('@/components/space/SpaceJourneyEngine').then((m) => m.SpaceJourneyEngine), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <span className="label text-muted">WebGL sahnesi yükleniyor…</span>
    </div>
  ),
});

const STOPS: { id: DestinationId; name: string; meta: string }[] = [
  { id: 'solar-overview', name: 'Sistem', meta: 'Genel görünüm' },
  { id: 'sun', name: 'Güneş', meta: 'G2V · 0.00 AU' },
  { id: 'earth', name: 'Dünya', meta: '1.00 AU' },
  { id: 'mars', name: 'Mars', meta: '1.52 AU' },
  { id: 'jupiter', name: 'Jüpiter', meta: '5.20 AU' },
  { id: 'saturn', name: 'Satürn', meta: '9.58 AU' },
  { id: 'blackhole', name: 'Gargantua', meta: 'Olay ufku' },
];

const ENCYCLOPEDIA: Partial<Record<DestinationId, string>> = {
  sun: 'gunes',
  earth: 'dunya',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
};

import { RelativisticWarpHUD } from '@/components/space/RelativisticWarpHUD';

export function Voyage() {
  const { currentDestination, setDestination, isWarping, autoPilot, toggleAutoPilot, triggerWarp } = useSpace();
  const stage = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = currentDestination;
  const slug = ENCYCLOPEDIA[d.id];
  const activeIndex = STOPS.findIndex((s) => s.id === d.id);

  return (
    <section id="yolculuk" className="relative scroll-mt-0 bg-ink px-[var(--gutter)] pb-24 pt-24 sm:pt-32" style={{ '--page-accent': 'var(--solar)' } as CSSProperties}>
      <SectionHead
        index="02"
        kicker="Yolculuk"
        aside="WebGL · NASA dokuları"
        title={
          <>
            Warp&apos;a <Em>hazır</Em>
          </>
        }
        lede="Gerçek NASA yüzey haritalarıyla modellenmiş Güneş Sistemi. Bir durak seç, kamera oraya uçsun; fareyle hafifçe yörüngeyi kaydır."
      />

      {/* Mobile stop rail */}
      <div className="no-scrollbar -mx-[var(--gutter)] mb-3 flex gap-1.5 overflow-x-auto px-[var(--gutter)] md:hidden">
        {STOPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setDestination(s.id)}
            aria-pressed={d.id === s.id}
            className={`shrink-0 border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
              d.id === s.id ? 'border-solar bg-solar text-ink font-bold' : 'border-line bg-ink text-paper/80 hover:bg-ink-3'
            }`}
          >
            <span className="mr-1.5 text-[9px] opacity-70">{String(i + 1).padStart(2, '0')}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div ref={stage} className="ticks relative h-[78svh] min-h-[520px] overflow-hidden border border-line bg-black">
        <Ticks />
        {mounted && <JourneyEngine active={inView} />}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.2)_35%,transparent_60%)]" />

        {/* Stop list */}
        <ol className="absolute bottom-6 left-6 top-6 z-10 hidden flex-col justify-center md:flex">
          {STOPS.map((s, i) => {
            const on = d.id === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setDestination(s.id)}
                  aria-pressed={on}
                  className="group flex items-baseline gap-3 py-1 text-left cursor-pointer"
                >
                  <span className={`label w-6 text-[10px] ${on ? 'text-solar font-bold' : 'text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`display text-[clamp(1.6rem,2.6vw,2.6rem)] transition-[color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2 ${on ? 'text-solar' : 'text-paper/55 group-hover:text-paper'}`}>
                    {s.name}
                  </span>
                  <span className={`label text-[9px] transition-opacity ${on ? 'text-paper/80 opacity-100' : 'text-muted opacity-0 group-hover:opacity-100'}`}>{s.meta}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Controls */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={triggerWarp}
            disabled={isWarping}
            className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isWarping
                ? 'border-lime-signal bg-lime-signal text-ink font-black shadow-[0_0_25px_rgba(212,255,61,0.5)]'
                : 'border-solar bg-solar text-ink font-bold hover:bg-solar/90 active:scale-95 shadow-[0_0_20px_rgba(255,91,34,0.35)]'
            }`}
          >
            <Zap size={14} className={isWarping ? 'animate-bounce' : 'animate-pulse'} />
            <span>{isWarping ? 'Warp Aktif' : 'Warp Sıçraması'}</span>
          </button>
          <button
            type="button"
            onClick={toggleAutoPilot}
            aria-pressed={autoPilot}
            className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
              autoPilot
                ? 'border-lime bg-lime text-ink font-bold'
                : 'border-line bg-ink/80 text-paper backdrop-blur hover:border-paper/40'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${autoPilot ? 'bg-ink animate-ping' : 'bg-lime'}`} />
            <span>{autoPilot ? 'Otopilot Açık' : 'Sinematik Tur'}</span>
          </button>
        </div>

        {/* Telemetry */}
        <div className="absolute bottom-4 right-4 z-10 hidden w-[min(360px,40%)] border border-line bg-ink/85 backdrop-blur-md md:block">
          <TelemetryBody d={d} slug={slug} index={activeIndex} />
        </div>

        {/* Relativistic Hyperspace Warp HUD */}
        <RelativisticWarpHUD
          isWarping={isWarping}
          destinationName={d.name}
          destinationDistance={d.distance}
        />
      </div>

      <div className="mt-3 border border-line bg-ink-2 md:hidden">
        <TelemetryBody d={d} slug={slug} index={activeIndex} />
      </div>
    </section>
  );
}

function TelemetryBody({ d, slug, index }: { d: ReturnType<typeof useSpace>['currentDestination']; slug?: string; index: number }) {
  const rows = [
    { k: 'Uzaklık', v: d.distance },
    { k: 'Hız', v: d.speed },
    { k: 'Sıcaklık', v: d.temperature },
    { k: 'Yerçekimi', v: d.gravity },
  ];
  return (
    <>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="label text-solar">{d.tag}</span>
        <span className="label text-muted">{String(Math.max(index, 0) + 1).padStart(2, '0')} / 07</span>
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="display display-tight text-3xl text-paper">
          <Scramble text={d.name} onView={false} />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-paper/60">{d.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {rows.map((r) => (
            <div key={r.k}>
              <dt className="label text-[9px] text-muted">{r.k}</dt>
              <dd className="mt-1 font-mono text-xs text-paper">
                <Scramble text={r.v} onView={false} duration={0.7} />
              </dd>
            </div>
          ))}
        </dl>
        {slug && (
          <Link href={`/ansiklopedi/${slug}`} className="group mt-4 inline-flex items-center gap-1.5 text-xs text-paper/80 hover:text-solar">
            Ansiklopedi kaydı <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </>
  );
}
