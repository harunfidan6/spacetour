import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { planets } from '@/data/planets';
import { PlanetHologram3D } from '@/components/space/PlanetHologram3D';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FitText } from '@/components/motion/FitText';
import { Reveal, Scramble, Ticks } from '@/components/motion/primitives';
import { Marquee } from '@/components/motion/Marquee';
import { buildPlanetMetadata, getBreadcrumbJsonLd, getArticleJsonLd, CONTENT_DATES, BASE_URL } from '@/lib/seo';
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
      <OrbCanvas />
      <div className="px-[var(--gutter)] pt-24 sm:pt-28">
        <div className="flex items-center gap-4 border-b border-line pb-4">
          <Link href="/ansiklopedi/gok-cisimleri" className="label group flex items-center gap-2 text-paper transition-colors hover:text-violet">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Arşiv
          </Link>
          <span className="label text-muted">
            (03) Kayıt {String(index + 1).padStart(2, '0')} / {String(planets.length).padStart(2, '0')}
          </span>
          <span className="label ml-auto hidden text-violet sm:inline">{TYPE_LABEL[planet.type] ?? planet.type}</span>
        </div>

        <FitText heading className="display mt-8 leading-[0.8] text-paper" fallback="18vw" max={420}>
          <SplitReveal as="span" trigger="intro" effect="tilt" stagger={0.05} duration={1.3}>
            {planet.name}
          </SplitReveal>
        </FitText>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-8 lg:col-span-5">
            <div>
              <SplitReveal as="p" by="lines" trigger="intro" delay={0.3} className="mt-6 text-xl leading-snug text-paper/85 sm:text-2xl">
                {planet.description}
              </SplitReveal>
            </div>
            <p className="label text-muted">Sürükle: 360° döndür · Tekerlek: yakınlaştır</p>
          </div>
          <Reveal mode="clip" className="ticks relative lg:col-span-7">
            <Ticks />
            <PlanetHologram3D id={planet.id} />
          </Reveal>
        </div>
      </div>

      <div className="mt-16 border-y border-line bg-violet py-3 text-ink overflow-hidden max-w-full">
        <Marquee speed={50}>
          {[planet.name, TYPE_LABEL[planet.type] ?? planet.type, planet.facts.çap, planet.facts.sıcaklık].map((t, i) => (
            <span key={i} className="label flex items-center gap-6 px-6 text-sm font-semibold">
              {t} <span>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="space-y-20 px-[var(--gutter)] pb-28 pt-16">
        <Reveal items="[data-fact]" stagger={0.08} className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} data-fact className="bg-ink p-5 sm:p-7">
              <div className="label text-muted">{f.k}</div>
              <div className="display display-tight mt-4 text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[0.95] text-violet">
                <Scramble text={f.v} />
              </div>
            </div>
          ))}
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-4">
              <span className="label text-violet">(R)</span>
              <span className="label text-paper">Bilimsel rapor</span>
            </div>
            <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-paper/75 sm:text-xl">
              {paragraphs.map((p, i) => (
                <SplitReveal key={i} as="p" by="lines" stagger={0.06}>
                  {p}
                </SplitReveal>
              ))}
            </div>
          </article>
          <aside className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-4">
              <span className="label text-violet">(T)</span>
              <span className="label text-paper">Ekstra telemetri</span>
            </div>
            <dl className="border-t border-line">
              {telemetry.map((t) => (
                <div key={t.k} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                  <dt className="label text-muted">{t.k}</dt>
                  <dd className="text-right font-mono text-sm text-paper">
                    <Scramble text={t.v} />
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Keşif Tarihçesi ve Türkiye'den Gözlem */}
        <section aria-label="Keşif ve Gözlem" className="grid gap-px border border-line bg-line lg:grid-cols-2 sm:max-lg:fill-row-2">
          <div className="bg-ink p-7 sm:p-9 flex flex-col">
            <div className="flex items-center gap-3 border-b border-line pb-4 mb-6">
              <span className="label text-violet">(K)</span>
              <span className="label text-paper">Keşif &amp; Gözlem Tarihçesi</span>
            </div>
            <div className="space-y-4">
              <div>
                <span className="label text-muted">Tarih &amp; Kaşif</span>
                <p className="doc-serif text-xl text-paper mt-1">{planet.discovery.date} · {planet.discovery.discoverer}</p>
              </div>
              <p className="text-sm leading-relaxed text-paper/75 pt-2">{planet.discovery.history}</p>
            </div>
          </div>

          <div className="bg-ink p-7 sm:p-9 flex flex-col">
            <div className="flex items-center gap-3 border-b border-line pb-4 mb-6">
              <span className="label text-violet">(G)</span>
              <span className="label text-paper">Türkiye’den Nasıl Gözlenir?</span>
            </div>
            <p className="text-sm leading-relaxed text-paper/80">{planet.observationTurkey}</p>
            {planet.moonsInfo && planet.moonsInfo.notable.length > 0 && (
              <div className="mt-auto pt-6 border-t border-line">
                <span className="label text-muted">Önemli Uyduları ({planet.moonsInfo.count} Adet)</span>
                <p className="font-mono text-xs text-paper/90 mt-1">{planet.moonsInfo.notable.join(' · ')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Uzay Görevleri */}
        {planet.missions && planet.missions.length > 0 && (
          <section aria-label="Uzay Görevleri">
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-4">
              <span className="label text-violet">(M)</span>
              <h2 className="label text-paper">Ziyaret Eden Uzay Görevleri</h2>
            </div>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 sm:max-lg:fill-row-2 lg:fill-row-4">
              {planet.missions.map((m) => (
                <div key={m.name} className="bg-ink p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-violet mb-2">
                      <span>{m.agency}</span>
                      <span>{m.year}</span>
                    </div>
                    <h3 className="doc-title text-xl text-paper mb-2">{m.name}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-paper/70 mt-3">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Biliyor Muydunuz */}
        {planet.biliyorMuydun && planet.biliyorMuydun.length > 0 && (
          <section aria-label="Biliyor Muydunuz" className="rounded-xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-violet" />
              <h2 className="doc-title text-xl text-paper">Biliyor Muydunuz?</h2>
            </div>
            <ul className="space-y-4">
              {planet.biliyorMuydun.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-sm sm:text-base leading-relaxed text-paper/75">
                  <span className="doc-kicker shrink-0 mt-0.5 text-paper/40">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* İlişkili Laboratuvar Deneyleri ve Zodyak Bağlantıları (Topic Cluster) */}
        <section aria-label="İlişkili Kozmik Enstrümanlar" className="border-t border-line pt-8">
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <div>
              <span className="doc-kicker text-violet text-xs">Kozmik Ağ · Topic Cluster</span>
              <h2 className="doc-title text-2xl text-paper mt-1">{planet.name} ile İlgili Enstrümanlar</h2>
            </div>
            <span className="doc-caption text-muted">Kozmik Atlas</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Kütleçekim Deneyi */}
            <Link
              href="/ansiklopedi/laboratuvar/kutlecekim"
              className="group flex flex-col justify-between border border-line bg-ink p-5 transition-all hover:border-violet/40 hover:bg-ink-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                  <span>LABORATUVAR</span>
                  <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                  {nameCase(planet.name, 'bulunma', '’')} Kaç Kilosunuz?
                </h3>
                <p className="mt-1 text-xs text-paper/70 leading-relaxed">
                  Yerçekimi odasında ağırlığınızı {nameCase(planet.name, 'ilgi', '’')} yüzey ivmesine göre test edin.
                </p>
              </div>
              <span className="doc-caption text-violet mt-4 font-mono text-[11px]">Simülatörü Başlat →</span>
            </Link>

            {/* 2. Kepler Yörünge Modeli */}
            <Link
              href="/ansiklopedi/laboratuvar/kepler-orrery"
              className="group flex flex-col justify-between border border-line bg-ink p-5 transition-all hover:border-violet/40 hover:bg-ink-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                  <span>3D ORRERY</span>
                  <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                  Güneş Çevresindeki Yörüngesi
                </h3>
                <p className="mt-1 text-xs text-paper/70 leading-relaxed">
                  Kepler yasalarıyla {planet.facts.yörüngeSüresi} periyodundaki 3D yörünge hareketini izleyin.
                </p>
              </div>
              <span className="doc-caption text-violet mt-4 font-mono text-[11px]">3D Modeli Aç →</span>
            </Link>

            {/* 3. Zodyak Yönetici Burcu veya 3D Yolculuk */}
            {PLANET_TO_ZODIAC[planet.id] && PLANET_TO_ZODIAC[planet.id].length > 0 ? (
              <div className="flex flex-col justify-between border border-line bg-ink p-5">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                    <span>ASTROLOJİ ETKİSİ</span>
                    <span className="text-gold">✦</span>
                  </div>
                  <h3 className="doc-title text-lg text-paper">
                    Yönettiği Zodyak Burçları
                  </h3>
                  <p className="mt-1 text-xs text-paper/70 leading-relaxed">
                    {planet.name}, mitolojik ve astrolojik olarak şu arketiplerin yöneticisidir:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {PLANET_TO_ZODIAC[planet.id].map((z) => (
                      <Link
                        key={z.id}
                        href={`/astroloji/burclar/${z.id}`}
                        className="rounded border border-gold/30 bg-gold/10 px-2 py-1 font-mono text-xs text-gold transition-colors hover:bg-gold hover:text-ink"
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
                  <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                    <span>3D SİMÜLASYON</span>
                    <ArrowUpRight size={14} className="text-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="doc-title text-lg text-paper group-hover:text-violet transition-colors">
                    Güneş Sistemi’nde Keşfet
                  </h3>
                  <p className="mt-1 text-xs text-paper/70 leading-relaxed">
                    WebGL 3D uzay atlasında {nameCase(planet.name, 'yonelme', '’')} doğru gerçek zamanlı uçuş yapın.
                  </p>
                </div>
                <span className="doc-caption text-violet mt-4 font-mono text-[11px]">Uzay Uçuşunu Başlat →</span>
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
              <span className={`label relative flex items-center gap-2 text-muted group-hover:text-ink ${dir > 0 ? 'justify-end' : ''}`}>
                {dir < 0 && <ArrowLeft size={14} />} {label} {dir > 0 && <ArrowRight size={14} />}
              </span>
              <span className={`relative mt-4 flex items-center gap-4 ${dir > 0 ? 'flex-row-reverse' : ''}`}>
                <PlanetOrb id={p.id} className="h-14 w-14 transition-transform duration-500 group-hover:scale-110 sm:h-20 sm:w-20" spin={1.5} />
                <span className="display min-w-0 break-words pt-[0.12em] text-[clamp(1.8rem,4vw,4rem)] text-paper transition-colors group-hover:text-ink">{p.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
