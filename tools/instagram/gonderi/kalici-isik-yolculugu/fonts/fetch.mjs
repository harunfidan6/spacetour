import fs from 'node:fs';
const css = fs.readFileSync(new URL('./raw.css', import.meta.url), 'utf8');
const blocks = css.split(/(?=\/\* [a-z-]+ \*\/)/).filter(b => /\/\* (latin|latin-ext) \*\//.test(b));
let out = '';
const jobs = [];
for (const b of blocks) {
  const url = b.match(/url\((https:[^)]+)\)/)[1];
  const fam = b.match(/font-family: '([^']+)'/)[1].replace(/\s+/g, '');
  const w = b.match(/font-weight: (\d+)/)[1];
  const st = b.match(/font-style: (\w+)/)[1];
  const sub = b.match(/\/\* ([a-z-]+) \*\//)[1];
  const name = `${fam}-${w}${st === 'italic' ? 'i' : ''}-${sub}.woff2`;
  jobs.push([url, name]);
  out += b.replace(url, name);
}
fs.writeFileSync(new URL('./fonts.css', import.meta.url), out);
fs.writeFileSync(new URL('./jobs.txt', import.meta.url), jobs.map(j => j.join(' ')).join('\n'));
console.log(jobs.length);
