/**
 * Scientific and documentary guides for every interactive module in SpaceTour TR.
 * Rendered below the interactive tools in ModuleScreen.
 */

export interface ModuleGuideStep {
  step: string;
  title: string;
  desc: string;
}

export interface ModuleGuideFact {
  label: string;
  value: string;
  desc?: string;
}

export interface ModuleGuide {
  kicker: string;
  title: string;
  serif?: string;
  summary: string;
  intro: string[];
  howToTitle?: string;
  howTo: ModuleGuideStep[];
  factsTitle?: string;
  facts: ModuleGuideFact[];
  takeawaysTitle?: string;
  takeaways: string[];
}

export const MODULE_GUIDES: Record<string, ModuleGuide> = {
  // ==========================================
  // GÖK HARİTASI
  // ==========================================
  'harita/planetaryum': {
    kicker: 'Gözlem Geometrisi',
    title: 'Gökkubbe Projeksiyonu',
    serif: 've koordinat sistemleri',
    summary: 'Bulunduğunuz coğrafi enlem ve boylama göre gökyüzünün anlık ufuk düzlemini simüle eden etkileşimli planetaryum modeli.',
    intro: [
      'Gök kubbesi, yeryüzündeki bir gözlemci için sonsuz yarıçaplı hayali bir küre olarak kabul edilir. Yıldızların ve gezegenlerin bu küre üzerindeki konumları iki temel koordinat sistemiyle tanımlanır: Yerel ufuk sistemi (Azimut ve Yükseklik) ile göksel ekvator sistemi (Sağ Açıklık ve Dik Açıklık).',
      'Bu planetaryum, cihazınızın coğrafi konumunu ve yerel yıldız zamanını (Local Sidereal Time) esas alarak tam o saniyede başucunuzdan geçen meridyeni hesaplar. Ekrandaki görünüm, ışık kirliliğinden arındırılmış ideal bir atmosfer altında görebileceğiniz gerçek gök cisimlerini yansıtır.',
      'Sürükleyerek bakış açınızı değiştirebilir, pusula yönlerini izleyebilir ve artırılmış gerçeklik (AR) moduyla cihazınızı gökyüzüne doğrultarak gördüğünüz parıltıların kimliğini saniyeler içinde doğrulayabilirsiniz.'
    ],
    howToTitle: 'Planetaryum Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'Ufuk Çizgisini Belirleyin', desc: 'Ekranın alt sınırındaki çember zeminle temas eden ufuk hattını gösterir. Merkez nokta tam başucunuzu (Zenit) temsil eder.' },
      { step: '02', title: 'Yıldız Büyüklüklerini Ayırt Edin', desc: 'Daha büyük ve parlak çizilen noktalar daha düşük kadirli (yüksek görünür parlaklığa sahip) ana kerteriz yıldızlarıdır.' },
      { step: '03', title: 'Kutup Yönünü Bulun', desc: 'Kuzey ufkuna yöneldiğinizde hareketsiz kalan tek odak noktası Polaris (Kutup Yıldızı) olup gök kubbenin dönme eksenidir.' }
    ],
    factsTitle: 'Gözlem Parametreleri',
    facts: [
      { label: 'Başucu (Zenit)', value: '90° İrtifa', desc: 'Tam tepede bulunan gök noktası' },
      { label: 'Azimut Aralığı', value: '0° – 360°', desc: 'Kuzeyden başlayıp doğuya doğru ölçülen açı' },
      { label: 'Görünür Yıldız Limiti', value: '~9.000 Adet', desc: 'Tüm kürede çıplak gözle seçilebilen toplam yıldız sayısı' },
      { label: 'Yıldız Günü', value: '23s 56d 04s', desc: 'Dünya’nın yıldızlara göre bir tam dönüş süresi' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Gözlemlediğiniz yıldız ışıklarının büyük kısmı yüzlerce hatta binlerce yıl önce yola çıkmıştır; gökyüzüne bakmak kelimenin tam anlamıyla geçmişe bakmaktır.',
      'Şehir ışıkları altında bir gecede ortalama yalnızca 20 ila 50 yıldız görülebilirken, ışıksız bir dağ zirvesinde 2.500’den fazla yıldız aynı anda seçilebilir.'
    ]
  },

  'harita/parlak-yildizlar': {
    kicker: 'Yıldız Kataloğu',
    title: 'Gökkubbenin En Parlak Devleri',
    serif: 've tayfsal özellikleri',
    summary: 'Gece göğünün en yüksek görünür parlaklığa sahip yıldızlarının uzaklıkları, sıcaklıkları ve Türkiye enlemlerinden gözlem mevsimleri.',
    intro: [
      'Bir yıldızın gökyüzündeki parlaklığı yalnızca gerçek enerjisine (aydınlatma gücüne) değil, aynı zamanda Dünya’ya olan mesafesine bağlıdır. Astronomide kadir (magnitude) ölçeği tersine işler: Sayı küçüldükçe veya eksiye düştükçe yıldız o kadar parlak görünür.',
      'Gökyüzünün mutlak hakimi olan Sirius (-1.46 kadir), kış aylarında güney ufkunda mavi-beyaz parıltısıyla parıldar. Yaz göğünde ise Lir takımyıldızındaki Vega (0.03 kadir) başucu noktasını aydınlatır.',
      'Yıldızların renkleri onların yüzey sıcaklıklarının doğrudan göstergesidir. Mavi yıldızlar 25.000 Kelvin’in üzerinde kavurucu sıcaklıktayken, kızıl dev Betelgeuse yaklaşık 3.500 Kelvin ile yaşamının son demlerini yaşamaktadır.'
    ],
    howToTitle: 'Kerteriz Yıldızlarını Bulma Yöntemi',
    howTo: [
      { step: '01', title: 'Mevsimi Tanıyın', desc: 'Kışın Avcı (Orion) kuşağını hizalayarak güneye doğru Sirius’a, kuzeybatıya doğru Aldebaran’a ulaşın.' },
      { step: '02', title: 'Yaz Üçgenini Kurun', desc: 'Yaz aylarında başucundaki Vega, kuğunun kuyruğundaki Deneb ve kartalın kalbindeki Altair üçgenini birleştirin.' },
      { step: '03', title: 'Yay Çizin', desc: 'İlkbaharda Büyük Ayı’nın sapındaki eğriyi takip ederek Arcturus’a, oradan da Spica’ya uzanın.' }
    ],
    factsTitle: 'İlk 4 Parlak Yıldız Verisi',
    facts: [
      { label: 'Sirius (Akyıldız)', value: '-1.46 Kadir', desc: '8.6 ışık yılı · A1V tayfı · Kış göğü' },
      { label: 'Canopus', value: '-0.74 Kadir', desc: '310 ışık yılı · F0II tayfı · Çok güney ufku' },
      { label: 'Arcturus', value: '-0.05 Kadir', desc: '36.7 ışık yılı · K1.5III kızıl dev · İlkbahar' },
      { label: 'Vega', value: '0.03 Kadir', desc: '25.0 ışık yılı · A0V tayfı · Yaz göğü' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Güneş’ten sonra Dünya’ya en yakın yıldız sistemi Alpha Centauri (4.37 ışık yılı) olsa da, gökyüzünün en parlak yıldızı Sirius sistemidir.',
      'Avcı takımyıldızındaki kızıl süperdev Betelgeuse öylesine büyüktür ki, Güneş’in yerine konulsaydı Jüpiter’in yörüngesini dahi içine alırdı.'
    ]
  },

  'harita/bortle': {
    kicker: 'Işık Kirliliği Skalası',
    title: 'Bortle Karanlık Gökyüzü Ölçeği',
    serif: 've gözlem kalitesi',
    summary: 'John E. Bortle tarafından geliştirilen 9 kademeli karanlık skala ile gökyüzü şeffaflığı ve Türkiye’deki korunaklı gözlem noktaları.',
    intro: [
      'Modern şehirleşmenin yan ürünü olan aşırı ve yanlış aydınlatma, insanlığın binlerce yıldır izlediği kozmik manzarayı silmektedir. Bortle Ölçeği, bir gözlem sahasının ışık kirliliği düzeyini ve gökyüzü kalitesini 1 (Mükemmel karanlık) ile 9 (Şehir içi aydınlığı) arasında sınıflandırır.',
      'Bortle Sınıf 1 ve 2 seviyelerinde Samanyolu galaksisinin merkezi kolları gökyüzünde belirgin bir bulut ve gölge oyunu gibi görünür; Zodyak ışığı ve hava ışıması (airglow) çıplak gözle ayırt edilebilir.',
      'Türkiye’de astronomik gözlemler için en elverişli sahalar; TÜBİTAK Ulusal Gözlemevi’nin bulunduğu Antalya Bakırlıtepe (2.500 m), Doğu Anadolu Gözlemevi’nin kurulduğu Erzurum Karakaya Tepesi (3.170 m) ve İç Anadolu’nun yüksek platolarıdır.'
    ],
    howToTitle: 'Bortle Sınıfınızı Nasıl Tespit Edersiniz?',
    howTo: [
      { step: '01', title: 'Samanyolu’nu Arayın', desc: 'Samanyolu çizgisi net görülebiliyor ve toz yarıkları seçiliyorsa Bortle 3 veya daha iyi bir yerdesiniz.' },
      { step: '02', title: 'M31 Andromeda Galaksisini Deneyin', desc: 'Andromeda çıplak gözle kolayca puslu bir leke olarak seçilebiliyorsa gökyüzü sınır kadiriniz 6.0’ın üzerindedir.' },
      { step: '03', title: 'Ufuk Işıltısını İnceleyin', desc: 'Ufuk çizgisi boyunca sarı/turuncu kubbe ışıkları zayıfsa veya yoksa derin uzay fotoğrafçılığı için ideal ortamdasınız.' }
    ],
    factsTitle: 'Bortle Sınıfları Özeti',
    facts: [
      { label: 'Sınıf 1 (Karanlık)', value: 'Limit: 7.6 – 8.0 Kadir', desc: 'Zodyak ışığı belirgin, zemin gölgeleri seçilir' },
      { label: 'Sınıf 4 (Kırsal Geçiş)', value: 'Limit: 6.1 – 6.5 Kadir', desc: 'Samanyolu ufkuna yakın yerlerde sönükleşir' },
      { label: 'Sınıf 7 (Banliyö)', value: 'Limit: 5.1 – 5.5 Kadir', desc: 'Samanyolu tamamen kaybolur, arka plan grileşir' },
      { label: 'Sınıf 9 (Metropol)', value: 'Limit: < 4.0 Kadir', desc: 'Yalnızca Ay, parlak gezegenler ve az sayıda yıldız' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Dünya nüfusunun %80’inden fazlası ışık kirliliği altında yaşamakta ve yaşamları boyunca Samanyolu galaksisini çıplak gözle hiç görememektedir.',
      'Erzurum’daki DAG Gözlemevi, 3.170 metre irtifası ve düşük nem oranı sayesinde Avrupa kıtasının atmosferik görüş (seeing) kalitesi en yüksek kızılötesi gözlem sahalarından biridir.'
    ]
  },

  'harita/messier': {
    kicker: 'Derin Uzay Atlası',
    title: 'Charles Messier Kataloğu',
    serif: 've 110 kozmik hedef',
    summary: '18. yüzyılda kuyruklu yıldız avcısı Charles Messier tarafından derlenen galaksiler, bulutsular ve yıldız kümeleri rehberi.',
    intro: [
      'Fransız gökbilimci Charles Messier, 1770’lerde gökyüzünde Halley gibi dönemsel kuyruklu yıldızları ararken teleskobunda hareketsiz duran puslu lekelere rastladı. Zaman kaybetmemek adına bu sabit nesnelerin bir listesini tutmaya karar verdi.',
      'Messier’in "kuyruklu yıldız sanılmaması gereken sahte hedefler" olarak fişlediği bu 110 cisim, bugün amatör ve profesyonel astronominin en görkemli derin uzay nesneleri (DSO) koleksiyonunu oluşturmaktadır.',
      'Katalog; M31 Andromeda Galaksisi, M42 Avcı Bulutsusu, M45 Ülker Açık Yıldız Kümesi ve M1 Yengeç Süpernova Kalıntısı gibi evrenin en zengin astrofiziksel yapı taşlarını barındırır.'
    ],
    howToTitle: 'Messier Hedeflerini Gözlemleme',
    howTo: [
      { step: '01', title: 'Doğru Ekipmanı Seçin', desc: 'M45 gibi geniş açık kümeler için küçük bir dürbün (7x50 veya 10x50), M51 gibi galaksiler için 150 mm+ açıklıklı teleskop gerekir.' },
      { step: '02', title: 'Yıldız Atlama Tekniğini Kullanın', desc: 'Hedefin yakınındaki parlak bir yıldızı referans alıp optik bulucuda adım adım ilerleyerek nesneye ulaşın.' },
      { step: '03', title: 'Yan Bakış (Averted Vision) Uygulayın', desc: 'Göz retinasındaki çomak hücreleri kenarlarda yoğun olduğundan, sönük bulutsulara doğrudan değil biraz yanına bakarak daha fazla ayrıntı yakalayın.' }
    ],
    factsTitle: 'Katalog Dağılımı',
    facts: [
      { label: 'Toplam Hedef', value: '110 Cisim', desc: 'M1 (Yengeç) ile M110 (Eliptik Galaksi) arası' },
      { label: 'Galaksiler', value: '40 Adet', desc: 'Spiral, eliptik ve merceksi yapılar' },
      { label: 'Açık Kümeler', value: '26 Adet', desc: 'Genç, sıcak yıldız toplulukları' },
      { label: 'Küresel Kümeler', value: '29 Adet', desc: 'Yüz binlerce yaşlı yıldızdan oluşan küreler' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Her yıl mart ayının son haftasında Ay’ın yeniay evresinde olduğu bir gecede, tüm 110 Messier nesnesini gün batımından gün doğumuna kadar tek gecede gözlemleme maratonu ("Messier Maratonu") düzenlenir.',
      'M1 Yengeç Bulutsusu, MS 1054 yılında Çinli ve İslam astronomlar tarafından gündüz dahi görülebilen bir süpernovanın kalıntısıdır.'
    ]
  },

  'harita/polaris': {
    kicker: 'Kutup Yönü & Presesyon',
    title: 'Polaris ve Yalpalama Çemberi',
    serif: 've 25.772 yıllık döngü',
    summary: 'Kuzey Kutup Yıldızı’nın gökyüzündeki hareketsizliği, Büyük Ayı ile bulunuşu ve Dünya’nın topaç gibi yalpalaması sonucu değişen kutup merkezleri.',
    intro: [
      'Dünya’nın dönüş ekseni kuzey kutup noktasında uzaya doğru uzatıldığında tam olarak Polaris’in (Demirkazık) birkaç yay dakikası yakınına işaret eder. Bu nedenle gece boyunca tüm gök kubbe Polaris’in etrafında döner gibi görünürken kendisi sabit kalır.',
      'Ancak bu sabitlik kalıcı değildir. Güneş ve Ay’ın Dünya’nın ekvator şişkinliği üzerindeki kütleçekim kuvveti, Dünya’nın dönme ekseninin tıpkı yavaşlayan bir topaç gibi yalpalamasına (presesyon) yol açar. Bu tam döngü 25.772 yıl sürer.',
      'Bundan yaklaşık 5.000 yıl önce Mısır piramitleri inşa edilirken kutup yıldızı Ejderha takımyıldızındaki Thuban idi. Yaklaşık 12.000 yıl sonra ise göğün en parlak yıldızlarından biri olan Vega yeni kutup yıldızımız olacaktır.'
    ],
    howToTitle: 'Kutup Yıldızı’nı Gökyüzünde Bulma',
    howTo: [
      { step: '01', title: 'Büyük Ayı Cezvesini Bulun', desc: 'Yedi parlak yıldızdan oluşan kepçe formunun su tutan çanak kısmını belirleyin.' },
      { step: '02', title: 'İşaret Yıldızlarını Hizalayın', desc: 'Çanağın dış kenarını oluşturan Merak ve Dubhe yıldızları arasını düz bir çizgiyle birleştirin.' },
      { step: '03', title: 'Beş Kat Uzatın', desc: 'Merak’tan Dubhe’ye doğru olan mesafeyi aynı doğrultuda 5 kat ileri uzattığınızda doğrudan Polaris’e varırsınız.' }
    ],
    factsTitle: 'Polaris ve Presesyon Verileri',
    facts: [
      { label: 'Uzaklık', value: '433 Işık Yılı', desc: 'Üçlü bir yıldız sistemidir (Polaris Aa, Ab, B)' },
      { label: 'Yıldız Türü', value: 'Sefeid Değişeni', desc: 'Parlaklığı periyodik olarak zonklayan sarı süperdev' },
      { label: 'Presesyon Periyodu', value: '25.772 Yıl', desc: 'Büyük Platonik Yıl olarak da adlandırılır' },
      { label: 'Gelecek Kutup Yıldızı', value: 'Vega (~MS 13.700)', desc: 'Lir takımyıldızının parlayan mavi devi' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Polaris’in ufuktan olan açısal yüksekliği, bulunduğunuz yerin coğrafi enlemine tam olarak eşittir. İstanbul’da (41°K) Polaris tam 41 derece yüksekliktedir.',
      'Güney yarımkürede Polaris gibi parlak tek bir kutup yıldızı yoktur; gözlemciler güney kutbunu bulmak için Güney Haçı (Crux) takımyıldızını kerteriz alırlar.'
    ]
  },

  'harita/samanyolu': {
    kicker: 'Galaktik Kartografya',
    title: 'Samanyolu 3D Nokta Bulutu',
    serif: 've Güneş’in konumu',
    summary: '28.000 yıldız parçacığıyla modellenen çubuklu sarmal galaksimiz, Sagittarius A* süper kütleli çekirdeği ve Güneş Sistemimizin Orion Mahmuzu’ndaki koordinatı.',
    intro: [
      'Samanyolu Galaksisi, Evren’deki milyarlarca ada evrenden yalnızca biri olmakla birlikte, insanlığın doğduğu ve içinde yaşadığı kozmik evimizdir. Çapı yaklaşık 100.000 ila 120.000 ışık yılı olan galaksimiz, morfolojik olarak SBbc tipi bir çubuklu sarmal galaksidir.',
      'Merkezinde yaklaşık 4.3 milyon Güneş kütlesine sahip Sagittarius A* adında süper kütleli bir karadelik yer alır. Karadeliği çevreleyen yoğun nükleer yıldız kümesi ve ~27 bin ışık yılı uzunluğundaki merkezi çubuk, galaksinin dev kütleçekim dinamosunu oluşturur.',
      'Güneş Sistemimiz bu devasa girdabın ne merkezinde ne de en uç kıyısındadır. Çekirdekten yaklaşık 26.670 ışık yılı (8.2 kiloparsek) uzaklıkta, Yay (Sagittarius) ve Kahraman (Perseus) ana kolları arasında uzanan "Orion Mahmuzu" adlı yerel yapıda saniyede yaklaşık 230 km hızla galaktik yörüngesinde dolanır.'
    ],
    howToTitle: 'Galaksi Modelini Nasıl İncelemelisiniz?',
    howTo: [
      { step: '01', title: 'Kuşbakışı Disk Görünümüne Geçin', desc: 'Galaksinin tepeden logaritmik sarmal kollarını, Kahraman ve Kalkan-Erboğa ana omurgalarını ve yıldız yoğunluğu gradyanını inceleyin.' },
      { step: '02', title: 'Güneş’in Konumunu Odaklayın', desc: '"Güneş (Biz)" butonuna tıklayarak Güneş Sistemimizin Orion Mahmuzu’ndaki 3D sarı halka ve fener işaretçisine yaklaşın.' },
      { step: '03', title: 'Yandan Profil Moduna Geçin', desc: 'Galaktik ince diskin dikeyde yalnızca yaklaşık 1.000 ışık yılı kalınlıkta olduğunu ve merkezdeki küresel şişkinliğin nasıl yükseldiğini gözlemleyin.' }
    ],
    factsTitle: 'Galaktik Parametreler',
    facts: [
      { label: 'Galaksi Çapı', value: '~105.700 Işık Yılı', desc: 'Görünür yıldız diskinin çapı' },
      { label: 'Güneş’in Çekirdek Mesafesi', value: '26.670 Işık Yılı', desc: '8.18 kiloparsek (galaktik yarıçapın yarısı)' },
      { label: 'Güneş Orbital Hızı', value: '828.000 km/sa', desc: '230 km/saniye galaktik dönüş hızı' },
      { label: 'Kozmik Yıl (Dönüş Süresi)', value: '~230 Milyon Yıl', desc: 'Güneş’in galaksi çevresindeki bir tam turu' },
      { label: 'Sagittarius A* Kütlesi', value: '4.297 × 10⁶ M☉', desc: 'Merkezi süper kütleli karadeliğin kütlesi' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Güneş Sistemimiz galaksi çevresindeki bir tam turunu yaklaşık 230 milyon yılda tamamlar. Güneş son kez şu anki konumundayken Dünya üzerinde ilk dinozorlar yeni evrimleşmekteydi.',
      'Geceleri gökyüzünde çıplak gözle gördüğümüz tüm yıldızlar (yaklaşık 9.000 adet), Samanyolu’nun tamamına kıyasla Güneş’in etrafındaki yalnızca birkaç bin ışık yılı genişliğindeki minik bir "mahalle" içinde yer alır.'
    ]
  },

  // ==========================================
  // ANSİKLOPEDİ LABORATUVARI
  // ==========================================
  'ansiklopedi/kepler-orrery': {
    kicker: 'Yörünge Dinamiği',
    title: 'Kepler’in Üç Yasası',
    serif: 've gezegen hareketleri',
    summary: 'Johannes Kepler’in Tycho Brahe’nin gözlemlerinden türettiği eliptik yörüngeler ve periyot-mesafe ilişkisi simülasyonu.',
    intro: [
      '17. yüzyılın başında Johannes Kepler, gezegenlerin kusursuz dairesel yörüngelerde değil, odaklarından birinde Güneş’in bulunduğu elipsler üzerinde hareket ettiğini kanıtlayarak gök mekaniğinde devrim yarattı.',
      'Kepler’in İkinci Yasası (Eşit Alanlar Yasası), gezegeni Güneş’e bağlayan yarıçap vektörünün eşit zaman aralıklarında eşit alanlar süpürdüğünü ifade eder. Bu durum, bir gezegenin günberi (Güneş’e en yakın) noktasında hızlandığını, günöte (en uzak) noktasında ise yavaşladığını gösterir.',
      'Üçüncü Yasa ise yörünge periyodunun karesi ile Güneş’e olan ortalama uzaklığın küpü arasındaki sabit oranı ortaya koyar (T² = a³). Bu matematiksel uyum, dış gezegenlerin iç gezegenlere kıyasla neden çok daha yavaş dolandığını açıklar.'
    ],
    howToTitle: 'Simülatör Parametreleri Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'Hız Göstergelerini Karşılaştırın', desc: 'Merkür saniyede ortalama 47.4 km hızla dönerken, en dıştaki Neptün saniyede yalnızca 5.4 km hızla ilerler.' },
      { step: '02', title: 'Basıklık (Eksantriklik) Değerine Bakın', desc: '0 değeri tam daireyi, 1’e yaklaşan değerler ise son derece basık eliptik yörüngeleri temsil eder.' },
      { step: '03', title: 'Periyot Oranlarını İnceleyin', desc: 'Dünya 1 yılda dolanırken, Jüpiter yaklaşık 12 yılda, Satürn ise 29.5 yılda tek bir tur tamamlar.' }
    ],
    factsTitle: 'Fiziksel Formüller',
    facts: [
      { label: '1. Yasa', value: 'r = a(1 - e²) / (1 + e cos θ)', desc: 'Odakta Güneş olan elips denklemi' },
      { label: '2. Yasa', value: 'dA / dt = sabit', desc: 'Açısal momentumun korunumunun sonucu' },
      { label: '3. Yasa', value: 'T² / a³ = 4π² / G(M+m)', desc: 'Periyot-yarıçap harmonik bağlantısı' },
      { label: 'Merkür Basıklığı', value: 'e = 0.2056', desc: 'Güneş Sistemi gezegenleri arasındaki en basık yörünge' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Kepler yasaları daha sonra Isaac Newton’ın Evrensel Çekim Kanunu’nu formüle etmesindeki en temel matematiksel kanıt zeminini oluşturmuştur.',
      'Yapay uydular, uzay istasyonları ve gezegenler arası sondaların tüm yörünge rota hesaplamaları bugün halen Kepler mekaniği ilkelerine dayanır.'
    ]
  },

  'ansiklopedi/olcek': {
    kicker: 'Boyutsal Karşılaştırma',
    title: 'Kozmik Ölçek ve Boşluk',
    serif: 've gezegen çapları',
    summary: 'Güneş Sistemi’ndeki cisimlerin gerçek geometrik çap oranları ve ders kitaplarının yanıltıcı ölçek çizimlerinin ardındaki gerçek.',
    intro: [
      'Geleneksel okul kitaplarında ve illüstrasyonlarda gezegenler genellikle yan yana sıralanmış büyük küreler olarak gösterilir. Oysa gerçek evrende Güneş Sistemi akıl almaz bir boşluktan ibarettir.',
      'Güneş, sistemdeki toplam kütlenin %99.86’sını tek başına barındırır. Çapı yaklaşık 1.39 milyon kilometredir; bu da içerisine yaklaşık 1.3 milyon adet Dünya sığabileceği anlamına gelir.',
      'En büyük gaz devi olan Jüpiter’in çapı Dünya’nın 11 katıdır. Buna karşılık Merkür, Dünya’nın uydusu Ay’dan yalnızca biraz daha büyüktür. Bu modül ile gök cisimlerini yan yana getirerek gerçek hacim ve çap hiyerarşisini somutlaştırabilirsiniz.'
    ],
    howToTitle: 'Ölçek Modeli Nasıl Yorumlanır?',
    howTo: [
      { step: '01', title: 'Karasal Gezegenleri Kıyaslayın', desc: 'Merkür, Venüs, Dünya ve Mars iç sistemin nispeten küçük, kayalık ve yoğun üyeleridir.' },
      { step: '02', title: 'Gaz ve Buz Devlerini İnceleyin', desc: 'Jüpiter ve Satürn (gaz devleri) ile Uranüs ve Neptün (buz devleri) devasa hidrojen/helyum/buz zarflarına sahiptir.' },
      { step: '03', title: 'Güneş İle Oranlayın', desc: 'Güneş bir basketbol topu olsaydı, Dünya 25 metre uzaktaki bir toplu iğne başı, Jüpiter ise bir ceviz boyutunda olurdu.' }
    ],
    factsTitle: 'Ekvator Çapları',
    facts: [
      { label: 'Güneş', value: '1.392.700 km', desc: 'Dünya çapının ~109 katı' },
      { label: 'Jüpiter', value: '139.820 km', desc: 'Dünya çapının 11.2 katı' },
      { label: 'Dünya', value: '12.742 km', desc: 'Karasal gezegenlerin en büyüğü' },
      { label: 'Ay', value: '3.474 km', desc: 'Dünya çapının yaklaşık dörtte biri' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Dünya ile Ay arasındaki ortalama mesafe (384.400 km) içine Güneş Sistemi’ndeki diğer tüm gezegenler (Merkür’den Neptün’e) yan yana sığabilir.',
      'Satürn o denli düşük bir yoğunluğa sahiptir ki (0.687 g/cm³), eğer onu içine alabilecek kadar devasa bir su havuzu olsaydı Satürn suyun üzerinde yüzerdi.'
    ]
  },

  'ansiklopedi/kutlecekim': {
    kicker: 'Yerçekimi Fiziği',
    title: 'Yüzey Çekimi ve Dinamik Ağırlık',
    serif: 've serbest düşme ivmesi',
    summary: 'Newton kütleçekim kanunu çerçevesinde kütleniz ile farklı gök cisimlerindeki dinamik ağırlığınız ve dikey sıçrama yüksekliğiniz.',
    intro: [
      'Kütle, bir cismin içerdiği madde miktarının değişmez bir ölçüsüdür ve kilogram (kg) cinsinden ifade edilir. Ağırlık ise bu kütleye yerel kütleçekim alanı tarafından uygulanan kuvvettir ve Newton (N) birimiyle ölçülür (W = m · g).',
      'Bir gök cisminin yüzeyindeki yerçekimi ivmesi, o cismin toplam kütlesiyle doğru, yüzey yarıçapının karesiyle ters orantılıdır (g = GM / R²). Bu nedenle yüksek kütleye ancak geniş yarıçapa sahip cisimlerde yerçekimi beklenenden farklı hissedilebilir.',
      'Örneğin Ay’da yerçekimi Dünya’nın yaklaşık altıda biridir (1.62 m/s²). Bu ortamda Dünya’da 50 cm zıplayabilen bir insan kas kuvvetiyle Ay yüzeyinde neredeyse 3 metre yükseğe sıçrayabilir.'
    ],
    howToTitle: 'Hesaplayıcı Nasıl Kullanılır?',
    howTo: [
      { step: '01', title: 'Kütlenizi Girin', desc: 'Dünya üzerindeki standart tartı değerinizi (kg) araca girin.' },
      { step: '02', title: 'Gök Cisimlerini Gezin', desc: 'Küçük asteroidlerden dev gaz gezegenlerine kadar yüzey ivmesinin ağırlığınıza etkisini inceleyin.' },
      { step: '03', title: 'Sıçrama Dinamiğini Görün', desc: 'Düşük çekimli cisimlerde havalanma süresinin ve tepe yüksekliğinin nasıl dramatik biçimde arttığını gözlemleyin.' }
    ],
    factsTitle: 'Yüzey Yerçekimi İvmeleri (g)',
    facts: [
      { label: 'Dünya', value: '9.81 m/s² (1.00 g)', desc: 'Referans standart yerçekimi' },
      { label: 'Ay', value: '1.62 m/s² (0.16 g)', desc: 'Dünya’nın yaklaşık 1/6’sı' },
      { label: 'Mars', value: '3.72 m/s² (0.38 g)', desc: 'Dünya’nın yaklaşık üçte biri' },
      { label: 'Jüpiter (1 bar bulut)', value: '24.79 m/s² (2.53 g)', desc: 'Ağırlığınız 2.5 katına çıkar' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Uluslararası Uzay İstasyonu’ndaki astronotlar yerçekimi olmadığı için değil, istasyonla birlikte sürekli serbest düşme halinde oldukları için ağırlıksızlık yaşarlar.',
      'Bir nötron yıldızının yüzeyinde yerçekimi Dünya’nın yaklaşık 200 milyar katıdır; orada bir çay kaşığı madde Dünya’daki bir dağ kadar ağırdır.'
    ]
  },

  'ansiklopedi/zaman-makinesi': {
    kicker: 'Kozmolojik Kronoloji',
    title: 'Kozmik Zaman Makinesi',
    serif: 've 13.8 milyar yıllık takvim',
    summary: 'Büyük Patlama’dan günümüze evrenin evrimsel basamaklarını Carl Sagan’ın 1 yıllık kozmik takvim ölçeğiyle canlandıran model.',
    intro: [
      'Modern astrofizik verilerine göre evrenimiz yaklaşık 13.787 milyar yıl önce tekillikten doğan Büyük Patlama (Big Bang) ile başlamıştır. Bu devasa zaman dilimini insan aklının kavrayabilmesi için Carl Sagan tüm evren tarihini 1 yıllık bir takvime sığdırmıştır.',
      'Bu kozmik takvimde 1 Ocak gecesi 00:00 Büyük Patlama’yı temsil eder. Samanyolu galaksisi mayıs ayında şekillenir; Güneş Sistemi ve Dünya ise ancak eylül ayının başlarında oluşur.',
      'İnsanlığın kayıtlı tüm yazılı tarihi, piramitlerin inşası, savaşlar ve modern teknoloji çağının tamamı, bu 365 günlük yılın son günü olan 31 Aralık gecesi saat 23:59:50 ile 23:59:59 arasındaki son 10 saniyenin içine sığmaktadır.'
    ],
    howToTitle: 'Zaman Çizelgesini İnceleme',
    howTo: [
      { step: '01', title: 'Erken Evren Çağları', desc: 'Enflasyon, nükleosentez ve rekombinasyon (ilk 380.000 yıl) aşamalarını izleyin.' },
      { step: '02', title: 'Yıldız ve Galaksi Oluşumu', desc: 'Karanlık Çağlar’ın ardından ilk süper kütleli yıldızların tutuştuğu Kozmik Şafak dönemine tanık olun.' },
      { step: '03', title: 'Dünya ve Biyolojik Evrim', desc: 'Tek hücreli yaşamdan çok hücrelilere ve memelilere geçişin takvimdeki geç saatlerini inceleyin.' }
    ],
    factsTitle: 'Kronolojik Dönüm Noktaları',
    facts: [
      { label: 'Büyük Patlama', value: '13.8 Milyar Yıl Önce', desc: 'Uzay, zaman ve maddenin başlangıcı' },
      { label: 'İlk Fotonlar (CMB)', value: '+380.000 Yıl', desc: 'Evren saydamlaştı, ilk ışık serbest kaldı' },
      { label: 'Güneş Sistemi', value: '4.57 Milyar Yıl Önce', desc: 'Güneş bulutsusunun kütleçekimsel çöküşü' },
      { label: 'Homo Sapiens', value: '~300.000 Yıl Önce', desc: 'Kozmik takvimde 31 Aralık 23:52' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Vücudumuzdaki hidrojen atomları Büyük Patlama’nın ilk 3 dakikasında oluşmuştur; kanımızdaki demir ve kemiklerimizdeki kalsiyum ise patlayan dev yıldızların süpernova ocaklarında dövülmüştür.',
      'Geceleri televizyon veya radyo antenlerindeki parazit cızırtısının yaklaşık %1’i doğrudan Büyük Patlama’dan arta kalan kozmik arka plan ışımasından kaynaklanır.'
    ]
  },

  'ansiklopedi/otegezegenler': {
    kicker: 'Güneş Dışı Gezegenler',
    title: 'Ötegezegen Avı ve Yaşam Kuşağı',
    serif: 've Dünya benzerlik indeksleri',
    summary: 'Kepler ve TESS uzay teleskoplarıyla keşfedilen 5.500’den fazla ötegezegen, yaşanabilir bölge (Goldilocks Zone) ve ESI kriterleri.',
    intro: [
      '1995 yılında 51 Pegasi b’nin keşfedilmesinden bu yana gökbilimciler Samanyolu galaksisinde Güneş dışındaki yıldızların etrafında dönen binlerce ötegezegen (exoplanet) doğrulamıştır. Artık galaksimizdeki yıldız sayısından daha fazla gezegen olduğu bilinmektedir.',
      'Gezegen avında iki temel yöntem öne çıkar: Yıldızın önünden geçerken ışığında yarattığı periyodik parlaklık düşüşünü ölçen "Geçiş Fotometrisi" (Transit) ve gezegenin yerçekimiyle yıldızında yarattığı yalpalamayı tespit eden "Radyal Hız" (Doppler) yöntemi.',
      'Bir gezegenin yüzeyinde sıvı suyun var olabilmesi için yıldızına ne çok yakın (buharlaşma) ne de çok uzak (donma) olması gerekir. Bu kritik yörünge aralığına "Yaşanabilir Bölge" veya "Goldilocks Kuşağı" adı verilir.'
    ],
    howToTitle: 'Ötegezegen Parametreleri Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'ESI Değerine Bakın', desc: 'Dünya Benzerlik İndeksi (Earth Similarity Index) 0 ile 1 arasındadır; 1.00 tam Dünya kopyasını ifade eder.' },
      { step: '02', title: 'Gezegen Sınıfını Belirleyin', desc: 'Süper-Dünya, Sıcak Jüpiter, Mini-Neptün veya Karasal Dünya gibi yapısal tipleri inceleyin.' },
      { step: '03', title: 'Ana Yıldız Türünü Kontrol Edin', desc: 'TRAPPIST-1 gibi kırmızı cüceler sık sık süper patlamalar üreterek gezegen atmosferlerini aşındırabilir.' }
    ],
    factsTitle: 'Öne Çıkan Adaylar',
    facts: [
      { label: 'Proxima Centauri b', value: '4.24 Işık Yılı', desc: 'Bize en yakın yaşanabilir kuşak gezegeni' },
      { label: 'Kepler-452b', value: 'ESI: 0.83', desc: 'Güneş benzeri G-tipi yıldızın Dünya benzeri devi' },
      { label: 'TRAPPIST-1e', value: 'ESI: 0.85', desc: 'Kompakt sistemde su barındırmaya en yakın aday' },
      { label: 'Toplam Doğrulanan', value: '> 5.600 Gezegen', desc: 'NASA Exoplanet Archive güncel verisi' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'James Webb Uzay Teleskobu, K2-18b ötegezegeninin atmosferinde karbon içerikli moleküller ve Dünya’da yalnızca canlı fitoplanktonlar tarafından üretilen dimetil sülfür (DMS) izleri tespit etmiştir.',
      'Sıcak Jüpiter adı verilen dev gaz gezegenleri yıldızlarına öylesine yakındır ki tek bir yılı birkaç gün sürer ve atmosferlerinde demir veya cam yağmurları yağar.'
    ]
  },

  'ansiklopedi/asteroit-carpmasi': {
    kicker: 'Kozmik Tehdit Fiziği',
    title: 'Asteroit Çarpışma Mekaniği',
    serif: 've krater enerjisi',
    summary: 'Çap, hız ve hedef yoğunluğuna göre açığa çıkan megaton cinsinden kinetik enerji, krater çapı ve küresel iklim etkileri.',
    intro: [
      'Güneş Sistemi’nin oluşumundan arta kalan milyonlarca kaya ve metal parçası Mars ile Jüpiter arasındaki Asteroit Kuşağı’nda ve Kuiper Kuşağı’nda dolanır. Yörüngeleri dev gezegenlerin çekimiyle bozulan bazı göktaşları Dünya’ya Yakın Cisimler (NEO) haline gelir.',
      'Bir çarpışmanın yıkıcı gücü Einstein öncesi temel kinetik enerji formülüyle hesaplanır: E = ½ m v². Birkaç yüz metrelik bir asteroit saniyede 20-30 kilometre hızla atmosfere girdiğinde açığa çıkan enerji yüzlerce nükleer bombaya denk gelir.',
      'Yaklaşık 66 milyon yıl önce Meksika’nın Yucatan yarımadasına çarpan 10 km çapındaki Chicxulub asteroidi, açığa çıkardığı 100 milyon megaton TNT enerjiyle dinozorlar da dahil tüm canlı türlerinin %75’inin yok olmasına yol açmıştır.'
    ],
    howToTitle: 'Simülatörü Ayarlama ve Okuma',
    howTo: [
      { step: '01', title: 'Çap ve Bileşimi Seçin', desc: 'Gözenekli buzdan gözeneksiz yoğun nikel-demir göktaşlarına kadar malzeme yoğunluğunu belirleyin.' },
      { step: '02', title: 'Giriş Hızı ve Açısını Girin', desc: 'Tipik çarpma hızları saniyede 11 ila 72 km arasındadır; 45 derecelik açı en yaygın çarpışma geometrisidir.' },
      { step: '03', title: 'Hasar Yarıçapını İnceleyin', desc: 'Termal radyasyon, hava şoku (şok dalgası) ve deprem büyüklüğü (Richter) eşiklerini gözlemleyin.' }
    ],
    factsTitle: 'Önemli Çarpışma Eşikleri',
    facts: [
      { label: 'Çelyabinsk (2013)', value: '~20 m Çap', desc: 'Hava patlaması · 500 kiloton TNT enerji' },
      { label: 'Tunguska (1908)', value: '~50-60 m Çap', desc: '2.000 km² ormanı yerle bir eden atmosferik patlama' },
      { label: 'Barringer Krateri (AZ)', value: '~50 m Demir', desc: '1.2 km genişliğinde, 170 m derinliğinde krater' },
      { label: 'Chicxulub (K-Pg)', value: '~10-15 km Çap', desc: '180 km krater · 100 milyon megaton TNT' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'NASA’nın 2022 yılındaki DART (Double Asteroid Redirection Test) görevi, bir uzay aracını Dimorphos asteroidine bilerek çarparak insanlık tarihinde ilk kez bir gök cisminin yörüngesini başarıyla değiştirmiştir.',
      'Dünya atmosferi her gün yaklaşık 100 tonluk meteor tozu ve küçük parçacığı yakarak yüzeydeki yaşamı koruyan doğal bir kalkandır.'
    ]
  },

  'ansiklopedi/kara-delik': {
    kicker: 'Genel Görelilik',
    title: 'Kara Delikler ve Olay Ufku',
    serif: 've kütleçekimsel zaman genleşmesi',
    summary: 'Işığın dahi kaçamadığı Schwarzschild yarıçapı, olay ufku civarındaki uzay-zaman eğriliği ve spagettileşme fiziği.',
    intro: [
      'Büyük kütleli bir yıldız nükleer yakıtını tükettiğinde kendi kütleçekiminin ezici gücünü dengeleyecek hiçbir termonükleer basınç kalmaz. Madde sonsuz yoğunluktaki sıfır hacimli bir noktaya (tekillik) çöker ve bir kara delik doğar.',
      'Karl Schwarzschild’in Einstein alan denklemlerinden türettiği formüle göre (r_s = 2GM / c²), kaçış hızının ışık hızına (c) eşitlendiği küresel sınıra "Olay Ufku" denir. Olay ufkunun ötesinden evrene hiçbir bilgi veya foton geri sızamaz.',
      'Genel Görelilik uyarınca güçlü bir kütleçekim alanında saatler daha yavaş işler. Olay ufkuna doğru düşen bir astronotun kolundaki saat dışarıdaki gözlemciye göre giderek yavaşlar ve ufuk çizgisine ulaştığı anda sonsuzluğa doğru donmuş gibi görünür.'
    ],
    howToTitle: 'Kara Delik Simülasyonu Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'Yığılma Diskini Gözleyin', desc: 'Kara deliğe doğru spiral çizen plazma sürtünmeyle milyonlarca dereceye ısınarak X-ışınları yayar.' },
      { step: '02', title: 'Kütleçekimsel Mercekleme', desc: 'Kara deliğin arkasındaki yıldızların ışığı bükülerek Einstein halkaları ve çift görüntüler oluşturur.' },
      { step: '03', title: 'Gelgit Kuvvetlerini İnceleyin', desc: 'Ayaklarınıza uygulanan çekim kuvveti başınıza uygulanandan kat kat fazla olduğu için cisimler uzayarak "spagettileşir".' }
    ],
    factsTitle: 'Kara Delik Parametreleri',
    facts: [
      { label: 'Schwarzschild Yarıçapı', value: 'r_s = 2GM / c²', desc: 'Dünya için ~9 mm, Güneş için ~3 km' },
      { label: 'Yay A* (Galaksi Merkezi)', value: '4.3 Milyon M☉', desc: 'Samanyolu merkezindeki süper kütleli kara delik' },
      { label: 'M87* (İlk Fotoğraf)', value: '6.5 Milyar M☉', desc: 'Event Horizon Telescope ile görüntülenen dev' },
      { label: 'Hawking Işıması', value: 'Kuantum Buharlaşması', desc: 'Sanal parçacık çiftlerinin ufukta ayrılması' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Güneş şu an aniden bir kara deliğe dönüşseydi Dünya’yı yutmazdı; kütlesi aynı kaldığı için Dünya aynı yörüngede dönmeye devam eder, yalnızca evren zifiri karanlığa bürünürdü.',
      'Dönen kara deliklerin (Kerr kara delikleri) çevresinde uzay-zaman dokusunun girdap gibi sürüklendiği "ergosfer" adı verilen bir bölge bulunur.'
    ]
  },

  'ansiklopedi/hohmann-transferi': {
    kicker: 'Yörünge Mekaniği',
    title: 'Hohmann Transfer Yörüngesi',
    serif: 've en verimli gezegenler arası rota',
    summary: 'Walter Hohmann tarafından 1925’te tasarlanan en az yakıt (delta-v) tüketimli eliptik transfer manevrası ve fırlatma pencereleri.',
    intro: [
      'Uzayda iki gezegen arasında seyahat etmek doğrusal bir roket ateşiyle mümkün değildir; zira uzay araçları Güneş’in devasa kütleçekim kuyusunda yörüngede dolanırlar. Bir gezegenden diğerine gitmek, aracın yörüngesini eliptik olarak genişletmeyi gerektirir.',
      'Alman mühendis Walter Hohmann tarafından keşfedilen bu manevra, iki dairesel yörünge arasında teğet geçen eliptik bir ara yörünge kurar. Bu rotada yalnızca iki kısa motor ateşlemesi (Δv₁ ve Δv₂) yapılır; yolculuğun geri kalanı serbest balistik süzülmeyle geçer.',
      'Dünya’dan Mars’a yapılan yolculuklar için Dünya ve Mars’ın Güneş çevresindeki açısal konumlarının tam hizalanması gerekir. Bu "fırlatma penceresi" yaklaşık 26 ayda (780 günde) bir açılır ve transfer yaklaşık 8.5 ay sürer.'
    ],
    howToTitle: 'Manevra Aşamaları',
    howTo: [
      { step: '01', title: 'Ayrılma İtmesi (Δv₁)', desc: 'Dünya yörüngesindeki araç hareket yönünde hızlanarak günöte noktası Mars yörüngesine değen bir elipse girer.' },
      { step: '02', title: 'Serbest Balistik Uçuş', desc: 'Güneş etrafında yarım elips boyunca yakıtsız, yalnızca yerçekimi etkisiyle hedefe doğru süzülür.' },
      { step: '03', title: 'Yakalama İtmesi (Δv₂)', desc: 'Mars’a varıldığında gezegenin çekimine yakalanmak ve hızları eşitlemek için ikinci itme uygulanır.' }
    ],
    factsTitle: 'Dünya - Mars Transfer Verileri',
    facts: [
      { label: 'Kalkış Δv₁', value: '~3.6 km/s', desc: 'Alçak Dünya yörüngesinden kaçış itmesi' },
      { label: 'Varış Δv₂', value: '~2.1 km/s', desc: 'Mars yörüngesine giriş frenlemesi' },
      { label: 'Uçuş Süresi', value: '~259 Gün (8.5 Ay)', desc: 'Güneş çevresinde kat edilen yarım elips' },
      { label: 'Sinodik Periyot', value: '780 Gün (26 Ay)', desc: 'İdeal fırlatma pencereleri arasındaki bekleme' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Dış gezegenlere (Jüpiter, Satürn) giden Voyager ve Cassini gibi sondalar, yalnızca yakıtla gidemeyecekleri için gezegenlerin kütleçekiminden hız çalarak "kütleçekim sapanı" (Gravity Assist) kullanmıştır.',
      'Daha hızlı gitmek mümkündür ancak roket denklemine (Tsiolkovsky) göre hız artışı için gereken yakıt miktarı katlanarak büyür.'
    ]
  },

  'ansiklopedi/kutlecekim-dalgalari': {
    kicker: 'LIGO Astrofiziği',
    title: 'Kütleçekim Dalgaları ve Uzay-Zaman Titreşimi',
    serif: 've lazer interferometrisi',
    summary: 'Einstein’ın 1916’da öngördüğü, 2015’te LIGO tarafından ilk kez tespit edilen çarpışan kara deliklerin uzay-zamandaki dalgalanmaları.',
    intro: [
      'Einstein’ın Genel Görelilik kuramı, ivmelenen dev kütlelerin uzay-zaman dokusunda ışık hızıyla yayılan dalgalanmalar yaratacağını öngörmüştü. Ancak bu dalgalanmalar öylesine zayıftır ki evrenin en şiddetli olayları bile Dünya’da mikroskobik boyutlarda hissedilir.',
      '14 Eylül 2015’te LIGO (Laser Interferometer Gravitational-Wave Observatory), 1.3 milyar ışık yılı uzakta birbiriyle birleşen iki kara deliğin yarattığı GW150914 sinyalini kaydetti. Bu keşif, insanlığa evreni izlemek için ışıktan bağımsız yepyeni bir "işitme" duyusu kazandırdı.',
      'LIGO, birbirine dik 4 kilometrelik iki vakum tüpünde lazer ışınlarını aynalar arasında yüzlerce kez yansıtarak mesafedeki değişimi ölçer. Ölçülen mesafe değişimi bir proton çapının on binde birinden (10⁻¹⁸ m) bile daha küçüktür.'
    ],
    howToTitle: 'Sinyal ve Simülatör Analizi',
    howTo: [
      { step: '01', title: 'İç Spiral (Inspiral) Evresi', desc: 'İki gök cismi birbirinin çevresinde dönerken dalga yayarak enerji kaybeder ve birbirine yaklaşır.' },
      { step: '02', title: 'Birleşme ve Cıvıltı (Chirp)', desc: 'Dönüş hızı saniyede yüzlerce tura çıkar; frekans ve genlik zirveye ulaşarak karakteristik cıvıltı sesini üretir.' },
      { step: '03', title: 'Durulma (Ringdown)', desc: 'Yeni oluşan tekil kara delik kusursuz bir küreye dönüşürken hızla sönümlenen dalgalar yayar.' }
    ],
    factsTitle: 'Ölçüm Hassasiyetleri',
    facts: [
      { label: 'Ölçülen Esneme (Strain h)', value: '~10⁻²¹', desc: '4 kilometrelik kolda atom çekirdeğinden küçük sapma' },
      { label: 'İlk Sinyal (GW150914)', value: '36 + 29 Güneş Kütlesi', desc: '3 Güneş kütlesi enerji saf dalgaya dönüştü' },
      { label: 'Yayılma Hızı', value: 'c (Işık Hızı)', desc: 'Kütleçekim dalgaları ışıkla tam aynı hızda ilerler' },
      { label: 'Gözlemevleri', value: 'LIGO, Virgo, KAGRA', desc: 'Üçgenleme yöntemiyle gökyüzündeki yönü bulur' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'GW150914 birleşmesinin son saniyesinin kesrinde açığa çıkan kütleçekimsel güç, gözlemlenebilir evrendeki tüm yıldızların yaydığı toplam ışıktan daha fazlaydı.',
      'Nötron yıldızı birleşmesi tespit edildiğinde (GW170817), evrendeki altın, platin ve uranyum gibi ağır elementlerin büyük kısmının bu çarpışmalarda üretildiği doğrulanmıştır.'
    ]
  },

  'ansiklopedi/kozmik-arka-plan': {
    kicker: 'Kozmoloji',
    title: 'Planck Kozmik Mikrodalga Arka Planı (CMB)',
    serif: 've evrenin ilk bebeklik fotoğrafı',
    summary: 'Büyük Patlama’dan 380.000 yıl sonra serbest kalan 2.73 Kelvin fosil ışıma ve Planck uydusuyla haritalanan kuantum dalgalanmaları.',
    intro: [
      'Büyük Patlama’nın ilk anlarında evren öylesine sıcak ve yoğundu ki elektronlar ile protonlar birleşemiyordu. Serbest elektron denizinde fotonlar sürekli saçılıyor, evren opak bir sis tabakası gibi davranıyordu.',
      'Patlamadan yaklaşık 380.000 yıl sonra sıcaklık 3.000 Kelvin’e düştüğünde elektronlar protonlarla birleşerek ilk hidrojen atomlarını oluşturdu ("Yeniden Birleşme" / Rekombinasyon). Işık serbest kaldı ve evren aniden saydamlaştı.',
      '13.8 milyar yıllık evren genişlemesi bu ilk ışığın dalgaboyunu gererek mikrodalga bölgesine taşıdı. Bugün gökyüzünün her yönünden eşit gelen bu fosil ışıma 2.7255 Kelvin (-270.4°C) sıcaklıktadır ve evrenin en eski bebeklik haritasıdır.'
    ],
    howToTitle: 'Planck Haritası Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'Sıcaklık Lekeleri (Anizotropi)', desc: 'Mavi (biraz daha soğuk) ve kırmızı (biraz daha sıcak) lekeler Kelvin’in yüz binde biri mertebesindedir.' },
      { step: '02', title: 'Kozmik Tohumlar', desc: 'Bu minik sıcaklık farkları, erken evrendeki kuantum dalgalanmalarının bugünkü galaksi kümelerine dönüşen tohumlarıdır.' },
      { step: '03', title: 'Evrenin Geometrisi', desc: 'Lekelerin açısal boyut dağılımı (güç spektrumu), uzayın geometrisinin binde bir hassasiyetle "düz" olduğunu kanıtlar.' }
    ],
    factsTitle: 'Kozmolojik Parametreler (Planck 2018)',
    facts: [
      { label: 'CMB Sıcaklığı', value: '2.7255 ± 0.0006 K', desc: 'Evrenin ortalama mutlak fon sıcaklığı' },
      { label: 'Karanlık Enerji', value: '%68.3', desc: 'Evrenin hızlanarak genişlemesini sağlayan güç' },
      { label: 'Karanlık Madde', value: '%26.8', desc: 'Işık yaymayan görünmez kütleçekim iskeleti' },
      { label: 'Normal Madde (Baryonik)', value: '%4.9', desc: 'Yıldızlar, gezegenler ve biz' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      '1965 yılında Arno Penzias ve Robert Wilson, antenlerindeki silinmeyen mikrodalga gürültüsünü araştırırken CMB’yi tesadüfen keşfetmiş ve bu buluşlarıyla Nobel Fizik Ödülü almışlardır.',
      'CMB haritası, evrenin yaşının 13.787 milyar yıl olduğunu ve Hubble genişleme hızını %1’den daha yüksek bir hassasiyetle hesaplamamızı sağlamıştır.'
    ]
  },

  // ==========================================
  // ASTROLOJİ
  // ==========================================
  'astroloji/dogum-haritasi': {
    kicker: 'Doğum & Gökyüzü Geometrisi',
    title: 'Doğum Haritası ve Fasetleri',
    serif: 'güneş, ay, yükselen ve evler',
    summary: 'Doğum anında ufuk çizgisi ve meridyene göre gökyüzünün dondurulmuş geometrik izdüşümü; 12 ev, temel açılar ve arketipler.',
    intro: [
      'Doğum haritası (Natal Harita), bir bireyin doğduğu tam tarih, saat ve coğrafi koordinatta gökyüzünün Dünya merkezli bir projeksiyonudur. 360 derecelik zodyak dairesi 12 burç ve 12 astrolojik eve bölünür.',
      'Astrolojik kişiliğin omurgasını "Kozmik Üçlü" oluşturur: Güneş temel bilinçli benliği, iradeyi ve yaşam amacını simgeler; Ay duygusal ihtiyaçları, bilinçaltı tepkilerini ve içsel güvenliği yönetir; Yükselen Burç (Ascendant) ise doğum anında doğu ufkunda yükselen burç olup dış dünyaya yansıtılan maskeyi ve yaşam perspektifini belirler.',
      'Gezegenlerin birbirleriyle oluşturduğu açısal ilişkiler (kavuşum 0°, sekstil 60°, kare 90°, üçgen 120°, karşıt 180°) psişik enerjinin uyumlu mu yoksa dinamik bir gerilimle mi akacağını gösterir.'
    ],
    howToTitle: 'Doğum Haritası Nasıl Okunur?',
    howTo: [
      { step: '01', title: 'Yükselen Burcu (ASC) Saptayın', desc: '1. evin başlangıç çizgisi olan Yükselen, haritanın tüm diğer 11 evinin sıralamasını belirleyen anahtardır.' },
      { step: '02', title: 'Güneş ve Ay Dengesi', desc: 'Güneş’in elementi (ateş, toprak, hava, su) ile Ay’ın elementi arasındaki etkileşimi analiz edin.' },
      { step: '03', title: 'Açı Ağını İnceleyin', desc: 'Mavi çizgiler (üçgen ve sekstil) doğal yetenekleri, kırmızı çizgiler (kare ve karşıt) ise aşılması gereken sınavları temsil eder.' }
    ],
    factsTitle: 'Açı Türleri ve Anlamları',
    facts: [
      { label: 'Kavuşum (0°)', value: 'Güçlü Birleşim', desc: 'İki arketipin enerjisi iç içe geçer' },
      { label: 'Sekstil (60°)', value: 'Fırsat & Akış', desc: 'Uyumlu elementler arası yaratıcı destek' },
      { label: 'Kare (90°)', value: 'Dinamik Sürtünme', desc: 'Harekete geçiren içsel gerilim ve mücadele' },
      { label: 'Üçgen (120°)', value: 'Doğal Yetenek', desc: 'Aynı element grubunda zahmetsiz harmoni' },
      { label: 'Karşıt (180°)', value: 'Kutup Farkındalığı', desc: 'İki uç arasında denge kurma zorunluluğu' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Doğum saatinin 4 dakika bile farklı olması, Yükselen burç derecesini yaklaşık 1 derece kaydırır ve ev çizgilerini değiştirebilir.',
      'Carl Gustav Jung, analitik psikolojide astrolojik sembolleri antik insanlığın kolektif bilinçdışının yansıttığı arketipik projeksiyonlar olarak değerlendirmiştir.'
    ]
  },

  'astroloji/sinastri': {
    kicker: 'İlişki Astrofiziği',
    title: 'Sinastri ve Harita Karşılaştırması',
    serif: 've iki ruhun çekim kimyası',
    summary: 'İki bireysel doğum haritasının üst üste bindirilerek gezegen kontakları, element uyumları ve karmik bağların analiz edilmesi.',
    intro: [
      'Sinastri (Synastry), iki ayrı bireyin doğum haritalarını üst üste koyarak aralarındaki çekim dinamiklerini, iletişim uyumunu ve potansiyel çatışma alanlarını inceleyen kadim ilişki astrolojisidir.',
      'İlişkideki duygusal rezonans Güneş ve Ay temaslarıyla kurulur. Bir kişinin Güneş’i diğerinin Ay’ı ile kavuştuğunda veya üçgen açı yaptığında doğal bir ruh ikizi hissi ve derin kabulleniş oluşur. Tutku ve romantik çekim ise Venüs ile Mars arasındaki açılarla ateşlenir.',
      'Uzun vadeli kalıcılık ve evlilik potansiyeli ise Satürn temaslarına bağlıdır. Satürn kontakları sorumluluk ve sadakat getirirken, aşırı baskı ve soğukluk riskini de beraberinde taşır.'
    ],
    howToTitle: 'Sinastri Haritası İnceleme Adımları',
    howTo: [
      { step: '01', title: 'Güneş - Ay Temasları', desc: 'Eril ve dişil bilinç arketiplerinin birbiriyle nasıl anlaştığını kontrol edin.' },
      { step: '02', title: 'Venüs - Mars Dinamiği', desc: 'Romantik beklentiler ile cinsel ve fiziksel enerjinin çekim gücünü tartın.' },
      { step: '03', title: 'Ev Yerleşimleri (Overlays)', desc: 'Partnerinizin gezegenlerinin sizin hangi yaşam alanlarınıza (7. ev evlilik, 4. ev yuva, 8. ev tutku) düştüğüne bakın.' }
    ],
    factsTitle: 'Kilit Sinastri Fasetleri',
    facts: [
      { label: 'Güneş - Ay Kavuşumu', value: 'Ruh Eşi İmzası', desc: 'Zahmetsiz duygusal ve bilinçli bütünleşme' },
      { label: 'Venüs - Mars Üçgeni', value: 'Manyetik Çekim', desc: 'Romantik ve fiziksel yüksek uyum' },
      { label: 'Merkür Kontakları', value: 'Zihinsel Diyalog', desc: 'Düşüncelerin akıcı paylaşımı ve mizah' },
      { label: 'Satürn Bağları', value: 'Karmik Kalıcılık', desc: 'İlişkiyi zor zamanlarda bir arada tutan tutkal' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Hiçbir "kötü" açı içeren sinastri haritası ilişkinin biteceği anlamına gelmez; kare açılar çoğu zaman en tutkulu ve dönüştürücü büyümeyi tetikleyen katalizörlerdir.',
      'Kompozit (Composite) harita, iki kişinin haritasının orta noktalarından tek bir "üçüncü varlık olarak ilişki" haritası çıkaran tamamlayıcı bir tekniktir.'
    ]
  },

  'astroloji/burc-uyumu': {
    kicker: 'Element ve Nitelik Simyası',
    title: 'Burç Uyumu ve Element Dengesi',
    serif: 'ateş, toprak, hava ve su',
    summary: 'Dört elementin kadim kimyası ve üç niteliğin (öncü, sabit, değişken) birbiriyle yarattığı rezonans ve sürtünme analizi.',
    intro: [
      'Zodyak çarkındaki on iki burç dört temel elemente ayrılır: Ateş (Koç, Aslan, Yay), Toprak (Boğa, Başak, Oğlak), Hava (İkizler, Terazi, Kova) ve Su (Yengeç, Akrep, Balık). Burç uyumu bu elementlerin birbirini nasıl beslediği veya tükettiğiyle başlar.',
      'Ateş ve Hava birbirini alevlendirir; fikirler (hava) eyleme ve coşkuya (ateş) dönüşür. Toprak ve Su ise birbirini besler; duygular (su) somut güvene ve berekete (toprak) kök salar. Buna karşılık Ateş-Su (buharlaşma/sönme) veya Toprak-Hava (toz bulutu) ilişkileri daha fazla çaba ve denge gerektirir.',
      'Ayrıca burçların nitelikleri de etkileşimi şekillendirir: Öncü burçlar başlatır ve liderlik ister; Sabit burçlar kararlılıkla korur ve inatçıdır; Değişken burçlar ise uyum sağlar ve esnektir.'
    ],
    howToTitle: 'Element ve Nitelik Tablosunu Okuma',
    howTo: [
      { step: '01', title: 'Element Uyumluluğunu Tartın', desc: 'Ateş-Hava veya Toprak-Su kombinasyonları doğal akış sağlar; çapraz elementler bilinçli adaptasyon ister.' },
      { step: '02', title: 'Nitelik Çatışmasını Önleyin', desc: 'İki sabit burç (ör. Boğa ve Akrep) inatlaşabilir; öncü burçlar güç savaşına girebilir.' },
      { step: '03', title: 'Tamamlayıcı Zıtlıkları Görün', desc: 'Zodyakta tam 180° karşıt duran burçlar (ör. Koç-Terazi) birbirlerinin eksik yarısını tamamlar.' }
    ],
    factsTitle: 'Element Sinerjileri',
    facts: [
      { label: 'Ateş + Hava', value: 'Yüksek Enerji & Vizyon', desc: 'Tutku ve zeka birbirini besler' },
      { label: 'Toprak + Su', value: 'Derin Güven & Köklenme', desc: 'Duygusal bağlılık ve pratik sadakat' },
      { label: 'Ateş + Su', value: 'Yoğun Tutku & Duygu Fırtınası', desc: 'Sıcaklık ve hassasiyet dengesi gerekir' },
      { label: 'Toprak + Hava', value: 'Akıl & Madde Dengesi', desc: 'Fikirleri somutlaştırma odağı' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Popüler kültürün aksine yalnızca Güneş burçlarının uyumu tek başına yeterli değildir; haritadaki Ay ve Venüs elementleri ilişkide çok daha belirleyicidir.',
      'Aynı burçtan iki kişinin ilişkisi birbirini çok iyi anlama avantajı sağlarken, aynı kör noktalara sahip olma riski barındırır.'
    ]
  },

  'astroloji/tarot': {
    kicker: 'Hermetik Kehanet & Arketipler',
    title: 'Kozmik Tarot Açılımı',
    serif: '22 majör arkana ve açılımlar',
    summary: 'Deli’nin (0) masumiyetinden Dünya’nın (XXI) tamamlanışına Carl Jung’ın arketipsel bilinç yolculuğu ve 3 kartlık açılım geometrisi.',
    intro: [
      'Tarot, 15. yüzyıl Rönesans İtalya’sından günümüze uzanan zengin bir sembolizm, hermetik felsefe ve arketip sistemidir. Destedeki 22 Majör Arkana (Büyük Sırlar), insanın ruhsal gelişim döngüsünü "Deli’nin Yolculuğu" adı verilen kronolojik bir evrimle anlatır.',
      'Kartlar geleceği mutlak bir kader olarak dikte etmez; psişik durumunuzu, bilinçaltı eğilimlerinizi ve önünüzdeki olasılık dalgalarını sembolik bir ayna gibi yansıtır. Düz gelen kartlar arketipin yapıcı ve saf enerjisini, ters gelen kartlar ise içsel tıkanıklığı veya aşırıya kaçan uyarıyı gösterir.',
      'Kozmik Üçlü açılımı (Geçmiş - Şimdi - Gelecek) olayların nedensellik bağını çözmek için en berrak yöntemdir. Keltik Çaprazı derinleşmek için, Karar Terazisi ise iki yol arasında seçim yapmak için kullanılır.'
    ],
    howToTitle: 'Tarot Açılımı Nasıl Yorumlanır?',
    howTo: [
      { step: '01', title: 'Zihninizi Odaklayın', desc: 'Açılıma başlamadan önce cevabını aradığınız meseleyi net ve tarafsız bir niyetle zihninizde tutun.' },
      { step: '02', title: 'Pozisyonun Anlamına Sadık Kalın', desc: 'Kartın genel anlamını pozisyonun bağlamıyla (ör. Geçmiş kökleri, Şimdi mevcut durum, Gelecek potansiyel sonuç) birleştirin.' },
      { step: '03', title: 'Sembolik Diyaloğu Okuyun', desc: 'Kartlardaki renkler, astrolojik gezegenler ve element dengeleri arasındaki ortak temaları yakalayın.' }
    ],
    factsTitle: 'Majör Arkana Yolculuğu Eşikleri',
    facts: [
      { label: '0 Deli (The Fool)', value: 'Saf Başlangıç', desc: 'Uranüs · Bilinmeyene atılan cesur adım' },
      { label: 'X Kader Çarkı', value: 'Kozmik Döngü', desc: 'Jüpiter · Kaçınılmaz talih ve değişim' },
      { label: 'XVI Yıkılan Kule', value: 'Ani Uyanış', desc: 'Mars · İllüzyonların ve sahte yapıların çöküşü' },
      { label: 'XXI Dünya (The World)', value: 'Tamamlanma & Bütünlük', desc: 'Satürn · Büyük döngünün zaferle kapanışı' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Psikanalizin kurucularından Carl Jung, Tarot kartlarını "arketipsel durumların resimli temsilleri" olarak görmüş ve aktif imgeleme terapisinde kullanmıştır.',
      'Majör arkanadaki "Ölüm" (XIII) kartı fiziksel ölümü değil; eski bir dönemin kapanıp yeni bir benliğin filizlendiği radikal bir dönüşümü simgeler.'
    ]
  },

  'astroloji/gunluk-burc': {
    kicker: 'Günlük Kozmik Nabız',
    title: 'Günün Gökyüzü ve Burç Radarı',
    serif: 've yaşam enerjisi fasetleri',
    summary: 'Günün Ay fazı, yönetici gezegen günleri ve 12 burç için aşk, kariyer ve enerji düzeylerini haritalayan canlı radar.',
    intro: [
      'Günlük burç yorumları statik fallardan ibaret değildir; gökyüzündeki gezegenlerin doğum anınızdaki burç derecenizle kurduğu geçici açıların (transitlerin) günlük yaşam dinamiklerine tercümesidir.',
      'Günün genel havasını en çok etkileyen gök cismi Ay’dır. Ay yaklaşık 2.5 günde bir burç değiştirir. Ay Koç’tayken aceleci ve cesur adımlar öne çıkarken, Ay Boğa’ya geçtiğinde sakinlik, haz ve finansal güvenlik odak noktası haline gelir.',
      'Haftanın her günü kadim gelenekte yedi görünür gezegenden biri tarafından yönetilir: Pazartesi Ay günü (duygusal), Salı Mars günü (aksiyon), Çarşamba Merkür günü (iletişim), Perşembe Jüpiter günü (bereket), Cuma Venüs günü (aşk/estetik), Cumartesi Satürn günü (disiplin) ve Pazar Güneş günüdür (yaşam sevinci).'
    ],
    howToTitle: 'Günlük Radarı Kullanma',
    howTo: [
      { step: '01', title: 'Hem Güneş Hem Yükselen Burcunuzu Okuyun', desc: 'Gündelik olayların hangi yaşam alanında tetikleneceğini anlamak için özellikle Yükselen burcunuzu okumalısınız.' },
      { step: '02', title: 'Enerji Çubuklarını İnceleyin', desc: 'Aşk, kariyer ve zindelik ibreleri günün transitlerinin burcunuzun elementine yaptığı açıları yansıtır.' },
      { step: '03', title: 'Günün Gezegen Yönetici İpucunu Alın', desc: 'Önemli toplantıları Merkür saatine, dinlenmeyi Venüs veya Ay saatine denk getirmeye özen gösterin.' }
    ],
    factsTitle: 'Gezegen Günleri ve Temaları',
    facts: [
      { label: 'Pazartesi (Ay)', value: 'İçsel Sezgi & Aile', desc: 'Duygusal yenilenme ve niyet' },
      { label: 'Salı (Mars)', value: 'Girişim & Cesaret', desc: 'Zorlu işleri başlatma enerjisi' },
      { label: 'Çarşamba (Merkür)', value: 'Müzakere & Yazı', desc: 'Anlaşmalar ve zihinsel projeler' },
      { label: 'Cuma (Venüs)', value: 'Sanat & Romantizm', desc: 'Güzellik, sosyal buluşmalar ve keyif' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'İngilizce ve birçok Batı dilindeki gün adları doğrudan bu gezegenlerden gelir: Monday (Moon-day), Tuesday (Tiw/Mars), Wednesday (Woden/Merkür), Friday (Freya/Venüs), Sunday (Sun-day).',
      'Yükselen burcunuz günlük transitlerin hangi evinizi aydınlattığını belirlediği için profesyonel astrologlar günlük tahminlerde her zaman Yükselen’i baz alır.'
    ]
  },

  'astroloji/yildiz-fali': {
    kicker: 'Keldani Gezegen Saatleri',
    title: 'Eşit Olmayan Gezegen Saatleri',
    serif: 've kraliyet yıldızları',
    summary: 'Gündoğumundan günbatımına 12 gündüz ve 12 gece dilimiyle hesaplanan Keldani gezegen saatleri ve dört kraliyet yıldızı.',
    intro: [
      'Kadim Babil ve İskenderiye astronomisinde zaman modern 60 dakikalık eşit saatlerle değil, gün ışığının döngüsüne göre bölünürdü. Gündoğumu ile günbatımı arası 12 eşit gündüz saatine; günbatımından ertesi gündoğumuna kadar olan süre ise 12 eşit gece saatine bölünür.',
      'Mevsime göre bu saatlerin uzunluğu 45 dakika ile 75 dakika arasında değişir. Her saatin yöneticisi Keldani sırasına (Satürn, Jüpiter, Mars, Güneş, Venüs, Merkür, Ay) göre belirlenir. Günün ilk saati o günün yönetici gezegenine aittir.',
      'Ayrıca gökyüzünün dört bir köşesini bekleyen "Kraliyet Yıldızları" (Aldebaran Doğu, Regulus Kuzey, Antares Batı, Fomalhaut Güney) büyük kader döngülerinin ve ahlaki sınavların kozmik işaretçileridir.'
    ],
    howToTitle: 'Gezegen Saatleri Çizelgesini Kullanma',
    howTo: [
      { step: '01', title: 'Gündoğumu Referansını Alın', desc: 'İlk saat yerel gündoğumu anında başlar; kışın gündüz saatleri kısa, yazın uzundur.' },
      { step: '02', title: 'Eyleminizi Gezegene Uydurun', desc: 'Sözleşmeler için Merkür saati, cesaret için Mars saati, finans ve büyüme için Jüpiter saati tercih edilir.' },
      { step: '03', title: 'Satürn Saatlerinde Sakin Kalın', desc: 'Satürn saatleri yeni başlangıçlar için değil; iç gözlem, tefekkür ve sabır gerektiren disiplinli çalışmalar içindir.' }
    ],
    factsTitle: 'Dört Kraliyet Yıldızı (Kozmik Muhafızlar)',
    facts: [
      { label: 'Aldebaran (Doğu)', value: 'Boğa’nın Gözü · Dürüstlük', desc: 'Büyük başarı vaat eder; dürüstlük sınavı getirir' },
      { label: 'Regulus (Kuzey)', value: 'Aslan’ın Kalbi · İntikamdan Kaçış', desc: 'Liderlik ve şan getirir; intikam ararsa düşürür' },
      { label: 'Antares (Batı)', value: 'Akrep’in Kalbi · Obsesyondan Kaçış', desc: 'Dönüşüm gücü; aşırı hırs yıkım getirebilir' },
      { label: 'Fomalhaut (Güney)', value: 'Güney Balığı · İdealizm', desc: 'Sanatsal ve ruhsal ilham; maddi hırsa kapılmama' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Orta Çağ ve Rönesans hekimleri ameliyat ve şifalı ot toplama zamanlarını Keldani gezegen saatlerine göre titizlikle planlarlardı.',
      'Kraliyet yıldızları antik Pers astronomisinde gökyüzünün dört yönünü bekleyen dört başmelek veya kozmik bekçi olarak kabul edilirdi.'
    ]
  },

  'astroloji/transitler': {
    kicker: 'Efemeris Dinamiği',
    title: 'Canlı Efemeris ve Gökyüzü Transitleri',
    serif: 've gezegen döngüleri',
    summary: 'NASA JPL efemeris verileriyle anlık gezegen dereceleri, burç geçişleri ve kişisel haritayı tetikleyen kozmik dalgalar.',
    intro: [
      'Efemeris (Ephemeris), gök cisimlerinin belirli zaman aralıklarında gökyüzündeki kesin koordinatlarını veren astronomik tablolardır. Astroloji bu tabloları kullanarak gökyüzünün şu anki durumunun doğum haritanızla kurduğu teması (transitleri) inceler.',
      'Hızlı hareket eden iç gezegenler (Güneş, Merkür, Venüs, Mars) birkaç günlük veya haftalık geçici ruh hallerini ve olayları tetiklerken; yavaş hareket eden dış gezegenler (Jüpiter, Satürn, Uranüs, Neptün, Plüton) yıllara yayılan köklü dönüşüm dönemlerini yönetir.',
      'Örneğin Satürn’ün doğum haritanızdaki konumuna geri dönmesi ("Satürn Döngüsü" - yaklaşık 29.5 yılda bir), bireyin olgunlaşma, yetişkin sorumluluklarını üstlenme ve hayatının temel taşlarını yeniden kurma eşiğidir.'
    ],
    howToTitle: 'Canlı Transitleri Takip Etme',
    howTo: [
      { step: '01', title: 'Hızlı Gezegenlerin Burçlarını İzleyin', desc: 'Merkür ve Venüs’ün burç değiştirmesi o haftanın zihinsel ve ilişkisel tonunu belirler.' },
      { step: '02', title: 'Durağanlaşan Gezegenlere Dikkat Edin', desc: 'Geri harekete (retro) başlamak üzere durağanlaşan (stationary) gezegenlerin enerjisi haritada çok yoğun hissedilir.' },
      { step: '03', title: 'Kritik Dereceleri Not Edin', desc: '0 derece (burca yeni giriş) ve 29 derece (anaretik kriz derecesi) gezegenlerin en vurgulu enerjiler yaydığı sınırlardır.' }
    ],
    factsTitle: 'Gezegenlerin Zodyak Turu Süreleri',
    facts: [
      { label: 'Ay', value: '27.3 Gün', desc: 'Her burçta yaklaşık 2.5 gün kalır' },
      { label: 'Merkür / Venüs', value: '~1 Yıl', desc: 'Güneş’e yakın seyrederler' },
      { label: 'Mars', value: '2 Yıl', desc: 'Aksiyon ve irade döngüsü' },
      { label: 'Jüpiter', value: '12 Yıl', desc: 'Her burçta yaklaşık 1 yıl kalır' },
      { label: 'Satürn', value: '29.5 Yıl', desc: 'Her burçta yaklaşık 2.5 yıl' },
      { label: 'Plüton', value: '248 Yıl', desc: 'Kuşakları dönüştüren derin metamorfoz' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Gökbilimciler gezegenlerin yörüngelerini tahmin etmek için JPL Horizons efemerisini kullanır; sitemizdeki canlı transitler bu hassas matematiksel efemeristen türetilir.',
      'Astrolojik çağlar (örneğin Balık Çağı’ndan Kova Çağı’na geçiş), ekinoks noktasının presesyon nedeniyle burçları tersten kat etmesiyle (her çağ yaklaşık 2.160 yıl) tanımlanır.'
    ]
  },

  'astroloji/ay-evreleri': {
    kicker: 'Sinodik Döngü & Ritim',
    title: 'Sekiz Ay Evresi ve Boşluktaki Ay (VoC)',
    serif: 've kozmik niyet takvimi',
    summary: '29.53 günlük sinodik ay döngüsü, sekiz ışık evresi ve Ay’ın burç değiştirmeden önceki temel açısızlık dönemi (Void of Course).',
    intro: [
      'Ay, Dünya etrafında dönerken Güneş’e göre konumu sürekli değişir. Ay kendi ışığını üretmediği için Güneş tarafından aydınlatılan yarıküresinin Dünya’dan görünen açısı değişir; bu döngüye "Sinodik Ay" denir ve tam 29.53 gün sürer.',
      'Bu döngü sekiz evreden oluşur: Yeni Ay (tohum ekme), Hilal (filizlenme), İlk Dördün (kararlılık/mücadele), Büyüyen Ay (olgunlaşma), Dolunay (hasat/farkındalık zirvesi), Küçülen Ay (paylaşım), Son Dördün (bırakma/affetme) ve Balzamik Ay (arခınma/dinlenme).',
      'Boşluktaki Ay (Void of Course / VoC), Ay’ın bulunduğu burçtan ayrılmadan önce diğer ana gezegenlerle yapacağı son temel açıyı tamamladıktan sonra bir sonraki burca geçene kadar geçen süredir. Bu aralıkta başlayan somut işler genellikle beklenmedik yöne evrilir.'
    ],
    howToTitle: 'Ay Ritimlerine Göre Yaşam Rehberi',
    howTo: [
      { step: '01', title: 'Yeni Ay’da Niyet Belirleyin', desc: 'Karanlık gökyüzü yeni başlangıçlar için zihinsel tohum atma zamanıdır; somut eylemler için ilk hilalin görünmesini bekleyin.' },
      { step: '02', title: 'Dolunay’da Hasat ve Kapanış', desc: 'Duyguların tepe yaptığı dolunayda gizli kalanlar açığa çıkar; gerilimleri sakinlikle karşılayın ve affedin.' },
      { step: '03', title: 'Boşluktaki Ay’da İçe Dönün', desc: 'VoC pencerelerinde önemli sözleşmelere imza atmayın; rutin işler, temizlik ve meditasyon için değerlendirin.' }
    ],
    factsTitle: 'Ay Döngüsü Verileri',
    facts: [
      { label: 'Sinodik Ay', value: '29 Gün 12 Saat 44 Dk', desc: 'Bir yeniaydan sonraki yeniaya kadar geçen süre' },
      { label: 'Yıldız Ayı (Sidereal)', value: '27.32 Gün', desc: 'Yıldızlara göre bir tam yörünge turu' },
      { label: 'Süper Ay', value: '%14 Daha Büyük', desc: 'Ay’ın yerberi (perigee) noktasında dolunay olması' },
      { label: 'Gelgit (Med-Cezir)', value: 'Günde 2 Kez', desc: 'Ay ve Güneş kütleçekiminin okyanusları çekmesi' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Ay Dünya’ya kütleçekimsel olarak kilitlenmiştir (tidal locking); kendi ekseni etrafında dönüş süresiyle Dünya çevresindeki turu eşit olduğu için Dünya’dan daima aynı yüzünü görürüz.',
      'Aynı takvim ayı içinde gerçekleşen ikinci dolunaya popüler kültürde "Mavi Ay" (Blue Moon) adı verilir.'
    ]
  },

  'astroloji/retrolar': {
    kicker: 'Görünür Geri Hareket',
    title: 'Gezegen Retroları ve Gölge Periyotları',
    serif: 've optik yanılsamanın ardındaki anlam',
    summary: 'Dünya’nın diğer gezegenleri yörüngede sollamasıyla oluşan optik geri hareket yanılsaması, pre/post gölge dereceleri ve iç gözlem.',
    intro: [
      'Güneş Sistemi’ndeki hiçbir gezegen uzayda aniden yön değiştirip geriye doğru gitmez. Retrograd (geri hareket), Dünya’nın kendi yörüngesinde dönerken iç veya dış gezegenleri "sollaması" sonucu Dünya’dan bakıldığında gökyüzünde arka plandaki yıldızlara göre tersine gidiyormuş gibi görünmesidir.',
      'Tıpkı otoyolda hızla yanından geçtiğiniz bir trenin pencereden bakıldığında geriye gidiyor gibi görünmesi gibi, bu hareket tamamen bir perspektif etkisidir.',
      'Astrolojik gelenekte bu optik yavaşlama ve geri çekilme, gezegenin temsil ettiği temaların (Merkür’de iletişim/teknoloji, Venüs’te ilişkiler/değerler, Mars’ta enerji/eylem) dış dünyadan iç dünyaya dönmesi; gözden geçirme (re-view), tamir etme ve geçmiş konuları kapatma fırsatı olarak yorumlanır.'
    ],
    howToTitle: 'Retro Dönemlerini Yönetme',
    howTo: [
      { step: '01', title: 'Gölge Evrelerini (Shadow) Takip Edin', desc: 'Gezegenin geri harekete başlayacağı dereceye ilk vardığı an (Pre-shadow), retroda çözülecek konuların fragmanıdır.' },
      { step: '02', title: 'Sözleşmeleri İki Kez Okuyun', desc: 'Merkür retrolarında yedekleme yapın, detayları teyit edin ve büyük elektronik alımlarını acil değilse erteleyin.' },
      { step: '03', title: 'Eski Konuları Kapatın', desc: 'Retrolar yeni başlamak için değil; yarım kalmış projeleri, eski dostlukları ve ertelenmiş meseleleri tamamlamak için mükemmeldir.' }
    ],
    factsTitle: 'Retro Sıklıkları ve Süreleri',
    facts: [
      { label: 'Merkür Retrosu', value: 'Yılda 3-4 Kez', desc: 'Her biri yaklaşık 3 hafta sürer' },
      { label: 'Venüs Retrosu', value: '18 Ayda Bir', desc: 'Yaklaşık 40-42 gün sürer' },
      { label: 'Mars Retrosu', value: '26 Ayda Bir', desc: 'Yaklaşık 2-2.5 ay sürer' },
      { label: 'Jüpiter – Plüton', value: 'Yılda Bir Kez', desc: 'Yılın 4-5 ayını retroda geçirirler' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Güneş ve Ay zodyakta hiçbir zaman geri hareket yapmazlar; daima ileri doğru hareket ederler.',
      'Doğum haritasında retro gezegeni olan kişiler, o gezegenin temalarını toplumun genel kalıplarından farklı, özgün ve içselleştirilmiş bir derinlikle yaşama eğilimindedir.'
    ]
  },

  'astroloji/numeroloji': {
    kicker: 'Pisagor Ezoterizmi',
    title: 'Pisagor Numeroloji Matrisi',
    serif: 've yaşam yolu sayıları',
    summary: 'Doğum tarihi ve ismin sayısal titreşimiyle hesaplanan 1-9 arketipleri ve 11, 22, 33 usta sayıların kozmik kodları.',
    intro: [
      'Antik Yunan filozofu ve matematikçisi Pisagor, "Evren sayılardan ibarettir ve her sayı kendine has bir titreşimsel frekansa sahiptir" diyerek modern numerolojinin temellerini atmıştır.',
      'Yaşam Yolu Sayısı (Life Path Number), bir insanın doğum tarihinin gün, ay ve yıl hanelerinin tek tek toplanarak 1 ile 9 arasında tek haneli bir sayıya veya usta sayılara (11, 22, 33) indirgenmesiyle bulunur. Bu sayı ruhun bu yaşamdaki ana misyonunu ve öğrenme alanını temsil eder.',
      'Usta sayılar (Master Numbers) iki basamaklı olarak korunur ve tek haneye indirgenmez. 11 sezgisel aydınlanmayı ve vizyonu, 22 bu vizyonu somut binalara ve projelere dönüştüren "Usta Mimar"ı, 33 ise şefkat ve evrensel bilgeliği yansıtan "Kozmik Rehber"i simgeler.'
    ],
    howToTitle: 'Yaşam Yolu Sayınızı Hesaplama',
    howTo: [
      { step: '01', title: 'Doğum Tarihinizi Yazın', desc: 'Örnek: 14 Temmuz 1995 -> Gün: 14 (1+4=5), Ay: 7 (0+7=7), Yıl: 1995 (1+9+9+5 = 24 -> 2+4=6).' },
      { step: '02', title: 'Üç Değeri Toplayın', desc: '5 + 7 + 6 = 18 -> 1 + 8 = 9. Bu kişinin yaşam yolu sayısı 9’dur.' },
      { step: '03', title: 'Usta Sayı Kuralı', desc: 'Toplam 11, 22 veya 33 çıktığında indirgeme yapılmaz; usta sayı potansiyeli okunur.' }
    ],
    factsTitle: 'Sayı Arketipleri Rehberi',
    facts: [
      { label: '1 - Öncü', value: 'Bağımsızlık & Liderlik', desc: 'Cesaret, yenilikçilik ve özgüven' },
      { label: '2 - Diplomat', value: 'Uyum & İşbirliği', desc: 'Sezgi, empati ve barış kuruculuk' },
      { label: '3 - Yaratıcı', value: 'İfade & Neşe', desc: 'Sanat, iletişim ve coşkulu enerji' },
      { label: '4 - İnşacı', value: 'Düzen & Kararlılık', desc: 'Pratiklik, disiplin ve güvenilirlik' },
      { label: '5 - Maceracı', value: 'Özgürlük & Değişim', desc: 'Esneklik, merak ve keşif tutkusu' },
      { label: '6 - Besleyici', value: 'Sorumluluk & Sevgi', desc: 'Aile, şifa ve fedakarlık' },
      { label: '7 - Arayıcı', value: 'Analiz & Maneviyat', desc: 'Felsefe, yalnızlık ve derin bilgelik' },
      { label: '8 - Güç Sahibi', value: 'Bolluk & Otorite', desc: 'Maddi başarı, organizasyon ve adalet' },
      { label: '9 - İnsancıl', value: 'Evrensel Şefkat', desc: 'Tamamlanma, affediş ve dünya bilinci' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Pisagorcular 10 sayısını ("Tetraktis") kusursuzluğun ve kozmik uyumun en kutsal sembolü olarak görür ve üzerine yemin ederlerdi.',
      'İsim analizi (Gematria / Pisagor alfabesi), harflere 1’den 9’a kadar sayısal değerler atayarak ruh güdüsü (sesli harfler) ve kişilik sayısını (sessiz harfler) hesaplar.'
    ]
  },

  // ==========================================
  // GÖZLEMEVİ
  // ==========================================
  'gozlemevi/spektrum': {
    kicker: 'Çok Dalgaboylu Evren',
    title: 'Elektromanyetik Spektrum Gözlemi',
    serif: 'görünür ışıktan gama ışınlarına',
    summary: 'İnsan gözünün göremediği radyo, kızılötesi, ultraviyole, X-ışını ve gama dalgaboylarında aynı kozmik hedefin farklı fiziksel süreçleri.',
    intro: [
      'İnsan gözü elektromanyetik tayfın yalnızca 380 ila 750 nanometre arasındaki son derece dar bir penceresini (görünür ışık) algılayabilir. Ancak evrendeki en büyüleyici astrofiziksel olaylar bu bandın tamamen dışında gerçekleşir.',
      'Soğuk yıldızlararası toz bulutları kızılötesi ışıkta parıldarken (James Webb), milyonlarca derecelik süpernova şokları ve kara delik yığılma diskleri X-ışınlarında (Chandra) parlar. Soğuk nötr hidrojen gazı ve pulsarlar ise radyo dalgalarında (ALMA, VLA) sinyal verir.',
      'Çok dalgaboylu astronomi (Multi-wavelength astronomy), aynı nesneyi tüm bu pencerelerden eşzamanlı izleyerek nesnenin kütlesi, sıcaklığı, manyetik alanı ve evrimsel geçmişi hakkında eksiksiz bir fiziksel tablo kurmamızı sağlar.'
    ],
    howToTitle: 'Gözlem Masası Nasıl Kullanılır?',
    howTo: [
      { step: '01', title: 'Bir Kozmik Hedef Seçin', desc: 'Yengeç Bulutsusu, Cassiopeia A veya Andromeda Galaksisi gibi çok dalgaboylu arşiv hedefini belirleyin.' },
      { step: '02', title: 'Dalgaboyu Çubuğunu Kaydırın', desc: 'Radyodan gama ışınlarına doğru geçtikçe hangi yapıların kaybolup hangi sıcak gazların belirdiğini izleyin.' },
      { step: '03', title: 'Teleskop Eşleşmesini İnceleyin', desc: 'Her bandın hangi uzay veya yer teleskobu tarafından kaydedildiğini gözlemleyin.' }
    ],
    factsTitle: 'Dalgaboyları ve Başlıca Teleskoplar',
    facts: [
      { label: 'Radyo (> 1 mm)', value: 'ALMA / VLA', desc: 'Soğuk moleküler bulutlar, pulsar atımları' },
      { label: 'Kızılötesi (750 nm - 1 mm)', value: 'James Webb / Spitzer', desc: 'Tozun ardındaki proto-yıldızlar, erken galaksiler' },
      { label: 'Görünür (380 - 750 nm)', value: 'Hubble / VLT', desc: 'Yıldız ışıkları ve iyonize gaz salması' },
      { label: 'X-Işını (0.01 - 10 nm)', value: 'Chandra / XMM-Newton', desc: 'Milyon derecelik plazma, kara delik çevreleri' },
      { label: 'Gama Işını (< 0.01 nm)', value: 'Fermi Uzay Teleskobu', desc: 'Süpernova patlamaları, pulsarlar, aktif galaksiler' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Dünya atmosferi X-ışınları, gama ışınları ve kızılötesinin büyük kısmını emerek yüzeydeki canlıları korur; bu nedenle bu dalgaboylarını gözlemlemek için teleskopları uzaya fırlatmak zorundayız.',
      'Yengeç Bulutsusu’nun merkezindeki pulsar saniyede 30 kez döner ve hem radyoda hem de optik ve X-ışınlarında eşzamanlı atımlar üretir.'
    ]
  },

  'gozlemevi/webb-hubble': {
    kicker: 'Uzay Teleskopları',
    title: 'Hubble ve James Webb Karşılaştırması',
    serif: 'tozun ötesini görmek',
    summary: '2.4 metrelik optik emektar Hubble ile 6.5 metrelik berilyum aynalı kızılötesi amiral gemisi JWST arasındaki teknik ve bilimsel sıçrama.',
    intro: [
      '1990’da fırlatılan Hubble Uzay Teleskobu, evrenin genişleme hızını ölçerek ve derin uzay alanlarıyla ilk galaksileri göstererek astronomi tarihini baştan yazdı. Ancak Hubble ağırlıklı olarak görünür ve ultraviyole dalgaboylarında çalışır; bu da kalın kozmik toz bulutlarının ardını görmesini engeller.',
      '2021 sonunda fırlatılan James Webb Uzay Teleskobu (JWST) ise 6.5 metre çapındaki altın kaplamalı 18 berilyum aynası ve hassas kızılötesi detektörleriyle (NIRCam, MIRI) kozmik toz perdesini delip geçer.',
      'Ayrıca evren genişledikçe en uzak galaksilerin ışığı kırmızıya kayarak kızılötesi banda geçer. Webb, Büyük Patlama’dan yalnızca 300 milyon yıl sonra doğmuş ilk ilkel galaksileri ve yıldız beşiklerini eşi benzeri görülmemiş bir keskinlikle yakalar.'
    ],
    howToTitle: 'Karşılaştırma Sürgüsünü Kullanma',
    howTo: [
      { step: '01', title: 'Yaratılış Sütunları’nı İnceleyin', desc: 'Hubble görüntüsündeki opak kahverengi toz sütunlarının Webb görüntüsünde şeffaflaşıp içindeki yeni doğan yıldızları açığa çıkardığını görün.' },
      { step: '02', title: 'Yıldız Kırınım Dikenlerine Bakın', desc: 'Hubble yıldızlarında 4 adet parlak diken varken, Webb’in altıgen aynaları ve destek kolları nedeniyle 6 veya 8 diken görülür.' },
      { step: '03', title: 'Arka Plan Galaksilerini Sayın', desc: 'Webb’in derin uzay görüntülerinde ön plandaki nesnelerin ardında parıldayan binlerce uzak galaksiyi keşfedin.' }
    ],
    factsTitle: 'Teknik Karşılaştırma',
    facts: [
      { label: 'Ayna Çapı', value: 'Hubble: 2.4 m · Webb: 6.5 m', desc: 'Webb 6.25 kat daha fazla ışık toplama alanına sahiptir' },
      { label: 'Yörünge', value: 'Hubble: LEO 540 km · Webb: L2 1.5M km', desc: 'Webb Dünya’nın ısısından uzakta derin soğuktadır' },
      { label: 'Çalışma Sıcaklığı', value: 'Webb: -233°C (40 K)', desc: 'Kendi ısısının kızılötesi sensörleri kör etmemesi için' },
      { label: 'Gözlem Bandı', value: 'Hubble: UV/Optik · Webb: Kızılötesi', desc: '0.1-1.0 µm vs 0.6-28 µm' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Webb’in tenis kortu büyüklüğündeki 5 katmanlı güneş kalkanı Güneş tarafında +85°C sıcaklıktayken, gölge tarafındaki aynalar -233°C’ye kadar soğur.',
      'Hubble astronotlar tarafından uzay mekiğiyle defalarca tamir edilebilmişken, Webb Dünya’dan 1.5 milyon km uzakta olduğu için hiçbir insanlı servis uçuşu yapılamaz; her mekanizma ilk seferinde kusursuz çalışmak zorundaydı.'
    ]
  },

  'gozlemevi/radyo': {
    kicker: 'Sonifikasyon & Radyo Astronomi',
    title: 'Kozmik Radyo ve Pulsar Spektrografı',
    serif: 'evrenin seslerini dinlemek',
    summary: 'Dönen nötron yıldızlarının manyetosferik sinyalleri, Satürn’ün auroral ıslıkları ve radyo dalgalarının sese dönüştürülmesi.',
    intro: [
      'Uzay mutlak bir boşluk olduğu için mekanik ses dalgaları yayılmaz; Hollywood filmlerindeki uzay patlaması sesleri kurgudan ibarettir. Ancak uzaydaki nesneler sürekli elektromanyetik radyo dalgaları üretir.',
      'Radyo teleskoplar bu radyo frekanslarını toplar ve bilgisayar algoritmaları bu frekansları insan kulağının duyabileceği 20 Hz - 20.000 Hz akustik ses dalgalarına dönüştürür (Sonifikasyon / Sesleştirme).',
      'Bir süpernovadan geriye kalan ve saniyede onlarca kez kendi ekseni etrafında dönen nötron yıldızları (Pulsarlar), manyetik kutuplarından deniz feneri gibi radyo demetleri fışkırtır. Bu sinyaller sese çevrildiğinde bir helikopter pervanesi veya kozmik bir metronom gibi düzenli atımlar duyulur.'
    ],
    howToTitle: 'Spektrografı Kullanma',
    howTo: [
      { step: '01', title: 'Bir Radyo Kaynağı Seçin', desc: 'Vela Pulsarı, Yengeç Pulsarı, Jüpiter dekametrik ışıması veya Güneş patlaması sinyalini seçin.' },
      { step: '02', title: 'Spektrogramı İnceleyin', desc: 'Zaman (yatay) ve frekans (dikey) eksenindeki sinyal yoğunluk çizgisini takip edin.' },
      { step: '03', title: 'Akustik Periyodu Dinleyin', desc: 'Dönüş hızı arttıkça atım frekansının bas bir tıkırtıdan tiz bir vızıltıya nasıl dönüştüğünü deneyimleyin.' }
    ],
    factsTitle: 'Radyo Astronomi Köşe Taşları',
    facts: [
      { label: 'Jocelyn Bell Burnell (1967)', value: 'İlk Pulsar Keşfi', desc: 'İlk sinyale LGM-1 (Little Green Men) lakabı verilmişti' },
      { label: 'Nötr Hidrojen Hattı', value: '21 cm (1.420 MHz)', desc: 'Samanyolu spiral kollarını haritalayan radyo çizgisi' },
      { label: 'En Hızlı Pulsar (PSR J1748)', value: '716 Devir / Saniye', desc: 'Ekvator çizgisi ışık hızının %24’üyle dönmektedir' },
      { label: 'Dev Radyo Teleskoplar', value: 'FAST (500 m) / ALMA', desc: 'Dünyanın en büyük tek parça ve interferometre çanakları' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      '1930’larda Bell Laboratuvarları mühendisi Karl Jansky, telefon hatlarındaki cızırtıyı araştırırken Samanyolu merkezinden gelen ilk kozmik radyo sinyallerini keşfetmiştir.',
      'Satürn’ün kutup bölgelerindeki auroral parçacıkların manyetik alan çizgileri boyunca spiral çizmesi sonucu oluşan radyo dalgaları, dinlendiğinde ürpertici ıslık seslerine benzer.'
    ]
  },

  'gozlemevi/gozlemevleri': {
    kicker: 'Yer ve Uzay Gözlemevleri',
    title: 'Dünya’nın En Büyük Teleskopları Atlası',
    serif: 've DAG Erzurum',
    summary: 'Ayna çapları, rakımları, adaptif optikleriyle Şili Atacama’dan Hawaii Mauna Kea’ya ve Erzurum Karakaya Zirvesi’ne dev gözlemevleri.',
    intro: [
      'Astronomide daha uzağı ve daha sönüğü görebilmenin tek kuralı vardır: Daha büyük bir ayna yapmak. Bir teleskobun ışık toplama gücü ayna çapının karesiyle doğru orantılıdır; 8 metrelik bir ayna, 4 metrelik bir aynanın 4 katı foton toplar.',
      'Yeryüzündeki dev teleskoplar atmosfer dalgalanmalarını bertaraf etmek için deniz seviyesinden binlerce metre yükseklikteki kuru çöllere veya volkan zirvelerine kurulur. Ayrıca lazer güdümlü "Adaptif Optik" sistemleri saniyede yüzlerce kez aynayı deforme ederek atmosferik bulanıklığı sıfırlar.',
      'Türkiye’nin en büyük temel bilim yatırımlarından olan Doğu Anadolu Gözlemevi (DAG), Erzurum Karakaya Tepesi’nde 3.170 metre rakımda 4 metre çapında aktif optikli aynasıyla Avrupa kıtasının en modern kızılötesi gözlemevlerinden biridir.'
    ],
    howToTitle: 'Atlası İnceleme',
    howTo: [
      { step: '01', title: 'Rakım ve Konum Kriterini Görün', desc: 'Neden tüm mega teleskopların Şili Atacama, Hawaii veya Kanarya Adaları’nda toplandığını inceleyin.' },
      { step: '02', title: 'Ayna Mimarilerini İnceleyin', desc: 'Tek parça yekpare aynalar (DAG 4 m, VLT 8.2 m) ile petek parçalı aynalar (Keck 10 m, ELT 39 m) farkını görün.' },
      { step: '03', title: 'Geleceğin Devlerini Tanıyın', desc: 'İnşaatı süren 39 metrelik Aşırı Büyük Teleskop’un (ELT) astronomide açacağı yeni çağı keşfedin.' }
    ],
    factsTitle: 'Mega Gözlemevleri Kataloğu',
    facts: [
      { label: 'DAG (Erzurum, Türkiye)', value: '4.0 m Ayna · 3.170 m', desc: 'Türkiye’nin en büyük optik/kızılötesi teleskobu' },
      { label: 'TUG (Antalya, Türkiye)', value: '1.5 m (RTT150) · 2.500 m', desc: 'Bakırlıtepe Ulusal Gözlemevi' },
      { label: 'VLT (Paranal, Şili)', value: '4 × 8.2 m Aynalar', desc: 'Optik interferometre olarak birleştirilebilen devler' },
      { label: 'Keck (Hawaii, ABD)', value: '2 × 10 m Petek Ayna', desc: 'Mauna Kea sönmüş volkan zirvesinde 4.145 m rakım' },
      { label: 'ELT (Cerro Armazones)', value: '39 m Dev Ayna (Yapım aşamasında)', desc: 'Dünyanın en büyük gözü (798 altıgen ayna)' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'DAG Teleskobu’nun 4 metrelik aynası İtalya’da üretilmiş, yüzey pürüzsüzlüğü nanometre hassasiyetinde parlatılmıştır; eğer ayna tüm Türkiye büyüklüğünde olsaydı en yüksek tümsek 2 santimetreyi geçmezdi.',
      'Gözlemevleri geceleri gökyüzüne güçlü turuncu sodyum lazerleri fırlatarak 90 km irtifadaki mezosfer tabakasında yapay yıldızlar oluşturur ve atmosfer düzeltmesini bu referansla yapar.'
    ]
  },

  'gozlemevi/spektroskopi': {
    kicker: 'Yıldız Kimyası & Fizik',
    title: 'Stellar Spektroskopi ve Fraunhofer Çizgileri',
    serif: 'yıldızların parmak izleri',
    summary: 'Annie Jump Cannon’ın OBAFGKM tayf sınıfları, soğurma çizgileri ve Doppler kaymasıyla kimyasal bileşim ve hız ölçümü.',
    intro: [
      '19. yüzyılın başında filozof Auguste Comte, insanlığın yıldızların kimyasal bileşimini asla öğrenemeyeceğini iddia etmişti. Ancak spektroskopinin (tayfölçüm) keşfi bu iddiayı kısa sürede çürüttü.',
      'Yıldızın çekirdeğindeki akkor ışıktan yayılan sürekli spektrum, yıldızın dış atmosferindeki serin gaz katmanlarından geçerken atomlar belirli dalgaboylarındaki fotonları soğurur. Joseph von Fraunhofer bu karanlık soğurma çizgilerini keşfetti.',
      'Her elementin (hidrojen, helyum, demir, kalsiyum) soğurma çizgileri tıpkı bir parmak izi gibi benzersizdir. Bir yıldızın ışığını prizmadan geçirerek onun hangi elementlerden oluştuğunu, sıcaklığını, yoğunluğunu ve bize doğru mu yoksa bizden uzağa mı hareket ettiğini (Doppler kayması) kesin olarak bilebiliriz.'
    ],
    howToTitle: 'Tayf Analizini Okuma',
    howTo: [
      { step: '01', title: 'O B A F G K M Sınıflarını Öğrenin', desc: 'En sıcak mavi O tipi yıldızlardan (40.000 K) en serin kırmızı M tipi yıldızlara (3.000 K) uzanan sıcaklık dizilimidir.' },
      { step: '02', title: 'Balmer Hidrojen Çizgilerini Bulun', desc: 'Özellikle A tipi yıldızlarda (Vega, Sirius) hidrojen çizgileri (H-alfa, H-beta) maksimum derinliğe ulaşır.' },
      { step: '03', title: 'Kırmızıya / Maviye Kaymayı Ölçün', desc: 'Çizgiler laboratuvar referansına göre kırmızıya kayıyorsa yıldız uzaklaşıyor, maviye kayıyorsa yaklaşıyordur.' }
    ],
    factsTitle: 'Harvard Spektral Sınıfları',
    facts: [
      { label: 'O Tipi (> 30.000 K)', value: 'Mavi Devler', desc: 'İyonize helyum çizgileri, devasa kütle' },
      { label: 'B Tipi (10.000 - 30.000 K)', value: 'Mavi-Beyaz', desc: 'Nötr helyum, Rigel' },
      { label: 'A Tipi (7.500 - 10.000 K)', value: 'Beyaz Yıldızlar', desc: 'Güçlü hidrojen Balmer çizgileri, Sirius, Vega' },
      { label: 'G Tipi (5.200 - 6.000 K)', value: 'Sarı Cüceler (Güneş)', desc: 'İyonize kalsiyum (H ve K) ve demir çizgileri' },
      { label: 'M Tipi (< 3.700 K)', value: 'Kırmızı Cüce & Devler', desc: 'Titanyum oksit molekül bantları, Betelgeuse' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Gökbilimci Cecilia Payne-Gaposchkin, 1925 yılında doktora tezinde yıldız spektrumlarını analiz ederek evrenin büyük kısmının hidrojen ve helyumdan oluştuğunu ilk kez kanıtlamıştır.',
      'Helyum elementi Dünya’da keşfedilmeden önce 1868 yılındaki güneş tutulmasında Güneş spektrumundaki sarı bir çizgi sayesinde Güneş’te keşfedilmiş ve adını Yunan güneş tanrısı Helios’tan almıştır.'
    ]
  },

  'gozlemevi/transit': {
    kicker: 'Fotometrik Keşif',
    title: 'Ötegezegen Transit Fotometrisi',
    serif: 've ışık eğrisi analizi',
    summary: 'Bir ötegezegen ana yıldızının önünden geçerken ışığında yarattığı saniyelik parlaklık düşüşü, yarıçap oranı ve atmosfer spektroskopisi.',
    intro: [
      'Işık yılları uzaklıktaki bir ötegezegeni doğrudan fotoğraflamak, kilometrelerce uzaktaki bir projektörün hemen dibinde uçan bir sivrisineği görmeye benzer. Bu nedenle gezegenlerin büyük çoğunluğu dolaylı fotometrik yöntemlerle keşfedilir.',
      'Bir ötegezegenin yörünge düzlemi Dünya ile yıldızının arasına denk geliyorsa, gezegen her turda yıldız diskini kısmen örterek ışık eğrisinde (Light Curve) karakteristik "U" şeklinde küçük bir parlaklık düşüşü yaratır.',
      'Işıktaki düşüş miktarı doğrudan gezegen ile yıldızın alanlarının oranına eşittir: ΔF / F = (R_gezegen / R_yıldız)². Jüpiter büyüklüğünde bir gezegen Güneş benzeri bir yıldızın ışığını yaklaşık %1 oranında kısarken, Dünya benzeri bir gezegen yalnızca %0.01 (on binde bir) oranında kısar.'
    ],
    howToTitle: 'Işık Eğrisini Analiz Etme',
    howTo: [
      { step: '01', title: 'Düşüş Derinliğini Ölçün', desc: 'Işığın ne kadar azaldığı gezegenin fiziksel yarıçapını doğrudan verir.' },
      { step: '02', title: 'Geçiş Süresini Hesaplayın', desc: 'Gezegenin yıldız önünden geçişinin toplam süresi ve giriş-çıkış eğimi yörünge eğikliğini belirler.' },
      { step: '03', title: 'Atmosfer Filtresini İnceleyin', desc: 'Geçiş sırasında yıldız ışığı gezegenin ince atmosferinden süzülür; farklı renklerdeki ışık düşüşleri atmosferdeki su, karbondioksit ve metan gazlarını deşifre eder.' }
    ],
    factsTitle: 'Transit Görevleri Başarıları',
    facts: [
      { label: 'Kepler Uzay Teleskobu', value: '> 2.700 Gezegen', desc: 'Tek bir gökyüzü bölgesinde 150.000 yıldızı aralıksız izledi' },
      { label: 'TESS (NASA)', value: 'Tüm Gökyüzü Taraması', desc: 'Bize en yakın ve parlak yıldızların transitlerini arar' },
      { label: 'Tipik Düşüş Derinliği', value: '%0.01 – %1.5', desc: 'Yüksek hassasiyetli CCD fotometrisi gerektirir' },
      { label: 'Geçiş Spektroskopisi', value: 'Transmisyon Spektrumu', desc: 'Atmosferdeki su buharı ve moleküllerin tespiti' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Güneş Sistemi’nde de Dünya’dan bakıldığında yalnızca iki gezegenin transiti görülebilir: Merkür ve Venüs. Bir sonraki Venüs transiti Aralık 2117 yılında gerçekleşecektir.',
      'Geçiş zamanı değişimleri (TTV - Transit Timing Variations), ışık eğrisinde görünmeyen diğer komşu gezegenlerin kütleçekimsel çekişlerini ve varlığını matematiksel olarak açığa çıkarır.'
    ]
  },

  'gozlemevi/akademi': {
    kicker: 'Astrofizik Sertifikasyonu',
    title: 'Astrofizik Akademisi Bilgi Sınavı',
    serif: 've kozmik kaşif sertifikası',
    summary: 'Görelilikten kuantum astrofiziğine, yörünge mekaniğinden erken evren kozmolojisine 30 soruluk derin sınav havuzu.',
    intro: [
      'Astrofizik Akademisi, evrenin temel işleyiş mekanizmalarını ne kadar kavradığınızı ölçen kapsamlı bir bilimsel test platformudur. Soru havuzu modern astrofiziğin dört temel sütununa dayanır: Genel ve Özel Görelilik, Kuantum ve Çekirdek Fiziği, Gözlemsel Astronomi ve Gezegen Bilimi.',
      'Her soru yalnızca doğru cevabı test etmekle kalmaz; yanlış veya doğru seçim yaptığınızda ilgili fiziksel yasanın formülünü, arkasındaki bilim insanını ve kavramsal açıklamasını detaylı bir bilimsel rapor olarak sunar.',
      'Sınavı başarıyla tamamlayan kaşifler, kişisel adlarına düzenlenen ve aldıkları skora göre "Kozmik Kaşif", "Yıldız Seyyivı" veya "Astrofizik Üstadı" unvanını taşıyan resmi dijital sertifikalarını anında oluşturabilirler.'
    ],
    howToTitle: 'Sınav Yönergeleri',
    howTo: [
      { step: '01', title: 'Soruyu ve Seçenekleri Dikkatle Okuyun', desc: 'Sorular ezber bilgi yerine kavramsal fizik ilişkilerini (neden-sonuç) sorgular.' },
      { step: '02', title: 'Bilimsel Açıklamayı İnceleyin', desc: 'Cevabınızı işaretledikten sonra açılan analiz panelindeki Lorentz çarpanı, Schwarzschild yarıçapı veya Hubble sabiti gibi açıklamaları okuyun.' },
      { step: '03', title: 'Sertifikanızı Alın', desc: 'Tüm sorular tamamlandığında adınızı girerek yüksek çözünürlüklü dijital sertifikanızı kaydedin.' }
    ],
    factsTitle: 'Sınav Kapsam Alanları',
    facts: [
      { label: 'Görelilik Fiziği', value: 'Zaman genleşmesi, eğrilik', desc: 'Einstein Özel ve Genel Görelilik kuramları' },
      { label: 'Yıldız Astrofiziği', value: 'Füzyon, süpernova, cüceler', desc: 'Chandrasekhar limiti, hidrostatik denge' },
      { label: 'Kozmoloji', value: 'Büyük Patlama, CMB, Redshift', desc: 'Hubble-Lemaître genişleme modeli' },
      { label: 'Gözlem Teknikleri', value: 'Spektroskopi, interferometri', desc: 'LIGO, Webb, adaptif optik' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Sertifikanızdaki başarı derecesi doğrudan Harvard ve Cambridge astrofizik lisans programlarının giriş seviyesi kavramsal sorularıyla kalibre edilmiştir.',
      'Bilimsel kavramları öğrenmenin en kalıcı yolu, yanılgıya düştüğünüz sorulardaki açıklamaları derinlemesine incelemektir.'
    ]
  },

  // ==========================================
  // CANLI GÖKYÜZÜ
  // ==========================================
  'canli/bu-gece': {
    kicker: 'Gözlem Planlayıcı',
    title: 'Bu Gece Gökyüzü ve Gezegenler',
    serif: 'teleskopsuz neye bakılır rehberi',
    summary: 'Türkiye enlemlerinden bu gece çıplak gözle ve küçük dürbünlerle görülebilecek gezegenler, doğuş-batış saatleri ve Ay parlaklığı.',
    intro: [
      'Gece gökyüzünü izlemek için pahalı bir teleskoba ihtiyacınız yoktur; insan gözü binlerce yıldır en iyi gözlem aracı olmuştur. Ancak başarılı bir gözlem gecesi doğru zamanlama, uygun hava koşulları ve neye bakacağını bilmekle başlar.',
      'Gezegenleri yıldızlardan ayırt etmenin en kolay yolu parıldama testidir: Yıldızlar nokta ışık kaynakları oldukları için atmosfer türbülansında kırpışırlar (twinkle). Gezegenler ise küçük birer disk oluşturdukları için ışıkları gökyüzünde sabit ve kırpışmasız bir parlaklıkla parlar.',
      'Bu modül, NASA JPL efemeris algoritmalarıyla bulunduğunuz konuma göre gezegenlerin ufuktan doğuş ve batış saatlerini hesaplar, Ay’ın ışık engeli oluşturmadığı en karanlık gözlem pencerelerini çıkarır.'
    ],
    howToTitle: 'Teleskopsuz Gözlem İpuçları',
    howTo: [
      { step: '01', title: 'Gözlerinizi Karanlığa Alıştırın', desc: 'Karanlıkta göz bebeğinin tam açılması ve rodopsin pigmentinin aktifleşmesi için en az 20 dakika telefon ekranına veya beyaz ışığa bakmayın (kırmızı ışık kullanın).' },
      { step: '02', title: 'Gezegenleri Renklerinden Tanıyın', desc: 'Venüs günbatımında veya doğumunda kamaştırıcı beyazdır; Mars belirgin şekilde pas kızılıdır; Jüpiter parlak kremsi sarıdır; Satürn ise sakin altın rengindedir.' },
      { step: '03', title: 'Ekliptik Hattını Takip Edin', desc: 'Tüm gezegenler ve Ay, gökyüzünde Güneş’in gündüz kat ettiği hayali çizgi (tutulma düzlemi / ekliptik) üzerinde sıralanır.' }
    ],
    factsTitle: 'Çıplak Gözle Görülebilen 5 Gezegen',
    facts: [
      { label: 'Merkür', value: '-0.5 Kadir', desc: 'Güneş’e çok yakın, yalnızca alacakaranlıkta kısa süre' },
      { label: 'Venüs (Çoban Yıldızı)', value: '-4.4 Kadir', desc: 'Aydan sonra göğün en parlak doğal cismi' },
      { label: 'Mars (Kızıl Gezegen)', value: '-2.0 Kadir (karşı konumda)', desc: 'Belirgin turuncu-kırmızı renk' },
      { label: 'Jüpiter', value: '-2.7 Kadir', desc: 'Gece boyunca parıldayan devasa gaz devi' },
      { label: 'Satürn', value: '+0.2 Kadir', desc: 'Çıplak gözle halkaları seçilmez ancak parlak sarı bir yıldız gibidir' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Sıradan bir 10x50 av dürbünüyle bile Jüpiter’in etrafında dolanan 4 büyük Galileo uydusunu (Io, Europa, Ganymede, Callisto) yan yana dizilmiş minik noktalar halinde görebilirsiniz.',
      'Ay dolunay evresindeyken gökyüzünü o kadar güçlü aydınlatır ki derin uzay nesnelerini (galaksi ve bulutsuları) görmek imkansız hale gelir; dolunay geceleri yalnızca Ay kraterlerini ve parlak gezegenleri izlemek için uygundur.'
    ]
  },

  'canli/iss': {
    kicker: 'Yörünge İstasyonu',
    title: 'Uluslararası Uzay İstasyonu (ISS)',
    serif: 'anlık konum ve geçiş takibi',
    summary: 'Dünya’dan 420 km irtifada saatte 27.600 km hızla dönen insanlığın yörünge laboratuvarının canlı telemetrisi ve geçiş pencereleri.',
    intro: [
      'Uluslararası Uzay İstasyonu (ISS), 1998 yılından bu yana kesintisiz olarak Dünya yörüngesinde dolanan, insanlığın uzaydaki en büyük ortak mühendislik ve bilim harikasıdır. Yaklaşık bir futbol sahası büyüklüğünde olan istasyon, astronot ve kozmonotlara mikro yerçekimi ortamında araştırma yapma imkanı sağlar.',
      'İstasyon deniz seviyesinden yaklaşık 400-420 kilometre yükseklikte uçar ve saatte tam 27.600 kilometre (saniyede 7.7 km) hızla hareket eder. Bu inanılmaz hız sayesinde Dünya etrafında tek bir turunu yalnızca 92 dakikada tamamlar; içindeki mürettebat her 24 saatte 16 kez gün doğumu ve gün batımına tanık olur.',
      'Geniş güneş panelleri Güneş ışığını güçlü şekilde yansıttığı için ISS, Türkiye üzerinden geçerken gökyüzünde parlak, yanıp sönmeyen, sessizce ve hızla kayan beyaz bir yıldız gibi çıplak gözle büyüleyici bir netlikte izlenebilir.'
    ],
    howToTitle: 'ISS Geçişini Nasıl İzleyebilirsiniz?',
    howTo: [
      { step: '01', title: 'Geçiş Zamanını Takip Edin', desc: 'İstasyon yalnızca alacakaranlıkta (gökyüzü karanlıkken istasyonun Güneş ışığı aldığı anlarda) görünür.' },
      { step: '02', title: 'Uçaklarla Karıştırmayın', desc: 'Uçaklar yanıp sönen kırmızı/yeşil lambalara sahiptir ve ses çıkarır; ISS ise tamamen sessiz, sabit beyaz parıltılı ve uçaklardan kat kat hızlıdır.' },
      { step: '03', title: 'Geçiş Süresi', desc: 'Tipik bir ufuktan ufuğa geçiş 3 ila 6 dakika sürer; başucu noktasından geçtiğinde -3.5 kadire (Venüs kadar parlak) ulaşabilir.' }
    ],
    factsTitle: 'ISS Telemetri Parametreleri',
    facts: [
      { label: 'Ortalama İrtifa', value: '418 km', desc: 'Alçak Dünya Yörüngesi (LEO)' },
      { label: 'Yörünge Hızı', value: '27.600 km/s', desc: 'Ses hızının yaklaşık 23 katı (Mach 23)' },
      { label: 'Yörünge Eğim Açısı', value: '51.6°', desc: 'Dünya nüfusunun %90’ının üzerinden geçer' },
      { label: 'Ağırlık & Boyut', value: '~450 Ton · 109 metre', desc: 'Büyük bir futbol sahası boyutunda' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Alper Gezeravcı, Ax-3 görevi kapsamında Ocak 2024’te ISS’e ulaşarak istasyonda 13 farklı bilimsel deney gerçekleştiren ilk Türk astronot olmuştur.',
      'İstasyon son derece seyrek de olsa atmosfer sürtünmesine maruz kaldığı için her ay yaklaşık 1-2 kilometre irtifa kaybeder; periyodik olarak kargo gemilerinin motorlarıyla yeniden yukarı itilir.'
    ]
  },

  'canli/uzay-havasi': {
    kicker: 'NOAA Uzay Havası',
    title: 'Güneş Fırtınaları ve Manyetik Alan',
    serif: 'kp indeksi, güneş rüzgârı ve auroralar',
    summary: 'NOAA Uzay Hava Durumu Tahmin Merkezi verileriyle Güneş lekeleri, X-ışını patlamaları, jeomanyetik fırtınalar ve Türkiye’den kutup ışığı olasılığı.',
    intro: [
      'Güneş statik bir ateş topu değildir; 11 yıllık manyetik döngüsü boyunca devasa plazma patlamaları ve manyetik fırtınalar üreten dinamik bir termonükleer reaktördür. Bu faaliyetlerin Dünya çevresindeki uzay ortamında yarattığı etkilere "Uzay Hava Durumu" denir.',
      'Güneş yüzeyindeki koronal kütle atımları (CME), milyarlarca tonluk yüklü plazmayı saatte milyonlarca kilometre hızla uzaya fırlatır. Bu plazma Dünya’nın manyetosferine çarptığında jeomanyetik fırtınalar tetiklenir.',
      'Bu fırtınaların şiddeti Kp İndeksi ile (0 ila 9 arası) ölçülür. Kp 5 ve üzeri jeomanyetik fırtına alarmıdır. Şiddetli fırtınalarda (Kp 8-9) kutup ışıkları (Aurora) normalde kutuplarla sınırlıyken güneye doğru sarkar ve Türkiye enlemlerinden dahi kızıl auroralar olarak görülebilir.'
    ],
    howToTitle: 'Uzay Havası Parametrelerini Okuma',
    howTo: [
      { step: '01', title: 'Güneş Rüzgârı Hızı ve Yoğunluğu', desc: 'Normal hız 350-400 km/s’dir; 600 km/s üzeri hızlar aktif bir plazma şokunun ulaştığını gösterir.' },
      { step: '02', title: 'Manyetik Alan Bz Bileşeni', desc: 'Bz değeri ne kadar negatif (güneye doğru) olursa, Güneş rüzgârı Dünya’nın manyetik kalkanına o kadar kolay nüfuz eder.' },
      { step: '03', title: 'Güneş Patlaması Sınıfları', desc: 'A, B, C (zayıf), M (orta) ve X (aşırı şiddetli) sınıfları röntgen ışını akısını ifade eder; X-sınıfı patlamalar Dünya’da radyo kararmalarına yol açabilir.' }
    ],
    factsTitle: 'Kp İndeksi ve Aurora Görünürlüğü',
    facts: [
      { label: 'Kp 0 – 3', value: 'Sakin Gökyüzü', desc: 'Auroralar yalnızca 65°+ kutup dairesinde' },
      { label: 'Kp 5 (G1 Fırtına)', value: 'Küçük Fırtına', desc: 'İskandinavya ve Kanada içlerinde parlak yeşil auroralar' },
      { label: 'Kp 7 (G3 Fırtına)', value: 'Güçlü Fırtına', desc: 'Orta Avrupa ve Kuzey ABD sınırında görünür' },
      { label: 'Kp 8 – 9 (G5 Ekstrem)', value: 'Tarihi Fırtına', desc: 'Mayıs 2024’te olduğu gibi Türkiye ve Akdeniz’den kızıl aurora' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      '1859 yılında yaşanan "Carrington Olayı" insanlık tarihinin kaydedilmiş en büyük jeomanyetik fırtınasıdır; telgraf hatları alev almış ve ekvatordan dahi kutup ışıkları görülmüştür.',
      'Auroraların yeşil rengi 100-200 km irtifadaki oksijen atomlarından, nadir görülen kızıl rengi ise 300 km üzerindeki yüksek irtifa oksijen ve azot moleküllerinden kaynaklanır.'
    ]
  },

  'canli/sondalar': {
    kicker: 'Yıldızlararası Kaşifler',
    title: 'Derin Uzay Sondaları ve İletişim',
    serif: 'insanlığın en uzak elçileri',
    summary: 'Voyager 1-2, New Horizons ve Parker Solar Probe’un anlık mesafeleri, hızları ve NASA Derin Uzay Ağı (DSN) ışık gecikmesi.',
    intro: [
      '1970’lerde insanlık Güneş Sistemi’nin sınırlarını aşmak üzere tarihin en cüretkar uzay görevlerini başlattı. Voyager 1 ve 2, Jüpiter, Satürn, Uranüs ve Neptün’ün hizalandığı 175 yılda bir gerçekleşen nadir gezegen diziliminden yararlanarak dış gezegenleri ziyaret etti.',
      '2012 yılında Voyager 1, Güneş rüzgârının yıldızlararası gaz tarafından durdurulduğu "Heliopoz" sınırını aşarak yıldızlararası uzaya çıkan ilk insan yapımı nesne oldu. Şu anda Dünya’dan 24 milyar kilometreden fazla uzaktadır.',
      'Bu akıl almaz mesafeler nedeniyle radyo sinyalleri dahi ışık hızıyla yol almasına rağmen Voyager 1’e neredeyse bir tam günde (22.5 saat) ulaşır; bir komut gönderip yanıt almak iki gün sürer. Bu iletişim NASA’nın devasa 70 metrelik çanaklara sahip Derin Uzay Ağı (DSN) antenleriyle sağlanır.'
    ],
    howToTitle: 'Sonda Telemetrisini Okuma',
    howTo: [
      { step: '01', title: 'Astronomik Birim (AU) Ölçeği', desc: '1 AU, Dünya ile Güneş arasındaki ortalama mesafedir (~149.6 milyon km). Voyager 1 şu anda 160 AU’nun üzerindedir.' },
      { step: '02', title: 'Işık Gecikmesi Süresi', desc: 'Işık hızının (300.000 km/s) sonlu olması nedeniyle sinyalin gidiş-dönüş süresi mesafenin en çarpıcı göstergesidir.' },
      { step: '03', title: 'Enerji Kaynakları (RTG)', desc: 'Güneş’ten bu kadar uzakta güneş panelleri çalışmaz; sondalar plütonyum-238’in radyoaktif bozunma ısısıyla çalışan nükleer bataryalarla (RTG) güç üretir.' }
    ],
    factsTitle: 'Sondaların Anlık Konumları',
    facts: [
      { label: 'Voyager 1 (1977)', value: '> 24.3 Milyar km (~163 AU)', desc: 'Yıldızlararası uzayda · ~17 km/s hız' },
      { label: 'Voyager 2 (1977)', value: '> 20.3 Milyar km (~136 AU)', desc: 'Dört dev dış gezegeni de ziyaret eden tek araç' },
      { label: 'New Horizons (2006)', value: '> 8.8 Milyar km (~59 AU)', desc: '2015’te Plüton’u, 2019’da Arrokoth’u görüntüledi' },
      { label: 'Parker Solar Probe', value: '~6.1 Milyon km (Perihelion)', desc: 'Güneş tacına dalan saatte 690.000 km hızlı en hızlı insan aracı' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Voyager sondalarının gövdesinde Carl Sagan’ın öncülüğünde hazırlanan ve olası dünya dışı uygarlıklara Dünya’daki yaşamı anlatan altın kaplamalı fonograf plaklar ("Altın Plak") yer alır.',
      'Voyager 1, 1990 yılında 6 milyar km uzaktan geriye dönerek Dünya’yı fotoğraflamış ve gezegenimiz tek bir pikselden küçük "Soluk Mavi Nokta" (Pale Blue Dot) olarak tarihe geçmiştir.'
    ]
  },

  'canli/arsiv-goruntusu': {
    kicker: 'Astrofotoğrafi Arşivi',
    title: 'NASA APOD ve Derin Uzay Fotoğrafçılığı',
    serif: 'günün astronomi görüntüsü',
    summary: '1995’ten bu yana her gün yayınlanan NASA APOD geleneği, dar bant filtreler (SHO Paleti) ve sahte renklerin astrofiziksel anlamı.',
    intro: [
      'NASA’nın "Günün Astronomi Görüntüsü" (Astronomy Picture of the Day - APOD), internet tarihinin en eski ve en saygın bilim arşivlerinden biridir. 1995 yılından beri her gün profesyonel veya amatör astronomlar tarafından çekilmiş olağanüstü bir uzay fotoğrafı ve bilimsel açıklaması yayınlanır.',
      'Uzay fotoğrafları sıradan telefon kameraları gibi tek karede çekilmez. Uzak bulutsular çok sönük olduğu için soğutmalı monokrom (siyah-beyaz) astronomi kameralarıyla saatlerce, bazen günlerce süren uzun pozlamalar yapılır.',
      'Hubble ve Webb teleskoplarının büyüleyici renkli görüntüleri "sahte renk" (false color) veya "temsili renk" olarak adlandırılır. Bu bir hile değil; insan gözünün göremediği gaz emisyonlarını (Hidrojen, Oksijen, Kükürt) görünür renklere eşleyerek gaz dağılımını görünür kılan bilimsel bir görselleştirme tekniğidir.'
    ],
    howToTitle: 'Astrofotoğrafları Yorumlama',
    howTo: [
      { step: '01', title: 'Hubble Paletini (SHO) Tanıyın', desc: 'İyonize Kükürt (S-II) kırmızıya, Hidrojen-alfa (H-α) yeşile, Oksijen (O-III) ise maviye atanır; meşhur altın ve turkuaz bulutsu tonları böyle doğar.' },
      { step: '02', title: 'Emisyon ve Yansıma Bulutsuları', desc: 'Kırmızı/pembe parıldayan bulutsular genç yıldızların UV ışığıyla uyarılan hidrojen gazıdır; mavi bulutsular ise yıldız ışığını saçan tozlardır.' },
      { step: '03', title: 'Karanlık Toz Damarlarını Seçin', desc: 'Işığı kesen siyah damarlar moleküler hidrojen ve karbon tozudur; yeni yıldızların kuluçka merkezleridir.' }
    ],
    factsTitle: 'Astrofotoğrafi Filtre Standartları',
    facts: [
      { label: 'H-alfa (H-α)', value: '656.3 nm Dalgaboyu', desc: 'Evrendeki en yaygın hidrojen emisyon çizgisi' },
      { label: 'O-III (Çift İyonize Oksijen)', value: '500.7 nm Dalgaboyu', desc: 'Süpernova kalıntıları ve gezegenimsi bulutsularda camgöbeği ışıma' },
      { label: 'S-II (İyonize Kükürt)', value: '672.4 nm Dalgaboyu', desc: 'Şok dalgalarının sınırlarını çizen derin kırmızı bant' },
      { label: 'RGB Doğal Renk', value: 'Kırmızı, Yeşil, Mavi', desc: 'Gözün göreceğine en yakın doğal yıldız renkleri' }
    ],
    takeawaysTitle: 'Biliyor Muydunuz?',
    takeaways: [
      'Uzay teleskoplarının çektiği ham görüntüler tamamen siyah-beyazdır; renkler farklı dalgaboyu filtrelerinden geçen karelerin birleştirilmesiyle oluşturulur.',
      'Amatör astrofotograflar, şehir merkezlerindeki ışık kirliliğine rağmen dar bant (narrowband) filtreler kullanarak evlerinin balkonundan bile milyonlarca ışık yılı uzaktaki bulutsuları fotoğraflayabilirler.'
    ]
  }
};
