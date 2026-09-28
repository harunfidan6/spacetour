'use client';

import React, { useState } from 'react';
import { Telescope, Radio, Eye, Layers, Sparkles, Sliders, ExternalLink, Info } from 'lucide-react';

type WavelengthMode = 'optical' | 'infrared' | 'xray' | 'radio';

interface DeepSkyTarget {
  id: string;
  name: string;
  catalog: string;
  type: string;
  distance: string;
  description: string;
  views: Record<
    WavelengthMode,
    {
      telescope: string;
      wavelength: string;
      color: string;
      image: string;
      highlights: string;
    }
  >;
}

const DEEP_SKY_TARGETS: DeepSkyTarget[] = [
  {
    id: 'crab-nebula',
    name: 'Yengeç Bulutsusu',
    catalog: 'M1 / NGC 1952',
    type: 'Süpernova Kalıntısı & Pulsar',
    distance: '6,500 Işık Yılı',
    description: '1054 yılında Çinli ve Arap gökbilimciler tarafından kaydedilen parlak bir süpernovanın kalıntısı. Merkezinde saniyede 30 kez dönen bir nötron yıldızı (pulsar) bulunur.',
    views: {
      optical: {
        telescope: 'Hubble Uzay Teleskobu',
        wavelength: '400 - 700 nm (Görünür)',
        color: '#ff6633',
        image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Genişleyen hidrojen ve oksijen gazı filamentleri, patlamanın dış katmanları.'
      },
      infrared: {
        telescope: 'James Webb (JWST)',
        wavelength: '0.6 - 28 µm (Yakın & Orta Kızılötesi)',
        color: '#ff2255',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Pulsar rüzgarının ısıttığı toz tanecikleri ve iç senkrotron ışıması.'
      },
      xray: {
        telescope: 'Chandra X-Işını Gözlemevi',
        wavelength: '0.1 - 10 nm (Yüksek Enerji X-Ray)',
        color: '#00d4ff',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Pulsarın manyetik kutuplarından fışkıran devasa plazma jetleri ve yüksek enerjili halkalar.'
      },
      radio: {
        telescope: 'VLA (Very Large Array)',
        wavelength: '1 - 50 cm (Radyo Dalgaları)',
        color: '#a855f7',
        image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Pulsarın manyetosferinde ivmelenen elektronların yaydığı ritmik radyo sinyalleri.'
      }
    }
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaksisi',
    catalog: 'M31 / NGC 224',
    type: 'Sarmal Galaksi',
    distance: '2.537 Milyon Işık Yılı',
    description: 'Samanyolu’nun en yakın büyük komşusu. Yaklaşık 1 trilyon yıldıza ev sahipliği yapar ve yaklaşık 4.5 milyar yıl sonra Samanyolu ile birleşecektir.',
    views: {
      optical: {
        telescope: 'Hubble & Yer Tabanlı Teleskoplar',
        wavelength: '380 - 750 nm',
        color: '#ffd700',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Yıldız diskleri, parlak sarı çekirdek ve sarmal kollardaki karanlık toz şeritleri.'
      },
      infrared: {
        telescope: 'Spitzer & Herschel',
        wavelength: '3.6 - 160 µm',
        color: '#ff4444',
        image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Yeni yıldızların doğduğu sarmal kollardaki ılık yıldızlararası toz halkaları.'
      },
      xray: {
        telescope: 'XMM-Newton & Chandra',
        wavelength: '0.2 - 12 keV',
        color: '#00e5ff',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Merkezdeki süper kütleli karadelik ve yoldaş yıldızından madde çeken X-ışını çift yıldızları.'
      },
      radio: {
        telescope: 'Effelsberg 100m Radyo Teleskobu',
        wavelength: '6 - 21 cm',
        color: '#9c27b0',
        image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop',
        highlights: 'Galaksinin dış sınırlarına kadar uzanan devasa nötr hidrojen gazı bulutları.'
      }
    }
  }
];

