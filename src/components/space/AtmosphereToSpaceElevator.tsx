'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Rocket,
  Thermometer,
  Gauge,
  Wind,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Globe
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface LayerMilestone {
  altitudeKm: number;
  label: string;
  category: 'troposfer' | 'stratosfer' | 'mezosfer' | 'termosfer' | 'ekzosfer';
  eventTitle: string;
  eventDescription: string;
  accentColor: string;
  iconName: string;
}

const MILESTONES: LayerMilestone[] = [
  {
    altitudeKm: 0,
    label: '0 km · Deniz Seviyesi',
    category: 'troposfer',
    eventTitle: 'Yeryüzü & Biyosfer',
    eventDescription: 'Standart deniz seviyesi koşulları: 1013.25 hPa atmosfer basıncı, +15°C ortalama sıcaklık ve 1.225 kg/m³ hava yoğunluğu. İnsan yaşamının ve biyosferin ana vatanı.',
    accentColor: '#38bdf8',
    iconName: 'globe',
  },
  {
    altitudeKm: 8.85,
    label: '8.85 km · Everest Zirvesi',
    category: 'troposfer',
    eventTitle: 'Ölüm Bölgesi (Death Zone)',
    eventDescription: 'Atmosfer basıncı deniz seviyesinin üçte birine (~337 hPa) düşer. Oksijen molekülleri o kadar seyrektir ki insan vücudu yapay oksijen desteği olmadan saatler içinde bilincini kaybeder.',
    accentColor: '#60a5fa',
    iconName: 'mountain',
  },
  {
    altitudeKm: 12,
    label: '12 km · Tropopoz & Ticari Jetler',
    category: 'troposfer',
    eventTitle: 'Hava Olaylarının Sonu & Jetstream',
    eventDescription: 'Troposfer tabakasının üst sınırı. Dünya atmosferindeki su buharının ve fırtınaların %99’u bu irtifanın altında kalır. Yolcu uçakları türbülansı en aza indirmek için 10-12 km irtifada uçar.',
    accentColor: '#818cf8',
    iconName: 'plane',
  },
  {
    altitudeKm: 25,
    label: '25 km · Ozon Tabakası (O₃ Zirvesi)',
    category: 'stratosfer',
    eventTitle: 'Biyosferin Kozmik Kalkanı',
    eventDescription: 'Güneş’in öldürücü morötesi (UV-B ve UV-C) radyasyonunu soğuran ozon tabakasının en yoğun bölgesi. UV emilimi nedeniyle sıcaklık düşmek yerine -50°C’den 0°C’ye doğru yükselmeye başlar.',
    accentColor: '#a78bfa',
    iconName: 'shield',
  },
  {
    altitudeKm: 39,
    label: '39 km · Felix Baumgartner Atlama Rekoru',
    category: 'stratosfer',
    eventTitle: 'Stratosferik Ses Duvarı',
    eventDescription: '2012 yılında Red Bull Stratos göreviyle helyum balonuyla çıkılan irtifa. Düşük hava direnci sayesinde serbest düşüşte saatte 1357.6 km hıza ulaşarak ses hızını (Mach 1.25) motorsuz aşmıştır.',
    accentColor: '#c084fc',
    iconName: 'user',
  },
  {
    altitudeKm: 50,
    label: '50 km · Stratopoz',
    category: 'stratosfer',
    eventTitle: 'Stratosferin Tepe Noktası',
    eventDescription: 'Stratosfer ile mezosfer arasındaki sınır. Atmosfer basıncı deniz seviyesinin binde birine (~1 hPa) gerilemiştir. Gökyüzü gündüz dahi lacivertten zifiri siyaha dönüşmüştür.',
    accentColor: '#e879f9',
    iconName: 'layers',
  },
  {
    altitudeKm: 85,
    label: '85 km · Mezosfer & Kayan Yıldızlar',
    category: 'mezosfer',
    eventTitle: 'Meteor Yanma Bölgesi & En Soğuk Tabaka',
    eventDescription: 'Dünya’ya çarpan göktaşlarının %99.9’u bu tabakadaki seyrek gaz moleküllerinin sürtünmesiyle ısınıp parlayarak buharlaşır ("kayan yıldız"). Sıcaklık -90°C ile atmosferin en dip seviyesine iner.',
    accentColor: '#f43f5e',
    iconName: 'flame',
  },
  {
    altitudeKm: 100,
    label: '100 km · KÁRMÁN HATTI',
    category: 'termosfer',
    eventTitle: 'Uzayın Uluslararası Resmi Sınırı (FAI)',
    eventDescription: 'Aerodinamik kaldırma kuvvetinin artık bir uçağı taşıyamayacağı teorik irtifa. Bu irtifanın üzerinde kalabilmek için havanın kaldırmasına değil, saniyede en az 7.8 km yörüngesel hıza (kütleçekim dengesine) ihtiyaç vardır.',
    accentColor: '#f5c542',
    iconName: 'rocket',
  },
  {
    altitudeKm: 150,
    label: '150 km · Kutup Işıkları (Aurora Bölgesi)',
    category: 'termosfer',
    eventTitle: 'İyonize Manyetosfer Parıltısı',
    eventDescription: 'Güneş rüzgârı yüklü parçacıklarının Dünya’nın manyetik alan çizgileri boyunca kutuplara yönelerek atmosferdeki oksijen ve azot atomlarını uyarmasıyla yeşil ve mor aurora dansı başlar.',
    accentColor: '#10b981',
    iconName: 'sparkles',
  },
  {
    altitudeKm: 420,
    label: '420 km · Uluslararası Uzay İstasyonu (ISS)',
    category: 'termosfer',
    eventTitle: 'Alçak Dünya Yörüngesi (LEO)',
    eventDescription: 'ISS, saatte 27.600 km (saniyede 7.66 km) hızla döner ve her 90 dakikada bir Dünya turunu tamamlar. İçindeki astronotlar yerçekimsiz değil, sürekli Dünya’ya doğru serbest düşüş halindedir.',
    accentColor: '#00d4ff',
    iconName: 'satellite',
  },
  {
    altitudeKm: 550,
    label: '550 km · Hubble Uzay Teleskobu',
    category: 'termosfer',
    eventTitle: 'Atmosfersiz Derin Evren Gözlemi',
    eventDescription: 'Atmosferik ışık kırılması, su buharı ve hava türbülansından tamamen arınmış bir yörüngede 30 yılı aşkın süredir evrenin en uzak köşelerini fotoğraflayan efsanevi gözlemevi.',
    accentColor: '#38bdf8',
    iconName: 'eye',
  },
  {
    altitudeKm: 20200,
    label: '20.200 km · GPS / GNSS Uydu Takımı',
    category: 'ekzosfer',
    eventTitle: 'Orta Dünya Yörüngesi (MEO)',
    eventDescription: 'Yeryüzündeki akıllı telefonlara ve uçaklara milimetrik konum sağlayan 31 adet GPS uydusunun bulunduğu yörünge. 12 saatlik periyotla günde iki tam tur atarlar.',
    accentColor: '#a855f7',
    iconName: 'radio',
  },
  {
    altitudeKm: 35786,
    label: '35.786 km · Jeostasyoner Yörünge (GEO)',
    category: 'ekzosfer',
    eventTitle: 'Dünya ile Senkron Halka (Clarke Kuşağı)',
    eventDescription: 'Bu irtifadaki bir uydunun yörünge periyodu Dünya’nın kendi eksenindeki dönüş süresine (23 saat 56 dakika) tam olarak eşittir. Bu sayede uydu yeryüzündeki bir gözlemciye göre gökyüzünde hep sabit durur.',
    accentColor: '#eab308',
    iconName: 'disc',
  },
];

