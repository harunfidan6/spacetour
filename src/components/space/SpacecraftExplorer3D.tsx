'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Play,
  Pause,
  Layers,
  Radio,
  ChevronRight
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useInView } from '@/lib/useInView';

export type SpacecraftId = 'jwst' | 'iss' | 'voyager1' | 'perseverance';

interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number];
  role: string;
  specs: string;
}

interface SpacecraftData {
  id: SpacecraftId;
  name: string;
  subtitle: string;
  organization: string;
  launchYear: number;
  currentLocation: string;
  distance: string;
  speed: string;
  blurb: string;
  hotspots: Hotspot[];
}

export const SPACECRAFTS: SpacecraftData[] = [
  {
    id: 'jwst',
    name: 'James Webb Uzay Teleskobu (JWST)',
    subtitle: 'Derin Kızılötesi Uzay Gözlemevi',
    organization: 'NASA / ESA / CSA',
    launchYear: 2021,
    currentLocation: 'Güneş-Dünya L2 Lagrange Noktası',
    distance: '1.500.000 km',
    speed: 'Yörüngesel Halo Hızı',
    blurb: '13.5 milyar yıl öncesine, evrenin ilk galaksilerine ve ötegezegen atmosferlerindeki yaşam izlerine bakan insanlığın en gelişmiş gözü.',
    hotspots: [
      {
        id: 'primary-mirror',
        name: 'Birincil Ayna (6.5 metre)',
        position: [0, 0.4, 0.3],
        role: 'Foton Toplama',
        specs: '18 adet altın kaplamalı berilyum altıgen segment. Kızılötesi yansıtıcılığı maksimize etmek için 100 nm kalınlığında saf altın kaplama.'
      },
      {
        id: 'secondary-mirror',
        name: 'İkincil Ayna & Tripod',
        position: [0, 0.3, 2.2],
        role: 'Işık Odaklama',
        specs: '3 kollu kompozit grafit tripod üzerinde taşınır. Birincil aynadan gelen fotonları ISIM enstrüman çekirdeğine odaklar.'
      },
      {
        id: 'sunshield',
        name: '5 Katmanlı Güneş Kalkanı',
        position: [0, -0.7, 0],
        role: 'Termal İzolasyon',
        specs: 'Tenis kortu büyüklüğünde (21x14 m) 5 kat Kapton filmi. Sıcak taraf +85°C iken enstrüman tarafını -233°C (40 Kelvin) altında tutar.'
      },
      {
        id: 'bus-solar',
        name: 'Güneş Paneli & Servis Modülü',
        position: [0, -1.2, -0.8],
        role: 'Güç & Telemetri',
        specs: '2 kW güç sağlayan lityum-iyon destekli fotovoltaik dizi ve Ka-band derin uzay haberleşme anteni.'
      }
    ]
  },
  {
    id: 'iss',
    name: 'Uluslararası Uzay İstasyonu (ISS)',
    subtitle: 'Alçak Dünya Yörüngesi Mikro-yerçekimi Laboratuvarı',
    organization: 'NASA / Roscosmos / ESA / JAXA / CSA',
    launchYear: 1998,
    currentLocation: 'Alçak Dünya Yörüngesi (LEO)',
    distance: '420 km',
    speed: '27.600 km/s (7.66 km/sn)',
    blurb: 'Günde 16 kez Dünya çevresini turlayan, 25 yılı aşkın süredir kesintisiz insanlı görev icra eden uluslararası bilim üssü.',
    hotspots: [
      {
        id: 'solar-wings',
        name: 'Fotovoltaik Güneş Kanatları',
        position: [2.6, 0, 0],
        role: 'Enerji Üretimi',
        specs: '73 metre açıklığa sahip 8 çift devasa güneş kanadı; istasyonun tüm yaşam destek ve bilim deneylerine 120 kW elektrik üretir.'
      },
      {
        id: 'truss',
        name: 'Ana İskelet (Integrated Truss)',
        position: [0, 0, 0],
        role: 'Yapısal Omurga',
        specs: '109 metre uzunluğundaki modüler alüminyum kiriş; güneş panellerini, ısı radyatörlerini ve robotik rayları taşır.'
      },
      {
        id: 'labs',
        name: 'Basınçlı Bilim Modülleri',
        position: [0, -0.4, 0.4],
        role: 'Laboratuvar Çekirdeği',
        specs: 'Destiny (ABD), Columbus (Avrupa) ve Kibo (Japonya) modülleri; kanser, kristal büyümesi ve malzeme fiziği deneyleri yürütür.'
      },
      {
        id: 'cupola',
        name: 'Cupola Gözlem Kubbesi',
        position: [0, -0.8, 0.8],
        role: 'Dünya Gözlemi',
        specs: '7 pencereli panoramik kubbe; astronotların Dünya atmosferini ve uzay yürüyüşlerini izlediği gözlem noktası.'
      }
    ]
  },
  {
    id: 'voyager1',
    name: 'Voyager 1',
    subtitle: 'Yıldızlararası Uzaydaki İlk İnsan Yapımı Nesne',
    organization: 'NASA JPL',
    launchYear: 1977,
    currentLocation: 'Yıldızlararası Plazma (Helyopozun Ötesi)',
    distance: '24.450.000.000 km (163.4 AU)',
    speed: '61.198 km/s (17.0 km/sn)',
    blurb: 'Jüpiter ve Satürn’ün yerçekimi sapanıyla güneş rüzgârının bittiği yıldızlararası boşluğa fırlatılan, insanlığın en uzak elçisi.',
    hotspots: [
      {
        id: 'antenna',
        name: 'Yüksek Kazançlı Çanak Anten',
        position: [0, 0.7, 0],
        role: 'Derin Uzay İletişimi',
        specs: '3.7 metre çapında parabolik karbon fiber reflektör. Sinyalin Dünya’ya ulaşması tek yönde 22.5 saatten fazla sürer.'
      },
      {
        id: 'rtg',
        name: 'Radyoizotop Jeneratörü (RTG)',
        position: [-1.4, -0.3, 0],
        role: 'Nükleer Güç Kaynağı',
        specs: 'Plütonyum-238 izotopunun radyoaktif bozunma ısısını elektriğe çevirir. 49 yıldır kesintisiz çalışmaktadır.'
      },
      {
        id: 'golden-record',
        name: 'Altın Plak (Golden Record)',
        position: [0.3, -0.2, 0.5],
        role: 'Kozmik Zaman Kapsülü',
        specs: 'Dünya’daki yaşamı, 115 fotoğrafı, doğal sesleri ve 55 dilde selamlamayı (Türkçe dahil) içeren altın kaplama bakır fonografik plak.'
      },
      {
        id: 'magnetometer',
        name: 'Manyetometre Bom Kolu',
        position: [1.6, 0.5, -0.5],
        role: 'Yıldızlararası Manyetik Alan',
        specs: '13 metre uzunluğundaki fiberglas direk; uzay aracının kendi manyetik alanından etkilenmeden galaktik manyetik alanı ölçer.'
      }
    ]
  },
  {
    id: 'perseverance',
    name: 'Perseverance Mars Gezgini',
    subtitle: 'Jezero Krateri Biyo-imza ve Örnek Toplama Gezgini',
    organization: 'NASA JPL',
    launchYear: 2020,
    currentLocation: 'Jezero Krateri Antik Nehir Deltası, Mars',
    distance: 'Ort. 225.000.000 km',
    speed: '152 m/saat (Maksimum arazi hızı)',
    blurb: 'Kızıl Gezegende antik mikrobiyal yaşam izlerini arayan ve gelecekte Dünya’ya getirilecek kaya çekirdeklerini mühürleyen nükleer tekerlekli laboratuvar.',
    hotspots: [
      {
        id: 'mastcam',
        name: 'Mastcam-Z & SuperCam Direği',
        position: [0, 0.9, 0.4],
        role: 'Stereoskopik Göz & Lazer',
        specs: 'Kaya minerallerini buharlaştıran kızılötesi lazer spektrometresi ve 4K ultra yüksek çözünürlüklü stereo zoom kameralar.'
      },
      {
        id: 'robotic-arm',
        name: 'Robotik Kol & Örnek Matkabı',
        position: [0.7, 0.1, 0.8],
        role: 'Jeolojik Sondaj',
        specs: '2.1 metre uzunluğundaki taret kolu; PIXL röntgen spektrometresi ve Mars taşlarını tüplere hapseden karot matkabı.'
      },
      {
        id: 'moxie',
        name: 'MOXIE Oksijen Jeneratörü',
        position: [-0.2, 0.2, -0.2],
        role: 'Yerinde Kaynak Üretimi',
        specs: 'Mars’ın %96 CO2 atmosferini 800°C katı oksit elektrolizi ile saf solunabilir O2 gazına dönüştürür.'
      },
      {
        id: 'wheels',
        name: 'Rocker-Bogie 6 Tekerlek Sistemi',
        position: [0, -0.5, 0],
        role: 'Ekstrem Arazi Hareketliliği',
        specs: 'Her biri bağımsız fırçasız DC motorlu alüminyum tırnaklı tekerlekler; 40 cm büyüklüğündeki kayaları devrilmeden aşar.'
      }
    ]
  }
];

