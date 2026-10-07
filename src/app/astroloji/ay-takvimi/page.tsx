import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { DOC_IMAGES } from '@/data/docImages';
import { SIGN_IDS, SIGN_IN } from '@/lib/astrology/dailySky';
import { LUNAR_CALENDAR_YEARS, MONTH_NAMES, mainPhasesBetween, monthSlug } from '@/lib/astrology/lunarCalendar';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

// "Yaklaşan evreler" ve bu ayın vurgusu günde bir yenilenir
export const revalidate = 86400;

export const metadata = buildPageMetadata({
  path: '/astroloji/ay-takvimi',
  title: 'Ay Takvimi: Aylara Göre Dolunay, Yeni Ay ve Ay Evreleri | SpaceTour TR',
  description: `${LUNAR_CALENDAR_YEARS[0]}–${LUNAR_CALENDAR_YEARS[LUNAR_CALENDAR_YEARS.length - 1]} Ay takvimi: her ay için dolunay, yeni Ay ve dördün saatleri, günlük Ay evresi ve Ay’ın burcu; İstanbul saatiyle.`,
});

const TZ = 'Europe/Istanbul';
const fmt = (d: Date) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ });

export default function LunarCalendarHub() {
  const now = new Date();
  const upcoming = mainPhasesBetween(now.getTime(), now.getTime() + 45 * 86_400_000).slice(0, 6);
  const [cy, cm] = now.toLocaleDateString('sv-SE', { timeZone: TZ }).split('-').map(Number);
  const current = monthSlug(cy, cm - 1);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Ay takvimi', url: '/astroloji/ay-takvimi' },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--primary, #38bdf8)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="04 · Ay"
        section="Ay takvimi"
        headline={['Ay', 'takvimi']}
        lede="Her ay için dolunay, yeni Ay ve dördün saatleri; her günün Ay evresi, aydınlık oranı ve Ay’ın burcu. Saatler İstanbul saatiyle."
        accent="var(--primary, #38bdf8)"
        image={DOC_IMAGES['astro-ay-evreleri']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: 'Ay takvimi' }]}
      />

      <section aria-label="Aylara göre Ay takvimi" className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            {LUNAR_CALENDAR_YEARS.map((year) => (
              <div key={year}>
                <h2 className="doc-title text-2xl text-paper">{year}</h2>
                <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 md:grid-cols-4">
                  {MONTH_NAMES.map((name, month) => {
                    const slug = monthSlug(year, month);
                    const isCurrent = slug === current;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/astroloji/ay-takvimi/${slug}`}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`flex items-center justify-between gap-2 border p-3 hover:border-gold hover:text-gold ${isCurrent ? 'border-gold text-gold' : 'border-line text-paper/85'}`}
                        >
                          {name} {year}
                          {isCurrent && <span className="text-xs font-medium">Bu ay</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5 text-sm">
              <div className="font-medium text-gold">Yaklaşan evreler</div>
              <ul className="mt-3 space-y-3">
                {upcoming.map((p) => (
                  <li key={p.at.toISOString()} className="flex items-start justify-between gap-3">
                    <span className="text-paper">{p.name}<span className="mt-0.5 block text-[13px] text-paper/70">{fmt(p.at)}</span></span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-paper/80"><ZodiacGlyph sign={SIGN_IDS[p.sign]} size={13} className="text-gold" />{SIGN_IN[p.sign]}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 text-sm">
              <Link href="/astroloji/ay-bugun" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Ay bugün hangi burçta? <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/ay-evreleri" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Ay evreleri ve ritüeller <ArrowUpRight size={14} /></Link>
              <Link href="/takvim" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Gök olayları takvimi <ArrowUpRight size={14} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
