// /rss.xml — feed of every lesson in curriculum order, plus the welcome
// orientation. New essays added under /library or future /essays will need to
// be merged into the items list manually (or automatically if/when those
// routes get a frontmatter convention).
//
// `@astrojs/rss` builds the XML; we just supply title/description/link for
// each item.

import rss from '@astrojs/rss';
import { lessonsByModule, welcomeLesson } from '../lib/lessons.js';
import { curriculumModules, articles } from '../lib/content.js';

export async function GET(context) {
  const items = [];

  // Welcome / orientation comes first.
  if (welcomeLesson) {
    items.push({
      title: `${welcomeLesson.title} — Orientation`,
      link: '/curriculum/welcome',
      description: stripMarkdown(welcomeLesson.kicker || welcomeLesson.body.slice(0, 300)),
      categories: ['Curriculum', 'Orientation'],
    });
  }

  // Lessons in curriculum order: Module I lesson 1, lesson 2, …, Module II …
  for (const mod of curriculumModules) {
    const padded = String(parseInt(mod.num, 10)).padStart(2, '0');
    const lessons = lessonsByModule[String(parseInt(mod.num, 10))] || [];
    for (const l of lessons) {
      items.push({
        title: `Module ${mod.roman} · Lesson ${l.lessonNum} — ${l.title}`,
        link: `/curriculum/module-${padded}/${l.urlSlug}`,
        description: stripMarkdown(l.kicker || l.body.slice(0, 300)),
        categories: ['Curriculum', `Module ${mod.roman}`, mod.title],
      });
    }
  }

  // Long-form essays from the Library.
  for (const a of articles) {
    items.push({
      title: `Article № ${a.num} — ${a.label}`,
      link: `/library/articles/${a.id}`,
      description: a.blurb,
      categories: ['Library', 'Article', a.label],
    });
  }

  return rss({
    title: 'Svapna — Dream Yoga & Lucid Dreaming',
    description:
      'A free, donation-supported course on dream yoga and lucid dreaming. Mandukya, Tibetan milam, modern lucid-dreaming science.',
    site: context.site,
    items,
    customData: '<language>en-us</language>',
    stylesheet: false,
  });
}

function stripMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_]([^*_]+)[*_]/g, '$1')
    .replace(/\[Module (\d+), Lesson (\d+)\]/g, 'Module $1, Lesson $2')
    .replace(/\s+/g, ' ')
    .trim();
}
