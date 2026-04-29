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

// Block pass: paragraphs, `## subheading`, `# heading`, `> blockquote`.
export function renderMarkdownBody(text) {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/);
  const html = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith('## ')) {
      html.push(
        `<h3 class="display text-2xl md:text-3xl leading-tight pt-4 md:pt-6">${renderInline(block.slice(3))}</h3>`
      );
      continue;
    }
    if (block.startsWith('# ')) {
      html.push(
        `<h2 class="display text-3xl md:text-4xl leading-tight pt-4 md:pt-6">${renderInline(block.slice(2))}</h2>`
      );
      continue;
    }
    if (block.startsWith('> ')) {
      const inner = block.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ').trim();
      html.push(
        `<blockquote class="pl-4 md:pl-5 my-2 italic text-neutral-700" style="border-left: 0.5px solid #000">${renderInline(inner)}</blockquote>`
      );
      continue;
    }
    html.push(
      `<p class="text-base md:text-lg leading-loose">${renderInline(block)}</p>`
    );
  }
  return `<div class="max-w-3xl space-y-5 md:space-y-6">${html.join('')}</div>`;
}
