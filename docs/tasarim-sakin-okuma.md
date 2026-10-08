# SpaceTour TR · İç sayfalar "sakin okuma" düzeni — uygulama şartnamesi

Next.js 16, Tailwind v4, App Router. Site Türkçe; tüm görünür metin Türkçe kalır.

## Amaç
Kullanıcı siteyi "yorucu" buluyor. Ana sayfa iyi; **iç sayfalar** sakinleştirilecek. Sitenin karakteri (koyu zemin,
altın/bölüm vurgu rengi, Archivo + Instrument Serif + Geist yazı tipleri, belgesel fotoğraflar) korunur; yalnızca
gürültü azaltılır. Bilgi, işlev, bağlantılar, SEO yapısı (h1/h2 hiyerarşisi, JSON-LD) değişmez.

Yorgunluğun nedenleri (tespit edildi):
1. Her başlık bağırıyor: çok geniş, büyük harfli dev başlık + renkli italik serif + harf aralıklı mono künye + büyük harfli mono hap etiketler aynı blokta.
2. Süs künyeleri: "Bölüm 04 ——— …", "Kısım II", "Salon 01", "I. ODA", "04.1.1" numaraları, "EZOTERİK METİN · …" gibi yan künyeler, köşe nişangâhları (Ticks).
3. Soluk ve küçük metin: açıklamalar text-paper/50–/65, etiketler 9–10 px, aşırı harf aralığı (tracking 0.2–0.35em).
4. Fotoğraf/gravür üstüne yazı: kart başlıkları ve büyük numaralar meşgul görsellerin üstünde.
5. Kelime ortasından kırılan başlıklar (ör. "ASTROLOJİNİ / N temelleri") — `break-words` + dev büyük harf.

## Yapılanlar (7 Ekim 2026, PR #4)
- `src/app/globals.css` sonunda **"İç sayfalar: sakin okuma düzeni"** bloğu: `main:not(:has(> [data-home]))` kapsamında
  `.doc-title` (h1 dışındakiler) normal yazım/dar/700; `:is(h2,h3,h4).display` normal yazım; `.doc-kicker` 12px/0.12em;
  `.doc-caption` 11px/0.06em/%62 opaklık; `.label` 0.75rem/0.08em; `.ticks > .tick` gizli.
- `ChapterHero` (iç sayfa başlık bandı): "Bölüm X ———" künyesi kaldırıldı (içerik yolu varsa), daha kısa (band 56svh, full 88svh), h1 daha küçük, kayan metin solması ve "Kaydır" ipucu kaldırıldı.
- `PartHeading`: "Kısım II" künyesi ve sağ yan künye kaldırıldı; başlık normal yazımla clamp(1.6rem,3.4vw,2.75rem), açıklama text-paper/80.

## CSS gerçeği (önemli)
globals.css'teki özel sınıflar (`.doc-*`, `.label`, `.display`) **katmansız** (unlayered); Tailwind yardımcı sınıfları
`@layer utilities` içinde. Katmansız kural her zaman kazanır: `doc-caption text-gold` yazmak rengi DEĞİŞTİRMEZ (gri kalır),
`doc-kicker text-[10px]` 12px olur. Bir künyenin rengini/boyutunu değiştirmek istiyorsan ya o sınıfı kaldır ya `style={{ }}` kullan.

## Kurallar (iç sayfalarda uygula)
R1 Başlıklar: Sayfada büyük harfli dev başlık yalnızca h1 (ChapterHero). Diğer başlıklarda `uppercase`, `tracking-[…]` geniş,
   `font-stretch` genişletme kullanma; boyut makul olsun: bölüm h2 ≤ ~2.75rem (masaüstü), kart/alt başlık 1.125–1.5rem.
   `doc-title` kullanan h2/h3'ler CSS sayesinde zaten normal yazıma döner — ama elle eklenmiş `uppercase`/`text-5xl+`/
   `tracking-widest` sınıflarını kaldır, gereksiz büyük boyutları küçült.
R2 Künyeler: Süs amaçlı künyeleri KALDIR: "Bölüm 0X", "Kısım …", "Salon 0X", "I. ODA/II. ODA", "04.1.1" tarzı hiyerarşik
   numaralar, "EZOTERİK METİN · …", "Arama & Bilgi Merkezi" gibi yan künyeler, dekoratif `doc-rule` çizgileri (başlık başına en
   fazla bir ince çizgi). İşlevsel etiketleri KORU: form alanı adları, tablo başlıkları, birimler, durum rozetleri, tarih/saat.
   Kalan mono etiketler: en az 11px (tercihen 12px), harf aralığı ≤ 0.1em; `tracking-[0.2em]` ve üstünü düşür.
