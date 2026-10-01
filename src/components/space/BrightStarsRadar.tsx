'use client';

import React, { useState } from 'react';
import { Ticks } from '@/components/motion/primitives';

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

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-lime">
            <span className="live-dot" /> Gökkubbe Yıldız Kataloğu
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Gökkubbenin <span className="serif-i text-lime">en parlak sekiz yıldızı</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Kuzey yarımküreden çıplak gözle ilk seçilen devler. Kadirleri, tayf türleri, uzaklıkları ve mitolojik hikâyeleriyle gökyüzü kerterizleri.
          </p>
        </div>

        <div className="label border border-line bg-ink-2 px-3 py-1.5 text-lime">
          8 Ana Kerteriz · Alt-Azimuth Koordinatları
        </div>
      </div>

      {/* 8-Star Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px border border-line bg-line">
        {BRIGHTEST_STARS.map((s, idx) => {
          const isSelected = s.id === selectedStar.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStar(s)}
              className={`p-4 text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-lime text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`label ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                  0{idx + 1}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full border border-line"
                  style={{ background: s.colorHex }}
                />
              </div>
              <div>
                <div className="display display-tight text-base font-bold truncate">
                  {s.name.split(' (')[0]}
                </div>
                <div className={`label mt-1 text-[9px] truncate ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                  {s.magnitude > 0 ? `+${s.magnitude}` : s.magnitude} mag
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Star Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Star Key Identity (5 cols) */}
        <div className="lg:col-span-5 bg-ink p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="label text-lime">{selectedStar.bayer}</span>
              <span className="label text-muted">{selectedStar.distanceLightYears} Işık Yılı</span>
            </div>

            <h4 className="display display-tight mt-6 text-3xl sm:text-4xl text-paper">
              {selectedStar.name}
            </h4>
            <div className="serif-i text-lg text-lime mt-1">
              {selectedStar.constellation}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-paper/75">
              {selectedStar.description}
            </p>
          </div>

          {/* Mythology Callout */}
          <div className="border-l-2 border-lime pl-4 py-1">
            <span className="label text-muted">Mitolojik Köken</span>
            <p className="mt-1 text-xs leading-relaxed text-paper/85 serif-i">
              &ldquo;{selectedStar.mythology}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Technical Metrics Grid (7 cols) */}
        <div className="lg:col-span-7 bg-ink-2 p-6 sm:p-8 space-y-6">
          <div className="label text-paper border-b border-line pb-2 flex items-center justify-between">
            <span>Astrofiziksel Spektrum Verileri</span>
            <span className="text-muted">Yerel Ufuk İçi Konum</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <span className="label text-muted">Görünür Parlaklık</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedStar.magnitude} <span className="label text-xs">mag</span>
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Yüzey Sıcaklığı</span>
              <div className="display display-tight mt-2 text-2xl text-lime">
                {selectedStar.colorTempK.toLocaleString('tr-TR')} <span className="label text-xs">K</span>
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Mesafe</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedStar.distanceLightYears} <span className="label text-xs">ly</span>
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Ufuk Yüksekliği (Alt)</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                +{selectedStar.altAz.alt}°
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Azimut Açısı (Az)</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedStar.altAz.az}°
              </div>
            </div>

            <div className="bg-ink p-4">
              <span className="label text-muted">Spektral Sınıf</span>
              <div className="display display-tight mt-2 text-lg text-lime truncate">
                {selectedStar.spectralType.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Visual Color Temperature Bar */}
          <div className="border border-line bg-ink p-4 space-y-2">
            <div className="flex items-center justify-between label text-[10px]">
              <span className="text-muted">Tayf Rengi: {selectedStar.spectralType}</span>
              <span className="text-paper">{selectedStar.colorTempK} Kelvin</span>
            </div>
            <div className="h-2 w-full bg-ink-3 overflow-hidden border border-line relative">
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
