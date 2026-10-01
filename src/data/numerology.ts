/**
 * Pythagorean & Chaldean Sacred Numerology Matrix
 * Mathematical decoding of names and birth epochs.
 * Swiss technical precision — zero default emojis.
 */

// Pythagorean Alphabet Value Mapping (1 to 9)
// 1: A, J, S, Ş
// 2: B, K, T
// 3: C, Ç, L, U, Ü
// 4: D, M, V
// 5: E, N, W
// 6: F, O, Ö, X
// 7: G, Ğ, P, Y
// 8: H, Q, Z
// 9: I, İ, R

const LETTER_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1, ş: 1,
  b: 2, k: 2, t: 2,
  c: 3, ç: 3, l: 3, u: 3, ü: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, ö: 6, x: 6,
  g: 7, ğ: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, ı: 9, r: 9
};

const VOWELS = new Set(['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']);

export interface CoreNumberAnalysis {
  number: number;
  isMaster: boolean;
  title: string;
  archetype: string;
  rulingCosmicBody: string;
  zodiacAffinity: string;
  essence: string;
  soulMission: string;
  shadowChallenge: string;
  sacredKeywords: string[];
}

export const NUMEROLOGY_PROFILES: Record<number, CoreNumberAnalysis> = {
  1: {
    number: 1,
    isMaster: false,
    title: 'Öncü & Kozmik Kıvılcım',
    archetype: 'Lider, Mucit, Başlatıcı',
    rulingCosmicBody: 'Güneş (Sol)',
    zodiacAffinity: 'Koç & Aslan',
    essence: 'Bireysel irade, bağımsızlık, cesaret ve yeni yollar açma kudreti. Sıfırdan yaratım gücü.',
    soulMission: 'Kimseye bağımlı olmadan kendi ayakları üzerinde durmak ve cesaretle arkasından gelenlere kılavuzluk etmek.',
    shadowChallenge: 'Bencillik, buyurganlık, yalnızlık korkusu ve sabırsızlık.',
    sacredKeywords: ['Öncülük', 'Bağımsızlık', 'Orijinallik', 'Yaratıcı İrade']
  },
  2: {
    number: 2,
    isMaster: false,
    title: 'Kutsal Ahenk & Diplomat',
    archetype: 'Barışçı, Arabulucu, Sezgisel Ruh',
    rulingCosmicBody: 'Ay (Luna)',
    zodiacAffinity: 'Yengeç & Boğa',
    essence: 'İkiliğin kutsal dengesi; empati, şefkat, işbirliği ve derin sezgisel algı.',
    soulMission: 'Zıt kutupları uzlaştırmak, yaraları sarmak ve sevgi dolu köprüler inşa etmek.',
    shadowChallenge: 'Aşırı bağımlılık, çekingenlik, kırılganlık ve kendi sınırlarını çizememe.',
    sacredKeywords: ['Empati', 'Uyum', 'Sezgi', 'Kutsal Birlik']
  },
  3: {
    number: 3,
    isMaster: false,
    title: 'İlahi İfade & Sanatçı',
    archetype: 'İfade Ustası, Vizyoner, Neşe Kaynağı',
    rulingCosmicBody: 'Jüpiter (Zeus)',
    zodiacAffinity: 'Yay & İkizler',
    essence: 'Yaratıcı kıvılcımın kelimeler, renkler ve müzikle maddileşmesi. Coşku ve yaşama sevinci.',
    soulMission: 'Girdiği ortama ışık ve neşe saçmak, karanlığı sanat ve yüksek mizahla aydınlatmak.',
    shadowChallenge: 'Dağınıklık, yüzeysellik, enerjiyi heba etme ve dedikoduya kapılma.',
    sacredKeywords: ['Yaratıcılık', 'İfade', 'Optimizm', 'Sanat']
  },
  4: {
    number: 4,
    isMaster: false,
    title: 'Kozmik Mimar & İnşa Eden',
    archetype: 'Usta, Temel Taşı, Güvenilirlik Abidesi',
    rulingCosmicBody: 'Satürn & Uranüs',
    zodiacAffinity: 'Boğa & Oğlak',
    essence: 'Dört elementin ve dört yönün kutsal karesi. Düzen, pratiklik, metanet ve sağlam kökler.',
    soulMission: 'Zamanın fırtınalarına direnecek kalıcı yapılar, sağlam kurumlar ve güvenli alanlar inşa etmek.',
    shadowChallenge: 'Aşırı katılık, değişime direnç, inatçılık ve kuralcılık.',
    sacredKeywords: ['Disiplin', 'Sağlamlık', 'Metanet', 'Düzen']
  },
  5: {
    number: 5,
    isMaster: false,
    title: 'Özgür Gezgin & Değişim Simyacısı',
    archetype: 'Maceracı, Dönüşümcü, Çok Yönlü Zihin',
    rulingCosmicBody: 'Merkür (Hermes)',
    zodiacAffinity: 'İkizler & Kova',
    essence: 'Beş duyusunun ötesine uzanan özgürlük aşkı. Esneklik, merak ve keşif tutkusu.',
    soulMission: 'Eski kalıpları yıkmak, yeni kültürleri birleştirmek ve insana değişimin korkulacak bir şey olmadığını göstermek.',
    shadowChallenge: 'Huzursuzluk, çabuk sıkılma, bağlanma korkusu ve savrukluk.',
    sacredKeywords: ['Özgürlük', 'Macera', 'Esneklik', 'Çok Yönlülük']
  },
  6: {
    number: 6,
    isMaster: false,
    title: 'Kutsal Şifacı & Kalp Muhafızı',
    archetype: 'Besleyici Anne/Baba, Koruyucu, Sevgi Elçisi',
    rulingCosmicBody: 'Venüs (Afrodit)',
    zodiacAffinity: 'Boğa & Terazi',
    essence: 'Ailenin, yuvanın ve toplumun vicdanı. Koşulsuz şefkat, estetik ve fedakar hizmet.',
    soulMission: 'Yaralı kalpleri onarmak, adalet ve güzelliği toplumun her alanına taşımak.',
    shadowChallenge: 'Kurban psikolojisi, aşırı kontrolcülük ve herkesi düzeltmeye çalışma yanılgısı.',
    sacredKeywords: ['Şefkat', 'Sorumluluk', 'Aile', 'Estetik Uyum']
  },
  7: {
    number: 7,
    isMaster: false,
    title: 'Mistik Filozof & Hakikat Kaşifi',
    archetype: 'Bilge, Araştırmacı, İçsel Simyacı',
    rulingCosmicBody: 'Neptün & Satürn',
    zodiacAffinity: 'Başak & Balık',
    essence: 'Yedi çakranın ve yedi gök katının sırrı. Derin analiz, yalnızlıkta aranan hakikat ve mistik bilgelik.',
    soulMission: 'Görünenin arkasındaki görünmeyeni çözmek, ilim ile maneviyatı tek bir potada eritmek.',
    shadowChallenge: 'Toplumdan aşırı izole olma, kibirli entelektüalizm, kuşkuculuk ve soğukluk.',
    sacredKeywords: ['Hakikat', 'Mistik Sezgi', 'Derin İlim', 'İçsel Sessizlik']
  },
  8: {
    number: 8,
    isMaster: false,
    title: 'Bolluk Hükümdarı & Sonsuzluk Gücü',
    archetype: 'Stratejist, Yönetici, Karmik Adalet Dağıtıcısı',
    rulingCosmicBody: 'Satürn & Mars',
    zodiacAffinity: 'Akrep & Oğlak',
    essence: 'Sonsuzluk döngüsü (∞). Maddi kudret ile manevi gücün tam dengesi. Yüksek organizasyon kabiliyeti.',
    soulMission: 'Büyük vizyonları yönetmek, kaynakları adilce yönlendirmek ve dünyevi gücü etik ideallere adamak.',
    shadowChallenge: 'Materyalizm, acımasızlık, güç sarhoşluğu ve maneviyatı yadsıma.',
    sacredKeywords: ['Bolluk', 'Kudret', 'Adalet', 'Liderlik']
  },
  9: {
    number: 9,
    isMaster: false,
    title: 'Evrensel Bilge & Hümanist Ruh',
    archetype: 'Işık İşçisi, Fedakar Rehber, Tamamlayıcı',
    rulingCosmicBody: 'Mars & Jüpiter',
    zodiacAffinity: 'Yay & Balık',
    essence: 'Tek haneli sayıların zirvesi. Koşulsuz sevgi, küresel bilinç ve karmik tamamlanma.',
    soulMission: 'Tüm insanlığı ayrım gözetmeksizin kucaklamak, bağışlamak ve dünyaya merhamet mirası bırakmak.',
    shadowChallenge: 'Aşırı dramatik tutumlar, hayal kırıklığı küskünlüğü ve pratiklikten kopuş.',
    sacredKeywords: ['Koşulsuz Sevgi', 'Tamamlanma', 'Hümanizm', 'Bağışlama']
  },
  11: {
    number: 11,
    isMaster: true,
    title: 'Usta Aydınlatıcı (Master 11)',
    archetype: 'Kozmik Anten, İlham Kanalı, Ruhsal Rehber',
    rulingCosmicBody: 'Uranüs & Ay',
    zodiacAffinity: 'Kova & Yengeç',
    essence: 'Yüksek frekanslı sezgisel kanal. Bireysel bilincin evrensel akılla doğrudan rezonansı.',
    soulMission: 'İnsanlığa yeniçağ bilincini aşılamak, kitlelere ilham vermek ve karanlık çağları aydınlatmak.',
    shadowChallenge: 'Aşırı sinirsel gerilim, anksiyete, gerçeklikten kopma ve anlaşılmama korkusu.',
    sacredKeywords: ['Aydınlanma', 'Yüksek Sezgi', 'Kozmik İlham', 'Ustalık']
  },
  22: {
    number: 22,
    isMaster: true,
    title: 'Usta Mimar (Master 22)',
    archetype: 'Dünya Kurucu, Pratik Dahi, Vizyoner İnşaatçı',
    rulingCosmicBody: 'Plüton & Satürn',
    zodiacAffinity: 'Oğlak & Akrep',
    essence: 'En büyük idealleri fiziksel maddede somutlaştırma kudreti. İmkansızı gerçeğe dönüştüren deha.',
    soulMission: 'Gezegen çapında kalıcı sistemler, okullar, şehirler ve şifa merkezleri inşa etmek.',
    shadowChallenge: 'Devasa baskı altında ezilme, yıkıcı hırs ve güç suistimali.',
    sacredKeywords: ['Büyük Vizyon', 'Maddi Deha', 'Küresel İnşa', 'Sonsuzluk']
  },
  33: {
    number: 33,
    isMaster: true,
    title: 'Usta Şifacı & Evrensel Öğretmen (Master 33)',
    archetype: 'Avatar, Manevi Baba/Anne, Saf Merhamet',
    rulingCosmicBody: 'Venüs & Güneş',
    zodiacAffinity: 'Balık & Aslan',
    essence: 'Koşulsuz sevginin en yüksek oktavı. İnsanlığın acısını dindirmeye adanmış kutsal hizmet.',
    soulMission: 'Yargısız saf sevgiyle kitleleri şifalandırmak ve evrensel kardeşlik bilincini yaşatmak.',
    shadowChallenge: 'Kendini tamamen tüketerek şehit rolüne bürünme.',
    sacredKeywords: ['Saf Merhamet', 'Kozmik Şifa', 'Evrensel Sevgi', 'Fedakarlık']
  }
};

