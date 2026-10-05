/**
 * Personal natal reading built from the real sky at the birth moment: exact degrees, the Sun's
 * decan, the Moon's sign and birth phase, the Ascendant, planets in signs and whole-sign houses,
 * major aspects, planets retrograde at birth and the element/modality balance.
 */

import { getMoonPhase, isRetrograde, type GeocentricPlanet } from '@/lib/astrophysics/skyDomeEphemeris';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { nameCase } from '@/lib/text';
import { ZODIAC_PROFILES } from '@/data/zodiacProfiles';
import {
  ASC_IN_SIGN, BIRTH_MOON_PHASE, ELEMENT_DOMINANT, ELEMENT_MISSING, HOUSE_AREA, JUPITER_BY_ELEMENT, MARS_IN_SIGN,
  MERCURY_IN_SIGN, MODALITY_DOMINANT, MOON_IN_SIGN, PLANET_ROLE, SATURN_BY_ELEMENT, VENUS_IN_SIGN, elementOfSign,
} from '@/data/natalTexts';
import { longitude, type SkyBody } from './dailySky';
import { aspectBetween, ascendantLongitude, wholeSignHouse } from './natal';

const BODIES: { key: SkyBody; name: string; symbol: string; keyword: string }[] = [
  { key: 'sun', name: 'Güneş', symbol: '☉', keyword: 'irade ve kimlik' },
  { key: 'moon', name: 'Ay', symbol: '☽', keyword: 'duygular ve ihtiyaçlar' },
  { key: 'mercury', name: 'Merkür', symbol: '☿', keyword: 'düşünce ve iletişim' },
  { key: 'venus', name: 'Venüs', symbol: '♀', keyword: 'sevgi ve değerler' },
  { key: 'mars', name: 'Mars', symbol: '♂', keyword: 'eylem ve arzu' },
  { key: 'jupiter', name: 'Jüpiter', symbol: '♃', keyword: 'büyüme ve inanç' },
  { key: 'saturn', name: 'Satürn', symbol: '♄', keyword: 'disiplin ve sorumluluk' },
];

const ASPECT_TEXT: Record<string, (a: string, b: string) => string> = {
  Kavuşum: (a, b) => `${a} ile ${b} haritanda kaynaşmış durumda; bu iki alan hayatında birlikte çalışır ve birbirini yoğunlaştırır.`,
  Altmışlık: (a, b) => `${a} ile ${b} arasında kolay bir iş birliği var; fırsatı gördüğünde bu ikisini birleştirmek sana yetenek gibi gelir.`,
  Üçgen: (a, b) => `${a} ile ${b} doğal bir akış içinde; bu alanda çaba harcamadan ilerlediğin, insanların sende fark ettiği bir uyum var.`,
  Kare: (a, b) => `${a} ile ${b} arasında bir gerilim var; zaman zaman iç çatışma yaşatsa da seni harekete geçiren ve büyüten bir sürtüşme bu.`,
  Karşıt: (a, b) => `${a} ile ${b} karşı karşıya; iki uç arasında denge kurmak hayat derslerinden biri ve bu gerilim çoğu zaman ilişkilerine yansır.`,
};

// A few pairs have their own well-known meaning
const SPECIAL: Record<string, Record<string, string>> = {
  'sun-moon': {
    Kavuşum: 'Güneş ve Ay kavuşumda (Yeni Ay doğumu): iradeyle duyguların aynı yöne bakar; kendinle barışık ama kendine dönük bir doğa.',
    Karşıt: 'Güneş ve Ay karşıt (Dolunay doğumu): istediğinle ihtiyaç duyduğun arasında bir çekişme; ilişkiler bu dengeyi kurmanı öğretir.',
    Kare: 'Güneş ve Ay kare: iç dünyan ile dış hedeflerin sürtüşür; bu gerilim seni sürekli geliştiren bir motor olur.',
    Üçgen: 'Güneş ve Ay üçgen: iradeyle duygular uyum içinde; iç huzurun sağlam, kendinle barışıksın.',
  },
  'venus-mars': {
    Kavuşum: 'Venüs ve Mars kavuşumda: tutku ve sevgi iç içe; çekiciliğin güçlü, ilişkilerde yoğun bir enerji taşırsın.',
    Kare: 'Venüs ve Mars kare: arzu ile sevgi arasında gerilim; ilişkilerde kıvılcım bol ama sürtüşme de eksik olmaz.',
    Üçgen: 'Venüs ve Mars üçgen: romantizm ve tutku dengede; sevgini göstermek ve istediğini almak sana kolay gelir.',
    Karşıt: 'Venüs ve Mars karşıt: çekim güçlü ama ihtiyaçlar farklı; ilişkilerde vermekle almak arasında denge kurmayı öğrenirsin.',
  },
  'sun-saturn': {
    Kavuşum: 'Güneş ve Satürn kavuşumda: ciddiyet ve sorumluluk erken yaşta karakterine işlemiş; yaş aldıkça gevşer ve güçlenirsin.',
    Kare: 'Güneş ve Satürn kare: kendini kanıtlama baskısı hissedebilirsin; sabırla kurduğun her şey kalıcı olur.',
    Karşıt: 'Güneş ve Satürn karşıt: otorite figürleriyle sınanırsın; kendi otoriteni kurdukça bu gerilim çözülür.',
  },
};

