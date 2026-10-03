// SpaceTour TR tanıtım filmi müziği: belgesel / sinematik "merak" teması. 120 BPM (vuruş 0.5 sn), Re majör.
// Tamamı kodla sentezlenir, telifsiz. Bölümler senaryonun kesim saniyelerine (window.__filmMeta.cuts) oturur:
//   0–3   giriş: Re uğultusu, yavaş açılan pad, ekolu çan motifi (F#–A–E–D), ters zil
//   3     VURUŞ (Güneş doğar) → Dmaj9 · Bm9, FM ostinato, kalp atışı
//   7     parlama → Gmaj7#11 · Em9, karşı melodi çanlarda, taiko
//   11    Bm9 · Gmaj7#11, yaylılarda ana tema (F#–A–B–A–F#–E), ritim yoğunlaşır
//   15    KARA DELİK: alt bas düşüşü, Em9 → Cmaj7; ostinato "zaman genleşmesi" gibi yavaşlar ve pesleşir
//   19    VURUŞ → doruk: D/F# · G, tema bir oktav yukarıda (D–E–F#–G–F#–E), tam ritim
//   23    canlı: Asus4 → A, nabız gibi tomlar, trampet rulosu ve ters zil
//   26    SON VURUŞ: Dmaj9 tüm orkestra; piyanoda F#–E–D, 30'a dek söner
// Sesler: FM pluck/çan/elektrik piyano, testere dişi pad/yaylı/üflemeli, "braam", alt bas, taiko, davul sentezi,
// chorus, noktalı sekizlik ping-pong eko, büyük salon yankısı.
import { SR, TAU, rng, svf, onePole, blep, bus, peak } from './dsp.mjs';

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Akorlar: b = bas (MIDI), v = pad/yaylı dizilişi, a = ostinato arpeji (8 adım)
const CH = {
  D: { b: 38, v: [50, 57, 61, 64, 66], a: [62, 69, 74, 76, 69, 74, 78, 74] },
  Bm: { b: 35, v: [47, 54, 57, 61, 62], a: [59, 66, 71, 73, 66, 71, 74, 71] },
  G: { b: 31, v: [50, 54, 59, 61, 67], a: [55, 62, 67, 69, 62, 67, 73, 67] },
  Em: { b: 40, v: [52, 55, 59, 62, 66], a: [52, 59, 64, 66, 59, 64, 67, 64] },
  C: { b: 36, v: [48, 55, 59, 64], a: [48, 55, 60, 64, 55, 60, 64, 60] },
  DF: { b: 42, v: [50, 57, 62, 66, 69], a: [62, 69, 74, 76, 69, 74, 78, 74] },
  Gs: { b: 43, v: [50, 55, 59, 62, 67], a: [55, 62, 67, 71, 62, 67, 74, 67] },
  As: { b: 33, v: [50, 52, 57, 62, 64], a: [57, 62, 64, 69, 62, 64, 69, 64] },
  A: { b: 33, v: [49, 52, 57, 61, 64], a: [57, 61, 64, 69, 61, 64, 69, 64] },
};

