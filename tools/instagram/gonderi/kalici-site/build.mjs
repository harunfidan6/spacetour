// Tarihsiz Instagram gönderileri, sitenin tarzında (№ 01–10), 1080×1350.
// Sitenin dili: koyu zemin (#050508), tam boy NASA/ESA fotoğrafı, altın vurgu (#f5c542),
// Archivo (geniş, büyük harf) başlık + Instrument Serif italik + Geist / Geist Mono; film greni ve köşe karartması.
//   node build.mjs          → ../../cikti/gonderi/site-NN-<ad>.png (hepsi)
//   node build.mjs 04       → yalnızca № 04
//   node build.mjs debug    → 1080×1080 ızgara kırpımı çizili (out-debug-NN.png)
// Fotoğraflar sitenin public/images/space klasöründen; künyeler görselin sağ altında.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../../..');
const OUT_DIR = path.resolve(DIR, '../../cikti/gonderi');
fs.mkdirSync(OUT_DIR, { recursive: true });
const args = process.argv.slice(2);
const debug = args.includes('debug');
const only = args.find((a) => /^\d\d$/.test(a));

const IMG = (f) => pathToFileURL(path.join(ROOT, 'public/images/space', f)).href;
const LOGO = fs.readFileSync(path.resolve(DIR, '../kalici-isik-yolculugu/logo.svg'), 'utf8');

