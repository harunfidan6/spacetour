import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { retrogradeCalendar } from '@/lib/astrology/retrogradeCalendar';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

const PLANETS = [
  { slug: 'merkur', glyph: 'merkur', name: 'Merkür', about: 'iletişim, yazışmalar, ulaşım, teknoloji ve sözleşmeler' },
  { slug: 'venus', glyph: 'venus', name: 'Venüs', about: 'ilişkiler, değerler, para ve estetik' },
  { slug: 'mars', glyph: 'mars', name: 'Mars', about: 'enerji, motivasyon, rekabet ve öfke' },
  { slug: 'jupiter', glyph: 'jupiter', name: 'Jüpiter', about: 'büyüme, inançlar, eğitim ve şans' },
  { slug: 'saturn', glyph: 'saturn', name: 'Satürn', about: 'sorumluluk, yapılar, kariyer ve sınırlar' },
] as const;
const YEARS = ['2026', '2027'];

export function generateStaticParams() {
  return PLANETS.flatMap((p) => YEARS.map((y) => ({ donem: `${p.slug}-${y}` })));
}

function parse(donem: string) {
  const m = donem.match(/^([a-z]+)-(\d{4})$/);
  const planet = m && PLANETS.find((p) => p.slug === m[1]);
  return planet && YEARS.includes(m![2]) ? { planet, year: m![2] } : null;
}

/** O yıla değen retro dönemleri (gerçek gök hesabı; yıl ortası referansıyla iki yıllık pencere) */
function cyclesFor(glyph: string, year: string) {
  return retrogradeCalendar(new Date(`${year}-07-01T00:00:00Z`)).filter(
    (c) => c.planetGlyphKey === glyph && (c.startDate.startsWith(year) || c.endDate.startsWith(year)),
  );
}

const fmt = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export async function generateMetadata(props: PageProps<'/astroloji/retrolar/[donem]'>): Promise<Metadata> {
  const { donem } = await props.params;
  const p = parse(donem);
  if (!p) return { title: 'Bulunamadı', robots: { index: false } };
  const cycles = cyclesFor(p.planet.glyph, p.year);
  const dates = cycles.map((c) => `${fmt(c.startDate)} – ${fmt(c.endDate)}`).join('; ');
  return buildPageMetadata({
    path: `/astroloji/retrolar/${donem}`,
    title: `${p.planet.name} Retrosu ${p.year}: Tarihler ve Etkileri | SpaceTour TR`,
    description: `${p.planet.name} retrosu ${p.year} ne zaman? ${dates || 'Bu yıl retro dönemi yok'}. Gölge dönemleri, burçlar ve bu dönemde yapılacaklar.`.slice(0, 158),
  });
}

