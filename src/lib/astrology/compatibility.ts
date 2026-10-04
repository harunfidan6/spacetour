/**
 * Sign compatibility from the classical rules: the angular relationship between the two
 * signs on the zodiac wheel (the aspect), element and modality. Symmetric by construction:
 * A+B always equals B+A. Returns a score and the reasons behind it.
 */

import { ZODIAC_SIGNS, type ZodiacSign } from '@/data/zodiac';

const RELATIONS: Record<number, { name: string; base: number; text: string }> = {
  0: { name: 'Aynı burç (kavuşum)', base: 78, text: 'Aynı burçtan iki kişi birbirini hemen anlar; ancak aynı güçlü ve zayıf yönler de ikiye katlanır.' },
  1: { name: 'Komşu burçlar (yarım altmışlık)', base: 60, text: 'Yan yana duran burçlar farklı ihtiyaçlarla gelir; birbirinden öğrenmeye açık olduklarında tamamlayıcıdırlar.' },
  2: { name: 'Altmışlık (sekstil)', base: 85, text: 'Uyumlu elementlerden gelen arkadaşça bir enerji: sohbet ve ortak planlar kolay akar.' },
  3: { name: 'Kare', base: 56, text: 'Gergin ama hareketli bir ilişki: sürtüşmeler ikisini de büyütebilir, sabır ve esneklik ister.' },
  4: { name: 'Üçgen (trigon)', base: 93, text: 'Aynı elementin üç burcu arasındaki en akışkan ilişki: değerler ve yaşam ritmi doğal olarak örtüşür.' },
  5: { name: 'Yüz ellilik (kinkunks)', base: 52, text: 'Ortak noktası az iki burç; ilişki sürekli küçük ayarlamalar ister ama şaşırtıcı bir merak da taşır.' },
  6: { name: 'Karşıt burçlar', base: 74, text: 'Zodyakın iki ucu: güçlü bir çekim ve tamamlanma hissi, ama denge kurulmazsa çekişme de getirir.' },
};

const ELEMENT_PAIRS: Record<string, string> = {
  'Ateş-Ateş': 'İkisi de ateş: coşku ve cesaret bol, ama rekabete dikkat.',
  'Toprak-Toprak': 'İkisi de toprak: güven ve istikrar güçlü, ama rutine kapılma riski var.',
  'Hava-Hava': 'İkisi de hava: zihinsel uyum ve sohbet çok iyi, ama duygular geri planda kalabilir.',
  'Su-Su': 'İkisi de su: derin duygusal bağ, ama ruh hallerinin birbirini büyütmesine dikkat.',
  'Ateş-Hava': 'Ateş ve hava birbirini besler: hava fikir verir, ateş harekete geçirir.',
  'Toprak-Su': 'Toprak ve su birbirini besler: su şefkat, toprak güven sunar.',
  'Ateş-Su': 'Ateş ve su zıt mizaçlardır: tutku yüksek, ama biri söndürürken öteki kaynatabilir.',
  'Ateş-Toprak': 'Ateş hız, toprak sabır ister: biri başlatır, öteki sürdürür; tempo farkını konuşmak gerekir.',
  'Hava-Su': 'Hava mantıkla, su duyguyla konuşur: birbirinin dilini öğrendikçe ilişki zenginleşir.',
  'Toprak-Hava': 'Hava özgürlük, toprak güvence arar: fikirleri somut planlara bağladıklarında güçlüdürler.',
};

const MODALITY_TEXT: Record<string, string> = {
  same: 'Aynı nitelik: aynı tempoda yaşarsınız, ama ikiniz de aynı anda geri adım atmakta zorlanabilirsiniz.',
  'Öncü-Sabit': 'Öncü burç başlatır, sabit burç sürdürür: iyi bir iş bölümü.',
  'Öncü-Değişken': 'Öncü burç yön verir, değişken burç uyum sağlar: esnek bir ortaklık.',
  'Sabit-Değişken': 'Sabit burç kararlılık, değişken burç esneklik getirir: birbirinizi dengelersiniz.',
};


