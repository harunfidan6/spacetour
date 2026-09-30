'use client';

import React, { useState } from 'react';
import { Ticks } from '@/components/motion/primitives';

interface Observatory {
  id: string;
  name: string;
  location: string;
  altitudeOrOrbit: string;
  apertureDiameterM: number;
  gatheringAreaM2: number;
  wavelengths: string;
  operatedBy: string;
  status: 'Aktif Gözlem' | 'Yapım Aşamasında (İlk Işık Yakında)' | 'Operasyonel';
  highlightDiscovery: string;
  description: string;
  image: string;
}

const OBSERVATORIES: Observatory[] = [
  {
    id: 'jwst',
    name: 'James Webb Uzay Teleskobu (JWST)',
    location: 'Lagrange L2 Noktası (Güneş-Dünya)',
    altitudeOrOrbit: '1.500.000 km (Uzay)',
    apertureDiameterM: 6.5,
    gatheringAreaM2: 25.4,
    wavelengths: 'Yakın & Orta Kızılötesi (0.6 – 28 µm)',
    operatedBy: 'NASA / ESA / CSA',
    status: 'Aktif Gözlem',
    highlightDiscovery: 'Büyük Patlama’dan 300 milyon yıl sonrasına ait en yaşlı galaksiler (JADES-GS-z14-0) ve ötegezegen atmosferlerinde su buharı/karbondioksit tespiti.',
    description: '18 parçalı altın kaplı berilyum aynası ve 5 katmanlı tenis kortu büyüklüğündeki güneş kalkanıyla astronomi tarihinin en güçlü kızılötesi gözlemevi.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'elt',
    name: 'Aşırı Büyük Teleskop (ELT - Extremely Large Telescope)',
    location: 'Cerro Armazones, Atacama Çölü, Şili',
    altitudeOrOrbit: '3.046 metre irtifa',
    apertureDiameterM: 39.3,
    gatheringAreaM2: 978.0,
    wavelengths: 'Optik & Yakın Kızılötesi (0.3 – 24 µm)',
    operatedBy: 'ESO (Avrupa Güney Gözlemevi)',
    status: 'Yapım Aşamasında (İlk Işık Yakında)',
    highlightDiscovery: 'Hubble’dan 16 kat daha keskin görüntülerle yaşanabilir bölgedeki Dünya benzeri ötegezegenlerin yüzey biyo-imzalarını doğrudan görüntüleyecek.',
    description: '798 altıgen ayna parçasından oluşan 39.3 metrelik ana aynasıyla gezegenimizin en büyük optik teleskop yapısı.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'alma',
    name: 'ALMA Radyo Teleskop Dizisi',
    location: 'Chajnantor Platosu, Atacama, Şili',
    altitudeOrOrbit: '5.058 metre irtifa',
    apertureDiameterM: 16000, // Interferometer baseline up to 16 km
    gatheringAreaM2: 6600.0,
    wavelengths: 'Milimetre & Milimetre-altı (0.32 – 3.6 mm)',
    operatedBy: 'ESO / NSF / NINS',
    status: 'Aktif Gözlem',
    highlightDiscovery: 'Proto-gezegen disklerinde yeni oluşan gezegenlerin tozda açtığı halkaların ilk yüksek çözünürlüklü görüntüleri (HL Tauri).',
    description: '5.000 metre yükseklikte kuru çölde konuşlanmış 66 dev radyo anteninin interferometri yöntemiyle tek bir dev anten gibi çalışması.',
    image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'dag',
    name: 'Doğu Anadolu Gözlemevi (DAG)',
    location: 'Konaklı / Karakaya Tepeleri, Erzurum',
    altitudeOrOrbit: '3.170 metre irtifa',
    apertureDiameterM: 4.0,
    gatheringAreaM2: 12.6,
    wavelengths: 'Optik & Yakın Kızılötesi (0.35 – 2.5 µm)',
    operatedBy: 'Atatürk Üniversitesi / T.C. Sanayi Bakanlığı',
    status: 'Aktif Gözlem',
    highlightDiscovery: 'Türkiye’nin ve Avrupa’nın tek parça aynalı en yüksek irtifalı gözlemevi; adaptif optik sistemiyle atmosferik türbülansı gerçek zamanlı düzeltir.',
    description: '3.170 metre zirvede yer alan 4 metre çaplı ayna, aktif ve adaptif optik sistemleriyle Türkiye’nin en büyük temel bilim altyapı projesidir.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'hst',
    name: 'Hubble Uzay Teleskobu (HST)',
    location: 'Alçak Dünya Yörüngesi (LEO, 28.5° eğim)',
    altitudeOrOrbit: '540 km irtifa',
    apertureDiameterM: 2.4,
    gatheringAreaM2: 4.5,
    wavelengths: 'Morötesi, Görünür & Yakın Kızılötesi (115 – 2500 nm)',
    operatedBy: 'NASA / ESA',
    status: 'Operasyonel',
    highlightDiscovery: 'Evrenin genişleme hızının (Hubble Sabiti) netleştirilmesi, karanlık enerjinin keşfi ve ikonik Yaratılış Sütunları görüntüsü.',
    description: '1990’dan bu yana 1.5 milyondan fazla gözlem yaparak astronomi ders kitaplarını baştan yazan efsanevi yörünge teleskobu.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'tug',
    name: 'TÜBİTAK Ulusal Gözlemevi (TUG)',
    location: 'Bakırlıtepe, Saklıkent, Antalya',
    altitudeOrOrbit: '2.500 metre irtifa',
    apertureDiameterM: 1.5,
    gatheringAreaM2: 1.77,
    wavelengths: 'Optik Spektroskopi & Fotometri (350 – 1000 nm)',
    operatedBy: 'TÜBİTAK',
    status: 'Aktif Gözlem',
    highlightDiscovery: 'RTT150 teleskobu ile gama ışını patlamalarının optik ışıma takipleri, çift yıldız sistemleri ve ötegezegen geçiş analizleri.',
    description: 'Antalya Toros Dağları’nda 2.500 metrede Türkiye’nin ulusal astronomi araştırmalarına ev sahipliği yapan öncü yerleşke.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
  }
];

