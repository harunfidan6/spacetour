import { events, type AstronomicalEvent } from '@/data/events';
import { foldTr } from '@/lib/text';

const MONTHS = ['ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];

/** Gök olayının okunur adresi: "Tam Güneş Tutulması" 2026-08-12 → tam-gunes-tutulmasi-12-agustos-2026 */
export function eventSlug(e: AstronomicalEvent): string {
  const [y, m, d] = e.date.split('-').map(Number);
  const title = foldTr(e.title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${title}-${d}-${MONTHS[m - 1]}-${y}`;
}

export const eventBySlug = (slug: string) => events.find((e) => eventSlug(e) === slug);

/** Takvimde olayı bulunan yıllar */
export const EVENT_YEARS = [...new Set(events.map((e) => e.date.slice(0, 4)))].sort();
