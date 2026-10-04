import { NextRequest, NextResponse } from 'next/server';
import { computeAnalyticsStats } from '@/lib/analyticsStore';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPersistentStats, isRedisConfigured } from '@/lib/persistentAnalytics';
import { fetchGoogleAnalyticsStats, isGoogleAnalyticsConfigured } from '@/lib/googleAnalyticsApi';

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
    const includeDemo = demoParam === 'true';
    const stats = computeAnalyticsStats(includeDemo);

    // If Google Analytics Data API is connected, overlay official GA4 data
    if (isGoogleAnalyticsConfigured()) {
      const gaStats = await fetchGoogleAnalyticsStats();
      if (gaStats) {
        if (gaStats.activeVisitorsNow !== undefined) stats.activeVisitorsNow = gaStats.activeVisitorsNow;
        if (gaStats.totalPageviews !== undefined) stats.totalPageviews = gaStats.totalPageviews;
        if (gaStats.uniqueVisitors !== undefined) stats.uniqueVisitors = gaStats.uniqueVisitors;
        if (gaStats.avgDurationSeconds !== undefined) stats.avgDurationSeconds = gaStats.avgDurationSeconds;
        if (gaStats.topPages && gaStats.topPages.length > 0) stats.topPages = gaStats.topPages;
        if (gaStats.topCities && gaStats.topCities.length > 0) stats.topCities = gaStats.topCities;
        if (gaStats.deviceBreakdown && gaStats.deviceBreakdown.length > 0) stats.deviceBreakdown = gaStats.deviceBreakdown;
        if (gaStats.osBreakdown && gaStats.osBreakdown.length > 0) stats.osBreakdown = gaStats.osBreakdown;
        if (gaStats.trafficSources && gaStats.trafficSources.length > 0) stats.trafficSources = gaStats.trafficSources;
      }
    }
    // Else if persistent Redis is connected, overlay permanent counters
    else if (isRedisConfigured()) {
      const pStats = await getPersistentStats();
      if (pStats.configured && (pStats.totalPageviews || 0) > 0) {
        stats.activeVisitorsNow = pStats.activeNow || stats.activeVisitorsNow;
        stats.totalPageviews = pStats.totalPageviews || stats.totalPageviews;
        stats.uniqueVisitors = pStats.uniqueVisitors || stats.uniqueVisitors;

        if (pStats.recentStream && pStats.recentStream.length > 0) {
          stats.recentStream = pStats.recentStream;
        }

        if (pStats.paths && Object.keys(pStats.paths).length > 0) {
          stats.topPages = Object.entries(pStats.paths)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([path, views]) => ({
              path,
              title: path,
              views,
              percentage: Math.round((views / (pStats.totalPageviews || 1)) * 100)
            }));
        }

        if (pStats.cities && Object.keys(pStats.cities).length > 0) {
          stats.topCities = Object.entries(pStats.cities)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([city, visitors]) => ({
              city,
              country: 'TR',
              count: visitors,
              percentage: Math.round((visitors / (pStats.totalPageviews || 1)) * 100)
            }));
        }
      }
    }

    return NextResponse.json({
      ...stats,
      isPersistent: isRedisConfigured() || isGoogleAnalyticsConfigured(),
      isGoogleAnalytics: isGoogleAnalyticsConfigured()
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err: unknown) {
    console.error('[analytics/stats]', err);
    return NextResponse.json({ error: 'İstatistikler hesaplanamadı.' }, { status: 500 });
  }
}
