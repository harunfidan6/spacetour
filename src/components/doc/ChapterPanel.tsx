import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { moduleHref, type DocSection } from '@/data/sections';

/** Home-page chapter: a full-bleed still with the chapter slate, synopsis and its first parts. */
export function ChapterPanel({ section, flip = false }: { section: DocSection; flip?: boolean }) {
  const parts = section.modules.slice(0, 4);
  const count = section.modules.length + (section.collections?.length ?? 0);

  return (
    <section
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden border-t border-white/10"
      style={{ '--page-accent': section.accent } as CSSProperties}
      aria-labelledby={`chapter-${section.id}`}
    >
      <Image src={section.image.src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden className="doc-shade-b absolute inset-0 -z-10" />
      <div aria-hidden className={`absolute inset-0 -z-10 opacity-80 ${flip ? 'bg-[linear-gradient(270deg,rgb(5_5_8/0.9),rgb(5_5_8/0.3)_55%,transparent)]' : 'doc-shade-l'}`} />

      <div className={`grid w-full gap-10 px-[var(--gutter)] pb-16 pt-32 lg:grid-cols-12 lg:items-end ${flip ? 'lg:text-right' : ''}`}>
        <div className={`lg:col-span-7 ${flip ? 'lg:col-start-6' : ''}`}>
          <div className={`flex items-center gap-4 ${flip ? 'lg:justify-end' : ''}`}>
            <span className="doc-kicker" style={{ color: section.accent }}>
              Bölüm {section.chapter}
            </span>
            <span aria-hidden className="doc-rule w-20" />
            <span className="doc-kicker text-paper/70">{section.kicker}</span>
          </div>
          <h2 id={`chapter-${section.id}`} className="doc-title mt-6 text-[clamp(3rem,9vw,9rem)] text-paper">
            {section.headline[0]}
            <span className="doc-serif block lowercase" style={{ color: section.accent }}>
              {section.headline[1]}
            </span>
          </h2>
          <p className={`mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg ${flip ? 'lg:ml-auto' : ''}`}>{section.lede}</p>

          {parts.length > 0 && (
            <ul className={`mt-8 flex flex-wrap gap-2 ${flip ? 'lg:justify-end' : ''}`}>
              {parts.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={moduleHref(section, m)}
                    className="doc-kicker inline-block rounded-full border border-white/20 bg-ink/40 px-3.5 py-2 text-[10px] text-paper/80 backdrop-blur-md transition-colors hover:border-white/60 hover:text-paper"
                  >
                    {m.short}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className={`mt-10 flex flex-wrap items-center gap-5 ${flip ? 'lg:justify-end' : ''}`}>
            <Link
              href={section.href}
              className="group inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-3 text-sm font-bold text-ink transition-transform hover:scale-[1.03]"
              style={{ background: section.accent }}
            >
              Bölüme gir
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink" style={{ color: section.accent }}>
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <span className="doc-caption">{count > 0 ? `${count} kısım` : 'Tek kısım'}</span>
          </div>
        </div>
      </div>

      <p className="doc-caption absolute bottom-5 right-[var(--gutter)] hidden max-w-[40%] text-right sm:block">Görsel · {section.image.credit}</p>
    </section>
  );
}
