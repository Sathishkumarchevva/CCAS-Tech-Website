import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ccas-tech.com',
  // Old URLs from earlier versions of the site keep working.
  redirects: { '/about': '/about-us/', '/services': '/expertise/', '/consultants': '/careers/', '/contact': '/contact-us/' },
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { build: { chunkSizeWarningLimit: 900 } }, // three.js is lazy-loaded on the homepage only
  devToolbar: { enabled: false },
});
