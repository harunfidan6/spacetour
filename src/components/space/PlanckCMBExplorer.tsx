'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Sparkles, Sliders, Info, RotateCw } from 'lucide-react';

export function PlanckCMBExplorer() {
  const [omegaB, setOmegaB] = useState<number>(4.9); // Baryon %
  const [omegaC, setOmegaC] = useState<number>(26.8); // Cold Dark Matter %
  const [omegaL, setOmegaL] = useState<number>(68.3); // Dark Energy %
  const [h0, setH0] = useState<number>(67.4); // Hubble constant km/s/Mpc
  const [activePeak, setActivePeak] = useState<number | null>(null);

  const sphereCanvasRef = useRef<HTMLCanvasElement>(null);
  const powerSpectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef({ yaw: 0, pitch: 0, isDragging: false, lastX: 0, lastY: 0 });

  // Cosmological calculations
  const omegaM = (omegaB + omegaC) / 100;
  const omegaLambda = omegaL / 100;
  const omegaTotal = omegaM + omegaLambda;

  // Geometry
  const geometryType = useMemo(() => {
    if (Math.abs(omegaTotal - 1.0) < 0.02) return 'Düz (Öklid, k = 0)';
    if (omegaTotal > 1.0) return 'Kapalı (Küresel, k = +1)';
    return 'Açık (Hiperbolik, k = -1)';
  }, [omegaTotal]);

  // Universe Age using Friedmann integration: t0 = (1 / H0) * integral[0 to 1] of da / sqrt(omegaM/a + omegaLambda * a^2)
  const universeAgeGyr = useMemo(() => {
    // 1 / H0 in Gyr: 977.8 / H0
    const hubbleTimeGyr = 977.8 / h0;
    const steps = 100;
    let sum = 0;
    for (let i = 1; i <= steps; i++) {
      const a = (i - 0.5) / steps;
      const da = 1 / steps;
      const integrand = a / Math.sqrt(Math.max(0.0001, omegaM * a + omegaLambda * Math.pow(a, 4)));
      sum += integrand * da;
    }
    return (hubbleTimeGyr * sum).toFixed(2);
  }, [h0, omegaM, omegaLambda]);

  // 3D Celestial CMB Sphere Canvas Render
  useEffect(() => {
    const canvas = sphereCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.003;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);

      // Sphere shading base
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      grad.addColorStop(0, '#15152a');
      grad.addColorStop(1, '#05050d');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Procedural CMB Anisotropy Patches (Multi-pole Spherical Harmonics visual approximation)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const numPatches = 360;
      for (let i = 0; i < numPatches; i++) {
        // Spherical coordinates
        const phi = (i * 137.5 * Math.PI) / 180; // golden angle
        const yCoord = 1 - (i / (numPatches - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - yCoord * yCoord);
        const theta = phi + angle + rotRef.current.yaw;

        const sphereX = radiusAtY * Math.cos(theta);
        const sphereY = yCoord;
        const sphereZ = radiusAtY * Math.sin(theta);

        // Only draw front hemisphere
        if (sphereZ > 0) {
          const px = cx + sphereX * r;
          const py = cy + sphereY * r;

          // Temperature fluctuation amplitude deltaT (-200 uK to +200 uK)
          const f1 = Math.sin(sphereX * 7.2 + sphereY * 5.4);
          const f2 = Math.cos(sphereY * 9.1 - sphereZ * 6.3);
          const deltaT = (f1 + f2) * 0.5; // -1 to +1

          // Planck Colormap: blue (-200uK) -> cyan -> white (0uK) -> yellow -> orange -> red (+200uK)
          let col = '#00d4ff';
          if (deltaT < -0.4) col = '#0033aa'; // Deep cold seed
          else if (deltaT < 0.0) col = '#00aaff'; // Cool
          else if (deltaT < 0.3) col = '#ffaa33'; // Warm
          else col = '#ff3311'; // Hot void

          const patchSize = Math.max(2, (8 * sphereZ));
          ctx.fillStyle = col;
          ctx.globalAlpha = Math.max(0.15, sphereZ * 0.7);
          ctx.beginPath();
          ctx.arc(px, py, patchSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Atmospheric limb ring
      ctx.strokeStyle = '#7a5cff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Power Spectrum Canvas Render (C_ell vs ell)
  useEffect(() => {
    const canvas = powerSpectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(239, 236, 230, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 60; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 30);
      ctx.stroke();
    }
    for (let y = 30; y < h - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Axes labels
    ctx.fillStyle = '#8a8a9a';
    ctx.font = '10px monospace';
    ctx.fillText('ℓ = 2', 40, h - 12);
    ctx.fillText('ℓ = 500', 160, h - 12);
    ctx.fillText('ℓ = 1000', 300, h - 12);
    ctx.fillText('ℓ = 1500', 440, h - 12);
    ctx.fillText('Dℓ [μK²]', 10, 20);

    // Theoretical acoustic peaks based on parameters
    // Peak 1 position ell_1 ~ 220 / sqrt(omegaTotal)
    const peak1X = (220 / Math.sqrt(Math.max(0.5, omegaTotal))) * 0.32;
    // Peak 1 amplitude depends on omegaM and H0
    const peak1Height = 5800 * (omegaM / 0.31) * Math.pow(h0 / 67.4, 0.5);

    // Draw C_ell curve
    ctx.strokeStyle = '#7a5cff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const maxEll = 1800;
    for (let ell = 2; ell < maxEll; ell += 4) {
      const x = 40 + (ell / maxEll) * (w - 70);

      // Acoustic oscillations model:
      // Peak 1 (sound horizon) ~ 220, Peak 2 (baryons) ~ 540, Peak 3 (dark matter) ~ 810
      const theta1 = (ell / (220 / Math.sqrt(omegaTotal))) * Math.PI;
      const peak1 = peak1Height * Math.exp(-Math.pow((ell - 220) / 120, 2));
      const peak2 = 2600 * (omegaB / 4.9) * Math.exp(-Math.pow((ell - 540) / 140, 2));
      const peak3 = 2400 * (omegaC / 26.8) * Math.exp(-Math.pow((ell - 810) / 160, 2));
      const silkDamping = Math.exp(-Math.pow(ell / 1300, 1.4));

      const dEll = (1000 + peak1 + peak2 + peak3) * silkDamping;
      const y = h - 35 - (dEll / 6500) * (h - 70);

      if (ell === 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Highlights for the 3 Acoustic Peaks
    const peaks = [
      { ell: 220, label: '1. Tepe (Düz Geometri)', color: '#d4ff3d', desc: 'Evrenin uzaysal eğriliği' },
      { ell: 540, label: '2. Tepe (Baryon Yükü)', color: '#ff5b22', desc: 'Normal madde oranı' },
      { ell: 810, label: '3. Tepe (Soğuk Karanlık Madde)', color: '#7a5cff', desc: 'Karanlık madde kuyuları' },
    ];

    peaks.forEach((p) => {
      const px = 40 + (p.ell / maxEll) * (w - 70);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, h - 35 - (p.ell === 220 ? peak1Height : 2500) / 6500 * (h - 70), 4, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [omegaTotal, omegaM, omegaB, omegaC, h0]);

  return (
    <div className="border border-line bg-ink p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="border border-violet/30 bg-violet/10 px-2 py-0.5 font-mono text-[10px] text-violet font-bold uppercase tracking-wider">
              ESA PLANCK · WMAP · COBE
            </span>
            <span className="label text-muted">Büyük Patlamanın 380.000 Yıl Sonrası</span>
          </div>
          <h3 className="display display-tight mt-2 text-2xl text-paper sm:text-3xl">
            Kozmik Mikrodalga Arka Plan Işıması (CMB) & Evrenin Geometrisi
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-paper/70">
            Son saçılma yüzeyinden (z ≈ 1100) kalan 2.7255 K sıcaklığındaki relikt fotonlar ve 
            akustik salınım tepeleriyle modern kozmolojinin (ΛCDM Modeli) parametrelerini test et.
          </p>
        </div>

        <div className="flex items-center gap-3 border border-line bg-ink-2 px-4 py-2.5 font-mono text-xs">
          <span className="text-muted">Evrenin Yaşı (t₀):</span>
          <span className="text-lime font-bold text-sm">{universeAgeGyr} Milyar Yıl</span>
        </div>
      </div>

      {/* Main Interactive Deck */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left: 3D CMB Sphere */}
        <div className="flex flex-col items-center justify-center border border-line bg-ink-2 p-5 lg:col-span-5">
          <div className="flex w-full items-center justify-between border-b border-line pb-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-paper">
              3D Göksel Sıcaklık Anizotropi Küresi
            </span>
            <span className="font-mono text-[10px] text-violet">ΔT = ±200 μK</span>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <canvas
              ref={sphereCanvasRef}
              width={280}
              height={280}
              className="rounded-full shadow-[0_0_40px_rgba(122,92,255,0.15)]"
            />
          </div>

          <div className="flex w-full items-center justify-between border-t border-line pt-3 font-mono text-[10px] text-muted">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0033aa]" />
              <span>-200μK (Yoğun çekirdek)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff3311]" />
              <span>+200μK (Kozmik boşluk)</span>
            </div>
          </div>
        </div>

        {/* Right: Acoustic Power Spectrum C_ell & Sliders */}
        <div className="space-y-6 lg:col-span-7">
          {/* Angular Power Spectrum Graph */}
          <div className="border border-line bg-ink-2 p-4">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-violet" />
                <span className="font-mono text-xs uppercase tracking-wider text-paper">
                  Açısal Güç Spektrumu (Dℓ = ℓ(ℓ+1)Cℓ / 2π)
                </span>
              </div>
              <span className="font-mono text-[10px] text-lime">Akustik Tepeler</span>
            </div>
            <canvas
              ref={powerSpectrumCanvasRef}
              width={560}
              height={170}
              className="mt-3 w-full h-40 bg-black border border-line"
            />
          </div>

          {/* Parameter Sliders */}
          <div className="border border-line bg-ink-2 p-5">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="label text-violet">Kozmolojik Parametreler (ΛCDM Modeli)</span>
              <span className="font-mono text-xs text-paper">
                Geometri: <strong className="text-lime">{geometryType}</strong>
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Baryon Density */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-paper/70">Baryonik Madde (Ωb):</span>
                  <span className="text-solar font-bold">%{omegaB.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={0.1}
                  value={omegaB}
                  onChange={(e) => setOmegaB(Number(e.target.value))}
                  className="w-full accent-[var(--solar)] cursor-pointer"
                />
              </div>

              {/* Cold Dark Matter Density */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-paper/70">Soğuk Karanlık Madde (Ωc):</span>
                  <span className="text-violet font-bold">%{omegaC.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={0.5}
                  value={omegaC}
                  onChange={(e) => setOmegaC(Number(e.target.value))}
                  className="w-full accent-[var(--violet)] cursor-pointer"
                />
              </div>

              {/* Dark Energy Density */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-paper/70">Karanlık Enerji (ΩΛ):</span>
                  <span className="text-lime font-bold">%{omegaL.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={0.5}
                  value={omegaL}
                  onChange={(e) => setOmegaL(Number(e.target.value))}
                  className="w-full accent-[var(--lime)] cursor-pointer"
                />
              </div>

              {/* Hubble Constant */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-paper/70">Hubble Sabiti (H₀):</span>
                  <span className="text-paper font-bold">{h0.toFixed(1)} km/s/Mpc</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={85}
                  step={0.5}
                  value={h0}
                  onChange={(e) => setH0(Number(e.target.value))}
                  className="w-full accent-[var(--paper)] cursor-pointer"
                />
              </div>
            </div>

            {/* Readout stats */}
            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-line pt-3 font-mono text-[10px] text-muted">
              <span>Toplam Yoğunluk Parametresi: Ω_tot = {omegaTotal.toFixed(3)}</span>
              <span>Rekombinasyon Sıcaklığı: T_rec ≈ 3000 K</span>
              <span>Kızılöteye Kayma: z ≈ 1090</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
