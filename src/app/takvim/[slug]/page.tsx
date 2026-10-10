import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { events, eventTypeLabels, type AstronomicalEvent, type EventType } from '@/data/events';
import { eventSlug, eventBySlug, EVENT_YEARS } from '@/lib/eventSlug';
import { eventBodies, eventLunarMonth } from '@/lib/eventLinks';
import { buildPageMetadata, getArticleJsonLd, getBreadcrumbJsonLd, getFaqPageJsonLd, CONTENT_DATES } from '@/lib/seo';
import { compassName, lunationDetail, meteorDetail, type LunationDetail, type MeteorDetail } from '@/lib/eventDetail';
import { FULL_MOON_HOUSE, NEW_MOON_HOUSE } from '@/data/lunationHouses';
import { SIGN_IDS, SIGN_NAMES } from '@/lib/astrology/dailySky';

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
const TZ = 'Europe/Istanbul';
const clock = (ms: number) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const dayClock = (ms: number) => `${new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: TZ })} ${clock(ms)}`;
const eveningLabel = (ms: number) => new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', timeZone: TZ });
const LUNAR = ['dolunay', 'super-ay'];

/** Meteor yağmuru ve dolunay / yeni Ay için soru-cevaplar (hesaplanmış değerlerle) */
function eventFaq(e: AstronomicalEvent, m: MeteorDetail | null, l: LunationDetail | null, dateText: string) {
  const year = e.date.slice(0, 4);
  if (m) {
    const name = e.title.replace(/ Zirvesi$/, '');
    return [
      { question: `${name} ${year} ne zaman?`, answer: `Zirve ${dateText} gecesi bekleniyor. Yağmur zirveden birkaç gün önce başlar ve birkaç gün sonra biter; zirve gecesi ve ertesi sabaha karşı saatler en verimlisidir.` },
      { question: `${name} saat kaçta izlenir?`, answer: m.window ? `İstanbul’dan en iyi saatler ${dayClock(m.window.from)} ile ${dayClock(m.window.to)} arası: radyant ufkun yeterince üstünde${m.moon.set && m.moon.set <= m.window.from ? ', Ay ise batmış' : ''}. Radyantın en yükseğe çıktığı an ${dayClock(m.radiantPeak.at)}.` : `Bu yıl Ay ışığı ya da radyantın alçakta kalması gözlemi zorlaştırıyor; en yüksek radyant ${dayClock(m.radiantPeak.at)} civarında.` },
      { question: `${name} Türkiye’den görülecek mi?`, answer: `Evet. Radyant ${m.shower.where} bulunuyor ve Türkiye’den ${m.radiantRise ? `${clock(m.radiantRise)} civarında doğuyor` : 'gece boyunca ufkun üstünde kalıyor'}. Şehir ışıklarından uzak, ufku açık bir yer seçin.` },
      { question: 'Saatte kaç meteor görülür?', answer: `İdeal koşullarda (ZHR) saatte ${m.shower.zhr} civarı. Bu yıl İstanbul enleminde, radyant yüksekliği ve Ay ışığı hesaba katıldığında karanlık bir yerden saatte yaklaşık ${m.rate} meteor beklenir; şehir içinde bu sayı birkaçta kalır.` },
      { question: 'Hangi yöne bakmalıyım?', answer: `Meteorlar ${m.shower.where} bulunan radyanttan dağılıyormuş gibi görünür, ama gökyüzünün her yerinde belirebilir. Radyanta doğrudan bakmak yerine ondan 30–40° uzağa, gökyüzünün geniş bir bölümüne bakmak en iyisidir.` },
    ];
  }
  if (l) {
    const sign = SIGN_NAMES[l.sign];
    const ist = l.cities[0];
    const base = [
      { question: `${e.title} ${year} saat kaçta?`, answer: `${l.full ? 'Dolunay' : 'Yeni Ay'} anı ${dateText}, İstanbul saatiyle ${e.time}. ${l.full ? 'Ay o gece ve bir önceki/sonraki gece neredeyse tam dolu görünür.' : 'Ay bu sırada görünmez; ince hilal 1–2 gün sonra gün batımında batıda belirir.'}` },
      { question: `${e.title} hangi burçta?`, answer: `${l.full ? 'Dolunay' : 'Yeni Ay'} ${sign} burcunda gerçekleşiyor. ${l.full ? `Güneş karşıt burçta, ${SIGN_NAMES[(l.sign + 6) % 12]} burcunda.` : `Güneş ve Ay birlikte ${sign} burcunda.`}` },
    ];
    if (l.full && ist) {
      base.push({ question: `Ay İstanbul’da saat kaçta doğacak?`, answer: ist.rises.map((r, i) => (r.rise ? `${eveningLabel(l.evenings[i])} ${clock(r.rise)}` : '')).filter(Boolean).join(', ') + ` civarında ${ist.rises[0]?.az ? compassName(ist.rises[0].az) : 'doğu'} ufkundan doğuyor. Ankara’da birkaç dakika önce, İzmir’de birkaç dakika sonra doğar.` });
    }
    if (e.type === 'super-ay') base.push({ question: 'Süper Ay ne kadar büyük görünür?', answer: `Ay bu dolunayda Dünya’ya yaklaşık ${(Math.round(l.distanceKm / 1000) * 1000).toLocaleString('tr-TR')} km uzaklıkta. Yılın en uzak dolunayına göre yaklaşık %14 daha büyük ve %30’a varan oranda daha parlak görünür; fark çıplak gözle hafiftir, en etkileyici görüntü Ay ufuktan doğarken yakalanır.` });
    return base;
  }
  return [];
}

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
  const m = meteorDetail(e);
  const l = lunationDetail(e);
  const y = e.date.slice(0, 4);
  // Aranan soruyu başlığa taşı: "saat kaçta", "burçlara etkileri"
  const rich = m
    ? `${e.title.replace(/ Zirvesi$/, '')} ${y}: Saat Kaçta, Nereden İzlenir?`
    : l
      ? `${e.title} ${y}: Saat Kaçta? Burçlara Etkileri`
      : null;
  const description = m
    ? `${e.title} ${y} zirvesi ${new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} gecesi. İstanbul’dan en iyi saatler${m.window ? ` ${clock(m.window.from)}–${clock(m.window.to)}` : ''}, saatte ~${m.rate} meteor. Radyant, Ay ışığı ve gözlem rehberi.`
    : l
      ? `${e.title}: ${new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} saat ${e.time} (TSİ), ${SIGN_NAMES[l.sign]} burcunda. İstanbul, Ankara, İzmir’de Ay doğuşu ve 12 burca etkileri.`
      : `${e.description} ${e.details}`;
  return buildPageMetadata({
    path: `/takvim/${slug}`,
    title: rich ? `${rich} | SpaceTour TR` : `${title} | SpaceTour TR`.length <= 60 ? `${title} | SpaceTour TR` : title,
    description: description.slice(0, 158),
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
                    <Link href={`/takvim/${eventSlug(e)}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-ink p-4 hover:bg-ink-2">
                      <span>
                        <span className="block text-sm font-medium text-gold">{eventTypeLabels[e.type]}</span>
                        <span className="mt-1 block text-base text-paper">{e.title}</span>
                      </span>
                      <span className="font-mono text-[13px] text-paper/70">{fmtDate(e.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <nav aria-label="Diğer yıllar" className="flex flex-wrap gap-2 border-t border-line pt-6 text-sm">
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
  // Aynı türden olaylar: önce yaklaşanlar (dolunay ve süper ay birlikte)
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: TZ });
  const kin = (x: AstronomicalEvent) => (LUNAR.includes(e.type) ? LUNAR.includes(x.type) : x.type === e.type) && x.id !== e.id;
  const upcomingKin = events.filter((x) => kin(x) && x.date >= today);
  const sameType = (upcomingKin.length >= 6 ? upcomingKin : [...events.filter((x) => kin(x) && x.date < today).slice(-(6 - upcomingKin.length)), ...upcomingKin]).slice(0, 6);
  const meteor = meteorDetail(e);
  const lun = lunationDetail(e);
  const dateText = new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  const faq = eventFaq(e, meteor, lun, dateText);
  const bodies = eventBodies(e);
  const lunarMonth = eventLunarMonth(e);

  const articleJsonLd = getArticleJsonLd({
    path: `/takvim/${slug}`,
    headline: `${e.title} · ${fmtDate(e.date)}`,
    description: e.description,
    datePublished: CONTENT_DATES.events.published,
    dateModified: CONTENT_DATES.events.modified,
    about: eventTypeLabels[e.type],
  });
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
      {faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqPageJsonLd(faq)) }} />}
      <ChapterHero
        variant="band"
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
              <span className="block text-sm font-medium text-gold">Bu olayda</span>
              <h2 className="doc-title mt-2 text-xl text-paper sm:text-2xl">{e.title} nasıl gözlenir?</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{e.details}</p>
            </article>
            {meteor && (
              <section aria-labelledby="zirve" className="border border-line bg-ink-2 p-6">
                <h2 id="zirve" className="doc-title text-xl text-paper sm:text-2xl">Türkiye’den zirve gecesi</h2>
                <p className="mt-3 text-base leading-relaxed text-paper/85">
                  {e.title.replace(/ Zirvesi$/, '')} için zirve {dateText} gecesi. İstanbul’da gökyüzü {clock(meteor.dusk)} itibarıyla tam kararıyor;
                  radyant {meteor.radiantRise ? `${clock(meteor.radiantRise)} civarında doğuyor ve` : 'akşamdan ufkun üstünde,'} {dayClock(meteor.radiantPeak.at)} civarında ufkun {Math.round(meteor.radiantPeak.alt)}° üzerine çıkıyor.
                  Ay %{Math.round(meteor.moon.illumination * 100)} aydınlık{meteor.moon.set ? `; batış saati ${clock(meteor.moon.set)}` : meteor.moon.rise ? `; doğuş saati ${clock(meteor.moon.rise)}` : meteor.moon.upAtPeak ? '; gece boyunca gökyüzünde' : '; gece boyunca ufkun altında'}.
                  {meteor.window ? ` En iyi saatler ${clock(meteor.window.from)}–${clock(meteor.window.to)}: karanlık bir yerden saatte yaklaşık ${meteor.rate} meteor beklenir.` : ` Bu yıl Ay ışığı gözlemi zorlaştırıyor; parlak meteorlar yine de görülebilir.`}
                </p>
                <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
                  <div><dt className="text-sm text-paper/70">Radyant</dt><dd className="mt-1 text-paper">{meteor.shower.where}</dd></div>
                  <div><dt className="text-sm text-paper/70">En iyi saatler (İstanbul)</dt><dd className="mt-1 text-paper">{meteor.window ? `${clock(meteor.window.from)} – ${clock(meteor.window.to)}` : 'Ay ışığı engelliyor'}</dd></div>
                  <div><dt className="text-sm text-paper/70">Saatlik sayı</dt><dd className="mt-1 text-paper">İdeal {meteor.shower.zhr} · bu yıl karanlık yerden ~{meteor.rate}</dd></div>
                  <div><dt className="text-sm text-paper/70">Ay</dt><dd className="mt-1 text-paper">%{Math.round(meteor.moon.illumination * 100)} aydınlık{meteor.moon.set ? `, batış ${clock(meteor.moon.set)}` : ''}</dd></div>
                  <div><dt className="text-sm text-paper/70">Kaynak</dt><dd className="mt-1 text-paper">{meteor.shower.parent}</dd></div>
                  <div><dt className="text-sm text-paper/70">Atmosfere giriş hızı</dt><dd className="mt-1 text-paper">Saniyede {meteor.shower.speed} km</dd></div>
                </dl>
              </section>
            )}
            {lun && lun.full && lun.cities.length > 0 && (
              <section aria-labelledby="ay-dogusu" className="border border-line bg-ink-2 p-6">
                <h2 id="ay-dogusu" className="doc-title text-xl text-paper sm:text-2xl">Ay saat kaçta doğacak?</h2>
                <p className="mt-3 text-base leading-relaxed text-paper/85">
                  Dolunay anı {dateText}, İstanbul saatiyle {e.time}; Ay o sırada {SIGN_NAMES[lun.sign]} burcunda ve Dünya’ya yaklaşık {(Math.round(lun.distanceKm / 1000) * 1000).toLocaleString('tr-TR')} km uzaklıkta.
                  Ay her iki akşam da gün batımına yakın doğar ve sabaha kadar gökyüzünde kalır.
                </p>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[22rem] border-collapse text-left text-[15px]">
                    <thead>
                      <tr className="border-b border-line text-sm text-paper/70">
                        <th className="py-2 pr-4 font-normal">Şehir</th>
                        {lun.evenings.map((ev) => <th key={ev} className="py-2 pr-4 font-normal">{eveningLabel(ev)}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {lun.cities.map((c) => (
                        <tr key={c.name} className="border-b border-line/60">
                          <td className="py-2 pr-4 text-paper">{c.name}</td>
                          {c.rises.map((r, i) => <td key={i} className="py-2 pr-4 text-paper/85">{r.rise ? `${clock(r.rise)} · ${r.az !== null ? compassName(r.az) : ''}` : '—'}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-paper/70">Ay doğuş saatleri ufkun açık olduğu varsayımıyla hesaplandı; tepeler ve binalar birkaç dakika geciktirebilir.</p>
              </section>
            )}
            {lun && (
              <section aria-labelledby="burclar">
                <h2 id="burclar" className="doc-title text-xl text-paper sm:text-2xl">{SIGN_NAMES[lun.sign]} burcunda {lun.full ? 'dolunay' : 'yeni Ay'}: burçlara etkileri</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-paper/75">
                  {lun.full ? 'Dolunay bir döngünün tamamlandığı, duyguların ve sonuçların görünür olduğu an' : 'Yeni Ay yeni bir döngünün başladığı, niyet tutma ve tohum ekme anı'} olarak yorumlanır. Güneş burcuna göre {lun.full ? 'dolunayın' : 'yeni Ay’ın'} düştüğü ev, hayatının hangi alanında hissedileceğini gösterir; yükselen burcunu biliyorsan onu da oku.
                </p>
                <div className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2">
                  {SIGN_NAMES.map((name, s) => {
                    const house = ((lun.sign - s + 12) % 12) + 1;
                    return (
                      <article key={name} className="bg-ink p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-lg font-semibold text-paper"><Link href={`/astroloji/burclar/${SIGN_IDS[s]}`} className="hover:text-gold">{name}</Link></h3>
                          <span className="text-sm text-paper/70">{house}. ev</span>
                        </div>
                        <p className="mt-2 text-[15px] leading-relaxed text-paper/80">{(lun.full ? FULL_MOON_HOUSE : NEW_MOON_HOUSE)[house - 1]}</p>
                        <Link href={`/astroloji/gunluk-burc/${SIGN_IDS[s]}`} className="mt-3 inline-flex items-center gap-1 text-sm text-gold hover:text-paper">{name} günlük yorum <ArrowUpRight size={13} /></Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
            <article className="border-b border-line pb-8">
              <span className="block text-sm font-medium text-gold">{eventTypeLabels[e.type]} nedir?</span>
              <h2 className="doc-title mt-2 text-xl text-paper sm:text-2xl">Gökyüzünde ne oluyor?</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{g.what}</p>
            </article>
            <article>
              <span className="block text-sm font-medium text-gold">Gözlem rehberi</span>
              <h2 className="doc-title mt-2 text-xl text-paper sm:text-2xl">İpuçları</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{g.how}</p>
            </article>
            {faq.length > 0 && (
              <section aria-labelledby="sss">
                <h2 id="sss" className="doc-title text-xl text-paper sm:text-2xl">Sık sorulanlar</h2>
                <dl className="mt-4 space-y-4">
                  {faq.map((f) => (
                    <div key={f.question} className="border border-line bg-ink p-4">
                      <dt className="text-base font-semibold text-paper">{f.question}</dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-paper/80">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5 text-sm">
              <div className="font-medium text-gold">Tarih</div>
              <div className="doc-title mt-2 text-2xl text-paper">{when}</div>
              <div className="mt-1 font-mono text-[13px] text-paper/80">{fmtDate(e.date)}{e.time ? ` · ${e.time}` : ''}</div>
              <div className="mt-3 text-paper/70">{VISIBILITY[e.visibility]} görülebilir.</div>
            </div>
            {bodies.length > 0 && (
              <div className="border border-line bg-ink-2 p-5 text-sm">
                <div className="font-medium text-gold">İlgili gökcisimleri</div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {bodies.map((b) => (
                    <li key={b.id}><Link href={`/ansiklopedi/${b.id}`} className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 text-paper/85 hover:border-gold hover:text-gold">{b.name} <ArrowUpRight size={12} /></Link></li>
                  ))}
                </ul>
              </div>
            )}
            {sameType.length > 0 && (
              <div className="border border-line bg-ink-2 p-5 text-sm">
                <div className="font-medium text-gold">{LUNAR.includes(e.type) ? 'Diğer dolunaylar' : `Diğer ${eventTypeLabels[e.type].toLocaleLowerCase('tr-TR')} tarihleri`}</div>
                <ul className="mt-3 space-y-2">
                  {sameType.map((x) => (
                    <li key={x.id}><Link href={`/takvim/${eventSlug(x)}`} className="flex justify-between gap-3 text-paper/85 hover:text-gold"><span>{x.title}</span><span className="shrink-0 font-mono text-[13px] text-paper/70">{x.date.split('-').reverse().join('.')}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2 text-sm">
              {lunarMonth && <Link href={lunarMonth.href} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{lunarMonth.label} <ArrowUpRight size={14} /></Link>}
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
