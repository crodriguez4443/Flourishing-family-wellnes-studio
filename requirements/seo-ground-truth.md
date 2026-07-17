# SEO Ground Truth — Flourishing Family Wellness Studio

**For:** the SEO Agent (`public/agents/04b.seo-agent.md`, Agent 4b).
**Purpose:** This is the single source of truth the SEO agent needs to run. The agent's own reading list (`CLAUDE.md`, `requirements/project-intake.md`, and three `docs/agent-handoffs/*.md` files) **does not exist in this repo** — this document replaces all of them. Read this instead of the Phase-1 handoffs.

**How this was built:** derived directly from the live codebase (`src/`, `astro.config.mjs`, `public/`) and the two approved discovery documents (`src/docs/FF_Website_Analysis_Structure.md`, `src/docs/FF_Creative_Direction.md`). Every fact is cited to a file. Anything not in the repo is marked **`SUPPLY`** (client must provide) — never invent a value for a `SUPPLY` field.

---

## 0. STOP — Blockers before you write anything

These are true *today* and contradict assumptions baked into your spec. Resolve or route around each one before Phase 2.

| # | Blocker | Reality in repo | What to do |
|---|---------|-----------------|------------|
| B1 | **`site` is not set** in `astro.config.mjs` | Config only sets `server.port`. `Astro.site` resolves to `undefined`. | Set `site: 'https://myflourishingfamily.com'` (domain confirmed in `public/robots.txt` + both docs). Without it, `new URL(Astro.url.pathname, Astro.site)` throws `TypeError: Invalid URL` at build — a hard blocker for canonical + OG URLs, not cosmetic. |
| B2 | **No sitemap integration** | `@astrojs/sitemap` is not in `package.json` and not in `node_modules`. `npm run build` produces **no** `dist/sitemap-index.xml`. | `npx astro add sitemap`. Your Phase 6 verification cannot pass until this exists. `robots.txt` already advertises `/sitemap-index.xml` — currently a dead link. |
| B3 | **There is no single `BaseLayout`** | Three layouts exist (see §5). `Layout.astro` accepts only `title`. `InternalLayout`/`DraftReferenceLayout` accept `title/description/current` but **never render `description`** — it's a dead prop. No OG, Twitter, canonical, or JSON-LD anywhere in the codebase. | Put shared `<head>` tags (OG, Twitter, canonical, Organization JSON-LD) in `Layout.astro` (the one true `<head>` owner) and thread `description`/`ogImage`/`ogType` up through the two wrapper layouts. **Extend, do not replace.** |
| B4 | **No `/admin` route exists** | Your spec says "`/admin` … already set noindex in `admin/index.html`." False. `public/admin/` does not exist; Sveltia CMS is not installed (`public/agents/sveltia-cms-configuration.md` is a *playbook*, not a record of work done). `robots.txt` disallows `/admin/` — a no-op today. | Do **not** claim admin noindex is done. If the CMS gets built later, its `public/admin/index.html` must carry `<meta name="robots" content="noindex" />` and be excluded from the sitemap. Note this as outstanding. |
| B5 | **Stray route pollutes the build** | `src/pages/Contact3.html` builds to `/Contact3/` — a raw Builder.io export, near-duplicate of `/contact/`, no robots/canonical. Confirmed in `dist/`. | Exclude from sitemap (or delete the file). Duplicate-content risk. `src/temp/*.dc.html` are **not** in `src/pages/` and are **not** emitted — safe to ignore. |
| B6 | **`public/agents/*.md` ships publicly** | `dist/agents/04b.seo-agent.md` and the CMS playbook are copied verbatim into the build → crawlable at `/agents/*.md`. | Exclude `/agents/` from the sitemap and consider `Disallow: /agents/` in `robots.txt`. |
| B7 | **No OG image exists** | No 1200×630 image anywhere in `public/` or `src/assets/` (all candidates are 5000px+ full-res photos or the 1396×360 logo). See §6. | Flag as outstanding. Best crop source: `src/assets/hero.jpg` or `src/assets/doctors/the-doctors.jpg`. |
| B8 | **Name mismatch (NAP)** | Site brand = "Flourishing Family **Wellness Studio**". Logo files, Yelp/Nextdoor slugs, and all 30 reviews say "Flourishing Family **Chiropractic**." Legal name unknown. | Use `name: "Flourishing Family Wellness Studio"`, `alternateName: "Flourishing Family Chiropractic"` in Org schema. The GBP/Yelp listing rename is a **business-side fix** — flag it, don't silently "resolve" it in code. |
| B9 | **Review schema is NOT safe** | `src/data/reviews.json` = 30 entries, **all 5★**, no dates, no per-review source URL. The UI (`ReviewsCube.astro`) truncates to 130 chars, so marked-up text wouldn't match rendered text. | **Do not emit `AggregateRating`/`Review` JSON-LD.** This is self-serving, undated, unsourced, and truncated — exactly what Google suppresses or penalizes. Let the real GBP listing carry ratings. Only revisit if the client confirms a genuine dated, sourced export. |

