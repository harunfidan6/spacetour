import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { DOC_IMAGES } from '@/data/docImages';
import { events } from '@/data/events';
import { eventSlug } from '@/lib/eventSlug';
import { SIGN_IDS, SIGN_NAMES, SIGN_IN } from '@/lib/astrology/dailySky';
import { allLunarMonths, lunarMonth, parseMonthSlug, MONTH_NAMES, type MainPhase } from '@/lib/astrology/lunarCalendar';
import { numberLocative, timeLocative } from '@/lib/text';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return allLunarMonths().map((m) => ({ ay: m.slug }));
}

const TZ = 'Europe/Istanbul';
const fmtDateTime = (d: Date) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ });
const fmtDay = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: TZ });
const fmtTime = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const fmtWeekday = (d: Date) => d.toLocaleDateString('tr-TR', { weekday: 'short', timeZone: TZ });

const phaseLine = (p: MainPhase) => `${p.name} ${fmtDay(p.at)} ${timeLocative(fmtTime(p.at), '’')} ${SIGN_IN[p.sign]}`;
// "Ekim 2026’da", "Ekim 2027’de"
const inMonth = (month: number, year: number) => `${MONTH_NAMES[month]} ${numberLocative(year, '’')}`;

export async function generateMetadata(props: PageProps<'/astroloji/ay-takvimi/[ay]'>): Promise<Metadata> {
  const { ay } = await props.params;
  const parsed = parseMonthSlug(ay);
  if (!parsed) return { title: 'Ay takvimi bulunamadı', robots: { index: false } };
  const m = lunarMonth(parsed.year, parsed.month);
  const full = m.phases.find((p) => p.key === 'full');
  const newMoon = m.phases.find((p) => p.key === 'new');
  return buildPageMetadata({
    path: `/astroloji/ay-takvimi/${ay}`,
    title: `${m.name} Ay Takvimi: Dolunay, Yeni Ay ve Ay Evreleri | SpaceTour TR`,
    description: `${m.name} Ay takvimi: ${[newMoon, full].filter(Boolean).map((p) => phaseLine(p!)).join(', ')}. Her günün Ay evresi, aydınlık oranı ve Ay’ın burcu; İstanbul saatiyle.`.slice(0, 158),
  });
}