R3 Metin okunurluğu: paragraf/açıklama metni en az `text-paper/80` (tercihen /85) ve en az 15–16px (`text-base`);
   ikincil bilgi en az 13–14px ve `text-paper/70`. 9–10px metin bırakma (görsel künyesi/lisans satırı hariç; o da ≥ 11px).
R4 Görsel üstü yazı: Kart düzenlerinde görsel üstte, başlık ve açıklama altta düz zeminde olsun (fotoğrafın üstüne bindirme
   yapma). Görsel üstüne bindirilmiş büyük numaraları ("04.1.1", "01") kaldır. Tam ekran ChapterHero istisnadır.
R5 Hap/etiket listeleri: büyük harfli, harf aralıklı mono haplar → normal yazımlı küçük sans (`text-xs`/`text-sm`), az sayıda.
R6 Hareket: sonsuz döngülü dekoratif animasyonları (nabız, ping, kayan bant, dönen halka) iç sayfa kabuğunda/hub'larda azalt
   ya da kaldır; işlevsel olanlar (canlı veri göstergesi tek nokta) kalabilir. `SplitReveal` gibi harf harf animasyonu ara
   başlıklarda kullanma (h1'de kalabilir).
R7 Boşluk ve ritim: bölümler arası dikey boşluk tutarlı (py-14/sm:py-20 civarı); tekrar eden içerik varsa (aynı listeyi iki kez
   gösteren bloklar) birini kaldırmak serbest, ama bağlantı/işlev kaybetme.
R8 Kırılma: başlıklarda kelime ortasından kırılmayı engelle (`break-words`/`break-all` başlıklardan kaldır; gerekirse boyutu
   küçült). 390px genişlikte taşma olmamalı.

## Yasaklar
- ANA SAYFAYA ETKİ YOK: `src/app/page.tsx`, `src/components/home/*`, `src/components/doc/ChapterPanel.tsx`,
  `src/components/space/PlanetOrb.tsx`, `src/components/motion/*`, `src/components/ui/CosmicGlyphs.tsx`,
  `src/components/layout/*` (üst/alt bilgi), `src/app/layout.tsx` dosyalarına DOKUNMA. globals.css'te mevcut kuralları
  değiştirme; ekleme gerekiyorsa yalnızca "İç sayfalar" bloğuna ve aynı `main:not(:has(> [data-home]))` kapsamıyla.
- Araç bileşenlerinin içi (`src/components/space/*`, `src/components/doc/ModuleRenderer.tsx`) bu turda kapsam dışı.
- Yalnızca sana atanan dosyaları düzenle. Bir bileşeni ancak YALNIZCA senin sayfaların tarafından import ediliyorsa
  (grep ile doğrula) düzenleyebilirsin; raporda belirt.
- Metin anlamını, veriyi, bağlantı adreslerini, aria etiketlerini, JSON-LD'yi, görsel künyelerini (lisans gereği zorunlu)
  kaldırma/bozma. Yeni bağımlılık ekleme. Git commit/push YAPMA.

## Kontrol (her ajan kendi dosyaları için)
- `npx eslint <dosyaların>` temiz olmalı. `npx tsc --noEmit -p .` hatasız olmalı (başka ajanların yarım işleri yüzünden hata
  görürsen yalnızca kendi dosyalarındaki hataları düzelt ve raporla).
- Derleme (`next build`) ve sunucu çalıştırma YAPMA; görsel kontrol ayrı aşamada yapılacak.

## Sıradaki tur: araçların iç ekranları
PR #4 sayfa kabuklarını, hub'ları ve içerik sayfalarını sadeleştirdi; araçların kendi ekranları (`src/components/space/*`,
`src/components/doc/ModuleRenderer.tsx` eşlemesi) dokunulmadan kaldı. Aynı R1–R8 kuralları bu bileşenlere uygulanacak.
Öncelik: astroloji araçları (NatalChartCalculator, SynastryChartCalculator, ZodiacCompatibility, CosmicTarotDrawer,
DailyHoroscopeDeck, StarOracleWidget, DailyCosmicTransitWidget, LunarPhaseTracker, CosmicRetrogradeRadar,
CosmicNumerologyMatrix), sonra harita, ansiklopedi laboratuvarı, gözlemevi ve canlı bölümlerinin araçları.
Hesaplama mantığına, durum yönetimine ve film modu (`?film=1`, `window.__film`) seçicilerine dokunulmaz; yalnızca görünüm.
