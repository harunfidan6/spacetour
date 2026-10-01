'use client';

import React, { useState } from 'react';
import { Telescope } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { ASTRO_IMAGES, type AstroImage } from '@/data/astroImages';

interface MessierObject {
  id: string;
  messier: string;
  ngc: string;
  name: string;
  constellation: string;
  type: string;
  magnitude: number;
  distance: string;
  bestSeason: string;
  minEquipment: string;
  image: AstroImage;
  description: string;
  observationTip: string;
}

const MESSIER_TARGETS: MessierObject[] = [
  {
    id: 'm31',
    messier: 'M31',
    ngc: 'NGC 224',
    name: 'Andromeda Galaksisi',
    constellation: 'Andromeda',
    type: 'Büyük Sarmal Galaksi',
    magnitude: 3.44,
    distance: '2.537 Milyon Işık Yılı',
    bestSeason: 'Sonbahar / Kış',
    minEquipment: 'Çıplak Göz / 7x50 Dürbün',
    image: ASTRO_IMAGES.m31,
    description: 'Samanyolu’nun en büyük komşusu. Yaklaşık 1 trilyon yıldıza ev sahipliği yapar. Çıplak gözle insan gözünün görebileceği en uzak nesnedir.',
    observationTip: 'Karanlık bir gökyüzünde dürbünle oval, parlak bir sis çekirdeği ve her iki yana uzanan soluk galaksi diski rahatlıkla seçilir.'
  },
  {
    id: 'm42',
    messier: 'M42',
    ngc: 'NGC 1976',
    name: 'Orion (Avcı) Bulutsusu',
    constellation: 'Avcı (Orion)',
    type: 'Yıldız Oluşum Bulutsusu',
    magnitude: 4.0,
    distance: '1.344 Işık Yılı',
    bestSeason: 'Kış',
    minEquipment: 'Küçük Dürbün / Her Türlü Teleskop',
    image: ASTRO_IMAGES.m42,
    description: 'Avcı Kılıcı’nın ortasında yer alan, bebek yıldızların doğduğu devasa bir hidrojen ve oksijen gazı laboratuvarı. Merkezinde Trapezium yıldız dörtlüsü parlar.',
    observationTip: 'Orta boy bir teleskopla yeşilimsi-gri kanat benzeri gaz perdeleri ve Trapezium’un 4 parlak mavi yıldızı kristal netliğinde görünür.'
  },
  {
    id: 'm45',
    messier: 'M45',
    ngc: 'Melotte 22',
    name: 'Ülker / Süreyya (Pleiades)',
    constellation: 'Boğa (Taurus)',
    type: 'Açık Yıldız Kümesi',
    magnitude: 1.6,
    distance: '444 Işık Yılı',
    bestSeason: 'Sonbahar / Kış',
    minEquipment: 'Çıplak Göz / Geniş Açılı Dürbün',
    image: ASTRO_IMAGES.m45,
    description: 'Gökyüzündeki en ünlü açık küme. Yaklaşık 100 milyon yıl önce doğmuş 1.000’den fazla genç mavi yıldıza sahiptir. Çıplak gözle 7 ana yıldız seçilir.',
    observationTip: 'Yüksek büyütmeli teleskop yerine geniş görüş alanına sahip bir dürbün (7x50 veya 10x50) kümenin tamamını bir arada görmek için çok daha uygundur.'
  },
  {
    id: 'm13',
    messier: 'M13',
    ngc: 'NGC 6205',
    name: 'Büyük Herkül Küresel Kümesi',
    constellation: 'Herkül (Hercules)',
    type: 'Küresel Yıldız Kümesi',
    magnitude: 5.8,
    distance: '22.200 Işık Yılı',
    bestSeason: 'İlkbahar / Yaz',
    minEquipment: 'Dürbün / 150mm+ Teleskop',
    image: ASTRO_IMAGES.m13,
    description: '145 ışık yılı çapa sıkışmış 300.000’den fazla yaşlı yıldız. 1974 yılında Arecibo radyo teleskobuyla uzaylı uygarlıklara gönderilen radyo mesajının hedefidir.',
    observationTip: '200mm (8 inç) bir Dobson teleskopla merkezdeki binlerce yıldız tek tek elmas taneleri gibi ayrışır.'
  },
  {
    id: 'm51',
    messier: 'M51',
    ngc: 'NGC 5194',
    name: 'Girdap (Whirlpool) Galaksisi',
    constellation: 'Av Köpekleri (Canes Venatici)',
    type: 'Etkileşen Büyük Sarmal',
    magnitude: 8.4,
    distance: '23 Milyon Işık Yılı',
    bestSeason: 'İlkbahar',
    minEquipment: '200mm+ Teleskop',
    image: ASTRO_IMAGES.m51,
    description: 'Tarihte sarmal yapısı keşfedilen ilk galaksi (Lord Rosse, 1845). Yanındaki küçük cüce galaksi NGC 5195 ile kütleçekimsel dans halindedir.',
    observationTip: 'Karanlık bir gökyüzünde 20 cm veya daha büyük bir teleskopla ana galaksinin kollarını ve küçük yoldaş galaksiyle olan köprüyü görmek mümkündür.'
  },
  {
    id: 'm57',
    messier: 'M57',
    ngc: 'NGC 6720',
    name: 'Halka (Ring) Bulutsusu',
    constellation: 'Çalgı (Lyra)',
    type: 'Gezegenimsi Bulutsu',
    magnitude: 8.8,
    distance: '2.570 Işık Yılı',
    bestSeason: 'Yaz / Sonbahar',
    minEquipment: '100mm+ Teleskop',
    image: ASTRO_IMAGES.m57,
    description: 'Ölen bir yıldızın uzaya fırlattığı duman halkası benzeri gaz kabuğu. Merkezinde 100.000 Kelvin sıcaklığında bir beyaz cüce kalıntısı bulunur.',
    observationTip: 'Küçük teleskoplarda minik gri bir duman halkası; büyük açıklıklı teleskoplarda ise yeşilimsi oksijen ve kırmızımsı nitrojen gaz katmanları ayırt edilir.'
  }
];

