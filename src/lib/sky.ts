import { events, type AstronomicalEvent } from '@/data/events';

const SYNODIC_MONTH = 29.530588853;
// Reference new moon: 2000-01-06 18:14 UTC
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export interface MoonPhase {
  /** 0 → new, 0.5 → full, 1 → new */
  fraction: number;
  illumination: number;
  age: number;
  name: string;
  waxing: boolean;
}

export function moonPhase(date: Date): MoonPhase {
  const days = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const fraction = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  const names = [
    'Yeni Ay',
    'Büyüyen Hilal',
    'İlk Dördün',
    'Büyüyen Şişkin Ay',
    'Dolunay',
    'Küçülen Şişkin Ay',
    'Son Dördün',
    'Küçülen Hilal',
  ];
  const name = names[Math.round(fraction * 8) % 8];
  return { fraction, illumination, age, name, waxing: fraction < 0.5 };
}

export function upcomingEvents(from: Date, limit = 5): AstronomicalEvent[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return events
    .filter((e) => new Date(`${e.date}T00:00:00`).getTime() >= start)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function daysUntil(isoDate: string, from: Date): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return Math.round((new Date(`${isoDate}T00:00:00`).getTime() - start) / 86400000);
}
