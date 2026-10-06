# Instagram hikâyesi · Günlük burç paketi

Her gün 5 hikâye (1080×1920, 9:16): `0-kapak` → `1-ates` → `2-toprak` → `3-hava` → `4-su`.
Yorumlar sitenin günlük burç motorundan üretilir, yani hikâyedeki metin o gün sitedeki yorumun açılış cümlesiyle birebir aynıdır.

Kartlar: `tools/instagram/cikti/hikaye/<gün>/`. Yeniden üretmek için:

```
node tools/instagram/hikayeler.mjs                 # 7–13 Ekim 2026
node tools/instagram/hikayeler.mjs 2026-10-14 7    # sonraki hafta
```

## Paylaşım

- **Saat:** her sabah 07:30–09:00 (günlük burca bakma alışkanlığı sabah).
- **Sıra:** kapak → Ateş → Toprak → Hava → Su. Hepsini tek seferde, bu sırayla yükle.
- **Bağlantı çıkartması:** kapağa ve son kareye (Su) “Bağlantı” çıkartması ekle:
  - Kapak: `https://spacetour.com.tr/astroloji/gunluk-burc` · çıkartma metni: `Detaylı yorumun`
  - Son kare: aynı bağlantı · çıkartma metni: `Burcunun tamamı`
  Çıkartmayı kartın altındaki boşluğa koy; yazıların üstüne gelmesin.
- **Etkileşim (son kareye, isteğe bağlı):** Anket çıkartması `Dünkü yorum tuttu mu?` → `Tuttu ✦` / `Tutmadı`.
  Hafta içinde bir gün de Soru çıkartması: `Hangi burç hakkında daha çok içerik görmek istersin?`
- **Öne çıkan:** ilk günün kapağını “Günlük Burç” adlı öne çıkan hikâyeye ekle; diğer günler otomatik birikir.

## Notlar

- Kapak görseli ve element sayfalarındaki gravürlerin künyesi lisans gereği kartın altında yazılı; kırpma.
- Puanlar (Aşk / İş / Şans) sitedeki günlük yorum sayfasındaki puanlarla aynıdır.
- Hikâyeler gece yarısından sonra İstanbul saatine göre o günün gökyüzünden hesaplanır; tarihi geçmiş bir günün paketini paylaşma.
