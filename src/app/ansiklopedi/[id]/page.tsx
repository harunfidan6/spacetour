import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { planets, type CelestialBody } from '@/data/planets';
import { PlanetHologram3D } from '@/components/space/PlanetHologram3D';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FitText } from '@/components/motion/FitText';
import { Reveal } from '@/components/motion/primitives';
import { buildPlanetMetadata, getBreadcrumbJsonLd, getArticleJsonLd, getFaqPageJsonLd, CONTENT_DATES, BASE_URL } from '@/lib/seo';
import { nameCase } from '@/lib/text';

export function generateStaticParams() {
  return planets.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/ansiklopedi/[id]'>) {
  const { id } = await props.params;
  return buildPlanetMetadata(id);
}

const TYPE_LABEL: Record<string, string> = {
  gezegen: 'Gezegen',
  yıldız: 'Yıldız',
  ay: 'Doğal uydu',
  'cüce-gezegen': 'Cüce gezegen',
};

const PLANET_TO_ZODIAC: Record<string, { id: string; name: string }[]> = {
  mars: [
    { id: 'koc', name: 'Koç Burcu' },
    { id: 'akrep', name: 'Akrep Burcu (Klasik)' },
  ],
  venus: [
    { id: 'boga', name: 'Boğa Burcu' },
    { id: 'terazi', name: 'Terazi Burcu' },
  ],
  merkur: [
    { id: 'ikizler', name: 'İkizler Burcu' },
    { id: 'basak', name: 'Başak Burcu' },
  ],
  ay: [{ id: 'yengec', name: 'Yengeç Burcu' }],
  gunes: [{ id: 'aslan', name: 'Aslan Burcu' }],
  jupiter: [
    { id: 'yay', name: 'Yay Burcu' },
    { id: 'balik', name: 'Balık Burcu (Klasik)' },
  ],
  saturn: [
    { id: 'oglak', name: 'Oğlak Burcu' },
    { id: 'kova', name: 'Kova Burcu (Klasik)' },
  ],
  uranus: [{ id: 'kova', name: 'Kova Burcu' }],
  neptun: [{ id: 'balik', name: 'Balık Burcu' }],
  pluton: [{ id: 'akrep', name: 'Akrep Burcu' }],
};

/** "-60°C (ortalama)", "5,500°C (yüzey)", "-173°C ila 427°C" gibi değerleri cümleye çevirir */
function tempAnswer(name: string, raw: string) {
  const m = raw.match(/^(.*?)\s*\((.*)\)$/);
  const value = (m ? m[1] : raw).trim();
  const qual = m?.[2].trim();
  const nde = nameCase(name, 'bulunma', '’');
  if (value.includes(' ila ')) return `${nde} sıcaklık ${value} arasında değişir.`;
  if (qual === 'ortalama') return `${nde} ortalama sıcaklık ${value} civarındadır.`;
  if (qual === 'yüzey') return `${nameCase(name, 'ilgi', '’')} yüzey sıcaklığı yaklaşık ${value}.`;
  if (qual) return `${nde} sıcaklık ${qual} seviyesinde yaklaşık ${value}.`;
  return `${nde} sıcaklık yaklaşık ${value}.`;
}

function moonAnswer(p: CelestialBody) {
  const nin = nameCase(p.name, 'ilgi', '’');
  const count = p.facts.uyduSayısı;
  const notable = p.moonsInfo.notable;
  if (count === 0) return `${nin} doğal uydusu yoktur.`;
  if (count === 1) return `${nin} tek doğal uydusu var: ${notable[0] ?? 'Ay'}.`;
  // Dev gezegenlerde sayı yeni keşiflerle artıyor; tarihini belirt
  const asOf = count >= 10 ? ' (2026 itibarıyla yörüngesi doğrulanmış olanlar)' : '';
  const list = notable.length ? ` ${notable.length >= count ? 'Uyduları' : 'En bilinenleri'}: ${notable.join(', ')}.` : '';
  return `${nin} ${count} doğal uydusu var${asOf}.${list}`;
}

