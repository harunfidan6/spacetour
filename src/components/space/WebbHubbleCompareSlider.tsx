'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Eye, Sparkles, Sliders, Info, Zap, Shield, Compass, ArrowLeftRight } from 'lucide-react';

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
    details: string;
  };
  webb: {
    label: string;
    instrument: string;
    wavelength: string;
    image: string;
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
      instrument: 'WFC3 / Görünür Işık',
      wavelength: '0.4 – 0.8 µm',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
      details: 'Yoğun toz perdesi arka plandaki bebek yıldızları ve proto-gezegen disklerini tamamen gizler.'
    },
    webb: {
      label: 'James Webb (Kızılötesi)',
      instrument: 'NIRCam / Yakın Kızılötesi',
      wavelength: '0.6 – 5.0 µm',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
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
      instrument: 'WFPC2 / Optik Filtreler',
      wavelength: '0.5 – 0.7 µm',
      image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop',
      details: 'Sütunlar karanlık monolitik heykeller gibi durur. Sadece kenarlardaki iyonize hidrojen ışıması seçilebilir.'
    },
    webb: {
      label: 'James Webb (Kızılötesi)',
      instrument: 'NIRCam & MIRI Bileşimi',
      wavelength: '0.9 – 28 µm',
      image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop',
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
      instrument: 'WFC3',
      wavelength: 'Görünür Işık',
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1200&auto=format&fit=crop',
      details: 'Merkezde sadece parlak beyaz bir yıldız seçilebilir; gaz halkaları simetrik görünür.'
    },
    webb: {
      label: 'James Webb (MIRI)',
      instrument: 'MIRI / Orta Kızılötesi',
      wavelength: '5.0 – 28 µm',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
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
      instrument: 'ACS / WFC3 (Haftalar süren pozlama)',
      wavelength: 'Optik + Yakın IR',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
      details: 'Galaksiler soluk leke halindedir; arka plandaki bükülmüş kütleçekim yayları belirsizdir.'
    },
    webb: {
      label: 'Webb İlk Derin Alan (Deep Field)',
      instrument: 'NIRCam (12.5 saatlik pozlama)',
      wavelength: '0.6 – 5.0 µm',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
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

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handlePointerMove(e.clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="rounded-3xl border border-line bg-ink p-6 md:p-8 space-y-8">
      {/* Header & Telescope Quick Specs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2 text-rose-signal text-xs font-mono tracking-widest uppercase">
            <Zap className="h-4 w-4 animate-pulse" />
            <span>Kızılötesi vs Optik Spektrum Karşılaştırıcısı</span>
          </div>
          <h3 className="display display-tight text-3xl md:text-4xl text-paper mt-2">
            Hubble <span className="serif-i text-rose-signal">ve</span> James Webb
          </h3>
          <p className="text-sm text-paper/70 mt-2 max-w-xl">
            Aynı kozmik hedefe iki farklı çağın dev teleskobuyla bakın. Kaydırıcıyı sağa-sola çekerek toz perdesinin ardındaki kızılötesi evreni ortaya çıkarın.
          </p>
        </div>

        {/* Specs Pill */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <div className="px-3 py-2 rounded-xl bg-ink-2 border border-line text-muted">
            <span className="text-paper font-bold">JWST:</span> 6.5m Ayna · L2 Noktası (-233°C)
          </div>
          <div className="px-3 py-2 rounded-xl bg-ink-2 border border-line text-muted">
            <span className="text-paper font-bold">Hubble:</span> 2.4m Ayna · Alçak Dünya Yörüngesi
          </div>
        </div>
      </div>

      {/* Target Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {COMPARISON_TARGETS.map((t) => {
          const isSelected = t.id === selectedTarget.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTarget(t);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-rose-signal text-ink border-rose-signal font-bold shadow-lg shadow-rose-signal/20'
                  : 'bg-ink-2 text-paper/70 border-line hover:border-paper/40 hover:text-paper'
              }`}
            >
              <span>{t.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-ink/20 text-ink' : 'bg-ink text-muted'}`}>
                {t.distance}
              </span>
            </button>
          );
        })}
      </div>

      {/* Split Comparison Interactive Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        className="relative h-[380px] sm:h-[480px] md:h-[560px] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-line shadow-2xl bg-black"
      >
        {/* Layer 1: Right Side - James Webb (Infrared) Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedTarget.webb.image}
            alt={selectedTarget.webb.label}
            className="w-full h-full object-cover filter brightness-110 contrast-105"
            draggable={false}
          />
          {/* Webb Color Grade / Infrared Glow Tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/40 via-transparent to-amber-900/20 mix-blend-screen pointer-events-none" />

          {/* Right Label (Webb) */}
          <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white font-mono text-xs uppercase tracking-wider shadow-lg backdrop-blur">
              ★ {selectedTarget.webb.label}
            </span>
            <span className="text-[11px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
              {selectedTarget.webb.instrument} · {selectedTarget.webb.wavelength}
            </span>
          </div>
        </div>

        {/* Layer 2: Left Side - Hubble (Optical) Foreground with Clip Path */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedTarget.hubble.image}
            alt={selectedTarget.hubble.label}
            className="w-full h-full object-cover filter saturate-90 brightness-95"
            draggable={false}
          />
          {/* Optical Fog / Cold Filter */}
          <div className="absolute inset-0 bg-blue-950/20 mix-blend-screen pointer-events-none" />

          {/* Left Label (Hubble) */}
          <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-1 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-cyan-600/90 text-white font-mono text-xs uppercase tracking-wider shadow-lg backdrop-blur">
              {selectedTarget.hubble.label}
            </span>
            <span className="text-[11px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
              {selectedTarget.hubble.instrument} · {selectedTarget.hubble.wavelength}
            </span>
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper text-ink flex items-center justify-center shadow-2xl border-2 border-ink">
            <ArrowLeftRight className="w-5 h-5 text-ink animate-pulse" />
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur border border-line text-muted font-mono text-[11px] flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-rose-signal" />
            <span>Kaydırmak için sürükleyin ({Math.round(sliderPosition)}%)</span>
          </div>
        </div>
      </div>

      {/* Target Scientific Deep-Dive & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-5 rounded-2xl bg-ink-2 border border-line space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Hubble Gözlemi</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed">
            {selectedTarget.hubble.details}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-ink-2 border border-line space-y-2">
          <div className="text-xs font-mono text-rose-signal uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Webb Kızılötesi Keşfi</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed">
            {selectedTarget.webb.details}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="text-xs font-mono text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Astrofizik Çıkarımı</span>
          </div>
          <p className="text-xs text-paper/90 leading-relaxed">
            {selectedTarget.scientificInsight}
          </p>
        </div>
      </div>
    </div>
  );
}
