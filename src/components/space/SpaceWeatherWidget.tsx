'use client';

import React, { useRef } from 'react';
import { Sun, Wind, AlertTriangle, ShieldCheck, Magnet } from 'lucide-react';
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
  if (kp >= 5) return `G${Math.min(5, Math.floor(kp) - 4)} JEOMANYETİK FIRTINA`;
  if (kp >= 4) return 'JEOMANYETİK AKTİF';
  return 'JEOMANYETİK SAKİN';
}

function kpColor(kp: number | null): string {
  if (kp === null) return 'border-line text-muted';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-solar animate-spin" style={{ animationDuration: '15s' }} />
          <div>
            <h3 className="display display-tight text-xl text-paper sm:text-2xl">
              Güneş & Uzay Hava Durumu
            </h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              {offline ? 'NOAA SWPC · VERİ ALINAMADI' : 'NOAA SWPC · DSCOVR & GOES UYDU VERİSİ'}
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-mono border font-bold uppercase tracking-wider ${kpColor(kp)}`}>
          {kp === null ? 'KP —' : `KP ${kp.toFixed(1)} · ${kpStatus(kp)}`}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-ink-2 p-4 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <Wind size={12} className="text-solar" /> GÜNEŞ RÜZGARI
          </div>
          <div className="text-xl font-bold text-paper">
            {speed ?? '—'} <span className="text-[10px] font-normal text-muted">km/s</span>
          </div>
          <div className="text-[10px] text-muted mt-1">{speed === null ? '—' : windNote(speed)}</div>
        </div>

        <div className="bg-ink-2 p-4 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <Magnet size={12} className="text-solar" /> MANYETİK ALAN Bz
          </div>
          <div className="text-xl font-bold text-solar">
            {bz ?? '—'} <span className="text-[10px] font-normal text-muted">nT</span>
          </div>
          <div className="text-[10px] text-muted mt-1">
            {bz === null ? '—' : bz <= -5 ? 'Güneye dönük · fırtına tetikleyici' : 'Zayıf / kuzeye dönük · sakin'}
          </div>
        </div>

        <div className="bg-ink-2 p-4 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <AlertTriangle size={12} className="text-solar" /> X-IŞINI SEVİYESİ
          </div>
          <div className="text-xl font-bold text-paper">{flare?.current_class ?? '—'}</div>
          <div className="text-[10px] text-muted mt-1 leading-snug">
            {flare?.max_class && flare.max_time
              ? `Son patlama ${flare.max_class} · ${clock.format(new Date(flare.max_time))}`
              : 'GOES X-ışını akısı'}
          </div>
        </div>

        <div className="bg-ink-2 p-4 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <ShieldCheck size={12} className="text-lime" /> KUTUP IŞIĞI (AURORA)
          </div>
          <div className="text-xl font-bold text-lime">{kp === null ? '—' : `≥ ${auroraLatitude(kp)}° K`}</div>
          <div className="text-[10px] text-muted mt-1 leading-snug">
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
