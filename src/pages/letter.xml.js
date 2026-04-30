// /letter.xml — RSS feed of newsletter issues, newest first.
//
// Mirrors /rss.xml.js: `@astrojs/rss` builds the XML; we supply title, link,
// description, and pubDate for each item. The guid (item.link, with the site
// URL applied by the rss helper) doubles as the canonical permalink.

import rss from '@astrojs/rss';
import { allLetters } from '../lib/letters.js';

export async function GET(context) {
  const items = allLetters.map(letter => ({
    title: letter.title,
    link: `/letter/${letter.slug}`,
    description: letter.excerpt || letter.title,
    pubDate: letter.isoDate ? new Date(letter.isoDate) : undefined,
  }));

  return rss({
    title: 'Svapna Project · Letter',
    description: 'The Svapna Project newsletter archive.',
    site: context.site,
    items,
    customData: '<language>en-us</language>',
    stylesheet: false,
  });
}
