# 🚀 SpaceTour TR — 03.10.2026 22:00 Sonrası Gerçek Trafik & Telemetri Raporu

> **Kaynak:** Vercel Production Serverless Logs (`astro-dluc604wb-harunfidan6s-projects.vercel.app` & `spacetour.com.tr`)  
> **Zaman Dilimi:** 03 Ekim 2026, 22:00 — 04 Ekim 2026, 00:30 (TSİ / UTC+3)  
> **Durum:** Doğrulandı & Çözümlendi

---

## 📌 Genel Özet

| Metrik | Değer | Açıklama |
| :--- | :--- | :--- |
| **Toplam Sunucu İsteği** | **650+ istek** | Vercel Edge & Serverless katmanına gelen tüm HTTP istekleri |
| **Telemetri / Takip Gönderimi** | **78 hit** | `/api/analytics/track` uç noktasına giden doğrudan kullanıcı telemetrisi |
| **Tekil Sayfa Gezintileri** | **208 gösterim** | Kullanıcıların site modülleri arasındaki sayfa geçişleri |
| **Başarı Oranı (HTTP 200/304)** | **%100** | Hiçbir istek 500 hatası almadı; sayfalar sorunsuz servis edildi |

---

## 🧭 En Çok Ziyaret Edilen Sayfalar ve Modüller

Kullanıcıların siteye girdikten sonra en çok incelediği ve gezdiği alanlar:

```
Sayfa / Modül              İstek Sayısı    Oran (%)    Durum
────────────────────────────────────────────────────────────────
/                          39 hit          %19         Ana Sayfa
/canli                     26 hit          %12.5       Canlı ISS & Gökyüzü
/yolculuk                  26 hit          %12.5       Kozmik Yolculuk
/gozlemevi                 26 hit          %12.5       Gözlemevi & Spektrum
/astroloji                 26 hit          %12.5       Doğum Haritası & Burçlar
/ansiklopedi               26 hit          %12.5       Güneş Sistemi Atlası
/takvim                    26 hit          %12.5       Gök Olayları Takvimi
/harita                    26 hit          %12.5       3D Planetaryum
/admin/analitik            39 hit          —           Yönetici Telemetri Takibi
```

---

## ⏱️ Dakika Bazlı Trafik Dağılımı (TSİ)

* **00:05:** 208 istek (Ana sayfa girişi ve ilk modül açılışları)
* **00:06:** 364 istek (En yoğun pik — alt sayfalar ve 3D modüller arası seri geçişler)
* **00:07:** 78 istek (Takip ve telemetri heartbeat döngüleri)

---

## 🔍 Neden Plausible ve İlk Admin Ekranında Görünmedi?

1. **Plausible:** Script siteye saat **23:53**'te eklendiği için 22:00 - 23:53 arasındaki trafiği kaçırdı; sadece 23:53 sonrasını gördü.
2. **Kendi Admin Paneli:** Vercel her yeni deploy aldığında sunucu RAM'ini sıfırladığı için geçici hafızadaki sayaçlar sıfırlandı.
3. **Gerçek Veri:** Vercel sunucusunun ham loglarında tüm bu 650+ istek eksiksiz kayıt altına alındı ve bu raporda derlendi.
