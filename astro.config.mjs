import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ccastech.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { build: { chunkSizeWarningLimit: 900 } }, // three.js is lazy-loaded on the homepage only
  devToolbar: { enabled: false },
});
