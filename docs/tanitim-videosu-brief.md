# SpaceTour TR — Tanıtım Videosu Brief'i

> Bu dosya, sitenin tanıtım videosunu hazırlayacak bir yapay zekâ ajanı (ya da editör) içindir.
> Siteyi hiç görmemiş biri bile bu belgeyle doğru tonda, doğru sahnelerle bir video üretebilmelidir.

---

## 1. Site özeti

| | |
|---|---|
| **Ad** | SpaceTour TR |
| **Adres** | https://spacetour.com.tr |
| **Dil** | Türkçe |
| **Konsept** | "Bir uzay belgeseli": 7 bölümlük, sinematik bir gökyüzü atlası |
| **Slogan** | **Evren hiç durmaz.** |
| **Hedef kitle** | Uzaya, gökyüzü gözlemine ve astrolojiye meraklı Türkçe konuşan geniş kitle (16–45 yaş) |
| **Veri kaynakları** | NASA, ESA, NOAA SWPC, JPL yörünge elemanları, Where the ISS at? |

Site bir belgesel gibi kurgulanmıştır: ana sayfa bir "jenerik", her bölüm tam ekran bir fotoğrafla açılan bir "bölüm", her araç da o bölümün bir "kısmı"dır.

---

## 2. Görsel kimlik (videoda birebir kullan)

### Renkler

| Rol | Ad | HEX |
|---|---|---|
| Arka plan | Obsidyen | `#050508` |
| Kart / yüzey | Mürekkep | `#0B0B10` |
| Metin | Kâğıt | `#F4F3EE` |
| **Ana vurgu** | Yıldız altını | `#F5C542` |
| Güneş / takvim | Güneş turuncusu | `#F59E0B` |
| Gök haritası / canlı | Gök mavisi | `#38BDF8` |
| Ansiklopedi | Menekşe | `#818CF8` |
| Gözlemevi | Gül kırmızısı | `#F43F5E` |

### Tipografi

- **Başlıklar:** *Archivo*, çok kalın (800), geniş (font-stretch ~118%), TAMAMI BÜYÜK HARF, sıkı satır aralığı.
- **İkinci başlık kelimesi:** *Instrument Serif*, italik, küçük harf, vurgu renginde. Örnek: **GÖK** *kubbesi* · **ZODYAK** *atlası* · **EVREN** *hiç durmaz.*
- **Altyazı / künye:** *Geist Mono*, küçük, harf aralığı geniş, BÜYÜK HARF. Örnek: `BÖLÜM 03 ——— ANSİKLOPEDİ`

### Hareket ve doku

