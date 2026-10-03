# Kodla Render Edilen Tanıtım Filmi: Teknik Şartname

Bu belge bir web sitesinin tanıtım videosunun **video düzenleme programı kullanmadan, sitenin kendi kodu oynatılarak** nasıl üretileceğini tanımlar. Herhangi bir siteye uygulanabilir: düz HTML, Express, Next.js, React Three Fiber, Vue ve benzerleri.

Yöntem ilk olarak Neşe Gazozcusu projesinde geliştirildi. `referans/` klasöründe orada çalışan kodlar var. Onları kopyalayıp yapıştırma; bu şartnamedeki sözleşmelere göre yeni siteye uyarla.

---

## 0. Ajan için özet (önce bunu oku)

> Sitenin gerçek kodunu görünmez bir Chrome'da oynat. Sayfanın saatini dondur ve her kareyi tam 1/60 sn ilerlet. Her kareyi ekran görüntüsü olarak ffmpeg'e akıt. Sesi (efekt, müzik, varsa seslendirme) ayrı bir adımda kodla üret ve görüntüye bindir.
>
> Görüntü bir kez çekilir ve saklanır. Ses değişince yalnızca ses yeniden kurulur. Her şey deterministiktir: aynı girdi, aynı video.

Başarı ölçütleri:
1. Video hiç takılmaz, kare atlamaz. Sahne ne kadar ağır olursa olsun 60 fps akıcıdır.
2. Aynı komut iki kez çalıştırılınca birebir aynı video çıkar.
3. Videodaki her etkileşim (kaydırma, tıklama, sürükleme, 3D) sitenin **gerçek** kodudur, taklit animasyon değildir.
4. Ses ve görüntü tek bir zaman çizelgesinden beslenir, senkron kaymaz.
5. Ses −14 LUFS (sosyal medya standardı), tepe en fazla −1 dBTP.
6. Çıktılar 1080×1920 (dikey) ve 1920×1080 (yatay), H.264 + AAC, `+faststart`.

---

## 1. Mimari