// bas: başlık satırları; [metin, 'gold'] altın renkte
const POSTS = [
  {
    no: '01', ad: 'hubble-derin-alan', img: 'hubble-ultra-deep-field-024236.jpg', pos: '50% 40%',
    kicker: 'Hubble Ultra Derin Alan',
    bas: [['Bir kum tanesi'], ['kadar gökyüzü,'], ['10.000 galaksi', 'gold']],
    metin: 'Kol mesafesinde tuttuğun bir kum tanesinin kapattığı kadar küçük bir alan. Hubble oraya günlerce baktı; boş sanılan karanlıktan yaklaşık 10.000 galaksi çıktı.',
    stats: [['~10.000', 'galaksi'], ['13 milyar', 'yıllık ışık'], ['11 gün', 'toplam pozlama']],
    kredi: 'NASA · ESA · Hubble',
  },
  {
    no: '02', ad: 'yaratilis-sutunlari', img: 'pillars-of-creation-nircam-image-98baee.jpg', pos: '50% 32%',
    kicker: 'Yaratılış Sütunları',
    bas: [['Işığı 6.500 yıl'], ['önce yola', 'gold'], ['çıktı', 'gold']],
    metin: 'Kartal Bulutsusu’ndaki bu gaz ve toz sütunlarının içinde yeni yıldızlar doğuyor. En uzun sütun yaklaşık 4 ışık yılı boyunda: neredeyse Güneş’ten en yakın yıldıza kadarki yol.',
    stats: [['6.500', 'ışık yılı uzakta'], ['~4', 'ışık yılı boy'], ['Webb', 'kızılötesi kamera']],
    kredi: 'NASA · ESA · CSA · STScI',
  },
  {
    no: '03', ad: 'orion-bulutsusu', img: 'orion-nebula-hubble-2006-mosaic-18000-cb452b.jpg', pos: '50% 45%',
    kicker: 'Orion Bulutsusu · M42',
    bas: [['Çıplak gözle'], ['görülen'], ['yıldız doğumevi', 'gold']],
    metin: 'Avcı takımyıldızının kılıcında bulanık bir yıldız gibi görünür. Aslında binlerce genç yıldızın doğduğu dev bir gaz bulutu. Karanlık bir gecede dürbünle bile seçilir.',
    stats: [['1.344', 'ışık yılı uzakta'], ['~24', 'ışık yılı genişlik'], ['3.000+', 'Hubble’ın gördüğü yıldız']],
    kredi: 'NASA · ESA · M. Robberto (STScI/ESA)',
  },
  {
    no: '04', ad: 'yengec-1054', img: 'crab-nebula-bf6d6a.jpg', pos: '50% 50%',
    kicker: 'Yengeç Bulutsusu · M1',
    bas: [['1054’te gündüz'], ['görülen'], ['yıldız patlaması', 'gold']],
    metin: 'Çinli gökbilimciler 1054 yılında gökte yeni bir yıldız kaydetti: 23 gün boyunca gündüz bile görüldü. Bugün o süpernovanın hâlâ genişleyen kalıntısına bakıyoruz.',
    stats: [['23 gün', 'gündüz görüldü'], ['6.500', 'ışık yılı uzakta'], ['30', 'merkezdeki pulsarın saniyedeki dönüşü']],
    kredi: 'NASA · ESA · J. Hester, A. Loll (ASU)',
  },
  {
    no: '05', ad: 'm87-kara-delik', img: 'black-hole-messier-87-99c7a5.jpg', pos: '50% 50%', zoom: 1.25,
    kicker: 'Messier 87 · Olay Ufku Teleskobu',
    bas: [['İlk kez'], ['fotoğraflanan'], ['kara delik', 'gold']],
    metin: 'Dünyanın dört bir yanındaki radyo teleskopları tek bir dev teleskop gibi çalıştı. Ortadaki karanlık, ışığın bile kaçamadığı bölgenin gölgesi.',
    stats: [['6,5 milyar', 'Güneş kütlesi'], ['55 milyon', 'ışık yılı uzakta'], ['2019', 'ilk görüntü']],
    kredi: 'Event Horizon Telescope İşbirliği',
  },
  {
    no: '06', ad: 'saturn-halkalari', img: 'saturn-during-equinox-5fff97.jpg', pos: '50% 50%',
    kicker: 'Satürn’ün halkaları',
    bas: [['270.000 km'], ['genişlik,'], ['~10 metre', 'gold'], ['kalınlık', 'gold']],
    metin: 'Ana halkalar uçtan uca Dünya ile Ay arasındaki yolun %70’i kadar; ama çoğu yerde bir apartmandan ince. Milyarlarca buz ve kaya parçasından oluşur.',
    stats: [['~270.000 km', 'uçtan uca'], ['~10 m', 'ana halkaların kalınlığı'], ['Buz', 'çoğunlukla su buzu']],
    kredi: 'NASA · JPL · Space Science Institute (Cassini)',
  },
  {
    no: '07', ad: 'mars-mavi-gun-batimi', img: 'mars-23-aug-2003-hubble-cropped-277d3f.jpg', pos: '50% 50%', zoom: 0.92,
    kicker: 'Kızıl Gezegen',
    bas: [['Mars’ta'], ['gün batımı'], ['mavidir', 'gold']],
    metin: 'Gündüz Mars’ın gökyüzü toz yüzünden pembemsi turuncudur. Güneş batarken ince toz mavi ışığı Güneş’in çevresine saçar; Mars’taki gezginler bu mavi akşamları fotoğrafladı.',
    stats: [['24 sa 37 dk', 'bir gün'], ['%38', 'Dünya’nın çekimi'], ['−63 °C', 'ortalama sıcaklık']],
    kredi: 'NASA · ESA · Hubble (2003)',
  },
  {
    no: '08', ad: 'tutulma-400', img: '2017-total-solar-eclipse-nhq201708210106-dde4d5.jpg', pos: '50% 50%',
    kicker: 'Tam Güneş tutulması',
    bas: [['400 kat büyük,'], ['400 kat uzak', 'gold']],
    metin: 'Güneş, Ay’dan yaklaşık 400 kat büyük ama 400 kat da uzak. Bu yüzden ikisi gökte neredeyse aynı boyda görünür ve Ay, Güneş’i tam örtebilir. Ay her yıl uzaklaştığı için bu tesadüf sonsuza dek sürmeyecek.',
    stats: [['~400×', 'çap farkı'], ['~390×', 'uzaklık farkı'], ['~0,5°', 'ikisinin gökteki boyu']],
    kredi: 'NASA (2017)',
  },
  {
    no: '09', ad: 'hava-isimasi', img: 'iss-62-city-lights-at-the-intersection-of-europe-and-asia-eb1c8f.jpg', pos: '50% 92%', fotoH: 620, grad: 'linear-gradient(180deg, rgb(5 5 8 / 0.7) 0%, rgb(5 5 8 / 0) 18%, rgb(5 5 8 / 0) 80%, #050508 100%)',
    kicker: 'Uzay İstasyonu’ndan',
    bas: [['Dünya'], ['kendi kendine'], ['parlar', 'gold']],
    metin: 'Ufkun üstündeki yeşil şerit hava ışıması: gündüz Güneş’in parçaladığı oksijen atomları gece ~100 km yükseklikte birleşirken bu ışığı salar. Altta şehirler, üstte yıldızlar.',
    stats: [['~100 km', 'ışımanın yüksekliği'], ['557,7 nm', 'oksijenin yeşil ışığı'], ['~400 km', 'fotoğrafın çekildiği yükseklik']],
    kredi: 'NASA (ISS Expedition 62)',
  },
  {
    no: '10', ad: 'webb-altin-ayna', img: 'james-webb-space-telescope-mirror-seen-in-full-bloom-3343327-520afa.jpg', pos: '50% 40%',
    kicker: 'James Webb Uzay Teleskobu',
    bas: [['Altın kaplı'], ['6,5 metre', 'gold']],
    metin: '18 altıgen parçadan oluşan ana ayna, kızılötesi ışığı iyi yansıtsın diye incecik bir altın tabakayla kaplı. Bütün aynadaki altın yaklaşık bir golf topu ağırlığında: 48 gram.',
    stats: [['18', 'altıgen ayna'], ['48 g', 'altın'], ['1,5 milyon km', 'Dünya’dan uzaklık']],
    kredi: 'NASA / Chris Gunn',
  },
];

