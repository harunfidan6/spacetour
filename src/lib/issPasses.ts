/**
 * ISS görünür geçişleri: güncel yörünge elemanlarından (TLE) SGP4 ile istasyonun konumunu
 * hesaplar ve bir gözlemci için çıplak gözle görülebilen geçişleri bulur. Bir geçiş, istasyon
 * ufkun 10° üzerindeyken, gökyüzü yeterince karanlıkken (Güneş −6°'nin altında) ve istasyon
 * Güneş ışığı alırken (Dünya'nın gölgesinde değilken) görünür.
 */

import {
  degreesToRadians, ecfToLookAngles, eciToEcf, gstime, jday, propagate, shadowFraction, sunPos, twoline2satrec,
  type SatRec,
} from 'satellite.js';

export interface IssTle {
  line1: string;
  line2: string;
  /** Yörünge elemanlarının ölçüldüğü an */
  epoch: Date;
  source: string;
}

export interface IssCity {
  slug: string;
  name: string;
  /** Türkçe bulunma eki: "İstanbul’dan" */
  from: string;
  lat: number;
  lon: number;
}

export const ISS_CITIES: IssCity[] = [
  { slug: 'istanbul', name: 'İstanbul', from: 'İstanbul’dan', lat: 41.0082, lon: 28.9784 },
  { slug: 'ankara', name: 'Ankara', from: 'Ankara’dan', lat: 39.9334, lon: 32.8597 },
  { slug: 'izmir', name: 'İzmir', from: 'İzmir’den', lat: 38.4237, lon: 27.1428 },
  { slug: 'bursa', name: 'Bursa', from: 'Bursa’dan', lat: 40.1885, lon: 29.061 },
  { slug: 'antalya', name: 'Antalya', from: 'Antalya’dan', lat: 36.8969, lon: 30.7133 },
  { slug: 'adana', name: 'Adana', from: 'Adana’dan', lat: 37.0, lon: 35.3213 },
  { slug: 'konya', name: 'Konya', from: 'Konya’dan', lat: 37.8746, lon: 32.4932 },
  { slug: 'gaziantep', name: 'Gaziantep', from: 'Gaziantep’ten', lat: 37.0662, lon: 37.3833 },
  { slug: 'mersin', name: 'Mersin', from: 'Mersin’den', lat: 36.8121, lon: 34.6415 },
  { slug: 'kayseri', name: 'Kayseri', from: 'Kayseri’den', lat: 38.7205, lon: 35.4826 },
  { slug: 'eskisehir', name: 'Eskişehir', from: 'Eskişehir’den', lat: 39.7767, lon: 30.5206 },
  { slug: 'diyarbakir', name: 'Diyarbakır', from: 'Diyarbakır’dan', lat: 37.9144, lon: 40.2306 },
  { slug: 'samsun', name: 'Samsun', from: 'Samsun’dan', lat: 41.2867, lon: 36.33 },
  { slug: 'trabzon', name: 'Trabzon', from: 'Trabzon’dan', lat: 41.0027, lon: 39.7168 },
  { slug: 'erzurum', name: 'Erzurum', from: 'Erzurum’dan', lat: 39.9055, lon: 41.2658 },
  { slug: 'van', name: 'Van', from: 'Van’dan', lat: 38.5012, lon: 43.373 },
];

export const issCityBySlug = (slug: string) => ISS_CITIES.find((c) => c.slug === slug);

/* ---------- Yörünge elemanları ---------- */

const TLE_REVALIDATE = 6 * 3600;

function parseTle(line1: string, line2: string, source: string): IssTle | null {
  const l1 = line1.trim();
  const l2 = line2.trim();
  if (!l1.startsWith('1 25544') || !l2.startsWith('2 25544')) return null;
  // Epoch: YYDDD.DDDDDDDD (sütun 19–32)
  const yy = Number(l1.slice(18, 20));
  const doy = Number(l1.slice(20, 32));
  if (!Number.isFinite(yy) || !Number.isFinite(doy)) return null;
  const epoch = new Date(Date.UTC(yy < 57 ? 2000 + yy : 1900 + yy, 0, 1) + (doy - 1) * 86_400_000);
  return { line1: l1, line2: l2, epoch, source };
}

/** Güncel ISS TLE'si: önce CelesTrak, olmazsa wheretheiss.at. Alınamazsa null. */
export async function fetchIssTle(): Promise<IssTle | null> {
  try {
    const res = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle', {
      next: { revalidate: TLE_REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      const lines = (await res.text()).split('\n').map((l) => l.trim()).filter(Boolean);
      const i = lines.findIndex((l) => l.startsWith('1 25544'));
      const tle = i >= 0 ? parseTle(lines[i], lines[i + 1] ?? '', 'CelesTrak') : null;
      if (tle) return tle;
    }
  } catch {
    // ikinci kaynağa geç
  }
  try {
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544/tles', {
      next: { revalidate: TLE_REVALIDATE },
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      const j = (await res.json()) as { line1?: string; line2?: string };
      if (j.line1 && j.line2) return parseTle(j.line1, j.line2, 'wheretheiss.at');
    }
  } catch {
    // ikisi de alınamadı
  }
  return null;
}