// Physical standard atmosphere calculator
function calculateAtmospherePhysics(km: number) {
  // Pressure (barometric formula approximation)
  // Scale height H ~ 7.4 km in troposphere/stratosphere
  let pressureHpa: number;
  if (km <= 0) pressureHpa = 1013.25;
  else if (km <= 11) pressureHpa = 1013.25 * Math.pow(1 - (0.0065 * (km * 1000)) / 288.15, 5.255);
  else if (km <= 85) pressureHpa = 1013.25 * Math.exp(-km / 7.2);
  else if (km <= 500) pressureHpa = Math.max(1e-9, 0.01 * Math.exp(-(km - 85) / 18));
  else pressureHpa = 1e-12; // deep space vacuum

  // Temperature Profile (Celsius)
  let tempC: number;
  if (km <= 11) tempC = 15 - 6.49 * km;
  else if (km <= 20) tempC = -56.5;
  else if (km <= 32) tempC = -56.5 + 1.0 * (km - 20);
  else if (km <= 47) tempC = -44.5 + 2.8 * (km - 32);
  else if (km <= 51) tempC = -2.5;
  else if (km <= 71) tempC = -2.5 - 2.8 * (km - 51);
  else if (km <= 85) tempC = -58.5 - 2.0 * (km - 71);
  else if (km <= 120) tempC = -86.5 + 3.0 * (km - 85);
  else if (km <= 300) tempC = Math.min(1200, 18.5 + (km - 120) * 4.5);
  else tempC = 1200; // thermosphere molecular kinetic temperature

  // Gravity g at altitude h: g = g0 * (R / (R + h))^2 (Earth radius = 6371 km)
  const rEarth = 6371;
  const gravity = 9.80665 * Math.pow(rEarth / (rEarth + km), 2);
  const gravityPercent = (gravity / 9.80665) * 100;

  // Air density (kg/m^3)
  const tempK = tempC + 273.15;
  const density = (pressureHpa * 100) / (287.05 * tempK);

  // Speed of sound Mach 1 in m/s: a = sqrt(gamma * R * T)
  const speedOfSound = km < 85 ? Math.sqrt(1.4 * 287.05 * Math.max(10, tempK)) : null;

  return {
    pressureHpa: Math.max(0, pressureHpa),
    tempC: Math.round(tempC),
    gravity: gravity.toFixed(2),
    gravityPercent: Math.round(gravityPercent),
    density: density > 0.000001 ? density.toFixed(4) : density > 0 ? density.toExponential(2) : '0',
    speedOfSound: speedOfSound ? Math.round(speedOfSound) : 'N/A (Seyreltik Vakum)',
  };
}

