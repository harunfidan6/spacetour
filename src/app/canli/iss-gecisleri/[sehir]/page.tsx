import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { ISS_CITIES, brightness, compass, compassName, fetchIssTle, issCityBySlug, visiblePasses, type IssPass } from '@/lib/issPasses';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { timeLocative } from '@/lib/text';

// Geçişler saatte bir yeniden hesaplanır; yörünge elemanları 6 saatte bir yenilenir
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return ISS_CITIES.map((c) => ({ sehir: c.slug }));
}

const TZ = 'Europe/Istanbul';
const DAYS = 10;
const fmtDay = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', timeZone: TZ });
const fmtShortDay = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short', timeZone: TZ });
const fmtDayMonth = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: TZ });
const fmtTime = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const duration = (p: IssPass) => {
  const s = Math.max(20, Math.round((p.end.getTime() - p.start.getTime()) / 1000));
  return s >= 60 ? `${Math.floor(s / 60)} dk ${s % 60 ? `${s % 60} sn` : ''}`.trim() : `${s} sn`;
};
const passSentence = (p: IssPass) =>
  `${fmtDay(p.start)} saat ${timeLocative(fmtTime(p.start), '’')} ${compassName(p.startAz)} ufkunda belirip ${Math.round(p.maxEl)}° yüksekliğe çıkacak ve ${duration(p)} sonra ${compassName(p.endAz)} yönünde kaybolacak`;

export async function generateMetadata(props: PageProps<'/canli/iss-gecisleri/[sehir]'>): Promise<Metadata> {
  const { sehir } = await props.params;
  const city = issCityBySlug(sehir);
  if (!city) return { title: 'Şehir bulunamadı', robots: { index: false } };
  return buildPageMetadata({
    path: `/canli/iss-gecisleri/${city.slug}`,
    title: `ISS ${city.from} Ne Zaman Görünür? Geçiş Saatleri | SpaceTour TR`,
    description: `Uluslararası Uzay İstasyonu’nun ${city.from} çıplak gözle görülebilecek geçişleri: önümüzdeki ${DAYS} günün saatleri, yönleri ve yükseklikleri. Saatte bir güncellenir.`,
  });
}

