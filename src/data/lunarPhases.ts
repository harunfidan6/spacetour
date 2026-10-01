/**
 * Lunar Phase, Void-of-Course & Esoteric Moon Cycle Data Engine
 * Astronomical ephemeris calculations coupled with ancient Babylonian lunar wisdom.
 * Zero default emojis — engineered for Swiss technical engraving UI.
 */

export type MoonPhaseId =
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'third-quarter'
  | 'balsamic-moon';

export interface LunarPhaseInfo {
  id: MoonPhaseId;
  name: string;
  latinName: string;
  cycleDegree: string;
  illuminationRange: string;
  symbolicMeaning: string;
  consciousFocus: string;
  recommendedRituals: string[];
  thingsToAvoid: string[];
  alchemyElement: 'Toprak' | 'Su' | 'Ateş' | 'Hava';
  affirmation: string;
}

export interface MoonSignAtmosphere {
  sign: string;
  latinSign: string;
  element: string;
  governingPlanet: string;
  emotionalClimate: string;
  nourishmentTip: string;
  beautySelfCare: string;
  cosmicFocus: string;
}

export const LUNAR_PHASES: LunarPhaseInfo[] = [
  {
    id: 'new-moon',
    name: 'Yeni Ay',
    latinName: 'Luna Nova',
    cycleDegree: '0° – 45°',
    illuminationRange: '%0 – %1',
    symbolicMeaning: 'Görünmez tohumun karanlık rahimde filizlenişi. Eski döngünün tamamen son bulması ve saf potansiyelin doğuşu.',
    consciousFocus: 'Yeni niyetler belirleme, tohum atma, sessizlik ve içsel vizyon oluşturma.',
    recommendedRituals: [
      'Niyet mektubu yazma ve tütsü ile mühürleme',
      'Zihinsel ve mekansal detoks, tuzlu su banyosu',
      'Yeni bir projeye başlamak için plan defteri açma'
    ],
    thingsToAvoid: [
      'Aceleci ve fevri çıkışlar yapmak',
      'Yüksek fiziksel efor sarf etmek',
      'Geçmiş kırgınlıkları deşmek'
    ],
    alchemyElement: 'Su',
    affirmation: 'Karanlığın kalbinde yeni tohumlar ekiyorum; evren niyetlerimi sevgiyle büyütüyor.'
  },
  {
    id: 'waxing-crescent',
    name: 'Hilal (Büyüyen Hilal)',
    latinName: 'Luna Crescens',
    cycleDegree: '45° – 90°',
    illuminationRange: '%1 – %49',
    symbolicMeaning: 'Karanlıktan yükselen ilk gümüş ışıltı. Niyetin madde dünyasına doğru kök salma iradesi.',
    consciousFocus: 'Cesaret toplama, ilk somut adımı atma ve kararlılık gösterme.',
    recommendedRituals: [
      'Vizyon panosu hazırlama veya ilk temasları kurma',
      'Toprağa gerçek bir tohum veya çiçek ekme',
      'Niyet edilen hedefin ilk taslağını çıkarma'
    ],
    thingsToAvoid: [
      'Şüpheye ve yetersizlik hissine kapılmak',
      'Olumsuz dış eleştirilere kulak asmak',
      'İlk engelde geri adım atmak'
    ],
    alchemyElement: 'Toprak',
    affirmation: 'İlk adımı atacak cesarete ve inanca sahibim; ışığım her geçen an güçleniyor.'
  },
  {
    id: 'first-quarter',
    name: 'İlk Dördün',
    latinName: 'Primo Quartu',
    cycleDegree: '90° – 135°',
    illuminationRange: '%50 (Doğu Yarısı)',
    symbolicMeaning: 'Güneş ile Ay arasındaki ilk gerilimli kare açı. Niyetin sınandığı ve iradenin bilenmesi gereken dönemeç.',
    consciousFocus: 'Engelleri aşma, net karar verme, sorumluluk alma ve dirençleri kırma.',
    recommendedRituals: [
      'Ertelediğiniz zor konuşmaları net bir dille yapma',
      'Stratejik revizyon ve eylem planını güncelleme',
      'Fiziksel güç antrenmanı ve dinamik nefes çalışması'
    ],
    thingsToAvoid: [
      'Kararsız kalmak veya sorumluluktan kaçmak',
      'Öfkeyle köprüleri yakmak',
      'Detaylarda boğulup büyük resmi unutmak'
    ],
    alchemyElement: 'Ateş',
    affirmation: 'Karşıma çıkan her engeli gücümü ve irademi bileyen bir basamak olarak görüyorum.'
  },
  {
    id: 'waxing-gibbous',
    name: 'Büyüyen Şişkin Ay',
    latinName: 'Gibbosa Crescens',
    cycleDegree: '135° – 180°',
    illuminationRange: '%51 – %99',
    symbolicMeaning: 'Meyvenin olgunlaşma aşaması. Zirveye bir adım kala ayrıntıları mükemmelleştirme ve sabır süreci.',
    consciousFocus: 'Geliştirme, eksikleri tamamlama, ustalık kazanma ve sabırla bekleme.',
    recommendedRituals: [
      'Projeler üzerinde son okuma ve rötuşlar yapma',
      'Mentorluk veya uzman görüşü alma',
      'Kristalleri suyla arındırıp dolunaya hazırlama'
    ],
    thingsToAvoid: [
      'Sabırsız davranıp süreci erken sonlandırmak',
      'Kibir ve aşırı özgüvene kapılmak',
      'Eksikleri görmezden gelmek'
    ],
    alchemyElement: 'Toprak',
    affirmation: 'Emeklerimin olgunlaşmasına izin veriyorum; mükemmel zamanlamaya güveniyorum.'
  },
  {
    id: 'full-moon',
    name: 'Dolunay',
    latinName: 'Plenilunium',
    cycleDegree: '180° – 225°',
    illuminationRange: '%100',
    symbolicMeaning: 'Güneş ile Ay’ın tam karşıtlığı; bilincin ve bilinçdışının en berrak aynası. Hasat, doruk noktası ve aydınlanma.',
    consciousFocus: 'Tamamlanma, kutlama, hakikatle yüzleşme ve eskiyi sevgiyle bırakma.',
    recommendedRituals: [
      'Dolunay suyu (ay suyu) hazırlama ve kristalleri şarj etme',
      'Bağ kesme ve affetme ritüeli (bırakmak istenenleri kağıda yazıp yakma)',
      'Şükran günlüğü tutma ve başarıları onurlandırma'
    ],
    thingsToAvoid: [
      'Dürtüsel büyük ameliyatlar veya riskli tıbbi müdahaleler',
      'Yüksek sesli tartışmalar ve fevri restleşmeler',
      'Aşırı kafein veya uyarıcı tüketimi'
    ],
    alchemyElement: 'Su',
    affirmation: 'İçimdeki tüm hakikati sevgiyle kucaklıyorum; bana artık hizmet etmeyen her şeyi serbest bırakıyorum.'
  },
  {
    id: 'waning-gibbous',
    name: 'Küçülen Şişkin Ay (Disseminating)',
    latinName: 'Gibbosa Decrescens',
    cycleDegree: '225° – 270°',
    illuminationRange: '%99 – %51',
    symbolicMeaning: 'Hasat edilen ürünün topluma dağıtılması. Bilgeliği paylaşma, öğretme ve içselleşen deneyimi aktarma.',
    consciousFocus: 'Öğrendiklerini aktarma, işbirliği, şükran duyma ve toplulukla paylaşım.',
    recommendedRituals: [
      'Bildiklerini başkalarına öğretme veya makale/yazı yazma',
      'Hayır işleri yapma, ihtiyacı olanlara destek olma',
      'Kazanılan tecrübeleri deftere not etme'
    ],
    thingsToAvoid: [
      'Bilgiyi ve kaynakları bencilce saklamak',
      'Geçmiş başarıya saplanıp kalmak',
      'Yeni ve büyük bir taahhüdün altına girmek'
    ],
    alchemyElement: 'Hava',
    affirmation: 'Edindiğim bilgeliği cömertçe paylaşıyorum; evrenin döngüsel bolluğunun bir parçasıyım.'
  },
  {
    id: 'third-quarter',
    name: 'Son Dördün',
    latinName: 'Ultimo Quartu',
    cycleDegree: '270° – 315°',
    illuminationRange: '%50 (Batı Yarısı)',
    symbolicMeaning: 'Kapanış döngüsünün kararlı kesişimi. Ruhsal ve fiziksel yükleri tasfiye etme, fazlalıklardan arınma.',
    consciousFocus: 'Temizlik, affetme, alışkanlıkları terk etme ve yükleri hafifletme.',
    recommendedRituals: [
      'Ev, gardırop ve dijital dosya temizliği (minimalizm)',
      'Bağımlılıkları ve zararlı beslenme alışkanlıklarını bırakma',
      'Borçları kapatma veya mali düzenlemeler yapma'
    ],
    thingsToAvoid: [
      'Gereksiz yeni eşyalar satın almak',
      'Eski travmaları yeniden üretmek',
      'Yeni bir ortaklık başlatmak'
    ],
    alchemyElement: 'Ateş',
    affirmation: 'Ruhumu ve alanımı hafifletiyorum; eski yüklerimi arkamda bırakarak özgürleşiyorum.'
  },
  {
    id: 'balsamic-moon',
    name: 'Balzamik Ay (Karanlık Ay)',
    latinName: 'Luna Balsamica',
    cycleDegree: '315° – 360°',
    illuminationRange: '%49 – %1',
    symbolicMeaning: 'Son nefes, derin sessizlik ve kozmik kuluçka dönemi. Bilinçaltının rüyalar yoluyla ruhu şifalandırması.',
    consciousFocus: 'İnziva, dinlenme, derin meditasyon, rüya günlüğü ve teslimiyet.',
    recommendedRituals: [
      'Tuz lambası ve adaçayı tütsüsü eşliğinde derin sessizlik',
      'Rüya günlüğü tutma ve sezgisel mesajları not etme',
      'Derin uyku, masaj ve bedensel şifa kürleri'
    ],
    thingsToAvoid: [
      'Yorucu sosyal toplantılar ve kalabalık etkinlikler',
      'Büyük ticari imzalar ve yeni sözleşmeler',
      'Zihni aşırı zorlamak'
    ],
    alchemyElement: 'Su',
    affirmation: 'Büyük teslimiyetin huzurunu yaşıyorum; dinleniyor, arınıyor ve yeni doğuşa hazırlanıyorum.'
  }
];

