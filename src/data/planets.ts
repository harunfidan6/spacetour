export interface PlanetDiscovery {
  date: string;
  discoverer: string;
  history: string;
}

export interface PlanetMoonsInfo {
  count: number;
  notable: string[];
  description: string;
}

export interface PlanetMission {
  name: string;
  year: string;
  agency: string;
  role: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'gezegen' | 'cüce-gezegen' | 'yıldız' | 'ay';
  description: string;
  image: string;
  facts: {
    kütle: string;
    çap: string;
    güneşeUzaklık: string;
    yörüngeSüresi: string;
    günSüresi: string;
    sıcaklık: string;
    uyduSayısı: number;
    halkaSistemi: boolean;
  };
  detay: string;
  renk: string;
  discovery: PlanetDiscovery;
  moonsInfo: PlanetMoonsInfo;
  missions: PlanetMission[];
  observationTurkey: string;
  biliyorMuydun: string[];
}

export const planets: CelestialBody[] = [
  {
    id: 'gunes',
    name: 'Güneş',
    type: 'yıldız',
    description: 'Sistemimizin merkezindeki sarı cüce yıldız.',
    image: '☀️',
    facts: {
      kütle: '1.989 × 10^30 kg',
      çap: '1.39 milyon km',
      güneşeUzaklık: '0 km',
      yörüngeSüresi: 'Yok',
      günSüresi: '27 Dünya günü',
      sıcaklık: '5,500°C (yüzey)',
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: 'Güneş, Güneş Sistemi’nin merkezinde yer alan ve ısı ile ışık kaynağımız olan orta büyüklükte bir G-tipi anakol sarı cüce yıldızıdır. Sistemin toplam kütlesinin %99.86’sını tek başına oluşturur. Çekirdeğindeki termonükleer füzyon reaksiyonları sayesinde saniyede 600 milyon ton hidrojeni helyuma dönüştürerek muazzam miktarda enerji üretir.\n\nYaklaşık 4.6 milyar yaşında olan Güneş, anakol evresinin yaklaşık yarısındadır. Etrafındaki tüm gezegenler, asteroitler, kuyruklu yıldızlar ve Kuiper Kuşağı cisimleri onun güçlü kütleçekim kuyusu içinde yörüngede dolanırlar.',
    renk: 'text-yellow-400',
    discovery: {
      date: 'Tarih öncesi antik çağlar',
      discoverer: 'İnsanlık tarihi',
      history: 'Antik uygarlıklar Güneş’i tanrısal bir güç olarak kabul etmiş; 1920’lerde Arthur Eddington ve Cecilia Payne yıldızın hidrojen ve helyumdan oluşan nükleer füzyon mekanizmasını kanıtlamıştır.',
    },
    moonsInfo: {
      count: 0,
      notable: ['8 Gezegen', '5 Cüce Gezegen', 'Milyonlarca Asteroid'],
      description: 'Doğrudan doğal uydusu yoktur; Güneş Sistemi’ndeki tüm gezegen ve gök cisimleri onun çekimindedir.',
    },
    missions: [
      { name: 'SOHO', year: '1995', agency: 'ESA / NASA', role: 'Güneş taç küre ve rüzgar gözlemevi' },
      { name: 'SDO', year: '2010', agency: 'NASA', role: 'Sürekli yüksek çözünürlüklü manyetik ve UV izleme' },
      { name: 'Parker Solar Probe', year: '2018', agency: 'NASA', role: 'Güneş tacına en yakın dalış yapan araç' },
      { name: 'Solar Orbiter', year: '2020', agency: 'ESA / NASA', role: 'Kutup bölgelerini ilk kez görüntüleyen sonda' },
    ],
    observationTurkey: 'Güneş’e asla çıplak gözle veya korumasız dürbün/teleskopla bakılmamalıdır (anında kalıcı körlük riski). Yalnızca onaylı Baader filtreleri veya hidrojen-alfa güneş teleskoplarıyla güneş lekeleri güvenle gözlenebilir.',
    biliyorMuydun: [
      'Güneş çekirdeğinde üretilen bir fotonun yüzeye ulaşması yoğun çarpışmalar nedeniyle yaklaşık 100.000 yıl sürer; yüzeyden Dünya’ya ulaşması ise yalnızca 8 dakika 20 saniyedir.',
      'Güneş o denli büyüktür ki içerisine yaklaşık 1.3 milyon adet Dünya rahatlıkla sığabilir.',
      'Samanyolu galaksisi etrafındaki bir tam turunu yaklaşık 230 milyon yılda tamamlar (1 Kozmik Yıl).',
    ],
  },
  {
    id: 'merkur',
    name: 'Merkür',
    type: 'gezegen',
    description: 'Güneş’e en yakın ve Güneş Sistemi’ndeki en küçük gezegen.',
    image: '🪨',
    facts: {
      kütle: '3.30 × 10^23 kg',
      çap: '4,879 km',
      güneşeUzaklık: '57.9 milyon km',
      yörüngeSüresi: '88 Dünya günü',
      günSüresi: '59 Dünya günü',
      sıcaklık: '-173°C ila 427°C',
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: 'Merkür, Güneş’e en yakın ve Güneş Sistemi’ndeki en küçük gezegendir. Yüzeyi, tıpkı uydumuz Ay gibi, meteor çarpmalarının oluşturduğu sayısız kraterle kaplıdır. İnce bir atmosfere (ekzosfer) sahip olduğu için ısıyı tutamaz ve bu yüzden gece ile gündüz arasında muazzam sıcaklık farkları yaşanır.\n\nKendi ekseni etrafında oldukça yavaş dönerken, Güneş etrafındaki turunu çok hızlı tamamlar. Bu hızlı yörünge hareketi nedeniyle, gökyüzündeki hızlı hareketini gözlemleyen Romalılar ona haberci tanrı Merkür’ün adını vermiştir.',
    renk: 'text-gray-400',
    discovery: {
      date: 'MÖ 3000 (Sümerler)',
      discoverer: 'Antik Babil & Sümer astronomları',
      history: 'MÖ 14. yüzyıl MUL.APIN tabletlerinde "Udu.Idim.Gu\u005cu" adıyla kaydedilmiş; 1631’de Pierre Gassendi Merkür’ün Güneş önünden geçişini teleskopla gözlemlemiştir.',
    },
    moonsInfo: {
      count: 0,
      notable: [],
      description: 'Güneş’e olan aşırı yakınlığı ve kütleçekimsel gelgit kuvvetleri nedeniyle hiçbir doğal uydusu bulunmaz.',
    },
    missions: [
      { name: 'Mariner 10', year: '1974-1975', agency: 'NASA', role: 'Gezegene ilk yakın geçişi yapan ve fotoğraflayan sonda' },
      { name: 'MESSENGER', year: '2004-2015', agency: 'NASA', role: 'Merkür yörüngesine giren ilk yapay uydu' },
      { name: 'BepiColombo', year: '2018-günümüz', agency: 'ESA / JAXA', role: 'Kutup kraterlerindeki buzu araştıran ortak misyon' },
    ],
    observationTurkey: 'Güneş’e olan açısal yakınlığı nedeniyle yalnızca alacakaranlıkta (gün batımından hemen sonra batı ufkunda veya gün doğumundan hemen önce doğu ufkunda) ufka çok yakınken çıplak gözle kısa süreliğine izlenebilir.',
    biliyorMuydun: [
      'Güneş’e en yakın gezegen olmasına rağmen en sıcağı değildir; atmosferi olmadığı için Venüs’ün sera etkisi Merkür’ün sıcaklığını geride bırakır.',
      'Güneş ışığı almayan derin kutup kraterlerinin tabanında kalıcı su buzu yatakları tespit edilmiştir.',
      'Yörünge rezonansı 3:2 olduğu için Merkür’de iki gündoğumu arasında geçen süre gezegenin iki yılından daha uzundur.',
    ],
  },
  {
    id: 'venus',
    name: 'Venüs',
    type: 'gezegen',
    description: 'Sistemimizin en sıcak gezegeni ve Dünya’nın ikizi.',
    image: '✨',
    facts: {
      kütle: '4.87 × 10^24 kg',
      çap: '12,104 km',
      güneşeUzaklık: '108.2 milyon km',
      yörüngeSüresi: '225 Dünya günü',
      günSüresi: '243 Dünya günü',
      sıcaklık: '462°C',
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: 'Venüs, Güneş’e olan uzaklık bakımından ikinci sıradadır. Büyüklüğü ve kütlesi açısından Dünya’ya çok benzediği için "Dünya’nın ikizi" olarak adlandırılır. Ancak çok yoğun bir karbondioksit atmosferine sahiptir ve bu yoğun atmosfer aşırı bir sera etkisine neden olarak Venüs’ü Güneş Sistemi’nin en sıcak gezegeni yapar.\n\nVenüs, diğer çoğu gezegenin aksine kendi ekseni etrafında ters yönde döner. Yani Venüs’te Güneş batıdan doğar ve doğudan batar. Gökyüzünde çok parlak göründüğü için "Akşam Yıldızı" veya "Çoban Yıldızı" olarak da bilinir.',
    renk: 'text-orange-300',
    discovery: {
      date: 'Antik çağlar',
      discoverer: 'İlk medeniyetler',
      history: 'Babil tabletlerinde "İştar" olarak anıldı. 1610’da Galileo Galilei teleskopla Venüs’ün Ay gibi hilal ve dolunay evreleri gösterdiğini kanıtlayarak Kopernik modelini doğruladı.',
    },
    moonsInfo: {
      count: 0,
      notable: [],
      description: 'Venüs’ün doğal uydusu yoktur.',
    },
    missions: [
      { name: 'Venera 7', year: '1970', agency: 'SSCB', role: 'Başka bir gezegenin yüzeyine başarıyla inen ilk insan aracı' },
      { name: 'Magellan', year: '1989-1994', agency: 'NASA', role: 'Radar ile kalın bulutların altındaki yüzeyin %98’ini haritaladı' },
      { name: 'Venus Express', year: '2005-2014', agency: 'ESA', role: 'Atmosfer kimyası ve güney kutbu girdabını inceledi' },
      { name: 'Akatsuki', year: '2015-günümüz', agency: 'JAXA', role: 'Süper dönen fırtına katmanlarını izleyen yörünge sondası' },
    ],
    observationTurkey: 'Ay’dan sonra gökyüzünün en parlak doğal cismidir (-4.4 kadir). Türkiye’den günbatımında batıda veya şafakta doğuda parıldar; küçük bir dürbünle bile hilal evresi kolaylıkla seçilebilir.',
    biliyorMuydun: [
      'Yüzeyindeki atmosferik basınç 92 bardır; bu Dünya okyanuslarının 900 metre derinliğindeki ezici basınca denktir.',
      'Venüs’ün bir günü (243 Dünya günü), kendi yılından (225 Dünya günü) daha uzundur.',
      'Atmosferinde sülfürik asit yağmurları yağar; ancak yüzeydeki aşırı sıcaklık nedeniyle bu damlalar yere ulaşamadan buharlaşır.',
    ],
  },
  {
    id: 'dunya',
    name: 'Dünya',
    type: 'gezegen',
    description: 'Üzerinde yaşam barındırdığı bilinen tek gök cismi.',
    image: '🌍',
    facts: {
      kütle: '5.97 × 10^24 kg',
      çap: '12,742 km',
      güneşeUzaklık: '149.6 milyon km',
      yörüngeSüresi: '365.25 Dünya günü',
      günSüresi: '24 saat',
      sıcaklık: '15°C (ortalama)',
      uyduSayısı: 1,
      halkaSistemi: false,
    },
    detay: 'Dünya, Güneş’e uzaklık açısından üçüncü gezegendir ve evrende üzerinde yaşam barındırdığı bilinen tek gök cismidir. Yüzeyinin yaklaşık %71’i sıvı halde suyla kaplıdır, bu da biyokimyasal yaşamın varlığı için çok kritiktir. Etrafını saran atmosfer, hem canlılara nefes alacakları oksijeni sağlar hem de Güneş’in zararlı morötesi radyasyonundan korur.\n\nAktif bir tektonik levha sistemine ve iç çekirdeğindeki dinamo etkisiyle oluşan güçlü bir manyetik alana sahiptir. Tek doğal uydusu olan Ay, Dünya’nın dönüş eksenini stabilize eder ve okyanuslardaki gelgit olaylarının temel nedenidir.',
    renk: 'text-blue-400',
    discovery: {
      date: 'MÖ 240 (Çevre ölçümü)',
      discoverer: 'Eratosthenes',
      history: 'İskenderiye ve Syene şehirlerindeki gölge boylarını trigonometriyle karşılaştıran Eratosthenes, Dünya’nın küresel çevresini %2’den daha az bir hatayla hesaplamıştır.',
    },
    moonsInfo: {
      count: 1,
      notable: ['Ay (Luna)'],
      description: 'Güneş Sistemi’ndeki ana gezegenine oranla en büyük uydulardan biridir; Dünya eksen eğikliğini stabilize eder.',
    },
    missions: [
      { name: 'Apollo 8', year: '1968', agency: 'NASA', role: 'İnsanlık tarihinin ilk "Earthrise" (Dünya Doğuşu) fotoğrafı' },
      { name: 'Landsat Filosu', year: '1972-günümüz', agency: 'NASA / USGS', role: 'Yarım asırdır kesintisiz Dünya yüzey gözlemi' },
      { name: 'Copernicus Sentinel', year: '2014-günümüz', agency: 'ESA / AB', role: 'İklim, okyanus ve atmosfer izleme takımyıldızı' },
    ],
    observationTurkey: 'Türkiye 36° - 42° Kuzey enlemlerinde yer alır ve ılıman iklim kuşağında dört mevsimin dengeli yaşandığı zengin bir coğrafi gözlem platformudur.',
    biliyorMuydun: [
      'Güneş Sistemi’nde levha tektoniği aktif olan ve kabuğu sürekli yenilenen tek gezegendir.',
      'Ay’ın kütleçekimsel gelgit sürtünmesi nedeniyle Dünya’nın kendi ekseninde dönüşü her yüzyılda yaklaşık 1.8 milisaniye yavaşlamaktadır.',
      'İç çekirdeğinin sıcaklığı yaklaşık 5.400°C olup Güneş’in yüzey sıcaklığına oldukça yakındır.',
    ],
  },
  {
    id: 'ay',
    name: 'Ay',
    type: 'ay',
    description: 'Dünya’nın tek doğal uydusu ve insanın ayak bastığı tek gök cismi.',
    image: '🌕',
    facts: {
      kütle: '7.34 × 10^22 kg',
      çap: '3,474 km',
      güneşeUzaklık: '149.6 milyon km (Dünya üzerinden)',
      yörüngeSüresi: '27.3 Dünya günü',
      günSüresi: '27.3 Dünya günü',
      sıcaklık: '-173°C ila 127°C',
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: 'Ay, Dünya’nın tek doğal uydusu ve Güneş Sistemi’ndeki en büyük beşinci uydudur. Dünya etrafındaki dönüş süresi ile kendi ekseni etrafındaki dönüş süresi tam olarak eşitlendiği için (kütleçekimsel kilitlenme) Dünya’dan her zaman Ay’ın aynı yüzünü (yakın yüz) görürüz.\n\nAy’ın yüzeyi meteor çarpmalarından oluşan kraterler ve antik bazaltik lav ovalarıyla (maria) kaplıdır. İnsanoğlu tarafından bizzat ziyaret edilen Dünya dışındaki tek gök cismidir. Atmosferi olmadığı için yüzey sıcaklıkları aşırı uçlar arasında dalgalanır.',
    renk: 'text-gray-300',
    discovery: {
      date: 'Tarih öncesi',
      discoverer: 'İnsanlık',
      history: '1609’da Galileo Galilei teleskobunu Ay’a çevirerek pürüzsüz göksel küre dogmasını yıktı; dağları, vadileri ve kraterleri haritaladı.',
    },
    moonsInfo: {
      count: 0,
      notable: [],
      description: 'Kendisi Dünya’nın doğal uydusudur.',
    },
    missions: [
      { name: 'Luna 2', year: '1959', agency: 'SSCB', role: 'Ay yüzeyine ulaşan ilk insan yapımı nesne' },
      { name: 'Apollo 11', year: '1969', agency: 'NASA', role: 'Neil Armstrong ve Buzz Aldrin ile ilk insanlı iniş' },
      { name: 'Chang’e 4', year: '2019', agency: 'CNSA', role: 'Ay’ın uzak yüzüne (arka yüz) ilk yumuşak iniş' },
      { name: 'Artemis Programı', year: '2024-günümüz', agency: 'NASA / ESA', role: 'Kalıcı üs ve kadın astronot hedefli yeni dönem' },
    ],
    observationTurkey: 'Çıplak gözle dahi Tycho krateri ışınları ve lav denizleri seçilebilir. Sıradan bir dürbünle aydınlık-karanlık çizgisindeki (terminatör) krater derinlikleri muazzam bir üç boyutlu etkiyle izlenir.',
    biliyorMuydun: [
      'Ay her yıl Dünya’dan yaklaşık 3.8 santimetre uzaklaşmaktadır.',
      'Ay’da rüzgar veya atmosferik aşınma olmadığı için Apollo astronotlarının 1969’daki ayak izleri milyonlarca yıl bozulmadan kalacaktır.',
      'Ay’ın arka yüzü ilk kez 1959 yılında Sovyet uzay aracı Luna 3 tarafından fotoğraflanana kadar insanlık tarafından hiç görülmemiştir.',
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'gezegen',
    description: 'Yüzeyindeki demir oksit nedeniyle Kızıl Gezegen olarak bilinir.',
    image: '🔴',
    facts: {
      kütle: '6.39 × 10^23 kg',
      çap: '6,779 km',
      güneşeUzaklık: '227.9 milyon km',
      yörüngeSüresi: '687 Dünya günü',
      günSüresi: '24.6 saat',
      sıcaklık: '-60°C (ortalama)',
      uyduSayısı: 2,
      halkaSistemi: false,
    },
    detay: 'Mars, Güneş’ten itibaren dördüncü gezegendir ve yüzeyindeki yaygın demir oksit (pas) tozu nedeniyle "Kızıl Gezegen" olarak adlandırılır. İnce bir karbondioksit atmosferine sahiptir ve yüzeyinde kurumuş nehir yatakları ile devasa kanyonlar (Valles Marineris) bulunur.\n\nGüneş Sistemi’nin bilinen en yüksek dağı olan ve sönmüş bir kalkan yanardağı olan Olympus Mons Mars’ta bulunur. Geçmişte sıvı suya ve belki de yaşama elverişli şartlara sahip olduğu kanıtlanan Mars, günümüzde insanlığın gezegenler arası keşif vizyonunun odak noktasıdır.',
    renk: 'text-red-500',
    discovery: {
      date: 'Antik Babil & Mısır',
      discoverer: 'İlk astronomlar',
      history: 'Mısırlılar "Kızıl Olan" (Her Desher) adını verdi. 1659’da Christiaan Huygens Mars üzerindeki ilk kalıcı yüzey detayını (Syrtis Major) çizdi ve dönüş süresini hesapladı.',
    },
    moonsInfo: {
      count: 2,
      notable: ['Phobos (Korku)', 'Deimos (Dehşet)'],
      description: 'Her ikisi de Mars’ın kütleçekimiyle yakalanmış patates biçimli karbonlu asteroidlerdir.',
    },
    missions: [
      { name: 'Viking 1 & 2', year: '1976', agency: 'NASA', role: 'Mars yüzeyinden ilk başarılı panoramik renkli fotoğraflar ve biyoloji testleri' },
      { name: 'Curiosity', year: '2012-günümüz', agency: 'NASA', role: 'Gale kraterinde antik göl yatağı ve organik molekül keşifleri' },
      { name: 'Perseverance & Ingenuity', year: '2021-günümüz', agency: 'NASA', role: 'Jezero kraterinde numune toplama ve ilk motorlu uzay helikopteri' },
    ],
    observationTurkey: 'Yaklaşık her 26 ayda bir karşı konumda (opozisyon) Dünya’ya en yakın noktaya gelir. Bu dönemde gece boyunca güney ufkunda çok parlak pas kırmızısı bir fener gibi çıplak gözle parıldar.',
    biliyorMuydun: [
      'Olympus Mons yanardağı 22 km yüksekliğiyle Everest’in yaklaşık 2.5 katıdır ve tabanı tüm Fransa büyüklüğündedir.',
      'Valles Marineris kanyon sistemi 4.000 km uzunluğundadır; Dünya’daki Büyük Kanyon’dan 10 kat daha uzun ve 5 kat daha derindir.',
      'Uydusu Phobos Mars’a giderek yaklaşmaktadır ve yaklaşık 50 milyon yıl sonra parçalanarak Satürn benzeri bir halka oluşturacaktır.',
    ],
  },
  {
    id: 'jupiter',
    name: 'Jüpiter',
    type: 'gezegen',
    description: 'Güneş Sistemi’nin en büyük gezegeni, bir gaz devi.',
    image: '🟠',
    facts: {
      kütle: '1.898 × 10^27 kg',
      çap: '139,820 km',
      güneşeUzaklık: '778.5 milyon km',
      yörüngeSüresi: '11.9 Dünya yılı',
      günSüresi: '9.9 saat',
      sıcaklık: '-145°C (bulut tepeleri)',
      uyduSayısı: 95,
      halkaSistemi: true,
    },
    detay: 'Jüpiter, Güneş Sistemi’nin tartışmasız en büyük gezegenidir. Kütlesi, sistemdeki diğer tüm gezegenlerin toplam kütlesinin iki buçuk katından fazladır. Büyük oranda hidrojen ve helyumdan oluşan bir gaz devidir. Güçlü bir manyetik alana ve muazzam fırtınalara ev sahipliği yapar.\n\nEn ünlü fırtınası, Dünya’dan bile daha büyük olan ve yüzyıllardır devam eden "Büyük Kırmızı Leke"dir. Jüpiter’in Ganymede, Callisto, Io ve Europa gibi çok sayıda ve çeşitli yapıda uydusu bulunur. Çok silik toz halkalarına da sahiptir.',
    renk: 'text-orange-400',
    discovery: {
      date: 'Antik çağlar',
      discoverer: 'İlk medeniyetler',
      history: '1610 yılında Galileo Galilei kendi yaptığı teleskopla Jüpiter’in etrafında dolanan dört parlak uyduyu keşfederek Güneş-merkezli devrimi başlatmıştır.',
    },
    moonsInfo: {
      count: 95,
      notable: ['Ganymede (En büyük uydu)', 'Europa (Buz altı okyanus)', 'Io (Volkanik)', 'Callisto'],
      description: 'Dört dev Galileo uydusu adeta minyatür bir güneş sistemi gibi Jüpiter’in yörüngesinde dolanır.',
    },
    missions: [
      { name: 'Voyager 1 & 2', year: '1979', agency: 'NASA', role: 'Io’daki aktif volkanları ve Jüpiter’in ince halkalarını ilk kez görüntüledi' },
      { name: 'Galileo', year: '1995-2003', agency: 'NASA', role: 'Jüpiter yörüngesinde ilk uzun süreli araştırma ve atmosferik sonda' },
      { name: 'Juno', year: '2016-günümüz', agency: 'NASA', role: 'Kutup girdaplarını ve derin manyetik çekirdeği haritalayan aktif sonda' },
      { name: 'JUICE', year: '2023-günümüz', agency: 'ESA', role: 'Buzlu okyanus uydularını (Ganymede, Europa) keşif yolculuğu' },
    ],
    observationTurkey: 'Venüs’ten sonra gökyüzünün en parlak gezegenidir (-2.7 kadir). Sıradan bir 10x50 dürbünle bile 4 Galileo uydusu yan yana dizilmiş noktalar halinde net görünür; küçük bir teleskopla bulut kuşakları izlenebilir.',
    biliyorMuydun: [
      'Güneş Sistemi’nin en kısa gününe sahiptir; devasa gövdesi kendi ekseni etrafında yalnızca 9 saat 55 dakikada döner.',
      'En büyük uydusu Ganymede, Merkür gezegeninden ve cüce gezegen Plüton’dan daha büyüktür ve kendi manyetik alanına sahiptir.',
      'Devasa kütleçekimi sayesinde iç gezegenlere yönelecek sayısız kuyruklu yıldızı yutarak veya saptırarak Dünya için bir kozmik kalkan görevi görür.',
    ],
  },
  {
    id: 'saturn',
    name: 'Satürn',
    type: 'gezegen',
    description: 'Muhteşem halka sistemiyle bilinen gaz devi.',
    image: '🪐',
    facts: {
      kütle: '5.68 × 10^26 kg',
      çap: '116,460 km',
      güneşeUzaklık: '1.4 milyar km',
      yörüngeSüresi: '29.5 Dünya yılı',
      günSüresi: '10.7 saat',
      sıcaklık: '-178°C',
      uyduSayısı: 146,
      halkaSistemi: true,
    },
    detay: 'Satürn, Güneş Sistemi’ndeki en büyük ikinci gezegendir ve muazzam güzellikteki belirgin halka sistemiyle tanınır. Bu halkalar milyarlarca buz ve kaya parçasından oluşur. Tıpkı Jüpiter gibi, temel olarak hidrojen ve helyumdan oluşan bir gaz devidir.\n\nSatürn, Güneş Sistemi’nde sudan daha az yoğunluğa sahip tek gezegendir; o kadar hafiftir ki yeterince büyük bir okyanus olsaydı üzerinde yüzebilirdi. Titan adlı en büyük uydusu, yoğun bir atmosfere ve yüzeyinde sıvı metan göllerine sahip olduğu bilinen tek uydudur.',
    renk: 'text-amber-200',
    discovery: {
      date: 'Antik çağlar',
      discoverer: 'İlk medeniyetler',
      history: '1610’da Galileo halkaları "üçlü gövde" veya kulaklar sandı; 1655’te Christiaan Huygens bunların gezegene değmeyen ince bir halka olduğunu çözdü ve Titan’ı keşfetti.',
    },
    moonsInfo: {
      count: 146,
      notable: ['Titan (Atmosferli dev)', 'Enceladus (Gayzerli buz uydusu)', 'Mimas ("Ölüm Yıldızı")', 'Iapetus'],
      description: 'Güneş Sistemi’nde en çok doğal uyduya sahip gezegendir; Titan tek başına sistemdeki uydu kütlesinin %96’sını oluşturur.',
    },
    missions: [
      { name: 'Pioneer 11', year: '1979', agency: 'NASA', role: 'Satürn’ün halkalarını yakından geçen ilk uzay aracı' },
      { name: 'Voyager 1 & 2', year: '1980-1981', agency: 'NASA', role: 'Halka yapısındaki binlerce ince iplikçiği ve Titan atmosferini belgeledi' },
      { name: 'Cassini-Huygens', year: '1997-2017', agency: 'NASA / ESA', role: '13 yıl yörüngede kalarak Titan yüzeyine indi ve Enceladus gayzerlerini keşfetti' },
    ],
    observationTurkey: 'Altın rengi sakin parıltısıyla çıplak gözle parlak bir yıldız gibi parlar (+0.2 kadir). 60-70 mm’lik küçük bir amatör teleskopla bile halkaları ve Cassini ayrımı büyüleyici şekilde görülebilir.',
    biliyorMuydun: [
      '280.000 kilometreye varan genişliğine rağmen halkaların ortalama kalınlığı şaşırtıcı şekilde yalnızca 10 ila 30 metre civarındadır.',
      'Yoğunluğu 0.687 g/cm³ olup sudan düşüktür; yeterince dev bir küvette yüzebilecek tek gezegendir.',
      'Kuzey kutbunda altıgen şeklinde dönen devasa ve gizemli bir atmosferik fırtına ("Satürn Altıgeni") bulunur.',
    ],
  },
  {
    id: 'uranus',
    name: 'Uranüs',
    type: 'gezegen',
    description: 'Yan yatan ekseniyle bilinen soğuk bir buz devi.',
    image: '🧊',
    facts: {
      kütle: '8.68 × 10^25 kg',
      çap: '50,724 km',
      güneşeUzaklık: '2.9 milyar km',
      yörüngeSüresi: '84 Dünya yılı',
      günSüresi: '17.2 saat',
      sıcaklık: '-224°C',
      uyduSayısı: 28,
      halkaSistemi: true,
    },
    detay: 'Uranüs, teleskopla keşfedilen ilk gezegendir. Jüpiter ve Satürn’den farklı olarak yapısında daha fazla su, amonyak ve metan buzu içerdiği için bir "buz devi" olarak sınıflandırılır. Atmosferindeki metan gazı ona açık mavi / turkuaz bir renk verir.\n\nUranüs’ün en belirgin özelliği, dönüş ekseninin neredeyse yörünge düzlemine paralel olmasıdır (97.77° eğiklik). Adeta yan yatmış bir varil gibi yuvarlanarak döner. Bu sıradışı durumun, geçmişte Dünya büyüklüğünde bir ön-gezegenin çarpmasıyla oluştuğu düşünülmektedir.',
    renk: 'text-cyan-300',
    discovery: {
      date: '13 Mart 1781',
      discoverer: 'William Herschel',
      history: 'İngiltere’nin Bath kentinde ev yapımı yansıtmalı teleskobuyla gökyüzü taraması yaparken keşfetti; önce kuyruklu yıldız sandı, ardından yörüngesini hesaplayarak gezegen olduğunu duyurdu.',
    },
    moonsInfo: {
      count: 28,
      notable: ['Titania', 'Oberon', 'Umbriel', 'Ariel', 'Miranda'],
      description: 'Tüm uyduları adlarını William Shakespeare ve Alexander Pope’un edebi eserlerindeki karakterlerden almıştır.',
    },
    missions: [
      { name: 'Voyager 2', year: 'Ocak 1986', agency: 'NASA', role: 'Uranüs’ü yakından ziyaret eden ve halkalarını detaylandıran tek insan yapımı araç' },
    ],
    observationTurkey: '+5.7 kadir parlaklığıyla ideal karanlık bir kırsal gökyüzünde (Bortle 1-2) sınırda çıplak gözle seçilebilir. Şehirlerde ise küçük bir dürbünle soluk camgöbeği bir nokta olarak kolayca bulunur.',
    biliyorMuydun: [
      'Dönüş ekseni 98 derece yatık olduğu için kutupları 42 yıl kesintisiz gündüz, ardından 42 yıl kesintisiz karanlık kış yaşar.',
      'Güneş Sistemi’nin ölçülen en düşük atmosfer sıcaklığına (-224°C) ev sahipliği yapar.',
      'Etrafında son derece koyu renkte 13 dar toz halkası bulunur.',
    ],
  },
  {
    id: 'neptun',
    name: 'Neptün',
    type: 'gezegen',
    description: 'Güneş Sistemi’nin en uzak ve en rüzgarlı gezegeni.',
    image: '🔵',
    facts: {
      kütle: '1.02 × 10^26 kg',
      çap: '49,244 km',
      güneşeUzaklık: '4.5 milyar km',
      yörüngeSüresi: '165 Dünya yılı',
      günSüresi: '16 saat',
      sıcaklık: '-214°C',
      uyduSayısı: 16,
      halkaSistemi: true,
    },
    detay: 'Neptün, Güneş’e bilinen en uzak sekizinci gezegendir. Matematiksel hesaplamalar sonucunda varlığı öngörülüp daha sonra gözlemlenerek keşfedilen tek gezegendir. Koyu kobalt mavisi rengi ve Uranüs gibi bir buz devi olmasıyla dikkat çeker.\n\nGüneş Sistemi’ndeki en şiddetli rüzgarlara ev sahipliği yapar; rüzgar hızları saatte 2.100 kilometreye ulaşabilir. En büyük uydusu Triton, gezegenin kendi dönüş yönünün tersine yörüngede döner, bu da onun bir zamanlar bağımsız bir Kuiper Kuşağı cismi olduğunu ve Neptün’ün çekimine yakalandığını gösterir.',
    renk: 'text-blue-600',
    discovery: {
      date: '23 Eylül 1846',
      discoverer: 'Urbain Le Verrier & Johann Galle',
      history: 'Uranüs yörüngesindeki sapmaları inceleyen Fransız matematikçi Le Verrier bilinmeyen bir kütlenin koordinatını hesapladı; Berlin Gözlemevi’nden Johann Galle teleskopla öngörülen noktaya bakarak gezegeni ilk gecede buldu.',
    },
    moonsInfo: {
      count: 16,
      notable: ['Triton (Ters yörüngeli kriyovolkanik dev)', 'Proteus', 'Nereid'],
      description: 'Triton yüzeyinde sıvı azot gayzerleri püskürten dondurucu bir jeolojik aktiviteye sahiptir.',
    },
    missions: [
      { name: 'Voyager 2', year: 'Ağustos 1989', agency: 'NASA', role: 'Neptün’e ve Triton’a yaklaşan tek uzay aracı; Büyük Karanlık Leke’yi keşfetti' },
    ],
    observationTurkey: '+7.8 kadir parlaklığı nedeniyle çıplak gözle görülemez. Türkiye’den izlemek için en az 70-80 mm açıklıklı bir teleskop veya iyi bir astronomik dürbün gereklidir; minik masmavi bir disk olarak seçilir.',
    biliyorMuydun: [
      'Güneş Sistemi’nin en hızlı rüzgarlarına sahiptir; saatte 2.100 km hıza ulaşan rüzgarlar ses hızının neredeyse iki katıdır.',
      'Güneş etrafındaki tek bir turu 165 yıl sürer; 1846’daki keşfinden sonraki ilk tam turunu ancak 2011 yılında tamamlamıştır.',
      'Masmavi rengini üst atmosferindeki metan gazının kırmızı ışığı emip mavi ışığı yansıtmasından alır.',
    ],
  },
  {
    id: 'pluton',
    name: 'Plüton',
    type: 'cüce-gezegen',
    description: 'Kuiper Kuşağı’nın en ünlü cüce gezegeni.',
    image: '🌑',
    facts: {
      kütle: '1.30 × 10^22 kg',
      çap: '2,376 km',
      güneşeUzaklık: '5.9 milyar km',
      yörüngeSüresi: '248 Dünya yılı',
      günSüresi: '153.3 saat',
      sıcaklık: '-225°C',
      uyduSayısı: 5,
      halkaSistemi: false,
    },
    detay: 'Plüton, 1930 yılında keşfedilmiş ve 2006 yılına kadar Güneş Sistemi’nin dokuzuncu gezegeni kabul edilmiştir. Ancak benzer boyuttaki diğer Kuiper Kuşağı cisimlerinin keşfedilmesiyle Uluslararası Astronomi Birliği (IAU) tarafından "cüce gezegen" sınıfına dahil edilmiştir.\n\nYüzeyi dağlık ve dondurucu soğukluktadır. Azot, metan ve karbonmonoksit buzlarıyla kaplıdır. Plüton’un uydusu Charon o kadar büyüktür ki, ikisi birlikte adeta ikili bir cüce gezegen sistemi gibi kendi aralarındaki bir kütle merkezinin (barycenter) etrafında dönerler.',
    renk: 'text-slate-400',
    discovery: {
      date: '18 Şubat 1930',
      discoverer: 'Clyde Tombaugh',
      history: 'Arizona Lowell Gözlemevi’nde fotoğraf plakalarını "blink comparator" mikroskobuyla haftalarca karşılaştıran genç astronom Clyde Tombaugh tarafından bulundu.',
    },
    moonsInfo: {
      count: 5,
      notable: ['Charon (Yarı çapında dev)', 'Nix', 'Hydra', 'Kerberos', 'Styx'],
      description: 'Charon ile Plüton kütleçekimsel olarak birbirine karşılıklı kilitlenmiştir; gökyüzünde hep aynı konumda asılı dururlar.',
    },
    missions: [
      { name: 'New Horizons', year: '14 Temmuz 2015', agency: 'NASA', role: 'Plüton’un yanından 12.500 km mesafeden geçerek meşhur kalp şeklindeki azot buzulunu fotoğrafladı' },
    ],
    observationTurkey: '+14 kadir sönüklüğü nedeniyle küçük amatör teleskoplarla görülemez. Gözlemlemek için en az 250-300 mm açıklıklı büyük teleskoplar ve uzun pozlamalı CCD astrofotografi sistemleri gerekir.',
    biliyorMuydun: [
      'Yüzeyindeki devasa açık renkli kalp biçimi ("Tombaugh Regio"), sıvı azotun konveksiyonla yüzeye çıktığı genç ve pürüzsüz bir buz okyanusudur.',
      'Yüzölçümü yaklaşık 17.7 milyon kilometrekare olup Rusya’nın yüzölçümünden biraz daha küçüktür.',
      'Yörüngesi öylesine eliptiktir ki 248 yıllık turunun 20 yılında (en son 1979-1999 arasında) Güneş’e Neptün’den daha yakın olmuştur.',
    ],
  },
];
