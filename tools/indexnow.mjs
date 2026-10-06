// IndexNow: Bing, Yandex, Seznam ve Naver'a güncellenen sayfaları bildirir (Google desteklemez).
// Anahtar dosyası public/<KEY>.txt olarak yayında olmalı.
//
//   node tools/indexnow.mjs                 → canlı site haritasındaki tüm adresler
//   node tools/indexnow.mjs /takvim /iletisim → yalnızca verilen yollar
//   node tools/indexnow.mjs --gunluk        → her gün değişen sayfalar (günlük burç, Ay bugün)

const HOST = 'spacetour.com.tr';
const BASE = `https://${HOST}`;
const KEY = '4f27dc45c19c851550408eae2f621d5b';

const SIGNS = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak', 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'];

async function sitemapUrls() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const args = process.argv.slice(2);
  let urls;
  if (args.includes('--gunluk')) {
    urls = ['/astroloji/gunluk-burc', ...SIGNS.map((s) => `/astroloji/gunluk-burc/${s}`), '/astroloji/ay-bugun', '/takvim'].map((p) => BASE + p);
  } else if (args.length) {
    urls = args.map((p) => (p.startsWith('http') ? p : BASE + (p.startsWith('/') ? p : `/${p}`)));
  } else {
    urls = await sitemapUrls();
  }

  const keyRes = await fetch(`${BASE}/${KEY}.txt`);
  if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) throw new Error('Anahtar dosyası yayında değil; önce dağıtımı bekleyin.');

  // API tek istekte en çok 10.000 adres kabul eder
  for (let i = 0; i < urls.length; i += 10000) {
    const urlList = urls.slice(i, i + 10000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList }),
    });
    console.log(`${urlList.length} adres → HTTP ${res.status} ${res.statusText}`);
    if (res.status >= 400) console.log(await res.text());
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
