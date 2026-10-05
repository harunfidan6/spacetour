import { ZODIAC_SIGNS } from '@/data/zodiac';
import { renderOgImage, SECTION_ACCENT } from '@/lib/ogImage';

export const alt = 'Burç dosyası — SpaceTour TR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ burc: string }> }) {
  const { burc } = await params;
  const sign = ZODIAC_SIGNS.find((s) => s.id === burc);
  if (!sign) return renderOgImage({ kicker: 'Burç Dosyası', title: '12 burç arşivi', accent: SECTION_ACCENT.astroloji });
  return renderOgImage({
    kicker: 'Astroloji · Burç Dosyası',
    title: `${sign.name} Burcu`,
    subtitle: `${sign.dates} · ${sign.element} elementi · ${sign.modality} nitelik · Yönetici gezegeni ${sign.rulingPlanet}`,
    footer: `${sign.latinName} · Karakter, aşk, kariyer ve uyum`,
    accent: SECTION_ACCENT.astroloji,
  });
}
