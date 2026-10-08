'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { signCompatibility } from '@/lib/astrology/compatibility';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';

const RING = 2 * Math.PI * 88;

const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Ateş: { text: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/40' },
  Toprak: { text: 'text-lime', bg: 'bg-lime/10', border: 'border-lime/40' },
  Hava: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
  Su: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/40' },
};

// Ortak görünüm sınıfları
const SECTION_LABEL = 'text-sm text-paper/70';
const SIGN_SELECT =
  'font-display w-full cursor-pointer appearance-none truncate border-b-2 border-line bg-transparent py-2 pl-4 pr-8 text-center text-2xl font-semibold text-paper transition-colors focus:border-gold focus:outline-none';
const QUICK_BUTTON = 'grid h-9 place-items-center rounded transition-colors cursor-pointer';
const QUICK_ACTIVE = 'bg-gold text-ink';
const QUICK_IDLE = 'text-paper/75 hover:bg-ink hover:text-gold';

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


  return (
    <div className="border border-line bg-ink-2 p-4 sm:p-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Burç uyumu ve element dengesi
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/80 sm:text-base">
            İki Güneş burcunun ekliptik üzerindeki açısal ilişkisini, simyasal element dengesini ve arketipsel sinerjisini keşfedin.
          </p>
        </div>

        <Link
          href="/astroloji/sinastri"
          className="group inline-flex min-h-10 items-center gap-2 self-start sm:self-auto px-4 py-2 text-sm font-medium border border-rose-signal text-rose-signal hover:bg-rose-signal hover:text-ink transition-colors shrink-0"
        >
          <Heart size={16} className="text-rose-signal group-hover:text-ink" />
          <span>Sinastri analizine geç</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Main Interactive Stage: Side A - Score Dial - Side B */}
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Left Side: Sign A & Quick Selector */}
        <div className="flex flex-col items-center text-center lg:col-span-4 space-y-4">
          <div className={SECTION_LABEL}>1. Güneş burcu</div>

          <div className={`flex h-28 w-28 items-center justify-center rounded-2xl border ${styleA.border} ${styleA.bg} transition-colors duration-500`}>
            <ZodiacGlyph sign={a.id} size={64} className={styleA.text} />
          </div>

          {/* Sign Title & Selector */}
          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <select
                aria-label="1. burcu seçin"
                value={signA}
                onChange={(e) => setSignA(e.target.value)}
                className={SIGN_SELECT}
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink font-sans text-sm font-normal">
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gold/70">▼</span>
            </div>
            <div className="mt-2 text-sm text-paper/70">
              {a.latinName} · <strong className={`font-medium ${styleA.text}`}>{a.element}</strong> · {a.modality}
            </div>
          </div>

          {/* Quick Glyph Strip for Sign A */}
          <div className="w-full max-w-xs pt-1">
            <span className="mb-1.5 block text-xs text-paper/70">Hızlı seçim</span>
            <div className="grid grid-cols-6 gap-1">
              {ZODIAC_SIGNS.map((s) => {
                const isSelected = s.id === signA;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSignA(s.id)}
                    aria-label={`1. burç: ${s.name}`}
                    title={s.name}
                    className={`${QUICK_BUTTON} ${isSelected ? QUICK_ACTIVE : QUICK_IDLE}`}
                  >
                    <ZodiacGlyph sign={s.id} size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Score Ring */}
        <div className="mx-auto flex w-full flex-col items-center lg:col-span-4">
          <div className="relative grid aspect-square w-full max-w-[220px] place-items-center">
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

            <div className="relative text-center" aria-live="polite">
              <div className="text-sm text-paper/70">Uyum</div>
              <div className="mt-1 font-mono text-5xl font-semibold leading-none text-paper tabular-nums">
                %{score}
              </div>
              <span className="sr-only">{result.verdict}</span>
            </div>
          </div>
          <div aria-hidden className="mt-4 border border-gold/30 bg-gold/10 px-3 py-1 text-center text-sm font-medium text-gold">
            {result.verdict}
          </div>
          <Link
            href={`/astroloji/burc-uyumu/${ZODIAC_SIGNS.indexOf(a) <= ZODIAC_SIGNS.indexOf(b) ? `${a.id}-${b.id}` : `${b.id}-${a.id}`}`}
            className="mt-2 inline-flex min-h-9 items-center text-center text-sm text-gold hover:underline"
          >
            {a.id === b.id ? `İki ${a.name}` : `${a.name} ve ${b.name}`} uyumunun tam yorumu →
          </Link>

          {/* Puanın hesabı: açının taban puanı + geleneksel eşleşme */}
          <div className="mt-4 w-full max-w-xs border border-line bg-ink p-4 text-sm text-paper/80">
            <div className="mb-2 text-xs text-paper/70">Puan nasıl hesaplandı</div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-paper/85">{result.relation}</div>
                <div className="text-xs text-paper/70">
                  {result.separation === 0 ? 'Aynı burç · 0°' : `${result.separation} burç arası · ${result.separation * 30}°`}
                </div>
              </div>
              <span className="shrink-0 font-mono font-semibold text-paper">{result.base}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="min-w-0">Gelenekte öne çıkan eşleşme</span>
              <span className={`shrink-0 font-mono font-semibold ${result.traditional ? 'text-gold' : 'text-paper/60'}`}>{result.traditional ? '+3' : '—'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-2">
              <span className="text-paper/85">Toplam</span>
              <span className="shrink-0 font-mono font-semibold text-gold">%{score}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign B & Quick Selector */}
        <div className="flex flex-col items-center text-center lg:col-span-4 space-y-4">
          <div className={SECTION_LABEL}>2. Güneş burcu</div>

          <div className={`flex h-28 w-28 items-center justify-center rounded-2xl border ${styleB.border} ${styleB.bg} transition-colors duration-500`}>
            <ZodiacGlyph sign={b.id} size={64} className={styleB.text} />
          </div>

          {/* Sign Title & Selector */}
          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <select
                aria-label="2. burcu seçin"
                value={signB}
                onChange={(e) => setSignB(e.target.value)}
                className={SIGN_SELECT}
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink font-sans text-sm font-normal">
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gold/70">▼</span>
            </div>
            <div className="mt-2 text-sm text-paper/70">
              {b.latinName} · <strong className={`font-medium ${styleB.text}`}>{b.element}</strong> · {b.modality}
            </div>
          </div>

          {/* Quick Glyph Strip for Sign B */}
          <div className="w-full max-w-xs pt-1">
            <span className="mb-1.5 block text-xs text-paper/70">Hızlı seçim</span>
            <div className="grid grid-cols-6 gap-1">
              {ZODIAC_SIGNS.map((s) => {
                const isSelected = s.id === signB;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSignB(s.id)}
                    aria-label={`2. burç: ${s.name}`}
                    title={s.name}
                    className={`${QUICK_BUTTON} ${isSelected ? QUICK_ACTIVE : QUICK_IDLE}`}
                  >
                    <ZodiacGlyph sign={s.id} size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Açı, element ve nitelik yorumları */}
      <div className="grid gap-px border border-line bg-line md:grid-cols-3" aria-live="polite">
        {[
          { k: 'Açı ve ilişki', title: result.relation, text: result.relationText, badge: null },
          { k: 'Element uyumu', title: `${a.element} + ${b.element}`, text: result.elementText, badge: isSameElement ? 'Aynı element' : isComplementary ? 'Tamamlayıcı' : 'Dinamik' },
          { k: 'Nitelik etkileşimi', title: `${a.modality} · ${b.modality}`, text: result.modalityText, badge: null },
        ].map((r) => (
          <div key={r.k} className="bg-ink p-5 sm:p-6 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-paper/70">{r.k}</span>
              {r.badge && (
                <span className="border border-line px-2 py-0.5 text-xs text-paper/75">{r.badge}</span>
              )}
            </div>
            <div className="font-display text-lg font-semibold leading-snug text-paper">{r.title}</div>
            <p className="text-base leading-relaxed text-paper/85">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Life areas: love, friendship, work */}
      <div className="grid gap-px border border-line bg-line md:grid-cols-3">
        {[
          { k: 'Aşk', text: result.love, color: 'text-rose' },
          { k: 'Dostluk', text: result.friendship, color: 'text-primary' },
          { k: 'İş birliği', text: result.work, color: 'text-gold' },
        ].map((r) => (
          <div key={r.k} className="bg-ink p-5 sm:p-6 space-y-2">
            <span className={`block text-sm font-medium ${r.color}`}>{r.k}</span>
            <p className="text-base leading-relaxed text-paper/85">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <span className="text-sm text-paper/70">Güçlü yanlar</span>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-paper/85">
            {result.strengths.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="shrink-0 text-primary">+</span>
                <span className="min-w-0">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-sm text-paper/70">Dikkat</span>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-paper/85">
            {result.watch.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="shrink-0 text-rose">−</span>
                <span className="min-w-0">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-sm text-paper/70">Tavsiye</span>
          <p className="mt-2 text-base leading-relaxed text-paper/85">{result.advice}</p>
        </div>
      </div>

      {/* Deep Link Advisory Note */}
      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-paper/80">
          {result.traditional ? '★ Geleneksel astroloji kaynaklarında bu ikili öne çıkan eşleşmeler arasındadır. ' : ''}
          Bu hesaplama yalnızca Güneş burçlarını kıyaslar. Gerçek bir ilişki dinamiği için Güneş, Ay, Yükselen ve Venüs-Mars konumlarını sinastri modülünde karşılaştırın.
        </p>
        <Link
          href="/astroloji/sinastri"
          className="inline-flex min-h-9 shrink-0 items-center gap-1 self-start whitespace-nowrap text-sm font-medium text-gold hover:underline sm:self-auto"
        >
          <span>Sinastri haritası başlat</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
