import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Gezegen Ansiklopedisi & Uzay Laboratuvarı — SpaceTour TR',
    template: '%s | SpaceTour TR',
  },
  description:
    'Güneş Sistemi gezegenlerinin kimlik kartları, 3D etkileşimli modeller, takımyıldızlar ve astrofizik laboratuvarı simülatörleri.',
  keywords: [
    'gezegen ansiklopedisi',
    'güneş sistemi gezegenleri',
    'astronomi laboratuvarı',
    'gezegenlerin özellikleri',
    '3d gezegen modeli',
    'kara delikler',
    'evrenin ölçeği',
    'kepler yasaları simülasyonu',
    'gökbilim ansiklopedisi türkçe',
  ],
  alternates: {
    canonical: `${BASE_URL}/ansiklopedi`,
  },
  openGraph: {
    title: 'Gezegen Ansiklopedisi & Astronomi Laboratuvarı — SpaceTour TR',
    description:
      'Gök cisimlerinin kimlik kartları, 3D hologramlar ve evrenin fiziğini deneyerek öğreten laboratuvar modülleri.',
    url: `${BASE_URL}/ansiklopedi`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Gezegen Ansiklopedisi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gezegen Ansiklopedisi & Laboratuvar — SpaceTour TR',
    description:
      'Gök cisimleri kimlik kartları, 3D gezegen modelleri ve etkileşimli fizik deneyleri.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AnsiklopediLayout({ children }: LayoutProps<'/ansiklopedi'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gezegen Ansiklopedisi', url: '/ansiklopedi' },
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
