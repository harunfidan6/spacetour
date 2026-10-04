/**
 * SYNASTRY CALCULATION & ASTROLOGICAL COMPATIBILITY ENGINE
 * 
 * Computes authentic geocentric planetary positions (Sun, Moon, Mercury, Venus,
 * Mars, Jupiter, Saturn, and Ascendant) for both partners using NASA JPL Keplerian
 * elements and Meeus lunar-solar ephemeris.
 * 
 * Detects real Ptolemaic cross-aspects (Conjunction, Sextile, Square, Trine, Opposition)
 * with precise orbs and derives dynamic, multi-dimensional compatibility scores.
 */

import { longitude, SkyBody } from '@/lib/astrology/dailySky';
import { ZODIAC_SIGNS, localSolarHour, type ZodiacSign } from '@/data/zodiac';
import { POPULAR_LOCATIONS } from '@/utils/astronomy';
import { turkeyUtcOffset } from '@/lib/astrology/natal';

export interface BirthProfile {
  name: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  city: string;
}

export type CelestialBodyId = SkyBody | 'ascendant';

export interface PlanetPlacement {
  id: CelestialBodyId;
  name: string;
  symbol: string;
  longitude: number;
  signId: string;
  signName: string;
  signSymbol: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  modality: 'Öncü' | 'Sabit' | 'Değişken';
  degree: number;
  minute: number;
  formatted: string;
  meaning: string;
}

export interface ChartPlacements {
  profile: BirthProfile;
  utcDate: Date;
  solarHour: number;
  sun: PlanetPlacement;
  moon: PlanetPlacement;
  ascendant: PlanetPlacement;
  mercury: PlanetPlacement;
  venus: PlanetPlacement;
  mars: PlanetPlacement;
  jupiter: PlanetPlacement;
  saturn: PlanetPlacement;
  all: PlanetPlacement[];
  elementCounts: Record<'Ateş' | 'Toprak' | 'Hava' | 'Su', number>;
}

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
export type AspectNature = 'harmonious' | 'challenging' | 'neutral';
export type AspectCategory = 'soul' | 'passion' | 'mind' | 'karma' | 'growth';

export interface SynastryAspect {
  id: string;
  p1Planet: PlanetPlacement;
  p2Planet: PlanetPlacement;
  aspectType: AspectType;
  aspectName: string;
  aspectSymbol: string;
  angle: number;
  actualAngle: number;
  orb: number;
  orbStrength: 'exact' | 'strong' | 'moderate';
  nature: AspectNature;
  category: AspectCategory;
  title: string;
  summary: string;
  detailedInterpretation: string;
  scoreDelta: number;
}

export interface SynastryAnalysisResult {
  overallScore: number;
  compatibilityLevel: string;
  summaryText: string;
  dimensionScores: {
    soul: number;
    passion: number;
    mind: number;
    karma: number;
  };
  aspects: SynastryAspect[];
  harmoniousAspects: SynastryAspect[];
  challengingAspects: SynastryAspect[];
  elementalAccord: {
    score: number;
    label: string;
    description: string;
  };
  strengths: string[];
  growthAreas: string[];
  advice: string;
}

// Standard UTC offsets for selectable birth cities (Turkey: UTC+3)
const CITY_UTC_OFFSET: Record<string, number> = {
  'Londra (Greenwich)': 0,
  'New York': -5,
  'Tokyo': 9,
};

const norm = (deg: number) => ((deg % 360) + 360) % 360;

const BODY_METADATA: Record<CelestialBodyId, { name: string; symbol: string; meaning: string }> = {
  sun: { name: 'Güneş', symbol: '☉', meaning: 'Bilinçli benlik, yaşam gücü ve öz kimlik.' },
  moon: { name: 'Ay', symbol: '☽', meaning: 'Duygusal gereksinimler, sezgiler ve içsel yuva hissi.' },
  ascendant: { name: 'Yükselen', symbol: 'ASC', meaning: 'Dış dünyaya yansıyan aura, ilk izlenim ve yaşam perspektifi.' },
  mercury: { name: 'Merkür', symbol: '☿', meaning: 'Zihinsel iletişim, ifade tarzı ve düşünce ritmi.' },
  venus: { name: 'Venüs', symbol: '♀', meaning: 'Sevgi dili, romantik çekim, zarafet ve değerler.' },
  mars: { name: 'Mars', symbol: '♂', meaning: 'Fiziksel tutku, eylem gücü, arzu ve motivasyon.' },
  jupiter: { name: 'Jüpiter', symbol: '♃', meaning: 'Bolluk, ruhsal genişleme, neşe ve ortak vizyon.' },
  saturn: { name: 'Satürn', symbol: '♄', meaning: 'Karmik sorumluluk, kalıcı sadakat ve zamanın sınavları.' },
};

/**
 * Calculates high-precision astrological placements for a birth profile.
 */
