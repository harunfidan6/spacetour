import { NextRequest, NextResponse } from 'next/server';
import { computeAnalyticsStats } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const adminKey = process.env.ADMIN_TELEMETRY_KEY || 'astro2026';
    const headerKey = req.headers.get('x-admin-key');
    const cookieKey = req.cookies.get('admin_telemetry_key')?.value;

    if (headerKey !== adminKey && cookieKey !== adminKey) {
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
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Bilinmeyen hata' }, { status: 500 });
  }
}
