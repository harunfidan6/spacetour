import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { events, eventTypeLabels, type AstronomicalEvent, type EventType } from '@/data/events';
import { eventSlug, eventBySlug, EVENT_YEARS } from '@/lib/eventSlug';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

// "Kaç gün kaldı" bilgisi güncel kalsın
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return [...EVENT_YEARS.map((y) => ({ slug: y })), ...events.map((e) => ({ slug: eventSlug(e) }))];
}

const VISIBILITY: Record<AstronomicalEvent['visibility'], string> = {
  'tüm-dünya': 'Dünyanın büyük bölümünden',
  'kuzey-yarıküre': 'Kuzey yarımküreden',
  'güney-yarıküre': 'Güney yarımküreden',
  türkiye: 'Türkiye’den',
};

const VISIBILITY_SHORT: Record<AstronomicalEvent['visibility'], string> = {
  'tüm-dünya': 'Tüm dünya',
  'kuzey-yarıküre': 'Kuzey',
  'güney-yarıküre': 'Güney',
  türkiye: 'Türkiye',
};

/** Olay türüne göre açıklama ve gözlem rehberi */
const GUIDE: Record<EventType, { what: string; how: string }> = {
  'gunes-tutulmasi': {
    what: 'Güneş tutulması, Ay’ın Dünya ile Güneş arasına girip Güneş’i kısmen ya da tamamen örtmesidir. Yalnızca yeni Ay evresinde ve Ay’ın yörüngesi ekliptiği kestiği noktalara yakınken olur; tam tutulmanın görüldüğü şerit genellikle birkaç yüz kilometre genişliğindedir.',
    how: 'Güneş’e asla çıplak gözle, güneş gözlüğüyle ya da filtresiz dürbün ve teleskopla bakmayın. ISO 12312-2 sertifikalı tutulma gözlüğü veya iğne deliği projeksiyonu kullanın. Yalnızca tam tutulmanın birkaç dakikalık tamlık evresinde filtre çıkarılabilir.',
  },
  'ay-tutulmasi': {
    what: 'Ay tutulması, dolunay sırasında Ay’ın Dünya’nın gölgesine girmesidir. Tam tutulmada Ay, Dünya atmosferinden kırılan kırmızı ışıkla aydınlandığı için bakır ya da kızıl bir renk alır; buna halk arasında “kanlı Ay” denir.',
    how: 'Ay tutulması çıplak gözle güvenle izlenir. Ay’ın ufkun üstünde olduğu saatleri kontrol edin; bir dürbün gölgenin kenarını ve renk geçişlerini çok daha belirgin gösterir.',
  },
  'meteor-yagmuru': {
    what: 'Meteor yağmuru, Dünya’nın bir kuyruklu yıldızın ya da asteroidin yörüngesinde bıraktığı toz bulutunun içinden geçmesidir. Bu parçacıklar atmosfere saniyede onlarca kilometre hızla girip yanarak gökyüzünde parlak izler bırakır.',
    how: 'Şehir ışıklarından uzak, karanlık bir yer seçin ve gözlerinizin 20–30 dakika karanlığa alışmasını bekleyin. Teleskop gerekmez; sırt üstü uzanıp gökyüzünün geniş bir bölümüne bakın. En verimli saatler genellikle gece yarısından sonradır.',
  },
  'gezegen-kavusumu': {
    what: 'Kavuşum, iki gök cisminin gökyüzünde birbirine çok yakın göründüğü andır. Aslında aralarında milyonlarca kilometre vardır; yalnızca Dünya’dan bakıldığında aynı doğrultuya düşerler.',
    how: 'Kavuşumlar genellikle çıplak gözle izlenebilir. Gün batımından sonra batı ufkuna ya da gün doğumundan önce doğu ufkuna bakın; bir dürbün iki cismi aynı görüş alanında gösterir.',
  },
  'super-ay': {
    what: 'Süper Ay, dolunayın Ay’ın Dünya’ya en yakın olduğu noktaya (perige) denk gelmesidir. Ay, en uzak dolunaya göre yaklaşık %14 daha büyük ve %30’a varan oranda daha parlak görünür.',
    how: 'En etkileyici görüntü, Ay ufuktan yeni doğarken yakalanır; yakındaki binalar veya ağaçlar Ay’ı daha büyük gösterir. Çıplak gözle güvenle izlenir.',
  },
  dolunay: {
    what: 'Dolunay, Ay’ın Güneş’in tam karşısına gelip Dünya’dan bakan yüzünün tamamen aydınlandığı evredir. Ay gün batımında doğar, gece boyunca gökyüzünde kalır ve gün doğumunda batar.',
    how: 'Dolunay çıplak gözle izlenir. Ay yüzeyindeki kraterleri görmek isteyenler için dolunay yerine ilk ve son dördün evreleri daha uygundur; dolunayda gölgeler kaybolur.',
  },
  'yeni-ay': {
    what: 'Yeni Ay, Ay’ın Güneş ile aynı doğrultuya gelip Dünya’dan bakan yüzünün karanlıkta kaldığı evredir. Ay bu sırada görünmez; gökyüzü yılın en karanlık gecelerini yaşar.',
    how: 'Yeni Ay geceleri derin uzay gözlemi için en iyi zamandır: Samanyolu, bulutsular ve sönük yıldız kümeleri Ay ışığı olmadığı için çok daha belirgin görünür.',
  },
  equinoks: {
    what: 'Ekinoks, Güneş’in gök ekvatorunu kestiği andır. Bu tarihlerde gece ile gündüz yeryüzünün her yerinde yaklaşık eşit sürer; ilkbahar ve sonbaharın astronomik başlangıcıdır.',
    how: 'Ekinoks günü Güneş tam doğudan doğar ve tam batıdan batar. Bu, ufuktaki doğu-batı yönünü belirlemek için iyi bir fırsattır.',
  },
  solstis: {
    what: 'Gündönümü (solstis), Güneş’in gök ekvatorundan en uzak noktaya ulaştığı andır. Haziran gündönümünde kuzey yarımkürede yılın en uzun günü, aralık gündönümünde en uzun gecesi yaşanır.',
    how: 'Gündönümü günlerinde öğle saatinde gölge boylarını karşılaştırmak, Güneş’in yıl içindeki yükseklik değişimini gözle görmenin kolay bir yoludur.',
  },
};

