// Retro TV reklamı müziği: 80'ler–90'lar Türk TV reklam jingle'ı. 120 BPM, Do majör. Tamamı kodla sentezlenir, telifsiz.
// Sesler: LinnDrum tarzı davul + gated-reverb trampet, tef, Simmons tom; FM (DX7 tarzı) slap bas, elektrik piyano ve çan;
// Juno tarzı synth üflemeli ve yaylı (chorus'lu); ekolu synth lead; orkestra vuruşu ("ta-DAM!");
// vokoder koro "Ne-şe Ga-zoz-cu-su!" (koro.mjs).
// Bölümler film/retro senaryosuna göre: fanfar + jingle cümlesi 1.6 · gerilim 4–8 · 8.0 "Fışşş!" + koro · kıta 10–16 ·
// nakarat 16–24 · koro 24.25 + enstrümantal cevap 26.25 · son vuruş 29.0. Seslendirme varsa miks.mjs müziği altında kısar.
import { SR, TAU, rng, svf, onePole, blep, bus, peak } from './dsp.mjs';
import { renderChoir } from './koro.mjs';

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const B = 0.5, S16 = B / 4; // vuruş ve 16'lık süresi (sn)

// Akorlar: b = bas notası (MIDI), v = piyano/üflemeli dizilişi
const CH = {
  C: { b: 36, v: [60, 64, 67, 72] }, G: { b: 43, v: [59, 62, 67, 71] }, Am: { b: 45, v: [60, 64, 69, 72] },
  F: { b: 41, v: [60, 65, 69, 72] },
};
// Koro: "Ne-şe Ga-zoz-cu-su!" → [cümle başından saniye, süre, armonili notalar]
const HOOK = [[0, 0.25, [67, 64, 60]], [0.25, 0.5, [76, 72, 67]], [0.75, 0.25, [74, 71, 67]], [1.0, 0.25, [72, 67, 64]], [1.25, 0.25, [74, 71, 67]], [1.5, 0.75, [72, 67, 64]]];
const KORO_AT = [8.25, 24.25];
// Kıta melodisi (10–16, üç ölçü): [nota, vuruş]
const VERSE = [[76, 1], [79, 0.5], [76, 0.5], [74, 1], [72, 1], [74, 1], [71, 0.5], [74, 0.5], [79, 1.5], [77, 0.5], [76, 1], [72, 0.5], [76, 0.5], [81, 1], [79, 1]];
// Nakarat melodisi (iki ölçü): [nota, vuruş]
const LEAD = [[67, 0.5], [76, 1], [74, 0.5], [72, 0.5], [74, 0.5], [72, 1], [76, 0.5], [77, 0.5], [79, 1], [76, 0.5], [74, 0.5], [72, 1]];

