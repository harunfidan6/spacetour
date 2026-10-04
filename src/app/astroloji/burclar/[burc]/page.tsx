import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Telescope } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { NextChapter } from '@/components/doc/NextChapter';
import { ZodiacDossier } from '@/components/doc/ZodiacDossier';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ burc: s.id }));
}

export async function generateMetadata(props: PageProps<'/astroloji/burclar/[burc]'>): Promise<Metadata> {
  const { burc } = await props.params;
  const s = ZODIAC_SIGNS.find((x) => x.id === burc);
  if (!s) return {};
  return { title: `${s.name} burcu · Astroloji`, description: s.overview };
}

const signImage = (id: string) => DOC_IMAGES[`sign-${id}` as DocImageKey];

export default async function BurcPage(props: PageProps<'/astroloji/burclar/[burc]'>) {
  const { burc } = await props.params;
  const index = ZODIAC_SIGNS.findIndex((x) => x.id === burc);
  if (index === -1) notFound();
  const s = ZODIAC_SIGNS[index];
  const next = ZODIAC_SIGNS[(index + 1) % 12];
  const prev = ZODIAC_SIGNS[(index + 11) % 12];
  const matches = ZODIAC_SIGNS.filter((x) => s.loveCompatibility.includes(x.id));

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      <ChapterHero
        variant="band"
        chapter={`04 · ${String(index + 1).padStart(2, '0')}`}
        section={`Burç dosyası · ${s.dates}`}
        headline={[s.name, s.latinName]}
        lede={s.overview}
        accent="var(--gold)"
        image={signImage(s.id)}
        crumbs={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Astroloji', href: '/astroloji' },
          { label: '12 burç', href: '/astroloji/burclar' },
          { label: s.name },
        ]}
        meta={[
          { k: 'Element', v: s.element },
          { k: 'Nitelik', v: s.modality },
          { k: 'Yönetici', v: s.rulingPlanet },
          { k: 'Uğurlu taş', v: s.details.stone },
        ]}
      />

      <div className="grid gap-16 px-[var(--gutter)] py-20 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="flex flex-col items-start gap-6 border border-white/10 bg-ink-2 p-8 lg:sticky lg:top-24">
            <ZodiacGlyph sign={s.id} size={120} className="text-gold" />
            <div>
              <div className="doc-caption">Arketip</div>
              <div className="doc-title mt-2 text-3xl text-paper">{s.traits.archetype}</div>
              <p className="doc-serif mt-3 text-xl text-gold">“{s.traits.motto}”</p>
            </div>
            <dl className="grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <dt className="doc-caption">Metal</dt>
                <dd className="mt-1 text-sm text-paper">{s.details.metal}</dd>
              </div>
              <div>
                <dt className="doc-caption">Uğurlu sayılar</dt>
                <dd className="mt-1 text-sm text-paper">{s.details.luckyNumbers.join(' · ')}</dd>
              </div>
              <div className="col-span-2">
                <dt className="doc-caption">Renkler</dt>
                <dd className="mt-1 text-sm text-paper">{s.details.colors.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="space-y-14 lg:col-span-8">
          <ZodiacDossier sign={s} index={index} image={signImage(s.id)} />

          <section className="border-l-2 border-gold pl-6">
            <h2 className="doc-kicker text-gold">
              Tarot · {s.tarotCard.name} ({s.tarotCard.number})
            </h2>
            <p className="mt-4 text-base leading-relaxed text-paper/75">{s.tarotCard.symbolism}</p>
            <p className="doc-serif mt-4 text-3xl text-paper">“{s.tarotCard.guidance}”</p>
          </section>

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="doc-kicker mb-4 text-paper/70">Güçlü yönler</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.strengths.map((t) => (
                  <li key={t} className="rounded-full border border-lime/40 px-3 py-1 text-xs text-lime">
                    + {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="doc-kicker mb-4 text-paper/70">Gölge yönler</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.shadows.map((t) => (
                  <li key={t} className="rounded-full border border-rose/40 px-3 py-1 text-xs text-rose">
                    − {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {matches.length > 0 && (
            <section>
              <h2 className="doc-kicker mb-4 text-paper/70">Kozmik uyum</h2>
              <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
                {matches.map((m) => (
                  <li key={m.id}>
                    <Link href={`/astroloji/burclar/${m.id}`} className="group flex items-center gap-4 bg-ink px-5 py-4 transition-colors hover:bg-ink-2">
                      <ZodiacGlyph sign={m.id} size={28} className="text-gold" />
                      <span className="doc-title text-xl text-paper">{m.name}</span>
                      <ArrowUpRight size={15} className="ml-auto text-paper/50 transition-colors group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex flex-col gap-px bg-white/10 sm:flex-row">
            <Link href="/astroloji/burc-uyumu" className="group flex flex-1 items-center justify-between bg-ink px-5 py-5 text-paper transition-colors hover:bg-ink-2">
              <span className="text-sm">Burç uyumunu hesapla</span>
              <ArrowUpRight size={16} className="text-paper/50 group-hover:text-gold" />
            </Link>
            <Link href="/harita/planetaryum" className="group flex flex-1 items-center justify-between bg-ink px-5 py-5 text-paper transition-colors hover:bg-ink-2">
              <span className="flex items-center gap-2 text-sm">
                <Telescope size={16} /> {s.name} takımyıldızını gök haritasında gör
              </span>
              <ArrowUpRight size={16} className="text-paper/50 group-hover:text-gold" />
            </Link>
          </div>
        </div>
      </div>

      <NextChapter
        next={{
          href: `/astroloji/burclar/${next.id}`,
          label: 'Sıradaki burç',
          number: String(((index + 1) % 12) + 1).padStart(2, '0'),
          title: next.name,
          image: signImage(next.id),
        }}
        prev={{ href: `/astroloji/burclar/${prev.id}`, title: prev.name }}
        indexHref="/astroloji/burclar"
        indexLabel="12 burç arşivi"
      />
    </div>
  );
}