export const MOON_SIGN_ATMOSPHERES: Record<string, MoonSignAtmosphere> = {
  koc: {
    sign: 'Koç',
    latinSign: 'Aries',
    element: 'Ateş',
    governingPlanet: 'Mars',
    emotionalClimate: 'Dürtüsel, coşkulu ve sabırsız. Duygular anında eyleme dönüşmek ister; açık sözlülük hakimdir.',
    nourishmentTip: 'Baharatlı gıdalardan ölçülü tüketin; bol su için ve baş bölgesi migrenine dikkat edin.',
    beautySelfCare: 'Kafa derisi masajı, enerji verici kuru fırçalama.',
    cosmicFocus: 'Ertelediğiniz bir projeye cesaretle ilk adımı atın.'
  },
  boga: {
    sign: 'Boğa',
    latinSign: 'Taurus',
    element: 'Toprak',
    governingPlanet: 'Venüs (Yücelim)',
    emotionalClimate: 'Huzurlu, tensel, sadık ve güven arayışında. Ay burada yücelir; sakinlik ve tatmin ön plandadır.',
    nourishmentTip: 'Doğal, köklü sebzeler, sıcak çorbalar ve kaliteli lezzetler.',
    beautySelfCare: 'Boyun ve dekolte bakımı, gül suyu kompresi.',
    cosmicFocus: 'Maddi güvence oluşturun ve doğada yürüyüş yapın.'
  },
  ikizler: {
    sign: 'İkizler',
    latinSign: 'Gemini',
    element: 'Hava',
    governingPlanet: 'Merkür',
    emotionalClimate: 'Meraklı, konuşkan, değişken ve hafif. Duygular mantık süzgecinden geçirilir ve ifade edilmek istenir.',
    nourishmentTip: 'Hafif atıştırmalıklar, fındık-ceviz gibi beyin besinleri.',
    beautySelfCare: 'El ve kol bakımı, aromaterapik nane yağı ile nefes açma.',
    cosmicFocus: 'Okuyun, yazın, yeni bir fikir araştırın ve dostlarla sohbet edin.'
  },
  yengec: {
    sign: 'Yengeç',
    latinSign: 'Cancer',
    element: 'Su',
    governingPlanet: 'Ay (Kendi Yöneticisi)',
    emotionalClimate: 'Derin, sezgisel, korumacı ve hassas. Ay kendi tahtında; nostalji ve aile bağları en güçlü seviyede.',
    nourishmentTip: 'Ev yapımı sıcak yemekler, mideyi rahatlatıcı papatya çayı.',
    beautySelfCare: 'Göğüs ve karın bölgesi rahatlatıcı banyo tuzları, sıcak su torbası.',
    cosmicFocus: 'Evinizi güzelleştirin, sevdiklerinize şefkat gösterin ve dinlenin.'
  },
  aslan: {
    sign: 'Aslan',
    latinSign: 'Leo',
    element: 'Ateş',
    governingPlanet: 'Güneş',
    emotionalClimate: 'Cömert, gösterişli, yaratıcı ve gururlu. Takdir edilme ve sevgiyi merkezde hissetme arzusu yüksektir.',
    nourishmentTip: 'Kalbi destekleyici gıdalar, nar, ceviz, zeytinyağı.',
    beautySelfCare: 'Saç bakımı, parlaklık veren serumlar ve altın tonlu maskeler.',
    cosmicFocus: 'Sahneye çıkın, yaratıcı bir hobinizi sergileyin ve kalpten sevin.'
  },
  basak: {
    sign: 'Başak',
    latinSign: 'Virgo',
    element: 'Toprak',
    governingPlanet: 'Merkür',
    emotionalClimate: 'Titiz, analitik, yardımsever ve düzen tutkunu. Duygular kontrol altında tutulup faydalı işlere yönlendirilir.',
    nourishmentTip: 'Lifli besinler, probiyotikler, bağırsak dostu fermente gıdalar.',
    beautySelfCare: 'Cilt detoksu, kil maskesi, gözenek temizliği.',
    cosmicFocus: 'Dağınıklığı toparlayın, ajandanızı düzenleyin ve sağlıklı bir alışkanlık başlatın.'
  },
  terazi: {
    sign: 'Terazi',
    latinSign: 'Libra',
    element: 'Hava',
    governingPlanet: 'Venüs',
    emotionalClimate: 'Uyumlu, estetik, diplomatik ve yalnızlıktan hoşlanmayan. İlişkilerde adalet ve nezaket aranır.',
    nourishmentTip: 'Böbrekleri korumak için bol su, az tuz, taze yeşillikler.',
    beautySelfCare: 'Nemlendirici yüz maskeleri, parfüm ritüelleri.',
    cosmicFocus: 'İlişkilerinizdeki pürüzleri uzlaşmayla çözün, sanatsal bir sergi gezin.'
  },
  akrep: {
    sign: 'Akrep',
    latinSign: 'Scorpio',
    element: 'Su',
    governingPlanet: 'Mars & Plüton (Düşüş)',
    emotionalClimate: 'Tutkulu, derin, kuşkucu ve dönüştürücü. Ay burada zorlanır; gizli duygular yüzeye patlayabilir.',
    nourishmentTip: 'Antioksidan zengini böğürtlen, pancar, arındırıcı yeşil çay.',
    beautySelfCare: 'Detoks banyosu, peloid çamur maskesi.',
    cosmicFocus: 'Yüzleşmeler yapın, bilinçaltı blokajlarını dönüştürün ve gizemleri araştırın.'
  },
  yay: {
    sign: 'Yay',
    latinSign: 'Sagittarius',
    element: 'Ateş',
    governingPlanet: 'Jüpiter',
    emotionalClimate: 'İyimser, maceracı, özgür ve felsefi. Dar kalıplara sığamama, ufukları genişletme tutkusu.',
    nourishmentTip: 'Karaciğeri dinlendirecek enginar, karahindiba çayı, taze meyveler.',
    beautySelfCare: 'Bacak ve kalça masajı, açık hava yürüyüşü.',
    cosmicFocus: 'Seyahat planı yapın, yabancı bir konu öğrenin ve mizahı elden bırakmayın.'
  },
  oglak: {
    sign: 'Oğlak',
    latinSign: 'Capricorn',
    element: 'Toprak',
    governingPlanet: 'Satürn (Zararlı)',
    emotionalClimate: 'Ciddi, kontrollü, mesafeli ve hedef odaklı. Ay duyguları saklayıp görev bilincini öne çıkarır.',
    nourishmentTip: 'Kalsiyum zengini susam, badem, kemik suyu, koyu yeşil yapraklar.',
    beautySelfCare: 'Kemik, eklem ve tırnak bakımı, mineral banyoları.',
    cosmicFocus: 'Uzun vadeli bir kariyer hedefine odaklanın ve disiplinli bir plan kurun.'
  },
  kova: {
    sign: 'Kova',
    latinSign: 'Aquarius',
    element: 'Hava',
    governingPlanet: 'Satürn & Uranüs',
    emotionalClimate: 'Bağımsız, orijinal, hümanist ve sıra dışı. Duygulara objektif ve entelektüel bir mesafeden bakılır.',
    nourishmentTip: 'Kan dolaşımını canlandırıcı gıdalar, zencefil, turunçgiller.',
    beautySelfCare: 'Ayak bilekleri masajı, lenfatik drenaj.',
    cosmicFocus: 'Sosyal bir projeye katılın, geleceğe yönelik fütüristik fikirler üretin.'
  },
  balik: {
    sign: 'Balık',
    latinSign: 'Pisces',
    element: 'Su',
    governingPlanet: 'Jüpiter & Neptün',
    emotionalClimate: 'Empatik, rüya gibi, sınırsız ve şefkatli. Çevrenin tüm duygusal enerjisi bir sünger gibi emilir.',
    nourishmentTip: 'Lenf sistemini temizleyici hafif çorbalar, tuzsuz beslenme.',
    beautySelfCare: 'Ayak banyosu, lavanta yağlı aromatik uyku ritüeli.',
    cosmicFocus: 'Müzik dinleyin, meditasyon yapın, resim çizin ve sezgilerinize güvenin.'
  }
};