const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', timeZone: 'Europe/Istanbul' });
const daysLeft = (iso: string) => Math.round((Date.parse(`${iso}T12:00:00Z`) - Date.now()) / 86_400_000);

export async function generateMetadata(props: PageProps<'/takvim/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  if (EVENT_YEARS.includes(slug)) {
    return buildPageMetadata({
      path: `/takvim/${slug}`,
      title: `${slug} Gök Olayları Takvimi | SpaceTour TR`,
      description: `${slug} gök olayları: Güneş ve Ay tutulmaları, meteor yağmurları, süper Aylar, kavuşumlar, ekinoks ve gündönümleri; tarihleri ve Türkiye’den görünürlüğü.`,
    });
  }
  const e = eventBySlug(slug);
  if (!e) return { title: 'Olay bulunamadı', robots: { index: false } };
  const title = `${e.title} ${new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return buildPageMetadata({
    path: `/takvim/${slug}`,
    title: `${title} | SpaceTour TR`.length <= 60 ? `${title} | SpaceTour TR` : title,
    description: `${e.description} ${e.details}`.slice(0, 158),
  });
}

function YearPage({ year }: { year: string }) {
  const list = events.filter((e) => e.date.startsWith(year)).sort((a, b) => a.date.localeCompare(b.date));
  const months = [...new Set(list.map((e) => e.date.slice(5, 7)))];
  const monthName = (m: string) => new Date(`${year}-${m}-15T12:00:00Z`).toLocaleDateString('tr-TR', { month: 'long' });
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gök olayları takvimi', url: '/takvim' },
    { name: `${year} gök olayları`, url: `/takvim/${year}` },
  ]);
  return (
    <div style={{ '--page-accent': 'var(--solar)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="02 · Yıl"
        section={`Gök olayları takvimi · ${year}`}
        headline={[`${year}`, 'gök olayları']}
        lede={`${year} yılında ${list.length} gök olayı: tutulmalar, meteor yağmurları, süper Aylar, kavuşumlar, ekinoks ve gündönümleri. Tarihler İstanbul saatine göredir.`}
        accent="var(--solar)"
        image={DOC_IMAGES['sec-takvim']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Takvim', href: '/takvim' }, { label: year }]}
        meta={[
          { k: 'Toplam', v: list.length },
          { k: 'Tutulma', v: list.filter((e) => e.type.endsWith('tutulmasi')).length },
          { k: 'Meteor yağmuru', v: list.filter((e) => e.type === 'meteor-yagmuru').length },
          { k: 'Diğer', v: list.filter((e) => !e.type.endsWith('tutulmasi') && e.type !== 'meteor-yagmuru').length },
        ]}
      />
      <section aria-label={`${year} gök olayları`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          {months.map((m) => (
            <div key={m}>
              <h2 className="doc-title text-2xl capitalize text-paper">{monthName(m)}</h2>
              <ul className="mt-4 divide-y divide-line border border-line">
                {list.filter((e) => e.date.slice(5, 7) === m).map((e) => (
                  <li key={e.id}>
                    <Link href={`/takvim/${eventSlug(e)}`} className="flex flex-wrap items-center justify-between gap-3 bg-ink p-4 hover:bg-ink-2">
                      <span>
                        <span className="doc-kicker block text-gold">{eventTypeLabels[e.type]}</span>
                        <span className="mt-1 block text-paper">{e.title}</span>
                      </span>
                      <span className="font-mono text-xs text-muted">{fmtDate(e.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <nav aria-label="Diğer yıllar" className="flex flex-wrap gap-2 border-t border-line pt-6 font-mono text-xs">
            {EVENT_YEARS.filter((y) => y !== year).map((y) => (
              <Link key={y} href={`/takvim/${y}`} className="border border-line px-3 py-2 text-paper/80 hover:border-gold hover:text-gold">{y} gök olayları</Link>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}

export default async function TakvimSlugPage(props: PageProps<'/takvim/[slug]'>) {
  const { slug } = await props.params;
  if (EVENT_YEARS.includes(slug)) return <YearPage year={slug} />;
  const e = eventBySlug(slug);
  if (!e) notFound();
  const g = GUIDE[e.type];
  const left = daysLeft(e.date);
  const when = left > 1 ? `${left} gün kaldı` : left === 1 ? 'Yarın' : left === 0 ? 'Bugün' : 'Geçti';
  const year = e.date.slice(0, 4);
  const sameType = events.filter((x) => x.type === e.type && x.id !== e.id).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${e.title} · ${fmtDate(e.date)}`,
    about: eventTypeLabels[e.type],
    inLanguage: 'tr-TR',
    author: { '@type': 'Organization', name: 'SpaceTour TR', url: 'https://spacetour.com.tr' },
  };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gök olayları takvimi', url: '/takvim' },
    { name: `${year} gök olayları`, url: `/takvim/${year}` },
    { name: e.title, url: `/takvim/${slug}` },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--solar)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter={`02 · ${eventTypeLabels[e.type]}`}
        section={`${fmtDate(e.date)}${e.time ? ` · ${e.time}` : ''}`}
        headline={[e.title, year]}
        lede={e.description}
        accent="var(--solar)"
        image={DOC_IMAGES['sec-takvim']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Takvim', href: '/takvim' }, { label: year, href: `/takvim/${year}` }, { label: e.title }]}
        meta={[
          { k: 'Tarih', v: new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) },
          { k: 'Durum', v: when },
          { k: 'Görünürlük', v: VISIBILITY_SHORT[e.visibility] },
        ]}
      />
      <section aria-label={e.title} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <article className="border-b border-line pb-8">
              <span className="doc-kicker text-gold">Bu olayda</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">{e.title} nasıl gözlenir?</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{e.details}</p>
            </article>
            <article className="border-b border-line pb-8">
              <span className="doc-kicker text-gold">{eventTypeLabels[e.type]} nedir?</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">Gökyüzünde ne oluyor?</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{g.what}</p>
            </article>
            <article>
              <span className="doc-kicker text-gold">Gözlem rehberi</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">İpuçları</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{g.how}</p>
            </article>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5 font-mono text-xs">
              <div className="doc-kicker text-gold">Tarih</div>
              <div className="doc-title mt-2 text-2xl text-paper">{when}</div>
              <div className="mt-1 text-paper/75">{fmtDate(e.date)}{e.time ? ` · ${e.time}` : ''}</div>
              <div className="mt-3 text-muted">{VISIBILITY[e.visibility]} görülebilir.</div>
            </div>
            {sameType.length > 0 && (
              <div className="border border-line bg-ink-2 p-5 font-mono text-xs">
                <div className="doc-kicker text-gold">Diğer {eventTypeLabels[e.type].toLocaleLowerCase('tr-TR')} tarihleri</div>
                <ul className="mt-3 space-y-2">
                  {sameType.map((x) => (
                    <li key={x.id}><Link href={`/takvim/${eventSlug(x)}`} className="flex justify-between gap-3 text-paper/85 hover:text-gold"><span>{x.title}</span><span className="shrink-0 text-muted">{x.date.split('-').reverse().join('.')}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2 font-mono text-xs">
              <Link href={`/takvim/${year}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{year} gök olaylarının tamamı <ArrowUpRight size={14} /></Link>
              <Link href="/takvim" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Etkileşimli takvim <ArrowUpRight size={14} /></Link>
              <Link href="/canli/bu-gece" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Bu gece gökyüzünde <ArrowUpRight size={14} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
