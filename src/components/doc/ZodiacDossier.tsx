import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Briefcase, Compass, Heart, Sprout, Telescope, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS, type ZodiacSign } from '@/data/zodiac';
import { ELEMENT_INFO, MODALITY_INFO, ZODIAC_PROFILES } from '@/data/zodiacProfiles';
import type { AstroImage } from '@/data/astroImages';

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const CLASSICAL_RULER: Record<string, string> = { akrep: 'Mars', kova: 'Satürn', balik: 'Jüpiter' };

function fmtRange(a: Date, b: Date) {
  return a.getUTCMonth() === b.getUTCMonth()
    ? `${a.getUTCDate()} – ${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}`
    : `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} – ${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}`;
}

/** Three decans of ~10° each; sub-rulers follow the triplicity (signs of the same element). */
function decans(sign: ZodiacSign, index: number) {
  const year = sign.startMonth > sign.endMonth ? 2025 : 2026;
  const start = Date.UTC(year, sign.startMonth - 1, sign.startDay);
  const end = Date.UTC(2026, sign.endMonth - 1, sign.endDay);
  return [0, 1, 2].map((k) => {
    const sub = ZODIAC_SIGNS[(index + k * 4) % 12];
    const a = new Date(start + k * 10 * 86_400_000);
    const b = k === 2 ? new Date(end) : new Date(start + (k * 10 + 9) * 86_400_000);
    return { k, degrees: `${k * 10}° – ${k * 10 + 10}°`, sub, ruler: CLASSICAL_RULER[sub.id] ?? sub.rulingPlanet, dates: fmtRange(a, b) };
  });
}

