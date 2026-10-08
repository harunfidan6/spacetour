// Kapanış kartındaki logo: sitenin güncel logosundan (src/lib/logoSvg.ts → logoFullSvg) üretilir.
//   node tools/film/gece/logo-uret.mjs  → tools/film/gece/logo.svg
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { logoFullSvg } = await jiti.import(path.join(ROOT, 'src/lib/logoSvg.ts'));
fs.writeFileSync(path.join(DIR, 'logo.svg'), logoFullSvg({ background: false, id: 'g' }));
console.log('✓ logo.svg');
