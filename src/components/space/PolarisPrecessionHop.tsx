'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

type Mode = 'hopping' | 'precession';

interface HistoricalPoleStar {
  year: number;
  yearLabel: string;
  starName: string;
  constellation: string;
  distanceDegFromPole: number;
  magnitude: number;
  historicalContext: string;
}

const HISTORICAL_POLE_STARS: HistoricalPoleStar[] = [
  {
    year: -12000,
    yearLabel: 'M.Ö. 12.000 (Buzul Çağı Sonu)',
    starName: 'Vega (Alfa Lyrae)',
    constellation: 'Çalgı (Lyra)',
    distanceDegFromPole: 4.8,
    magnitude: 0.03,
    historicalContext: 'Son buzul çağının sonunda avcı-toplayıcı insanların kuzey yönünü gösteren devasa parlak mavi fener.'
  },
  {
    year: -3000,
    yearLabel: 'M.Ö. 3000 (Antik Mısır)',
    starName: 'Thuban (Alfa Draconis)',
    constellation: 'Ejderha (Draco)',
    distanceDegFromPole: 0.2,
    magnitude: 3.67,
    historicalContext: 'Giza Piramitleri inşa edilirken havalandırma şaftları ve mezar odaları doğrudan Thuban yıldızına hizalanmıştı.'
  },
  {
    year: -1000,
    yearLabel: 'M.Ö. 1000 (Demir Çağı)',
    starName: 'Kochab (Beta Ursae Minoris)',
    constellation: 'Küçük Ayı',
    distanceDegFromPole: 6.5,
    magnitude: 2.08,
    historicalContext: 'Fenikeli denizcilerin Akdeniz ticaret yollarında seyir yaparken kutup bekçisi olarak kullandığı yıldız.'
  },
  {
    year: 2026,
    yearLabel: 'M.S. 2026 (Günümüz)',
    starName: 'Polaris (Alfa Ursae Minoris)',
    constellation: 'Küçük Ayı',
    distanceDegFromPole: 0.66,
    magnitude: 1.98,
    historicalContext: 'Modern çağın kutup yıldızı. Hakiki gök kutbuna en yakın konumuna (0.46°) 2100 yılında ulaşacak.'
  },
  {
    year: 4000,
    yearLabel: 'M.S. 4000 (Gelecek)',
    starName: 'Errai (Gama Cephei)',
    constellation: 'Kral (Cepheus)',
    distanceDegFromPole: 2.1,
    magnitude: 3.21,
    historicalContext: 'Dünyanın eksen presesyonu sonucu Polaris’in yerini alacak ve ilk doğrulanmış ötegezegene ev sahipliği yapan yıldız.'
  },
  {
    year: 7500,
    yearLabel: 'M.S. 7500 (Gelecek)',
    starName: 'Alderamin (Alfa Cephei)',
    constellation: 'Kral (Cepheus)',
    distanceDegFromPole: 1.8,
    magnitude: 2.45,
    historicalContext: 'Kral takımyıldızının en parlak yıldızı; yüksek dönme hızına sahip bir beyaz altdev.'
  },
  {
    year: 14000,
    yearLabel: 'M.S. 14.000 (Tam Döngü)',
    starName: 'Vega (Alfa Lyrae)',
    constellation: 'Çalgı (Lyra)',
    distanceDegFromPole: 3.9,
    magnitude: 0.03,
    historicalContext: '25.772 yıllık presesyon döngüsünü tamamlayan Dünya, gece göğünün en göz alıcı yıldızlarından birini yeniden kutup yıldızı yapacak.'
  }
];