// Life areas per element pair: love, friendship, work
const AREAS: Record<string, { love: string; friendship: string; work: string; strengths: string[]; watch: string[] }> = {
  'Ateş-Ateş': {
    love: 'Tutkulu, hızlı ve heyecan dolu bir aşk. İkiniz de ilk adımı atmayı sever; romantizm hiç sönmez ama kıskançlık ve gurur çatışmaları çabuk alevlenir.',
    friendship: 'Macera ortakları: spor, yolculuk ve ani planlar sizi birleştirir. Rekabet dostluğu tatlandırır, yeter ki kazanmak ilişkiden önemli olmasın.',
    work: 'Birlikte büyük işler başlatırsınız; ancak ikiniz de lider olmak isteyebilirsiniz. Görev paylaşımını baştan netleştirmek şart.',
    strengths: ['Ortak coşku', 'Cesaret', 'Hızlı karar'], watch: ['Gurur çatışması', 'Sabırsızlık', 'Tükenmişlik'],
  },
  'Toprak-Toprak': {
    love: 'Güvenli, sadık ve kalıcı bir bağ. Sevginizi emekle ve süreklilikle gösterirsiniz; tek risk ilişkinin rutine dönüşmesi.',
    friendship: 'Yıllar boyu süren, sözünü tutan bir dostluk. Birbirinize pratik destek olur, sakin sofralarda buluşursunuz.',
    work: 'Sağlam, planlı ve verimli bir ekip. Kalıcı işler kurarsınız; değişime ve yeni fikirlere karşı birlikte direnmemeye dikkat edin.',
    strengths: ['Güven', 'İstikrar', 'Ortak değerler'], watch: ['Rutin', 'İnatlaşma', 'Duyguları ihmal etme'],
  },
  'Hava-Hava': {
    love: 'Zihinsel bir aşk: sohbet, espri ve ortak ilgi alanları bağınızın merkezi. Duygusal derinliği konuşmaya da yer açtığınızda ilişki olgunlaşır.',
    friendship: 'Sonu gelmeyen sohbetler, ortak projeler ve geniş bir sosyal çevre. Birlikte çok şey öğrenir, çok yere gidersiniz.',
    work: 'Fikir üretmekte ve iletişimde çok güçlüsünüz; ancak uygulama ve takip konusunda bir toprak dokunuşuna ihtiyacınız var.',
    strengths: ['İletişim', 'Merak', 'Özgürlüğe saygı'], watch: ['Yüzeysellik', 'Kararsızlık', 'Duygusal mesafe'],
  },
  'Su-Su': {
    love: 'Derin, sezgisel ve şefkatli bir aşk. Birbirinizin duygularını söylemeden anlarsınız; ruh hâllerinizin birbirini büyütmesine dikkat edin.',
    friendship: 'Sırlarınızı emanet edebileceğiniz bir dostluk. Zor zamanda birbirinizin limanı olursunuz.',
    work: 'Empati ve sezgiyle çalışan, insan odaklı işlerde çok uyumlu bir ekip. Sınırları ve somut planları netleştirmek gerekir.',
    strengths: ['Empati', 'Sadakat', 'Sezgi'], watch: ['Alınganlık', 'Kaçış', 'Duygusal yük'],
  },
  'Ateş-Hava': {
    love: 'Hava ateşi besler: canlı, eğlenceli ve ilham dolu bir aşk. Biri fikir verir, öteki harekete geçirir; birlikte sıkılmazsınız.',
    friendship: 'Sosyal, maceracı ve neşeli bir ikili. Partilerin, yolculukların ve yeni planların aranan ekibisiniz.',
    work: 'Vizyon ve iletişimi birleştirirsiniz: yeni projeleri başlatmakta ve tanıtmakta çok başarılısınız.',
    strengths: ['Heyecan', 'İlham', 'Esneklik'], watch: ['Dağınıklık', 'Taahhütten kaçma', 'Aceleci kararlar'],
  },
  'Toprak-Su': {
    love: 'Su toprağı besler: şefkat ile güvenin buluştuğu, yuva kurmaya yatkın bir aşk. Duygusal ve maddi güvenliği birlikte inşa edersiniz.',
    friendship: 'Birbirini koruyan, sadık ve sıcak bir dostluk. Biri dinler, öteki çözüm üretir.',
    work: 'Sezgi ve planlama birleşir: insanlara dokunan, sabır isteyen işlerde çok uyumlusunuz.',
    strengths: ['Güven', 'Şefkat', 'Kalıcılık'], watch: ['Fazla korumacılık', 'Kapanma', 'Değişimden kaçma'],
  },
  'Ateş-Su': {
    love: 'Buhar gibi yoğun bir aşk: tutku yüksek ama mizaçlar zıt. Ateşin doğrudanlığı suyu incitebilir, suyun alınganlığı ateşi söndürebilir.',
    friendship: 'Birbirinize olmadığınız yanları gösterirsiniz: ateş cesaret, su derinlik katar. Sabır gerektiren ama öğretici bir dostluk.',
    work: 'Enerji ile sezgiyi birleştirdiğinizde yaratıcı işler çıkar; ancak çalışma temponuz ve duygusal tepkileriniz çok farklı.',
    strengths: ['Tutku', 'Tamamlayıcılık', 'Yaratıcılık'], watch: ['Kırıcılık', 'Alınganlık', 'Tempo farkı'],
  },
  'Ateş-Toprak': {
    love: 'Ateş hız, toprak sabır ister. Biri ilişkiye heyecan, öteki güven getirir; temponuzu birbirinize uydurduğunuzda dengeli bir aşk olur.',
    friendship: 'Farklı ritimlerde ama birbirine faydalı bir dostluk: ateş toprağı harekete geçirir, toprak ateşi yere indirir.',
    work: 'Biri başlatır, öteki bitirir: iş bölümünü doğru kurarsanız çok verimli bir ekip olursunuz.',
    strengths: ['Denge', 'Başlatma ve sürdürme', 'Kararlılık'], watch: ['Tempo farkı', 'Eleştiri', 'Sabırsızlık'],
  },
  'Hava-Su': {
    love: 'Biri mantıkla, öteki duyguyla konuşur. Birbirinizin dilini öğrendikçe derinleşen, ama başlarda yanlış anlamalara açık bir aşk.',
    friendship: 'Hava suya bakış açısı, su havaya derinlik katar. Uzun sohbetlerde birbirinizi zenginleştirirsiniz.',
    work: 'Fikir ve sezgi birleşir: yaratıcı ve iletişim odaklı işlerde güzel sonuçlar çıkar; duygusal tepkileri kişisel algılamamak gerekir.',
    strengths: ['Hayal gücü', 'Yaratıcılık', 'Farklı bakış'], watch: ['Yanlış anlama', 'Mesafe', 'Alınganlık'],
  },
  'Toprak-Hava': {
    love: 'Hava özgürlük, toprak güvence arar. Fikirleri somut planlara bağladığınızda sağlam bir ilişki kurarsınız.',
    friendship: 'Biri fikirleri, öteki gerçekçi yolları getirir: birlikte proje yapmayı seven bir dostluk.',
    work: 'Planlama ile yaratıcılığı birleştiren güçlü bir ekip; karar hızınızdaki farkı konuşmanız gerekir.',
    strengths: ['Fikir + uygulama', 'Pratiklik', 'Yenilik'], watch: ['Kısıtlanma hissi', 'Eleştiri', 'Duygusal soğukluk'],
  },
};

