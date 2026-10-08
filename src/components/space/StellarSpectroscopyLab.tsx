'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

// Ortak görünüm sınıfları
const SMALL_LABEL = 'text-xs text-paper/70';
const CARD_TITLE = 'font-display text-xl font-semibold leading-tight text-paper';

interface SpectralClass {
  classLetter: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  name: string;
  representativeStar: string;
  surfaceTempK: number;
  apparentColor: string;
  colorHex: string;
  wienPeakNm: number;
  lifetimeYears: string;
  massSolar: string;
  dominantLines: string;
  lineIntensities: {
    hydrogen: number; // 0 to 1
    helium1: number;
    helium2: number;
    calcium2: number;
    metals: number;
    tio: number;
  };
  description: string;
}

const SPECTRAL_CLASSES: SpectralClass[] = [
  {
    classLetter: 'O',
    name: 'Mavi Dev / Hiperdev',
    representativeStar: 'Alnitak & Zeta Puppis (Naos)',
    surfaceTempK: 38000,
    apparentColor: 'Derin Elektrik Mavisi',
    colorHex: '#9bb0ff',
    wienPeakNm: 76, // UV peak
    lifetimeYears: '~3 – 10 Milyon Yıl',
    massSolar: '20 – 100 M☉',
    dominantLines: 'İyonize Helyum (He II), Oksijen III, Azot III. Hidrojen çizgileri aşırı iyonlaşma nedeniyle zayıftır.',
    lineIntensities: { hydrogen: 0.25, helium1: 0.6, helium2: 0.95, calcium2: 0.05, metals: 0.1, tio: 0.0 },
    description: 'Evrenin en sıcak, en kütleli ve en kısa ömürlü titanları. Radyasyon basınçları o kadar şiddetlidir ki yıldız rüzgarlarıyla yılda milyarlarca ton madde uzaya savrulur.'
  },
  {
    classLetter: 'B',
    name: 'Mavi-Beyaz Dev',
    representativeStar: 'Rigel & Spica',
    surfaceTempK: 21000,
    apparentColor: 'Mavi-Beyaz',
    colorHex: '#bbccff',
    wienPeakNm: 138, // Far UV
    lifetimeYears: '~50 – 100 Milyon Yıl',
    massSolar: '3 – 18 M☉',
    dominantLines: 'Nötr Helyum (He I), orta şiddette Balmer hidrojen çizgileri.',
    lineIntensities: { hydrogen: 0.65, helium1: 0.9, helium2: 0.2, calcium2: 0.1, metals: 0.2, tio: 0.0 },
    description: 'Avcı takımyıldızının Rigel’i gibi görkemli yıldızlar. Genç yıldız kümelerinin ve spiral galaksi kollarının parlak mavi ışık kaynaklarıdır.'
  },
  {
    classLetter: 'A',
    name: 'Saf Beyaz',
    representativeStar: 'Sirius A & Vega',
    surfaceTempK: 9800,
    apparentColor: 'Buzul Beyazı',
    colorHex: '#f8f9ff',
    wienPeakNm: 295, // Near UV
    lifetimeYears: '~400 Milyon – 1 Milyar Yıl',
    massSolar: '1.7 – 2.5 M☉',
    dominantLines: 'Maksimum Şiddette Hidrojen Balmer Çizgileri (Hα, Hβ, Hγ, Hδ). İyonize metal çizgileri zayıf.',
    lineIntensities: { hydrogen: 1.0, helium1: 0.1, helium2: 0.0, calcium2: 0.35, metals: 0.3, tio: 0.0 },
    description: 'Balmer hidrojen serisinin zirve yaptığı sınıf. Gece göğünün en parlak yıldızı Sirius A ve astronomik parlaklık referansı Vega bu sınıftadır.'
  },
  {
    classLetter: 'F',
    name: 'Sarı-Beyaz',
    representativeStar: 'Procyon A & Polaris (Kutup Yıldızı)',
    surfaceTempK: 6800,
    apparentColor: 'Sarı-Beyaz',
    colorHex: '#ffffed',
    wienPeakNm: 426, // Blue-violet
    lifetimeYears: '~3 – 5 Milyar Yıl',
    massSolar: '1.1 – 1.6 M☉',
    dominantLines: 'İyonize Kalsiyum (Ca II H & K) güçlenir, Hidrojen çizgileri zayıflamaya başlar, nötr demir hatları belirir.',
    lineIntensities: { hydrogen: 0.65, helium1: 0.0, helium2: 0.0, calcium2: 0.75, metals: 0.55, tio: 0.0 },
    description: 'Güneşimizden biraz daha sıcak ve kütleli. Kutup Yıldızı (Polaris) bir F-sınıfı süperdev olup Cepheid zonklama periyotlarıyla kozmik mesafe feneridir.'
  },
  {
    classLetter: 'G',
    name: 'Sarı Cüce (Güneş Türü)',
    representativeStar: 'Güneş (Sun) & Alfa Centauri A',
    surfaceTempK: 5778,
    apparentColor: 'Altın Sarısı',
    colorHex: '#fff4e8',
    wienPeakNm: 502, // Green-yellow visual peak
    lifetimeYears: '~10 Milyar Yıl',
    massSolar: '0.85 – 1.1 M☉',
    dominantLines: 'Baskın Ca II H ve K çizgileri, Fraunhofer G bandı demir (Fe) ve Sodyum D çiftlisi.',
    lineIntensities: { hydrogen: 0.45, helium1: 0.0, helium2: 0.0, calcium2: 0.95, metals: 0.85, tio: 0.0 },
    description: 'Yaşamın beşiği olan Güneşimizin spektrum sınıfı. Fotosferinde on binlerce Fraunhofer soğurma çizgisi bulunur ve görünür spektrumun ortasında zirve yapar.'
  },
  {
    classLetter: 'K',
    name: 'Turuncu Cüce / Dev',
    representativeStar: 'Arcturus & Aldebaran',
    surfaceTempK: 4400,
    apparentColor: 'Sıcak Turuncu',
    colorHex: '#ffd2a1',
    wienPeakNm: 658, // Orange-red
    lifetimeYears: '~20 – 50 Milyar Yıl',
    massSolar: '0.6 – 0.85 M☉',
    dominantLines: 'Güçlü nötr metal çizgileri (Fe I, Ca I), nötr kalsiyum 422.7 nm rezonans çizgisi.',
    lineIntensities: { hydrogen: 0.2, helium1: 0.0, helium2: 0.0, calcium2: 0.85, metals: 0.98, tio: 0.2 },
    description: 'Kararlı radyasyon ortamları ve aşırı uzun ömürleriyle ötegezegenlerde biyolojik yaşam arayışının en gözde aday yıldızlarıdır.'
  },
  {
    classLetter: 'M',
    name: 'Kırmızı Cüce / Süperdev',
    representativeStar: 'Betelgeuse & Proxima Centauri',
    surfaceTempK: 3200,
    apparentColor: 'Kızıl / Derin Kırmızı',
    colorHex: '#ff8a65',
    wienPeakNm: 905, // Infrared peak
    lifetimeYears: '~100 Milyar – 1 Trilyon Yıl',
    massSolar: '0.08 – 0.5 M☉',
    dominantLines: 'Geniş moleküler Titanyum Oksit (TiO) soğurma bantları, nötr Kalsiyum, Vanadyum Oksit.',
    lineIntensities: { hydrogen: 0.08, helium1: 0.0, helium2: 0.0, calcium2: 0.5, metals: 0.9, tio: 0.95 },
    description: 'Samanyolu galaksisindeki yıldızların %75’inden fazlasını oluşturan sınıf. Düşük fotosfer sıcaklığı moleküllerin parçalanmadan hayatta kalmasına izin verir.'
  }
];

