/**
 * Baş sabit yıldızları gerçek gökle ilişkilendirir: yıldızların tropikal ekliptik boylamı,
 * bir boylama (Ay'ın bugünkü yeri ya da doğum Güneşi) en yakın yıldız ve burçların geleneksel
 * yöneticileri (gezegen saatleri yalnızca yedi klasik gökcismini bilir).
 */

import { FIXED_STARS_CATALOG, type FixedStar } from '@/data/fixedStars';
import { SIGN_NAMES, type SkyBody } from './dailySky';

const wrap180 = (d: number) => ((d + 540) % 360) - 180;

/** "09° 47' İkizler" → 69.78 */
export function starLongitude(star: FixedStar): number {
  const m = star.eclipticLongitude.match(/(\d+)°\s*(\d+)'\s*(.+)$/);
  const sign = m ? SIGN_NAMES.indexOf(m[3].trim()) : -1;
  return m && sign >= 0 ? sign * 30 + Number(m[1]) + Number(m[2]) / 60 : NaN;
}

/** Yıldızın verilen boylamdan açısal uzaklığı: artı ise yıldız önde (Ay ona yaklaşıyor), −180…180 */
export const starGap = (star: FixedStar, lon: number) => wrap180(starLongitude(star) - lon);

/** Verilen boylama ekliptik üzerinde en yakın baş yıldız */
export function nearestStar(lon: number): { star: FixedStar; gap: number } {
  let star = FIXED_STARS_CATALOG[0], gap = Infinity;
  for (const s of FIXED_STARS_CATALOG) {
    const g = starGap(s, lon);
    if (Math.abs(g) < Math.abs(gap)) { star = s; gap = g; }
  }
  return { star, gap };
}

/** Burç sırasına göre (Koç…Balık) geleneksel yöneticiler */
export const TRADITIONAL_RULER: SkyBody[] = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];

/** 25.3 → "25°18′" */
export function formatDegrees(deg: number): string {
  const a = Math.abs(deg), d = Math.floor(a), m = Math.round((a - d) * 60);
  return m === 60 ? `${d + 1}°00′` : `${d}°${String(m).padStart(2, '0')}′`;
}