const ADVICE: Record<number, string> = {
  0: 'Aynı aynaya bakıyorsunuz: birbirinizin zayıf yanlarını büyütmek yerine, farklı olduğunuz küçük alanları kutlayın.',
  1: 'Komşu burçlar farklı ihtiyaçlarla gelir: ötekinin neye ihtiyaç duyduğunu sormak, varsaymaktan çok daha iyi çalışır.',
  2: 'Kolay akan bir ilişki: fırsatları birlikte değerlendirin, ama rahatlığın ilgisizliğe dönüşmesine izin vermeyin.',
  3: 'Sürtüşme büyümenin parçası: tartışmalarda kazanmak yerine anlamayı hedefleyin, ortak bir hedef bu gerilimi güce çevirir.',
  4: 'Doğal uyumunuzun emek vermeden de süreceğine güvenmeyin; ortak hayaller kurmak bağı derinleştirir.',
  5: 'Ortak dil kurmak zaman alır: küçük alışkanlıklarda uzlaşmak ve birbirinizi şaşırtmaya açık olmak iyi gelir.',
  6: 'Karşıt burçlar birbirini tamamlar: ötekinin güçlü yanını kendi eksikliğiniz olarak değil, ilişkinin zenginliği olarak görün.',
};

export interface CompatibilityResult {
  score: number;
  verdict: string;
  relation: string;
  relationText: string;
  elementText: string;
  modalityText: string;
  traditional: boolean;
  love: string;
  friendship: string;
  work: string;
  strengths: string[];
  watch: string[];
  advice: string;
}

const idx = (s: ZodiacSign) => ZODIAC_SIGNS.findIndex((x) => x.id === s.id);
const key = (a: string, b: string, order: string[]) => [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join('-');

export function signCompatibility(a: ZodiacSign, b: ZodiacSign): CompatibilityResult {
  const d = Math.abs(idx(a) - idx(b));
  const sep = Math.min(d, 12 - d);
  const rel = RELATIONS[sep];

  const elementText = ELEMENT_PAIRS[key(a.element, b.element, ['Ateş', 'Toprak', 'Hava', 'Su'])] ?? '';
  const modalityText =
    a.modality === b.modality ? MODALITY_TEXT.same : MODALITY_TEXT[key(a.modality, b.modality, ['Öncü', 'Sabit', 'Değişken'])] ?? '';

  // Traditional "good match" lists, counted if either sign lists the other (keeps it symmetric)
  const traditional = a.loveCompatibility.includes(b.id) || b.loveCompatibility.includes(a.id);
  let score = rel.base + (traditional ? 3 : 0);
  score = Math.max(40, Math.min(98, score));

  const verdict = score >= 88 ? 'Kozmik çekim' : score >= 78 ? 'Güçlü ahenk' : score >= 65 ? 'Dengeli ilişki' : 'Öğretici gerilim';
  const areas = AREAS[key(a.element, b.element, ['Ateş', 'Toprak', 'Hava', 'Su'])];
  return {
    score, verdict, relation: rel.name, relationText: rel.text, elementText, modalityText, traditional,
    love: areas.love, friendship: areas.friendship, work: areas.work, strengths: areas.strengths, watch: areas.watch, advice: ADVICE[sep],
  };
}