/**
 * Calculates approximate astronomical Moon illumination and phase for any Date
 * based on synodic month (29.53058867 days) referenced from known new moon ephemeris.
 */
export function calculateCurrentMoonPhase(date: Date = new Date()): {
  phase: LunarPhaseInfo;
  illuminationPercent: number;
  ageDays: number;
  isWaxing: boolean;
  angleDeg: number;
  nextNewMoonDays: number;
  nextFullMoonDays: number;
} {
  // Reference epoch: 2026 Jan 18 16:52 UTC (Known New Moon)
  const refDate = new Date('2026-01-18T16:52:00Z').getTime();
  const synodicMonthMs = 29.53058867 * 24 * 60 * 60 * 1000;
  const nowMs = date.getTime();
  const diffMs = (nowMs - refDate) % synodicMonthMs;
  const cycleFraction = (diffMs < 0 ? diffMs + synodicMonthMs : diffMs) / synodicMonthMs;

  const ageDays = cycleFraction * 29.53058867;
  const angleDeg = cycleFraction * 360;

  // Illumination: 0.5 * (1 - cos(angle))
  const illumination = 0.5 * (1 - Math.cos((angleDeg * Math.PI) / 180));
  const illuminationPercent = Math.round(illumination * 100);
  const isWaxing = angleDeg < 180;

  let phaseIndex = 0;
  if (angleDeg < 22.5 || angleDeg >= 337.5) {
    phaseIndex = 0; // New Moon
  } else if (angleDeg < 67.5) {
    phaseIndex = 1; // Waxing Crescent
  } else if (angleDeg < 112.5) {
    phaseIndex = 2; // First Quarter
  } else if (angleDeg < 157.5) {
    phaseIndex = 3; // Waxing Gibbous
  } else if (angleDeg < 202.5) {
    phaseIndex = 4; // Full Moon
  } else if (angleDeg < 247.5) {
    phaseIndex = 5; // Waning Gibbous
  } else if (angleDeg < 292.5) {
    phaseIndex = 6; // Third Quarter
  } else {
    phaseIndex = 7; // Balsamic
  }

  // Next full moon & new moon estimates in days
  const nextNewMoonDays = (360 - angleDeg) / (360 / 29.53058867);
  const nextFullMoonDays =
    angleDeg < 180
      ? (180 - angleDeg) / (360 / 29.53058867)
      : (540 - angleDeg) / (360 / 29.53058867);

  return {
    phase: LUNAR_PHASES[phaseIndex],
    illuminationPercent,
    ageDays: Math.round(ageDays * 10) / 10,
    isWaxing,
    angleDeg: Math.round(angleDeg),
    nextNewMoonDays: Math.round(nextNewMoonDays * 10) / 10,
    nextFullMoonDays: Math.round(nextFullMoonDays * 10) / 10
  };
}

