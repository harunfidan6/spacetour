import { Redis } from '@upstash/redis';
import type { PageViewRecord, CustomEventRecord, AnalyticsStatsResponse } from '@/types/analytics';

// Vercel KV uses KV_REST_API_URL / KV_REST_API_TOKEN
// Upstash Redis uses UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch (e) {
      console.error('[PersistentAnalytics] Redis initialization error:', e);
    }
  }
  return null;
}

export function isRedisConfigured(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}

export async function savePersistentPageView(record: PageViewRecord): Promise<void> {
  // Always log for permanent Vercel runtime log retention
  console.log('[TELEMETRY_VISIT]', JSON.stringify({
    id: record.id,
    time: new Date(record.timestamp).toISOString(),
    path: record.path,
    title: record.title,
    referrer: record.referrer,
    city: record.city,
    country: record.country,
    device: record.device,
    browser: record.browser,
    os: record.os,
    ipHash: record.ipHash,
    sessionId: record.sessionId
  }));

  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();

    // 1. Keep sorted list of recent pageviews (by timestamp)
    pipeline.zadd('astro:pageviews', { score: record.timestamp, member: JSON.stringify(record) });
    // Trim to last 10,000 to stay within limits
    pipeline.zremrangebyrank('astro:pageviews', 0, -10001);

    // 2. Increment counters
    pipeline.hincrby('astro:paths', record.path, 1);
    if (record.city) pipeline.hincrby('astro:cities', record.city, 1);
    if (record.device) pipeline.hincrby('astro:devices', record.device, 1);
    if (record.browser) pipeline.hincrby('astro:browsers', record.browser, 1);
    if (record.os) pipeline.hincrby('astro:os', record.os, 1);

    // 3. Unique visitors set
    pipeline.sadd('astro:uniques', record.ipHash);

    // 4. Live active heartbeat (expires in 120 seconds)
    pipeline.set(`astro:active:${record.sessionId}`, Date.now(), { ex: 120 });

    await pipeline.exec();
  } catch (err) {
    console.error('[PersistentAnalytics] Failed to save to Redis:', err);
  }
}

export async function savePersistentHeartbeat(sessionId: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.set(`astro:active:${sessionId}`, Date.now(), { ex: 120 });
  } catch {}
}

export async function savePersistentEvent(event: CustomEventRecord): Promise<void> {
  console.log('[TELEMETRY_EVENT]', JSON.stringify(event));
  const redis = getRedisClient();
  if (!redis) return;
  try {
    await redis.lpush('astro:events', JSON.stringify(event));
    await redis.ltrim('astro:events', 0, 500);
  } catch {}
}

export async function getPersistentStats(): Promise<{
  configured: boolean;
  activeNow?: number;
  totalPageviews?: number;
  uniqueVisitors?: number;
  paths?: Record<string, number>;
  cities?: Record<string, number>;
  devices?: Record<string, number>;
  browsers?: Record<string, number>;
  os?: Record<string, number>;
  recentStream?: PageViewRecord[];
}> {
  const redis = getRedisClient();
  if (!redis) {
    return { configured: false };
  }

  try {
    // 1. Active sessions
    const activeKeys = await redis.keys('astro:active:*');
    const activeNow = Math.max(activeKeys.length, 1);

    // 2. Total views
    const totalPageviews = await redis.zcard('astro:pageviews');

    // 3. Unique visitors
    const uniqueVisitors = await redis.scard('astro:uniques');

    // 4. Dimensions
    const paths = (await redis.hgetall('astro:paths')) as Record<string, number> || {};
    const cities = (await redis.hgetall('astro:cities')) as Record<string, number> || {};
    const devices = (await redis.hgetall('astro:devices')) as Record<string, number> || {};
    const browsers = (await redis.hgetall('astro:browsers')) as Record<string, number> || {};
    const os = (await redis.hgetall('astro:os')) as Record<string, number> || {};

    // 5. Recent stream (last 20)
    const rawRecent = await redis.zrange('astro:pageviews', -20, -1, { rev: true });
    const recentStream: PageViewRecord[] = [];
    for (const item of rawRecent) {
      try {
        recentStream.push(typeof item === 'string' ? JSON.parse(item) : (item as PageViewRecord));
      } catch {}
    }

    return {
      configured: true,
      activeNow,
      totalPageviews,
      uniqueVisitors,
      paths,
      cities,
      devices,
      browsers,
      os,
      recentStream
    };
  } catch (err) {
    console.error('[PersistentAnalytics] getPersistentStats error:', err);
    return { configured: false };
  }
}
