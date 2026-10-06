// Instagram kartları (1080×1350, 4:5): tools/instagram/kart.html şablonunu her gönderi için doldurup PNG kaydeder.
//   node tools/instagram/kartlar.mjs            → tools/instagram/cikti/*.png
//   node tools/instagram/kartlar.mjs saturn     → yalnızca o kart
// Görseller sitenin kendi Wikimedia Commons arşivinden; lisans gereği künye kartta yazılı.

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { createJiti } from 'jiti';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(DIR, 'cikti');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { logoSmallSvg } = await jiti.import(path.join(ROOT, 'src/lib/logoSvg.ts'));
const LOGO = logoSmallSvg({ background: false, id: 'k' });
const img = (file) => pathToFileURL(path.join(ROOT, 'public/images/space', file)).href;

export const KARTLAR = [
  {
    id: '01-tanitim',
    kicker: 'Merhaba',
    title: 'Gökyüzü',
    serif: 'cebinde.',
    lede: 'Gezegen ansiklopedisi, 3D gök küresi, gök olayları takvimi ve astroloji araçları. Hepsi Türkçe, hepsi ücretsiz.',
    image: img('eso-milky-way-23ddfc.jpg'),
    credit: 'ESO / S. Brunier · CC BY 4.0',
    url: 'spacetour.com.tr',
  },
  {
    id: '02-saturn',
    kicker: 'Biliyor muydunuz?',
    title: '293',
    serif: 'uydu.',
    size: 230,
    lede: 'Satürn, Haziran 2026 itibarıyla yörüngesi doğrulanmış 293 uydusuyla Güneş Sistemi’nin rekortmeni. Jüpiter’in 115 uydusu var.',
    image: img('saturn-during-equinox-5fff97.jpg'),
    credit: 'NASA / JPL / SSI (Cassini)',
    url: 'spacetour.com.tr/ansiklopedi/saturn',
  },
  {
    id: '03-venus-retro',
    kicker: 'Retro takvimi',
    title: 'Venüs',
    serif: 'retroda.',
    accent: '#f9a8d4',
    lede: '3 Ekim – 14 Kasım 2026. Venüs, Akrep 10°’den Terazi 25°’e geri gidiyormuş gibi görünüyor. Astrolojide ilişkileri ve değerleri gözden geçirme dönemi.',
    image: img('sdo-s-ultra-high-definition-view-of-2012-venus-transit-path--84dbd4.jpg'),
    credit: 'NASA / SDO, AIA · CC BY 2.0',
    url: 'spacetour.com.tr/astroloji/retrolar/venus-2026',
  },
  {
    id: '04-yeni-ay',
    kicker: '10 Ekim 2026',
    title: 'Yeni Ay',
    serif: 'Terazi’de.',
    lede: 'Ay, Güneş ile aynı doğrultuya geliyor ve görünmez oluyor. Ayın en karanlık geceleri: Samanyolu ve sönük bulutsular için en iyi zaman.',
    image: img('sidney-hall-urania-s-mirror-libra-58ab4d.jpg'),
    dim: 0.5,
    credit: 'Sidney Hall, Urania’s Mirror (1824)',
    url: 'spacetour.com.tr/astroloji/ay-bugun',
  },
  {
    id: '05-ekim-takvimi',
    kicker: 'Gök takvimi',
    title: 'Ekim’in',
    serif: 'gökyüzü.',
    size: 120,
    list: [
      ['14 EKİM', 'Plüton düz harekete geçiyor'],
      ['21 EKİM', 'Orionid meteor yağmuru zirvede'],
      ['23 EKİM', 'Güneş Akrep burcuna geçiyor'],
      ['24 EKİM', 'Merkür retrosu başlıyor'],
      ['26 EKİM', 'Avcı Dolunayı'],
    ],
    image: img('orion-flickr-gjdonatiello-ddc5f5.jpg'),
    position: 'center 30%',
    credit: 'Giuseppe Donatiello · CC0',
    url: 'spacetour.com.tr/takvim',
  },
  {
    id: '06-burc-uyumu',
    kicker: '78 burç ikilisi',
    title: 'Burç',
    serif: 'uyumu.',
    accent: '#f9a8d4',
    lede: 'Element, nitelik ve burçlar arası açıya dayanan uyum puanı; aşk, iletişim ve uzun vadede güçlü ve zorlu yanlar. Seninki kaç?',
    image: img('zodiaque-de-dendra-muse-du-louvre-antiquits-egyptiennes-d-38-06fa7e.jpg'),
    credit: 'Dendera zodyağı, Louvre · Shonagon · CC0',
    url: 'spacetour.com.tr/astroloji/burc-uyumu',
  },
  {
    id: '07-pluton',
    kicker: '14 Ekim 2026',
    title: 'Plüton',
    serif: 'yön değiştiriyor.',
    size: 140,
    accent: '#818cf8',
    lede: 'Mayıs’tan beri süren retro Kova 3°’de bitiyor. Gezegen gerçekte geri gitmez; bu, Dünya’dan bakınca oluşan bir görünüştür.',
    image: img('cellarius-harmonia-macrocosmica-planisphaerium-braheum-f160fa.jpg'),
    dim: 0.4,
    credit: 'Andreas Cellarius, Harmonia Macrocosmica (1660)',
    url: 'spacetour.com.tr/astroloji/retrolar',
  },
  {
    id: '08-andromeda',
    kicker: 'Ekim gecelerinde',
    title: '2,5 milyon',
    serif: 'yıllık ışık.',
    size: 130,
    lede: 'Andromeda Galaksisi, çıplak gözle görebileceğin en uzak cisim. Bu ay akşamları doğu-kuzeydoğuda, Kraliçe’nin “W”sinin hemen altında.',
    image: img('andromeda-galaxy-560mm-fl-3885b3.jpg'),
    credit: 'David (Deddy) Dayag · CC BY-SA 4.0',
    url: 'spacetour.com.tr/ansiklopedi/gok-cisimleri',
  },
];

async function main() {
  const only = process.argv[2];
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: 1080, height: 1350 }, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  for (const k of KARTLAR.filter((x) => !only || x.id.includes(only))) {
    await page.evaluateOnNewDocument((data) => { window.KART = data; }, { ...k, logo: LOGO });
    await page.goto(pathToFileURL(path.join(DIR, 'kart.html')).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(OUT, `${k.id}.png`);
    await page.screenshot({ path: file });
    console.log('✓', path.relative(ROOT, file));
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
