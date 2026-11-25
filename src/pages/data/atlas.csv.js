// One row per placement, for a spreadsheet.
import { cards } from '../../lib/atlas.js';
const cell = v => '"' + String(v ?? '').replace(/"/g, '""').replace(/\s+/g, ' ') + '"';
export function GET() {
  const rows = [['passage_id', 'thinker', 'work', 'date', 'sort_year', 'place', 'lat', 'lng', 'question', 'position', 'second_reading', 'excerpt', 'translation', 'why', 'source_url']];
  for (const c of cards) for (const [q, r] of Object.entries(c.readings)) rows.push([c.id, c.name, c.work, c.dateShort, c.sortYear, c.place, c.lat, c.lng, q, r.score, r.second || '', c.excerpt, c.translation || '', r.why, c.sourceUrl]);
  return new Response('﻿' + rows.map(r => r.map(cell).join(',')).join('\n') + '\n', { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
