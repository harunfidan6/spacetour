'use client';

import React, { useMemo } from 'react';
import { Compass, Sun, Clock, ShieldAlert } from 'lucide-react';
import {
  ZodiacGlyph,
  PlanetGlyph,
  MoonPhaseVectorGlyph
} from '@/components/ui/CosmicGlyphs';
import { useNow } from '@/lib/useNow';
import {
  calculateCurrentMoonPhase,
  calculateCurrentMoonSign,
  getMoonVoidOfCourseStatus
} from '@/data/lunarPhases';
import {
  planetaryHourAt,
  sunSign,
  moonSign,
  longitude,
  SIGN_IDS,
  SIGN_NAMES,
  SIGN_IN,
  BODY_NAMES
} from '@/lib/astrology/dailySky';

const FIRST_FRAME = new Date('2026-01-01T09:00:00Z');

export function CelestialHorizonBar({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  const live = useNow(60_000);
  const isMounted = live !== null;
  const now = live ?? FIRST_FRAME;

  const currentCalc = useMemo(() => calculateCurrentMoonPhase(now), [now]);
  const currentMoonSignIndex = useMemo(() => moonSign(now), [now]);
  const currentMoonSign = useMemo(() => calculateCurrentMoonSign(now), [now]);
  const voidStatus = useMemo(() => getMoonVoidOfCourseStatus(now), [now]);
  const currentSunSignIndex = useMemo(() => sunSign(now), [now]);
  const currentSunDegree = useMemo(() => Math.floor(longitude('sun', now) % 30), [now]);
  const currentHourSlot = useMemo(() => planetaryHourAt(now), [now]);

  return (
    <div
      aria-label="Anlık Göksel Ufuk Saati"
      className={`border-y border-gold/15 bg-ink-2 ${
        compact ? 'py-4 px-[var(--gutter)]' : 'py-6 px-[var(--gutter)]'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Compass size={16} className="shrink-0 text-gold" />
            <div>
              <span className="block text-sm font-semibold text-paper">Canlı göksel ufuk saati</span>
              <span className="block text-[13px] text-paper/70">İstanbul Efemerisi · UTC+3</span>
            </div>
          </div>
          {/* Canlı veri göstergesi: tek nabız noktası (diğer döngülü animasyonlar kaldırıldı) */}
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-sm tabular-nums text-paper/85">
              {isMounted ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '09:00'}
            </span>
          </div>
        </div>

        {/* 4 Ephemeris Reading Slates */}
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
          {/* 1. Sun Sign & Exact Degree */}
          <div className="min-w-0 bg-ink p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 text-xs leading-snug text-paper/70">
              <span>Güneş konumu</span>
              <Sun size={13} className="shrink-0 text-solar" />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-paper">
              <ZodiacGlyph
                sign={SIGN_IDS[currentSunSignIndex] || 'terazi'}
                size={18}
                className="text-gold shrink-0"
              />
              <span className="truncate text-base font-semibold text-paper">
                {SIGN_NAMES[currentSunSignIndex] || 'Güneş'}
              </span>
            </div>
            <span className="mt-0.5 block text-[13px] leading-snug text-paper/70">
              {currentSunDegree}° {SIGN_IN[currentSunSignIndex] || ''}
            </span>
          </div>

          {/* 2. Moon Phase & Sign */}
          <div className="min-w-0 bg-ink p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 text-xs leading-snug text-paper/70">
              <span>Ay ve evre</span>
              <MoonPhaseVectorGlyph phaseId={currentCalc.phase.id} size={14} className="shrink-0 text-paper/80" />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-paper">
              <ZodiacGlyph
                sign={SIGN_IDS[currentMoonSignIndex] || 'yengec'}
                size={18}
                className="text-sky-300 shrink-0"
              />
              <span className="truncate text-base font-semibold text-paper">
                {currentMoonSign.sign}
              </span>
            </div>
            <span className="mt-0.5 block text-[13px] leading-snug text-paper/70">
              {currentCalc.phase.name} · %{currentCalc.illuminationPercent}
            </span>
          </div>

          {/* 3. Chaldean Planetary Hour */}
          <div className="min-w-0 bg-ink p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 text-xs leading-snug text-paper/70">
              <span>Gezegen saati</span>
              <Clock size={13} className="shrink-0 text-violet" />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-paper">
              <PlanetGlyph planet={currentHourSlot.ruler} size={16} className="text-violet shrink-0" />
              <span className="truncate text-base font-semibold text-paper">
                {BODY_NAMES[currentHourSlot.ruler] || currentHourSlot.ruler}
              </span>
            </div>
            <span className="mt-0.5 block text-[13px] leading-snug text-paper/70">
              {currentHourSlot.isDay ? 'Gündüz Saati' : 'Gece Saati'} · Keldani
            </span>
          </div>

          {/* 4. Moon Void-of-Course Detector (durum rozeti; döngülü animasyon yok) */}
          <div className="min-w-0 bg-ink p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 text-xs leading-snug text-paper/70">
              <span>Boşluktaki Ay (VoC)</span>
              <ShieldAlert
                size={13}
                className={`shrink-0 ${voidStatus.isVoidNow ? 'text-solar' : 'text-lime'}`}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                  voidStatus.isVoidNow ? 'bg-solar' : 'bg-lime'
                }`}
              />
              <span
                className={`truncate text-base font-semibold ${
                  voidStatus.isVoidNow ? 'text-solar' : 'text-lime'
                }`}
              >
                {voidStatus.isVoidNow ? 'Boşlukta (VoC)' : 'Dengeli / Aktif'}
              </span>
            </div>
            <span className="mt-0.5 block text-[13px] leading-snug text-paper/70">
              {voidStatus.isVoidNow ? 'Yeni adım atılmamalı' : 'Rutine & eyleme uygun'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
