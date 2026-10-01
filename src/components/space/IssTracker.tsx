'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Satellite, Compass, Activity, Eye, ExternalLink, Sparkles, Ruler } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useInView } from '@/lib/useInView';
import { usePolledJson } from '@/lib/usePolledJson';
import { getSunEquatorial } from '@/lib/astrophysics/skyDomeEphemeris';
import { compassPoint } from '@/lib/astrophysics/skyTonight';
import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';

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
    <div ref={root} className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-5">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-solar animate-pulse" />
          <h3 className="display display-tight text-xl text-paper sm:text-2xl">
            ISS · Uluslararası Uzay İstasyonu Canlı Yörüngesi
          </h3>
        </div>
        <span
          className={`flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${
            data && !error ? 'border-lime/30 bg-lime/10 text-lime' : 'border-line text-muted'
          }`}
        >
          <span className={`h-1.5 w-1.5 ${data && !error ? 'bg-lime animate-ping' : 'bg-muted'}`} />
          {status}
        </span>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono" aria-live="polite">
        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">ENLEM</span>
          <span className="text-base font-bold text-paper mt-0.5 block">
            {data ? `${Math.abs(data.latitude).toFixed(2)}° ${data.latitude >= 0 ? 'K' : 'G'}` : '—'}
          </span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">BOYLAM</span>
          <span className="text-base font-bold text-paper mt-0.5 block">
            {data ? `${Math.abs(data.longitude).toFixed(2)}° ${data.longitude >= 0 ? 'D' : 'B'}` : '—'}
          </span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">İRTİFA</span>
          <span className="text-base font-bold text-solar mt-0.5 block">{data ? `${data.altitude.toFixed(1)} km` : '—'}</span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">HIZ</span>
          <span className="text-base font-bold text-paper mt-0.5 block">
            {data ? `${Math.round(data.velocity).toLocaleString('tr-TR')} km/sa` : '—'}
          </span>
        </div>
      </div>

      {/* Live view from Turkish cities */}
      <div className="border border-line bg-ink-2 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-line pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-paper">
            <Eye size={14} className="text-solar" />
            <span className="uppercase tracking-wider">Şehrinden Şu Anki Görünüm</span>
          </div>

          {/* City selector pills */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono" role="group" aria-label="Şehir seç">
            {Object.keys(CITIES).map((cityName) => (
              <button
                key={cityName}
                type="button"
                aria-pressed={selectedCity === cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`px-2 py-0.5 border text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCity === cityName
                    ? 'border-solar bg-solar text-ink font-bold'
                    : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">YER İZİNE UZAKLIK</span>
            <span className="text-sm font-bold text-paper flex items-center gap-1.5 mt-1">
              <Ruler size={12} className="text-solar" />
              {view ? `${Math.round(view.look.distanceKm).toLocaleString('tr-TR')} km` : '—'}
            </span>
            <span className="text-[10px] text-solar block mt-1">
              Yön: {view ? compassPoint(view.look.bearing) : '—'}
            </span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">UFUKTAN YÜKSEKLİK</span>
            <span className="text-sm font-bold text-paper flex items-center gap-1.5 mt-1">
              <Sparkles size={12} className="text-solar" />
              {view ? `${view.look.elevation.toFixed(1)}°` : '—'}
            </span>
            <span className="text-[10px] text-muted block mt-1">10° üstü çıplak gözle takip için yeterli</span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">DURUM</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 mt-1 ${view?.nakedEye ? 'text-lime' : 'text-paper'}`}>
              <Compass size={12} className="text-lime shrink-0" />
              {view?.verdict ?? '—'}
            </span>
            <a
              href="https://spotthestation.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-solar mt-1 inline-flex items-center gap-1 hover:underline"
            >
              Geçiş saatleri: NASA Spot the Station <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted pt-1 font-mono">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-solar" />
          <span>
            Optik Durum:{' '}
            <strong className="text-paper">
              {!data ? '—' : data.visibility === 'eclipsed' ? 'Dünya Gölgesinde' : 'Güneş Işığında'}
            </strong>
          </span>
        </div>
        <div>
          Dünya çevresinde bir tur: <strong className="text-paper">~92.7 dakika (Günde 16 gün doğumu)</strong>
        </div>
      </div>
    </div>
  );
}
