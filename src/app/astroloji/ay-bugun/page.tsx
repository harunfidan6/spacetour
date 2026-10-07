import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { DOC_IMAGES } from '@/data/docImages';
import { MOON_SIGN_ATMOSPHERES } from '@/data/lunarPhases';
import { events } from '@/data/events';
import { eventSlug } from '@/lib/eventSlug';
import { getMoonPhase } from '@/lib/astrophysics/skyDomeEphemeris';
import { longitude, localMidnight, moonSign, nextMoonIngress, voidOfCourse, SIGN_IDS, SIGN_NAMES, SIGN_IN } from '@/lib/astrology/dailySky';
import { buildPageMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { MONTH_NAMES, monthSlug } from '@/lib/astrology/lunarCalendar';

// Ay ~2,5 günde bir burç değiştirir: sayfa 15 dakikada bir yeniden üretilir
export const revalidate = 900;

export const metadata: Metadata = buildPageMetadata({
  path: '/astroloji/ay-bugun',
  title: 'Ay Bugün Hangi Burçta? Ay’ın Konumu ve Evresi | SpaceTour TR',
  description: 'Ay şu an hangi burçta, kaç derecede, hangi evrede? Bir sonraki burç geçişi, boşlukta Ay saatleri ve önümüzdeki 7 günün Ay takvimi; İstanbul saatiyle.',
});

const TZ = 'Europe/Istanbul';
const fmt = (d: Date) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ });
const fmtDay = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short', timeZone: TZ });

