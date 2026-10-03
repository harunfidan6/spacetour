'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Eye,
  Sparkles,
  Sliders,
  Info,
  ArrowLeftRight
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface ComparisonTarget {
  id: string;
  name: string;
  constellation: string;
  distance: string;
  description: string;
  hubble: {
    label: string;
    instrument: string;
    wavelength: string;
    image: string;
    credit: string;
    details: string;
  };
  webb: {
    label: string;
    instrument: string;
    wavelength: string;
    image: string;
    credit: string;
    details: string;
  };
  scientificInsight: string;
}

const COMPARISON_TARGETS: ComparisonTarget[] = [
  {
    id: 'carina',
    name: 'Karina Bulutsusu (Kozmik Uçurumlar)',
    constellation: 'Carina (Karina)',
    distance: '7.600 Işık Yılı',
    description: 'Yıldız oluşum bölgesinin gaz ve toz duvarı. Yeni doğan bebek yıldızların yaydığı morötesi ışınlar ve yıldız rüzgarları bulutsuyu oyarak devasa kozmik uçurumlar yaratır.',
    hubble: {
      label: 'Hubble (Görünür Işık)',
      instrument: 'ACS + WFPC2 (2006–2008)',
      wavelength: 'Hα · [S II] · [O III]',
      image: '/images/space/ngc-3324-hubble-30d280.jpg',
      credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
      details: 'Yoğun toz perdesi arka plandaki bebek yıldızları ve proto-gezegen disklerini tamamen gizler.'
    },
    webb: {
      label: 'James Webb (Kızılötesi)',
      instrument: 'NIRCam / Yakın Kızılötesi',
      wavelength: '0.9 – 4.4 µm',
      image: '/images/space/nasas-webb-reveals-cosmic-cliffs-glittering-landscape-of-sta-fe9eb0.jpg',
      credit: 'NASA, ESA, CSA, STScI',
      details: 'Kızılötesi dalgalar kalın tozu delip geçer; yüzlerce gizli proto-yıldız ve gaz fışkırması görünür hale gelir.'
    },
    scientificInsight: 'Webb’in NIRCam kamerası, optik dalgaları bloke eden mikron boyutlu toz taneciklerini şeffaf kılarak yıldız oluşumunun en erken evrelerini yakalar.'
  },
  {
    id: 'pillars',
    name: 'Yaratılış Sütunları (Pillars of Creation)',
    constellation: 'Serpens (Yılan)',
    distance: '6.500 Işık Yılı',
    description: 'Kartal Bulutsusu (M16) kalbinde yer alan, 4-5 ışık yılı uzunluğundaki devasa soğuk moleküler hidrojen gazı ve kozmik toz kuleleri.',
    hubble: {
      label: 'Hubble (Görünür Spektrum)',
      instrument: 'WFC3/UVIS (2014)',
      wavelength: '0.50 – 0.67 µm',
      image: '/images/space/pillars-of-creation-2014-hst-wfc3-uvis-full-res-denoised-0dddac.jpg',
      credit: 'NASA, ESA, Hubble Heritage Team (STScI/AURA)',
      details: 'Sütunlar karanlık monolitik heykeller gibi durur. Sadece kenarlardaki iyonize hidrojen ışıması seçilebilir.'
    },
    webb: {
      label: 'James Webb (Kızılötesi)',
      instrument: 'NIRCam / Yakın Kızılötesi',
      wavelength: '0.9 – 4.4 µm',
      image: '/images/space/pillars-of-creation-nircam-image-e97a7a.jpg',
      credit: 'NASA, ESA, CSA, STScI; J. DePasquale, A. Koekemoer, A. Pagan',
      details: 'Sütunların içindeki gaz düğümleri parlak lav lavraları gibi ışıma yapar; dışarı püsküren kırmızı şok dalgaları görülür.'
    },
    scientificInsight: 'Sütunların uçlarındaki parlak kırmızı küreler, kendi yerçekimleri altında çöken ve henüz birkaç yüz bin yıllık olan bebek yıldızlardır.'
  },
  {
    id: 'southern-ring',
    name: 'Güney Halka Bulutsusu (NGC 3132)',
    constellation: 'Vela (Yelken)',
    distance: '2.500 Işık Yılı',
    description: 'Ömrünün sonuna gelen bir yıldızın dış gaz kabuklarını uzaya fırlatmasıyla oluşan genişleyen gezegenimsi bulutsu.',
    hubble: {
      label: 'Hubble (Optik)',
      instrument: 'WFPC2 (1998)',
      wavelength: 'Görünür Işık',
      image: '/images/space/ngc-3132-d7d4b6.jpg',
      credit: 'Hubble Heritage Team (STScI/AURA/NASA)',
      details: 'Merkezde sadece parlak beyaz bir yıldız seçilebilir; gaz halkaları simetrik görünür.'
    },
    webb: {
      label: 'James Webb (MIRI)',
      instrument: 'MIRI / Orta Kızılötesi',
      wavelength: '7.7 – 18 µm',
      image: '/images/space/southern-ring-nebula-miri-image-weic2207c-c1206e.jpg',
      credit: 'ESA/Webb, NASA & CSA, STScI (CC BY 4.0)',
      details: 'İlk kez gaz fırlatan asıl ölmekte olan ikinci yıldızın kalın toz kılıfı içinde saklandığı ortaya çıkarıldı.'
    },
    scientificInsight: 'MIRI dedektörü, parlak ana yıldızın yanında dönen ve toza gömülü ikinci soluk beyaz cüceyi tarihte ilk kez kanıtlamıştır.'
  },
  {
    id: 'smacs-0723',
    name: 'SMACS 0723 (Webb Derin Uzay Alanı)',
    constellation: 'Volans (Uçanbalık)',
    distance: '4.6 Milyar Işık Yılı (Ön Plan)',
    description: 'Büyük patlamadan sadece birkaç yüz milyon yıl sonra var olmuş en eski galaksileri kütleçekimsel mercekleme yöntemiyle büyüten dev galaksi kümesi.',
    hubble: {
      label: 'Hubble Derin Alan',
      instrument: 'ACS + WFC3 · RELICS (2017)',
      wavelength: 'Optik + Yakın IR',
      image: '/images/space/nasa-hubblespacetelescope-deepfield-2017-25ff9d.jpg',
      credit: 'NASA, ESA, RELICS',
      details: 'Galaksiler soluk leke halindedir; arka plandaki bükülmüş kütleçekim yayları belirsizdir.'
    },
    webb: {
      label: 'Webb İlk Derin Alan (Deep Field)',
      instrument: 'NIRCam (12.5 saatlik pozlama)',
      wavelength: '0.9 – 4.4 µm',
      image: '/images/space/webb-s-first-deep-field-f6498c.jpg',
      credit: 'NASA, ESA, CSA, STScI',
      details: '13.1 milyar yıl öncesine ait binlerce ilk nesil galaksi, kızıla kaymış keskin kütleçekim yayları halinde netleşir.'
    },
    scientificInsight: 'Kütleçekimsel merceklenme etkisi, Albert Einstein’ın Genel Görelilik kuramını doğrular; dev kütle arkasındaki ışığı büküp büyüterek doğal bir kozmik teleskop oluşturur.'
  }
];

