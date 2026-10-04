import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Astroloji · Zodyak Atlası & Göksel Çark — SpaceTour TR',
    template: '%s — Astroloji | SpaceTour TR',
  },
  description:
    '360° interaktif Zodyak usturlabı, canlı göksel ufuk saati, doğum haritası hesaplama, Keldani gezegen saatleri, tarot, sinastri ve 12 burç arşivi.',
  keywords: [
    'astroloji',
    'zodyak atlası',
    '12 burç özellikleri',
    'doğum haritası hesaplama',
    'günlük burç yorumları',
    'keldani gezegen saatleri',
    'boşluktaki ay voc',
    'sinastri uyumu',
    'tarot falı',
    'astroloji türkiye',
  ],
  alternates: {
    canonical: `${BASE_URL}/astroloji`,
  },
  openGraph: {
    title: 'Astroloji · Zodyak Atlası & Göksel Çark — SpaceTour TR',
    description:
      '360° interaktif Zodyak usturlabı, canlı göksel ufuk saati, doğum haritası hesaplama, Keldani gezegen saatleri, sinastri ve 12 burç arşivi.',
    url: `${BASE_URL}/astroloji`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Astroloji · Zodyak Atlası — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astroloji · Zodyak Atlası & Göksel Çark — SpaceTour TR',
    description:
      '360° interaktif Zodyak usturlabı, canlı göksel ufuk saati, doğum haritası hesaplama ve 12 burç arşivi.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function AstrolojiLayout({ children }: LayoutProps<'/astroloji'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      {children}
    </>
  );
}