export function renderMusic(dur, { cut = 29.33, koro = null } = {}) {
  const mb = bus(dur + 1), N = mb.N, put = mb.put;
  const cb = bus(dur + 1); // chorus'a gidenler: piyano, yaylı, üflemeli
  const db = bus(dur + 1); // ekoya giden: lead
  const rnd = rng(1984), noise = () => rnd() * 2 - 1;
  const at = (t) => Math.round(t * SR);

  /* ---------- Davul ---------- */
  const kick = (t, g = 1) => { let ph = 0; const i0 = at(t);
    for (let k = 0; k < 0.35 * SR; k++) { const x = k / SR; ph += (TAU * (50 + 110 * Math.exp(-x * 40))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 9) + (x < 0.003 ? noise() * 0.5 : 0)) * 0.85 * g, 0, 0.03); } };
  const snare = (t, g = 1) => { const i0 = at(t), f = svf(), f2 = svf(); let ph = 0; // gated reverb: yoğun kuyruk 0.21 sn sonra kesilir
    for (let k = 0; k < 0.26 * SR; k++) { const x = k / SR; ph += (TAU * (200 - 30 * Math.min(1, x * 20))) / SR;
      const gate = x < 0.21 ? 1 - x * 1.2 : Math.max(0, 0.748 * (1 - (x - 0.21) / 0.03));
      const v = Math.sin(ph) * Math.exp(-x * 30) * 0.5 + f(noise(), 3200, 0.7).bp * Math.exp(-x * 22) * 0.9 + f2(noise(), 1800, 0.5).bp * 0.55 * gate * Math.min(1, x * 80);
      put(i0 + k, v * 0.6 * g, 0.04, 0.05); } };
  const clap = (t, g = 1) => { const i0 = at(t), f = svf();
    for (let k = 0; k < 0.25 * SR; k++) { const x = k / SR, burst = x < 0.03 ? (Math.floor(x / 0.009) % 2 ? 0.4 : 1) : 1;
      put(i0 + k, f(noise(), 1400, 1.2).bp * Math.exp(-x * 20) * burst * 0.5 * g, -0.1, 0.4); } };
  const hat = (t, g = 1) => { const i0 = at(t), f = svf();
    for (let k = 0; k < 0.05 * SR; k++) { const x = k / SR; put(i0 + k, f(noise(), 8500, 0.9).hp * Math.exp(-x * 60) * 0.2 * g, 0.3, 0.08); } };
  const tamb = (t, g = 1) => { const i0 = at(t), f = svf();
    for (let k = 0; k < 0.18 * SR; k++) { const x = k / SR;
      const jingle = Math.sin(TAU * 6100 * x) * 0.3 + Math.sin(TAU * 7900 * x) * 0.2 + Math.sin(TAU * 9300 * x) * 0.15;
      put(i0 + k, (f(noise(), 9000, 1).hp * 0.7 + jingle * 0.4) * Math.exp(-x * 25) * Math.min(1, x * 400) * 0.22 * g, -0.35, 0.15); } };
  const tom = (t, f0, g = 1) => { let ph = 0; const i0 = at(t), f = svf(); // Simmons: "pıuv"
    for (let k = 0; k < 0.45 * SR; k++) { const x = k / SR; ph += (TAU * f0 * (0.55 + 0.45 * Math.exp(-x * 10))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 6) + f(noise(), f0 * 4, 1).bp * Math.exp(-x * 40) * 0.4) * 0.5 * g, (f0 - 190) / 260, 0.35); } };
  const fill = (t) => [[0, 260], [0.125, 215], [0.25, 175], [0.375, 140]].forEach(([o, f]) => tom(t + o, f, 0.9));
  const crash = (t, g = 1) => { const i0 = at(t), fl = svf(), fr = svf();
    for (let k = 0; k < 2.6 * SR && i0 + k < N; k++) { const x = k / SR, e = Math.exp(-x * 1.9) * Math.min(1, x * 300) * 0.3 * g;
      const l = fl(noise(), 7000, 0.8).hp, r = fr(noise(), 7000, 0.8).hp;
      mb.L[i0 + k] += l * e; mb.R[i0 + k] += r * e; mb.V[i0 + k] += (l + r) * e * 0.2; } };

  /* ---------- FM (DX7 tarzı) ---------- */
  const bass = (t, m, d = 0.2, g = 1, pop = false) => { const f = mtof(m), i0 = at(t); let pc = 0, pm = 0; // slap bas; pop = oktav "şaklama"
    for (let k = 0; k < (d + 0.06) * SR; k++) { const x = k / SR; pc += (TAU * f) / SR; pm += (TAU * f * (pop ? 2 : 1)) / SR;
      const I = (pop ? 5 : 3.2) * Math.exp(-x * (pop ? 35 : 22)) + 0.6;
      const env = Math.min(1, x * 800) * (x < d ? 0.85 + 0.15 * Math.exp(-x * 12) : Math.exp(-(x - d) * 50));
      put(i0 + k, (Math.sin(pc + I * Math.sin(pm)) * 0.55 + Math.sin(pc) * 0.45) * env * 0.38 * g, 0, 0.02); } };
  const ep = (t, m, d, g = 1, pan = 0) => { const f = mtof(m), i0 = at(t); let pc = 0; // elektrik piyano: gövde + "tine"
    for (let k = 0; k < (d + 0.6) * SR; k++) { const x = k / SR; pc += (TAU * f) / SR;
      const body = Math.sin(pc + (1.1 * Math.exp(-x * 3) + 0.2) * Math.sin(pc));
      const tine = Math.sin(pc * 14 + 1.5 * Math.exp(-x * 18) * Math.sin(pc)) * 0.35 * Math.exp(-x * 14);
      cb.put(i0 + k, (body + tine) * Math.exp(-x * 1.4) * (x > d ? Math.exp(-(x - d) * 10) : 1) * Math.min(1, x * 900) * 0.06 * g, pan, 0.25); } };
  const epChord = (t, ch, d, g = 1) => CH[ch].v.forEach((m, i) => ep(t, m, d, g, -0.3 + i * 0.2));
  const bell = (t, m, g = 1, pan = 0.3) => { const f = mtof(m), i0 = at(t);
    for (let k = 0; k < 1.4 * SR; k++) { const x = k / SR;
      put(i0 + k, Math.sin(TAU * f * x + 2.2 * Math.exp(-x * 4) * Math.sin(TAU * f * 3.5 * x)) * Math.exp(-x * 3) * Math.min(1, x * 1500) * 0.05 * g, pan, 0.45); } };

  /* ---------- Analog synth (Juno/Jupiter tarzı) ---------- */
  const sawStack = (ph, f, dets) => { let s = 0; for (let j = 0; j < dets.length; j++) { const dt = (f * dets[j]) / SR; ph[j] += dt; ph[j] -= Math.floor(ph[j]); s += 2 * ph[j] - 1 - blep(ph[j], dt); } return s / dets.length; };
  const brass = (t, m, d, g = 1, pan = 0) => { const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.995, 1, 1.005], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 0.2) * SR; k++) { const x = k / SR;
      const envF = x < 0.04 ? x / 0.04 : 0.4 + 0.6 * Math.exp(-(x - 0.04) * 7);
      const env = Math.min(1, x / 0.02) * (x < d ? 0.8 + 0.2 * Math.exp(-x * 8) : Math.exp(-(x - d) * 20));
      cb.put(i0 + k, flt(sawStack(ph, f, dets), f * (1.5 + 6 * envF), 0.8).lp * env * 0.15 * g, pan, 0.3); } };
  const brassChord = (t, notes, d, g = 1) => notes.forEach((m, i) => brass(t, m, d, g * 0.8, -0.25 + i * 0.13));
  const strings = (t, notes, d, g = 1) => notes.forEach((m, i) => { const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.994, 1, 1.006], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + 0.45) * SR; k++) { const x = k / SR, env = Math.min(1, x / 0.25) * (x > d ? Math.exp(-(x - d) * 8) : 1);
      cb.put(i0 + k, flt(sawStack(ph, f, dets), 2400, 0.7).lp * env * 0.022 * g, -0.4 + i * 0.27, 0.4); } });
  const lead = (t, m, d, g = 1) => { const f = mtof(m), i0 = at(t), flt = svf(); let p1 = rnd(), p2 = rnd();
    for (let k = 0; k < (d + 0.1) * SR; k++) { const x = k / SR, vib = 1 + 0.004 * Math.sin(TAU * 5.5 * x) * Math.min(1, Math.max(0, (x - 0.15) * 4)), dt = (f * vib) / SR;
      p1 += dt; p1 -= Math.floor(p1); p2 += dt * 1.003; p2 -= Math.floor(p2);
      const saw = 2 * p1 - 1 - blep(p1, dt), q = p2 < 0.5 ? 1 : -1;
      const env = Math.min(1, x / 0.012) * (x > d ? Math.exp(-(x - d) * 25) : 1);
      db.put(i0 + k, flt(saw * 0.55 + q * 0.35, 3400, 0.8).lp * env * 0.08 * g, -0.05, 0.3); } };
  const playMel = (mel, t0, g = 1, dbl = false) => { let t = t0; for (const [m, n] of mel) { lead(t, m, n * B * 0.88, g); if (dbl) brass(t, m - 12, n * B * 0.8, 0.55 * g, 0.15); t += n * B; } };
  const playLead = (t0, g = 1, dbl = false) => playMel(LEAD, t0, g, dbl);
  // Jingle cümlesi enstrümantal: melodi synth lead + bir oktav üstte çan + armonisi üflemelilerde, bas akor kökünde
  const hookInst = (t0, k = 1, g = 1) => HOOK.forEach(([o, d, m]) => { const t = t0 + o * k, dd = d * k;
    lead(t, m[0], dd * 0.9, g); bell(t, m[0] + 12, 0.45 * g, 0.3); brassChord(t, m.slice(1), dd * 0.85, 0.55 * g);
    bass(t, m.includes(71) ? 43 : 36, Math.min(0.3, dd * 0.8), 0.8 * g); tamb(t, 0.45 * g); }); // bas: Si varsa Sol akoru, yoksa Do

  const orch = (t, root = 60, g = 1) => { const i0 = at(t), fb = svf(); let pb = 0; // orkestra vuruşu: üflemeli+yaylı katmanı, gümbürtü, atak
    [root - 24, root - 12, root - 5, root, root + 4, root + 7, root + 12].forEach((m, j) => { const f = mtof(m), flt = svf(), ph = [rnd(), rnd()];
      for (let k = 0; k < 0.8 * SR; k++) { const x = k / SR;
        put(i0 + k, flt(sawStack(ph, f, [0.994, 1.006]), 400 + 6500 * Math.exp(-x * 7), 0.9).lp * Math.min(1, x / 0.004) * Math.exp(-x * 5.5) * 0.075 * g, -0.3 + j * 0.1, 0.6); } });
    for (let k = 0; k < 0.6 * SR; k++) { const x = k / SR; pb += (TAU * 65 * (1 + 0.5 * Math.exp(-x * 30))) / SR;
      put(i0 + k, (Math.sin(pb) * Math.exp(-x * 7) * 0.6 + fb(noise(), 2000, 0.8).bp * Math.exp(-x * 50) * 0.4) * g, 0, 0.3); } };
  const riser = (t, d, g = 1) => { const i0 = at(t), f = svf(); let ph = 0;
    for (let k = 0; k < d * SR; k++) { const x = k / SR, p = x / d; ph += (TAU * (180 + 700 * p * p)) / SR;
      put(i0 + k, (f(noise(), 300 + 5200 * p * p, 2).bp * 0.5 + Math.sin(ph) * 0.06) * p * p * 0.45 * g, Math.sin(p * 6) * 0.3, 0.3); } };

  // Bir ölçü pop ritmi (kick 1, 3 ve 3'ün arkası; 2 ve 4'te gated trampet + el çırpma; tef). light: koro altı, sade
  const groove = (t0, ch, { from = 0, light = false } = {}) => {
    for (let s = from; s < 16; s++) { const t = t0 + s * S16;
      if (s === 0 || s === 8 || (!light && s === 10)) kick(t, s === 0 ? 1 : 0.85);
      if (light && (s === 4 || s === 12)) kick(t, 0.7);
      if (!light && (s === 4 || s === 12)) { snare(t, 0.9); clap(t, 0.5); }
      if (s % 2 === 0) hat(t, s % 4 === 0 ? 0.7 : 0.5);
      if (!light && s % 4 === 2) tamb(t, 0.6); }
    const root = CH[ch].b;
    const pat = light ? [[0, 0], [4, 12], [8, 0], [12, 12]] : [[0, 0], [2, 0], [3, 12, 1], [6, 0], [8, 0], [10, 7], [11, 12, 1], [14, 0]];
    for (const [s, o, p] of pat) if (s >= from) bass(t0 + s * S16, root + o, p ? 0.12 : 0.2, light ? 0.75 : 0.95, !!p);
  };

  /* ---------- 1. Fanfar (başlık kartı) ---------- */
  brassChord(1.62, [60, 64, 67], 0.1, 0.8);
  orch(1.8, 60, 0.75); crash(1.8, 0.4); kick(1.8, 0.9); bass(1.8, 36, 1.0, 0.8);
  brassChord(1.8, [60, 64, 67, 72], 0.4, 0.7);
  hookInst(2.1, 0.78, 1); // jingle'ın ana cümlesi, biraz hızlı: kanal değişmeden (3.96) biter

  /* ---------- 2. Gerilim (makro şişe): yaylı + DX7 çan arpeji ---------- */
  strings(4.0, [57, 60, 64, 69], 2.0, 1); strings(6.0, [57, 60, 65, 69], 1.0, 1); strings(7.0, [55, 60, 62, 67], 0.95, 1.1);
  bass(4.0, 45, 1.8, 0.5); bass(6.0, 41, 0.9, 0.5); bass(7.0, 43, 0.9, 0.6);
  const arp = [69, 72, 76, 81, 76, 72];
  for (let i = 0; i < 22; i++) { const t = 4.0 + i * S16; bell(t, arp[i % 6] - (t >= 6 ? 4 : 0), 0.45, i % 2 ? 0.35 : -0.35); }
  for (let t = 4.0; t < 6.8; t += B) kick(t, 0.4);
  riser(6.8, 1.18, 1); fill(7.5);

  /* ---------- 3. "Fışşş!" → orkestra vuruşu + koro ---------- */
  orch(8.0, 60, 1.2); crash(8.0, 1); kick(8.0, 1.2); bass(8.0, 36, 0.4, 1);
  strings(8.0, [60, 64, 67, 72], 2.3, 0.8);
  groove(8.0, 'C', { from: 4, light: true });

  /* ---------- 4. Pop bölümü (seslendirmenin altında) ---------- */
  const song = ['C', 'G', 'Am', 'F', 'C', 'G', 'F'];
  song.forEach((ch, bi) => {
    const t0 = 10 + bi * 2;
    groove(t0, ch);
    epChord(t0, ch, 0.35, 1); epChord(t0 + 7 * S16, ch, 0.15, 0.7); epChord(t0 + 10 * S16, ch, 0.15, 0.7);
    strings(t0, CH[ch].v, 1.9, 0.55);
  });
  [12, 16, 20].forEach((t) => brassChord(t, CH[song[(t - 10) / 2]].v.map((m) => m + 12), 0.22, 0.8));
  playMel(VERSE, 10, 0.75); // kıta: yalnız synth lead
  brassChord(15.75, CH.F.v.map((m) => m + 12), 0.12, 0.6); // "ba-DAP" öncesi
  crash(16.0, 0.4); crash(18.0, 0.3); fill(17.5); fill(23.5);
  playLead(16, 1, true); playLead(20, 1, true); // nakarat: lead + bir oktav altta üflemeliler
  for (let i = 0; i < 8; i++) bell(18.0 + i * (B / 2), [84, 79, 76, 79][i % 4], 0.35, 0.4);

  /* ---------- 5. Final: koro + son vuruş ---------- */
  orch(24.06, 60, 1); crash(24.06, 0.8); kick(24.06, 1);
  strings(24.0, CH.C.v, 2.2, 0.8);
  groove(24.0, 'C', { from: 4, light: true });
  groove(26.0, 'F'); epChord(26.0, 'F', 0.35, 1); strings(26.0, CH.F.v, 0.95, 0.55);
  strings(27.0, CH.G.v, 1.9, 0.6); epChord(27.0, 'G', 0.35, 0.9);
  for (let s = 0; s < 6; s++) { const t = 27.0 + s * B / 2; kick(t, s % 2 ? 0.7 : 0.9); hat(t, 0.6); bass(t, 43 + (s % 2 ? 12 : 0), 0.18, 0.9, !!(s % 2)); }
  hookInst(26.25, 1, 1.1); // koroya enstrümantal cevap ("Kapağı aç, hikâyesini iç!" yazısı çıkarken)
  fill(28.5);
  orch(29.0, 60, 1.3); crash(29.0, 1); kick(29.0, 1.2); bass(29.0, 36, 0.4, 1);
  brassChord(29.0, [60, 64, 67, 72, 76], 0.33, 1.1);

  /* ---------- Vokoder koro ---------- */
  if (koro) {
    const notes = KORO_AT.flatMap((t0) => HOOK.map(([o, d, m]) => ({ t: t0 + o, d, m })));
    const c = renderChoir(koro, notes, dur + 1);
    if (c) for (let i = 0; i < N; i++) { mb.L[i] += c.L[i] * 0.42; mb.R[i] += c.R[i] * 0.42; mb.V[i] += (c.L[i] + c.R[i]) * 0.09; }
  }

  /* ---------- Efektler: chorus (piyano/yaylı/üflemeli), ping-pong eko (lead), büyük 80'ler yankısı ---------- */
  const D = 32768, rl = new Float32Array(D), rr = new Float32Array(D);
  const tap = (ring, i, sec) => { const p = i - sec * SR, i1 = Math.floor(p), fr = p - i1; return i1 < 1 ? 0 : ring[i1 % D] * (1 - fr) + ring[(i1 + 1) % D] * fr; };
  for (let i = 0; i < N; i++) {
    rl[i % D] = cb.L[i]; rr[i % D] = cb.R[i];
    const x = i / SR;
    mb.L[i] += cb.L[i] * 0.75 + tap(rl, i, 0.0075 + 0.0022 * Math.sin(TAU * 0.6 * x)) * 0.55;
    mb.R[i] += cb.R[i] * 0.75 + tap(rr, i, 0.0075 + 0.0022 * Math.sin(TAU * 0.6 * x + Math.PI)) * 0.55;
    mb.V[i] += cb.V[i];
  }
  const el = new Float32Array(D), er = new Float32Array(D), dl = Math.round(0.375 * SR); // noktalı sekizlik eko, sağ-sol
  for (let i = 0; i < N; i++) {
    const fl = i >= dl ? el[(i - dl) % D] : 0, fr = i >= dl ? er[(i - dl) % D] : 0;
    el[i % D] = db.L[i] + fr * 0.38; er[i % D] = db.R[i] * 0.3 + fl * 0.38;
    mb.L[i] += db.L[i] + fl * 0.4; mb.R[i] += db.R[i] + fr * 0.4; mb.V[i] += db.V[i];
  }
  mb.addVerb(0.32, 0.82);

  // Master: hafif bant doygunluğu ve ton; televizyon kapanınca müzik de kesilir
  const out = { L: new Float32Array(N), R: new Float32Array(N) };
  for (const ch of ['L', 'R']) { const hp = onePole(40), lp = onePole(14000);
    for (let i = 0; i < N; i++) out[ch][i] = lp.lp(hp.hp(Math.tanh(mb[ch][i] * 1.25) / Math.tanh(1.25))); }
  const c0 = at(cut), c1 = at(cut + 0.08);
  for (let i = c0; i < N; i++) { const k = i < c1 ? 1 - (i - c0) / (c1 - c0) : 0; out.L[i] *= k; out.R[i] *= k; }
  const g = 0.8 / peak(out.L, out.R);
  for (let i = 0; i < N; i++) { out.L[i] *= g; out.R[i] *= g; }
  return out;
}