export function MegaObservatoriesRegistry() {
  const [selectedObs, setSelectedObs] = useState<Observatory>(OBSERVATORIES[0]);
  const obs = selectedObs;

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-rose-signal">
            <span className="live-dot" /> Küresel & Yörünge Gözlemevleri
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Mega teleskoplar <span className="serif-i text-rose-signal">& gözlemevi sicili</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Dünyanın en yüksek zirvelerinden Lagrange L2 uzay noktasına kadar insanlığın en büyük optik, kızılötesi ve radyo pencereleri.
          </p>
        </div>

        <div className="label border border-line bg-ink-2 px-3 py-1.5 text-rose-signal">
          6 Dev Gözlemevi · Teknik Karşılaştırma
        </div>
      </div>

      {/* Observatories Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line">
        {OBSERVATORIES.map((obs) => {
          const isSelected = obs.id === selectedObs.id;
          return (
            <button
              key={obs.id}
              onClick={() => setSelectedObs(obs)}
              className={`p-4 text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-rose-signal text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`label ${isSelected ? 'text-ink/80 font-bold' : 'text-rose-signal'}`}>
                  {obs.id.toUpperCase()}
                </span>
                <span className={`label text-[9px] ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                  {obs.apertureDiameterM > 100 ? 'Dizi' : `${obs.apertureDiameterM}m`}
                </span>
              </div>
              <div>
                <div className="display display-tight text-base font-bold truncate">
                  {obs.name.split(' (')[0]}
                </div>
                <div className={`label mt-1 text-[10px] truncate ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                  {obs.location.split(',')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Observatory Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Imagery & Core Info (5 cols) */}
        <div className="lg:col-span-5 bg-ink p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="label text-rose-signal">{obs.operatedBy}</span>
              <span className="label text-muted">{obs.status}</span>
            </div>

            <h4 className="display display-tight mt-6 text-3xl sm:text-4xl text-paper">
              {obs.name}
            </h4>
            <div className="serif-i text-base text-rose-signal mt-1">
              {obs.location}
            </div>

            <div className="relative h-44 w-full border border-line overflow-hidden my-4 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={obs.image}
                alt={obs.name}
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute bottom-2 right-2 label px-2 py-0.5 bg-ink/90 border border-line text-[9px] text-paper/80 backdrop-blur">
                {obs.altitudeOrOrbit}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-paper/75">
              {obs.description}
            </p>
          </div>

          {/* Highlight Discovery */}
          <div className="border-l-2 border-rose-signal pl-4 py-1">
            <span className="label text-muted">Öne Çıkan Bilimsel Keşif</span>
            <p className="mt-1 text-xs leading-relaxed text-paper/85">
              {obs.highlightDiscovery}
            </p>
          </div>
        </div>

        {/* Right: Technical Specs Grid (7 cols) */}
        <div className="lg:col-span-7 bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="label text-paper border-b border-line pb-2 flex items-center justify-between">
            <span>Optik & Mühendislik Parametreleri</span>
            <span className="text-muted">{obs.altitudeOrOrbit}</span>
          </div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <span className="label text-muted">Açıklık / Ayna Çapı</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {obs.apertureDiameterM > 100 ? '16 km Dizi' : `${obs.apertureDiameterM} Metre`}
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Işık Toplama Alanı</span>
              <div className="display display-tight mt-2 text-2xl text-rose-signal">
                {obs.gatheringAreaM2.toLocaleString('tr-TR')} <span className="label text-xs">m²</span>
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Gözlem İrtifası / Konum</span>
              <div className="display display-tight mt-2 text-lg text-paper truncate">
                {obs.altitudeOrOrbit}
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">İşleten Kurum</span>
              <div className="display display-tight mt-2 text-lg text-paper truncate">
                {obs.operatedBy}
              </div>
            </div>
          </div>

          {/* Spectral Coverage Bar */}
          <div className="border border-line bg-ink p-5 space-y-3">
            <div className="flex items-center justify-between label text-[10px]">
              <span className="text-muted">Kapsanan Dalgaboyu Spektrumu</span>
              <span className="text-rose-signal font-bold">{obs.wavelengths}</span>
            </div>
            <div className="p-3 bg-ink-2 border border-line text-xs font-mono text-paper/80 leading-relaxed">
              Bu gözlemevi, {obs.wavelengths} bandında foton toplayarak evrenin termal, kimyasal ve kinetik süreçlerini inceler.
            </div>
          </div>

          {/* Aperture Comparison Visualizer */}
          <div className="border border-line bg-ink p-5 space-y-2">
            <div className="flex items-center justify-between label text-[10px]">
              <span className="text-muted">Ayna Ölçeği (Hubble 2.4m = 100 baz)</span>
              <span className="text-paper">
                {((obs.gatheringAreaM2 / 4.5) * 100).toFixed(0)}% Işık Gücü
              </span>
            </div>
            <div className="h-2 w-full bg-ink-3 overflow-hidden border border-line relative">
              <div
                className="h-full bg-rose-signal transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(5, (obs.gatheringAreaM2 / 978) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
