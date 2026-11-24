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

export const cards = data.cards;
export const links = data.links || [];
export const questions = data.questions
  .map(q => {
    const scored = q.scale.filter(s => s.tone !== 'none');
    const steps = q.scale.map(s => ({ ...s, plain: WARM[q.id] && scored.includes(s) ? WARM[q.id][1][scored.indexOf(s)] : s.label }));
    const placed = cards.filter(c => c.readings[q.id]).map(c => ({ ...c, ...c.readings[q.id] })).sort((a, b) => a.sortYear - b.sortYear);
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
    t.passages.push({ card: c, question: q, step: q.steps.find(s => s.id === r.score), why: r.why, limit: r.limit, home: qid === c.question });
  }
}
export const thinkers = [...bySlug.values()].map(t => {
  const own = [...new Map(t.passages.map(p => [p.card.id, p.card])).values()].sort((a, b) => a.sortYear - b.sortYear);
  const ties = links.filter(l => l.from.includes(t.name) || l.to.includes(t.name)).map(l => {
    const out = l.from.includes(t.name), other = (out ? l.to : l.from)[0];
    return { out, verb: l.verb, year: l.year, summary: l.summary, caveat: l.caveat, other, otherSlug: slugify(other) };
  });
  return { ...t, own, ties, when: own[0].dateShort, where: own[0].place, sort: slugify(t.name.replace(/^(the|al-|a) /i, '')) };
}).sort((a, b) => a.sort.localeCompare(b.sort));
export const thinkerOf = name => bySlug.get(slugify(name));
export const TONE = { low: '#2654ff', mid: '#ffb200', high: '#00b894', none: '#8a8fa3' };
