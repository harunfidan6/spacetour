export type ZodiacElement = 'Ateş' | 'Toprak' | 'Hava' | 'Su';
export type ZodiacModality = 'Öncü' | 'Sabit' | 'Değişken';

export interface ZodiacSign {
  id: string;
  name: string;
  latinName: string;
  symbol: string;
  glyph: string;
  dates: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: ZodiacElement;
  modality: ZodiacModality;
  rulingPlanet: string;
  rulingPlanetId: string; // for links to encyclopedia
  constellationId: string;
  overview: string;
  traits: {
    strengths: string[];
    shadows: string[];
    archetype: string;
    motto: string;
  };
  details: {
    stone: string;
    metal: string;
    colors: string[];
    luckyNumbers: number[];
  };
  loveCompatibility: string[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'koc',
    name: 'Koç',
    latinName: 'Aries',
    symbol: '♈',
    glyph: 'Koç Boynuzu',
    dates: '21 Mart – 19 Nisan',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    element: 'Ateş',
    modality: 'Öncü',
    rulingPlanet: 'Mars',
    rulingPlanetId: 'mars',
    constellationId: 'koc',
    overview: 'Zodyak döngüsünün ilk kıvılcımı; saf enerji, cesaret, öncülük ve yeni başlangıçların simgesidir. Korkusuz bir lider ruh taşır.',
    traits: {
      strengths: ['Cesaret', 'Öncülük', 'Yüksek Enerji', 'Dürüstlük', 'Hızlı Karar Alma'],
      shadows: ['Sabırsızlık', 'Fevrilik', 'İnatçılık'],
      archetype: 'Savaşçı & Öncü',
      motto: 'Ben Varım (I Am)'
    },
    details: {
      stone: 'Elmas & Akik',
      metal: 'Demir',
      colors: ['Kırmızı', 'Alev Turuncusu'],
      luckyNumbers: [1, 9, 17]
    },
    loveCompatibility: ['aslan', 'yay', 'ikizler', 'kova']
  },
  {
    id: 'boga',
    name: 'Boğa',
    latinName: 'Taurus',
    symbol: '♉',
    glyph: 'Boğa Başı',
    dates: '20 Nisan – 20 Mayıs',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    element: 'Toprak',
    modality: 'Sabit',
    rulingPlanet: 'Venüs',
    rulingPlanetId: 'venus',
    constellationId: 'boga',
    overview: 'Toprağın bereketini, sarsılmaz sabrı, estetiği ve güven duygusunu temsil eder. Kalıcı değerler üretmeye odaklıdır.',
    traits: {
      strengths: ['Güvenilirlik', 'Sabır', 'Estetik Duygu', 'Sadakat', 'Pratiklik'],
      shadows: ['Değişime Direnç', 'Maddecilik', 'Tembellik Riski'],
      archetype: 'İnşa Edici & Koruyucu',
      motto: 'Ben Sahip Olurum (I Have)'
    },
    details: {
      stone: 'Zümrüt & Safir',
      metal: 'Bakır',
      colors: ['Orman Yeşili', 'Toprak Tonları'],
      luckyNumbers: [2, 6, 24]
    },
    loveCompatibility: ['basak', 'oglak', 'yengec', 'balik']
  },
  {
    id: 'ikizler',
    name: 'İkizler',
    latinName: 'Gemini',
    symbol: '♊',
    glyph: 'İkiz Sütunlar',
    dates: '21 Mayıs – 20 Haziran',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    element: 'Hava',
    modality: 'Değişken',
    rulingPlanet: 'Merkür',
    rulingPlanetId: 'merkur',
    constellationId: 'ikizler',
    overview: 'Merakın, bilginin, zihinsel çevikliğin ve iletişimin efendisidir. Fikirler arasında ışık hızıyla köprüler kurar.',
    traits: {
      strengths: ['Zihinsel Çeviklik', 'Merak', 'Adaptasyon', 'Espri Yeteneği', 'Çok Yönlülük'],
      shadows: ['Kararsızlık', 'Yüzeysellik', 'Huzursuzluk'],
      archetype: 'Haberci & Düşünür',
      motto: 'Ben Düşünürüm (I Think)'
    },
    details: {
      stone: 'Akik & Sitrin',
      metal: 'Cıva',
      colors: ['Sarı', 'Açık Mavi'],
      luckyNumbers: [3, 5, 14]
    },
    loveCompatibility: ['terazi', 'kova', 'koc', 'aslan']
  },
  {
    id: 'yengec',
    name: 'Yengeç',
    latinName: 'Cancer',
    symbol: '♋',
    glyph: 'Kıskaçlar & Sarmal',
    dates: '21 Haziran – 22 Temmuz',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    element: 'Su',
    modality: 'Öncü',
    rulingPlanet: 'Ay',
    rulingPlanetId: 'ay',
    constellationId: 'yengec',
    overview: 'Duygusal derinliğin, sezgilerin, aile bağlarının ve hafızanın bekçisidir. Koruyucu ve derin bir empati gücüne sahiptir.',
    traits: {
      strengths: ['Derin Sezgi', 'Şefkat', 'Bağlılık', 'Güçlü Hafıza', 'Koruyuculuk'],
      shadows: ['Alınganlık', 'Geçmişe Takılı Kalma', 'Duygu Dalgalanması'],
      archetype: 'Besleyici & Şifacı',
      motto: 'Ben Hissederim (I Feel)'
    },
    details: {
      stone: 'Aytaşı & İnci',
      metal: 'Gümüş',
      colors: ['Gümüşi Beyaz', 'Deniz Mavisi'],
      luckyNumbers: [2, 7, 16]
    },
    loveCompatibility: ['akrep', 'balik', 'boga', 'basak']
  },
  {
    id: 'aslan',
    name: 'Aslan',
    latinName: 'Leo',
    symbol: '♌',
    glyph: 'Aslan Yelesi',
    dates: '23 Temmuz – 22 Ağustos',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    element: 'Ateş',
    modality: 'Sabit',
    rulingPlanet: 'Güneş',
    rulingPlanetId: 'gunes',
    constellationId: 'aslan',
    overview: 'Güneş’in parlaklığını taşıyan yaratıcılık, cömertlik, karizma ve sahne enerjisi. Çevresine doğal bir çekim ve ışık saçar.',
    traits: {
      strengths: ['Karizma', 'Cömertlik', 'Yaratıcılık', 'Doğal Liderlik', 'Özgüven'],
      shadows: ['Kibir', 'Eleştiriye Tahammülsüzlük', 'Drama Eğilimi'],
      archetype: 'Hükümdar & Sanatçı',
      motto: 'Ben Yaratırım (I Will)'
    },
    details: {
      stone: 'Yakut & Kaplan Gözü',
      metal: 'Altın',
      colors: ['Altın Sarısı', 'Güneş Turuncusu'],
      luckyNumbers: [1, 5, 19]
    },
    loveCompatibility: ['koc', 'yay', 'ikizler', 'terazi']
  },
  {
    id: 'basak',
    name: 'Başak',
    latinName: 'Virgo',
    symbol: '♍',
    glyph: 'Buğday Başağı',
    dates: '23 Ağustos – 22 Eylül',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    element: 'Toprak',
    modality: 'Değişken',
    rulingPlanet: 'Merkür',
    rulingPlanetId: 'merkur',
    constellationId: 'basak',
    overview: 'Analitik zekanın, titizliğin, hizmet etmenin ve kusursuzlaştırmanın sembolü. Kaosu düzene sokma dehasına sahiptir.',
    traits: {
      strengths: ['Analitik Zeka', 'Detaycılık', 'Çalışkanlık', 'Düzen Kurma', 'Pratik Çözüm'],
      shadows: ['Aşırı Eleştirellik', 'Endişe & Evham', 'Mükemmeliyetçilik'],
      archetype: 'Analist & Hizmetkar',
      motto: 'Ben Analiz Ederim (I Analyze)'
    },
    details: {
      stone: 'Kuvars & Yeşim',
      metal: 'Cıva',
      colors: ['Toprak Grisi', 'Haki'],
      luckyNumbers: [5, 14, 23]
    },
    loveCompatibility: ['boga', 'oglak', 'yengec', 'akrep']
  },
  {
    id: 'terazi',
    name: 'Terazi',
    latinName: 'Libra',
    symbol: '♎',
    glyph: 'Denge Kefeleri',
    dates: '23 Eylül – 22 Ekim',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    element: 'Hava',
    modality: 'Öncü',
    rulingPlanet: 'Venüs',
    rulingPlanetId: 'venus',
    constellationId: 'terazi',
    overview: 'Zarafetin, dengenin, adaletin ve estetik uyumun temsilcisi. İlişkilerde ve sanatta kusursuz ahenk arar.',
    traits: {
      strengths: ['Diplomasi', 'Adalet Duygusu', 'Estetik Uyum', 'Sosyal Zeka', 'Barışçıllık'],
      shadows: ['Kararsızlık', 'Çatışmadan Kaçma', 'Onay Arayışı'],
      archetype: 'Diplomat & Estet',
      motto: 'Ben Dengelerim (I Balance)'
    },
    details: {
      stone: 'Opal & Lapis Lazuli',
      metal: 'Bakır',
      colors: ['Gül Pembesi', 'Pastel Mavi'],
      luckyNumbers: [6, 15, 24]
    },
    loveCompatibility: ['ikizler', 'kova', 'aslan', 'yay']
  },
  {
    id: 'akrep',
    name: 'Akrep',
    latinName: 'Scorpio',
    symbol: '♏',
    glyph: 'Zehirli Kuyruk',
    dates: '23 Ekim – 21 Kasım',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    element: 'Su',
    modality: 'Sabit',
    rulingPlanet: 'Plüton & Mars',
    rulingPlanetId: 'pluton',
    constellationId: 'akrep',
    overview: 'Dönüşümün, krizlerin, tutkunun ve derin gizemlerin efendisi. Yüzeydeki illüzyonların ötesindeki hakikati görür.',
    traits: {
      strengths: ['Tutku', 'Sezgi Keskinliği', 'Dönüşüm Gücü', 'Sadakat', 'Stratejik Zeka'],
      shadows: ['Kıskançlık', 'Şüphecilik', 'İntikam İtisi'],
      archetype: 'Simyacı & Dedektif',
      motto: 'Ben Arzularım (I Desire)'
    },
    details: {
      stone: 'Obsidyen & Topaz',
      metal: 'Plutonyum & Demir',
      colors: ['Bordo', 'Kömür Siyahı'],
      luckyNumbers: [8, 11, 18]
    },
    loveCompatibility: ['yengec', 'balik', 'boga', 'basak']
  },
  {
    id: 'yay',
    name: 'Yay',
    latinName: 'Sagittarius',
    symbol: '♐',
    glyph: 'Uçan Ok',
    dates: '22 Kasım – 21 Aralık',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    element: 'Ateş',
    modality: 'Değişken',
    rulingPlanet: 'Jüpiter',
    rulingPlanetId: 'jupiter',
    constellationId: 'yay',
    overview: 'Hakikat arayışı, felsefe, uzak diyarlar ve sınırsız iyimserlik. Ufkun ötesini merak eden bir kaşiftir.',
    traits: {
      strengths: ['İyimserlik', 'Geniş Vizyon', 'Özgürlük Tutkusu', 'Mizah', 'Bilgelik'],
      shadows: ['Dobra Sözlerle Kırma', 'Sorumsuzluk Eğilimi', 'Aşırılık'],
      archetype: 'Gezgin & Filozof',
      motto: 'Ben Anlarım (I Understand)'
    },
    details: {
      stone: 'Turkuaz & Ametist',
      metal: 'Kalay',
      colors: ['Kraliyet Moru', 'Lacivert'],
      luckyNumbers: [3, 9, 21]
    },
    loveCompatibility: ['koc', 'aslan', 'terazi', 'kova']
  },
  {
    id: 'oglak',
    name: 'Oğlak',
    latinName: 'Capricorn',
    symbol: '♑',
    glyph: 'Deniz Keçisi',
    dates: '22 Aralık – 19 Ocak',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    element: 'Toprak',
    modality: 'Öncü',
    rulingPlanet: 'Satürn',
    rulingPlanetId: 'saturn',
    constellationId: 'oglak',
    overview: 'Zirveye tırmanan kararlılık, zaman bilinci, disiplin ve köklü yapılar kurma iradesi. Sabrın ve ustalığın simgesi.',
    traits: {
      strengths: ['Disiplin', 'Kararlılık', 'Stratejik Planlama', 'Güvenilirlik', 'Sabır'],
      shadows: ['Katılık', 'Duygusal Soğukluk', 'Aşırı İhtiyat'],
      archetype: 'Usta & Stratejist',
      motto: 'Ben Kullanırım (I Use)'
    },
    details: {
      stone: 'Grena & Oniks',
      metal: 'Kurşun',
      colors: ['Koyu Kahve', 'Kömür Grisi'],
      luckyNumbers: [4, 8, 22]
    },
    loveCompatibility: ['boga', 'basak', 'akrep', 'balik']
  },
  {
    id: 'kova',
    name: 'Kova',
    latinName: 'Aquarius',
    symbol: '♒',
    glyph: 'Elektrik Dalgaları',
    dates: '20 Ocak – 18 Şubat',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    element: 'Hava',
    modality: 'Sabit',
    rulingPlanet: 'Uranüs & Satürn',
    rulingPlanetId: 'uranus',
    constellationId: 'kova',
    overview: 'Gelecek vizyonu, yenilikçilik, evrensel hümanizm ve kalıpları kıran deha. Çağının ötesinde düşünen bir vizyonerdir.',
    traits: {
      strengths: ['Yenilikçilik', 'Özgünlük', 'Hümanizm', 'Bağımsızlık', 'Zihinsel Özgürlük'],
      shadows: ['Duygusal Mesafelilik', 'Aşırı İnat', 'Asilik'],
      archetype: 'Vizyoner & İsyankar',
      motto: 'Ben Bilirim (I Know)'
    },
    details: {
      stone: 'Ametist & Akuamarin',
      metal: 'Uranyum & Alüminyum',
      colors: ['Elektrik Mavisi', 'Gümüş'],
      luckyNumbers: [7, 11, 29]
    },
    loveCompatibility: ['ikizler', 'terazi', 'koc', 'yay']
  },
  {
    id: 'balik',
    name: 'Balık',
    latinName: 'Pisces',
    symbol: '♓',
    glyph: 'Zıt Yöndeki Balıklar',
    dates: '19 Şubat – 20 Mart',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    element: 'Su',
    modality: 'Değişken',
    rulingPlanet: 'Neptün & Jüpiter',
    rulingPlanetId: 'neptun',
    constellationId: 'balik',
    overview: 'Kozmik birliğin, koşulsuz sevginin, hayal gücünün ve ruhsal derinliğin son durağı. Zodyak döngüsünün bilgelik havuzudur.',
    traits: {
      strengths: ['Evrensel Empati', 'Sanatsal İlham', 'Ruhsal Sezgi', 'Fedakarlık', 'Şefkat'],
      shadows: ['Gerçeklerden Kaçış', 'Sınır Çizememe', 'Aşırı Duygusallık'],
      archetype: 'Mistik & Hayalperest',
      motto: 'Ben İnanırım (I Believe)'
    },
    details: {
      stone: 'Akuamarin & Aytaşı',
      metal: 'Platin & Kalay',
      colors: ['Deniz Köpüğü Yeşili', 'Lavanta'],
      luckyNumbers: [3, 7, 12]
    },
    loveCompatibility: ['yengec', 'akrep', 'boga', 'oglak']
  }
];

/**
 * Calculates Sun Sign from Month (1-12) and Day (1-31)
 */
export function getSunSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign;
    }
  }
  // Fallback to Capricorn if end of year
  return ZODIAC_SIGNS[9];
}

/**
 * Approximates Ascendant (Rising Sign) from Sun Sign and Birth Hour (0-23)
 * The ascendant shifts roughly 1 sign every 2 hours starting from the Sun sign at sunrise (~6 AM).
 */
export function calculateAscendant(sunSignIndex: number, birthHour: number): ZodiacSign {
  // Approximate sunrise at ~6:00 AM (Sun Sign on Ascendant)
  const offset = Math.floor(((birthHour - 6 + 24) % 24) / 2);
  const ascIndex = (sunSignIndex + offset) % 12;
  return ZODIAC_SIGNS[ascIndex];
}

/**
 * Approximates Moon Sign based on day offset
 */
export function calculateMoonSign(sunSignIndex: number, birthDay: number): ZodiacSign {
  // Moon shifts signs every ~2.5 days
  const moonOffset = Math.floor((birthDay * 1.5) % 12);
  const moonIndex = (sunSignIndex + moonOffset) % 12;
  return ZODIAC_SIGNS[moonIndex];
}
