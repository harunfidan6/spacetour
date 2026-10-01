import { events, type AstronomicalEvent } from '@/data/events';
import { getMoonPhase } from '@/lib/astrophysics/skyDomeEphemeris';

export interface MoonPhase {
  /** 0 → new, 0.5 → full, 1 → new */
  fraction: number;
  illumination: number;
  age: number;
  name: string;
  waxing: boolean;
}

/** Moon phase from the true Sun–Moon elongation (same source as the planetarium and sky widgets). */
export function moonPhase(date: Date): MoonPhase {
  const phase = getMoonPhase(date);
  return {
    fraction: phase.elongation / 360,
    illumination: phase.illumination,
    age: phase.ageDays,
    name: phase.name,
    waxing: phase.waxing,
  };
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
