/**
 * SpaceTour logosu (halkalı gezegen) tek kaynak: sekme ikonu, paylaşım görselleri, Google
 * logosu ve Instagram profil fotoğrafı buradan üretilir (tools/brand/uret.mjs). Menüdeki
 * hareketli sürüm aynı geometriyi kullanır (components/layout/LogoMark.tsx).
 */

/** Halka ve kuşakların eğimi (derece) */
export const LOGO_TILT = -18;
/** Ayın yörünge düzlemi (derece) */
export const LOGO_MOON_TILT = -38;

/** Gezegenin bulut kuşakları: [halka düzlemine göre kayma, kalınlık, renk, opaklık] (400'lük görünümde) */
export const LOGO_BANDS = [
  [-62, 7, '#fff1c1', 0.45], [-44, 12, '#b45309', 0.35], [-24, 6, '#fde68a', 0.4], [-8, 16, '#9a3412', 0.38],
  [14, 7, '#fcd34d', 0.32], [30, 12, '#7c2d12', 0.4], [50, 6, '#fde68a', 0.25], [66, 10, '#431407', 0.45],
] as const;

const sparkle = (x: number, y: number, r: number, fill: string, op = 1) =>
  `<path opacity="${op}" d="M${x} ${y - r} Q${x + r * 0.13} ${y - r * 0.13} ${x + r} ${y} Q${x + r * 0.13} ${y + r * 0.13} ${x} ${y + r} Q${x - r * 0.13} ${y + r * 0.13} ${x - r} ${y} Q${x - r * 0.13} ${y - r * 0.13} ${x} ${y - r}Z" fill="${fill}"/>`;

/** Küçük boyutlar (16–64 px): yıldız ve kuşak yok, kalın halka */
export function logoSmallSvg({ background = true, id = 'l' }: { background?: boolean; id?: string } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>
<radialGradient id="${id}pl" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#fff4cc"/><stop offset=".3" stop-color="#fbbf24"/><stop offset=".7" stop-color="#ea580c"/><stop offset="1" stop-color="#7c2d12"/></radialGradient>
<linearGradient id="${id}ring" x1="0" x2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#a5b4fc"/></linearGradient>
<clipPath id="${id}back"><rect x="-40" y="-40" width="144" height="72"/></clipPath>
<clipPath id="${id}front"><rect x="-40" y="32" width="144" height="72"/></clipPath>
</defs>${background ? '<rect width="64" height="64" rx="14" fill="#050508"/>' : ''}
<g transform="rotate(${LOGO_TILT} 32 32)"><ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="url(#${id}ring)" stroke-width="4" clip-path="url(#${id}back)"/></g>
<circle cx="32" cy="32" r="15.5" fill="url(#${id}pl)"/>
<g transform="rotate(${LOGO_TILT} 32 32)"><ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="url(#${id}ring)" stroke-width="4" clip-path="url(#${id}front)"/></g>
<circle cx="52" cy="13" r="3.6" fill="#38bdf8"/>
</svg>`;
}

/** Ayrıntılı simge (büyük boyutlar): bulutsu, yıldızlar, bulut kuşakları, katmanlı halka, ay */
export function logoFullSvg({ background = false, id = 'L' }: { background?: boolean; id?: string } = {}) {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let stars = '';
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2, r = 30 + rnd() * 165;
    const x = 200 + r * Math.cos(a), y = 200 + r * Math.sin(a);
    const size = 0.5 + rnd() * 1.3, op = 0.25 + rnd() * 0.7;
    if (Math.hypot(x - 200, y - 200) < 100) continue;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(2)}" fill="#f4f3ee" opacity="${op.toFixed(2)}"/>`;
  }
  const bands = LOGO_BANDS.map(([dy, w, c, o]) => `<ellipse cx="200" cy="${200 + dy}" rx="150" ry="${18 + Math.abs(dy) * 0.1}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${o}"/>`).join('');
  const ring = (clip: 'back' | 'front') => `<g clip-path="url(#${id}${clip})" transform="rotate(${LOGO_TILT} 200 200)">
<ellipse cx="200" cy="200" rx="126" ry="27" fill="none" stroke="url(#${id}ring)" stroke-width="4" opacity=".35"/>
<ellipse cx="200" cy="200" rx="146" ry="32" fill="none" stroke="url(#${id}ring)" stroke-width="16"/>
<ellipse cx="200" cy="200" rx="146" ry="32" fill="none" stroke="#050508" stroke-width="1.4" opacity=".55"/>
<ellipse cx="200" cy="200" rx="168" ry="37" fill="none" stroke="url(#${id}ring)" stroke-width="9" opacity=".85"/>
<ellipse cx="200" cy="200" rx="181" ry="40" fill="none" stroke="url(#${id}ring)" stroke-width="2" opacity=".5"/>
</g>`;
  const t = (LOGO_MOON_TILT * Math.PI) / 180, m = -0.42;
  const mx = 200 + 196 * Math.cos(m) * Math.cos(t) - 70 * Math.sin(m) * Math.sin(t);
  const my = 200 + 196 * Math.cos(m) * Math.sin(t) + 70 * Math.sin(m) * Math.cos(t);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>