---

## 1. Business identity (Organization / LocalBusiness core)

All values from `src/data/site.ts` unless noted. Use these verbatim.

| Field | Value | Source |
|-------|-------|--------|
| `name` | `Flourishing Family Wellness Studio` | `SiteHeader.astro`, `Layout.astro` default title |
| `alternateName` | `Flourishing Family Chiropractic` | Yelp/Nextdoor slugs, `reviews.json`, logo files (see B8) |
| `legalName` | 'FLOURISHING FAMILY CHIROPRACTIC, LIMITED LIABILITY COMPANY with DBA of Flourishing Family Wellness Studio' | not in repo |
| `url` | `https://myflourishingfamily.com` | `robots.txt`, docs |
| `email` | info@myflourishingfamily.com | no address string anywhere in repo |
| `telephone` | `+1-908-653-0000` (display `(908) 653-0000`) | `site.ts` |
| `foundingDate` | `2011` (displayed "since 2011" in `StatsStrip`/About) — **conflict:** Dr. Shelley's bio says "Started … in 2010." Use 2011 (the repeatedly-displayed value) and flag. | `about/index.astro`, `site.ts:41` |

**PostalAddress:**
```
streetAddress: "68 Washington Street"
addressLocality: "Clark"
addressRegion: "NJ"
postalCode: "07066"
addressCountry: "US"
```

**geo:** **SUPPLY** (no lat/long in repo — geocode from address only if you label it as derived, not client-confirmed).

**sameAs** (verified URLs in `site.ts`):
```
https://www.facebook.com/flourishingfamilywellness
https://www.instagram.com/flourishingfamilywellness/
https://www.yelp.com/biz/flourishing-family-chiropractic-clark
https://nextdoor.com/pages/flourishing-family-chiropractic-clark-nj/
```
Booking portal (`https://portal.sked.life`) and Google Business Profile URL: GBP is **SUPPLY**. Sked is a booking portal, not a brand profile — put it in `potentialAction`/`reservation` context, not `sameAs`.

**openingHoursSpecification** (parsed from `site.ts` hours string; Mon & Thu have split shifts; Tue & Sun closed → omit):
```json
[
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday",    "opens": "09:00", "closes": "13:00" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday",    "opens": "15:00", "closes": "19:00" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "15:00", "closes": "18:30" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday",  "opens": "09:00", "closes": "13:00" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday",  "opens": "15:00", "closes": "18:00" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday",    "opens": "08:00", "closes": "12:00" },
  { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday",  "opens": "08:00", "closes": "11:30" }
]
```

**areaServed** (identical across three sources): Clark (home base), Westfield, Cranford, Scotch Plains — all Union County, NJ.

**logo / image:** `logo` → `/assets/logo-horizontal-transparent.png` (1396×360, transparent). Square alternative for tight contexts: `/assets/logo-icon.jpg` (367×360). No favicon `<link>` exists today — `src/assets/favicon.svg` (512×512) is unreferenced; wire it up.

### Home business type — use `ChiropracticClinic`? No.
Recommendation: **`@type: ["MedicalBusiness", "LocalBusiness"]`** for the home business node, or more specifically **`Physician`**-adjacent. Reasoning from the real schema.org hierarchy: `Chiropractic` exists only as an enum value of `MedicalSpecialty` / `MedicalBusiness`, **not** as a standalone type. The practice is multi-modal (chiropractic + acupuncture + nutrition), so a single narrow type undersells it. Cleanest valid choice: `LocalBusiness` + `MedicalBusiness` with `medicalSpecialty` noting chiropractic, plus `ProfessionalService` if you want the service-business signals. Do **not** use a non-existent `@type: "Chiropractic"` as a business type — it will fail validation. Home page also gets a `WebSite` node (see §4).