// Major astronomical absorption lines (Fraunhofer lines)
interface AbsorptionLine {
  id: string;
  name: string;
  wavelengthNm: number;
  element: string;
  family: 'hydrogen' | 'helium1' | 'helium2' | 'calcium2' | 'metals' | 'tio';
  significance: string;
}

const FRAUNHOFER_LINES: AbsorptionLine[] = [
  { id: 'ca_k', name: 'K Çizgisi', wavelengthNm: 393.4, element: 'Ca II (İyonize Kalsiyum)', family: 'calcium2', significance: 'Güneş ve soğuk yıldızların en derin soğurma vadisi' },
  { id: 'ca_h', name: 'H Çizgisi', wavelengthNm: 396.8, element: 'Ca II (İyonize Kalsiyum)', family: 'calcium2', significance: 'Mor ötesi sınırında iyonize kalsiyum rezonansı' },
  { id: 'h_delta', name: 'H-delta (Hδ)', wavelengthNm: 410.2, element: 'H I (Balmer Serisi)', family: 'hydrogen', significance: 'Hidrojen n=6 → n=2 geçişi' },
  { id: 'ca_neutral', name: 'g Çizgisi', wavelengthNm: 422.7, element: 'Ca I (Nötr Kalsiyum)', family: 'metals', significance: 'K ve M sınıfı yıldızlarda güçlü nötr metal indikatörü' },
  { id: 'h_gamma', name: 'H-gamma (Hγ)', wavelengthNm: 434.0, element: 'H I (Balmer Serisi)', family: 'hydrogen', significance: 'Hidrojen n=5 → n=2 geçişi' },
  { id: 'he_1_447', name: 'He I 447', wavelengthNm: 447.1, element: 'He I (Nötr Helyum)', family: 'helium1', significance: 'B sınıfı yıldızların imza helyum soğurması' },
  { id: 'he_2_468', name: 'He II 468', wavelengthNm: 468.6, element: 'He II (İyonize Helyum)', family: 'helium2', significance: 'Sadece 30.000K üzeri O-tipi devlerde gözlenir' },
  { id: 'h_beta', name: 'H-beta (Hβ)', wavelengthNm: 486.1, element: 'H I (Balmer Serisi)', family: 'hydrogen', significance: 'Hidrojen n=4 → n=2 mavi-yeşil geçişi' },
  { id: 'tio_band1', name: 'TiO Bandı 1', wavelengthNm: 516.7, element: 'TiO Molekülü', family: 'tio', significance: 'M-tipi kırmızı devlerin geniş moleküler bloğu' },
  { id: 'fe_e', name: 'E Çizgisi', wavelengthNm: 527.0, element: 'Fe I (Nötr Demir)', family: 'metals', significance: 'Yıldız metallisitesini ölçen kritik demir çizgisi' },
  { id: 'mg_b', name: 'b Çizgisi', wavelengthNm: 518.3, element: 'Mg I (Magnezyum Tripleti)', family: 'metals', significance: 'Yıldız yüzey yerçekimini belirlemede kullanılır' },
  { id: 'he_d3', name: 'D3 Çizgisi', wavelengthNm: 587.6, element: 'He I (Nötr Helyum)', family: 'helium1', significance: 'İlk kez 1868 güneş tutulmasında keşfedilen Helyum hattı' },
  { id: 'na_d1', name: 'Na D1 Çizgisi', wavelengthNm: 589.0, element: 'Na I (Nötr Sodyum)', family: 'metals', significance: 'Yıldızlararası ortam ve yıldız fotosferi sodyum çiftlisi' },
  { id: 'na_d2', name: 'Na D2 Çizgisi', wavelengthNm: 589.6, element: 'Na I (Nötr Sodyum)', family: 'metals', significance: 'Sarı spektrumun en belirgin çift soğurma çizgisi' },
  { id: 'tio_band2', name: 'TiO Bandı 2', wavelengthNm: 620.0, element: 'TiO Molekülü', family: 'tio', significance: 'Moleküler bağların sebep olduğu derin kızıl çöküntü' },
  { id: 'h_alpha', name: 'H-alpha (Hα)', wavelengthNm: 656.3, element: 'H I (Balmer Serisi)', family: 'hydrogen', significance: 'Kozmosun en ünlü kırmızı emisyon/soğurma çizgisi (n=3 → n=2)' }
];

