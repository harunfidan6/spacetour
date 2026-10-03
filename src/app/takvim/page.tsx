'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';
import { events, EventType, eventTypeLabels, eventTypeTones } from '@/data/events';
import { CosmicEventSimulator } from '@/components/space/CosmicEventSimulator';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { DOC_IMAGES } from '@/data/docImages';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { Reveal } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';
import { upcomingEvents } from '@/lib/sky';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';

const ALL_TYPES = Object.keys(eventTypeLabels) as EventType[];

const VISIBILITY: Record<string, string> = {
  'tüm-dünya': 'Tüm dünya',
  'kuzey-yarıküre': 'Kuzey yarıküre',
  'güney-yarıküre': 'Güney yarıküre',
  türkiye: 'Türkiye',
};

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

/* Countdown to the next event — client only */
function NextEventCountdown({ activeTypes, onPick }: { activeTypes: Set<EventType>; onPick: (iso: string) => void }) {
  const now = useNow(1000);
  const next = useMemo(() => (now ? upcomingEvents(now, 20).find((e) => activeTypes.has(e.type)) : undefined), [now, activeTypes]);
  const target = next ? new Date(`${next.date}T${next.time ?? '00:00'}:00`) : null;
  const diff = now && target ? Math.max(0, target.getTime() - now.getTime()) : 0;
  const parts = [
    { k: 'Gün', v: Math.floor(diff / 86400000) },
    { k: 'Saat', v: Math.floor(diff / 3600000) % 24 },
    { k: 'Dakika', v: Math.floor(diff / 60000) % 60 },
    { k: 'Saniye', v: Math.floor(diff / 1000) % 60 },
  ];

  return (
    <div className="relative grid gap-8 rounded-2xl border border-white/[0.08] bg-ink-2/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-solar/30 bg-solar/10 px-3 py-1 font-mono text-xs text-solar">
          <span className="live-dot" /> Sıradaki Gök Olayı
        </div>
        <h2 className="display mt-4 text-2xl sm:text-3xl font-semibold text-paper flex items-center">
          {next ? (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 mr-3">
                <AstronomicalEventGlyph type={next.type} size={24} className="text-solar" />
              </span>
              <span>{next.title}</span>
            </>
          ) : (
            'Hesaplanıyor…'
          )}
        </h2>
        {next && (
          <button
            type="button"
            onClick={() => onPick(next.date)}
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-paper/70 transition-colors hover:text-solar"
          >
            <span>{format(parseISO(next.date), 'd MMMM yyyy, EEEE', { locale: tr })} {next.time ? `· ${next.time}` : ''}</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:col-span-7">
        {parts.map((p) => (
          <div key={p.k} className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-black/40 p-4 sm:p-5 backdrop-blur-md">
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-solar tabular-nums leading-none" suppressHydrationWarning>
              {now ? pad(p.v) : '--'}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">{p.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Deterministic month for the prerendered HTML; the real month is swapped in after mount
const FALLBACK_MONTH = startOfMonth(parseISO(events[0].date));

export default function CalendarPage() {
  const [pickedMonth, setPickedMonth] = useState<Date | null>(null);
  const [direction, setDirection] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(() => new Set(ALL_TYPES));
  const grid = useRef<HTMLDivElement>(null);
  const today = useNow(60_000);
  const monthReady = pickedMonth !== null || today !== null;
  const currentMonth = pickedMonth ?? today ?? FALLBACK_MONTH;

  const toggleFilter = (type: EventType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };
  const allOn = activeFilters.size === ALL_TYPES.length;

  const filteredEvents = useMemo(() => events.filter((e) => activeFilters.has(e.type)), [activeFilters]);
  const upcoming = useMemo(() => (today ? upcomingEvents(today, 50).filter((e) => activeFilters.has(e.type)).slice(0, 8) : []), [today, activeFilters]);

  const monthKey = format(currentMonth, 'yyyy-MM');
  const monthStart = useMemo(() => startOfMonth(parseISO(`${monthKey}-01`)), [monthKey]);
  const days = useMemo(() => {
    const out: Date[] = [];
    const end = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
    for (let d = startOfWeek(monthStart, { weekStartsOn: 1 }); d <= end; d = addDays(d, 1)) out.push(d);
    return out;
  }, [monthStart]);

  // Month change: cells cascade in from the travel direction
  useGsap(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      gsap.from(grid.current.querySelectorAll('[data-cell]'), {
        x: 24 * direction,
        autoAlpha: 0,
        duration: 0.7,
        stagger: { each: 0.012, from: direction > 0 ? 'start' : 'end' },
        ease: 'mg.out',
      });
      gsap.from('[data-month-title]', { yPercent: 100 * direction, autoAlpha: 0, duration: 0.7, ease: 'mg.out' });
    },
    [monthKey]
  );

  const go = (delta: number) => {
    setDirection(delta);
    setPickedMonth(delta > 0 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
  };

  const pick = (iso: string) => {
    const d = parseISO(iso);
    setDirection(d > currentMonth ? 1 : -1);
    setPickedMonth(d);
    setSelectedDate(d);
    document.getElementById('takvim-izgara')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedDayEvents = selectedDate ? filteredEvents.filter((e) => isSameDay(parseISO(e.date), selectedDate)) : [];
  const featured = selectedDayEvents[0] ?? upcoming[0];

  const counts = {
    total: events.length,
    eclipses: events.filter((e) => e.type === 'ay-tutulmasi' || e.type === 'gunes-tutulmasi').length,
    meteors: events.filter((e) => e.type === 'meteor-yagmuru').length,
    conjunctions: events.filter((e) => e.type === 'gezegen-kavusumu').length,
  };

  return (
    <div className="relative" style={{ '--page-accent': 'var(--solar)' } as CSSProperties}>
      <ChapterHero
        chapter="02"
        section="Olay Takvimi"
        headline={['Gök olayları', 'takvimi']}
        lede="Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları, ekinokslar. Gözlem planını yap, geri sayımı başlat, gökyüzüyle randevulaş."
        accent="var(--solar)"
        image={DOC_IMAGES['sec-takvim']}
        meta={[
          { k: 'Kayıtlı olay', v: counts.total },
          { k: 'Tutulma', v: counts.eclipses },
          { k: 'Meteor yağmuru', v: counts.meteors },
          { k: 'Kavuşum', v: counts.conjunctions },
        ]}
      />

      <div className="space-y-20 px-[var(--gutter)] pb-28 pt-16">
        <Reveal mode="clip">
          <NextEventCountdown activeTypes={activeFilters} onPick={pick} />
        </Reveal>

        <section id="takvim-izgara" className="scroll-mt-24">
          <PartHeading
            part={1}
            title="Gün gün"
            serif="gökyüzü"
            aside="Aylık Efemeris"
            description="Bir güne dokun, o günün olaylarını ve gözlem ipuçlarını aç. Filtrelerle yalnızca ilgilendiğin olay türlerini göster."
          />

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilters(allOn ? new Set() : new Set(ALL_TYPES))}
              className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors ${allOn ? 'border-paper bg-paper text-ink font-semibold' : 'border-white/10 bg-ink-2 text-paper/70 hover:border-paper'}`}
            >
              {allOn ? 'Tümünü kapat' : 'Tümünü aç'}
            </button>
            {ALL_TYPES.map((t) => {
              const on = activeFilters.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleFilter(t)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-all ${on ? 'border-white/20 bg-ink-2/90 text-paper' : 'border-white/10 bg-ink-2/40 text-muted line-through opacity-60'}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: eventTypeTones[t], opacity: on ? 1 : 0.35 }} />
                  {eventTypeLabels[t]}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Calendar */}
            <div className="lg:col-span-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className={`overflow-hidden ${monthReady ? '' : 'invisible'}`}>
                  <h3 data-month-title key={monthKey} className="display text-2xl sm:text-3xl font-semibold text-paper">
                    {format(currentMonth, 'MMMM', { locale: tr })} <span className="serif-i text-solar">{format(currentMonth, 'yyyy')}</span>
                  </h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => go(-1)} aria-label="Önceki ay" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-paper transition-all hover:border-solar/40 hover:bg-solar/10 hover:text-solar">
                    <ArrowLeft size={16} />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Sonraki ay" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-paper transition-all hover:border-solar/40 hover:bg-solar/10 hover:text-solar">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-ink-2/50 backdrop-blur-md overflow-hidden">
                <div className="grid grid-cols-7 border-b border-white/[0.08] bg-white/[0.02]">
                  {days.slice(0, 7).map((d) => (
                    <div key={d.toISOString()} className="font-mono text-xs uppercase tracking-wider py-3 text-center text-muted">
                      {format(d, 'EEEEEE', { locale: tr })}
                    </div>
                  ))}
                </div>
                <div ref={grid} aria-busy={!monthReady} className={`grid grid-cols-7 gap-px bg-white/[0.06] ${monthReady ? '' : 'invisible'}`}>
                  {days.map((day) => {
                    const dayEvents = filteredEvents.filter((e) => isSameDay(parseISO(e.date), day));
                    const inMonth = isSameMonth(day, monthStart);
                    const isToday = today ? isSameDay(day, today) : false;
                    const selected = selectedDate ? isSameDay(day, selectedDate) : false;
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        data-cell
                        onClick={() => setSelectedDate(dayEvents.length ? day : null)}
                        className={`group relative flex min-h-[64px] flex-col items-start p-1.5 text-left transition-colors sm:min-h-[104px] sm:p-2.5 ${
                          selected ? 'bg-solar/20 text-paper ring-1 ring-solar' : inMonth ? 'bg-ink-2 text-paper hover:bg-ink-3' : 'bg-ink/80 text-muted/40'
                        } ${dayEvents.length ? 'cursor-pointer' : 'cursor-default'}`}
                        aria-label={`${format(day, 'd MMMM', { locale: tr })}${dayEvents.length ? `, ${dayEvents.length} olay` : ''}`}
                      >
                        <span className="flex w-full items-center justify-between">
                          <span className={`font-mono text-xs sm:text-sm ${isToday && !selected ? 'grid h-6 w-6 place-items-center rounded-full bg-solar text-ink font-semibold' : ''}`}>{format(day, 'd')}</span>
                          {dayEvents.length > 1 && <span className="font-mono text-[9px] text-muted">×{dayEvents.length}</span>}
                        </span>
                        <span className="mt-auto flex w-full flex-col gap-1">
                          {dayEvents.slice(0, 2).map((e) => (
                            <span key={e.id} className="flex w-full items-center gap-1.5">
                              <span className="h-1.5 w-full shrink-0 sm:w-1.5 sm:rounded-full" style={{ background: eventTypeTones[e.type] }} />
                              <span className="hidden truncate text-[11px] leading-tight sm:block">{e.title}</span>
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Side */}
            <aside className="space-y-6 lg:col-span-4">
              {selectedDate && (
                <div className="rounded-2xl border border-solar/40 bg-ink-2/95 p-6 text-paper shadow-2xl backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider text-solar">Seçili gün</div>
                      <div className="display mt-1 text-2xl font-semibold text-paper">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</div>
                    </div>
                    <button type="button" onClick={() => setSelectedDate(null)} aria-label="Kapat" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/30 hover:text-paper">
                      <X size={15} />
                    </button>
                  </div>
                  {selectedDayEvents.length === 0 ? (
                    <p className="pt-4 text-sm text-paper/70">Bu tarihte filtrelenmiş gök olayı yok.</p>
                  ) : (
                    <div className="divide-y divide-white/[0.08]">
                      {selectedDayEvents.map((e) => (
                        <article key={e.id} className="py-4">
                          <div className="flex items-center gap-2 font-mono text-xs text-muted">
                            <span className="h-2 w-2 rounded-full" style={{ background: eventTypeTones[e.type] }} />
                            {eventTypeLabels[e.type]} {e.time ? `· ${e.time}` : ''}
                          </div>
                          <h4 className="mt-2 text-base font-semibold text-paper flex items-center gap-2">
                            <AstronomicalEventGlyph type={e.type} size={18} className="text-solar shrink-0" />
                            <span>{e.title}</span>
                          </h4>
                          <p className="mt-2 text-xs leading-relaxed text-paper/80">{e.description}</p>
                          <p className="mt-3 border-l-2 border-solar/60 pl-3 text-xs leading-relaxed text-paper/70">{e.details}</p>
                          <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                            <MapPin size={12} className="text-solar" /> {VISIBILITY[e.visibility] ?? e.visibility}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <CosmicEventSimulator type={featured?.type ?? 'meteor-yagmuru'} title={featured?.title ?? 'Gök olayı simülasyonu'} />

              <div className="rounded-2xl border border-white/[0.08] bg-ink-2/60 backdrop-blur-md overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5 bg-white/[0.02]">
                  <span className="font-mono text-xs uppercase tracking-wider text-paper/90">Yaklaşan Olaylar</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted">{upcoming.length}</span>
                </div>
                <ol className="divide-y divide-white/[0.06]">
                  {upcoming.length === 0 && <li className="px-5 py-6 text-sm text-muted">Yakın zamanda filtrelenmiş olay yok.</li>}
                  {upcoming.map((e, i) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => pick(e.date)}
                        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                      >
                        <span className="font-mono text-xs text-muted">{pad(i + 1)}</span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 truncate text-sm text-paper group-hover:text-solar transition-colors">
                            <AstronomicalEventGlyph type={e.type} size={15} className="text-solar shrink-0" />
                            <span className="truncate">{e.title}</span>
                          </span>
                          <span className="mt-1 block font-mono text-[10px]" style={{ color: eventTypeTones[e.type] }}>
                            {format(parseISO(e.date), 'd MMM yyyy', { locale: tr })}
                          </span>
                        </span>
                        <ArrowRight size={14} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-solar" />
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
