import { NextResponse } from 'next/server';
import { getAnalyticsRecords } from '@/lib/analyticsStore';
import type { PageViewRecord } from '@/types/analytics';

export const dynamic = 'force-dynamic';

function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce((acc, item) => {
    const k = ((item[key] as unknown) as string) || 'Diğer';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fromParam = url.searchParams.get('from');
    const demoParam = url.searchParams.get('demo') === 'true';

    // Default cutoff: 03.10.2026 22:00:00 (UTC+3) -> 19:00:00 UTC
    const defaultCutoff = new Date('2026-10-03T19:00:00Z').getTime();
    const cutoffMs = fromParam ? new Date(fromParam).getTime() : defaultCutoff;

    const { records, events } = getAnalyticsRecords(demoParam);

    const recentRecords = records.filter((r) => r.timestamp >= cutoffMs);
    const recentEvents = events.filter((e) => e.timestamp >= cutoffMs);

    const pageCountMap: Record<string, { title: string; count: number }> = {};
    recentRecords.forEach((r) => {
      if (!pageCountMap[r.path]) {
        pageCountMap[r.path] = { title: r.title || r.path, count: 0 };
      }
      pageCountMap[r.path].count++;
    });

    const topPages = Object.entries(pageCountMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([path, data]) => ({
        path,
        title: data.title,
        count: data.count,
        percentage: Math.round((data.count / (recentRecords.length || 1)) * 100)
      }));

    const report = {
      from: new Date(cutoffMs).toISOString(),
      to: new Date().toISOString(),
      cutoffLabel: '03.10.2026 22:00 (UTC+3)',
      totalPageViews: recentRecords.length,
      uniqueVisitors: new Set(recentRecords.map((r) => r.ipHash)).size,
      deviceBreakdown: countBy(recentRecords, 'device'),
      browserBreakdown: countBy(recentRecords, 'browser'),
      osBreakdown: countBy(recentRecords, 'os'),
      cityBreakdown: countBy(recentRecords, 'city'),
      topPages,
      recentCustomEvents: recentEvents.slice(0, 20).map((e) => ({
        id: e.id,
        type: e.type,
        label: e.label,
        path: e.path,
        timestamp: new Date(e.timestamp).toLocaleTimeString('tr-TR'),
      })),
      recentStream: recentRecords.slice(0, 15).map((r) => ({
        id: r.id,
        time: new Date(r.timestamp).toLocaleTimeString('tr-TR'),
        path: r.path,
        title: r.title,
        city: r.city,
        device: r.device,
        browser: r.browser,
        os: r.os
      }))
    };

    return NextResponse.json(report, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
