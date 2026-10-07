/**
 * Search-friendly fold for Turkish text: locale-aware lowercase with diacritics
 * removed, so "gunes", "GÜNEŞ" and "Güneş" all compare equal.
 */
export function foldTr(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const TR_VOWELS = 'aıoueiöü';

/**
 * Özel isme kesme işaretiyle hal eki: ilgi ("Elif'in", "Can'ın", "Ayşe'nin"), yönelme
 * ("Elif'e", "Can'a", "Ayşe'ye") ya da bulunma ("Jüpiter'de", "Mars'ta", "Dünya'da").
 * Büyük ünlü uyumuna, ünlüyle biten isimlerdeki kaynaştırmaya ve ünsüz benzeşmesine uyar.
 */
export function nameCase(name: string, kind: 'ilgi' | 'yonelme' | 'bulunma', apostrophe = "'"): string {
  const n = name.trim();
  const letters = [...n.toLocaleLowerCase('tr-TR')].filter((c) => /[a-zçğıöşü]/.test(c));
  const last = [...letters].reverse().find((c) => TR_VOWELS.includes(c)) ?? 'e';
  const final = letters[letters.length - 1] ?? '';
  const endsWithVowel = TR_VOWELS.includes(final);
  const back = 'aıou'.includes(last);
  if (kind === 'ilgi') {
    const v = 'aı'.includes(last) ? 'ı' : 'ou'.includes(last) ? 'u' : 'öü'.includes(last) ? 'ü' : 'i';
    return `${n}${apostrophe}${endsWithVowel ? 'n' : ''}${v}n`;
  }
  if (kind === 'yonelme') return `${n}${apostrophe}${endsWithVowel ? 'y' : ''}${back ? 'a' : 'e'}`;
  return `${n}${apostrophe}${'çfhkpsşt'.includes(final) ? 't' : 'd'}${back ? 'a' : 'e'}`;
}

/** True when `query` appears in any of the given fields (empty query matches everything). */
export function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const q = foldTr(query.trim());
  if (!q) return true;
  return fields.some((field) => field !== undefined && foldTr(field).includes(q));
}

// Sayının okunuşundaki son kelimenin bulunma eki: 1 bir-de, 6 altı-da, 40 kırk-ta, 100 yüz-de…
const UNIT_LOC = ['da', 'de', 'de', 'te', 'te', 'te', 'da', 'de', 'de', 'da'];
const TEN_LOC = ['', 'da', 'de', 'da', 'ta', 'de', 'ta', 'te', 'de', 'da'];

/** Sayıya kesme işaretiyle bulunma eki: "2026'da", "2027'de", "40'ta", "100'de". */
export function numberLocative(n: number, apostrophe = "'"): string {
  const abs = Math.abs(Math.trunc(n));
  let suffix: string;
  if (abs === 0) suffix = 'da'; // sıfır
  else if (abs % 10) suffix = UNIT_LOC[abs % 10];
  else if (abs % 100) suffix = TEN_LOC[(abs % 100) / 10];
  else suffix = 'de'; // yüz, bin, milyon
  return `${n}${apostrophe}${suffix}`;
}

/** Saate bulunma eki; okunuştaki son kelimeye göre: "19:00'da", "07:28'de". */
export function timeLocative(time: string, apostrophe = "'"): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = numberLocative(m ? m : h, '').replace(/^\d+/, '');
  return `${time}${apostrophe}${suffix}`;
}