```
┌──────────────────────── kayıt betiği (Node) ────────────────────────┐
│ 1. Chrome'u headless + GPU açık başlat (puppeteer-core)             │
│ 2. evaluateOnNewDocument(time-shim.js)  ← her sayfa ve iframe'e      │
│ 3. Çekim sayfasını aç: /film/<senaryo>/?fmt=v|h                     │
│ 4. Isınma: __advance(16.67) + gerçek 10 ms bekle … __filmReady      │
│ 5. __filmStart()                                                    │
│ 6. N kare: screenshot(JPEG q95) → ffmpeg stdin → __advance(1000/60) │
│ 7. window.__sfx ve __filmMeta okunur → olaylar.json                 │
│ 8. Görüntü saklanır: video/_goruntu/<senaryo>-<fmt>.mp4             │
│ 9. Ses miksi → mux → video/<ad>-<dikey|yatay>.mp4                   │
└─────────────────────────────────────────────────────────────────────┘
            │ tarayıcının içinde
┌──────────────────── çekim sayfası (/film/<senaryo>/) ───────────────┐
│ Katmanlar (alttan üste): 3D sahne · site <iframe ?film=1> ·          │
│ geçiş maskesi (iris) · yazılar · vurgu (ör. "Fışşş!") · kapanış ·    │
│ efekt/doku katmanları · siyah perde (dip)                           │
│                                                                     │
│ senaryo.js = yönetmen: TEK bir duraklatılmış GSAP timeline          │
│   ├─ 3D'ye: dışarıdan kamera nesnesi {x,y,z,lx,ly,lz,fov}           │
│   └─ siteye: iframe.contentWindow.__film API'si                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sözleşmeler (değişmez kurallar)

### 2.1 Sanal saat: `time-shim.js` (referansta hazır, olduğu gibi kullanılabilir)

`page.evaluateOnNewDocument` ile **sayfadaki tüm kodlardan önce** yüklenir. Şunları devralır:

| API | Davranış |
|---|---|
| `performance.now()`, `Date.now()` | Sanal saat |
| `requestAnimationFrame` / `cancel…` | Kuyruğa alınır, yalnızca `__advance` çalıştırır |
| `setTimeout` / `setInterval` / `clear…` | Kendi tablosu, sanal saate göre sırayla |
| CSS animasyon ve geçişleri | `document.getAnimations()` → duraklat, `currentTime` elle ilerlet |
| iframe'ler | `__advance` içteki iframe'lerin `__advance`'ını da çağırır |

Sayfaya şu fonksiyonu açar: `window.__advance(ms)`.

**Saatin kapsamadıkları; bunları sitede film modunda kapat ya da başka yoldan çöz:**
- `<video>` ve `<audio>` oynatımı: gerçek zamanlıdır. Film modunda ya kareleri elle ilerlet (`video.currentTime = t`) ya da yerine poster koy.
- Web Audio: sitedeki sesler filmde kapalı olmalı. Film sesi ayrı üretilir.
- `requestVideoFrameCallback`, `requestIdleCallback`, Web Worker zamanlayıcıları, `scheduler.postTask`: film modunda kullanılmamalı ya da yamanmalı.
- CSS `scroll-behavior: smooth` ve tarayıcının kendi yumuşak kaydırması: film modunda `auto` yapılmalı; kaydırma GSAP ile yönetilir.

### 2.2 Sitenin film modu (`?film=1`)

Site, URL'de `film` parametresini görünce şunları yapar:
1. **Rastgelelik ve dış etkenler sabitlenir:** giriş animasyonu atlanır, kaydırma konumu sıfırlanır, çerez bannerları, sohbet balonları ve bildirim izinleri gösterilmez, analytics kapanır.
2. **Uyarlamalı kalite kapanır:** FPS'e bakıp kalite düşüren her kod devre dışı kalır (sanal saatte FPS anlamsızdır). WebGL tam çözünürlükte çalışır ve `preserveDrawingBuffer: true` kullanır; yoksa ekran görüntüsünde canvas boş çıkar.
3. **Tembel yükleme kapanır:** `loading="lazy"` görseller `eager` yapılır. `IntersectionObserver` ile tetiklenen içerik ya önceden yüklenir ya da API ile tetiklenir.
4. **Kumanda API'si açılır** (adlar örnek; siteye göre seçilir):

```js
window.__film = {
  ready(),                    // veriler + TÜM görseller + fontlar yüklendi (Promise, üst sınır 8 sn)
  reveal(),                   // ana sayfa giriş animasyonu
  scrollTo(selector, sn, ofset),
  // sitenin gerçek etkileşimleri: aç(), sekmeyeGeç(i), sürükle(sn), sepeteEkle(i) …
  // Her biri sitenin GERÇEK fonksiyonlarını çağırır; görsel taklit yazılmaz.
};
```

5. **Dokunuş görünür olur (isteğe bağlı):** parmak izi noktası. Bir dokunma halkası API çağrılarıyla birlikte hareket eder.
6. **Gerçek marka, kişi ya da telifli içerik taşıyan görseller** filmde gizlenir (ör. `FILM_HIDDEN` listesi).

### 2.3 3D sahne (Three.js / React Three Fiber)
- Film modunda kamera **dışarıdan** yönetilir: senaryonun tweenlediği `cam = {x,y,z,lx,ly,lz,fov}` nesnesi her karede kameraya uygulanır.
- Render döngüsü yalnızca `requestAnimationFrame` ile ilerlemelidir. R3F'de varsayılan `frameloop="always"` uygundur. `"demand"` kullanılıyorsa film modunda `"always"` yapılmalıdır.
- `dt` üst sınırlanmalı (`Math.min(0.05, dt)`). Isınmadaki uzun duraklar sahneyi fırlatmasın.
- Shader'lar ısınmada derlenmeli (`renderer.compileAsync`). İlk karede takılma olmasın.
- `Math.random()` ile çalışan parçacıklar varsa film modunda tohumlu RNG kullanılmalı (birebir aynı çıktı için).

### 2.4 Çekim sayfası
- Ayrı bir route: `/film/<senaryo>/`. Site bir `<iframe src="/?film=1">` içinde çalışır.
- Biçimler:
  - **Dikey** `?fmt=v`: viewport 540×960, `deviceScaleFactor: 2` → 1080×1920. Site iframe'i tam ekran.
  - **Yatay** `?fmt=h`: 960×540 @2x → 1920×1080. Site, CSS ile çizilmiş bir telefon çerçevesinde durur (iframe 390×844, `transform: scale(.5692)`). Yazılar solda.
- Katman geçişleri yalnızca opaklık ve maske ile yapılır. Sahne değişimleri GSAP'te zamanlanır.
- **Production'da `/film` rotası kapalı olmalı** (ör. `NODE_ENV !== 'production'` iken servis et).

### 2.5 Senaryo (yönetmen)
- Tek bir `gsap.timeline({ paused: true })`. Her olay **saniyesiyle** eklenir.
- Hazırlık bitince: `window.__filmReady = true`; başlatma: `window.__filmStart = () => tl.play(0)`.
- Ses olayları aynı dosyada, aynı saniyelerle: `window.__sfx = [{ t, type, d?, g?, p? }]`.
- Kayda geçen meta: `window.__filmMeta = { cut }` (ör. TV kapanış anı).
- Ekran yazıları ve (varsa) seslendirme metni tek bir JSON'dan okunur (`metin-ornegi.json`): `{ id, t, sure, metin, okunus? }`.

### 2.6 Kayıt betiği (`referans/record.mjs`)
- Chrome bayrakları: `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist --hide-scrollbars --mute-audio` (Windows). Linux/mac'te `--use-angle=gl` ya da `vulkan`.
- ffmpeg girişi: `-f image2pipe -framerate 60 -c:v mjpeg -i -`
- Ana kopya: `-c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p`
- Paylaşım kopyası: `crf 21`. Film greni varsa dosya büyür, gren sıkıştırılamaz.
- Her karede: `screenshot({ type:'jpeg', quality:95, optimizeForSpeed:true })`. ffmpeg stdin'inde `drain` beklenir, sonra `__advance(1000/60)`.
- **SNAP modu:** `SNAP="1,5,12"` verilince video yerine o saniyelerden kontrol karesi çıkarır. Senaryoyu ayarlarken tam çekim yapma.
- Senaryo adı parametre: `node record.mjs v,h <senaryo>`.

### 2.7 Ses (`dsp.mjs`, `sfx.mjs`, `muzik.mjs`, `koro.mjs`, `miks.mjs`)
- Tamamı Node.js'te saf DSP ile 48 kHz stereo üretilir. Telifli dosya yok. Tohumlu RNG kullanılır (deterministik).
- **Efektler (`sfx.mjs`):** pop, fizz, clink, whoosh, swipe, thud, hit, tone, static, tvOn, tvOff, kaching… Yeni siteye göre yenileri eklenir.
- **Müzik (`muzik.mjs`):** filmin süresine birebir yazılmış aranjman. Sahne kesimleri vuruşlara oturur (120 BPM → vuruş 0.5 sn). Sesler: FM (DX7 tarzı) piyano/bas/çan, testere dişi synth üflemeli/yaylı, davul sentezi, orkestra vuruşu, chorus, eko, Schroeder yankısı.
- **Koro (`koro.mjs`, isteğe bağlı):** vokoder. Heceleri tek tek okunmuş bir konuşma kaydının spektral zarfları melodi notalarına yerleştirilir.
- **Miks (`miks.mjs`):**
  - Stem'ler EBU R128 ile ölçülüp hizalanır (müzik/efekt; varsa ses).
  - Seslendirme varsa müzik altında ~10 dB kısılır (ducking, 60 ms önden).
  - Sonuç iki geçişli `loudnorm` ile −14 LUFS / −1.2 dBTP olur, ardından AAC 192k ile görüntüye bindirilir.
- **Görüntü ile ses bağımsızdır:** `video/_goruntu/` saklanır, `node miks.mjs <senaryo>` yalnızca sesi yeniden kurar.

### 2.8 Seslendirme (isteğe bağlı, `seslendir.py`)
- Kaynaklar: XTTS v2 (yerel, klon; **yalnızca izinli ya da sentetik referans ses**), edge-tts (Microsoft nöral, internet gerekir) ya da bir insan kaydı (`<id>.wav` adıyla klasöre konur).
- Satır başına birkaç deneme üretilir. Her deneme **son işlenmiş hâliyle** (ses zinciri uygulandıktan sonra) Whisper'a dinletilir. Metni doğru okuyanlar arasından en canlı ve tutarlı perdedeki seçilir.
- Satır `sure`'ye sığmazsa `atempo` ile perde bozulmadan en fazla ×1.3 hızlandırılır.
- Öğrenilen: tekdüze TTS "yapay zekâ" gibi duyulur. Kullanıcı sonunda seslendirmesiz, yalnızca jingle + efekt sürümünü tercih etti. `"seslendirme": false` ile kapatılabilir olmalı.

---

## 3. Yeni siteye uygulama adımları

1. **Siteyi incele:** çerçeve, render döngüsü (rAF mi, demand mı), video/ses öğeleri, lazy yükleme, analytics, çerez bannerı, rastgelelik.
2. **Film modunu ekle** (2.2). Siteye dokunan tek değişiklik budur; normal kullanıcıya hiçbir etkisi olmamalı.
3. **Çekim sayfasını kur** (2.4). Next.js'te `app/film/[senaryo]/page.tsx` ya da `public/film/` altında statik HTML. **Yalnızca geliştirmede** servis et.
4. **Senaryoyu yaz** (2.5): önce kâğıt üstünde saniye tablosu (sahne, görüntü, ekran yazısı, ses olayı), sonra timeline.
5. **SNAP ile ayarla:** 8–12 kontrol karesi al, kareleri birleştirip incele, düzelt.
6. **Tam çekim:** dikey + yatay.
7. **Ses:** efektler, müzik, miks. Spektrogramla yapıyı kontrol et (`ffmpeg -lavfi showspectrumpic`). Seslendirme varsa son sesi Whisper ile yazıya döktür.
8. **Teslim:** iki MP4 + kısa rapor (ne yapıldı, ne doğrulanamadı).

### Next.js'e özel notlar (bu site Next.js 16 + R3F)
- `next dev` değil, **`next build && next start`** ile çek. Geliştirme modunda HMR websocket'i, hata katmanı ve React StrictMode'un çift render'ı kayda karışır.
- Next.js bu sürümde değişmiş olabilir. Route yazmadan önce `node_modules/next/dist/docs/` okunmalı (`AGENTS.md`).
- Client component'lerde film modu: `useSearchParams()` ya da `typeof window !== 'undefined' && location.search.includes('film')`. Hydration uyumsuzluğu olmasın; film moduna özgü UI'yı `useEffect` içinde aç.
- R3F `<Canvas gl={{ preserveDrawingBuffer: film }} dpr={film ? 2 : [1, 1.75]} frameloop="always">`. Kamera film modunda `useFrame` içinde dışarıdaki `cam` nesnesinden okunur.
- `next/image` lazy yükler. Film modunda `priority` ya da `loading="eager"` kullanılmalı.
- `@vercel/analytics` ve `speed-insights` film modunda render edilmemeli.

---

## 4. Tuzaklar (hepsi yaşandı)

1. **`page.evaluate` nesne döndürmesin.** GSAP timeline döndürülünce puppeteer serileştirirken kilitlendi. Doğrusu `() => { window.__filmStart(); }`.
2. **Lazy görseller headless'ta yüklenmez,** ısınma bitmez. Film modunda eager + 8 sn üst sınır.
3. **WebGL kareleri boş çıkar:** `preserveDrawingBuffer: true` şart. Bu, iframe içindeki canvas'lar için de geçerli.
4. **Isınma gerçek zaman ister.** Ağ, görsel çözme ve shader derleme sanal saatle hızlanmaz. Her `__advance` arasında 10 ms gerçek bekleme.
5. **Headless'ta kaydırma olayları gelmez.** API ile kaydır (`scrollTo` + GSAP), etkileşimleri doğrudan çağır.
6. **Önizleme panelleri animasyonu kısar** (gizli sekmede 3 fps). Görsel kontrol daima headless + sanal saatle yapılır.
7. **`clip` ile ekran görüntüsü alınacaksa** `captureBeyondViewport: false` kullan. Daha güvenlisi tam kareyi alıp ffmpeg'de kırpmak.
8. **CSS `transform` SVG'nin `transform` niteliğini ezer.** SVG grupları GSAP `attr: { transform }` ile tweenlenir.
9. **Chrome'da `clipPath` + `textPath` çalışmaz,** `mask` kullanılır. Değişken fontta `stroke` iç konturları gösterir; dış hat için `feMorphology` filtresi kullanılır.
10. **Kod içi yorumlar tek satırlık ifadeleri bozabilir.** Patch'ten sonra her zaman `node --check` çalıştır.
11. **Sentezlenmiş ses denetlenemez.** Ajan sesi duyamaz. Doğrulama spektrogram, LUFS ölçümü ve Whisper ile yapılır. Kalan belirsizlik kullanıcıya açıkça söylenir.
12. **Ürün hakkında iddia yazma.** Görselde ne olursa olsun, metinler sitenin gerçekten sattığı/sunduğu şeyi anlatmalı.

---

## 5. Kabul testi (teslimden önce)

- [ ] `SNAP` kareleri: her sahne geçişinde kare boş değil, yazılar taşmıyor, iki formatta da yerleşim doğru.
- [ ] `ffprobe`: 1080×1920 / 1920×1080, 60 fps, süre hedefle aynı, AAC var.
- [ ] `ffmpeg -af ebur128=peak=true`: I ≈ −14 LUFS, tepe ≤ −1 dBFS.
- [ ] Spektrogram: müzik bölümleri ve vurgu anları senaryodaki saniyelerde.
- [ ] Seslendirme varsa: Whisper dökümü metinle aynı ve saniyeler tutuyor.
- [ ] Aynı komut ikinci kez çalıştırıldığında çıktı aynı (deterministik).
- [ ] Production build'de `/film` rotası açık değil.

---

## 6. Referans dosyalar (`referans/`)

| Dosya | Ne | Yeni sitede |
|---|---|---|
| `time-shim.js` | Sanal saat | Olduğu gibi kullanılabilir |
| `record.mjs` | Kayıt + SNAP + miks çağrısı | `SCENES`, port ve URL uyarlanır |
| `dsp.mjs` | Filtre, yankı, WAV, ffmpeg çözme | Olduğu gibi |
| `sfx.mjs` | Efekt sentezi | Yeni efektler eklenir |
| `muzik.mjs` | 80'ler jingle aranjmanı (Neşe'ye özel) | Örnek alınır; yeni filmin saniyelerine ve markasına göre yeniden bestelenir |
| `koro.mjs` | Vokoder koro | İsteğe bağlı |
| `miks.mjs` | Stem dengesi, ducking, loudnorm, mux | Olduğu gibi (senaryo adı parametre) |
| `seslendir.py` | XTTS/edge-tts + Whisper seçimi | İsteğe bağlı |
| `senaryo-ornegi.js` | Retro TV reklamı yönetmen dosyası | Yapı örneği: TV dokusu, yazılar, 3D kamera, site API çağrıları |
| `metin-ornegi.json` | Ekran yazısı / seslendirme / ses zinciri / koro | Şema örneği |

---

## 7. Başka bir ajana verilecek talimat (kopyala-yapıştır)

> `docs/video-motoru/SARTNAME.md` dosyasını baştan sona oku ve bu sitenin 30 saniyelik tanıtım filmini o şartnameye göre üret.
> - Video düzenleme programı kullanma; siteyi headless Chrome'da sanal saatle oynatıp kare kare kaydet (`referans/time-shim.js`, `referans/record.mjs`).
> - Siteye yalnızca `?film=1` film modunu ekle (bölüm 2.2): giriş/rastgelelik/analytics kapalı, lazy yükleme kapalı, WebGL `preserveDrawingBuffer`, kumanda API'si. Normal kullanıcıya etkisi olmasın.
> - Çekim sayfasını yalnızca geliştirmede servis edilen bir rotada kur. Senaryoyu tek bir duraklatılmış GSAP timeline'ı olarak yaz. Ses olaylarını `window.__sfx` ile aynı dosyada tanımla.
> - Önce saniye saniye bir senaryo tablosu öner ve onay al. Sonra SNAP kareleriyle ayarla, sonra dikey + yatay tam çekim yap.
> - Ses: kodla sentezlenen efekt + filmin saniyelerine yazılmış özgün müzik (telifsiz). Seslendirme yalnızca istenirse. −14 LUFS.
> - Next.js: `next build && next start` ile çek; `node_modules/next/dist/docs/` rehberine uy.
> - Bölüm 5'teki kabul testlerini çalıştır. Ne doğrulandı, ne doğrulanamadı (ör. müziği duyamadın), açıkça raporla.
