'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Eye, Sparkles, MapPin } from 'lucide-react';

interface BortleClass {
  classLevel: number;
  title: string;
  nelm: string; // Naked Eye Limiting Magnitude
  visibleStarsApprox: number;
  skyQualityMeter: string; // mag/arcsec²
  skyColor: string;
  milkyWayVisibility: string;
  turkeyReference: string;
  description: string;
}

const BORTLE_LEVELS: BortleClass[] = [
  {
    classLevel: 1,
    title: 'Mükemmel Karanlık Gökyüzü',
    nelm: '7.6 – 8.0 mag',
    visibleStarsApprox: 7500,
    skyQualityMeter: '21.7 – 22.0',
    skyColor: '#020206',
    milkyWayVisibility: 'Olağanüstü zengin detaylar, toz yarıkları, Akrep ve Yay parlak bulutları zemine gölge düşürür.',
    turkeyReference: 'Antalya Bakırlıtepe (TUG), Kaçkar Yaylaları, Toroslar',
    description: 'Yeryüzündeki en saf astronomik gözlem koşulları. Zodyak ışığı ve hava ışıması (airglow) belirgindir; M33 çıplak gözle doğrudan seçilir.'
  },
  {
    classLevel: 2,
    title: 'Tipik Gerçek Karanlık Gökyüzü',
    nelm: '7.1 – 7.5 mag',
    visibleStarsApprox: 5800,
    skyQualityMeter: '21.5 – 21.7',
    skyColor: '#05050e',
    milkyWayVisibility: 'Samanyolu karmaşık mermer dokusuyla parlar; ufukta çok hafif ışık kirliliği emareleri görülebilir.',
    turkeyReference: 'Erzurum Konaklı (DAG çevresi), Beyşehir Gölü kırsalı',
    description: 'Teleskoplu gözlemciler için kusursuz derin uzay koşulları. Çıplak gözle onlarca yıldız kümesi seçilebilir.'
  },
  {
    classLevel: 3,
    title: 'Kırsal Gökyüzü',
    nelm: '6.6 – 7.0 mag',
    visibleStarsApprox: 4200,
    skyQualityMeter: '21.3 – 21.5',
    skyColor: '#090a16',
    milkyWayVisibility: 'Samanyolu hala çok belirgindir ancak ufuk yönünde ışık kubbeleri belirginleşir.',
    turkeyReference: 'Çanakkale Kaz Dağları etekleri, Kapadokya vadileri',
    description: 'Ufuktaki yerleşim yerlerinin yaydığı ışık kubbesi 15° yüksekliğe kadar uzanır; zenith yönü oldukça karanlıktır.'
  },
  {
    classLevel: 4,
    title: 'Kırsal / Banliyö Geçişi',
    nelm: '6.1 – 6.5 mag',
    visibleStarsApprox: 2600,
    skyQualityMeter: '20.4 – 21.3',
    skyColor: '#0f1222',
    milkyWayVisibility: 'Samanyolu hala etkileyicidir ancak zayıf dış yapıları ve toz kanalları kaybolur.',
    turkeyReference: 'Muğla / Fethiye kırsal köyleri, Bolu Abant çevresi',
    description: 'Birden çok yönde ışık kaynakları görünür. Bulutlar ufuk yönünde aydınlık, tepe noktasında koyu görünür.'
  },
  {
    classLevel: 5,
    title: 'Banliyö Gökyüzü',
    nelm: '5.6 – 6.0 mag',
    visibleStarsApprox: 1400,
    skyQualityMeter: '19.1 – 20.4',
    skyColor: '#17192e',
    milkyWayVisibility: 'Samanyolu tepe noktasında soluk bir bant gibidir; ufukta neredeyse tamamen silinir.',
    turkeyReference: 'İlçe merkezleri, büyükşehir çevre köyleri',
    description: 'Işık kirliliği çoğu yönde gökyüzünü sarar. Küçük yıldız kümeleri ve soluk takımyıldızlar çıplak gözle kaybolur.'
  },
  {
    classLevel: 6,
    title: 'Parlak Banliyö Gökyüzü',
    nelm: '5.1 – 5.5 mag',
    visibleStarsApprox: 750,
    skyQualityMeter: '18.0 – 19.1',
    skyColor: '#202238',
    milkyWayVisibility: 'Yalnızca zenith yönünde çok silik bir sis lekesi olarak seçilebilir.',
    turkeyReference: 'Büyükşehir dış çeperleri (Pendik, Beylikdüzü, Sincan)',
    description: 'Gökyüzü gri-beyaz bir parlaklığa bürünür. 35° yüksekliğin altındaki soluk cisimleri görmek imkansızlaşır.'
  },
  {
    classLevel: 7,
    title: 'Banliyö / Şehir Geçişi',
    nelm: '4.6 – 5.0 mag',
    visibleStarsApprox: 350,
    skyQualityMeter: '17.0 – 18.0',
    skyColor: '#282a44',
    milkyWayVisibility: 'Samanyolu tamamen görünmez hale gelir.',
    turkeyReference: 'Orta büyüklükteki şehir merkezleri, İzmir sahil şeridi',
    description: 'Gökyüzü arka planı sodyum ve LED ışıklarıyla aydınlıktır. Yalnızca ana takımyıldızların en parlak yıldızları seçilebilir.'
  },
  {
    classLevel: 8,
    title: 'Şehir Gökyüzü',
    nelm: '4.1 – 4.5 mag',
    visibleStarsApprox: 120,
    skyQualityMeter: '16.0 – 17.0',
    skyColor: '#343550',
    milkyWayVisibility: 'Görünmez.',
    turkeyReference: 'Ankara Çankaya / Kızılay, Bursa Nilüfer',
    description: 'Gökyüzü tümüyle aydınlık gri veya turuncumsu parlar. Avcı ve Büyük Ayı gibi en belirgin şekiller bile soluktur.'
  },
  {
    classLevel: 9,
    title: 'İç Şehir Merkezi',
    nelm: '< 4.0 mag',
    visibleStarsApprox: 20,
    skyQualityMeter: '< 16.0',
    skyColor: '#423d54',
    milkyWayVisibility: 'Kesinlikle görünmez.',
    turkeyReference: 'İstanbul Taksim / Kadıköy / Levent, New York Manhattan',
    description: 'Şiddetli ışık kirliliği. Gece gökyüzünde yalnızca Ay, parlak gezegenler (Jüpiter, Venüs) ve en parlak birkaç yıldız (Sirius, Vega) seçilebilir.'
  }
];

