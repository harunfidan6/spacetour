import Link from 'next/link';
import { PartHeading } from './PartHeading';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ASTROLOGICAL_HOUSES, ZODIAC_SIGNS, type ZodiacElement, type ZodiacModality } from '@/data/zodiac';
import { ELEMENT_INFO, MODALITY_INFO, PLANET_MEANINGS } from '@/data/zodiacProfiles';

const ELEMENTS: ZodiacElement[] = ['Ateş', 'Toprak', 'Hava', 'Su'];
const MODALITIES: ZodiacModality[] = ['Öncü', 'Sabit', 'Değişken'];

/** Foundations of the zodiac: the element × modality matrix, the planets and the twelve houses. */
export function AstrologyBasics({
  part,
}: {
  /** Eski "Kısım" numarası; artık gösterilmiyor */
  part?: number;
} = {}) {
  return (
    <section className="space-y-12 sm:space-y-16">
      <PartHeading
        part={part}
        title="Astrolojinin"
        serif="temelleri"
        description="On iki burç, dört element ile üç niteliğin birleşiminden doğar. Empedokles ve Aristoteles’ten gelen dört elementte Ateş inisiyatif alır, Toprak inşa eder, Hava idrak eder, Su hisseder. Gezegenler neyin, burçlar nasıl, evler nerede olduğunu anlatır."
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-1/4 border-b border-white/10 p-4 doc-caption">Element \ nitelik</th>
              {MODALITIES.map((m) => (
                <th key={m} className="border-b border-white/10 p-4 align-bottom">
                  <div className="text-base font-semibold text-paper">{m}</div>
                  <div className="mt-1 text-sm font-normal leading-snug text-paper/70">{MODALITY_INFO[m]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ELEMENTS.map((e) => (
              <tr key={e} className="border-b border-white/10">
                <th className="p-4 align-top font-normal">
                  <div className="doc-title text-xl" style={{ color: ELEMENT_INFO[e].color }}>{e}</div>
                  <div className="mt-1 text-sm text-paper/70">{ELEMENT_INFO[e].polarity}</div>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-paper/75">{ELEMENT_INFO[e].text}</p>
                </th>
                {MODALITIES.map((m) => {
                  const s = ZODIAC_SIGNS.find((x) => x.element === e && x.modality === m)!;
                  return (
                    <td key={m} className="p-2 align-top">
                      <Link href={`/astroloji/burclar/${s.id}`} className="group flex h-full items-center gap-3 border border-transparent p-3 transition-colors hover:border-white/15 hover:bg-ink-2">
                        <ZodiacGlyph sign={s.id} size={30} className="shrink-0" style={{ color: ELEMENT_INFO[e].color }} />
                        <span>
                          <span className="doc-title block text-lg text-paper group-hover:text-gold">{s.name}</span>
                          <span className="text-[13px] text-paper/70">{s.dates}</span>
                        </span>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="doc-title text-xl text-paper sm:text-2xl">Gezegenler · neyi</h3>
          <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {PLANET_MEANINGS.map((pl) => (
              <li key={pl.name} className="flex items-baseline gap-4 py-3">
                <span className="w-6 text-center text-xl text-gold" aria-hidden>{pl.glyph}</span>
                <span className="doc-title w-24 text-base text-paper">{pl.name}</span>
                <span className="text-[15px] leading-relaxed text-paper/80">{pl.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <h3 className="doc-title text-xl text-paper sm:text-2xl">12 ev · nerede</h3>
          <ol className="mt-5 grid gap-px bg-white/10 sm:grid-cols-2">
            {ASTROLOGICAL_HOUSES.map((h) => (
              <li key={h.number} className="bg-ink p-4">
                <div className="flex items-baseline gap-3">
                  <span className="doc-title text-lg text-paper/70">{String(h.number).padStart(2, '0')}</span>
                  <span className="text-base font-medium text-paper">{h.area}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/75">{h.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
