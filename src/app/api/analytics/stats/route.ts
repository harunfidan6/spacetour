import { NextResponse } from 'next/server';
import { computeAnalyticsStats } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = computeAnalyticsStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