export function PolarisPrecessionHop() {
  const [activeTab, setActiveTab] = useState<Mode>('precession');
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [latitudeDeg, setLatitudeDeg] = useState<number>(41); // Default Istanbul latitude
  const [hopProgress, setHopProgress] = useState<number>(100); // 0 to 100%

  const precessionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hopCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Precession simulation renderer
  useEffect(() => {
    if (activeTab !== 'precession') return;
    const canvas = precessionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;

    ctx.clearRect(0, 0, w, h);

    // Cosmic background grid
    ctx.strokeStyle = '#1e1e24';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    // Concentric circles
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - radius * 1.15, cy);
    ctx.lineTo(cx + radius * 1.15, cy);
    ctx.moveTo(cx, cy - radius * 1.15);
    ctx.lineTo(cx, cy + radius * 1.15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Precession Circle (23.5° obliquity path around Ecliptic Pole)
    ctx.strokeStyle = 'rgba(122, 92, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center marker: North Ecliptic Pole (Tutulma Kutbu)
    ctx.fillStyle = '#7a5cff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8a8a9a';
    ctx.font = '10px monospace';
    ctx.fillText('Tutulma Kutbu (NEP)', cx + 8, cy - 6);

    // Plot historical stars around the circle
    HISTORICAL_POLE_STARS.forEach((star) => {
      // Map year to angle: cycle is 25772 years
      // 2026 corresponds to angle theta ~ -0.15 rad
      const cycleFraction = (star.year - 2026) / 25772;
      const angle = -Math.PI / 2 + cycleFraction * Math.PI * 2;

      const sx = cx + Math.cos(angle) * radius;
      const sy = cy + Math.sin(angle) * radius;

      // Draw star dot
      const isSelected = Math.abs(star.year - targetYear) < 1500;
      ctx.fillStyle = isSelected ? '#d4ff3d' : '#efece6';
      ctx.beginPath();
      ctx.arc(sx, sy, isSelected ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = isSelected ? '#d4ff3d' : '#8a8a9a';
      ctx.font = isSelected ? 'bold 11px monospace' : '10px monospace';
      const text = `${star.starName.split(' ')[0]} (${star.year > 0 ? `+${star.year}` : star.year})`;
      ctx.fillText(text, sx + 8, sy + 4);
    });

    // Current year pointer on circle
    const currFraction = (targetYear - 2026) / 25772;
    const currAngle = -Math.PI / 2 + currFraction * Math.PI * 2;
    const px = cx + Math.cos(currAngle) * radius;
    const py = cy + Math.sin(currAngle) * radius;

    // Glowing indicator
    ctx.strokeStyle = '#d4ff3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Ray from center
    ctx.strokeStyle = 'rgba(212, 255, 61, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
  }, [activeTab, targetYear]);

  // Star Hopping Canvas Renderer
  useEffect(() => {
    if (activeTab !== 'hopping') return;
    const canvas = hopCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep space dark background
    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, w, h);

    // Background faint stars
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 40; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * h;
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) * 0.6 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Coordinates of Big Dipper (Ursa Major bowl & handle) and Polaris
    // Merak (bottom-right bowl) and Dubhe (top-right bowl)
    const merak = { x: w * 0.22, y: h * 0.72, name: 'Merak' };
    const dubhe = { x: w * 0.32, y: h * 0.58, name: 'Dubhe' };
    const phecda = { x: w * 0.16, y: h * 0.84, name: 'Phecda' };
    const megrez = { x: w * 0.26, y: h * 0.70, name: 'Megrez' };
    const alioth = { x: w * 0.22, y: h * 0.88, name: 'Alioth' };
    const mizar = { x: w * 0.17, y: h * 0.94, name: 'Mizar' };
    const alkaid = { x: w * 0.12, y: h * 0.98, name: 'Alkaid' };

    // Polaris position
    // Vector Dubhe - Merak:
    const dx = dubhe.x - merak.x;
    const dy = dubhe.y - merak.y;
    // 5 times the distance
    const polaris = { x: dubhe.x + dx * 4.9, y: dubhe.y + dy * 4.9, name: 'Polaris (Kutup Yıldızı)' };

    // Draw Big Dipper lines
    ctx.strokeStyle = 'rgba(122, 92, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(merak.x, merak.y);
    ctx.lineTo(dubhe.x, dubhe.y);
    ctx.lineTo(megrez.x, megrez.y);
    ctx.lineTo(phecda.x, phecda.y);
    ctx.lineTo(merak.x, merak.y);
    // Handle
    ctx.moveTo(megrez.x, megrez.y);
    ctx.lineTo(alioth.x, alioth.y);
    ctx.lineTo(mizar.x, mizar.y);
    ctx.lineTo(alkaid.x, alkaid.y);
    ctx.stroke();

    // Draw stars of Big Dipper
    const dipperStars = [merak, dubhe, phecda, megrez, alioth, mizar, alkaid];
    dipperStars.forEach((s) => {
      ctx.fillStyle = '#efece6';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8a8a9a';
      ctx.font = '10px monospace';
      ctx.fillText(s.name, s.x + 6, s.y - 4);
    });

    // Draw the Pointer Guide Line (Merak -> Dubhe -> Polaris) based on hopProgress
    const t = hopProgress / 100;
    const endX = dubhe.x + dx * 4.9 * t;
    const endY = dubhe.y + dy * 4.9 * t;

    ctx.strokeStyle = '#d4ff3d';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(merak.x, merak.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw step marks along the 5x line
    for (let step = 1; step <= 5; step++) {
      const stepT = step / 5;
      if (t >= stepT) {
        const mx = dubhe.x + dx * (step - 1);
        const my = dubhe.y + dy * (step - 1);
        ctx.fillStyle = '#d4ff3d';
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d4ff3d';
        ctx.font = '9px monospace';
        ctx.fillText(`${step}x`, mx + 5, my + 10);
      }
    }

    // Polaris Glow if reached
    if (hopProgress >= 90) {
      // Glow
      const grad = ctx.createRadialGradient(polaris.x, polaris.y, 2, polaris.x, polaris.y, 22);
      grad.addColorStop(0, 'rgba(212, 255, 61, 0.9)');
      grad.addColorStop(0.4, 'rgba(212, 255, 61, 0.3)');
      grad.addColorStop(1, 'rgba(212, 255, 61, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(polaris.x, polaris.y, 22, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(polaris.x, polaris.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Name & Coordinates
      ctx.fillStyle = '#d4ff3d';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(polaris.name, polaris.x + 10, polaris.y - 8);
      ctx.fillStyle = '#8a8a9a';
      ctx.font = '10px monospace';
      ctx.fillText(`Yükseklik = Gözlem Enlemi (${latitudeDeg}° Kuzey)`, polaris.x + 10, polaris.y + 8);
    }
  }, [activeTab, hopProgress, latitudeDeg]);

  // Current selected historical star
  const selectedHistoricalStar =
    HISTORICAL_POLE_STARS.reduce((prev, curr) =>
      Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear) ? curr : prev
    );

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-violet-signal">
            <Compass className="h-4 w-4" /> Göksel Yön Bulma & Eksen Yalpalama Mekaniği
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Kutup yıldızı rehberi <span className="serif-i text-violet-signal">& presesyon çemberi</span>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/70">
            Kuzey Gökkubbesi’nin dönme ekseni sabit değildir. Dünyanın topaç gibi 25.772 yıllık yalpalaması (eksen devinimi) kutup noktasını gökyüzünde bir çember boyunca kaydırır.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-px border border-line bg-line">
          <button
            onClick={() => setActiveTab('precession')}
            className={`px-4 py-2.5 text-xs font-mono transition-colors ${
              activeTab === 'precession'
                ? 'bg-violet-signal text-ink font-bold'
                : 'bg-ink text-paper hover:bg-ink-3'
            }`}
          >
            Presesyon Çemberi (25.772 Yıl)
          </button>
          <button
            onClick={() => setActiveTab('hopping')}
            className={`px-4 py-2.5 text-xs font-mono transition-colors ${
              activeTab === 'hopping'
                ? 'bg-violet-signal text-ink font-bold'
                : 'bg-ink text-paper hover:bg-ink-3'
            }`}
          >
            Yıldız Atlama (Star-Hopping)
          </button>
        </div>
      </div>

      {/* TAB 1: PRECESSION CIRCLE */}
      {activeTab === 'precession' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
          {/* Left Canvas Display (7 cols) */}
          <div className="lg:col-span-7 bg-black p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-muted mb-4 font-mono">
              <span>Tutulma Kutbu Merkezli Eksen Projeksiyonu</span>
              <span className="text-violet-signal">Eğim: 23° 26′</span>
            </div>

            <div className="relative aspect-square w-full max-w-[480px] mx-auto border border-line/40 overflow-hidden bg-ink/50">
              <canvas
                ref={precessionCanvasRef}
                width={500}
                height={500}
                className="w-full h-full"
              />
            </div>

            {/* Slider */}
            <div className="mt-6 space-y-2 border-t border-line pt-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-muted">Zaman Tüneli:</span>
                <span className="text-lime-signal font-bold">
                  {targetYear > 0 ? `M.S. ${targetYear}` : `M.Ö. ${Math.abs(targetYear)}`}
                </span>
              </div>
              <input
                type="range"
                min="-12000"
                max="14000"
                step="250"
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-violet-signal"
              />
              <div className="flex justify-between font-mono text-[10px] text-muted">
                <span>M.Ö. 12.000</span>
                <span>M.Ö. 3000 (Giza)</span>
                <span>2026 (Bugün)</span>
                <span>M.S. 14.000 (Vega)</span>
              </div>
            </div>
          </div>

          {/* Right Information Panel (5 cols) */}
          <div className="lg:col-span-5 bg-ink p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="label text-violet-signal">Seçili Çağın Kutup Yıldızı</span>
              <h4 className="display display-tight mt-2 text-2xl text-paper">
                {selectedHistoricalStar.starName}
              </h4>
              <p className="serif-i text-base text-violet-signal mt-0.5">
                {selectedHistoricalStar.constellation} Takımyıldızı · {selectedHistoricalStar.yearLabel}
              </p>

              <div className="grid grid-cols-2 gap-px border border-line bg-line my-6">
                <div className="bg-ink-2 p-3">
                  <span className="label text-muted block">Gök Kutbuna Uzaklık</span>
                  <span className="font-mono text-sm text-paper">{selectedHistoricalStar.distanceDegFromPole}° yay derecesi</span>
                </div>
                <div className="bg-ink-2 p-3">
                  <span className="label text-muted block">Görünür Parlaklık</span>
                  <span className="font-mono text-sm text-paper">+{selectedHistoricalStar.magnitude} mag</span>
                </div>
              </div>

              <div className="border-l-2 border-violet-signal pl-4 py-1">
                <span className="label text-muted">Tarihsel ve Astronomik Önem</span>
                <p className="mt-1 text-xs leading-relaxed text-paper/85">
                  {selectedHistoricalStar.historicalContext}
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="border-t border-line pt-4">
              <span className="label text-muted block mb-2">Tarihsel Dönüm Noktaları</span>
              <div className="grid grid-cols-2 gap-2">
                {HISTORICAL_POLE_STARS.map((star) => (
                  <button
                    key={star.year}
                    onClick={() => setTargetYear(star.year)}
                    className="p-2 border border-line text-left bg-ink-2 hover:bg-ink-3 transition-colors cursor-pointer"
                  >
                    <div className="font-mono text-[10px] text-violet-signal">
                      {star.year > 0 ? `+${star.year}` : star.year}
                    </div>
                    <div className="font-mono text-xs text-paper truncate">
                      {star.starName.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STAR HOPPING */}
      {activeTab === 'hopping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
          {/* Left Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-black p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-muted mb-4 font-mono">
              <span>Büyük Ayı Cezvesi Üzerinden 5x Vektörleme</span>
              <span className="text-lime-signal">İlerleme: %{hopProgress}</span>
            </div>

            <div className="relative aspect-[4/3] w-full border border-line/40 overflow-hidden bg-ink/50">
              <canvas
                ref={hopCanvasRef}
                width={600}
                height={450}
                className="w-full h-full"
              />
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-4">
              <div className="w-full sm:w-2/3 space-y-1">
                <span className="label text-muted block">5 Kat Uzatma Vektörünü Çiz:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hopProgress}
                  onChange={(e) => setHopProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-lime-signal"
                />
              </div>

              <button
                onClick={() => setHopProgress(100)}
                className="w-full sm:w-auto px-4 py-2 border border-lime-signal text-lime-signal font-mono text-xs hover:bg-lime-signal hover:text-ink transition-colors cursor-pointer"
              >
                Polaris’e Kilitle (100%)
              </button>
            </div>
          </div>

          {/* Right Guide Dossier (5 cols) */}
          <div className="lg:col-span-5 bg-ink p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="label text-lime-signal">Gözlemci Saha Protokolü</span>
              <h4 className="display display-tight mt-2 text-2xl text-paper">
                Gökyüzünde Kuzey Nasıl Bulunur?
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-paper/75">
                Gökyüzünde pusula olmadan kuzey yönünü ve bulunduğunuz coğrafi enlemi bulmanın bin yıllık yöntemidir.
              </p>

              <ol className="mt-6 space-y-3 font-mono text-xs text-paper/85">
                <li className="flex gap-2">
                  <span className="text-lime-signal font-bold">1.</span>
                  <span>Kuzey ufkuna bakın ve 7 parlak yıldızdan oluşan devasa <strong>Büyük Ayı</strong> (Ursa Major) kepçesini bulun.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lime-signal font-bold">2.</span>
                  <span>Kepçenin su içilen dış kenarındaki iki yıldızı bulun: <strong>Merak</strong> ve <strong>Dubhe</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lime-signal font-bold">3.</span>
                  <span>Merak’tan Dubhe’ye doğru zihninizde düz bir ok çekin ve bu mesafeyi <strong>tam 5 katı kadar</strong> ileri uzatın.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-lime-signal font-bold">4.</span>
                  <span>Karşınıza çıkacak orta parlaklıktaki tek yıldız <strong>Polaris</strong>’tir. Küçük Ayı’nın kuyruk ucudur.</span>
                </li>
              </ol>

              {/* Latitude Principle Card */}
              <div className="mt-6 border border-line bg-ink-2 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="label text-muted">Enlem İlkesi</span>
                  <span className="font-mono text-xs text-lime-signal">{latitudeDeg}° Kuzey</span>
                </div>
                <p className="text-xs text-paper/70">
                  Polaris’in ufuk çizgisinden kaç derece yukarıda olduğu, tam olarak bulunduğunuz yerin kuzey enlemine eşittir.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={latitudeDeg}
                    onChange={(e) => setLatitudeDeg(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-ink-3 appearance-none cursor-pointer accent-lime-signal"
                  />
                  <span className="font-mono text-xs text-paper shrink-0">{latitudeDeg}° Ufuk Yüksekliği</span>
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-3 font-mono text-[11px] text-muted">
              💡 <em>İpucu: Eğer Büyük Ayı binaların ardında kalmışsa, karşı taraftaki &quot;W&quot; şeklindeki Kraliçe (Cassiopeia) takımyıldızının kollarından da Polaris’e ulaşabilirsiniz.</em>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
