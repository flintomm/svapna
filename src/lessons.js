// Loads the 47 lesson markdown files + the welcome lesson from
// /reference-material/11_online/ at build time, parses out title, kicker,
// body, and the closing "Take it to the community" prompt.
//
// Vite bundles each .md as a raw string; the parsed structures are exported
// as plain JS so the React layer can render them without further I/O.

const LESSON_FILES = import.meta.glob(
  '../reference-material/11_online/module_*/*.md',
  { query: '?raw', import: 'default', eager: true }
);

const WELCOME_FILES = import.meta.glob(
  '../reference-material/11_online/00_welcome.md',
  { query: '?raw', import: 'default', eager: true }
);

const GLOSSARY_FILES = import.meta.glob(
  '../reference-material/11_online/glossary.md',
  { query: '?raw', import: 'default', eager: true }
);

function splitOnHr(raw) {
  // Split on a horizontal rule line ("---" with optional surrounding whitespace).
  return raw.split(/\r?\n---\s*\r?\n/);
}

function extractKicker(rawHead) {
  // The kicker is the first non-empty paragraph after the title and reliably
  // begins-and-ends with `*`. Keep the asterisks; the inline renderer turns
  // them into <em> spans, which preserves segments like
  // `*outer italic* roman *more italic*` correctly.
  const lines = rawHead.split('\n');
  let pastTitle = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('# ')) { pastTitle = true; continue; }
    if (!pastTitle) continue;
    if (/^\*.+\*$/.test(trimmed)) return trimmed;
    return '';
  }
  return '';
}

