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
- [x] Switch to pnpm
- [x] Static prerender (`@angular/ssr`, `outputMode: static`): `/en/` and `/pt/` are generated as full HTML at build time
- [x] Home intro and post list with placeholder data (`Post` model, `Localized` content, post cards)

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

- [ ] Home post list fed by real posts (the list and cards exist, with mock data); make each card link to its post page
- [ ] Post page (`/en/<slug>`, `/pt/<slug>`), with `h1`, date and tags
- [ ] Friendly 404 page
- [ ] Component styles, using only design-system tokens and classes
- [ ] Fall back to the other language when a post has no translation, and say so

### 4. Per-post SEO

- [ ] Post `title` and `description` from `manifest.json`
- [ ] JSON-LD `BlogPosting` and `og:type=article`
- [ ] Post `og:image` (the `cover`, or the site's default image)
- [ ] `hreflang` alternates between a post's `pt.md` and `en.md`

### 5. Prerender new routes

Prerender itself is done (see "Done"). Left for when posts exist:

- [ ] Add the post routes to `app.routes.server.ts` with `getPrerenderParams` (every slug, both languages)
- [ ] Verify the generated HTML of a post already contains its content, in the right language

### 6. Launch checks

- [ ] Run Lighthouse (performance, accessibility, SEO) and fix what shows up
- [ ] Review the Core Web Vitals of the prerendered pages

### 7. Sitemap

- [ ] Generate `sitemap.xml` automatically at build time from the posts (today it is manual and only has the two home pages)
- [ ] Include each language of each post, with `<lastmod>` and `hreflang` alternates
- [ ] Keep `robots.txt` pointing to the sitemap
- [ ] Register `rndm.chicovis.dev` in Search Console, add the verification meta tag and submit the sitemap

### 8. Docker and deploy pipeline (last step)

Same approach as chicovis.dev (`../rkc`): a Docker image on the home server, behind Nginx Proxy Manager, deployed by a GitHub Actions workflow over SSH.

- [ ] `Dockerfile`, multi-stage: Node ≥ 24.15 + pnpm (`corepack`) runs `pnpm install --frozen-lockfile` and `pnpm build`; then `nginx:stable-alpine` serves `dist/rndm/browser`
- [ ] `nginx.conf` for the prerendered output: `/` and unknown paths → `index.csr.html`; `/en/` and `/pt/` → their `index.html`; hashed assets cached for 1 year (`immutable`), HTML not cached; gzip/brotli on
- [ ] `docker-compose.yml`: service `rndm` (image `rndm-site:latest`, `restart: always`) on the external `web` network with the alias `rndm`, no published ports
- [ ] Nginx Proxy Manager: proxy host `rndm.chicovis.dev` → `rndm:80`, Let's Encrypt certificate, Force SSL, HTTP/2 (HTTPS is required because the shared cookies are `Secure`)
- [ ] DNS: `rndm.chicovis.dev` pointing at the server
- [ ] `.github/workflows/deploy.yml`: on push to `main` (and manual dispatch), SSH into the server, `git pull`, `docker build`, `docker compose up -d`, `docker image prune -f` (same secrets as the personal site)
- [ ] `.dockerignore` (`node_modules`, `dist`, `.angular`, `.git`)
- [ ] Optional: run build and tests in the workflow before deploying
