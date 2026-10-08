import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, MoonStar, Satellite, Sunset } from 'lucide-react';
import { MoonDial } from '@/components/home/MoonDial';
import { SolarSystemBand } from '@/components/home/SolarSystemBand';
import { OrbCanvas } from '@/components/space/PlanetOrb';
import { AstronomicalEventGlyph, ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { events } from '@/data/events';
import { SECTIONS, moduleHref } from '@/data/sections';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';
import { SIGN_IN, SIGN_NAMES, dayKey, localMidnight, moonSign, nextMoonIngress, sunEvent } from '@/lib/astrology/dailySky';
import { mainPhasesBetween, monthSlug } from '@/lib/astrology/lunarCalendar';
import { eventSlug } from '@/lib/eventSlug';
import { ISS_CITIES, compass, fetchIssTle, visiblePasses } from '@/lib/issPasses';
import { moonPhase } from '@/lib/sky';
import { nameCase, timeLocative } from '@/lib/text';

// Ay, Güneş, ISS ve günlük burçlar her yarım saatte bir yeniden hesaplanır
export const revalidate = 1800;

const TZ = 'Europe/Istanbul';
const DAY = 86_400_000;
const time = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const dayTime = (d: Date) => d.toLocaleString('tr-TR', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ });
const inDays = (n: number) => (n === 0 ? 'bugün' : n === 1 ? 'yarın' : `${n} gün sonra`);

const SECTION_SYNOPSES: Record<string, string> = {
  harita: '3D gök küresini döndür; ekliptik, zodyak, takımyıldızlar ve gezegenlerin gerçek konumları.',
  takvim: 'Tutulmalar, meteor yağmurları, dolunaylar: gökyüzünün randevu defteri.',
  ansiklopedi: 'Güneş’ten Plüton’a 3D modeller ve 10 etkileşimli fizik laboratuvarı.',
  astroloji: 'Doğum haritası, transitler, Ay takvimi, burç uyumu ve günlük yorumlar.',
  gozlemevi: 'James Webb’in kızılötesi ve dev radyo teleskoplarının gözünden derin uzay.',
  canli: 'ISS’in anlık konumu, Güneş fırtınaları ve bu gece görülebilecek gezegenler.',
  yolculuk: 'Güneş Sistemi’nde durak durak, gerçek konumlarda üç boyutlu bir yolculuk.',
};

const QUICK_LINKS = [
  { href: '/astroloji/dogum-haritasi', label: 'Doğum haritası' },
  { href: '/astroloji/burc-uyumu', label: 'Burç uyumu' },
  { href: '/astroloji/ay-takvimi', label: 'Ay takvimi' },
  { href: '/astroloji/ay-bugun', label: 'Ay bugün hangi burçta?' },
  { href: '/canli/iss-gecisleri', label: 'ISS geçiş saatleri' },
  { href: '/harita/planetaryum', label: '3D gök küresi' },
];

