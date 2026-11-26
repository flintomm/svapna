// GitHub Pages serves every page at its address with a trailing slash and redirects the bare form.
// After the build, every internal link, canonical address, social address, structured-data address and
// sitemap entry is rewritten to the slash form, so readers and search engines never hit a redirect.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dist = path.resolve('dist');
const SITE = 'https://svapnaproject.org';
// A page address: starts with /, no file extension in its last part, no trailing slash, not an API or data file.
const fix = u => {
  const m = /^((?:https:\/\/svapnaproject\.org)?)(\/[^?#"'\s]*?)([?#][^"'\s]*)?$/.exec(u);
  if (!m) return u;
  const [, origin, p, rest = ''] = m;
  if (p === '/' || p.endsWith('/') || /\.[a-z0-9]{2,12}$/i.test(p) || /^\/(api|_astro|account|next|read|dream\/[a-z]+\.(js|css))\b/.test(p)) return u;
  if (!origin && !p.startsWith('/')) return u;
  return origin + p + '/' + rest;
};
// Stylesheets and scripts are cached by browsers for hours. Each link to one carries a short fingerprint of
// its contents, so a page and the files it needs always arrive as a matching set after a deploy.
const prints = new Map();
const stamp = u => {
  if (!prints.has(u)) { const f = path.join(dist, u); prints.set(u, fs.existsSync(f) ? crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0, 8) : ''); }
  return prints.get(u) ? u + '?v=' + prints.get(u) : u;
};
let files = 0, changes = 0;
const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith('.html')) rewrite(f); } };
function rewrite(f) {
  let s = fs.readFileSync(f, 'utf8');
  // Redirect stubs for retired addresses keep their own targets, which already carry the right form.
  if (/http-equiv="refresh"/.test(s)) return;
  const before = s;
  s = s.replace(/(\s(?:href|content)=")([^"]+)(")/g, (all, a, u, b) => (/^(\/|https:\/\/svapnaproject\.org\/)/.test(u) ? a + fix(u) + b : all));
  s = s.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, a, j, b) => a + j.replace(/"(https:\/\/svapnaproject\.org\/[^"]*)"/g, (x, u) => '"' + fix(u) + '"') + b);
  s = s.replace(/(\s(?:href|src)=")(\/[^"?#]+\.(?:css|js))(")/g, (all, a, u, b) => a + stamp(u) + b);
  if (s !== before) { fs.writeFileSync(f, s); changes++; }
  files++;
}
walk(dist);
for (const name of fs.readdirSync(dist).filter(n => /^sitemap.*\.xml$/.test(n))) {
  const f = path.join(dist, name); const s = fs.readFileSync(f, 'utf8');
  fs.writeFileSync(f, s.replace(/<loc>([^<]+)<\/loc>/g, (all, u) => '<loc>' + (u.startsWith(SITE + '/sitemap') ? u : fix(u)) + '</loc>'));
}
console.log(`Trailing slashes: ${changes} of ${files} pages rewritten, sitemap updated.`);
