import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Telescope, Sparkles, Compass, Heart } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { NextChapter } from '@/components/doc/NextChapter';
import { ZodiacDossier } from '@/components/doc/ZodiacDossier';
import { ZodiacGlyph, PlanetGlyph } from '@/components/ui/CosmicGlyphs';
import { CelestialHorizonBar } from '@/components/astrology/CelestialHorizonBar';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';
import {
  buildSignMetadata,
  getZodiacSignJsonLd,
  getBreadcrumbJsonLd,
} from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ burc: s.id }));
}

export async function generateMetadata(props: PageProps<'/astroloji/burclar/[burc]'>): Promise<Metadata> {
  const { burc } = await props.params;
  return buildSignMetadata(burc);
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

  const signJsonLd = getZodiacSignJsonLd(s.id);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: '12 Burç Arşivi', url: '/astroloji/burclar' },
    { name: `${s.name} Burcu`, url: `/astroloji/burclar/${s.id}` },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative">
      {signJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(signJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* 1. Bespoke Sacred Archetype Hero */}
      <ChapterHero
        variant="band"
        chapter={`04 · ${String(index + 1).padStart(2, '0')}`}
        section={`Burç Dosyası · ${s.dates}`}
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

      {/* 2. Live Celestial Horizon Bar */}
      <CelestialHorizonBar compact />

      {/* 3. 12 Sacred Zodiac Glyphs Quick-Jump Strip */}
      <nav
        aria-label="12 Burç Arasında Hızlı Geçiş"
        className="border-b border-gold/20 bg-ink-2/95 px-[var(--gutter)] py-2.5 backdrop-blur-md"
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <span className="font-mono text-[10px] text-muted uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Compass size={12} className="text-gold" />
            <span className="hidden sm:inline">ZODYAK ÇARKI:</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {ZODIAC_SIGNS.map((sign) => {
              const isCurrent = sign.id === s.id;
              return (
                <Link
                  key={sign.id}
                  href={`/astroloji/burclar/${sign.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1 border transition-all text-xs font-mono whitespace-nowrap ${
                    isCurrent
                      ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(245,197,66,0.35)]'
                      : 'border-white/10 bg-ink text-muted hover:border-gold/40 hover:text-paper'
                  }`}
                  title={`${sign.name} (${sign.dates})`}
                >
                  <ZodiacGlyph sign={sign.id} size={15} className={isCurrent ? 'text-ink' : 'text-gold'} />
                  <span className="text-[11px]">{sign.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Main Body: Aside Dossier + Long-form Sections */}
      <div className="grid gap-12 lg:gap-16 px-[var(--gutter)] py-16 lg:grid-cols-12 mx-auto max-w-7xl">
        {/* Left Sticky Sacred Dossier Card */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col items-start gap-6 border border-gold/40 bg-gradient-to-b from-ink-2 via-ink to-ink p-7 sm:p-8 shadow-[0_0_35px_rgba(245,197,66,0.08)] lg:sticky lg:top-24">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/15 rounded-full blur-2xl" />
              <ZodiacGlyph sign={s.id} size={110} className="text-gold relative z-10" />
            </div>

            <div>
              <span className="doc-caption text-gold uppercase tracking-widest text-[10px]">
                ARKETİPSEL KİMLİK
              </span>
              <h3 className="doc-title mt-1 text-3xl text-paper">{s.traits.archetype}</h3>
              <p className="doc-serif mt-2 text-xl text-gold italic leading-snug">
                “{s.traits.motto}”
              </p>
            </div>

            {/* Quick Astrological Specifications */}
            <dl className="grid w-full grid-cols-2 gap-3.5 border-t border-gold/20 pt-5 font-mono text-xs">
              <div>
                <dt className="doc-caption text-muted text-[10px] uppercase">YÖNETİCİ GEZEGEN</dt>
                <dd className="mt-1 font-bold text-paper">
                  <Link
                    href={`/ansiklopedi/${s.rulingPlanetId}`}
                    className="flex items-center gap-1.5 hover:text-gold transition-colors group"
                    title={`${s.rulingPlanet} Ansiklopedi Dosyası`}
                  >
                    <PlanetGlyph planet={s.rulingPlanet} size={14} className="text-gold" />
                    <span className="underline decoration-gold/40 underline-offset-2 group-hover:decoration-gold">{s.rulingPlanet}</span>
                    <ArrowUpRight size={10} className="text-gold/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="doc-caption text-muted text-[10px] uppercase">ELEMENT & NİTELİK</dt>
                <dd className="mt-1 font-bold text-paper">
                  {s.element} · {s.modality}
                </dd>
              </div>

              <div>
                <dt className="doc-caption text-muted text-[10px] uppercase">UĞURLU METAL</dt>
                <dd className="mt-1 text-paper/85">{s.details.metal}</dd>
              </div>

              <div>
                <dt className="doc-caption text-muted text-[10px] uppercase">UĞURLU SAYILAR</dt>
                <dd className="mt-1 text-gold font-bold">{s.details.luckyNumbers.join(' · ')}</dd>
              </div>

              <div className="col-span-2 border-t border-white/5 pt-2">
                <dt className="doc-caption text-muted text-[10px] uppercase">UYUMLU RENKLER</dt>
                <dd className="mt-1 text-paper/80">{s.details.colors.join(', ')}</dd>
              </div>
            </dl>

            {/* Direct Tool Actions */}
            <div className="w-full space-y-2 pt-2 border-t border-gold/20 font-mono text-xs">
              <Link
                href="/astroloji/dogum-haritasi"
                className="w-full py-2.5 px-3 bg-gold text-ink font-bold flex items-center justify-between transition-opacity hover:opacity-90 uppercase tracking-wider text-[11px]"
              >
                <span>Doğum Haritanı Çıkar</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/astroloji/burc-uyumu"
                className="w-full py-2 px-3 border border-gold/40 text-gold hover:bg-gold/10 flex items-center justify-between transition-colors uppercase tracking-wider text-[11px]"
              >
                <span>{s.name} Uyumunu Hesapla</span>
                <Heart size={13} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content Stream */}
        <div className="space-y-14 lg:col-span-8">
          <ZodiacDossier sign={s} index={index} image={signImage(s.id)} />

          {/* Deep Tarot Arcana Section */}
          <section className="border border-gold/30 bg-gold/[0.04] p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <h2 className="doc-kicker text-gold">
                Majör Arkana Tarot Eşleşmesi · {s.tarotCard.name} ({s.tarotCard.number})
              </h2>
            </div>
            <p className="text-base leading-relaxed text-paper/85 font-sans">
              {s.tarotCard.symbolism}
            </p>
            <p className="doc-serif text-2xl sm:text-3xl text-gold italic pt-2">
              “{s.tarotCard.guidance}”
            </p>
          </section>

          {/* Strengths & Shadows */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="border border-lime/30 bg-ink-2/60 p-5 space-y-3">
              <h2 className="doc-kicker text-lime font-mono">IŞIKLI / GÜÇLÜ YÖNLER</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.strengths.map((t) => (
                  <li key={t} className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs text-lime font-mono">
                    + {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-rose/30 bg-ink-2/60 p-5 space-y-3">
              <h2 className="doc-kicker text-rose font-mono">GÖLGE / GELİŞİM YÖNLERİ</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.shadows.map((t) => (
                  <li key={t} className="rounded-full border border-rose/40 bg-rose/10 px-3 py-1 text-xs text-rose font-mono">
                    − {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Cosmic Love Matches */}
          {matches.length > 0 && (
            <section className="space-y-4">
              <h2 className="doc-kicker text-gold">
                Kozmik Çekim & Aşk Uyumu ({s.name})
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2 font-mono text-xs">
                {matches.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/astroloji/burclar/${m.id}`}
                      className="group flex items-center gap-3 border border-gold/20 bg-ink p-4 transition-all hover:border-gold/50 hover:bg-ink-2"
                    >
                      <ZodiacGlyph sign={m.id} size={26} className="text-gold shrink-0" />
                      <div>
                        <span className="doc-title text-lg text-paper block">{m.name}</span>
                        <span className="text-[10px] text-muted">{m.element} · {m.modality}</span>
                      </div>
                      <ArrowUpRight size={15} className="ml-auto text-gold/60 transition-colors group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sky Exploration Hop */}
          <div className="flex flex-col gap-2 sm:flex-row font-mono text-xs">
            <Link
              href="/astroloji/burc-uyumu"
              className="group flex flex-1 items-center justify-between border border-gold/30 bg-ink p-4 text-paper transition-all hover:bg-ink-2 hover:border-gold"
            >
              <span className="font-bold text-gold uppercase">Burç Uyumunu Hesapla →</span>
              <Heart size={16} className="text-gold" />
            </Link>
            <Link
              href="/harita/planetaryum"
              className="group flex flex-1 items-center justify-between border border-line bg-ink p-4 text-paper transition-all hover:bg-ink-2 hover:border-line"
            >
              <span className="flex items-center gap-2">
                <Telescope size={16} className="text-paper/70" /> {s.name} Takımyıldızını 3D Gör
              </span>
              <ArrowUpRight size={16} className="text-muted group-hover:text-paper" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Next Sign in Circle */}
      <NextChapter
        next={{
          href: `/astroloji/burclar/${next.id}`,
          label: 'Sıradaki Burç Arketipi',
          number: String(((index + 1) % 12) + 1).padStart(2, '0'),
          title: next.name,
          image: signImage(next.id),
        }}
        prev={{ href: `/astroloji/burclar/${prev.id}`, title: prev.name }}
        indexHref="/astroloji/burclar"
        indexLabel="12 Burç Arşivi"
      />
    </div>
  );
}
