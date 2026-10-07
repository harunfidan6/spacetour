/**
 * Günlük içerik denetimi: her gün değişmesi gereken sayfaları canlı siteden çeker ve
 * bugünün içeriğini sunup sunmadıklarını kontrol eder. Sayfalar ISR ile yenilendiği için
 * süresi dolmuş bir sayfaya gelen ilk istek eski sürümü alır ve yenilemeyi başlatır; denetim
 * bu durumda kısa bir beklemeden sonra sayfayı bir kez daha çeker.
 */

import { dailyReading } from '@/lib/astrology/dailyHoroscope';
import { SIGN_IDS, SIGN_NAMES, moonSign } from '@/lib/astrology/dailySky';
import { getRedisClient } from '@/lib/persistentAnalytics';

export type FreshnessStatus = 'ok' | 'refreshed' | 'stale' | 'error';

export interface FreshnessCheck {
  path: string;
  label: string;
  status: FreshnessStatus;
  /** Sayfanın üretildiği an (ISO) */
  generatedAt: string | null;
  note: string;
}

export interface FreshnessReport {
  checkedAt: string;
  source: 'panel' | 'cron';
  origin: string;
  ok: boolean;
  checks: FreshnessCheck[];
}

const TZ = 'Europe/Istanbul';
const istanbulDay = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: TZ });
const RETRY_DELAY_MS = 4000;
// "Ay bugün" 15 dakikada bir yenilenir; üretim ve önbellek gecikmesi için pay
const MOON_MAX_AGE_MIN = 20;
// ISS geçiş sayfaları saatte bir yenilenir
const ISS_MAX_AGE_MIN = 75;
const SIGN_LABELS: Record<string, string> = Object.fromEntries(SIGN_IDS.map((id, i) => [id, SIGN_NAMES[i]]));