function Part({ kicker, title, children }: { kicker: string; title: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-4">
        <span className="doc-kicker text-gold">{kicker}</span>
        <span className="doc-rule w-16" aria-hidden />
      </div>
      <h2 className="doc-title mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-paper">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Long-form dossier body for a sign: character, life areas, decans, dignities, myth and sky. */
export function ZodiacDossier({ sign, index, image }: { sign: ZodiacSign; index: number; image: AstroImage }) {
  const p = ZODIAC_PROFILES[sign.id];
  if (!p) return null;
  const opposite = ZODIAC_SIGNS[(index + 6) % 12];
  const sameElement = ZODIAC_SIGNS.filter((x) => x.element === sign.element && x.id !== sign.id);
  const sameModality = ZODIAC_SIGNS.filter((x) => x.modality === sign.modality && x.id !== sign.id);
  const element = ELEMENT_INFO[sign.element];

  const areas = [
    { icon: Heart, title: 'Aşk & ilişkiler', text: p.love, color: 'text-rose' },
    { icon: Briefcase, title: 'Kariyer & para', text: p.career, color: 'text-solar' },
    { icon: Users, title: 'Dostluk & sosyal hayat', text: p.friendship, color: 'text-sky-300' },
    { icon: Sprout, title: 'Gelişim alanı', text: p.growth, color: 'text-lime' },
  ];

  return (
    <div className="space-y-24">
      <Part kicker="Kısım I · Karakter" title={<>{sign.name} <span className="doc-serif lowercase text-gold">nasıl biridir?</span></>}>
        <ul className="flex flex-wrap gap-2">
          {p.keywords.map((k) => (
            <li key={k} className="doc-kicker rounded-full border border-gold/40 px-3 py-1.5 text-[10px] text-gold">{k}</li>
          ))}
        </ul>
        <p className="doc-serif mt-8 max-w-3xl text-[clamp(1.25rem,2vw,1.7rem)] leading-snug text-paper/90">{p.personality}</p>
      </Part>

      <Part kicker="Kısım II · Hayatın alanları" title={<>Gündelik <span className="doc-serif lowercase text-gold">yansımalar</span></>}>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2">
          {areas.map(({ icon: Icon, title, text, color }) => (
            <article key={title} className="bg-ink p-6 sm:p-8">
              <h3 className={`flex items-center gap-2 doc-kicker ${color}`}>
                <Icon size={15} aria-hidden /> {title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/80">{text}</p>
            </article>
          ))}
        </div>
      </Part>

      <Part kicker="Kısım III · Dekanlar ve onurlar" title={<>Üç yüz, <span className="doc-serif lowercase text-gold">dört gezegen</span></>}>
        <p className="max-w-2xl text-[15px] leading-relaxed text-paper/70">
          Her burç 30°’lik bir dilimdir ve geleneksel astrolojide 10°’lik üç dekana ayrılır. Her dekan, aynı elementten bir burcun tonunu taşır;
          bu yüzden aynı burçta doğanlar bile birbirinden farklı hissedebilir.
        </p>
        <ol className="mt-8 grid gap-px bg-white/10 md:grid-cols-3">
          {decans(sign, index).map((d) => (
            <li key={d.k} className="bg-ink p-6">
              <div className="doc-caption">{d.k + 1}. dekan · {d.degrees}</div>
              <div className="mt-4 flex items-center gap-3">
                <ZodiacGlyph sign={d.sub.id} size={28} className="text-gold" />
                <div>
                  <div className="doc-title text-xl text-paper">{d.sub.name} tonu</div>
                  <div className="text-xs text-paper/60">Alt yönetici: {d.ruler}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-paper/75">Yaklaşık {d.dates}</div>
            </li>
          ))}
        </ol>
        <dl className="mt-px grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {[
            ['Yönetici', sign.rulingPlanet],
            ['Yücelen', p.dignity.exaltation ?? '—'],
            ['Zararda', p.dignity.detriment],
            ['Düşüşte', p.dignity.fall ?? '—'],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink-2 px-6 py-5">
              <dt className="doc-caption">{k}</dt>
              <dd className="doc-title mt-2 text-lg text-paper">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 doc-caption normal-case tracking-normal">
          Yücelen gezegen bu burçta en güçlü, zarardaki ve düşüşteki gezegenler ise en zorlanan ifadesini bulur (klasik gezegen onurları).
        </p>
      </Part>

      <Part kicker="Kısım IV · Element ve eksen" title={<>{sign.element} <span className="doc-serif lowercase text-gold">· {sign.modality.toLowerCase()}</span></>}>
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-ink p-6">
            <div className="doc-caption">Element · {element.polarity}</div>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{element.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sameElement.map((x) => (
                <Link key={x.id} href={`/astroloji/burclar/${x.id}`} className="rounded-full border border-white/15 px-3 py-2 text-xs text-paper/80 hover:border-gold hover:text-gold">{x.name}</Link>
              ))}
            </div>
          </div>
          <div className="bg-ink p-6">
            <div className="doc-caption">Nitelik · {sign.modality}</div>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">{MODALITY_INFO[sign.modality]}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sameModality.map((x) => (
                <Link key={x.id} href={`/astroloji/burclar/${x.id}`} className="rounded-full border border-white/15 px-3 py-2 text-xs text-paper/80 hover:border-gold hover:text-gold">{x.name}</Link>
              ))}
            </div>
          </div>
          <Link href={`/astroloji/burclar/${opposite.id}`} className="group bg-ink p-6 transition-colors hover:bg-ink-2">
            <div className="doc-caption">Karşıt burç · eksen</div>
            <div className="mt-3 flex items-center gap-3">
              <ZodiacGlyph sign={opposite.id} size={30} className="text-gold" />
              <span className="doc-title text-2xl text-paper">{opposite.name}</span>
              <ArrowUpRight size={15} className="ml-auto text-paper/40 group-hover:text-gold" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              Zodyakta tam karşıdaki burç: biri neyi eksik bırakırsa öteki onu tamamlar; ikisi birlikte bir denge ekseni oluşturur.
            </p>
          </Link>
        </div>
        <p className="mt-4 text-sm text-paper/60">Geleneksel beden eşlemesi: <span className="text-paper/85">{p.body}</span></p>
      </Part>

      <Part kicker="Kısım V · Mitoloji" title={p.myth.title}>
        <div className="grid gap-10 lg:grid-cols-5 lg:items-center">
          <figure className="relative aspect-[4/5] overflow-hidden border border-white/10 lg:col-span-2">
            <Image src={image.src} alt={`${sign.name} takımyıldızı, Urania’s Mirror (1824)`} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover sepia-[.3]" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4 doc-caption">Görsel · {image.credit}</figcaption>
          </figure>
          <p className="text-[17px] leading-relaxed text-paper/85 lg:col-span-3">{p.myth.text}</p>
        </div>
      </Part>

      <Part kicker="Kısım VI · Gökyüzünde" title={<>Gerçek <span className="doc-serif lowercase text-gold">takımyıldız</span></>}>
        <p className="max-w-2xl text-[15px] leading-relaxed text-paper/70">
          Burç tarihleri ile Güneş’in gökyüzünde gerçekten önünden geçtiği takımyıldız artık aynı değil: Dünya’nın ekseni yaklaşık 26.000 yılda bir
          tur atar (presesyon) ve burç takvimi iki bin yıl önceki gökyüzüne göre kurulmuştur.
        </p>
        <dl className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Burç tarihleri', sign.dates],
            ['Güneş gerçekte', p.sky.sunTransit],
            ['En parlak yıldız', p.sky.brightestStar],
            ['Türkiye’den en iyi', p.sky.season],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink p-6">
              <dt className="doc-caption">{k}</dt>
              <dd className="mt-2 text-[15px] leading-snug text-paper">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-px grid gap-px bg-white/10 md:grid-cols-3">
          {p.sky.highlights.map((h) => (
            <li key={h} className="flex gap-3 bg-ink-2 p-6 text-sm leading-relaxed text-paper/80">
              <Compass size={16} className="mt-0.5 shrink-0 text-sky-300" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
        <Link href="/harita/planetaryum" className="group mt-6 inline-flex items-center gap-2 text-sm text-paper/80 hover:text-gold">
          <Telescope size={16} /> {sign.name} takımyıldızını canlı planetaryumda bul
          <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Part>

      <p className="border-t border-white/10 pt-6 text-xs leading-relaxed text-paper/50">
        Astroloji bilimsel bir yöntem değildir; bu sayfada binlerce yıllık bir kültürel gelenek olarak, gökbilimin gerçek verileriyle yan yana sunulur.
      </p>
    </div>
  );
}