export function BortleScaleSimulator() {
  const [bortleIndex, setBortleIndex] = useState<number>(1); // 1 to 9
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentLevel = BORTLE_LEVELS[bortleIndex - 1];

  // Render simulated sky on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Sky Background gradient depending on light pollution level
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (bortleIndex <= 2) {
      grad.addColorStop(0, '#020208');
      grad.addColorStop(1, '#060614');
    } else if (bortleIndex <= 5) {
      grad.addColorStop(0, '#0b0e20');
      grad.addColorStop(1, '#1b1d36');
    } else {
      grad.addColorStop(0, '#1c1e34');
      grad.addColorStop(1, '#3a344d');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // City glow at bottom horizon (grows stronger with Bortle class)
    if (bortleIndex > 2) {
      const cityGlow = ctx.createRadialGradient(w / 2, h + 20, 10, w / 2, h, w * 0.7);
      const intensity = (bortleIndex - 2) * 0.12;
      cityGlow.addColorStop(0, `rgba(255, 170, 80, ${intensity})`);
      cityGlow.addColorStop(1, 'rgba(255, 170, 80, 0)');
      ctx.fillStyle = cityGlow;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);
    }

    // Milky Way Band (visible in Bortle 1-4)
    if (bortleIndex <= 4) {
      const mwOpacity = Math.max(0, 0.65 - (bortleIndex - 1) * 0.18);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-0.4);
      const mwGrad = ctx.createLinearGradient(-w, 0, w, 0);
      mwGrad.addColorStop(0, 'rgba(255,255,255,0)');
      mwGrad.addColorStop(0.35, `rgba(220, 230, 255, ${mwOpacity * 0.25})`);
      mwGrad.addColorStop(0.5, `rgba(255, 245, 230, ${mwOpacity})`);
      mwGrad.addColorStop(0.65, `rgba(200, 220, 255, ${mwOpacity * 0.25})`);
      mwGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = mwGrad;
      ctx.fillRect(-w, -50, w * 2, 100);

      // Dark dust lanes in Milky Way
      if (bortleIndex <= 2) {
        ctx.fillStyle = 'rgba(2, 2, 6, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 5, 160, 12, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Procedural Stars
    // Number of visible stars scaled by Bortle level
    const starCount = Math.round((currentLevel.visibleStarsApprox / 7500) * 450);

    // Seeded random pseudo-stars
    for (let i = 0; i < starCount; i++) {
      const x = ((Math.sin(i * 997.1) + 1) / 2) * w;
      const y = ((Math.cos(i * 443.3) + 1) / 2) * (h - 20);

      // Brightness variation
      const baseBright = (Math.sin(i * 123.7) + 1) / 2;
      const radius = i < 15 ? 2.2 : baseBright > 0.8 ? 1.4 : 0.8;
      const alpha = Math.min(1.0, baseBright * 0.8 + 0.2);

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Halo for brightest stars
      if (i < 8) {
        ctx.fillStyle = 'rgba(212, 255, 61, 0.25)';
        ctx.beginPath();
        ctx.arc(x, y, radius * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Horizon line
    ctx.strokeStyle = '#26262b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 1);
    ctx.lineTo(w, h - 1);
    ctx.stroke();
  }, [bortleIndex, currentLevel]);

  return (
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Bortle skalası ve gece göğü karanlığı
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
          Kentsel aydınlatmanın gökyüzünü nasıl sildiğini interaktif slider ile deneyimleyin. 1. Sınıf saf karanlıktan 9. Sınıf şehir merkezine yıldız kaybı.
        </p>
        <p className="mt-2 text-sm text-paper/70">
          Işık kirliliği · NELM <span className="font-mono tabular-nums">8.0 → 4.0 mag</span> · 9 gözlem sınıfı
        </p>
      </div>

      {/* Sınıf seçici */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <Sliders size={16} className="shrink-0 text-lime" />
            <span className="text-base font-medium text-paper">
              Bortle sınıfı: <span className="font-mono tabular-nums">{bortleIndex}</span> · {currentLevel.title}
            </span>
          </div>
          <span className="text-sm text-paper/70">
            Limit kadir: <span className="font-mono tabular-nums text-lime">{currentLevel.nelm}</span>
          </span>
        </div>

        <input aria-label="Bortle ışık kirliliği sınıfı"
          type="range"
          min="1"
          max="9"
          step="1"
          value={bortleIndex}
          onChange={(e) => setBortleIndex(parseInt(e.target.value, 10))}
          className="w-full accent-[var(--lime)] cursor-pointer h-2 bg-ink"
        />

        <div className="grid grid-cols-9 gap-1 text-center text-sm text-paper/70">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => setBortleIndex(n)}
              className={`min-h-9 border px-0 transition-colors cursor-pointer ${
                bortleIndex === n ? 'border-lime bg-lime text-ink font-semibold' : 'border-line hover:border-paper/40 hover:text-paper'
              }`}
            >
              <span className="max-sm:sr-only">Sınıf </span>
              <span className="tabular-nums">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simüle gece göğü */}
      <div className="space-y-4">
        <div className="relative border border-line bg-black overflow-hidden h-72 sm:h-96 w-full">
          <canvas
            ref={canvasRef}
            width={800}
            height={384}
            className="w-full h-full block"
          />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div>
            <div className="text-sm text-paper/70">Görülebilen yıldız</div>
            <div className="mt-0.5 font-mono text-lg tabular-nums text-lime">
              ~{currentLevel.visibleStarsApprox.toLocaleString('tr-TR')}
            </div>
          </div>
          <div>
            <div className="text-sm text-paper/70">Gökyüzü parlaklığı</div>
            <div className="mt-0.5 font-mono text-lg tabular-nums text-paper">
              {currentLevel.skyQualityMeter} <span className="text-sm text-paper/70">mag/arcsec²</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-paper/70">Gözlem koşulu</div>
            <div className="mt-0.5 text-lg text-paper">
              {bortleIndex <= 3 ? 'Kusursuz gözlem' : bortleIndex <= 6 ? 'Kısmi gözlem' : 'Yoğun kirlilik'}
            </div>
          </div>
        </div>
      </div>

      {/* Sınıf ayrıntıları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
        <div className="bg-ink p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <Eye className="h-4 w-4 shrink-0 text-lime" />
            <span>Samanyolu görünürlüğü</span>
          </div>
          <p className="mt-2 text-base leading-relaxed text-paper/85">
            {currentLevel.milkyWayVisibility}
          </p>
        </div>

        <div className="bg-ink p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <Sparkles className="h-4 w-4 shrink-0 text-lime" />
            <span>Gözlemsel tanım</span>
          </div>
          <p className="mt-2 text-base leading-relaxed text-paper/85">
            {currentLevel.description}
          </p>
        </div>

        <div className="bg-ink p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-paper/70">
            <MapPin className="h-4 w-4 shrink-0 text-lime" />
            <span>Türkiye referans noktaları</span>
          </div>
          <p className="mt-2 text-base leading-relaxed text-paper/85">
            {currentLevel.turkeyReference}
          </p>
        </div>
      </div>
    </div>
  );
}
