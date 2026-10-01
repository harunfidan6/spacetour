'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react';
import { ArrowUpRight, Orbit } from 'lucide-react';
import { useSpace, type DestinationId } from '@/components/space/SpaceContext';
import { Scramble, Ticks } from '@/components/motion/primitives';
import { SectionHead, Em } from '@/components/ui/Headings';
import { computePlanetState, getJulianDate, PLANET_EPHEMERIS } from '@/lib/astrophysics/keplerEphemeris';

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

export function Voyage() {
  const { currentDestination, setDestination, isTransitioning, autoPilot, toggleAutoPilot, focusCurrentDestination, orbitMode, toggleOrbitMode } = useSpace();
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
        kicker="Güneş Sistemi"
        aside="WebGL · NASA dokuları · J2000 Efemeris"
        title={
          <>
            Göklerde <Em>yolculuk</Em>
          </>
        }
        lede="Gerçek NASA yüzey haritaları ve J2000 Keplerian yörünge mekaniğiyle simüle edilen Güneş Sistemi. Bir gök cismi seç, kamera hedefe odaklansın; yörünge modunu değiştirerek gerçek göksel dizilimi izle."
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
        <div className="absolute right-4 top-4 z-10 flex flex-wrap items-center justify-end gap-2">
          {/* Keplerian Ephemeris Mode Toggle */}
          <button
            type="button"
            onClick={toggleOrbitMode}
            className={`flex items-center gap-2 border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer rounded-full backdrop-blur-xl ${
              orbitMode === 'j2000'
                ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                : 'border-line bg-ink/80 text-paper/80 hover:border-paper/40'
            }`}
          >
            <Orbit size={13} className={orbitMode === 'j2000' ? 'animate-spin' : ''} />
            <span>{orbitMode === 'j2000' ? 'J2000 Canlı Efemeris' : 'Didaktik Sıralama'}</span>
          </button>

          {/* Target Focus Trigger */}
          <button
            type="button"
            onClick={focusCurrentDestination}
            disabled={isTransitioning}
            className={`flex items-center gap-2 border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer rounded-full backdrop-blur-xl ${
              isTransitioning
                ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                : 'border-line bg-ink/80 text-paper hover:border-paper/40'
            }`}
          >
            <Orbit size={13} className={isTransitioning ? 'animate-spin' : ''} />
            <span>{isTransitioning ? 'Hedefe Kilitleniyor' : 'Hedefe Odaklan'}</span>
          </button>

          {/* Cinematic Autopilot */}
          <button
            type="button"
            onClick={toggleAutoPilot}
            aria-pressed={autoPilot}
            className={`flex items-center gap-2 border px-3.5 py-1.5 font-mono text-xs transition-colors cursor-pointer rounded-full backdrop-blur-xl ${
              autoPilot
                ? 'border-lime bg-lime text-ink font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                : 'border-line bg-ink/80 text-paper hover:border-paper/40'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${autoPilot ? 'bg-ink animate-ping' : 'bg-lime'}`} />
            <span>{autoPilot ? 'Otopilot Açık' : 'Sinematik Tur'}</span>
          </button>
        </div>

        {/* Telemetry */}
        <div className="absolute bottom-4 right-4 z-10 hidden w-[min(380px,42%)] border border-line bg-ink/90 backdrop-blur-md md:block">
          <TelemetryBody d={d} slug={slug} index={activeIndex} orbitMode={orbitMode} />
        </div>
      </div>

      <div className="mt-3 border border-line bg-ink-2 md:hidden">
        <TelemetryBody d={d} slug={slug} index={activeIndex} orbitMode={orbitMode} />
      </div>
    </section>
  );
}

function TelemetryBody({
  d,
  slug,
  index,
  orbitMode,
}: {
  d: ReturnType<typeof useSpace>['currentDestination'];
  slug?: string;
  index: number;
  orbitMode: 'didactic' | 'j2000';
}) {
  const rows: { k: string; v: string }[] = useMemo(() => {
    // Ephemeris is only evaluated in J2000 mode, which is always entered on the client
    if (orbitMode === 'j2000' && d.id in PLANET_EPHEMERIS) {
      const ephem = computePlanetState(d.id as keyof typeof PLANET_EPHEMERIS);
      return [
        { k: 'Uzaklık (Güneş)', v: `${ephem.rAU.toFixed(3)} AU (${Math.round(ephem.rKm / 1e6)}M km)` },
        { k: 'Yörünge Hızı', v: `${ephem.speedKmS.toFixed(2)} km/s` },
        { k: 'Gerçek Anomali (ν)', v: `${ephem.trueAnomalyDeg.toFixed(1)}°` },
        { k: 'J2000 Efemeris', v: `JD ${getJulianDate().toFixed(2)}` },
      ];
    }
    return [
      { k: 'Uzaklık', v: d.distance },
      { k: 'Hız', v: d.speed },
      { k: 'Sıcaklık', v: d.temperature },
      { k: 'Yerçekimi', v: d.gravity },
    ];
  }, [orbitMode, d.id, d.distance, d.speed, d.temperature, d.gravity]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="label text-solar">{d.tag}</span>
          {orbitMode === 'j2000' && (
            <span className="border border-lime/30 bg-lime/10 px-1.5 py-0.5 font-mono text-[9px] text-lime font-bold">
              J2000 CANLI
            </span>
          )}
        </div>
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
