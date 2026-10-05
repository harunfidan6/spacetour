import Link from 'next/link';
import { HomeHero } from '@/components/home/HomeHero';
import { ChapterPanel } from '@/components/doc/ChapterPanel';
import { OrbCanvas } from '@/components/space/PlanetOrb';
import { SECTIONS } from '@/data/sections';

const SECTION_SYNOPSES: Record<string, string> = {
  harita: 'Anlık gök kubbenin altına adım atın; 360° canlı planetaryum ve yıldız kerterizleriyle geceyi keşfedin.',
  takvim: 'Göktaşlarından tam tutulmalara, evrenin en görkemli randevularını kaçırmamak için zamanı yakalayın.',
  ansiklopedi: 'Güneş’ten Plüton’a 3D modellerle dokunun, 10 interaktif fizik laboratuvarında kozmik yasaları sınayın.',
  astroloji: 'Doğum haritanızın geometrisini çıkarın, efemeris transitlerini ve 22 majör arkananın sembollerini okuyun.',
  gozlemevi: 'İnsan gözünün sınırlarını aşın; James Webb’in kızılötesi ve dev radyo teleskoplarının gözünden derin uzayı izleyin.',
  canli: 'Uluslararası Uzay İstasyonu’nun anlık rotasını izleyin, Güneş fırtınalarının manyetik nabzını canlı takip edin.',
  yolculuk: 'Güneş Sistemi’nde durak durak üç boyutlu bir yolculuğa çıkın; gerçek J2000 efemeris konumlarında süzülün.',
};

export default function Home() {
  return (
    <div className="relative bg-ink text-paper">
      <HomeHero />

      {/* Table of contents — the seven chapters at a glance */}
      <section id="bolumler" aria-label="Bölümler" className="scroll-mt-16 border-t border-white/10 px-[var(--gutter)] py-16 sm:py-20">
        <div className="flex items-center gap-4">
          <span className="doc-kicker text-gold">İçindekiler</span>
          <span aria-hidden className="doc-rule flex-1" />
          <span className="doc-caption">{SECTIONS.length} bölüm</span>
        </div>
        <ol className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-7">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link href={s.href} className="group flex h-full flex-col justify-between gap-6 bg-ink p-5 transition-colors hover:bg-ink-2">
                <div>
                  <span className="doc-title text-4xl text-paper/50 transition-colors group-hover:text-paper">{s.chapter}</span>
                  <span className="doc-title mt-4 block text-xl text-paper">{s.title}</span>
                  <span className="doc-caption mt-1 block text-gold/80">{s.kicker}</span>
                </div>
                <p className="text-xs leading-relaxed text-paper/65 border-t border-white/5 pt-3">
                  {SECTION_SYNOPSES[s.id] ?? s.kicker}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SECTIONS.map((s, i) => (
        <ChapterPanel key={s.id} section={s} flip={i % 2 === 1} />
      ))}

      <OrbCanvas />
    </div>
  );
}
