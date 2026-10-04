'use client';

import { useState } from 'react';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { HOUSE_AREA } from '@/data/natalTexts';

/**
 * "What does this mean for my sign?": the visitor picks their sun sign and sees which solar
 * house the transiting sign falls in, with the life area it lights up.
 */
export function SignHouseInsight({
  targetSign,
  subject,
  theme,
  heading = 'Burcuna etkisi',
}: {
  /** Index (0 Koç … 11 Balık) of the sign where the transit happens */
  targetSign: number;
  /** e.g. "Venüs retrosu", "Ay" */
  subject: string;
  /** what the subject stirs, e.g. "ilişkileri, değerleri ve parayı" */
  theme: string;
  heading?: string;
}) {
  const [mine, setMine] = useState(0);
  const house = ((targetSign - mine + 12) % 12) + 1;
  const area = HOUSE_AREA[house - 1];
  return (
    <section className="space-y-4 border border-line bg-ink p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="doc-caption text-gold">{heading}</span>
        <label className="flex items-center gap-2 text-xs text-paper/70">
          Burcun
          <select
            value={mine}
            onChange={(e) => setMine(Number(e.target.value))}
            className="border border-line bg-ink-2 px-2 py-1 text-sm text-paper focus:border-gold focus:outline-none"
          >
            {ZODIAC_SIGNS.map((s, i) => (
              <option key={s.id} value={i}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-start gap-4">
        <ZodiacGlyph sign={ZODIAC_SIGNS[mine].id} size={36} className="mt-1 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed text-paper/85">
          {subject} {ZODIAC_SIGNS[targetSign].name} burcunda; bu, {ZODIAC_SIGNS[mine].name} için <strong className="text-paper">{house}. ev</strong>,
          yani <strong className="text-paper">{area.area}</strong> alanı. {theme.charAt(0).toUpperCase() + theme.slice(1)} hayatının {area.text} alanında
          gündeme getirir.
        </p>
      </div>
    </section>
  );
}