export function calculateChartPlacements(profile: BirthProfile): ChartPlacements {
  const loc = POPULAR_LOCATIONS.find((l) => l.city === profile.city) ?? POPULAR_LOCATIONS[0];
  const utcOffset = CITY_UTC_OFFSET[profile.city] ?? turkeyUtcOffset(profile.year, profile.month, profile.day, profile.hour);
  
  // Construct precise UTC Date
  const utcDate = new Date(Date.UTC(
    profile.year,
    profile.month - 1,
    profile.day,
    profile.hour - utcOffset,
    profile.minute
  ));

  // Compute local solar hour
  const solarHour = localSolarHour(profile.hour, profile.minute, loc.longitude, utcOffset);

  // Helper to build a PlanetPlacement
  const makePlacement = (id: CelestialBodyId, lon: number): PlanetPlacement => {
    const nLon = norm(lon);
    const signIdx = Math.floor(nLon / 30) % 12;
    const sign = ZODIAC_SIGNS[signIdx];
    const degree = Math.floor(nLon % 30);
    const minute = Math.floor((nLon % 1) * 60);
    const meta = BODY_METADATA[id];

    return {
      id,
      name: meta.name,
      symbol: meta.symbol,
      longitude: nLon,
      signId: sign.id,
      signName: sign.name,
      signSymbol: sign.symbol,
      element: sign.element as 'Ateş' | 'Toprak' | 'Hava' | 'Su',
      modality: sign.modality as 'Öncü' | 'Sabit' | 'Değişken',
      degree,
      minute,
      formatted: `${degree}° ${minute.toString().padStart(2, '0')}' ${sign.name}`,
      meaning: meta.meaning,
    };
  };

  // Celestial longitudes from ephemeris
  const sunLon = longitude('sun', utcDate);
  const moonLon = longitude('moon', utcDate);
  const mercuryLon = longitude('mercury', utcDate);
  const venusLon = longitude('venus', utcDate);
  const marsLon = longitude('mars', utcDate);
  const jupiterLon = longitude('jupiter', utcDate);
  const saturnLon = longitude('saturn', utcDate);

  // Continuous Ascendant degree: At solar 06:00 ASC = Sun. 15° per solar hour.
  const ascLon = norm(sunLon + (solarHour - 6) * 15);

  const sun = makePlacement('sun', sunLon);
  const moon = makePlacement('moon', moonLon);
  const ascendant = makePlacement('ascendant', ascLon);
  const mercury = makePlacement('mercury', mercuryLon);
  const venus = makePlacement('venus', venusLon);
  const mars = makePlacement('mars', marsLon);
  const jupiter = makePlacement('jupiter', jupiterLon);
  const saturn = makePlacement('saturn', saturnLon);

  const all = [sun, moon, ascendant, mercury, venus, mars, jupiter, saturn];

  const elementCounts: Record<'Ateş' | 'Toprak' | 'Hava' | 'Su', number> = {
    Ateş: 0,
    Toprak: 0,
    Hava: 0,
    Su: 0,
  };
  for (const p of all) {
    elementCounts[p.element]++;
  }

  return {
    profile,
    utcDate,
    solarHour,
    sun,
    moon,
    ascendant,
    mercury,
    venus,
    mars,
    jupiter,
    saturn,
    all,
    elementCounts,
  };
}

// Aspect config
interface AspectDef {
  type: AspectType;
  name: string;
  symbol: string;
  target: number;
  maxOrb: number;
}

const ASPECT_DEFS: AspectDef[] = [
  { type: 'conjunction', name: 'Kavuşum', symbol: '☌', target: 0, maxOrb: 8.5 },
  { type: 'sextile', name: 'Sekstil', symbol: '⚹', target: 60, maxOrb: 5.5 },
  { type: 'square', name: 'Kare', symbol: '□', target: 90, maxOrb: 7.5 },
  { type: 'trine', name: 'Üçgen', symbol: '△', target: 120, maxOrb: 8.5 },
  { type: 'opposition', name: 'Karşıt', symbol: '☍', target: 180, maxOrb: 8.5 },
];

/**
 * Calculates inter-aspects between two charts and categorizes them with interpretations.
 */
export function calculateCrossAspects(p1: ChartPlacements, p2: ChartPlacements): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];

  const crossPairs: [CelestialBodyId, CelestialBodyId][] = [
    // Soul & Core Identity
    ['sun', 'moon'],
    ['moon', 'sun'],
    ['sun', 'sun'],
    ['moon', 'moon'],
    ['ascendant', 'sun'],
    ['sun', 'ascendant'],
    ['ascendant', 'moon'],
    ['moon', 'ascendant'],

    // Passion & Romance
    ['venus', 'mars'],
    ['mars', 'venus'],
    ['venus', 'venus'],
    ['mars', 'mars'],
    ['venus', 'ascendant'],
    ['ascendant', 'venus'],
    ['sun', 'venus'],
    ['venus', 'sun'],

    // Mind & Communication
    ['mercury', 'mercury'],
    ['mercury', 'sun'],
    ['sun', 'mercury'],
    ['mercury', 'moon'],
    ['moon', 'mercury'],
    ['mercury', 'venus'],
    ['venus', 'mercury'],

    // Karma, Growth & Longevity
    ['venus', 'jupiter'],
    ['jupiter', 'venus'],
    ['sun', 'jupiter'],
    ['jupiter', 'sun'],
    ['sun', 'saturn'],
    ['saturn', 'sun'],
    ['moon', 'saturn'],
    ['saturn', 'moon'],
    ['venus', 'saturn'],
    ['saturn', 'venus'],
  ];

  for (const [id1, id2] of crossPairs) {
    const pl1 = p1[id1 as keyof ChartPlacements] as PlanetPlacement;
    const pl2 = p2[id2 as keyof ChartPlacements] as PlanetPlacement;
    if (!pl1 || !pl2) continue;

    let diff = Math.abs(pl1.longitude - pl2.longitude) % 360;
    if (diff > 180) diff = 360 - diff;

    for (const def of ASPECT_DEFS) {
      // Slightly wider orb for Sun and Moon
      const isLuminary = pl1.id === 'sun' || pl1.id === 'moon' || pl2.id === 'sun' || pl2.id === 'moon';
      const effectiveMaxOrb = isLuminary ? def.maxOrb + 1.0 : def.maxOrb;
      const orb = Math.abs(diff - def.target);

      if (orb <= effectiveMaxOrb) {
        const orbStrength: 'exact' | 'strong' | 'moderate' =
          orb <= 2.0 ? 'exact' : orb <= 4.5 ? 'strong' : 'moderate';

        const interpretation = getAspectInterpretation(
          pl1,
          pl2,
          def.type,
          p1.profile.name,
          p2.profile.name
        );

        aspects.push({
          id: `${pl1.id}_${pl2.id}_${def.type}`,
          p1Planet: pl1,
          p2Planet: pl2,
          aspectType: def.type,
          aspectName: def.name,
          aspectSymbol: def.symbol,
          angle: def.target,
          actualAngle: Math.round(diff * 10) / 10,
          orb: Math.round(orb * 10) / 10,
          orbStrength,
          nature: interpretation.nature,
          category: interpretation.category,
          title: interpretation.title,
          summary: interpretation.summary,
          detailedInterpretation: interpretation.detail,
          scoreDelta: interpretation.scoreDelta * (orbStrength === 'exact' ? 1.4 : orbStrength === 'strong' ? 1.1 : 0.8),
        });
        break; // Only match one major aspect per pair
      }
    }
  }

  // Sort aspects: exact first, then strongest impact
  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Astrological interpretations and score weights for inter-planetary aspects.
 */
