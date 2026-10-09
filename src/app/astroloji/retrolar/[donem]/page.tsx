import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { RULED_SIGNS, retroHouseText } from '@/data/retroHouses';
import { SIGN_IDS, SIGN_NAMES } from '@/lib/astrology/dailySky';
import { retrogradeCalendar } from '@/lib/astrology/retrogradeCalendar';
import { retroDetail, type RetroDetail } from '@/lib/astrology/retroDetail';
import { buildPageMetadata, getArticleJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = false;

const PLANETS = [
  { slug: 'merkur', glyph: 'merkur', name: 'Merkür', gen: 'Merkür’ün', about: 'iletişim, yazışmalar, ulaşım, teknoloji ve sözleşmeler', inner: true },
  { slug: 'venus', glyph: 'venus', name: 'Venüs', gen: 'Venüs’ün', about: 'ilişkiler, değerler, para ve estetik', inner: true },
  { slug: 'mars', glyph: 'mars', name: 'Mars', gen: 'Mars’ın', about: 'enerji, motivasyon, rekabet ve öfke', inner: false },
  { slug: 'jupiter', glyph: 'jupiter', name: 'Jüpiter', gen: 'Jüpiter’in', about: 'büyüme, inançlar, eğitim ve şans', inner: false },
  { slug: 'saturn', glyph: 'saturn', name: 'Satürn', gen: 'Satürn’ün', about: 'sorumluluk, yapılar, kariyer ve sınırlar', inner: false },
] as const;
type Planet = (typeof PLANETS)[number];
const YEARS = ['2026', '2027'];
const TZ = 'Europe/Istanbul';

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
const day = (ms: number) => new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', timeZone: TZ });
const dayShort = (ms: number) => new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: TZ });
const clock = (ms: number) => new Date(ms).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const at = (ms: number) => `${day(ms)}, saat ${clock(ms)}`;
const yearOf = (ms: number) => new Date(ms).toLocaleDateString('tr-TR', { year: 'numeric', timeZone: TZ });
/** "24 Ekim – 13 Kasım"; yıl değişiyorsa "13 Aralık 2026 – 13 Nisan 2027" */
const span = (a: number, b: number) => (yearOf(a) === yearOf(b) ? `${dayShort(a)} – ${dayShort(b)}` : `${dayShort(a)} ${yearOf(a)} – ${dayShort(b)} ${yearOf(b)}`);
const signOf = (lon: number) => Math.floor((((lon % 360) + 360) % 360) / 30);
const deg = (lon: number) => `${SIGN_NAMES[signOf(lon)]} ${Math.floor((((lon % 360) + 360) % 360) % 30)}°`;
const signList = (idx: number[]) => idx.map((i) => SIGN_NAMES[i]).join(' ve ');
const signNoun = (idx: number[]) => `${signList(idx)} ${idx.length === 1 ? 'burcu' : 'burçları'}`;
/** Rehber maddelerini cümle içinde listelemek için: sondaki noktayı at, ilk harfi küçült */
const clause = (t: string) => t.replace(/[.\s]+$/, '').replace(/^./, (c) => c.toLocaleLowerCase('tr-TR'));

/** O yıldan sonraki ilk retro (yıl içinde retro olmayan sayfalar için) */
function nextCycleAfter(glyph: string, year: string) {
  return retrogradeCalendar(new Date(`${year}-07-01T00:00:00Z`)).find((c) => c.planetGlyphKey === glyph && c.startDate > `${year}-12-31`);
}

/** Sayfanın odaklandığı dönem: bugün sürmekte olan ya da sıradaki; yıl bittiyse sonuncusu */
function featuredCycle(cycles: ReturnType<typeof cyclesFor>, today: string) {
  return cycles.find((c) => c.endDate >= today) ?? cycles[cycles.length - 1];
}

function retroSigns(d: RetroDetail) {
  const a = signOf(d.lonSR), b = signOf(d.lonSD);
  return a === b ? [a] : [a, b];
}

