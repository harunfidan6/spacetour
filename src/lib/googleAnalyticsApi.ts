import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { AnalyticsStatsResponse } from '@/types/analytics';

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

export type AnalyticsPeriod = 'today' | 'yesterday' | '7days' | '30days';

function getClient(): BetaAnalyticsDataClient | null {
  if (analyticsDataClient) return analyticsDataClient;

  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  if (!propertyId) return null;

  try {
    const credentialsJson = process.env.GA_CREDENTIALS_JSON?.trim();
    if (credentialsJson) {
      const parsed = JSON.parse(credentialsJson);
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: parsed.client_email,
          private_key: parsed.private_key?.replace(/\\n/g, '\n'),
        },
      });
      return analyticsDataClient;
    }

    const clientEmail = process.env.GA_CLIENT_EMAIL?.trim();
    const privateKey = process.env.GA_PRIVATE_KEY?.trim()?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
      });
      return analyticsDataClient;
    }
  } catch (err) {
    console.error('[GoogleAnalyticsApi] Failed to initialize client:', err);
  }

  return null;
}

export function isGoogleAnalyticsConfigured(): boolean {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const hasCreds = Boolean(
    process.env.GA_CREDENTIALS_JSON?.trim() ||
    (process.env.GA_CLIENT_EMAIL?.trim() && process.env.GA_PRIVATE_KEY?.trim())
  );
  return Boolean(propertyId && hasCreds);
}

