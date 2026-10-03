import { NextResponse } from 'next/server';
import type { PageViewRecord, CustomEventRecord } from '@/types/analytics';

// Helper: count occurrences by a key
function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce((acc, item) => {
    const k = (item[key] as unknown) as string || 'Diğer';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fromParam = url.searchParams.get('from'); // ISO string or timestamp ms
    const cutoffMs = fromParam ? new Date(fromParam).getTime() : Date.now();

    // Global in‑memory stores (created by src/lib/analyticsStore.ts)
    const records: PageViewRecord[] = (globalThis as any).__astro_analytics_records || [];
    const events: CustomEventRecord[] = (globalThis as any).__astro_analytics_events || [];

    const recentRecords = records.filter((r) => r.timestamp >= cutoffMs);
    const recentEvents = events.filter((e) => e.timestamp >= cutoffMs);

    const report = {
      from: new Date(cutoffMs).toISOString(),
      to: new Date().toISOString(),
      totalPageViews: recentRecords.length,
      uniqueVisitors: new Set(recentRecords.map((r) => r.ipHash)).size,
      deviceBreakdown: countBy(recentRecords, 'device'),
      browserBreakdown: countBy(recentRecords, 'browser'),
      osBreakdown: countBy(recentRecords, 'os'),
      topPages: (() => {
        const map = countBy(recentRecords, 'path');
        return Object.entries(map)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([path, count]) => ({ path, count }));
      })(),
      recentCustomEvents: recentEvents.slice(0, 20).map((e) => ({
        id: e.id,
        type: e.type,
        label: e.label,
        path: e.path,
        timestamp: new Date(e.timestamp).toISOString(),
        metadata: (e as any).metadata || null,
      })),
    };

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
