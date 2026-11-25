// The Globe of Thought's passages, read once at build time for the readable pages.
import raw from '../../public/globe-of-thought/evidence.js?raw';

const data = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));

export const slugify = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// The plain wording the experience uses for each question and its three answers, in its gentle-first order.
export const WARM = {
  happiness: ['Where does happiness come from?', ['The life around me', 'A bit of both', 'Within me']],
  'solitude-or-company': ['Are we better alone or together?', ['Alone', 'Both have a place', 'Together']],
  relationships: ['How much do the people around us make us who we are?', ['Not much', 'They help', 'Completely']],
  'inward-or-others': ['Do we find ourselves by looking inward, or through others?', ['Inward', 'Both', 'Through others']],
  'given-or-made': ['Are we born who we are, or do we become it?', ['Born', 'Both', 'We become it']],
  meaning: ['Is the meaning of a life found or made?', ['There is none', 'We make it', 'It is given']],
  'self-or-others-first': ['Whose good comes first: mine or other people’s?', ['Mine', 'They are bound together', 'Other people’s']],
  desire: ['What should we do with what we want?', ['Let it go', 'Train it', 'Follow it']],
  'free-will': ['Are we free to choose?', ['No', 'Within limits', 'Yes']],
  truth: ['Can the deepest truth be known?', ['No', 'In part', 'Yes']],
  'lasting-self': ['Is there a lasting “me”?', ['No', 'A changing one', 'Yes']],
  'ultimate-reality': ['Is there a God, or something ultimate?', ['No', 'Beyond words', 'Yes']],
  suffering: ['Does suffering have a purpose?', ['None', 'It can be used', 'It has meaning']],
  death: ['What happens when we die?', ['It ends', 'We cannot know', 'Something continues']],
};
const ORDER = Object.keys(WARM);

// A broad region for each pin, from where it sits on the map. Coarse on purpose: it is for browsing, not for classifying.
export const REGIONS = [['europe', 'Europe'], ['wana', 'West Asia and North Africa'], ['africa', 'Sub-Saharan Africa'], ['sasia', 'South and Central Asia'], ['easia', 'East and South-East Asia'], ['namerica', 'North America'], ['lamerica', 'Latin America'], ['oceania', 'Oceania']];
export const regionOf = c => { const a = c.lat, o = c.lng;
  if (o < -30) return a > 13 ? 'namerica' : 'lamerica';
  if (o < 60 && a > 35) return o > 25 && a < 42 ? 'wana' : 'europe';
  if (o < 60) return a > 12 || o > 32 ? 'wana' : 'africa';
  if (o < 100) return 'sasia';
  return a > -10 ? 'easia' : 'oceania'; };
export const regionName = id => (REGIONS.find(r => r[0] === id) || [])[1] || '';
// The checker reads a plain-text mirror of Project Gutenberg; readers are sent to the book's own page there.
export const readUrl = u => { const m = /^https:\/\/gutenberg\.pglaf\.org\/(?:\d\/)*(\d+)\/\1[-.]/.exec(u); if (m) return 'https://www.gutenberg.org/ebooks/' + m[1]; const sf = /^https:\/\/www\.sefaria\.org\/api\/texts\/([^?]+)/.exec(u); return sf ? 'https://www.sefaria.org/' + sf[1] : u; };
// The language of a passage quoted in its original, where the source makes it plain.
const langOf = c => { if (!c.translation) return null; const h = (/^https?:\/\/([a-z]{2})\.wikisource\.org/.exec(c.sourceUrl) || [])[1]; if (h && h !== 'en') return h; if (/[\u3040-\u30ff]/.test(c.excerpt)) return 'ja'; if (/[\u4e00-\u9fff]/.test(c.excerpt)) return 'zh'; if (/[\u0600-\u06ff]/.test(c.excerpt)) return 'ar'; if (/projekt-gutenberg\.org/.test(c.sourceUrl)) return 'de'; return 'und'; };
// A one-line account of each voice and the tradition it belongs to: written by machine, for orientation only.
export const WHO = data.thinkers || {};
export const cards = data.cards.map(c => ({ ...c, tradition: (WHO[c.name] || {}).tradition || 'Other', region: regionOf(c), readUrl: readUrl(c.sourceUrl), lang: langOf(c), checked: c.check && c.check.status === 'matched' ? c.check.date : null }));
export const links = data.links || [];
export const questions = data.questions
  .map(q => {
    const scored = q.scale.filter(s => s.tone !== 'none');
    const steps = q.scale.map(s => ({ ...s, plain: WARM[q.id] && scored.includes(s) ? WARM[q.id][1][scored.indexOf(s)] : s.label }));
    // A passage placed here from another question is dropped when the same words already sit here in their own right.
    const here = new Set(cards.filter(c => c.question === q.id).map(c => c.name + '|' + c.excerpt));
    const placed = cards.filter(c => c.readings[q.id] && (c.question === q.id || !here.has(c.name + '|' + c.excerpt))).map(c => ({ ...c, ...c.readings[q.id] })).sort((a, b) => a.sortYear - b.sortYear);
    return { ...q, plain: WARM[q.id] ? WARM[q.id][0] : q.question, steps, placed };
  })
  .filter(q => q.placed.length)
  .sort((a, b) => (ORDER.indexOf(a.id) + 99) % 99 - (ORDER.indexOf(b.id) + 99) % 99);
const qById = Object.fromEntries(questions.map(q => [q.id, q]));

