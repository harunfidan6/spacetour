'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useInView } from '@/lib/useInView';

export function PlanckCMBExplorer() {
  const [omegaB, setOmegaB] = useState<number>(4.9); // Baryon %
  const [omegaC, setOmegaC] = useState<number>(26.8); // Cold Dark Matter %
  const [omegaL, setOmegaL] = useState<number>(68.3); // Dark Energy %
  const [h0, setH0] = useState<number>(67.4); // Hubble constant km/s/Mpc

  const sphereCanvasRef = useRef<HTMLCanvasElement>(null);
  const sphereVisible = useInView(sphereCanvasRef);
  const powerSpectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef({ yaw: 0, pitch: 0, isDragging: false, lastX: 0, lastY: 0 });

  // Cosmological calculations
  const omegaM = (omegaB + omegaC) / 100;
  const omegaLambda = omegaL / 100;
  const omegaTotal = omegaM + omegaLambda;
  const omegaK = 1 - omegaTotal; // curvature density

  // Geometry
  const geometryType = useMemo(() => {
    if (Math.abs(omegaTotal - 1.0) < 0.02) return 'Düz (Öklid, k = 0)';
    if (omegaTotal > 1.0) return 'Kapalı (Küresel, k = +1)';
    return 'Açık (Hiperbolik, k = -1)';
  }, [omegaTotal]);

  // Universe Age using Friedmann integration: t0 = (1 / H0) * integral[0 to 1] of da / sqrt(omegaM/a + omegaK + omegaLambda * a^2)
  const universeAgeGyr = useMemo(() => {
    // 1 / H0 in Gyr: 977.8 / H0
    const hubbleTimeGyr = 977.8 / h0;
    const steps = 100;
    let sum = 0;
    for (let i = 1; i <= steps; i++) {
      const a = (i - 0.5) / steps;
      const da = 1 / steps;
      const integrand = a / Math.sqrt(Math.max(0.0001, omegaM * a + omegaK * a * a + omegaLambda * Math.pow(a, 4)));
      sum += integrand * da;
    }
    return (hubbleTimeGyr * sum).toFixed(2);
  }, [h0, omegaM, omegaLambda, omegaK]);

  // 3D Celestial CMB Sphere Canvas Render
  useEffect(() => {
    const canvas = sphereCanvasRef.current;
    if (!canvas || !sphereVisible) return;
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
  }, [sphereVisible]);

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

    // Theoretical acoustic peaks based on parameters.
    // Curvature shifts the whole acoustic scale: ell_n ~ ell_n(flat) / sqrt(omegaTotal)
    const acousticScale = 1 / Math.sqrt(Math.max(0.5, omegaTotal));
    const ell1 = 220 * acousticScale;
    const ell2 = 540 * acousticScale;
    const ell3 = 810 * acousticScale;
    // Peak 1 amplitude depends on omegaM and H0
    const peak1Height = 5800 * (omegaM / 0.31) * Math.pow(h0 / 67.4, 0.5);

    const maxEll = 1800;
    const toX = (ell: number) => 40 + (ell / maxEll) * (w - 70);
    const toY = (dEll: number) => h - 35 - (dEll / 6500) * (h - 70);

    // Acoustic oscillations model:
    // Peak 1 (sound horizon) ~ 220, Peak 2 (baryons) ~ 540, Peak 3 (dark matter) ~ 810
    const spectrum = (ell: number) => {
      const peak1 = peak1Height * Math.exp(-Math.pow((ell - ell1) / 120, 2));
      const peak2 = 2600 * (omegaB / 4.9) * Math.exp(-Math.pow((ell - ell2) / 140, 2));
      const peak3 = 2400 * (omegaC / 26.8) * Math.exp(-Math.pow((ell - ell3) / 160, 2));
      const silkDamping = Math.exp(-Math.pow(ell / 1300, 1.4));
      return (1000 + peak1 + peak2 + peak3) * silkDamping;
    };

    // Draw C_ell curve
    ctx.strokeStyle = '#7a5cff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let ell = 2; ell < maxEll; ell += 4) {
      const x = toX(ell);
      const y = toY(spectrum(ell));
      if (ell === 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Highlights for the 3 Acoustic Peaks, placed on the curve
    const peaks = [
      { ell: ell1, color: '#d4ff3d' },
      { ell: ell2, color: '#ff5b22' },
      { ell: ell3, color: '#7a5cff' },
    ];

    peaks.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(toX(p.ell), toY(spectrum(p.ell)), 4, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [omegaTotal, omegaM, omegaB, omegaC, h0]);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8">
      {/* Başlık */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
            Kozmik mikrodalga arka plan ışıması (CMB) ve evrenin geometrisi
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">
            ESA Planck · WMAP · COBE · Büyük Patlamanın 380.000 yıl sonrası
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
            Son saçılma yüzeyinden (z ≈ 1100) kalan 2.7255 K sıcaklığındaki relikt fotonlar ve
            akustik salınım tepeleriyle modern kozmolojinin (ΛCDM Modeli) parametrelerini test et.
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <div className="text-sm text-paper/70">Evrenin yaşı (t₀)</div>
          <div className="mt-0.5 font-mono text-xl font-semibold tabular-nums text-lime">
            {universeAgeGyr} milyar yıl
          </div>
        </div>
      </div>

      {/* Etkileşimli alan */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Sol: CMB küresi */}
        <div className="flex flex-col items-center border border-line bg-ink-2 p-4 sm:p-5 lg:col-span-5">
          <div className="flex w-full flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-sm font-medium text-paper">
              3D göksel sıcaklık anizotropi küresi
            </span>
            <span className="font-mono text-xs text-paper/70">ΔT = ±200 μK</span>
          </div>

          <div className="my-4 flex w-full items-center justify-center">
            <canvas
              ref={sphereCanvasRef}
              width={280}
              height={280}
              className="h-auto max-w-full rounded-full"
            />
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs text-paper/70">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0033aa]" />
              <span>
                <span className="font-mono">-200μK</span> (Yoğun çekirdek)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff3311]" />
              <span>
                <span className="font-mono">+200μK</span> (Kozmik boşluk)
              </span>
            </div>
          </div>
        </div>

        {/* Sağ: açısal güç spektrumu ve parametreler */}
        <div className="min-w-0 space-y-6 lg:col-span-7">
          {/* Açısal güç spektrumu */}
          <div className="border border-line bg-ink-2 p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-paper">
                Açısal güç spektrumu{' '}
                <span className="font-mono text-xs font-normal text-paper/70">(Dℓ = ℓ(ℓ+1)Cℓ / 2π)</span>
              </span>
              <span className="text-xs text-paper/70">Akustik tepeler</span>
            </div>
            <canvas
              ref={powerSpectrumCanvasRef}
              width={560}
              height={170}
              className="mt-3 w-full h-40 bg-black"
            />
          </div>

          {/* Parametre sürgüleri */}
          <div className="border border-line bg-ink-2 p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm font-medium text-paper">Kozmolojik parametreler (ΛCDM modeli)</span>
              <span className="text-sm text-paper/70">
                Geometri: <strong className="font-medium text-lime">{geometryType}</strong>
              </span>
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {/* Baryon Density */}
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper/80">Baryonik madde (Ωb)</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-solar">%{omegaB.toFixed(1)}</span>
                </div>
                <input aria-label="Baryonik madde oranı"
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
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper/80">Soğuk karanlık madde (Ωc)</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-violet">%{omegaC.toFixed(1)}</span>
                </div>
                <input aria-label="Soğuk karanlık madde oranı"
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
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper/80">Karanlık enerji (ΩΛ)</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-lime">%{omegaL.toFixed(1)}</span>
                </div>
                <input aria-label="Karanlık enerji oranı"
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
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper/80">Hubble sabiti (H₀)</span>
                  <span className="whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-paper">{h0.toFixed(1)} km/s/Mpc</span>
                </div>
                <input aria-label="Hubble sabiti"
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
            <dl className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-xs text-paper/70">Toplam yoğunluk parametresi</dt>
                <dd className="mt-0.5 font-mono text-sm tabular-nums text-paper">Ω_tot = {omegaTotal.toFixed(3)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-paper/70">Rekombinasyon sıcaklığı</dt>
                <dd className="mt-0.5 font-mono text-sm text-paper">T_rec ≈ 3000 K</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-paper/70">Kızılöteye kayma</dt>
                <dd className="mt-0.5 font-mono text-sm text-paper">z ≈ 1090</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
