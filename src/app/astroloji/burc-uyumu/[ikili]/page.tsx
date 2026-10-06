import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS, type ZodiacSign } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';
import { signCompatibility } from '@/lib/astrology/compatibility';
import { BASE_URL, SITE_NAME, getBreadcrumbJsonLd } from '@/lib/seo';

export const dynamicParams = false;

/** Her ikili tek adreste: burç sırasıyla (koc-aslan; aslan-koc değil). Aynı burç ikilileri dahil 78 sayfa. */
export function generateStaticParams() {
  const out: { ikili: string }[] = [];
  for (let i = 0; i < 12; i++) for (let j = i; j < 12; j++) out.push({ ikili: `${ZODIAC_SIGNS[i].id}-${ZODIAC_SIGNS[j].id}` });
  return out;
}

function parse(ikili: string): [ZodiacSign, ZodiacSign] | null {
  for (const a of ZODIAC_SIGNS) {
    if (!ikili.startsWith(`${a.id}-`)) continue;
    const b = ZODIAC_SIGNS.find((x) => x.id === ikili.slice(a.id.length + 1));
    if (b && ZODIAC_SIGNS.indexOf(a) <= ZODIAC_SIGNS.indexOf(b)) return [a, b];
  }
  return null;
}

const pairName = (a: ZodiacSign, b: ZodiacSign) => (a.id === b.id ? `İki ${a.name}` : `${a.name} ve ${b.name}`);