function getAspectInterpretation(
  p1: PlanetPlacement,
  p2: PlanetPlacement,
  type: AspectType,
  name1: string,
  name2: string
): {
  nature: AspectNature;
  category: AspectCategory;
  title: string;
  summary: string;
  detail: string;
  scoreDelta: number;
} {
  const pPair = `${p1.id}-${p2.id}`;

  // 1. Sun - Moon
  if (pPair === 'sun-moon' || pPair === 'moon-sun') {
    const sunPerson = p1.id === 'sun' ? name1 : name2;
    const moonPerson = p1.id === 'moon' ? name1 : name2;
    if (type === 'conjunction') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: 'Güneş Kavuşum Ay: Kutsal Ruh Bağı',
        summary: 'Astrolojide en güçlü ruh eşi göstergelerinden biri. Birbirinizi doğal bir ev hissiyle tamamlarsınız.',
        detail: `${sunPerson}'in bilinçli iradesi ile ${moonPerson}'in içsel duygusal gereksinimleri mükemmel bir telepatik uyum içinde akıyor. Yan yana olduğunuzda dünya gürültüsü diner.`,
        scoreDelta: 16,
      };
    }
    if (type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: `Güneş ${type === 'trine' ? 'Üçgen' : 'Sekstil'} Ay: Zahmetsiz Duygusal Ahenk`,
        summary: 'İçsel güven, şefkat ve birbirinin sınırlarını kendiliğinden anlama yetisi.',
        detail: `${sunPerson} parladığında ${moonPerson} kendini güvende hisseder; ${moonPerson}'in sezgileri ise ${sunPerson}'e yaşam enerjisi ve sıcak bir yuva alanı sunar.`,
        scoreDelta: 12,
      };
    }
    if (type === 'opposition') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: 'Güneş Karşıt Ay: Manyetik Zıt Kutuplar',
        summary: 'Yüksek çekim gücüne sahip zıtlık. Birbirinizi aynalar ve büyütürsünüz.',
        detail: 'Farklı karakterlere sahip olsanız da aranızdaki çekim karşı konulmazdır. İhtiyacınız olan şey birbirinizi değiştirmeye çalışmadan tamamlayıcı gücü kucaklamaktır.',
        scoreDelta: 8,
      };
    }
    return {
      nature: 'challenging',
      category: 'soul',
      title: 'Güneş Kare Ay: Duygusal İrade Sınavı',
      summary: 'Karakter ile hisler arasında dinamik sürtüşme; bilinçli çaba ve olgunluk gerektirir.',
      detail: `${sunPerson}'in hedefleri zaman zaman ${moonPerson}'in hassas duygusal ritmiyle çatışabilir. Açık iletişimle bu gerilim muazzam bir kişisel olgunlaşma motoruna dönüşür.`,
      scoreDelta: -5,
    };
  }

  // 2. Venus - Mars
  if (pPair === 'venus-mars' || pPair === 'mars-venus') {
    const venusPerson = p1.id === 'venus' ? name1 : name2;
    const marsPerson = p1.id === 'mars' ? name1 : name2;
    if (type === 'conjunction') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: 'Venüs Kavuşum Mars: Yoğun Manyetik Çekim',
        summary: 'Klasik aşk ve erotik çekim faseti. İlk andan itibaren hissedilen elektriksel kıvılcım.',
        detail: `${venusPerson}'in zarafeti ile ${marsPerson}'in arzusu kilit ve anahtar gibi birleşir. Tutku ve romantizm ilişkinin motor gücüdür.`,
        scoreDelta: 15,
      };
    }
    if (type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: `Venüs ${type === 'trine' ? 'Üçgen' : 'Sekstil'} Mars: Kusursuz Romantik Kimya`,
        summary: 'Zahmetsiz flört enerjisi, doğal tensel uyum ve paylaşılan romantizm sevinci.',
        detail: 'Birbirinizin arzu dilini doğal bir ritimle konuşursunuz. Sevgi ve tutku birbirini tüketmez, aksine sürekli besler.',
        scoreDelta: 12,
      };
    }
    if (type === 'opposition') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: 'Venüs Karşıt Mars: Karşı Konulmaz Tutku Kıvılcımı',
        summary: 'Yüksek voltajlı tensel manyetizma. Aradaki çekim her zaman canlı ve dinamiktir.',
        detail: 'Zaman zaman romantik beklentiler ile aceleci dürtüler çatışsa da, bu zıt kutup enerjisi ilişkiyi monotonluktan tamamen korur.',
        scoreDelta: 9,
      };
    }
    return {
      nature: 'challenging',
      category: 'passion',
      title: 'Venüs Kare Mars: Tutkulu Sürtüşme & Dinamik Kıvılcım',
      summary: 'Yüksek ateşli çekim fakat kırılgan ego dengesi. Sabır ve nezaketle yönetilmelidir.',
      detail: 'Tutku çok yüksektir ancak zamanlama uyumsuzlukları veya acelecilik küçük kırgınlıklara yol açabilir. Birlikte yavaşlamayı öğrenmek bağı derinleştirir.',
      scoreDelta: 3,
    };
  }

  // 3. Moon - Moon
  if (pPair === 'moon-moon') {
    if (type === 'conjunction' || type === 'trine') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: 'Ay - Ay Ahengi: Duygusal Telepati & Ortak Frekans',
        summary: 'Aynı duygusal dili konuşursunuz. Kelimeler olmadan birbirinizin halini anlama gücü.',
        detail: 'Ruh halleriniz, dinlenme ihtiyaçlarınız ve stres karşısındaki tepkileriniz benzer frekansta titreşir. Bu bağ sarsılmaz bir sığınak yaratır.',
        scoreDelta: 14,
      };
    }
    if (type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: 'Ay Sekstil Ay: Şefkatli Duygusal Destek',
        summary: 'Birbirinizin iç dünyasına saygı duyan nazik ve güven verici bir empati bağı.',
        detail: 'Farklı tepkiler verseniz bile birbirinizi yargılamadan dinleyebilir ve sıcak bir destek ortamı kurabilirsiniz.',
        scoreDelta: 9,
      };
    }
    return {
      nature: 'challenging',
      category: 'soul',
      title: 'Ay - Ay Gerilimi: Farklı Duygu İfade Dilleri',
      summary: 'Kriz anlarında farklı savunma mekanizmaları devreye girebilir; empati şarttır.',
      detail: 'Biriniz içe çekilmek isterken diğeriniz hemen konuşmak isteyebilir. Birbirinizin duygusal ritmine alan açmak ilişkinin anahtarıdır.',
      scoreDelta: -4,
    };
  }

  // 4. Sun - Sun
  if (pPair === 'sun-sun') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'growth',
        title: 'Güneş - Güneş Uyumu: Ortak Yaşam Enerjisi & Karşılıklı Saygı',
        summary: 'Benzer dünya görüşü, hedeflerde destek ve birbirinin varlığıyla gurur duyma.',
        detail: 'Birlikte parlamaktan keyif alırsınız. Birbirinizin bireyselliğini gölgelemeden aynı ufka doğru yürümek çok doğaldır.',
        scoreDelta: 10,
      };
    }
    return {
      nature: 'challenging',
      category: 'growth',
      title: 'Güneş - Güneş Sürtüşmesi: Ego & Liderlik Dengesi',
      summary: 'İki güçlü karakterin sınır çizme mücadelesi; eşitlikçi ortaklık kurulmalıdır.',
      detail: 'Kimsenin haklı çıkmaya çalışmadığı, kararların ortak alındığı bir paylaşım modeli geliştirmek ilişkinizi çok güçlendirir.',
      scoreDelta: -3,
    };
  }

  // 5. Sun - Venus (Romantic Warmth & Admiration)
  if (pPair === 'sun-venus' || pPair === 'venus-sun') {
    const sunPerson = p1.id === 'sun' ? name1 : name2;
    const venusPerson = p1.id === 'venus' ? name1 : name2;
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: 'Güneş - Venüs Ahengi: Romantik Hayranlık & Zarif Cazibe',
        summary: 'Biri parladığında diğeri onu sevgi ve hayranlıkla besler; kendinizi çok değerli hissedersiniz.',
        detail: `${sunPerson}'in varlığı ${venusPerson}'e ilham ve estetik coşku verir. Birlikteyken hem romantik hem de sosyal ortamlarda göz kamaştıran bir uyum sergilersiniz.`,
        scoreDelta: 12,
      };
    }
    return {
      nature: 'challenging',
      category: 'passion',
      title: 'Güneş - Venüs Sürtüşmesi: İlgi Beklentisi & Sevgi Dili Farkı',
      summary: 'Gurur ve ilgi arzusu zaman zaman çatışabilir; takdir duygusunu sıkça ifade edin.',
      detail: `${sunPerson}'in bireysel hedefleri ile ${venusPerson}'in ilgi ve romantizm arayışı farklı zamanlarda yükselebilir. Sevginizi küçük jestlerle teyit etmek bağı güçlendirir.`,
      scoreDelta: -3,
    };
  }

  // 6. Venus - Venus (Shared Aesthetics & Affection Style)
  if (pPair === 'venus-venus') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: 'Venüs - Venüs Uyumu: Ortak Zevkler & Sevgi Dili Birliği',
        summary: 'Romantik beklentiler, estetik beğeniler, finansal harcama dengesi ve sosyalleşme tarzı aynı frekansta.',
        detail: 'Neyi güzel bulduğunuz, nasıl dinlenmek istediğiniz ve sevgiyi nasıl ifade ettiğiniz birbirini mükemmel tamamlar. Hayatın keyiflerini paylaşmak büyük bir huzurdur.',
        scoreDelta: 11,
      };
    }
    return {
      nature: 'challenging',
      category: 'passion',
      title: 'Venüs - Venüs Zıtlığı: Farklı Değer Yargıları & Zevkler',
      summary: 'Sosyal beklentiler ve harcama önceliklerinde farklılık; esneklik gerektirir.',
      detail: 'Biriniz sadelik isterken diğeri gösteriş veya farklı bir estetik tarz arayabilir. Birbirinizin özgün zevklerine saygı göstermek ilişkiyi renklendirir.',
      scoreDelta: -3,
    };
  }

  // 7. Mars - Mars (Drive, Tempo & Conflict Style)
  if (pPair === 'mars-mars') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: 'Mars - Mars Dinamiği: Senkronize Eylem Gücü & Ortak Motivasyon',
        summary: 'Aynı hızda hareket eder, hedeflere birlikte koşar ve fiziksel aktivitelerde yüksek sinerji yakalarsınız.',
        detail: 'Girişimci ruhunuz ve eylem ritminiz birbirini besler. Birlikte bir projeye başladığınızda durdurulamaz bir takım oluşturursunuz.',
        scoreDelta: 9,
      };
    }
    return {
      nature: 'challenging',
      category: 'passion',
      title: 'Mars - Mars Sürtüşmesi: İnatlaşma & Rekabet Gerilimi',
      summary: 'İki güçlü iradenin liderlik mücadelesi; enerjiyi dış hedeflere yönlendirin.',
      detail: 'Öfke anlarında aceleci tepkiler birbirinizi incitebilir. Birbirinizle rekabet etmek yerine ortak bir zorluğu aşmak için güç birliği yapmalısınız.',
      scoreDelta: -5,
    };
  }

  // 8. Mercury - Mercury
  if (pPair === 'mercury-mercury') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'mind',
        title: 'Merkür - Merkür Ahengi: Zihinsel Dalga Boyu & Sonsuz Sohbet',
        summary: 'Saatlerce konuşabilme, ortak espri anlayışı ve krizleri akılla çözebilme kabiliyeti.',
        detail: 'Düşünce biçimleriniz birbirini tetikler ve zenginleştirir. Birlikte yeni şeyler öğrenmek ilişkinizin en keyifli ritüelidir.',
        scoreDelta: 11,
      };
    }
    return {
      nature: 'challenging',
      category: 'mind',
      title: 'Merkür - Merkür Gerilimi: Farklı Mantık ve İletişim Filtreleri',
      summary: 'Kelime seçimleri ve iletişim hızında farklılık; dinleme sabrı gerektirir.',
      detail: 'Tartışmalarda hızlı sonuca varmak yerine partnerinizin asıl kastettiği niyeti anlamaya çalışmak yanlış anlaşılmaları engeller.',
      scoreDelta: -4,
    };
  }

  // 9. Sun - Mercury (Mental Inspiration)
  if (pPair === 'sun-mercury' || pPair === 'mercury-sun') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'mind',
        title: 'Güneş - Merkür Diyaloğu: Zihinsel Uyarım & İlham Verici Fikirler',
        summary: 'Birbirinizin vizyonunu keskinleştiren ve düşüncelerine değer katan bir diyalog.',
        detail: 'Fikirlerinizi birbirinize açtığınızda dinlenildiğinizi ve anlaşıldığınızı hissedersiniz. Birlikte kararlar almak çok kolaydır.',
        scoreDelta: 9,
      };
    }
    return {
      nature: 'challenging',
      category: 'mind',
      title: 'Güneş - Merkür Tartışması: Haklı Çıkma Çabası & Eleştiri',
      summary: 'Fikir ayrılıklarında ego kırılganlığı; yapıcı diyaloğu koruyun.',
      detail: 'Partnerinizin eleştirilerini kişisel bir saldırı gibi almamak, fikir tartışmalarını oyuna dönüştürmek bağı rahatlatır.',
      scoreDelta: -3,
    };
  }

  // 10. Moon - Mercury (Heart-to-Mind Flow)
  if (pPair === 'moon-mercury' || pPair === 'mercury-moon') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'mind',
        title: 'Ay - Merkür Paylaşımı: Duyguları Sözcüklere Dökme Kolaylığı',
        summary: 'İç dünyanızı, hassasiyetlerinizi ve korkularınızı çekinmeden ifade edebilirsiniz.',
        detail: 'Zihin ile kalp arasında köprü kurulur. Birbirinizin duygu hallerini mantıkla anlayıp şefkatle sakinleştirebilirsiniz.',
        scoreDelta: 10,
      };
    }
    return {
      nature: 'challenging',
      category: 'mind',
      title: 'Ay - Merkür Gerilimi: Mantık ile Hislerin Çatışması',
      summary: 'Biri mantıklı açıklamalar yaparken diğeri sadece sarılınmasını isteyebilir.',
      detail: 'Duygusal anlarda aşırı analiz yapmak yerine kalple dinlemeyi seçmek ilişkinin en büyük ilacıdır.',
      scoreDelta: -3,
    };
  }

  // 11. Venus - Mercury (Sweet Romantic Communication)
  if (pPair === 'venus-mercury' || pPair === 'mercury-venus') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'mind',
        title: 'Venüs - Merkür Zarafeti: Tatlı Dil, İltifatlar & Nezaket',
        summary: 'İletişiminizde romantik bir melodi vardır; tatlı sözler ve zarif mizah hakimdir.',
        detail: 'Birbirinize güzel mesajlar yazmak, sanat ve edebiyat üzerine sohbet etmek ilişkinin en tatlı yanlarından biridir.',
        scoreDelta: 10,
      };
    }
    return {
      nature: 'neutral',
      category: 'mind',
      title: 'Venüs - Merkür Çelişkisi: İfade Tarzında Farklılık',
      summary: 'Sözlü sevgi ifadeleri ile gerçek beklentiler arasında küçük ton farkları.',
      detail: 'İletişimde net ve samimi olmak, ima etmek yerine açıkça istemek bu açıyı olumluya çevirir.',
      scoreDelta: 2,
    };
  }

  // 12. Sun - Jupiter (Luck, Optimism & Joy)
  if (pPair === 'sun-jupiter' || pPair === 'jupiter-sun') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'growth',
        title: 'Güneş - Jüpiter Şansı: Yaşam Coşkusu & Ortak Ufuklar',
        summary: 'Birbirinizin hayatına bereket, seyahat hevesi ve pozitif enerji katarsınız.',
        detail: 'Birlikteyken dünya daha geniş ve olanaklarla dolu görünür. Birbirinizi kısıtlamaz, aksine büyütür ve cesaretlendirirsiniz.',
        scoreDelta: 11,
      };
    }
    return {
      nature: 'neutral',
      category: 'growth',
      title: 'Güneş - Jüpiter Abartısı: Aşırı İyimserlik & Büyük Vaatler',
      summary: 'Planlarda gerçekçilikten uzaklaşma riski; detayları atlamayın.',
      detail: 'Coşkunuz çok yüksektir ancak pratik hayatın gerekliliklerini ve sınırlarını unutmamak önemlidir.',
      scoreDelta: 4,
    };
  }

  // 13. Moon - Jupiter (Emotional Generosity)
  if (pPair === 'moon-jupiter' || pPair === 'jupiter-moon') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'soul',
        title: 'Ay - Jüpiter Huzuru: Duygusal Cömertlik & İçsel Bereket',
        summary: 'Birbirinizin yanında sonsuz bir huzur ve koruyucu bir meleksi atmosfer hissedersiniz.',
        detail: 'Duygusal yaraları saran, affedici ve cömert bir sevgi akışı vardır. Evinizde neşe ve misafirperverlik eksik olmaz.',
        scoreDelta: 11,
      };
    }
    return {
      nature: 'neutral',
      category: 'soul',
      title: 'Ay - Jüpiter Genişlemesi: Duygusal Hassasiyetin Büyümesi',
      summary: 'Küçük hislerin hızla büyümesi; dengeli ve sakin kalmak faydalıdır.',
      detail: 'Birbirinize karşı çok iyi niyetlisiniz; sınırları koruyarak duygusal dengeyi sağlamak ilişkiyi berrak tutar.',
      scoreDelta: 3,
    };
  }

  // 14. Venus - Jupiter (Romance & Indulgence)
  if (pPair === 'venus-jupiter' || pPair === 'jupiter-venus') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'growth',
        title: 'Venüs - Jüpiter Bereketi: Romantik Neşe, Cömertlik & Lüks',
        summary: 'Birbirinizin hayatına şans, kahkaha, seyahat hevesi ve bolluk katarsınız.',
        detail: 'Birlikteyken kendinizi dünyanın en şanslı insanı gibi hissedersiniz. Birbirinize hediyeler vermek ve hayatı kutlamak doğal bir alışkanlıktır.',
        scoreDelta: 12,
      };
    }
    return {
      nature: 'challenging',
      category: 'growth',
      title: 'Venüs - Jüpiter Abartısı: Savurganlık & Gerçekçi Olmayan Romantik Beklenti',
      summary: 'Harcamalarda veya romantik standartlarda dengenin kaçması riski.',
      detail: 'İlişkiyi sadece eğlence ve lüksle tanımlamamak, sıradan günlerin sade huzurunu da takdir etmek bağı dengeler.',
      scoreDelta: -2,
    };
  }

  // 15. Sun - Saturn (Rock-Solid Commitment)
  if (pPair === 'sun-saturn' || pPair === 'saturn-sun') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'karma',
        title: 'Güneş - Satürn Omurgası: Sarsılmaz Ciddiyet, Sadakat & Olgunluk',
        summary: 'İlişkinin uzun vadeli harcı. Zamanın yıpratamadığı sorumluluk ve sadakat.',
        detail: 'Fırtınalı dönemlerde birbirinizin elini bırakmazsınız. Güven, dürüstlük ve ortak inşa edilen bir gelecek bu ilişkinin omurgasıdır.',
        scoreDelta: 13,
      };
    }
    return {
      nature: 'challenging',
      category: 'karma',
      title: 'Güneş - Satürn Sınavı: Otorite Baskısı & Soğukluk Hissi',
      summary: 'Zaman zaman ilişkinin bir görev gibi algılanması riski; neşeyi canlı tutun.',
      detail: 'Aşırı eleştirel olmaktan kaçınmak ve birbirinize hafiflik, oyun ve eğlence alanı açmak ilişkinin kalıcılığını sıcacık tutar.',
      scoreDelta: -5,
    };
  }

  // 16. Moon - Saturn (Emotional Endurance)
  if (pPair === 'moon-saturn' || pPair === 'saturn-moon') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'karma',
        title: 'Ay - Satürn Güvencesi: Duygusal İstikrar & Sığınak',
        summary: 'Duygusal iniş çıkışlarda birbirine kaya gibi sağlam bir dayanak sunabilme gücü.',
        detail: 'Partnerinize güvenebileceğinizi bilirsiniz. Birlikte bir ev ve düzen kurmak iki taraf için de emniyet hissi yaratır.',
        scoreDelta: 11,
      };
    }
    return {
      nature: 'challenging',
      category: 'karma',
      title: 'Ay - Satürn Mesafesi: Duyguları İfade Etme Çekingenliği',
      summary: 'Kırılmaktan korkarak içe kapanma eğilimi; şefkatle yaklaşılmalıdır.',
      detail: 'Partnerinize koşulsuz sevgi hissettirmek, duygusal duvarları yumuşak bir dille eritmek bu açıyı olgunlaştırır.',
      scoreDelta: -5,
    };
  }

  // 17. Venus - Saturn (Eternal Love & Duty)
  if (pPair === 'venus-saturn' || pPair === 'saturn-venus') {
    if (type === 'conjunction' || type === 'trine' || type === 'sextile') {
      return {
        nature: 'harmonious',
        category: 'karma',
        title: 'Venüs - Satürn Mührü: Ebedi Sadakat & Sarsılmaz Saygı',
        summary: 'Klasik evlilik ve ömürlük ortaklık göstergesi. Zaman geçtikçe kök salan derin bir sevgi.',
        detail: 'Birbirinizin kıymetini bilir ve ilişkinizi dış etkenlerden korursunuz. Sadakat bu bağın en kutsal değeridir.',
        scoreDelta: 12,
      };
    }
    return {
      nature: 'challenging',
      category: 'karma',
      title: 'Venüs - Satürn Engeli: Sevgi Göstermede Çekingenlik',
      summary: 'Romantik jestlerde tutukluk veya yetersizlik hissi; güven pekiştirilmelidir.',
      detail: 'Kusursuz olmaya çalışmadan sevginizi içtenlikle ifade etmek ve birbirinizi yargılamamak aradaki sıcaklığı korur.',
      scoreDelta: -4,
    };
  }

  // 18. Ascendant Links (First Impression, Aura & Physical Magnetism)
  if (pPair.includes('ascendant')) {
    if (type === 'conjunction' || type === 'trine') {
      return {
        nature: 'harmonious',
        category: 'passion',
        title: `${p1.name} - ${p2.name} Uyumu: Güçlü İlk Çekim & Aura Ahengi`,
        summary: 'Birbirinizin dış dünyaya yaydığı enerjiden ve duruşundan büyülenirsiniz.',
        detail: 'Karşılıklı fiziksel aura ve hayata bakış açısı doğal bir hayranlık uyandırır. Yan yana bir çift olarak çok etkileyici bir ahenk sergilersiniz.',
        scoreDelta: 10,
      };
    }
    return {
      nature: 'neutral',
      category: 'passion',
      title: `${p1.name} - ${p2.name} Açısı: Farklı Tarzların Zenginliği`,
      summary: 'Yaşama yaklaşım biçimlerindeki farklılıklar birbirinize yeni bakış açıları kazandırır.',
      detail: 'Birinizin temkinli duruşu diğerinizin cesur tavrıyla dengelenerek hayata karşı güçlü bir takım oluşturur.',
      scoreDelta: 4,
    };
  }

  // Fallback generic aspect
  return {
    nature: type === 'trine' || type === 'sextile' ? 'harmonious' : type === 'conjunction' ? 'neutral' : 'challenging',
    category: 'growth',
    title: `${p1.name} ${type === 'conjunction' ? 'Kavuşum' : type === 'trine' ? 'Üçgen' : type === 'sextile' ? 'Sekstil' : type === 'square' ? 'Kare' : 'Karşıt'} ${p2.name}`,
    summary: `${p1.name} ile ${p2.name} enerjileri arasında ${type} açısı devrede.`,
    detail: `Bu etkileşim iki haritanın belirli fasetlerini bir araya getirerek öğrenme ve ortak paydada buluşma alanı açar.`,
    scoreDelta: type === 'trine' ? 7 : type === 'sextile' ? 5 : type === 'conjunction' ? 6 : -3,
  };
}

