# SEO yapılacaklar

Son güncelleme: 7 Ekim 2026. Dayanak: canlı sitenin 73 sayfalık taraması ve Lighthouse mobil ölçümleri (5 Ekim).

## P0 — Teknik hatalar ✅ (6 Ekim)

- Kırık paylaşım görseli (34 sayfa, `/og-preview.png` yoktu): bölüm, gezegen ve burç sayfaları için başlığını yazan otomatik görseller (`src/lib/ogImage.tsx`, `opengraph-image.tsx` dosyaları).
- Yanlış canonical (3 sayfa) ve canonical'ı olmayan laboratuvar sayfası: `buildPageMetadata` ile kendi adresleri.
- `www.spacetour.com.tr` → `spacetour.com.tr` 308 yönlendirmesi (`next.config.ts`).
- H1 eksik 12 sayfa: gezegen adı artık `<h1>` (`FitText heading`), atmosfer sayfasına başlık.
- Var olmayan arama adresine giden SearchAction kaldırıldı.
- Kurum logosu 512×512 PNG (`public/logo-512.png`).
- 60 karakteri aşan başlıklar kısaltıldı; 16 araç sayfasına 120–155 karakterlik açıklama.
- Sitemap: değişiklik tarihi yalnızca her gün değişen sayfalarda, günde bir yenilenir; laboratuvar sayfası eklendi.
- Kalan: sosyal hesaplar (`sameAs`) — hesap adresleri gerekiyor.

## P1 — Arama motorlarına kayıt

- [x] Google Search Console (DNS ile), sitemap gönderildi.
- [x] IndexNow: anahtar dosyası + `node tools/indexnow.mjs` (tümü, yollar veya `--gunluk`).
- [x] Yandex Webmaster: dosyayla doğrulandı (7 Ekim, `public/yandex_c02ad56888861795.html`).
- [ ] Bing Webmaster Tools (şimdilik ertelendi).
- [x] Search Console ↔ Google Analytics bağlantısı (6 Ekim, alan adı mülkü → SpaceTour akışı).

## P2 — Hız (önce mobil: ana sayfa 41/100, LCP 8,4 sn, TBT 1,5 sn)

- [x] 3D sahneler (three.js) ilk boyamadan sonra, sayfa boşa çıkınca yüklenir (`useIdleReady`).
- [x] Gezegen dokuları sitede, çoğu WebP: 4,4 MB → 2,5 MB; kırık Venüs atmosfer dokusu kaldırıldı.
- [x] Google Analytics sayfa yüklendikten sonra.
- [x] Açılış animasyonu yalnızca ziyaret ana sayfada başlarsa.
- [x] Sayfa başı kapak görselleri belirme efektini beklemeden çizilir.
- Sonuç (canlı, mobil): ana sayfa 64/100, LCP 4,1 sn, TBT 570 ms; günlük burç 73/100, TBT 140 ms.
- [ ] Kalan: kapak görsellerinin mobil boyutu, GSAP animasyonlarının ilk yükü, astroloji sayfalarında ~180 KB HTML.

## P3 — Erişilebilirlik ✅ (6 Ekim)

- [x] SplitText başlıkları: parçalar ekran okuyucudan gizli, tam metin görünmez kopya (yasak aria-label kalktı).
- [x] Kontrast: bölüm numaraları, seçili düğme etiketleri, takvim ve SSS numaraları.
- [x] Altbilgi `<dl>` yapısı, konum yolu dokunma alanı, logo bağlantısının adı.
- [x] Başlık sırası: araç bölümlerine görünmez H2, rehber ve gezegen kartı başlıkları H3.
- Sonuç: denetlenen 10 sayfanın hepsi Lighthouse erişilebilirlik 100.

## P4 — İçerik (en büyük kazanç)

