'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DestinationId = 'solar-overview' | 'sun' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'blackhole' | 'deep-space';

export interface DestinationInfo {
  id: DestinationId;
  name: string;
  tag: string;
  distance: string;
  coords: [number, number, number];
  targetPosition: [number, number, number]; // where the camera goes
  lookAt: [number, number, number];
  description: string;
  speed: string;
  temperature: string;
  gravity: string;
}

export const DESTINATIONS: Record<DestinationId, DestinationInfo> = {
  'solar-overview': {
    id: 'solar-overview',
    name: 'Güneş Sistemi Görünümü',
    tag: 'SİSTEM GENELİ',
    distance: '0 AU',
    coords: [0, 0, 0],
    targetPosition: [0, 35, 65],
    lookAt: [0, 0, 0],
    description: 'Samanyolu Galaksisi Avcı Kolu, Sol Sistemi genel görünümü.',
    speed: '0.1c',
    temperature: '2.7 K (-270.4°C)',
    gravity: 'Mikroyerçekimi'
  },
  sun: {
    id: 'sun',
    name: 'Güneş (Sol)',
    tag: 'YILDIZ',
    distance: '0.00 AU',
    coords: [0, 0, 0],
    targetPosition: [0, 5, 22],
    lookAt: [0, 0, 0],
    description: 'Orta büyüklükte G-tipi ana kol sarı cüce yıldız. Sistem kütlesinin %99.86’sı.',
    speed: '0.0c',
    temperature: '5,500°C (Yüzey) / 15M°C (Çekirdek)',
    gravity: '274 m/s² (28g)'
  },
  earth: {
    id: 'earth',
    name: 'Dünya (Terra)',
    tag: 'YAŞAM ALANI',
    distance: '1.00 AU',
    coords: [24, 0, 0],
    targetPosition: [24, 2, 7],
    lookAt: [24, 0, 0],
    description: 'Sıvı su barındıran ve bilinen tek yaşam taşıyıcısı karasal gezegen.',
    speed: '29.78 km/s',
    temperature: '15°C Ortalama',
    gravity: '9.81 m/s² (1g)'
  },
  mars: {
    id: 'mars',
    name: 'Mars (Kızıl Gezegen)',
    tag: 'HEDEF KOLONİ',
    distance: '1.52 AU',
    coords: [34, 0, -8],
    targetPosition: [34, 1.5, -2],
    lookAt: [34, 0, -8],
    description: 'Demir oksit zengini regolit yüzey, ince CO2 atmosferi, sönmüş dev yanardağlar.',
    speed: '24.07 km/s',
    temperature: '-63°C Ortalama',
    gravity: '3.72 m/s² (0.38g)'
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jüpiter',
    tag: 'GAZ DEVİ',
    distance: '5.20 AU',
    coords: [50, 0, 15],
    targetPosition: [50, 5, 30],
    lookAt: [50, 0, 15],
    description: 'En büyük gezegen. Hidrojen/Helyum yapısı, asırlık Büyük Kırmızı Leke fırtınası.',
    speed: '13.07 km/s',
    temperature: '-110°C (Bulut Üstü)',
    gravity: '24.79 m/s² (2.53g)'
  },
  saturn: {
    id: 'saturn',
    name: 'Satürn',
    tag: 'HALKALI DEV',
    distance: '9.58 AU',
    coords: [70, 0, -20],
    targetPosition: [70, 8, -6],
    lookAt: [70, 0, -20],
    description: 'Muazzam buz ve toz parçacıklarından oluşan ikonik halka sistemi.',
    speed: '9.68 km/s',
    temperature: '-140°C',
    gravity: '10.44 m/s² (1.06g)'
  },
  blackhole: {
    id: 'blackhole',
    name: 'Gargantua (Singularity)',
    tag: 'SÜPER KÜTLELİ KARADELİK',
    distance: '124.5 AU (Warp Sıçraması)',
    coords: [0, 0, -110],
    targetPosition: [0, 8, -80],
    lookAt: [0, 0, -110],
    description: 'Işığın dahi kaçamadığı olay ufku ve plazma akresyon diski. Zaman genişlemesi alanı.',
    speed: 'c’ye yakın (Göreli Hız)',
    temperature: 'Akresyon diski: 10,000,000°C',
    gravity: 'Sonsuza Yaklaşan Tekillik'
  },
  'deep-space': {
    id: 'deep-space',
    name: 'Derin Uzay & Nebula',
    tag: 'YILDIZLARARASI',
    distance: '4.24 Işık Yılı',
    coords: [0, 20, -60],
    targetPosition: [0, 45, -20],
    lookAt: [0, 0, -100],
    description: 'Güneş rüzgarının bittiği heliopoz ötesi yıldızlararası gaz ve nebula ortamı.',
    speed: 'Warp 8.4',
    temperature: '2.7 K',
    gravity: '0.00 m/s²'
  }
};

interface SpaceContextType {
  currentDestination: DestinationInfo;
  setDestination: (id: DestinationId) => void;
  isWarping: boolean;
  warpSpeed: number; // 0 to 1
  autoPilot: boolean;
  toggleAutoPilot: () => void;
  hudVisible: boolean;
  toggleHud: () => void;
  throttle: number; // 1 to 10
  setThrottle: (val: number) => void;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export function SpaceProvider({ children }: { children: ReactNode }) {
  const [currentDestination, setCurrentDest] = useState<DestinationInfo>(DESTINATIONS['solar-overview']);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpSpeed, setWarpSpeed] = useState<number>(0);
  const [autoPilot, setAutoPilot] = useState<boolean>(false);
  const [hudVisible, setHudVisible] = useState<boolean>(true);
  const [throttle, setThrottle] = useState<number>(1);

  const setDestination = (id: DestinationId) => {
    if (id === currentDestination.id && !isWarping) return;
    setIsWarping(true);
    setWarpSpeed(1.0);
    setCurrentDest(DESTINATIONS[id]);

    // Warp duration
    setTimeout(() => {
      setWarpSpeed(0);
      setIsWarping(false);
    }, 2200);
  };

  const toggleAutoPilot = () => {
    setAutoPilot((prev) => !prev);
  };

  const toggleHud = () => {
    setHudVisible((prev) => !prev);
  };

  return (
    <SpaceContext.Provider
      value={{
        currentDestination,
        setDestination,
        isWarping,
        warpSpeed,
        autoPilot,
        toggleAutoPilot,
        hudVisible,
        toggleHud,
        throttle,
        setThrottle
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
}

export function useSpace() {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
}
