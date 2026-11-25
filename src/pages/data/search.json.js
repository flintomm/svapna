// A compact index of every passage for the search page.
import { cards, questions, slugify } from '../../lib/atlas.js';
export function GET() {
  const plain = Object.fromEntries(questions.map(q => [q.id, q.plain]));
  return new Response(JSON.stringify(cards.map(c => ({ i: c.id, n: c.name, s: slugify(c.name), e: c.excerpt, t: c.translation || '', w: c.work, d: c.dateShort, p: c.place, u: c.sourceUrl, q: Object.keys(c.readings).map(k => plain[k]).filter(Boolean) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
