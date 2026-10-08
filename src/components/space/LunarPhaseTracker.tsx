'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LUNAR_PHASES,
  LunarPhaseInfo,
  calculateCurrentMoonPhase,
  calculateCurrentMoonSign,
  getMoonVoidOfCourseStatus
} from '@/data/lunarPhases';
import {
  MoonPhaseVectorGlyph,
  ZodiacGlyph
} from '@/components/ui/CosmicGlyphs';

import { useNow } from '@/lib/useNow';
import { SIGN_IN, SIGN_NAMES } from '@/lib/astrology/dailySky';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import { SignHouseInsight } from '@/components/astrology/SignHouseInsight';
import { ShieldAlert } from 'lucide-react';

// Placeholder instant for the prerendered frame; replaced by the real clock right after mount
const FIRST_FRAME = new Date('2026-01-01T09:00:00Z');

export function LunarPhaseTracker() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('full-moon');
  const railRef = useRevealOnChange(selectedPhaseId);
  const [activeTab, setActiveTab] = useState<'cycle' | 'rituals' | 'void'>('cycle');

  // Real-time lunar calculations
  // Live clock (null until mount, so server and client render the same frame first)
  const live = useNow(60_000);
  const isMounted = live !== null;
  const now = live ?? FIRST_FRAME;
  const currentCalc = useMemo(() => calculateCurrentMoonPhase(now), [now]);
  const currentSign = useMemo(() => calculateCurrentMoonSign(now), [now]);
  const voidStatus = useMemo(() => getMoonVoidOfCourseStatus(now), [now]);

  // Selected phase detail
  const selectedPhase: LunarPhaseInfo = useMemo(() => {
    return LUNAR_PHASES.find((p) => p.id === selectedPhaseId) || currentCalc.phase;
  }, [selectedPhaseId, currentCalc.phase]);

  return (
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık ve güncel Ay burcu */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <h3 className="min-w-0 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Ay evreleri ve boşluktaki Ay
        </h3>
        <div className="shrink-0">
          <div className="text-xs text-paper/70">Güncel Ay burcu</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-paper">
            <ZodiacGlyph sign={currentSign.latinSign.toLowerCase()} size={15} className="shrink-0 text-gold" />
            <span>{isMounted ? `Ay ${SIGN_IN[SIGN_NAMES.indexOf(currentSign.sign)] ?? currentSign.sign}` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Anlık durum: evre, Ay burcu, boşluktaki Ay */}
      <div className={`grid gap-px border border-line bg-line md:grid-cols-3 transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-70'}`}>
        {/* Şu anki evre */}
        <div className="flex flex-col justify-between gap-5 bg-ink-2 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-sm text-paper/70">Şu anki evre</span>
            <span className="text-sm text-paper/80">
              {isMounted ? (currentCalc.isWaxing ? 'Büyüyen Ay (Waxing)' : 'Küçülen Ay (Waning)') : '—'}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <MoonPhaseVectorGlyph phaseId={currentCalc.phase.id} size={54} className="shrink-0 text-gold" />
            <div className="min-w-0">
              <div className="text-lg font-semibold leading-snug text-paper">{isMounted ? currentCalc.phase.name : '—'}</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums text-gold">
                {isMounted ? `%${currentCalc.illuminationPercent}` : '—'}
                {isMounted && <span className="ml-1.5 text-sm font-normal text-paper/70">aydınlık</span>}
              </div>
              <div className="mt-1 text-sm tabular-nums text-paper/70">
                {isMounted ? `Ay yaşı: ${currentCalc.ageDays} gün · Açı: ${currentCalc.angleDeg}°` : 'Hesaplanıyor…'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
            <div>
              <span className="block text-xs text-paper/70">Sonraki dolunay</span>
              <span className="text-sm tabular-nums text-paper">{isMounted ? `${currentCalc.nextFullMoonDays} gün sonra` : '—'}</span>
            </div>
            <div>
              <span className="block text-xs text-paper/70">Sonraki yeni Ay</span>
              <span className="text-sm tabular-nums text-paper">{isMounted ? `${currentCalc.nextNewMoonDays} gün sonra` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Ay burcunun etkisi */}
        <div className="flex flex-col justify-between gap-5 bg-ink-2 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-sm text-paper/70">Ay burcunun etkisi</span>
            <span className="text-sm text-paper/80">{isMounted ? `${currentSign.element} elementi` : '—'}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZodiacGlyph sign={currentSign.latinSign.toLowerCase()} size={28} className="shrink-0 text-gold" />
              <div className="min-w-0">
                <div className="text-base font-semibold text-paper">{isMounted ? `Ay ${currentSign.sign} burcunda` : 'Ay burcu hesaplanıyor…'}</div>
                <div className="text-sm text-paper/70">{isMounted ? `Yönetici: ${currentSign.governingPlanet}` : '—'}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              {isMounted ? currentSign.emotionalClimate : 'Güncel gökyüzü konumları yerel saate göre işleniyor.'}
            </p>
          </div>

          <p className="border-t border-line pt-3 text-sm leading-relaxed text-paper/80">
            <span className="font-medium text-gold">Beslenme ve beden:</span> {isMounted ? currentSign.nourishmentTip : '—'}
          </p>
        </div>

        {/* Boşluktaki Ay (canlı) */}
        <div className={`flex flex-col justify-between gap-5 p-5 sm:p-6 ${isMounted && voidStatus.isVoidNow ? 'bg-rose-signal/10' : 'bg-ink-2'}`}>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="text-sm text-paper/70">Boşluktaki Ay (void of course)</span>
            <span className={`px-2 py-0.5 text-xs font-medium ${isMounted && voidStatus.isVoidNow ? 'bg-rose-signal text-ink' : 'border border-line text-lime'}`}>
              {isMounted ? (voidStatus.isVoidNow ? 'Boşlukta' : 'Akışta') : '—'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-paper">
              <ShieldAlert size={20} className={`mt-0.5 shrink-0 ${isMounted && voidStatus.isVoidNow ? 'text-rose-signal' : 'text-gold'}`} />
              <span className="text-base font-semibold leading-snug">{isMounted ? voidStatus.statusText : 'Hesaplanıyor…'}</span>
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              {isMounted ? voidStatus.advice : 'Açı tablosu hesaplanıyor.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line pt-3 text-sm tabular-nums">
            <span className="text-paper/70">{isMounted ? voidStatus.nextVoidStart : '—'}</span>
            <span className="text-paper">{isMounted ? voidStatus.nextVoidEnd : '—'}</span>
          </div>
        </div>
      </div>

      {/* What today's Moon sign means for the visitor's sign */}
      {isMounted && SIGN_NAMES.indexOf(currentSign.sign) >= 0 && (
        <SignHouseInsight
          heading="Ay'ın bugün sana etkisi"
          targetSign={SIGN_NAMES.indexOf(currentSign.sign)}
          subject="Ay"
          theme="duygusal ihtiyaçlarını, ruh hâlini ve günlük odağını"
        />
      )}

      {/* Sekiz evre seçici */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-base font-semibold text-paper">Sekiz Ay evresi</span>
          <span className="text-sm text-paper/70">Ayrıntılar için bir evre seçin</span>
        </div>

        <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px border border-line bg-line" style={{ '--rail-w': '36%' } as React.CSSProperties}>
          {LUNAR_PHASES.map((p) => {
            const isSelected = selectedPhase.id === p.id;
            const isLive = currentCalc.phase.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPhaseId(p.id)}
                className={`relative flex min-w-0 cursor-pointer flex-col items-center px-2 py-3 text-center transition-colors ${
                  isSelected
                    ? 'bg-gold text-ink'
                    : 'bg-ink-2 text-paper hover:bg-ink hover:text-gold'
                }`}
              >
                {isLive && (
                  <>
                    <span aria-hidden="true" className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-ink' : 'bg-gold'}`} />
                    <span className="sr-only">(şu anki evre)</span>
                  </>
                )}
                <div className="my-1.5">
                  <MoonPhaseVectorGlyph phaseId={p.id} size={34} className={isSelected ? 'text-ink' : 'text-gold'} />
                </div>
                <span className="mt-1 text-[13px] font-medium leading-snug sm:text-sm lg:text-xs">{p.name}</span>
                <span className={`mt-1 font-mono text-xs tabular-nums ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>{p.cycleDegree}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seçili evrenin ayrıntısı */}
      <div className="space-y-6 border border-line bg-ink-2 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <div className="flex min-w-0 items-center gap-4">
            <MoonPhaseVectorGlyph phaseId={selectedPhase.id} size={42} className="shrink-0 text-gold" />
            <div className="min-w-0">
              <div className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                {selectedPhase.name}{' '}
                <span className="text-base font-normal italic text-paper/70">({selectedPhase.latinName})</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-paper/70">
                <span className="whitespace-nowrap">Açı: {selectedPhase.cycleDegree}</span>
                <span className="whitespace-nowrap">Aydınlanma: {selectedPhase.illuminationRange}</span>
                <span className="whitespace-nowrap">Element: {selectedPhase.alchemyElement}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'cycle', label: 'Anlamı' },
              { id: 'rituals', label: 'Ritüel ve niyet' },
              { id: 'void', label: 'Kaçınılacaklar' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={activeTab === t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm transition-colors ${
                  activeTab === t.id
                    ? 'border-gold bg-gold font-medium text-ink'
                    : 'border-line text-paper/80 hover:border-paper hover:text-paper'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Cycle Meaning */}
        {activeTab === 'cycle' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-paper/70">Sembolik ve ruhsal anlamı</div>
              <p className="text-base leading-relaxed text-paper/85">
                {selectedPhase.symbolicMeaning}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-paper/70">Bilinçli odak</div>
              <p className="text-base leading-relaxed text-paper/85">
                {selectedPhase.consciousFocus}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Rituals & Intentions */}
        {activeTab === 'rituals' && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-paper/70">Önerilen ritüeller</div>
            <ol className="list-decimal space-y-3 pl-5 marker:text-gold">
              {selectedPhase.recommendedRituals.map((r, i) => (
                <li key={i} className="pl-1 text-base leading-relaxed text-paper/85">{r}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Tab 3: Things to Avoid */}
        {activeTab === 'void' && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-rose-signal">Bu evrede kaçınılması gerekenler</div>
            <ul className="list-disc space-y-3 pl-5 marker:text-rose-signal">
              {selectedPhase.thingsToAvoid.map((avoid, idx) => (
                <li key={idx} className="pl-1 text-base leading-relaxed text-paper/85">{avoid}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Olumlama */}
        <div className="border-l-2 border-gold py-1 pl-4">
          <div className="text-sm text-paper/70">Olumlama</div>
          <div className="serif-i mt-1 text-lg leading-snug text-paper">“{selectedPhase.affirmation}”</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/astroloji/ay-bugun" className="inline-flex min-h-10 items-center border border-line px-3 py-2 text-sm text-paper/80 hover:border-gold hover:text-gold">Ay bugün hangi burçta? →</Link>
        <Link href="/takvim" className="inline-flex min-h-10 items-center border border-line px-3 py-2 text-sm text-paper/80 hover:border-gold hover:text-gold">Dolunay ve yeni Ay tarihleri →</Link>
      </div>
    </div>
  );
}
