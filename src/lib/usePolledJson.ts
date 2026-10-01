'use client';

import { useEffect, useState } from 'react';

export interface PolledJson<T> {
  data: T | null;
  /** True when the most recent request failed (the last good payload is kept). */
  error: boolean;
  updatedAt: number | null;
}

/** Polls a public JSON endpoint while `enabled`; requests are aborted on unmount. */
export function usePolledJson<T>(url: string, intervalMs: number, enabled = true): PolledJson<T> {
  const [state, setState] = useState<PolledJson<T>>({ data: null, error: false, updatedAt: null });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const controller = new AbortController();

    const load = () => {
      fetch(url, { signal: controller.signal, cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<T>;
        })
        .then((data) => {
          if (!cancelled) setState({ data, error: false, updatedAt: Date.now() });
        })
        .catch(() => {
          if (!cancelled) setState((prev) => ({ ...prev, error: true }));
        });
    };

    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(id);
    };
  }, [url, intervalMs, enabled]);

  return state;
}
