import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://myflourishingfamily.com',
  server: { port: 4321 },
  // /book/* and /apply/ are noindex transactional endpoints — listing them in
  // the sitemap would contradict the meta tag.
  integrations: [sitemap({ filter: (page) => !/\/(book|apply)\//.test(page) })],
});
