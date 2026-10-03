/**
 * Extended dossier content for the twelve signs: character, life areas, mythology and
 * the real constellation behind each sign. Astrological texts describe a cultural tradition;
 * the `sky` block is astronomy (IAU constellation boundaries, magnitudes, deep-sky objects).
 */

export interface ZodiacProfile {
  id: string;
  keywords: string[];
  personality: string;
  love: string;
  career: string;
  friendship: string;
  growth: string;
  /** Traditional body association (melothesia) */
  body: string;
  myth: { title: string; text: string };
  sky: {
    /** Dates the Sun actually crosses the IAU constellation (differs from the sign dates because of precession) */
    sunTransit: string;
    brightestStar: string;
    /** Best evening visibility from Türkiye */
    season: string;
    highlights: string[];
  };
  /** Classical planetary dignities: exaltation, detriment, fall */
  dignity: { exaltation: string | null; detriment: string; fall: string | null };
}

export const ZODIAC_PROFILES: Record<string, ZodiacProfile> = {
  koc: {
    id: 'koc',
    keywords: ['Cesaret', 'Başlangıç', 'İnisiyatif', 'Rekabet', 'Doğrudanlık'],
    personality:
      'Koç, zodyakın ilk burcu olarak her şeye “ilk” olma isteğiyle yaklaşır. Düşünmekten çok harekete geçerek öğrenir; bir fikir onu heyecanlandırdığında beklemeye tahammülü yoktur. Açık sözlü, rekabetçi ve korumacıdır; öfkesi çabuk parlar ama kin tutmaz. Hayatı bir mücadele alanı olarak görür ve en iyi hâlini zorlukların karşısında gösterir.',
    love: 'Aşkta avcı ruhludur: ilgisini çeken kişiye doğrudan yaklaşır, oyun oynamaz. Heyecanı ve tutkuyu canlı tutan, ona alan tanıyan ama gerektiğinde meydan da okuyabilen partnerlerle mutlu olur. En büyük düşmanı sıkılmaktır; ilişkiyi rutine kaptırmamak için ortak maceralar iyi gelir.',
    career: 'Liderlik, girişimcilik, spor, acil durum meslekleri ve hızlı karar gerektiren her alan Koç’a göredir. Projeleri başlatmakta ustadır; uzun soluklu takipte sabırlı bir ekip arkadaşı onu tamamlar. Parayı kazanmakta olduğu kadar harcamakta da hızlıdır.',
    friendship: 'Sadık, cesur ve eğlenceli bir dosttur; arkadaşı zor durumdayken ilk koşan odur. Rekabeti dostluğa da taşıyabilir; spor, oyun ve yol arkadaşlığı bağlarını güçlendirir.',
    growth: 'Sabır ve dinlemek Koç’un en büyük gelişim alanıdır. Bir işe başlamadan önce durup düşünmek, bitirmeden yenisine geçmemek ve öfkeyi fiziksel enerjiye dönüştürmek onu güçlendirir.',
    body: 'Baş ve yüz',
    myth: {
      title: 'Altın Post’un koçu',
      text: 'Yunan mitolojisinde Koç, Phriksos ile Helle’yi üvey anneleri İno’nun tuzağından kurtarmak için gönderilen altın yapağılı uçan koç Khrysomallos’tur. Helle yolda denize düşer; Çanakkale Boğazı’nın antik adı Hellespontos, “Helle’nin denizi” buradan gelir. Phriksos Kolkhis’e ulaşır ve koçun postu, Argonotların arayacağı efsanevi Altın Post olur. Zeus koçu gökyüzüne yerleştirir.',
    },
    sky: {
      sunTransit: '18 Nisan – 13 Mayıs',
      brightestStar: 'Hamal (α Arietis) · 2,0 kadir',
      season: 'Aralık akşamları',
      highlights: [
        'Hamal, Sheratan ve Mesarthim’in çizdiği kısa kavis',
        'Bahar noktası, adı “Koç’un ilk noktası” olsa da presesyon yüzünden bugün Balık takımyıldızındadır',
        'Sarmal gökada NGC 772',
      ],
    },
    dignity: { exaltation: 'Güneş', detriment: 'Venüs', fall: 'Satürn' },
  },
  boga: {
    id: 'boga',
    keywords: ['İstikrar', 'Sabır', 'Duyusallık', 'Sadakat', 'Bereket'],
    personality:
      'Boğa, acele etmeden ama kararlılıkla ilerler. Güvenliği, konforu ve elle tutulur sonuçları sever; bir kez karar verdiğinde onu yolundan döndürmek zordur. Beş duyusuyla yaşar: iyi yemek, güzel müzik, doğa ve kaliteli malzeme onu besler. Sakin görünümünün altında güçlü bir irade yatar.',
    love: 'Aşkta yavaş başlar ama derin ve kalıcı bağlar kurar. Güven, sadakat ve fiziksel yakınlık onun için temel taşlardır; sevgisini sözden çok emek ve özenle gösterir. Belirsizlikten ve aceleden hoşlanmaz; sahiplenici yanını fark etmek ilişkisine iyi gelir.',
    career: 'Finans, mimarlık, tasarım, gastronomi, tarım, müzik ve sanat gibi hem estetik hem somut sonuç isteyen alanlarda parlar. Düzenli ve güvenilir çalışır; değişimi yönetmekten çok sürekliliği korumakta başarılıdır. Para biriktirmekte ve kalıcı değer yaratmakta yeteneklidir.',
    friendship: 'Yıllar geçse de değişmeyen, güvenilir bir dosttur. Arkadaşlarını sofrasında ağırlamayı, birlikte doğada vakit geçirmeyi sever; az ama öz insanla derin bağ kurar.',
    growth: 'Esneklik Boğa’nın gelişim alanıdır. Değişimi bir tehdit değil fırsat olarak görmek, inatla sabrı birbirinden ayırmak ve konfor alanının dışına küçük adımlarla çıkmak onu büyütür.',
    body: 'Boyun, boğaz ve ses telleri',
    myth: {
      title: 'Zeus ve Europa',
      text: 'Zeus, Fenike prensesi Europa’ya gönül verince kendini bembeyaz, uysal bir boğaya dönüştürür. Europa boğanın sırtına bindiği anda boğa denize açılır ve onu Girit’e götürür; Avrupa kıtası adını bu prensesten alır. Gökyüzündeki Boğa yalnızca ön yarısıyla, sudan yükselen bir boğa olarak çizilir.',
    },
    sky: {
      sunTransit: '13 Mayıs – 21 Haziran',
      brightestStar: 'Aldebaran (α Tauri) · 0,9 kadir',
      season: 'Ocak akşamları',
      highlights: [
        'Ülker (Pleiades, M45) yıldız kümesi',
        'Boğa’nın yüzünü çizen Hyades kümesi',
        '1054 yılında gözlenen süpernovanın kalıntısı Yengeç Bulutsusu (M1)',
      ],
    },
    dignity: { exaltation: 'Ay', detriment: 'Mars', fall: null },
  },
  ikizler: {
    id: 'ikizler',
    keywords: ['Merak', 'İletişim', 'Çok yönlülük', 'Zekâ', 'Hareket'],
    personality:
      'İkizler, zihni hiç durmayan meraklı bir gezgindir. Her konuda bir şey bilmek, herkesle konuşmak ve fikirleri birbirine bağlamak ister. Esprili, uyumlu ve hızlıdır; aynı anda birkaç işi yürütebilir. İkili doğası onu hem eğlenceli hem de zaman zaman kararsız kılar.',
    love: 'Aşkta önce zihinsel bir kıvılcım arar: iyi bir sohbet, ortak kahkahalar ve sürprizler. Onu merakta tutan, kendini tekrar etmeyen partnerlerle bağ kurar. Duygularını analiz etmeye eğilimlidir; hissettiklerini sözle ifade etmesi ilişkiyi derinleştirir.',
    career: 'Gazetecilik, yazarlık, öğretmenlik, pazarlama, satış, çeviri ve medya İkizler’in doğal sahasıdır. Değişken ve tempolu ortamlarda parlar; tekdüze işler onu çabuk köreltir. Ağ kurmakta ve bilgiyi yaymakta eşsizdir.',
    friendship: 'Geniş bir çevresi vardır; her gruba uyum sağlar ve sohbeti canlandırır. Dostluklarında hafiflik ve oyun arar; ona fikir alışverişi sunan arkadaşlarla bağı güçlenir.',
    growth: 'Derinleşmek İkizler’in gelişim alanıdır. Bir konuyu sonuna kadar götürmek, sözlerini eylemle tutarlı kılmak ve dağınık enerjisini tek bir hedefte toplamak onu güçlendirir.',
    body: 'Kollar, eller, omuzlar ve akciğerler',
    myth: {
      title: 'Kastor ve Polluks',
      text: 'Takımyıldızın iki parlak yıldızı, Spartalı ikiz kardeşler Kastor ve Polluks’un adını taşır. Kastor ölümlü, Polluks ise Zeus’un oğlu olarak ölümsüzdür. Kastor ölünce Polluks ölümsüzlüğünü kardeşiyle paylaşmak ister; Zeus da ikisini gökyüzüne yan yana yerleştirir. Antik denizciler onları fırtınada yol gösteren koruyucular olarak bilirdi.',
    },
    sky: {
      sunTransit: '21 Haziran – 20 Temmuz',
      brightestStar: 'Polluks (β Geminorum) · 1,1 kadir',
      season: 'Şubat akşamları',
      highlights: [
        'Polluks, alfa yıldızı Kastor’dan daha parlaktır',
        'M35 açık yıldız kümesi ve Eskimo Bulutsusu (NGC 2392)',
        'Aralık ortasında zirve yapan İkizler (Geminid) meteor yağmuru',
      ],
    },
    dignity: { exaltation: null, detriment: 'Jüpiter', fall: null },
  },
  yengec: {
    id: 'yengec',
    keywords: ['Şefkat', 'Yuva', 'Sezgi', 'Koruma', 'Hafıza'],
    personality:
      'Yengeç, sert kabuğunun içinde son derece hassas bir kalp taşır. Ailesine, köklerine ve sevdiklerine derinden bağlıdır; insanların duygularını sezgiyle okur. Ay gibi ruh hâli dalgalanabilir; güvende hissettiğinde sıcak, cömert ve koruyucudur. Geçmişe ve anılara özel bir değer verir.',
    love: 'Aşkta güven ve duygusal yakınlık arar; kalbini açması zaman alır ama açtığında bütünüyle bağlanır. Sevdiğini besleyen, kollayan bir partnerdir. Kırıldığında kabuğuna çekilebilir; duygularını açıkça konuşmak ilişkisini korur.',
    career: 'Sağlık, bakım, eğitim, psikoloji, gastronomi, gayrimenkul ve tarih gibi insanlara dokunan ya da geçmişi koruyan alanlarda başarılıdır. Ekibini aile gibi sahiplenir; güven duyduğu ortamda çok verimli çalışır.',
    friendship: 'Arkadaşlarını ailesinin bir parçası sayar; doğum günlerini hatırlar, zor günde sofrasını açar. Az sayıda ama ömür boyu süren dostluklar kurar.',
    growth: 'Geçmişi bırakmak ve kendi duygularını başkalarının ruh hâlinden ayırmak Yengeç’in gelişim alanıdır. Başkalarına gösterdiği şefkati kendine de göstermesi onu güçlendirir.',
    body: 'Göğüs ve mide',
    myth: {
      title: 'Herakles’in yengeci',
      text: 'Herakles, Lerna’daki çok başlı Hydra ile savaşırken tanrıça Hera, kahramanın dikkatini dağıtmak için dev bir yengeç, Karkinos’u gönderir. Herakles yengeci ezip geçer; Hera da sadık hizmetkârını ödüllendirmek için onu gökyüzüne yerleştirir. Takımyıldızın sönük yıldızlardan oluşması, yengecin bu mütevazı rolüne uygun düşer.',
    },
    sky: {
      sunTransit: '20 Temmuz – 10 Ağustos',
      brightestStar: 'Tarf (β Cancri) · 3,5 kadir',
      season: 'Mart akşamları',
      highlights: [
        'Arı Kovanı kümesi (Praesepe, M44): karanlık gökte çıplak gözle bulanık bir leke',
        'Bilinen en yaşlı açık kümelerden M67',
        'Yengeç Dönencesi adını, Güneş’in antik çağda yaz gündönümünde bu takımyıldızda bulunmasından alır',
      ],
    },
    dignity: { exaltation: 'Jüpiter', detriment: 'Satürn', fall: 'Mars' },
  },
  aslan: {
    id: 'aslan',
    keywords: ['Özgüven', 'Yaratıcılık', 'Cömertlik', 'Sahne', 'Sadakat'],
    personality:
      'Güneş’in yönettiği Aslan, bulunduğu her ortama ışık ve sıcaklık getirir. Kendini ifade etmek, takdir görmek ve iz bırakmak ister. Cömert, sadık ve koruyucudur; sevdikleri için elinden geleni yapar. Gururu güçlüdür; kendine olan inancı çevresine de cesaret verir.',
    love: 'Aşkta romantik ve tutkuludur; büyük jestleri, ilgiyi ve hayranlığı sever. Sevdiğine sadakatle bağlanır ve onu her ortamda gururla sahiplenir. Takdir edilmediğini hissettiğinde kırılır; karşılıklı ilgi ve övgü ilişkisini canlı tutar.',
    career: 'Sahne sanatları, yöneticilik, eğitim, tasarım, eğlence ve marka yönetimi gibi görünür olduğu, yaratıcılığını kullandığı alanlarda parlar. Doğal bir liderdir; ekibini motive eder. Lüksü sever, harcamalarında cömerttir.',
    friendship: 'Sıcak, koruyucu ve eğlenceli bir dosttur; buluşmaların merkezi olur. Arkadaşlarını yürekten destekler, karşılığında da sadakat bekler.',
    growth: 'Alçakgönüllülük ve dinlemek Aslan’ın gelişim alanıdır. Spot ışığını başkalarıyla paylaşmak, eleştiriyi kişisel algılamamak ve onaya ihtiyaç duymadan değerini bilmek onu güçlendirir.',
    body: 'Kalp, sırt ve omurga',
    myth: {
      title: 'Nemea Aslanı',
      text: 'Herakles’in on iki görevinin ilki, derisine hiçbir silahın işlemediği Nemea Aslanı’nı öldürmekti. Kahraman aslanı çıplak elleriyle boğar ve derisini zırh olarak giyer. Zeus, oğlunun zaferini anmak için aslanı gökyüzüne yerleştirir. Aslan’ın başını çizen yıldızlar, ters bir soru işaretine benzeyen “Orak” dizilimini oluşturur.',
    },
    sky: {
      sunTransit: '10 Ağustos – 16 Eylül',
      brightestStar: 'Regulus (α Leonis) · 1,4 kadir',
      season: 'Nisan akşamları',
      highlights: [
        'Aslan Üçlüsü gökadaları: M65, M66 ve NGC 3628',
        'Başı çizen “Orak” yıldız dizilimi',
        'Kasım ortasında zirve yapan Aslan (Leonid) meteor yağmuru',
      ],
    },
    dignity: { exaltation: null, detriment: 'Satürn', fall: null },
  },
  basak: {
    id: 'basak',
    keywords: ['Analiz', 'Düzen', 'Hizmet', 'Titizlik', 'Şifa'],
    personality:
      'Başak, ayrıntıları gören ve dağınıklığı düzene çeviren bir zihne sahiptir. Pratik, çalışkan ve yardımseverdir; bir işi en doğru şekilde yapmak ister. Sessiz ama keskin bir gözlemcidir. Yüksek standartları onu başarılı kılar, ama kendine karşı fazla eleştirel de olabilir.',
    love: 'Aşkta temkinli ve sadıktır; sevgisini küçük ama anlamlı ilgilerle, pratik destekle gösterir. Güvenilirlik ve zihinsel uyum onun için önemlidir. Kusur aramak yerine kusuru kabullenmeyi öğrendiğinde ilişkisi derinleşir.',
    career: 'Sağlık, araştırma, mühendislik, editörlük, muhasebe, veri analizi ve beslenme gibi kesinlik ve özen gerektiren alanlarda üstün başarı gösterir. Sistem kurar, süreçleri iyileştirir. Parayı dikkatli ve planlı yönetir.',
    friendship: 'Zor günde pratik bir çözümle gelen, sözünü tutan bir dosttur. Kalabalık yerine samimi sohbetleri tercih eder; yardım etmek onun sevgi dilidir.',
    growth: 'Mükemmeliyetçiliği bırakmak Başak’ın gelişim alanıdır. “Yeterince iyi”nin de değerli olduğunu kabul etmek, kendine şefkat göstermek ve kontrolü zaman zaman bırakmak onu rahatlatır.',
    body: 'Sindirim sistemi ve bağırsaklar',
    myth: {
      title: 'Başak tutan genç kız',
      text: 'Başak çoğunlukla elinde buğday başağı tutan bir genç kadın olarak çizilir. Bazı anlatılarda o, hasat tanrıçası Demeter ya da kızı Persephone’dir. Bir başka anlatıda ise insanlar kötüleşince Dünya’yı en son terk eden adalet tanrıçası Astraea’dır. En parlak yıldızı Spika’nın adı Latincede “başak” demektir.',
    },
    sky: {
      sunTransit: '16 Eylül – 30 Ekim',
      brightestStar: 'Spika (α Virginis) · 1,0 kadir',
      season: 'Mayıs akşamları',
      highlights: [
        'Binden fazla gökadanın oluşturduğu Başak Kümesi',
        'İlk kez fotoğraflanan kara deliğin evi M87',
        'Zodyakın en büyük, gökyüzünün ikinci büyük takımyıldızı',
      ],
    },
    dignity: { exaltation: 'Merkür', detriment: 'Jüpiter', fall: 'Venüs' },
  },
  terazi: {
    id: 'terazi',
    keywords: ['Denge', 'Uyum', 'Estetik', 'Diplomasi', 'Adalet'],
    personality:
      'Terazi, hayatın her alanında denge ve uyum arar. Zarif, nazik ve adil olmaya özen gösterir; çatışmayı yumuşatmakta ve farklı tarafları buluşturmakta ustadır. Güzelliğe, sanata ve iyi ilişkilere değer verir. Her iki tarafı da görebilmesi onu bilge kılar, ama karar vermesini de zorlaştırabilir.',
    love: 'İlişki Terazi için hayatın merkezindedir; ortaklık içinde kendini tamamlanmış hisseder. Romantik, düşünceli ve incelikli bir partnerdir. Uyumu korumak için kendi isteklerini geri planda bırakabilir; ihtiyaçlarını açıkça söylemek ilişkisini dengeler.',
    career: 'Hukuk, diplomasi, insan kaynakları, tasarım, moda, sanat yönetimi ve arabuluculuk Terazi’nin yeteneklerini öne çıkarır. Ekip çalışmasında ve müzakerede başarılıdır; estetik bir çalışma ortamı verimini artırır.',
    friendship: 'Sosyal, davetkâr ve uyumlu bir dosttur; arkadaş gruplarını bir arada tutan kişidir. Herkesle iyi geçinir, kırıcı olmamaya özen gösterir.',
    growth: 'Karar vermek ve gerektiğinde “hayır” demek Terazi’nin gelişim alanıdır. Herkesi memnun etmeye çalışmak yerine kendi sesini duyurmak, iç dengesini dış onaydan bağımsız kurmak onu güçlendirir.',
    body: 'Böbrekler ve bel bölgesi',
    myth: {
      title: 'Kıskaçtan teraziye',
      text: 'Terazi, zodyakta cansız bir nesneyle simgelenen tek burçtur. Antik Yunanlar bu yıldızları uzun süre komşusu Akrep’in kıskaçları olarak görmüştür; yıldız adları Zubenelgenubi (“güney kıskacı”) ve Zubeneschamali (“kuzey kıskacı”) hâlâ bunu hatırlatır. Romalılar ise onu yanındaki Başak’ın, yani adalet tanrıçası Astraea’nın elindeki terazi olarak benimsemiştir.',
    },
    sky: {
      sunTransit: '30 Ekim – 23 Kasım',
      brightestStar: 'Zubeneschamali (β Librae) · 2,6 kadir',
      season: 'Haziran akşamları',
      highlights: [
        'Çıplak gözle yeşilimsi göründüğü söylenen Zubeneschamali',
        'Gezegenleriyle tanınan kırmızı cüce Gliese 581',
        'Antik çağda sonbahar noktası bu takımyıldızdaydı',
      ],
    },
    dignity: { exaltation: 'Satürn', detriment: 'Mars', fall: 'Güneş' },
  },
  akrep: {
    id: 'akrep',
    keywords: ['Tutku', 'Derinlik', 'Dönüşüm', 'Sezgi', 'Kararlılık'],
    personality:
      'Akrep, yüzeyin altında olanı merak eden yoğun ve tutkulu bir burçtur. Sırları çözmeyi, insanların gerçek niyetlerini sezmeyi ve hayatın karanlık yanlarıyla yüzleşmeyi göze alır. Sadakati derin, iradesi güçlüdür; bir hedefe kilitlendiğinde vazgeçmez. Kriz anlarında soğukkanlılığını koruyarak yeniden doğmayı bilir.',
    love: 'Aşkta ya hep ya hiç der; yüzeysel ilişkiler onu tatmin etmez. Derin bir duygusal ve fiziksel bağ, mutlak güven ve sadakat ister. Kıskançlık ve kontrol eğilimini fark edip kırılganlığını paylaştığında ilişkileri dönüştürücü bir derinlik kazanır.',
    career: 'Araştırma, psikoloji, cerrahi, kriminoloji, finans, kriz yönetimi ve dedektiflik gibi derinlemesine inceleme ve dayanıklılık gerektiren alanlarda güçlüdür. Gizli kalanı ortaya çıkarmakta ve kaynakları stratejik yönetmekte ustadır.',
    friendship: 'Seçici ama son derece sadık bir dosttur; sırrını emanet edebileceğin kişidir. Az insana güvenir, güvendiğini de sonuna kadar korur.',
    growth: 'Bırakmak ve affetmek Akrep’in gelişim alanıdır. Kontrol ihtiyacını gevşetmek, geçmiş kırgınlıkları taşımamak ve savunmasız kalmayı bir güç olarak görmek onu özgürleştirir.',
    body: 'Üreme ve boşaltım organları',
    myth: {
      title: 'Orion’un akrebi',
      text: 'Avcı Orion dünyadaki bütün hayvanları avlayabileceğiyle övününce, toprak ana Gaia (bazı anlatılarda Artemis) onu durdurmak için bir akrep gönderir ve akrep Orion’u sokarak öldürür. Tanrılar ikisini gökyüzünün karşıt uçlarına yerleştirir: Akrep doğudan yükselirken Orion batıda batar, ikisi asla birlikte görülmez.',
    },
    sky: {
      sunTransit: '23 – 29 Kasım (yalnızca 7 gün; ardından Güneş Yılancı takımyıldızına geçer)',
      brightestStar: 'Antares (α Scorpii) · 1,0 kadir',
      season: 'Temmuz akşamları, güney ufkunda alçak',
      highlights: [
        'Kızıl süperdev Antares: adı “Mars’ın rakibi” anlamına gelir',
        'Kelebek (M6) ve Ptolemaios (M7) açık kümeleri',
        'Antares’in hemen yanındaki küresel küme M4',
      ],
    },
    dignity: { exaltation: null, detriment: 'Venüs', fall: 'Ay' },
  },
  yay: {
    id: 'yay',
    keywords: ['Özgürlük', 'Keşif', 'İyimserlik', 'Felsefe', 'Macera'],
    personality:
      'Yay, ufkun ötesini merak eden iyimser bir kâşiftir. Seyahat, felsefe, inanç sistemleri ve büyük fikirler onu heyecanlandırır. Neşeli, dürüst ve cömerttir; hayatı bir öğrenme yolculuğu olarak görür. Özgürlüğüne düşkündür; kısıtlandığını hissettiğinde huzursuzlanır.',
    love: 'Aşkta bir macera arkadaşı arar: birlikte gezilecek, öğrenilecek, gülünecek biri. Dürüstlüğü ve açık yürekliliği ilişkilerine tazelik getirir. Bağlanmaktan korkmaz ama boğulmaktan kaçar; özgürlüğüne saygı duyan bir partnerle sadık ve neşeli bir yol arkadaşı olur.',
    career: 'Akademi, yayıncılık, turizm, hukuk, eğitim, spor ve uluslararası işler Yay’ın vizyonunu besler. Büyük resmi görür, insanlara ilham verir. Ayrıntılarda sabırsızlanabilir; planlı bir ekip onu tamamlar.',
    friendship: 'Geniş ve çok kültürlü bir çevresi vardır; esprili ve cesaret veren bir dosttur. Yeni yerler keşfetmek, uzun sohbetler ve ortak maceralar arkadaşlıklarını besler.',
    growth: 'Sorumluluk ve tutarlılık Yay’ın gelişim alanıdır. Verdiği sözleri tutmak, düşünmeden söylenen sözlerin etkisini fark etmek ve bir işi bitirmeden yenisine koşmamak onu olgunlaştırır.',
    body: 'Kalçalar, uyluklar ve karaciğer',
    myth: {
      title: 'Bilge kentaur',
      text: 'Yay, okunu germiş bir kentaur olarak çizilir. Genellikle Herakles, Akhilleus ve Asklepios gibi kahramanların öğretmeni olan bilge kentaur Kheiron ile özdeşleştirilir; bazı kaynaklar ise okçuluğu icat eden satir Krotos’u anar. Okun ucu, yanındaki Akrep’in kalbi Antares’e yönelmiştir.',
    },
    sky: {
      sunTransit: '17 Aralık – 20 Ocak',
      brightestStar: 'Kaus Australis (ε Sagittarii) · 1,8 kadir',
      season: 'Ağustos akşamları, güney ufku',
      highlights: [
        'Samanyolu’nun merkezi ve süper kütleli kara delik Sagittarius A*',
        'Lagün (M8), Trifid (M20) ve Omega (M17) bulutsuları',
        'Çaydanlığa benzeyen yıldız dizilimi',
      ],
    },
    dignity: { exaltation: null, detriment: 'Merkür', fall: null },
  },
  oglak: {
    id: 'oglak',
    keywords: ['Disiplin', 'Hırs', 'Sorumluluk', 'Sabır', 'Yapı'],
    personality:
      'Oğlak, zirveye adım adım tırmanan sabırlı bir dağ keçisidir. Hedef koyar, plan yapar ve disiplinle ilerler. Sorumluluk almaktan çekinmez; güvenilir, ciddi ve gerçekçidir. İlk bakışta mesafeli görünse de kuru bir mizah anlayışına ve derin bir sadakate sahiptir.',
    love: 'Aşkta temkinli ve ciddidir; geçici heyecanlar yerine uzun vadeli, sağlam bir birliktelik arar. Sevgisini güven vererek, sorumluluk alarak ve geleceği birlikte planlayarak gösterir. Duygularını ifade etmeyi öğrendikçe ilişkisi ısınır.',
    career: 'Yöneticilik, mühendislik, mimarlık, finans, hukuk, kamu yönetimi ve uzun vadeli girişimler Oğlak’ın doğal alanıdır. Kariyer onun için kimliğinin önemli bir parçasıdır; yapı kurmakta ve kaynakları korumakta ustadır.',
    friendship: 'Az ama yıllar boyu süren dostluklar kurar; zor zamanda pratik destek veren güvenilir bir arkadaştır. Sözünün eridir.',
    growth: 'Dinlenmek ve duygularına alan açmak Oğlak’ın gelişim alanıdır. Başarıyı tek değer ölçüsü saymamak, yardım istemeyi öğrenmek ve anın tadını çıkarmak onu dengeler.',
    body: 'Dizler, kemikler, dişler ve deri',
    myth: {
      title: 'Balık kuyruklu keçi',
      text: 'Oğlak, ön yarısı keçi, arka yarısı balık olan bir yaratık olarak çizilir. Bir anlatıya göre tanrı Pan, dev Typhon’dan kaçmak için Nil’e atlar; suyun içindeki yarısı balığa, dışarıdaki yarısı keçiye dönüşür. Başka bir anlatıda bebek Zeus’u sütüyle besleyen keçi Amaltheia ile ilişkilendirilir. İmgenin kökeni, Mezopotamya’nın keçi-balık simgesine ve tanrı Enki’ye kadar uzanır.',
    },
    sky: {
      sunTransit: '20 Ocak – 16 Şubat',
      brightestStar: 'Deneb Algedi (δ Capricorni) · 2,9 kadir',
      season: 'Eylül akşamları',
      highlights: [
        'Küresel yıldız kümesi M30',
        'Keskin gözle iki yıldıza ayrılan Algedi (α Capricorni)',
        'Oğlak Dönencesi adını, Güneş’in antik çağda kış gündönümünde bu takımyıldızda bulunmasından alır',
      ],
    },
    dignity: { exaltation: 'Mars', detriment: 'Ay', fall: 'Jüpiter' },
  },
  kova: {
    id: 'kova',
    keywords: ['Özgünlük', 'Yenilik', 'Topluluk', 'Bağımsızlık', 'Vizyon'],
    personality:
      'Kova, geleceğe bakan ve kalıpları sorgulayan özgün bir düşünürdür. İnsanlığa, toplumsal meselelere ve yeni fikirlere ilgi duyar; kalabalığın içinde bile kendi yolunu çizer. Arkadaş canlısı ama bağımsızdır; mantığı duygularının önüne koyabilir. Sıra dışı olmaktan korkmaz.',
    love: 'Aşkta önce dostluk arar; zihinsel uyum ve kişisel alana saygı onun için şarttır. Kıskançlık ve sahiplenme onu uzaklaştırır. Duygularını göstermekte zorlanabilir, ama sadık ve şaşırtıcı derecede anlayışlı bir partnerdir.',
    career: 'Teknoloji, bilim, mühendislik, sivil toplum, astronomi, inovasyon ve sosyal girişimcilik Kova’nın vizyonunu yansıtır. Kurallara körü körüne uymak yerine sistemi iyileştirmek ister; ekiplerde fikir üreten kişidir.',
    friendship: 'Kova için dostluk kutsaldır; farklı çevrelerden geniş bir arkadaş ağı vardır. Yargılamayan, ilginç fikirlerle gelen ve gerektiğinde dayanışmayı örgütleyen bir dosttur.',
    growth: 'Duygusal yakınlık Kova’nın gelişim alanıdır. Fikirlerin yanında hislere de yer açmak, inatla ilkeyi ayırt etmek ve sevdiklerine kendini göstermek onu bütünler.',
    body: 'Bilekler, baldırlar ve dolaşım sistemi',
    myth: {
      title: 'Ganymedes’in testisi',
      text: 'Kova, testisinden su döken bir genç olarak çizilir. Yunan mitolojisinde bu genç, güzelliği yüzünden kartal kılığındaki Zeus’un Olimpos’a kaçırdığı Truvalı prens Ganymedes’tir ve tanrıların sakisi olur. Antik Mısır’da ise Kova’nın yükselişi Nil’in taşkın mevsimiyle ilişkilendirilirdi.',
    },
    sky: {
      sunTransit: '16 Şubat – 11 Mart',
      brightestStar: 'Sadalsuud (β Aquarii) · 2,9 kadir',
      season: 'Ekim akşamları',
      highlights: [
        '“Tanrının gözü” diye anılan Sarmal Bulutsu (NGC 7293)',
        'Satürn Bulutsusu (NGC 7009) ve küresel küme M2',
        'Mayıs başında zirve yapan Eta Kova meteor yağmuru: Halley Kuyruklu Yıldızı’nın tozları',
      ],
    },
    dignity: { exaltation: null, detriment: 'Güneş', fall: null },
  },
  balik: {
    id: 'balik',
    keywords: ['Empati', 'Hayal gücü', 'Sezgi', 'Şefkat', 'Teslimiyet'],
    personality:
      'Zodyakın son burcu Balık’ın, diğer on bir burcun deneyimini içinde taşıdığı söylenir. Empatik, hayalperest ve sezgiseldir; başkalarının acısını kendi acısı gibi hisseder. Sanata, müziğe ve maneviyata yatkındır. Sınırları belirsizleştirme eğilimi onu hem yaratıcı hem de kırılgan kılar.',
    love: 'Aşkta romantik ve fedakârdır; bir ruh eşi arar. Sevdiğini koşulsuz kabul eder ve onun için büyük özveride bulunabilir. Gerçekçi sınırlar koymak ve partnerini idealleştirmemek ilişkisini sağlıklı tutar.',
    career: 'Sanat, müzik, sinema, şiir, psikoloji, sağlık, sosyal hizmet ve maneviyat Balık’ın yeteneklerine alan açar. Sezgisiyle çalışır; katı ve rekabetçi ortamlar yerine anlam ve ilham bulduğu işlerde parlar.',
    friendship: 'Şefkatli, dinleyen ve yargılamayan bir dosttur; arkadaşları ona her şeyi anlatabilir. Bazen başkalarının yükünü fazla üstlenir.',
    growth: 'Sınır koymak ve hayalleri somut adımlara dönüştürmek Balık’ın gelişim alanıdır. Kaçmak yerine yüzleşmeyi seçmek ve kendi ihtiyaçlarını da önemsemek onu güçlendirir.',
    body: 'Ayaklar ve lenf sistemi',
    myth: {
      title: 'İple bağlı iki balık',
      text: 'Afrodit ve oğlu Eros, korkunç dev Typhon’dan kaçmak için iki balığa dönüşüp Fırat nehrine atlar. Birbirlerini kaybetmemek için kuyruklarını bir iple bağlarlar. Gökyüzünde iki balık, düğüm yerindeki Alrescha (“ip”) yıldızıyla birbirine bağlı olarak çizilir.',
    },
    sky: {
      sunTransit: '11 Mart – 18 Nisan',
      brightestStar: 'Alpherg (η Piscium) · 3,6 kadir',
      season: 'Kasım akşamları',
      highlights: [
        'Bahar noktası bugün bu takımyıldızdadır: Güneş, mart ekinoksunda göksel ekvatoru burada keser',
        'James Webb’in de görüntülediği “Hayalet Gökada” M74',
        'Batıdaki balığı çizen yıldız halkası',
      ],
    },
    dignity: { exaltation: 'Venüs', detriment: 'Merkür', fall: 'Merkür' },
  },
};

