/**
 * Gök olayı sayfalarından ilgili sayfalara iç bağlantılar: olayda adı geçen gezegenler
 * (ansiklopedi sayfaları) ve Ay olayları için o ayın Ay takvimi.
 */

import type { AstronomicalEvent, EventType } from '@/data/events';
import { MONTH_NAMES, LUNAR_CALENDAR_YEARS, monthSlug } from '@/lib/astrology/lunarCalendar';

export interface EventBodyLink {
  id: string;
  name: string;
}

// Metinde adıyla aranan gökcisimleri (ansiklopedi sayfası kimliğiyle)
const NAMED: EventBodyLink[] = [
  { id: 'merkur', name: 'Merkür' },
  { id: 'venus', name: 'Venüs' },
  { id: 'mars', name: 'Mars' },
  { id: 'jupiter', name: 'Jüpiter' },
  { id: 'saturn', name: 'Satürn' },
  { id: 'uranus', name: 'Uranüs' },
  { id: 'neptun', name: 'Neptün' },
  { id: 'pluton', name: 'Plüton' },
];

// "Ay" ve "Güneş" metinde çok geçtiği için türe göre eklenir
const BY_TYPE: Partial<Record<EventType, string[]>> = {
  'ay-tutulmasi': ['ay', 'dunya', 'gunes'],
  'gunes-tutulmasi': ['gunes', 'ay'],
  'super-ay': ['ay'],
  'yeni-ay': ['ay'],
  dolunay: ['ay'],
  equinoks: ['gunes', 'dunya'],
  solstis: ['gunes', 'dunya'],
};
const NAMES: Record<string, string> = { ay: 'Ay', gunes: 'Güneş', dunya: 'Dünya' };

const LUNAR_TYPES: EventType[] = ['ay-tutulmasi', 'gunes-tutulmasi', 'super-ay', 'yeni-ay', 'dolunay'];

/** Olayla ilgili gökcisimleri, ansiklopedideki sırayla */
export function eventBodies(e: AstronomicalEvent): EventBodyLink[] {
  const text = `${e.title} ${e.description} ${e.details}`;
  const named = NAMED.filter((b) => new RegExp(`(?<!\\p{L})${b.name}(?!\\p{L})`, 'u').test(text));
  const typed = (BY_TYPE[e.type] ?? []).map((id) => ({ id, name: NAMES[id] }));
  return [...typed, ...named.filter((b) => !typed.some((t) => t.id === b.id))];
}

/** Ay ile ilgili bir olaysa o ayın Ay takvimi sayfası */
export function eventLunarMonth(e: AstronomicalEvent): { href: string; label: string } | null {
  if (!LUNAR_TYPES.includes(e.type)) return null;
  const year = Number(e.date.slice(0, 4));
  const month = Number(e.date.slice(5, 7)) - 1;
  if (!LUNAR_CALENDAR_YEARS.includes(year)) return null;
  return { href: `/astroloji/ay-takvimi/${monthSlug(year, month)}`, label: `${MONTH_NAMES[month]} ${year} Ay takvimi` };
}
