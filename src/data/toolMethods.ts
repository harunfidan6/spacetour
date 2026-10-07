/**
 * Astroloji araçlarının "Nasıl hesaplanır?" açıklamaları ve araca özel soru-cevaplar.
 * Metinler araçların gerçek kodunu anlatır (src/lib/astrology/*, src/data/numerology.ts …);
 * hesaplama değişirse burası da güncellenmeli. Araç sayfasında rehberin altında gösterilir,
 * soru-cevaplar FAQPage şeması olarak da yayımlanır.
 */

import type { FaqItem } from './faqs';

export interface ToolMethodStep {
  title: string;
  desc: string;
}

export interface ToolMethod {
  /** "Doğum haritası nasıl hesaplanır?" */
  title: string;
  intro: string;
  steps: ToolMethodStep[];
  faq: FaqItem[];
}

export const TOOL_METHODS: Record<string, ToolMethod> = {
  'astroloji/dogum-haritasi': {
    title: 'Doğum haritası nasıl hesaplanır?',
    intro:
      'Harita, doğduğun anın gerçek gökyüzünden hesaplanır; hazır tablolardan değil. Doğum saati ve şehri girdiğinde aşağıdaki adımlar tarayıcında, birkaç milisaniyede çalışır.',
    steps: [
      { title: 'Doğum anı UTC’ye çevrilir', desc: 'Türkiye’nin tarihî saat dilimi kuralları uygulanır: 7 Eylül 2016’dan beri sürekli UTC+3; öncesinde kışın UTC+2, Mart’ın son pazarından Ekim’in son pazarına kadar yaz saati UTC+3.' },
      { title: 'Güneş, Ay ve gezegenlerin konumu', desc: 'Güneş ve Ay için Meeus’un efemeris formülleri, Merkür–Satürn için NASA JPL yörünge elemanları ve Kepler denklemi kullanılır. Sonuç, her gökcisminin tropikal zodyaktaki derecesidir.' },
      { title: 'Yükselen burç', desc: 'Doğum yerinin enlemi ve doğum anındaki yerel yıldız zamanıyla doğu ufkunun ekliptiği kestiği derece bulunur. Saatteki 4 dakikalık fark Yükselen’i yaklaşık 1° kaydırır.' },
      { title: 'Evler ve açılar', desc: 'Evler “tam burç” (whole sign) sistemiyle sayılır: Yükselen’in burcu 1. ev, sonraki burç 2. ev… Gezegen çiftleri arasında kavuşum (8° tolerans), altmışlık (5°), kare (7°), üçgen (7°) ve karşıt (8°) açıları aranır.' },
    ],
    faq: [
      { question: 'Doğum saatimi bilmiyorsam doğum haritası çıkarabilir miyim?', answer: 'Güneş, Ay ve gezegenlerin burçları saat bilinmeden de büyük ölçüde doğru çıkar; Ay günde yaklaşık 13° ilerlediği için o gün burç değiştiriyorsa belirsiz kalabilir. Yükselen burç ve evler ise doğum saatine bağlıdır; saat bilinmiyorsa bu kısımları yorumlama.' },
      { question: 'Hangi ev sistemi kullanılıyor?', answer: 'Tam burç (whole sign) ev sistemi: Yükselen’in bulunduğu burç bütünüyle 1. ev sayılır ve evler burç burç ilerler. En eski ev sistemidir ve her enlemde tutarlı çalışır. Placidus gibi sistemlerle ev sınırları farklı çıkabilir; gezegenlerin burçları değişmez.' },
      { question: 'Sonuçlar diğer sitelerle neden birkaç dakika farklı olabilir?', answer: 'Gezegen konumları birkaç yay dakikası (bir derecenin küçük bir kesri) duyarlılıktadır; gezegen bir burcun tam sınırında değilse bu, burç ve ev sonuçlarını değiştirmez. Fark genellikle doğum saatinin yuvarlanmasından, farklı ev sisteminden ya da yaz saatinin yanlış uygulanmasından gelir; bu araç Türkiye’nin tarihî saat kurallarını kendisi uygular.' },
      { question: 'Girdiğim bilgiler bir yere kaydediliyor mu?', answer: 'Hayır. Hesaplama tamamen tarayıcında yapılır; doğum tarihin, saatin ve şehrin sunucuya gönderilmez.' },
    ],
  },

  'astroloji/sinastri': {
    title: 'Sinastri nasıl hesaplanır?',
    intro: 'İki kişinin doğum haritası ayrı ayrı gerçek gökyüzünden hesaplanır, sonra birinin gezegenleri ötekinin gezegenleriyle karşılaştırılır.',
    steps: [
      { title: 'İki harita', desc: 'Her iki kişi için Güneş, Ay, Merkür, Venüs, Mars, Jüpiter, Satürn ve Yükselen; doğum haritası aracındaki yöntemle (Türkiye saat kuralları, JPL yörünge elemanları, yerel yıldız zamanı) hesaplanır.' },
      { title: 'Çapraz açılar', desc: 'Birinin gezegeni ile ötekinin gezegeni arasındaki açı ölçülür: kavuşum, üçgen ve karşıt için 8,5°, kare için 7,5°, altmışlık için 5,5° tolerans; Güneş ya da Ay söz konusuysa tolerans 1° daha geniştir.' },
      { title: 'Ağırlık', desc: 'Açı tam olana ne kadar yakınsa etkisi o kadar büyük sayılır: 2°’nin altı “tam”, 4,5°’ye kadar “güçlü”, ötesi “orta”. Her açının uyumlu ya da zorlayıcı bir puan katkısı vardır.' },
      { title: 'Boyutlar ve genel puan', desc: 'Açılar dört boyuta dağıtılır: ruh ve duygu (Güneş/Ay), tutku ve romantizm (Venüs/Mars), zihin ve iletişim (Merkür) ve karmik bağ (Satürn/Jüpiter). Genel puan, açıların toplam etkisi ile iki haritanın element dengesinden çıkar.' },
    ],
    faq: [
      { question: 'Sinastri ile burç uyumu arasındaki fark nedir?', answer: 'Burç uyumu yalnızca iki Güneş burcunu karşılaştırır ve aynı burçtan herkes için aynı sonucu verir. Sinastri ise iki kişinin doğum anındaki tüm gezegen konumlarını karşılaştırır; aynı burçtan iki çiftin sonucu bile farklı çıkar.' },
      { question: 'Doğum saati bilinmezse sinastri yapılabilir mi?', answer: 'Gezegenler arası açılar büyük ölçüde doğru kalır. Yükselen burç ve ona yapılan açılar ise saate bağlıdır; saat bilinmiyorsa öğlen 12:00 girip Yükselen’le ilgili sonuçları dikkate almamak en doğrusudur.' },
      { question: 'Düşük puan kötü bir ilişki anlamına mı gelir?', answer: 'Hayır. Kare ve karşıt gibi zorlayıcı açılar sürtüşmeyi ama aynı zamanda çekimi ve büyümeyi de anlatır. Puan, ilişkinin hangi alanlarda kendiliğinden aktığını ve hangilerinde emek istediğini gösteren bir özettir.' },
      { question: 'Venüs–Mars açısı neden önemli sayılır?', answer: 'Geleneksel astrolojide Venüs sevgi ve çekimi, Mars arzu ve eylemi temsil eder. Birinin Venüs’ü ile ötekinin Mars’ı arasındaki açı, tutku boyutunun en güçlü göstergelerinden biri olarak değerlendirilir.' },
    ],
  },

  'astroloji/burc-uyumu': {
    title: 'Burç uyumu puanı nasıl hesaplanır?',
    intro: 'Puan klasik astrolojinin üç kuralına dayanır: iki burcun zodyak çemberindeki açısı, elementleri ve nitelikleri. Hesap simetriktir; Koç–Aslan ile Aslan–Koç aynı sonucu verir.',
    steps: [
      { title: 'Burçlar arası açı', desc: 'İki burcun çemberdeki uzaklığı belirlenir ve taban puanı verir: üçgen (aynı element) 93, altmışlık 85, aynı burç 78, karşıt burçlar 74, komşu burçlar 60, kare 56, yüz ellilik 52.' },
      { title: 'Geleneksel eşleşmeler', desc: 'Burçlardan biri ötekini geleneksel uyumlu burçlar listesinde sayıyorsa puana 3 eklenir. Sonuç 40 ile 98 arasında tutulur.' },
      { title: 'Element ve nitelik', desc: 'Ateş, toprak, hava ve su ikilileri aşk, arkadaşlık ve iş yorumlarını belirler; öncü, sabit ve değişken nitelikler ilişkinin temposunu anlatır.' },
    ],
    faq: [
      { question: 'En uyumlu burçlar hangileri?', answer: 'Klasik kurala göre aynı elementten burçlar (üçgen) en akıcı ilişkiyi kurar: Koç–Aslan–Yay, Boğa–Başak–Oğlak, İkizler–Terazi–Kova ve Yengeç–Akrep–Balık. Bu ikililer 93 puanla en üstte yer alır; altmışlık açıdaki ateş–hava ve toprak–su ikilileri 85 puanla onları izler.' },
      { question: 'Karşıt burçlar uyumlu mudur?', answer: 'Karşıt burçlar (Koç–Terazi, Boğa–Akrep gibi) güçlü bir çekim ve tamamlanma hissi yaşar; denge kurulmazsa çekişme de getirir. Bu yüzden 74 puanla “güçlü ahenk” sınırına yakın değerlendirilir.' },
      { question: 'Burç uyumu tek başına yeterli mi?', answer: 'Güneş burcu uyumu genel bir eğilim verir. Daha kişisel bir sonuç için iki kişinin Ay, Venüs, Mars ve Yükselen konumlarını da karşılaştıran sinastri aracını kullanabilirsin.' },
      { question: 'Puan neden iki yönde de aynı?', answer: 'Açı, element ve nitelik ilişkileri iki burç için ortaktır; geleneksel liste de iki yönden kontrol edilir. Böylece Koç–Balık ile Balık–Koç her zaman aynı puanı ve yorumu alır.' },
    ],
  },

  'astroloji/tarot': {
    title: 'Tarot kartları nasıl çekiliyor?',
    intro: 'Deste, 22 Büyük Arkana kartından oluşur ve her açılımda yeniden karıştırılır.',
    steps: [
      { title: 'Karıştırma', desc: 'Kartlar Fisher–Yates yöntemiyle karıştırılır; bu yöntemde her kart sırasının çıkma olasılığı eşittir.' },
      { title: 'Açılım', desc: 'Seçilen açılıma göre desteden sırayla 1 kart (Günün Rehber Kartı) ya da 3 kart açılır: Keltik Zaman Triadı’nda geçmişin kökü, şimdiki eşik ve gelecek potansiyeli; Karar & İkilem Aynası’nda iki seçenek ve onların sentezi.' },
      { title: 'Düz ya da ters', desc: 'Her kartın ters gelme olasılığı %35’tir. Ters kartlarda kartın gölge yönü, uyarısı ve dersi okunur.' },
    ],
    faq: [
      { question: 'Tarot falı geleceği gösterir mi?', answer: 'Tarot bir kehanet aracı değil, sembollerle düşünmeyi sağlayan bir ayna olarak kullanılır. Kartlardaki arketipler, durumuna farklı bir açıdan bakmana yardım eder; kararlarını yalnızca kartlara dayandırma.' },
      { question: 'Neden yalnızca 22 kart var?', answer: 'Araç, tarotun en bilinen ve sembolik olarak en yoğun bölümü olan 22 Büyük Arkana kartını kullanır (Deli’den Dünya’ya). 56 Küçük Arkana kartı günlük ayrıntıları anlatır ve bu açılımlara dahil değildir.' },
      { question: 'Ters kart kötü anlama mı gelir?', answer: 'Hayır. Ters kart, kartın enerjisinin engellendiğini, içe döndüğünü ya da abartıldığını anlatır. Her kartın ters anlamında bir uyarı ve bir ders yer alır.' },
      { question: 'Aynı soruyu tekrar sorarsam aynı kartlar mı çıkar?', answer: 'Hayır; deste her açılımda rastgele karıştırılır. Gelenekte aynı soruyu kısa sürede tekrar sormak yerine ilk açılım üzerinde düşünmek önerilir.' },
    ],
  },

  'astroloji/gunluk-burc': {
    title: 'Günlük burç yorumu nasıl hazırlanıyor?',
    intro: 'Yorumlar elle yazılan bir tahmin değil, o günün gerçek gökyüzünden (İstanbul’da öğlen) hesaplanır. Herkes aynı gün aynı yorumu görür ve yorum her gün kendiliğinden değişir.',
    steps: [
      { title: 'Ay’ın burcu ve evi', desc: 'Öğlen Ay’ın bulunduğu burç bulunur ve her burç için Güneş burcuna göre hangi evden geçtiği hesaplanır; günün gündemi (para, ilişkiler, kariyer…) bu evden gelir.' },
      { title: 'Açı ve evre', desc: 'Ay ile burcun arasındaki açı (kavuşum, üçgen, kare…) günün tonunu, Ay’ın evresi (Yeni Ay, Dolunay…) genel temayı belirler. Ay o gün burç değiştiriyorsa geçiş saati de yazılır.' },
      { title: 'Günün yöneticisi ve Merkür', desc: 'Haftanın gününü yöneten gezegen (Pazartesi Ay, Salı Mars…) günün tavsiyesini verir; Merkür geri hareketteyse iş ve iletişimle ilgili uyarı eklenir.' },
      { title: 'Puanlar ve şanslı saatler', desc: 'Aşk, iş, enerji ve şans puanları Ay’ın açısı ve evine göre hesaplanır. Şanslı saatler, burcun yönetici gezegeninin o günkü gezegen saatleridir (gün doğumu ve batımına göre).' },
    ],
    faq: [
      { question: 'Günlük burç yorumu ne zaman güncellenir?', answer: 'Her gün İstanbul saatiyle gece yarısından sonra yeni günün yorumu üretilir; sayfalar yarım saatte bir yenilenir.' },
      { question: 'Neden bazı günler iki burcun yorumu benzer?', answer: 'Yorumun ana teması Ay’ın o gün burcuna göre hangi evden geçtiğidir. Ay yaklaşık 2,5 günde bir burç değiştirdiği için ardışık günlerde gündem benzer kalabilir; açı, evre ve günün yöneticisi ise farklılaşır.' },
      { question: 'Yükselen burcuma göre de okuyabilir miyim?', answer: 'Evet. Astrolojide günlük yorumlar Yükselen burca göre de okunur; Yükselen’ini biliyorsan o burcun yorumuna da bakmanı öneririz. Yükselen’ini doğum haritası aracıyla bulabilirsin.' },
      { question: 'Şanslı saatler nasıl belirleniyor?', answer: 'Gün doğumundan gün batımına kadar olan süre 12 eşit olmayan gezegen saatine bölünür ve saatler Keldani sırasıyla gezegenlere dağıtılır. Burcunun geleneksel yöneticisinin gündüz saatleri senin şanslı saatlerin olarak gösterilir.' },
    ],
  },

  'astroloji/yildiz-fali': {
    title: 'Yıldız falı ve gezegen saatleri nasıl hesaplanır?',
    intro: 'Araç iki gerçek gök hesabını birleştirir: Keldani gezegen saatleri ve sabit yıldızların ekliptikteki konumları.',
    steps: [
      { title: 'Gezegen saatleri', desc: 'Gündüz (gün doğumundan batımına) ve gece (batımından ertesi doğuma) ayrı ayrı 12 eşit parçaya bölünür. İlk saat haftanın gününün yöneticisine verilir, sonrakiler Keldani sırasıyla ilerler: Satürn, Jüpiter, Mars, Güneş, Venüs, Merkür, Ay.' },
      { title: 'Senin yıldızın', desc: 'Doğum anındaki Güneş’in derecesine en yakın baş sabit yıldız bulunur; kraliyet yıldızları (Aldebaran, Regulus, Antares, Fomalhaut) ayrıca işaretlenir.' },
      { title: 'Bugünün yıldızı', desc: 'Ay’ın şu anki derecesine en yakın sabit yıldız ve Ay’ın ona kaç saat içinde ulaşacağı, Ay’ın saatlik hızından hesaplanır.' },
    ],
    faq: [
      { question: 'Gezegen saatleri neden 60 dakika değil?', answer: 'Geleneksel gezegen saatleri eşit olmayan saatlerdir: gündüz 12’ye, gece 12’ye bölünür. Yazın gündüz saatleri 70 dakikayı aşarken kışın 50 dakikanın altına iner.' },
      { question: 'Keldani sırası nedir?', answer: 'Antik gökbilimcilerin gezegenleri gökyüzündeki görünür hızlarına göre, en yavaştan en hızlıya dizdiği sıradır: Satürn, Jüpiter, Mars, Güneş, Venüs, Merkür, Ay. Haftanın gün adları da bu sıradan türemiştir.' },
      { question: 'Kraliyet yıldızları hangileri?', answer: 'Pers geleneğinin dört “gök bekçisi”: Aldebaran (Boğa), Regulus (Aslan), Antares (Akrep) ve Fomalhaut (Güney Balığı). Ekliptiğe yakın ve parlak oldukları için astrolojide özel önem taşırlar.' },
    ],
  },

  'astroloji/transitler': {
    title: 'Canlı transitler nasıl hesaplanır?',
    intro: 'Sayfadaki her değer o anın gerçek gökyüzünden hesaplanır ve saat ilerledikçe güncellenir.',
    steps: [
      { title: 'Ay’ın evresi ve burcu', desc: 'Ay ile Güneş arasındaki açıdan evre ve aydınlık oranı, Ay’ın ekliptik boylamından burcu bulunur.' },
      { title: 'Geri hareket', desc: 'Merkür–Satürn için gezegenin Dünya’dan görünen boylamı azalıyorsa gezegen retroda sayılır.' },
      { title: 'Seçtiğin burcun günü', desc: 'Seçtiğin burcun yorumu ve puanları, günlük burç sayfasındakiyle aynı motordan (Ay’ın evi, açısı, evresi ve günün yöneticisi) gelir.' },
    ],
    faq: [
      { question: 'Transit nedir?', answer: 'Gökyüzündeki gezegenlerin şu anki konumlarına transit denir. Astrolojide transit gezegenlerin doğum haritandaki konumlara yaptığı açılar, dönemsel temaları okumak için kullanılır.' },
      { question: 'Retro bir gezegen gerçekten geri mi gider?', answer: 'Hayır. Dünya bir gezegeni yörüngesinde sollarken ya da gezegen Dünya’yı sollarken, gezegen gökyüzünde birkaç hafta geri gidiyormuş gibi görünür. Bu, otoyolda yavaş bir aracı geçerken onun geriye kayıyor gibi görünmesine benzer.' },
      { question: 'Veriler ne sıklıkla güncellenir?', answer: 'Sayfa açık kaldığı sürece değerler düzenli aralıklarla yeniden hesaplanır; Ay yaklaşık saatte yarım derece ilerlediği için burç geçişleri dakikasında görünür.' },
    ],
  },

  'astroloji/ay-evreleri': {
    title: 'Ay evresi nasıl hesaplanır?',
    intro: 'Evre, Ay ile Güneş arasındaki gerçek açıdan (elongasyon) hesaplanır: 0° Yeni Ay, 90° İlk Dördün, 180° Dolunay, 270° Son Dördün.',
    steps: [
      { title: 'Elongasyon', desc: 'Güneş ve Ay’ın o anki ekliptik konumları efemeris formülleriyle bulunur; aradaki açı evrenin yerini verir. Her evre bu açının ±22,5°’lik dilimidir.' },
      { title: 'Aydınlık oranı', desc: 'Ay yüzeyinin aydınlık kısmı ½ × (1 − cos açı) formülüyle hesaplanır: Yeni Ay’da %0, dördünlerde %50, Dolunay’da %100.' },
      { title: 'Ay’ın yaşı ve sonraki evreler', desc: 'Açı, 29,53 günlük kavuşum ayına oranlanarak Ay’ın yaşı ve bir sonraki Yeni Ay ile Dolunay’a kalan gün sayısı bulunur.' },
    ],
    faq: [
      { question: 'Bir sonraki dolunay ne zaman?', answer: 'Araçtaki sayaç bir sonraki Dolunay’a kalan günü gösterir. Ayın tüm evrelerinin saatleri için Ay takvimi sayfasına bakabilirsin.' },
      { question: 'Ay evresi her yerde aynı mı?', answer: 'Evet. Evre, Güneş–Dünya–Ay dizilimine bağlıdır ve aynı anda Dünya’nın her yerinden aynı görünür; değişen yalnızca saat dilimi ve Ay’ın gökyüzündeki konumudur. Güney yarıkürede hilal ters yönde görünür.' },
      { question: 'Boşlukta Ay ne demek?', answer: 'Ay’ın bulunduğu burçta son büyük açısını yaptığı andan sonraki burca geçene kadar geçen süredir. Gelenekte bu aralık yeni başlangıçlar yerine rutin işler için uygun sayılır; güncel aralık Ay bugün sayfasında yazılıdır.' },
    ],
  },

  'astroloji/retrolar': {
    title: 'Retro tarihleri nasıl hesaplanır?',
    intro: 'Retro takvimi hazır bir listeden değil, gezegenlerin gerçek hareketinden hesaplanır; bu yüzden tarihleri hiç bitmez.',
    steps: [
      { title: 'Durma noktaları', desc: 'Merkür, Venüs, Mars, Jüpiter ve Satürn’ün Dünya’dan görünen ekliptik boylamı gün gün izlenir. Boylamın artmayı bırakıp azalmaya başladığı an retro başlangıcı, yeniden artmaya başladığı an bitişidir.' },
      { title: 'Gölge dönemleri', desc: 'Retro öncesi gölge, gezegenin retro bitişindeki dereceyi ilk kez geçtiği gün başlar; retro sonrası gölge, gezegen retro başlangıcındaki dereceye yeniden ulaştığında biter.' },
      { title: 'Burç ve dereceler', desc: 'Başlangıç ve bitişteki dereceler tropikal zodyağa göre, presesyon düzeltmesiyle verilir.' },
    ],
    faq: [
      { question: 'Merkür retrosu yılda kaç kez olur?', answer: 'Merkür yılda genellikle üç, bazen dört kez retroya girer; her retro yaklaşık üç hafta sürer. Venüs yaklaşık 18 ayda, Mars yaklaşık 26 ayda bir retro yapar; Jüpiter ve Satürn her yıl dört–beş ay retroda kalır.' },
      { question: 'Gölge dönemi nedir?', answer: 'Gezegenin retroda geri döneceği derece aralığına ilk girdiği andan, retrodan sonra bu aralıktan tamamen çıktığı ana kadar süren dönemdir. Astrolojide retro temalarının başladığı ve sindirildiği zaman olarak yorumlanır.' },
      { question: 'Retro dönemde sözleşme imzalanmaz mı?', answer: 'Geleneksel astrolojide Merkür retrosu yazışma, sözleşme ve teknolojide aksaklıklarla ilişkilendirilir; imzalamadan önce iki kez okumak ve yedek almak önerilir. Bilimsel olarak retro, yalnızca Dünya’dan bakınca oluşan bir görünümdür.' },
    ],
  },

  'astroloji/numeroloji': {
    title: 'Numeroloji sayıları nasıl hesaplanır?',
    intro: 'Araç Pisagor numerolojisini kullanır ve Türk alfabesindeki tüm harfleri (Ç, Ğ, İ, Ö, Ş, Ü dahil) tabloya yerleştirir.',
    steps: [
      { title: 'Sadeleştirme', desc: 'Her sayı tek basamağa inene kadar rakamları toplanır (1998 → 27 → 9). 11, 22 ve 33 “usta sayı” sayılır ve sadeleştirilmez.' },
      { title: 'Yaşam yolu', desc: 'Gün, ay ve yıl ayrı ayrı sadeleştirilip toplanır, sonuç yeniden sadeleştirilir. Örnek: 15.04.1998 → 6 + 4 + 9 = 19 → 10 → 1.' },
      { title: 'Kader, ruh güdüsü ve kişilik', desc: 'Ad ve soyadındaki harfler tabloya göre sayıya çevrilir: tüm harfler kader sayısını, ünlüler (a, e, ı, i, o, ö, u, ü) ruh güdüsünü, ünsüzler kişilik sayısını verir.' },
      { title: 'Kişisel yıl ve olgunluk', desc: 'Kişisel yıl, doğum günü ve ayının içinde bulunulan yılla toplamıdır; olgunluk sayısı yaşam yolu ile kader sayısının toplamıdır.' },
    ],
    faq: [
      { question: 'Yaşam yolu sayısı nasıl hesaplanır?', answer: 'Doğum tarihindeki gün, ay ve yıl ayrı ayrı tek basamağa indirilir ve toplanır; toplam yeniden tek basamağa indirilir. 11, 22 ve 33 usta sayılar olarak korunur. Örneğin 15 Nisan 1998: 1+5 = 6, 4, 1+9+9+8 = 27 → 9; 6+4+9 = 19 → 1+9 = 10 → 1.' },
      { question: 'Türkçe harfler hangi sayılara karşılık geliyor?', answer: '1: A, J, S, Ş · 2: B, K, T · 3: C, Ç, L, U, Ü · 4: D, M, V · 5: E, N, W · 6: F, O, Ö, X · 7: G, Ğ, P, Y · 8: H, Q, Z · 9: I, İ, R.' },
      { question: 'Usta sayılar nedir?', answer: '11, 22 ve 33, Pisagor numerolojisinde güçlü titreşimli “usta sayılar” olarak kabul edilir ve tek basamağa indirilmez. Yaşam yolu ya da kader sayın bunlardan biriyse ayrıca yorumlanır.' },
      { question: 'Kişisel yıl sayısı her yıl değişir mi?', answer: 'Evet. Doğum günün ve ayın, içinde bulunduğun takvim yılıyla toplanır; yıl değiştikçe 1’den 9’a uzanan dokuz yıllık döngüde bir sonraki yıla geçersin.' },
    ],
  },
};
