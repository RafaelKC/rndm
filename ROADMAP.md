# Project roadmap

Step-by-step plan to build the **rndm.chicovis.dev** blog, in order. Check each step off as it is done. Design, accessibility and SEO rules are in [CLAUDE.md](CLAUDE.md).

## Done

- [x] Remove Tailwind; create own tokens and classes (`src/styles.css`)
- [x] Dark/light theme system, same as chicovis.dev
- [x] Header and footer matching the personal site (Tabler icons, Inter font)
- [x] Favicon and share image pointing at chicovis.dev
- [x] Base SEO (`index.html`, `SeoService`, `robots.txt`) and base accessibility
- [x] `CLAUDE.md` with the project instructions
- [x] Project renamed from `codeme` to `rndm`
- [x] Localization (i18n): `en` (default) and `pt`, language in the route, ngx-translate, language badge, `hreflang` alternates, theme/language cookies
- [x] Theme and language cookies shared across `*.chicovis.dev` (blog side)

## Next step

### 0. Update the personal site (Astro, `../rkc`)

The blog already writes `theme` and `lang` with `Domain=.chicovis.dev`. The Astro site still has to do the same, so a choice made on one site applies to the other, and it needs a way to reach the blog. Not started.

- [ ] Theme script: read the `theme` cookie first, then `localStorage` (legacy fallback), then the system preference
- [ ] Theme toggle: write the cookie with `theme=dark|light; Domain=.chicovis.dev; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
- [ ] Language badge: write the `lang` cookie (`en|pt`) with the same attributes
- [ ] Root redirect (`/`): saved `lang` cookie → browser language → default, same order as the blog
- [ ] Clear the old host-only `theme` cookie (`Max-Age=0`, no `Domain`) before writing the shared one; omit `Domain` on `localhost`
- [ ] Add a line about theme and language cookies to a future privacy page
- [ ] Add a "Blog" link to the navbar that goes to `https://rndm.chicovis.dev/<lang>/` (same language as the page), mirroring the "Site" link on the blog

### 1. Posts as Markdown

Each post is a folder with one file per language:

```
src/content/posts/
  <post-slug>/
    manifest.json   # post metadata
    pt.md           # content in Portuguese
    en.md           # content in English
    assets/         # images and files used by the post
```

- [ ] Define the `manifest.json` format (e.g. `slug`, `date`, `updated`, `tags`, `cover`, `draft`, and per-language `title`/`description`)
- [ ] Define Markdown conventions (heading levels, images with mandatory `alt`, code blocks)
- [ ] Create a sample post to validate the structure

## Following steps

### 2. Load and render posts

- [ ] Read the `manifest.json` and `.md` files at build time (no backend)
- [ ] Convert Markdown to accessible HTML (ordered headings, `alt` on images, code with enough contrast)
- [ ] Copy each post's `assets/` into the build output
- [ ] Skip `draft: true` posts in production

### 3. Pages

- [ ] Home with the post list (title, date, summary, tags)
- [ ] Post page (`/en/<slug>`, `/pt/<slug>`), with `h1`, date and tags
- [ ] Friendly 404 page
- [ ] Component styles, using only design-system tokens and classes
- [ ] Fall back to the other language when a post has no translation, and say so

### 4. Per-post SEO

- [ ] Post `title` and `description` from `manifest.json`
- [ ] JSON-LD `BlogPosting` and `og:type=article`
- [ ] Post `og:image` (the `cover`, or the site's default image)
- [ ] `hreflang` alternates between a post's `pt.md` and `en.md`

### 5. Prerender / SSR

- [ ] Add `@angular/ssr` with `outputMode: static` and prerender every route (both languages)
- [ ] Verify the generated HTML already contains the post content, in the right language
- [ ] Upgrade Node to ≥ 24.15 (Angular CLI requirement)

### 6. Deploy

- [ ] Decide where to host and how to publish (chicovis.dev uses Docker)
- [ ] Point the `rndm.chicovis.dev` subdomain at it
- [ ] Run Lighthouse (performance, accessibility, SEO) and fix what shows up

### 7. Sitemap (last step)

- [ ] Generate `sitemap.xml` automatically at build time from the posts (today it is manual and only has the two home pages)
- [ ] Include each language of each post, with `<lastmod>` and `hreflang` alternates
- [ ] Keep `robots.txt` pointing to the sitemap
- [ ] Register `rndm.chicovis.dev` in Search Console, add the verification meta tag and submit the sitemap
