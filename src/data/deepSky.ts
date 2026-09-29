export type WavelengthMode = 'radio' | 'infrared' | 'optical' | 'xray';

export interface DeepSkyTarget {
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

export const DEEP_SKY_TARGETS: DeepSkyTarget[] = [
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
