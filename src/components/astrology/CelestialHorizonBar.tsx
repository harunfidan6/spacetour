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
      className={`border-y border-gold/20 bg-ink-2/95 backdrop-blur-md ${
        compact ? 'py-3 px-[var(--gutter)]' : 'py-5 px-[var(--gutter)]'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 pb-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold shadow-[0_0_10px_rgba(245,197,66,0.2)]">
              <Compass size={13} />
            </span>
            <div>
              <span className="doc-kicker text-gold text-[10px]">CANLI GÖKSEL UFUK SAATİ</span>
              <span className="doc-caption block text-[10px] text-paper/60">İstanbul Efemerisi · UTC+3</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-xs text-paper/80 font-bold">
              {isMounted ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '09:00'}
            </span>
          </div>
        </div>

        {/* 4 Ephemeris Reading Slates */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 text-xs font-mono">
          {/* 1. Sun Sign & Exact Degree */}
          <div className="border border-gold/20 bg-ink/80 p-2.5 sm:p-3 relative overflow-hidden group hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between text-muted text-[10px]">
              <span className="uppercase">GÜNEŞ KONUMU</span>
              <Sun size={12} className="text-solar" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-paper">
              <ZodiacGlyph
                sign={SIGN_IDS[currentSunSignIndex] || 'terazi'}
                size={18}
                className="text-gold shrink-0"
              />
              <span className="font-bold text-sm sm:text-base text-paper truncate">
                {SIGN_NAMES[currentSunSignIndex] || 'Güneş'}
              </span>
            </div>
            <span className="doc-caption block text-[10px] text-gold mt-0.5">
              {currentSunDegree}° {SIGN_IN[currentSunSignIndex] || ''}
            </span>
          </div>

          {/* 2. Moon Phase & Sign */}
          <div className="border border-gold/20 bg-ink/80 p-2.5 sm:p-3 relative overflow-hidden group hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between text-muted text-[10px]">
              <span className="uppercase">AY VE EVRE</span>
              <MoonPhaseVectorGlyph phaseId={currentCalc.phase.id} size={14} className="text-paper/80" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-paper">
              <ZodiacGlyph
                sign={SIGN_IDS[currentMoonSignIndex] || 'yengec'}
                size={18}
                className="text-sky-300 shrink-0"
              />
              <span className="font-bold text-sm sm:text-base text-paper truncate">
                {currentMoonSign.sign}
              </span>
            </div>
            <span className="doc-caption block text-[10px] text-paper/70 mt-0.5 truncate">
              {currentCalc.phase.name} · %{currentCalc.illuminationPercent}
            </span>
          </div>

          {/* 3. Chaldean Planetary Hour */}
          <div className="border border-gold/20 bg-ink/80 p-2.5 sm:p-3 relative overflow-hidden group hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between text-muted text-[10px]">
              <span className="uppercase">GEZEGEN SAATİ</span>
              <Clock size={12} className="text-violet" />
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-paper">
              <PlanetGlyph planet={currentHourSlot.ruler} size={16} className="text-violet shrink-0" />
              <span className="font-bold text-sm sm:text-base text-paper truncate">
                {BODY_NAMES[currentHourSlot.ruler] || currentHourSlot.ruler}
              </span>
            </div>
            <span className="doc-caption block text-[10px] text-paper/70 mt-0.5">
              {currentHourSlot.isDay ? 'Gündüz Saati' : 'Gece Saati'} · Keldani
            </span>
          </div>

          {/* 4. Moon Void-of-Course Detector */}
          <div className="border border-gold/20 bg-ink/80 p-2.5 sm:p-3 relative overflow-hidden group hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between text-muted text-[10px]">
              <span className="uppercase">BOŞLUKTAKİ AY (VoC)</span>
              <ShieldAlert
                size={12}
                className={voidStatus.isVoidNow ? 'text-solar animate-pulse' : 'text-lime'}
              />
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  voidStatus.isVoidNow ? 'bg-solar animate-ping' : 'bg-lime'
                }`}
              />
              <span
                className={`font-bold text-sm sm:text-base truncate ${
                  voidStatus.isVoidNow ? 'text-solar' : 'text-lime'
                }`}
              >
                {voidStatus.isVoidNow ? 'Boşlukta (VoC)' : 'Dengeli / Aktif'}
              </span>
            </div>
            <span className="doc-caption block text-[10px] text-paper/70 mt-0.5 truncate">
              {voidStatus.isVoidNow ? 'Yeni adım atılmamalı' : 'Rutine & eyleme uygun'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
