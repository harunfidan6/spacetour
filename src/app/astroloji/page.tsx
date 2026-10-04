import { CelestialAstrolabeHub } from '@/components/astrology/CelestialAstrolabeHub';
import { BASE_URL } from '@/lib/seo';

export default function AstrolojiPage() {
  const astrolabeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Zodyak Usturlabı & Göksel Çark — Astroloji',
    url: `${BASE_URL}/astroloji`,
    description:
      '360° interaktif Zodyak usturlabı, canlı Keldani gezegen saatleri, Ay fazı ve Boşluktaki Ay (VoC) efemerisi.',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(astrolabeSchema) }}
      />
      <CelestialAstrolabeHub />
    </>
  );
}
