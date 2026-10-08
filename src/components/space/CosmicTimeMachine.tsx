'use client';

import React, { useState } from 'react';
import { History } from 'lucide-react';

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
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Kozmik zaman makinesi
        </h3>
        <p className="mt-1.5 text-sm text-paper/70">Geçmişe bakış · Işık hızı ve zaman ilişkisi</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">
          Gökyüzüne bakmak geçmişe bakmaktır.
        </p>
      </div>

      {/* Target Selector Buttons */}
      <div className="flex flex-wrap gap-2 text-sm">
        {COSMIC_TIME_DATA.map((item) => {
          const isActive = selectedItem.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`min-h-10 max-w-full border px-3 py-2 text-left leading-snug transition-colors cursor-pointer ${
                isActive
                  ? 'border-solar bg-solar text-ink font-medium'
                  : 'border-line bg-ink-2 text-paper/80 hover:border-paper/40 hover:text-paper'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Time Warp Display Panel */}
      <div className="border border-line bg-ink-2 p-5 sm:p-6 space-y-6">
        <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <span className="text-sm text-paper/70">Seçili gök cismi</span>
            <h4 className="mt-1 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
              {selectedItem.name}
            </h4>
          </div>

          <div className="flex min-w-0 flex-col md:items-end md:text-right">
            <span className="text-sm text-paper/70">Işığın yolculuk süresi</span>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-solar sm:text-xl">
              {selectedItem.lightTime}
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          <div className="min-w-0 space-y-4 md:col-span-4">
            <div>
              <div className="text-sm text-paper/70">Dünya’daki dönem</div>
              <div className="mt-1 text-base font-medium text-paper">{selectedItem.earthEra}</div>
            </div>
            <div>
              <div className="text-sm text-paper/70">Mesafe</div>
              <div className="mt-1 font-mono text-sm tabular-nums text-paper/90">{selectedItem.distanceKm}</div>
            </div>
          </div>

          <div className="min-w-0 space-y-2 border-t border-line pt-5 md:col-span-8 md:border-t-0 md:border-l md:pl-6 md:pt-0">
            <div className="flex items-center gap-2 text-sm font-medium text-solar">
              <History size={16} className="shrink-0" />
              <span>Işık yola çıktığında Dünya’da ne oluyordu?</span>
            </div>
            <p className="text-base leading-relaxed text-paper/85">
              {selectedItem.earthHistory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
