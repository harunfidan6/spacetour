'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { PlanetGlyph, VectorMoonPhase } from '@/components/ui/CosmicGlyphs';
import { useNow } from '@/lib/useNow';
import { computeSkyTonight, ISTANBUL_SITE, type PlanetTonight } from '@/lib/astrophysics/skyTonight';

const timeFmt = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: ISTANBUL_SITE.timeZone,
});
const hm = (d: Date | null | undefined) => (d ? timeFmt.format(d) : '—');

const RATING_STYLE: Record<PlanetTonight['rating'], string> = {
  Mükemmel: 'border-lime/40 bg-lime/10 text-lime',
  İyi: 'border-solar/40 bg-solar/10 text-solar',
  Düşük: 'border-line text-paper/85',
  Görünmüyor: 'border-line text-paper/70',
};

function brightnessNote(mag: number): string {
  if (mag <= -3.5) return 'Göğün en parlağı';
  if (mag <= -1.5) return 'Çok parlak';
  if (mag <= 0.5) return 'Parlak';
  if (mag <= 2) return 'Kolay seçilir';
  return 'Soluk';
}

function planetTiming(p: PlanetTonight): string {
  if (!p.window || !p.peak) {
    return p.elongation < 20 ? "Güneş'e çok yakın; bu gece gözlenemez" : 'Karanlık saatlerde ufkun altında';
  }
  return `${hm(p.window.start)}–${hm(p.window.end)} · en iyi ${hm(p.peak.time)}, ${p.peak.direction} (${Math.round(p.peak.altitude)}°)`;
}

