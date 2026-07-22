---
name: sveltia-setup
description: Set up Sveltia CMS for an Astro project. Use when the user wants to add CMS capabilities to a new or existing Astro site — including blog posts, podcast episodes, editable pages, or other content types managed through Sveltia CMS.
---

# Sveltia CMS Setup for Astro Projects

You are helping the user set up Sveltia CMS on an Astro project. Follow this process carefully, step by step.

---

## Phase 1: Verify Prerequisites

Before doing anything, check that the following are already in place. If any are missing, set them up first.

### Required dependencies
- **Astro** (check `package.json` for `astro`)
- **Tailwind CSS** (check for `@tailwindcss/vite` and `tailwindcss` in `package.json`)
  - If missing: `npx astro add tailwind -y`

### Required project structure
Verify these directories exist (create if missing):
```
public/admin/          # Where the CMS admin interface lives
public/images/         # Where CMS-uploaded media is stored
src/content/           # Where CMS-managed markdown files live
src/layouts/           # Shared page layouts
src/pages/             # Astro page routes
src/styles/global.css  # Must contain @import "tailwindcss";
```

### Required files
- `src/layouts/BaseLayout.astro` — A shared HTML shell with nav and footer. If it doesn't exist, create one with a `<slot />` for page content.
- `src/styles/global.css` — Must import Tailwind and include prose styles for rendering markdown content.

---

## Phase 2: Ask the User About Their CMS Needs

Before creating the CMS configuration, you MUST ask the user these questions:

### Question 1: Content Types
Ask: **"What types of content do you want to manage through the CMS?"**

Common examples to suggest:
- Blog posts (title, date, description, thumbnail, body)
- Podcast episodes (title, date, description, embed URL, show notes)
- Portfolio/project items (title, description, images, link)
- Team members (name, role, bio, photo)
- Editable pages (About, Contact, etc.)
- Events (title, date, location, description)
- Testimonials (quote, author, company)
- Products/services (name, description, price, image)

### Question 2: For Each Content Type
For each content type the user wants, ask:
- **"Can the user create multiple entries, or is this a single page they just edit?"**
  - Multiple entries = folder collection (blog posts, episodes, team members)
  - Single page = file collection (about page, site settings)
- **"What fields does each entry need?"**
  - Suggest sensible defaults based on the content type
  - Always confirm with the user before proceeding

### Question 3: GitHub Repository
Ask: **"What is the GitHub repository for this project?"** (format: `username/repo-name`)

---

## Phase 3: Build the CMS

Once you have answers, create the following files in this order:

### 3a. CMS Admin Interface
Create `public/admin/index.html`:
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
</body>
</html>
```

### 3b. CMS Configuration
Create `public/admin/config.yml` with:

**Backend section:**
```yaml
backend:
  name: github
  repo: USER/REPO   # Use the repo from Phase 2
  branch: main

media_folder: "public/images"
public_folder: "/images"
```

**Collections section:**
For each content type from Phase 2, create the appropriate collection:

- **Folder collections** (multiple entries):
  ```yaml
  - name: "collection-name"
    label: "Display Name"
    folder: "src/content/collection-name"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "yaml-frontmatter"
    fields:
      # Add fields based on user's requirements
  ```

- **File collections** (single editable pages):
  ```yaml
  - name: "pages"
    label: "Pages"
    files:
      - name: "page-name"
        label: "Page Display Name"
        file: "src/content/pages/page-name.md"
        fields:
          # Add fields based on user's requirements
  ```

**Available widget types for fields:**
- `string` — Short text input
- `text` — Multi-line text (no formatting)
- `markdown` — Rich text editor (headings, bold, italic, images, lists, tables)
- `datetime` — Date and time picker
- `image` — Image upload/select
- `number` — Numeric input
- `boolean` — Toggle switch (true/false)
- `select` — Dropdown with predefined options
- `list` — Repeatable items
- `object` — Group of nested fields

Add clear `hint` properties to fields where the purpose isn't obvious — these show as helper text in the CMS UI.

### 3c. Astro Content Collections Config
Create or update `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
```

For each folder collection, define a collection with:
- A `glob` loader pointing to its content directory
- A `z.object` schema matching the frontmatter fields from config.yml
- Note: the markdown `body` field is NOT included in the schema (Astro handles it separately)

For file collections (pages), define a collection with:
- A `glob` loader for the pages directory
- A schema for the frontmatter fields

Export all collections.

### 3d. Content Directories and Seed Files
For each collection:
1. Create the directory under `src/content/`
2. Create one seed markdown file with sample content so the pages have something to display

### 3e. Page Templates
For each content type, create the necessary Astro pages:

**Listing pages** (`src/pages/[collection]/index.astro`):
- Import `getCollection` from `astro:content`
- Fetch and sort entries (typically by date, newest first)
- Render a list with links to individual entries

**Detail pages** (`src/pages/[collection]/[slug].astro`):
- Import `getCollection`, `render`, and `type CollectionEntry` from `astro:content`
- Define `getStaticPaths()` that maps each entry to a slug
- Use `render(entry)` to convert markdown to a `<Content />` component
- Wrap rendered content in a `<div class="prose-custom">`

**Single pages** (like About):
- Import `getEntry` and `render` from `astro:content`
- Fetch the specific entry and render it

IMPORTANT Astro 5 API notes:
- `render()` is a standalone function imported from `astro:content`, NOT a method on the entry
- Use `z.coerce.date()` for date fields in schemas
- Content collection `id` is used as the slug (derived from filename)

### 3f. Navigation
Make sure `BaseLayout.astro` has navigation links to all content pages AND to `/admin/`.

### 3g. Prose Styles
Ensure `src/styles/global.css` has styles for `.prose-custom` that cover:
- h2, h3 (headings)
- p (paragraphs)
- ul, ol (lists)
- a (links)
- blockquote
- table, th, td
- img
- pre, code (code blocks)

Use plain CSS (not @apply) since Tailwind v4 doesn't support @apply in scoped styles.

---

## Phase 4: Verify

1. Run `npm run build` to confirm the site compiles with no errors
2. Check that all expected pages are generated in the build output
3. Confirm the admin page exists at `public/admin/index.html`
4. Report results to the user

---

## Phase 5: GitHub and Netlify setup

Once everything builds successfully, tell the user:

1. **The CMS is set up.** List the content types and what fields each has.
2. **Remind them about config.yml** — they need to verify the `repo` field matches their GitHub repo.
3. **Deployment steps:**
   - Push to GitHub
   - Connect repo to Netlify
   - Set up GitHub OAuth App - https://github.com/settings/developers -> OAuth Apps -> New OAuth App
       - Application name = "whatever you want"
       - Homepage URL = site URL, 
       - Callback URL = `https://api.netlify.com/auth/done`
   - Add OAuth provider in Netlify -> Projects -> Select website -> project configuration -> Access & Security > OAuth > Install provider > GitHub 
       - Add Github key and secret key (this needs be generated in github when you make the OAuth app in Github)
4. **Client access:** Add clients as GitHub collaborators, share the CLIENT-SETUP-GUIDE.md, and give them the `/admin/` URL.

---

## Important Rules

- Always add comments in config.yml explaining what each section and field does
- Always add JSDoc-style comments in .astro files explaining how the CMS content flows to the page
- Use `yaml-frontmatter` format for all markdown collections
- Never use `@apply` in scoped Astro `<style>` blocks with Tailwind v4 — put prose styles in global.css
- Always create at least one seed content file per collection so pages aren't empty
- Always run a build to verify before reporting completion