---

## 2. Practitioners (Person schema)

From `site.ts` `doctors[]`. Last names for Shelley & Alexandra and any license/credential IDs (DC, L.Ac., NPI) are **SUPPLY**.

| name | jobTitle | knowsAbout / credential | image | since |
|------|----------|--------------------------|-------|-------|
| Dr. Shelley | Founder · Chiropractor | gentle/low-force perinatal & pediatric care | `/assets/doctors/shelley.jpg` | 2010 |
| Dr. Ila Clemente | Chiropractor | **Webster certified**; perinatal & pediatric | `/assets/doctors/ila.jpg` | 2021 |
| Dr. Alexandra | Acupuncturist | fertility & pregnancy acupuncture, female hormone balance | `/assets/doctors/alex.jpg` | 2025 |

**YMYL/E-E-A-T:** This is a healthcare (YMYL) site and its stated differentiator is doctor identity ("the doctor who meets you is the doctor who treats you; no PAs, no students"). Where a page carries author/provider markup — especially Fertility and Pregnancy — reference the specific named doctor (Person), not a generic org byline. Dr. Alexandra → fertility/pregnancy pages; Dr. Ila → pregnancy/Webster; use `provider`/`author` accordingly.

---

## 3. Positioning, voice & compliance rules (governs every meta description / OG title / schema `description`)

**Positioning:** repositioning **from** "chiropractic office" (a menu of techniques) **to** "family wellness hub" organized around one journey: **preconception → pregnancy → postpartum → pediatric → whole-family** (`FF_Website_Analysis_Structure.md` §4.1). Programs are the sales engine; Services are "the *how*" that supports them.

**Ideal patient** (write to her): stressed professional mom, 30–45, in Westfield/Scotch Plains/Cranford/Clark, school-aged kids, own disposable income; told her aches are "just aging"; wants to "feel like herself again"; arrives by referral, trusts her doula/OB/midwife (`§4.2`).

**Voice** (`FF_Creative_Direction.md` §3): warm, direct, a little wry; "natural & editorial, not medical & corporate"; few words, breathing room. Reassuring, hopeful, cared-for.

**HARD RULE — outcomes, not techniques, in metadata.** The site's central diagnosis is that the old site failed by leading with technique names. Meta descriptions, OG titles, and schema `description` fields **must lead with the outcome / self-recognition**, never open with "Gonstead / Webster / Non-Force / Talsky Tonal." Technique names are allowed only as a mid-sentence trust modifier (e.g. "Webster-certified prenatal care"). Same discipline as the approved copy, where `chiropractic.md` frames techniques as "Four tools. One picked for you."

**COMPLIANCE — never imply guaranteed medical outcomes.** This recurs across the content:
- Fertility: "We can't promise a pregnancy. No honest provider can." / "they support the body's work — they don't cause pregnancy, and we'll never claim otherwise" (`fertility-journey.md`).
- The only guarantees on file are of **care/experience**, never outcome: "We guarantee the care and the experience — never a medical outcome" (`pregnancy-journey.md`).

Therefore in meta/schema: **do not** imply chiropractic/acupuncture causes pregnancy, cures infertility, or guarantees a birth outcome; do not compress "we guarantee the care" into "guaranteed results"; do not claim treatment of named medical conditions (the copy says "support/regulate/ease," never "treat/cure"); do not invent superlatives (the only "best…" on file is a *quoted patient testimonial*).

