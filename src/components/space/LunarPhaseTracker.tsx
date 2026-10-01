'use client';

import React, { useState, useMemo } from 'react';
import {
  LUNAR_PHASES,
  LunarPhaseInfo,
  calculateCurrentMoonPhase,
  calculateCurrentMoonSign,
  getMoonVoidOfCourseStatus
} from '@/data/lunarPhases';
import {
  MoonPhaseVectorGlyph,
  ZodiacGlyph,
  PlanetGlyph
} from '@/components/ui/CosmicGlyphs';
import { Ticks } from '@/components/motion/primitives';
import { ShieldAlert, Compass, Sparkles, Moon, Clock, HeartHandshake } from 'lucide-react';

export function LunarPhaseTracker() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('full-moon');
  const [activeTab, setActiveTab] = useState<'cycle' | 'rituals' | 'void'>('cycle');

  // Real-time lunar calculations
  const now = useMemo(() => new Date(), []);
  const currentCalc = useMemo(() => calculateCurrentMoonPhase(now), [now]);
  const currentSign = useMemo(() => calculateCurrentMoonSign(now), [now]);
  const voidStatus = useMemo(() => getMoonVoidOfCourseStatus(now), [now]);

  // Selected phase detail
  const selectedPhase: LunarPhaseInfo = useMemo(() => {
    return LUNAR_PHASES.find((p) => p.id === selectedPhaseId) || currentCalc.phase;
  }, [selectedPhaseId, currentCalc.phase]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-10">
      <Ticks />

      {/* Header telemetry badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="label text-gold">CANLI AY TAKVİMİ & KOZMİK EFEMERİS</span>
          </div>
          <h3 className="display display-tight text-3xl sm:text-4xl text-paper mt-1">
            Ay Evreleri & Boşluktaki Ay (VoC) Rehberi
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="label text-muted text-[10px]">GÜNCEL AY BURCU</div>
            <div className="text-sm font-semibold text-paper flex items-center justify-end gap-1.5 mt-0.5">
              <ZodiacGlyph sign={currentSign.latinSign.toLowerCase()} size={15} className="text-gold" />
              <span>Ay {currentSign.sign}&apos;da</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Interactive Readout Cards */}
      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        {/* Card 1: Live Phase Geometry */}
        <div className="bg-ink-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="label text-gold">ANLIK GÖK AYDINLANMASI</span>
            <span className="label px-2 py-0.5 border border-line bg-ink text-paper/80 text-[10px]">
              {currentCalc.isWaxing ? 'Büyüyen Ay (Waxing)' : 'Küçülen Ay (Waning)'}
            </span>
          </div>

          <div className="my-6 flex items-center gap-6">
            <div className="relative grid place-items-center h-20 w-20 shrink-0 border border-line bg-ink rounded-full shadow-[0_0_25px_rgba(255,215,0,0.1)]">
              <MoonPhaseVectorGlyph phaseId={currentCalc.phase.id} size={54} className="text-gold" />
            </div>
            <div>
              <div className="serif-i text-xl text-gold">{currentCalc.phase.name}</div>
              <div className="display display-tight text-3xl text-paper mt-0.5">%{currentCalc.illuminationPercent}</div>
              <div className="label text-muted text-[10px] mt-1">
                Ay Yaşı: {currentCalc.ageDays} gün · Açı: {currentCalc.angleDeg}°
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11px] font-mono">
            <div>
              <span className="text-muted block text-[9px] uppercase">Sonraki Dolunay</span>
              <span className="text-paper">{currentCalc.nextFullMoonDays} gün sonra</span>
            </div>
            <div>
              <span className="text-muted block text-[9px] uppercase">Sonraki Yeni Ay</span>
              <span className="text-paper">{currentCalc.nextNewMoonDays} gün sonra</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Zodiac Atmosphere */}
        <div className="bg-ink-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="label text-gold">AY BURÇ ATMOSFERİ</span>
            <span className="label text-muted text-[10px]">{currentSign.element} Elementi</span>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex items-center gap-2">
              <ZodiacGlyph sign={currentSign.latinSign.toLowerCase()} size={28} className="text-gold" />
              <div>
                <div className="text-lg font-bold text-paper">Ay {currentSign.sign} Burcunda</div>
                <div className="label text-muted text-[10px]">Yönetici: {currentSign.governingPlanet}</div>
              </div>
            </div>
            <p className="text-xs text-paper/75 leading-relaxed line-clamp-3">
              {currentSign.emotionalClimate}
            </p>
          </div>

          <div className="border-t border-line pt-3 space-y-1">
            <div className="text-[11px] text-paper/85">
              <span className="text-gold font-semibold">Beslenme & Beden:</span> {currentSign.nourishmentTip}
            </div>
          </div>
        </div>

        {/* Card 3: Moon Void of Course Live Detector */}
        <div className={`p-6 flex flex-col justify-between border-l border-line ${voidStatus.isVoidNow ? 'bg-rose-signal/10' : 'bg-ink-2'}`}>
          <div className="flex items-center justify-between">
            <span className="label text-gold">BOŞLUKTAKİ AY (VOID OF COURSE)</span>
            <span className={`label px-2 py-0.5 border text-[10px] ${voidStatus.isVoidNow ? 'border-rose-signal bg-rose-signal text-ink font-bold' : 'border-line bg-ink text-lime'}`}>
              {voidStatus.isVoidNow ? 'BOŞLUKTA' : 'DURGUN & AKIŞTA'}
            </span>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex items-center gap-2 text-paper">
              <ShieldAlert size={20} className={voidStatus.isVoidNow ? 'text-rose-signal' : 'text-gold'} />
              <span className="text-sm font-semibold">{voidStatus.statusText}</span>
            </div>
            <p className="text-xs text-paper/80 leading-relaxed">
              {voidStatus.advice}
            </p>
          </div>

          <div className="border-t border-line pt-3 flex items-center justify-between text-[11px] font-mono text-muted">
            <span>{voidStatus.nextVoidStart}</span>
            <span className="text-paper">{voidStatus.nextVoidEnd}</span>
          </div>
        </div>
      </div>

      {/* 8 Lunar Phases Navigation Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="label text-muted">8 KOZMİK AY EVRESİ ARŞİVİ</span>
          <span className="label text-gold text-[10px]">BİR EVRE SEÇİN VE REHBERİNİ OKUYUN</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px border border-line bg-line">
          {LUNAR_PHASES.map((p) => {
            const isSelected = selectedPhase.id === p.id;
            const isLive = currentCalc.phase.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPhaseId(p.id)}
                className={`relative p-4 flex flex-col items-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gold text-ink font-semibold'
                    : 'bg-ink-2 text-paper hover:bg-ink hover:text-gold'
                }`}
              >
                {isLive && (
                  <span className={`absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-ink' : 'bg-gold animate-ping'}`} />
                )}
                <div className="my-2">
                  <MoonPhaseVectorGlyph phaseId={p.id} size={34} className={isSelected ? 'text-ink' : 'text-gold'} />
                </div>
                <span className="text-xs leading-tight font-medium mt-1">{p.name}</span>
                <span className={`label text-[9px] mt-1 ${isSelected ? 'text-ink/80' : 'text-muted'}`}>{p.cycleDegree}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Moon Phase Detailed Dossier */}
      <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-4">
            <MoonPhaseVectorGlyph phaseId={selectedPhase.id} size={42} className="text-gold" />
            <div>
              <div className="display display-tight text-2xl sm:text-3xl text-paper">
                {selectedPhase.name} <span className="serif-i text-xl text-gold font-normal">({selectedPhase.latinName})</span>
              </div>
              <div className="label text-muted text-xs mt-0.5">
                Kozmik Açı: {selectedPhase.cycleDegree} · Aydınlanma Aralığı: {selectedPhase.illuminationRange} · Element: {selectedPhase.alchemyElement}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'cycle', label: 'Ezoterik Anlam' },
              { id: 'rituals', label: 'Ritüeller & Niyet' },
              { id: 'void', label: 'Kaçınılması Gerekenler' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`label px-3 py-1.5 rounded-full border transition-colors cursor-pointer text-xs ${
                  activeTab === t.id
                    ? 'border-gold bg-gold text-ink font-bold'
                    : 'border-line text-paper/70 hover:text-paper hover:border-paper'
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
            <div className="space-y-3">
              <span className="label text-gold">SEMBOLİK & RUHSAL MANASI</span>
              <p className="text-sm leading-relaxed text-paper/85">
                {selectedPhase.symbolicMeaning}
              </p>
            </div>
            <div className="space-y-3">
              <span className="label text-gold">BİLİNÇLİ ODAK NOKTASI</span>
              <p className="text-sm leading-relaxed text-paper/85">
                {selectedPhase.consciousFocus}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Rituals & Intentions */}
        {activeTab === 'rituals' && (
          <div className="space-y-4">
            <span className="label text-gold">ÖNERİLEN KOZMİK RİTÜELLER</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {selectedPhase.recommendedRituals.map((r, i) => (
                <div key={i} className="border border-line bg-ink p-4 space-y-2">
                  <div className="label text-gold text-[10px]">RİTÜEL {String(i + 1).padStart(2, '0')}</div>
                  <p className="text-xs text-paper/85 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Things to Avoid */}
        {activeTab === 'void' && (
          <div className="space-y-4">
            <span className="label text-rose-signal">BU EVREDE KAÇINILMASI GEREKENLER</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {selectedPhase.thingsToAvoid.map((avoid, idx) => (
                <div key={idx} className="border border-rose-signal/30 bg-rose-signal/5 p-4 space-y-2">
                  <div className="label text-rose-signal text-[10px]">UYARI {String(idx + 1).padStart(2, '0')}</div>
                  <p className="text-xs text-paper/85 leading-relaxed">{avoid}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sacred Affirmation Bar */}
        <div className="border-l-2 border-gold pl-4 py-2 bg-ink/50 mt-4">
          <div className="label text-gold text-[10px]">GÜNÜN KOZMİK OLUMLAMASI</div>
          <div className="serif-i text-lg text-paper mt-1">“{selectedPhase.affirmation}”</div>
        </div>
      </div>
    </div>
  );
}