/** Aramada sık sorulan sorular; cevaplar yalnızca sayfadaki doğrulanmış veriden üretilir */
function planetFaq(p: CelestialBody) {
  const n = p.name;
  const nin = nameCase(n, 'ilgi', '’');
  const nde = nameCase(n, 'bulunma', '’');
  const f = p.facts;
  const faq: { question: string; answer: string }[] = [];
  faq.push({ question: `${n} ne kadar büyük?`, answer: `${nin} çapı yaklaşık ${f.çap}, kütlesi ${f.kütle}.` });
  if (p.type === 'yıldız') {
    faq.push({ question: `${nin} sıcaklığı kaç derece?`, answer: `${tempAnswer(n, f.sıcaklık)} Çekirdeğinde ise sıcaklık yaklaşık 15 milyon °C’ye ulaşır.` });
    faq.push({ question: `${n} kendi ekseni etrafında kaç günde döner?`, answer: `${n} katı bir cisim olmadığı için her enlemde farklı hızda döner; bir dönüşü yaklaşık ${f.günSüresi} sürer.` });
  } else if (p.type === 'ay') {
    faq.push({ question: `${n} Dünya’nın çevresini ne kadar sürede dolaşır?`, answer: `${nin} Dünya çevresindeki bir turu ${f.yörüngeSüresi} sürer. Kendi ekseni etrafındaki dönüşü de aynı süreyi aldığından Dünya’ya hep aynı yüzünü gösterir.` });
    faq.push({ question: `${nde} sıcaklık kaç derece?`, answer: `Atmosferi olmadığı için gece ile gündüz arasındaki fark çok büyüktür. ${tempAnswer(n, f.sıcaklık)}` });
  } else {
    faq.push({
      question: `${nin} kaç uydusu var?`,
      answer: moonAnswer(p),
    });
    faq.push({ question: `${nde} bir gün ne kadar sürer?`, answer: `${nin} kendi ekseni etrafındaki bir dönüşü ${f.günSüresi} sürer.` });
    faq.push({ question: `${nde} bir yıl ne kadar sürer?`, answer: `${nin} Güneş çevresindeki bir turu ${f.yörüngeSüresi} sürer; ${nde} bir yıl bu kadardır.` });
    faq.push({ question: `${n} Güneş’e ne kadar uzak?`, answer: `${nin} Güneş’e ortalama uzaklığı ${f.güneşeUzaklık}’dir.` });
    faq.push({ question: `${nde} sıcaklık kaç derece?`, answer: tempAnswer(n, f.sıcaklık) });
    faq.push({
      question: `${nin} halkası var mı?`,
      answer: f.halkaSistemi ? `Evet, ${nin} bir halka sistemi var.` : `Hayır, ${nin} bilinen bir halka sistemi yok.`,
    });
  }
  if (p.id !== 'dunya' && p.observationTurkey) faq.push({ question: `${n} Türkiye’den nasıl gözlemlenir?`, answer: p.observationTurkey });
  return faq;
}

