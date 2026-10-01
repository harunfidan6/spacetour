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

/** True when `query` appears in any of the given fields (empty query matches everything). */
export function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const q = foldTr(query.trim());
  if (!q) return true;
  return fields.some((field) => field !== undefined && foldTr(field).includes(q));
}
