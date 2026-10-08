'use client';

import React, { useState } from 'react';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
import { ASTRO_IMAGES, type AstroImage } from '@/data/astroImages';

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
  image: AstroImage | null;
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
    image: ASTRO_IMAGES.jwst
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
    image: ASTRO_IMAGES.elt
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
    image: ASTRO_IMAGES.alma
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
    image: null
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
    image: ASTRO_IMAGES.hubble
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
    image: ASTRO_IMAGES.tug
  }
];

export function MegaObservatoriesRegistry() {
  const [selectedObs, setSelectedObs] = useState<Observatory>(OBSERVATORIES[0]);
  const railRef = useRevealOnChange(selectedObs);
  const obs = selectedObs;

  return (
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-6">
        <div className="min-w-0 max-w-2xl">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Mega teleskoplar ve gözlemevi sicili
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-paper/80 sm:text-base">
            Dünyanın en yüksek zirvelerinden Lagrange L2 uzay noktasına kadar insanlığın en büyük optik, kızılötesi ve radyo pencereleri.
          </p>
        </div>
        <p className="shrink-0 text-sm text-paper/70">
          <span className="tabular-nums text-paper">6</span> gözlemevi · teknik karşılaştırma
        </p>
      </div>

      {/* Gözlemevi seçimi */}
      <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line">
        {OBSERVATORIES.map((obs) => {
          const isSelected = obs.id === selectedObs.id;
          return (
            <button
              key={obs.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedObs(obs)}
              className={`flex min-w-0 flex-col justify-between p-4 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-rose-signal text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <span className="mb-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className={`text-sm font-semibold ${isSelected ? 'text-ink' : 'text-rose-signal'}`}>
                  {obs.id.toUpperCase()}
                </span>
                <span
                  className={`text-xs tabular-nums ${obs.apertureDiameterM > 100 ? '' : 'font-mono'} ${
                    isSelected ? 'text-ink/80' : 'text-paper/70'
                  }`}
                >
                  {obs.apertureDiameterM > 100 ? 'Dizi' : `${obs.apertureDiameterM}m`}
                </span>
              </span>
              <span className="block">
                <span className="block text-base font-semibold leading-snug">
                  {obs.name.split(' (')[0]}
                </span>
                <span className={`mt-1 block text-xs leading-snug ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>
                  {obs.location.split(',')[0]}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Seçili gözlemevinin dosyası */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Sol: görsel ve tanıtım */}
        <div className="flex min-w-0 flex-col justify-between gap-6 bg-ink p-5 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="font-medium text-rose-signal">{obs.operatedBy}</span>
              <span className="text-paper/70">{obs.status}</span>
            </div>

            <h4 className="mt-2 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
              {obs.name}
            </h4>
            <div className="mt-1.5 text-base text-paper/80">
              {obs.location}
            </div>

            {obs.image && (
              <figure className="mt-5">
                <div className="h-44 w-full overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={obs.image.src}
                    alt={obs.name}
                    className="w-full h-full object-cover filter contrast-105"
                  />
                </div>
                <figcaption className="mt-2 text-xs leading-snug text-paper/70">
                  Görsel · {obs.image.credit}
                </figcaption>
              </figure>
            )}

            <p className="mt-5 text-base leading-relaxed text-paper/85">
              {obs.description}
            </p>
          </div>

          {/* Öne çıkan keşif */}
          <div className="border-t border-line pt-5">
            <div className="text-sm font-medium text-rose-signal">Öne çıkan bilimsel keşif</div>
            <p className="mt-2 text-base leading-relaxed text-paper/85">
              {obs.highlightDiscovery}
            </p>
          </div>
        </div>

        {/* Sağ: teknik özellikler */}
        <div className="min-w-0 space-y-6 bg-ink-2 p-5 sm:p-8 lg:col-span-7">
          <div className="border-b border-line pb-3 text-sm font-medium text-paper/85">
            Optik ve mühendislik parametreleri
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6">
            <div className="min-w-0">
              <div className="text-sm text-paper/70">Açıklık / ayna çapı</div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-paper sm:text-2xl">
                {obs.apertureDiameterM > 100 ? '16 km Dizi' : `${obs.apertureDiameterM} Metre`}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">Işık toplama alanı</div>
              <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-rose-signal sm:text-2xl">
                {obs.gatheringAreaM2.toLocaleString('tr-TR')} <span className="text-sm font-normal text-paper/70">m²</span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">Gözlem irtifası / konum</div>
              <div className="mt-1 text-base font-semibold leading-snug tabular-nums text-paper sm:text-lg">
                {obs.altitudeOrOrbit}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">İşleten kurum</div>
              <div className="mt-1 text-base font-semibold leading-snug text-paper sm:text-lg">
                {obs.operatedBy}
              </div>
            </div>
          </div>

          {/* Dalga boyu kapsamı */}
          <div className="space-y-2 border-t border-line pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm text-paper/70">Kapsanan dalga boyu spektrumu</span>
              <span className="text-sm font-semibold text-rose-signal">{obs.wavelengths}</span>
            </div>
            <p className="text-sm leading-relaxed text-paper/80 sm:text-base">
              Bu gözlemevi, {obs.wavelengths} bandında foton toplayarak evrenin termal, kimyasal ve kinetik süreçlerini inceler.
            </p>
          </div>

          {/* Ayna ölçeği karşılaştırması */}
          <div className="space-y-3 border-t border-line pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm text-paper/70">Ayna ölçeği (Hubble 2.4m = 100 baz)</span>
              <span className="text-sm text-paper">
                <span className="font-mono tabular-nums">{((obs.gatheringAreaM2 / 4.5) * 100).toFixed(0)}%</span> ışık gücü
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden bg-ink-3">
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
