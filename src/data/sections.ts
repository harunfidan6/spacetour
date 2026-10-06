/**
 * Site map for the documentary layout: every section is a hub page ("bölüm"),
 * every tool lives on its own sub-page ("kısım"). Pure data — no React here, so
 * both server pages (metadata, static params) and client components can use it.
 */
import { DOC_IMAGES } from './docImages';
import { ASTRO_IMAGES, type AstroImage } from './astroImages';

export type SectionId = 'harita' | 'takvim' | 'ansiklopedi' | 'astroloji' | 'gozlemevi' | 'canli' | 'yolculuk';

export interface DocModule {
  /** URL segment under the section's module base. */
  slug: string;
  /** Full title shown on the module page. */
  title: string;
  /** Short label for indexes and navigation. */
  short: string;
  blurb: string;
  /** What kind of thing it is: Simülasyon, Hesaplayıcı, Atlas… */
  kind: string;
  image: AstroImage;
  /** Hub grouping (astrology workspaces). */
  group?: string;
  /** Tool wants the full viewport (planetarium). */
  immersive?: boolean;
}

/** A hub entry that is its own page but not a tool (lists, atlases). */
export interface DocCollection {
  href: string;
  title: string;
  blurb: string;
  kind: string;
  image: AstroImage;
  group?: string;
}

export interface DocSection {
  id: SectionId;
  href: string;
  chapter: string;
  title: string;
  /** Hero headline: plain word + italic serif word. */
  headline: [string, string];
  kicker: string;
  lede: string;
  accent: string;
  image: AstroImage;
  /** Prefix for module URLs (defaults to href). */
  modulesBase?: string;
  modules: DocModule[];
  collections?: DocCollection[];
  /** Ordered group names for hubs that cluster their modules. */
  groups?: { name: string; description: string }[];
}

const img = DOC_IMAGES;