export default function GozlemeviPage() {
  const [selectedTarget, setSelectedTarget] = useState<DeepSkyTarget>(DEEP_SKY_TARGETS[0]);
  const [wavelength, setWavelength] = useState<WavelengthMode>('infrared');

  const currentView = selectedTarget.views[wavelength];

  const wavelengthsList: { id: WavelengthMode; label: string; icon: any; desc: string; band: string }[] = [
    { id: 'optical', label: 'Görünür Işık', icon: Eye, desc: 'Doğal İnsan Gözü Spektrumu', band: '400 - 700 nm' },
    { id: 'infrared', label: 'Kızılötesi (JWST)', icon: Sparkles, desc: 'Toz Geçirgenliği & Yıldız Doğumu', band: '1 - 30 µm' },
    { id: 'xray', label: 'X-Işını (Chandra)', icon: Layers, desc: 'Aşırı Yüksek Enerji & Karadelikler', band: '0.1 - 10 nm' },
    { id: 'radio', label: 'Radyo Spektrumu', icon: Radio, desc: 'Soğuk Gaz & Pulsar Atımları', band: '1 cm - 1 m' },
  ];

  return (
    <div className="min-h-screen bg-background/60 backdrop-blur-sm text-foreground p-4 sm:p-8 lg:p-12 relative z-10 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-card-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Telescope className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                MULTİSPEKTRAL DERİN UZAY GÖZLEMEVİ
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Elektromanyetik Spektrum Gözlemi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-2xl">
              Evreni sadece insan gözünün gördüğü dar görünür ışıkla değil; James Webb’in kızılötesi gözüyle, Chandra’nın X-ışınlarıyla ve dev radyo çanaklarıyla keşfedin.
            </p>
          </div>

          {/* Target Selector */}
          <div className="flex items-center gap-2 bg-card-bg/80 p-1.5 rounded-2xl border border-card-border font-mono text-xs">
            {DEEP_SKY_TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTarget(t)}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedTarget.id === t.id
                    ? 'bg-primary text-background shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wavelength Mode Switcher Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {wavelengthsList.map((item) => {
            const Icon = item.icon;
            const isActive = wavelength === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setWavelength(item.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border backdrop-blur-md transition-all text-left cursor-pointer ${
                  isActive
                    ? 'border-primary bg-primary/20 shadow-[0_0_25px_rgba(0,212,255,0.3)] scale-102 font-bold'
                    : 'border-card-border bg-card-bg/60 hover:border-primary/40 hover:bg-card-bg/90'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon size={18} className={isActive ? 'text-primary' : 'text-text-secondary'} />
                  <span className="text-[10px] font-mono text-text-secondary">{item.band}</span>
                </div>
                <div className="text-sm font-bold text-foreground">{item.label}</div>
                <div className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Interactive Telescope Observation Arena */}
        <div className="rounded-3xl border border-card-border bg-card-bg/75 overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Viewport */}
            <div className="lg:col-span-7 relative min-h-[350px] sm:min-h-[480px] bg-black group overflow-hidden">
              <img
                src={currentView.image}
                alt={selectedTarget.name}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-radial from-transparent via-background/10 to-background/60 pointer-events-none" />

              {/* HUD Reticle */}
              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-card-border bg-background/80 px-3.5 py-1 text-xs font-mono font-bold backdrop-blur-md">
                <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentView.color }} />
                <span>AKTİF DALGABOYU: {wavelength.toUpperCase()}</span>
              </div>

              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-between items-center text-[11px] font-mono text-white/80 bg-background/70 px-4 py-2 rounded-2xl backdrop-blur-md border border-card-border">
                <span>GÖZLEM ARACI: <strong>{currentView.telescope}</strong></span>
                <span>SPEKTRUM: <strong>{currentView.wavelength}</strong></span>
              </div>
            </div>

            {/* Scientific Analysis Side */}
            <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
                  <span className="text-xs font-mono text-primary font-bold">{selectedTarget.catalog}</span>
                  <span className="text-xs font-mono text-text-secondary">{selectedTarget.distance}</span>
                </div>

                <h2 className="text-3xl font-black text-foreground mb-2">
                  {selectedTarget.name}
                </h2>
                <div className="text-xs font-mono text-secondary mb-4">
                  {selectedTarget.type}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {selectedTarget.description}
                </p>

                <div className="rounded-2xl bg-background/60 p-4 border border-card-border/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                    <Sparkles size={14} className="text-primary" />
                    BU DALGABOYUNDA GÖRÜLEN DETAYLAR
                  </div>
                  <p className="text-xs font-mono text-text-secondary leading-relaxed">
                    {currentView.highlights}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-card-border flex items-center justify-between text-xs font-mono text-text-secondary">
                <span>Uzay Gözlemevi Ağı</span>
                <span className="text-primary font-bold">Gerçek Veri Simülasyonu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
