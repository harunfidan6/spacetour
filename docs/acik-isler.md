# Açık işler

Son güncelleme: 4 Ekim 2026.

## Astroloji

1. **Doğum haritası başlığı yanlış bilgi veriyor.** "Placidus ev cuspları" yazıyor (`src/components/space/NatalChartCalculator.tsx`), ama evler Yükselen'den başlayan tam-burç sistemiyle hesaplanıyor.
2. **Burç uyumundaki üç yüzde çubuğu ("Duygusal / Tutku / Zihinsel") gerçek bir hesaba dayanmıyor.**
   - Ana puandan kabaca türetiliyorlar (`src/components/space/ZodiacCompatibility.tsx`).
   - Çoğu ikilide %96–98 gibi şişkin çıkıyorlar.
   - Kaldırılmalı ya da gerçek bir hesaba bağlanmalı.
3. **Yıldız falı sayfası** (`/astroloji/yildiz-fali`) kişiselleştirilmedi ve genişletilmedi; burca veya doğum anına göre değişmiyor.
4. **Sinastrinin yorum metinleri** ayrıntılı incelenmedi (`src/lib/astrology/synastry.ts`, `SynastryChartCalculator.tsx`). Yalnızca Yükselen hesabı düzeltildi.
5. **Numeroloji ek sayıları** (doğum günü, olgunluk, kişisel ay ve gün) yalnızca "Kişisel Yıl" sekmesinde görünüyor; daha görünür bir yere taşınabilir.

## Test

6. **AR kamera (planetaryum):** Telefonun yön sensörüyle gökyüzü takibi gerçek bir telefonda denenmedi.

## Tanıtım videosu (siteyi etkilemez)

7. **Ses ve renk ayarı uygulanmadı.** `npm run film:ses` izin denetimine takıldı. `video/` altındaki videolarda ses tepesi −0,8 dBFS (hedef ≤ −1) ve renk aralığı tam aralık olarak işaretli. Komutu çalıştırınca düzelir.
8. **Video çekimi birebir tekrarlanmıyor.** Aynı komutla iki çekimde kareler aynı çıkmıyor (piksel başına ortalama ~1/255 fark). Isınma süresi değiştiği için film greni ve arka plan yıldızları farklı fazdan başlıyor.

## Yayın

- Vercel'in canlı dalı `main` idi; push'lar `master`'a gittiği için domain güncellenmiyordu.
- 4 Ekim'de `master` elle üretime deploy edildi.
- Kalıcı çözüm: Vercel → astro → Settings → Git → Production Branch = `master`.
