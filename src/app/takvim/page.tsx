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
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { FAQS_BY_SECTION } from '@/data/faqs';
import { DOC_IMAGES } from '@/data/docImages';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { Reveal } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';
import { upcomingEvents } from '@/lib/sky';
import { AstronomicalEventGlyph } from '@/components/ui/CosmicGlyphs';
import Link from 'next/link';
import { eventSlug, EVENT_YEARS } from '@/lib/eventSlug';

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
      gsap.fromTo(
        grid.current.querySelectorAll('[data-cell]'),
        { x: 24 * direction, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.7, stagger: { each: 0.012, from: direction > 0 ? 'start' : 'end' }, ease: 'mg.out', clearProps: 'opacity,visibility,transform' }
      );
      gsap.fromTo('[data-month-title]', { yPercent: 100 * direction, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'mg.out', clearProps: 'opacity,visibility,transform' });
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
                          selected ? 'bg-solar/20 text-paper ring-1 ring-solar' : inMonth ? 'bg-ink-2 text-paper hover:bg-ink-3' : 'bg-ink/80 text-muted'
                        } ${dayEvents.length ? 'cursor-pointer' : 'cursor-default'}`}
                        aria-label={`${format(day, 'd MMMM', { locale: tr })}${dayEvents.length ? `, ${dayEvents.length} olay` : ''}`}
                      >
                        <span className="flex w-full items-center justify-between">
                          <span className={`font-mono text-xs sm:text-sm ${isToday && !selected ? 'grid h-6 w-6 place-items-center rounded-full bg-solar text-ink font-semibold' : ''}`}>{format(day, 'd')}</span>
                          {dayEvents.length > 1 && <span className="font-mono text-[10px] text-muted">×{dayEvents.length}</span>}
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
                          <Link href={`/takvim/${eventSlug(e)}`} className="mt-3 inline-block font-mono text-[11px] text-solar hover:underline">
                            Olayın sayfası ve gözlem rehberi →
                          </Link>
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

        {/* Belgesel Gök Olayları Rehberi */}
        <section aria-label="Gök Olayları Rehberi" className="border-t border-white/[0.08] bg-ink-2/40 px-[var(--gutter)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <PartHeading
              part={2}
              title="Gök Olayları"
              serif="rehberi"
              aside="Gözlem Kılavuzu & Mekanik"
              description="Meteor yağmurlarından tutulmalara, kavuşumlardan ekinokslara gökyüzündeki temel astronomik olayların doğası, oluşum fiziği ve gözlem incelikleri."
            />

            <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:fill-row-2 lg:fill-row-3">
              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-solar">Atmosfer Fiziği</span>
                  <AstronomicalEventGlyph type="meteor-yagmuru" size={24} className="text-solar" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Meteor Yağmurları</h3>
                <p className="doc-serif text-lg text-solar/90 mb-3">Kuyruklu Yıldız Kalıntıları</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Kuyruklu yıldızların yörüngelerinde bıraktığı kum tanesi büyüklüğündeki toz parçacıkları, Dünya bu enkaz kuşağından geçerken saatte 100.000 ila 250.000 km hızla atmosfere dalar. Sürtünmeyle akkorlaşan hava molekülleri arkalarında saniyelik parlayan izler bırakır.
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Ölçüt: ZHR (Saatlik Akı)</span>
                  <span className="text-paper/80">Çıplak gözle izlenir</span>
                </div>
              </article>

              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-gold">Gölge Geometrisi</span>
                  <AstronomicalEventGlyph type="gunes-tutulmasi" size={24} className="text-gold" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Güneş Tutulmaları</h3>
                <p className="doc-serif text-lg text-gold/90 mb-3">Ay’ın Güneş’i Örtmesi</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Ay, Yeni Ay evresindeyken Dünya ile Güneş arasına tam girdiğinde Güneş diski örtülür. Güneş, Ay’dan 400 kat büyük olmasına rağmen tesadüfen Dünya’ya 400 kat daha uzaktadır; bu kozmik denklem sayesinde tam tutulmada Güneş’in inci beyazı tacı (korona) çıplak gözle görünür hale gelir.
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Türler: Tam · Halkalı · Parçalı</span>
                  <span className="text-rose-400">Güneş filtresi zorunlu</span>
                </div>
              </article>

              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-rose-400">Rayleigh Saçılması</span>
                  <AstronomicalEventGlyph type="ay-tutulmasi" size={24} className="text-rose-400" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Ay Tutulmaları</h3>
                <p className="doc-serif text-lg text-rose-400/90 mb-3">Dünya Gölgesinde Kızıllık</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Dolunay evresindeki Ay, Dünya’nın tam gölgesine (umbra) girdiğinde Güneş ışığı kesilir. Ancak Dünya atmosferinden kırılan kırmızı dalgaboylu ışık Ay yüzeyine ulaştığı için Ay tamamen kaybolmak yerine pas kırmızısı veya bakır tonunda parıldar (&ldquo;Kanlı Ay&rdquo;).
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Görünürlük: Tüm Gece Yarıküresi</span>
                  <span className="text-paper/80">Filtresiz izlenebilir</span>
                </div>
              </article>

              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-violet">Açısal Yakınlaşma</span>
                  <AstronomicalEventGlyph type="gezegen-kavusumu" size={24} className="text-violet" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Gezegen Kavuşumları</h3>
                <p className="doc-serif text-lg text-violet/90 mb-3">Göksel Randevular</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  İki ya da daha fazla gezegenin Dünya’dan bakıldığında gök kubbede aynı hizaya gelmesi olayıdır. Gezegenler uzayda aslında yüz milyonlarca kilometre uzaktadır; ancak Dünya’nın bakış açısıyla gece göğünde neredeyse birbirine değecek kadar yakın parıldarlar.
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Örnek: Venüs - Jüpiter</span>
                  <span className="text-paper/80">Dürbünle çok zarif</span>
                </div>
              </article>

              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-blue-400">Yörünge Zirvesi</span>
                  <AstronomicalEventGlyph type="super-ay" size={24} className="text-blue-400" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Süper Ay & Dolunay</h3>
                <p className="doc-serif text-lg text-blue-400/90 mb-3">Yerberi Işıltısı</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Ay’ın yörüngesi kusursuz bir daire değil, basık bir elipstir. Ay, Dünya’ya en yakın olduğu yerberi (Perigee - ~356.000 km) noktasındayken dolunay evresine ulaştığında standart dolunaylara kıyasla %14 daha büyük ve %30 daha parlak görünür.
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Yerberi: ~356.500 km</span>
                  <span className="text-paper/80">Güçlü gelgit etkisi</span>
                </div>
              </article>

              <article className="flex flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="doc-kicker text-lime">Mevsim Dönümleri</span>
                  <AstronomicalEventGlyph type="equinoks" size={24} className="text-lime" />
                </div>
                <h3 className="doc-title text-2xl text-paper mb-2">Ekinoks & Solstis</h3>
                <p className="doc-serif text-lg text-lime/90 mb-3">Dünya Eksen Eğikliği</p>
                <p className="text-sm leading-relaxed text-paper/75">
                  Dünya’nın 23.44 derecelik eksen eğikliği Güneş ışınlarının geliş açısını yıl boyunca değiştirir. 20 Mart ve 22 Eylül’de (Ekinoks) ışınlar ekvatora dik düşerek gece ve gündüzü eşitler. 20 Haziran ve 21 Aralık’ta (Solstis) ise en uzun gündüz veya gece yaşanır.
                </p>
                <div className="mt-auto border-t border-white/10 pt-4 flex justify-between text-xs text-muted font-mono">
                  <span>Eksen Eğikliği: 23° 26′</span>
                  <span className="text-paper/80">Kozmik takvim kökü</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <nav aria-label="Yıllara göre gök olayları" className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-muted">Yıl özetleri:</span>
            {EVENT_YEARS.map((y) => (
              <Link key={y} href={`/takvim/${y}`} className="border border-line px-3 py-2 text-paper/80 hover:border-solar hover:text-solar">{y} gök olayları</Link>
            ))}
          </div>
        </nav>

        {/* Calendar & Ephemeris FAQ Guide */}
        <FaqAccordion
          items={FAQS_BY_SECTION.takvim}
          title="Gök Olayları & Gözlem Rehberi"
          serif="sıkça sorulan sorular"
          kicker="Astronomi Takvimi · SSS"
          description="Meteor yağmurlarını en iyi izleme saatleri, tutulma güvenliği ve gezegen kavuşumları hakkında rehber."
          accentColor="var(--lime)"
        />
      </div>
    </div>
  );
}
