'use client';

import React, { useState } from 'react';
import { useRevealOnChange } from '@/lib/useRevealOnChange';

// Ortak görünüm sınıfları
const META_LABEL = 'text-sm text-paper/70';
const METRIC_VALUE = 'mt-1 font-mono text-xl font-semibold leading-tight tabular-nums sm:text-2xl';
const METRIC_UNIT = 'font-mono text-sm font-normal text-paper/70';

interface BrightStar {
  id: string;
  name: string;
  bayer: string;
  constellation: string;
  magnitude: number;
  distanceLightYears: number;
  spectralType: string;
  colorTempK: number;
  colorHex: string;
  altAz: { alt: number; az: number }; // Topocentric degrees
  description: string;
  mythology: string;
}

const BRIGHTEST_STARS: BrightStar[] = [
  {
    id: 'sirius',
    name: 'Sirius (Akyıldız)',
    bayer: 'α Canis Majoris',
    constellation: 'Büyük Köpek (Canis Major)',
    magnitude: -1.46,
    distanceLightYears: 8.6,
    spectralType: 'A1V (Beyaz Ana Kol)',
    colorTempK: 9940,
    colorHex: '#ffffff',
    altAz: { alt: 28, az: 168 },
    description: 'Gece gökyüzünün en parlak yıldızı. Aslında Sirius A ve onun etrafında 50 yılda bir dönen küçük beyaz cüce Sirius B’den oluşan ikili bir sistemdir.',
    mythology: 'Antik Mısır’da Nil Nehri’nin yıllık taşkınlarını haber veren kutsal İsis yıldızı olarak kabul edilirdi.'
  },
  {
    id: 'vega',
    name: 'Vega',
    bayer: 'α Lyrae',
    constellation: 'Çalgı / Lir (Lyra)',
    magnitude: 0.03,
    distanceLightYears: 25.0,
    spectralType: 'A0V (Mavi-Beyaz)',
    colorTempK: 9600,
    colorHex: '#a0c8ff',
    altAz: { alt: 64, az: 72 },
    description: 'Yaz Üçgeni’nin en parlak köşesi. Güneş’ten sonra fotoğrafı çekilen ve tayfı kaydedilen ilk yıldızdır. 12.000 yıl sonra yeniden Kutup Yıldızı olacaktır.',
    mythology: 'Orfeus’un mitolojik liri. Doğu Asya mitolojisinde ise göksel dokumacı prenses Orihime/Zhinü’yü simgeler.'
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    bayer: 'α Orionis',
    constellation: 'Avcı (Orion)',
    magnitude: 0.50,
    distanceLightYears: 642.5,
    spectralType: 'M1-2 Ia-ab (Kırmızı Süperdev)',
    colorTempK: 3500,
    colorHex: '#ff5b22',
    altAz: { alt: 42, az: 195 },
    description: 'Güneş’in yerine konsaydı Jüpiter’in yörüngesini yutacak kadar devasa (Güneş’in yaklaşık 700-1000 katı yarıçapında). Ömrünün sonundaki bu yıldız her an Tip II süpernova olarak patlayabilir.',
    mythology: 'Avcı Orion’un sağ omzunu temsil eder. Arapça "İbt el-Cevza" (Devin Koltuğu/Omuzu) kökünden gelir.'
  },
  {
    id: 'arcturus',
    name: 'Arcturus (Arktürüs)',
    bayer: 'α Boötis',
    constellation: 'Çoban (Boötes)',
    magnitude: -0.05,
    distanceLightYears: 36.7,
    spectralType: 'K1.5 IIIpe (Turuncu Dev)',
    colorTempK: 4286,
    colorHex: '#ffaa44',
    altAz: { alt: 52, az: 230 },
    description: 'Kuzey gökkubesinin en parlak yıldızı. Samanyolu halesinden gelen antik bir yıldız olup Güneş Sistemi’ne göre saniyede 122 km hızla hareket etmektedir.',
    mythology: 'Yunanca "Ayı Bekçisi" (Arktouros) anlamına gelir; gökyüzünde Büyük Ayı’yı takip eder.'
  },
  {
    id: 'rigel',
    name: 'Rigel',
    bayer: 'β Orionis',
    constellation: 'Avcı (Orion)',
    magnitude: 0.13,
    distanceLightYears: 860.0,
    spectralType: 'B8 Ia (Mavi-Beyaz Süperdev)',
    colorTempK: 12100,
    colorHex: '#80b4ff',
    altAz: { alt: 36, az: 205 },
    description: 'Güneş’ten 120.000 kat daha parlak devasa bir mavi süperdev. Orion Bulutsusu’nun aydınlanmasına katkı sağlayan güçlü yıldız rüzgarlarına sahiptir.',
    mythology: 'Arapça "Ricl el-Cevza" (Devin Sol Ayağı) anlamına gelir.'
  },
  {
    id: 'capella',
    name: 'Capella',
    bayer: 'α Aurigae',
    constellation: 'Arabacı (Auriga)',
    magnitude: 0.08,
    distanceLightYears: 42.9,
    spectralType: 'G3III + G1III (Sarı Devler)',
    colorTempK: 4970,
    colorHex: '#ffd455',
    altAz: { alt: 58, az: 320 },
    description: 'Gökyüzünde tek bir parlak sarı yıldız gibi görünür ancak aslında birbirinin etrafında dönen iki çift sarı devden oluşan dörtlü bir sistemdir.',
    mythology: 'Latincede "Küçük Dişi Keçi" anlamına gelir; Zeus’u sütüyle besleyen bereket keçisi Amalthea’yı simgeler.'
  },
  {
    id: 'polaris',
    name: 'Polaris (Kutup Yıldızı)',
    bayer: 'α Ursae Minoris',
    constellation: 'Küçük Ayı (Ursa Minor)',
    magnitude: 1.98,
    distanceLightYears: 433.0,
    spectralType: 'F7Ib (Sarı-Beyaz Süperdev Sefeid)',
    colorTempK: 6015,
    colorHex: '#ffeecc',
    altAz: { alt: 41, az: 0 },
    description: 'Dünya’nın dönme ekseniyle neredeyse mükemmel hizalanmış kerteriz yıldızı. Gece boyunca tüm gökkube onun etrafında dönerken o gökyüzünde sabit kalır.',
    mythology: 'Denizcilerin ve göçebelerin yüzyıllar boyu yön bulmasını sağlayan kuzeyin şaşmaz feneri.'
  },
  {
    id: 'antares',
    name: 'Antares (Akrebin Kalbi)',
    bayer: 'α Scorpii',
    constellation: 'Akrep (Scorpius)',
    magnitude: 1.06,
    distanceLightYears: 550.0,
    spectralType: 'M1.5 Iab (Kırmızı Süperdev)',
    colorTempK: 3400,
    colorHex: '#ff4422',
    altAz: { alt: 18, az: 175 },
    description: 'Kan kırmızısı rengiyle gökyüzünde Mars’a meydan okuyan dev yıldız. Çapı Güneş’ten 700 kat büyüktür.',
    mythology: 'Yunanca "Anti-Ares" (Mars’ın Rakibi) anlamına gelir; kızıl rengi nedeniyle savaş tanrısı Mars ile karşılaştırılmıştır.'
  }
];