export async function fetchGoogleAnalyticsStats(
  period: AnalyticsPeriod = 'today'
): Promise<Partial<AnalyticsStatsResponse> | null> {
  const client = getClient();
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  if (!client || !propertyId) return null;

  try {
    const property = `properties/${propertyId}`;

    // Define Date Range
    let dateRange = { startDate: 'today', endDate: 'today' };
    if (period === 'yesterday') {
      dateRange = { startDate: 'yesterday', endDate: 'yesterday' };
    } else if (period === '7days') {
      dateRange = { startDate: '7daysAgo', endDate: 'today' };
    } else if (period === '30days') {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }

    // 1. Run Realtime Report for currently active users
    const [realtimeResponse] = await client.runRealtimeReport({
      property,
      metrics: [{ name: 'activeUsers' }],
    }).catch((err) => {
      console.warn('[GA4] Realtime query warning:', err.message);
      return [{ rows: [] }];
    });

    const activeVisitorsNow = Number(realtimeResponse?.rows?.[0]?.metricValues?.[0]?.value || 0);

    // 2. Run Historical Report for Top Pages in selected period
    const [reportResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'userEngagementDuration' },
      ],
      limit: 12,
    }).catch((err) => {
      console.warn('[GA4] Report query warning:', err.message);
      return [{ rows: [] }];
    });

    let totalPageviews = 0;
    let uniqueVisitors = 0;
    let totalDuration = 0;

    const topPages = (reportResponse?.rows || []).map((row) => {
      const path = row.dimensionValues?.[0]?.value || '/';
      const views = Number(row.metricValues?.[0]?.value || 0);
      const users = Number(row.metricValues?.[1]?.value || 0);
      const duration = Number(row.metricValues?.[2]?.value || 0);

      totalPageviews += views;
      uniqueVisitors += users;
      totalDuration += duration;

      return {
        path,
        title: path,
        views,
        percentage: 0,
      };
    });

    for (const p of topPages) {
      p.percentage = Math.round((p.views / (totalPageviews || 1)) * 100);
    }

    // 3. Geographic Breakdown (City & Country)
    const [geoResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'city' }, { name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
    }).catch(() => [{ rows: [] }]);

    const topCities = (geoResponse?.rows || [])
      .filter((row) => row.dimensionValues?.[0]?.value !== '(not set)')
      .map((row) => {
        const city = row.dimensionValues?.[0]?.value || 'Bilinmiyor';
        const country = row.dimensionValues?.[1]?.value || 'TR';
        const count = Number(row.metricValues?.[0]?.value || 0);
        return {
          city,
          country,
          count,
          percentage: Math.round((count / (uniqueVisitors || 1)) * 100),
        };
      });

    // 4. Device Breakdown
    const [deviceResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    }).catch(() => [{ rows: [] }]);

    const deviceBreakdown = (deviceResponse?.rows || []).map((row) => {
      const rawDevice = row.dimensionValues?.[0]?.value || 'desktop';
      const device = rawDevice === 'mobile' ? 'Mobil' : rawDevice === 'tablet' ? 'Tablet' : 'Masaüstü';
      const count = Number(row.metricValues?.[0]?.value || 0);
      return {
        device,
        count,
        percentage: Math.round((count / (uniqueVisitors || 1)) * 100),
      };
    });

    // 5. Operating System Breakdown
    const [osResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'operatingSystem' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 6,
    }).catch(() => [{ rows: [] }]);

    const osBreakdown = (osResponse?.rows || []).map((row) => {
      const os = row.dimensionValues?.[0]?.value || 'Diğer';
      const count = Number(row.metricValues?.[0]?.value || 0);
      return {
        os,
        count,
        percentage: Math.round((count / (uniqueVisitors || 1)) * 100),
      };
    });

    // 6. Browser Breakdown
    const [browserResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 6,
    }).catch(() => [{ rows: [] }]);

    const browserBreakdown = (browserResponse?.rows || []).map((row) => {
      const browser = row.dimensionValues?.[0]?.value || 'Diğer';
      const count = Number(row.metricValues?.[0]?.value || 0);
      return {
        browser,
        count,
        percentage: Math.round((count / (uniqueVisitors || 1)) * 100),
      };
    });

    // 7. Traffic Sources
    const [sourceResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 8,
    }).catch(() => [{ rows: [] }]);

    const trafficSources = (sourceResponse?.rows || []).map((row) => {
      const source = row.dimensionValues?.[0]?.value || 'Doğrudan';
      const count = Number(row.metricValues?.[0]?.value || 0);
      return {
        source,
        count,
        percentage: Math.round((count / (uniqueVisitors || 1)) * 100),
      };
    });

    // 8. Timeline Breakdown (Hourly for today/yesterday, Daily for 7days/30days)
    const isHourly = period === 'today' || period === 'yesterday';
    const timelineDimension = isHourly ? 'hour' : 'date';

    const [timelineResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: timelineDimension }],
      metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      orderBys: [{ dimension: { dimensionName: timelineDimension } }],
    }).catch(() => [{ rows: [] }]);

    let hourlyTimeline: { hour: string; views: number; uniques: number }[] = [];

    if (isHourly) {
      // 24-hour timeline from 00:00 to 23:00
      const hourMap: Record<string, { views: number; uniques: number }> = {};
      for (let h = 0; h < 24; h++) {
        const hStr = `${String(h).padStart(2, '0')}:00`;
        hourMap[hStr] = { views: 0, uniques: 0 };
      }

      for (const row of timelineResponse?.rows || []) {
        const rawHour = row.dimensionValues?.[0]?.value || '00';
        const hKey = `${String(rawHour).padStart(2, '0')}:00`;
        if (hourMap[hKey]) {
          hourMap[hKey].views = Number(row.metricValues?.[0]?.value || 0);
          hourMap[hKey].uniques = Number(row.metricValues?.[1]?.value || 0);
        }
      }

      hourlyTimeline = Object.entries(hourMap).map(([hour, val]) => ({
        hour,
        views: val.views,
        uniques: val.uniques,
      }));
    } else {
      // Day by day timeline (e.g. 01 Eki, 02 Eki...)
      hourlyTimeline = (timelineResponse?.rows || []).map((row) => {
        const dateStr = row.dimensionValues?.[0]?.value || '';
        // format YYYYMMDD to DD/MM
        const dayLabel = dateStr.length === 8 ? `${dateStr.slice(6, 8)}.${dateStr.slice(4, 6)}` : dateStr;
        return {
          hour: dayLabel,
          views: Number(row.metricValues?.[0]?.value || 0),
          uniques: Number(row.metricValues?.[1]?.value || 0),
        };
      });
    }

    const avgDurationSeconds = Math.round(totalDuration / (uniqueVisitors || 1));

    return {
      activeVisitorsNow: Math.max(activeVisitorsNow, 0),
      totalPageviews,
      uniqueVisitors,
      avgDurationSeconds,
      topPages,
      topCities,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      trafficSources,
      hourlyTimeline,
    };
  } catch (err) {
    console.error('[GoogleAnalyticsApi] Error fetching stats:', err);
    return null;
  }
}