export default async function IssCityPage(props: PageProps<'/canli/iss-gecisleri/[sehir]'>) {
  const { sehir } = await props.params;
  const city = issCityBySlug(sehir);
  if (!city) notFound();

  const now = new Date();
  const tle = await fetchIssTle();
  const passes = tle ? visiblePasses(tle, city, now, DAYS) : [];
  const next = passes[0];
  const tleAgeDays = tle ? (now.getTime() - tle.epoch.getTime()) / 86_400_000 : null;

  const faq = [
    {
      q: `ISS ${city.from} ne zaman görünür?`,
      a: next
        ? `Bir sonraki görünür geçiş: ${passSentence(next)}. Önümüzdeki ${DAYS} günde toplam ${passes.length} görünür geçiş var; tamamı tabloda.`
        : `Önümüzdeki ${DAYS} gün içinde ${city.from} görünür bir geçiş yok. İstasyon yaklaşık iki haftalık dönemlerle akşam ya da sabah gökyüzünde görünür; sayfa saatte bir güncellenir.`,
    },
    {
      q: 'ISS gökyüzünde nasıl görünür?',
      a: 'Yanıp sönmeyen, sabit hızla ilerleyen çok parlak bir yıldız gibi görünür; en parlak anında Venüs’e yakın parlaklığa ulaşır. Uçaklar gibi renkli ışıkları yoktur ve bir ufuktan diğerine birkaç dakikada geçer. Teleskop ya da dürbün gerekmez.',
    },
    {
      q: 'Neden her gece görünmüyor?',
      a: 'İstasyonun görülebilmesi için gökyüzünün karanlık olması ama istasyonun hâlâ Güneş ışığı alması gerekir. Bu yüzden geçişler gün batımından sonraki ve gün doğumundan önceki birkaç saate denk gelir; gece yarısına doğru istasyon Dünya’nın gölgesine girer ve kaybolur.',
    },
    {
      q: 'Saatler nasıl hesaplanıyor?',
      a: 'NORAD’ın yayımladığı güncel yörünge elemanlarıyla (TLE) istasyonun konumu SGP4 modeliyle hesaplanır. Ufkun 10° üzerinde, gökyüzünün karanlık (Güneş −6°’nin altında) ve istasyonun Güneş ışığında olduğu anlar listelenir. Saatler İstanbul saatiyle; istasyon yörünge düzeltmesi yaparsa saatler bir iki dakika kayabilir.',
    },
  ];
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Canlı Gökyüzü', url: '/canli' },
    { name: 'ISS geçişleri', url: '/canli/iss-gecisleri' },
    { name: city.name, url: `/canli/iss-gecisleri/${city.slug}` },
  ]);

  return (
    // data-generated: yönetici panelindeki günlük içerik denetimi sayfanın üretildiği anı buradan okur
    <div style={{ '--page-accent': 'var(--lime)' } as CSSProperties} className="relative" data-generated={now.toISOString()} data-tle={tle ? 'ok' : 'yok'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="06 · Canlı"
        section={`ISS geçişleri · ${city.name}`}
        headline={['ISS', `${city.from} ne zaman görünür?`]}
        lede={
          next
            ? `Bir sonraki görünür geçiş: ${passSentence(next)}.`
            : tle
              ? `Önümüzdeki ${DAYS} gün içinde ${city.from} görünür geçiş yok; istasyon bir sonraki görünür döneminde akşam ya da sabah gökyüzüne dönecek.`
              : 'Yörünge verisi şu an alınamadı; sayfa kısa süre içinde yeniden denenecek.'
        }
        accent="var(--lime)"
        image={DOC_IMAGES['canli-iss']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Canlı', href: '/canli' }, { label: 'ISS geçişleri', href: '/canli/iss-gecisleri' }, { label: city.name }]}
        meta={[
          { k: `${DAYS} günde geçiş`, v: String(passes.length) },
          { k: 'Sıradaki', v: next ? `${fmtDayMonth(next.start)} ${fmtTime(next.start)}` : '—' },
          { k: 'En yüksek', v: passes.length ? `${Math.round(Math.max(...passes.map((p) => p.maxEl)))}°` : '—' },
          { k: 'Güncelleme', v: fmtTime(now) },
        ]}
      />

      <section aria-label={`ISS ${city.from} görünür geçişler`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div>
              <h2 className="doc-title text-2xl text-paper">Önümüzdeki {DAYS} günün görünür geçişleri</h2>
              <p className="mt-2 text-sm text-paper/70">
                Saatler İstanbul saatiyle. Yönler: K kuzey, D doğu, G güney, B batı. Yükseklik ufuktan derece cinsinden (90° tam tepe).
              </p>
              {passes.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[38rem] border border-line font-mono text-xs">
                    <thead>
                      <tr className="bg-ink-2 text-left text-muted">
                        <th className="p-3 font-normal">Tarih</th>
                        <th className="p-3 font-normal">Belirir</th>
                        <th className="p-3 font-normal">En yüksek</th>
                        <th className="p-3 font-normal">Kaybolur</th>
                        <th className="p-3 font-normal">Süre</th>
                        <th className="p-3 font-normal">Parlaklık</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passes.map((p) => {
                        const b = brightness(p);
                        return (
                          <tr key={p.start.toISOString()} className="border-t border-line">
                            <td className="p-3 text-paper/85 whitespace-nowrap">{fmtShortDay(p.start)}</td>
                            <td className="p-3 text-paper whitespace-nowrap">{fmtTime(p.start)} <span className="text-muted">{compass(p.startAz)}</span></td>
                            <td className="p-3 text-paper whitespace-nowrap">{fmtTime(p.max)} <span className="text-muted">{Math.round(p.maxEl)}°</span></td>
                            <td className="p-3 text-paper whitespace-nowrap">{fmtTime(p.end)} <span className="text-muted">{compass(p.endAz)}</span></td>
                            <td className="p-3 text-paper/75 whitespace-nowrap">{duration(p)}</td>
                            <td className={`p-3 whitespace-nowrap ${b.tone === 'high' ? 'text-lime' : b.tone === 'mid' ? 'text-paper/85' : 'text-muted'}`}>{b.label}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 border border-line bg-ink-2 p-4 text-sm text-paper/80">
                  {tle
                    ? `Önümüzdeki ${DAYS} gün içinde ${city.from} çıplak gözle görülebilecek bir geçiş yok. İstasyon bu dönemde ya gündüz ya da Dünya’nın gölgesindeyken geçiyor.`
                    : 'Yörünge verisi şu an alınamadı. Sayfa saatte bir yeniden denenir; canlı konum için ISS takip sayfasına bakabilirsin.'}
                </p>
              )}
            </div>

            <div>
              <h2 className="doc-title text-2xl text-paper">Nasıl izlenir?</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-paper/85">
                <li>Geçişten birkaç dakika önce dışarı çık; tablodaki “Belirir” yönüne dön.</li>
                <li>İstasyon ufkun biraz üzerinde, yanıp sönmeyen parlak bir nokta olarak belirir ve gökyüzünü birkaç dakikada boydan boya geçer.</li>
                <li>En yüksek noktası 40°’nin üzerindeyse şehir ışıklarında bile kolayca görülür; alçak geçişlerde binalar ve ağaçlar görüşü kapatabilir.</li>
                <li>Bazı geçişler gökyüzünün ortasında aniden söner: istasyon o an Dünya’nın gölgesine girmiştir.</li>
              </ol>
            </div>

            <div>
              <h2 className="doc-title text-2xl text-paper">Sık sorulanlar</h2>
              <dl className="mt-4 space-y-4">
                {faq.map((f) => (
                  <div key={f.q} className="border border-line bg-ink p-4">
                    <dt className="text-sm font-semibold text-paper">{f.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-paper/75">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5 font-mono text-xs">
              <div className="doc-kicker text-lime">Diğer şehirler</div>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {ISS_CITIES.filter((c) => c.slug !== city.slug).map((c) => (
                  <li key={c.slug}><Link href={`/canli/iss-gecisleri/${c.slug}`} className="text-paper/85 hover:text-lime">{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <Link href="/canli/iss" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-lime hover:text-lime">ISS canlı konum <ArrowUpRight size={14} /></Link>
              <Link href="/canli/bu-gece" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-lime hover:text-lime">Bu gece gökyüzü <ArrowUpRight size={14} /></Link>
              <Link href="/canli/iss-gecisleri" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-lime hover:text-lime">Tüm şehirler <ArrowUpRight size={14} /></Link>
            </div>
            {tle && (
              <p className="font-mono text-[11px] leading-relaxed text-muted">
                Yörünge verisi: {tle.source}, {Math.max(0, tleAgeDays ?? 0).toFixed(1)} gün önce ölçüldü. Geçişler {fmtTime(now)} itibarıyla hesaplandı.
              </p>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
