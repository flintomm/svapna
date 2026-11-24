import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Site is a static, prerendered build deployed to GitHub Pages on the
// svapnaproject.org apex (CNAME in public/). Tailwind is wired in via the
// existing postcss.config.js, which Astro's Vite layer picks up automatically.
//
// `@astrojs/sitemap` walks every prerendered route and emits sitemap-index.xml
// + sitemap-0.xml at the site root. Submit `sitemap-index.xml` to Search
// Console / Bing Webmaster Tools.
export default defineConfig({
  site: 'https://svapnaproject.org',
  // Preserve Astro 6's inline whitespace behavior after the Astro 7 migration.
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: page => !page.includes('/404') && !/\/(next|night|globe-of-thought|history|curriculum|curriculum\/welcome|curriculum\/module-\d+|start\/\w+)\/?$/.test(page),
      changefreq: 'monthly',
      priority: 0.7,
      // Boost the home page and the section indexes; lessons and glossary
      // entries get the default. The ordering surfaces the editorial entry
      // points first when crawlers pick a sample.
      serialize: item => {
        const url = item.url.replace(/\/$/, '');
        const path = url.replace('https://svapnaproject.org', '') || '/';
        let priority = 0.7;
        if (path === '/') priority = 1.0;
        else if (['/dream', '/questions', '/thinkers', '/you', '/circles', '/library', '/glossary', '/community', '/support'].includes(path)) priority = 0.9;
        else if (path === '/start/lucid' || path === '/start/contemplative') priority = 0.8;
        else if (path.startsWith('/library/articles/') || path.startsWith('/history/')) priority = 0.8;
        return { ...item, priority };
      },
    }),
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
