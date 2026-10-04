import type { NatalReadingResult } from '@/lib/astrology/natalReading';

const EL_COLOR: Record<string, string> = { Ateş: '#f59e0b', Toprak: '#a3e635', Hava: '#38bdf8', Su: '#818cf8' };
const NATURE: Record<string, string> = { uyumlu: 'text-sky-300 border-sky-300/40', gergin: 'text-rose border-rose/40', güçlü: 'text-gold border-gold/40' };

function Block({ kicker, title, children }: { kicker: string; title?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="doc-kicker text-gold">{kicker}</span>
        <span className="doc-rule w-12" aria-hidden />
      </div>
      {title && <h4 className="doc-title text-2xl text-paper">{title}</h4>}
      {children}
    </section>
  );
}

/** Long-form personal reading of a natal chart (computed by lib/astrology/natalReading). */
export function NatalReadingPanel({ reading }: { reading: NatalReadingResult }) {
  const total = Object.values(reading.balance.elements).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="space-y-14 border border-line bg-ink p-6 sm:p-10">
      <p className="doc-serif max-w-4xl text-[clamp(1.2rem,2vw,1.6rem)] leading-snug text-paper/90">{reading.summary}</p>

      <Block kicker="Kozmik üçlü">
        <div className="grid gap-px bg-white/10 lg:grid-cols-3">
          <article className="bg-ink-2 p-6">
            <h5 className="doc-title text-lg text-paper">{reading.sun.title}</h5>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{reading.sun.text}</p>
            <p className="mt-3 text-sm leading-relaxed text-gold/90">{reading.sun.decan}</p>
            {reading.sun.cusp && <p className="mt-2 text-sm leading-relaxed text-paper/70">{reading.sun.cusp}</p>}
          </article>
          <article className="bg-ink-2 p-6">
            <h5 className="doc-title text-lg text-paper">{reading.moon.title}</h5>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{reading.moon.text}</p>
            <p className="mt-3 text-sm leading-relaxed text-gold/90">{reading.moon.phase}</p>
          </article>
          <article className="bg-ink-2 p-6">
            <h5 className="doc-title text-lg text-paper">{reading.ascendant.title}</h5>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{reading.ascendant.text}</p>
          </article>
        </div>
      </Block>

      <Block kicker="Kişisel gezegenler" title="Nasıl düşünür, sever ve harekete geçersin">
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {reading.personalPlanets.map((p) => (
            <article key={p.title} className="bg-ink-2 p-5">
              <h5 className="doc-caption text-paper/80">{p.title}</h5>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">{p.text}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          {reading.social.map((p) => (
            <article key={p.title} className="bg-ink-2 p-5">
              <h5 className="doc-caption text-paper/80">{p.title}</h5>
              <p className="mt-2 text-sm leading-relaxed text-paper/80">{p.text}</p>
            </article>
          ))}
        </div>
      </Block>

      <Block kicker="Evler" title="Gezegenlerin hayatındaki yeri">
        <ul className="grid gap-px bg-white/10 md:grid-cols-2">
          {reading.houses.map((h) => (
            <li key={h.title} className="bg-ink-2 p-5">
              <h5 className="doc-caption text-paper/80">{h.title}</h5>
              <p className="mt-2 text-sm leading-relaxed text-paper/75">{h.text}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-paper/50">Evler, Yükselen burcundan başlayan tam-burç ev sistemiyle hesaplanır.</p>
      </Block>

      <Block kicker="Açılar" title={reading.aspects.length ? `${reading.aspects.length} major açı` : 'Major açı yok'}>
        {reading.aspects.length ? (
          <ul className="space-y-3">
            {reading.aspects.map((a) => (
              <li key={a.title} className={`border-l-2 pl-4 ${NATURE[a.nature] ?? ''}`}>
                <div className="doc-caption">{a.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-paper/80">{a.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-paper/70">Gezegenlerin arasında sıkı bir major açı yok; her biri kendi alanında bağımsız çalışır.</p>
        )}
      </Block>

      {reading.retrogrades.length > 0 && (
        <Block kicker="Geri hareket">
          <ul className="space-y-3">
            {reading.retrogrades.map((r) => (
              <li key={r} className="text-sm leading-relaxed text-paper/80">{r}</li>
            ))}
          </ul>
        </Block>
      )}

      <Block kicker="Element ve nitelik dengesi">
        <div className="space-y-2">
          {Object.entries(reading.balance.elements).map(([el, v]) => (
            <div key={el} className="flex items-center gap-3">
              <span className="w-16 text-sm text-paper/80">{el}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full" style={{ width: `${(v / total) * 100}%`, background: EL_COLOR[el] }} />
              </span>
              <span className="w-10 text-right font-mono text-xs text-paper/60">%{Math.round((v / total) * 100)}</span>
            </div>
          ))}
        </div>
        {reading.balance.text.map((t) => (
          <p key={t} className="text-sm leading-relaxed text-paper/80">{t}</p>
        ))}
      </Block>

      <p className="border-t border-white/10 pt-5 text-xs leading-relaxed text-paper/50">
        Konumlar doğum anı ve yeri için gerçek gök mekaniğiyle hesaplanır. Astroloji bilimsel bir yöntem değildir; yorumlar kültürel bir gelenek olarak sunulur.
      </p>
    </div>
  );
}
