# Tanıtım filmi motoru

SpaceTour TR'nin tanıtım videosu bir montaj programında değil, **sitenin kendi kodu oynatılarak** üretilir.
Yöntem ve kurallar: [`docs/video-motoru/SARTNAME.md`](../../docs/video-motoru/SARTNAME.md).

```bash
npm run build                          # bir kez: çekim production derlemesiyle yapılır
npm run film                           # dikey + yatay → video/spacetour-tanitim-{dikey,yatay}.mp4
npm run film -- v                      # yalnız dikey
SNAP="3.5,8,12.4" npm run film -- v    # video yerine kontrol kareleri → video/_kontrol/tanitim/
npm run film:ses                       # görüntüyü yeniden çekmeden yalnızca sesi yeniden kur
```

`next start` 3100'de açık değilse betik kendisi açar. Chrome yolu `CHROME_PATH`, sitenin saati `FILM_EPOCH` ile değişir.

## Dosyalar

| Dosya | Ne |
|---|---|
| `record.mjs` | Headless Chrome'u açar, sanal saatle kare kare çeker, ffmpeg'e akıtır, sesi bindirir. `/film/*` çekim sayfası yalnızca bu betiğin vekil sunucusunda (3500) vardır; sitede böyle bir rota yoktur. Canlı API'ler (ISS) çekimde `tanitim/veri/` altındaki sabit yanıtlarla karşılanır. |
| `time-shim.js` | Sanal saat. Referansa ek olarak: sabit takvim (`new Date()` dahil), tohumlu `Math.random`, WebGL `preserveDrawingBuffer`, `data-hold` ile bekletilen iframe'ler. |
| `tanitim/senaryo.js` | Yönetmen: tek bir duraklatılmış GSAP timeline. Sahneler sitenin gerçek sayfaları (`?film=1` iframe'ler); etkileşimler `window.__film` kumandasıyla yapılır. Ses olayları `window.__sfx`. |
| `tanitim/metin.json` | Ekran yazıları (künye, başlık, serif satır, renk). |
| `tanitim/index.html`, `stil.css` | Çekim sayfası: sahneler, bölüm yazıları, açılış ve kapanış kartları, geçişler. |
| `sfx.mjs`, `muzik.mjs`, `miks.mjs`, `dsp.mjs` | Kodla sentezlenen efektler ve özgün müzik (120 BPM, Re majör), stem dengesi, −14 LUFS / −1.2 dBTP. |

## Sitedeki film modu (`?film=1`)

`src/lib/film.ts`, `src/components/film/FilmMode.tsx` ve kök layout'taki satır içi betik. Film modunda giriş perdesi
atlanır, analytics/telemetri gönderilmez, tembel görseller hemen yüklenir ve `window.__film` kumandası açılır
(`hazir`, `kaydir`, `tikla`, `deger`, bileşenlerin kaydettiği `eylemler`, ör. planetaryumun `gokyuzu.bak`).
Normal ziyaretçide hiçbiri çalışmaz.
