// Vokoder koro: "Ne-şe Ga-zoz-cu-su!" sloganını 80'ler reklam jingle'ı gibi robot koroyla söyletir.
// Modülatör: heceleri tek tek okunmuş bir konuşma kaydı (seslendir.py üretir: video/_ses/<senaryo>/koro.mp3).
// Her hecenin spektral zarfı (26 bant) melodideki notanın süresine yayılır: ünsüzler doğal hızda kalır,
// yalnızca ünlü uzar. Taşıyıcı, armonili (üç ses + bir oktav alt) düz spektrumlu bir "nabız" korosudur.
import { SR, TAU, onePole, decode } from './dsp.mjs';

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const NB = 26, BANDS = Array.from({ length: NB }, (_, i) => 110 * Math.pow(8000 / 110, i / (NB - 1)));
const HOP = Math.round(0.002 * SR);

// RBJ bant geçiren (tepe kazancı 0 dB)
function bp(f, Q = 4.5) {
  const w = (TAU * f) / SR, al = Math.sin(w) / (2 * Q), a0 = 1 + al;
  const b0 = al / a0, b2 = -al / a0, a1 = (-2 * Math.cos(w)) / a0, a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => { const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}

// Heceleri sessizliklerden ayır (10 ms çerçeve, en yüksek seviyenin 38 dB altı; 150 ms'den kısa boşluklar birleşir)
function syllables(x) {
  const F = Math.round(0.01 * SR), n = Math.floor(x.length / F), e = [];
  for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < F; k++) s += x[i * F + k] ** 2; e.push(10 * Math.log10(s / F + 1e-12)); }
  const mx = Math.max(...e), segs = []; let st = -1;
  e.forEach((v, i) => { const on = v > mx - 38; if (on && st < 0) st = i; if (!on && st >= 0) { segs.push([st, i]); st = -1; } });
  if (st >= 0) segs.push([st, n]);
  const out = [];
  for (const s of segs) { const p = out[out.length - 1]; if (p && s[0] - p[1] < 15) p[1] = s[1]; else if (s[1] - s[0] >= 4) out.push(s); }
  return out.map(([a, b]) => [Math.max(0, a * F - 0.02 * SR), Math.min(x.length, b * F + 0.03 * SR)]);
}

// Modülatörün bant zarfları (2 ms çerçeve) + ötümsüzlük oranı (ş, s, z, c gibi hışırtılı sesler)
function analyze(x) {
  const nF = Math.ceil(x.length / HOP), env = BANDS.map(() => new Float32Array(nF)), uv = new Float32Array(nF);
  BANDS.forEach((f, b) => {
    const flt = bp(f), lp = onePole(40);
    for (let i = 0; i < x.length; i++) { const v = lp.lp(Math.abs(flt(x[i]))); if (i % HOP === 0) env[b][i / HOP] = v; }
  });
  const hi = BANDS.findIndex((f) => f > 2800);
  for (let j = 0; j < nF; j++) { let a = 0, h = 0; for (let b = 0; b < NB; b++) { a += env[b][j]; if (b >= hi) h += env[b][j]; } uv[j] = a > 1e-6 ? Math.min(1, Math.max(0, (h / a - 0.25) * 2.2)) : 0; }
  return { env, uv };
}

/**
 * notes: [{ t, d, m: [midi...] }] — her hece için bir nota (sırayla). dur: çıktı süresi (sn).
 * Dönüş: { L, R } ya da hece sayısı tutmazsa null (o zaman müzik enstrümantal kalır).
 */
export function renderChoir(file, notes, dur) {
  const x = decode(file), segs = syllables(x);
  if (segs.length !== 6) { console.log(`  koro: ${segs.length} hece bulundu (6 bekleniyordu), koro atlandı`); return null; }
  const { env, uv } = analyze(x), N = Math.ceil(dur * SR), mono = new Float32Array(N);
  let seed = 5; const noise = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2147483648 - 1);

  notes.forEach((n, k) => {
    const [s0, s1] = segs[k % 6], sLen = s1 - s0, i0 = Math.round(n.t * SR), len = Math.round(n.d * SR * 0.94), rel = Math.round(0.07 * SR);
    // Zaman bükme: baş ünsüz ve son ses doğal hızda, aradaki ünlü notayı dolduracak kadar uzar/kısalır
    const on = Math.min(0.08 * SR, sLen * 0.3), co = Math.min(0.07 * SR, sLen * 0.25), mid = sLen - on - co;
    const src = (j) => {
      if (len <= on + co) return s0 + (j / len) * sLen;
      if (j < on) return s0 + j;
      if (j < len - co) return s0 + on + ((j - on) / (len - on - co)) * mid;
      return Math.min(s1 - 1, s0 + on + mid + (j - (len - co)));
    };
    // Taşıyıcı: her ses için eşit genlikli harmonikler (düz spektrum), ±7 sent iki kopya, gecikmeli vibrato
    const voices = [...n.m.map((m) => [mtof(m), 1]), [mtof(n.m[n.m.length - 1] - 12), 0.6]];
    const osc = voices.flatMap(([f, g]) => [0.996, 1.004].map((dt) => ({ f: f * dt, g, ph: (noise() + 1) / 2, nh: Math.max(1, Math.floor(7800 / (f * dt))) })));
    const cf = BANDS.map((f) => bp(f)), total = len + rel;
    for (let j = 0; j < total && i0 + j < N; j++) {
      const t = j / SR, vib = 1 + 0.0035 * Math.sin(TAU * 5.3 * t) * Math.min(1, Math.max(0, (t - 0.12) * 4));
      let c = 0;
      for (const o of osc) {
        o.ph += (o.f * vib) / SR; o.ph -= Math.floor(o.ph);
        const th = TAU * o.ph; let s = 0;
        for (let h = 1; h <= o.nh; h++) s += Math.cos(h * th);
        c += (s / o.nh) * o.g;
      }
      const fr = Math.min(env[0].length - 1, src(Math.min(j, len - 1)) / HOP), f0 = Math.floor(fr), a = fr - f0, f1 = Math.min(f0 + 1, env[0].length - 1);
      const u = uv[f0] * (1 - a) + uv[f1] * a;
      const car = c * (1 - u * 0.85) + noise() * u * 2.2;
      let y = 0;
      for (let b = 0; b < NB; b++) y += cf[b](car) * (env[b][f0] * (1 - a) + env[b][f1] * a);
      const g = j < len ? Math.min(1, j / (0.012 * SR)) : Math.exp(-(j - len) / (0.03 * SR));
      mono[i0 + j] += y * g;
    }
  });

  // Koro genişliği: iki ayrı modüle gecikme (chorus), sonra normalize
  const L = new Float32Array(N), R = new Float32Array(N), D = 4096, ring = new Float32Array(D);
  let pk = 1e-9;
  for (let i = 0; i < N; i++) {
    ring[i % D] = mono[i];
    const tap = (base, ph) => { const p = i - (base + 0.003 * Math.sin(TAU * 0.9 * (i / SR) + ph)) * SR, i1 = Math.floor(p), fr = p - i1; return i1 < 1 ? 0 : ring[i1 % D] * (1 - fr) + ring[(i1 + 1) % D] * fr; };
    L[i] = mono[i] * 0.7 + tap(0.014, 0) * 0.5; R[i] = mono[i] * 0.7 + tap(0.019, 1.7) * 0.5;
    pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  }
  for (let i = 0; i < N; i++) { L[i] /= pk; R[i] /= pk; }
  return { L, R };
}
