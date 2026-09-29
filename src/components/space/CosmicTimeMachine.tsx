'use client';

import React, { useState } from 'react';
import { History, Clock, Sparkles, ArrowRight, Hourglass } from 'lucide-react';

interface TimeItem {
  id: string;
  name: string;
  lightTime: string;
  distanceKm: string;
  earthEra: string;
  earthHistory: string;
  badgeColor: string;
}

const COSMIC_TIME_DATA: TimeItem[] = [
  {
    id: 'moon',
    name: 'Ay',
    lightTime: '1.28 Saniye Önce',
    distanceKm: '384,400 km',
    earthEra: 'Şu An (Hemen Hemen Canlı)',
    earthHistory: 'Ay’a baktığınızda sadece bir kalp atışı öncesindeki halini görürsünüz. İletişim neredeyse anlıktır.',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'sun',
    name: 'Güneş',
    lightTime: '8 Dakika 20 Saniye Önce',
    distanceKm: '149.6 Milyon km',
    earthEra: 'Dakikalar Önce',
    earthHistory: 'Güneş aniden sönseydi, Dünya’daki insanlar bunu ancak 8 dakika 20 saniye sonra fark edebilirdi.',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri (En Yakın Yıldız)',
    lightTime: '4.24 Yıl Önce',
    distanceKm: '40.1 Trilyon km (4.24 Işık Yılı)',
    earthEra: 'Yakın Geçmiş',
    earthHistory: 'Şu an gökyüzünde gördüğünüz ışık, Dünya’da bundan yaklaşık 4 yıl önce yola çıktı.',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'polaris',
    name: 'Kutup Yıldızı (Polaris)',
    lightTime: '433 Yıl Önce',
    distanceKm: '4.1 Katrilyon km (433 Işık Yılı)',
    earthEra: '1590’lar • Rönesans Dönemi',
    earthHistory: 'Kutup Yıldızı’nın şu an gözünüze ulaşan fotonları yola çıktığında Galileo henüz teleskobu icat etmemişti ve Osmanlı İmparatorluğu III. Murad dönemindeydi.',
    badgeColor: 'text-star-gold bg-star-gold/10 border-star-gold/30'
  },
  {
    id: 'crab',
    name: 'Yengeç Bulutsusu (M1)',
    lightTime: '6,500 Yıl Önce',
    distanceKm: '61.5 Katrilyon km (6,500 Işık Yılı)',
    earthEra: 'MÖ 4500 • Mezopotamya Medeniyeti',
    earthHistory: 'Bu bulutsunun ışığı yola çıktığında Dünya’da tekerlek henüz yeni bulunuyordu ve ilk Sümer kentleri kurulmaktaydı.',
    badgeColor: 'text-accent bg-accent/10 border-accent/30'
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaksisi (M31)',
    lightTime: '2.5 Milyon Yıl Önce',
    distanceKm: '24 Trilyon x Milyar km (2.53M Işık Yılı)',
    earthEra: 'Pleistosen Çağı • İlk İnsansılar',
    earthHistory: 'Andromeda’nın çıplak gözle görülebilen ışığı yola çıktığında modern insan (Homo sapiens) henüz var olmamıştı. Dünya’da ilk ilkel aletleri kullanan hominidler yaşıyordu.',
    badgeColor: 'text-secondary bg-secondary/10 border-secondary/30'
  },
  {
    id: 'gn-z11',
    name: 'GN-z11 Galaksisi (Evrenin Ufku)',
    lightTime: '13.4 Milyar Yıl Önce',
    distanceKm: 'Evrenin Genişleme Sınırı (~32 Milyar Işık Yılı)',
    earthEra: 'Büyük Patlama’dan 400 Milyon Yıl Sonra',
    earthHistory: 'Bu ışık yola çıktığında ne Güneş vardı, ne Dünya vardı ne de Samanyolu! Evren henüz bebeklik çağındaydı ve ilk yıldızlar yeni aydınlanıyordu.',
    badgeColor: 'text-red-400 bg-red-400/10 border-red-400/30'
  }
];

export function CosmicTimeMachine() {
  const [selectedItem, setSelectedItem] = useState<TimeItem>(COSMIC_TIME_DATA[3]); // Polaris default

  return (
    <div className="rounded-3xl border border-primary/30 bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Hourglass className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Kozmik Zaman Makinesi • Geçmişe Bakış
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">IŞIK HIZI & ZAMAN İLİŞKİSİ</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          GÖKYÜZÜNE BAKMAK GEÇMİŞE BAKMAKTIR
        </span>
      </div>

      {/* Target Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {COSMIC_TIME_DATA.map((item) => {
          const isActive = selectedItem.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-background font-bold shadow-[0_0_20px_rgba(255,91,34,0.4)] scale-102'
                  : 'bg-background/60 text-text-secondary border border-card-border/60 hover:text-paper'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Time Warp Display Panel */}
      <div className="rounded-2xl bg-background/60 p-6 border border-card-border/60 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-card-border/40 pb-4">
          <div>
            <span className="text-xs font-mono text-text-secondary">SEÇİLİ HEDEF GÖK CİSMİ</span>
            <h4 className="text-2xl font-black text-foreground">{selectedItem.name}</h4>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-[10px] font-mono text-text-secondary uppercase">IŞIĞIN YOLCULUK SÜRESİ</span>
            <div className="text-xl font-black text-star-gold font-mono">{selectedItem.lightTime}</div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 rounded-xl bg-card-bg/80 p-4 border border-card-border/50 space-y-2 font-mono text-xs">
            <div className="text-text-secondary text-[10px]">DÜNYA'DAKİ DÖNEM</div>
            <div className="text-sm font-bold text-primary">{selectedItem.earthEra}</div>
            <div className="pt-2 border-t border-card-border/40 text-[11px] text-text-secondary">
              Mesafe: <strong className="text-foreground">{selectedItem.distanceKm}</strong>
            </div>
          </div>

          <div className="md:col-span-8 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
              <History size={15} />
              IŞIK YOLA ÇIKTIĞINDA DÜNYA'DA NE OLUYORDU?
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {selectedItem.earthHistory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
