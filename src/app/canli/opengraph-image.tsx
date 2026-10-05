import { getSection } from '@/data/sections';
import { renderOgImage, SECTION_ACCENT } from '@/lib/ogImage';

const section = getSection('canli');

export const alt = `${section.title} — SpaceTour TR`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    kicker: `Bölüm ${section.chapter} · ${section.title}`,
    title: section.headline.join(' '),
    subtitle: section.lede,
    footer: section.kicker,
    accent: SECTION_ACCENT.canli,
  });
}