/**
 * Reduce a number down to single digit or Master Numbers (11, 22, 33)
 */
export function reduceNumerology(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  let sum = 0;
  let temp = num;
  while (temp > 0) {
    sum += temp % 10;
    temp = Math.floor(temp / 10);
  }
  return reduceNumerology(sum);
}

/**
 * Calculates Pythagorean Value of any text string
 */
export function calculateTextPythagorean(text: string, filter?: 'vowels' | 'consonants'): number {
  const norm = text.toLocaleLowerCase('tr-TR').trim();
  let total = 0;

  for (const char of norm) {
    const isVowel = VOWELS.has(char);
    if (filter === 'vowels' && !isVowel) continue;
    if (filter === 'consonants' && isVowel) continue;

    const val = LETTER_VALUES[char];
    if (val) {
      total += val;
    }
  }

  return reduceNumerology(total);
}

/**
 * Calculates the Full 4-Pillar Numerology Matrix
 */
export interface FullNumerologyReport {
  fullName: string;
  birthDateString: string;
  lifePathNumber: CoreNumberAnalysis;
  destinyNumber: CoreNumberAnalysis;
  soulUrgeNumber: CoreNumberAnalysis;
  personalityNumber: CoreNumberAnalysis;
  personalYearNumber: {
    year: number;
    number: number;
    theme: string;
    advice: string;
  };
}

