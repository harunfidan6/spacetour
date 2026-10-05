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

## P2 — Hız (mobil: ana sayfa 44/100, LCP 8,3 sn, TBT 1,5 sn, 3,5 MB; günlük burç 61/100, LCP 7,3 sn)

- [ ] 3D sahneleri görünür olunca / boşta yükle; ilk ekranda hafif görsel. Hedef LCP < 2,5 sn.
- [ ] Kullanılmayan JS (sayfa başı 200–400 KB): three.js ve GSAP sahnelerini parçalara böl.
- [ ] İlk ekran görseline öncelik, yazı tiplerini önden yükle ve alt kümele.
- [ ] Astroloji sayfalarında ~180 KB HTML: metnin bir kısmını sunucu bileşenine taşı.

## P3 — Erişilebilirlik (Lighthouse 84–89)

- [ ] Renk kontrastı, izin verilmeyen aria özellikleri, ad/etiket uyuşmazlığı, başlık sırası, dokunma hedefi, tanım listesi.

## P4 — İçerik (en büyük kazanç)

- [ ] Burç başına günlük yorum sayfaları (12): `/astroloji/gunluk-burc/koc`, her gece yenilenir.
- [ ] Burç uyumu ikilileri (78): `/astroloji/burc-uyumu/koc-aslan`.
- [ ] Ay sayfaları: "ay bugün hangi burçta", aylık ay evreleri.
- [ ] Retro takvimi: `/astroloji/retrolar/merkur-2026`.
- [ ] Gök olaylarına ayrı sayfalar ve yıl özeti.
- [ ] ISS görünürlüğü (büyük şehirler).
- [ ] Araç sayfalarına "nasıl hesaplanır" ve gerçek soru-cevaplar; gezegen sayfalarına soru-cevap.

## P5 — Güven sinyalleri

- [ ] Hakkında, İletişim, Gizlilik/KVKK, Çerez politikası.
- [ ] Yöntem ve kaynaklar sayfası (hesaplama yöntemi, görsel kaynakları).

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