// Convert altitude to non-linear slider slider value (0 to 1000)
// Lower atmospheric km get more resolution on the slider
function altitudeToSlider(km: number): number {
  if (km <= 0) return 0;
  if (km <= 12) return (km / 12) * 200; // 0-12 km takes 0-200 (20%)
  if (km <= 100) return 200 + ((km - 12) / 88) * 350; // 12-100 km takes 200-550 (35%)
  if (km <= 600) return 550 + ((km - 100) / 500) * 250; // 100-600 km takes 550-800 (25%)
  return 800 + (Math.log10(km / 600) / Math.log10(36000 / 600)) * 200; // up to GEO (20%)
}

function sliderToAltitude(s: number): number {
  if (s <= 0) return 0;
  if (s <= 200) return (s / 200) * 12;
  if (s <= 550) return 12 + ((s - 200) / 350) * 88;
  if (s <= 800) return 100 + ((s - 550) / 250) * 500;
  const factor = (s - 800) / 200;
  return 600 * Math.pow(36000 / 600, factor);
}

export function AtmosphereToSpaceElevator() {
  const [altitudeKm, setAltitudeKm] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  const physics = useMemo(() => calculateAtmospherePhysics(altitudeKm), [altitudeKm]);

  // Find the closest active milestone
  const activeMilestone = useMemo(() => {
    let closest = MILESTONES[0];
    for (const m of MILESTONES) {
      if (altitudeKm >= m.altitudeKm) {
        closest = m;
      }
    }
    return closest;
  }, [altitudeKm]);

  // Smooth auto-ascent playback
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setAltitudeKm((prev) => {
        let next = prev;
        if (prev < 12) next += delta * 1.5;
        else if (prev < 100) next += delta * 12;
        else if (prev < 600) next += delta * 60;
        else next += delta * 2500;

        if (next >= 35786) {
          setIsPlaying(false);
          return 35786;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Sky Backdrop styling based on altitude
  const skyBackground = useMemo(() => {
    if (altitudeKm < 8) {
      // Daylight Cyan/Sky Blue
      return `linear-gradient(to bottom, #1e3a8a, #38bdf8)`;
    } else if (altitudeKm < 25) {
      // Stratosphere Deep Indigo
      return `linear-gradient(to bottom, #0f172a, #1e40af)`;
    } else if (altitudeKm < 60) {
      // Mid Stratosphere / Mesosphere Obsidian Ink
      return `linear-gradient(to bottom, #050510, #172554)`;
    } else if (altitudeKm < 140) {
      // Kármán Line & Aurora Glowing Verge
      return `linear-gradient(to bottom, #020205, #064e3b)`;
    } else {
      // Orbital Deep Space Obsidian
      return `linear-gradient(to bottom, #020206, #030712)`;
    }
  }, [altitudeKm]);

  return (
    <div className="relative ticks border border-line bg-ink text-paper overflow-hidden">
      <Ticks />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line p-5 sm:p-6 bg-ink-2/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Rocket className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
                DİKEY İRTİFA SİMÜLATÖRÜ
              </span>
              <span className="px-1.5 py-0.2 border border-line text-[9px] font-mono text-muted uppercase">
                0 – 35.786 KM (GEO)
              </span>
            </div>
            <h3 className="display display-tight text-xl sm:text-2xl text-paper">
              Atmosferden Uzaya Dikey Yükseliş
            </h3>
          </div>
        </div>

        {/* Playback Controls & Reset */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 border flex items-center gap-1.5 cursor-pointer transition-colors text-[11px] uppercase tracking-wider ${
              isPlaying
                ? 'border-solar bg-solar text-ink font-bold'
                : 'border-line bg-ink text-paper hover:border-cyan-400'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Durdur' : 'Otomatik Yükseliş'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setAltitudeKm(0);
            }}
            className="p-1.5 border border-line bg-ink text-muted hover:text-paper hover:border-line cursor-pointer"
            title="Yeryüzüne Dön"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Visual Sky & Ascension Chamber */}
      <div
        className="relative h-[380px] sm:h-[460px] w-full transition-all duration-700 overflow-hidden flex flex-col justify-between p-6 select-none"
        style={{ background: skyBackground }}
      >
        {/* Subtle Starfield Overlay when altitude > 30 km */}
        {altitudeKm > 25 && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(1px_1px_at_20px_30px,#ffffff,transparent_100%),radial-gradient(1.5px_1.5px_at_70px_120px,#ffffff,transparent_100%),radial-gradient(1px_1px_at_150px_60px,#a5f3fc,transparent_100%),radial-gradient(2px_2px_at_250px_200px,#ffffff,transparent_100%),radial-gradient(1px_1px_at_320px_90px,#fde047,transparent_100%)] bg-[size:380px_380px]"
            style={{ opacity: Math.min(1, (altitudeKm - 25) / 50) }}
          />
        )}

        {/* Aurora Glowing Ribbons when in Thermosphere 100 - 250 km */}
        {altitudeKm >= 90 && altitudeKm <= 350 && (
          <div className="absolute inset-x-0 top-1/4 h-32 pointer-events-none opacity-40 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-purple-500/0 blur-2xl animate-pulse" />
        )}

        {/* Earth Curved Horizon Visual (visible when altitude > 100 km) */}
        {altitudeKm >= 80 && (
          <div
            className="absolute -bottom-36 sm:-bottom-48 left-1/2 -translate-x-1/2 w-[180%] sm:w-[140%] h-64 sm:h-80 rounded-[100%] border-t-2 border-cyan-400/80 bg-gradient-to-b from-cyan-900/60 via-blue-950/80 to-ink shadow-[0_-20px_50px_rgba(56,189,248,0.3)] transition-transform duration-700 pointer-events-none"
            style={{
              transform: `translateX(-50%) translateY(${Math.min(120, (altitudeKm - 80) * 0.2)}px)`,
            }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-cyan-300/80">
              Dünya Gezegen Ufku
            </div>
          </div>
        )}

        {/* Top HUD: Current Altitude Big Digits */}
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="bg-ink/80 backdrop-blur-md p-4 border border-line max-w-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>MEVCUT İRTİFA SEVİYESİ</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl sm:text-4xl font-black text-paper tracking-tight">
                {altitudeKm >= 1000
                  ? (altitudeKm / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })
                  : altitudeKm.toFixed(1)}
              </span>
              <span className="font-mono text-sm text-cyan-400 font-bold uppercase">
                {altitudeKm >= 1000 ? 'Bin KM' : 'Kilometre'}
              </span>
              <span className="text-xs text-muted font-mono">
                ({Math.round(altitudeKm * 1000).toLocaleString('tr-TR')} metre)
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono">
              <span
                className="px-2 py-0.5 border font-bold uppercase tracking-wider"
                style={{
                  color: activeMilestone.accentColor,
                  borderColor: `${activeMilestone.accentColor}40`,
                  backgroundColor: `${activeMilestone.accentColor}15`,
                }}
              >
                {activeMilestone.category}
              </span>
              <span className="text-paper truncate">{activeMilestone.label}</span>
            </div>
          </div>

          {/* Real-time Atmospheric Physics Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="bg-ink/85 backdrop-blur-md p-3 border border-line min-w-[110px]">
              <span className="text-[10px] text-muted block uppercase flex items-center gap-1">
                <Gauge className="h-3 w-3 text-cyan-400" /> Basınç
              </span>
              <span className="text-sm font-bold text-paper block mt-1">
                {physics.pressureHpa >= 1
                  ? `${physics.pressureHpa.toFixed(1)} hPa`
                  : physics.pressureHpa > 0.0001
                  ? `${physics.pressureHpa.toFixed(4)} hPa`
                  : 'Vakum (~0)'}
              </span>
              <span className="text-[9px] text-muted block mt-0.5">
                {altitudeKm <= 100 ? `${((physics.pressureHpa / 1013.25) * 100).toFixed(1)}% zemin` : 'Uzay boşluğu'}
              </span>
            </div>

            <div className="bg-ink/85 backdrop-blur-md p-3 border border-line min-w-[110px]">
              <span className="text-[10px] text-muted block uppercase flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-rose-400" /> Sıcaklık
              </span>
              <span className="text-sm font-bold text-paper block mt-1">
                {physics.tempC > 0 ? `+${physics.tempC}°C` : `${physics.tempC}°C`}
              </span>
              <span className="text-[9px] text-muted block mt-0.5">
                {physics.tempC + 273} Kelvin
              </span>
            </div>

            <div className="bg-ink/85 backdrop-blur-md p-3 border border-line min-w-[110px]">
              <span className="text-[10px] text-muted block uppercase flex items-center gap-1">
                <Wind className="h-3 w-3 text-amber-400" /> Yoğunluk
              </span>
              <span className="text-sm font-bold text-paper block mt-1 truncate">
                {physics.density}
              </span>
              <span className="text-[9px] text-muted block mt-0.5">kg/m³</span>
            </div>

            <div className="bg-ink/85 backdrop-blur-md p-3 border border-line min-w-[110px]">
              <span className="text-[10px] text-muted block uppercase flex items-center gap-1">
                <Globe className="h-3 w-3 text-emerald-400" /> Yerçekimi
              </span>
              <span className="text-sm font-bold text-paper block mt-1">
                {physics.gravity} m/s²
              </span>
              <span className="text-[9px] text-muted block mt-0.5">
                {physics.gravityPercent}% (g₀)
              </span>
            </div>
          </div>
        </div>

        {/* Floating Active Event Banner in Mid-Air */}
        <div className="relative z-10 max-w-xl bg-ink/90 backdrop-blur-lg border p-4 shadow-2xl transition-all" style={{ borderColor: `${activeMilestone.accentColor}60` }}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full animate-ping inline-block"
              style={{ backgroundColor: activeMilestone.accentColor }}
            />
            <h4 className="font-bold text-sm text-paper font-mono uppercase tracking-wide">
              {activeMilestone.eventTitle}
            </h4>
          </div>
          <p className="text-xs text-paper/85 leading-relaxed font-sans">
            {activeMilestone.eventDescription}
          </p>
        </div>
      </div>

      {/* Scrubbing & Stage Controls */}
      <div className="border-t border-line bg-ink-2 p-5 sm:p-6 space-y-4">
        {/* Interactive Scrub Slider */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-muted text-[11px]">
            <span>0 km (Deniz)</span>
            <span className="text-cyan-400 font-bold">İRTİFA ÇUBUĞU (KAYDIRIN VEYA BASIN)</span>
            <span>35.786 km (GEO)</span>
          </div>

          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={altitudeToSlider(altitudeKm)}
            onChange={(e) => {
              setIsPlaying(false);
              setAltitudeKm(sliderToAltitude(Number(e.target.value)));
            }}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-ink border border-line rounded-none"
          />
        </div>

        {/* Milestone Quick Jump Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted uppercase tracking-wider">
            <span>ÖNEMLİ İRTİFA DURAKLARI</span>
            <span>TOPLAM {MILESTONES.length} KATMAN KERTERİZİ</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            {MILESTONES.map((m) => {
              const isActive = Math.abs(altitudeKm - m.altitudeKm) < (m.altitudeKm === 0 ? 0.5 : m.altitudeKm * 0.2);
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setAltitudeKm(m.altitudeKm);
                  }}
                  className={`px-3 py-1.5 whitespace-nowrap transition-all border text-[11px] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 ${
                    isActive
                      ? 'font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'border-line bg-ink text-muted hover:border-line hover:text-paper'
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: m.accentColor,
                          backgroundColor: `${m.accentColor}20`,
                          color: '#ffffff',
                        }
                      : {}
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ backgroundColor: m.accentColor }}
                  />
                  <span>{m.label.split('·')[0].trim()}</span>
                  <span className="text-[9px] opacity-70">({m.category})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Educational Physics Insight Note */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs border-t border-line">
          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-cyan-400 block uppercase font-bold">NEDEN SES DUVALI?</span>
            <p className="text-[11px] text-muted mt-1 font-sans leading-relaxed">
              Troposferde ses hızı 340 m/s iken -56°C sıcaklıktaki tropopozda moleküller yavaşladığı için 295 m/s’ye düşer.
            </p>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-gold block uppercase font-bold">NEDEN KÁRMÁN HATTI (100 KM)?</span>
            <p className="text-[11px] text-muted mt-1 font-sans leading-relaxed">
              Macar fizikçi Theodore von Kármán, bu irtifada havanın o kadar seyreldiğini hesapladı ki kanatlı bir uçağın uçabilmesi için yörünge hızına (7.8 km/s) ulaşması gerekir.
            </p>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-rose-400 block uppercase font-bold">YERÇEKİMİ GERÇEKTEN BİTİYOR MU?</span>
            <p className="text-[11px] text-muted mt-1 font-sans leading-relaxed">
              ISS’nin bulunduğu 420 km’de Dünya yerçekimi bitmez; zemin seviyesinin %89’u kadar güçlüdür! Astronotlar yerçekimsiz değil, serbest düşüştedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
