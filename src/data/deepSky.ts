import { ASTRO_IMAGES, type AstroImage } from '@/data/astroImages';
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
      image: AstroImage;
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
        image: ASTRO_IMAGES.m1,
        highlights: 'Genişleyen hidrojen ve oksijen gazı filamentleri, patlamanın dış katmanları.'
      },
      infrared: {
        telescope: 'James Webb (JWST)',
        wavelength: '0.6 - 28 µm (Yakın & Orta Kızılötesi)',
        color: '#ff2255',
        image: ASTRO_IMAGES.crabInfrared,
        highlights: 'Pulsar rüzgarının ısıttığı toz tanecikleri ve iç senkrotron ışıması.'
      },
      xray: {
        telescope: 'Chandra X-Işını Gözlemevi',
        wavelength: '0.1 - 10 nm (Yüksek Enerji X-Ray)',
        color: '#00d4ff',
        image: ASTRO_IMAGES.crabXray,
        highlights: 'Pulsarın manyetik kutuplarından fışkıran devasa plazma jetleri ve yüksek enerjili halkalar.'
      },
      radio: {
        telescope: 'VLA (Very Large Array)',
        wavelength: '6 cm (5 GHz radyo)',
        color: '#a855f7',
        image: ASTRO_IMAGES.crabRadio,
        highlights: 'Pulsar rüzgârının hızlandırdığı elektronların manyetik alanda yaydığı senkrotron ışıması; bulutsunun tamamını dolduran radyo sisi.'
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
        telescope: 'Yer Tabanlı Teleskop (560 mm)',
        wavelength: '380 - 750 nm',
        color: '#ffd700',
        image: ASTRO_IMAGES.m31,
        highlights: 'Yıldız diskleri, parlak sarı çekirdek ve sarmal kollardaki karanlık toz şeritleri.'
      },
      infrared: {
        telescope: 'Spitzer Uzay Teleskobu',
        wavelength: '3.6 - 8 µm',
        color: '#ff4444',
        image: ASTRO_IMAGES.m31Infrared,
        highlights: 'Yeni yıldızların doğduğu sarmal kollardaki ılık yıldızlararası toz halkaları.'
      },
      xray: {
        telescope: 'Chandra X-Işını Gözlemevi',
        wavelength: '0.3 - 8 keV',
        color: '#00e5ff',
        image: ASTRO_IMAGES.m31Xray,
        highlights: 'Merkezdeki süper kütleli karadelik ve yoldaş yıldızından madde çeken X-ışını çift yıldızları.'
      },
      radio: {
        telescope: 'Green Bank & Westerbork (HI) + Herschel',
        wavelength: '21 cm hidrojen + uzak kızılötesi',
        color: '#9c27b0',
        image: ASTRO_IMAGES.m31Radio,
        highlights: 'Galaksinin dış sınırlarına kadar uzanan devasa nötr hidrojen gazı bulutları.'
      }
    }
  }
];