/* ---------- Geçiş hesabı ---------- */

export interface IssPass {
  /** Görünür kısmın başı, en yüksek anı ve sonu */
  start: Date;
  max: Date;
  end: Date;
  startAz: number;
  endAz: number;
  maxEl: number;
  startEl: number;
  endEl: number;
  /** En yüksek andaki uzaklık (km) */
  rangeKm: number;
}

const MIN_EL = 10;
// Bundan kısa görünür kısımlar (ufukta gölgeye giriş/çıkış anları) pratikte izlenemez
const MIN_VISIBLE_S = 60;
const SUN_MAX_ALT = -6;
const STEP_S = 20;

interface Sample {
  t: number;
  el: number;
  az: number;
  range: number;
  visible: boolean;
}

function sample(satrec: SatRec, observer: { latitude: number; longitude: number; height: number }, t: number): Sample | null {
  const date = new Date(t);
  const pv = propagate(satrec, date);
  if (!pv || !pv.position || typeof pv.position === 'boolean') return null;
  const gmst = gstime(date);
  const look = ecfToLookAngles(observer, eciToEcf(pv.position, gmst));
  const el = (look.elevation * 180) / Math.PI;
  const az = (((look.azimuth * 180) / Math.PI) % 360 + 360) % 360;
  if (el < MIN_EL) return { t, el, az, range: look.rangeSat, visible: false };

  const jd = jday(date);
  const sun = sunPos(jd).rsun;
  const KM_PER_AU = 149_597_870.7;
  const sunEcf = eciToEcf({ x: sun.x * KM_PER_AU, y: sun.y * KM_PER_AU, z: sun.z * KM_PER_AU }, gmst);
  const sunEl = (ecfToLookAngles(observer, sunEcf).elevation * 180) / Math.PI;
  const lit = shadowFraction(sun, pv.position) < 0.5;
  return { t, el, az, range: look.rangeSat, visible: sunEl < SUN_MAX_ALT && lit };
}

/** `from`dan başlayarak `days` gün içindeki görünür geçişler. */
export function visiblePasses(tle: IssTle, city: Pick<IssCity, 'lat' | 'lon'>, from: Date, days = 10): IssPass[] {
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const observer = { latitude: degreesToRadians(city.lat), longitude: degreesToRadians(city.lon), height: 0.05 };
  const passes: IssPass[] = [];
  const end = from.getTime() + days * 86_400_000;
  let run: Sample[] = [];

  const close = () => {
    if (run.length >= 2 && run[run.length - 1].t - run[0].t >= MIN_VISIBLE_S * 1000) {
      const top = run.reduce((a, b) => (b.el > a.el ? b : a));
      const first = run[0];
      const last = run[run.length - 1];
      passes.push({
        start: new Date(first.t), max: new Date(top.t), end: new Date(last.t),
        startAz: first.az, endAz: last.az, maxEl: top.el, startEl: first.el, endEl: last.el, rangeKm: top.range,
      });
    }
    run = [];
  };

  for (let t = from.getTime(); t <= end; t += STEP_S * 1000) {
    const s = sample(satrec, observer, t);
    if (s?.visible) run.push(s);
    else close();
  }
  close();
  return passes;
}

/* ---------- Biçimlendirme ---------- */

const DIRECTIONS = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'];
const DIRECTION_NAMES: Record<string, string> = {
  K: 'kuzey', KD: 'kuzeydoğu', D: 'doğu', GD: 'güneydoğu', G: 'güney', GB: 'güneybatı', B: 'batı', KB: 'kuzeybatı',
};

/** 16 yönlü pusula kısaltması (K, KKD, KD…) */
export const compass = (az: number) => DIRECTIONS[Math.round(az / 22.5) % 16];
/** 8 yönlü okunur ad (kuzeybatı…) */
export const compassName = (az: number) => DIRECTION_NAMES[['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'][Math.round(az / 45) % 8]];

/** Kabaca parlaklık: yükseklik ve uzaklığa göre */
export function brightness(p: IssPass): { label: string; tone: 'high' | 'mid' | 'low' } {
  if (p.maxEl >= 50 || p.rangeKm < 700) return { label: 'Çok parlak', tone: 'high' };
  if (p.maxEl >= 25) return { label: 'Parlak', tone: 'mid' };
  return { label: 'Alçakta, daha sönük', tone: 'low' };
}