export function MessierDeepSkyRadar() {
  const [selectedTarget, setSelectedTarget] = useState<MessierObject>(MESSIER_TARGETS[0]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-lime">
            <span className="live-dot" /> Derin Uzay Atlası · 110 Nesne
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Messier kataloğu <span className="serif-i text-lime">& derin uzay hedefleri</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Charles Messier’in 18. yüzyılda derlediği katalogdan kuzey göğünün en görkemli 6 derin uzay cismi: galaksiler, gaz bulutsuları ve küresel kümeler.
          </p>
        </div>

        <div className="label border border-line bg-ink-2 px-3 py-1.5 text-lime">
          M31 → M57 · Gözlem Rehberi
        </div>
      </div>

      {/* 6 Target Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line">
        {MESSIER_TARGETS.map((m) => {
          const isSelected = m.id === selectedTarget.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedTarget(m)}
              className={`p-4 text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-lime text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`label ${isSelected ? 'text-ink/80 font-bold' : 'text-lime'}`}>
                  {m.messier}
                </span>
                <span className={`label text-[10px] ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                  {m.ngc}
                </span>
              </div>
              <div>
                <div className="display display-tight text-base font-bold truncate">
                  {m.name.split(' (')[0]}
                </div>
                <div className={`label mt-1 text-[10px] truncate ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                  {m.constellation}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Target Dossier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Imagery & Target Intro (5 cols) */}
        <div className="lg:col-span-5 bg-ink p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="label text-lime">{selectedTarget.messier} · {selectedTarget.ngc}</span>
              <span className="label text-muted">{selectedTarget.distance}</span>
            </div>

            <h4 className="display display-tight mt-6 text-3xl sm:text-4xl text-paper">
              {selectedTarget.name}
            </h4>
            <div className="serif-i text-lg text-lime mt-1">
              {selectedTarget.type} · {selectedTarget.constellation}
            </div>

            <div className="relative h-44 w-full border border-line overflow-hidden my-4 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedTarget.image.src}
                alt={selectedTarget.name}
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute bottom-2 right-2 label px-2 py-0.5 bg-ink/90 border border-line text-[9px] text-paper/80 backdrop-blur">
                Hubble / Teleskop Gözlemi
              </div>
            </div>

            <p className="text-xs leading-relaxed text-paper/75">
              {selectedTarget.description}
            </p>
          </div>

          {/* Observation Tip */}
          <div className="border-l-2 border-lime pl-4 py-1">
            <span className="label text-muted">Gözlem & Ekipman İpucu</span>
            <p className="mt-1 text-xs leading-relaxed text-paper/85">
              {selectedTarget.observationTip}
            </p>
          </div>
        </div>

        {/* Right: Technical Specs & Equipment (7 cols) */}
        <div className="lg:col-span-7 bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="label text-paper border-b border-line pb-2 flex items-center justify-between">
            <span>Optik & Fiziksel Parametreler</span>
            <span className="text-muted">Kuzey Yarımküre</span>
          </div>

          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <span className="label text-muted">Görünür Kadir</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedTarget.magnitude > 0 ? `+${selectedTarget.magnitude}` : selectedTarget.magnitude} <span className="label text-xs">mag</span>
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Uzaklık</span>
              <div className="display display-tight mt-2 text-2xl text-lime">
                {selectedTarget.distance}
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">En İyi Gözlem Dönemi</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedTarget.bestSeason}
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Gereken Asgari Optik</span>
              <div className="display display-tight mt-2 text-lg text-lime truncate">
                {selectedTarget.minEquipment}
              </div>
            </div>
          </div>

          {/* Observing Deck Checklist */}
          <div className="border border-line bg-ink p-5 space-y-3">
            <span className="label text-paper flex items-center gap-1.5">
              <Telescope size={14} className="text-lime" />
              Gözlem Alanı Kontrol Listesi
            </span>
            <ul className="space-y-2 text-xs text-paper/70 font-mono">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                <span>Hedef Takımyıldız: <strong className="text-paper">{selectedTarget.constellation}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                <span>Görüş Önerisi: En az Bortle 4 ve altında karanlık bir gökyüzü tercih edin.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                <span>Gözlem hazırlığı: Gözünüzü en az 20 dakika karanlığa alıştırın (Kırmızı fener kullanın).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
