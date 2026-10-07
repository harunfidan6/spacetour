/**
 * Daily horoscope built from the real sky of the day (İstanbul noon):
 * the Moon's sign and the solar house it crosses for each sign, the Moon's phase,
 * the weekday ruler and Mercury's direction. Wording is picked deterministically from
 * the day and the sign, so everyone sees the same reading and it changes every day.
 */

import { getMoonPhase, isRetrograde, type MoonPhaseKey } from '@/lib/astrophysics/skyDomeEphemeris';
import { MOON_SIGN_ATMOSPHERES } from '@/data/lunarPhases';
import {
  BODY_NAMES, SIGN_IDS, SIGN_IN, SIGN_NAMES, dayKey, formatTime, localMidnight, localWeekday, moonSign, nextMoonIngress,
  planetaryHours, type SkyBody,
} from './dailySky';

// Classical rulers (modern co-rulers of Akrep, Kova, Balık are not used for planetary hours)
const CLASSICAL_RULER: SkyBody[] = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
const DAY_RULER: SkyBody[] = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
const pick = <T,>(list: T[], seed: string): T => list[hash(seed) % list.length];

/* ---------- Text pools ---------- */

// Solar houses: the area of life the Moon lights up for the sign today
const HOUSES: { area: string; energy: string[]; love: string[]; career: string[] }[] = [
  {
    area: 'benlik ve beden',
    energy: ['Ay bugün senin burcunda: duyguların yüzeyde, enerjin yüksek. İnsanlar seni olduğundan daha net görüyor.', 'Ay burcunda dolaşırken kendini yenilemek için güzel bir gün; görünüşüne, sağlığına ve kendine ayırdığın zamana özen göster.'],
    love: ['Çekiciliğin bugün kendiliğinden parlıyor; ilk adımı atmak için beklemene gerek yok.', 'Ne istediğini açıkça söylediğinde karşındaki seni çok daha iyi anlıyor.'],
    career: ['Kişisel inisiyatif öne çıkıyor; kendi fikrini savunmak için uygun bir gün.', 'Bir işi başkasına bırakmak yerine kendin üstlenirsen hızlanıyor.'],
  },
  {
    area: 'para ve öz değer',
    energy: ['Ay ikinci evinden geçiyor: güvenlik ihtiyacın artıyor, elle tutulur şeylere odaklanıyorsun.', 'Bugün neye değer verdiğini düşünmek iyi gelir; konfor küçük bir zevkten bile gelebilir.'],
    love: ['Sevgini sözden çok emekle gösterdiğin bir gün; küçük bir jest büyük etki bırakır.', 'İlişkide güven duygusunu besleyen sakin, birlikte geçirilen zamanlar öne çıkıyor.'],
    career: ['Bütçe, fatura ve gelir planı için verimli bir gün; dürtüsel harcamaya dikkat.', 'Yeteneğinin karşılığını istemekten çekinme; değerini bilmek kazancı da artırır.'],
  },
  {
    area: 'iletişim ve yakın çevre',
    energy: ['Ay üçüncü evinde: zihin hızlı, telefon ve mesajlar yoğun. Kısa yollar ve sohbetler enerji veriyor.', 'Merakın canlı; okumak, yazmak ve yeni bir şey öğrenmek için ideal bir gün.'],
    love: ['Esprili bir mesaj ya da uzun bir sohbet bugün aranızdaki mesafeyi kapatabilir.', 'Kardeşler, komşular ya da eski bir arkadaş üzerinden güzel bir haber gelebilir.'],
    career: ['Toplantı, sunum ve yazışmalar akıcı; fikirlerini yazıya dökmek için iyi bir gün.', 'Ağını genişletmek için kısa bir görüşme ya da tanışma uzun vadede kapı açabilir.'],
  },
  {
    area: 'ev ve aile',
    energy: ['Ay dördüncü evinden geçiyor: içine dönmek, evde dinlenmek ve köklerini hatırlamak istiyorsun.', 'Yuva duygusu bugün öncelikli; evini düzenlemek ya da sevdiklerinle yemek yemek seni besler.'],
    love: ['Duygusal yakınlık ve güven arıyorsun; ev ortamında geçen sakin bir akşam ilişkine iyi gelir.', 'Aile büyükleriyle ya da ev içindeki biriyle açık bir konuşma eski bir kırgınlığı yumuşatabilir.'],
    career: ['Dışarıda koşturmak yerine arka plandaki işleri toparlamak daha verimli.', 'Evden çalışmak ya da sakin bir köşede odaklanmak bugün daha iyi sonuç verir.'],
  },
  {
    area: 'aşk ve yaratıcılık',
    energy: ['Ay beşinci evinde: neşe, oyun ve kendini ifade etme isteği yükseliyor.', 'Yaratıcı bir hobi, sahne ya da çocuklarla geçen zaman bugün enerjini tazeliyor.'],
    love: ['Romantizm için parlak bir gün; flört, sürpriz ve kahkaha öne çıkıyor.', 'Kalbinin sesini dinle; hoşlandığın kişiye ilgini göstermek için iyi bir an.'],
    career: ['Yaratıcı fikirler bugün daha kolay geliyor; tasarım ve sunumlarda öne çık.', 'İşine biraz oyun kat; eğlenerek çalıştığında üretkenliğin artıyor.'],
  },
  {
    area: 'iş düzeni ve sağlık',
    energy: ['Ay altıncı evinden geçiyor: rutinler, sağlık ve günlük düzen gündemde.', 'Dağınıklığı toparlamak, beslenmeni dengelemek ve hareket etmek bugün iyi gelir.'],
    love: ['Sevgini pratik destekle göstermek için uygun bir gün; birinin yükünü hafiflet.', 'Gündelik işler ilişkiyi yormasın; küçük görev paylaşımları huzuru artırır.'],
    career: ['Ayrıntı gerektiren işler için çok verimli bir gün; liste yap ve tek tek bitir.', 'İş arkadaşlarınla iş birliği akıyor; süreçleri iyileştirmek için iyi bir fırsat.'],
  },
  {
    area: 'ilişkiler ve ortaklıklar',
    energy: ['Ay yedinci evinde: odağın karşındakine kayıyor; birebir ilişkiler öne çıkıyor.', 'Bugün başkalarının ihtiyaçlarıyla kendi ihtiyaçların arasında denge kurman gerekebilir.'],
    love: ['Partnerinle ya da hoşlandığın kişiyle yüz yüze, dürüst bir konuşma için güçlü bir gün.', 'İlişkide uzlaşma zamanı; küçük bir taviz büyük bir yakınlaşma getirebilir.'],
    career: ['Ortaklıklar, sözleşmeler ve müzakereler için verimli bir gün.', 'Tek başına uğraşmak yerine güvendiğin biriyle birlikte çalışmak işi hızlandırıyor.'],
  },
  {
    area: 'dönüşüm ve ortak kaynaklar',
    energy: ['Ay sekizinci evinden geçiyor: duygular derin, sezgilerin keskin.', 'Yüzeyin altındakini görmek istiyorsun; bırakman gereken bir şeyle yüzleşmek için uygun bir gün.'],
    love: ['Yoğun ve tutkulu bir enerji var; samimiyet derinleşiyor ama kıskançlığa dikkat.', 'Kırılganlığını paylaşmak ilişkine güç katar.'],
    career: ['Ortak bütçe, kredi, vergi ve yatırım konularını gözden geçirmek için iyi bir gün.', 'Araştırma ve derinlemesine inceleme gerektiren işlerde başarılısın.'],
  },
  {
    area: 'yolculuk ve öğrenme',
    energy: ['Ay dokuzuncu evinde: ufkunu genişletme, yeni bir yer görme ya da öğrenme isteği artıyor.', 'Büyük resme bakmak için güzel bir gün; inandığın şeyler sana yön veriyor.'],
    love: ['Farklı kültürden biri ya da birlikte planlanan bir yolculuk ilişkiye heyecan katabilir.', 'Ortak bir hayal ya da hedef üzerine konuşmak sizi yakınlaştırır.'],
    career: ['Eğitim, yayın, hukuk ve uluslararası işler için destekleyici bir gün.', 'Yeni bir beceri edinmek ya da bir kursa başlamak için uygun zaman.'],
  },
  {
    area: 'kariyer ve görünürlük',
    energy: ['Ay onuncu evinden geçiyor: hedeflerin ve toplum içindeki yerin gündemde.', 'Bugün yaptıkların daha görünür; sorumluluk almak sana itibar kazandırır.'],
    love: ['İş temposu ilişkiye az zaman bırakabilir; kısa ama içten bir ilgi yeterli.', 'Partnerinin hedeflerine destek olmak bugün aranızı güçlendirir.'],
    career: ['Yöneticilerinle görüşmek, bir sunum yapmak ya da başvuru göndermek için güçlü bir gün.', 'Uzun vadeli bir hedef için somut bir adım atmanın tam zamanı.'],
  },
  {
    area: 'dostlar ve gelecek',
    energy: ['Ay on birinci evinde: arkadaşlar, gruplar ve gelecek planları öne çıkıyor.', 'Topluluk içinde enerjin yükseliyor; ortak bir amaç için insanlarla bir araya gel.'],
    love: ['Arkadaş ortamında tanışılan biri ya da dostluktan doğan bir yakınlık gündemde olabilir.', 'İlişkinize hafiflik katacak bir grup etkinliği iyi gelir.'],
    career: ['Ağ kurmak, ekip çalışması ve ortak projeler için verimli bir gün.', 'Gelecek için bir hedef listesi yap; destek alabileceğin kişiler düşündüğünden yakın.'],
  },
  {
    area: 'iç dünya ve dinlenme',
    energy: ['Ay on ikinci evinden geçiyor: içe dönme, dinlenme ve arınma zamanı.', 'Enerjin biraz düşük olabilir; kendine sessiz bir alan aç, rüyalarına dikkat et.'],
    love: ['Duygularını sindirmek için biraz yalnız kalmak istersen bu ilişkine de iyi gelir.', 'Söylenmemiş duygular sezgilerinle ortaya çıkabilir; acele etmeden dinle.'],
    career: ['Görünür işler yerine planlama, arşiv ve hazırlık için uygun bir gün.', 'Kafanı dağıtan işleri ertele; sessiz bir ortamda odaklanmak daha verimli.'],
  },
];

