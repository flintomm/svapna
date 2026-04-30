// Loads newsletter issues from /src/data/letters/*.md at build time.
//
// Filename convention: `YYYY-MM-issue-NN.md` (e.g. `2026-05-issue-01.md`).
// The leading `YYYY-MM` becomes the publication month fallback; everything
// after the month prefix becomes the URL slug fallback (e.g. `issue-01`).
//
// Each file carries a YAML-style frontmatter block fenced by `---` lines:
//
//     ---
//     title: "Letter № I"
//     slug: issue-01
//     date: 2026-05-06
//     excerpt: "..."
//     ---
//
//     # Letter № I
//
//     *Optional kicker line.*
//
//     ---
//
//     Body markdown…
//
// `title` is required. `slug`, `date`, `excerpt` are optional and fall back
// to values inferred from the filename and body. The body extends from after
// the closing frontmatter `---` to end of file; an internal H1 + kicker +
// `---` separator is recognised when present so the head/body lesson
// convention is supported as a secondary form.
//
// Vite bundles each .md as a raw string. The folder is allowed to be empty —
// `import.meta.glob` simply returns no entries until the first issue lands.

const LETTER_FILES = import.meta.glob(
  '../data/letters/*.md',
  { query: '?raw', import: 'default', eager: true }
);

function fileBase(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

// "2026-05-issue-01" → { yearMonth: "2026-05", slug: "issue-01" }
function parseFilename(base) {
  const m = base.match(/^(\d{4}-\d{2})-(.+)$/);
  if (!m) return { yearMonth: '', slug: base };
  return { yearMonth: m[1], slug: m[2] };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isoFromYearMonth(ym) {
  if (!/^\d{4}-\d{2}$/.test(ym)) return '';
  return `${ym}-01`;
}

function displayDateFromIso(iso) {
  // "2026-05-06" → "May 6, 2026"; "2026-05-01" → "May 2026" (first of month).
  const m = iso.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return iso;
  const year = m[1];
  const monthIdx = parseInt(m[2], 10) - 1;
  const day = m[3] ? parseInt(m[3], 10) : null;
  if (monthIdx < 0 || monthIdx > 11) return iso;
  const month = MONTHS[monthIdx];
  if (day && day !== 1) return `${month} ${day}, ${year}`;
  return `${month} ${year}`;
}

// Strip a single layer of surrounding double or single quotes from a YAML
// scalar. Frontmatter values that contain colons or em-dashes are typically
// quoted; bare scalars come through untouched.
function unquote(s) {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith('\'') && t.endsWith('\''))) {
    return t.slice(1, -1);
  }
  return t;
}

// Minimal YAML-ish frontmatter parser. Handles flat `key: value` lines with
// optional surrounding quotes. Sufficient for the letter metadata we accept.
function parseFrontmatter(raw) {
  // Match a leading `---\n…\n---` block.
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    meta[kv[1]] = unquote(kv[2]);
  }
  return { meta, body: m[2] };
}

// Strip markdown to plain text for excerpt fallback / RSS description.
function stripMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_]([^*_]+)[*_]/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFromBody(body, words = 30) {
  const flat = stripMarkdown(body);
  if (!flat) return '';
  const tokens = flat.split(' ');
  if (tokens.length <= words) return flat;
  return tokens.slice(0, words).join(' ').replace(/[,;:.\s]+$/, '') + '…';
}

// If the body opens with `# Title` and an italic kicker followed by an HR,
// peel them off so the body that goes to the renderer starts at the prose.
// Returns { title, kicker, body } where title/kicker may be empty strings.
function peelHeadBlock(rawBody) {
  const trimmed = rawBody.replace(/^\s+/, '');
  const hrIdx = trimmed.indexOf('\n---');
  if (hrIdx < 0) return { title: '', kicker: '', body: rawBody };
  const head = trimmed.slice(0, hrIdx);
  const afterHr = trimmed.slice(hrIdx).replace(/^\n---\s*\r?\n/, '');
  const titleMatch = head.match(/^#\s+(.+?)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';
  // First italic-only paragraph after the title, kept with its surrounding `*`.
  let kicker = '';
  const lines = head.split('\n');
  let pastTitle = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('# ')) { pastTitle = true; continue; }
    if (!pastTitle) continue;
    if (/^\*.+\*$/.test(t)) { kicker = t; break; }
    break;
  }
  return { title, kicker, body: afterHr };
}

const letters = [];
for (const [path, raw] of Object.entries(LETTER_FILES)) {
  const base = fileBase(path);
  const { yearMonth, slug: filenameSlug } = parseFilename(base);
  const { meta, body: postFrontmatter } = parseFrontmatter(raw);

  const peeled = peelHeadBlock(postFrontmatter);
  const title = (meta.title || peeled.title || '').trim();
  if (!title) continue;

  const slug = (meta.slug || filenameSlug || '').trim();
  if (!slug) continue;

  // ISO date — prefer explicit frontmatter; fall back to first of the
  // filename's month. Normalise to YYYY-MM-DD where possible.
  const rawDate = (meta.date || '').trim();
  let isoDate = '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) isoDate = rawDate;
  else if (/^\d{4}-\d{2}$/.test(rawDate)) isoDate = `${rawDate}-01`;
  else if (yearMonth) isoDate = isoFromYearMonth(yearMonth);

  const excerpt = (meta.excerpt && meta.excerpt.trim())
    || (peeled.kicker && peeled.kicker.replace(/^\*+|\*+$/g, '').trim())
    || excerptFromBody(peeled.body, 30);

  letters.push({
    slug,
    yearMonth,
    isoDate,
    displayDate: isoDate ? displayDateFromIso(isoDate) : '',
    title,
    kicker: peeled.kicker || '',
    excerpt,
    body: peeled.body.trim(),
  });
}

// Newest first. Compare by ISO date when present; otherwise lexical filename.
letters.sort((a, b) => {
  const ad = a.isoDate || a.yearMonth;
  const bd = b.isoDate || b.yearMonth;
  if (ad !== bd) return bd.localeCompare(ad);
  return b.slug.localeCompare(a.slug);
});

export const allLetters = letters;

export function getLetterBySlug(slug) {
  return letters.find(l => l.slug === slug) || null;
}
