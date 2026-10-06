import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: '3D Gök Küresi ve Gök Haritası | SpaceTour TR',
    template: '%s | SpaceTour TR',
  },
  description:
    '3D gök küresi, en parlak yıldızlar, Türkiye ışık kirliliği (Bortle) haritası ve Messier derin uzay atlası.',
  keywords: [
    'gök haritası',
    '3d gök küresi',
    'yıldız haritası online',
    'en parlak yıldızlar',
    'ışık kirliliği haritası türkiye',
    'bortle ölçeği',
    'messier kataloğu',
    'gökyüzü koordinatları',
    'astronomi haritası',
  ],
  alternates: {
    canonical: `${BASE_URL}/harita`,
  },
  openGraph: {
    title: 'Gök Haritası · 3D Gök Küresi & Yıldız Atlası — SpaceTour TR',
    description:
      '3D gök küresi, en parlak kerteriz yıldızları, ışık kirliliği analizi ve derin uzay atlası.',
    url: `${BASE_URL}/harita`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Gök Haritası ve 3D Gök Küresi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gök Haritası · 3D Gök Küresi — SpaceTour TR',
    description:
      '3D gök küresi, parlak yıldızlar ve ışık kirliliği haritası.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HaritaLayout({ children }: LayoutProps<'/harita'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gök Haritası', url: '/harita' },
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
