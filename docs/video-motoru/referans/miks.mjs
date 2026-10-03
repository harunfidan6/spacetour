// Film sesinin son miksi: efektler + müzik + seslendirme → ses seviyesi dengesi → -14 LUFS (sosyal medya)
// Seslendirme değişince görüntüyü yeniden çekmeye gerek yok:
//   node tools/film/miks.mjs retro        → video/_goruntu/retro-*.mp4 üzerine yeni sesi bindirir
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SR, rng, svf, onePole, bus, decode, writeWav } from './dsp.mjs';
import { synthSfx } from './sfx.mjs';
import { renderMusic } from './muzik.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const ff = (args) => { const r = spawnSync('ffmpeg', ['-y', '-hide_banner', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 }); if (r.status) throw new Error(r.stderr); return r.stderr; };
const lufs = (file) => { // tümleşik ses yüksekliği (EBU R128)
  const m = ff(['-i', file, '-af', 'ebur128', '-f', 'null', '-']).match(/I:\s+(-?[\d.]+) LUFS\s+LRA/g);
  return m ? parseFloat(m[m.length - 1].match(/-?[\d.]+/)[0]) : -70;
};
const scaleTo = (buf, tmp, target) => { // tamponu hedef LUFS'e getirmek için kazanç
  writeWav(tmp, buf.L, buf.R); const l = lufs(tmp); fs.rmSync(tmp);
  return l < -60 ? 1 : Math.pow(10, (target - l) / 20);
};

// Seslendirme: sessizlikleri kırp, süreye sığmazsa perdeyi bozmadan hızlandır, anonsçu tınısını ver.
// Tını metin.json → ses_zinciri'nde (seslendir.py'nin Whisper kontrolü de aynı zinciri kullanır).
const VARSAYILAN_ZINCIR = 'highpass=f=85,equalizer=f=220:t=q:w=1:g=1.5,equalizer=f=3000:t=q:w=1.2:g=3,lowpass=f=11500,acompressor=threshold=-20dB:ratio=4:attack=3:release=60:makeup=2.5,alimiter=limit=0.9';
function voiceBus(lines, voDir, dur, tmpDir, tv = VARSAYILAN_ZINCIR) {
  const b = bus(dur + 1), report = [];
  const trim = 'silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.06,areverse';
  for (const l of lines) {
    const f = ['.wav', '.mp3'].map((e) => path.join(voDir, l.id + e)).find((p) => fs.existsSync(p));
    if (!f) { report.push(`${l.id}: YOK`); continue; }
    let v = decode(f, trim), len = v.length / SR, tempo = 1;
    if (len > l.sure * 1.02) { tempo = Math.min(1.3, len / l.sure); v = decode(f, `${trim},atempo=${tempo.toFixed(3)}`); }
    const tmp = path.join(tmpDir, `_vo_${l.id}.wav`);
    writeWav(tmp, v, v); const colored = decode(tmp, tv); fs.rmSync(tmp);
    const i0 = Math.round(l.t * SR);
    for (let k = 0; k < colored.length; k++) b.put(i0 + k, colored[k], 0, 0.12);
    report.push(`${l.id}: ${len.toFixed(2)} sn / yer ${l.sure} sn${tempo > 1 ? `  (×${tempo.toFixed(2)} hızlandı${tempo >= 1.3 ? ', YİNE UZUN' : ''})` : ''}`);
  }
  b.addVerb(0.2, 0.72); // küçük stüdyo
  return { b, report };
}

