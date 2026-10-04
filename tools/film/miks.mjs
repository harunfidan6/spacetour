// Film sesinin son miksi: efektler + müzik (+ varsa seslendirme) → stem dengesi → -14 LUFS, AAC sonrası tepe ≤ -1 dBTP
// Görüntüyü yeniden çekmeden sesi yeniden kurmak için:
//   node tools/film/miks.mjs [senaryo]   → video/_goruntu/<senaryo>-*.mp4 üzerine yeni sesi bindirir
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SR, bus, decode, writeWav } from './dsp.mjs';
import { synthSfx } from './sfx.mjs';
import { renderMusic } from './muzik.mjs';
import { renderMusic as renderAstroloji } from './muzik-astroloji.mjs';

// Senaryoya özel müzik; listede yoksa ana tanıtım müziği
const MUSIC = { astroloji: renderAstroloji };

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const ff = (args) => { const r = spawnSync('ffmpeg', ['-y', '-hide_banner', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 }); if (r.status) throw new Error(r.stderr); return r.stderr; };
export const lufs = (file) => { // tümleşik ses yüksekliği (EBU R128)
  const m = ff(['-i', file, '-af', 'ebur128', '-f', 'null', '-']).match(/I:\s+(-?[\d.]+) LUFS\s+LRA/g);
  return m ? parseFloat(m[m.length - 1].match(/-?[\d.]+/)[0]) : -70;
};
const scaleTo = (buf, tmp, target) => { // tamponu hedef LUFS'e getirmek için kazanç
  writeWav(tmp, buf.L, buf.R); const l = lufs(tmp); fs.rmSync(tmp);
  return l < -60 ? 1 : Math.pow(10, (target - l) / 20);
};

// Seslendirme (isteğe bağlı): video/_ses/<senaryo>/<id>.wav varsa ve metin.json'da "seslendirme": true ise
const ZINCIR = 'highpass=f=85,equalizer=f=220:t=q:w=1:g=1.5,equalizer=f=3000:t=q:w=1.2:g=3,lowpass=f=11500,acompressor=threshold=-20dB:ratio=4:attack=3:release=60:makeup=2.5,alimiter=limit=0.9';
function voiceBus(lines, voDir, dur, tmpDir, chain = ZINCIR) {
  const b = bus(dur + 1), report = [];
  const trim = 'silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.06,areverse';
  for (const l of lines) {
    const f = ['.wav', '.mp3'].map((e) => path.join(voDir, l.id + e)).find((p) => fs.existsSync(p));
    if (!f) { report.push(`${l.id}: YOK`); continue; }
    let v = decode(f, trim), len = v.length / SR, tempo = 1;
    if (len > l.sure * 1.02) { tempo = Math.min(1.3, len / l.sure); v = decode(f, `${trim},atempo=${tempo.toFixed(3)}`); }
    const tmp = path.join(tmpDir, `_vo_${l.id}.wav`);
    writeWav(tmp, v, v); const colored = decode(tmp, chain); fs.rmSync(tmp);
    const i0 = Math.round(l.t * SR);
    for (let k = 0; k < colored.length; k++) b.put(i0 + k, colored[k], 0, 0.12);
    report.push(`${l.id}: ${len.toFixed(2)} sn / yer ${l.sure} sn${tempo > 1 ? `  (×${tempo.toFixed(2)})` : ''}`);
  }
  b.addVerb(0.2, 0.72);
  return { b, report };
}

