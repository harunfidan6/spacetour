import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { planets } from '@/data/planets';
import { PlanetHologram3D } from '@/components/space/PlanetHologram3D';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FitText } from '@/components/motion/FitText';
import { Reveal, Scramble, Ticks } from '@/components/motion/primitives';
import { Marquee } from '@/components/motion/Marquee';

export function generateStaticParams() {
  return planets.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<'/ansiklopedi/[id]'>) {
  const { id } = await props.params;
  const planet = planets.find((p) => p.id === id);
  if (!planet) return { title: 'Kayıt bulunamadı' };
  return { title: `${planet.name} · Ansiklopedi`, description: planet.description };
}

const TYPE_LABEL: Record<string, string> = {
  gezegen: 'Gezegen',
  yıldız: 'Yıldız',
  ay: 'Doğal uydu',
  'cüce-gezegen': 'Cüce gezegen',
};

export default async function PlanetDetail(props: PageProps<'/ansiklopedi/[id]'>) {
  const { id } = await props.params;
  const index = planets.findIndex((p) => p.id === id);
  if (index === -1) notFound();

  const planet = planets[index];
  const prev = planets[(index - 1 + planets.length) % planets.length];
  const next = planets[(index + 1) % planets.length];

  const facts = [
    { k: 'Çap', v: planet.facts.çap },
    { k: 'Kütle', v: planet.facts.kütle },
    { k: 'Yörünge süresi', v: planet.facts.yörüngeSüresi },
    { k: 'Sıcaklık', v: planet.facts.sıcaklık },
  ];
  const telemetry = [
    { k: 'Güneş’e uzaklık', v: planet.facts.güneşeUzaklık },
    { k: 'Gün süresi', v: planet.facts.günSüresi },
    { k: 'Doğal uydu', v: `${planet.facts.uyduSayısı} adet` },
    { k: 'Halka sistemi', v: planet.facts.halkaSistemi ? 'Var' : 'Yok' },
  ];
  const paragraphs = planet.detay.split('\n').filter(Boolean);

  return (
    <div className="relative" style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <OrbCanvas />
      <div className="px-[var(--gutter)] pt-24 sm:pt-28">
        <div className="flex items-center gap-4 border-b border-line pb-4">
          <Link href="/ansiklopedi" className="label group flex items-center gap-2 text-paper transition-colors hover:text-violet">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Arşiv
          </Link>
          <span className="label text-muted">
            (03) Kayıt {String(index + 1).padStart(2, '0')} / {String(planets.length).padStart(2, '0')}
          </span>
          <span className="label ml-auto hidden text-violet sm:inline">{TYPE_LABEL[planet.type] ?? planet.type}</span>
        </div>

        <FitText className="display mt-8 leading-[0.8] text-paper" fallback="18vw" max={420}>
          <SplitReveal as="span" trigger="intro" effect="tilt" stagger={0.05} duration={1.3}>
            {planet.name}
          </SplitReveal>
        </FitText>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-8 lg:col-span-5">
            <div>
              <SplitReveal as="p" by="lines" trigger="intro" delay={0.3} className="mt-6 text-xl leading-snug text-paper/85 sm:text-2xl">
                {planet.description}
              </SplitReveal>
            </div>
            <p className="label text-muted">Sürükle: 360° döndür · Tekerlek: yakınlaştır</p>
          </div>
          <Reveal mode="clip" className="ticks relative lg:col-span-7">
            <Ticks />
            <PlanetHologram3D id={planet.id} />
          </Reveal>
        </div>
      </div>

      <div className="mt-16 border-y border-line bg-violet py-3 text-ink">
        <Marquee speed={50}>
          {[planet.name, TYPE_LABEL[planet.type] ?? planet.type, planet.facts.çap, planet.facts.sıcaklık].map((t, i) => (
            <span key={i} className="label flex items-center gap-6 px-6 text-sm font-semibold">
              {t} <span>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="space-y-20 px-[var(--gutter)] pb-28 pt-16">
        <Reveal items="[data-fact]" stagger={0.08} className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} data-fact className="bg-ink p-5 sm:p-7">
              <div className="label text-muted">{f.k}</div>
              <div className="display display-tight mt-4 text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[0.95] text-violet">
                <Scramble text={f.v} />
              </div>
            </div>
          ))}
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-4">
              <span className="label text-violet">(R)</span>
              <span className="label text-paper">Bilimsel rapor</span>
            </div>
            <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-paper/75 sm:text-xl">
              {paragraphs.map((p, i) => (
                <SplitReveal key={i} as="p" by="lines" stagger={0.06}>
                  {p}
                </SplitReveal>
              ))}
            </div>
          </article>
          <aside className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3 border-t border-line pt-4">
              <span className="label text-violet">(T)</span>
              <span className="label text-paper">Ekstra telemetri</span>
            </div>
            <dl className="border-t border-line">
              {telemetry.map((t) => (
                <div key={t.k} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                  <dt className="label text-muted">{t.k}</dt>
                  <dd className="text-right font-mono text-sm text-paper">
                    <Scramble text={t.v} />
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <nav className="grid gap-px border border-line bg-line lg:grid-cols-2" aria-label="Kayıtlar arasında gezin">
          {[
            { p: prev, label: 'Önceki kayıt', dir: -1 },
            { p: next, label: 'Sonraki kayıt', dir: 1 },
          ].map(({ p, label, dir }) => (
            <Link key={label} href={`/ansiklopedi/${p.id}`} className={`group relative overflow-hidden bg-ink p-6 sm:p-10 ${dir > 0 ? 'text-right' : ''}`}>
              <span aria-hidden className={`absolute inset-0 scale-x-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 ${dir > 0 ? 'origin-right' : 'origin-left'}`} />
              <span className={`label relative flex items-center gap-2 text-muted group-hover:text-ink ${dir > 0 ? 'justify-end' : ''}`}>
                {dir < 0 && <ArrowLeft size={14} />} {label} {dir > 0 && <ArrowRight size={14} />}
              </span>
              <span className={`relative mt-4 flex items-center gap-4 ${dir > 0 ? 'flex-row-reverse' : ''}`}>
                <PlanetOrb id={p.id} className="h-14 w-14 transition-transform duration-500 group-hover:scale-110 sm:h-20 sm:w-20" spin={1.5} />
                <span className="display min-w-0 break-words pt-[0.12em] text-[clamp(1.8rem,4vw,4rem)] text-paper transition-colors group-hover:text-ink">{p.name}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
