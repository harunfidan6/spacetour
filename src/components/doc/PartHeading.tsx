import type { ReactNode } from 'react';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/** A documentary part divider: "KISIM II" slate, title and a short synopsis. */
export function PartHeading({
  part,
  title,
  serif,
  description,
  aside,
  id,
}: {
  part: number;
  title: string;
  serif?: string;
  description?: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <header id={id} className="mb-10 scroll-mt-24 sm:mb-14">
      <div className="flex items-center gap-4">
        <span className="doc-kicker" style={{ color: 'var(--page-accent)' }}>
          Kısım {ROMAN[part - 1] ?? part}
        </span>
        <span aria-hidden className="doc-rule flex-1" />
        {aside && <span className="doc-caption">{aside}</span>}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 className="doc-title text-[clamp(2.2rem,5.4vw,5rem)] text-paper lg:col-span-7">
          {title}
          {serif && (
            <>
              {' '}
              <span className="doc-serif lowercase" style={{ color: 'var(--page-accent)' }}>
                {serif}
              </span>
            </>
          )}
        </h2>
        {description && <p className="max-w-lg text-sm leading-relaxed text-paper/65 sm:text-base lg:col-span-5">{description}</p>}
      </div>
    </header>
  );
}