const RETRO_TEXT: Partial<Record<GeocentricPlanet, string>> = {
  mercury: 'Merkür geri hareketli doğmuşsun: düşüncelerini söze dökmeden önce içinde uzun uzun işlersin; yazmak ve tekrar gözden geçirmek sana iyi gelir.',
  venus: 'Venüs geri hareketli doğmuşsun: sevgi ve değerlerini başkalarının ölçüsüyle değil kendi iç ölçünle tanımlarsın; ilişkilerde geçmiş sık sık geri döner.',
  mars: 'Mars geri hareketli doğmuşsun: enerjini dışa vurmadan önce biriktirirsin; öfkeni ifade etmenin sağlıklı yollarını bulmak önemlidir.',
  jupiter: 'Jüpiter geri hareketli doğmuşsun: inançların ve anlam arayışın içsel bir yolculuktur; büyümeyi dışarıda değil içinde ararsın.',
  saturn: 'Satürn geri hareketli doğmuşsun: sorumluluk ve disiplin dışarıdan dayatıldığında değil, kendin seçtiğinde işe yarar.',
};

export interface NatalPlacement {
  key: SkyBody | 'asc';
  name: string;
  symbol: string;
  lon: number;
  sign: number;
  signName: string;
  degree: number;
  house: number;
  retro: boolean;
}

export interface NatalReadingResult {
  summary: string;
  sun: { title: string; text: string; decan: string; cusp: string | null };
  moon: { title: string; text: string; phase: string };
  ascendant: { title: string; text: string };
  personalPlanets: { title: string; text: string }[];
  social: { title: string; text: string }[];
  houses: { title: string; text: string }[];
  aspects: { title: string; text: string; nature: string }[];
  retrogrades: string[];
  balance: { elements: Record<string, number>; modalities: Record<string, number>; text: string[] };
  placements: NatalPlacement[];
}

const deg = (lon: number) => `${Math.floor(lon % 30)}°${String(Math.floor(((lon % 30) % 1) * 60)).padStart(2, '0')}′`;