// How the Moon's sign relates to the reader's sign
const TONES: Record<number, { name: string; line: string; bonus: number }> = {
  0: { name: 'kavuşum', line: 'Ay ile aynı burçtasın; duyguların güçlü, tepkilerin hızlı.', bonus: 6 },
  1: { name: 'komşu', line: 'Ay komşu burçta; enerjin sakin ama dağınık olabilir.', bonus: 0 },
  2: { name: 'altmışlık', line: 'Ay ile uyumlu bir açıdasın; fırsatlar kolay görünüyor.', bonus: 8 },
  3: { name: 'kare', line: 'Ay ile gergin bir açıdasın; küçük sürtüşmeler seni harekete geçirebilir.', bonus: -6 },
  4: { name: 'üçgen', line: 'Ay ile akıcı bir üçgendesin; işler kendiliğinden yoluna giriyor.', bonus: 12 },
  5: { name: 'yüz elli', line: 'Ay ile uyumsuz bir açıdasın; esnek olmak ve küçük ayarlar yapmak gerekebilir.', bonus: -3 },
  6: { name: 'karşıt', line: 'Ay karşıt burçta; başkalarıyla aranda denge kurman gereken bir gün.', bonus: -2 },
};

const PHASES: Record<MoonPhaseKey, string> = {
  new: 'Yeni Ay döngüsündeyiz: niyet koymak ve yeni bir sayfa açmak için güçlü bir zaman.',
  'waxing-crescent': 'Ay büyüyor: küçük ama kararlı adımlarla başladığın işi beslemenin zamanı.',
  'first-quarter': 'İlk Dördün: karar ve eylem zamanı; ertelediğin bir adımı at.',
  'waxing-gibbous': 'Ay dolunaya ilerliyor: ayrıntıları gözden geçir, planını incelt.',
  full: 'Dolunay etkisinde duygular yüksek; tamamlananları kutla, fazlalıkları fark et.',
  'waning-gibbous': 'Ay küçülmeye başladı: öğrendiklerini paylaşmak ve teşekkür etmek iyi gelir.',
  'last-quarter': 'Son Dördün: bırakma ve sadeleşme zamanı; işe yaramayanı geride bırak.',
  'waning-crescent': 'Ay döngüsünün sonundayız: dinlen, arın ve yeni döngüye hazırlan.',
};