export async function generateMetadata(props: PageProps<'/astroloji/retrolar/[donem]'>): Promise<Metadata> {
  const { donem } = await props.params;
  const p = parse(donem);
  if (!p) return { title: 'Bulunamadı', robots: { index: false } };
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: TZ });
  const cycles = cyclesFor(p.planet.glyph, p.year);
  const f = featuredCycle(cycles, today);
  const d = f ? retroDetail(p.planet.glyph, f.startDate) : null;
  const range = d ? span(d.sr, d.sd) : '';
  return buildPageMetadata({
    path: `/astroloji/retrolar/${donem}`,
    title: d ? `${p.planet.name} Retrosu ${p.year} (${range}): Burçlara Etkileri | SpaceTour TR` : `${p.planet.name} Retrosu ${p.year}: Tarihler ve Etkileri | SpaceTour TR`,
    description: (d
      ? `${p.planet.name} retrosu ${dayShort(d.sr)} saat ${clock(d.sr)} (TSİ) itibarıyla ${deg(d.lonSR)} noktasında başlıyor, ${dayShort(d.sd)} günü ${deg(d.lonSD)} noktasında bitiyor. 12 burca etkileri ve gölge dönemi.`
      : `${p.planet.name} retrosu ${p.year} ne zaman? Gölge dönemleri, burçlara etkileri ve bu dönemde yapılacaklar.`
    ).slice(0, 158),
  });
}

