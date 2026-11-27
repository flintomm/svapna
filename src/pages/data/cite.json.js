// How each voice's name is written at the head of an MLA citation. A personal name from a tradition that
// puts the family name last, written since 1400 and without a particle, is inverted ("Du Bois, W. E. B."); texts, recorded sayings, single names and
// names from traditions that already put the family name first are left as they are.
import { thinkers, isText } from '../../lib/atlas.js';
const PARTICLE = /^(de|del|della|di|da|dos|das|du|van|von|der|den|la|las|los|le|al|ibn|bin|bint|ben|of|the|y|e|à|a|zu|ap)$/i;
const TITLE = /^(chief|guru|saint|st\.?|king|queen|prince|princess|abba|rabbi|rav|sor|pope|sheikh|shaikh|sultan|lady|lord|sir|swami|geshe|je|mirza|hajji|emperor|bishop|brother|sister|mother|father|meister|madame|dame|doctor|dr\.?)$/i;
// Pen-names, family-name-first names written outside their home region, and other forms that must stand.
const KEEP = new Set(['Martin Luther King Jr.', 'Jean Paul', 'Nitobe Inazo', 'Okakura Kakuzō', 'Pung Kwang Yu', 'Orchot Tzaddikim', 'Pandita Ramabai', 'Mai Neng Moua', 'Souvankham Thammavongsa', 'Sulak Sivaraksa', 'Jiddu Krishnamurti']);
export function invert(t) {
  const n = t.name;
  if (KEEP.has(n) || /\bJr\.?$/.test(n)) return n;
  if (isText(n) || /[(),“”"]|\bas reported\b|\battributed\b/i.test(n)) return n;
  if (!['europe', 'namerica', 'oceania'].includes(t.region)) return n;
  // Ancient and medieval names ("Marcus Aurelius", "Thomas Aquinas") are cited as they stand.
  if (t.own[0].sortYear < 1400) return n;
  if (t.tradition === 'Indigenous and oral traditions') return n;
  const w = n.split(/\s+/);
  if (w.length < 2 || w.length > 5 || TITLE.test(w[0]) || !/^[A-ZÀ-Þ]/.test(w[w.length - 1])) return n;
  if (w.slice(0, -1).some(x => /^(of|the)$/i.test(x))) return n; // "Julian of Norwich", "Teresa of Ávila"
  // Names with a particle ("von Goethe", "de Beauvoir", "de las Casas") are inverted differently in
  // different languages, so they are left alone instead of risking a wrong form.
  if (w.some(x => PARTICLE.test(x))) return n;
  return w[w.length - 1] + ', ' + w.slice(0, -1).join(' ');
}
export function GET() {
  const out = { 'W. E. B. Du Bois': 'Du Bois, W. E. B.' }; for (const t of thinkers) { if (out[t.name]) continue; const v = invert(t); if (v !== t.name) out[t.name] = v; }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
}