export function SkyTonightWidget() {
  const [selectedTab, setSelectedTab] = useState<'planets' | 'moon' | 'quality'>('planets');

  // Computed after mount (the page is prerendered) and refreshed every 10 minutes
  const now = useNow(600_000);
  const tonight = useMemo(() => (now ? computeSkyTonight(now) : null), [now]);

  const dark = tonight?.astroDark;
  const darkHours = dark ? (dark.end.getTime() - dark.start.getTime()) / 3_600_000 : 0;
  const moon = tonight?.moon;
  const moonGlare = moon ? moon.illumination * moon.upDuringDarkFraction : 0;

  return (
    <div className="border border-line bg-ink p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">Bu gece gökyüzü</h3>
          <p className="mt-1.5 text-sm text-paper/70">{ISTANBUL_SITE.city} · anlık hesap</p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
            {ISTANBUL_SITE.city}’dan bu gece çıplak gözle ve amatör teleskopla izlenebilecek gök cisimleri; konumlar
            JPL yörünge elemanlarıyla tarayıcında hesaplanır.
          </p>
        </div>

        {/* Tab Switcher */}
        <div role="group" aria-label="Gökyüzü görünümü" className="flex shrink-0 flex-wrap items-center gap-1.5">
          {(
            [
              ['planets', 'Gezegenler'],
              ['moon', 'Ay evresi'],
              ['quality', 'Gözlem kalitesi'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={selectedTab === id}
              onClick={() => setSelectedTab(id)}
              className={`min-h-9 px-3 py-1.5 text-sm transition-colors cursor-pointer border ${
                selectedTab === id
                  ? 'border-solar bg-solar text-ink font-semibold'
                  : 'border-line text-paper/75 hover:border-paper/40 hover:text-paper'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Planets */}
      {selectedTab === 'planets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {(tonight?.planets ?? []).map((planet) => (
              <div key={planet.key} className="flex min-w-0 flex-col bg-ink-2 p-4 transition-colors hover:bg-ink-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <PlanetGlyph planet={planet.key} size={20} className="shrink-0 text-solar" />
                    <div className="min-w-0">
                      <div className="font-display text-lg font-semibold leading-tight text-paper">{planet.name}</div>
                      <div className="text-sm text-paper/70">{planet.constellation}</div>
                    </div>
                  </div>
                  <span className={`shrink-0 border px-2 py-0.5 text-xs font-medium ${RATING_STYLE[planet.rating]}`}>
                    {planet.rating}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-paper/70">Parlaklık</span>
                    <span className="text-right text-paper">
                      <span className="font-mono font-medium tabular-nums">
                        {planet.magnitude >= 0 ? '+' : '−'}
                        {Math.abs(planet.magnitude).toFixed(1)} kadir
                      </span>
                      <span className="block text-paper/70">{brightnessNote(planet.magnitude)}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 leading-snug text-paper/80">
                    <Clock size={14} className="mt-0.5 shrink-0 text-paper/60" aria-hidden />
                    <span className="tabular-nums">{planetTiming(planet)}</span>
                  </div>
                </div>
              </div>
            ))}
            {!tonight &&
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} aria-hidden className="h-[168px] bg-ink-2 animate-pulse" />
              ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-sm text-paper/80">Gezegenlerin 3D konumlarını canlı haritada görmek için:</p>
            <Link
              href="/harita"
              className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-solar hover:underline"
            >
              <span>3D gök küresini aç</span>
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Moon */}
      {selectedTab === 'moon' && (
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="flex flex-col items-center justify-center border border-line bg-ink-2 p-6 text-center md:col-span-4">
            <VectorMoonPhase
              illumination={moon ? Math.round(moon.illumination * 100) : 0}
              waning={moon ? !moon.waxing : false}
              size={64}
              className="mb-3 text-paper"
            />
            <div className="font-display text-lg font-semibold text-paper">{moon?.phaseName ?? 'Hesaplanıyor'}</div>
            <div className="mt-1 font-mono text-sm tabular-nums text-solar">
              {moon ? `%${Math.round(moon.illumination * 100)} aydınlık · ${moon.ageDays.toFixed(1)} günlük` : '—'}
            </div>
          </div>

          <div className="space-y-5 md:col-span-8">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Doğuş saati</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-paper">{hm(moon?.rise)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Batış saati</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-paper">{hm(moon?.set)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Dünya’ya mesafe</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-paper">
                  {moon ? `${Math.round(moon.distanceKm).toLocaleString('tr-TR')} km` : '—'}
                </dd>
              </div>
            </dl>

            <p className="border-t border-line pt-4 text-base leading-relaxed text-paper/80">
              <strong className="font-semibold text-paper">Gözlem ipucu:</strong>{' '}
              {!moon
                ? '—'
                : moon.illumination > 0.85
                  ? 'Parlak Ay ışığı bulutsu ve galaksileri soluklaştırır; bu gece gezegenlere ve çift yıldızlara odaklan.'
                  : moon.illumination < 0.15
                    ? 'Ay neredeyse karanlık: derin uzay bulutsuları ve Samanyolu için ayın en iyi gecelerinden biri.'
                    : 'Terminatör (aydınlık-karanlık sınırı) boyunca Tycho ve Copernicus gibi kraterler dürbünle bile keskin gölgelerle seçilir.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab: Quality */}
      {selectedTab === 'quality' && (
        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          <div className="min-w-0 space-y-3 bg-ink-2 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-paper/85">Astronomik karanlık</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-lime">
                {dark ? `${hm(dark.start)}–${hm(dark.end)}` : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-paper/10">
              <div className="bg-lime h-full" style={{ width: `${Math.min(100, (darkHours / 12) * 100)}%` }} />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              {dark
                ? `Güneş ufkun 18° altında: ${darkHours.toFixed(1)} saatlik tam karanlık pencere. Gün batımı ${hm(tonight?.sunset)}, gün doğumu ${hm(tonight?.sunrise)}.`
                : 'Bu gece Güneş 18° altına inmiyor; gökyüzü tam kararmayacak.'}
            </p>
          </div>

          <div className="min-w-0 space-y-3 bg-ink-2 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-paper/85">Ay ışığı etkisi</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-solar">
                {moon ? `%${Math.round(moonGlare * 100)}` : '—'}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-paper/10">
              <div className="bg-solar h-full" style={{ width: `${Math.round(moonGlare * 100)}%` }} />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              {moon
                ? `Ay %${Math.round(moon.illumination * 100)} aydınlık; karanlık saatlerde ufkun üstünde kalma oranı %${Math.round(moon.upDuringDarkFraction * 100)}.`
                : '—'}
            </p>
          </div>

          <div className="min-w-0 space-y-3 bg-ink-2 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-paper/85">Işık kirliliği</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-rose">Bortle 8–9</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-paper/10">
              <div className="bg-rose h-full w-[88%]" />
            </div>
            <p className="text-sm leading-relaxed text-paper/80">
              {ISTANBUL_SITE.city} merkezinden gezegenler ve Ay rahat izlenir; Samanyolu için şehirden en az 60–80 km uzaklaş.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
