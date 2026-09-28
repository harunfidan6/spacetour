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
  rulingPlanetId: string;
  constellationId: string;
  overview: string;
  tarotCard: {
    name: string;
    number: string;
    symbolism: string;
    guidance: string;
  };
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
  dailyHoroscope: {
    energy: string;
    love: string;
    career: string;
    cosmicTip: string;
    luckyHours: string;
  };
}

export interface AstrologicalHouse {
  number: number;
  title: string;
  traditionalName: string;
  area: string;
  description: string;
  governingSign: string;
}

export interface PlanetaryPlacement {
  planet: string;
  planetSymbol: string;
  sign: string;
  signSymbol: string;
  degree: number;
  house: number;
  meaning: string;
}

export const ASTROLOGICAL_HOUSES: AstrologicalHouse[] = [
  { number: 1, title: '1. Ev (Yükselen / ASC)', traditionalName: 'Vita', area: 'Benlik & Fiziksel Beden', description: 'Dünyaya kendinizi nasıl sunduğunuz, ilk izlenim, yaşam enerjisi ve fiziksel görünüş.', governingSign: 'Koç' },
  { number: 2, title: '2. Ev', traditionalName: 'Lucrum', area: 'Maddi Değerler & Özdeğer', description: 'Kendi emeğinizle kazandığınız para, sahip olunan maddi değerler, güven duygusu ve yetenekler.', governingSign: 'Boğa' },
  { number: 3, title: '3. Ev', traditionalName: 'Fratres', area: 'İletişim & Yakın Çevre', description: 'Zihinsel faaliyetler, kardeşler, komşular, kısa seyahatler, ilköğretim ve günlük iletişim dili.', governingSign: 'İkizler' },
  { number: 4, title: '4. Ev (İç Gökyüzü / IC)', traditionalName: 'Genitor', area: 'Yuva, Aile & Kökler', description: 'Bilinçdışı temeller, ebeveynler, ev hayatı, atalar, çocukluk anıları ve iç huzur limanı.', governingSign: 'Yengeç' },
  { number: 5, title: '5. Ev', traditionalName: 'Nati', area: 'Aşk, Yaratıcılık & Çocuklar', description: 'Kendini ifade etme sevinci, hobiler, romantizm, oyun, şans oyunları ve yaşam coşkusu.', governingSign: 'Aslan' },
  { number: 6, title: '6. Ev', traditionalName: 'Valetudo', area: 'Çalışma Hayatı & Sağlık', description: 'Günlük rutinler, çalışma ortamı, hizmet etme bilinci, beslenme, evcil hayvanlar ve beden sağlığı.', governingSign: 'Başak' },
  { number: 7, title: '7. Ev (Alçalan / DSC)', traditionalName: 'Uxor', area: 'Evlilik & Ortaklıklar', description: 'Birebir ilişkiler, açık düşmanlar, evlilik, iş ortaklıkları, sözleşmeler ve öteki ile denge.', governingSign: 'Terazi' },
  { number: 8, title: '8. Ev', traditionalName: 'Mors', area: 'Dönüşüm, Kriz & Ortak Kaynaklar', description: 'Miras, başkalarının parası, cinsellik, okült sırlar, ruhsal ölüm ve yeniden doğuş simyası.', governingSign: 'Akrep' },
  { number: 9, title: '9. Ev', traditionalName: 'Iter', area: 'Felsefe, Yüksek Öğrenim & İnançlar', description: 'Uzak seyahatler, yabancı kültürler, hayatın anlamı, hukuk, akademi ve ruhsal vizyon.', governingSign: 'Yay' },
  { number: 10, title: '10. Ev (Tepe Noktası / MC)', traditionalName: 'Regnum', area: 'Kariyer & Toplumsal Statü', description: 'Toplum önündeki rol, başarılar, saygınlık, hedefler, unvanlar ve dünyaya bırakılan miras.', governingSign: 'Oğlak' },
  { number: 11, title: '11. Ev', traditionalName: 'Benefacta', area: 'Dostluklar, Gruplar & Gelecek', description: 'Kolektif vizyon, idealler, sivil toplum, geleceğe yönelik umutlar ve entelektüel dost meclisleri.', governingSign: 'Kova' },
  { number: 12, title: '12. Ev', traditionalName: 'Carcer', area: 'Bilinçdışı, Karmik Sırlar & İnziva', description: 'Kollektif bilinç, gizli düşmanlar, rüyalar, teslimiyet, meditasyon ve karmik arınma alanı.', governingSign: 'Balık' }
];

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
    tarotCard: {
      name: 'İmparator (IV - The Emperor)',
      number: 'IV',
      symbolism: 'Tahtta oturan savaşçı figür; otorite, irade ve sarsılmaz liderliği simgeler.',
      guidance: 'Bugün inisiyatif alın. Kendi hayatınızın ve kararlarınızın mutlak mimarı sizsiniz.'
    },
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
    loveCompatibility: ['aslan', 'yay', 'ikizler', 'kova'],
    dailyHoroscope: {
      energy: 'Yüksek ve dinamik. Yeni bir projeyi ateşe vermek için harika bir gün.',
      love: 'Partnerinize karşı açık sözlü olun ancak fevri çıkışlardan kaçının.',
      career: 'Cesur bir öneri sunmak yöneticilerinizin takdirini toplayabilir.',
      cosmicTip: 'Sabırsızlığınızı spora veya fiziksel bir üretime aktarın.',
      luckyHours: '10:00 - 12:30'
    }
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
    tarotCard: {
      name: 'Aziz (V - The Hierophant)',
      number: 'V',
      symbolism: 'Kadim gelenekler, manevi kökler ve sarsılmaz ahlaki ilkelerin koruyucusu.',
      guidance: 'Köklerinize ve değerlerinize sadık kalın. Güvenle inşa edilen her şey kalıcıdır.'
    },
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
    loveCompatibility: ['basak', 'oglak', 'yengec', 'balik'],
    dailyHoroscope: {
      energy: 'Dengeli, topraklanmış ve huzurlu. Duyusal zevkler ön planda.',
      love: 'Romantik bir akşam yemeği veya derin bir sohbet bağlarınızı güçlendirecek.',
      career: 'Finansal yatırımlar ve bütçe planlaması için güvenli adımlar atabilirsiniz.',
      cosmicTip: 'Doğada yürüyüş yaparak zihninizi arındırın.',
      luckyHours: '14:00 - 16:30'
    }
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
    tarotCard: {
      name: 'Aşıklar (VI - The Lovers)',
      number: 'VI',
      symbolism: 'Zıtlıkların birliği, kutsal seçim ve zihinsel ile duygusal uyum.',
      guidance: 'Fikirlerinizle kalbinizi aynı frekansta buluşturun. Seçimleriniz kimliğinizi yaratır.'
    },
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
    loveCompatibility: ['terazi', 'kova', 'koc', 'aslan'],
    dailyHoroscope: {
      energy: 'Canlı ve hareketli. Telefonunuz ve mesaj kutunuz bugün susmayabilir.',
      love: 'Zekice bir espri veya entelektüel bir tartışma flörtü canlandıracak.',
      career: 'Yeni bir kontrat veya dijital sunum için harika fikirler zihninizde parıldıyor.',
      cosmicTip: 'Aynı anda on işe bölünmek yerine en önemli 2 hedefe odaklanın.',
      luckyHours: '09:00 - 11:00'
    }
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
    tarotCard: {
      name: 'Savaş Arabası (VII - The Chariot)',
      number: 'VII',
      symbolism: 'Duyguların gücünü iradeyle dizginleyerek zafere ulaşan zırhlı lider.',
      guidance: 'Duygularınızı bir zaaf değil, sizi hedefinize taşıyan bir yakıt olarak kullanın.'
    },
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
    loveCompatibility: ['akrep', 'balik', 'boga', 'basak'],
    dailyHoroscope: {
      energy: 'Duygusal sezgileriniz tavan yapmış durumda. İç sesiniz yanıltmayacak.',
      love: 'Sevdiğinize koruyucu ve şefkatli bir güven alanı açmak ilişkinizi derinleştirecek.',
      career: 'Ekip içi iletişimi sağduyulu ve uzlaştırıcı tavrınız toparlayacak.',
      cosmicTip: 'Eski kırgınlıkları serbest bırakın, bugünün hafifliğini kucaklayın.',
      luckyHours: '19:00 - 21:30'
    }
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
    tarotCard: {
      name: 'Güç (VIII - Strength)',
      number: 'VIII',
      symbolism: 'Vahşi bir aslanın çenesini şefkatle okşayan kadın; kaba kuvvete karşı kalp gücü.',
      guidance: 'Gerçek güç baskı kurmakta değil; cömertlik, nezaket ve özgüvende yatar.'
    },
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
    loveCompatibility: ['koc', 'yay', 'ikizler', 'terazi'],
    dailyHoroscope: {
      energy: 'Işıltılı ve merkezde. Girdiğiniz her ortamda dikkatleri üzerinize çekeceksiniz.',
      love: 'Aşkta cömertçe iltifat etmek ve sürpriz yapmak karşılıksız kalmayacak.',
      career: 'Liderlik ettiğiniz bir projede vizyonunuzla herkesi peşinizden sürükleyebilirsiniz.',
      cosmicTip: 'Alkış beklemek yerine ürettiğiniz şeyin kendi öz değerine odaklanın.',
      luckyHours: '12:00 - 14:00'
    }
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
    tarotCard: {
      name: 'Ermiş (IX - The Hermit)',
      number: 'IX',
      symbolism: 'Karanlıkta fener tutan bilge arayıcı; içsel aydınlanma ve hakikat arayışı.',
      guidance: 'Dış gürültüyü kapatıp bilgeliğinize kulak verin. Cevaplar detaylarda gizli.'
    },
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
    loveCompatibility: ['boga', 'oglak', 'yengec', 'akrep'],
    dailyHoroscope: {
      energy: 'Odaklanmış ve çözüm odaklı. Karmaşık sorunları tereyağından kıl çeker gibi çözeceksiniz.',
      love: 'Küçük pratik jestler ve hayatını kolaylaştıran dokunuşlar partnerinizi çok mutlu edecek.',
      career: 'Hataları erkenden fark etmeniz olası bir krizi başlamadan bitirecek.',
      cosmicTip: 'Mükemmelin iyinin düşmanı olduğunu hatırlayın; kendinizi hırpalamayın.',
      luckyHours: '08:30 - 10:30'
    }
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
    tarotCard: {
      name: 'Adalet (XI - Justice)',
      number: 'XI',
      symbolism: 'Elinde kılıç ve terazi tutan figür; nesnel muhakeme, dürüstlük ve kozmik denge.',
      guidance: 'Kararlarınızda adil ve tarafsız olun. Ektiğinizi biçeceğiniz bir döngüdesiniz.'
    },
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
    loveCompatibility: ['ikizler', 'kova', 'aslan', 'yay'],
    dailyHoroscope: {
      energy: 'Zarif, uzlaşmacı ve sosyal. İkili ilişkilerde dengeyi kurma zamanı.',
      love: 'Karşılıklı anlayış ve romantik bir uyum gökyüzü tarafından destekleniyor.',
      career: 'Arabuluculuk gerektiren görüşmelerde kilit rol üstlenebilirsiniz.',
      cosmicTip: 'Herkesi memnun etmek zorunda değilsiniz; kendi sınırlarınıza da sahip çıkın.',
      luckyHours: '15:00 - 17:30'
    }
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
    tarotCard: {
      name: 'Ölüm & Dönüşüm (XIII - Death)',
      number: 'XIII',
      symbolism: 'Güneşin doğuşunu müjdeleyen dönüşüm; miadını dolduranın bitip yeninin doğuşu.',
      guidance: 'Eskiye tutunmayı bırakın. Gerçek küllerinizden ancak böyle doğabilirsiniz.'
    },
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
    loveCompatibility: ['yengec', 'balik', 'boga', 'basak'],
    dailyHoroscope: {
      energy: 'Yoğun, derin ve manyetik. İnsanların gizli motivasyonlarını sezebilirsiniz.',
      love: 'Yüzeysel konuşmalar değil, ruhu sarsan derin bir samimiyet arayışı içindesiniz.',
      career: 'Gizli kalmış bir veri veya stratejik açık elinize koz olarak geçebilir.',
      cosmicTip: 'Şüpheyi sezgiye dönüştürün; her şeyi kontrol etme arzusunu bırakın.',
      luckyHours: '21:00 - 23:00'
    }
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
    tarotCard: {
      name: 'Denge (XIV - Temperance)',
      number: 'XIV',
      symbolism: 'İki kadeh arasında iksiri dökmeden aktaran melek; simya ve orta yol.',
      guidance: 'Farklı görüşleri ve vizyonları uyumla sentezleyin. Bilgelik dengede bulunur.'
    },
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
    loveCompatibility: ['koc', 'aslan', 'terazi', 'kova'],
    dailyHoroscope: {
      energy: 'Coşkulu, neşeli ve ufuk açıcı. Yeni bir eğitim veya seyahat planı gündemde.',
      love: 'Birlikte gülmek ve macera paylaşmak ilişkinin en tatlı çimentosu olacak.',
      career: 'Uluslararası bağlantılar veya büyük ölçekli hedefler için kapılar aralanıyor.',
      cosmicTip: 'Okunuzu en yüksek yıldıza doğrultun ancak ayağınızın yerdeki taşını da unutmayın.',
      luckyHours: '11:00 - 13:00'
    }
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
    tarotCard: {
      name: 'Şeytan & Yapı (XV - The Devil)',
      number: 'XV',
      symbolism: 'Maddi dünyaya ve prangalara meydan okuyan bilinç; gölgelerle yüzleşme.',
      guidance: 'Kendi kendinize koyduğunuz sınırları aşın. Disiplininiz sizi özgürleştirmeli, hapsetmemeli.'
    },
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
    loveCompatibility: ['boga', 'basak', 'akrep', 'balik'],
    dailyHoroscope: {
      energy: 'Ciddi, sağlam ve net. Uzun vadeli bir hedefin temelini atabilirsiniz.',
      love: 'Güvenilirlik ve sadakat sözlerle değil, somut davranışlarla kendini gösterecek.',
      career: 'Yöneticilerinizin veya iş ortaklarınızın saygısını kazanan bir duruş sergileyeceksiniz.',
      cosmicTip: 'Biraz rahatlayın ve başarının tadını çıkarmak için kendinize izin verin.',
      luckyHours: '09:00 - 11:30'
    }
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
    tarotCard: {
      name: 'Yıldız (XVII - The Star)',
      number: 'XVII',
      symbolism: 'Gökten akan berrak ilham suları; umut, yenilenme ve evrensel ışık.',
      guidance: 'Geleceğe güvenle bakın. Özgün fikirleriniz topluma ışık tutacak güçte.'
    },
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
    loveCompatibility: ['ikizler', 'terazi', 'koc', 'yay'],
    dailyHoroscope: {
      energy: 'Sıra dışı, vizyoner ve teknoloji odaklı. Kalıpların dışına çıkma günü.',
      love: 'Dostluk üzerine inşa edilen bir aşk her zamankinden daha sağlam parıldıyor.',
      career: 'Geleneksel yöntemleri rafa kaldırıp getirdiğiniz dijital çözüm takdir görecek.',
      cosmicTip: 'Farklılığınız sizin en büyük gücünüzdür; uyum sağlamak için kendinizi kısıtlamayın.',
      luckyHours: '16:00 - 18:30'
    }
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
    tarotCard: {
      name: 'Ay (XVIII - The Moon)',
      number: 'XVIII',
      symbolism: 'Rüyalar, bilinçdışı okyanusu ve derin sezgilerin gizemli ışığı.',
      guidance: 'Rüyalarınıza ve hislerinize dikkat edin. Mantığın çözemediğini sezgileriniz bilir.'
    },
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
    loveCompatibility: ['yengec', 'akrep', 'boga', 'oglak'],
    dailyHoroscope: {
      energy: 'Mistik, sanatsal ve şefkatli. Yaratıcı ilham kanallarınız sonuna kadar açık.',
      love: 'Sözsüz bir bakışla bile anlaşabileceğiniz telepatik bir çekim hissedebilirsiniz.',
      career: 'Sanat, tasarım veya insan ilişkileri gerektiren işlerde harikalar yaratacaksınız.',
      cosmicTip: 'Ruhunuzu besleyen müziğe ve meditatif anlara zaman ayırın.',
      luckyHours: '20:00 - 22:30'
    }
  }
];

