import type { Metadata } from 'next';
import { findModule, type SectionId } from '@/data/sections';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { planets } from '@/data/planets';

export const BASE_URL = 'https://spacetour.com.tr';
export const SITE_NAME = 'SpaceTour TR';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph-image`;

/** High-intent Turkish SEO keyword dictionaries tailored per module and subject */
export const MODULE_KEYWORDS: Record<string, string[]> = {
  // Astroloji Enstrümanları
  'astroloji/dogum-haritasi': [
    'doğum haritası hesaplama',
    'ücretsiz natal harita çıkar',
    'yükselen burç hesaplama',
    'astronomi efemerisi',
    'tam burç ev sistemi',
    'astroloji doğum haritası türkiye',
    'gezegen konumları doğum anı',
  ],
  'astroloji/sinastri': [
    'sinastri haritası hesaplama',
    'ilişki uyumu haritası',
    'doğum haritası sinastri analizi',
    'çift uyumu astroloji',
    'evlilik uyumu doğum haritası',
  ],
  'astroloji/burc-uyumu': [
    'burç uyumu',
    'burçların aşk uyumu',
    'en iyi anlaşan burçlar',
    'ateş su toprak hava burç uyumu',
    'zodyak aşk tablosu',
  ],
  'astroloji/tarot': [
    'tarot falı bak',
    'ücretsiz tarot kartı çek',
    'kelt haçı tarot açılımı',
    'tarot kart anlamları',
    'günlük tarot falı',
    'büyük arkana tarot',
  ],
  'astroloji/gunluk-burc': [
    'günlük burç yorumları',
    'bugünkü burç yorumu',
    '12 burç günlük fal',
    'koç boğa ikizler günlük burç',
    'günün astrolojik enerjisi',
  ],
  'astroloji/yildiz-fali': [
    'yıldız falı',
    'arap noktaları astroloji',
    'şans noktası hesaplama',
    'kadim astroloji geometri',
  ],
  'astroloji/transitler': [
    'anlık gökyüzü transitleri',
    'gezegen transitleri 2026',
    'canlı efemeris',
    'ay ve güneş transitleri',
  ],
  'astroloji/ay-evreleri': [
    'ay evreleri takvimi',
    'bugün ayın hangi evresi',
    'yeni ay ve dolunay tarihleri 2026',
    'ay burcu hesaplama',
    'büyüyen ay hilal dolunay',
  ],
  'astroloji/retrolar': [
    'merkür retrosu 2026',
    'gezegen gerilemeleri takvimi',
    'retro tarihleri',
    'mars retrosu',
    'satürn retrosu ne zaman bitiyor',
  ],
  'astroloji/numeroloji': [
    'numeroloji hesaplama',
    'yaşam yolu sayısı bulma',
    'kader sayısı analizi',
    'isim analizi numeroloji',
    'pisagor numeroloji tablosu',
  ],

  // Canlı Takip & Uzay
  'canli/iss': [
    'iss canlı konum',
    'uluslararası uzay istasyonu nerede',
    'iss türkiye üzerinden ne zaman geçecek',
    'canlı uzay kamerası hd',
    'iss takip haritası',
  ],
  'canli/bu-gece': [
    'bu gece gökyüzünde ne var',
    'gökyüzü gözlem rehberi',
    'bu gece görülebilen gezegenler',
    'çıplak gözle yıldız gözlemi türkiye',
  ],
  'canli/uzay-havasi': [
    'uzay havası canlı',
    'güneş patlamaları noaa',
    'jeomanyetik fırtına uyarısı',
    'kp endeksi türkiye',
    'solar rüzgar hızı',
  ],
  'canli/sondalar': [
    'uzay sondaları konumu',
    'voyager 1 ve voyager 2 nerede',
    'james webb teleskobu l2 noktası',
    'yıldızlararası uzay araçları',
  ],
  'canli/aurora': [
    'kuzey ışıkları canlı tahmin',
    'aurora borealis türkiye',
    'jeomanyetik aktivite',
  ],

  // Gök Haritası & Planetaryum
  'harita/planetaryum': [
    '3d gök küresi',
    'ekliptik ve gök ekvatoru',
    'zodyak kuşağı 3d',
    'gezegenlerin konumu bugün',
    'interaktif gökyüzü modeli',
  ],
  'harita/parlak-yildizlar': [
    'en parlak yıldızlar kataloğu',
    'sirius kutup yıldızı polaris',
    'vega betelgeuse rigel',
    'kerteriz yıldızları koordinatları',
  ],
  'harita/bortle': [
    'ışık kirliliği haritası türkiye',
    'bortle karanlık gökyüzü ölçeği',
    'en iyi yıldız gözlem yerleri türkiye',
  ],
  'harita/messier': [
    'messier kataloğu türkçe',
    'derin uzay nesneleri nebulalar',
    'andromeda galaksisi orion bulutsusu',
  ],

  // Ansiklopedi & Laboratuvar
  'ansiklopedi/laboratuvar/kepler-orrery': [
    'kepler yasaları simülatörü',
    'güneş sistemi orrery 3d',
    'gezegen yörünge hızları',
  ],
  'ansiklopedi/laboratuvar/olcek': [
    'evrenin ölçeği türkçe',
    'gezegen ve yıldız boyut karşılaştırması',
    'kozmik ölçek simülasyonu',
  ],
  'ansiklopedi/laboratuvar/kutlecekim': [
    'yerçekimi hesaplama simülatörü',
    'farklı gezegenlerdeki ağırlık',
    'ay ve mars yerçekimi ivmesi',
  ],
  'ansiklopedi/laboratuvar/carpisma': [
    'asteroit çarpışma simülatörü',
    'torino ölçeği göktaşı krateri',
    'dünyaya göktaşı çarpması simülasyonu',
  ],

  // Gözlemevi
  'gozlemevi/spektrum': [
    'elektromanyetik spektrum uzay',
    'kızılötesi ve morötesi gökbilim',
    'ışık dalgaboyları spektroskopi',
  ],
  'gozlemevi/webb-hubble': [
    'james webb vs hubble karşılaştırması',
    'derin uzay fotoğrafları karşılaştır',
    'jwst derin alan görüntüleri',
  ],
};

/** High-intent Turkish SEO descriptions for astrology archetypes */
export const SIGN_SEO_DESCRIPTIONS: Record<string, string> = {
  koc: 'Koç burcu (21 Mart – 19 Nisan) özellikleri, öncü ateş elementi, yönetici gezegeni Mars, aşk uyumu, tarot İmparator kartı ve mitolojik arketip dosyası.',
  boga: 'Boğa burcu (20 Nisan – 20 Mayıs) özellikleri, sabit toprak elementi, yönetici gezegeni Venüs, aşk uyumu, tarot Hierophant kartı ve sabırlı arketip dosyası.',
  ikizler: 'İkizler burcu (21 Mayıs – 20 Haziran) özellikleri, değişken hava elementi, yönetici gezegeni Merkür, aşk uyumu, tarot Aşıklar kartı ve meraklı arketip dosyası.',
  yengec: 'Yengeç burcu (21 Haziran – 22 Temmuz) özellikleri, öncü su elementi, yöneticisi Ay, aşk uyumu, tarot Araba kartı ve koruyucu arketip dosyası.',
  aslan: 'Aslan burcu (23 Temmuz – 22 Ağustos) özellikleri, sabit ateş elementi, yöneticisi Güneş, aşk uyumu, tarot Güç kartı ve kraliyet arketip dosyası.',
  basak: 'Başak burcu (23 Ağustos – 22 Eylül) özellikleri, değişken toprak elementi, yöneticisi Merkür, aşk uyumu, tarot Ermiş kartı ve simyacı arketip dosyası.',
  terazi: 'Terazi burcu (23 Eylül – 22 Ekim) özellikleri, öncü hava elementi, yöneticisi Venüs, aşk uyumu, tarot Adalet kartı ve dengeleyici arketip dosyası.',
  akrep: 'Akrep burcu (23 Ekim – 21 Kasım) özellikleri, sabit su elementi, yöneticisi Plüton ve Mars, aşk uyumu, tarot Ölüm kartı ve dönüşüm arketip dosyası.',
  yay: 'Yay burcu (22 Kasım – 21 Aralık) özellikleri, değişken ateş elementi, yöneticisi Jüpiter, aşk uyumu, tarot Denge kartı ve kaşif arketip dosyası.',
  oglak: 'Oğlak burcu (22 Aralık – 19 Ocak) özellikleri, öncü toprak elementi, yöneticisi Satürn, aşk uyumu, tarot Şeytan kartı ve usta mimar arketip dosyası.',
  kova: 'Kova burcu (20 Ocak – 18 Şubat) özellikleri, sabit hava elementi, yöneticisi Uranüs ve Satürn, aşk uyumu, tarot Yıldız kartı ve vizyoner arketip dosyası.',
  balik: 'Balık burcu (19 Şubat – 20 Mart) özellikleri, değişken su elementi, yöneticisi Neptün ve Jüpiter, aşk uyumu, tarot Ay kartı ve mistik arketip dosyası.',
};

/** Kısa tanıtım metni arama sonucu için yetersiz kalan modüllerin açıklamaları (120–155 karakter) */
const MODULE_DESCRIPTIONS: Record<string, string> = {
  'ansiklopedi/olcek': 'Güneş Sistemi’ndeki gezegenleri ve Güneş’i yan yana koyup çaplarının gerçek oranını karşılaştır; Dünya’nın Jüpiter yanında ne kadar küçük kaldığını gör.',
  'ansiklopedi/zaman-makinesi': 'Büyük Patlama’dan bugüne evrenin kilometre taşları: ilk yıldızlar, galaksiler, Güneş Sistemi’nin ve Dünya’daki yaşamın doğuşu tek bir zaman çizelgesinde.',
  'ansiklopedi/otegezegenler': 'Yaşanabilir kuşaktaki en ilginç ötegezegenleri büyüklük, yörünge süresi ve sıcaklıklarıyla karşılaştır; Dünya’ya en çok benzeyen dünyaları keşfet.',
  'ansiklopedi/asteroit-carpmasi': 'Asteroidin çapını, hızını ve yoğunluğunu ayarla; çarpışmanın açığa çıkaracağı enerjiyi ve oluşacak kraterin boyutunu hesapla. Ücretsiz çarpışma simülatörü.',
  'ansiklopedi/kara-delik': 'Bir kara deliğin olay ufkuna yaklaştıkça zamanın nasıl yavaşladığını ve ışığın nasıl büküldüğünü simülasyonla gör: genel görelilikte zaman genleşmesi.',
  'ansiklopedi/kozmik-arka-plan': 'Planck uydusunun kozmik mikrodalga arka plan haritası: evrenin ilk ışığındaki sıcaklık dalgalanmaları ve bunların evrenin geometrisi hakkında söyledikleri.',
  'astroloji/tarot': '22 majör arkana kartıyla ücretsiz tarot açılımı: üç açılım düzeninden birini seç, kartları çek ve her pozisyon için ayrıntılı Türkçe yorumunu oku.',
  'astroloji/gunluk-burc': '12 burç için bugünün yorumu: Ay’ın o günkü konumuna göre aşk, kariyer, sağlık ve enerji. Burcunu seç, günlük burç yorumunu ücretsiz oku.',
  'astroloji/yildiz-fali': 'Bugünün gezegen saatleri ve Ay’ın yaklaştığı baş yıldız: doğum tarihine göre senin yıldızını ve sana uğurlu saatleri gör. Keldani sırasıyla yıldız falı.',
  'astroloji/numeroloji': 'Adın ve doğum tarihinle numeroloji hesapla: yaşam yolu, kader, ruh arzusu ve kişilik sayıların, kişisel yılın ve ayrıntılı Türkçe yorumları.',
  'gozlemevi/radyo': 'Pulsarların düzenli atımlarını ve Satürn’ün auroral radyo ıslıklarını sese çeviren radyo spektrografı: gökyüzünün radyo dalgalarında nasıl duyulduğunu keşfet.',
  'gozlemevi/gozlemevleri': 'Webb ve Hubble’dan ELT’ye, DAG Erzurum’dan ALMA’ya dünyanın en büyük teleskopları: konumları, ayna çapları, gözledikleri dalga boyları ve keşifleri.',
  'gozlemevi/spektroskopi': 'Yıldız ışığını tayfına ayır: O’dan M’ye spektral sınıflar, Fraunhofer soğurma çizgileri, Balmer serisi ve Doppler kayması etkileşimli spektroskopi aracında.',
  'gozlemevi/transit': 'Bir ötegezegen yıldızının önünden geçerken ışıktaki düşüşü ölç: transit ışık eğrisinden gezegenin büyüklüğünü ve yörüngesini nasıl bulduğumuzu dene.',
  'gozlemevi/akademi': '10 soruluk astrofizik sınavıyla uzay bilgini test et: Güneş Sistemi, yıldızlar ve kozmoloji sorularını yanıtla, sonunda kişisel sertifikanı oluştur.',
  'canli/arsiv-goruntusu': 'NASA ve James Webb arşivinden seçilmiş bir uzay görüntüsü ve hikâyesi: neyi gösterdiği, hangi teleskopla ne zaman çekildiği Türkçe anlatımla.',
};

/** Kendi canonical adresi, paylaşım bilgileri ve görseliyle bir sayfa metadatası */
export function buildPageMetadata({ path, title, description, image = DEFAULT_OG_IMAGE }: {
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

/** Generate rich canonical Metadata object for any module / subpage */
export function buildModuleMetadata(sectionId: SectionId, slug: string): Metadata {
  const found = findModule(sectionId, slug);
  if (!found) {
    return {
      title: 'Enstrüman Bulunamadı — SpaceTour TR',
      robots: { index: false, follow: false },
    };
  }

  const { section, module: mod } = found;
  const path = `${section.modulesBase ?? section.href}/${mod.slug}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const key = `${sectionId}/${slug}`;
  const keywords = MODULE_KEYWORDS[key] || [
    mod.short.toLowerCase(),
    section.title.toLowerCase(),
    'astronomi',
    'uzay atlası',
    'türkiye',
  ];

  const fullTitle = `${mod.short} — ${section.title} | SpaceTour TR`;
  const cleanDescription = MODULE_DESCRIPTIONS[key] ?? mod.blurb;
  const ogImageUrl = mod.image?.src
    ? mod.image.src.startsWith('http')
      ? mod.image.src
      : `${BASE_URL}${mod.image.src}`
    : DEFAULT_OG_IMAGE;

  return {
    title: { absolute: fullTitle },
    description: cleanDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${mod.title} — SpaceTour TR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: cleanDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/** Generate rich Metadata for an individual zodiac sign dossier */
export function buildSignMetadata(signId: string): Metadata {
  const sign = ZODIAC_SIGNS.find((s) => s.id === signId);
  if (!sign) {
    return {
      title: 'Burç Bulunamadı — SpaceTour TR',
      robots: { index: false, follow: false },
    };
  }

  const path = `/astroloji/burclar/${sign.id}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullTitle = `${sign.name} Burcu Özellikleri ve Karakteri | SpaceTour TR`;
  const description = SIGN_SEO_DESCRIPTIONS[sign.id] || sign.overview;
  const keywords = [
    `${sign.name.toLowerCase()} burcu`,
    `${sign.name.toLowerCase()} burcu özellikleri`,
    `${sign.name.toLowerCase()} burcu aşk uyumu`,
    `${sign.name.toLowerCase()} burcu erkeği`,
    `${sign.name.toLowerCase()} burcu kadını`,
    `${sign.name.toLowerCase()} burcu tarihleri`,
    `${sign.element.toLowerCase()} elementi burçlar`,
    `${sign.rulingPlanet.toLowerCase()} gezegeni`,
    'astroloji zodyak arşivi',
    'tarot kart karşılığı',
  ];

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'article',
      images: [
        {
          url: `${canonicalUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${sign.name} Burcu — SpaceTour TR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${canonicalUrl}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/** Generate rich Metadata for planet / celestial body detail page */
export function buildPlanetMetadata(id: string): Metadata {
  const body = planets.find((p) => p.id === id);
  if (!body) {
    return {
      title: 'Gök Cismi Bulunamadı — SpaceTour TR',
      robots: { index: false, follow: false },
    };
  }

  const path = `/ansiklopedi/${body.id}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const fullTitle = `${body.name}: Özellikleri, Yapısı ve 3D Modeli | SpaceTour TR`;
  const description = `${body.name}: Çapı ${body.facts.çap}, kütlesi ${body.facts.kütle}, yüzey sıcaklığı ${body.facts.sıcaklık}. 3D interaktif model ve detaylı bilimsel veriler.`;
  const keywords = [
    `${body.name.toLowerCase()} gezegeni`,
    `${body.name.toLowerCase()} özellikleri`,
    `${body.name.toLowerCase()} kütlesi ve çapı`,
    `${body.name.toLowerCase()} uyduları`,
    'güneş sistemi ansiklopedisi',
    '3d gezegen modeli',
    'astronomi veritabanı',
  ];

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'article',
      images: [
        {
          url: `${canonicalUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${body.name} — SpaceTour TR`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${canonicalUrl}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/** JSON-LD WebApplication schema script string for tool/calculator/simulator subpages */
export function getWebApplicationJsonLd(sectionId: SectionId, slug: string) {
  const found = findModule(sectionId, slug);
  if (!found) return null;

  const { section, module: mod } = found;
  const path = `${section.modulesBase ?? section.href}/${mod.slug}`;
  const url = `${BASE_URL}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${mod.short} — ${section.title}`,
    url,
    description: mod.blurb,
    applicationCategory: sectionId === 'astroloji' ? 'LifestyleApplication' : 'EducationalApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5 Canvas and WebGL support',
    inLanguage: 'tr-TR',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

/** JSON-LD BreadcrumbList schema script string */
export function getBreadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`,
    })),
  };
}