export function renderMusic(dur, meta = {}) {
  const [C1, C2, C3, C4, C5, C6, C7] = meta.cuts || [3, 7, 11, 15, 19, 23, 26];
  const mb = bus(dur + 1), N = mb.N, put = mb.put;
  const cb = bus(dur + 1); // chorus: pad, yaylı, üflemeli, piyano
  const db = bus(dur + 1); // eko: pluck, çan
  const rnd = rng(2026), noise = () => rnd() * 2 - 1;
  const at = (t) => Math.round(t * SR);

  /* ---------- Vurmalılar ---------- */
  const kick = (t, g = 1) => { let ph = 0; const i0 = at(t);
    for (let k = 0; k < 0.45 * SR; k++) { const x = k / SR; ph += (TAU * (44 + 100 * Math.exp(-x * 38))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 7) + (x < 0.003 ? noise() * 0.4 : 0)) * 0.8 * g, 0, 0.06); } };
  const taiko = (t, g = 1, f0 = 64, pan = 0) => { let ph = 0; const i0 = at(t), f = svf();
    for (let k = 0; k < 0.9 * SR; k++) { const x = k / SR; ph += (TAU * f0 * (1 + 1.3 * Math.exp(-x * 28))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 5.5) * 0.8 + f(noise(), 420, 0.7).lp * Math.exp(-x * 30) * 0.7) * g, pan, 0.4); } };
  const tom = (t, f0, g = 1) => taiko(t, g * 0.6, f0, (f0 - 140) / 200);
  const fill = (t) => [[0, 210], [0.125, 175], [0.25, 140], [0.375, 112]].forEach(([o, f]) => tom(t + o, f, 0.9));
  const shaker = (t, g = 1) => { const i0 = at(t), f = svf();
    for (let k = 0; k < 0.07 * SR; k++) { const x = k / SR, e = Math.min(1, x * 300) * Math.exp(-x * 55); put(i0 + k, f(noise(), 6000, 1.3).bp * e * 0.12 * g, 0.35, 0.2); } };
  const snare = (t, g = 1) => { const i0 = at(t), f = svf(); let ph = 0;
    for (let k = 0; k < 0.18 * SR; k++) { const x = k / SR; ph += (TAU * 190) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 35) * 0.4 + f(noise(), 2800, 0.6).bp * Math.exp(-x * 24)) * 0.4 * g, -0.1, 0.35); } };
  const roll = (t0, d, g = 1) => { for (let t = 0; t < d; ) { const p = t / d; snare(t0 + t, g * (0.15 + 0.85 * p * p)); t += 0.125 - 0.07 * p; } };
  const crash = (t, g = 1) => { const i0 = at(t), fl = svf(), fr = svf();
    for (let k = 0; k < 3.2 * SR && i0 + k < N; k++) { const x = k / SR, e = Math.exp(-x * 1.6) * Math.min(1, x * 300) * 0.16 * g;
      const l = fl(noise(), 6000, 0.6).bp, r = fr(noise(), 6000, 0.6).bp;
      mb.L[i0 + k] += l * e; mb.R[i0 + k] += r * e; mb.V[i0 + k] += (l + r) * e * 0.3; } };
  const revcym = (tEnd, d, g = 1) => { const i0 = at(tEnd - d), n = Math.round(d * SR), fl = svf(), fr = svf();
    for (let k = 0; k < n; k++) { const p = k / n, e = Math.pow(p, 3) * 0.3 * g;
      mb.L[i0 + k] += fl(noise(), 2500 + 5000 * p, 0.9).bp * e; mb.R[i0 + k] += fr(noise(), 2500 + 5000 * p, 0.9).bp * e; mb.V[i0 + k] += e * 0.1; } };
  const riser = (t, d, g = 1) => { const i0 = at(t), f = svf(); let ph = 0;
    for (let k = 0; k < d * SR; k++) { const x = k / SR, p = x / d; ph += (TAU * (110 + 660 * p * p)) / SR;
      put(i0 + k, (f(noise(), 250 + 6000 * p * p, 2.2).bp * 0.45 + Math.sin(ph) * 0.05) * p * p * 0.5 * g, Math.sin(p * 7) * 0.35, 0.45); } };
  const boom = (t, g = 1) => { let ph = 0; const i0 = at(t), f = svf();
    for (let k = 0; k < 3.0 * SR; k++) { const x = k / SR; ph += (TAU * (36 + 54 * Math.exp(-x * 4))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 1.6) + f(noise(), 300, 0.7).lp * Math.exp(-x * 14) * 0.6) * 0.55 * g, 0, 0.45); } };

  /* ---------- Synth sesleri ---------- */
  const sawStack = (ph, f, dets) => { let s = 0; for (let j = 0; j < dets.length; j++) { const dt = (f * dets[j]) / SR; ph[j] += dt; ph[j] -= Math.floor(ph[j]); s += 2 * ph[j] - 1 - blep(ph[j], dt); } return s / dets.length; };
  // Pad: yavaş açılan, nefes alan testere dişi katmanı
  const pad = (t, notes, d, g = 1, cut = 1100, att = 1.2, rel = 1.6) => notes.forEach((m, i) => {
    const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.993, 1, 1.007], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + rel) * SR; k++) { const x = k / SR;
      const env = Math.min(1, x / att) * (x > d ? Math.exp(-(x - d) * (3 / rel)) : 1);
      const fc = cut * (0.8 + 0.25 * Math.sin(TAU * 0.13 * x + i));
      cb.put(i0 + k, flt(sawStack(ph, f, dets), fc, 0.7).lp * env * 0.015 * g, -0.45 + i * (0.9 / Math.max(1, notes.length - 1)), 0.6); } });
  const strings = (t, notes, d, g = 1, att = 0.4) => notes.forEach((m, i) => {
    const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.995, 1, 1.005], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 0.8) * SR; k++) { const x = k / SR, vib = 1 + 0.003 * Math.sin(TAU * 5 * x) * Math.min(1, x);
      const env = Math.min(1, x / att) * (x > d ? Math.exp(-(x - d) * 4) : 1);
      cb.put(i0 + k, flt(sawStack(ph, f * vib, dets), 2600, 0.7).lp * env * 0.02 * g, -0.4 + i * 0.2, 0.55); } });
  // Tema: yaylı solo (vibratolu, iki kat)
  const lead = (t, m, d, g = 1) => { const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.997, 1.003], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 0.5) * SR; k++) { const x = k / SR, vib = 1 + 0.005 * Math.sin(TAU * 5.4 * x) * Math.min(1, Math.max(0, (x - 0.2) * 3));
      const env = Math.min(1, x / 0.12) * (x > d ? Math.exp(-(x - d) * 7) : 1);
      cb.put(i0 + k, flt(sawStack(ph, f * vib, dets), 3200, 0.8).lp * env * 0.09 * g, 0.05, 0.55); } };
  const playTheme = (t0, mel, g = 1, dbl = 0) => mel.forEach(([o, m, d]) => { lead(t0 + o, m, d * 0.95, g); if (dbl) brass(t0 + o, [m - 12], d * 0.9, dbl); });
  const brass = (t, notes, d, g = 1) => notes.forEach((m, i) => {
    const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.996, 1, 1.004], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 0.4) * SR; k++) { const x = k / SR;
      const envF = x < 0.08 ? x / 0.08 : 0.5 + 0.5 * Math.exp(-(x - 0.08) * 3);
      const env = Math.min(1, x / 0.06) * (x > d ? Math.exp(-(x - d) * 9) : 1);
      cb.put(i0 + k, flt(sawStack(ph, f, dets), f * (1.4 + 4.5 * envF), 0.8).lp * env * 0.06 * g, -0.2 + i * 0.12, 0.5); } });
  // "Braam": geniş, doygun alçak üflemeli vuruşu
  const braam = (t, notes, d, g = 1) => notes.forEach((m, i) => {
    const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.99, 0.997, 1.003, 1.01], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 1.5) * SR; k++) { const x = k / SR;
      const fc = 160 + 2600 * Math.exp(-x * 2.2) * Math.min(1, x / 0.1);
      const env = Math.min(1, x / 0.03) * (x > d ? Math.exp(-(x - d) * 2.2) : 1) * (0.7 + 0.3 * Math.exp(-x * 2));
      put(i0 + k, Math.tanh(flt(sawStack(ph, f, dets), fc, 0.9).lp * 2.2) * env * 0.16 * g, -0.2 + i * 0.2, 0.55); } });
  // FM pluck (ostinato); pf: perde çarpanı (kara delikte pesleşir)
  const pluck = (t, m, g = 1, pan = 0, pf = 1, d = 0.5) => { const f = mtof(m) * pf, i0 = at(t); let pc = 0, pm = 0;
    for (let k = 0; k < d * SR; k++) { const x = k / SR; pc += (TAU * f) / SR; pm += (TAU * f * 2) / SR;
      const I = 2.6 * Math.exp(-x * 16) + 0.25;
      db.put(i0 + k, Math.sin(pc + I * Math.sin(pm)) * Math.exp(-x * 6.5) * Math.min(1, x * 1500) * 0.1 * g, pan, 0.35); } };
  const bell = (t, m, g = 1, pan = 0.3) => { const f = mtof(m), i0 = at(t);
    for (let k = 0; k < 2.4 * SR; k++) { const x = k / SR;
      db.put(i0 + k, Math.sin(TAU * f * x + 2.0 * Math.exp(-x * 3) * Math.sin(TAU * f * 3.5 * x)) * Math.exp(-x * 1.9) * Math.min(1, x * 1500) * 0.075 * g, pan, 0.6); } };
  const piano = (t, m, d, g = 1, pan = 0) => { const f = mtof(m), i0 = at(t); let pc = 0;
    for (let k = 0; k < (d + 1.2) * SR; k++) { const x = k / SR; pc += (TAU * f) / SR;
      const body = Math.sin(pc + (1.0 * Math.exp(-x * 2.5) + 0.15) * Math.sin(pc));
      const tine = Math.sin(pc * 14 + 1.2 * Math.exp(-x * 18) * Math.sin(pc)) * 0.25 * Math.exp(-x * 12);
      cb.put(i0 + k, (body + tine) * Math.exp(-x * 1.1) * (x > d ? Math.exp(-(x - d) * 4) : 1) * Math.min(1, x * 900) * 0.09 * g, pan, 0.6); } };
  const bass = (t, m, d, g = 1) => { const f = mtof(m), i0 = at(t), flt = svf(); let p = rnd();
    for (let k = 0; k < (d + 0.3) * SR; k++) { const x = k / SR, dt = f / SR; p += dt; p -= Math.floor(p);
      const s = 2 * p - 1 - blep(p, dt), env = Math.min(1, x / 0.02) * (x > d ? Math.exp(-(x - d) * 12) : 1);
      put(i0 + k, (flt(s, 220 + 500 * Math.exp(-x * 6), 0.8).lp * 0.6 + Math.sin(TAU * f * x) * 0.5) * env * 0.22 * g, 0, 0.06); } };
  const drone = (t, d, m, g = 1) => { const f = mtof(m), i0 = at(t), flt = svf(); let p = 0;
    for (let k = 0; k < d * SR; k++) { const x = k / SR, env = Math.min(1, x / 1.5) * Math.min(1, (d - x) / 0.8); p += f / SR; p -= Math.floor(p);
      put(i0 + k, (Math.sin(TAU * f * x) * 0.6 + Math.sin(TAU * f * 2 * x) * 0.15 + flt(2 * p - 1, 300 + 120 * Math.sin(x * 0.7), 0.6).lp * 0.25) * env * 0.2 * g, Math.sin(x * 0.5) * 0.15, 0.35); } };

  // Ostinato: akor arpejinden sekizlikler (0.25 sn); step: nota aralığı, oct: oktav kaydırma
  const ostinato = (t0, t1, ch, g = 1, step = 0.25, oct = 0) => { let i = 0;
    for (let t = t0; t < t1 - 1e-6; t += step, i++) pluck(t, CH[ch].a[i % 8] + oct, g * (i % 4 === 0 ? 1 : 0.72), i % 2 ? 0.35 : -0.35); };
  const chord = (t, ch, d, { padG = 1, strG = 0, cut = 1100, bassG = 1 } = {}) => {
    pad(t, CH[ch].v, d, padG, cut);
    if (strG) strings(t, CH[ch].v.map((m) => m + 12), d, strG);
    if (bassG) bass(t, CH[ch].b + 12, d * 0.96, bassG);
  };

  /* ---------- 0. Giriş ---------- */
  drone(0, C1 + 0.6, 26, 0.35); drone(0.2, C1 + 0.4, 38, 0.8); drone(0.4, C1 + 0.2, 50, 0.35);
  pad(0.15, CH.D.v, C1 - 0.15, 0.9, 700, 1.8, 0.8);
  [[0.55, 78], [1.05, 81], [1.55, 76], [2.05, 74]].forEach(([t, m], i) => bell(t, m, 0.75 - i * 0.08, i % 2 ? 0.4 : -0.3));
  piano(0.5, 50, 2.0, 0.6);
  revcym(C1, 1.7, 1); riser(C1 - 1.4, 1.4, 0.7);

  /* ---------- 1. Güneş doğar ---------- */
  boom(C1, 1.1); crash(C1, 0.8); braam(C1, [38, 45, 50], 1.4, 1.1); kick(C1, 1.1);
  chord(C1, 'D', 2.0, { strG: 0.6 }); chord(C1 + 2, 'Bm', 2.0, { strG: 0.6 });
  ostinato(C1 + 0.5, C2, 'D', 0.8); // ilk yarım vuruş boş: vuruş nefes alsın
  ostinato(C1 + 2, C2, 'Bm', 0.85);
  [C1 + 1, C1 + 2, C1 + 3].forEach((t) => { kick(t, 0.55); kick(t + 0.28, 0.3); });
  for (let t = C1 + 2; t < C2; t += 0.25) shaker(t, 0.45);

  /* ---------- 2. Gök haritası ---------- */
  taiko(C2, 1); crash(C2, 0.45); boom(C2, 0.5);
  chord(C2, 'G', 2.0, { strG: 0.75, cut: 1400 }); chord(C2 + 2, 'Em', 2.0, { strG: 0.75, cut: 1400 });
  ostinato(C2, C2 + 2, 'G', 1); ostinato(C2 + 2, C3, 'Em', 1);
  [[0.5, 81], [1.0, 78], [1.5, 76], [2.5, 74], [3.0, 73], [3.5, 71]].forEach(([o, m]) => bell(C2 + o, m, 0.55, 0.45));
  for (let b = 0; b < 2; b++) { const t = C2 + b * 2; kick(t, 0.85); kick(t + 1, 0.6); taiko(t + 1.5, 0.55, 80, -0.2); }
  for (let t = C2; t < C3; t += 0.25) shaker(t, 0.5);

  /* ---------- 3. Gözlemevi: tema ---------- */
  chord(C3, 'Bm', 2.0, { strG: 0.9, cut: 1600 }); chord(C3 + 2, 'G', 2.0, { strG: 0.9, cut: 1600 });
  ostinato(C3, C3 + 2, 'Bm', 1, 0.25, 12); ostinato(C3 + 2, C4 - 0.25, 'G', 1, 0.25, 12);
  playTheme(C3, [[0, 66, 1.0], [1.0, 69, 0.5], [1.5, 71, 0.5], [2.0, 69, 1.0], [3.0, 66, 0.5], [3.5, 64, 0.5]], 1);
  for (let b = 0; b < 2; b++) { const t = C3 + b * 2;
    [0, 0.75, 1.5].forEach((o) => taiko(t + o, o ? 0.6 : 0.95, 62)); kick(t, 0.8); kick(t + 1, 0.6);
    for (let s = 0; s < 8; s++) shaker(t + s * 0.25, s % 2 ? 0.45 : 0.7); }
  fill(C4 - 0.5);

  /* ---------- 4. Kara delik: zaman genleşmesi ---------- */
  boom(C4, 1.2); crash(C4, 0.35); braam(C4, [40, 47], 1.8, 0.7);
  drone(C4, C5 - C4, 28, 0.4); drone(C4, C5 - C4, 40, 0.7);
  pad(C4, CH.Em.v, 2.0, 1.1, 900); pad(C4 + 2, CH.C.v, 1.9, 1.1, 650);
  bass(C4, 40 + 12, 1.9, 0.8); bass(C4 + 2, 36 + 12, 1.8, 0.8);
  { let t = C4, i = 0, dt = 0.25; // notalar giderek seyrekleşir ve pesleşir (en çok -3 yarım ton)
    while (t < C5 - 1.1) { const p = Math.min(1, (t - C4) / 3); pluck(t, CH[t < C4 + 2 ? 'Em' : 'C'].a[i % 8] + 12, 0.95 - p * 0.3, i % 2 ? 0.4 : -0.4, Math.pow(2, (-3 * p) / 12), 0.9); t += dt; dt *= 1.17; i++; } }
  [C4, C4 + 0.9, C4 + 1.95, C4 + 3.2].forEach((t, i) => kick(t, 0.8 - i * 0.1));
  riser(C5 - 1.3, 1.3, 1); revcym(C5, 1.5, 1.1); roll(C5 - 1.0, 1.0, 0.9);
  strings(C5 - 1.0, [57, 62, 64, 69], 1.0, 0.8, 0.9);

  /* ---------- 5. Doruk ---------- */
  boom(C5, 1); crash(C5, 1); braam(C5, [42, 50, 57], 1.2, 0.85); kick(C5, 1.1);
  chord(C5, 'DF', 2.0, { strG: 1.1, cut: 2000, padG: 1.1 }); chord(C5 + 2, 'Gs', 2.0, { strG: 1.1, cut: 2000, padG: 1.1 });
  brass(C5, [62, 66, 69], 1.8, 0.6); brass(C5 + 2, [62, 67, 71], 1.8, 0.6);
  ostinato(C5, C5 + 2, 'DF', 1.1, 0.125, 12); ostinato(C5 + 2, C6, 'Gs', 1.1, 0.125, 12);
  playTheme(C5, [[0, 74, 1.0], [1.0, 76, 0.5], [1.5, 78, 0.5], [2.0, 79, 1.0], [3.0, 78, 0.5], [3.5, 76, 0.5]], 1.15, 0.7);
  for (let b = 0; b < 2; b++) { const t = C5 + b * 2;
    for (let s = 0; s < 4; s++) kick(t + s * 0.5, s % 2 ? 0.7 : 0.95);
    [0, 0.75, 1.5].forEach((o) => taiko(t + o, 0.75, 58)); snare(t + 0.5, 0.8); snare(t + 1.5, 0.8);
    for (let s = 0; s < 16; s++) shaker(t + s * 0.125, s % 2 ? 0.4 : 0.65); }
  fill(C6 - 0.5); crash(C5 + 2, 0.4);

  /* ---------- 6. Canlı: yükseliş ---------- */
  chord(C6, 'As', 1.5, { strG: 0.9, cut: 1500 }); chord(C6 + 1.5, 'A', C7 - C6 - 1.5, { strG: 1.0, cut: 1900 });
  ostinato(C6, C6 + 1.5, 'As', 0.8, 0.25, 12); ostinato(C6 + 1.5, C7 - 0.5, 'A', 0.9, 0.125, 12);
  playTheme(C6, [[0, 76, 1.5], [1.5, 73, 1.5]], 0.9, 0.5);
  for (let t = C6, i = 0; t < C7 - 1e-6; t += 0.25, i++) tom(t, i % 4 === 0 ? 96 : 120, 0.35 + 0.5 * ((t - C6) / (C7 - C6)));
  roll(C7 - 1.4, 1.4, 1); revcym(C7, 1.3, 1.1); riser(C7 - 1.5, 1.5, 0.9);

  /* ---------- 7. Son ---------- */
  boom(C7, 1.3); crash(C7, 1.1); kick(C7, 1.2); braam(C7, [38, 45, 50, 57], 2.4, 1.0);
  pad(C7, CH.D.v, dur - C7 - 0.8, 1.3, 1500, 0.2, 1.4);
  strings(C7, [62, 69, 73, 76, 78], dur - C7 - 1.4, 1.1, 0.15);
  brass(C7, [50, 57, 62, 66], 1.8, 0.8);
  bass(C7, 38 + 12, 2.6, 1);
  [86, 81, 78, 74, 69].forEach((m, i) => bell(C7 + 0.05 + i * 0.09, m, 0.6 - i * 0.07, -0.4 + i * 0.2));
  [[1.5, 78], [2.0, 76], [2.5, 74]].forEach(([o, m], i) => piano(C7 + o, m, 1.4, 0.8 - i * 0.1, 0.2));
  piano(C7 + 1.5, 62, 2.4, 0.4, -0.2);

  /* ---------- Efektler: chorus, ping-pong eko, büyük salon yankısı ---------- */
  const D = 32768, rl = new Float32Array(D), rr = new Float32Array(D);
  const tap = (ring, i, sec) => { const p = i - sec * SR, i1 = Math.floor(p), fr = p - i1; return i1 < 1 ? 0 : ring[i1 % D] * (1 - fr) + ring[(i1 + 1) % D] * fr; };
  for (let i = 0; i < N; i++) {
    rl[i % D] = cb.L[i]; rr[i % D] = cb.R[i];
    const x = i / SR;
    mb.L[i] += cb.L[i] * 0.75 + tap(rl, i, 0.009 + 0.0025 * Math.sin(TAU * 0.4 * x)) * 0.5;
    mb.R[i] += cb.R[i] * 0.75 + tap(rr, i, 0.009 + 0.0025 * Math.sin(TAU * 0.4 * x + Math.PI)) * 0.5;
    mb.V[i] += cb.V[i];
  }
  const el = new Float32Array(D), er = new Float32Array(D), dl = Math.round(0.375 * SR);
  for (let i = 0; i < N; i++) {
    const fl = i >= dl ? el[(i - dl) % D] : 0, fr = i >= dl ? er[(i - dl) % D] : 0;
    el[i % D] = db.L[i] + fr * 0.4; er[i % D] = db.R[i] * 0.3 + fl * 0.4;
    mb.L[i] += db.L[i] + fl * 0.38; mb.R[i] += db.R[i] + fr * 0.38; mb.V[i] += db.V[i];
  }
  mb.addVerb(0.5, 0.86);

  // Master: yumuşak doygunluk, 35 Hz altı ve 11 kHz üstü yumuşatma, -1.9 dBFS tepe
  const out = { L: new Float32Array(N), R: new Float32Array(N) };
  for (const ch of ['L', 'R']) { const hp = onePole(35), hp2 = onePole(35), lp = onePole(11000), lp2 = onePole(13000);
    for (let i = 0; i < N; i++) out[ch][i] = lp2.lp(lp.lp(hp2.hp(hp.hp(Math.tanh(mb[ch][i] * 1.1) / Math.tanh(1.1))))); }
  const g = 0.8 / peak(out.L, out.R);
  for (let i = 0; i < N; i++) { out.L[i] *= g; out.R[i] *= g; }
  return out;
}