/**
 * Calculates current Moon Zodiac Sign based on mean tropical lunar motion (~13.176° per day)
 */
export function calculateCurrentMoonSign(date: Date = new Date()): MoonSignAtmosphere {
  // Reference: Jan 18 2026, Moon at 0° Aquarius (approx tropical longitude 300°)
  const refTime = new Date('2026-01-18T16:52:00Z').getTime();
  const daysDiff = (date.getTime() - refTime) / (1000 * 60 * 60 * 24);
  const meanLongitude = (300 + daysDiff * 13.176358) % 360;
  const normDeg = meanLongitude < 0 ? meanLongitude + 360 : meanLongitude;

  const signKeys = [
    'koc',
    'boga',
    'ikizler',
    'yengec',
    'aslan',
    'basak',
    'terazi',
    'akrep',
    'yay',
    'oglak',
    'kova',
    'balik'
  ];

  const signIdx = Math.floor(normDeg / 30);
  const currentKey = signKeys[signIdx % 12];
  return MOON_SIGN_ATMOSPHERES[currentKey] || MOON_SIGN_ATMOSPHERES.koc;
}

/**
 * Moon Void-of-Course (Boşluktaki Ay) Calculation Simulator & Status
 */
export interface MoonVoidOfCourseState {
  isVoidNow: boolean;
  statusText: string;
  advice: string;
  nextVoidStart: string;
  nextVoidEnd: string;
  nextIngressSign: string;
}