export function mixAudio({ scene, events, dur, out, cut }) {
  const tmpDir = path.dirname(out);
  const meta = JSON.parse(fs.readFileSync(path.join(DIR, scene, 'metin.json'), 'utf8'));
  const voDir = path.join(ROOT, 'video', '_ses', scene);

  const sfx = synthSfx(events.filter((e) => e.type !== 'tvOff'), dur, { bed: 'none' });
  const post = synthSfx(events.filter((e) => e.type === 'tvOff'), dur, { bed: 'none' }); // kesimden sonra da duyulur
  const koro = path.join(voDir, 'koro.mp3');
  const mus = renderMusic(dur, { cut, koro: fs.existsSync(koro) ? koro : null });
  const withVo = meta.seslendirme !== false; // false: yalnızca jingle + efekt
  const { b: vo, report } = withVo ? voiceBus(meta.satirlar, voDir, dur, tmpDir, meta.ses_zinciri) : { b: bus(dur + 1), report: ['seslendirme kapalı: yalnızca jingle + efekt'] };

  // Stem seviyeleri (LUFS): seslendirme varsa ses önde, müzik arkada; yoksa müzik önde. Efektler araya
  const gV = withVo ? scaleTo(vo, path.join(tmpDir, '_v.wav'), -17) : 0;
  const gM = scaleTo(mus, path.join(tmpDir, '_m.wav'), withVo ? -19 : -17);
  const gS = scaleTo(sfx, path.join(tmpDir, '_s.wav'), withVo ? -22 : -21);

  // Ducking: seslendirme konuşurken müzik ~10 dB kısılır (60 ms önden sezer)
  const n = Math.round(dur * SR), look = Math.round(0.06 * SR), aA = Math.exp(-1 / (0.012 * SR)), aR = Math.exp(-1 / (0.28 * SR));
  const env = new Float32Array(n); let e = 0;
  for (let i = 0; i < n; i++) { const j = i + look, x = j < vo.N ? Math.abs(vo.L[j]) * gV : 0; e = x > e ? x + (e - x) * aA : x + (e - x) * aR; env[i] = e; }
  let emax = 1e-9; for (let i = 0; i < n; i++) emax = Math.max(emax, env[i]);
  const hold = new Float32Array(n); let h = 0; const aH = Math.exp(-1 / (0.35 * SR));
  for (let i = 0; i < n; i++) { const x = Math.min(1, env[i] / (emax * 0.18)); h = x > h ? x : x + (h - x) * aH; hold[i] = h; }

  // Bant cızırtısı (çok hafif, retro his)
  const rnd = rng(7), hiss = svf(), hum = onePole(3000);
  const L = new Float32Array(n), R = new Float32Array(n), cutAt = cut ? Math.round(cut * SR) : n;
  for (let i = 0; i < n; i++) {
    const duck = 1 - 0.68 * hold[i];
    const hs = i < cutAt ? hum.lp(hiss(rnd() * 2 - 1, 5000, 0.7).bp) * 0.004 : 0;
    L[i] = mus.L[i] * gM * duck + sfx.L[i] * gS + vo.L[i] * gV + post.L[i] * gS + hs;
    R[i] = mus.R[i] * gM * duck + sfx.R[i] * gS + vo.R[i] * gV + post.R[i] * gS + hs;
  }
  const pre = path.join(tmpDir, '_premiks.wav');
  writeWav(pre, L, R);
  // İki geçişli loudnorm: -14 LUFS, en yüksek tepe -1 dBTP
  const j = JSON.parse(ff(['-i', pre, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-']).match(/\{[\s\S]*\}/)[0]);
  ff(['-i', pre, '-af', `loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000`, '-ar', '48000', out]);
  fs.rmSync(pre);
  return report;
}

// Ana kopya (crf 16) film greni yüzünden çok büyük: paylaşım için crf 21 ile yeniden sıkıştırılır
export function mux(video, audio, final) {
  ff(['-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final]);
}

// Komut satırı: kayıtlı görüntünün üzerine sesi yeniden kur
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const scene = process.argv[2] || 'retro';
  const G = path.join(ROOT, 'video', '_goruntu');
  const ev = JSON.parse(fs.readFileSync(path.join(G, `${scene}-olaylar.json`), 'utf8'));
  const wav = path.join(G, `${scene}-ses.wav`);
  console.log('▶ ses miksleniyor…');
  console.log('  ' + mixAudio({ scene, events: ev.sfx, dur: ev.dur, out: wav, cut: ev.cut }).join('\n  '));
  for (const [key, name] of [['v', 'dikey'], ['h', 'yatay']]) {
    const v = path.join(G, `${scene}-${key}.mp4`);
    if (!fs.existsSync(v)) continue;
    const final = path.join(ROOT, 'video', `nese-${scene}-${name}.mp4`);
    mux(v, wav, final); console.log('  ✓', path.relative(ROOT, final));
  }
}
