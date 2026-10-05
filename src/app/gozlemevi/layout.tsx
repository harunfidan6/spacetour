import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Çok Dalgaboylu Uzay Gözlemevi & Teleskoplar — SpaceTour TR',
    template: '%s | SpaceTour TR',
  },
  description:
    'Evreni Webb’in kızılötesi, Hubble’ın optik, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle: 7 etkileşimli spektroskopi ve gözlem aracı.',
  keywords: [
    'uzay gözlemevi',
    'james webb uzay teleskobu',
    'hubble teleskobu karşılaştırma',
    'elektromanyetik spektrum uzay',
    'radyo astronomi',
    'x ışını astronomisi chandra',
    'yer teleskopları türkiye',
    'gravitasyonel dalgalar ligo',
  ],
  alternates: {
    canonical: `${BASE_URL}/gozlemevi`,
  },
  openGraph: {
    title: 'Çok Dalgaboylu Uzay Gözlemevi — SpaceTour TR',
    description:
      'Evreni Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle: çok dalgaboylu gözlem laboratuvarları.',
    url: `${BASE_URL}/gozlemevi`,
    siteName: SITE_NAME,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Uzay Gözlemevi — SpaceTour TR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Çok Dalgaboylu Uzay Gözlemevi — SpaceTour TR',
    description:
      'Webb, Hubble, Chandra ve radyo teleskopları ile evrenin derinlikleri.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GozlemeviLayout({ children }: LayoutProps<'/gozlemevi'>) {
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gözlemevi', url: '/gozlemevi' },
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