export function getMoonVoidOfCourseStatus(date: Date = new Date()): MoonVoidOfCourseState {
  // In astrology, Moon is void of course periodically before changing signs (every 2.5 days for a few hours).
  // We model a cycle based on the current day hour:
  const h = date.getHours();
  // Simulate active void if between 14:00 - 17:30 every other day
  const isVoid = date.getDate() % 2 === 1 && h >= 14 && h < 18;

  if (isVoid) {
    return {
      isVoidNow: true,
      statusText: 'Ay Şu Anda Boşlukta (Void of Course)',
      advice: 'Kritik sözleşmeler, yeni iş ortaklıkları ve büyük alışverişler için uygun değildir. Rutin işlere devam edin, meditasyon ve içsel arınma yapın.',
      nextVoidStart: 'Şu an aktif (14:15 - 18:00)',
      nextVoidEnd: 'Bugün 18:00',
      nextIngressSign: 'Bir sonraki burca geçiş: 18:05'
    };
  }

  return {
    isVoidNow: false,
    statusText: 'Ay Etkin Açıda (Boşlukta Değil)',
    advice: 'Gezegenlerle açı etkileşimi güçlü ve akışkandır. İletişim, ticari görüşmeler, yeni girişimler ve niyet çalışmaları desteklenmektedir.',
    nextVoidStart: 'Yarın 15:30',
    nextVoidEnd: 'Yarın 19:45',
    nextIngressSign: 'Ay Burç Değişimi: 19:50'
  };
}