export function getSunSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.startMonth && day >= sign.startDay) ||
      (month === sign.endMonth && day <= sign.endDay)
    ) {
      return sign;
    }
  }
  return ZODIAC_SIGNS[9];
}

export function calculateAscendant(sunSignIndex: number, birthHour: number): ZodiacSign {
  const offset = Math.floor(((birthHour - 6 + 24) % 24) / 2);
  const ascIndex = (sunSignIndex + offset) % 12;
  return ZODIAC_SIGNS[ascIndex];
}

export function calculateMoonSign(sunSignIndex: number, birthDay: number): ZodiacSign {
  const moonOffset = Math.floor((birthDay * 1.5) % 12);
  const moonIndex = (sunSignIndex + moonOffset) % 12;
  return ZODIAC_SIGNS[moonIndex];
}

/**
 * Calculates Full Planetary Placements across the 12 signs & 12 houses
 */
export function calculatePlanetaryPlacements(
  sunSignIndex: number,
  ascendantIndex: number,
  birthDay: number,
  birthYear: number
): PlanetaryPlacement[] {
  const mod12 = (val: number) => ((val % 12) + 12) % 12;

  // Mercury is never more than 28° from Sun (within ±1 sign)
  const mercurySignIdx = mod12(sunSignIndex + ((birthDay % 3) - 1));
  // Venus is never more than 47° from Sun (within ±2 signs)
  const venusSignIdx = mod12(sunSignIndex + ((birthDay % 5) - 2));
  // Mars moves through signs every ~2 months
  const marsSignIdx = mod12(sunSignIndex + (birthDay % 7) - 3);
  // Jupiter stays ~1 year in a sign
  const jupiterSignIdx = mod12((birthYear - 1900) % 12);
  // Saturn stays ~2.5 years in a sign
  const saturnSignIdx = mod12(Math.floor((birthYear - 1900) / 2.5));

  const getHouse = (signIdx: number) => mod12(signIdx - ascendantIndex) + 1;

  return [
    {
      planet: 'Güneş (Sol)',
      planetSymbol: '☉',
      sign: ZODIAC_SIGNS[sunSignIndex].name,
      signSymbol: ZODIAC_SIGNS[sunSignIndex].symbol,
      degree: (birthDay * 7) % 30,
      house: getHouse(sunSignIndex),
      meaning: 'Öz kimlik, bilinçli irade, yaratıcı yaşam gücü ve benliğin kalbi.'
    },
    {
      planet: 'Ay (Luna)',
      planetSymbol: '☽',
      sign: ZODIAC_SIGNS[mod12(sunSignIndex + Math.floor(birthDay * 1.5))].name,
      signSymbol: ZODIAC_SIGNS[mod12(sunSignIndex + Math.floor(birthDay * 1.5))].symbol,
      degree: (birthDay * 13) % 30,
      house: getHouse(mod12(sunSignIndex + Math.floor(birthDay * 1.5))),
      meaning: 'Duygusal güvenlik, annelik arketipleri, bilinçdışı hafıza ve ruh hali.'
    },
    {
      planet: 'Merkür (Hermes)',
      planetSymbol: '☿',
      sign: ZODIAC_SIGNS[mercurySignIdx].name,
      signSymbol: ZODIAC_SIGNS[mercurySignIdx].symbol,
      degree: (birthDay * 11) % 30,
      house: getHouse(mercurySignIdx),
      meaning: 'Düşünce biçimi, mantık akışı, öğrenme hızı ve iletişim dili.'
    },
    {
      planet: 'Venüs (Afrodit)',
      planetSymbol: '♀',
      sign: ZODIAC_SIGNS[venusSignIdx].name,
      signSymbol: ZODIAC_SIGNS[venusSignIdx].symbol,
      degree: (birthDay * 17) % 30,
      house: getHouse(venusSignIdx),
      meaning: 'Sevgi dili, estetik zevkler, romantizm, finansal çekim ve değerler.'
    },
    {
      planet: 'Mars (Ares)',
      planetSymbol: '♂',
      sign: ZODIAC_SIGNS[marsSignIdx].name,
      signSymbol: ZODIAC_SIGNS[marsSignIdx].symbol,
      degree: (birthDay * 19) % 30,
      house: getHouse(marsSignIdx),
      meaning: 'Eylem gücü, tutku, cesaret, mücadele azmi ve fiziksel dürtüler.'
    },
    {
      planet: 'Jüpiter (Zeus)',
      planetSymbol: '♃',
      sign: ZODIAC_SIGNS[jupiterSignIdx].name,
      signSymbol: ZODIAC_SIGNS[jupiterSignIdx].symbol,
      degree: (birthDay * 5) % 30,
      house: getHouse(jupiterSignIdx),
      meaning: 'Şans, bolluk, yüksek felsefe, genişleme ve manevi koruma alanı.'
    },
    {
      planet: 'Satürn (Kronos)',
      planetSymbol: '♄',
      sign: ZODIAC_SIGNS[saturnSignIdx].name,
      signSymbol: ZODIAC_SIGNS[saturnSignIdx].symbol,
      degree: (birthDay * 3) % 30,
      house: getHouse(saturnSignIdx),
      meaning: 'Karmik sorumluluklar, olgunlaşma sınavları, disiplin ve ustalaşma.'
    }
  ];
}