export async function generateMetadata(props: PageProps<'/astroloji/burc-uyumu/[ikili]'>): Promise<Metadata> {
  const { ikili } = await props.params;
  const pair = parse(ikili);
  if (!pair) return { title: 'Burç ikilisi bulunamadı', robots: { index: false } };
  const [a, b] = pair;
  const r = signCompatibility(a, b);
  const url = `${BASE_URL}/astroloji/burc-uyumu/${ikili}`;
  const title = `${pairName(a, b)} Uyumu: %${r.score} · Aşk ve Dostluk | SpaceTour TR`;
  const description = `${pairName(a, b)} burç uyumu %${r.score} (${r.verdict}). ${r.relation}: ${r.relationText}`.slice(0, 158);
  const image = `${BASE_URL}/astroloji/burclar/${a.id}/opengraph-image`;
  return {
    title: { absolute: title.length > 60 ? `${pairName(a, b)} Uyumu: %${r.score} | SpaceTour TR` : title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: 'tr_TR', type: 'article', images: [{ url: image, width: 1200, height: 630, alt: `${pairName(a, b)} burç uyumu` }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function IkiliPage(props: PageProps<'/astroloji/burc-uyumu/[ikili]'>) {
  const { ikili } = await props.params;
  const pair = parse(ikili);
  if (!pair) notFound();
  const [a, b] = pair;
  const r = signCompatibility(a, b);
  const name = pairName(a, b);

  const faq = [
    { q: `${name} uyumlu mu?`, a: `${name} burçlarının uyum puanı %${r.score}; değerlendirme: ${r.verdict}. ${r.relationText}` },
    { q: `${name} aşkta nasıl bir çift olur?`, a: r.love },
    { q: `${name} arkadaş olarak anlaşır mı?`, a: r.friendship },
    { q: `${name} iş birliğinde nasıl çalışır?`, a: r.work },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Burç uyumu', url: '/astroloji/burc-uyumu' },
    { name: `${name} uyumu`, url: `/astroloji/burc-uyumu/${ikili}` },
  ]);

  // İlgili ikililer: bu iki burcun diğer eşleşmeleri (iç bağlantı)
  const related = ZODIAC_SIGNS.filter((x) => x.id !== b.id).slice(0, 12).map((x) => {
    const [p, q] = ZODIAC_SIGNS.indexOf(a) <= ZODIAC_SIGNS.indexOf(x) ? [a, x] : [x, a];
    return { href: `/astroloji/burc-uyumu/${p.id}-${q.id}`, label: pairName(p, q), score: signCompatibility(p, q).score };
  });

  return (
    <div style={{ '--page-accent': 'var(--rose, #f43f5e)' } as CSSProperties} className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ChapterHero
        variant="band"
        chapter="04 · Uyum"
        section={`Burç uyumu · ${a.element} + ${b.element}`}
        headline={[name, 'uyumu']}
        lede={`${r.relation} · uyum puanı %${r.score} (${r.verdict}). ${r.relationText}`}
        accent="var(--rose, #f43f5e)"
        image={DOC_IMAGES[`sign-${a.id}` as DocImageKey]}
        crumbs={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Astroloji', href: '/astroloji' },
          { label: 'Burç uyumu', href: '/astroloji/burc-uyumu' },
          { label: name },
        ]}
        meta={[
          { k: 'Uyum', v: `%${r.score}` },
          { k: 'Açı', v: r.separation === 0 ? 'Aynı burç' : `${r.separation * 30}°` },
          { k: 'Element', v: `${a.element} + ${b.element}` },
          { k: 'Nitelik', v: `${a.modality} · ${b.modality}` },
        ]}
      />

      <section aria-label={`${name} uyumu`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {[
              { k: 'Aşk', title: `${name} aşkta`, text: r.love },
              { k: 'Dostluk', title: `${name} arkadaşlıkta`, text: r.friendship },
              { k: 'İş birliği', title: `${name} iş hayatında`, text: r.work },
              { k: 'Element', title: `${a.element} ve ${b.element}`, text: r.elementText },
              { k: 'Nitelik', title: `${a.modality} ve ${b.modality}`, text: r.modalityText },
            ].map((sec) => (
              <article key={sec.k} className="border-b border-line pb-8">
                <span className="doc-kicker text-gold">{sec.k}</span>
                <h2 className="doc-title mt-2 text-2xl text-paper">{sec.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-paper/85">{sec.text}</p>
              </article>
            ))}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="doc-kicker text-gold">Güçlü yanlar</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {r.strengths.map((t) => <li key={t} className="border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs text-primary">+ {t}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="doc-kicker text-gold">Dikkat</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {r.watch.map((t) => <li key={t} className="border border-rose/40 bg-rose/5 px-2.5 py-1 text-xs text-rose">− {t}</li>)}
                </ul>
              </div>
            </div>
            <div className="border-l-2 border-gold bg-ink-2 p-4">
              <h2 className="doc-kicker text-gold">Tavsiye</h2>
              <p className="mt-2 text-sm leading-relaxed text-paper/85">{r.advice}</p>
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
            <div className="border border-line bg-ink-2 p-5">
              <div className="flex items-center justify-center gap-4">
                <ZodiacGlyph sign={a.id} size={40} className="text-gold" />
                <span className="display text-4xl text-paper">%{r.score}</span>
                <ZodiacGlyph sign={b.id} size={40} className="text-gold" />
              </div>
              <p className="mt-3 text-center font-mono text-xs uppercase tracking-wider text-gold">{r.verdict}</p>
              <div className="mt-4 space-y-1 border-t border-line pt-3 font-mono text-[11px] text-muted">
                <div className="flex justify-between"><span>{r.relation}</span><span className="text-paper">{r.base}</span></div>
                <div className="flex justify-between"><span>Gelenekte öne çıkan eşleşme</span><span className="text-paper">{r.traditional ? '+3' : '—'}</span></div>
              </div>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <Link href="/astroloji/burc-uyumu" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Başka ikili hesapla <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/sinastri" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Doğum haritalarıyla sinastri <ArrowUpRight size={14} /></Link>
              <Link href={`/astroloji/burclar/${a.id}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{a.name} burcu <ArrowUpRight size={14} /></Link>
              {a.id !== b.id && <Link href={`/astroloji/burclar/${b.id}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{b.name} burcu <ArrowUpRight size={14} /></Link>}
            </div>
          </aside>
        </div>

        <nav aria-label={`${a.name} burcunun diğer uyumları`} className="mx-auto mt-16 max-w-6xl border-t border-line pt-8">
          <h2 className="doc-kicker text-gold">{a.name} burcunun diğer uyumları</h2>
          <ul className="mt-4 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
            {related.map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="flex items-center justify-between bg-ink p-3 font-mono text-xs text-paper/80 hover:bg-ink-2 hover:text-gold">
                  <span>{x.label}</span><span className="text-muted">%{x.score}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  );
}
