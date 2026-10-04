import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Canlı Gökyüzü & ISS Takibi — SpaceTour TR',
    template: '%s — Canlı | SpaceTour TR',
  },
  description:
    'Uluslararası Uzay İstasyonu (ISS) anlık canlı konumu, NOAA uzay hava durumu ve güneş fırtınaları, bu gece görülebilen gezegenler ve Voyager sondaları takibi.',
  keywords: [
    'iss canlı takip',
    'uluslararası uzay istasyonu türkiye',
    'iss nerede canlı',
    'uzay havası canlı noaa',
    'güneş patlamaları kp endeksi',
    'bu gece gökyüzünde ne var',
    'yıldızlararası uzay araçları voyager',
    'canlı uzay telemetrisi',
  ],
  alternates: {
    canonical: `${BASE_URL}/canli`,
  },
  openGraph: {
    title: 'Canlı Gökyüzü & ISS Takibi — SpaceTour TR',
    description:
      'ISS’in anlık konumu, NOAA uzay hava durumu, bu gece görülebilecek gezegenler ve yıldızlararası sondalar.',
    url: `${BASE_URL}/canli`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Canlı Gökyüzü ve ISS Takibi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canlı Gökyüzü & ISS Takibi — SpaceTour TR',
    description:
      'ISS’in anlık konumu, NOAA uzay hava durumu ve bu gece görülebilecek gök cisimleri.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CanliLayout({ children }: LayoutProps<'/canli'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Canlı Gökyüzü', url: '/canli' },
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
