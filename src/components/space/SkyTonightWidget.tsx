'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Telescope, ArrowRight } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface VisiblePlanet {
  name: string;
  constellation: string;
  magnitude: string;
  bestTime: string;
  visibility: 'Mükemmel' | 'İyi' | 'Orta';
  color: string;
  emoji: string;
}

export function SkyTonightWidget() {
  const [selectedTab, setSelectedTab] = useState<'planets' | 'moon' | 'quality'>('planets');

  const visiblePlanets: VisiblePlanet[] = [
    {
      name: 'Jüpiter',
      constellation: 'Boğa (Taurus)',
      magnitude: '-2.4 m (Çok Parlak)',
      bestTime: 'Gün batımından gece yarısına kadar',
      visibility: 'Mükemmel',
      color: '#e5c158',
      emoji: '🪐'
    },
    {
      name: 'Venüs',
      constellation: 'Balıklar (Pisces)',
      magnitude: '-4.1 m (Akşam Yıldızı)',
      bestTime: 'Batı ufkunda gün batımından hemen sonra',
      visibility: 'Mükemmel',
      color: '#fff0cc',
      emoji: '✨'
    },
    {
      name: 'Mars',
      constellation: 'İkizler (Gemini)',
      magnitude: '+0.5 m (Kızıl Parıltı)',
      bestTime: 'Gece 22:00 sonrası doğu ufkunda',
      visibility: 'İyi',
      color: '#ff4422',
      emoji: '🔴'
    },
    {
      name: 'Satürn',
      constellation: 'Kova (Aquarius)',
      magnitude: '+0.8 m (Sarımsı Ton)',
      bestTime: 'Akşamın ilk saatleri güneybatıda',
      visibility: 'Orta',
      color: '#e2c58a',
      emoji: '🪐'
    }
  ];

  return (
    <div className="relative ticks border border-line bg-ink p-6 lg:p-8 space-y-6">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Telescope className="h-4 w-4 text-solar" />
            <span className="font-mono text-[10px] text-solar font-bold uppercase tracking-widest">
              GÖKYÜZÜ GÖZLEM RADARI · CANLI TELEMETRİ
            </span>
          </div>
          <h3 className="display display-tight text-2xl text-paper sm:text-3xl">Bu Gece Gökyüzü</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Bulunduğunuz konumdan bu akşam çıplak gözle ve amatör teleskopla izlenebilecek gökcisimleri.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 border border-line bg-ink-2 p-1 font-mono text-xs">
          <button
            onClick={() => setSelectedTab('planets')}
            className={`px-3 py-1.5 transition-colors cursor-pointer border uppercase tracking-wider ${
              selectedTab === 'planets'
                ? 'border-solar bg-solar text-ink font-bold'
                : 'border-transparent text-muted hover:text-paper'
            }`}
          >
            Gezegenler
          </button>
          <button
            onClick={() => setSelectedTab('moon')}
            className={`px-3 py-1.5 transition-colors cursor-pointer border uppercase tracking-wider ${
              selectedTab === 'moon'
                ? 'border-solar bg-solar text-ink font-bold'
                : 'border-transparent text-muted hover:text-paper'
            }`}
          >
            Ay Evresi
          </button>
          <button
            onClick={() => setSelectedTab('quality')}
            className={`px-3 py-1.5 transition-colors cursor-pointer border uppercase tracking-wider ${
              selectedTab === 'quality'
                ? 'border-solar bg-solar text-ink font-bold'
                : 'border-transparent text-muted hover:text-paper'
            }`}
          >
            Gözlem Kalitesi
          </button>
        </div>
      </div>

      {/* Tab: Planets */}
      {selectedTab === 'planets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visiblePlanets.map((planet) => (
              <div
                key={planet.name}
                className="group border border-line bg-ink-2 p-4 hover:border-solar/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{planet.emoji}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider ${
                      planet.visibility === 'Mükemmel'
                        ? 'border-lime/40 bg-lime/10 text-lime'
                        : planet.visibility === 'İyi'
                        ? 'border-solar/40 bg-solar/10 text-solar'
                        : 'border-line text-muted'
                    }`}
                  >
                    {planet.visibility}
                  </span>
                </div>

                <div className="font-mono text-base font-bold text-paper group-hover:text-solar transition-colors">
                  {planet.name}
                </div>
                <div className="text-[11px] font-mono text-muted mt-0.5">{planet.constellation}</div>

                <div className="mt-3 pt-2.5 border-t border-line text-[11px] font-mono space-y-1">
                  <div className="text-muted flex justify-between">
                    <span>Parlaklık:</span>
                    <span className="text-paper font-bold">{planet.magnitude}</span>
                  </div>
                  <div className="text-muted leading-snug pt-1 text-[10px]">
                    🕒 {planet.bestTime}
                  </div>
                </div>
              </div>
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
              <div className="w-20 h-20 border border-line bg-ink flex items-center justify-center text-4xl">
                🌔
              </div>
            </div>
            <div className="font-mono text-base font-bold text-paper">Büyüyen Şişkin Ay</div>
            <div className="text-xs font-mono text-solar font-bold mt-1">%78 Aydınlık</div>
          </div>

          <div className="md:col-span-8 space-y-3.5 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Doğuş Saati</span>
                <span className="font-bold text-paper text-sm">16:42</span>
              </div>
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Batış Saati</span>
                <span className="font-bold text-paper text-sm">05:18</span>
              </div>
              <div className="p-3 bg-ink-2 border border-line">
                <span className="text-[10px] text-muted block uppercase">Dünya’ya Mesafe</span>
                <span className="font-bold text-paper text-sm">384,400 km</span>
              </div>
            </div>

            <div className="p-4 bg-ink-2 border border-line leading-relaxed text-muted text-xs">
              <strong className="text-paper">Gözlem İpucu:</strong> Ay ışığı bu evrede derin uzay bulutsularını soluklaştırabilir ancak Ay yüzeyindeki kraterleri (Tycho, Copernicus) dürbün veya küçük bir teleskopla incelemek için terminatör (aydınlık-karanlık sınırı) çizgisi kusursuz ayrıntı sunar.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Quality */}
      {selectedTab === 'quality' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted uppercase">Işık Kirliliği</span>
              <span className="text-xs font-bold text-lime">Bortle Sınıfı 4</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-lime h-full w-2/3" />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Kırsal/banliyö geçiş göğü. Samanyolu çıplak gözle ufkun üstünde seçilebilir.
            </p>
          </div>

          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted uppercase">Atmosferik Durgunluk</span>
              <span className="text-xs font-bold text-solar">Seeing: 4/5</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-solar h-full w-4/5" />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Hava katmanları stabil; yüksek büyütmede gezegen detayları titremesiz izlenebilir.
            </p>
          </div>

          <div className="p-4 bg-ink-2 border border-line space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted uppercase">Bulut Örtüsü</span>
              <span className="text-xs font-bold text-lime">%10 (Açık)</span>
            </div>
            <div className="w-full bg-ink h-1.5 border border-line overflow-hidden">
              <div className="bg-lime h-full w-[10%]" />
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Gözlem pencereleri gece boyu kristal netliğinde açık kalacak.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
