'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useInView } from '@/lib/useInView';
import { usePolledJson } from '@/lib/usePolledJson';
import { getSunEquatorial } from '@/lib/astrophysics/skyDomeEphemeris';
import { compassPoint } from '@/lib/astrophysics/skyTonight';
import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';
import { foldTr } from '@/lib/text';

// Public, CORS-enabled position feed for NORAD 25544 (the ISS)
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';

interface IssPosition {
  latitude: number;
  longitude: number;
  altitude: number; // km
  velocity: number; // km/h
  visibility: 'daylight' | 'eclipsed' | 'visible';
  timestamp: number; // unix seconds
}

const CITIES: Record<string, { lat: number; lon: number }> = {
  İstanbul: { lat: 41.0082, lon: 28.9784 },
  Ankara: { lat: 39.9334, lon: 32.8597 },
  İzmir: { lat: 38.4237, lon: 27.1428 },
  Antalya: { lat: 36.8969, lon: 30.7133 },
  Bursa: { lat: 40.1885, lon: 29.061 },
};

const EARTH_RADIUS_KM = 6371;
const DEG = Math.PI / 180;

/** Ground distance, bearing and elevation of the ISS as seen from an observer. */
function lookAngles(obsLat: number, obsLon: number, iss: IssPosition) {
  const φ1 = obsLat * DEG;
  const φ2 = iss.latitude * DEG;
  const Δλ = (iss.longitude - obsLon) * DEG;
  const central = Math.acos(
    Math.min(1, Math.max(-1, Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)))
  );
  const bearing =
    (Math.atan2(Math.sin(Δλ) * Math.cos(φ2), Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)) / DEG +
      360) %
    360;
  const ratio = EARTH_RADIUS_KM / (EARTH_RADIUS_KM + iss.altitude);
  const elevation = Math.atan2(Math.cos(central) - ratio, Math.sin(central)) / DEG;
  return { distanceKm: central * EARTH_RADIUS_KM, bearing, elevation };
}