**Approved proof points (verbatim only — don't round or embellish):** "110K+ adjustments given"; "Caring for families since 2011"; "Fifteen years of perinatal care"; "One doctor, every visit — no PAs, no students"; "Webster-certified." Brand line (usable, not a claim): "If you get your tires rotated more often than your nervous system gets regulated, we should talk."

---

## 4. Route inventory + per-route schema plan

Full build = 25 routes (from `npm run build`). Dynamic slugs expanded from `programs.ts` / `services.ts` / `site.ts locations`.

**Note on program slugs:** the *page* route uses the content `slug` field (e.g. `/programs/pregnancy-care/`), but internal links in content point at legacy `routeSlug` paths like `/2pregnancy-journey/` (e.g. `chiropractic.md programLinks`). Those legacy paths are **not** emitted routes — flag as broken internal links for QA, but they don't affect the sitemap.

| URL | Source | Schema type | Key fields available now |
|-----|--------|-------------|--------------------------|
| `/` | `pages/index.astro` | `WebSite` + business node (§1, `MedicalBusiness`+`LocalBusiness`) | full NAP, hours, geo(SUPPLY), sameAs, logo |
| `/about/` | `pages/about/index.astro` | `AboutPage` (+ `Person` ×3 from §2) | doctor bios, differentiator, "since 2011" |
| `/contact/` | `pages/contact/index.astro` | `ContactPage` (+ reuse business node) | NAP, hours, map |
| `/programs/` | `pages/programs/index.astro` | `CollectionPage` | list of 4 programs |
| `/programs/fertility-preconception/` | `content/programs/fertility-journey.md` | `Service` (+ `FAQPage`, §4a) | summary, provider=Dr. Alexandra, price bundle |
| `/programs/pregnancy-care/` | `content/programs/pregnancy-journey.md` | `Service` (+ `FAQPage`) | Webster, trimester roadmap, price bundle |
| `/programs/postpartum-care/` | `content/programs/postpartum-care.md` | `Service` (+ `FAQPage`) | baby-inclusive, price bundle |
| `/programs/family-wellness/` | `content/programs/family-membership.md` | `Service` (+ `FAQPage`) | membership, monthly value |
| `/services/` | `pages/services/index.astro` | `CollectionPage` | list of 5 services |
| `/services/chiropractic/` | `content/services/chiropractic.md` | `Service`, provider=Organization | summary, techniques (as detail, not hook) |
| `/services/acupuncture/` | `content/services/acupuncture.md` | `Service`, provider=Dr. Alexandra | fertility/pregnancy/hormone |
| `/services/functional-nutrition/` | `content/services/functional-nutrition.md` | `Service` | summary |
| `/services/pediatric-postpartum/` | `content/services/pediatric-postpartum.md` | `Service` | milestone care |
| `/services/sports-extremity-care/` | `content/services/sports-extremity-care.md` | `Service` | extremity/sports |
| `/locations/` | `pages/locations/index.astro` | `CollectionPage` | 4 towns |
| `/locations/clark/` | `pages/locations/[town].astro` | `LocalBusiness` | full NAP (this is the real address town) |
| `/locations/westfield/` | `[town].astro` | `LocalBusiness` | title+summary from `site.ts`; `areaServed`=Westfield, address=Clark studio |
| `/locations/cranford/` | `[town].astro` | `LocalBusiness` | same pattern |
| `/locations/scotch-plains/` | `[town].astro` | `LocalBusiness` | same pattern |
| `/resources/` | `pages/resources/index.astro` | `WebPage` | resource hub |
| `/resources/start-here/` | `pages/resources/start-here.astro` | `WebPage` (consider `FAQPage` if Q&A) | 6–12mo expectation, pricing/insurance |
| `/resources/testimonials/` | `pages/resources/testimonials.astro` | `WebPage` — **not** Review schema (B9) | quotes (display only) |
| `/privacy-policy/` | `pages/privacy-policy/index.astro` | `WebPage` | — |
| `/404` | `pages/404.astro` | none; ensure `noindex` | — |
| `/Contact3/` | `pages/Contact3.html` | **exclude** (B5) | stray duplicate |

**Location schema caveat:** all four location pages share the one physical Clark address. Only Clark is the real `address`; Westfield/Cranford/Scotch Plains pages should set `areaServed` to that town but keep `address` = the Clark studio (do not fabricate separate addresses). Titles/summaries are pre-written in `site.ts locations[]` — use them for `name`/`description`.

### 4a. FAQPage schema — ready to use
Four program pages carry real Q&A in frontmatter `faqs[]` (question/answer). These are **safe, high-value `FAQPage` targets** — mark them up verbatim. Counts: pregnancy 5, fertility 5, postpartum 5, family-membership 5. Example (pregnancy):
- "Is chiropractic safe during pregnancy?" → "Yes — this is Webster-certified, gentle, low-force care designed for a pregnant body. No twisting, no cracking."
- "Does insurance cover it?" → "We keep pricing transparent, offer payment plans, accept FSA/HSA, and give you a superbill to submit for reimbursement."

The fertility FAQ includes the compliance-critical line "They don't cause pregnancy — they support the body doing the work…" — keep it verbatim; it is exactly the honest framing the brand requires. `start-here.astro` may also have Q&A-shaped content; check and add `FAQPage` if so.

---

## 5. Layouts (`<head>` ownership)

| Layout | Current `Props` | Renders in `<head>` | Used by |
|--------|-----------------|---------------------|---------|
| `Layout.astro` | `title?: string` (default "Flourishing Family Wellness Studio") | charset, viewport, `<title>`, Google Fonts preconnect. **The only `<head>` in the app.** No description/OG/Twitter/canonical/JSON-LD/favicon. | wrapped by both others |
| `InternalLayout.astro` | `title: string; description?: string; current?: string` | none (only sets `title` prop on `Layout`; **`description` is a dead prop**) | `index`, `resources/start-here`, `locations/index`, `locations/[town]`, `programs/index` |
| `DraftReferenceLayout.astro` | `title: string; description?: string; current?: string` | none (same dead `description`) | `404`, `contact`, `privacy-policy`, `about`, `resources/index`, `resources/testimonials`, `services/index` |

**Note:** `services/[slug]` and `programs/[slug]` render `ReferenceServicePage` / `ReferenceProgramPage` components — trace which layout those pull in when adding page-specific JSON-LD; they may not go through Internal/Draft layouts the same way.

**Plan:** Add to `Layout.astro`'s `<head>`: `description`, canonical (`new URL(Astro.url.pathname, Astro.site)`), OG (`og:title/description/type/url/site_name/image`), Twitter (`summary_large_image`), favicon `<link>`, and the Organization JSON-LD (§1). Add `description`/`ogImage`/`ogType` to the `Props` of `Layout` **and** thread them through `InternalLayout` + `DraftReferenceLayout` (currently they swallow `description`). Page-specific JSON-LD (`Service`, `FAQPage`, `LocalBusiness`, `AboutPage`, etc.) goes in each page/component via a `<script type="application/ld+json">` or a shared `<Schema />` component.

---

## 6. Assets

**OG image (1200×630): none exists (B7).** All candidates and real dimensions:
`hero.jpg` 5837×3891 · `card-family.jpg` 5627×3752 · `card-pregnancy.jpg` 5908×3939 · `card-fertility.jpg` 5820×3880 · `doctors/the-doctors.jpg` 945×1182 · `logo-horizontal-transparent.png` 1396×360 · `logo-icon.jpg` 367×360 · `favicon.svg` 512×512.
Best crop source for a default OG card: `hero.jpg` or `doctors/the-doctors.jpg`. Export a real `/default-og-image.jpg` at 1200×630; until then, mark OG image outstanding.

**Favicon:** `src/assets/favicon.svg` exists but no `<link rel="icon">` is wired anywhere — add it.

---

## 7. Outstanding items to put in your handoff

- [ ] Set `site` in `astro.config.mjs` (B1) and install `@astrojs/sitemap` (B2) — **both required before build verification passes.**
- [ ] Create 1200×630 `/default-og-image.jpg` (B7).
- [ ] **SUPPLY from client:** business email, legal name, GBP profile URL, geo coordinates, doctor last names + license/credential IDs.
- [ ] Resolve GBP/Yelp naming to match "Flourishing Family Wellness Studio" (B8) — business-side.
- [ ] Confirm 2010 vs 2011 founding year.
- [ ] Do **not** ship AggregateRating/Review schema (B9) unless client provides a genuine dated, sourced review export.
- [ ] Exclude `/Contact3/` (B5) and `/agents/` (B6) from sitemap; consider deleting `Contact3.html`.
- [ ] Fix legacy internal links (`/2pregnancy-journey/` etc. in content `programLinks`/`href`) — QA item.
- [ ] Admin/CMS noindex (B4) only applies if/when Sveltia is installed.
- [ ] Validate structured data with Google's Rich Results Test after build.
