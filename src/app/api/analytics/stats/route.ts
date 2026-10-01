import { NextRequest, NextResponse } from 'next/server';
import { computeAnalyticsStats } from '@/lib/analyticsStore';
import { isAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim. Telemetri verisi yalnızca site sahibine özeldir.' },
        { status: 401 }
      );
    }

    const demoParam = req.nextUrl.searchParams.get('demo');
    // If demo=true is passed, include baseline seed; otherwise show ONLY 100% REAL LIVE data
    const includeDemo = demoParam === 'true';
    const stats = computeAnalyticsStats(includeDemo);

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: unknown) {
    console.error('[analytics/stats]', err);
    return NextResponse.json({ error: 'İstatistikler hesaplanamadı.' }, { status: 500 });
  }
}
