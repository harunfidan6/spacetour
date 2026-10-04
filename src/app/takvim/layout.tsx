import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Gök Olayları Takvimi 2026 & Efemeris — SpaceTour TR',
    template: '%s — Takvim | SpaceTour TR',
  },
  description:
    'Güneş ve Ay tutulmaları, meteor yağmurları (Perseid, Geminid), gezegen kavuşumları, süper aylar ve ekinokslar. Anlık efemeris ve geri sayım simülatörü.',
  keywords: [
    'gök olayları takvimi 2026',
    'astronomi takvimi türkiye',
    'meteor yağmuru tarihleri',
    'perseid meteor yağmuru ne zaman',
    'ay tutulması tarihleri 2026',
    'güneş tutulması türkiye',
    'gezegen kavuşumu',
    'süper ay tarihleri',
    'ekinoks ve gün dönümü',
  ],
  alternates: {
    canonical: `${BASE_URL}/takvim`,
  },
  openGraph: {
    title: 'Gök Olayları Takvimi 2026 & Efemeris — SpaceTour TR',
    description:
      'Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları ve ekinokslar. Gözlem planını yap, geri sayımı başlat.',
    url: `${BASE_URL}/takvim`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Gök Olayları Takvimi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gök Olayları Takvimi 2026 & Efemeris — SpaceTour TR',
    description:
      'Güneş ve Ay tutulmaları, meteor yağmurları ve gezegen kavuşumları takvimi.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TakvimLayout({ children }: LayoutProps<'/takvim'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gök Olayları Takvimi', url: '/takvim' },
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