export default async function RetroDonemPage(props: PageProps<'/astroloji/retrolar/[donem]'>) {
  const { donem } = await props.params;
  const p = parse(donem);
  if (!p) notFound();
  const { planet, year } = p;
  const cycles = cyclesFor(planet.glyph, year);
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });

  const faq = [
    {
      q: `${planet.name} retrosu ${year} ne zaman?`,
      a: cycles.length
        ? `${year} yılında ${planet.name} ${cycles.length} kez geri harekete geçiyor: ${cycles.map((c) => `${fmt(c.startDate)} – ${fmt(c.endDate)}`).join('; ')}.`
        : `${year} yılında ${planet.name} geri harekete geçmiyor.`,
    },
    { q: `${planet.name} retrosu nedir?`, a: `Dünya ile ${planet.name} yörüngelerinde farklı hızlarla ilerlerken ${planet.name}, gökyüzünde bir süre yıldızlara göre geriye doğru gidiyormuş gibi görünür. Gezegen gerçekte geri gitmez; bu, bakış açısından kaynaklanan bir görünüştür. Astrolojide bu dönemler ${planet.about} konularında yavaşlama ve gözden geçirme zamanı olarak yorumlanır.` },
    { q: 'Gölge dönemi nedir?', a: 'Retrodan önceki gölge, gezegenin retro sırasında geri döneceği dereceleri ilk kez geçtiği dönemdir; sonraki gölge ise retro bittikten sonra bu dereceleri yeniden geçip aştığı süredir. Etkilerin bu aralıkta hafifçe hissedildiği kabul edilir.' },
  ];
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Gezegen retroları', url: '/astroloji/retrolar' },
    { name: `${planet.name} retrosu ${year}`, url: `/astroloji/retrolar/${donem}` },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--violet)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="04 · Retro"
        section={`Gezegen retroları · ${year}`}
        headline={[`${planet.name} retrosu`, year]}
        lede={faq[0].a}
        accent="var(--violet)"
        image={DOC_IMAGES['astro-retrolar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: 'Retrolar', href: '/astroloji/retrolar' }, { label: `${planet.name} ${year}` }]}
        meta={[
          { k: 'Retro sayısı', v: cycles.length },
          { k: 'Alanlar', v: planet.about },
        ]}
      />
      <section aria-label={`${planet.name} retrosu ${year}`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            {cycles.length === 0 && <p className="text-base leading-relaxed text-paper/85">{faq[0].a}</p>}
            {cycles.map((c, i) => {
              const active = today >= c.startDate && today <= c.endDate;
              return (
                <article key={c.id} className="border border-line bg-ink-2 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gold">{cycles.length > 1 ? `${i + 1}. retro` : 'Retro dönemi'}</span>
                    {/* Durum rozeti: işlevsel, ama büyük harfli mono yerine okunur boyutta */}
                    {active && <span className="border border-violet/50 bg-violet/10 px-2 py-0.5 text-xs font-medium text-violet">Şu an retroda</span>}
                  </div>
                  <h2 className="doc-title mt-2 text-2xl text-paper">{fmt(c.startDate)} – {fmt(c.endDate)}</h2>
                  <dl className="mt-4 grid gap-4 text-[15px] sm:grid-cols-2">
                    <div><dt className="text-sm text-paper/70">Burç aralığı</dt><dd className="mt-1 text-paper">{c.signRange}</dd></div>
                    <div><dt className="text-sm text-paper/70">Element</dt><dd className="mt-1 text-paper">{c.elementFocus}</dd></div>
                    <div><dt className="text-sm text-paper/70">Önceki gölge</dt><dd className="mt-1 text-paper">{fmt(c.preShadowStart)} – {fmt(c.startDate)}</dd></div>
                    <div><dt className="text-sm text-paper/70">Sonraki gölge</dt><dd className="mt-1 text-paper">{fmt(c.endDate)} – {fmt(c.postShadowEnd)}</dd></div>
                  </dl>
                  {c.coreThemes.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {c.coreThemes.map((t) => <li key={t} className="border border-line px-3 py-1 text-sm text-paper/85">{t}</li>)}
                    </ul>
                  )}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-base font-semibold text-lime">Yapılacaklar</h3>
                      <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">{c.guidance.whatToDo.map((t) => <li key={t}>+ {t}</li>)}</ul>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-rose">Kaçınılacaklar</h3>
                      <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">{c.guidance.whatToAvoid.map((t) => <li key={t}>− {t}</li>)}</ul>
                    </div>
                  </div>
                  <p className="mt-5 border-l-2 border-gold pl-3 text-base leading-relaxed text-paper/85">{c.guidance.cosmicLesson}</p>
                </article>
              );
            })}
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
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <nav aria-label="Diğer retrolar" className="border border-line bg-ink-2 p-5 text-sm">
              <div className="font-medium text-gold">Diğer retro takvimleri</div>
              <ul className="mt-3 space-y-2">
                {PLANETS.flatMap((x) => YEARS.map((y) => ({ x, y }))).filter(({ x, y }) => !(x.slug === planet.slug && y === year)).map(({ x, y }) => (
                  <li key={`${x.slug}-${y}`}><Link href={`/astroloji/retrolar/${x.slug}-${y}`} className="text-paper/85 hover:text-gold">{x.name} retrosu {y}</Link></li>
                ))}
              </ul>
            </nav>
            <Link href="/astroloji/retrolar" className="flex items-center justify-between border border-line p-3 text-sm text-paper/85 hover:border-gold hover:text-gold">Etkileşimli retro radarı <ArrowUpRight size={14} /></Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
