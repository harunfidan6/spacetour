import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { ZodiacAtlas } from '@/components/space/ZodiacAtlas';
import { CelestialHorizonBar } from '@/components/astrology/CelestialHorizonBar';
import { DOC_IMAGES } from '@/data/docImages';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: '12 Burç Arşivi & Arketipler — Astroloji | SpaceTour TR',
  },
  description:
    '12 Zodyak burcunun mitolojik arketipleri, ateş-toprak-hava-su element dengeleri, yönetici gezegenleri, tarihleri ve tarot kart karşılıkları.',
  keywords: [
    '12 burç',
    'burç özellikleri',
    'burç tarihleri',
    'ateş grubu burçlar',
    'toprak grubu burçlar',
    'hava grubu burçlar',
    'su grubu burçlar',
    'yönetici gezegenler',
    'zodyak arketipleri',
    'burçlar listesi',
  ],
  alternates: {
    canonical: `${BASE_URL}/astroloji/burclar`,
  },
  openGraph: {
    title: '12 Burç Arşivi & Arketipler — Astroloji | SpaceTour TR',
    description:
      '12 Zodyak burcunun mitolojik arketipleri, element dengeleri, yönetici gezegenleri ve tarot karşılıkları.',
    url: `${BASE_URL}/astroloji/burclar`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: '12 Burç Arşivi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '12 Burç Arşivi & Arketipler — Astroloji | SpaceTour TR',
    description:
      '12 Zodyak burcunun mitolojik arketipleri, element dengeleri ve yönetici gezegenleri.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BurclarPage() {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: '12 Burç Arşivi', url: '/astroloji/burclar' },
  ]);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <ChapterHero
        variant="band"
        section="Astroloji · 12 burç arşivi"
        headline={['On iki', 'arketip']}
        lede="Her burcun elementi, yönetici gezegeni, mitolojik arketipi ve tarot karşılığı. Bir karta dokun, dosyası açılsın."
        accent="var(--gold)"
        image={DOC_IMAGES['astro-burclar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: '12 burç' }]}
      />
      <CelestialHorizonBar compact />
      <section className="px-[var(--gutter)] py-14 sm:py-20">
        <PartHeading
          title="12 zodyak"
          serif="takımyıldızı"
          description="Sidney Hall’un 1824 tarihli Urania’s Mirror yıldız kartlarıyla, elementlerine göre süzülebilir arşiv."
        />
        <ZodiacAtlas />
      </section>
    </div>
  );
}
