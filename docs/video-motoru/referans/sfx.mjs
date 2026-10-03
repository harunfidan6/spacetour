// Tanıtım filmi ses efektleri: dosya ve telif yok, hepsi kodla sentezlenir.
// Olay listesi senaryodaki window.__sfx'ten gelir: { t: saniye, type, d?: süre, g?: kazanç, p?: perde }
import { SR, TAU, rng, svf, bus, peak, writeWav } from './dsp.mjs';

// Efektleri stereo tampona sentezler (yankı dahil, normalize edilmemiş). bed: 'fizz' → film boyunca hafif karbonat çıtırtısı
export function synthSfx(events, dur, { bed = 'fizz' } = {}) {
  const b = bus(dur + 1.5), N = b.N, put = b.put;
  const rnd = rng(1907), noise = () => rnd() * 2 - 1;
  const S = {
    pop(t, _d, g = 1, p = 1) { // kapak/gaz patlaması
      const i0 = Math.round(t * SR), n = 0.14 * SR, f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR, fr = (130 + 850 * Math.exp(-x * 38)) * p; ph += (TAU * fr) / SR;
        let v = Math.sin(ph) * Math.exp(-x * 32) * Math.min(1, x * 900) * 0.55;
        if (x < 0.05) v += f(noise(), 4000, 0.8).hp * Math.exp(-x * 90) * 0.3;
        put(i0 + k, v * g, 0, 0.3);
      }
    },
    bubble(t, _d, g = 1) { S.pop(t, 0, g * 0.35, 1.6 + rnd() * 0.8); },
    fizz(t, d = 2, g = 1) { // karbonat fışırtısı
      const i0 = Math.round(t * SR), n = Math.round(d * SR), a = svf(), c = svf();
      for (let k = 0; k < n; k++) {
        const x = k / SR, e = Math.min(1, x * 30) * Math.pow(1 - x / d, 1.6);
        let v = a(noise(), 6500, 1.4).bp * 0.5 + c(noise(), 3000, 1.1).bp * 0.15;
        if (rnd() < 0.004 * (1 - x / d)) v += noise() * 0.7;
        put(i0 + k, v * e * 0.6 * g, Math.sin(x * 3) * 0.3, 0.35);
      }
    },
    clink(t, _d, g = 1, p = 1) { // cam tıkırtısı
      const i0 = Math.round(t * SR), n = 0.7 * SR, fr = [2350, 3540, 5200, 7100].map((f) => f * p), am = [0.12, 0.07, 0.035, 0.015];
      for (let k = 0; k < n; k++) {
        const x = k / SR; let v = 0;
        for (let j = 0; j < 4; j++) v += Math.sin(TAU * fr[j] * x) * am[j] * Math.exp(-x * (7 + j * 4));
        put(i0 + k, v * g * Math.min(1, x * 3000), (p - 1) * 0.8, 0.5);
      }
    },
    rattle(t) { [0, 0.11, 0.2, 0.27, 0.33].forEach((o, j) => S.clink(t + o, 0, 0.9 * (1 - j * 0.15), 0.72 + rnd() * 0.2)); },
    whoosh(t, d = 0.7, g = 1, lo = 300, hi = 2800) { // hava süpürmesi
      const i0 = Math.round(t * SR), n = Math.round(d * SR), f = svf();
      for (let k = 0; k < n; k++) {
        const x = k / n, fr = lo + (hi - lo) * Math.sin(Math.PI * x);
        put(i0 + k, f(noise(), fr, 1.3).bp * Math.pow(Math.sin(Math.PI * x), 1.5) * 0.55 * g, -0.7 + 1.4 * x, 0.3);
      }
    },
    swipe(t, _d, g = 1) { S.whoosh(t, 0.32, 0.5 * g, 900, 4200); },
    thud(t, _d, g = 1) { // ahşap açacağın cama oturması
      const i0 = Math.round(t * SR), n = 0.2 * SR, f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR; ph += (TAU * (55 + 45 * Math.exp(-x * 30))) / SR;
        put(i0 + k, (Math.sin(ph) * 0.7 + f(noise(), 600, 0.9).lp * 0.4 * Math.exp(-x * 60)) * Math.exp(-x * 22) * g, 0, 0.15);
      }
    },
    press(t) { S.thud(t, 0, 0.5); S.clink(t + 0.02, 0, 0.3, 0.6); },
    lift(t) { S.pop(t, 0, 0.3, 1.3); S.whoosh(t, 0.3, 0.3, 1200, 3000); },
    drop(t) { S.thud(t, 0, 0.6); S.clink(t + 0.01, 0, 0.8, 1.1); },
    hit(t, _d, g = 1) { // "Fışşş!" yazısının vuruşu
      const i0 = Math.round(t * SR), n = 1.1 * SR, f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR; ph += (TAU * (32 + 40 * Math.exp(-x * 5))) / SR;
        const crack = x < 0.14 ? f(noise(), 900, 0.8).lp * Math.exp(-x * 30) * 0.5 : 0;
        put(i0 + k, (Math.sin(ph) * Math.exp(-x * 3.2) * 0.8 + crack) * g, 0, 0.5);
      }
    },
    swell(t, d = 5) { // girişte alçak, sıcak bir ton + hafif rüzgâr
      const i0 = Math.round(t * SR), n = Math.round(d * SR), f = svf();
      for (let k = 0; k < n; k++) {
        const x = k / SR, e = Math.min(1, x / 1.8) * Math.min(1, (d - x) / 0.6);
        const v = (Math.sin(TAU * 55 * x) * 0.5 + Math.sin(TAU * 82.5 * x) * 0.3 + Math.sin(TAU * 110 * x) * 0.18) * 0.16
          + f(noise(), 500 + 300 * Math.sin(x * 0.9), 0.7).bp * 0.12;
        put(i0 + k, v * e, Math.sin(x * 0.7) * 0.2, 0.4);
      }
    },
    chime(t) { [[0, 1, 0.9], [0.09, 1.26, 0.7], [0.18, 1.5, 0.6], [0.3, 2, 0.4]].forEach(([o, p, g]) => S.clink(t + o, 0, g, p)); },

    /* ---------- Retro TV ---------- */
    tone(t, d = 0.9, g = 1) { // 1 kHz test sinyali (renk çubuklarının altında)
      const i0 = Math.round(t * SR), n = Math.round(d * SR);
      for (let k = 0; k < n; k++) { const x = k / SR; put(i0 + k, Math.sin(TAU * 1000 * x) * 0.22 * g * Math.min(1, x * 200, (d - x) * 200), 0, 0); }
    },
    static(t, d = 0.18, g = 1) { // kanal değiştirme "kşşt"
      const i0 = Math.round(t * SR), n = Math.round(d * SR), f = svf(), h = svf();
      for (let k = 0; k < n; k++) {
        const x = k / SR, e = Math.min(1, x * 400) * Math.min(1, (d - x) * 60) * (0.75 + 0.25 * Math.sin(TAU * 60 * x));
        let v = f(noise(), 3500, 0.6).bp * 0.9 + h(noise(), 7000, 1).hp * 0.25;
        if (rnd() < 0.01) v += noise() * 1.2;
        put(i0 + k, v * e * 0.5 * g, noise() * 0.2, 0.1);
      }
    },
    tvOn(t, _d, g = 1) { // tüplü televizyon açılışı: tok "tunk" + yükselen ince vınlama + cızırtı
      const i0 = Math.round(t * SR), n = 1.2 * SR, f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR; ph += (TAU * (70 + 50 * Math.exp(-x * 12))) / SR;
        let v = Math.sin(ph) * Math.exp(-x * 7) * 0.7 * Math.min(1, x * 500);
        v += f(noise(), 1800, 0.8).bp * Math.exp(-x * 9) * 0.35;
        v += Math.sin(TAU * (6800 + 900 * Math.min(1, x * 3)) * x) * 0.018 * Math.min(1, x * 4) * Math.exp(-Math.max(0, x - 0.6) * 5);
        put(i0 + k, v * g, 0, 0.2);
      }
    },
    tvOff(t, _d, g = 1) { // kapanış "tzeuu": inen ton + tık
      const i0 = Math.round(t * SR), n = 0.5 * SR, f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR, fr = 90 + 1900 * Math.exp(-x * 9); ph += (TAU * fr) / SR;
        let v = (Math.sin(ph) * 0.6 + Math.sin(ph * 2.01) * 0.15) * Math.exp(-x * 6) * Math.min(1, x * 800);
        if (x < 0.012) v += noise() * 0.6 * (1 - x / 0.012);
        v += f(noise(), 2500, 0.7).bp * 0.12 * Math.exp(-x * 14);
        put(i0 + k, v * g, 0, 0.25);
      }
    },
    kaching(t, _d, g = 1) { // yazar kasa: mekanik "ka" + zil "çiiing"
      const i0 = Math.round(t * SR), f = svf();
      for (let k = 0; k < 0.06 * SR; k++) { const x = k / SR; put(i0 + k, f(noise(), 2200, 1.2).bp * Math.exp(-x * 70) * 0.9 * g, -0.1, 0.15); }
      const j0 = i0 + Math.round(0.07 * SR), fr = [2093, 2637, 4186, 5274], am = [0.2, 0.12, 0.06, 0.03];
      for (let k = 0; k < 1.4 * SR; k++) {
        const x = k / SR; let v = 0;
        for (let j = 0; j < 4; j++) v += Math.sin(TAU * fr[j] * x * (1 + 0.002 * Math.sin(TAU * 7 * x))) * am[j] * Math.exp(-x * (2.6 + j * 1.5));
        put(j0 + k, v * g * Math.min(1, x * 2000), 0.15, 0.45);
      }
    },
  };

  if (bed === 'fizz') { // film boyunca çok hafif bir karbonat çıtırtısı
    const f = svf();
    for (let i = 0; i < (dur - 0.6) * SR; i++) {
      let v = f(noise(), 7000, 2).bp * 0.012;
      if (rnd() < 0.0009) v += noise() * 0.06;
      put(i, v, noise() * 0.5, 0.2);
    }
  }
  for (const e of events) S[e.type]?.(e.t, e.d, e.g ?? 1, e.p ?? 1);
  b.addVerb(0.35);
  return b;
}

// İlk film (kapak patlıyor) için: efektler + sönme + -1 dBFS normalize → WAV
export function renderSfx(events, dur, file) {
  const b = synthSfx(events, dur), n = Math.round(dur * SR), fadeFrom = n - 0.6 * SR;
  for (let i = fadeFrom; i < n; i++) { const k = (n - i) / (n - fadeFrom); b.L[i] *= k; b.R[i] *= k; }
  const g = 0.891 / peak(b.L.subarray(0, n), b.R.subarray(0, n));
  for (let i = 0; i < n; i++) { b.L[i] *= g; b.R[i] *= g; }
  writeWav(file, b.L, b.R, n);
}
