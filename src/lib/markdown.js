// Server-side markdown rendering for the lesson dialect used in
// /reference-material/11_online/. Returns sanitized HTML strings that
// Astro pages emit with `set:html`. Mirrors the behavior of the React
// `renderInline` / `MarkdownBody` from the previous build.

import { lessonsByModule } from './lessons.js';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLesson(m, l) {
  const list = lessonsByModule[String(parseInt(m, 10))];
  if (!list) return null;
  return list.find(x => parseInt(x.lessonNum, 10) === parseInt(l, 10)) || null;
}

// Inline pass: renders a single paragraph's text. Bold (`**`) takes priority
// over italic (`*` / `_`). `[Module N, Lesson M]` becomes a link to the
// lesson's permanent URL when the lesson resolves.
export function renderInline(text) {
  let out = '';
  let i = 0;
  let buf = '';
  const flush = () => {
    if (buf) {
      out += escapeHtml(buf);
      buf = '';
    }
  };
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2) {
        flush();
        out += `<strong>${escapeHtml(text.slice(i + 2, end))}</strong>`;
        i = end + 2;
        continue;
      }
    }
    if (text[i] === '*') {
      const end = text.indexOf('*', i + 1);
      if (end > i + 1 && text[end + 1] !== '*') {
        flush();
        out += `<em>${escapeHtml(text.slice(i + 1, end))}</em>`;
        i = end + 1;
        continue;
      }
    }
    if (text[i] === '_') {
      const end = text.indexOf('_', i + 1);
      if (end > i + 1) {
        flush();
        out += `<em>${escapeHtml(text.slice(i + 1, end))}</em>`;
        i = end + 1;
        continue;
      }
    }
    if (text[i] === '[') {
      const m = text.slice(i).match(/^\[Module (\d+), Lesson (\d+)\]/);
      if (m) {
        const mod = m[1];
        const les = m[2];
        const lesson = getLesson(mod, les);
        flush();
        if (lesson) {
          const padded = String(parseInt(mod, 10)).padStart(2, '0');
          const href = `/curriculum/module-${padded}/${lesson.urlSlug}`;
          out += `<a href="${href}" class="underline-offset-2 hover:italic transition-all">${escapeHtml(m[0])}</a>`;
        } else {
          out += escapeHtml(m[0]);
        }
        i += m[0].length;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

// Explicit lesson blocks, not general Markdown: headings, paragraphs, flat
// numbered lists (one line per item), and quoted versions of those blocks.
// A legacy `#` in a lesson body stays h2: the page already supplies its h1.
const headingPattern = /^(#{1,3})\s+(.+)$/;
const itemPattern = /^(\d+)\.\s+(.+)$/;
const quotePattern = /^>(?:\s|$)/;

function renderBlocks(lines) {
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    const heading = line.match(headingPattern);
    if (heading) {
      const level = heading[1].length === 3 ? 3 : 2;
      const size = level === 3 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl';
      html.push(`<h${level} class="display ${size} leading-tight pt-4 md:pt-6">${renderInline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (quotePattern.test(line)) {
      const quoted = [];
      while (i < lines.length && quotePattern.test(lines[i].trim())) {
        quoted.push(lines[i++].trim().replace(/^>\s?/, ''));
      }
      html.push(`<blockquote class="pl-4 md:pl-5 my-2 italic text-neutral-700" style="border-left: 0.5px solid #000">${renderBlocks(quoted)}</blockquote>`);
      continue;
    }
    const firstItem = line.match(itemPattern);
    if (firstItem) {
      const items = [];
      let item;
      while (i < lines.length && (item = lines[i].trim().match(itemPattern))) {
        items.push(`<li>${renderInline(item[2])}</li>`);
        i++;
      }
      const start = Number(firstItem[1]);
      const startAttribute = start === 1 ? '' : ` start="${start}"`;
      html.push(`<ol${startAttribute} class="list-decimal pl-6 space-y-2 text-base md:text-lg leading-loose">${items.join('')}</ol>`);
      continue;
    }
    const paragraph = [];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next || headingPattern.test(next) || quotePattern.test(next) || itemPattern.test(next)) break;
      paragraph.push(lines[i++]);
    }
    html.push(`<p class="text-base md:text-lg leading-loose">${renderInline(paragraph.join('\n').trim())}</p>`);
  }
  return html.join('');
}

export function renderMarkdownBody(text) {
  if (!text) return '';
  const html = renderBlocks(text.replace(/\r\n?/g, '\n').split('\n'));
  return `<div class="max-w-3xl space-y-5 md:space-y-6">${html}</div>`;
}
