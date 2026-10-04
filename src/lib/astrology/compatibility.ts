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
  'Hava-Toprak': 'Hava özgürlük, toprak güvence arar: fikirleri somut planlara bağladıklarında güçlüdürler.',
};

const MODALITY_TEXT: Record<string, string> = {
  same: 'Aynı nitelik: aynı tempoda yaşarsınız, ama ikiniz de aynı anda geri adım atmakta zorlanabilirsiniz.',
  'Öncü-Sabit': 'Öncü burç başlatır, sabit burç sürdürür: iyi bir iş bölümü.',
  'Öncü-Değişken': 'Öncü burç yön verir, değişken burç uyum sağlar: esnek bir ortaklık.',
  'Sabit-Değişken': 'Sabit burç kararlılık, değişken burç esneklik getirir: birbirinizi dengelersiniz.',
};

export interface CompatibilityResult {
  score: number;
  verdict: string;
  relation: string;
  relationText: string;
  elementText: string;
  modalityText: string;
  traditional: boolean;
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
  return { score, verdict, relation: rel.name, relationText: rel.text, elementText, modalityText, traditional };
}
