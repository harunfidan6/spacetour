import { NextRequest, NextResponse } from 'next/server';
import { recordPageView, recordHeartbeat, recordCustomTelemetry } from '@/lib/analyticsStore';
import { savePersistentPageView, savePersistentHeartbeat, savePersistentEvent } from '@/lib/persistentAnalytics';
import { PageViewRecord } from '@/types/analytics';

// Simple fast string hashing for IP privacy
function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h-${Math.abs(hash).toString(16)}`;
}

// User-Agent parser helper
function parseUserAgent(ua: string): {
  device: 'Mobil' | 'Masaüstü' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Diğer';
  os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Diğer';
} {
  const uaLower = ua.toLowerCase();

  // Device
  let device: 'Mobil' | 'Masaüstü' | 'Tablet' = 'Masaüstü';
  if (/ipad|tablet|playbook|silk/i.test(uaLower)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(uaLower)) {
    device = 'Mobil';
  }

  // OS
  let os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Diğer' = 'Diğer';
  if (/iphone|ipad|ipod/i.test(uaLower)) os = 'iOS';
  else if (/android/i.test(uaLower)) os = 'Android';
  else if (/windows nt/i.test(uaLower)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(uaLower)) os = 'macOS';
  else if (/linux/i.test(uaLower)) os = 'Linux';

  // Browser
  let browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Diğer' = 'Diğer';
  if (/edg\//i.test(uaLower)) browser = 'Edge';
  else if (/chrome|crios/i.test(uaLower) && !/edg\//i.test(uaLower)) browser = 'Chrome';
  else if (/safari/i.test(uaLower) && !/chrome|crios/i.test(uaLower)) browser = 'Safari';
  else if (/firefox|fxios/i.test(uaLower)) browser = 'Firefox';

  return { device, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, path, title, referrer, sessionId, screen, eventName, metadata } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Heartbeat only
    if (type === 'heartbeat') {
      recordHeartbeat(sessionId);
      savePersistentHeartbeat(sessionId).catch(() => {});
      return NextResponse.json({ success: true, active: true });
    }

    // Custom telemetry event
    if (type === 'custom') {
      const customEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        type: eventName || 'etkilesim',
        label: metadata?.label || eventName || 'Etkileşim',
        path: path || '/',
        metadata,
        sessionId
      };
      recordCustomTelemetry(customEvent);
      savePersistentEvent(customEvent).catch(() => {});
      return NextResponse.json({ success: true, custom: true });
    }

    // Standard PageView
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'TR';
    const city = req.headers.get('x-vercel-ip-city') || 'İstanbul';
    const ua = req.headers.get('user-agent') || '';

    const { device, browser, os } = parseUserAgent(ua);

    const record: PageViewRecord = {
      id: `pv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      path: path || '/',
      title: title || 'SpaceTour TR',
      referrer: referrer || 'direct',
      ipHash: hashIp(ip),
      country: country === 'TR' ? 'Türkiye' : country,
      city: decodeURIComponent(city),
      device,
      browser,
      os,
      screen: screen || '1920x1080',
      sessionId
    };

    recordPageView(record);
    savePersistentPageView(record).catch(() => {});

    return NextResponse.json({ success: true, recorded: record.id });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Bilinmeyen hata' }, { status: 500 });
  }
}
