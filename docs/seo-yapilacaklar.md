# SEO yapılacaklar

Son güncelleme: 6 Ekim 2026. Dayanak: canlı sitenin 73 sayfalık taraması ve Lighthouse mobil ölçümleri (5 Ekim).

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
- [ ] Bing Webmaster Tools ve Yandex Webmaster; IndexNow.
- [ ] Search Console ↔ Google Analytics bağlantısı.

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
- [x] "Ay bugün hangi burçta" sayfası (`/astroloji/ay-bugun`, 15 dk'da bir yenilenir, 7 günlük Ay takvimi, SSS). Aylık ay evreleri sayfaları: kalan.
- [x] Retro takvimi: 5 gezegen × 2026–2027 (`/astroloji/retrolar/merkur-2026`), gerçek istasyon tarihleri, gölge dönemleri, SSS.
- [x] 69 gök olayına ayrı sayfa (`/takvim/tam-gunes-tutulmasi-12-agustos-2026`) ve yıl özetleri (`/takvim/2026`…), tür rehberleri ve iç bağlantılar.
- [ ] ISS görünürlüğü (büyük şehirler).
- [ ] Araç sayfalarına "nasıl hesaplanır" ve gerçek soru-cevaplar; gezegen sayfalarına soru-cevap.

## P5 — Güven sinyalleri

- [x] Hakkında, İletişim, Gizlilik/KVKK, Çerez politikası (6 Ekim); altbilgide bağlantılar.
- [x] Çerez onay bandı: GA yalnızca "Kabul et" sonrası yüklenir; tercih /cerezler sayfasından değiştirilebilir. Veri sorumlusu: Harun Fidan. info@ e-postası ImprovMX ile yönlendiriliyor (MX + SPF Vercel DNS).
- [x] Yöntem ve kaynaklar sayfası (6 Ekim).

## P6 — Yapılandırılmış veri

- [ ] Gezegen makalelerine tarih, yazar, yayıncı logosu.
- [ ] Yeni sayfalara uygun şema; Zengin Sonuçlar Testi.
- [ ] Tanıtım videoları YouTube'da, ana sayfada video olarak.

## P7 — İç bağlantılar

- [ ] Burç ↔ günlük yorum ↔ uyum ↔ doğum haritası; takvim olayları ↔ gezegen sayfaları; görünür konum yolu.

## P8 — Sosyal ve dış bağlantılar

- [ ] Günlük burç için otomatik paylaşım görseli, paylaş düğmeleri.
- [ ] Sosyal hesaplar (kısa videolar), `sameAs`.
- [ ] Türk astronomi toplulukları, üniversite kulüpleri, basın bülteni.

## P9 — Ölçüm

- [ ] Hedef anahtar kelime listesi, aylık sıralama; Search Console sorgu ve gerçek kullanıcı hız verisi.