// Lower-case ASCII slug. Strips diacritics, then replaces any run of
// non-alphanumeric characters with a single hyphen. Used for both lesson
// URLs and glossary-term URLs so that `ātman` resolves to `/glossary/atman`.
export function slugify(input) {
  return String(input)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseLesson(raw) {
  const parts = splitOnHr(raw);
  const head = parts[0] || '';
  const body = (parts[1] || '').trim();
  const tail = (parts[2] || '').trim();

  const titleMatch = head.match(/^#\s+(.+?)$/m);
  const fullTitle = titleMatch ? titleMatch[1].trim() : '';
  // "Module 1, Lesson 1 — Why We Begin Here"
  const numberedMatch = fullTitle.match(/^Module\s+(\d+),?\s*Lesson\s+(\d+)\s*[—–-]\s*(.+)$/);
  const moduleNum = numberedMatch ? numberedMatch[1] : '';
  const lessonNum = numberedMatch ? numberedMatch[2] : '';
  const title = numberedMatch ? numberedMatch[3].trim() : fullTitle;

  const kicker = extractKicker(head);

  // The closing prompt is a blockquote starting with "**Take it to the community.**"
  const promptMatch = tail.match(/^>\s*\*\*Take it to the community\.?\*\*\s*([\s\S]+)$/);
  const prompt = promptMatch
    ? promptMatch[1].replace(/^>\s*/gm, '').replace(/\s+/g, ' ').trim()
    : '';

  return { moduleNum, lessonNum, title, kicker, body, prompt };
}

function fileSlug(path) {
  // ".../module_01_ancient_origins/01_why_we_begin_here.md" → "01_why_we_begin_here"
  return path.split('/').pop().replace(/\.md$/, '');
}

// Strip the ordinal prefix and dash-case the rest:
//   "01_why_we_begin_here" → "why-we-begin-here"
//   "02_mandukya_four_states" → "mandukya-four-states"
function lessonUrlSlug(fileBase) {
  return fileBase.replace(/^\d+_/, '').replace(/_/g, '-');
}

const allLessons = [];
for (const [path, raw] of Object.entries(LESSON_FILES)) {
  const parsed = parseLesson(raw);
  if (!parsed.moduleNum || !parsed.lessonNum) continue;
  const fileBase = fileSlug(path);
  allLessons.push({
    ...parsed,
    slug: fileBase,
    urlSlug: lessonUrlSlug(fileBase),
  });
}
allLessons.sort((a, b) =>
  parseInt(a.moduleNum) - parseInt(b.moduleNum) ||
  parseInt(a.lessonNum) - parseInt(b.lessonNum)
);

export const lessonsByModule = {};
for (const l of allLessons) {
  if (!lessonsByModule[l.moduleNum]) lessonsByModule[l.moduleNum] = [];
  lessonsByModule[l.moduleNum].push(l);
}

export function getLesson(moduleNum, lessonNum) {
  const list = lessonsByModule[String(parseInt(moduleNum, 10))];
  if (!list) return null;
  return list.find(l => parseInt(l.lessonNum, 10) === parseInt(lessonNum, 10)) || null;
}

export function getLessonByUrlSlug(moduleNum, urlSlug) {
  const list = lessonsByModule[String(parseInt(moduleNum, 10))];
  if (!list) return null;
  return list.find(l => l.urlSlug === urlSlug) || null;
}

export const welcomeLesson = (() => {
  const raw = Object.values(WELCOME_FILES)[0];
  if (!raw) return null;
  const parts = splitOnHr(raw);
  const head = parts[0] || '';
  const body = (parts[1] || '').trim();
  const tail = (parts[2] || '').trim();
  const titleMatch = head.match(/^#\s+(.+?)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Welcome';
  const kicker = extractKicker(head);
  const promptMatch = tail.match(/^>\s*\*\*Take it to the community\.?\*\*\s*([\s\S]+)$/);
  const prompt = promptMatch
    ? promptMatch[1].replace(/^>\s*/gm, '').replace(/\s+/g, ' ').trim()
    : '';
  return { title, kicker, body, prompt };
})();

const GLOSSARY_RAW = Object.values(GLOSSARY_FILES)[0] || '';

export const glossary = (() => {
  if (!GLOSSARY_RAW) return null;
  // The glossary uses `---` between every language section. Take parts[0] as
  // the head (title + kicker) and everything from parts[1] onward as the body,
  // joined with blank lines so the H2 section headers do the visual work.
  const parts = splitOnHr(GLOSSARY_RAW);
  const head = parts[0] || '';
  const body = parts.slice(1).join('\n\n').trim();
  const titleMatch = head.match(/^#\s+(.+?)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Glossary';
  const kicker = extractKicker(head);
  return { title, kicker, body };
})();

// Per-term entries parsed out of the glossary body. Each term gets its own
// citable URL: /glossary/<slug>. The slug comes from the headword, ASCII-folded.
//
// Headword pattern: a paragraph beginning with one or more bold-wrapped terms
// (separated by ` / `), optionally followed by a parenthesised language tag
// `(Skt)` / `(Tib *rmi lam*)`, optionally followed by `[Module N, Lesson M]`,
// then ` — ` and the definition.
function parseGlossaryEntries(raw) {
  if (!raw) return [];
  const entries = [];
  // Split into language sections. The first part is the head; we only want the
  // sections after that.
  const parts = splitOnHr(raw);
  for (let i = 1; i < parts.length; i++) {
    const section = parts[i].trim();
    if (!section) continue;
    const langMatch = section.match(/^##\s+(.+?)$/m);
    const language = langMatch ? langMatch[1].trim() : '';

    const body = langMatch ? section.slice(section.indexOf('\n', section.indexOf('##')) + 1) : section;

    // Split paragraphs and find ones that look like a glossary entry.
    const paragraphs = body.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(Boolean);
    for (const para of paragraphs) {
      const m = para.match(/^((?:\*\*[^*]+?\*\*)(?:\s*\/\s*\*\*[^*]+?\*\*)*)\s*(\([^)]*\))?\s*(\[[^\]]+\])?\s*[—–-]\s*([\s\S]+)$/);
      if (!m) continue;
      const headwordsRaw = m[1];
      const langTag = m[2] || '';
      const lessonRef = m[3] || '';
      const definition = m[4].trim();

      // Pull out the bold-wrapped headwords.
      const headwords = Array.from(headwordsRaw.matchAll(/\*\*([^*]+?)\*\*/g)).map(x => x[1].trim());
      if (headwords.length === 0) continue;
      const slug = slugify(headwords[0]);
      if (!slug) continue;
      entries.push({
        slug,
        term: headwords[0],
        aliases: headwords.slice(1),
        language,
        languageTag: langTag.replace(/^\(|\)$/g, ''),
        lessonRef: lessonRef.replace(/^\[|\]$/g, ''),
        definition,
      });
    }
  }
  return entries;
}

export const glossaryTerms = parseGlossaryEntries(GLOSSARY_RAW);

const glossaryIndex = (() => {
  const idx = new Map();
  for (const t of glossaryTerms) {
    idx.set(t.slug, t);
    for (const alias of t.aliases) {
      const aliasSlug = slugify(alias);
      if (aliasSlug && !idx.has(aliasSlug)) idx.set(aliasSlug, t);
    }
  }
  return idx;
})();

export function getGlossaryTerm(slug) {
  return glossaryIndex.get(slug) || null;
}
