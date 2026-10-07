import { ZODIAC_SIGNS } from '@/data/zodiac';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';
import { renderDailyHoroscopeOg, renderOgImage, SECTION_ACCENT } from '@/lib/ogImage';

// Kart günün yorumunu gösterir: sayfayla aynı sıklıkta yenilenir
export const revalidate = 1800;
export const alt = 'Günlük burç yorumu — SpaceTour TR';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ burc: s.id }));
}

export default async function Image({ params }: { params: Promise<{ burc: string }> }) {
  const { burc } = await params;
  const sign = ZODIAC_SIGNS.find((s) => s.id === burc);
  if (!sign) return renderOgImage({ kicker: 'Günlük burç', title: 'Günlük burç yorumları', accent: SECTION_ACCENT.astroloji });
  const now = new Date();
  const r = dailyReading(sign.id, now);
  return renderDailyHoroscopeOg({
    sign: sign.name,
    signMeta: `${sign.dates} · ${sign.element} burcu`,
    date: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', timeZone: 'Europe/Istanbul' }),
    headline: r.headline,
    scores: [
      { label: 'Aşk', value: r.scores.love, color: '#f43f5e' },
      { label: 'Kariyer', value: r.scores.career, color: '#f5c542' },
      { label: 'Şans', value: r.scores.luck, color: '#38bdf8' },
    ],
    footer: `Ay ${r.moonIn} · ${r.phaseName} · Yorumun tamamı: spacetour.com.tr/astroloji/gunluk-burc/${sign.id}`,
  });
}