export default async function RetroDonemPage(props: PageProps<'/astroloji/retrolar/[donem]'>) {
  const { donem } = await props.params;
  const p = parse(donem);
  if (!p) notFound();
  const { planet, year } = p;
  const cycles = cyclesFor(planet.glyph, year);
  const now = Date.now();
  const today = new Date(now).toLocaleDateString('sv-SE', { timeZone: TZ });
  const featured = featuredCycle(cycles, today);
  const d = featured ? retroDetail(planet.glyph, featured.startDate) : null;
  const others = cycles.filter((c) => c !== featured);
  const next = cycles.length ? undefined : nextCycleAfter(planet.glyph, year);
  const nextDetail = next ? retroDetail(planet.glyph, next.startDate) : null;
  const nextYear = next?.startDate.slice(0, 4);

  const started = d ? now >= d.sr : false;
  const ended = d ? now >= d.sd : false;
  const signs = d ? retroSigns(d) : [];

  const lede = d
    ? `${planet.name}, ${at(d.sr)} (TSİ) ${deg(d.lonSR)} noktasında geri harekete ${started ? 'başladı' : 'başlıyor'} ve ${at(d.sd)} ${deg(d.lonSD)} noktasında düz harekete ${ended ? 'döndü' : 'dönüyor'}. Retro ${d.days} gün sürüyor; gölge dönemiyle birlikte etkisi ${span(d.preShadow, d.postShadow)} arasına yayılıyor.`
    : nextDetail
      ? `${year} yılında ${planet.name} geri harekete geçmiyor. Sıradaki ${planet.name} retrosu ${at(nextDetail.sr)} (TSİ) ${deg(nextDetail.lonSR)} noktasında başlıyor; gölge dönemi ${day(nextDetail.preShadow)} tarihinde giriyor.`
      : `${year} yılında ${planet.name} geri harekete geçmiyor.`;

  // Gün gün takvim: gölge, burç geçişleri, duruşlar, Güneş'le hizalanma
  type Step = { t: number; title: string; text: string };
  const steps: Step[] = d
    ? [
        { t: d.preShadow, title: 'Önceki gölge başlıyor', text: `${planet.name}, retro sırasında geri döneceği ${deg(d.lonSD)} noktasını ilk kez geçiyor. Retronun konuları yavaş yavaş gündeme gelir.` },
        { t: d.sr, title: 'Retro başlıyor', text: `${planet.name} ${deg(d.lonSR)} noktasında duruyor ve yıldızlara göre geriye gidiyormuş gibi görünmeye başlıyor. Duruş günü etkilerin en yoğun hissedildiği gün kabul edilir.` },
        { t: d.sd, title: 'Düz harekete dönüyor', text: `${planet.name} ${deg(d.lonSD)} noktasında yeniden duruyor ve ileri hareketine dönüyor. Ertelenen işler yeniden akmaya başlar, ama gölge dönemi sürüyor.` },
        { t: d.postShadow, title: 'Sonraki gölge bitiyor', text: `${planet.name}, retronun başladığı ${deg(d.lonSR)} noktasını yeniden geçiyor. Döngü tamamlanıyor.` },
        ...d.ingresses.map((g) => ({
          t: g.at,
          title: `${SIGN_NAMES[g.sign]} burcuna ${g.retro ? 'geri dönüyor' : 'geçiyor'}`,
          text: g.retro
            ? `${planet.name} geri giderken ${SIGN_NAMES[g.sign]} burcuna dönüyor: önceki burcun konuları yeniden açılır.`
            : `${planet.name} ${SIGN_NAMES[g.sign]} burcuna geçiyor.`,
        })),
        ...(d.sunAlignment
          ? [
              d.sunAlignment.kind === 'iç kavuşum'
                ? { t: d.sunAlignment.at, title: 'İç kavuşum: Güneş’in önünden geçiyor', text: `${planet.name} Dünya ile Güneş’in arasından geçiyor. Retronun tam ortası; astrolojide yeni bir döngünün tohumu, “kozmik kalp” olarak yorumlanır.` }
                : { t: d.sunAlignment.at, title: 'Karşı konum: Dünya’ya en yakın', text: `${planet.name} Güneş’in tam karşısına geliyor: yılın en parlak hali, gece boyunca gökyüzünde. Retronun tam ortası.` },
            ]
          : []),
      ].sort((a, b) => a.t - b.t)
    : [];

  // Görünürlük cümlesi (İstanbul)
  const vis = d?.visibility;
  const visText = !d
    ? ''
    : planet.inner
      ? vis
        ? `${planet.gen} iç kavuşumdan sonra sabah gökyüzünde yeniden belirmesi bekleniyor: ${dayShort(vis.from)} – ${dayShort(vis.to)} arasında gün doğumundan yaklaşık 45 dakika önce doğu ufkunun üzerinde görülebilir. En iyi sabah ${dayShort(vis.best)}; ${planet.name} o sırada ufkun yaklaşık ${Math.round(vis.altitude)}° üzerinde.`
        : `Bu retrodan sonraki sabah görünümünde ${planet.name} Türkiye’nin enleminden ufka çok yakın kalıyor; çıplak gözle görmek zor.`
      : vis && d.sunAlignment
        ? `Karşı konum gecesi (${dayShort(d.sunAlignment.at)}) ${planet.name} gün batımında doğudan yükselir, bütün gece görünür ve saat ${clock(vis.best)} civarında İstanbul’dan ufkun yaklaşık ${Math.round(vis.altitude)}° üzerine çıkar. Retro boyunca yılın en parlak dönemindedir.`
        : '';

  const ruled = RULED_SIGNS[planet.slug] ?? [];
  const faq = [
    {
      q: `${planet.name} retrosu ${year} ne zaman?`,
      a: cycles.length
        ? `${year} yılında ${planet.name} ${cycles.length} kez geri harekete geçiyor: ${cycles.map((c) => `${fmt(c.startDate)} – ${fmt(c.endDate)}`).join('; ')}.${d ? ` Sıradaki ya da süren dönem ${at(d.sr)} (TSİ) başlıyor.` : ''}`
        : `${year} yılında ${planet.name} geri harekete geçmiyor.`,
    },
    ...(d
      ? [
          { q: `${planet.name} retrosu ne zaman bitecek?`, a: `${planet.name} ${at(d.sd)} (TSİ) düz harekete dönüyor. Gölge dönemi ${day(d.postShadow)} tarihinde sona eriyor; etkilerin tamamen dağılması bu tarihe kadar sürer.` },
          { q: `${planet.name} retrosu hangi burçta?`, a: signs.length === 1 ? `Bu retro tamamen ${SIGN_NAMES[signs[0]]} burcunda geçiyor: ${deg(d.lonSR)} noktasından ${deg(d.lonSD)} noktasına geri gidiyor.` : `Retro ${deg(d.lonSR)} noktasında başlıyor, ${planet.name} geri giderken ${SIGN_NAMES[signOf(d.lonSD)]} burcuna dönüyor ve ${deg(d.lonSD)} noktasında düzleşiyor.` },
          { q: `${planet.name} retrosu en çok hangi burçları etkiler?`, a: `Retronun geçtiği ${signNoun(signs)} ile ${planet.gen} yönettiği ${signNoun(ruled)} bu dönemi en belirgin hissedenler kabul edilir. Güneş burcunun yanı sıra yükselen burcu bu burçlardan biri olanlar da etkilenir.` },
        ]
      : []),
    ...(featured ? [{ q: `${planet.name} retrosunda neler yapılmamalı?`, a: `Gelenekte uzak durulması önerilenler: ${featured.guidance.whatToAvoid.map(clause).join('; ')}. Bunun yerine önerilenler: ${featured.guidance.whatToDo.map(clause).join('; ')}.` }] : []),
    { q: `${planet.name} retrosu nedir?`, a: `Dünya ile ${planet.name} yörüngelerinde farklı hızlarla ilerlerken ${planet.name}, gökyüzünde bir süre yıldızlara göre geriye doğru gidiyormuş gibi görünür. Gezegen gerçekte geri gitmez; bu, bakış açısından kaynaklanan bir görünüştür. Astrolojide bu dönemler ${planet.about} konularında yavaşlama ve gözden geçirme zamanı olarak yorumlanır.` },
    { q: 'Gölge dönemi nedir?', a: 'Retrodan önceki gölge, gezegenin retro sırasında geri döneceği dereceleri ilk kez geçtiği dönemdir; sonraki gölge ise retro bittikten sonra bu dereceleri yeniden geçip aştığı süredir. Etkilerin bu aralıkta hafifçe hissedildiği kabul edilir.' },
    ...(visText ? [{ q: `${planet.name} retrosu gökyüzünde görülebilir mi?`, a: `Evet, retro gerçek bir gök olayıdır ve hareket birkaç gece arayla yıldızlara göre izlenebilir. ${visText}` }] : []),
  ];

  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Gezegen retroları', url: '/astroloji/retrolar' },
    { name: `${planet.name} retrosu ${year}`, url: `/astroloji/retrolar/${donem}` },
  ]);
  const articleJsonLd = getArticleJsonLd({
    path: `/astroloji/retrolar/${donem}`,
    headline: `${planet.name} retrosu ${year}: tarihler, burçlara etkileri ve gözlem`,
    description: lede,
    datePublished: '2026-10-06',
    dateModified: today,
  });

  const meta = d
    ? [
        { k: started ? 'Başladı' : 'Başlıyor', v: dayShort(d.sr) },
        { k: ended ? 'Bitti' : 'Bitiyor', v: dayShort(d.sd) },
        { k: 'Süre', v: `${d.days} gün` },
        { k: 'Burç', v: signList(signs) },
      ]
    : [{ k: 'Retro sayısı', v: 0 }];

  const card = 'border border-line bg-ink-2 p-6';
  return (
    <div style={{ '--page-accent': 'var(--violet)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="04 · Retro"
        section={`Gezegen retroları · ${year}`}
        headline={[`${planet.name} retrosu`, year]}
        lede={lede}
        accent="var(--violet)"
        image={DOC_IMAGES['astro-retrolar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: 'Retrolar', href: '/astroloji/retrolar' }, { label: `${planet.name} ${year}` }]}
        meta={meta}
      />
      <section aria-label={`${planet.name} retrosu ${year}`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-8">
            {!d && (
              <div className={card}>
                <p className="text-base leading-relaxed text-paper/85">{lede}</p>
                {nextYear && YEARS.includes(nextYear) && (
                  <Link href={`/astroloji/retrolar/${planet.slug}-${nextYear}`} className="mt-4 inline-flex items-center gap-1.5 text-gold hover:text-paper">
                    {planet.name} retrosu {nextYear}: tarihler ve burçlara etkileri <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>
            )}

            {d && featured && (
              <section aria-labelledby="ozet" className={card}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="ozet" className="doc-title text-2xl text-paper">Kısaca</h2>
                  {started && !ended && <span className="border border-violet/50 bg-violet/10 px-2 py-0.5 text-xs font-medium text-violet">Şu an retroda</span>}
                </div>
                <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
                  <div><dt className="text-sm text-paper/70">Retro başlangıcı (TSİ)</dt><dd className="mt-1 text-paper">{at(d.sr)}</dd></div>
                  <div><dt className="text-sm text-paper/70">Düz harekete dönüş (TSİ)</dt><dd className="mt-1 text-paper">{at(d.sd)}</dd></div>
                  <div><dt className="text-sm text-paper/70">Dereceler</dt><dd className="mt-1 text-paper">{deg(d.lonSR)} → {deg(d.lonSD)}</dd></div>
                  <div><dt className="text-sm text-paper/70">Gölge dönemi</dt><dd className="mt-1 text-paper">{span(d.preShadow, d.postShadow)}</dd></div>
                  {d.sunAlignment && <div><dt className="text-sm text-paper/70">{d.sunAlignment.kind === 'iç kavuşum' ? 'İç kavuşum' : 'Karşı konum'}</dt><dd className="mt-1 text-paper">{at(d.sunAlignment.at)}</dd></div>}
                  <div><dt className="text-sm text-paper/70">Element</dt><dd className="mt-1 text-paper">{featured.elementFocus}</dd></div>
                </dl>
                {featured.coreThemes.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {featured.coreThemes.map((t) => <li key={t} className="border border-line px-3 py-1 text-sm text-paper/85">{t}</li>)}
                  </ul>
                )}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-base font-semibold text-lime">Yapılacaklar</h3>
                    <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">{featured.guidance.whatToDo.map((t) => <li key={t}>+ {t}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-rose">Kaçınılacaklar</h3>
                    <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-paper/85">{featured.guidance.whatToAvoid.map((t) => <li key={t}>− {t}</li>)}</ul>
                  </div>
                </div>
                <p className="mt-5 border-l-2 border-gold pl-3 text-base leading-relaxed text-paper/85">{featured.guidance.cosmicLesson}</p>
              </section>
            )}

            {d && (
              <section aria-labelledby="takvim">
                <h2 id="takvim" className="doc-title text-2xl text-paper">Gün gün {planet.name} retrosu</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/75">Saatler Türkiye saatiyle (TSİ) ve gerçek gök hesabıyla verildi; birkaç dakikalık sapma olabilir.</p>
                <ol className="mt-6 space-y-0 border-l border-line">
                  {steps.map((s) => {
                    const past = now >= s.t;
                    return (
                      <li key={`${s.t}-${s.title}`} className="relative pb-7 pl-6 last:pb-0">
                        <span aria-hidden className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ${past ? 'bg-paper/40' : 'bg-violet'}`} />
                        <div className="text-sm text-paper/70">{at(s.t)}</div>
                        <h3 className="mt-1 text-lg font-semibold text-paper">{s.title}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-paper/80">{s.text}</p>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}

            {d && (
              <section aria-labelledby="burclar">
                <h2 id="burclar" className="doc-title text-2xl text-paper">{planet.name} retrosu burçlara etkileri</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/75">
                  Retronun güneş burcuna göre hangi evine düştüğü, etkinin hayatının hangi alanında hissedileceğini gösterir. Yükselen burcunu biliyorsan onu da oku; bilmiyorsan <Link href="/astroloji/dogum-haritasi" className="text-gold underline underline-offset-2 hover:text-paper">doğum haritanı çıkar</Link>.
                </p>
                <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
                  {SIGN_NAMES.map((name, s) => {
                    const houses = signs.map((x) => ((x - s + 12) % 12) + 1);
                    const text = houses.map((h) => retroHouseText(planet.slug, planet.name, planet.about, h)).join(' ');
                    return (
                      <article key={name} className="bg-ink p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-lg font-semibold text-paper">
                            <Link href={`/astroloji/burclar/${SIGN_IDS[s]}`} className="hover:text-gold">{name}</Link>
                          </h3>
                          <span className="text-sm text-paper/70">{houses.map((h) => `${h}. ev`).join(' → ')}</span>
                        </div>
                        <p className="mt-2 text-[15px] leading-relaxed text-paper/80">{text}</p>
                        <Link href={`/astroloji/gunluk-burc/${SIGN_IDS[s]}`} className="mt-3 inline-flex items-center gap-1 text-sm text-gold hover:text-paper">{name} günlük yorum <ArrowUpRight size={13} /></Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {d && (
              <section aria-labelledby="gokyuzu" className={card}>
                <h2 id="gokyuzu" className="doc-title text-2xl text-paper">Gökyüzünde ne oluyor?</h2>
                <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-paper/85">
                  {planet.inner ? (
                    <p>{planet.name}, Güneş’e Dünya’dan daha yakın ve daha hızlı dolanır. Güneş ile Dünya’nın arasından geçerken (iç kavuşum) bizim bakış açımızdan yıldızlara göre geriye kayıyormuş gibi görünür; bu yüzden her {planet.name} retrosunun ortasında bir iç kavuşum vardır. {planet.name} birkaç gün Güneş’in parıltısında kaybolur, ardından sabah gökyüzünde yeniden belirir.</p>
                  ) : (
                    <p>Dünya, Güneş’in çevresinde {planet.gen} içinden ve daha hızlı dolanır. {planet.gen} yanından geçerken onu geride bırakırız ve {planet.name} yıldızlara göre geriye gidiyormuş gibi görünür; tıpkı otoyolda yavaş bir aracı sollarken onun geriye kayıyormuş gibi görünmesi gibi. Bu yüzden retronun ortası karşı konuma denk gelir: {planet.name} Dünya’ya en yakın, en parlak halindedir.</p>
                  )}
                  {visText && <p>{visText}</p>}
                  <p>Gezegenlerin bugünkü konumlarını <Link href="/harita/planetaryum" className="text-gold underline underline-offset-2 hover:text-paper">3D gök küresinde</Link> görebilirsin.</p>
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section aria-labelledby="digerleri">
                <h2 id="digerleri" className="doc-title text-2xl text-paper">{year} yılının diğer {planet.name} retroları</h2>
                <div className="mt-5 space-y-4">
                  {others.map((c) => (
                    <article key={c.id} className="border border-line bg-ink p-5">
                      <h3 className="text-lg font-semibold text-paper">{fmt(c.startDate)} – {fmt(c.endDate)}</h3>
                      <dl className="mt-3 grid gap-3 text-[15px] sm:grid-cols-2">
                        <div><dt className="text-sm text-paper/70">Dereceler</dt><dd className="mt-1 text-paper">{c.signRange}</dd></div>
                        <div><dt className="text-sm text-paper/70">Gölge dönemi</dt><dd className="mt-1 text-paper">{fmt(c.preShadowStart)} – {fmt(c.postShadowEnd)}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="sss">
              <h2 id="sss" className="doc-title text-2xl text-paper">Sık sorulanlar</h2>
              <dl className="mt-4 space-y-4">
                {faq.map((f) => (
                  <div key={f.q} className="border border-line bg-ink p-4">
                    <dt className="text-base font-semibold text-paper">{f.q}</dt>
                    <dd className="mt-1.5 text-[15px] leading-relaxed text-paper/80">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <nav aria-label="Diğer retrolar" className="border border-line bg-ink-2 p-5 text-sm">
              <div className="font-medium text-gold">Diğer retro takvimleri</div>
              <ul className="mt-3 space-y-2">
                {PLANETS.flatMap((x: Planet) => YEARS.map((y) => ({ x, y }))).filter(({ x, y }) => !(x.slug === planet.slug && y === year)).map(({ x, y }) => (
                  <li key={`${x.slug}-${y}`}><Link href={`/astroloji/retrolar/${x.slug}-${y}`} className="text-paper/85 hover:text-gold">{x.name} retrosu {y}</Link></li>
                ))}
              </ul>
            </nav>
            <Link href="/astroloji/retrolar" className="flex items-center justify-between border border-line p-3 text-sm text-paper/85 hover:border-gold hover:text-gold">Etkileşimli retro radarı <ArrowUpRight size={14} /></Link>
            <Link href="/astroloji/dogum-haritasi" className="flex items-center justify-between border border-line p-3 text-sm text-paper/85 hover:border-gold hover:text-gold">Doğum haritanı çıkar <ArrowUpRight size={14} /></Link>
            <Link href="/takvim" className="flex items-center justify-between border border-line p-3 text-sm text-paper/85 hover:border-gold hover:text-gold">Gök olayları takvimi <ArrowUpRight size={14} /></Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
