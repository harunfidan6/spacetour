'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Telescope, ArrowRight, Clock } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
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
  Düşük: 'border-line text-paper/70',
  Görünmüyor: 'border-line text-muted',
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
    <div className="relative ticks border border-line bg-ink p-6 lg:p-8 space-y-6">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Telescope className="h-4 w-4 text-solar" />
            <span className="font-mono text-[10px] text-solar font-bold uppercase tracking-widest">
              GÖKYÜZÜ GÖZLEM RADARI · {ISTANBUL_SITE.city.toLocaleUpperCase('tr-TR')} · ANLIK HESAP
            </span>
          </div>
          <h3 className="display display-tight text-2xl text-paper sm:text-3xl">Bu Gece Gökyüzü</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {ISTANBUL_SITE.city}’dan bu gece çıplak gözle ve amatör teleskopla izlenebilecek gök cisimleri; konumlar
            JPL yörünge elemanlarıyla tarayıcında hesaplanır.
          </p>
        </div>

        {/* Tab Switcher */}
        <div role="group" aria-label="Gökyüzü görünümü" className="flex items-center gap-1.5 border border-line bg-ink-2 p-1 font-mono text-xs">
          {(
            [
              ['planets', 'Gezegenler'],
              ['moon', 'Ay Evresi'],
              ['quality', 'Gözlem Kalitesi'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={selectedTab === id}
              onClick={() => setSelectedTab(id)}
              className={`px-3 py-1.5 transition-colors cursor-pointer border uppercase tracking-wider ${
                selectedTab === id
                  ? 'border-solar bg-solar text-ink font-bold'
                  : 'border-transparent text-muted hover:text-paper'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(tonight?.planets ?? []).map((planet) => (
              <div
                key={planet.key}
                className="group border border-line bg-ink-2 p-4 hover:border-solar/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full border border-line/60 bg-ink flex items-center justify-center p-1.5 shadow-inner">
                    <PlanetGlyph planet={planet.key} size={18} className="text-solar group-hover:text-paper transition-colors" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${RATING_STYLE[planet.rating]}`}
                  >
                    {planet.rating}
                  </span>
                </div>

                <div className="font-mono text-base font-bold text-paper group-hover:text-solar transition-colors">
                  {planet.name}
                </div>
                <div className="text-[11px] font-mono text-muted mt-0.5">{planet.constellation}</div>

                <div className="mt-3 pt-2.5 border-t border-line text-[11px] font-mono space-y-1">
                  <div className="text-muted flex justify-between gap-2">
                    <span>Parlaklık:</span>
                    <span className="text-paper font-bold text-right">
                      {planet.magnitude >= 0 ? '+' : '−'}
                      {Math.abs(planet.magnitude).toFixed(1)} kadir · {brightnessNote(planet.magnitude)}
                    </span>
                  </div>
                  <div className="text-muted leading-snug pt-1 text-[10px] flex items-start gap-1.5">
                    <Clock size={11} className="text-solar shrink-0 mt-px" />
                    <span>{planetTiming(planet)}</span>
                  </div>
                </div>
              </div>
            ))}
            {!tonight &&
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} aria-hidden className="h-[168px] border border-line bg-ink-2 animate-pulse" />
              ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-muted font-mono flex items-center gap-2">
              <Sparkles size={14} className="text-solar" />
              <span>Gezegenlerin 3D konumlarını canlı haritada görmek için:</span>
            </div>
            <Link
              href="/harita"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-solar hover:underline"
            >
              <span>3D Planetaryum’u Aç</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Moon */}
      {selectedTab === 'moon' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 border border-line bg-ink-2 text-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 border border-line bg-ink rounded-full flex items-center justify-center p-3 shadow-inner">
                <VectorMoonPhase
                  illumination={moon ? Math.round(moon.illumination * 100) : 0}
                  waning={moon ? !moon.waxing : false}
                  size={54}
                  className="text-paper"
                />
              </div>
            </div>
            <div className="font-mono text-base font-bold text-paper">{moon?.phaseName ?? 'Hesaplanıyor'}</div>
            <div className="text-xs font-mono text-solar font-bold mt-1">
              {moon ? `%${Math.round(moon.illumination * 100)} Aydınlık · ${moon.ageDays.toFixed(1)} günlük` : '—'}
            </div>
          </div>

          <div className="md:col-span-8 space-y-3.5 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Doğuş Saati</span>
                <span className="font-bold text-paper text-sm">{hm(moon?.rise)}</span>
              </div>
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Batış Saati</span>
                <span className="font-bold text-paper text-sm">{hm(moon?.set)}</span>
              </div>
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Dünya’ya Mesafe</span>
                <span className="font-bold text-paper text-sm">
                  {moon ? `${Math.round(moon.distanceKm).toLocaleString('tr-TR')} km` : '—'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-ink-2 border border-line leading-relaxed text-muted text-xs">
              <strong className="text-paper">Gözlem İpucu:</strong>{' '}
              {!moon
                ? '—'
                : moon.illumination > 0.85
                  ? 'Parlak Ay ışığı bulutsu ve galaksileri soluklaştırır; bu gece gezegenlere ve çift yıldızlara odaklan.'
                  : moon.illumination < 0.15
                    ? 'Ay neredeyse karanlık: derin uzay bulutsuları ve Samanyolu için ayın en iyi gecelerinden biri.'
                    : 'Terminatör (aydınlık-karanlık sınırı) boyunca Tycho ve Copernicus gibi kraterler dürbünle bile keskin gölgelerle seçilir.'}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Quality */}
      {selectedTab === 'quality' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted uppercase">Astronomik Karanlık</span>
              <span className="text-xs font-bold text-lime">{dark ? `${hm(dark.start)}–${hm(dark.end)}` : '—'}</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-lime h-full" style={{ width: `${Math.min(100, (darkHours / 12) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              {dark
                ? `Güneş ufkun 18° altında: ${darkHours.toFixed(1)} saatlik tam karanlık pencere. Gün batımı ${hm(tonight?.sunset)}, gün doğumu ${hm(tonight?.sunrise)}.`
                : 'Bu gece Güneş 18° altına inmiyor; gökyüzü tam kararmayacak.'}
            </p>
          </div>

          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted uppercase">Ay Işığı Etkisi</span>
              <span className="text-xs font-bold text-solar">{moon ? `%${Math.round(moonGlare * 100)}` : '—'}</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-solar h-full" style={{ width: `${Math.round(moonGlare * 100)}%` }} />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              {moon
                ? `Ay %${Math.round(moon.illumination * 100)} aydınlık; karanlık saatlerde ufkun üstünde kalma oranı %${Math.round(moon.upDuringDarkFraction * 100)}.`
                : '—'}
            </p>
          </div>

          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted uppercase">Işık Kirliliği</span>
              <span className="text-xs font-bold text-rose">Bortle 8–9</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-rose h-full w-[88%]" />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              {ISTANBUL_SITE.city} merkezinden gezegenler ve Ay rahat izlenir; Samanyolu için şehirden en az 60–80 km uzaklaş.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