export function BrightStarsRadar() {
  const [selectedStar, setSelectedStar] = useState<BrightStar>(BRIGHTEST_STARS[0]);
  const railRef = useRevealOnChange(selectedStar);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Gökkubbenin en parlak sekiz yıldızı
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
          Kuzey yarımküreden çıplak gözle ilk seçilen devler. Kadirleri, tayf türleri, uzaklıkları ve mitolojik hikâyeleriyle gökyüzü kerterizleri.
        </p>
        <p className="mt-2 text-sm text-paper/70">
          Yıldız kataloğu · 8 kerteriz yıldızı · alt-azimut koordinatları
        </p>
      </div>

      {/* 8-Star Selection Grid */}
      <div ref={railRef} className="choice-rail grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px border border-line bg-line">
        {BRIGHTEST_STARS.map((s) => {
          const isSelected = s.id === selectedStar.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedStar(s)}
              className={`flex min-w-0 flex-col gap-2 p-3 text-left transition-colors cursor-pointer sm:p-4 ${
                isSelected
                  ? 'bg-lime text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <span className="flex min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate text-base font-semibold leading-tight">
                  {s.name.split(' (')[0]}
                </span>
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border border-line"
                  style={{ background: s.colorHex }}
                />
              </span>
              <span className={`font-mono text-xs tabular-nums ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>
                {s.magnitude > 0 ? `+${s.magnitude}` : s.magnitude} mag
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Star Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Star Key Identity (5 cols) */}
        <div className="lg:col-span-5 bg-ink p-5 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="text-lime">{selectedStar.bayer}</span>
              <span className="text-paper/70">
                <span className="font-mono tabular-nums">{selectedStar.distanceLightYears}</span> ışık yılı
              </span>
            </div>

            <h4 className="mt-4 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
              {selectedStar.name}
            </h4>
            <div className="mt-1 text-base text-lime">
              {selectedStar.constellation}
            </div>

            <p className="mt-4 text-base leading-relaxed text-paper/85">
              {selectedStar.description}
            </p>
          </div>

          {/* Mythology Callout */}
          <div className="border-l-2 border-lime pl-4">
            <div className="text-sm font-medium text-paper/70">Mitolojik köken</div>
            <p className="mt-1 text-sm leading-relaxed text-paper/85">
              &ldquo;{selectedStar.mythology}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Technical Metrics Grid (7 cols) */}
        <div className="lg:col-span-7 bg-ink-2 p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
            <span className="text-sm font-medium text-paper/85">Astrofiziksel veriler</span>
            <span className={META_LABEL}>Yerel ufuktaki konum</span>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <div className="min-w-0">
              <dt className={META_LABEL}>Görünür parlaklık</dt>
              <dd className={`${METRIC_VALUE} text-paper`}>
                {selectedStar.magnitude} <span className={METRIC_UNIT}>mag</span>
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={META_LABEL}>Yüzey sıcaklığı</dt>
              <dd className={`${METRIC_VALUE} text-lime`}>
                {selectedStar.colorTempK.toLocaleString('tr-TR')} <span className={METRIC_UNIT}>K</span>
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={META_LABEL}>Mesafe</dt>
              <dd className={`${METRIC_VALUE} text-paper`}>
                {selectedStar.distanceLightYears} <span className={METRIC_UNIT}>ly</span>
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={META_LABEL}>Ufuk yüksekliği (alt)</dt>
              <dd className={`${METRIC_VALUE} text-paper`}>
                +{selectedStar.altAz.alt}°
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={META_LABEL}>Azimut açısı (az)</dt>
              <dd className={`${METRIC_VALUE} text-paper`}>
                {selectedStar.altAz.az}°
              </dd>
            </div>

            <div className="min-w-0">
              <dt className={META_LABEL}>Spektral sınıf</dt>
              <dd className={`${METRIC_VALUE} text-lime`}>
                {selectedStar.spectralType.split(' ')[0]}
              </dd>
            </div>
          </dl>

          {/* Visual Color Temperature Bar */}
          <div className="space-y-2 border-t border-line pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="text-paper/70">Tayf rengi: <span className="text-paper/90">{selectedStar.spectralType}</span></span>
              <span className="text-paper/90">
                <span className="font-mono tabular-nums">{selectedStar.colorTempK}</span> Kelvin
              </span>
            </div>
            <div className="h-2 w-full bg-ink-3 overflow-hidden relative">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(10, (selectedStar.colorTempK / 12000) * 100))}%`,
                  background: selectedStar.colorHex
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