export const SECTIONS: DocSection[] = [
  {
    id: 'harita',
    href: '/harita',
    chapter: '01',
    title: 'Gök Haritası',
    headline: ['Gök', 'kubbesi'],
    kicker: '3D gök küresi & gözlem araçları',
    lede: 'Ekliptik ve zodyakla 3D gök küresi, en parlak kerteriz yıldızları, ışık kirliliği analizi ve Messier derin uzay atlası.',
    accent: 'var(--lime)',
    image: img['sec-harita'],
    modules: [
      {
        slug: 'planetaryum',
        title: '3D gök küresi',
        short: '3D gök küresi',
        blurb: 'Dünya’nın çevresindeki gök küresini döndür: ekvator, ekliptik, zodyak, takımyıldızlar ve gezegenlerin gerçek konumları.',
        kind: 'Etkileşimli 3D',
        image: img['harita-planetaryum'],
      },
      {
        slug: 'parlak-yildizlar',
        title: 'Gökkubbe kerterizleri',
        short: 'En parlak 8 yıldız',
        blurb: 'Kadir, tayf türü, uzaklık ve anlık Alt-Az koordinatlarıyla gece göğünün devleri.',
        kind: 'Yıldız kataloğu',
        image: img['harita-parlak-yildizlar'],
      },
      {
        slug: 'bortle',
        title: 'Işık kirliliği & gökyüzü karanlığı',
        short: 'Bortle skalası',
        blurb: 'Sınıf 1 (saf karanlık) ile Sınıf 9 (şehir merkezi) arasında kaybolan yıldızları gör.',
        kind: 'Simülasyon',
        image: img['harita-bortle'],
      },
      {
        slug: 'messier',
        title: 'Messier derin uzay hedefleri',
        short: 'Messier hedefleri',
        blurb: 'Kuzey göğünün en görkemli galaksileri, bulutsuları ve yıldız kümeleri.',
        kind: 'Atlas',
        image: ASTRO_IMAGES.m42,
      },
      {
        slug: 'polaris',
        title: 'Kutup yıldızı & presesyon çemberi',
        short: 'Kutup yıldızı & presesyon',
        blurb: 'Büyük Ayı’dan Polaris’e yıldız atlama ve 25.772 yıllık presesyon döngüsü.',
        kind: 'Rehber',
        image: img['harita-polaris'],
      },
      {
        slug: 'samanyolu',
        title: '3D Samanyolu Galaksisi & Nokta Bulutu',
        short: '3D Samanyolu',
        blurb: '100.000 ışık yılı genişliğindeki galaksimizin 28.000 yıldızlı spiral kolları, Sagittarius A* süper kütleli çekirdeği ve Güneş Sistemimizin konumu.',
        kind: '3D Galaksi Haritası',
        image: img['harita-planetaryum'],
        immersive: true,
      },
    ],
  },
  {
    id: 'takvim',
    href: '/takvim',
    chapter: '02',
    title: 'Olay Takvimi',
    headline: ['Gök olayları', 'takvimi'],
    kicker: 'Tutulmalar, meteor yağmurları, kavuşumlar',
    lede: 'Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları, ekinokslar. Gözlem planını yap, geri sayımı başlat, gökyüzüyle randevulaş.',
    accent: 'var(--solar)',
    image: img['sec-takvim'],
    modules: [],
  },
  {
    id: 'ansiklopedi',
    href: '/ansiklopedi',
    chapter: '03',
    title: 'Ansiklopedi',
    headline: ['Kozmik', 'arşiv'],
    kicker: 'Gök cisimleri, laboratuvar, takımyıldızları',
    lede: 'Gök cisimlerinin kimlik kartları, dokunabileceğin 3D hologramlar ve evrenin fiziğini deneyerek öğreten on laboratuvar modülü.',
    accent: 'var(--violet)',
    image: img['sec-ansiklopedi'],
    modulesBase: '/ansiklopedi/laboratuvar',
    collections: [
      {
        href: '/ansiklopedi/gok-cisimleri',
        title: 'Gök cisimleri',
        blurb: 'Güneş’ten Plüton’a kimlik kartları: 3D hologram, fiziksel veriler ve bilimsel rapor.',
        kind: 'Kayıt arşivi',
        image: img['ansik-gok-cisimleri'],
      },
      {
        href: '/ansiklopedi/takimyildizlar',
        title: 'Takımyıldızları',
        blurb: 'Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları, en iyi gözlem ayları ve mitolojik hikâyeleriyle.',
        kind: 'Gökyüzü haritası',
        image: img['ansik-takimyildizlar'],
      },
    ],
    modules: [
      { slug: 'kepler-orrery', title: '3D Kepler orrery’si', short: 'Kepler orrery’si', blurb: 'Gezegenlerin gerçek oranlı yörünge hızlarıyla dönen üç boyutlu Güneş Sistemi çarkı.', kind: '3D simülasyon', image: img['lab-orrery'] },
      { slug: 'olcek', title: 'Gezegen ölçek karşılaştırıcı', short: 'Ölçek karşılaştırıcı', blurb: 'Gezegenleri yan yana koy, çaplarının gerçek oranını gör.', kind: 'Karşılaştırma', image: img['lab-olcek'] },
      { slug: 'kutlecekim', title: 'Kütleçekim hesaplayıcı', short: 'Kütleçekim', blurb: 'Kendi kütlenle her gezegende ne kadar geldiğini ve ne kadar zıplayabileceğini hesapla.', kind: 'Hesaplayıcı', image: img['lab-kutlecekim'] },
      { slug: 'zaman-makinesi', title: 'Kozmik zaman makinesi', short: 'Zaman makinesi', blurb: 'Büyük Patlama’dan bugüne evrenin kilometre taşları.', kind: 'Zaman çizelgesi', image: img['lab-zaman'] },
      { slug: 'otegezegenler', title: 'Ötegezegen gezgini', short: 'Ötegezegenler', blurb: 'Yaşanabilir kuşaktaki en ilginç ötegezegenleri karşılaştır.', kind: 'Atlas', image: img['lab-otegezegen'] },
      { slug: 'asteroit-carpmasi', title: 'Asteroit çarpışma simülatörü', short: 'Asteroit çarpması', blurb: 'Çap, hız ve yoğunluğu ayarla; krater ve enerjiyi hesapla.', kind: 'Simülasyon', image: img['lab-asteroit'] },
      { slug: 'kara-delik', title: 'Kara delik & zaman genleşmesi', short: 'Kara delik', blurb: 'Olay ufkuna yaklaştıkça saatlerin nasıl yavaşladığını gör.', kind: '3D simülasyon', image: img['lab-karadelik'] },
      { slug: 'hohmann-transferi', title: 'Hohmann transfer yörüngesi', short: 'Hohmann transferi', blurb: 'İki gezegen arasındaki en verimli rotayı ve fırlatma penceresini hesapla.', kind: 'Yörünge mekaniği', image: img['lab-hohmann'] },
      { slug: 'kutlecekim-dalgalari', title: 'LIGO kütleçekim dalgası interferometresi', short: 'Kütleçekim dalgaları', blurb: 'Çarpışan kara deliklerin uzayzamanda yarattığı dalgalanmayı simüle et.', kind: 'Simülasyon', image: img['lab-ligo'] },
      { slug: 'kozmik-arka-plan', title: 'Planck kozmik mikrodalga arka planı', short: 'Kozmik arka plan', blurb: 'Evrenin ilk ışığındaki sıcaklık dalgalanmaları ve geometrisi.', kind: 'Kozmoloji', image: img['lab-cmb'] },
    ],
  },
  {
    id: 'astroloji',
    href: '/astroloji',
    chapter: '04',
    title: 'Astroloji',
    headline: ['Zodyak', 'atlası'],
    kicker: 'Haritalar, kehanet, transitler, numeroloji',
    lede: 'Kadim gökyüzü gözlemleriyle şekillenen on iki arketip. Doğum haritanı çıkar, günlük transitleri oku, tarot çek, iki haritayı karşılaştır.',
    accent: 'var(--gold)',
    image: img['sec-astroloji'],
    groups: [
      { name: 'Doğum & Sinastri', description: 'Bireysel doğum haritası, eşzamanlı sinastri analizi ve burçlar arası çekim kimyası.' },
      { name: 'Tarot & Kehanet', description: '22 Majör Arkana kozmik tarot açılımı, 12 burç günlük falı ve Keldani gezegen saatleri.' },
      { name: 'Transitler & Ay', description: 'Canlı efemeris transitleri, Ay fazları & Boşluktaki Ay (VoC) ritüelleri ve retro radarı.' },
      { name: 'Numeroloji & Zodyak', description: 'Pisagor 4 sütunlu kozmik numeroloji matrisi ve 12 zodyak takımyıldızının derin arşivi.' },
    ],
    collections: [
      {
        href: '/astroloji/burclar',
        title: 'On iki arketip',
        blurb: 'Her burcun elementi, yönetici gezegeni, mitolojik arketipi ve tarot karşılığı; her burcun kendi dosyası.',
        kind: '12 burç arşivi',
        image: img['astro-burclar'],
        group: 'Numeroloji & Zodyak',
      },
    ],
    modules: [
      { slug: 'dogum-haritasi', title: 'Doğum haritası, gezegenler & açı şebekesi', short: 'Doğum haritası', blurb: 'Doğum anının gökyüzünü çıkar: Güneş, Ay ve Yükselen üçlüsü, 12 ev, gezegen yerleşimleri ve açılar.', kind: 'Hesaplayıcı', image: img['astro-dogum-haritasi'], group: 'Doğum & Sinastri' },
      { slug: 'sinastri', title: 'Sinastri & ikili doğum haritası karşılaştırması', short: 'Sinastri analizi', blurb: 'İki kişinin doğum anlarındaki Güneş, Ay, Yükselen ve Venüs-Mars fasetlerini karşılaştır.', kind: 'Karşılaştırma', image: img['astro-sinastri'], group: 'Doğum & Sinastri' },
      { slug: 'burc-uyumu', title: 'Burç uyumu', short: 'Burç uyumu', blurb: 'İki burç seç: element sinerjisi, nitelik dengesi ve kadim uyum tablolarına göre bir çekim skoru hesaplıyoruz.', kind: 'Hesaplayıcı', image: img['astro-burc-uyumu'], group: 'Doğum & Sinastri' },
      { slug: 'tarot', title: 'Kozmik tarot açılımı (22 majör arkana & 3 açılım düzeni)', short: 'Kozmik tarot', blurb: '22 majör arkana ve üç açılım düzeniyle günün kartlarını çek.', kind: 'Kehanet', image: img['astro-tarot'], group: 'Tarot & Kehanet' },
      { slug: 'gunluk-burc', title: 'Günlük burç falı & yaşam enerjisi radarı', short: 'Günlük burç falı', blurb: '12 burç için günlük yorum, enerji, aşk ve kariyer radarı.', kind: 'Günlük yorum', image: img['astro-gunluk-burc'], group: 'Tarot & Kehanet' },
      { slug: 'yildiz-fali', title: 'Yıldız falı, Keldani gezegen saatleri & kraliyet yıldızları', short: 'Yıldız falı & saatler', blurb: 'Keldani gezegen saatleri ve dört kraliyet yıldızıyla günün akışı.', kind: 'Kehanet', image: img['astro-yildiz-fali'], group: 'Tarot & Kehanet' },
      { slug: 'transitler', title: 'Canlı efemeris transitleri & gökyüzü nabzı', short: 'Canlı transitler', blurb: 'Gökyüzündeki güncel Ay fazı, gezegen yöneticisi ve 12 burç için günlük arketip rehberi.', kind: 'Canlı efemeris', image: img['astro-transitler'], group: 'Transitler & Ay' },
      { slug: 'ay-evreleri', title: 'Ay evreleri, boşluktaki ay (VoC) & kozmik niyet ritüelleri', short: 'Ay fazları & VoC', blurb: 'Ay’ın evresi, boşluktaki Ay pencereleri ve evreye göre niyet ritüelleri.', kind: 'Ay takvimi', image: img['astro-ay-evreleri'], group: 'Transitler & Ay' },
      { slug: 'retrolar', title: 'Gezegen retroları, gölge periyotları & astrolojik koruma radarı', short: 'Gezegen retroları', blurb: 'Geri hareket dönemleri, gölge periyotları ve bu dönemler için öneriler.', kind: 'Radar', image: img['astro-retrolar'], group: 'Transitler & Ay' },
      { slug: 'numeroloji', title: 'Pisagor kozmik numeroloji matrisi & 4 sütun yaşam yolu', short: 'Numeroloji matrisi', blurb: 'Pisagor 4 sütunlu kozmik numeroloji matrisiyle yaşam yolu sayın.', kind: 'Hesaplayıcı', image: img['astro-numeroloji'], group: 'Numeroloji & Zodyak' },
    ],
  },
  {
    id: 'gozlemevi',
    href: '/gozlemevi',
    chapter: '05',
    title: 'Gözlemevi',
    headline: ['Spektrum', 'gözlemevi'],
    kicker: 'Çok dalgaboylu derin uzay',
    lede: 'Evreni yalnızca gözün gördüğü dar bantta değil; Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle.',
    accent: 'var(--rose)',
    image: img['sec-gozlemevi'],
    modules: [
      { slug: 'spektrum', title: 'Aynı nesne, dört göz', short: 'Gözlem masası', blurb: 'Bir hedef seç, ardından spektrum çubuğunda kaydır. Her dalgaboyu nesnenin başka bir fiziksel sürecini açığa çıkarır.', kind: 'Çok dalgaboylu gözlem', image: img['gozle-spektrum'] },
      { slug: 'webb-hubble', title: 'Hubble vs James Webb', short: 'Hubble vs Webb', blurb: 'Toz bulutlarının ardındaki proto-yıldızları ve ilk galaksileri kaydırıcıyla karşılaştır.', kind: 'Karşılaştırma', image: img['gozle-webb-hubble'] },
      { slug: 'radyo', title: 'Kozmik radyo & pulsar spektrografı', short: 'Radyo spektrografı', blurb: 'Pulsar atımlarını ve Satürn’ün auroral ıslıklarını sese çevir.', kind: 'Sonifikasyon', image: img['gozle-radyo'] },
      { slug: 'gozlemevleri', title: 'Dev teleskoplar atlası', short: 'Mega gözlemevleri', blurb: 'Webb’den ELT’ye, DAG Erzurum’dan ALMA’ya insanlığın en büyük gözleri.', kind: 'Atlas', image: img['gozle-gozlemevleri'] },
      { slug: 'spektroskopi', title: 'Fraunhofer çizgileri & spektral sınıflar', short: 'Yıldız spektroskopisi', blurb: 'O’dan M’ye tayf tipleri, Balmer serisi ve Doppler kayması.', kind: 'Laboratuvar', image: img['gozle-spektroskopi'] },
      { slug: 'transit', title: 'Ötegezegen transit ışık eğrisi', short: 'Transit fotometrisi', blurb: 'Bir gezegen yıldızının önünden geçerken ışıktaki düşüşü ölç.', kind: 'Laboratuvar', image: img['gozle-transit'] },
      { slug: 'akademi', title: 'Astrofizik akademisi', short: 'Astrofizik sınavı', blurb: '10 soruluk sınavla bilgini test et, kişisel sertifikanı oluştur.', kind: 'Sınav', image: img['gozle-akademi'] },
    ],
  },
  {
    id: 'canli',
    href: '/canli',
    chapter: '06',
    title: 'Canlı Gökyüzü',
    headline: ['Gökyüzü', 'canlı'],
    kicker: 'NASA · NOAA · ESA anlık veri',
    lede: 'NASA, NOAA ve ESA veri akışlarıyla Dünya yörüngesindeki istasyondan yıldızlararası sınıra kadar anlık uzay telemetrisi.',
    accent: 'var(--lime)',
    image: img['sec-canli'],
    modules: [
      { slug: 'bu-gece', title: 'Bu gece gökyüzü', short: 'Bu gece', blurb: 'İstanbul’dan bu gece görülebilecek gezegenler, Ay evresi ve karanlık gökyüzü penceresi; JPL yörünge elemanlarıyla hesaplanır.', kind: 'Anlık hesap', image: img['canli-bu-gece'] },
      { slug: 'iss', title: 'Uluslararası Uzay İstasyonu', short: 'ISS canlı konum', blurb: 'İstasyonun anlık konumu, irtifası, hızı ve şehrinden şu anki görünümü.', kind: 'Canlı veri', image: img['canli-iss'] },
      { slug: 'uzay-havasi', title: 'Güneş & uzay hava durumu', short: 'Uzay havası', blurb: 'Güneş rüzgârı, manyetik alan, X-ışını patlamaları ve Kp indeksi; NOAA SWPC verisiyle.', kind: 'Canlı veri', image: img['canli-uzay-havasi'] },
      { slug: 'sondalar', title: 'Yıldızlararası sondalar & uzay araçları', short: 'Derin uzay sondaları', blurb: 'Voyager’lardan James Webb’e: uzaklıklar, hızlar ve ışık hızıyla sinyal gecikmesi.', kind: 'Anlık tahmin', image: img['canli-sondalar'] },
      { slug: 'arsiv-goruntusu', title: 'Arşivden seçki', short: 'Arşiv görüntüsü', blurb: 'NASA ve Webb arşivinden seçilmiş bir görüntü ve hikâyesi.', kind: 'Görüntü', image: img['canli-arsiv'] },
    ],
  },
  {
    id: 'yolculuk',
    href: '/yolculuk',
    chapter: '07',
    title: 'Yolculuk',
    headline: ['Göklerde', 'yolculuk'],
    kicker: 'WebGL · J2000 efemeris',
    lede: 'Güneş Sistemi’nde durak durak gezin; didaktik dizilim ile gerçek J2000 yörünge konumları arasında geçiş yap.',
    accent: 'var(--solar)',
    image: img['sec-yolculuk'],
    modules: [],
  },
];

export function getSection(id: SectionId): DocSection {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section ${id}`);
  return s;
}

export function moduleHref(section: DocSection, mod: DocModule): string {
  return `${section.modulesBase ?? section.href}/${mod.slug}`;
}

export function findModule(id: SectionId, slug: string) {
  const section = getSection(id);
  const index = section.modules.findIndex((m) => m.slug === slug);
  if (index === -1) return null;
  const n = section.modules.length;
  return {
    section,
    module: section.modules[index],
    index,
    prev: section.modules[(index - 1 + n) % n],
    next: section.modules[(index + 1) % n],
  };
}