export function natalReading(instant: Date, latitude: number, longitudeDeg: number): NatalReadingResult {
  const ascLon = ascendantLongitude(instant, latitude, longitudeDeg);
  const ascSign = Math.floor(ascLon / 30) % 12;

  const placements: NatalPlacement[] = BODIES.map((b) => {
    const lon = longitude(b.key, instant);
    const sign = Math.floor(lon / 30) % 12;
    const retro = b.key !== 'sun' && b.key !== 'moon' ? isRetrograde(b.key as GeocentricPlanet, instant) : false;
    return { key: b.key, name: b.name, symbol: b.symbol, lon, sign, signName: ZODIAC_SIGNS[sign].name, degree: Math.floor(lon % 30), house: wholeSignHouse(sign, ascSign), retro };
  });
  placements.push({ key: 'asc', name: 'Yükselen', symbol: 'ASC', lon: ascLon, sign: ascSign, signName: ZODIAC_SIGNS[ascSign].name, degree: Math.floor(ascLon % 30), house: 1, retro: false });
  const P = Object.fromEntries(placements.map((p) => [p.key, p])) as Record<string, NatalPlacement>;

  // Sun: decan (triplicity) and cusp
  const sun = P.sun;
  const decanIdx = Math.min(2, Math.floor((sun.lon % 30) / 10));
  const decanSign = ZODIAC_SIGNS[(sun.sign + decanIdx * 4) % 12];
  const inSign = sun.lon % 30;
  const cusp =
    inSign < 1.5
      ? `Güneş burcuna yeni girmişken doğdun: önceki burç ${nameCase(ZODIAC_SIGNS[(sun.sign + 11) % 12].name, 'ilgi', '’')} tonunu da taşırsın.`
      : inSign > 28.5
        ? `Güneş burcundan çıkmak üzereyken doğdun: sonraki burç ${nameCase(ZODIAC_SIGNS[(sun.sign + 1) % 12].name, 'ilgi', '’')} tonunu da taşırsın.`
        : null;
  const profile = ZODIAC_PROFILES[ZODIAC_SIGNS[sun.sign].id];

  // Moon phase at birth
  const phase = getMoonPhase(instant);

  // Balance (Sun, Moon, Mercury, Venus, Mars, Ascendant weigh more than Jupiter/Saturn)
  const weights: Record<string, number> = { sun: 2, moon: 2, asc: 2, mercury: 1, venus: 1, mars: 1, jupiter: 0.5, saturn: 0.5 };
  const elements: Record<string, number> = { Ateş: 0, Toprak: 0, Hava: 0, Su: 0 };
  const modalities: Record<string, number> = { Öncü: 0, Sabit: 0, Değişken: 0 };
  for (const p of placements) {
    const w = weights[p.key] ?? 1;
    elements[ZODIAC_SIGNS[p.sign].element] += w;
    modalities[ZODIAC_SIGNS[p.sign].modality] += w;
  }
  const topEl = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const topMod = Object.entries(modalities).sort((a, b) => b[1] - a[1])[0][0];
  const balanceText = [ELEMENT_DOMINANT[topEl[0][0]], MODALITY_DOMINANT[topMod]];
  if (topEl[3][1] <= 0.5) balanceText.push(ELEMENT_MISSING[topEl[3][0]]);

  // Aspects among the seven bodies
  const aspects: NatalReadingResult['aspects'] = [];
  for (let i = 0; i < BODIES.length; i++) {
    for (let j = i + 1; j < BODIES.length; j++) {
      const A = BODIES[i], B = BODIES[j];
      const asp = aspectBetween(P[A.key].lon, P[B.key].lon);
      if (!asp) continue;
      const special = SPECIAL[`${A.key}-${B.key}`]?.[asp.name];
      aspects.push({
        title: `${A.name} ${asp.symbol} ${B.name} · ${asp.name} (orb ${asp.orbUsed}°)`,
        text: special ?? ASPECT_TEXT[asp.name](`${A.name} (${A.keyword})`, `${B.name} (${B.keyword})`),
        nature: asp.nature,
      });
    }
  }

  const houses = BODIES.map((b) => {
    const p = P[b.key];
    const h = HOUSE_AREA[p.house - 1];
    return {
      title: `${b.name} ${p.house}. evde · ${h.area}`,
      text: `${b.name}, ${PLANET_ROLE[b.key]} hayatının ${h.text} alanına taşır.`,
    };
  });

  const sunEl = ZODIAC_SIGNS[sun.sign].element, moonEl = ZODIAC_SIGNS[P.moon.sign].element;
  const bond =
    sunEl === moonEl
      ? 'Güneş ve Ay aynı elementte: istediğinle hissettiğin aynı dili konuşur.'
      : (['Ateş', 'Hava'].includes(sunEl) && ['Ateş', 'Hava'].includes(moonEl)) || (['Toprak', 'Su'].includes(sunEl) && ['Toprak', 'Su'].includes(moonEl))
        ? 'Güneş ve Ay birbirini besleyen elementlerde: iç dünyanla dış hedeflerin uyumlu.'
        : 'Güneş ve Ay farklı mizaçlarda: içinden geçenle dışarıya gösterdiğin bazen farklıdır; bu çeşitlilik seni zengin kılar.';

  return {
    summary: `Güneş ${sun.signName} ${deg(sun.lon)}, Ay ${P.moon.signName} ${deg(P.moon.lon)}, Yükselen ${P.asc.signName} ${deg(ascLon)}. ${bond} Dünyaya ${ZODIAC_SIGNS[ascSign].name} yükseleninin tavrıyla açılır, ${ZODIAC_SIGNS[sun.sign].name} Güneş’inle yön bulur, ${ZODIAC_SIGNS[P.moon.sign].name} Ay’ınla beslenirsin.`,
    sun: {
      title: `Güneş ${sun.signName} ${deg(sun.lon)} · ${sun.house}. ev`,
      text: profile?.personality ?? '',
      decan: `${decanIdx + 1}. dekan (${decanIdx * 10}°–${decanIdx * 10 + 10}°): ${decanSign.name} tonu. ${decanIdx === 0 ? 'Burcunun özünü en saf hâliyle taşırsın.' : `${decanSign.name} burcunun ${decanSign.element.toLowerCase()} enerjisi karakterine ek bir renk katar.`}`,
      cusp,
    },
    moon: { title: `Ay ${P.moon.signName} ${deg(P.moon.lon)} · ${P.moon.house}. ev`, text: MOON_IN_SIGN[P.moon.sign], phase: BIRTH_MOON_PHASE[phase.key] },
    ascendant: { title: `Yükselen ${P.asc.signName} ${deg(ascLon)}`, text: ASC_IN_SIGN[ascSign] },
    personalPlanets: [
      { title: `Merkür ${P.mercury.signName} ${deg(P.mercury.lon)}${P.mercury.retro ? ' · geri' : ''}`, text: MERCURY_IN_SIGN[P.mercury.sign] },
      { title: `Venüs ${P.venus.signName} ${deg(P.venus.lon)}${P.venus.retro ? ' · geri' : ''}`, text: VENUS_IN_SIGN[P.venus.sign] },
      { title: `Mars ${P.mars.signName} ${deg(P.mars.lon)}${P.mars.retro ? ' · geri' : ''}`, text: MARS_IN_SIGN[P.mars.sign] },
    ],
    social: [
      { title: `Jüpiter ${P.jupiter.signName} ${deg(P.jupiter.lon)}`, text: JUPITER_BY_ELEMENT[elementOfSign(P.jupiter.sign)] },
      { title: `Satürn ${P.saturn.signName} ${deg(P.saturn.lon)}`, text: SATURN_BY_ELEMENT[elementOfSign(P.saturn.sign)] },
    ],
    houses,
    aspects,
    retrogrades: placements.filter((p) => p.retro).map((p) => RETRO_TEXT[p.key as GeocentricPlanet]).filter(Boolean) as string[],
    balance: { elements, modalities, text: balanceText },
    placements,
  };
}
