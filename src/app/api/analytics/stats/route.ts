import { NextRequest, NextResponse } from 'next/server';
import { computeAnalyticsStats } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const demoParam = req.nextUrl.searchParams.get('demo');
    // If demo=true is passed, include baseline seed; otherwise show ONLY 100% REAL LIVE data
    const includeDemo = demoParam === 'true';
    const stats = computeAnalyticsStats(includeDemo);

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