export default function AyBugunPage() {
  const now = new Date();
  const lon = longitude('moon', now);
  const sign = moonSign(now);
  const deg = Math.floor(((lon % 30) + 30) % 30);
  const phase = getMoonPhase(now);
  const ingress = nextMoonIngress(now);
  const voc = voidOfCourse(now);
  const mood = MOON_SIGN_ATMOSPHERES[SIGN_IDS[sign]];
  const today = now.toLocaleDateString('sv-SE', { timeZone: TZ });
  const lunations = events.filter((e) => ['dolunay', 'yeni-ay', 'super-ay'].includes(e.type) && e.date >= today).slice(0, 3);
  const week = Array.from({ length: 7 }, (_, i) => {
    const noon = new Date(localMidnight(now, i) + 12 * 3_600_000);
    const s = moonSign(noon);
    return { day: fmtDay(noon), sign: s, phase: getMoonPhase(noon).name };
  });

  const faq = [
    { q: 'Ay bugün hangi burçta?', a: `Ay şu an ${SIGN_NAMES[sign]} burcunun ${deg}. derecesinde. ${fmt(ingress.at)} itibarıyla ${SIGN_NAMES[ingress.sign]} burcuna geçecek.` },
    { q: 'Ay hangi evrede?', a: `Ay ${phase.name} evresinde; yüzeyinin yaklaşık %${Math.round(phase.illumination * 100)} kadarı aydınlık ve yeni Ay’dan bu yana ${phase.ageDays.toFixed(1)} gün geçti.` },
    { q: 'Boşlukta Ay ne demek?', a: 'Ay’ın bulunduğu burçta Güneş ya da klasik gezegenlerle son tam açısını yaptığı andan bir sonraki burca geçene kadar geçen süredir. Gelenekte bu aralık yeni başlangıçlar yerine rutin işler ve dinlenme için uygun sayılır.' },
    { q: 'Ay bir burçta ne kadar kalır?', a: 'Ay zodyağı yaklaşık 27,3 günde dolaşır; bu yüzden her burçta ortalama 2,3 gün kalır ve kabaca iki buçuk günde bir burç değiştirir.' },
  ];
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Ay bugün', url: '/astroloji/ay-bugun' },
  ]);

  return (
    // data-generated: yönetici panelindeki günlük içerik denetimi sayfanın üretildiği anı buradan okur
    <div style={{ '--page-accent': 'var(--primary, #38bdf8)' } as CSSProperties} className="relative" data-generated={now.toISOString()}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ChapterHero
        variant="band"
        chapter="04 · Ay"
        section={`Ay bugün · ${fmt(now)}`}
        headline={['Ay bugün', `${SIGN_IN[sign]}`]}
        lede={`Ay şu an ${SIGN_NAMES[sign]} burcunun ${deg}. derecesinde ve ${phase.name} evresinde (%${Math.round(phase.illumination * 100)} aydınlık). ${fmt(ingress.at)} itibarıyla ${SIGN_NAMES[ingress.sign]} burcuna geçiyor.`}
        accent="var(--primary, #38bdf8)"
        image={DOC_IMAGES['astro-ay-evreleri']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: 'Ay bugün' }]}
        meta={[
          { k: 'Burç', v: `${SIGN_NAMES[sign]} ${deg}°` },
          { k: 'Evre', v: phase.name },
          { k: 'Aydınlık', v: `%${Math.round(phase.illumination * 100)}` },
          { k: 'Sonraki burç', v: SIGN_NAMES[ingress.sign] },
        ]}
      />

      <section aria-label="Ay’ın bugünkü durumu" className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <article className="border-b border-line pb-8">
              <span className="doc-kicker text-gold">Duygusal iklim</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">Ay {SIGN_IN[sign]}: günün havası</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{mood?.emotionalClimate}</p>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{mood?.cosmicFocus}</p>
            </article>
            <article className="border-b border-line pb-8">
              <span className="doc-kicker text-gold">Boşlukta Ay</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">{voc.isVoid ? 'Ay şu an boşlukta' : 'Sıradaki boşlukta Ay penceresi'}</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">
                {voc.isVoid
                  ? `Ay ${fmt(voc.start)} itibarıyla boşlukta; ${fmt(voc.end)} saatinde ${SIGN_NAMES[voc.nextSign]} burcuna geçince sona erecek. Bu aralıkta yeni başlangıçlar yerine rutin işler önerilir.`
                  : `Bir sonraki boşlukta Ay penceresi ${fmt(voc.start)} – ${fmt(voc.end)} arasında.`}
              </p>
            </article>
            <article className="border-b border-line pb-8">
              <span className="doc-kicker text-gold">Bakım ve iyi oluş</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">Ay {SIGN_IN[sign]} iken</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{mood?.nourishmentTip} {mood?.beautySelfCare}</p>
            </article>
            <div>
              <h2 className="doc-title text-2xl text-paper">Önümüzdeki 7 gün</h2>
              <table className="mt-4 w-full border border-line font-mono text-xs">
                <thead>
                  <tr className="bg-ink-2 text-left text-muted"><th className="p-3 font-normal">Gün (öğlen)</th><th className="p-3 font-normal">Ay’ın burcu</th><th className="p-3 font-normal">Evre</th></tr>
                </thead>
                <tbody>
                  {week.map((w) => (
                    <tr key={w.day} className="border-t border-line">
                      <td className="p-3 text-paper/85">{w.day}</td>
                      <td className="p-3 text-paper"><span className="inline-flex items-center gap-2"><ZodiacGlyph sign={SIGN_IDS[w.sign]} size={14} className="text-gold" />{SIGN_NAMES[w.sign]}</span></td>
                      <td className="p-3 text-paper/75">{w.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 className="doc-title text-2xl text-paper">Sık sorulanlar</h2>
              <dl className="mt-4 space-y-4">
                {faq.map((f) => (
                  <div key={f.q} className="border border-line bg-ink p-4">
                    <dt className="text-sm font-semibold text-paper">{f.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-paper/75">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5 font-mono text-xs">
              <div className="doc-kicker text-gold">Şu an</div>
              <div className="mt-3 flex items-center gap-3"><ZodiacGlyph sign={SIGN_IDS[sign]} size={32} className="text-gold" /><span className="doc-title text-2xl text-paper">{SIGN_NAMES[sign]} {deg}°</span></div>
              <div className="mt-4 space-y-1.5 text-paper/80">
                <div className="flex justify-between"><span className="text-muted">Evre</span><span>{phase.name}</span></div>
                <div className="flex justify-between"><span className="text-muted">Ay’ın yaşı</span><span>{phase.ageDays.toFixed(1)} gün</span></div>
                <div className="flex justify-between"><span className="text-muted">Uzaklık</span><span>{Math.round(phase.distanceKm).toLocaleString('tr-TR')} km</span></div>
                <div className="flex justify-between"><span className="text-muted">Sonraki burç</span><span>{SIGN_NAMES[ingress.sign]}</span></div>
              </div>
            </div>
            {lunations.length > 0 && (
              <div className="border border-line bg-ink-2 p-5 font-mono text-xs">
                <div className="doc-kicker text-gold">Yaklaşan dolunay ve yeni Ay</div>
                <ul className="mt-3 space-y-2">
                  {lunations.map((e) => (
                    <li key={e.id}><Link href={`/takvim/${eventSlug(e)}`} className="flex justify-between gap-3 text-paper/85 hover:text-gold"><span>{e.title}</span><span className="text-muted">{new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span></Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2 font-mono text-xs">
              <Link href={`/astroloji/ay-takvimi/${monthSlug(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1)}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">{MONTH_NAMES[Number(today.slice(5, 7)) - 1]} Ay takvimi <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/ay-evreleri" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Ay evreleri ve ritüeller <ArrowUpRight size={14} /></Link>
              <Link href="/astroloji/gunluk-burc" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Günlük burç yorumları <ArrowUpRight size={14} /></Link>
              <Link href="/takvim" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">Gök olayları takvimi <ArrowUpRight size={14} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