- [x] Burç başına günlük yorum sayfaları (12): `/astroloji/gunluk-burc/koc`; sunucuda üretilir, 30 dakikada bir yenilenir, Article şeması, sitemap ve iç bağlantılar (6 Ekim).
- [x] Burç uyumu ikilileri (78): `/astroloji/burc-uyumu/koc-aslan`; FAQPage şeması, ters sıra 308 yönlenir, sitemap ve iç bağlantılar (6 Ekim).
- [x] "Ay bugün hangi burçta" sayfası (`/astroloji/ay-bugun`, 15 dk'da bir yenilenir, 7 günlük Ay takvimi, SSS). Aylık Ay takvimi (`/astroloji/ay-takvimi/ekim-2026`, 2026–2028, 36 ay + dizin): ana evre saatleri, gün gün evre ve burç, FAQPage (7 Ekim).
- [x] Retro takvimi: 5 gezegen × 2026–2027 (`/astroloji/retrolar/merkur-2026`), gerçek istasyon tarihleri, gölge dönemleri, SSS.
- [x] Retro sayfaları derinleştirildi (9 Ekim): TSİ saatli duruşlar, gün gün takvim (gölge, burç geçişleri, iç kavuşum / karşı konum), 12 burca ev ev etkiler, İstanbul’dan görünürlük, genişletilmiş SSS, Article şeması. Elle yazılmış 2026 verisindeki yanlış burç/tarihler artık kullanılmıyor (tarihler hep efemeristen).
- [x] Gök olayı verisi denetlendi (10 Ekim): elle yazılmış 17 ay evresi kaydının çoğu 9–10 gün kaymıştı, 4 "süper ay" aslında mikro aydı, 4 kavuşum gerçekte yoktu. Dolunay/yeni Ay artık efemeristen (`node tools/data/ay-evreleri.mjs`, 2026–2028, geleneksel adlar, Hasat/Avcı kuralı, süper/mikro ay); kavuşumlar hesapla düzeltildi; 21 eski adres 308 ile doğrusuna. Meteor sayfalarına İstanbul’dan zirve gecesi (radyant, Ay, en iyi saatler, beklenen sayı), dolunay/yeni Ay sayfalarına şehir şehir Ay doğuşu ve 12 burca etkiler, SSS + FAQPage.
- [ ] Tutulma metinlerinin Türkiye’den görünürlük iddialarını doğrula (ör. 3 Mart 2026 tam Ay tutulması metni şüpheli).
- [x] 69 gök olayına ayrı sayfa (`/takvim/tam-gunes-tutulmasi-12-agustos-2026`) ve yıl özetleri (`/takvim/2026`…), tür rehberleri ve iç bağlantılar.
- [x] ISS görünür geçişleri, 16 şehir (`/canli/iss-gecisleri/istanbul`): CelesTrak TLE + SGP4, saatte bir yenilenir, FAQPage; canlı ISS takipçisi buraya bağlanır (7 Ekim).
- [x] Gezegen sayfalarına veriden üretilen soru-cevap + FAQPage (uydu sayıları Wikipedia 2026 ile güncellendi: Jüpiter 115, Satürn 293, Uranüs 29).
- [x] 10 astroloji aracına "nasıl hesaplanır" adımları ve araca özel SSS + FAQPage (`src/data/toolMethods.ts`, 7 Ekim). Laboratuvar araçları: kalan.

## P5 — Güven sinyalleri

- [x] Hakkında, İletişim, Gizlilik/KVKK, Çerez politikası (6 Ekim); altbilgide bağlantılar.
- [x] Çerez onay bandı: GA yalnızca "Kabul et" sonrası yüklenir; tercih /cerezler sayfasından değiştirilebilir. Veri sorumlusu: Harun Fidan. info@ e-postası ImprovMX ile yönlendiriliyor (MX + SPF Vercel DNS).
- [x] Yöntem ve kaynaklar sayfası (6 Ekim).

## P6 — Yapılandırılmış veri

- [x] Makale şeması (gezegen, burç, günlük burç, gök olayı): gerçek yayın/güncelleme tarihi, yazar, raster yayıncı logosu, kapak görseli — `getArticleJsonLd`.
- [ ] Yeni sayfalara uygun şema; Zengin Sonuçlar Testi.
- [ ] Tanıtım videoları YouTube'da, ana sayfada video olarak.

## P7 — İç bağlantılar

- [x] Burç ↔ 12 ikili uyum sayfası ↔ günlük yorum ↔ doğum haritası; gök olayları → ilgili gökcisimleri ve o ayın Ay takvimi (7 Ekim).

## P8 — Sosyal ve dış bağlantılar

- [x] Günlük burç paylaşım kartı (günün yorumu + puanlar) ve WhatsApp/X/Telegram/kopyala düğmeleri; tarihli paylaşım bağlantısı (7 Ekim).
- [x] Instagram @spacetourtr: Organization `sameAs`, altbilgi ve İletişim bağlantısı.
- [x] Instagram 1. hafta: 7 kart + açıklamalar (`tools/instagram/`).
- [x] Instagram günlük burç hikâye paketi (`tools/instagram/hikayeler.mjs`, 7 Ekim).
- [ ] Instagram: haftalık yeni kartlar, dikey Reels.
- [ ] Türk astronomi toplulukları, üniversite kulüpleri, basın bülteni.

## P9 — Ölçüm

- [ ] Hedef anahtar kelime listesi, aylık sıralama; Search Console sorgu ve gerçek kullanıcı hız verisi.
