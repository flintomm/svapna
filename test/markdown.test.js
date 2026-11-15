import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

let server;
let renderMarkdownBody;
let renderInline;
let lessons;

before(async () => {
  // Use the build's real Vite glob transform, not a mock lesson registry.
  server = await createServer({
    root: fileURLToPath(new URL('../', import.meta.url)),
    configFile: false,
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
  });
  ({ renderMarkdownBody, renderInline } = await server.ssrLoadModule('/src/lib/markdown.js'));
  ({ lessonsByModule: lessons } = await server.ssrLoadModule('/src/lib/lessons.js'));
});
after(async () => { await server?.close(); });

const count = (html, tag) => [...html.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g'))].length;
const lesson = (moduleNum, lessonNum) => lessons[moduleNum].find(l => l.lessonNum === lessonNum);
const paragraphs = html => [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m => m[1]);

function assertList(html, items) {
  assert.equal(count(html, 'ol'), 1);
  assert.equal(count(html, 'li'), items.length);
  const list = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/);
  assert.ok(list, 'ordered list must close');
  assert.equal(list[1], items.map(item => `<li>${renderInline(item)}</li>`).join(''));
}

test('lesson headings use h2 and h3 beneath the page h1', () => {
  const html = renderMarkdownBody('## MILD: Mnemonic Induction of Lucid Dreams\n\n### The conceptual reframing\n\nExplanation.');
  assert.match(html, /<h2\b[^>]*>MILD: Mnemonic Induction of Lucid Dreams<\/h2>/);
  assert.match(html, /<h3\b[^>]*>The conceptual reframing<\/h3>/);
  assert.equal(count(html, 'h1'), 0);
  assert.equal(count(html, 'h2'), 1);
  assert.equal(count(html, 'h3'), 1);
  assert.doesNotMatch(html, /###/);
});

test('van Eeden classification retains exactly nine ordinary items', () => {
  const body = lesson('4', '4').body;
  const sequence = body.match(/^1\. .+(?:\n\d+\. .+)*/m)?.[0];
  assert.ok(sequence);
  const items = sequence.split('\n').map(line => line.replace(/^\d+\. /, ''));
  assert.equal(items.length, 9, 'corpus fixture must contain nine categories');
  assertList(renderMarkdownBody(sequence), items);
  assert.equal(count(renderMarkdownBody(body), 'li'), 9);
});

for (const [name, index] of [['MILD', 0], ['WBTB', 1]]) {
  test(`${name} protocol retains exactly five quoted items and its citation`, () => {
    const sequences = [...lesson('5', '4').body.matchAll(/^> 1\. .+(?:\n> \d+\. .+)*/gm)];
    assert.equal(sequences.length, 2);
    const sequence = sequences[index][0];
    const items = sequence.split('\n').map(line => line.replace(/^> \d+\. /, ''));
    assert.equal(items.length, 5, 'corpus fixture must contain five steps');
    const html = renderMarkdownBody(sequence);
    assert.equal(count(html, 'blockquote'), 1);
    assert.match(html, /<blockquote\b[^>]*><ol\b[^>]*>[\s\S]*<\/ol><\/blockquote>/);
    assertList(html, items);
    assert.match(html, /<em>/);
    assert.match(html, /\(LaBerge and Rheingold\)<\/li>/);
  });
}

test('quoted prose around lists and quoted paragraph breaks remain inside the quote', () => {
  const html = renderMarkdownBody('Before.\n> Introductory *text*.\n> 1. First\n> 2. Second\n> Closing citation.\n>\n> Another paragraph.\nAfter.');
  const quote = html.match(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/)?.[1];
  assert.ok(quote);
  assertList(quote, ['First', 'Second']);
  assert.deepEqual(paragraphs(quote), ['Introductory <em>text</em>.', 'Closing citation.', 'Another paragraph.']);
  assert.match(quote, /^<p\b[^>]*>Introductory <em>text<\/em>\.<\/p><ol/);
  assert.match(quote, /<\/ol><p\b[^>]*>Closing citation\./);
  assert.deepEqual(paragraphs(html), ['Before.', 'Introductory <em>text</em>.', 'Closing citation.', 'Another paragraph.', 'After.']);
});

test('paragraphs retain soft line breaks and blank-line separation', () => {
  assert.deepEqual(paragraphs(renderMarkdownBody('First line\nsecond line.\n\nNext paragraph.')), ['First line\nsecond line.', 'Next paragraph.']);
  assert.equal(renderMarkdownBody(''), '');
  assert.equal(renderMarkdownBody(null), '');
});

test('block transitions work without blank lines and normalize CRLF', () => {
  const html = renderMarkdownBody('Intro.\r\n## Section\r\n### Detail\r\n1. One\r\n2. Two\r\nOutro.');
  assert.match(html, /<\/p><h2\b[^>]*>Section<\/h2><h3\b[^>]*>Detail<\/h3><ol/);
  assertList(html, ['One', 'Two']);
  assert.deepEqual(paragraphs(html), ['Intro.', 'Outro.']);
  assert.doesNotMatch(html, /###|\r/);
  const separated = renderMarkdownBody('1. One\n\n1. Another list');
  assert.equal(count(separated, 'ol'), 2);
  assert.equal(count(separated, 'li'), 2);
});

test('inline emphasis and permanent lesson links survive in every block kind', () => {
  const inline = '**bold** *italic* _also italic_ [Module 1, Lesson 1]';
  const expected = '<strong>bold</strong> <em>italic</em> <em>also italic</em> <a href="/curriculum/module-01/why-we-begin-here" class="underline-offset-2 hover:italic transition-all">[Module 1, Lesson 1]</a>';
  assert.equal(renderInline(inline), expected);
  for (const prefix of ['', '## ', '### ', '1. ', '> ', '> 1. ']) {
    assert.ok(renderMarkdownBody(prefix + inline).includes(expected), prefix);
  }
  assert.equal(renderInline('[Module 99, Lesson 99]'), '[Module 99, Lesson 99]');
});

test('HTML is escaped in paragraphs, headings, lists, quotes, and emphasis', () => {
  const source = '<script>"x" & \'y\'</script>';
  const escaped = '&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;';
  for (const prefix of ['', '## ', '### ', '1. ', '> ', '> 1. ']) {
    const html = renderMarkdownBody(prefix + source);
    assert.ok(html.includes(escaped), prefix);
    assert.doesNotMatch(html, /<script>/);
  }
  assert.equal(renderInline(`**${source}** *${source}* _${source}_`), `<strong>${escaped}</strong> <em>${escaped}</em> <em>${escaped}</em>`);
});

test('all lesson bodies consume level-three markers and preserve heading counts', () => {
  for (const entry of Object.values(lessons).flat()) {
    const html = renderMarkdownBody(entry.body);
    assert.doesNotMatch(html, /###/, entry.title);
    assert.equal(count(html, 'h1'), 0, entry.title);
    assert.equal(count(html, 'h2'), [...entry.body.matchAll(/^#{1,2} /gm)].length, entry.title);
    assert.equal(count(html, 'h3'), [...entry.body.matchAll(/^### /gm)].length, entry.title);
  }
});
