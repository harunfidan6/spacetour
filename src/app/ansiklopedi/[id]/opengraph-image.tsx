import { planets } from '@/data/planets';
import { renderOgImage, SECTION_ACCENT } from '@/lib/ogImage';

export const alt = 'Gezegen ansiklopedisi — SpaceTour TR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = planets.find((p) => p.id === id);
  if (!body) return renderOgImage({ kicker: 'Gezegen Ansiklopedisi', title: 'Gök cisimleri', accent: SECTION_ACCENT.ansiklopedi });
  const facts = [body.facts.çap && `Çap ${body.facts.çap}`, body.facts.günSüresi && `Gün ${body.facts.günSüresi}`, body.facts.yörüngeSüresi && `Yıl ${body.facts.yörüngeSüresi}`].filter(Boolean);
  return renderOgImage({
    kicker: `Gezegen Ansiklopedisi · ${body.type}`,
    title: body.name,
    subtitle: body.description,
    footer: facts.join(' · '),
    accent: SECTION_ACCENT.ansiklopedi,
  });
}
