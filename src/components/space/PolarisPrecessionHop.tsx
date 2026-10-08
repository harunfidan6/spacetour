'use client';

import React, { useState, useRef, useEffect } from 'react';

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
    <div className="space-y-8 border border-line bg-ink p-4 sm:p-8">
      {/* Başlık ve kip seçici */}
      <div className="flex flex-col justify-between gap-6 border-b border-line pb-6 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Kutup yıldızı rehberi ve presesyon çemberi
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
            Kuzey Gökkubbesi’nin dönme ekseni sabit değildir. Dünyanın topaç gibi 25.772 yıllık yalpalaması (eksen devinimi) kutup noktasını gökyüzünde bir çember boyunca kaydırır.
          </p>
        </div>

        {/* Kip seçici */}
        <div className="grid shrink-0 grid-cols-2 gap-px border border-line bg-line">
          <button
            type="button"
            aria-pressed={activeTab === 'precession'}
            onClick={() => setActiveTab('precession')}
            className={`min-h-10 px-4 py-2 text-sm leading-snug transition-colors cursor-pointer ${
              activeTab === 'precession'
                ? 'bg-violet text-ink font-semibold'
                : 'bg-ink text-paper/85 hover:bg-ink-3'
            }`}
          >
            Presesyon çemberi (25.772 yıl)
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'hopping'}
            onClick={() => setActiveTab('hopping')}
            className={`min-h-10 px-4 py-2 text-sm leading-snug transition-colors cursor-pointer ${
              activeTab === 'hopping'
                ? 'bg-violet text-ink font-semibold'
                : 'bg-ink text-paper/85 hover:bg-ink-3'
            }`}
          >
            Yıldız atlama (star-hopping)
          </button>
        </div>
      </div>

      {/* Presesyon çemberi */}
      {activeTab === 'precession' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
          {/* Çizim alanı */}
          <div className="lg:col-span-7 flex min-w-0 flex-col justify-between bg-black p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="text-paper/70">Tutulma kutbu merkezli eksen projeksiyonu</span>
              <span className="text-paper/70">
                Eğim: <span className="font-mono tabular-nums text-violet">23° 26′</span>
              </span>
            </div>

            <div className="relative aspect-square w-full max-w-[480px] mx-auto overflow-hidden bg-ink/50">
              <canvas
                ref={precessionCanvasRef}
                width={500}
                height={500}
                className="w-full h-full"
              />
            </div>

            {/* Zaman kaydırıcısı */}
            <div className="mt-6 space-y-2 border-t border-line pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm text-paper/70">Zaman tüneli</span>
                <span className="font-mono text-sm font-semibold tabular-nums text-lime-signal">
                  {targetYear > 0 ? `M.S. ${targetYear}` : `M.Ö. ${Math.abs(targetYear)}`}
                </span>
              </div>
              <input aria-label="Presesyon yılı"
                type="range"
                min="-12000"
                max="14000"
                step="250"
                value={targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-violet"
              />
              <div className="flex justify-between gap-2 font-mono text-[11px] leading-snug text-paper/70 sm:text-xs">
                <span>M.Ö. 12.000</span>
                <span className="text-center">M.Ö. 3000 (Giza)</span>
                <span className="text-center">2026 (Bugün)</span>
                <span className="text-right">M.S. 14.000 (Vega)</span>
              </div>
            </div>
          </div>

          {/* Seçili çağın bilgisi */}
          <div className="lg:col-span-5 flex min-w-0 flex-col justify-between gap-6 bg-ink p-4 sm:p-6">
            <div>
              <span className="text-sm text-paper/70">Seçili çağın kutup yıldızı</span>
              <h4 className="mt-1 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                {selectedHistoricalStar.starName}
              </h4>
              <p className="mt-1 text-sm text-violet">
                {selectedHistoricalStar.constellation} takımyıldızı · {selectedHistoricalStar.yearLabel}
              </p>

              <div className="my-6 grid grid-cols-2 gap-4 border-y border-line py-4">
                <div className="min-w-0">
                  <span className="block text-sm text-paper/70">Gök kutbuna uzaklık</span>
                  <span className="mt-0.5 block font-mono text-base tabular-nums text-paper">{selectedHistoricalStar.distanceDegFromPole}° yay derecesi</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-sm text-paper/70">Görünür parlaklık</span>
                  <span className="mt-0.5 block font-mono text-base tabular-nums text-paper">+{selectedHistoricalStar.magnitude} mag</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-violet">Tarihsel ve astronomik önem</span>
                <p className="mt-2 text-base leading-relaxed text-paper/85">
                  {selectedHistoricalStar.historicalContext}
                </p>
              </div>
            </div>

            {/* Hızlı seçim */}
            <div className="border-t border-line pt-4">
              <span className="mb-2 block text-sm text-paper/70">Tarihsel dönüm noktaları</span>
              <div className="grid grid-cols-2 gap-2">
                {HISTORICAL_POLE_STARS.map((star) => (
                  <button
                    key={star.year}
                    type="button"
                    onClick={() => setTargetYear(star.year)}
                    className="min-h-11 min-w-0 border border-line bg-ink-2 px-3 py-2 text-left transition-colors hover:bg-ink-3 cursor-pointer"
                  >
                    <div className="font-mono text-xs tabular-nums text-violet">
                      {star.year > 0 ? `+${star.year}` : star.year}
                    </div>
                    <div className="truncate text-sm text-paper">
                      {star.starName.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yıldız atlama */}
      {activeTab === 'hopping' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
          {/* Çizim alanı */}
          <div className="lg:col-span-7 flex min-w-0 flex-col justify-between bg-black p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="text-paper/70">Büyük Ayı kepçesinden 5 kat uzatma</span>
              <span className="text-paper/70">
                İlerleme: <span className="font-mono tabular-nums text-lime-signal">%{hopProgress}</span>
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/50">
              <canvas
                ref={hopCanvasRef}
                width={600}
                height={450}
                className="w-full h-full"
              />
            </div>

            {/* Kontroller */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-4">
              <div className="w-full sm:w-2/3 space-y-2">
                <span className="block text-sm text-paper/70">5 kat uzatma vektörünü çiz</span>
                <input aria-label="İşaretçi yıldız uzatma ilerlemesi"
                  type="range"
                  min="0"
                  max="100"
                  value={hopProgress}
                  onChange={(e) => setHopProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-lime-signal"
                />
              </div>

              <button
                type="button"
                onClick={() => setHopProgress(100)}
                className="min-h-10 w-full sm:w-auto shrink-0 border border-lime-signal px-4 py-2 text-sm text-lime-signal transition-colors hover:bg-lime-signal hover:text-ink cursor-pointer"
              >
                Polaris’e kilitle (%100)
              </button>
            </div>
          </div>

          {/* Saha rehberi */}
          <div className="lg:col-span-5 flex min-w-0 flex-col justify-between gap-6 bg-ink p-4 sm:p-6">
            <div>
              <h4 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                Gökyüzünde kuzey nasıl bulunur?
              </h4>
              <p className="mt-3 text-base leading-relaxed text-paper/85">
                Gökyüzünde pusula olmadan kuzey yönünü ve bulunduğunuz coğrafi enlemi bulmanın bin yıllık yöntemidir.
              </p>

              <ol className="mt-6 space-y-3 text-sm leading-relaxed text-paper/85">
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono font-semibold text-lime-signal">1.</span>
                  <span>Kuzey ufkuna bakın ve 7 parlak yıldızdan oluşan devasa <strong>Büyük Ayı</strong> (Ursa Major) kepçesini bulun.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono font-semibold text-lime-signal">2.</span>
                  <span>Kepçenin su içilen dış kenarındaki iki yıldızı bulun: <strong>Merak</strong> ve <strong>Dubhe</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono font-semibold text-lime-signal">3.</span>
                  <span>Merak’tan Dubhe’ye doğru zihninizde düz bir ok çekin ve bu mesafeyi <strong>tam 5 katı kadar</strong> ileri uzatın.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-mono font-semibold text-lime-signal">4.</span>
                  <span>Karşınıza çıkacak orta parlaklıktaki tek yıldız <strong>Polaris</strong>’tir. Küçük Ayı’nın kuyruk ucudur.</span>
                </li>
              </ol>

              {/* Enlem ilkesi */}
              <div className="mt-6 space-y-3 border-t border-line pt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-sm font-medium text-paper/85">Enlem ilkesi</span>
                  <span className="text-sm text-lime-signal"><span className="font-mono tabular-nums">{latitudeDeg}°</span> kuzey</span>
                </div>
                <p className="text-sm leading-relaxed text-paper/80">
                  Polaris’in ufuk çizgisinden kaç derece yukarıda olduğu, tam olarak bulunduğunuz yerin kuzey enlemine eşittir.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <input aria-label="Gözlemci enlemi"
                    type="range"
                    min="10"
                    max="80"
                    value={latitudeDeg}
                    onChange={(e) => setLatitudeDeg(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-ink-3 appearance-none cursor-pointer accent-lime-signal"
                  />
                  <span className="shrink-0 text-sm text-paper/80">
                    <span className="font-mono tabular-nums text-paper">{latitudeDeg}°</span> ufuk yüksekliği
                  </span>
                </div>
              </div>
            </div>

            <p className="border-t border-line pt-4 text-sm leading-relaxed text-paper/80">
              <span className="font-medium text-solar">İpucu:</span>{' '}
              Eğer Büyük Ayı binaların ardında kalmışsa, karşı taraftaki &quot;W&quot; şeklindeki Kraliçe (Cassiopeia) takımyıldızının kollarından da Polaris’e ulaşabilirsiniz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