/**
 * Calculates complete synastry analysis, dimensional ratings and synthesis.
 */
export function analyzeSynastry(p1: ChartPlacements, p2: ChartPlacements): SynastryAnalysisResult {
  const aspects = calculateCrossAspects(p1, p2);
  const harmoniousAspects = aspects.filter((a) => a.nature === 'harmonious');
  const challengingAspects = aspects.filter((a) => a.nature === 'challenging');

  // 1. Elemental Accord
  let elementalScore = 50;
  const p1SunElem = p1.sun.element;
  const p2SunElem = p2.sun.element;
  const p1MoonElem = p1.moon.element;
  const p2MoonElem = p2.moon.element;

  // Sun-Sun element
  if (p1SunElem === p2SunElem) elementalScore += 16;
  else if (
    (p1SunElem === 'Ateş' && p2SunElem === 'Hava') ||
    (p1SunElem === 'Hava' && p2SunElem === 'Ateş') ||
    (p1SunElem === 'Toprak' && p2SunElem === 'Su') ||
    (p1SunElem === 'Su' && p2SunElem === 'Toprak')
  ) {
    elementalScore += 14;
  } else {
    elementalScore += 4;
  }

  // Moon-Moon element
  if (p1MoonElem === p2MoonElem) elementalScore += 16;
  else if (
    (p1MoonElem === 'Ateş' && p2MoonElem === 'Hava') ||
    (p1MoonElem === 'Hava' && p2MoonElem === 'Ateş') ||
    (p1MoonElem === 'Toprak' && p2MoonElem === 'Su') ||
    (p1MoonElem === 'Su' && p2MoonElem === 'Toprak')
  ) {
    elementalScore += 12;
  }

  // Clamp elemental score (0-100)
  elementalScore = Math.min(98, Math.max(45, elementalScore));

  const elementalAccord = {
    score: elementalScore,
    label:
      elementalScore >= 80
        ? 'Doğal Element Sinerjisi'
        : elementalScore >= 65
        ? 'Dengeli & Tamamlayıcı Elementler'
        : 'Zıt Kutupların Dinamik Çekimi',
    description: `${p1.profile.name} (${p1SunElem} Güneş / ${p1MoonElem} Ay) ile ${p2.profile.name} (${p2SunElem} Güneş / ${p2MoonElem} Ay) arasında ${
      elementalScore >= 75 ? 'akıcı ve kendiliğinden gelişen bir rezonans' : 'birbirini dönüştüren ve besleyen bir dinamizm'
    } hakimdir.`,
  };

  // 2. Dimensional Sub-Scores (0-100)
  const calcDim = (category: AspectCategory, base: number) => {
    const catAspects = aspects.filter((a) => a.category === category);
    let pos = 0;
    let neg = 0;
    for (const a of catAspects) {
      if (a.scoreDelta > 0) pos += a.scoreDelta;
      else neg += Math.abs(a.scoreDelta);
    }
    const net = (pos * 0.7) - (neg * 0.9);
    return Math.min(96, Math.max(38, Math.round(base + net * 0.65)));
  };

  const soulScore = calcDim('soul', 56 + (p1MoonElem === p2MoonElem ? 8 : 0));
  const passionScore = calcDim('passion', 54);
  const mindScore = calcDim('mind', 55);
  const karmaScore = calcDim('karma', 53);

  // 3. Overall Score
  // Balanced combination of aspect harmony ratio + elemental base
  const positiveDeltas = aspects.filter((a) => a.scoreDelta > 0).map((a) => a.scoreDelta);
  const negativeDeltas = aspects.filter((a) => a.scoreDelta < 0).map((a) => Math.abs(a.scoreDelta));
  const posSum = positiveDeltas.reduce((s, d) => s + d, 0);
  const negSum = negativeDeltas.reduce((s, d) => s + d, 0);

  const netAspectEffect = (posSum * 0.45) - (negSum * 0.75);
  let overallScore = Math.round(52 + netAspectEffect * 0.45 + (elementalScore - 50) * 0.3);
  overallScore = Math.min(97, Math.max(36, overallScore));

  let compatibilityLevel = 'Dengeli & Öğretici Bağ';
  let summaryText = 'Birbirinize yeni bakış açıları katan, sabır ve empatiyle çok derinleşebilecek dinamik bir bağ.';

  if (overallScore >= 90) {
    compatibilityLevel = 'Nadir Bulunan Kozmik Ruh Bağı';
    summaryText = 'Gökyüzünde çok az çifte nasip olan güçlü bir rezonans. Hem ruhsal huzur hem de manyetik tutku aynı anda titreşiyor.';
  } else if (overallScore >= 80) {
    compatibilityLevel = 'Yüksek Sinerji & Manyetik Uyum';
    summaryText = 'Doğal bir çekim ve güçlü bir dayanışma potansiyeli. Birbirinizin hayatını zenginleştiren sağlam bir ortaklık.';
  } else if (overallScore >= 68) {
    compatibilityLevel = 'Uyumlu & Tamamlayıcı Ortaklık';
    summaryText = 'Farklılıkların birbirini tamamladığı, yapıcı diyalogla uzun yıllar parıldayabilecek sağlıklı bir bağ.';
  }

  // 4. Strengths & Growth Areas
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  for (const a of harmoniousAspects.slice(0, 3)) {
    strengths.push(`${a.title}: ${a.summary}`);
  }
  if (elementalScore >= 75) {
    strengths.push(`Elementel Bütünlük: ${elementalAccord.label}`);
  }

  for (const a of challengingAspects.slice(0, 3)) {
    growthAreas.push(`${a.title}: ${a.summary}`);
  }

  if (strengths.length === 0) {
    strengths.push('Bireysel Bağımsızlık: Birbirinizin kişisel alanına saygı duyarak özgür bir bağ kurabilme kabiliyeti.');
  }
  if (growthAreas.length === 0) {
    growthAreas.push('Rutin Tehlikesi: Aşırı rahatlık ve uyum içinde heyecanı taze tutmayı ve birlikte yeni maceralara atılmayı ihmal etmeyin.');
  }

  const advice =
    overallScore >= 85
      ? `${p1.profile.name} ve ${p2.profile.name}, bu harika kozmik uyumu korumak için birbirinize şükran duymayı ve küçük jestleri asla aksatmayın.`
      : overallScore >= 70
      ? `İletişimde dürüst ve şeffaf kalmak, farklılıklarınızı bir zenginlik olarak görmek bu ilişkiyi zamanla sarsılmaz bir kaleye dönüştürür.`
      : `Zorlayıcı açılar ilişkinin tutkalı olabilir; kriz anlarında aceleci tepkiler vermek yerine sakinleşip ortak bir dilde buluşmayı seçin.`;

  return {
    overallScore,
    compatibilityLevel,
    summaryText,
    dimensionScores: {
      soul: soulScore,
      passion: passionScore,
      mind: mindScore,
      karma: karmaScore,
    },
    aspects,
    harmoniousAspects,
    challengingAspects,
    elementalAccord,
    strengths,
    growthAreas,
    advice,
  };
}