- Tam ekran fotoğraflar yavaşça yerine oturur (Ken Burns, ~%12 yakınlaşmadan 1.0'a, 6–9 sn).
- Başlıklar harf harf aşağıdan yükselerek gelir (maskeli "rise").
- Bölüm künyesinin yanında soldan sağa altın bir çizgi uzanır.
- Hafif film greni ve alt kenarda koyu degrade (fotoğraf üstünde metin okunsun diye).
- Geçişlerde siyaha kesme ya da yatay perde silme kullan. Neon, glitch veya oyun HUD efektleri **kullanma**; ton belgeseldir, sakin ve görkemli.

### Logo

Koyu kare zemin üzerinde turuncu Güneş, ince beyaz yörünge halkası ve sağda mavi bir gezegen. Dosya: `src/app/icon.svg`. Yazılışı: **Spacetour**<span>.tr</span> (".tr" altın renkte).

---

## 3. Bölümler ve çekilecek sahneler

Her satırdaki adresi aç; "en iyi kare" sütunu o sayfanın en etkileyici anını tarif eder.

| # | Bölüm | Adres | En iyi kare |
|---|---|---|---|
| 00 | Giriş (ana sayfa) | `/` | Canlı 3D Güneş Sistemi üstünde dev "EVREN *hiç durmaz.*" başlığı; gezegenler yörüngede dönüyor, isim etiketleri takip ediyor |
| 01 | Gök Haritası | `/harita` → `/harita/planetaryum` | Lazerle Samanyolu'na uzanan VLT fotoğraflı açılış; ardından 360° canlı planetaryumda sürükleyerek gökyüzünü döndürme, takımyıldızı çizgileri |
| 02 | Olay Takvimi | `/takvim` | 2017 tam Güneş tutulması dizisi fotoğrafı; takvim ızgarası, canlı geri sayım sayacı, meteor yağmuru simülasyonu |
| 03 | Ansiklopedi | `/ansiklopedi` → `/ansiklopedi/laboratuvar/kara-delik` | Cassini'nin Satürn fotoğrafı; laboratuvar kartları (Wright of Derby'nin *Orrery* tablosu, Apollo 16 astronotu); 3D kara delik simülasyonu |
| 04 | Astroloji | `/astroloji` → `/astroloji/burclar/boga` | Cellarius'un 1660 tarihli gök atlası; 1824 *Urania's Mirror* burç kartları (ör. Boğa), 360° doğum haritası çarkı, tarot kartı çekme |
| 05 | Gözlemevi | `/gozlemevi` → `/gozlemevi/spektrum` | Aynı nesneyi (Yengeç Bulutsusu) radyo → kızılötesi → görünür → X-ışını arasında silerek değiştirme; Hubble ve Webb kaydırıcısı (Yaratılış Sütunları) |
| 06 | Canlı Gökyüzü | `/canli` → `/canli/iss` | ISS'in anlık konumu, NOAA uzay hava durumu, "Bu gece gökyüzü" kartları, Voyager 1'in canlı artan mesafesi |
| 07 | Yolculuk | `/yolculuk` | Apollo 17'nin "Mavi Bilye" Dünya fotoğrafı; 3D Güneş Sistemi'nde durak durak sinematik uçuş |