/** JSON-LD FAQPage schema script for Google search accordions */
export function getFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** Makale şemasında ortak yazar ve yayıncı (Google, yayıncı logosu olarak raster görsel ister) */
export const ARTICLE_AUTHOR = { '@type': 'Organization', name: SITE_NAME, url: `${BASE_URL}/hakkinda` };
export const ARTICLE_PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-512.png`, width: 512, height: 512 },
};

/** İçeriğin depoya ilk girdiği ve son düzenlendiği tarihler (git geçmişinden) */
export const CONTENT_DATES = {
  planets: { published: '2026-09-28', modified: '2026-10-04' },
  signs: { published: '2026-10-03', modified: '2026-10-04' },
  events: { published: '2026-10-06', modified: '2026-10-06' },
} as const;

/** JSON-LD Article: başlık, tarih, yazar, yayıncı ve kapak görseliyle */
export function getArticleJsonLd(a: {
  path: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  about?: Record<string, unknown> | string;
}) {
  const url = `${BASE_URL}${a.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline.slice(0, 110),
    ...(a.description ? { description: a.description } : {}),
    image: [a.image ?? DEFAULT_OG_IMAGE],
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    inLanguage: 'tr-TR',
    author: ARTICLE_AUTHOR,
    publisher: ARTICLE_PUBLISHER,
    ...(a.about ? { about: a.about } : {}),
  };
}

/** JSON-LD Article / ItemPage schema script for Zodiac sign dossiers */
export function getZodiacSignJsonLd(signId: string) {
  const sign = ZODIAC_SIGNS.find((s) => s.id === signId);
  if (!sign) return null;

  const path = `/astroloji/burclar/${sign.id}`;
  return getArticleJsonLd({
    path,
    headline: `${sign.name} Burcu (${sign.latinName}) Özellikleri ve Arketipi`,
    description: SIGN_SEO_DESCRIPTIONS[sign.id] || sign.overview,
    image: `${BASE_URL}${path}/opengraph-image`,
    datePublished: CONTENT_DATES.signs.published,
    dateModified: CONTENT_DATES.signs.modified,
    about: {
      '@type': 'Thing',
      name: `${sign.name} Burcu`,
      alternateName: sign.latinName,
      description: `Zodyak döngüsü: ${sign.dates}. Element: ${sign.element}. Nitelik: ${sign.modality}. Yönetici gezegen: ${sign.rulingPlanet}.`,
    },
  });
}


