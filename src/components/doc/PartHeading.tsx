import type { ReactNode } from 'react';

/** Bölüm başlığı: ince çizgi, başlık (isteğe bağlı serif vurgu) ve kısa açıklama. */
export function PartHeading({
  title,
  serif,
  description,
  id,
}: {
  /** Eski "Kısım II" künyesi; artık gösterilmiyor */
  part?: number;
  title: string;
  serif?: string;
  description?: ReactNode;
  /** Eski künye satırının sağ ucu; artık gösterilmiyor */
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <header id={id} className="mb-8 scroll-mt-24 sm:mb-10">
      <span aria-hidden className="doc-rule block w-16" />
      <div className="mt-5 grid gap-4 lg:grid-cols-12 lg:items-end">
        <h2 className="doc-title text-[clamp(1.6rem,3.4vw,2.75rem)] text-paper lg:col-span-7">
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
        {description && <p className="max-w-lg text-base leading-relaxed text-paper/80 lg:col-span-5">{description}</p>}
      </div>
    </header>
  );
}