<radialGradient id="${id}neb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#6366f1" stop-opacity=".42"/><stop offset=".45" stop-color="#4c1d95" stop-opacity=".2"/><stop offset="1" stop-color="#050508" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}neb2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#38bdf8" stop-opacity=".25"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}pl" cx=".34" cy=".3" r=".78"><stop offset="0" stop-color="#fff4cc"/><stop offset=".22" stop-color="#fbbf24"/><stop offset=".55" stop-color="#ea580c"/><stop offset=".85" stop-color="#7c2d12"/><stop offset="1" stop-color="#2a0e05"/></radialGradient>
<linearGradient id="${id}shade" x1=".2" y1=".15" x2=".85" y2=".95"><stop offset=".45" stop-color="#050508" stop-opacity="0"/><stop offset="1" stop-color="#050508" stop-opacity=".78"/></linearGradient>
<linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4cc" stop-opacity=".9"/><stop offset=".4" stop-color="#fde68a" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}ring" x1="0" x2="1"><stop offset="0" stop-color="#38bdf8" stop-opacity=".35"/><stop offset=".35" stop-color="#bae6fd"/><stop offset=".55" stop-color="#ffffff"/><stop offset=".8" stop-color="#a5b4fc"/><stop offset="1" stop-color="#818cf8" stop-opacity=".5"/></linearGradient>
<filter id="${id}blur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="16"/></filter>
<filter id="${id}soft" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="5"/></filter>
<clipPath id="${id}back"><rect x="-200" y="-200" width="800" height="400"/></clipPath>
<clipPath id="${id}front"><rect x="-200" y="200" width="800" height="400"/></clipPath>
<clipPath id="${id}disc"><circle cx="200" cy="200" r="92"/></clipPath>
</defs>${background ? '<rect width="400" height="400" fill="#050508"/>' : ''}
<circle cx="200" cy="200" r="200" fill="url(#${id}neb)"/>
<circle cx="300" cy="96" r="90" fill="url(#${id}neb2)"/>
${stars}
<circle cx="200" cy="200" r="102" fill="#f59e0b" opacity=".5" filter="url(#${id}blur)"/>
<ellipse cx="200" cy="200" rx="196" ry="70" transform="rotate(${LOGO_MOON_TILT} 200 200)" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 6" opacity=".45"/>
${ring('back')}
<circle cx="200" cy="200" r="92" fill="url(#${id}pl)"/>
<g clip-path="url(#${id}disc)"><g transform="rotate(${LOGO_TILT} 200 200)">${bands}<ellipse cx="200" cy="214" rx="150" ry="34" fill="none" stroke="#050508" stroke-width="9" opacity=".32" filter="url(#${id}soft)"/></g><circle cx="200" cy="200" r="92" fill="url(#${id}shade)"/></g>
<circle cx="200" cy="200" r="91" fill="none" stroke="url(#${id}rim)" stroke-width="2.5"/>
${ring('front')}
<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="15" fill="#38bdf8" opacity=".55" filter="url(#${id}soft)"/>
<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="8.5" fill="#e0f2fe"/>
${sparkle(84, 92, 19, '#ffffff')}${sparkle(98, 318, 7, '#f4f3ee', 0.75)}${sparkle(336, 312, 5, '#f4f3ee', 0.6)}
</svg>`;
}

/** Paylaşım görselleri (next/og) için: data URI */
export const logoDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
