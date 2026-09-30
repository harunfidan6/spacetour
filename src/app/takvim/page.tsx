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
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { Reveal, Ticks } from '@/components/motion/primitives';
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
    <div className="ticks relative grid gap-8 border border-line bg-ink-2 p-6 sm:p-10 lg:grid-cols-12 lg:items-end">
      <Ticks />
      <div className="lg:col-span-5">
        <div className="label flex items-center gap-2 text-solar">
          <span className="live-dot" /> Sıradaki gök olayı
        </div>
        <h2 className="display display-tight mt-5 text-[clamp(2rem,4.4vw,4rem)] text-paper flex items-center">
          {next ? (
            <>
              <span className="w-12 h-12 rounded-full border border-line bg-ink flex items-center justify-center p-2 mr-3 shrink-0">
                <AstronomicalEventGlyph type={next.type} size={26} className="text-solar" />
              </span>
              <span>{next.title}</span>
            </>
          ) : (
            'Hesaplanıyor…'
          )}
        </h2>
        {next && (
          <button type="button" onClick={() => onPick(next.date)} className="label mt-5 inline-flex items-center gap-2 text-paper/70 transition-colors hover:text-solar">
            {format(parseISO(next.date), 'd MMMM yyyy, EEEE', { locale: tr })} {next.time ? `· ${next.time}` : ''} <ArrowRight size={13} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-4 gap-px border border-line bg-line lg:col-span-7">
        {parts.map((p) => (
          <div key={p.k} className="bg-ink px-3 py-4 sm:px-5 sm:py-6">
            <div className="display display-tight text-[clamp(2.2rem,6vw,5.5rem)] tabular-nums leading-[0.85] text-solar" suppressHydrationWarning>
              {now ? pad(p.v) : '--'}
            </div>
            <div className="label mt-3 text-muted">{p.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [direction, setDirection] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(() => new Set(ALL_TYPES));
  const grid = useRef<HTMLDivElement>(null);
  const today = useNow(60_000);

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

  const monthStart = startOfMonth(currentMonth);
  const days = useMemo(() => {
    const out: Date[] = [];
    const end = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });
    for (let d = startOfWeek(monthStart, { weekStartsOn: 1 }); d <= end; d = addDays(d, 1)) out.push(d);
    return out;
  }, [monthStart]);

  const monthKey = format(currentMonth, 'yyyy-MM');

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
    setCurrentMonth((m) => (delta > 0 ? addMonths(m, 1) : subMonths(m, 1)));
  };

  const pick = (iso: string) => {
    const d = parseISO(iso);
    setDirection(d > currentMonth ? 1 : -1);
    setCurrentMonth(d);
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
      <PageHero
        index="02"
        section="Olay takvimi"
        accent="var(--solar)"
        lines={[
          <>
            Gök <Em>olayları</Em>
          </>,
          'Takvimi',
        ]}
        size="clamp(3.2rem, 11vw, 12rem)"
        lede="Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları, ekinokslar. Gözlem planını yap, geri sayımı başlat, gökyüzüyle randevulaş."
        meta={[
          { k: 'Kayıtlı olay', v: counts.total },
          { k: 'Tutulma', v: counts.eclipses },
          { k: 'Meteor yağmuru', v: counts.meteors },
          { k: 'Kavuşum', v: counts.conjunctions },
        ]}
        ticker={Object.values(eventTypeLabels)}
      />

      <div className="space-y-20 px-[var(--gutter)] pb-28 pt-16">
        <Reveal mode="clip">
          <NextEventCountdown activeTypes={activeFilters} onPick={pick} />
        </Reveal>

        <section id="takvim-izgara" className="scroll-mt-24">
          <SectionHead
            index="02.1"
            kicker="Ay görünümü"
            title={
              <>
                Gün gün <Em>gökyüzü</Em>
              </>
            }
            lede="Bir güne dokun, o günün olaylarını ve gözlem ipuçlarını aç. Filtrelerle yalnızca ilgilendiğin olay türlerini göster."
          />

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilters(allOn ? new Set() : new Set(ALL_TYPES))}
              className={`label rounded-full border px-4 py-2 transition-colors ${allOn ? 'border-paper bg-paper text-ink' : 'border-line text-paper/70 hover:border-paper'}`}
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
                  className={`label flex items-center gap-2 rounded-full border px-4 py-2 transition-all ${on ? 'border-paper/40 text-paper' : 'border-line text-muted line-through'}`}
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
              <div className="mb-5 flex items-end justify-between gap-4">
                <div className="overflow-hidden pt-[0.16em]">
                  <h3 data-month-title key={monthKey} className="display text-[clamp(2.6rem,7vw,6.5rem)] text-paper">
                    {format(currentMonth, 'MMMM', { locale: tr })} <span className="serif-i text-solar">{format(currentMonth, 'yyyy')}</span>
                  </h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => go(-1)} aria-label="Önceki ay" className="grid h-12 w-12 place-items-center rounded-full border border-line text-paper transition-colors hover:border-solar hover:bg-solar hover:text-ink">
                    <ArrowLeft size={18} />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Sonraki ay" className="grid h-12 w-12 place-items-center rounded-full border border-line text-paper transition-colors hover:border-solar hover:bg-solar hover:text-ink">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-x border-t border-line">
                {days.slice(0, 7).map((d) => (
                  <div key={d.toISOString()} className="label border-b border-line py-3 text-center text-muted">
                    {format(d, 'EEEEEE', { locale: tr })}
                  </div>
                ))}
              </div>
              <div ref={grid} className="grid grid-cols-7 gap-px border-x border-b border-line bg-line">
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
                        selected ? 'bg-paper text-ink' : inMonth ? 'bg-ink text-paper hover:bg-ink-3' : 'bg-ink bg-[repeating-linear-gradient(135deg,transparent_0_7px,rgba(239,236,230,0.035)_7px_8px)] text-muted/40'
                      } ${dayEvents.length ? 'cursor-pointer' : 'cursor-default'}`}
                      aria-label={`${format(day, 'd MMMM', { locale: tr })}${dayEvents.length ? `, ${dayEvents.length} olay` : ''}`}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className={`font-mono text-xs sm:text-sm ${isToday && !selected ? 'grid h-6 w-6 place-items-center rounded-full bg-solar text-ink' : ''}`}>{format(day, 'd')}</span>
                        {dayEvents.length > 1 && <span className="label text-[9px] opacity-60">×{dayEvents.length}</span>}
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

            {/* Side */}
            <aside className="module space-y-6 lg:col-span-4">
              {selectedDate && (
                <div className="border border-paper bg-paper p-5 text-ink">
                  <div className="flex items-start justify-between gap-3 border-b border-ink/15 pb-3">
                    <div>
                      <div className="label text-ink/60">Seçili gün</div>
                      <div className="display display-tight mt-2 text-3xl">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</div>
                    </div>
                    <button type="button" onClick={() => setSelectedDate(null)} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 hover:bg-ink hover:text-paper">
                      <X size={16} />
                    </button>
                  </div>
                  {selectedDayEvents.length === 0 ? (
                    <p className="pt-4 text-sm text-ink/70">Bu tarihte filtrelenmiş gök olayı yok.</p>
                  ) : (
                    <div className="divide-y divide-ink/15">
                      {selectedDayEvents.map((e) => (
                        <article key={e.id} className="py-4">
                          <div className="label flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ background: eventTypeTones[e.type] === 'var(--paper)' ? 'var(--ink)' : eventTypeTones[e.type] }} />
                            {eventTypeLabels[e.type]} {e.time ? `· ${e.time}` : ''}
                          </div>
                          <h4 className="mt-2 text-lg font-semibold flex items-center gap-2">
                            <AstronomicalEventGlyph type={e.type} size={20} className="text-ink shrink-0" />
                            <span>{e.title}</span>
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-ink/75">{e.description}</p>
                          <p className="mt-3 border-l-2 border-solar pl-3 text-sm leading-relaxed text-ink/75">{e.details}</p>
                          <div className="label mt-3 flex items-center gap-1.5 text-ink/60">
                            <MapPin size={12} /> {VISIBILITY[e.visibility] ?? e.visibility}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <CosmicEventSimulator type={featured?.type ?? 'meteor-yagmuru'} title={featured?.title ?? 'Gök olayı simülasyonu'} />

              <div className="border border-line bg-ink-2">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="label text-paper">Yaklaşan olaylar</span>
                  <span className="label text-muted">{upcoming.length}</span>
                </div>
                <ol className="relative">
                  {upcoming.length === 0 && <li className="px-5 py-6 text-sm text-muted">Yakın zamanda filtrelenmiş olay yok.</li>}
                  {upcoming.map((e, i) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => pick(e.date)}
                        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-ink-3"
                      >
                        <span className="label text-muted">{pad(i + 1)}</span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 truncate text-sm text-paper group-hover:text-solar">
                            <AstronomicalEventGlyph type={e.type} size={15} className="text-solar shrink-0" />
                            <span className="truncate">{e.title}</span>
                          </span>
                          <span className="label mt-1 block text-[10px]" style={{ color: eventTypeTones[e.type] }}>
                            {format(parseISO(e.date), 'd MMM yyyy', { locale: tr })}
                          </span>
                        </span>
                        <ArrowRight size={15} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-solar" />
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