export function WebbHubbleCompareSlider() {
  const [selectedTarget, setSelectedTarget] = useState<ComparisonTarget>(COMPARISON_TARGETS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max((x / rect.width) * 100, 2), 98);
      setSliderPosition(percentage);
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    handlePointerMove(e.clientX);
  };

  const handlePointerMoveEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handlePointerMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header & Telescope Quick Specs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-rose-signal">
            <span className="live-dot" /> Kızılötesi vs Optik Spektrum Karşılaştırıcısı
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Hubble <span className="serif-i text-rose-signal">ve</span> James Webb
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Aynı kozmik hedefe iki farklı çağın dev teleskobuyla bakın. Kaydırıcıyı sağa-sola çekerek toz perdesinin ardındaki kızılötesi evreni ortaya çıkarın.
          </p>
        </div>

        {/* Specs Pill */}
        <div className="flex flex-wrap gap-2">
          <div className="label px-3 py-1.5 border border-line bg-ink-2 text-muted">
            <span className="text-paper font-bold">JWST:</span> 6.5m Ayna · L2 Noktası (-233°C)
          </div>
          <div className="label px-3 py-1.5 border border-line bg-ink-2 text-muted">
            <span className="text-paper font-bold">Hubble:</span> 2.4m Ayna · Alçak Dünya Yörüngesi
          </div>
        </div>
      </div>

      {/* Target Selector Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px border border-line bg-line">
        {COMPARISON_TARGETS.map((t, idx) => {
          const isSelected = t.id === selectedTarget.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedTarget(t);
                setSliderPosition(50);
              }}
              className={`p-4 text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-signal text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className={`label ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                  Hedef 0{idx + 1}
                </span>
                <span className={`label text-[10px] ${isSelected ? 'text-ink/80' : 'text-rose-signal'}`}>
                  {t.distance}
                </span>
              </div>
              <div className="display display-tight mt-3 text-lg font-bold">
                {t.name.split(' (')[0]}
              </div>
              <div className={`serif-i text-xs mt-1 ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                {t.constellation}
              </div>
            </button>
          );
        })}
      </div>

      {/* Split Comparison Interactive Slider Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMoveEvent}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[380px] sm:h-[480px] md:h-[560px] w-full overflow-hidden cursor-ew-resize select-none border border-line bg-black touch-none"
      >
        {/* Layer 1: Right Side - James Webb (Infrared) Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={selectedTarget.webb.image}
            alt={`${selectedTarget.name} — ${selectedTarget.webb.label}`}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
            draggable={false}
          />

          {/* Right Label (Webb) */}
          <div className="absolute right-3 top-3 z-10 flex max-w-[46%] flex-col items-end gap-1 pointer-events-none sm:right-4 sm:top-4">
            <span className="label max-w-full truncate px-2 py-1 bg-rose-signal text-ink font-bold backdrop-blur sm:px-3">
              ★ {selectedTarget.webb.label}
            </span>
            <span className="label hidden text-[10px] text-paper/80 bg-ink/80 px-2 py-0.5 border border-line backdrop-blur sm:block">
              {selectedTarget.webb.instrument} · {selectedTarget.webb.wavelength}
            </span>
          </div>
        </div>

        {/* Layer 2: Left Side - Hubble (Optical) Foreground with Clip Path */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={selectedTarget.hubble.image}
            alt={`${selectedTarget.name} — ${selectedTarget.hubble.label}`}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
            draggable={false}
          />

          {/* Left Label (Hubble) */}
          <div className="absolute left-3 top-3 z-10 flex max-w-[46%] flex-col items-start gap-1 pointer-events-none sm:left-4 sm:top-4">
            <span className="label max-w-full truncate px-2 py-1 bg-ink/90 border border-line text-paper font-bold backdrop-blur sm:px-3">
              {selectedTarget.hubble.label}
            </span>
            <span className="label hidden text-[10px] text-paper/80 bg-ink/80 px-2 py-0.5 border border-line backdrop-blur sm:block">
              {selectedTarget.hubble.instrument} · {selectedTarget.hubble.wavelength}
            </span>
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute inset-y-0 w-px bg-paper shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 border border-ink bg-paper text-ink flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-ink" />
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between bg-ink/80 px-4 py-2 border border-line backdrop-blur pointer-events-none z-10">
          <span className="label text-muted">Sol: Görünür Işık · Sağ: Kızılötesi</span>
          <span className="label text-paper flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-rose-signal" />
            <span>Kaydır: %{Math.round(sliderPosition)}</span>
          </span>
        </div>
      </div>

      <p className="label -mt-5 text-[10px] leading-relaxed text-muted">
        Görseller · Hubble: {selectedTarget.hubble.credit} — Webb: {selectedTarget.webb.credit}
      </p>

      {/* Target Scientific Deep-Dive & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
        <div className="bg-ink p-6 space-y-2">
          <div className="label text-muted flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-paper" />
            <span>Hubble Gözlemi</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed pt-1">
            {selectedTarget.hubble.details}
          </p>
        </div>

        <div className="bg-ink p-6 space-y-2">
          <div className="label text-rose-signal flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Webb Kızılötesi Keşfi</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed pt-1">
            {selectedTarget.webb.details}
          </p>
        </div>

        <div className="bg-ink p-6 space-y-2">
          <div className="label text-muted flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-rose-signal" />
            <span>Astrofizik Çıkarımı</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed pt-1">
            {selectedTarget.scientificInsight}
          </p>
        </div>
      </div>
    </div>
  );
}
