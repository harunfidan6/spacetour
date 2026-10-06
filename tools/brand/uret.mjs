// Logo dosyalarını tek kaynaktan (src/lib/logoSvg.ts) üretir:
//   src/app/icon.svg, src/app/apple-icon.png, src/app/favicon.ico,
//   public/logo-512.png (Google / Organization logosu),
//   tools/instagram/cikti/profil.png (Instagram profil fotoğrafı, 1080×1080)
//
//   node tools/brand/uret.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { logoSmallSvg, logoFullSvg } = await jiti.import(path.join(ROOT, 'src/lib/logoSvg.ts'));

const out = (rel) => path.join(ROOT, rel);

// Sekme ikonu: yuvarlatılmış koyu kare üzerinde sade gezegen
fs.writeFileSync(out('src/app/icon.svg'), logoSmallSvg({ id: 'i' }));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

async function png(svg, size, file) {
  await page.setViewport({ width: size, height: size });
  await page.setContent(`<!doctype html><style>*{margin:0}html,body{background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  const buf = await page.screenshot({ omitBackground: true, type: 'png' });
  if (file) fs.writeFileSync(out(file), buf);
  console.log('✓', file ?? `${size}px (ico)`);
  return buf;
}

// iOS köşeleri kendisi yuvarlar: arka plan tam kare
await png(logoSmallSvg({ id: 'a' }).replace('rx="14"', ''), 180, 'src/app/apple-icon.png');
await png(logoFullSvg({ background: true, id: 'g' }), 512, 'public/logo-512.png');
fs.mkdirSync(out('tools/instagram/cikti'), { recursive: true });
await png(logoFullSvg({ background: true, id: 'p' }), 1080, 'tools/instagram/cikti/profil.png');

// favicon.ico: 16, 32 ve 48 px PNG içeren ICO
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await png(logoSmallSvg({ id: `f${s}` }), s));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
fs.writeFileSync(out('src/app/favicon.ico'), Buffer.concat([header, ...pngs]));
console.log('✓ src/app/favicon.ico');

await browser.close();
