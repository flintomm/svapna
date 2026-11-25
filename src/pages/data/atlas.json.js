// The whole atlas as data: every passage, its source, and every placement with its second-reading outcome.
import { cards, questions, links } from '../../lib/atlas.js';
export function GET() {
  const body = {
    about: 'Svapna atlas. Quotes are checked word for word against sourceUrl. Placements are machine readings, read twice; none has been reviewed by a human editor. See https://svapnaproject.org/how-it-works',
    licence: 'Placements, reasons and notes: CC BY 4.0, Svapna Project. Quoted passages belong to their sources.',
    generated: new Date().toISOString().slice(0, 10),
    questions: questions.map(q => ({ id: q.id, question: q.question, scale: q.scale.map(s => ({ id: s.id, label: s.label, definition: s.definition })) })),
    passages: cards.map(c => ({ id: c.id, name: c.name, work: c.work, date: c.dateFull || c.dateShort, sortYear: c.sortYear, place: c.place, lat: c.lat, lng: c.lng, placeBasis: c.anchorType, excerpt: c.excerpt, translation: c.translation, sourceLabel: c.sourceLabel, sourceUrl: c.sourceUrl, locator: c.locator,
      placements: Object.entries(c.readings).map(([q, r]) => ({ question: q, position: r.score, why: r.why, doesNotShow: r.limit, secondReading: r.second || null })) })),
    connections: links,
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