/** Element and modality texts for the "temeller" (foundations) blocks. */
export const ELEMENT_INFO: Record<'Ateş' | 'Toprak' | 'Hava' | 'Su', { polarity: string; text: string; color: string }> = {
  Ateş: { polarity: 'Eril · etkin', color: '#f59e0b', text: 'Coşku, irade ve eylem. Ateş burçları harekete geçirir, ilham verir ve risk almaktan çekinmez.' },
  Toprak: { polarity: 'Dişil · alıcı', color: '#a3e635', text: 'Gerçekçilik, sabır ve somut sonuçlar. Toprak burçları inşa eder, korur ve kalıcı değer üretir.' },
  Hava: { polarity: 'Eril · etkin', color: '#38bdf8', text: 'Düşünce, iletişim ve bağlantı. Hava burçları fikirleri dolaştırır, ilişkiler kurar ve nesnel bakar.' },
  Su: { polarity: 'Dişil · alıcı', color: '#818cf8', text: 'Duygu, sezgi ve derinlik. Su burçları hisseder, şefkat gösterir ve görünmeyeni sezer.' },
};

export const MODALITY_INFO: Record<'Öncü' | 'Sabit' | 'Değişken', string> = {
  Öncü: 'Mevsimi açan burçlar: başlatır, yön verir, inisiyatif alır.',
  Sabit: 'Mevsimin ortasındaki burçlar: sürdürür, derinleştirir, direnir.',
  Değişken: 'Mevsimi kapatan burçlar: uyum sağlar, dönüştürür, bir sonrakine hazırlar.',
};

/** What each planet stands for in astrology (used on the hub's foundations part). */
export const PLANET_MEANINGS: { name: string; glyph: string; text: string }[] = [
  { name: 'Güneş', glyph: '☉', text: 'Öz benlik, yaşam gücü, irade' },
  { name: 'Ay', glyph: '☽', text: 'Duygular, ihtiyaçlar, alışkanlıklar' },
  { name: 'Merkür', glyph: '☿', text: 'Düşünce, iletişim, öğrenme' },
  { name: 'Venüs', glyph: '♀', text: 'Sevgi, değerler, estetik' },
  { name: 'Mars', glyph: '♂', text: 'Eylem, arzu, cesaret' },
  { name: 'Jüpiter', glyph: '♃', text: 'Büyüme, inanç, fırsat' },
  { name: 'Satürn', glyph: '♄', text: 'Disiplin, sınır, zaman' },
  { name: 'Uranüs', glyph: '♅', text: 'Yenilik, kopuş, özgürlük' },
  { name: 'Neptün', glyph: '♆', text: 'Hayal, sezgi, aşkınlık' },
  { name: 'Plüton', glyph: '♇', text: 'Dönüşüm, güç, yeniden doğuş' },
];
