# Açık işler

Son güncelleme: 5 Ekim 2026.

## Astroloji

Açık madde yok. 5 Ekim 2026: Placidus metni, uyum çubukları, yıldız falı, sinastri metinleri ve numeroloji ek sayıları tamamlandı.

## Test

6. **AR kamera (planetaryum):** Telefonun yön sensörüyle gökyüzü takibi gerçek bir telefonda denenmedi.

## Tanıtım videosu (siteyi etkilemez)

Astroloji videosu (`video/spacetour-astroloji-yatay.mp4`) yeni ses zinciriyle üretildi; aşağıdaki iki madde ana tanıtım videosu için geçerli.

7. **Ses ve renk ayarı uygulanmadı.** `npm run film:ses` izin denetimine takıldı. `video/` altındaki videolarda ses tepesi −0,8 dBFS (hedef ≤ −1) ve renk aralığı tam aralık olarak işaretli. Komutu çalıştırınca düzelir.
8. **Video çekimi birebir tekrarlanmıyor.** Aynı komutla iki çekimde kareler aynı çıkmıyor (piksel başına ortalama ~1/255 fark). Isınma süresi değiştiği için film greni ve arka plan yıldızları farklı fazdan başlıyor.

## Yayın

- Vercel'in canlı dalı `main` idi; push'lar `master`'a gittiği için domain güncellenmiyordu.
- 4 Ekim'de `master` elle üretime deploy edildi.
- Kalıcı çözüm: Vercel → astro → Settings → Git → Production Branch = `master`.