// Helper: convert wavelength in nm to rough RGB for the continuous background
function nmToRGB(wavelength: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength >= 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity falloff near limits
  let factor = 1;
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  } else if (wavelength >= 700 && wavelength <= 750) {
    factor = 0.3 + 0.7 * (750 - wavelength) / (750 - 700);
  }

  return [Math.round(r * factor * 255), Math.round(g * factor * 255), Math.round(b * factor * 255)];
}

export function StellarSpectroscopyLab() {
  const [selectedClass, setSelectedClass] = useState<SpectralClass>(SPECTRAL_CLASSES[4]); // Default Sun (G)
  const [radialVelocityKmS, setRadialVelocityKmS] = useState<number>(0); // Doppler shift
  const [hoveredWavelength, setHoveredWavelength] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<AbsorptionLine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Speed of light in km/s
  const C_KMS = 299792;
  // Doppler shift factor: lambda_observed = lambda_rest * (1 + v/c)
  const dopplerFactor = 1 + radialVelocityKmS / C_KMS;

  // Render spectrum on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const minNm = 380;
    const maxNm = 720;
    const nmRange = maxNm - minNm;

    // 1. Draw continuous rainbow spectrum
    const imgData = ctx.createImageData(width, height);
    for (let x = 0; x < width; x++) {
      const nm = minNm + (x / width) * nmRange;
      const [r, g, b] = nmToRGB(nm);

      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        imgData.data[index] = r;
        imgData.data[index + 1] = g;
        imgData.data[index + 2] = b;
        imgData.data[index + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Draw dark Fraunhofer absorption lines adjusted by Doppler and class intensity
    FRAUNHOFER_LINES.forEach((line) => {
      const shiftedNm = line.wavelengthNm * dopplerFactor;
      if (shiftedNm < minNm || shiftedNm > maxNm) return;

      const intensity = selectedClass.lineIntensities[line.family] || 0;
      if (intensity <= 0.02) return; // Not visible in this star class

      const x = ((shiftedNm - minNm) / nmRange) * width;
      const lineWidth = line.family === 'tio' ? 12 : Math.max(1.8, intensity * 3.5);
      const alpha = Math.min(0.96, intensity * 0.95);

      ctx.fillStyle = `rgba(10, 10, 15, ${alpha})`;
      ctx.fillRect(x - lineWidth / 2, 0, lineWidth, height);

      // Core deepest black center
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
      ctx.fillRect(x - 0.75, 0, 1.5, height);
    });

    // 3. Highlight hovered line position
    if (hoveredWavelength && hoveredWavelength >= minNm && hoveredWavelength <= maxNm) {
      const hX = ((hoveredWavelength - minNm) / nmRange) * width;
      ctx.strokeStyle = '#d4ff3d';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hX, 0);
      ctx.lineTo(hX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [selectedClass, dopplerFactor, hoveredWavelength]);

  // Handle canvas mouse move for interactive inspection
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const rawNm = 380 + ratio * (720 - 380);
    setHoveredWavelength(parseFloat(rawNm.toFixed(1)));

    // Find closest absorption line
    let closest: AbsorptionLine | null = null;
    let minDiff = 3.5; // tolerance nm
    FRAUNHOFER_LINES.forEach((line) => {
      const shifted = line.wavelengthNm * dopplerFactor;
      const diff = Math.abs(shifted - rawNm);
      const intensity = selectedClass.lineIntensities[line.family] || 0;
      if (diff < minDiff && intensity > 0.05) {
        minDiff = diff;
        closest = line;
      }
    });
    setSelectedLine(closest);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredWavelength(null);
  };

  // Doppler redshift/blueshift label calculation
  const dopplerText = useMemo(() => {
    if (radialVelocityKmS === 0) return 'Durağan (v = 0 km/s)';
    if (radialVelocityKmS > 0) return `Kızıla kayma (+${radialVelocityKmS.toLocaleString('tr-TR')} km/s — uzaklaşıyor)`;
    return `Maviye kayma (${radialVelocityKmS.toLocaleString('tr-TR')} km/s — yaklaşıyor)`;
  }, [radialVelocityKmS]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Giriş */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 lg:flex-row lg:items-end lg:gap-8">
        <div className="max-w-3xl">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Fraunhofer soğurma hatları & yıldız barkodları
          </h3>
          <p className="mt-3 text-base leading-relaxed text-paper/85">
            Yıldızların iç çekirdeğinden yayılan sürekli spektrum, fotosferdeki daha soğuk gaz atomları tarafından belirli dalgaboylarında soğurulur (Kirchhoff Yasaları). Harvard Spektral Sınıflandırmasını (O-B-A-F-G-K-M) seçerek kimyasal parmak izlerini incele ve Doppler kaydırıcısıyla radyal hızın tayfı nasıl ötelediğini gözlemle.
          </p>
        </div>
        <div className="shrink-0">
          <span className={`block ${SMALL_LABEL}`}>Referans ölçek</span>
          <span className="mt-0.5 block text-sm text-paper">
            <span className="font-mono">380 – 720 nm</span>{' '}
            <span className="text-paper/75">(görünür bant)</span>
          </span>
        </div>
      </div>

      {/* Spektral sınıf seçici (O, B, A, F, G, K, M) */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line max-sm:fill-row-2 sm:grid-cols-4 sm:max-lg:fill-row-4 lg:grid-cols-7">
        {SPECTRAL_CLASSES.map((cls) => {
          const isSelected = selectedClass.classLetter === cls.classLetter;
          return (
            <button
              key={cls.classLetter}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedClass(cls)}
              className={`flex min-w-0 flex-col p-4 text-left transition-colors ${
                isSelected ? 'bg-rose-signal text-ink' : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`text-sm ${isSelected ? 'text-ink/85' : 'text-paper/70'}`}>
                  Tip {cls.classLetter}
                </span>
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-black/30"
                  style={{ backgroundColor: cls.colorHex }}
                />
              </span>
              <span className="mt-2 block font-display text-3xl font-semibold leading-none">
                {cls.classLetter}
              </span>
              <span className={`mt-2 block font-mono text-sm tabular-nums ${isSelected ? 'text-ink' : 'text-rose-signal'}`}>
                {cls.surfaceTempK.toLocaleString('tr-TR')} K
              </span>
              <span className={`mt-1 block truncate text-xs ${isSelected ? 'text-ink/80' : 'text-paper/70'}`}>
                {cls.representativeStar.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Etkileşimli spektrogram */}
      <div className="border border-line bg-ink p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b border-line pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="mt-1.5 h-4 w-4 shrink-0 rounded-full border border-paper/20"
              style={{ backgroundColor: selectedClass.colorHex }}
            />
            <div className="min-w-0">
              <h4 className={CARD_TITLE}>
                Sınıf {selectedClass.classLetter} — {selectedClass.name}
              </h4>
              <p className="mt-1 text-sm text-paper/70">Örnek: {selectedClass.representativeStar}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 sm:text-right">
            <div>
              <span className={`block ${SMALL_LABEL}`}>Wien tepe dalgaboyu</span>
              <span className="font-mono text-sm text-rose-signal">{selectedClass.wienPeakNm} nm</span>
            </div>
            <div>
              <span className={`block ${SMALL_LABEL}`}>Yüzey sıcaklığı</span>
              <span className="font-mono text-sm text-paper">{selectedClass.surfaceTempK.toLocaleString('tr-TR')} K</span>
            </div>
          </div>
        </div>

        {/* Canlı tuval spektrumu */}
        <div className="mt-6 space-y-2">
          <div className="text-sm font-medium text-paper/80">Canlı Fraunhofer spektrogramı</div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-paper/70">
            <span>
              <span className="font-mono">380 nm</span> (mor / UV sınırı)
            </span>
            <span className="text-right">
              <span className="font-mono">720 nm</span> (derin kırmızı / IR sınırı)
            </span>
          </div>

          <div className="relative overflow-hidden border border-line bg-black">
            <canvas
              ref={canvasRef}
              width={1000}
              height={140}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              className="h-28 w-full cursor-crosshair sm:h-36"
            />
          </div>

          {/* Dalgaboyu ölçeği */}
          <div className="flex justify-between px-1 font-mono text-[11px] text-paper/70 sm:text-xs">
            <span>400 nm</span>
            <span className="max-sm:hidden">450 nm</span>
            <span>500 nm</span>
            <span className="max-sm:hidden">550 nm</span>
            <span>600 nm</span>
            <span className="max-sm:hidden">650 nm</span>
            <span>700 nm</span>
          </div>
        </div>

        {/* Canlı imleç okuması */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-ink-2 px-4 py-3">
          <div className="shrink-0">
            <span className={`block ${SMALL_LABEL}`}>İmleç dalgaboyu</span>
            {hoveredWavelength ? (
              <span className="font-mono text-base font-semibold text-paper">{`${hoveredWavelength} nm`}</span>
            ) : (
              <span className="text-base text-paper/85">Spektrum üzerine gelin</span>
            )}
          </div>

          {selectedLine ? (
            <div className="min-w-0 text-sm leading-relaxed text-paper">
              <span className="font-medium text-rose-signal">{selectedLine.name}</span>
              <span className="mx-2 text-paper/40">·</span>
              <span>{selectedLine.element}</span>
              <span className="mx-2 text-paper/40">·</span>
              <span className="text-paper/80">{selectedLine.significance}</span>
            </div>
          ) : (
            <p className="min-w-0 text-sm text-paper/75">
              Karakteristik bir Fraunhofer çizgisini incelemek için fareyi spektrum çizgilerinin üzerine getirin.
            </p>
          )}
        </div>

        {/* Doppler radyal hız kaydırıcısı */}
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start sm:gap-6">
            <div className="min-w-0">
              <div className="text-sm font-medium text-paper">
                Doppler radyal hızı <span className="font-mono font-normal text-paper/70">(Δλ / λ₀ = v / c)</span>
              </div>
              <p className="mt-1 text-sm text-paper/80">
                Yıldızın Dünya’ya göre bakış doğrultusundaki hızı çizgileri kızıla veya maviye öteler.
              </p>
            </div>
            <div className="shrink-0 text-sm font-medium tabular-nums text-rose-signal">
              {dopplerText}
            </div>
          </div>

          <div className="mt-5">
            <input aria-label="Radyal hız (km/s)"
              type="range"
              min="-15000"
              max="15000"
              step="250"
              value={radialVelocityKmS}
              onChange={(e) => setRadialVelocityKmS(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none bg-ink-3 accent-rose-signal"
            />
            <div className="mt-2 flex justify-between gap-3 font-mono text-xs">
              <span className="text-blue-400">-15.000 km/s</span>
              <span className="text-rose-signal">+15.000 km/s</span>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setRadialVelocityKmS(0)}
              className="min-h-9 border border-line px-3 text-sm text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
            >
              Radyal hızı sıfırla (0 km/s)
            </button>
          </div>
        </div>
      </div>

      {/* Sınıf ayrıntıları ve kimyasal döküm */}
      <div className="grid gap-px border border-line bg-line lg:grid-cols-12">
        {/* Sol: yıldızın astrofiziksel özeti */}
        <div className="min-w-0 bg-ink p-5 sm:p-8 lg:col-span-7">
          <h4 className={`${CARD_TITLE} sm:text-2xl`}>
            {selectedClass.name} ({selectedClass.classLetter})
          </h4>
          <p className="mt-3 text-base leading-relaxed text-paper/85">
            {selectedClass.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-3">
            <div>
              <dt className={SMALL_LABEL}>Ortalama kütle</dt>
              <dd className="mt-0.5 font-mono text-sm text-paper">{selectedClass.massSolar}</dd>
            </div>
            <div>
              <dt className={SMALL_LABEL}>Ana kol ömrü</dt>
              <dd className="mt-0.5 font-mono text-sm text-paper">{selectedClass.lifetimeYears}</dd>
            </div>
            <div>
              <dt className={SMALL_LABEL}>Görünür renk</dt>
              <dd className="mt-0.5 text-sm text-paper">{selectedClass.apparentColor}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <div className="text-sm font-medium text-rose-signal">Baskın spektral çizgiler</div>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/85 sm:text-base">
              {selectedClass.dominantLines}
            </p>
          </div>
        </div>

        {/* Sağ: Fraunhofer ana hatları */}
        <div className="flex min-w-0 flex-col justify-between gap-6 bg-ink p-5 sm:p-8 lg:col-span-5">
          <div>
            <h5 className="font-display text-lg font-semibold leading-tight text-paper">Spektrumdaki element imzaları</h5>
            <p className="mt-1 text-sm text-paper/70">Fraunhofer ana hatları rehberi</p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {FRAUNHOFER_LINES.slice(0, 8).map((line) => {
                const intensity = selectedClass.lineIntensities[line.family] || 0;
                return (
                  <li
                    key={line.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-paper">{line.name}</span>
                      <span className="ml-2 text-paper/70">{line.element.split(' ')[0]}</span>
                    </div>
                    <div className="flex shrink-0 items-baseline gap-3">
                      <span className="font-mono text-xs text-paper/70">{line.wavelengthNm} nm</span>
                      <span
                        className={`w-[4.5rem] text-right text-xs font-medium ${
                          intensity > 0.6
                            ? 'text-rose-signal'
                            : intensity > 0.2
                            ? 'text-paper'
                            : 'text-paper/60'
                        }`}
                      >
                        {intensity > 0.6 ? 'Çok güçlü' : intensity > 0.2 ? 'Orta' : 'Yok / eser'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium text-paper/80">Biliyor muydunuz?</div>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/80">
              Astronom Cecilia Payne-Gaposchkin, 1925 yılında bu spektroskopik çizgileri analiz ederek evrenin çoğunlukla demir veya kayadan değil, ezici çoğunlukla hidrojen ve helyumdan oluştuğunu ispatlayan ilk insandır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
