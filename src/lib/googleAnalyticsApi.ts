import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { AnalyticsStatsResponse } from '@/types/analytics';

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  if (analyticsDataClient) return analyticsDataClient;

  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  if (!propertyId) return null;

  try {
    // 1. Option: Full JSON credentials in one env variable
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

    // 2. Option: Separate client_email and private_key env variables
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

export async function fetchGoogleAnalyticsStats(): Promise<Partial<AnalyticsStatsResponse> | null> {
  const client = getClient();
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  if (!client || !propertyId) return null;

  try {
    const property = `properties/${propertyId}`;

    // 1. Run Realtime Report for active users
    const [realtimeResponse] = await client.runRealtimeReport({
      property,
      metrics: [{ name: 'activeUsers' }],
    }).catch((err) => {
      console.warn('[GA4] Realtime query warning:', err.message);
      return [{ rows: [] }];
    });

    const activeVisitorsNow = Number(realtimeResponse?.rows?.[0]?.metricValues?.[0]?.value || 0);

    // 2. Run Historical Report (last 7 days)
    const [reportResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'userEngagementDuration' },
      ],
      limit: 10,
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

    // Fix percentages
    for (const p of topPages) {
      p.percentage = Math.round((p.views / (totalPageviews || 1)) * 100);
    }

    // 3. Geographic Breakdown (City & Country)
    const [geoResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'city' }, { name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 8,
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
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
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
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
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

    // 6. Traffic Sources
    const [sourceResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 6,
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

    const avgDurationSeconds = Math.round(totalDuration / (uniqueVisitors || 1));

    return {
      activeVisitorsNow: Math.max(activeVisitorsNow, 0),
      totalPageviews,
      uniqueVisitors,
      avgDurationSeconds,
      topPages,
      topCities,
      deviceBreakdown,
      osBreakdown,
      trafficSources,
    };
  } catch (err) {
    console.error('[GoogleAnalyticsApi] Error fetching stats:', err);
    return null;
  }
}
