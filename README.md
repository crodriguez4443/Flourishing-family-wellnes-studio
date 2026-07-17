# Flourishing Family Wellness Studio

Homepage built with native Astro (no React).

## Commands

```bash
export PATH="$PWD/.tools/bin:$PATH"
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

This project includes a local portable Node/npm install in `.tools/` for development on this machine.

## Project structure

- `src/pages/index.astro` — homepage
- `src/pages/programs/` — program landing page and program detail pages
- `src/pages/services/` — services landing page and service detail pages
- `src/pages/about/` — doctors, philosophy, and care network
- `src/pages/resources/` — patient resources landing page
- `src/pages/start-here.astro` — new patient on-ramp
- `src/pages/testimonials.astro` — proof and trust markers
- `src/pages/locations/` — local SEO pages
- `src/layouts/Layout.astro` — HTML shell + fonts
- `src/layouts/InternalLayout.astro` — shared layout for internal pages
- `src/components/` — reusable internal page sections
- `src/data/site.ts` — shared page content and route data
- `src/styles/global.css` — responsive breakpoints + hover styles
- `public/assets/` — images (symlink to `/assets`)

## Props

The homepage accepts optional props in the frontmatter of `index.astro`:

- `announcementBar` (default: `true`)
- `stickyBookButton` (default: `true`)
- `testimonialTreatment` — `'Deep Plum'` (default) or `'Sage Teal'`

## Legacy files

The original Builder export is kept in `legacy/` for reference.
