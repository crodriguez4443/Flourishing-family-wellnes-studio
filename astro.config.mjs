import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://myflourishingfamily.com',
  server: { port: 4321 },
  integrations: [sitemap()],
});
