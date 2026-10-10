// 8 Ekim 2026 tek kare hikâye: "Yeni Ay'a 2 gün" (1080×1920). Veriler sitenin hesaplarından elle yazıldı.
//   node tools/instagram/hikaye-tek/2026-10-08/render.mjs   → tools/instagram/cikti/hikaye-tek/2026-10-08-yeni-aya-2-gun.png
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(DIR, '../../cikti/hikaye-tek');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(DIR, 'story.html')).href, { waitUntil: 'networkidle0', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));
const file = path.join(OUT, '2026-10-08-yeni-aya-2-gun.png');
await page.screenshot({ path: file });
await browser.close();
console.log('✓', path.relative(process.cwd(), file));