// 3D Procedural Three.js Geometries for each spacecraft
function SpacecraftMesh({
  craftId,
  isWireframe,
  isRotating,
}: {
  craftId: SpacecraftId;
  isWireframe: boolean;
  isRotating: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (isRotating && rootRef.current) {
      rootRef.current.rotation.y += delta * 0.35;
    }
  });

  // 1. JAMES WEBB SPACE TELESCOPE
  if (craftId === 'jwst') {
    return (
      <group ref={rootRef}>
        {/* Sunshield layers (layered pink/silver hexagons) */}
        <group position={[0, -0.4, 0]}>
          {[-0.15, -0.08, 0, 0.08, 0.15].map((yOffset, idx) => (
            <mesh key={idx} position={[0, yOffset, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4.2 - idx * 0.15, 2.8 - idx * 0.1]} />
              <meshStandardMaterial
                color={idx < 2 ? '#d9779b' : '#b0b8c4'}
                metalness={0.8}
                roughness={0.25}
                wireframe={isWireframe}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Primary Mirror (18 Gold hexagonal segments array) */}
        <group position={[0, 0.5, 0]}>
          <mesh rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.08, 6]} />
            <meshStandardMaterial
              color="#f5c542"
              metalness={0.95}
              roughness={0.12}
              wireframe={isWireframe}
            />
          </mesh>
          {/* Secondary mirror support struts (tripod) */}
          <mesh position={[0, 0.4, 1.1]} rotation={[-0.45, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
            <meshStandardMaterial color="#222228" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[-0.5, -0.2, 0.8]} rotation={[-0.2, 0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
            <meshStandardMaterial color="#222228" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0.5, -0.2, 0.8]} rotation={[-0.2, -0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
            <meshStandardMaterial color="#222228" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Secondary mirror head */}
          <mesh position={[0, 0.5, 1.6]}>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 6]} />
            <meshStandardMaterial color="#f5c542" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Spacecraft bus / solar panel */}
        <mesh position={[0, -0.8, -0.6]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.8]} />
          <meshStandardMaterial color="#1a2744" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  // 2. INTERNATIONAL SPACE STATION (ISS)
  if (craftId === 'iss') {
    return (
      <group ref={rootRef}>
        {/* Main Integrated Truss (Long crossbeam) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 6.2, 8]} />
          <meshStandardMaterial color="#8892b0" metalness={0.7} roughness={0.3} wireframe={isWireframe} />
        </mesh>

        {/* Central pressurized laboratory modules (cylinders cluster) */}
        <group position={[0, -0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 2.2, 16]} />
            <meshStandardMaterial color="#c0c7d6" metalness={0.6} roughness={0.4} wireframe={isWireframe} />
          </mesh>
          <mesh position={[0, 0, 0.6]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 1.2, 16]} />
            <meshStandardMaterial color="#d4daf0" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Cupola dome */}
          <mesh position={[0, -0.3, 0.6]}>
            <sphereGeometry args={[0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#1f293d" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* 4 pairs of Solar Array Wings on left and right */}
        {[-2.4, -1.8, 1.8, 2.4].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0.9, 0]}>
              <boxGeometry args={[0.45, 1.5, 0.02]} />
              <meshStandardMaterial color="#c67d16" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
              <boxGeometry args={[0.45, 1.5, 0.02]} />
              <meshStandardMaterial color="#c67d16" metalness={0.8} roughness={0.2} wireframe={isWireframe} />
            </mesh>
          </group>
        ))}

        {/* Radiator cooling fins */}
        <mesh position={[0, 0.6, -0.6]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[1.4, 0.02, 0.6]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    );
  }

  // 3. VOYAGER 1
  if (craftId === 'voyager1') {
    return (
      <group ref={rootRef}>
        {/* Parabolic High-Gain Antenna Dish */}
        <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.8, 0.2, 0.45, 32, 1, true]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} wireframe={isWireframe} side={THREE.DoubleSide} />
        </mesh>
        {/* Subreflector feed horn */}
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[0.18, 0.4, 16]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* 10-sided instrument bus body */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.45, 10]} />
          <meshStandardMaterial color="#1a202c" metalness={0.5} roughness={0.6} wireframe={isWireframe} />
        </mesh>

        {/* Golden Record on the side */}
        <mesh position={[0.45, -0.1, 0.4]} rotation={[0, 0.8, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 32]} />
          <meshStandardMaterial color="#f5c542" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* RTG generator boom on left */}
        <group position={[-1.2, -0.2, 0]} rotation={[0, 0, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.6, 12]} />
            <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Magnetometer boom on right */}
        <mesh position={[1.3, 0.3, -0.2]} rotation={[0.2, -0.4, -0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2, 8]} />
          <meshStandardMaterial color="#718096" />
        </mesh>
      </group>
    );
  }

  // 4. PERSEVERANCE MARS ROVER
  return (
    <group ref={rootRef}>
      {/* Rover Main Chassis */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.5, 1.8]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.4} wireframe={isWireframe} />
      </mesh>

      {/* Mastcam-Z camera neck & head */}
      <group position={[0.3, 0.7, 0.6]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
        <mesh position={[0, 0.4, 0.05]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.16, 0.2]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Robotic Arm in front */}
      <group position={[-0.4, 0.2, 1.0]} rotation={[-0.4, -0.2, 0]}>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        <mesh position={[0, 0, 0.8]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.7} />
        </mesh>
      </group>

      {/* MMRTG Nuclear Power Generator at rear */}
      <mesh position={[0, 0.4, -0.9]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* 6 Rocker-Bogie wheels */}
      {[-0.8, 0.8].map((x, xi) =>
        [-0.7, 0, 0.7].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, -0.25, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 16]} />
            <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.5} wireframe={isWireframe} />
          </mesh>
        ))
      )}
    </group>
  );
}