const decode = (html: string) =>
  html.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function fetchPage(url: string): Promise<{ html: string; generatedAt: Date | null } | { error: string }> {
  try {
    const res = await fetch(url, { cache: 'no-store', headers: { 'user-agent': 'SpaceTour-Tazelik-Denetimi' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const html = decode(await res.text());
    const m = html.match(/data-generated="([^"]+)"/);
    const generatedAt = m ? new Date(m[1]) : null;
    return { html, generatedAt: generatedAt && !Number.isNaN(generatedAt.getTime()) ? generatedAt : null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'İstek başarısız' };
  }
}

type Verdict = { fresh: boolean; note: string };

/** Sayfayı çeker; eskiyse yenilemenin bitmesi için bekleyip bir kez daha dener. */
async function checkPage(origin: string, path: string, label: string, judge: (html: string, generatedAt: Date) => Verdict): Promise<FreshnessCheck> {
  const run = async () => {
    const page = await fetchPage(origin + path);
    if ('error' in page) return { status: 'error' as const, generatedAt: null, note: page.error };
    if (!page.generatedAt) return { status: 'error' as const, generatedAt: null, note: 'Sayfada üretim zamanı bulunamadı (data-generated).' };
    const v = judge(page.html, page.generatedAt);
    return { status: v.fresh ? ('ok' as const) : ('stale' as const), generatedAt: page.generatedAt.toISOString(), note: v.note };
  };

  const first = await run();
  if (first.status !== 'stale') return { path, label, ...first };
  await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
  const second = await run();
  if (second.status === 'ok') return { path, label, ...second, status: 'refreshed', note: 'Eski sürüm sunuluyordu; denetim yenilemeyi tetikledi, şimdi güncel.' };
  return { path, label, ...second };
}

export async function runFreshnessCheck(origin: string, source: FreshnessReport['source']): Promise<FreshnessReport> {
  const now = new Date();
  const today = istanbulDay(now);

  const signChecks = SIGN_IDS.map((id) =>
    checkPage(origin, `/astroloji/gunluk-burc/${id}`, `Günlük burç · ${SIGN_LABELS[id]}`, (html, generatedAt) => {
      if (istanbulDay(generatedAt) !== today) return { fresh: false, note: `${istanbulDay(generatedAt)} tarihli yorum sunuluyor.` };
      // Sayfa bugün üretildiyse yorum da bugünün yorumu olmalı (motor değişmediyse birebir aynı)
      const expected = dailyReading(id, now).headline;
      return html.includes(expected) ? { fresh: true, note: 'Bugünün yorumu yayında.' } : { fresh: false, note: 'Sayfa bugün üretilmiş ama yorum metni beklenenle eşleşmiyor.' };
    })
  );

  const moonCheck = checkPage(origin, '/astroloji/ay-bugun', 'Ay bugün', (html, generatedAt) => {
    const ageMin = (now.getTime() - generatedAt.getTime()) / 60000;
    if (ageMin > MOON_MAX_AGE_MIN) return { fresh: false, note: `Sayfa ${Math.round(ageMin)} dakika önce üretilmiş (en fazla ${MOON_MAX_AGE_MIN} olmalı).` };
    const shown = html.match(/Ay şu an (\S+) burcunun/)?.[1];
    const expected = SIGN_NAMES[moonSign(generatedAt)];
    if (shown && shown !== expected) return { fresh: false, note: `Ay ${shown} burcunda gösteriliyor, ${expected} olmalı.` };
    return { fresh: true, note: `Ay ${expected} burcunda gösteriliyor.` };
  });

  const issCheck = checkPage(origin, '/canli/iss-gecisleri/istanbul', 'ISS geçişleri · İstanbul', (html, generatedAt) => {
    const ageMin = (now.getTime() - generatedAt.getTime()) / 60000;
    if (ageMin > ISS_MAX_AGE_MIN) return { fresh: false, note: `Sayfa ${Math.round(ageMin)} dakika önce üretilmiş (en fazla ${ISS_MAX_AGE_MIN} olmalı).` };
    if (html.includes('data-tle="yok"')) return { fresh: false, note: 'Yörünge verisi (TLE) alınamamış; geçişler gösterilemiyor.' };
    return { fresh: true, note: 'Geçişler güncel yörünge verisiyle hesaplanmış.' };
  });

  const checks = await Promise.all([moonCheck, issCheck, ...signChecks]);
  return {
    checkedAt: now.toISOString(),
    source,
    origin,
    ok: checks.every((c) => c.status === 'ok' || c.status === 'refreshed'),
    checks,
  };
}

/* ---------- Geçmiş (Redis bağlıysa) ---------- */

const HISTORY_KEY = 'astro:freshness:history';
const HISTORY_LIMIT = 30;

export interface FreshnessHistoryItem {
  checkedAt: string;
  source: FreshnessReport['source'];
  ok: boolean;
  total: number;
  failed: string[];
}

export async function saveFreshnessReport(report: FreshnessReport): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  const item: FreshnessHistoryItem = {
    checkedAt: report.checkedAt,
    source: report.source,
    ok: report.ok,
    total: report.checks.length,
    failed: report.checks.filter((c) => c.status === 'stale' || c.status === 'error').map((c) => c.label),
  };
  try {
    await redis.lpush(HISTORY_KEY, JSON.stringify(item));
    await redis.ltrim(HISTORY_KEY, 0, HISTORY_LIMIT - 1);
  } catch (e) {
    console.error('[Freshness] Geçmiş kaydedilemedi:', e);
  }
}

export async function getFreshnessHistory(): Promise<FreshnessHistoryItem[] | null> {
  const redis = getRedisClient();
  if (!redis) return null;
  try {
    const raw = await redis.lrange<FreshnessHistoryItem | string>(HISTORY_KEY, 0, HISTORY_LIMIT - 1);
    // Upstash JSON'u kendiliğinden çözebilir; metin geldiyse biz çözeriz
    return raw.map((r) => (typeof r === 'string' ? (JSON.parse(r) as FreshnessHistoryItem) : r));
  } catch (e) {
    console.error('[Freshness] Geçmiş okunamadı:', e);
    return [];
  }
}
