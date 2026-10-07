import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { ISS_CITIES, compass, fetchIssTle, visiblePasses } from '@/lib/issPasses';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = buildPageMetadata({
  path: '/canli/iss-gecisleri',
  title: 'ISS Ne Zaman Görünür? Türkiye’de Şehir Şehir Geçiş Saatleri | SpaceTour TR',
  description: 'Uluslararası Uzay İstasyonu’nun İstanbul, Ankara, İzmir ve 13 şehirden çıplak gözle görülebilecek geçişleri: saat, yön ve yükseklik. Saatte bir güncellenir.',
});

const TZ = 'Europe/Istanbul';
const fmt = (d: Date) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ });

export default async function IssPassesHub() {
  const now = new Date();
  const tle = await fetchIssTle();
  const rows = ISS_CITIES.map((city) => {
    const passes = tle ? visiblePasses(tle, city, now, 10) : [];
    return { city, next: passes[0], count: passes.length };
  });
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Canlı Gökyüzü', url: '/canli' },
    { name: 'ISS geçişleri', url: '/canli/iss-gecisleri' },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--lime)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        section="ISS geçişleri"
        headline={['ISS', 'ne zaman görünür?']}
        lede="Uluslararası Uzay İstasyonu gün batımından sonra ve gün doğumundan önce, yanıp sönmeyen parlak bir yıldız gibi gökyüzünü birkaç dakikada geçer. Şehrini seç, önümüzdeki 10 günün görünür geçişlerini gör."
        accent="var(--lime)"
        image={DOC_IMAGES['canli-iss']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Canlı', href: '/canli' }, { label: 'ISS geçişleri' }]}
      />

      <section aria-label="Şehirlere göre ISS geçişleri" className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="doc-title text-2xl text-paper">Şehirler ve sıradaki görünür geçiş</h2>
            {!tle && <p className="mt-4 border border-line bg-ink-2 p-4 text-[15px] leading-relaxed text-paper/85">Yörünge verisi şu an alınamadı; sayfa saatte bir yeniden denenir.</p>}
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {rows.map(({ city, next, count }) => (
                <li key={city.slug}>
                  <Link href={`/canli/iss-gecisleri/${city.slug}`} className="flex items-center justify-between gap-3 border border-line p-3 hover:border-lime">
                    <span>
                      <span className="block text-base font-medium text-paper">{city.name}</span>
                      <span className="mt-0.5 block text-[13px] tabular-nums text-paper/70">{tle ? (next ? `${fmt(next.start)} · ${compass(next.startAz)} → ${compass(next.endAz)} · ${Math.round(next.maxEl)}°` : '10 gün içinde görünür geçiş yok') : '—'}</span>
                    </span>
                    {tle && <span className="shrink-0 tabular-nums text-lime">{count} geçiş</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <aside className="space-y-2 text-sm lg:col-span-4">
            <Link href="/canli/iss" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-lime hover:text-lime">ISS canlı konum <ArrowUpRight size={14} /></Link>
            <Link href="/canli/bu-gece" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-lime hover:text-lime">Bu gece gökyüzü <ArrowUpRight size={14} /></Link>
            <p className="pt-2 text-[13px] leading-relaxed text-paper/70">Geçişler NORAD yörünge elemanlarıyla SGP4 modeliyle hesaplanır; saatler İstanbul saatiyle.</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