**Bonus kareler:** `/astroloji/burclar` (12 gravür burç kartı ızgarası), `/ansiklopedi/takimyildizlar`, `/gozlemevi/webb-hubble`, `/harita/bortle` (ışık kirliliği; İstanbul'un uzaydan gece görüntüsü).

---

## 4. Senaryo önerileri

> Önceki geri bildirim: **Siteyi baştan sona sayfa sayfa gezdiren bir tur istenmiyor.** Kısa, merak uyandıran, "teaser" tadında videolar tercih ediliyor.

### A) 30 sn dikey (Reels / TikTok / Shorts, 1080×1920)

| Süre | Görüntü | Ekran yazısı |
|---|---|---|
| 0–3 sn | Siyah ekran, altın çizgi uzanır | `BÖLÜM 00 — BİR UZAY BELGESELİ` |
| 3–7 sn | Ana sayfa 3D Güneş Sistemi, başlık harf harf gelir | **EVREN** *hiç durmaz.* |
| 7–11 sn | Planetaryumda gökyüzü döner | **GÖĞÜ** *oku.* |
| 11–15 sn | Gözlemevi: Yengeç Bulutsusu dalgaboyları arasında silinir | **GÖRÜNMEYENİ** *gör.* |
| 15–19 sn | Kara delik simülasyonu | **ZAMANI** *bük.* |
| 19–23 sn | Urania's Mirror burç kartları hızlı kesmelerle | **YILDIZLARINI** *keşfet.* |
| 23–26 sn | ISS canlı konum kartı | **ŞU AN**, *gökyüzünde.* |
| 26–30 sn | Logo + adres, siyah zemin | `spacetour.com.tr` |

### B) 30 sn yatay (YouTube / web, 1920×1080)

Aynı akış; kareler daha geniş, metinler sol alt köşede, belgesel künyesi düzeninde. Her sahnede sağ altta küçük görsel kaynağı künyesi (ör. `GÖRSEL · NASA / ESA`).

### C) 60 sn "bölüm bölüm" fragman

Her bölüm 6–7 sn: önce bölümün açılış fotoğrafı ve `BÖLÜM 0X` künyesi, ardından o bölümün tek bir canlı etkileşimi. En sonda 7 bölüm adı alt alta, ardından logo.

### Seslendirme (isteğe bağlı, Türkçe)

> "Gökyüzü hiç durmadı. Yıldızlar yer değiştirdi, gezegenler yollarını çizdi, ışık milyarlarca yıl yol aldı.
> Şimdi hepsi tek bir yerde. Spacetour. Evren hiç durmaz."

---

## 5. Teknik çekim notları

- **Açılış animasyonunu atla:** Kayıttan önce tarayıcıda `sessionStorage.setItem('spacetour:intro', '1')` çalıştır; site her sayfada açılış perdesini göstermez.
- **Çözünürlük:** Yatay için 1920×1080 pencere; dikey için 390×844 mobil görünümü 3× ölçekle (ya da 1080×1920 pencere) kaydet.
- **3D sahneler:** WebGL için donanım hızlandırma açık olmalı. Sayfa açıldıktan sonra kayda başlamadan önce 4–5 sn bekle (fotoğraflar ve 3D sahneler yüklensin).
- **Canlı veriler** (ISS, uzay havası, "Bu gece") internet bağlantısı ister ve gerçek zamanlıdır; değerler her çekimde farklı olur, bu normal.
- **Kaydırma:** Sayfalar kaydırınca fotoğraf paralaks yapar ve yazılar kaybolur; yavaş, sabit hızlı kaydırma en sinematik sonucu verir.
- Görseller `public/images/space/` klasöründe; videoda doğrudan fotoğraf kullanmak istersen buradan al. Hepsinin kaynağı `src/data/docImages.ts` ve `src/data/astroImages.ts` içinde yazar.

---

## 6. Yapılmaması gerekenler

- `/admin/analitik` (yönetici paneli) ve şifre ekranı **asla** gösterilmez.
- Sitede olmayan bir özellik vaat etme (ör. uygulama, üyelik, mağaza yok).
- Yükleniyor ekranları, boş kartlar veya hata mesajları kadraja girmesin.
- Eski marka adı **AstroTR** kullanılmaz; doğru ad **SpaceTour TR**'dir. (`public/` içindeki eski `AstroTR_*.mp4` dosyaları eski markaya aittir, referans olarak kullanma.)
- Telifli müzik kullanma; telifsiz/lisanslı ambient, orkestral ya da sinematik bir parça seç.

---

## 7. Teslim formatı

- **Dosya:** MP4 (H.264 video, AAC ses), 30 veya 60 fps
- **Sürümler:** `spacetour_30s_dikey.mp4` (1080×1920), `spacetour_30s_yatay.mp4` (1920×1080), isteğe bağlı `spacetour_60s_fragman.mp4`
- **Ses seviyesi:** −14 LUFS (sosyal medya standardı)
- **Ekran yazıları:** Türkçe, videoya gömülü. Ses kapalı izlenince de anlaşılmalı.
- **Kapanış kartı künyesi:** `Görseller: NASA, ESA, CSA, STScI, ESO, Wikimedia Commons ve ilgili sahipleri. Bazı görseller CC BY / CC BY-SA lisanslıdır.`

---

## 8. Görsel lisansları hakkında

Sitedeki fotoğrafların tamamı kamu malı (NASA vb.) ya da Creative Commons lisanslıdır. CC BY / CC BY-SA olanlar (ESO fotoğrafları, Event Horizon Telescope kara delik görüntüsü, bazı Webb görselleri vb.) **kaynak gösterilerek** kullanılabilir. Videoda bu görselleri kullanıyorsan kapanış kartındaki künyeyi mutlaka ekle. Tek tek kaynaklar için `src/data/docImages.ts` dosyasındaki `credit` alanlarına bak.
