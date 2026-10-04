/**
 * High-intent Turkish FAQ questions & answers for search engines and user guides.
 * Used by FaqAccordion component and Schema.org FAQPage structured data generators.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS_BY_SECTION: Record<string, FaqItem[]> = {
  astroloji: [
    {
      question: 'Doğum haritası (Natal Çart) nedir ve neleri gösterir?',
      answer:
        'Doğum haritası, bir bireyin dünyaya geldiği kesin an ve coğrafi koordinatta Güneş, Ay ve gezegenlerin gökyüzündeki ekliptik konumlarının iki boyutlu bir izdüşümüdür. 12 zodyak burcu, 12 astrolojik ev (Placidus, Whole Sign vb.) ve gezegenler arasındaki açı kalıpları (kavuşum, üçgen, kare, karşıt) üzerinden kişinin temel karakterini, potansiyellerini ve yaşam döngülerini analiz eder.',
    },
    {
      question: 'Yükselen burç (Ascendant) Güneş burcundan nasıl farklıdır?',
      answer:
        'Güneş burcu kişinin öz benliğini, temel iradesini ve bilinçli kimliğini temsil ederken; Yükselen burç (ASC), doğum anında doğu ufkunda yükselen zodyak derecesidir. Bireyin dış dünyaya yansıttığı ilk izlenimi, fiziksel enerjisini ve olaylara yaklaşım tarzını belirler. Hesaplaması doğum saatinin dakikasına kadar bilinmesini gerektirir.',
    },
    {
      question: 'Boşluktaki Ay (Void of Course) ne anlama gelir?',
      answer:
        'Ay’ın bulunduğu burçtan ayrılmadan önce son majör açısını (Güneş veya geleneksel gezegenlerle) tamamlayıp bir sonraki burca geçene kadar geçen süredir. Babil ve Helenistik astrolojide bu aralıkta alınan kritik kararların, yeni sözleşmelerin veya başlangıçların öngörülemez sonuçlar doğurabileceği kabul edilir; içe dönme, tefekkür ve rutin işler için son derece uygundur.',
    },
    {
      question: 'Keldani Gezegen Saatleri sistemi nasıl çalışır?',
      answer:
        'Kadim Keldani sıralamasına (Satürn, Jüpiter, Mars, Güneş, Venüs, Merkür, Ay) dayanan sistemde, gün doğumu ile gün batımı arasındaki gündüz ve gece süreleri 12’şer eşit parçaya bölünür. Her saate belirli bir gezegen hükmeder ve o saatin enerjisi odaklanılan eylemlerin niteliğini destekler.',
    },
    {
      question: 'Sinastri haritası nedir, ilişki uyumu nasıl analiz edilir?',
      answer:
        'İki farklı kişinin doğum haritalarının üst üste bindirilerek gezegenlerinin birbirine yaptığı açıların incelendiği astroloji dalıdır. Çiftin duygusal iletişimi (Ay-Ay), çekim dinamikleri (Venüs-Mars), zihinsel uyumu (Merkür-Merkür) ve uzun vadeli taahhüt potansiyeli (Satürn temasları) çok katmanlı olarak analiz edilir.',
    },
  ],

  canli: [
    {
      question: 'Uluslararası Uzay İstasyonu (ISS) Türkiye üzerinden ne zaman geçer?',
      answer:
        'ISS, Dünya çevresinde saatte yaklaşık 27.600 km hızla (90 dakikada bir tur) döner. İstasyonun Türkiye üzerinden geçiş zamanları, bulunduğunuz şehrin enlem ve boylamına göre hesaplanır. Geçişler özellikle gün batımından hemen sonra veya gün doğumundan hemen önce istasyon Güneş ışığını yansıttığında çıplak gözle net olarak izlenir.',
    },
    {
      question: 'ISS gökyüzünde çıplak gözle nasıl görünür?',
      answer:
        'ISS, gökyüzünde yanıp sönmeyen, oldukça parlak (Venüs parlaklığında) ve düz bir doğrultuda hızla ilerleyen beyaz bir ışık noktası olarak görünür. Uçaklardan farklı olarak yeşil/kırmızı ikaz ışıkları yoktur ve ses çıkarmaz.',
    },
    {
      question: 'Uzay havası ve Güneş patlamaları Dünya’yı nasıl etkiler?',
      answer:
        'Güneş’teki koronal kütle atımları (CME) ve solar püskürmeler, Dünya’nın manyetosferine çarparak jeomanyetik fırtınalara yol açar. Bu fırtınalar yüksek enlemlerde kutup ışıklarını (Aurora) güçlendirirken, GPS sistemlerinde, radyo iletişiminde ve elektrik şebekelerinde dalgalanmalara neden olabilir.',
    },
    {
      question: 'Kp Endeksi nedir ve ne anlama gelir?',
      answer:
        'Kp endeksi (Planetary K-index), Dünya’nın manyetik alanındaki düzensizlikleri 0 ile 9 arasında ölçen bir jeomanyetik aktivite ölçeğidir. Kp 5 ve üzeri jeomanyetik fırtına (G1-G5 seviyesi) olarak tanımlanır ve kutup ışıklarının daha güney enlemlerden de görülebilme olasılığını artırır.',
    },
  ],

  takvim: [
    {
      question: '2026 yılındaki en önemli meteor yağmurları hangileridir?',
      answer:
        'Yılın en verimli meteor yağmurları Ocak başında Quadrantidler, Ağustos ortasında Perseidler (saatte 100’e yakın meteor) ve Aralık ortasında Geminidlerdir. Perseid meteor yağmuru Swift-Tuttle kuyrukluyıldızının bıraktığı parçacıkların atmosferde yanmasıyla oluşur.',
    },
    {
      question: 'Güneş ve Ay tutulmalarını izlemek için ne gereklidir?',
      answer:
        'Ay tutulması sırasında Ay Dünya’nın gölgesine girer ve bakır kırmızısı bir renk alır; izlemek için herhangi bir filtre gerekmez, çıplak gözle veya dürbünle güvenle izlenebilir. Güneş tutulmasında ise kesinlikle ISO 12312-2 sertifikalı özel tutulma gözlükleri kullanılmalıdır; güneşe doğrudan veya filtresiz dürbün/teleskopla bakmak kalıcı göz hasarına yol açar.',
    },
    {
      question: 'Gezegen kavuşumu (Conjunction) nedir?',
      answer:
        'İki veya daha fazla gezegenin ya da Ay ile bir gezegenin gökyüzünde aynı göksel boylama yaklaşarak birbirine son derece yakın görünmesidir. Gerçekte gezegenler arasında milyonlarca kilometre mesafe bulunmasına rağmen Dünya’dan bakıldığında etkileyici bir optik birliktelik sergilerler.',
    },
  ],

  harita: [
    {
      question: 'İnteraktif planetaryum gökyüzü haritası nasıl kullanılır?',
      answer:
        'Bulunduğunuz yerel enlem/boylam ve gerçek zamanı kullanarak gök küresini stereografik projeksiyonla 2 boyutlu ekrana yansıtır. Yıldızların kadir (parlaklık) değerleri, takımyıldız çizgileri ve gök koordinatları (RA/Dec) gerçek astrofizik veritabanlarıyla anlık hesaplanır.',
    },
    {
      question: 'Bortle Karanlık Gökyüzü Ölçeği nedir?',
      answer:
        'Bir bölgedeki ışık kirliliğini ve gökyüzünün karanlık kalitesini 1 (mükemmel karanlık gökyüzü) ile 9 (şehir içi aşırı aydınlatılmış gökyüzü) arasında derecelendiren 9 kademeli uluslararası standarttır. Samanyolu galaksisini çıplak gözle net görebilmek için genellikle Bortle 1-4 aralığında bir gözlem noktası gerekir.',
    },
    {
      question: 'Gökyüzündeki en parlak yıldız hangisidir?',
      answer:
        'Gece gökyüzünün görünür parlaklık bakımından en parlak yıldızı Büyük Köpek (Canis Major) takımyıldızında yer alan Sirius (Akyıldız)’dır (-1.46 kadir). İkinci sırada ise güney yarımküreden görülebilen Canopus yer alır.',
    },
  ],

  ansiklopedi: [
    {
      question: 'Güneş Sistemi’nde kaç gezegen vardır?',
      answer:
        'Uluslararası Astronomi Birliği’nin (IAU) 2006 tanımına göre Güneş Sistemi’nde 8 gezegen bulunur: Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs ve Neptün. Plüton, Kuiper Kuşağı’ndaki yörüngesini diğer gök cisimlerinden temizleyemediği için cüce gezegen sınıfındadır.',
    },
    {
      question: 'Güneş Sistemi’nin en büyük ve en küçük gezegenleri hangileridir?',
      answer:
        'En büyük gezegen, Dünya’nın 1.300 katından fazla hacme sahip dev gaz devi Jüpiter’dir. En küçük gezegen ise Dünya’nın uydusu Ay’dan yalnızca biraz daha büyük olan kayalık Merkür’dür.',
    },
  ],
};