const DAY_TIPS: Record<SkyBody, string[]> = {
  sun: ['Günün yöneticisi Güneş: kendine zaman ayır, seni mutlu eden bir şeyi yap.', 'Pazar Güneş günü: gün ışığında kısa bir yürüyüş enerjini tazeler.'],
  moon: ['Günün yöneticisi Ay: duygularını yazmak ve suyla temas iyi gelir.', 'Pazartesi Ay günü: evine ve beslenmene özen göster.'],
  mars: ['Günün yöneticisi Mars: fazla enerjiyi spora ya da fiziksel bir işe aktar.', 'Salı Mars günü: cesaret gerektiren o adımı bugün at, ama öfkeni dizginle.'],
  mercury: ['Günün yöneticisi Merkür: yazışmalarını toparla, bir şey öğren.', 'Çarşamba Merkür günü: kısa bir not, bir telefon ya da bir kitap sayfası fark yaratır.'],
  jupiter: ['Günün yöneticisi Jüpiter: cömert ol, büyük düşün ve şükret.', 'Perşembe Jüpiter günü: öğrenmek ve öğretmek için bereketli bir gün.'],
  venus: ['Günün yöneticisi Venüs: güzellik, sanat ve sevdiklerine ayrılan zaman seni besler.', 'Cuma Venüs günü: kendini şımart, bir ilişkiye özen göster.'],
  saturn: ['Günün yöneticisi Satürn: sabırla bir işi bitir, sınırlarını netleştir.', 'Cumartesi Satürn günü: düzen ve planlama sana huzur verir.'],
};


