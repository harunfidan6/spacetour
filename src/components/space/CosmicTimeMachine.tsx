'use client';

import React, { useState } from 'react';
import { History, Hourglass } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface TimeItem {
  id: string;
  name: string;
  lightTime: string;
  distanceKm: string;
  earthEra: string;
  earthHistory: string;
}

const COSMIC_TIME_DATA: TimeItem[] = [
  {
    id: 'moon',
    name: 'Ay',
    lightTime: '1.28 Saniye Önce',
    distanceKm: '384,400 km',
    earthEra: 'Şu An (Hemen Hemen Canlı)',
    earthHistory: 'Ay’a baktığınızda sadece bir kalp atışı öncesindeki halini görürsünüz. İletişim neredeyse anlıktır.',
  },
  {
    id: 'sun',
    name: 'Güneş',
    lightTime: '8 Dakika 20 Saniye Önce',
    distanceKm: '149.6 Milyon km',
    earthEra: 'Dakikalar Önce',
    earthHistory: 'Güneş aniden sönseydi, Dünya’daki insanlar bunu ancak 8 dakika 20 saniye sonra fark edebilirdi.',
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri (En Yakın Yıldız)',
    lightTime: '4.24 Yıl Önce',
    distanceKm: '40.1 Trilyon km (4.24 Işık Yılı)',
    earthEra: 'Yakın Geçmiş',
    earthHistory: 'Şu an gökyüzünde gördüğünüz ışık, Dünya’da bundan yaklaşık 4 yıl önce yola çıktı.',
  },
  {
    id: 'polaris',
    name: 'Kutup Yıldızı (Polaris)',
    lightTime: '433 Yıl Önce',
    distanceKm: '4.1 Katrilyon km (433 Işık Yılı)',
    earthEra: '1590’lar · Rönesans Dönemi',
    earthHistory: 'Kutup Yıldızı’nın şu an gözünüze ulaşan fotonları yola çıktığında Galileo henüz teleskobu icat etmemişti ve Osmanlı İmparatorluğu III. Murad dönemindeydi.',
  },
  {
    id: 'crab',
    name: 'Yengeç Bulutsusu (M1)',
    lightTime: '6,500 Yıl Önce',
    distanceKm: '61.5 Katrilyon km (6,500 Işık Yılı)',
    earthEra: 'MÖ 4500 · Mezopotamya Medeniyeti',
    earthHistory: 'Bu bulutsunun ışığı yola çıktığında Dünya’da tekerlek henüz yeni bulunuyordu ve ilk Sümer kentleri kurulmaktaydı.',
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaksisi (M31)',
    lightTime: '2.5 Milyon Yıl Önce',
    distanceKm: '24 Trilyon × Milyar km (2.53M Işık Yılı)',
    earthEra: 'Pleistosen Çağı · İlk İnsansılar',
    earthHistory: 'Andromeda’nın çıplak gözle görülebilen ışığı yola çıktığında modern insan (Homo sapiens) henüz var olmamıştı. Dünya’da ilk ilkel aletleri kullanan hominidler yaşıyordu.',
  },
  {
    id: 'gn-z11',
    name: 'GN-z11 Galaksisi (Evrenin Ufku)',
    lightTime: '13.4 Milyar Yıl Önce',
    distanceKm: 'Evrenin Genişleme Sınırı (~32 Milyar Işık Yılı)',
    earthEra: 'Büyük Patlama’dan 400 Milyon Yıl Sonra',
    earthHistory: 'Bu ışık yola çıktığında ne Güneş vardı, ne Dünya vardı ne de Samanyolu! Evren henüz bebeklik çağındaydı ve ilk yıldızlar yeni aydınlanıyordu.',
  }
];

export function CosmicTimeMachine() {
  const [selectedItem, setSelectedItem] = useState<TimeItem>(COSMIC_TIME_DATA[3]); // Polaris default

  return (
    <div className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-6">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Hourglass className="h-4 w-4 text-solar animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <h3 className="display display-tight text-xl text-paper sm:text-2xl">
              Kozmik Zaman Makinesi · Geçmişe Bakış
            </h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              IŞIK HIZI & ZAMAN İLİŞKİSİ
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-1 border border-solar/30 bg-solar/10 text-solar font-bold uppercase tracking-wider">
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
              className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer border uppercase tracking-wider ${
                isActive
                  ? 'border-solar bg-solar text-ink font-bold'
                  : 'border-line bg-ink-2 text-muted hover:border-line hover:text-paper'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Time Warp Display Panel */}
      <div className="border border-line bg-ink-2 p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-line pb-4">
          <div>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">SEÇİLİ HEDEF GÖK CİSMİ</span>
            <h4 className="font-mono text-xl sm:text-2xl font-bold text-paper mt-0.5">{selectedItem.name}</h4>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">IŞIĞIN YOLCULUK SÜRESİ</span>
            <div className="font-mono text-xl font-bold text-solar">{selectedItem.lightTime}</div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 bg-ink p-4 border border-line space-y-2 font-mono text-xs">
            <div className="text-muted text-[10px] uppercase tracking-widest">DÜNYA’DAKİ DÖNEM</div>
            <div className="text-sm font-bold text-paper">{selectedItem.earthEra}</div>
            <div className="pt-2 border-t border-line text-[11px] text-muted">
              Mesafe: <strong className="text-paper">{selectedItem.distanceKm}</strong>
            </div>
          </div>

          <div className="md:col-span-8 p-4 bg-ink border border-line space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-solar">
              <History size={14} />
              <span>IŞIK YOLA ÇIKTIĞINDA DÜNYA’DA NE OLUYORDU?</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              {selectedItem.earthHistory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
