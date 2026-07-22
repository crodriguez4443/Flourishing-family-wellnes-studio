# SEO Agent — Handoff

Branch: `seo-implementation` (not pushed). Build: 24 pages, zero errors. `dist/` 19 MB.

## What Was Done

Technical SEO layer built from `requirements/seo-ground-truth.md`, with client answers
filling every `SUPPLY` gap except doctor credentials. Orchestrated across four
sub-agents; all output independently re-verified against built HTML.

**Ground truth corrections found during implementation** — the doc was stale:

| Doc says | Reality |
|----------|---------|
| B1 `site` not set | Already set to `https://myflourishingfamily.com` |
| B2 no sitemap integration | `@astrojs/sitemap` already installed and working |
| B4 no `/admin` route | Sveltia CMS is installed at `public/admin/` |
| B7 no OG image | Now created (see below) |
| §4 location pages get `LocalBusiness` each | **Deliberately not done** — see Decisions |

## Client answers applied

- Domain `https://myflourishingfamily.com` · email `info@myflourishingfamily.com`
- Legal name `FLOURISHING FAMILY CHIROPRACTIC, LIMITED LIABILITY COMPANY`
- Founding year **2011** (resolves the 2010/2011 conflict in the doc)
- Business type `["MedicalBusiness","LocalBusiness"]` + `medicalSpecialty: ["Chiropractic","Acupuncture"]`
- GBP link resolved → real coordinates `40.6188116, -74.2981423`, so `geo` is no
  longer SUPPLY. GBP added to `sameAs` in stable CID form
  (`https://maps.google.com/?cid=10511105972297997058`) rather than the
  `maps.app.goo.gl` shortlink, which can rot.
- **GBP already reads "Flourishing Family Wellness Studio"** — B8 is now only a
  Yelp/Nextdoor problem, not a Google one.

## JSON-LD Structured Data

Global (every page, from `Layout.astro`): `MedicalBusiness` + `LocalBusiness` with
stable `@id` `https://myflourishingfamily.com/#business` — full NAP, geo, hours,
`sameAs`, `areaServed`, and the Sked booking portal as a `ReserveAction`
(not `sameAs`, since it is not a brand profile).

| Route | Page-level schema |
|-------|-------------------|
| `/` | `WebSite` (publisher → `#business`) |
| `/about/` | `AboutPage` + `Person` ×3 |
| `/contact/` | `ContactPage` |
| `/programs/`, `/services/`, `/locations/` | `CollectionPage` + `ItemList` |
| `/programs/<slug>/` ×4 | `Service` + `FAQPage` (5 Q&A each) |
| `/services/<slug>/` ×5 | `Service` (acupuncture → `Person` Dr. Alexandra) |
| `/locations/<town>/` ×4 | `WebPage` + `Service` (`areaServed` = town) |
| `/resources/start-here/` | `WebPage` + `FAQPage` (3 Q&A) |
| `/resources/`, `/resources/testimonials/`, `/privacy-policy/` | `WebPage` |
| `/404` | none, `noindex` |

**23 Q&A pairs marked up**, all verbatim from what is visibly rendered.

## Decisions that deviate from the ground-truth doc

**Location pages do NOT get their own `LocalBusiness` node.** The doc specifies one
per town. There is one physical office. Four `LocalBusiness` entities for one office
is the fabricated-location pattern Google penalizes, and it would fracture NAP
consistency at the exact moment the business is trying to bring Yelp and Nextdoor
*into* line. Instead each town page emits `WebPage` + `Service` with
`areaServed: <town>`, both referencing the single business by `@id`. Same local
signal, truthful, no duplicate-entity risk. Reversible if you disagree.

**No `Review` / `AggregateRating` anywhere** (doc B9, client-confirmed). Adding dates
or a "verified" tag would not change this: self-serving reviews hosted by the
business have been ineligible for review rich results since Google's 2019 policy
change. The GBP listing carries the real stars. Verified absent from all 24 pages.

**No `Offer`/`price` on program pages.** Frontmatter prices are strings containing
raw HTML and ranges (`~$6,700 – $8,500+`, `'~$325<span…>/mo</span>'`). They cannot be
expressed as an honest numeric `price`; a fabricated precise number would be
structured-data misrepresentation.

## Hours are now self-updating (client request)

`src/lib/hours.ts` parses the single free-text `contactInfo.hours` string from
`src/data/site.json` into `openingHoursSpecification` at build time. The client edits
hours in one CMS field and the schema follows — no second place to update, no drift.
Split shifts (Mon, Thu) correctly emit two entries per day; closed days are omitted.
Malformed input degrades to fewer entries rather than invalid schema.

Self-check: `node src/lib/hours.test.mjs` — asserts the real string, `12:00p`→`12:00`,
`12:00a`→`00:00`, full day names, closed days, and garbage segments.

