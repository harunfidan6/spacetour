'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Flame, Brain } from 'lucide-react';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { signCompatibility } from '@/lib/astrology/compatibility';
import { Ticks } from '@/components/motion/primitives';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';

const RING = 2 * Math.PI * 88;

const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Ateş: { text: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/40', glow: 'shadow-[0_0_25px_rgba(245,197,66,0.2)]' },
  Toprak: { text: 'text-lime', bg: 'bg-lime/10', border: 'border-lime/40', glow: 'shadow-[0_0_25px_rgba(132,204,22,0.2)]' },
  Hava: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40', glow: 'shadow-[0_0_25px_rgba(0,212,255,0.2)]' },
  Su: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/40', glow: 'shadow-[0_0_25px_rgba(96,165,250,0.2)]' },
};

export function ZodiacCompatibility() {
  const [signA, setSignA] = useState('koc');
  const [signB, setSignB] = useState('aslan');

  const a = ZODIAC_SIGNS.find((s) => s.id === signA) ?? ZODIAC_SIGNS[0];
  const b = ZODIAC_SIGNS.find((s) => s.id === signB) ?? ZODIAC_SIGNS[4];
  const result = signCompatibility(a, b);
  const score = result.score;

  const styleA = ELEMENT_COLORS[a.element] || ELEMENT_COLORS.Ateş;
  const styleB = ELEMENT_COLORS[b.element] || ELEMENT_COLORS.Ateş;

  // Elemental sub-metrics
  const isSameElement = a.element === b.element;
  const isComplementary =
    (a.element === 'Ateş' && b.element === 'Hava') ||
    (a.element === 'Hava' && b.element === 'Ateş') ||
    (a.element === 'Toprak' && b.element === 'Su') ||
    (a.element === 'Su' && b.element === 'Toprak');

  const emotionalScore = Math.min(98, Math.max(40, isSameElement ? score + 4 : isComplementary ? score - 2 : score - 8));
  const passionScore = Math.min(98, Math.max(40, (a.element === 'Ateş' || b.element === 'Ateş') ? score + 6 : score - 3));
  const mindScore = Math.min(98, Math.max(40, (a.element === 'Hava' || b.element === 'Hava') ? score + 5 : score));

  return (
    <div className="ticks relative border border-line bg-ink-2 p-6 sm:p-10 space-y-10">
      <Ticks />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-gold">
            <Sparkles size={14} className="animate-pulse" />
            <span>ZODYAK AŞK & ARKETİP KİMYASI</span>
          </div>
          <h2 className="display display-tight mt-2 text-2xl sm:text-3xl font-black text-paper">
            Burç Uyumu <span className="serif-i text-gold">& Elementel Rezonans</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-paper/70 font-sans max-w-xl">
            İki Güneş burcunun ekliptik üzerindeki açısal ilişkisini, simyasal element dengesini ve arketipsel sinerjisini keşfedin.
          </p>
        </div>

        <Link
          href="/astroloji/sinastri"
          className="group inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border border-rose-signal text-rose-signal hover:bg-rose-signal hover:text-ink transition-colors shrink-0"
        >
          <Heart size={14} className="text-rose-signal group-hover:text-ink" />
          <span>Derin Sinastri Analizine Geç</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Main Interactive Stage: Side A - Score Dial - Side B */}
      <div className="grid items-center gap-8 lg:grid-cols-12">
        {/* Left Side: Sign A Pedestal & Quick Selector */}
        <div className="flex flex-col items-center text-center lg:col-span-4 space-y-4">
          <div className="label text-muted text-[11px] uppercase tracking-wider">1. GÜNEŞ BURCU</div>

          {/* Pedestal */}
          <div className={`relative flex h-32 w-32 items-center justify-center rounded-2xl border ${styleA.border} ${styleA.bg} ${styleA.glow} transition-all duration-500`}>
            <div className="absolute inset-1 rounded-xl border border-dashed border-white/10 pointer-events-none" />
            <ZodiacGlyph sign={a.id} size={72} className={styleA.text} />
          </div>

          {/* Sign Title & Selector */}
          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <select
                aria-label="1. burcu seçin"
                value={signA}
                onChange={(e) => setSignA(e.target.value)}
                className="display display-tight w-full cursor-pointer appearance-none truncate border-b-2 border-line bg-transparent py-2 pl-4 pr-8 text-center text-2xl font-bold text-paper transition-colors focus:border-gold focus:outline-none"
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink font-sans text-sm font-normal">
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gold/70">▼</span>
            </div>
            <div className="label mt-2 text-muted text-[11px]">
              {a.latinName} · <strong className={styleA.text}>{a.element}</strong> · {a.modality}
            </div>
          </div>

          {/* Quick Glyph Strip for Sign A */}
          <div className="w-full max-w-xs pt-2">
            <span className="doc-caption text-[10px] text-muted block mb-1.5">HIZLI SEÇ:</span>
            <div className="grid grid-cols-6 gap-1 border border-line bg-ink p-1.5">
              {ZODIAC_SIGNS.map((s) => {
                const isSelected = s.id === signA;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSignA(s.id)}
                    aria-label={`1. burç: ${s.name}`}
                    title={s.name}
                    className={`h-7 grid place-items-center rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gold text-ink font-bold shadow-xs'
                        : 'text-paper/60 hover:text-gold hover:bg-ink-2'
                    }`}
                  >
                    <ZodiacGlyph sign={s.id} size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Dynamic Animated Astrolabe Score Ring */}
        <div className="relative mx-auto flex flex-col items-center justify-center lg:col-span-4">
          <div className="relative grid aspect-square w-full max-w-[240px] place-items-center">
            {/* Background pulsating radial aura */}
            <div className="absolute inset-0 rounded-full bg-gold/5 blur-2xl pointer-events-none" />

            <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              {/* Outer tick track */}
              <circle r="92" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 3" />
              {/* Base background ring */}
              <circle r="84" fill="none" stroke="var(--line)" strokeWidth="8" />
              {/* Progress gauge */}
              <circle
                r="84"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={RING}
                strokeDashoffset={RING * (1 - score / 100)}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              {/* Inner accent ring */}
              <circle r="75" fill="none" stroke="rgba(245, 197, 66, 0.15)" strokeWidth="1" />
            </svg>

            <div className="text-center z-10" aria-live="polite">
              <div className="label text-muted text-[10px] tracking-widest uppercase">UYUM REZONANSI</div>
              <div className="display display-tight mt-1 text-5xl sm:text-6xl font-black text-paper font-mono">
                %{score}
              </div>
              <div className="inline-block mt-2 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold bg-gold/15 text-gold border border-gold/30">
                {result.verdict}
              </div>
            </div>
          </div>

          {/* Sub-Dimensions Bar Gauges */}
          <div className="w-full max-w-xs mt-6 space-y-2.5 font-mono text-xs bg-ink p-3.5 border border-line">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted">
                <span className="flex items-center gap-1"><Heart size={11} className="text-rose-signal" /> Duygusal Rezonans</span>
                <span className="font-bold text-paper">%{emotionalScore}</span>
              </div>
              <div className="h-1 w-full bg-ink-2 overflow-hidden">
                <div className="h-full bg-rose-signal transition-all duration-700" style={{ width: `${emotionalScore}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted">
                <span className="flex items-center gap-1"><Flame size={11} className="text-gold" /> Tutku & Çekim</span>
                <span className="font-bold text-paper">%{passionScore}</span>
              </div>
              <div className="h-1 w-full bg-ink-2 overflow-hidden">
                <div className="h-full bg-gold transition-all duration-700" style={{ width: `${passionScore}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted">
                <span className="flex items-center gap-1"><Brain size={11} className="text-primary" /> Zihinsel Diyalog</span>
                <span className="font-bold text-paper">%{mindScore}</span>
              </div>
              <div className="h-1 w-full bg-ink-2 overflow-hidden">
                <div className="h-full bg-primary transition-all duration-700" style={{ width: `${mindScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign B Pedestal & Quick Selector */}
        <div className="flex flex-col items-center text-center lg:col-span-4 space-y-4">
          <div className="label text-muted text-[11px] uppercase tracking-wider">2. GÜNEŞ BURCU</div>

          {/* Pedestal */}
          <div className={`relative flex h-32 w-32 items-center justify-center rounded-2xl border ${styleB.border} ${styleB.bg} ${styleB.glow} transition-all duration-500`}>
            <div className="absolute inset-1 rounded-xl border border-dashed border-white/10 pointer-events-none" />
            <ZodiacGlyph sign={b.id} size={72} className={styleB.text} />
          </div>

          {/* Sign Title & Selector */}
          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <select
                aria-label="2. burcu seçin"
                value={signB}
                onChange={(e) => setSignB(e.target.value)}
                className="display display-tight w-full cursor-pointer appearance-none truncate border-b-2 border-line bg-transparent py-2 pl-4 pr-8 text-center text-2xl font-bold text-paper transition-colors focus:border-gold focus:outline-none"
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink font-sans text-sm font-normal">
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gold/70">▼</span>
            </div>
            <div className="label mt-2 text-muted text-[11px]">
              {b.latinName} · <strong className={styleB.text}>{b.element}</strong> · {b.modality}
            </div>
          </div>

          {/* Quick Glyph Strip for Sign B */}
          <div className="w-full max-w-xs pt-2">
            <span className="doc-caption text-[10px] text-muted block mb-1.5">HIZLI SEÇ:</span>
            <div className="grid grid-cols-6 gap-1 border border-line bg-ink p-1.5">
              {ZODIAC_SIGNS.map((s) => {
                const isSelected = s.id === signB;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSignB(s.id)}
                    aria-label={`2. burç: ${s.name}`}
                    title={s.name}
                    className={`h-7 grid place-items-center rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gold text-ink font-bold shadow-xs'
                        : 'text-paper/60 hover:text-gold hover:bg-ink-2'
                    }`}
                  >
                    <ZodiacGlyph sign={s.id} size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Detailed Scientific Breakdown Cards */}
      <div className="grid gap-px border border-line bg-line md:grid-cols-3" aria-live="polite">
        {[
          { k: 'ZODYAK AÇISI & İLİŞKİ', title: result.relation, text: result.relationText, badge: 'Açı Geometrisi' },
          { k: 'ELEMENTEL SİNERJİ', title: `${a.element} + ${b.element}`, text: result.elementText, badge: isSameElement ? 'Aynı Element' : isComplementary ? 'Tamamlayıcı' : 'Dinamik' },
          { k: 'NİTELİK ETKİLEŞİMİ', title: `${a.modality} · ${b.modality}`, text: result.modalityText, badge: 'Eylem Biçimi' },
        ].map((r) => (
          <div key={r.k} className="bg-ink p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="doc-caption text-gold">{r.k}</span>
              <span className="text-[10px] px-1.5 py-0.5 border border-line bg-ink-2 text-muted">{r.badge}</span>
            </div>
            <div className="doc-title text-base sm:text-lg text-paper font-bold">{r.title}</div>
            <p className="text-xs sm:text-sm leading-relaxed text-paper/75 font-sans">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Life areas: love, friendship, work */}
      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        {[
          { k: 'AŞK', text: result.love, color: 'text-rose' },
          { k: 'DOSTLUK', text: result.friendship, color: 'text-primary' },
          { k: 'İŞ BİRLİĞİ', text: result.work, color: 'text-gold' },
        ].map((r) => (
          <div key={r.k} className="bg-ink p-5 sm:p-6 space-y-2">
            <span className={`doc-caption ${r.color}`}>{r.k}</span>
            <p className="text-xs sm:text-sm leading-relaxed text-paper/80 font-sans">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <span className="doc-caption text-muted">GÜÇLÜ YANLAR</span>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.strengths.map((t) => (
              <li key={t} className="border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs text-primary">+ {t}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="doc-caption text-muted">DİKKAT</span>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.watch.map((t) => (
              <li key={t} className="border border-rose/40 bg-rose/5 px-2.5 py-1 text-xs text-rose">− {t}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="doc-caption text-muted">TAVSİYE</span>
          <p className="mt-3 text-sm leading-relaxed text-paper/80">{result.advice}</p>
        </div>
      </div>

      {/* Deep Link Advisory Note */}
      <div className="border border-line bg-ink p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <p className="text-paper/60 font-sans">
          {result.traditional ? '★ Geleneksel astroloji kaynaklarında bu ikili öne çıkan eşleşmeler arasındadır. ' : ''}
          Bu hesaplama yalnızca Güneş burçlarını kıyaslar. Gerçek bir ilişki dinamiği için Güneş, Ay, Yükselen ve Venüs-Mars konumlarını sinastri modülünde karşılaştırın.
        </p>
        <Link
          href="/astroloji/sinastri"
          className="shrink-0 text-gold hover:underline flex items-center gap-1 font-bold whitespace-nowrap"
        >
          <span>Sinastri Haritası Başlat</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
