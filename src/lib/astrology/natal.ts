/**
 * Natal chart helpers that need real astronomy: the birth moment in UTC (Türkiye's historical
 * time zone rules), the Ascendant from local sidereal time and latitude, and whole-sign houses.
 */

import { getLocalSiderealTime } from '@/utils/astronomy';

const DEG = Math.PI / 180;

/** Last Sunday of a month (1-based) in a given year, as a UTC day number. */
function lastSunday(year: number, month: number): number {
  const last = new Date(Date.UTC(year, month, 0));
  return last.getUTCDate() - last.getUTCDay();
}

/**
 * UTC offset (hours) of Türkiye at a local date-time. Since 7 Sep 2016 the country stays on
 * UTC+3. Before that it used EET (UTC+2) with summer time (UTC+3) from the last Sunday of
 * March to the last Sunday of October (the EU rule, used in Türkiye from the mid-1980s;
 * earlier years are approximated with the same rule).
 */
export function turkeyUtcOffset(year: number, month: number, day: number, hour = 12): number {
  if (year > 2016 || (year === 2016 && (month > 9 || (month === 9 && day >= 7)))) return 3;
  const start = lastSunday(year, 3);
  const end = lastSunday(year, 10);
  const afterStart = month > 3 || (month === 3 && (day > start || (day === start && hour >= 3)));
  const beforeEnd = month < 10 || (month === 10 && (day < end || (day === end && hour < 4)));
  return afterStart && beforeEnd ? 3 : 2;
}

/** Birth moment as a Date (UTC) from a local Turkish clock time. */
export function birthInstant(year: number, month: number, day: number, hour: number, minute: number, utcOffset?: number): Date {
  const off = utcOffset ?? turkeyUtcOffset(year, month, day, hour);
  return new Date(Date.UTC(year, month - 1, day, hour - off, minute));
}

/**
 * Ecliptic longitude of the Ascendant (degrees, tropical) for a moment and place:
 * λ = atan2(cos θ, −(sin θ·cos ε + tan φ·sin ε)), θ = local sidereal time.
 */
export function ascendantLongitude(date: Date, latitude: number, longitude: number): number {
  const theta = getLocalSiderealTime(date, longitude) * DEG;
  const T = (date.getTime() / 86_400_000 + 2440587.5 - 2451545) / 36525;
  const eps = (23.439291 - 0.0130042 * T) * DEG;
  const phi = latitude * DEG;
  const lam = Math.atan2(Math.cos(theta), -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)));
  return ((lam / DEG) % 360 + 360) % 360;
}

/** Whole-sign house (1–12) of a sign index, counted from the Ascendant's sign. */
export function wholeSignHouse(signIndex: number, ascendantSignIndex: number): number {
  return ((signIndex - ascendantSignIndex + 12) % 12) + 1;
}

/** Major Ptolemaic aspect between two longitudes, if within orb. */
export const MAJOR_ASPECTS = [
  { angle: 0, name: 'Kavuşum', symbol: '☌', orb: 8, nature: 'güçlü' },
  { angle: 60, name: 'Altmışlık', symbol: '⚹', orb: 5, nature: 'uyumlu' },
  { angle: 90, name: 'Kare', symbol: '□', orb: 7, nature: 'gergin' },
  { angle: 120, name: 'Üçgen', symbol: '△', orb: 7, nature: 'uyumlu' },
  { angle: 180, name: 'Karşıt', symbol: '☍', orb: 8, nature: 'gergin' },
] as const;

export function aspectBetween(a: number, b: number) {
  // angular separation along the ecliptic, 0..180
  const sep = Math.abs((((a - b) % 360) + 540) % 360 - 180);
  for (const asp of MAJOR_ASPECTS) {
    const off = Math.abs(sep - asp.angle);
    if (off <= asp.orb) return { ...asp, orbUsed: Math.round(off * 10) / 10 };
  }
  return null;
}
