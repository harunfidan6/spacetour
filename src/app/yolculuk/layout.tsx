import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Güneş Sistemi 3D Yolculuk Simülasyonu | SpaceTour TR',
    template: '%s | SpaceTour TR',
  },
  description:
    'Güneş Sistemi’nde durak durak 3D WebGL yolculuğu. Didaktik gezegen dizilimi ile gerçek J2000 yörünge efemeris konumları arasında geçiş yapın.',
  keywords: [
    '3d güneş sistemi yolculuğu',
    'uzay simülasyonu türkçe',
    'webgl güneş sistemi',
    'j2000 efemeris gezegenler',
    'gezegenler arası seyahat',
    'güneş sistemi simülatörü',
    'dünya atmosfer katmanları 3d',
  ],
  alternates: {
    canonical: `${BASE_URL}/yolculuk`,
  },
  openGraph: {
    title: 'Güneş Sistemi’nde 3D Yolculuk — SpaceTour TR',
    description:
      'Güneş Sistemi’nde 3D yolculuk: didaktik dizilim ve gerçek J2000 yörünge konumları.',
    url: `${BASE_URL}/yolculuk`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Güneş Sisteminde 3D Yolculuk — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Güneş Sistemi’nde 3D Yolculuk — SpaceTour TR',
    description:
      'Didaktik gezegen dizilimi ve gerçek J2000 yörünge konumları ile 3D uzay keşfi.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function YolculukLayout({ children }: LayoutProps<'/yolculuk'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Yolculuk', url: '/yolculuk' },
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