export function generateNumerologyReport(
  firstName: string,
  lastName: string,
  day: number,
  month: number,
  year: number
): FullNumerologyReport {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  // 1. Life Path (Doğum Tarihi Toplamı)
  const rDay = reduceNumerology(day);
  const rMonth = reduceNumerology(month);
  const rYear = reduceNumerology(year);
  const lifePathRaw = reduceNumerology(rDay + rMonth + rYear);
  const lifePath = NUMEROLOGY_PROFILES[lifePathRaw] || NUMEROLOGY_PROFILES[1];

  // 2. Destiny / Expression (Tam İsim)
  const destinyRaw = calculateTextPythagorean(fullName);
  const destiny = NUMEROLOGY_PROFILES[destinyRaw] || NUMEROLOGY_PROFILES[1];

  // 3. Soul Urge / Heart's Desire (Sadece Sesli Harfler)
  const soulUrgeRaw = calculateTextPythagorean(fullName, 'vowels');
  const soulUrge = NUMEROLOGY_PROFILES[soulUrgeRaw] || NUMEROLOGY_PROFILES[2];

  // 4. Personality Number (Sadece Sessiz Harfler)
  const personalityRaw = calculateTextPythagorean(fullName, 'consonants');
  const personality = NUMEROLOGY_PROFILES[personalityRaw] || NUMEROLOGY_PROFILES[4];

  // 5. Personal Year for Current Calendar Year (2026)
  const currentCalYear = 2026;
  const pYearRaw = reduceNumerology(rDay + rMonth + reduceNumerology(currentCalYear));

  const personalYearThemes: Record<number, { theme: string; advice: string }> = {
    1: { theme: 'Tohum Ekme & Yeni Başlangıçlar Yılı', advice: '9 yıllık yeni bir döngü başlıyor! Korkusuzca yeni projelere ve adımlara odaklanın.' },
    2: { theme: 'Sabır, İşbirlikleri & Diplomasi Yılı', advice: 'Tohumlar toprak altında kökleniyor. Ani eylemler yerine ortaklıklar ve ilişkileri besleyin.' },
    3: { theme: 'Yaratıcılık, İfade & Sosyalleşme Yılı', advice: 'Kendinizi ifade edin, sahneye çıkın, seyahat edin ve neşeyi hayatınıza davet edin.' },
    4: { theme: 'Sıkı Çalışma, Düzen & Temel Atma Yılı', advice: 'Disiplin ve pratiklik yılı. Sağlığınıza, işinize ve geleceğinize sağlam temeller atın.' },
    5: { theme: 'Özgürlük, Değişim & Dönüşüm Yılı', advice: 'Beklenmedik fırsatlar ve seyahatler kapıda. Rutinlerden sıyrılın ve esnek olun.' },
    6: { theme: 'Yuva, Aile & Sorumluluk Yılı', advice: 'Sevdiklerinizle bağları güçlendirin, evinizi düzenleyin ve kalpten hizmet edin.' },
    7: { theme: 'İçsel Bilgelik, Dinlenme & Ruhsal Derinleşme', advice: 'Yavaşlayın, araştırın, eğitim alın ve iç sesinize kulak verin.' },
    8: { theme: 'Hasat, Finansal Güç & Başarı Yılı', advice: 'Ektiğiniz tüm emeklerin meyvelerini toplama vakti. Liderlik ve strateji ön planda.' },
    9: { theme: 'Kapanış, Tamamlanma & Affetme Yılı', advice: '9 yıllık döngünün sonu. Yüklerinizi bırakın, vedalaşın ve yeniye yer açın.' },
    11: { theme: 'Aydınlanma ve Yüksek İlham Yılı (Master)', advice: 'Kozmik frekansınız çok yüksek; sezgilerinizi dinleyin ve kitlelere yol gösterin.' },
    22: { theme: 'Büyük İnşa ve Vizyon Yılı (Master)', advice: 'Hayallerinizi devasa bir somut projeye dönüştürmek için kozmik kapılar aralanıyor.' }
  };

  const pYearInfo = personalYearThemes[pYearRaw] || personalYearThemes[1];

  return {
    fullName,
    birthDateString: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
    lifePathNumber: lifePath,
    destinyNumber: destiny,
    soulUrgeNumber: soulUrge,
    personalityNumber: personality,
    personalYearNumber: {
      year: currentCalYear,
      number: pYearRaw,
      theme: pYearInfo.theme,
      advice: pYearInfo.advice
    }
  };
}