function SectionHead({ id, kicker, title, accent, link }: { id: string; kicker: string; title: string; accent: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gold">{kicker}</p>
        <h2 id={id} className="mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] text-paper">
          {title} <span className="doc-serif text-gold">{accent}</span>
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-paper/80 hover:text-gold">
          {link.label} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

function TodayCard({ href, icon, label, value, note }: { href: string; icon: ReactNode; label: string; value: string; note: string }) {
  return (
    <Link href={href} className="group flex flex-col gap-2 bg-ink p-4 transition-colors hover:bg-ink-2 sm:p-6">
      <span className="flex items-center gap-2 text-sm text-paper/65">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="text-lg font-semibold tracking-tight text-paper sm:text-2xl">{value}</span>
      <span className="text-sm leading-snug text-paper/70">{note}</span>
      <ArrowUpRight size={16} className="mt-auto self-end text-paper/40 transition-colors group-hover:text-gold" />
    </Link>
  );
}

export default async function Home() {
  const now = new Date();
  const today = dayKey(now);
  const moon = moonPhase(now);
  const moonIn = moonSign(now);
  const ingress = nextMoonIngress(now);
  const sunrise = sunEvent(now, true);
  const sunset = sunEvent(now, false);
  const tomorrowSunrise = sunEvent(new Date(localMidnight(now, 1) + DAY / 2), true);
  const dayLength = Math.round((sunset.getTime() - sunrise.getTime()) / 60_000);
  const nextPhase = mainPhasesBetween(now.getTime(), now.getTime() + 32 * DAY)[0];
  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)
    .map((e) => ({ ...e, days: Math.round((Date.parse(e.date) - Date.parse(today)) / DAY) }));
  const next = upcoming[0];
  const readings = ZODIAC_SIGNS.map((s) => ({ sign: s, reading: dailyReading(s.id, now) }));

  const istanbul = ISS_CITIES.find((c) => c.slug === 'istanbul') ?? ISS_CITIES[0];
  const tle = await fetchIssTle();
  const iss = tle ? visiblePasses(tle, istanbul, now, 5)[0] : undefined;

  const dateLine = now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
  const sunLine = now < sunset ? `Güneş bugün ${timeLocative(time(sunset), '’')} batıyor` : `Güneş ${timeLocative(time(sunset), '’')} battı; yarın ${timeLocative(time(tomorrowSunrise), '’')} doğacak`;
  const summary = `Ay %${Math.round(moon.illumination * 100)} aydınlık, ${moon.name} evresinde ve ${SIGN_IN[moonIn]}. ${sunLine}.${
    next ? ` Sıradaki gök olayı ${inDays(next.days)}: ${next.title}.` : ''
  }`;

  return (
    // data-home: iç sayfalara özel sakin tipografi (globals.css "İç sayfalar") ana sayfaya uygulanmasın
    <div data-home data-generated={now.toISOString()} className="relative bg-ink text-paper" style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      {/* Bu gece: bugünün Ay'ı ve gökyüzünün kısa özeti */}
      <section aria-labelledby="bu-gece" className="relative isolate overflow-hidden px-[var(--gutter)] pb-16 pt-28 sm:pt-32 lg:flex lg:min-h-[92svh] lg:items-center">
        <div aria-hidden className="absolute -right-[10%] top-[6%] -z-10 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgb(233_196_106/0.07),transparent_65%)]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-sm text-paper/70">
              <span className="font-medium capitalize text-gold">{dateLine}</span> · İstanbul gökyüzü
            </p>
            <h1 id="bu-gece" className="mt-5 text-[clamp(2.6rem,6.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-paper">
              Bu gece gökyüzünde <span className="doc-serif text-gold">neler var?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">{summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/canli/bu-gece" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90">
                Bu gece ne görünür? <ArrowRight size={16} />
              </Link>
              <Link href="/harita/planetaryum" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-medium text-paper backdrop-blur-xl transition-colors hover:border-gold/60 hover:text-gold">
                3D gök küresi <ArrowUpRight size={15} />
              </Link>
            </div>
            <p className="mt-10 text-sm text-paper/55">SpaceTour TR · NASA, ESA ve JPL verileriyle Türkçe gökyüzü rehberi</p>
          </div>
          <div className="lg:col-span-5">
            <MoonDial fraction={moon.fraction} illumination={moon.illumination} name={moon.name} age={moon.age} />
          </div>
        </div>
      </section>

      {/* Günün dört bilgisi */}
      <section aria-label="Bugün gökyüzü" className="px-[var(--gutter)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          <TodayCard
            href="/astroloji/ay-bugun"
            icon={<MoonStar size={16} />}
            label="Ay’ın burcu"
            value={`Ay ${SIGN_IN[moonIn]}`}
            note={`${dayTime(ingress.at)} ${nameCase(SIGN_NAMES[ingress.sign], 'yonelme', '’')} geçer`}
          />
          <TodayCard
            href="/canli/bu-gece"
            icon={<Sunset size={16} />}
            label="Gün doğumu · batımı"
            value={`${time(sunrise)} – ${time(sunset)}`}
            note={`Gün ${Math.floor(dayLength / 60)} saat ${dayLength % 60} dakika sürüyor`}
          />
          <TodayCard
            href="/canli/iss-gecisleri/istanbul"
            icon={<Satellite size={16} />}
            label="ISS İstanbul’dan"
            value={iss ? time(iss.start) : tle ? 'Geçiş yok' : 'ISS geçişleri'}
            note={
              iss
                ? `${iss.start.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ })} · ${compass(iss.startAz)} → ${compass(iss.endAz)} · ${Math.round(iss.maxEl)}°`
                : tle
                  ? 'Önümüzdeki 5 günde görünür geçiş yok'
                  : '16 şehir için görünür geçiş saatleri'
            }
          />
          {nextPhase ? (
            <TodayCard
              href={`/astroloji/ay-takvimi/${monthSlug(Number(dayKey(nextPhase.at).slice(0, 4)), Number(dayKey(nextPhase.at).slice(5, 7)) - 1)}`}
              icon={<MoonStar size={16} />}
              label="Sıradaki ana evre"
              value={nextPhase.name}
              note={`${nextPhase.at.toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: TZ })} · ${SIGN_IN[nextPhase.sign]}`}
            />
          ) : (
            <TodayCard href="/astroloji/ay-takvimi" icon={<MoonStar size={16} />} label="Ay takvimi" value="Ay evreleri" note="Dolunay, yeni Ay ve dördün saatleri" />
          )}
        </div>
      </section>

      {/* Günlük burç yorumları */}
      <section aria-labelledby="burclar" className="px-[var(--gutter)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            id="burclar"
            kicker={`Günlük burç · ${now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: TZ })}`}
            title="Bugün burcun için"
            accent="ne diyor?"
            link={{ href: '/astroloji/gunluk-burc', label: 'Günlük burç sayfası' }}
          />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {readings.map(({ sign, reading }) => (
              <li key={sign.id}>
                <Link href={`/astroloji/gunluk-burc/${sign.id}`} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-gold/60 hover:bg-white/[0.04]">
                  <ZodiacGlyph sign={sign.id} size={26} className="text-gold" />
                  <span className="mt-3 font-semibold text-paper">{sign.name}</span>
                  <span className="text-xs text-paper/55">{sign.dates}</span>
                  <span className="mt-3 line-clamp-3 text-sm leading-snug text-paper/75">{reading.headline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Yaklaşan gök olayları ve hızlı erişim */}
      <section aria-labelledby="olaylar" className="px-[var(--gutter)] pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHead id="olaylar" kicker="Takvim" title="Yaklaşan" accent="gök olayları" link={{ href: '/takvim', label: 'Tüm takvim' }} />
            <ol className="mt-6">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <Link href={`/takvim/${eventSlug(e)}`} className="group grid grid-cols-[3rem_1fr] items-center gap-4 border-t border-white/10 py-4 sm:grid-cols-[4.5rem_1fr_auto]">
                    <span className="text-center leading-none">
                      <span className="block text-2xl font-semibold tabular-nums text-paper">{Number(e.date.slice(8, 10))}</span>
                      <span className="mt-1 block text-xs text-paper/60">
                        {new Date(`${e.date}T12:00:00Z`).toLocaleDateString('tr-TR', { month: 'short', timeZone: 'UTC' })}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium text-paper group-hover:text-gold">
                        <AstronomicalEventGlyph type={e.type} size={16} className="shrink-0 text-gold" />
                        <span className="sm:truncate">{e.title}</span>
                      </span>
                      <span className="mt-1 line-clamp-2 text-sm text-paper/65 sm:line-clamp-1">{e.description}</span>
                      <span className="mt-1 block text-sm tabular-nums text-gold sm:hidden">{inDays(e.days)}</span>
                    </span>
                    <span className="hidden text-right text-sm tabular-nums text-gold sm:block">{inDays(e.days)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <aside aria-labelledby="hizli" className="lg:col-span-4">
            <p className="text-sm font-medium text-gold">Kısayollar</p>
            <h2 id="hizli" className="mt-2 text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em] text-paper">
              En çok <span className="doc-serif text-gold">kullanılanlar</span>
            </h2>
            <ul className="mt-6 space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-paper/85 transition-colors hover:border-gold/60 hover:text-gold">
                    {l.label} <ArrowUpRight size={15} />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <SolarSystemBand />

      {/* Yedi bölüm */}
      <section id="bolumler" aria-labelledby="bolumler-baslik" className="scroll-mt-16 px-[var(--gutter)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="bolumler-baslik" kicker={`${SECTIONS.length} bölüm`} title="Sitede" accent="neler var?" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className={i === 0 ? 'sm:col-span-2' : ''}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-2 transition-colors hover:border-white/25">
                  <Link href={s.href} tabIndex={-1} aria-hidden className="relative block h-36 overflow-hidden sm:h-44">
                    <Image src={s.image.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-medium" style={{ color: s.accent }}>
                      Bölüm {s.chapter}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-paper">
                      <Link href={s.href} className="hover:text-gold">
                        {s.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/70">{SECTION_SYNOPSES[s.id] ?? s.lede}</p>
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {s.modules.slice(0, 3).map((m) => (
                        <li key={m.slug}>
                          <Link href={moduleHref(s, m)} className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-paper/80 transition-colors hover:border-gold/60 hover:text-gold">
                            {m.short}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OrbCanvas />
    </div>
  );
}