// Wellbeing and social life by the solar house the Moon crosses (not medical advice)
const WELLBEING: string[] = [
  'Enerjin yüksek ama dalgalı: hareket et, terle, ama bedenini zorlamadan dinlenmeye de vakit ayır.',
  'Bedenin konfor ve düzen istiyor: iyi beslen, acele etmeden ye ve kendini küçük bir zevkle ödüllendir.',
  'Zihnin çok hızlı çalışıyor: ekran süresini azalt, kısa bir yürüyüşle düşüncelerini havalandır.',
  'Duygusal yorgunluk bedenine yansıyabilir: evde sıcak bir yemek ve erken bir uyku iyi gelir.',
  'Neşe enerjini yükseltiyor: dans, müzik ya da yaratıcı bir hobi bugün en iyi ilaç.',
  'Rutinlerine dön: su iç, düzenli öğün yap, bedenine küçük ama istikrarlı bir özen göster.',
  'Başkalarının enerjisi seni etkileyebilir: sınırlarını koru, kendine yalnız birkaç dakika ayır.',
  'Derin bir dinlenmeye ihtiyacın var: meditasyon, banyo ya da sessiz bir akşam seni yeniler.',
  'Açık hava ve hareket ruhunu açıyor: doğada kısa bir yürüyüş ya da yeni bir rota dene.',
  'Yoğun tempoya dikkat: omuzlarındaki yükü fark et, molalarını ihmal etme.',
  'Sosyal enerji yüksek ama dağınık: arkadaşlarla hafif bir aktivite iyi gelir, uykunu bölme.',
  'Enerjin içe dönük: bedenini dinle, gerekirse planlarını hafiflet ve erken dinlen.',
];
const SOCIAL: string[] = [
  'İnsanlar senin enerjine çekiliyor; bugün ilk adımı sen atarsan beklenmedik bir bağlantı kurabilirsin.',
  'Az ama güvendiğin insanlarla vakit geçirmek, kalabalıktan daha çok besler.',
  'Mesajlar, telefonlar ve kısa buluşmalar yoğun; eski bir arkadaştan haber gelebilir.',
  'Aile ve ev halkıyla yakınlaşma günü; birlikte bir sofra her şeyden iyi gelir.',
  'Eğlence ve flört enerjisi yüksek; davetlere evet demek için güzel bir gün.',
  'İş arkadaşlarınla ilişkiler öne çıkıyor; küçük bir yardım büyük bir güven yaratır.',
  'Birebir ilişkiler gündemde; bir anlaşmazlığı yüz yüze konuşarak çözebilirsin.',
  'Yüzeysel sohbetler seni yorabilir; derin ve samimi bir konuşma arayacaksın.',
  'Farklı kültürlerden ya da farklı çevrelerden insanlarla tanışmak ufkunu açıyor.',
  'Toplum önündeki duruşun dikkat çekiyor; ağzından çıkanları tart, itibarın güçleniyor.',
  'Arkadaş grupları ve topluluklar enerjini yükseltiyor; ortak bir plan yapmak için ideal.',
  'Kendine ayırdığın zaman bugün en değerli sosyal yatırım; yalnız kalmaktan çekinme.',
];

/* ---------- Reading ---------- */

export interface DailyReading {
  dayKey: string;
  moonSign: number;
  moonSignName: string;
  moonIn: string;
  /** Solar house the Moon crosses for this sign (1–12) */
  house: number;
  houseArea: string;
  tone: string;
  phaseKey: MoonPhaseKey;
  phaseName: string;
  dayRuler: string;
  mercuryRetro: boolean;
  moonChange: string | null;
  /** Opening line of the reading (the house theme); `energy` starts with it */
  headline: string;
  energy: string;
  love: string;
  career: string;
  tip: string;
  wellbeing: string;
  social: string;
  /** Emotional climate of the day from the Moon's sign */
  moonMood: string;
  moonFocus: string;
  luckyHours: string;
  scores: { love: number; career: number; vitality: number; luck: number };
}