export function mixAudio({ scene, events, dur, meta = {}, out }) {
  const tmpDir = path.dirname(out);
  const text = JSON.parse(fs.readFileSync(path.join(DIR, scene, 'metin.json'), 'utf8'));
  const withVo = text.seslendirme === true;
  const sfx = synthSfx(events, dur);
  const mus = (MUSIC[scene] || renderMusic)(dur, meta);
  const { b: vo, report } = withVo
    ? voiceBus(text.satirlar, path.join(ROOT, 'video', '_ses', scene), dur, tmpDir, text.ses_zinciri)
    : { b: bus(dur + 1), report: ['seslendirme kapalı: özgün müzik + efekt'] };

  // Stem seviyeleri (LUFS): seslendirme yoksa müzik önde, efektler onun altında
  const gV = withVo ? scaleTo(vo, path.join(tmpDir, '_v.wav'), -17) : 0;
  const gM = scaleTo(mus, path.join(tmpDir, '_m.wav'), withVo ? -20 : -16.5);
  const gS = scaleTo(sfx, path.join(tmpDir, '_s.wav'), withVo ? -23 : -22);

  // Ducking: seslendirme konuşurken müzik ~10 dB kısılır (60 ms önden sezer)
  const n = Math.round(dur * SR), look = Math.round(0.06 * SR), aA = Math.exp(-1 / (0.012 * SR)), aR = Math.exp(-1 / (0.28 * SR));
  const hold = new Float32Array(n);
  if (withVo) {
    const env = new Float32Array(n); let e = 0, emax = 1e-9;
    for (let i = 0; i < n; i++) { const j = i + look, x = j < vo.N ? Math.abs(vo.L[j]) * gV : 0; e = x > e ? x + (e - x) * aA : x + (e - x) * aR; env[i] = e; emax = Math.max(emax, e); }
    let h = 0; const aH = Math.exp(-1 / (0.35 * SR));
    for (let i = 0; i < n; i++) { const x = Math.min(1, env[i] / (emax * 0.18)); h = x > h ? x : x + (h - x) * aH; hold[i] = h; }
  }
  const L = new Float32Array(n), R = new Float32Array(n), fadeFrom = n - Math.round(0.35 * SR);
  for (let i = 0; i < n; i++) {
    const duck = 1 - 0.68 * hold[i], fade = i > fadeFrom ? (n - i) / (n - fadeFrom) : 1;
    L[i] = (mus.L[i] * gM * duck + sfx.L[i] * gS + vo.L[i] * gV) * fade;
    R[i] = (mus.R[i] * gM * duck + sfx.R[i] * gS + vo.R[i] * gV) * fade;
  }
  const pre = path.join(tmpDir, '_premiks.wav');
  writeWav(pre, L, R);
  // İki geçişli loudnorm: -14 LUFS. Tepe -2 dBTP: AAC kodlaması tepeyi ~0.5 dB yükseltir, sonuç -1 dBTP altında kalsın
  const j = JSON.parse(ff(['-i', pre, '-af', 'loudnorm=I=-14:TP=-2:LRA=11:print_format=json', '-f', 'null', '-']).match(/\{[\s\S]*\}/)[0]);
  ff(['-i', pre, '-af', `loudnorm=I=-14:TP=-2:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000`, '-ar', '48000', out]);
  fs.rmSync(pre);
  return report;
}

// Ekran görüntüleri tam aralıklı JPEG'dir: oynatıcıların hepsinde doğru görünsün diye sınırlı aralık BT.709'a çevrilir
export const VF = 'scale=out_range=tv:out_color_matrix=bt709,format=yuv420p';
export const COLOR = ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];

// Ana kopya (crf 16) büyük: paylaşım kopyası crf 20 ile yeniden sıkıştırılır
export function mux(video, audio, final) {
  ff(['-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-vf', VF, ...COLOR, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final]);
}

// Komut satırı: kayıtlı görüntünün üzerine sesi yeniden kur
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const scene = process.argv[2] || 'tanitim';
  const G = path.join(ROOT, 'video', '_goruntu');
  const ev = JSON.parse(fs.readFileSync(path.join(G, `${scene}-olaylar.json`), 'utf8'));
  const wav = path.join(G, `${scene}-ses.wav`);
  console.log('▶ ses miksleniyor…');
  console.log('  ' + mixAudio({ scene, events: ev.sfx, dur: ev.dur, meta: ev.meta, out: wav }).join('\n  '));
  for (const [key, name] of [['v', 'dikey'], ['h', 'yatay']]) {
    const v = path.join(G, `${scene}-${key}.mp4`);
    if (!fs.existsSync(v)) continue;
    const final = path.join(ROOT, 'video', `spacetour-${scene}-${name}.mp4`);
    mux(v, wav, final); console.log('  ✓', path.relative(ROOT, final));
  }
}
