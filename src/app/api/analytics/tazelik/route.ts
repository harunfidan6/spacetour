import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getFreshnessHistory, runFreshnessCheck, saveFreshnessReport } from '@/lib/contentFreshness';
import { BASE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Vercel Cron, CRON_SECRET tanımlıysa isteğe "Authorization: Bearer <CRON_SECRET>" ekler
function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  const cron = isCronRequest(req);
  if (!cron && !isAdminRequest(req)) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  // Canlıda ziyaretçilerin gördüğü adres denetlenir; geliştirmede yerel sunucu
  const origin = process.env.NODE_ENV === 'production' ? BASE_URL : req.nextUrl.origin;
  const report = await runFreshnessCheck(origin, cron ? 'cron' : 'panel');
  await saveFreshnessReport(report);
  if (!report.ok) console.warn('[Freshness] Güncel olmayan sayfalar:', report.checks.filter((c) => c.status === 'stale' || c.status === 'error').map((c) => `${c.path}: ${c.note}`));

  return NextResponse.json(
    { report, history: await getFreshnessHistory() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
