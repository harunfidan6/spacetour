'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { isFilm } from '@/lib/film';

// Exportable custom event tracking utility
export function trackEvent(eventName: string, metadata?: Record<string, unknown>) {
  if (typeof window === 'undefined' || isFilm()) return;
  try {
    const sessionId = getOrCreateSessionId();
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'custom',
        eventName,
        metadata,
        path: window.location.pathname,
        sessionId
      }),
      keepalive: true
    }).catch(() => {});

    // Forward to Plausible analytics if initialized
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).plausible === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).plausible(eventName, metadata ? { props: metadata } : undefined);
    }
  } catch {}
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('astro_sid');
  if (!sid) {
    sid = `sid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('astro_sid', sid);
  }
  return sid;
}

const subscribeNever = () => () => {};

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathname = useRef<string | null>(null);

  // Film mode (promo recording) stays out of the statistics.
  const insights = useSyncExternalStore(subscribeNever, () => !isFilm(), () => false);

  // Track page views on route change
  useEffect(() => {
    if (typeof window === 'undefined' || isFilm()) return;

    const sessionId = getOrCreateSessionId();
    const screen = `${window.innerWidth}x${window.innerHeight}`;
    const title = document.title || 'SpaceTour TR';
    const referrer = document.referrer || 'direct';

    // Only fire if changed or first load
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          path: pathname,
          title,
          referrer,
          sessionId,
          screen
        }),
        keepalive: true
      }).catch(() => {});
    }
  }, [pathname]);

  // Periodic heartbeat every 25 seconds for live active visitor telemetry
  useEffect(() => {
    if (typeof window === 'undefined' || isFilm()) return;

    const sessionId = getOrCreateSessionId();

    const interval = setInterval(() => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'heartbeat',
          sessionId
        }),
        keepalive: true
      }).catch(() => {});
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  if (!insights) return null;
  return (
    <>
      {/* Official Native Vercel Edge Analytics & Web Vitals */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