export default async function LunarMonthPage(props: PageProps<'/astroloji/ay-takvimi/[ay]'>) {
  const { ay } = await props.params;
  const parsed = parseMonthSlug(ay);
  if (!parsed) notFound();
  const m = lunarMonth(parsed.year, parsed.month);

  const months = allLunarMonths();
  const index = months.findIndex((x) => x.slug === m.slug);
  const prev = months[index - 1];
  const next = months[index + 1];
  const monthPrefix = `${m.year}-${String(m.month + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((e) => e.date.startsWith(monthPrefix));

  const full = m.phases.filter((p) => p.key === 'full');
  const newMoons = m.phases.filter((p) => p.key === 'new');
  const signDays = SIGN_IDS.map((_, i) => ({ sign: i, days: m.days.filter((d) => d.sign === i) })).filter((x) => x.days.length > 0);
  const firstSignOrder = [...signDays].sort((a, b) => a.days[0].date.getTime() - b.days[0].date.getTime());

  const inM = inMonth(m.month, m.year);
  const faq = [
    {
      q: `${inM} dolunay ne zaman?`,
      a: full.length
        ? full.map((p) => `Dolunay ${fmtDateTime(p.at)} (İstanbul saati) gerçekleşiyor; Ay o sırada ${SIGN_NAMES[p.sign]} burcunda.`).join(' ') + (full.length > 1 ? ' Bu ay iki dolunay var; ikincisi halk arasında “Mavi Ay” olarak anılır.' : '')
        : `${inM} dolunay yok; ay, bir önceki ve sonraki dolunayın arasına düşüyor.`,
    },
    {
      q: `${inM} yeni Ay ne zaman?`,
      a: newMoons.length
        ? newMoons.map((p) => `Yeni Ay ${fmtDateTime(p.at)} (İstanbul saati), ${SIGN_NAMES[p.sign]} burcunda.`).join(' ') + ' Yeni Ay’a yakın geceler Ay ışığı olmadığı için gökyüzü gözlemi ve Samanyolu fotoğrafçılığı için en uygun zamandır.'
        : `${inM} yeni Ay yok.`,
    },
    {
      q: `${inM} Ay hangi burçlarda?`,
      a: `Ay her burçta yaklaşık 2,5 gün kalır. ${m.name} boyunca sırasıyla ${firstSignOrder.map((s) => SIGN_NAMES[s.sign]).join(', ')} burçlarından geçiyor. Günlere göre burçlar ve geçiş saatleri tabloda.`,
    },
    {
      q: 'Saatler hangi saat dilimine göre?',
      a: 'Tüm saatler İstanbul saatiyle (UTC+3) ve Türkiye’nin her yeri için geçerlidir. Evre anları Ay ile Güneş arasındaki açıdan hesaplanır; birkaç dakikalık hata payı olabilir.',
    },
  ];
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Ay takvimi', url: '/astroloji/ay-takvimi' },
    { name: m.name, url: `/astroloji/ay-takvimi/${m.slug}` },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--primary, #38bdf8)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="04 · Ay"
        section={`Ay takvimi · ${m.name}`}
        headline={[MONTH_NAMES[m.month], `${m.year} Ay takvimi`]}
        lede={`${m.phases.map(phaseLine).join('; ')}. Aşağıda her günün evresi, aydınlık oranı ve Ay’ın burcu var; saatler İstanbul saatiyle.`}
        accent="var(--primary, #38bdf8)"
        image={DOC_IMAGES['astro-ay-evreleri']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: 'Ay takvimi', href: '/astroloji/ay-takvimi' }, { label: m.name }]}
        meta={m.phases.slice(0, 4).map((p) => ({ k: p.name, v: `${fmtDay(p.at)} ${fmtTime(p.at)}` }))}
      />

      <section aria-label={`${m.name} Ay takvimi`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div>
              <h2 className="doc-title text-2xl text-paper">Ana evreler</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {m.phases.map((p) => (
                  <div key={p.at.toISOString()} className="border border-line bg-ink-2 p-4">
                    <div className="text-sm font-medium text-gold">{p.name}</div>
                    <div className="mt-2 text-base text-paper">{fmtDateTime(p.at)}</div>
                    <div className="mt-1 inline-flex items-center gap-2 text-sm text-paper/80"><ZodiacGlyph sign={SIGN_IDS[p.sign]} size={14} className="text-gold" />Ay {SIGN_IN[p.sign]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="doc-title text-2xl text-paper">Gün gün Ay</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-paper/80">Evre ve aydınlık oranı günün öğlen saatine göre. Ay o gün burç değiştiriyorsa geçtiği burç ve saat yazılı.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border border-line text-sm">
                  <thead>
                    <tr className="bg-ink-2 text-left text-paper/70">
                      <th className="p-3 font-medium">Gün</th>
                      <th className="p-3 font-medium">Evre</th>
                      <th className="hidden p-3 font-medium sm:table-cell">Aydınlık</th>
                      <th className="p-3 font-medium">Ay’ın burcu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.days.map((d) => (
                      <tr key={d.day} className={`border-t border-line ${d.mainPhase ? 'bg-gold/5' : ''}`}>
                        <td className="p-3 text-paper/85 sm:whitespace-nowrap">{fmtDay(d.date)} <span className="block text-paper/70 sm:inline">{fmtWeekday(d.date)}</span></td>
                        <td className="p-3 text-paper/80">
                          {d.mainPhase ? <span className="text-gold">{d.mainPhase.name} · {fmtTime(d.mainPhase.at)}</span> : d.phaseName}
                          <span className="block text-[13px] tabular-nums text-paper/70 sm:hidden">%{Math.round(d.illumination * 100)} aydınlık</span>
                        </td>
                        <td className="hidden p-3 tabular-nums text-paper/80 sm:table-cell">%{Math.round(d.illumination * 100)}</td>
                        <td className="p-3 text-paper">
                          <span className="inline-flex items-center gap-2"><ZodiacGlyph sign={SIGN_IDS[d.startSign]} size={14} className="text-gold" />{SIGN_NAMES[d.startSign]}</span>
                          {d.ingress && (
                            <span className="ml-2 inline-flex items-center gap-2 text-paper/80">→ <ZodiacGlyph sign={SIGN_IDS[d.ingress.sign]} size={14} className="text-gold" />{SIGN_NAMES[d.ingress.sign]} <span className="tabular-nums text-paper/70">{fmtTime(d.ingress.at)}</span></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="doc-title text-2xl text-paper">Sık sorulanlar</h2>
              <dl className="mt-4 space-y-4">
                {faq.map((f) => (
                  <div key={f.q} className="border border-line bg-ink p-4">
                    <dt className="text-base font-semibold text-paper">{f.q}</dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-paper/80">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav aria-label="Diğer aylar" className="flex items-center justify-between gap-3 text-sm">
              {prev ? (
                <Link href={`/astroloji/ay-takvimi/${prev.slug}`} className="flex items-center gap-2 border border-line p-3 text-paper/85 hover:border-gold hover:text-gold"><ArrowLeft size={14} />{MONTH_NAMES[prev.month]} {prev.year}</Link>
              ) : <span />}
              {next && (
                <Link href={`/astroloji/ay-takvimi/${next.slug}`} className="flex items-center gap-2 border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{MONTH_NAMES[next.month]} {next.year}<ArrowRight size={14} /></Link>
              )}
            </nav>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            {monthEvents.length > 0 && (
              <div className="border border-line bg-ink-2 p-5 text-sm">
                <div className="font-medium text-gold">{m.name} gök olayları</div>
                <ul className="mt-3 space-y-2">
                  {monthEvents.map((e) => (
                    <li key={e.id}><Link href={`/takvim/${eventSlug(e)}`} className="flex justify-between gap-3 text-paper/85 hover:text-gold"><span>{e.title}</span><span className="shrink-0 text-paper/70">{new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <Link href="/astroloji/ay-bugun" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Ay bugün hangi burçta? <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/ay-takvimi" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Tüm aylar <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/ay-evreleri" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Ay evreleri ve ritüeller <ArrowUpRight size={14} /></Link>
              <Link href={`/takvim/${m.year}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{m.year} gök olayları <ArrowUpRight size={14} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

