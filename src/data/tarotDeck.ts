export interface TarotCard {
  id: string;
  number: string;
  numericValue: number;
  name: string;
  nameEn: string;
  archetype: string;
  associatedSignOrPlanet: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | 'Eter';
  glyphType: 'zodiac' | 'planet' | 'element';
  glyphId: string;
  accentColor: string;
  upright: {
    title: string;
    keywords: string[];
    message: string;
    loveGuidance: string;
    careerGuidance: string;
    spiritualGuidance: string;
  };
  reversed: {
    title: string;
    keywords: string[];
    warning: string;
    lesson: string;
  };
  affirmation: string;
  astrologicalAspect: string;
}

export const MAJOR_ARCANA_DECK: TarotCard[] = [
  {
    id: 'deli',
    number: '0',
    numericValue: 0,
    name: 'Deli (Mecnun / The Fool)',
    nameEn: 'The Fool',
    archetype: 'Saf Başlangıç & Sonsuz Potansiyel',
    associatedSignOrPlanet: 'Uranüs (Özgürleşme)',
    element: 'Hava',
    glyphType: 'planet',
    glyphId: 'uranus',
    accentColor: '#38bdf8',
    upright: {
      title: 'Korkusuz Yeni Döngü',
      keywords: ['Başlangıç', 'Spontane Güven', 'Masumiyet', 'Macera'],
      message: 'Önünüzde henüz yazılmamış bembeyaz bir sayfa uzanıyor. Geçmişin yüklerini ardınızda bırakın; evrene güvenerek bilinmeyene doğru o ilk cesur adımı atın.',
      loveGuidance: 'Aşkta kalıpları yıkma zamanı. Ön yargısız ve beklentisiz yeni bir çekim doğabilir.',
      careerGuidance: 'Alışılmadık, yenilikçi ve vizyoner bir projeye adım atmak için ideal zamanlama.',
      spiritualGuidance: 'Ruhunuz saf bir merakla titreşiyor. Sezgilerinizin rehberliğine teslim olun.'
    },
    reversed: {
      title: 'Dikkatsiz Risk & Kararsızlık',
      keywords: ['Gereksiz Risk', 'Düşüncesizlik', 'Çekingenlik', 'Askıda Kalma'],
      warning: 'Gereksiz tehlikelere atılmakla cesur olmak arasındaki ince çizgiyi kaçırmayın.',
      lesson: 'Adım atmadan önce bastığınız zeminin sağlamlığını kontrol edin.'
    },
    affirmation: 'Bilinmeyene korkusuzca adım atıyorum; evren beni her an kanatlarıyla koruyor.',
    astrologicalAspect: 'Uranüs - Kök inançlardan ani özgürleşme transiti.'
  },
  {
    id: 'buyucu',
    number: 'I',
    numericValue: 1,
    name: 'Büyücü (The Magician)',
    nameEn: 'The Magician',
    archetype: 'Usta Yaratıcı & İrade Simyacısı',
    associatedSignOrPlanet: 'Merkür (İletişim & Zeka)',
    element: 'Hava',
    glyphType: 'planet',
    glyphId: 'merkur',
    accentColor: '#fbbf24',
    upright: {
      title: 'İradenin Tezahürü',
      keywords: ['Hüner', 'Odaklanma', 'Tezahür', 'Kişisel Güç'],
      message: 'Aradığınız tüm araçlar şu anda elinizin altında. Düşüncenizi somut gerçeğe dönüştürmek için iradenizi tek bir noktaya odaklayın.',
      loveGuidance: 'Çekim gücünüz zirvede. Net ve açık iletişimle kalbinizdeki dileği gerçeğe dönüştürebilirsiniz.',
      careerGuidance: 'Strateji ve becerilerinizi sergileme vakti. Başlatacağınız her girişim başarıyla taçlanacak.',
      spiritualGuidance: 'Yukarıda ne varsa aşağıda da o vardır. İçsel niyetiniz dış dünyanızı şekillendirir.'
    },
    reversed: {
      title: 'Yanılsama & Dağınık Enerji',
      keywords: ['Manipülasyon', 'Yetenek İsrafı', 'Gizli Ajanda', 'Odak Kaybı'],
      warning: 'Zekanızı başkalarını yanıltmak veya kendinizi kandırmak için kullanmayın.',
      lesson: 'Gücünüzü kişisel kibir için değil, yapıcı ve aydınlık niyetler için yönlendirin.'
    },
    affirmation: 'Aklım, niyetim ve iradem bir aradadır; düşlediğim hayatı kendi ellerimle yaratıyorum.',
    astrologicalAspect: 'Merkür - Güneş kavuşumu: Zihinsel berraklık ve odaklanmış ikna.'
  },
  {
    id: 'azize',
    number: 'II',
    numericValue: 2,
    name: 'Azize (The High Priestess)',
    nameEn: 'The High Priestess',
    archetype: 'Sezgisel Bilge & Perdenin Koruyucusu',
    associatedSignOrPlanet: 'Ay (Bilinçdışı & Sırlar)',
    element: 'Su',
    glyphType: 'planet',
    glyphId: 'ay',
    accentColor: '#a78bfa',
    upright: {
      title: 'Derin Sezgi & Kozmik Gizem',
      keywords: ['Sezgi', 'Bilinçdışı', 'Sır', 'Ruhsal Algı'],
      message: 'Cevaplar dışarıda değil, iç sesinizin fısıltısında gizli. Harekete geçmek yerine sessizce gözlemleyin; rüyalarınıza ve eşzamanlılıklara kulak verin.',
      loveGuidance: 'Açığa çıkmamış derin duygular var. Acele etmeyin, zamanla hakikat kendini gösterecektir.',
      careerGuidance: 'Görünürdeki bilgilerin arkasındaki dinamikleri okuyun. Sezgileriniz mantığınızdan daha doğru fısıldıyor.',
      spiritualGuidance: 'İçsel tapınağınıza çekilin; sessizlik en derin hakikatin konuşma dilidir.'
    },
    reversed: {
      title: 'İç Sesin Bastırılması',
      keywords: ['Sezgileri Reddetme', 'Yüzeysellik', 'Gizli Düşmanlık', 'Duygusal Kapanma'],
      warning: 'İçinizden gelen kuvvetli uyarı sinyallerini mantıkla bastırmaya çalışmayın.',
      lesson: 'Ruhunuzun derinliğinden korkmayın; karanlığı aydınlatacak olan şey farkındalıktır.'
    },
    affirmation: 'İçimdeki sonsuz bilgeliğe ve sezgilerimin kusursuz rehberliğine güveniyorum.',
    astrologicalAspect: 'Ay - Neptün üçgeni: Telepatik hassasiyet ve rüya farkındalığı.'
  },
  {
    id: 'imparatorice',
    number: 'III',
    numericValue: 3,
    name: 'İmparatoriçe (The Empress)',
    nameEn: 'The Empress',
    archetype: 'Kozmik Doğa & Bereketli Yaratım',
    associatedSignOrPlanet: 'Venüs (Güzellik & Uyum)',
    element: 'Toprak',
    glyphType: 'planet',
    glyphId: 'venus',
    accentColor: '#34d399',
    upright: {
      title: 'Bereket, Şefkat & Çiçeklenme',
      keywords: ['Bereket', 'Yaratıcılık', 'Şefkat', 'Duyusal Zevk'],
      message: 'Hayatınızda filizlenmeyi bekleyen tohumlar yeşeriyor. Kendinize ve çevrenize şefkat gösterin; üretkenliğinizi, sanatınızı ve sevginizi besleyin.',
      loveGuidance: 'Sıcak, şefkatli ve koşulsuz bir sevgi frekansı. İlişkilerde bağlar derinleşiyor.',
      careerGuidance: 'Yaratıcı projelerin hasadını toplama zamanı. Maddi ve manevi zenginlik kapıları açılıyor.',
      spiritualGuidance: 'Bedeninizin ve doğanın kutsallığını kutlayın. Yaşamın her zerresinde ilahi güzellik saklı.'
    },
    reversed: {
      title: 'Tükenmişlik & Boğucu İlgi',
      keywords: ['Yaratıcı Tıkanıklık', 'Aşırı Bağımlılık', 'İhmal', 'Maddi Kaygı'],
      warning: 'Başkalarını beslerken kendi ruhunuzu aç bırakmayın; sınırlarınızı koruyun.',
      lesson: 'Hakiki sevgi özgür bırakır ve önce kendi özdeğerini yüceltir.'
    },
    affirmation: 'Evrenin sonsuz bolluğu ve bereketi benimle akar; yarattığım her şey güzellikle filizlenir.',
    astrologicalAspect: 'Venüs - Jüpiter sekstili: Şans, zenginlik ve zarafet akışı.'
  },
  {
    id: 'imparator',
    number: 'IV',
    numericValue: 4,
    name: 'İmparator (The Emperor)',
    nameEn: 'The Emperor',
    archetype: 'Egemen Lider & İnşa Edici İrade',
    associatedSignOrPlanet: 'Koç Burcu (Mars)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'koc',
    accentColor: '#f87171',
    upright: {
      title: 'Düzen, Disiplin & Otorite',
      keywords: ['Liderlik', 'Sınırlar', 'Yapı', 'Sarsılmaz Kararlılık'],
      message: 'Kaosu düzene çevirme vakti. Sınırlarınızı netleştirin, stratejik düşünün ve hedeflerinizi sarsılmaz bir disiplinle koruma altına alın.',
      loveGuidance: 'İlişkilerde güven ve istikrar arayışı. Sözlerinizin arkasında durun, sadakati temel kılın.',
      careerGuidance: 'Yönetim, liderlik ve kurumsal kararlarda en yüksek güce sahipsiniz.',
      spiritualGuidance: 'Kendi krallığınızın efendisi olun; ruhsal disiplin yüksek bilincin anahtarıdır.'
    },
    reversed: {
      title: 'Tiranlık & Aşırı Katılık',
      keywords: ['Baskı', 'İnatçılık', 'Kontrol Deliliği', 'Zayıf Liderlik'],
      warning: 'Gücünüzü başkalarını ezmek için kullanırsanız dirençle karşılaşırsınız.',
      lesson: 'Gerçek liderlik baskıyla değil, ilham ve adaletle tesis edilir.'
    },
    affirmation: 'Kendi hayatımın egemen mimarıyım; kararlarımı cesaret ve bilgelikle alıyorum.',
    astrologicalAspect: 'Mars - Satürn üçgeni: Dayanıklılık, sağlam strateji ve somut başarı.'
  },
  {
    id: 'aziz',
    number: 'V',
    numericValue: 5,
    name: 'Aziz (The Hierophant)',
    nameEn: 'The Hierophant',
    archetype: 'Kadim Bilgelik & Ruhsal Mentör',
    associatedSignOrPlanet: 'Boğa Burcu (Venüs)',
    element: 'Toprak',
    glyphType: 'zodiac',
    glyphId: 'boga',
    accentColor: '#a3e635',
    upright: {
      title: 'Geleneksel Rehberlik & Yüksek Değerler',
      keywords: ['Bilgelik', 'Öğretmen', 'Manevi Değerler', 'Etik'],
      message: 'Zamanın sınavından geçmiş kadim doğrulara sarılın. Güvenilir mentörlerin öğütlerine kulak verin ve içsel ahlak pusulanızdan sapmayın.',
      loveGuidance: 'Ciddi, geleneksel ve ruhsal derinliği olan bir bağ kurma arzusu.',
      careerGuidance: 'Köklü kurumlar, eğitim ve uzmanlaşma yolunda büyük kazanımlar elde edebilirsiniz.',
      spiritualGuidance: 'Evrensel yasalarla uyum içinde yaşamak ruhunuza dinginlik kazandırır.'
    },
    reversed: {
      title: 'Dogmatizm & İsyan',
      keywords: ['Kalıplaşmış İnanç', 'Dayatma', 'Gereksiz İtaat', 'Yobazlık'],
      warning: 'Sorgulamadan körü körüne başkalarının kurallarına boyun eğmeyin.',
      lesson: 'Kendi kişisel ahlakınızı kendi içsel vicdan mahkemenizde tartın.'
    },
    affirmation: 'Kadim bilgeliğin ve yüksek ahlakın ışığında emin adımlarla yürüyorum.',
    astrologicalAspect: 'Boğa burcunda Jüpiter: Değerlerin sağlamlaşması ve köklenme.'
  },
  {
    id: 'asiklar',
    number: 'VI',
    numericValue: 6,
    name: 'Âşıklar (The Lovers)',
    nameEn: 'The Lovers',
    archetype: 'Kozmik Birlik & Ruhsal Seçim',
    associatedSignOrPlanet: 'İkizler Burcu (Merkür)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'ikizler',
    accentColor: '#38bdf8',
    upright: {
      title: 'Kalp Hizalanması & Kutsal Birlik',
      keywords: ['Aşk', 'Uyum', 'Seçim', 'Ruh Eşi Bağı'],
      message: 'Önemli bir ahlaki ve duygusal eşiktesiniz. İki yol arasında seçim yaparken kalbinizin en yüksek frekansıyla rezone olan yöne gidin.',
      loveGuidance: 'Ruhsal ve zihinsel derinliği olan manyetik bir çekim. Karşılıklı saygı ve bütünlük.',
      careerGuidance: 'Ortaklıklar ve işbirlikleri için olağanüstü fırsat. Birlikten kuvvet doğar.',
      spiritualGuidance: 'Kendi içsel dişil ve eril kutuplarınızı dengelediğinizde dünya size ayna olur.'
    },
    reversed: {
      title: 'Uyumsuzluk & Değerler Çatışması',
      keywords: ['Çelişki', 'Yanlış Seçim', 'İletişimsizlik', 'Özveri Yanılgısı'],
      warning: 'Başkalarının onayını almak uğruna kendi öz değerlerinizden ödün vermeyin.',
      lesson: 'Hakiki sevgi önce kendinizle barışık olmanızdan filizlenir.'
    },
    affirmation: 'Her seçimimde sevgi, dürüstlük ve ruhsal uyumu temel alıyorum.',
    astrologicalAspect: 'Venüs - Mars kavuşumu: Tutku ve dengenin birleşimi.'
  },
  {
    id: 'araba',
    number: 'VII',
    numericValue: 7,
    name: 'Araba (The Chariot)',
    nameEn: 'The Chariot',
    archetype: 'Zafer & Odaklanmış İrade',
    associatedSignOrPlanet: 'Yengeç Burcu (Ay)',
    element: 'Su',
    glyphType: 'zodiac',
    glyphId: 'yengec',
    accentColor: '#60a5fa',
    upright: {
      title: 'Zafere Giden Odak',
      keywords: ['Azim', 'Zafer', 'Duygusal Kontrol', 'İlerleme'],
      message: 'Zıt duyguları ve farklı güçleri tek bir hedefe kilitleyin. Kararlılığınız ve odaklanmış iradeniz sizi tüm engellerin ötesine taşıyacak.',
      loveGuidance: 'İlişkideki çalkantıları duygusal olgunluk ve kararlılıkla aşma zamanı.',
      careerGuidance: 'Hedefe kilitlenmiş bir rota. Rekabette öne geçecek ve zaferi göğüsleyeceksiniz.',
      spiritualGuidance: 'Duygularınızı bir silah gibi değil, sizi taşıyan kutsal bir zırh gibi kullanın.'
    },
    reversed: {
      title: 'Yoldan Çıkma & Kontrol Kaybı',
      keywords: ['Yönsüzlük', 'Agresif Hırs', 'Tükenmişlik', 'Engellere Çarpma'],
      warning: 'Öfke veya körü körüne inatla hareket ederseniz direksiyonu elinizden kaçırabilirsiniz.',
      lesson: 'Bazen en büyük güç durup rotayı yeniden gözden geçirmektir.'
    },
    affirmation: 'İçsel dengemle rotamı çiziyor, tüm fırtınalara rağmen hedefime güvenle ilerliyorum.',
    astrologicalAspect: 'Mars - Yükselen kavuşumu: Kararlılık ve sarsılmaz atılım gücü.'
  },
  {
    id: 'guc',
    number: 'VIII',
    numericValue: 8,
    name: 'Güç (Strength)',
    nameEn: 'Strength',
    archetype: 'Şefkatli Cesaret & İçsel Ehlileştirme',
    associatedSignOrPlanet: 'Aslan Burcu (Güneş)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'aslan',
    accentColor: '#f59e0b',
    upright: {
      title: 'Nezaketle Gelen Yenilmezlik',
      keywords: ['İçsel Güç', 'Şefkat', 'Sabır', 'Cesaret'],
      message: 'Kaba kuvvet değil, yürekten gelen sevgi ve sabır vahşi canavarları bile ehlileştirir. Korkularınıza şefkatle yaklaşın ve kendi gücünüze inanın.',
      loveGuidance: 'Sadakat, derin anlayış ve tutkulu bir dayanıklılık. Kalbinizle kazanın.',
      careerGuidance: 'Kriz anlarında sakin kalarak çevrenizdekilere güven verecek ve önderlik edeceksiniz.',
      spiritualGuidance: 'Ruhsal güç, kırıp dökmek değil; fırtınanın ortasında dingin kalabilmektir.'
    },
    reversed: {
      title: 'Özgüven Eksikliği & Ham Öfke',
      keywords: ['Korku', 'Zayıflık Hissi', 'Şüphe', 'Dürtüsellik'],
      warning: 'Kendi yetersizlik duygularınızı başkalarına öfke kusarak kapatmaya çalışmayın.',
      lesson: 'Korkularınızı kucakladığınız an onlar üzerinizdeki gücünü kaybeder.'
    },
    affirmation: 'Yüreğimin sarsılmaz sevgisi ve cesaretiyle her zorluğun üstesinden geliyorum.',
    astrologicalAspect: 'Güneş - Satürn üçgeni: Özgüven, olgunluk ve asil duruş.'
  },
  {
    id: 'ermis',
    number: 'IX',
    numericValue: 9,
    name: 'Ermiş (The Hermit)',
    nameEn: 'The Hermit',
    archetype: 'İçsel Rehber & Işık Taşıyıcısı',
    associatedSignOrPlanet: 'Başak Burcu (Merkür)',
    element: 'Toprak',
    glyphType: 'zodiac',
    glyphId: 'basak',
    accentColor: '#94a3b8',
    upright: {
      title: 'İçsel Yolculuk & Ruhsal Aydınlanma',
      keywords: ['İnziva', 'Öz-Arayış', 'İçsel Işık', 'Bilgelik'],
      message: 'Dış dünyanın gürültüsünü susturun. Kendi fenerinizi yakın ve ruhunuzun derinliklerine inin. Aradığınız gerçeği yalnızca kendi yalnızlığınızda bulabilirsiniz.',
      loveGuidance: 'İlişkilerde biraz mesafe ve kendi sınırlarını anlama ihtiyacı. Kendini sevmeden başkasını sevemezsin.',
      careerGuidance: 'Detaylı analiz, derin araştırma ve stratejik planlama için ideal bir dönem.',
      spiritualGuidance: 'Siz karanlığı aydınlatan fenerin ta kendisisiniz; yolu başkasında aramayın.'
    },
    reversed: {
      title: 'İzolasyon & Yalnızlaşma',
      keywords: ['Aşırı Yalnızlık', 'Kibirli Uzaklaşma', 'Kapanma', 'Yabancılaşma'],
      warning: 'İnzivayı dünyaya küsmek için bir sığınağa dönüştürmeyin.',
      lesson: 'Edindiğiniz bilgeliği günü geldiğinde başkalarının yolunu aydınlatmak için paylaşın.'
    },
    affirmation: 'Kendi iç ışığımı takip ediyorum; karanlıkta bile yolumu kristal netliğinde görüyorum.',
    astrologicalAspect: 'Satürn 12. evde: Ruhsal arınma ve içsel olgunlaşma.'
  },
  {
    id: 'kader-carki',
    number: 'X',
    numericValue: 10,
    name: 'Kader Çarkı (Wheel of Fortune)',
    nameEn: 'Wheel of Fortune',
    archetype: 'Kozmik Döngü & Karmik Dönüm Noktası',
    associatedSignOrPlanet: 'Jüpiter (Genişleme & Şans)',
    element: 'Ateş',
    glyphType: 'planet',
    glyphId: 'jupiter',
    accentColor: '#eab308',
    upright: {
      title: 'Karmik Talih & Beklenmedik Dönüşüm',
      keywords: ['Döngüler', 'Kader', 'Şans', 'Büyük Dönüm Noktası'],
      message: 'Kozmik çark sizin lehinize dönüyor. Hayatınızda ani ve hayırlı bir değişim kapıda. Değişime direnmek yerine akışa teslim olun ve fırsatları kucaklayın.',
      loveGuidance: 'Kadersel bir karşılaşma veya ilişkide yepyeni bir evreye geçiş.',
      careerGuidance: 'Beklenmedik bir teklif, kariyer sıçraması ve talihin yüzünüze gülmesi.',
      spiritualGuidance: 'Hiçbir durum kalıcı değildir; inişler de çıkışlar da evrenin kutsal dansının parçasıdır.'
    },
    reversed: {
      title: 'Gecikme & Direnç',
      keywords: ['Kötü Zamanlama', 'Değişime Direnç', 'Tekrarlayan Kısır Döngü'],
      warning: 'Eski hataları tekrarlayarak farklı bir sonuç beklemeyin.',
      lesson: 'Döngüyü kırmanın tek yolu, ondan almanız gereken dersi tam olarak kavramaktır.'
    },
    affirmation: 'Kozmik zamanlamaya güveniyorum; hayatımın çarkı en yüksek hayrıma dönüyor.',
    astrologicalAspect: 'Jüpiter - Uranüs kavuşumu: Kadersel sıçrama ve mucizevi açılımlar.'
  },
  {
    id: 'adalet',
    number: 'XI',
    numericValue: 11,
    name: 'Adalet (Justice)',
    nameEn: 'Justice',
    archetype: 'Kozmik Denge & Hakikat Terazisi',
    associatedSignOrPlanet: 'Terazi Burcu (Venüs)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'terazi',
    accentColor: '#38bdf8',
    upright: {
      title: 'Hakikat, Denge & Dürüstlük',
      keywords: ['Adalet', 'Denge', 'Nedensellik', 'Dürüstlük'],
      message: 'Ne ektiyseniz onu biçeceğiniz an geldi. Kararlarınızda tarafsız, dürüst ve dengeli olun. Hakikat eninde sonunda yerini bulur.',
      loveGuidance: 'İlişkide karşılıklı eşitlik, şeffaflık ve adil paylaşım dönemi.',
      careerGuidance: 'Sözleşmeler, yasal süreçler ve anlaşmalarda haklılığınız teslim edilecek.',
      spiritualGuidance: 'Evren kusursuz bir denge üzerinedir; vicdanınız en yüksek mahkemenizdir.'
    },
    reversed: {
      title: 'Haksızlık & Sorumluluktan Kaçış',
      keywords: ['Ön Yargı', 'Haksız Muamele', 'Bahane Üretme', 'Dengesizlik'],
      warning: 'Kendi payınıza düşen sorumlulukları başkalarının üzerine yıkmaya çalışmayın.',
      lesson: 'Kendi içsel adaletinizi sağlamadan dünyadan adalet bekleyemezsiniz.'
    },
    affirmation: 'Eylemlerimin sorumluluğunu onurla üstleniyorum; hakikatin terazisinde dengedeyim.',
    astrologicalAspect: 'Terazi burcunda Satürn: Hakkaniyet ve sağlam ilahi adalet.'
  },
  {
    id: 'asilan-adam',
    number: 'XII',
    numericValue: 12,
    name: 'Asılan Adam (The Hanged Man)',
    nameEn: 'The Hanged Man',
    archetype: 'Ruhsal Teslimiyet & Yeni Perspektif',
    associatedSignOrPlanet: 'Neptün (Çözülme & Birlik)',
    element: 'Su',
    glyphType: 'planet',
    glyphId: 'neptun',
    accentColor: '#818cf8',
    upright: {
      title: 'Teslimiyet & Bakış Açısı Dönüşümü',
      keywords: ['Duraklama', 'Teslimiyet', 'Aydınlanma', 'Farklı Açı'],
      message: 'Olayları zorlamayı bırakın. Durup beklemek ve dünyayı baş aşağı görmek size daha önce fark etmediğiniz devasa bir aydınlanma sunacaktır.',
      loveGuidance: 'İlişkide ısrar etmek yerine durumu akışına bırakın; fedakarlık bilgelik doğurur.',
      careerGuidance: 'Projelerde geçici bir duraklama. Bu süreyi yaratıcı fikirleri olgunlaştırmak için kullanın.',
      spiritualGuidance: 'Bırakmak vazgeçmek değildir; ilahi planın kusursuzluğuna güvenmektir.'
    },
    reversed: {
      title: 'Boşuna Direnç & Kurban Rolü',
      keywords: ['Gereksiz Şehitlik', 'İnat', 'Erteleme Hastalığı', 'Durgunluk'],
      warning: 'Kendinizi kurban gibi görerek hayatınızın kontrolünü başkalarına bırakmayın.',
      lesson: 'Teslimiyet eylemsizlik değil, içsel kabullenişin sessiz gücüdür.'
    },
    affirmation: 'Kontrol ihtiyacımı sevgiyle bırakıyorum; yeni bir gözle evrenin sırlarını görüyorum.',
    astrologicalAspect: 'Neptün karesi: Egonun çözülüşü ve ruhsal berraklık.'
  },
  {
    id: 'olum',
    number: 'XIII',
    numericValue: 13,
    name: 'Ölüm (Death)',
    nameEn: 'Death',
    archetype: 'Büyük Dönüşüm & Yeniden Doğuş',
    associatedSignOrPlanet: 'Akrep Burcu (Plüton)',
    element: 'Su',
    glyphType: 'zodiac',
    glyphId: 'akrep',
    accentColor: '#991b1b',
    upright: {
      title: 'Eskinin Bitisi & Anka Kuşu Doğuşu',
      keywords: ['Dönüşüm', 'Sonlanma', 'Yenilenme', 'Özgürleşme'],
      message: 'Bir dönemin perdesi kapanıyor. Miadını doldurmuş ilişkiler, alışkanlıklar ve inançlar ölüyor ki yerlerine taze bir hayat doğabilsin. Değişimi onurlandırın.',
      loveGuidance: 'Eski travmaların ve toksik bağların tamamen temizlendiği radikal bir arınma.',
      careerGuidance: 'Eski çalışma biçiminizin sonu; yepisyeni bir kariyer yolculuğunun başlangıcı.',
      spiritualGuidance: 'Tırtılın son dediğine evren kelebek der. Ölüm, ruhun genişleme kapısıdır.'
    },
    reversed: {
      title: 'Geçmişe Yapışma & Değişim Korkusu',
      keywords: ['Bırakamama', 'Direnç', 'Çürüme', 'Korku'],
      warning: 'Çoktan ölmüş durumları canlandırmaya çalışarak kendi enerjinizi tüketmeyin.',
      lesson: 'Gidenin gitmesine izin vermezseniz, gelenin gelişine yer açamazsınız.'
    },
    affirmation: 'Geçmişi şükranla uğurluyorum; küllerimden daha güçlü ve parlak doğuyorum.',
    astrologicalAspect: 'Plüton - Güneş kavuşumu: Radikal metamorfoz ve yenilenme.'
  },
  {
    id: 'denge',
    number: 'XIV',
    numericValue: 14,
    name: 'Denge (Temperance)',
    nameEn: 'Temperance',
    archetype: 'Kozmik Simyacı & Orta Yol',
    associatedSignOrPlanet: 'Yay Burcu (Jüpiter)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'yay',
    accentColor: '#06b6d4',
    upright: {
      title: 'Simya, İtidal & Ruhsal Şifa',
      keywords: ['Denge', 'Uyum', 'Şifa', 'Sentez'],
      message: 'Uç noktalardan uzaklaşın. Zıtlıkları bir potada eritin; sabır ve itidalle hareket ederek hayatınıza kutsal bir denge getirin.',
      loveGuidance: 'İlişkide duygusal fırtınaların dindiği, sakin ve şifalandırıcı bir uyum dönemi.',
      careerGuidance: 'Farklı görüşleri ustalıkla uzlaştıracak ve krizleri yumuşak güçle çözeceksiniz.',
      spiritualGuidance: 'Beden, zihin ve ruh simyasını kurun; hakiki güç huzurlu bir dengede yatar.'
    },
    reversed: {
      title: 'Aşırılık & Çatışma',
      keywords: ['Ölçüsüzlük', 'Sabırsızlık', 'Uyumsuzluk', 'Dengesizlik'],
      warning: 'Duygusal veya maddi aşırılıklara kaçarak iç huzurunuzu zedelemeyin.',
      lesson: 'Orta yolu bulmak zayıflık değil, yüksek ruhsal olgunluğun zirvesidir.'
    },
    affirmation: 'Hayatımın tüm zıtlıklarını sevgiyle harmanlıyor, sarsılmaz bir içsel dengede kalıyorum.',
    astrologicalAspect: 'Jüpiter - Neptün üçgeni: Ruhsal şifa, empati ve huzur.'
  },
  {
    id: 'seytan',
    number: 'XV',
    numericValue: 15,
    name: 'Şeytan (The Devil)',
    nameEn: 'The Devil',
    archetype: 'Gölge Benlik & Maddi Esaret',
    associatedSignOrPlanet: 'Oğlak Burcu (Satürn)',
    element: 'Toprak',
    glyphType: 'zodiac',
    glyphId: 'oglak',
    accentColor: '#b91c1c',
    upright: {
      title: 'Prangaların Farkına Varma',
      keywords: ['Bağımlılık', 'Gölge', 'İllüzyon', 'Maddi Tutku'],
      message: 'Sizi tutsak eden şey dış dünya değil, kendi korkularınız ve bağımlılıklarınızdır. Boynunuzdaki zincirlerin gevşek olduğunu fark edin ve özgürlüğünüzü seçin.',
      loveGuidance: 'Aşırı tutkulu ancak manipülatif ve takıntılı dinamiklere karşı dikkatli olun.',
      careerGuidance: 'Sadece para veya güç için ruhunuzu daraltan şartlara boyun eğmeyin.',
      spiritualGuidance: 'Gölgenizle yüzleşin; ışık karanlığı tanıdığınız an gücüne kavuşur.'
    },
    reversed: {
      title: 'Prangaları Kırma & Özgürlük',
      keywords: ['Kurtuluş', 'Farkındalık', 'Bağımlılığı Yenme', 'Uyanış'],
      warning: 'Eski zehirli alışkanlıkların sizi tekrar geri çağırmasına izin vermeyin.',
      lesson: 'Korku bir illüzyondur; cesaretle adım attığınız an zincirler kırılır.'
    },
    affirmation: 'Beni sınırlayan tüm korkuları ve bağımlılıkları kırıyorum; özgür bir ruha sahibim.',
    astrologicalAspect: 'Plüton - Venüs karşıtlığı: Tutku ve güç oyunlarının dönüşümü.'
  },
  {
    id: 'yikilan-kule',
    number: 'XVI',
    numericValue: 16,
    name: 'Yıkılan Kule (The Tower)',
    nameEn: 'The Tower',
    archetype: 'Yıldırım Uyanışı & Sahte Temellerin Çöküşü',
    associatedSignOrPlanet: 'Mars (Kozmik Yıldırım)',
    element: 'Ateş',
    glyphType: 'planet',
    glyphId: 'mars',
    accentColor: '#dc2626',
    upright: {
      title: 'Ani Yıkım & Özgürleştirici Aydınlanma',
      keywords: ['Ani Değişim', 'İllüzyonun Çöküşü', 'Yıldırım', 'Aydınlanma'],
      message: 'Çürük temeller üzerine kurulu sahte yapılar yıldırım hızıyla çöküyor. Korkmayın; yıkılan şey sadece bir yanılsamaydı. Enkazın ardından hakikat gün ışığına çıkacak.',
      loveGuidance: 'Gizlenen bir gerçeğin ani ortaya çıkışı. Sahte pembe tablolar yerini netliğe bırakır.',
      careerGuidance: 'Beklenmedik bir kriz veya yön değişimi. Bu çöküş sizi daha sağlam bir kariyere hazırlar.',
      spiritualGuidance: 'Kule yıkılmadan gökyüzü görünmez. Şok dalgası ruhunuzun prangalarını kırar.'
    },
    reversed: {
      title: 'Geciken Kaçınılmaz Çöküş',
      keywords: ['Yüzleşmekten Kaçma', 'Enkazda Kalma', 'Bastırılan Kriz'],
      warning: 'Çökmekte olan duvarları tutmaya çalışarak kendinizi tüketmeyin.',
      lesson: 'Yıkıma izin vermek bazen yapılabilecek en cesur ve sağlıklı eylemdir.'
    },
    affirmation: 'Yıkılan her yanılsama beni hakiki gücüme kavuşturur; sağlam temellerle yeniden yükseliyorum.',
    astrologicalAspect: 'Uranüs - Mars karesi: Ani yıldırım kopuşu ve radikal özgürleşme.'
  },
  {
    id: 'yildiz',
    number: 'XVII',
    numericValue: 17,
    name: 'Yıldız (The Star)',
    nameEn: 'The Star',
    archetype: 'Kozmik Umut & İlahi İlham',
    associatedSignOrPlanet: 'Kova Burcu (Uranüs)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'kova',
    accentColor: '#38bdf8',
    upright: {
      title: 'Umut, İlham & Ruhsal Dinginlik',
      keywords: ['Umut', 'İlham', 'Yenilenme', 'İlahi Koruma'],
      message: 'Fırtına dindi; gökyüzünde parlayan umut yıldızının altındasınız. Kalbinizi arındırın ve dileklerinizi evrene fısıldayın. Geleceğiniz parlak ve bereket dolu.',
      loveGuidance: 'Yaraların sarıldığı, saf ve safi sevginin filizlendiği ruhsal bir dönem.',
      careerGuidance: 'Yaratıcı ilham ve vizyoner fikirler akıyor. Topluma umut veren işler başarın.',
      spiritualGuidance: 'Evrenle doğrudan bir rezonanstasınız. Dualarınız ve niyetleriniz karşılık buluyor.'
    },
    reversed: {
      title: 'İnanç Kaybı & Karamsarlık',
      keywords: ['Umutsuzluk', 'Şüphe', 'İlham Tıkanıklığı', 'Karanlık Bakış'],
      warning: 'Geçici gecikmeler yüzünden geleceğe olan inancınızı kaybetmeyin.',
      lesson: 'Karanlığın en koyu olduğu an, şafağın en yakın olduğu andır.'
    },
    affirmation: 'Yolumu aydınlatan yıldızların koruması altındayım; geleceğe umut ve inançla bakıyorum.',
    astrologicalAspect: 'Venüs - Neptün üçgeni: Saf ilham, şifa ve evrensel sevgi.'
  },
  {
    id: 'ay-karti',
    number: 'XVIII',
    numericValue: 18,
    name: 'Ay (The Moon)',
    nameEn: 'The Moon',
    archetype: 'Bilinçdışı Labirent & İllüzyonlar',
    associatedSignOrPlanet: 'Balık Burcu (Neptün)',
    element: 'Su',
    glyphType: 'zodiac',
    glyphId: 'balik',
    accentColor: '#818cf8',
    upright: {
      title: 'Bilinçdışı Rüyalar & Alacakaranlık',
      keywords: ['İllüzyon', 'Korku', 'Rüyalar', 'Gizli Hakikatler'],
      message: 'Alacakaranlık kuşağındasınız; gölgeler olduklarından daha büyük görünebilir. Korkularınızın üzerine gidin ancak acele kararlar almayın. Sis dağılana kadar bekleyin.',
      loveGuidance: 'Belirsizlikler ve yanılsamalar olabilir. Her duyduğunuza veya kuruntunuza inanmayın.',
      careerGuidance: 'Gizli gündemler veya netleşmemiş şartlar. İmzalar atmadan önce iki kez kontrol edin.',
      spiritualGuidance: 'Rüyalarınız ve bilinçdışınız konuşuyor. Sembolleri ve hislerinizi doğru okuyun.'
    },
    reversed: {
      title: 'Sisin Dağılması & Netlik',
      keywords: ['Gerçeğin Ortaya Çıkışı', 'Korkuları Yenme', 'Aydınlanma'],
      warning: 'Kendi kuruntularınızın esiri olmaktan çıkın ve gerçekleri cesaretle kabul edin.',
      lesson: 'Korku yüzleşildiğinde sadece bir gölgeden ibarettir.'
    },
    affirmation: 'Bilinçdışımın bilgeliğini kucaklıyorum; yanılsamaların ötesindeki gerçeği görüyorum.',
    astrologicalAspect: 'Neptün - Ay kavuşumu: Yoğun rüya enerjisi ve psişik duyarlılık.'
  },
  {
    id: 'gunes-karti',
    number: 'XIX',
    numericValue: 19,
    name: 'Güneş (The Sun)',
    nameEn: 'The Sun',
    archetype: 'Kozmik Işık & Saf Neşe',
    associatedSignOrPlanet: 'Güneş (Yaşam Kaynağı)',
    element: 'Ateş',
    glyphType: 'planet',
    glyphId: 'gunes',
    accentColor: '#f59e0b',
    upright: {
      title: 'Zafer, Neşe & Sonsuz Canlılık',
      keywords: ['Aydınlık', 'Başarı', 'Yaşam Sevinci', 'Netlik'],
      message: 'Tarot destesinin en uğurlu kartı. Hayatınızın her alanına güneş doğuyor. Başarı, sağlık, mutluluk ve netlik sizinle. Işığınızı kimseden saklamayın!',
      loveGuidance: 'Sıcacık, berrak, coşkulu ve kutlama dolu bir aşk. Kalpler birleşiyor.',
      careerGuidance: 'Hak ettiğiniz takdir, başarı ve görünürlük zirveye çıkıyor.',
      spiritualGuidance: 'Siz saf ilahi ışığın yeryüzündeki yansımasısınız; parıldayın.'
    },
    reversed: {
      title: 'Gölgede Kalan Işık',
      keywords: ['Geçici Karamsarlık', 'Kibir', 'Geciken Kutlama'],
      warning: 'Güneş orada duruyor; bulutların arkasında kaldı diye varlığını inkar etmeyin.',
      lesson: 'İçsel neşenizi dış şartlara değil, kendi varoluşunuza bağlayın.'
    },
    affirmation: 'Işığım, neşem ve canlılığım tüm dünyayı aydınlatıyor; zafer ve mutluluk benimle.',
    astrologicalAspect: 'Güneş - Jüpiter üçgeni: Muazzam şans, bolluk ve hayat sevinci.'
  },
  {
    id: 'mahkeme',
    number: 'XX',
    numericValue: 20,
    name: 'Mahkeme (Judgement)',
    nameEn: 'Judgement',
    archetype: 'Ruhsal Uyanış & Yeniden Doğuş Çağrısı',
    associatedSignOrPlanet: 'Plüton (Dönüşüm)',
    element: 'Ateş',
    glyphType: 'planet',
    glyphId: 'pluto',
    accentColor: '#c084fc',
    upright: {
      title: 'Kozmik Çağrı & Büyük Uyanış',
      keywords: ['Uyanış', 'Hesaplaşma', 'Bağışlama', 'Yüksek Çağrı'],
      message: 'Kozmik boru sesi çalıyor! Eski benliğinizi affedin ve ruhsal çağrınıza yanıt verin. Kendinizi kınamayı bırakın; yepyeni ve daha bilinçli bir hayata uyanıyorsunuz.',
      loveGuidance: 'İlişkide geçmişin yüklerini affetme ve taptaze bir başlangıç yapma zamanı.',
      careerGuidance: 'Kariyerinizde gerçek amacınızı bulacağınız bir uyanış dönemi.',
      spiritualGuidance: 'Geçmişi geride bırakın; ilahi çağrı sizi hakiki potansiyelinize davet ediyor.'
    },
    reversed: {
      title: 'Öz Eleştiri & Çağrıyı Duymazdan Gelme',
      keywords: ['Pişmanlık', 'Suçluluk', 'Uyanıştan Kaçış', 'Kararsızlık'],
      warning: 'Kendinizi affetmediğiniz sürece geçmişin hayaletiyle yaşamaya devam edersiniz.',
      lesson: 'Bağışlama başkası için değil, kendi ruhunuzun özgürleşmesi için gereklidir.'
    },
    affirmation: 'Geçmişimi sevgiyle affediyor, ruhumun en yüksek çağrısına uyanıyorum.',
    astrologicalAspect: 'Plüton - Merkür üçgeni: Zihinsel dönüşüm ve derin aydınlanma.'
  },
  {
    id: 'dunya',
    number: 'XXI',
    numericValue: 21,
    name: 'Dünya (The World)',
    nameEn: 'The World',
    archetype: 'Kozmik Tamamlanış & Bütünlük Çemberi',
    associatedSignOrPlanet: 'Satürn (Kozmik Sınır & Tamamlanma)',
    element: 'Toprak',
    glyphType: 'planet',
    glyphId: 'saturn',
    accentColor: '#10b981',
    upright: {
      title: 'Büyük Döngünün Tamamlanması',
      keywords: ['Bütünlük', 'Başarı', 'Tamamlanma', 'Kozmik Uyum'],
      message: 'Yolculuk zaferle sona erdi ve döngü tamamlandı. Ruhsal, zihinsel ve maddi olarak tam bir bütünlük içindesiniz. Evren önünüzde saygıyla eğiliyor.',
      loveGuidance: 'Ruh eşi bütünlüğü, evlilik ve kalıcı mutluluk limanı.',
      careerGuidance: 'Büyük bir hedefin zirvesine ulaştınız. Uluslararası başarılar ve takdir.',
      spiritualGuidance: 'Siz evrenin bir parçası değil, evrenin bizzat kendisisiniz.'
    },
    reversed: {
      title: 'Eksik Kalan Halka & Geciken Bitiş',
      keywords: ['Yarım Bırakma', 'Kapanış Yapamama', 'Son Adımda Tereddüt'],
      warning: 'Bitiş çizgisine bu kadar yaklaşmışken son adımı atmaktan korkmayın.',
      lesson: 'Bir döngüyü tam kapatmadan yenisine başlayamazsınız; son düğümü atın.'
    },
    affirmation: 'Evrenle tam bir uyum ve bütünlük içindeyim; başardığım her şeyi kutluyorum.',
    astrologicalAspect: 'Güneş - Satürn kavuşumu: Ustalık, kalıcı eser ve nihai taçlanma.'
  }
];
