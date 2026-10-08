'use client';

import React, { useRef } from 'react';
import { Wind, AlertTriangle, ShieldCheck, Magnet } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useInView } from '@/lib/useInView';
import { usePolledJson } from '@/lib/usePolledJson';

// NOAA Space Weather Prediction Center — small, CORS-enabled summary feeds
const SWPC = 'https://services.swpc.noaa.gov';
const WIND_SPEED_URL = `${SWPC}/products/summary/solar-wind-speed.json`;
const MAG_FIELD_URL = `${SWPC}/products/summary/solar-wind-mag-field.json`;
const FLARE_URL = `${SWPC}/json/goes/primary/xray-flares-latest.json`;
const KP_URL = `${SWPC}/products/noaa-planetary-k-index.json`;

const REFRESH_MS = 5 * 60_000;

type WindSpeed = { proton_speed: number; time_tag: string }[];
type MagField = { bt: number; bz_gsm: number; time_tag: string }[];
type Flares = { current_class?: string; max_class?: string; max_time?: string }[];
type KpSeries = { time_tag: string; Kp: number }[];

const clock = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function windNote(speed: number): string {
  if (speed >= 600) return 'Hızlı akış (koronal delik / CME)';
  if (speed >= 400) return 'Normal plazma akışı';
  return 'Yavaş, sakin akış';
}

function kpStatus(kp: number): string {
  if (kp >= 5) return `G${Math.min(5, Math.floor(kp) - 4)} jeomanyetik fırtına`;
  if (kp >= 4) return 'Jeomanyetik aktif';
  return 'Jeomanyetik sakin';
}

function kpColor(kp: number | null): string {
  if (kp === null) return 'border-line text-paper/70';
  if (kp < 4) return 'border-lime/30 bg-lime/10 text-lime';
  if (kp < 5) return 'border-solar/30 bg-solar/10 text-solar';
  return 'border-rose/30 bg-rose/10 text-rose';
}

// Equatorward edge of the auroral oval (geomagnetic latitude) for a given Kp, NOAA rule of thumb
const auroraLatitude = (kp: number) => Math.round(66.5 - 2.05 * kp);

export function SpaceWeatherWidget() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root);
  const wind = usePolledJson<WindSpeed>(WIND_SPEED_URL, REFRESH_MS, visible);
  const mag = usePolledJson<MagField>(MAG_FIELD_URL, REFRESH_MS, visible);
  const flares = usePolledJson<Flares>(FLARE_URL, REFRESH_MS, visible);
  const kpSeries = usePolledJson<KpSeries>(KP_URL, REFRESH_MS, visible);

  const speed = wind.data?.[0]?.proton_speed ?? null;
  const bz = mag.data?.[0]?.bz_gsm ?? null;
  const flare = flares.data?.[0] ?? null;
  const kpEntry = kpSeries.data?.[kpSeries.data.length - 1] ?? null;
  const kp = kpEntry ? Number(kpEntry.Kp) : null;
  const offline = [wind, mag, flares, kpSeries].every((feed) => feed.error && !feed.data);

  return (
    <div ref={root} className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-5">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Güneş & uzay hava durumu
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">
            {offline ? 'NOAA SWPC · veri alınamadı' : 'NOAA SWPC · DSCOVR ve GOES uydu verisi'}
          </p>
        </div>
        <span className={`shrink-0 border px-2.5 py-1 text-sm font-medium ${kpColor(kp)}`}>
          {kp === null ? (
            'Kp —'
          ) : (
            <>
              Kp <span className="font-mono tabular-nums">{kp.toFixed(1)}</span> · {kpStatus(kp)}
            </>
          )}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line">
        <div className="min-w-0 bg-ink-2 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <Wind size={14} className="shrink-0 text-solar" aria-hidden /> Güneş rüzgârı
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-paper">
            {speed ?? '—'} <span className="text-sm font-normal text-paper/70">km/s</span>
          </div>
          <div className="mt-1.5 text-sm leading-snug text-paper/80">{speed === null ? '—' : windNote(speed)}</div>
        </div>

        <div className="min-w-0 bg-ink-2 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <Magnet size={14} className="shrink-0 text-solar" aria-hidden /> Manyetik alan Bz
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-solar">
            {bz ?? '—'} <span className="text-sm font-normal text-paper/70">nT</span>
          </div>
          <div className="mt-1.5 text-sm leading-snug text-paper/80">
            {bz === null ? '—' : bz <= -5 ? 'Güneye dönük · fırtına tetikleyici' : 'Zayıf / kuzeye dönük · sakin'}
          </div>
        </div>

        <div className="min-w-0 bg-ink-2 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <AlertTriangle size={14} className="shrink-0 text-solar" aria-hidden /> X-ışını seviyesi
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-paper">{flare?.current_class ?? '—'}</div>
          <div className="mt-1.5 text-sm leading-snug text-paper/80">
            {flare?.max_class && flare.max_time
              ? `Son patlama ${flare.max_class} · ${clock.format(new Date(flare.max_time))}`
              : 'GOES X-ışını akısı'}
          </div>
        </div>

        <div className="min-w-0 bg-ink-2 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <ShieldCheck size={14} className="shrink-0 text-lime" aria-hidden /> Kutup ışığı (aurora)
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-lime">
            {kp === null ? '—' : `≥ ${auroraLatitude(kp)}° K`}
          </div>
          <div className="mt-1.5 text-sm leading-snug text-paper/80">
            {kp === null
              ? '—'
              : kp >= 8
                ? 'Aşırı fırtına · kuzey ufkunda nadir şans'
                : 'Geomanyetik enlem · Türkiye’den görünmez'}
          </div>
        </div>
      </div>
    </div>
  );
}