const clamp = (n: number) => Math.max(38, Math.min(98, Math.round(n)));

export function dailyReading(signId: string, date: Date): DailyReading {
  const sign = Math.max(0, SIGN_IDS.indexOf(signId as (typeof SIGN_IDS)[number]));
  const key = dayKey(date);
  const noon = new Date(localMidnight(date) + 12 * 3_600_000);
  const moon = moonSign(noon);
  const house = ((moon - sign + 12) % 12) + 1;
  const sep = Math.min((moon - sign + 12) % 12, (sign - moon + 12) % 12);
  const tone = TONES[sep];
  const phase = getMoonPhase(noon);
  const weekday = localWeekday(noon);
  const dayRuler = DAY_RULER[weekday];
  const mercuryRetro = isRetrograde('mercury', noon);
  const H = HOUSES[house - 1];
  const seed = `${key}|${signId}`;
  const headline = pick(H.energy, `${seed}|e`);

  // The Moon changes sign during the waking hours of the day? (Readings use the noon sign.)
  const ingress = nextMoonIngress(new Date(localMidnight(date)));
  const ingressHour = (ingress.at.getTime() - localMidnight(date)) / 3_600_000;
  const nextArea = HOUSES[(ingress.sign - sign + 12) % 12].area;
  const moonChange =
    ingressHour >= 6 && ingressHour < 24
      ? ingressHour < 12
        ? `Ay saat ${formatTime(ingress.at)} itibarıyla ${SIGN_NAMES[ingress.sign]} burcuna geçiyor; günün teması bu geçişten sonra belirginleşiyor.`
        : `Ay saat ${formatTime(ingress.at)} itibarıyla ${SIGN_NAMES[ingress.sign]} burcuna geçiyor; o saatten sonra gündem ${nextArea} alanına kayıyor.`
      : null;

  // Hours of the sign's ruling planet, from the real (sunrise-based) planetary hours
  const ruler = CLASSICAL_RULER[sign];
  const slots = planetaryHours(noon).filter((h) => h.ruler === ruler && h.isDay);
  const luckyHours = slots.length
    ? `${BODY_NAMES[ruler]} saatleri: ${slots.map((s) => `${formatTime(s.start)}–${formatTime(s.end)}`).join(', ')}`
    : '—';

  const v = (slot: string, spread: number) => (hash(`${seed}|${slot}`) % (spread * 2 + 1)) - spread;
  const area = (h: number[]) => (h.includes(house) ? 10 : 0);
  const retroPenalty = mercuryRetro ? -4 : 0;

  return {
    dayKey: key,
    moonSign: moon,
    moonSignName: SIGN_NAMES[moon],
    moonIn: SIGN_IN[moon],
    house,
    houseArea: H.area,
    tone: tone.name,
    phaseKey: phase.key,
    phaseName: phase.name,
    dayRuler: BODY_NAMES[dayRuler],
    mercuryRetro,
    moonChange,
    headline,
    energy: `${headline} ${tone.line} ${PHASES[phase.key]}`,
    love: pick(H.love, `${seed}|l`) + (dayRuler === 'venus' ? ' Venüs gününde romantik jestler iki kat etkili.' : ''),
    career:
      pick(H.career, `${seed}|c`) +
      (mercuryRetro ? ' Merkür geri harekette: imzalamadan önce iki kez oku, yazışmaları yedekle.' : ''),
    tip: pick(DAY_TIPS[dayRuler], `${seed}|t`),
    wellbeing: WELLBEING[house - 1],
    social: SOCIAL[house - 1],
    moonMood: MOON_SIGN_ATMOSPHERES[SIGN_IDS[moon]]?.emotionalClimate ?? '',
    moonFocus: MOON_SIGN_ATMOSPHERES[SIGN_IDS[moon]]?.cosmicFocus ?? '',
    luckyHours,
    scores: {
      love: clamp(66 + tone.bonus + area([5, 7, 8]) + (dayRuler === 'venus' ? 6 : 0) + v('love', 9)),
      career: clamp(64 + tone.bonus + area([6, 10, 2]) + retroPenalty + v('career', 9)),
      vitality: clamp(62 + tone.bonus + area([1, 5]) - (house === 12 ? 10 : 0) + (phase.waxing ? 4 : 0) + v('vit', 9)),
      luck: clamp(65 + tone.bonus + area([9, 11]) + (dayRuler === 'jupiter' ? 8 : 0) + v('luck', 10)),
    },
  };
}

