'use client';

import React, { useState } from 'react';
import { Telescope } from 'lucide-react';
import { useRevealOnChange } from '@/lib/useRevealOnChange';
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
  const railRef = useRevealOnChange(selectedTarget);

  return (
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-6">
        <div className="min-w-0 max-w-2xl">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Messier kataloğu ve derin uzay hedefleri
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-paper/80 sm:text-base">
            Charles Messier’in 18. yüzyılda derlediği katalogdan kuzey göğünün en görkemli 6 derin uzay cismi: galaksiler, gaz bulutsuları ve küresel kümeler.
          </p>
        </div>
        <p className="shrink-0 text-sm text-paper/70">
          Katalogda <span className="tabular-nums text-paper">110</span> nesne
        </p>
      </div>

      {/* Hedef seçimi */}
      <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line">
        {MESSIER_TARGETS.map((m) => {
          const isSelected = m.id === selectedTarget.id;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedTarget(m)}
              className={`flex min-w-0 flex-col justify-between p-4 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-lime text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <span className="mb-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className={`font-mono text-sm font-semibold ${isSelected ? 'text-ink' : 'text-lime'}`}>
                  {m.messier}
                </span>
                <span className={`font-mono text-xs ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>
                  {m.ngc}
                </span>
              </span>
              <span className="block">
                <span className="block text-base font-semibold leading-snug">
                  {m.name.split(' (')[0]}
                </span>
                <span className={`mt-1 block text-xs leading-snug ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>
                  {m.constellation}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Seçili hedefin dosyası */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Sol: görsel ve tanıtım */}
        <div className="flex min-w-0 flex-col justify-between gap-6 bg-ink p-5 sm:p-8 lg:col-span-5">
          <div>
            <div className="font-mono text-sm tabular-nums text-lime">
              {selectedTarget.messier} · {selectedTarget.ngc}
            </div>
            <h4 className="mt-2 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
              {selectedTarget.name}
            </h4>
            <div className="mt-1.5 text-base text-paper/80">
              {selectedTarget.type} · {selectedTarget.constellation}
            </div>

            <figure className="mt-5">
              <div className="h-44 w-full overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTarget.image.src}
                  alt={selectedTarget.name}
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
              <figcaption className="mt-2 text-xs leading-snug text-paper/70">
                Görsel · {selectedTarget.image.credit}
              </figcaption>
            </figure>

            <p className="mt-5 text-base leading-relaxed text-paper/85">
              {selectedTarget.description}
            </p>
          </div>

          {/* Gözlem ipucu */}
          <div className="border-t border-line pt-5">
            <div className="text-sm font-medium text-lime">Gözlem ve ekipman ipucu</div>
            <p className="mt-2 text-base leading-relaxed text-paper/85">
              {selectedTarget.observationTip}
            </p>
          </div>
        </div>

        {/* Sağ: teknik özellikler ve ekipman */}
        <div className="min-w-0 space-y-6 bg-ink-2 p-5 sm:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
            <span className="text-sm font-medium text-paper/85">Optik ve fiziksel parametreler</span>
            <span className="text-sm text-paper/70">Kuzey yarımküre</span>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6">
            <div className="min-w-0">
              <div className="text-sm text-paper/70">Görünür kadir</div>
              <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-paper">
                {selectedTarget.magnitude > 0 ? `+${selectedTarget.magnitude}` : selectedTarget.magnitude} <span className="text-sm font-normal text-paper/70">mag</span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">Uzaklık</div>
              <div className="mt-1 text-base font-semibold leading-snug tabular-nums text-paper sm:text-lg">
                {selectedTarget.distance}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">En iyi gözlem dönemi</div>
              <div className="mt-1 text-base font-semibold leading-snug text-paper sm:text-lg">
                {selectedTarget.bestSeason}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-sm text-paper/70">Gereken asgari optik</div>
              <div className="mt-1 text-base font-semibold leading-snug text-paper sm:text-lg">
                {selectedTarget.minEquipment}
              </div>
            </div>
          </div>

          {/* Gözlem kontrol listesi */}
          <div className="space-y-3 border-t border-line pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-paper/85">
              <Telescope size={16} className="shrink-0 text-lime" aria-hidden="true" />
              Gözlem alanı kontrol listesi
            </div>
            <ul className="space-y-2.5 text-sm leading-relaxed text-paper/80">
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                <span>Hedef takımyıldız: <strong className="font-semibold text-paper">{selectedTarget.constellation}</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                <span>Görüş önerisi: En az Bortle 4 ve altında karanlık bir gökyüzü tercih edin.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                <span>Gözlem hazırlığı: Gözünüzü en az 20 dakika karanlığa alıştırın (kırmızı fener kullanın).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