/**
 * Calculates Life Path Number (Yaşam Yolu Sayısı) using Pythagorean Numerology
 */
export function calculateLifePathNumber(day: number, month: number, year: number): {
  number: number;
  title: string;
  description: string;
} {
  const reduce = (n: number): number => {
    let sum = 0;
    while (n > 0) {
      sum += n % 10;
      n = Math.floor(n / 10);
    }
    // Master numbers 11, 22, 33 are preserved
    if (sum === 11 || sum === 22 || sum === 33 || sum < 10) return sum;
    return reduce(sum);
  };

  const rDay = reduce(day);
  const rMonth = reduce(month);
  const rYear = reduce(year);
  const finalNum = reduce(rDay + rMonth + rYear);

  const lifePathDict: Record<number, { title: string; desc: string }> = {
    1: { title: 'Öncü & Lider', desc: 'Bağımsızlık, özgün fikirler ve yeni yollar açma iradesi.' },
    2: { title: 'Barışçı & Diplomat', desc: 'İşbirliği, sezgisel uyum, şefkat ve köprü kurma yetisi.' },
    3: { title: 'Sanatçı & İfade Ustası', desc: 'Yaratıcı coşku, mizah, sözlü ifade ve neşe yayma.' },
    4: { title: 'İnşa Edici & Usta', desc: 'Disiplin, sağlam temeller atma, pratiklik ve güvenilirlik.' },
    5: { title: 'Özgür Ruh & Gezgin', desc: 'Macera, çok yönlülük, değişim cesareti ve ilerici vizyon.' },
    6: { title: 'Şifacı & Koruyucu', desc: 'Aile sevgisi, sorumluluk bilinci, estetik ve fedakarlık.' },
    7: { title: 'Filozof & Mistik', desc: 'Derin analiz, hakikat arayışı, maneviyat ve içsel bilgelik.' },
    8: { title: 'Güç & Bolluk Yöneticisi', desc: 'Maddi ve manevi başarı, strateji, liderlik ve adalet.' },
    9: { title: 'Hümanist & Evrensel Bilge', desc: 'Koşulsuz sevgi, küresel vizyon, sanat ve ruhsal tamamlanma.' },
    11: { title: 'Usta Aydınlatıcı (Master 11)', desc: 'Yüksek sezgiler, ilham verici rehberlik ve manevi kanal.' },
    22: { title: 'Usta Mimar (Master 22)', desc: 'Büyük idealleri somut dünyada gerçeğe dönüştürme dehası.' },
    33: { title: 'Usta Şifacı (Master 33)', desc: 'Evrensel şefkat, insanlığa hizmet ve koşulsuz sevgi enerjisi.' }
  };

  const info = lifePathDict[finalNum] || lifePathDict[1];
  return {
    number: finalNum,
    title: info.title,
    description: info.desc
  };
}
