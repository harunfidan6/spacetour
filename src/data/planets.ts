export interface CelestialBody {
  id: string;
  name: string;
  type: 'gezegen' | 'cüce-gezegen' | 'yıldız' | 'ay';
  description: string;
  image: string; // emoji for now
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
  detay: string; // 2-3 paragraph detailed Turkish description
  renk: string; // tailwind color for accent
}

export const planets: CelestialBody[] = [
  {
    id: "gunes",
    name: "Güneş",
    type: "yıldız",
    description: "Sistemimizin merkezindeki sarı cüce yıldız.",
    image: "☀️",
    facts: {
      kütle: "1.989 × 10^30 kg",
      çap: "1.39 milyon km",
      güneşeUzaklık: "0 km",
      yörüngeSüresi: "Yok",
      günSüresi: "27 Dünya günü",
      sıcaklık: "5,500°C (yüzey)",
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: "Güneş, Güneş Sistemi'nin merkezinde yer alan ve ısı ile ışık kaynağımız olan orta büyüklükte bir sarı cüce yıldızdır. Sistemin toplam kütlesinin %99.8'ini tek başına oluşturur. Çekirdeğindeki termonükleer füzyon reaksiyonları sayesinde devasa miktarda enerji üretir.\n\nYaklaşık 4.6 milyar yaşında olan Güneş, yaşamının en kararlı evresi olan anakol evresindedir. Etrafındaki tüm gezegenler, asteroitler, kuyruklu yıldızlar ve diğer gök cisimleri onun güçlü yerçekimi etkisi altında yörüngede dolanırlar.",
    renk: "text-yellow-400"
  },
  {
    id: "merkur",
    name: "Merkür",
    type: "gezegen",
    description: "Güneş'e en yakın ve Güneş Sistemi'ndeki en küçük gezegen.",
    image: "🪨",
    facts: {
      kütle: "3.30 × 10^23 kg",
      çap: "4,879 km",
      güneşeUzaklık: "57.9 milyon km",
      yörüngeSüresi: "88 Dünya günü",
      günSüresi: "59 Dünya günü",
      sıcaklık: "-173°C ila 427°C",
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: "Merkür, Güneş'e en yakın ve Güneş Sistemi'ndeki en küçük gezegendir. Yüzeyi, tıpkı uydumuz Ay gibi, meteor çarpmalarının oluşturduğu sayısız kraterle kaplıdır. İnce bir atmosfere (ekzosfer) sahip olduğu için ısıyı tutamaz ve bu yüzden gece ile gündüz arasında muazzam sıcaklık farkları yaşanır.\n\nKendi ekseni etrafında oldukça yavaş dönerken, Güneş etrafındaki turunu çok hızlı tamamlar. Bu hızlı yörünge hareketi nedeniyle, gökyüzündeki hızlı hareketini gözlemleyen Romalılar ona haberci tanrı Merkür'ün adını vermiştir.",
    renk: "text-gray-400"
  },
  {
    id: "venus",
    name: "Venüs",
    type: "gezegen",
    description: "Sistemimizin en sıcak gezegeni ve Dünya'nın 'kız kardeşi'.",
    image: "✨",
    facts: {
      kütle: "4.87 × 10^24 kg",
      çap: "12,104 km",
      güneşeUzaklık: "108.2 milyon km",
      yörüngeSüresi: "225 Dünya günü",
      günSüresi: "243 Dünya günü",
      sıcaklık: "462°C",
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: "Venüs, Güneş'e olan uzaklık bakımından ikinci sıradadır. Büyüklüğü ve kütlesi açısından Dünya'ya çok benzediği için 'Dünya'nın kız kardeşi' olarak da adlandırılır. Ancak çok yoğun bir karbondioksit atmosferine sahiptir ve bu yoğun atmosfer aşırı bir sera etkisine neden olarak Venüs'ü Güneş Sistemi'nin en sıcak gezegeni yapar.\n\nVenüs, diğer çoğu gezegenin aksine kendi ekseni etrafında ters yönde döner. Yani Venüs'te Güneş batıdan doğar ve doğudan batar. Gökyüzünde çok parlak göründüğü için 'Akşam Yıldızı' veya 'Sabah Yıldızı' (Çoban Yıldızı) olarak da bilinir.",
    renk: "text-orange-300"
  },
  {
    id: "dunya",
    name: "Dünya",
    type: "gezegen",
    description: "Üzerinde yaşam barındırdığı bilinen tek gök cismi.",
    image: "🌍",
    facts: {
      kütle: "5.97 × 10^24 kg",
      çap: "12,742 km",
      güneşeUzaklık: "149.6 milyon km",
      yörüngeSüresi: "365.25 Dünya günü",
      günSüresi: "24 saat",
      sıcaklık: "15°C (ortalama)",
      uyduSayısı: 1,
      halkaSistemi: false,
    },
    detay: "Dünya, Güneş'e uzaklık açısından üçüncü gezegendir ve evrende üzerinde yaşam barındırdığı bilinen tek gök cismidir. Yüzeyinin yaklaşık %71'i sıvı halde suyla kaplıdır, bu da yaşamın varlığı için çok kritiktir. Etrafını saran atmosfer, hem canlılara nefes alacakları oksijeni sağlar hem de Güneş'in zararlı radyasyonundan korur.\n\nAktif bir tektonik levha sistemine ve güçlü bir manyetik alana sahiptir. Tek doğal uydusu olan Ay, Dünya'nın dönüş eksenini stabilize eder ve okyanuslardaki gelgit olaylarının temel nedenidir.",
    renk: "text-blue-400"
  },
  {
    id: "ay",
    name: "Ay",
    type: "ay",
    description: "Dünya'nın tek doğal uydusu ve insanoğlunun ayak bastığı tek gök cismi.",
    image: "🌕",
    facts: {
      kütle: "7.34 × 10^22 kg",
      çap: "3,474 km",
      güneşeUzaklık: "149.6 milyon km (Dünya üzerinden)",
      yörüngeSüresi: "27.3 Dünya günü",
      günSüresi: "27.3 Dünya günü",
      sıcaklık: "-173°C ila 127°C",
      uyduSayısı: 0,
      halkaSistemi: false,
    },
    detay: "Ay, Dünya'nın tek doğal uydusu ve Güneş Sistemi'ndeki en büyük beşinci uydudur. Dünya etrafındaki dönüş süresi ile kendi ekseni etrafındaki dönüş süresi aynı olduğu için Dünya'dan her zaman Ay'ın aynı yüzünü (yakın yüz) görürüz.\n\nAy'ın yüzeyi meteor çarpmalarından oluşan kraterler ve lav denizleriyle kaplıdır. İnsanoğlu tarafından ziyaret edilen, Dünya dışındaki tek gök cismidir. Atmosferi yoktur, bu sebeple yüzey sıcaklıkları çok değişkendir.",
    renk: "text-gray-300"
  },
  {
    id: "mars",
    name: "Mars",
    type: "gezegen",
    description: "Yüzeyindeki demir oksit nedeniyle Kızıl Gezegen olarak bilinir.",
    image: "🔴",
    facts: {
      kütle: "6.39 × 10^23 kg",
      çap: "6,779 km",
      güneşeUzaklık: "227.9 milyon km",
      yörüngeSüresi: "687 Dünya günü",
      günSüresi: "24.6 saat",
      sıcaklık: "-60°C (ortalama)",
      uyduSayısı: 2,
      halkaSistemi: false,
    },
    detay: "Mars, Güneş'ten itibaren dördüncü gezegendir ve yüzeyindeki yaygın demir oksit (pas) tozu nedeniyle 'Kızıl Gezegen' olarak adlandırılır. İnce bir karbondioksit atmosferine sahiptir ve yüzeyinde kurumuş nehir yatakları ile devasa kanyonlar (Valles Marineris) bulunur.\n\nGüneş Sistemi'nin bilinen en yüksek dağı olan ve sönmüş bir yanardağ olan Olympus Mons Mars'ta bulunur. Geçmişte sıvı suya ve belki de yaşama elverişli şartlara sahip olduğu düşünülen Mars, şu an uzay araştırmalarının en büyük hedeflerinden biridir.",
    renk: "text-red-500"
  },
  {
    id: "jupiter",
    name: "Jüpiter",
    type: "gezegen",
    description: "Güneş Sistemi'nin en büyük gezegeni, bir gaz devi.",
    image: "🟠",
    facts: {
      kütle: "1.898 × 10^27 kg",
      çap: "139,820 km",
      güneşeUzaklık: "778.5 milyon km",
      yörüngeSüresi: "11.9 Dünya yılı",
      günSüresi: "9.9 saat",
      sıcaklık: "-145°C (bulut tepeleri)",
      uyduSayısı: 95,
      halkaSistemi: true,
    },
    detay: "Jüpiter, Güneş Sistemi'nin en büyük gezegenidir. Kütlesi, sistemdeki diğer tüm gezegenlerin toplam kütlesinin iki buçuk katından fazladır. Büyük oranda hidrojen ve helyumdan oluşan bir gaz devidir. Güçlü bir manyetik alana ve muazzam fırtınalara ev sahipliği yapar.\n\nEn ünlü fırtınası, Dünya'dan bile daha büyük olan ve yüzyıllardır devam eden 'Büyük Kırmızı Leke'dir. Jüpiter'in Ganymede, Callisto, Io ve Europa (Galileo uyduları) gibi çok sayıda ve çeşitli yapıda uydusu bulunur. İnce bir halka sistemine de sahiptir.",
    renk: "text-orange-400"
  },
  {
    id: "saturn",
    name: "Satürn",
    type: "gezegen",
    description: "Muhteşem halka sistemiyle bilinen gaz devi.",
    image: "🪐",
    facts: {
      kütle: "5.68 × 10^26 kg",
      çap: "116,460 km",
      güneşeUzaklık: "1.4 milyar km",
      yörüngeSüresi: "29.5 Dünya yılı",
      günSüresi: "10.7 saat",
      sıcaklık: "-178°C",
      uyduSayısı: 146,
      halkaSistemi: true,
    },
    detay: "Satürn, Güneş Sistemi'ndeki en büyük ikinci gezegendir ve muazzam güzellikteki belirgin halka sistemiyle tanınır. Bu halkalar milyarlarca buz ve kaya parçasından oluşur. Tıpkı Jüpiter gibi, temel olarak hidrojen ve helyumdan oluşan bir gaz devidir.\n\nSatürn, Güneş Sistemi'nde sudan daha az yoğunluğa sahip tek gezegendir; o kadar hafiftir ki yeterince büyük bir okyanus olsaydı üzerinde yüzebilirdi. Titan adlı en büyük uydusu, yoğun bir atmosfere ve yüzeyinde sıvı metan göllerine sahip olduğu bilinen tek uydudur.",
    renk: "text-amber-200"
  },
  {
    id: "uranus",
    name: "Uranüs",
    type: "gezegen",
    description: "Yan yatan ekseniyle bilinen soğuk bir buz devi.",
    image: "🧊",
    facts: {
      kütle: "8.68 × 10^25 kg",
      çap: "50,724 km",
      güneşeUzaklık: "2.9 milyar km",
      yörüngeSüresi: "84 Dünya yılı",
      günSüresi: "17.2 saat",
      sıcaklık: "-224°C",
      uyduSayısı: 28,
      halkaSistemi: true,
    },
    detay: "Uranüs, teleskopla keşfedilen ilk gezegendir. Jüpiter ve Satürn'den farklı olarak, yapısında daha fazla su, amonyak ve metan buzu içerdiği için bir 'buz devi' olarak sınıflandırılır. Atmosferindeki metan gazı ona açık mavi / turkuaz bir renk verir.\n\nUranüs'ün en belirgin özelliği, dönüş ekseninin neredeyse yörünge düzlemine paralel olmasıdır. Adeta yan yatmış bir varil gibi yuvarlanarak döner. Bu sıradışı durumun, geçmişte Dünya büyüklüğünde bir cismin çarpmasıyla oluştuğu düşünülmektedir.",
    renk: "text-cyan-300"
  },
  {
    id: "neptun",
    name: "Neptün",
    type: "gezegen",
    description: "Güneş Sistemi'nin en uzak ve en rüzgarlı gezegeni.",
    image: "🔵",
    facts: {
      kütle: "1.02 × 10^26 kg",
      çap: "49,244 km",
      güneşeUzaklık: "4.5 milyar km",
      yörüngeSüresi: "165 Dünya yılı",
      günSüresi: "16 saat",
      sıcaklık: "-214°C",
      uyduSayısı: 16,
      halkaSistemi: true,
    },
    detay: "Neptün, Güneş'e bilinen en uzak gezegendir. Matematiksel hesaplamalar sonucunda varlığı öngörülüp daha sonra gözlemlenerek keşfedilen tek gezegendir. Koyu mavi rengi ve Uranüs gibi bir buz devi olmasıyla dikkat çeker.\n\nGüneş Sistemi'ndeki en şiddetli rüzgarlara ev sahipliği yapar; rüzgar hızları saatte 2000 kilometreye ulaşabilir. En büyük uydusu Triton, gezegenin kendi dönüş yönünün tersine yörüngede döner, bu da onun bir zamanlar bağımsız bir gök cismi olduğunu ve Neptün'ün çekimine yakalandığını gösterir.",
    renk: "text-blue-600"
  },
  {
    id: "pluton",
    name: "Plüton",
    type: "cüce-gezegen",
    description: "Kuiper Kuşağı'nın en ünlü cüce gezegeni.",
    image: "🌑",
    facts: {
      kütle: "1.30 × 10^22 kg",
      çap: "2,376 km",
      güneşeUzaklık: "5.9 milyar km",
      yörüngeSüresi: "248 Dünya yılı",
      günSüresi: "153.3 saat",
      sıcaklık: "-225°C",
      uyduSayısı: 5,
      halkaSistemi: false,
    },
    detay: "Plüton, 1930 yılında keşfedilmiş ve 2006 yılına kadar Güneş Sistemi'nin dokuzuncu gezegeni kabul edilmiştir. Ancak yeni tanımlamalarla 'cüce gezegen' sınıfına dahil edilmiştir. Kuiper Kuşağı'ndaki en büyük ve en çok bilinen nesnelerden biridir.\n\nYüzeyi dağlık ve çok soğuktur. Azot, metan ve karbonmonoksit buzlarıyla kaplıdır. Plüton'un uydusu Charon o kadar büyüktür ki, ikisi birlikte adeta ikili bir cüce gezegen sistemi gibi kendi aralarındaki bir kütle merkezinin etrafında dönerler.",
    renk: "text-slate-400"
  }
];