export default async function PlanetDetail(props: PageProps<'/ansiklopedi/[id]'>) {
  const { id } = await props.params;
  const index = planets.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  const planet = planets[index];
  const prev = planets[(index - 1 + planets.length) % planets.length];
  const next = planets[(index + 1) % planets.length];

  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ansiklopedi', url: '/ansiklopedi' },
    { name: 'Gök Cisimleri', url: '/ansiklopedi/gok-cisimleri' },
    { name: planet.name, url: `/ansiklopedi/${planet.id}` },
  ]);

  const thingJson = getArticleJsonLd({
    path: `/ansiklopedi/${planet.id}`,
    headline: `${planet.name} — Bilimsel Dosyası`,
    description: planet.description,
    image: `${BASE_URL}/ansiklopedi/${planet.id}/opengraph-image`,
    datePublished: CONTENT_DATES.planets.published,
    dateModified: CONTENT_DATES.planets.modified,
    about: { '@type': 'Thing', name: planet.name, additionalType: 'https://en.wikipedia.org/wiki/Astronomical_body' },
  });

  const facts = [
    { k: 'Çap', v: planet.facts.çap },
    { k: 'Kütle', v: planet.facts.kütle },
    { k: 'Yörünge süresi', v: planet.facts.yörüngeSüresi },
    { k: 'Sıcaklık', v: planet.facts.sıcaklık },
  ];
  const telemetry = [
    { k: 'Güneş’e uzaklık', v: planet.facts.güneşeUzaklık },
    { k: 'Gün süresi', v: planet.facts.günSüresi },
    { k: 'Doğal uydu', v: `${planet.facts.uyduSayısı} adet` },
    { k: 'Halka sistemi', v: planet.facts.halkaSistemi ? 'Var' : 'Yok' },
  ];
  const paragraphs = planet.detay.split('\n').filter(Boolean);
  const faq = planetFaq(planet);

  return (
    <div className="relative overflow-x-clip" style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(thingJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqPageJsonLd(faq)) }}
      />
      <OrbCanvas />
      <div className="px-[var(--gutter)] pt-24 sm:pt-28">
        {/* Konum satırı; tür etiketi mobilde de görünür */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-4 text-sm">
          <Link href="/ansiklopedi/gok-cisimleri" className="group flex items-center gap-2 font-medium text-paper transition-colors hover:text-violet">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Arşiv
          </Link>
          <span className="text-paper/70">
            Kayıt {String(index + 1).padStart(2, '0')} / {String(planets.length).padStart(2, '0')}
          </span>
          <span className="ml-auto text-violet">{TYPE_LABEL[planet.type] ?? planet.type}</span>
        </div>

        {/* Sayfanın tek büyük başlığı: genişliğe sığar, en fazla 12rem */}
        <FitText heading className="display mt-8 leading-[0.8] text-paper" fallback="min(18vw, 12rem)" max={192}>
          <SplitReveal as="span" trigger="intro" effect="tilt" stagger={0.05} duration={1.3}>
            {planet.name}
          </SplitReveal>
        </FitText>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div>
              <SplitReveal as="p" by="lines" trigger="intro" delay={0.3} className="text-lg leading-relaxed text-paper/85 sm:text-xl">
                {planet.description}
              </SplitReveal>
            </div>
            <p className="text-sm text-paper/70">Sürükle: 360° döndür · Tekerlek: yakınlaştır</p>
          </div>
          <Reveal mode="clip" className="relative lg:col-span-7">
            <PlanetHologram3D id={planet.id} />
          </Reveal>
        </div>
      </div>

      <div className="space-y-16 px-[var(--gutter)] py-14 sm:space-y-20 sm:py-20">
        <Reveal items="[data-fact]" stagger={0.08} className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} data-fact className="bg-ink p-5 sm:p-7">
              <div className="text-sm text-paper/70">{f.k}</div>
              <div className="doc-title mt-3 text-[clamp(1.25rem,2.2vw,2rem)] text-violet">{f.v}</div>
            </div>
          ))}
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="mb-6 border-t border-line pt-5">
              <span className="doc-title block text-xl text-paper sm:text-2xl">Bilimsel rapor</span>
            </div>
            <div className="max-w-3xl space-y-5 text-base leading-relaxed text-paper/85 sm:text-lg">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
          <aside className="lg:col-span-4">
            <div className="mb-2 border-t border-line pt-5">
              <span className="doc-title block text-xl text-paper sm:text-2xl">Ekstra telemetri</span>
            </div>
            <dl>
              {telemetry.map((t) => (
                <div key={t.k} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                  <dt className="text-sm text-paper/70">{t.k}</dt>
                  <dd className="text-right font-mono text-sm text-paper">{t.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Keşif Tarihçesi ve Türkiye'den Gözlem */}
        <section aria-label="Keşif ve Gözlem" className="grid gap-px border border-line bg-line lg:grid-cols-2 sm:max-lg:fill-row-2">
          <div className="flex flex-col bg-ink p-6 sm:p-8">
            <span className="doc-title mb-5 block text-xl text-paper sm:text-2xl">Keşif &amp; Gözlem Tarihçesi</span>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-paper/70">Tarih &amp; Kaşif</span>
                <p className="doc-serif mt-1 text-xl text-paper">{planet.discovery.date} · {planet.discovery.discoverer}</p>
              </div>
              <p className="text-base leading-relaxed text-paper/85">{planet.discovery.history}</p>
            </div>
          </div>

          <div className="flex flex-col bg-ink p-6 sm:p-8">
            <span className="doc-title mb-5 block text-xl text-paper sm:text-2xl">Türkiye’den Nasıl Gözlenir?</span>
            <p className="text-base leading-relaxed text-paper/85">{planet.observationTurkey}</p>
            {planet.moonsInfo && planet.moonsInfo.notable.length > 0 && (
              <div className="mt-auto pt-6">
                <div className="border-t border-line pt-5">
                  <span className="text-sm text-paper/70">Önemli Uyduları ({planet.moonsInfo.count} Adet)</span>
                  <p className="mt-1 text-[15px] leading-relaxed text-paper/90">{planet.moonsInfo.notable.join(' · ')}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Uzay Görevleri */}
        {planet.missions && planet.missions.length > 0 && (
          <section aria-label="Uzay Görevleri">
            <div className="mb-6 border-t border-line pt-5">
              <h2 className="doc-title text-xl text-paper sm:text-2xl">Ziyaret Eden Uzay Görevleri</h2>
            </div>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 sm:max-lg:fill-row-2 lg:fill-row-4">
              {planet.missions.map((m) => (
                <div key={m.name} className="flex flex-col bg-ink p-6">
                  <div className="flex items-center justify-between gap-3 text-sm text-violet">
                    <span>{m.agency}</span>
                    <span className="tabular-nums">{m.year}</span>
                  </div>
                  <h3 className="doc-title mt-2 text-xl text-paper">{m.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-paper/80">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Biliyor Muydunuz */}
        {planet.biliyorMuydun && planet.biliyorMuydun.length > 0 && (
          <section aria-label="Biliyor Muydunuz" className="rounded-xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden className="h-2 w-2 rounded-full bg-violet" />
              <h2 className="doc-title text-xl text-paper sm:text-2xl">Biliyor Muydunuz?</h2>
            </div>
            <ul className="space-y-4">
              {planet.biliyorMuydun.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-base leading-relaxed text-paper/85">
                  <span aria-hidden className="shrink-0 text-paper/40">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sık sorulanlar */}
        <section aria-label={`${planet.name} hakkında sık sorulanlar`}>
          <div className="mb-6 border-t border-line pt-5">
            <h2 className="doc-title text-xl text-paper sm:text-2xl">{planet.name} hakkında sık sorulanlar</h2>
          </div>
          <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {faq.map((q) => (
              <div key={q.question} className="bg-ink p-6">
                <dt className="doc-title text-lg text-paper">{q.question}</dt>
                <dd className="mt-2 text-base leading-relaxed text-paper/85">{q.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* İlişkili Laboratuvar Deneyleri ve Zodyak Bağlantıları (Topic Cluster) */}
        <section aria-label="İlişkili Kozmik Enstrümanlar">
          <div className="mb-6 border-t border-line pt-5">
            <h2 className="doc-title text-xl text-paper sm:text-2xl">{planet.name} ile İlgili Enstrümanlar</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Kütleçekim Deneyi */}
            <Link
              href="/ansiklopedi/laboratuvar/kutlecekim"
              className="group flex flex-col justify-between border border-line bg-ink p-5 transition-all hover:border-violet/40 hover:bg-ink-2"
            >
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-paper/70">
                  <span>Laboratuvar</span>
                  <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                  {nameCase(planet.name, 'bulunma', '’')} Kaç Kilosunuz?
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/80">
                  Yerçekimi odasında ağırlığınızı {nameCase(planet.name, 'ilgi', '’')} yüzey ivmesine göre test edin.
                </p>
              </div>
              <span className="mt-4 text-sm font-medium text-violet">Simülatörü Başlat →</span>
            </Link>

            {/* 2. Kepler Yörünge Modeli */}
            <Link
              href="/ansiklopedi/laboratuvar/kepler-orrery"
              className="group flex flex-col justify-between border border-line bg-ink p-5 transition-all hover:border-violet/40 hover:bg-ink-2"
            >
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-paper/70">
                  <span>3D orrery</span>
                  <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                  Güneş Çevresindeki Yörüngesi
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/80">
                  Kepler yasalarıyla {planet.facts.yörüngeSüresi} periyodundaki 3D yörünge hareketini izleyin.
                </p>
              </div>
              <span className="mt-4 text-sm font-medium text-violet">3D Modeli Aç →</span>
            </Link>

            {/* 3. Zodyak Yönetici Burcu veya 3D Yolculuk */}
            {PLANET_TO_ZODIAC[planet.id] && PLANET_TO_ZODIAC[planet.id].length > 0 ? (
              <div className="flex flex-col justify-between border border-line bg-ink p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-paper/70">
                    <span>Astroloji etkisi</span>
                    <span className="text-gold">✦</span>
                  </div>
                  <h3 className="doc-title text-lg text-paper">
                    Yönettiği Zodyak Burçları
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-paper/80">
                    {planet.name}, mitolojik ve astrolojik olarak şu arketiplerin yöneticisidir:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PLANET_TO_ZODIAC[planet.id].map((z) => (
                      <Link
                        key={z.id}
                        href={`/astroloji/burclar/${z.id}`}
                        className="rounded border border-gold/30 bg-gold/10 px-2.5 py-1 text-sm text-gold transition-colors hover:bg-gold hover:text-ink"
                      >
                        {z.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/yolculuk"
                className="group flex flex-col justify-between border border-line bg-ink p-5 transition-all hover:border-violet/40 hover:bg-ink-2"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-paper/70">
                    <span>3D simülasyon</span>
                    <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                    Güneş Sistemi’nde Keşfet
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-paper/80">
                    WebGL 3D uzay atlasında {nameCase(planet.name, 'yonelme', '’')} doğru gerçek zamanlı uçuş yapın.
                  </p>
                </div>
                <span className="mt-4 text-sm font-medium text-violet">Uzay Uçuşunu Başlat →</span>
              </Link>
            )}
          </div>
        </section>

        <nav className="grid gap-px border border-line bg-line lg:grid-cols-2" aria-label="Kayıtlar arasında gezin">
          {[
            { p: prev, label: 'Önceki kayıt', dir: -1 },
            { p: next, label: 'Sonraki kayıt', dir: 1 },
          ].map(({ p, label, dir }) => (
            <Link key={label} href={`/ansiklopedi/${p.id}`} className={`group relative overflow-hidden bg-ink p-6 sm:p-10 ${dir > 0 ? 'text-right' : ''}`}>
              <span aria-hidden className={`absolute inset-0 scale-x-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 ${dir > 0 ? 'origin-right' : 'origin-left'}`} />
              <span className={`relative flex items-center gap-2 text-sm text-paper/70 group-hover:text-ink ${dir > 0 ? 'justify-end' : ''}`}>
                {dir < 0 && <ArrowLeft size={14} />} {label} {dir > 0 && <ArrowRight size={14} />}
              </span>
              <span className={`relative mt-4 flex items-center gap-4 ${dir > 0 ? 'flex-row-reverse' : ''}`}>
                <PlanetOrb id={p.id} className="h-14 w-14 transition-transform duration-500 group-hover:scale-110 sm:h-20 sm:w-20" spin={1.5} />
                <span className="doc-title min-w-0 text-2xl text-paper transition-colors group-hover:text-ink sm:text-3xl">{p.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
