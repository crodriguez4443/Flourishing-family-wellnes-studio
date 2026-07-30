import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://myflourishingfamily.com',
  server: { port: 4321 },
  // /book/* and /apply/ are noindex transactional endpoints — listing them in
  // the sitemap would contradict the meta tag.
  integrations: [sitemap({ filter: (page) => !/\/(book|apply)\//.test(page) })],
  // Self-host Google Fonts via Astro's native Fonts API instead of linking to
  // fonts.googleapis.com, so the page never blocks on a third-party origin.
  // `name` matches the font-family strings already used throughout the CSS,
  // so no other files need to change.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
    },
    {
      provider: fontProviders.google(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken-grotesk',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
  ],
});