function sayfa(p) {
  const bas = p.bas.map(([t, c]) => `<span class="hl${c ? ' gold' : ''}">${t}</span>`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="fonts/fonts.css">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1350px; background: #050508; }
.page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: #050508; color: #f4f3ee; font-family: 'Geist', sans-serif; -webkit-font-smoothing: antialiased; isolation: isolate; }
.foto { position: absolute; left: 0; top: 0; width: 1080px; height: ${p.fotoH ?? 980}px; overflow: hidden; background: #000; }
.foto img { width: 100%; height: 100%; object-fit: ${p.fit ?? 'cover'}; object-position: ${p.pos}; transform: scale(${p.zoom ?? 1}); filter: saturate(1.06) contrast(1.04); }
.foto::after { content: ''; position: absolute; inset: 0; background:
  ${p.grad ?? 'linear-gradient(180deg, rgb(5 5 8 / 0.75) 0%, rgb(5 5 8 / 0) 18%, rgb(5 5 8 / 0) 42%, rgb(5 5 8 / 0.78) 70%, #050508 100%)'}; }
.grain { position: absolute; inset: -50%; opacity: 0.07; pointer-events: none; z-index: 5;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.vig { position: absolute; inset: 0; z-index: 4; pointer-events: none; background: radial-gradient(ellipse at 50% 40%, transparent 55%, rgb(5 5 8 / 0.55) 100%); }
.mono { font-family: 'Geist Mono', monospace; text-transform: uppercase; letter-spacing: 0.24em; }
.top { position: absolute; left: 72px; right: 72px; top: 64px; z-index: 6; display: flex; justify-content: space-between; align-items: center; font-size: 19px; color: rgb(244 243 238 / 0.9); }
.top .l { display: flex; align-items: center; gap: 14px; }
.top .l i { width: 9px; height: 9px; border-radius: 50%; background: #f5c542; box-shadow: 0 0 14px #f5c542; }
.top .r { color: #f5c542; }
.icerik { position: absolute; left: 72px; right: 72px; bottom: 168px; z-index: 6; }
.kicker { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 50px; line-height: 1; color: #f5c542; letter-spacing: -0.01em; margin-bottom: 14px; text-shadow: 0 2px 24px rgb(0 0 0 / 0.7); }
.head { font-family: 'Archivo', sans-serif; font-weight: 800; font-stretch: 118%; text-transform: uppercase; letter-spacing: -0.035em; line-height: 0.9; text-shadow: 0 2px 30px rgb(0 0 0 / 0.6); }
.hl { display: block; white-space: nowrap; width: max-content; }
.hl.gold { color: #f5c542; }
.metin { margin-top: 24px; font-size: 26px; line-height: 1.38; color: rgb(244 243 238 / 0.86); max-width: 920px; }
.stats { margin-top: 30px; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgb(244 243 238 / 0.22); }
.stat { padding: 18px 18px 0 0; }
.stat + .stat { padding-left: 22px; border-left: 1px solid rgb(244 243 238 / 0.14); }
.stat b { display: block; font-family: 'Archivo', sans-serif; font-weight: 800; font-stretch: 112%; font-size: 40px; letter-spacing: -0.03em; line-height: 1; color: #f4f3ee; white-space: nowrap; }
.stat span { display: block; margin-top: 10px; font-family: 'Geist Mono', monospace; font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.4; color: rgb(244 243 238 / 0.62); }
.foot { position: absolute; left: 72px; right: 72px; bottom: 56px; z-index: 6; display: flex; justify-content: space-between; align-items: center; }
.brand { display: flex; align-items: center; gap: 14px; }
.brand svg { width: 54px; height: 54px; }
.brand b { font-family: 'Archivo', sans-serif; font-weight: 800; font-stretch: 112%; font-size: 30px; letter-spacing: -0.02em; }
.brand b em { font-style: normal; color: #f5c542; }
.kredi { font-family: 'Geist Mono', monospace; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: rgb(244 243 238 / 0.5); text-align: right; line-height: 1.5; }
${debug ? '.crop { position: absolute; left: 0; right: 0; top: 135px; height: 1080px; outline: 4px solid #0f0; z-index: 9; }' : ''}
</style></head><body><div class="page">
<div class="foto"><img src="${IMG(p.img)}"></div>
<div class="vig"></div>
<div class="top mono"><span class="l"><i></i>Spacetour · Evren arşivi</span><span class="r">№ ${p.no}</span></div>
<div class="icerik">
  <div class="kicker">${p.kicker}</div>
  <h1 class="head">${bas}</h1>
  <p class="metin">${p.metin}</p>
  <div class="stats">${p.stats.map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('')}</div>
</div>
<div class="foot"><div class="brand">${LOGO}<b>Spacetour<em>.tr</em></b></div><div class="kredi">spacetour.com.tr<br>Görsel: ${p.kredi}</div></div>
<div class="grain"></div>
${debug ? '<div class="crop"></div>' : ''}
</div>
<script>
  // Başlık: satırlar 936 px'e sığacak en büyük boyda, hepsi aynı boyda
  document.fonts.ready.then(() => {
    const ls = [...document.querySelectorAll('.hl')];
    let fs = 108;
    const set = () => ls.forEach((e) => { e.style.fontSize = fs + 'px'; });
    set();
    while (ls.some((e) => e.getBoundingClientRect().width > 936) && fs > 40) { fs -= 2; set(); }
    window.__ok = true;
  });
</script>
</body></html>`;
}

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
for (const p of POSTS.filter((x) => !only || x.no === only)) {
  const file = path.join(DIR, `out-${p.no}.html`);
  fs.writeFileSync(file, sayfa(p));
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__ok);
  await new Promise((r) => setTimeout(r, 300));
  const rep = await page.evaluate(() => {
    const b = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; };
    const statW = [...document.querySelectorAll('.stat b')].map((e) => e.scrollWidth > e.parentElement.clientWidth - 10);
    return { icerik: b('.icerik'), boy: document.querySelector('.hl').style.fontSize, tasanStat: statW.some(Boolean) };
  });
  console.log(`№ ${p.no} ${p.ad}  içerik ${rep.icerik}  başlık ${rep.boy}${rep.icerik[0] < 230 ? '  ⚠ YUKARI TAŞIYOR' : ''}${rep.tasanStat ? '  ⚠ SAYI SIĞMIYOR' : ''}`);
  await page.screenshot({ path: debug ? path.join(DIR, `out-debug-${p.no}.png`) : path.join(OUT_DIR, `site-${p.no}-${p.ad}.png`) });
}
await browser.close();
