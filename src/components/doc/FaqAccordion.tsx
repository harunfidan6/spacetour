'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqItem } from '@/data/faqs';
import { getFaqPageJsonLd } from '@/lib/seo';

export function FaqAccordion({
  items,
  title = 'Kozmik Rehber & SSS',
  serif = 'merak edilenler',
  kicker = 'Arama & Bilgi Merkezi',
  description = 'Sıkça sorulan sorular, gözlem ilkeleri ve temel kavramlar rehberi.',
  accentColor = 'var(--page-accent, var(--gold))',
  includeSchema = true,
}: {
  items: FaqItem[];
  title?: string;
  serif?: string;
  kicker?: string;
  description?: string;
  accentColor?: string;
  includeSchema?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const schemaJson = includeSchema ? getFaqPageJsonLd(items) : null;

  return (
    <section
      aria-label={title}
      className="border-t border-white/10 bg-ink-2/60 px-[var(--gutter)] py-20 sm:py-28 backdrop-blur-sm"
    >
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      <div className="mx-auto max-w-4xl">
        {/* Section Heading */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2">
            <span
              className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/5"
              style={{ color: accentColor }}
            >
              <HelpCircle size={13} />
            </span>
            <span className="doc-kicker text-xs uppercase tracking-widest text-paper/60">
              {kicker}
            </span>
          </div>

          <h2 className="doc-title mt-3 text-3xl sm:text-4xl text-paper">
            {title}{' '}
            <span className="doc-serif italic text-paper/70 font-normal">
              {serif}
            </span>
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-paper/70 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 sm:py-6 text-left transition-colors hover:text-paper group"
                >
                  <span className="flex items-start gap-3 sm:gap-4 pr-2">
                    <span
                      className="font-mono text-xs sm:text-sm font-bold shrink-0 mt-0.5"
                      style={{ color: isOpen ? accentColor : 'rgba(255, 255, 255, 0.62)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span
                      className={`text-base sm:text-lg font-medium transition-colors ${
                        isOpen ? 'text-paper font-semibold' : 'text-paper/85 group-hover:text-paper'
                      }`}
                    >
                      {item.question}
                    </span>
                  </span>

                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 border-white/30 bg-white/10' : ''
                    }`}
                    style={{ color: isOpen ? accentColor : 'inherit' }}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>

                {/* Kapalı cevaplar da HTML'de kalır (arama motorları için); yalnızca gizlenir */}
                <div hidden={!isOpen} className="pb-6 pl-7 sm:pl-10 pr-4 animate-in fade-in-50 duration-200">
                  <p className="text-sm sm:text-base leading-relaxed text-paper/75">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
