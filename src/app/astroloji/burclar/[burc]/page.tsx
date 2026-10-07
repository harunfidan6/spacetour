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
import { pairSlug, signCompatibility } from '@/lib/astrology/compatibility';
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

      {/* 3. 12 burç arasında hızlı geçiş: sade, normal yazımlı düğmeler; içerik ızgarasıyla aynı genişlik */}
      <nav
        aria-label="12 Burç Arasında Hızlı Geçiş"
        className="border-b border-line bg-ink-2 px-[var(--gutter)] py-3"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <span className="mr-1 flex shrink-0 items-center gap-1.5 text-sm text-paper/70">
            <Compass size={14} className="text-gold" />
            <span className="hidden sm:inline">Zodyak çarkı</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {ZODIAC_SIGNS.map((sign) => {
              const isCurrent = sign.id === s.id;
              return (
                <Link
                  key={sign.id}
                  href={`/astroloji/burclar/${sign.id}`}
                  className={`flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1.5 text-sm transition-colors ${
                    isCurrent
                      ? 'border-gold bg-gold font-semibold text-ink'
                      : 'border-line text-paper/80 hover:border-gold/40 hover:text-paper'
                  }`}
                  title={`${sign.name} (${sign.dates})`}
                >
                  <ZodiacGlyph sign={sign.id} size={14} className={isCurrent ? 'text-ink' : 'text-gold'} />
                  <span>{sign.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Main Body: Aside Dossier + Long-form Sections */}
      <div className="grid gap-12 lg:gap-16 px-[var(--gutter)] py-14 sm:py-20 lg:grid-cols-12 mx-auto max-w-7xl">
        {/* Sol künye kartı: parıltı ve büyük harfli mono etiketler yerine düz zemin, okunur alan adları */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col items-start gap-6 border border-gold/25 bg-ink-2 p-6 sm:p-8 lg:sticky lg:top-24">
            <ZodiacGlyph sign={s.id} size={88} className="text-gold" />

            <div>
              <span className="text-sm text-paper/70">Arketipsel kimlik</span>
              <p className="doc-title mt-1 text-2xl text-paper">{s.traits.archetype}</p>
              <p className="doc-serif mt-2 text-xl text-gold leading-snug">
                “{s.traits.motto}”
              </p>
            </div>

            {/* Quick Astrological Specifications */}
            <dl className="grid w-full grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5 text-[15px]">
              <div>
                <dt className="text-sm text-paper/70">Yönetici gezegen</dt>
                <dd className="mt-1 font-semibold text-paper">
                  <Link
                    href={`/ansiklopedi/${s.rulingPlanetId}`}
                    className="flex items-center gap-1.5 hover:text-gold transition-colors group"
                    title={`${s.rulingPlanet} Ansiklopedi Dosyası`}
                  >
                    <PlanetGlyph planet={s.rulingPlanet} size={14} className="text-gold" />
                    <span className="underline decoration-gold/40 underline-offset-2 group-hover:decoration-gold">{s.rulingPlanet}</span>
                    <ArrowUpRight size={12} className="text-gold/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-paper/70">Element & nitelik</dt>
                <dd className="mt-1 font-semibold text-paper">
                  {s.element} · {s.modality}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-paper/70">Uğurlu metal</dt>
                <dd className="mt-1 text-paper/85">{s.details.metal}</dd>
              </div>

              <div>
                <dt className="text-sm text-paper/70">Uğurlu sayılar</dt>
                <dd className="mt-1 font-semibold tabular-nums text-gold">{s.details.luckyNumbers.join(' · ')}</dd>
              </div>

              <div className="col-span-2 border-t border-line pt-3">
                <dt className="text-sm text-paper/70">Uyumlu renkler</dt>
                <dd className="mt-1 text-paper/85">{s.details.colors.join(', ')}</dd>
              </div>
            </dl>

            {/* Direct Tool Actions */}
            <div className="w-full space-y-2 border-t border-line pt-5 text-sm">
              <Link
                href="/astroloji/dogum-haritasi"
                className="flex w-full items-center justify-between bg-gold px-3 py-2.5 font-semibold text-ink transition-opacity hover:opacity-90"
              >
                <span>Doğum Haritanı Çıkar</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link
                href="#uyum"
                className="flex w-full items-center justify-between border border-gold/40 px-3 py-2.5 text-gold transition-colors hover:bg-gold/10"
              >
                <span>{s.name} Uyumunu Hesapla</span>
                <Heart size={14} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content Stream */}
        <div className="space-y-14 sm:space-y-16 lg:col-span-8">
          <ZodiacDossier sign={s} index={index} image={signImage(s.id)} />

          {/* Tarot eşleşmesi: başlık normal yazımla, alıntı daha ölçülü boyutta */}
          <section className="space-y-4 border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
            <div className="flex items-start gap-2">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-gold" />
              <h2 className="text-lg font-semibold leading-snug text-paper">
                Majör Arkana Tarot Eşleşmesi · {s.tarotCard.name} ({s.tarotCard.number})
              </h2>
            </div>
            <p className="text-base leading-relaxed text-paper/85">
              {s.tarotCard.symbolism}
            </p>
            <p className="doc-serif text-xl leading-snug text-gold sm:text-2xl">
              “{s.tarotCard.guidance}”
            </p>
          </section>

          {/* Güçlü ve gölge yönler: renk yalnızca başlıkta ve +/− işaretinde, haplar sade */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 border border-lime/25 bg-ink-2/60 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-lime">Işıklı / güçlü yönler</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.strengths.map((t) => (
                  <li key={t} className="rounded-full border border-lime/30 px-3 py-1 text-sm text-paper/85">
                    <span className="text-lime">+</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 border border-rose/25 bg-ink-2/60 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-rose">Gölge / gelişim yönleri</h2>
              <ul className="flex flex-wrap gap-2">
                {s.traits.shadows.map((t) => (
                  <li key={t} className="rounded-full border border-rose/30 px-3 py-1 text-sm text-paper/85">
                    <span className="text-rose">−</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Cosmic Love Matches */}
          {matches.length > 0 && (
            <section className="space-y-4">
              <h2 className="doc-title text-xl text-paper sm:text-2xl">
                Kozmik Çekim & Aşk Uyumu ({s.name})
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {matches.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/astroloji/burc-uyumu/${pairSlug(s.id, m.id)}`}
                      className="group flex items-center gap-3 border border-gold/20 bg-ink p-4 transition-colors hover:border-gold/50 hover:bg-ink-2"
                    >
                      <ZodiacGlyph sign={m.id} size={26} className="text-gold shrink-0" />
                      <div>
                        <span className="doc-title text-lg text-paper block">{s.name} – {m.name}</span>
                        <span className="text-sm text-paper/70">{m.element} · {m.modality} · uyum %{signCompatibility(s, m).score}</span>
                      </div>
                      <ArrowUpRight size={15} className="ml-auto shrink-0 text-gold/60 transition-colors group-hover:text-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Diğer 11 burçla (ve kendisiyle) uyum: ikili sayfalarına bağlantılar */}
          <section id="uyum" className="space-y-4">
            <h2 className="doc-title text-xl text-paper sm:text-2xl">{s.name} burcunun diğer burçlarla uyumu</h2>
            <ul className="grid grid-cols-2 gap-px border border-line bg-line text-sm sm:grid-cols-3">
              {ZODIAC_SIGNS.map((x) => (
                <li key={x.id}>
                  <Link href={`/astroloji/burc-uyumu/${pairSlug(s.id, x.id)}`} className="flex h-full items-center gap-2 bg-ink p-3 text-paper/85 hover:bg-ink-2 hover:text-gold">
                    <ZodiacGlyph sign={x.id} size={14} className="shrink-0 text-gold" />
                    <span>{s.name} – {x.name}</span>
                    <span className="ml-auto tabular-nums text-paper/70">%{signCompatibility(s, x).score}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Devam bağlantıları: hepsi aynı sade biçimde, büyük harf yok */}
          <div className="flex flex-col gap-2 text-sm sm:flex-row">
            <Link
              href="/astroloji/sinastri"
              className="group flex flex-1 items-center justify-between gap-3 border border-gold/30 bg-ink p-4 transition-colors hover:border-gold hover:bg-ink-2"
            >
              <span className="font-semibold text-gold">Doğum Haritasıyla Uyum →</span>
              <Heart size={16} className="shrink-0 text-gold" />
            </Link>
            <Link
              href={`/astroloji/gunluk-burc/${s.id}`}
              className="group flex flex-1 items-center justify-between gap-3 border border-line bg-ink p-4 text-paper/85 transition-colors hover:border-gold/40 hover:bg-ink-2 hover:text-paper"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="shrink-0 text-gold" /> {s.name} Burcu Bugün
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-paper/60" />
            </Link>
            <Link
              href="/harita/planetaryum"
              className="group flex flex-1 items-center justify-between gap-3 border border-line bg-ink p-4 text-paper/85 transition-colors hover:border-gold/40 hover:bg-ink-2 hover:text-paper"
            >
              <span className="flex items-center gap-2">
                <Telescope size={16} className="shrink-0 text-paper/70" /> {s.name} Takımyıldızını 3D Gör
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-paper/60 group-hover:text-paper" />
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