export function IssTracker() {
  const root = useRef<HTMLDivElement>(null);
  const visible = useInView(root);
  const { data, error } = usePolledJson<IssPosition>(ISS_API, 5000, visible);
  const [selectedCity, setSelectedCity] = useState<string>('İstanbul');

  const view = useMemo(() => {
    if (!data) return null;
    const city = CITIES[selectedCity] ?? CITIES['İstanbul'];
    const look = lookAngles(city.lat, city.lon, data);
    const when = new Date(data.timestamp * 1000);
    const sun = getSunEquatorial(when);
    const sunAlt = raDecToAltAz(sun.ra, sun.dec, city.lat, getLocalSiderealTime(when, city.lon)).alt;
    const sunlit = data.visibility !== 'eclipsed';
    const nakedEye = look.elevation > 10 && sunlit && sunAlt < -6;
    const verdict = nakedEye
      ? 'Şu an çıplak gözle görülebilir!'
      : look.elevation > 0
        ? sunAlt >= -6
          ? 'Ufkun üstünde, ama gökyüzü fazla aydınlık'
          : 'Ufkun üstünde, ama Dünya’nın gölgesinde'
        : 'Ufkun altında';
    return { look, nakedEye, verdict };
  }, [data, selectedCity]);

  const status = error && !data ? 'BAĞLANTI YOK' : data ? 'CANLI KONUM' : 'BAĞLANIYOR';

  return (
    <div ref={root} className="relative ticks border border-line bg-ink p-4 sm:p-8 space-y-5">
      {/* Başlık ve bağlantı durumu */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-center">
        <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
          Uluslararası Uzay İstasyonu (ISS) canlı yörüngesi
        </h3>
        <span
          className={`inline-flex shrink-0 items-center gap-2 text-xs font-medium ${
            data && !error ? 'text-lime' : 'text-paper/70'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${data && !error ? 'bg-lime motion-safe:animate-pulse' : 'bg-paper/40'}`}
          />
          {status}
        </span>
      </div>

      {/* Anlık telemetri */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4" aria-live="polite">
        <div className="bg-ink p-3 sm:p-4">
          <span className="block text-sm text-paper/70">Enlem</span>
          <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-paper sm:text-lg">
            {data ? `${Math.abs(data.latitude).toFixed(2)}° ${data.latitude >= 0 ? 'K' : 'G'}` : '—'}
          </span>
        </div>

        <div className="bg-ink p-3 sm:p-4">
          <span className="block text-sm text-paper/70">Boylam</span>
          <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-paper sm:text-lg">
            {data ? `${Math.abs(data.longitude).toFixed(2)}° ${data.longitude >= 0 ? 'D' : 'B'}` : '—'}
          </span>
        </div>

        <div className="bg-ink p-3 sm:p-4">
          <span className="block text-sm text-paper/70">İrtifa</span>
          <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-solar sm:text-lg">
            {data ? `${data.altitude.toFixed(1)} km` : '—'}
          </span>
        </div>

        <div className="bg-ink p-3 sm:p-4">
          <span className="block text-sm text-paper/70">Hız</span>
          <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-paper sm:text-lg">
            {data ? `${Math.round(data.velocity).toLocaleString('tr-TR')} km/sa` : '—'}
          </span>
        </div>
      </div>

      {/* Türkiye'deki şehirlerden anlık görünüm */}
      <div className="space-y-3">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-paper/80">Şehrinden şu anki görünüm</span>

          {/* Şehir seçimi */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Şehir seç">
            {Object.keys(CITIES).map((cityName) => (
              <button
                key={cityName}
                type="button"
                aria-pressed={selectedCity === cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`min-h-9 border px-3 text-sm transition-colors cursor-pointer ${
                  selectedCity === cityName
                    ? 'border-solar bg-solar text-ink font-semibold'
                    : 'border-line text-paper/80 hover:border-paper/40 hover:text-paper'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          <div className="bg-ink p-4">
            <span className="block text-sm text-paper/70">Yer izine uzaklık</span>
            <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-paper sm:text-lg">
              {view ? `${Math.round(view.look.distanceKm).toLocaleString('tr-TR')} km` : '—'}
            </span>
            <span className="mt-1 block text-sm text-paper/70">
              Yön: <span className="text-paper">{view ? compassPoint(view.look.bearing) : '—'}</span>
            </span>
          </div>

          <div className="bg-ink p-4">
            <span className="block text-sm text-paper/70">Ufuktan yükseklik</span>
            <span className="mt-1 block font-mono text-base font-semibold tabular-nums text-paper sm:text-lg">
              {view ? `${view.look.elevation.toFixed(1)}°` : '—'}
            </span>
            <span className="mt-1 block text-sm leading-snug text-paper/80">10° üstü çıplak gözle takip için yeterli</span>
          </div>

          <div className="bg-ink p-4">
            <span className="block text-sm text-paper/70">Durum</span>
            <span
              className={`mt-1 block text-base font-medium leading-snug ${view?.nakedEye ? 'text-lime' : 'text-paper'}`}
            >
              {view?.verdict ?? '—'}
            </span>
            <Link
              href={`/canli/iss-gecisleri/${foldTr(selectedCity)}`}
              className="mt-1 inline-flex min-h-9 items-center gap-1 text-sm text-solar hover:underline"
            >
              {selectedCity} geçiş saatleri <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-paper/80">
        <div>
          Optik durum:{' '}
          <strong className="font-medium text-paper">
            {!data ? '—' : data.visibility === 'eclipsed' ? 'Dünya gölgesinde' : 'Güneş ışığında'}
          </strong>
        </div>
        <div>
          Dünya çevresinde bir tur:{' '}
          <strong className="font-medium text-paper">
            <span className="font-mono tabular-nums">~92.7</span> dakika (günde 16 gün doğumu)
          </strong>
        </div>
      </div>
    </div>
  );
}
