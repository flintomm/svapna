import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Site is a static, prerendered build deployed to GitHub Pages on the
// svapnaproject.org apex (CNAME in public/). Tailwind is wired in via the
// existing postcss.config.js, which Astro's Vite layer picks up automatically.
export default defineConfig({
  site: 'https://svapnaproject.org',
  integrations: [react()],
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
