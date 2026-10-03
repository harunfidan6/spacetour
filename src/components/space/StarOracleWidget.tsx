'use client';

import React, { useState } from 'react';
import { useNow } from '@/lib/useNow';
import {
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import {
  PlanetGlyph,
  GalaxySpiralGlyph
} from '@/components/ui/CosmicGlyphs';
import {
  FIXED_STARS_CATALOG,
  getCurrentPlanetaryHour,
  type FixedStar,
  type PlanetaryHour
} from '@/data/fixedStars';

export function StarOracleWidget() {
  const [selectedStar, setSelectedStar] = useState<FixedStar>(FIXED_STARS_CATALOG[0]);
  // Clock-driven values are only known after mount; the page itself is prerendered
  const now = useNow(60_000);
  const planetaryHour: PlanetaryHour | null = now ? getCurrentPlanetaryHour(now) : null;
  const [pickedHour, setSelectedTimelineHour] = useState<number | null>(null);
  const currentHour = now ? now.getHours() : null;
  const selectedTimelineHour = pickedHour ?? currentHour ?? 12;
  const [isOracleSpinning, setIsOracleSpinning] = useState(false);

  // Compute Chaldean planet for a given hour today
  const getHourRuler = (targetHour: number) => {
    const d = now ? new Date(now) : new Date(2026, 0, 1);
    d.setHours(targetHour, 0, 0, 0);
    return getCurrentPlanetaryHour(d);
  };

  // Draw random fixed star oracle
  const drawStarOracle = () => {
    setIsOracleSpinning(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * FIXED_STARS_CATALOG.length);
      setSelectedStar(FIXED_STARS_CATALOG[randomIdx]);
      setIsOracleSpinning(false);
    }, 500);
  };

  const activeTimelineHourInfo = getHourRuler(selectedTimelineHour);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8" id="yildiz-fali">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-solar">
            <GalaxySpiralGlyph size={16} />
            <span>KELDANİ GEZEGEN SAATLERİ & 4 KRALİYET YILDIZI KEHANETİ</span>
          </div>
          <h3 className="display display-tight text-3xl sm:text-4xl text-paper mt-2">
            Yıldız Falı & Kozmik Saatler
          </h3>
          <p className="text-sm text-paper/70 mt-1 max-w-2xl leading-relaxed">
            Antik Babil astronomisine dayanan saatlik gezegen ritimleri ve gökyüzünü yöneten kadim sabit yıldızların kehanet rehberliği.
          </p>
        </div>

        {/* Oracle Draw Action */}
        <button
          onClick={drawStarOracle}
          disabled={isOracleSpinning}
          className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border border-solar text-solar hover:bg-solar hover:text-ink transition-colors cursor-pointer shrink-0 shadow-xs disabled:opacity-50"
        >
          <Sparkles size={14} className={isOracleSpinning ? 'animate-spin' : ''} />
          <span>{isOracleSpinning ? 'Yıldızlar Hesaplanıyor…' : 'Günün Yıldız Kehanetini Çek'}</span>
        </button>
      </div>

      {/* Section 1: Live Planetary Hours Module */}
      <div className="border border-line bg-ink-2 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-solar" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper">
              CANLI GEZEGEN SAATİ (PLANETARY HOUR)
            </span>
            <span className="h-2 w-2 rounded-full bg-lime animate-ping" />
          </div>
          <div className="font-mono text-xs text-muted">
            Aktif Zaman Dilimi: <strong className="text-paper">{now ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '—'}</strong>
          </div>
        </div>

        {planetaryHour && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Active Hour Badge */}
            <div className="lg:col-span-4 p-5 border border-line bg-ink flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-line bg-ink-2 flex items-center justify-center p-3 mb-3 shadow-inner">
                <PlanetGlyph planet={planetaryHour.rulerId} size={36} className="text-solar" />
              </div>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                ŞU ANKİ HÜKÜMRAN GEZEGEN
              </span>
              <h4 className="font-mono text-xl font-bold text-paper mt-1">
                {planetaryHour.ruler}
              </h4>
              <p className="font-mono text-xs text-solar font-semibold mt-1">
                {planetaryHour.title}
              </p>
            </div>

            {/* Right: Favorability Recommendations */}
            <div className="lg:col-span-8 space-y-3 font-mono text-xs">
              <p className="text-paper/85 leading-relaxed bg-ink p-3.5 border border-line">
                <strong className="text-solar uppercase block text-[10px] mb-1">Kozmik Tema:</strong>
                {planetaryHour.theme}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 border border-lime/30 bg-lime/5 space-y-2">
                  <span className="text-lime font-bold uppercase flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 size={13} />
                    Şu Anda Ne Yapmak Uğurlu?
                  </span>
                  <ul className="space-y-1 text-muted text-[11px]">
                    {planetaryHour.favorableFor.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-paper/80">
                        <span className="text-lime">✔</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 border border-rose/30 bg-rose/5 space-y-2">
                  <span className="text-rose font-bold uppercase flex items-center gap-1.5 text-[11px]">
                    <XCircle size={13} />
                    Nelerden Kaçınmalı?
                  </span>
                  <ul className="space-y-1 text-muted text-[11px]">
                    {planetaryHour.unfavorableFor.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-paper/80">
                        <span className="text-rose">✖</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 24-Hour Interactive Timeline Dial */}
        <div className="pt-4 border-t border-line/70 space-y-2 font-mono">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>24 SAATLİK GÜN ÇİZELGESİ (Tıklayarak Saati İnceleyin):</span>
            <span className="text-paper">Seçili Saat: {selectedTimelineHour}:00 ({activeTimelineHourInfo.ruler})</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-24 gap-1">
            {Array.from({ length: 24 }).map((_, h) => {
              const info = getHourRuler(h);
              const isCurrent = h === currentHour;
              const isSelected = h === selectedTimelineHour;

              return (
                <button
                  key={h}
                  onClick={() => setSelectedTimelineHour(h)}
                  className={`p-1 text-center border transition-all cursor-pointer text-[10px] flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-solar bg-solar text-ink font-bold scale-105 z-10'
                      : isCurrent
                      ? 'border-lime bg-lime/20 text-lime font-bold'
                      : 'border-line bg-ink text-muted hover:border-paper hover:text-paper'
                  }`}
                  title={`${h}:00 - ${info.ruler}`}
                >
                  <span className="text-[9px] block opacity-75">{h}h</span>
                  <PlanetGlyph planet={info.rulerId} size={13} className="my-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Fixed Stars & Royal Stars Oracle */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-gold" />
            <h4 className="font-mono text-base font-bold text-paper uppercase tracking-wider">
              SABİT YILDIZLAR VE KRALİYET MUHAFIZLARI KATALOĞU
            </h4>
          </div>
          <span className="font-mono text-xs text-muted">
            8 Baş Kerteriz Yıldızı
          </span>
        </div>

        {/* Star Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {FIXED_STARS_CATALOG.map((star) => {
            const isSelected = selectedStar.id === star.id;
            return (
              <button
                key={star.id}
                onClick={() => setSelectedStar(star)}
                className={`p-2.5 border text-left font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'border-solar bg-solar text-ink font-bold shadow-md'
                    : 'border-line bg-ink-2 text-muted hover:border-paper hover:text-paper'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] uppercase tracking-widest opacity-80">
                    {star.royalStar ? `${star.royalStar}` : 'YILDIZ'}
                  </span>
                  <span className="text-[9px]">{star.magnitude}m</span>
                </div>
                <div className="text-xs font-bold truncate">{star.name}</div>
                <div className="text-[10px] opacity-75 truncate">{star.constellation}</div>
              </button>
            );
          })}
        </div>

        {/* Active Fixed Star Showcase Card */}
        <div className="border border-solar/40 bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {selectedStar.royalStar && (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-gold/50 bg-gold/10 text-gold uppercase tracking-widest">
                    4 KRALİYET YILDIZI · {selectedStar.royalStar.toUpperCase()}
                  </span>
                )}
                <span className="font-mono text-xs text-muted">
                  Doğa: {selectedStar.nature} · Boylam: {selectedStar.eclipticLongitude}
                </span>
              </div>
              <h4 className="display text-3xl sm:text-4xl text-paper">
                {selectedStar.name} <span className="serif-i text-xl sm:text-2xl text-gold">({selectedStar.arabicName})</span>
              </h4>
              <p className="font-mono text-xs text-solar font-semibold mt-1">
                {selectedStar.title}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-ink p-3 border border-line font-mono text-xs shrink-0">
              <div className="text-right">
                <span className="text-muted block text-[10px] uppercase">Rezonans Skoru</span>
                <span className="font-bold text-lime text-base">%{selectedStar.resonanceScore}</span>
              </div>
              <div className="h-8 w-px bg-line" />
              <div>
                <span className="text-muted block text-[10px] uppercase">Takımyıldız</span>
                <span className="font-bold text-paper">{selectedStar.constellation}</span>
              </div>
            </div>
          </div>

          {/* Deep Interpretation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Left: Oracle Message & Gift */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 border border-line bg-ink space-y-2">
                <span className="text-solar uppercase font-bold text-[10px] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Günün Yıldız Mesajı & Kehaneti
                </span>
                <p className="text-paper/90 text-sm leading-relaxed italic font-serif">
                  &quot;{selectedStar.guidance.oracleMessage}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 border border-line bg-ink space-y-1.5">
                  <span className="text-lime uppercase font-bold text-[10px] block">İlahi Hediye & Kudret</span>
                  <p className="text-paper/80 leading-relaxed text-[11px]">
                    {selectedStar.guidance.gift}
                  </p>
                </div>

                <div className="p-3.5 border border-line bg-ink space-y-1.5">
                  <span className="text-rose uppercase font-bold text-[10px] flex items-center gap-1">
                    <ShieldAlert size={12} />
                    Kozmik Sınav & Uyarı
                  </span>
                  <p className="text-paper/80 leading-relaxed text-[11px]">
                    {selectedStar.guidance.test}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Practical Action & Favorable Fields */}
            <div className="lg:col-span-4 border border-line bg-ink p-5 space-y-4">
              <span className="text-[10px] text-muted uppercase tracking-widest block border-b border-line pb-2">
                UYGULAMALI REHBERLİK
              </span>

              <div className="space-y-3">
                <div>
                  <span className="text-muted block text-[10px] uppercase">Eylem Tavsiyesi:</span>
                  <p className="text-paper/85 text-xs leading-relaxed mt-1">
                    {selectedStar.guidance.actionAdvice}
                  </p>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-muted block text-[10px] uppercase mb-1.5">Desteklenen Eylemler:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStar.favorableActivities.map((act) => (
                      <span key={act} className="px-2 py-0.5 bg-ink-2 border border-line text-solar text-[10px]">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
