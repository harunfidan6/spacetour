'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Moon,
  Sparkles,
  Eye,
  Compass,
  Telescope,
  Clock,
  ArrowRight,
  Sun,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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
    <div className="rounded-3xl border border-primary/20 bg-card-bg/75 p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-card-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Telescope className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">
              GÖKYÜZÜ GÖZLEM RADARI • CANLI TELEMETRİ
            </span>
          </div>
          <h3 className="text-2xl font-black text-foreground">Bu Gece Gökyüzü</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Bulunduğunuz konumdan bu akşam çıplak gözle ve amatör teleskopla izlenebilecek gökcisimleri.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-background/60 p-1.5 border border-card-border/80 text-xs font-mono">
          <button
            onClick={() => setSelectedTab('planets')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedTab === 'planets'
                ? 'bg-primary text-background shadow-[0_0_15px_rgba(255,91,34,0.4)]'
                : 'text-text-secondary hover:text-paper'
            }`}
          >
            Gezegenler
          </button>
          <button
            onClick={() => setSelectedTab('moon')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedTab === 'moon'
                ? 'bg-primary text-background shadow-[0_0_15px_rgba(255,91,34,0.4)]'
                : 'text-text-secondary hover:text-paper'
            }`}
          >
            Ay Evresi
          </button>
          <button
            onClick={() => setSelectedTab('quality')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedTab === 'quality'
                ? 'bg-primary text-background shadow-[0_0_15px_rgba(255,91,34,0.4)]'
                : 'text-text-secondary hover:text-paper'
            }`}
          >
            Gözlem Kalitesi
          </button>
        </div>
      </div>

      {/* Tab: Planets */}
      {selectedTab === 'planets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {visiblePlanets.map((planet) => (
              <div
                key={planet.name}
                className="group rounded-2xl border border-card-border/80 bg-background/50 p-4 hover:border-primary/50 hover:bg-card-bg/90 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{planet.emoji}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      planet.visibility === 'Mükemmel'
                        ? 'border-lime/40 bg-lime/10 text-lime'
                        : planet.visibility === 'İyi'
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-gold/40 bg-gold/10 text-gold'
                    }`}
                  >
                    {planet.visibility}
                  </span>
                </div>

                <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {planet.name}
                </div>
                <div className="text-[11px] font-mono text-secondary mt-0.5">{planet.constellation}</div>

                <div className="mt-3 pt-2.5 border-t border-card-border/50 text-[11px] font-mono space-y-1">
                  <div className="text-text-secondary flex justify-between">
                    <span>Parlaklık:</span>
                    <span className="text-foreground font-bold">{planet.magnitude}</span>
                  </div>
                  <div className="text-text-secondary leading-snug pt-1 text-[10px]">
                    🕒 {planet.bestTime}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-text-secondary font-mono flex items-center gap-2">
              <Sparkles size={14} className="text-star-gold" />
              <span>Gezegenlerin 3D konumlarını canlı haritada görmek için:</span>
            </div>
            <Link
              href="/harita"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary transition-colors"
            >
              <span>3D Planetaryum'u Aç</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Moon */}
      {selectedTab === 'moon' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-background/50 border border-card-border/80 text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-300 via-gold to-slate-200 shadow-[0_0_40px_rgba(255,230,170,0.5)] border-2 border-gold/50 flex items-center justify-center text-4xl">
                🌔
              </div>
            </div>
            <div className="text-lg font-bold text-foreground">Büyüyen Şişkin Ay</div>
            <div className="text-xs font-mono text-primary font-bold mt-1">%78 Aydınlık</div>
          </div>

          <div className="md:col-span-8 space-y-3.5 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-[10px] text-text-secondary block">Doğuş Saati</span>
                <span className="font-bold text-foreground text-sm">16:42</span>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-[10px] text-text-secondary block">Batış Saati</span>
                <span className="font-bold text-foreground text-sm">05:18</span>
              </div>
              <div className="p-3 rounded-xl bg-background/50 border border-card-border/60">
                <span className="text-[10px] text-text-secondary block">Dünya'ya Mesafe</span>
                <span className="font-bold text-foreground text-sm">384,400 km</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card-bg/90 border border-card-border leading-relaxed text-text-secondary font-sans text-xs">
              💡 <strong>Gözlem İpucu:</strong> Ay ışığı bu evrede derin uzay bulutsularını soluklaştırabilir ancak Ay yüzeyindeki kraterleri (Tycho, Copernicus) dürbün veya küçük bir teleskopla incelemek için terminatör (aydınlık-karanlık sınırı) çizgisi kusursuz ayrıntı sunar.
            </div>
          </div>
        </div>
      )}

      {/* Tab: Quality */}
      {selectedTab === 'quality' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-background/50 border border-card-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">Işık Kirliliği</span>
              <span className="text-xs font-mono font-bold text-lime">Bortle Sınıfı 4</span>
            </div>
            <div className="w-full bg-card-bg rounded-full h-2 overflow-hidden">
              <div className="bg-lime h-2 rounded-full w-2/3" />
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Kırsal/banliyö geçiş göğü. Samanyolu çıplak gözle ufkun üstünde seçilebilir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background/50 border border-card-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">Atmosferik Durgunluk</span>
              <span className="text-xs font-mono font-bold text-primary">Seeing: 4/5</span>
            </div>
            <div className="w-full bg-card-bg rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-4/5" />
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Hava katmanları stabil; yüksek büyütmede gezegen detayları titremesiz izlenebilir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background/50 border border-card-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">Bulut Örtüsü</span>
              <span className="text-xs font-mono font-bold text-lime">%10 (Açık)</span>
            </div>
            <div className="w-full bg-card-bg rounded-full h-2 overflow-hidden">
              <div className="bg-lime h-2 rounded-full w-[10%]" />
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Gözlem pencereleri gece boyu kristal netliğinde açık kalacak.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