export function SpacecraftExplorer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const [activeCraftId, setActiveCraftId] = useState<SpacecraftId>('jwst');
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeCraft = useMemo(
    () => SPACECRAFTS.find((c) => c.id === activeCraftId) || SPACECRAFTS[0],
    [activeCraftId]
  );

  const selectedHotspot = useMemo(
    () => activeCraft.hotspots.find((h) => h.id === activeHotspotId) || activeCraft.hotspots[0],
    [activeCraft, activeHotspotId]
  );

  return (
    <div ref={containerRef} className="relative border border-line bg-ink overflow-hidden p-6 sm:p-10 space-y-8">
      {/* Header with Title and Spacecraft Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-solar" />
            <span className="doc-kicker text-solar font-bold">NASA & ESA İkonik Görevler</span>
          </div>
          <h3 className="doc-title text-2xl sm:text-3xl text-paper mt-1">
            İkonik Uzay Araçları <span className="doc-serif text-gold">3D Vitrini</span>
          </h3>
        </div>

        {/* Spacecraft switcher chips */}
        <div className="flex flex-wrap items-center gap-2">
          {SPACECRAFTS.map((craft) => (
            <button
              key={craft.id}
              type="button"
              onClick={() => {
                setActiveCraftId(craft.id);
                setActiveHotspotId(null);
              }}
              className={`rounded-full px-4 py-2 font-mono text-xs transition-all cursor-pointer ${
                activeCraftId === craft.id
                  ? 'border border-solar bg-solar text-ink font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'border border-line bg-ink-2 text-paper/70 hover:border-white/30 hover:text-paper'
              }`}
            >
              {craft.id === 'jwst' ? 'James Webb' : craft.id === 'iss' ? 'ISS' : craft.id === 'voyager1' ? 'Voyager 1' : 'Perseverance'}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Stage & Hotspot Inspection Deck */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: 3D Canvas Stage */}
        <div className="relative h-[360px] sm:h-[440px] w-full border border-line bg-[#020206] lg:col-span-7 overflow-hidden ticks">
          <Ticks />

          <Canvas
            frameloop={inView ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.5, 4.8], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[6, 8, 5]} intensity={2.6} color="#fff8e7" />
            <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#38bdf8" />

            <SpacecraftMesh
              craftId={activeCraft.id}
              isWireframe={isWireframe}
              isRotating={isRotating}
            />

            <OrbitControls
              enableZoom={true}
              enablePan={false}
              autoRotate={isRotating}
              autoRotateSpeed={0.8}
              minDistance={2.5}
              maxDistance={8.5}
            />
          </Canvas>

          {/* Top Controls Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-ink/90 border border-line p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              title={isRotating ? 'Döndürmeyi Duraklat' : 'Döndürmeyi Başlat'}
              className={`p-1.5 transition-colors cursor-pointer border ${
                isRotating ? 'border-line text-muted hover:text-paper' : 'border-solar bg-solar text-ink font-bold'
              }`}
            >
              {isRotating ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={() => setIsWireframe(!isWireframe)}
              title="3D Tel Kafes Modu"
              className={`p-1.5 transition-colors cursor-pointer border ${
                isWireframe ? 'border-solar bg-solar text-ink font-bold' : 'border-line text-muted hover:text-paper'
              }`}
            >
              <Layers size={13} />
            </button>
          </div>

          {/* Bottom Telemetry Tag */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-muted">
            <span className="flex items-center gap-1.5 text-solar">
              <span className="h-2 w-2 rounded-full bg-solar animate-ping" />
              <span>3D ETKİLEŞİMLİ PBR MODELİ</span>
            </span>
            <span>Fareyle 360° Çevirin · Tekerlek ile Yakınlaşın</span>
          </div>
        </div>

        {/* Right: Technical Specs & Hotspots Inspector */}
        <div className="space-y-6 lg:col-span-5">
          <div className="border-b border-line pb-4">
            <span className="doc-caption text-solar font-semibold">{activeCraft.organization} · {activeCraft.launchYear}</span>
            <h4 className="doc-title text-2xl text-paper mt-1">{activeCraft.name}</h4>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{activeCraft.blurb}</p>
          </div>

          {/* Telemetry Stats hairline grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="rounded-lg border border-line bg-ink-2 p-3">
              <span className="doc-caption block text-[10px] text-paper/40">GÜNCEL KONUM</span>
              <span className="text-paper font-semibold block truncate mt-0.5">{activeCraft.currentLocation}</span>
            </div>
            <div className="rounded-lg border border-line bg-ink-2 p-3">
              <span className="doc-caption block text-[10px] text-paper/40">DÜNYA’YA UZAKLIK</span>
              <span className="text-solar font-semibold block truncate mt-0.5">{activeCraft.distance}</span>
            </div>
          </div>

          {/* Hotspot / Subsystem Selector Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="doc-kicker text-gold text-xs">Kritik Mühendislik Alt Sistemleri</span>
              <span className="doc-caption text-muted text-[10px]">{activeCraft.hotspots.length} Bileşen</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {activeCraft.hotspots.map((spot) => {
                const isSelected = selectedHotspot.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveHotspotId(spot.id)}
                    className={`flex items-center justify-between rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-gold bg-gold/15 text-gold font-semibold shadow-[0_0_12px_rgba(245,197,66,0.2)]'
                        : 'border-line bg-ink-2 text-paper/70 hover:border-white/20 hover:text-paper'
                    }`}
                  >
                    <span className="truncate text-xs">{spot.name.split(' (')[0]}</span>
                    <ChevronRight size={12} className={isSelected ? 'text-gold' : 'text-muted'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Hotspot Inspector Slate */}
          <div className="rounded-xl border border-gold/30 bg-ink-2/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="doc-title text-base text-gold">{selectedHotspot.name}</span>
              <span className="doc-kicker text-[10px] text-paper/60">{selectedHotspot.role}</span>
            </div>
            <p className="text-xs leading-relaxed text-paper/85">{selectedHotspot.specs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