## Head tags

`Layout.astro` (the app's only `<head>`) now emits: `description`, canonical, favicon,
full OG, Twitter `summary_large_image`, conditional `noindex`, and JSON-LD.
`InternalLayout` and `DraftReferenceLayout` thread `description`/`ogImage`/`ogType`/
`noindex`/`schema` through — previously `description` was a declared-but-unused dead
prop on both.

## Defects found and fixed along the way

1. **Homepage `<title>` rendered `undefined | Flourishing Family Wellness Studio`** —
   `index.astro` passed no `title`. `undefined` also leaked into `og:title` and
   `twitter:title`. Now `Clark NJ Chiropractor | …` (58 chars).
2. **JSON-LD injection** — `JSON.stringify` does not escape `<`, so a client typing
   `</script>` into a CMS FAQ answer would break out of the JSON-LD block into live
   markup. Client-editable FAQ text flows through this path. Now escaped.
3. **Hours parser dropped full day names** — `/^(\w{3})\s+/` silently skipped
   `Monday`. A client typing the full day name would lose that day from schema with
   no error. Now accepts both forms.
4. **Raw `<em>` leaking into a live meta description** on `/services/pediatric-postpartum/`.
5. **Meta descriptions were bound to visible hero copy**, so 8 of 9 detail pages ran
   162–220 chars. Added optional `metaDescription` frontmatter (falls back to
   `summary`), declared in `public/admin/config.yml` so Sveltia will not drop it.
6. `dist/` was **107 MB**, shipping a 5.9 MB JPEG to real browsers.

## Images

All source images capped at 1600px longest side; raw ESM `<img>` imports converted to
`<Image />` for responsive `srcset` + WebP.

| | Before | After |
|---|--------|-------|
| `dist/` | 107 MB | **19 MB** |
| Largest asset | 5.9 MB | 370 KB |

OG image: `public/default-og-image.jpg`, 1200×630, cropped from
`src/assets/programs/postpartum.jpg`. Visually checked — centre crop keeps doctor,
baby, and mother intact.

## Housekeeping

- Deleted `src/pages/Contact3.html` (stray Builder.io export, near-duplicate of
  `/contact/`, no canonical) — was building to `/Contact3/`.
- Moved `public/agents/` → `docs/agents/` — agent instruction docs were shipping
  publicly and crawlable at `/agents/*.md`.
- Wired `src/assets/favicon.svg` → `public/favicon.svg` + `<link rel="icon">`.

## Verification (re-run independently, not taken from sub-agent reports)

- `npm run build` — 24 pages, zero errors
- Every JSON-LD block on all 24 pages parsed with `JSON.parse` — all valid
- Every page has a canonical; all titles, descriptions, canonicals **unique**
- `streetAddress` appears exactly **once per page** — no NAP duplication
- No `AggregateRating` / `Review` anywhere
- Sitemap: 23 URLs, no `/Contact3/`, `/agents/`, `/admin/`, or 404
- `node src/lib/hours.test.mjs` passes

## Outstanding — needs human action

- [ ] **10 titles exceed 60 chars** and will truncate in search results. Root cause:
      the ` | Flourishing Family Wellness Studio` suffix is 38 of the ~60 budget.
      Two-part fix, both **copy/brand decisions I did not want to make unilaterally**:
      (a) shorten the suffix to ` | Flourishing Family` (saves 17 chars everywhere);
      (b) give the 4 location pages short `<title>` overrides — their titles are full
      sentences (48–53 chars) before any suffix. Affected: all 4 location pages, all
      4 program pages, `services/pediatric-postpartum`, `services/sports-extremity-care`.
- [ ] **Home title is a judgment call worth reviewing.** `Clark NJ Chiropractor` is the
      strongest keyword but sits in tension with the repositioning *away* from
      "chiropractic office" toward "family wellness hub." Nothing longer fit in 60 chars.
- [ ] **SUPPLY still missing:** last names + license/credential IDs (DC, L.Ac., NPI)
      for Dr. Shelley and Dr. Alexandra. Person schema is thin without them. Dr. Ila
      Clemente's Webster certification is on file and can be added as `hasCredential`.
- [ ] Rename Yelp + Nextdoor listings to "Flourishing Family Wellness Studio"
      (business-side; Google is already correct).
- [ ] Legacy internal links (`/2pregnancy-journey/` etc. in content `programLinks`)
      point at routes that are not emitted — broken links, QA item, not SEO.
- [ ] Validate with Google's Rich Results Test after deploy.

Verified as already correct (doc B4 was wrong): `public/admin/index.html` carries
`<meta name="robots" content="noindex">`, and `/admin/` is disallowed in `robots.txt`.