// One entry per thinker or text, with every passage of theirs on every question.
const bySlug = new Map();
for (const c of cards) {
  const slug = slugify(c.name);
  if (!bySlug.has(slug)) bySlug.set(slug, { slug, name: c.name, passages: [] });
  const t = bySlug.get(slug);
  for (const [qid, r] of Object.entries(c.readings)) {
    const q = qById[qid]; if (!q) continue;
    t.passages.push({ card: c, question: q, step: q.steps.find(s => s.id === r.score), why: r.why, limit: r.limit, second: r.second, home: qid === c.question });
  }
}
export const thinkers = [...bySlug.values()].map(t => {
  const own = [...new Map(t.passages.map(p => [p.card.id, p.card])).values()].sort((a, b) => a.sortYear - b.sortYear);
  const ties = links.filter(l => l.from.includes(t.name) || l.to.includes(t.name)).map(l => {
    const out = l.from.includes(t.name), other = (out ? l.to : l.from)[0];
    return { out, verb: l.verb, year: l.year, summary: l.summary, caveat: l.caveat, other, otherSlug: slugify(other) };
  });
  return { ...t, own, ties, when: own[0].dateShort, where: own[0].place, region: own[0].region, about: (WHO[t.name] || {}).about || '', tradition: (WHO[t.name] || {}).tradition || 'Other', sort: slugify(t.name.replace(/^(the|al-|a) /i, '')) };
}).sort((a, b) => a.sort.localeCompare(b.sort));
export const thinkerOf = name => bySlug.get(slugify(name));
export const TONE = { low: '#2654ff', mid: '#ffb200', high: '#00b894', none: '#8a8fa3' };

// ---- circles: three questions-behind-the-questions, each with three leanings. A thinker (or a visitor)
// belongs to a circle when at least two of their answers on that axis average out to its leaning.
export const AXES = [
  { id: 'beyond', name: 'What lies beyond', qs: ['death', 'ultimate-reality', 'meaning', 'truth', 'suffering', 'lasting-self'], tone: ['low', 'mid', 'high'],
    circles: [['earthbound', 'The Earthbound', 'This world is the whole of it, and that is enough to live by.'],
      ['open-handed', 'The Open-handed', 'The largest questions stay open. Certainty either way is more than can be had.'],
      ['far-sighted', 'The Far-sighted', 'There is more than what is seen: something continues, something grounds, something means.']] },
  { id: 'hands', name: 'What is in our hands', qs: ['free-will', 'happiness', 'given-or-made'], tone: ['low', 'mid', 'high'],
    circles: [['carried', 'The Carried', 'A life is mostly shaped by what it is given: nature, fortune, the world.'],
      ['steerers', 'The Steerers', 'There is a current, and within it one can still steer.'],
      ['makers', 'The Makers', 'A person makes themselves. Freedom and happiness are their own work.']] },
  { id: 'together', name: 'Alone or together', qs: ['relationships', 'inward-or-others', 'solitude-or-company', 'self-or-others-first'], tone: ['low', 'mid', 'high'],
    circles: [['solitary', 'The Solitary', 'The self is found inward and stands best alone.'],
      ['go-betweens', 'The Go-betweens', 'Solitude and company each have their place, and a life needs both.'],
      ['kindred', 'The Kindred', 'We become ourselves through other people.']] },
];
const stepValue = (q, id) => { const s = q.steps.filter(x => x.tone !== 'none'), i = s.findIndex(x => x.id === id); return i < 0 ? null : (s.length > 1 ? i / (s.length - 1) : .5); };
export const band = v => (v < .34 ? 0 : v > .66 ? 2 : 1);
for (const t of thinkers) {
  t.pos = {};
  for (const q of questions) {
    const mine = t.passages.filter(p => p.question.id === q.id && p.step && p.step.tone !== 'none');
    if (mine.length) t.pos[q.id] = mine.reduce((n, p) => n + stepValue(q, p.step.id), 0) / mine.length;
  }
  t.circles = [];
  for (const ax of AXES) {
    const vals = ax.qs.filter(k => t.pos[k] != null).map(k => t.pos[k]);
    if (vals.length < 2) continue;
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length, b = band(mean);
    t.circles.push({ axis: ax.id, id: ax.circles[b][0], name: ax.circles[b][1], mean, n: vals.length });
  }
}
export const circles = AXES.flatMap(ax => ax.circles.map(([id, name, line], b) => {
  const members = thinkers.filter(t => t.circles.some(c => c.id === id)).map(t => ({ t, c: t.circles.find(c => c.id === id) }))
    .sort((x, y) => y.c.n - x.c.n || (b === 0 ? x.c.mean - y.c.mean : b === 2 ? y.c.mean - x.c.mean : Math.abs(x.c.mean - .5) - Math.abs(y.c.mean - .5)));
  const facing = b === 1 ? null : ax.circles[2 - b];
  return { id, name, line, axis: ax, band: b, tone: ax.tone[b], members, facing: facing ? { id: facing[0], name: facing[1] } : null, siblings: ax.circles.filter(c => c[0] !== id).map(c => ({ id: c[0], name: c[1] })) };
}));

// What the second, independent reading of a placement found. No human editor is implied.
export const SECOND = {
  agreed: 'Read twice: both readers placed it here.',
  settled: 'Read twice: the readers differed, and a third reading settled it.',
  differed: 'Read twice: the readers differed, and it could sit either way.',
};

export const TRADITIONS = [...new Set(cards.map(c => c.tradition))].sort((a, b) => (a === 'Other') - (b === 'Other') || a.localeCompare(b));
