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

const allLessons = [];
for (const [path, raw] of Object.entries(LESSON_FILES)) {
  const parsed = parseLesson(raw);
  if (!parsed.moduleNum || !parsed.lessonNum) continue;
  allLessons.push({ ...parsed, slug: fileSlug(path) });
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
