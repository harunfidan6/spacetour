/**
 * Aylık Ay takvimi: ana evrelerin (Yeni Ay, İlk Dördün, Dolunay, Son Dördün) anları,
 * her günün evresi ve Ay'ın burç geçişleri. Saatler İstanbul saatiyle; evre anları Ay ile
 * Güneş arasındaki açının (elongasyon) 0°, 90°, 180° ve 270° olduğu an, ikiye bölme yöntemiyle
 * bulunur (birkaç dakikalık hata payı).
 */

import { getMoonPhase, type MoonPhaseKey } from '@/lib/astrophysics/skyDomeEphemeris';
import { localMidnight, moonSign, nextMoonIngress } from './dailySky';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const TZ = 'Europe/Istanbul';

export const MONTH_SLUGS = ['ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];
export const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
/** Takvim sayfası üretilen yıllar (gök olayları takvimiyle aynı aralık) */
export const LUNAR_CALENDAR_YEARS = [2026, 2027, 2028];

export type MainPhaseKey = Extract<MoonPhaseKey, 'new' | 'first-quarter' | 'full' | 'last-quarter'>;
const MAIN_PHASES: { key: MainPhaseKey; angle: number; name: string }[] = [
  { key: 'new', angle: 0, name: 'Yeni Ay' },
  { key: 'first-quarter', angle: 90, name: 'İlk Dördün' },
  { key: 'full', angle: 180, name: 'Dolunay' },
  { key: 'last-quarter', angle: 270, name: 'Son Dördün' },
];

export interface MainPhase {
  key: MainPhaseKey;
  name: string;
  at: Date;
  /** Ay'ın o andaki burcu (0 = Koç) */
  sign: number;
}

export interface LunarDay {
  /** İstanbul takvim günü 'YYYY-MM-DD' */
  day: string;
  date: Date;
  phaseKey: MoonPhaseKey;
  phaseName: string;
  /** Öğlen aydınlık oranı (0–1) */
  illumination: number;
  /** Öğlen Ay'ın burcu */
  sign: number;
  /** Gün başladığında (gece yarısı) Ay'ın burcu */
  startSign: number;
  /** O gün içindeki burç geçişi */
  ingress: { at: Date; sign: number } | null;
  /** O gün gerçekleşen ana evre */
  mainPhase: MainPhase | null;
}

export interface LunarMonth {
  year: number;
  /** 0 = Ocak */
  month: number;
  slug: string;
  name: string;
  days: LunarDay[];
  phases: MainPhase[];
}

export const monthSlug = (year: number, month: number) => `${MONTH_SLUGS[month]}-${year}`;

export function parseMonthSlug(slug: string): { year: number; month: number } | null {
  const m = slug.match(/^([a-z]+)-(\d{4})$/);
  if (!m) return null;
  const month = MONTH_SLUGS.indexOf(m[1]);
  const year = Number(m[2]);
  return month >= 0 && LUNAR_CALENDAR_YEARS.includes(year) ? { year, month } : null;
}

/** İstanbul saatiyle ayın ilk gününün gece yarısı (UTC ms) */
const monthStart = (year: number, month: number) => localMidnight(new Date(Date.UTC(year, month, 1, 12)));

const elongation = (t: number) => getMoonPhase(new Date(t)).elongation;
// Hedef açıya işaretli fark (−180…180)
const offset = (t: number, angle: number) => ((elongation(t) - angle + 540) % 360) - 180;

/** [from, to) aralığındaki ana evre anları */
export function mainPhasesBetween(from: number, to: number): MainPhase[] {
  const found: MainPhase[] = [];
  const step = 6 * HOUR;
  for (const p of MAIN_PHASES) {
    let prev = offset(from, p.angle);
    for (let t = from + step; t < to + step; t += step) {
      const d = offset(t, p.angle);
      // Eksiden artıya geçiş (ve sarma sıçraması değil)
      if (prev < 0 && d >= 0 && d - prev < 90) {
        let lo = t - step;
        let hi = t;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          if (offset(mid, p.angle) < 0) lo = mid; else hi = mid;
        }
        if (hi >= from && hi < to) found.push({ key: p.key, name: p.name, at: new Date(hi), sign: moonSign(new Date(hi)) });
      }
      prev = d;
    }
  }
  return found.sort((a, b) => a.at.getTime() - b.at.getTime());
}

export function lunarMonth(year: number, month: number): LunarMonth {
  const start = monthStart(year, month);
  const end = monthStart(month === 11 ? year + 1 : year, (month + 1) % 12);
  const phases = mainPhasesBetween(start, end);
  const days: LunarDay[] = [];

  for (let t = start; t < end; t += DAY) {
    // Yaz saati yok (Türkiye UTC+3), yine de günü İstanbul gece yarısına hizala
    const midnight = localMidnight(new Date(t + 12 * HOUR));
    const noon = new Date(midnight + 12 * HOUR);
    const phase = getMoonPhase(noon);
    const ing = nextMoonIngress(new Date(midnight));
    const dayKey = noon.toLocaleDateString('sv-SE', { timeZone: TZ });
    days.push({
      day: dayKey,
      date: noon,
      phaseKey: phase.key,
      phaseName: phase.name,
      illumination: phase.illumination,
      sign: moonSign(noon),
      startSign: moonSign(new Date(midnight)),
      ingress: ing.at.getTime() < midnight + DAY ? ing : null,
      mainPhase: phases.find((p) => p.at.getTime() >= midnight && p.at.getTime() < midnight + DAY) ?? null,
    });
  }

  return { year, month, slug: monthSlug(year, month), name: `${MONTH_NAMES[month]} ${year}`, days, phases };
}

/** Takvim sayfası olan tüm aylar, eskiden yeniye */
export const allLunarMonths = () => LUNAR_CALENDAR_YEARS.flatMap((year) => MONTH_SLUGS.map((_, month) => ({ year, month, slug: monthSlug(year, month) })));
