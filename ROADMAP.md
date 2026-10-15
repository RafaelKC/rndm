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
- [x] Manifest `draft` (left out of production) and `updated`; syntax highlighting; accessible tag/link color token
- [x] Smaller bundle: icon font subset (initial JS+CSS 537 kB → 325 kB)
- [x] `Dockerfile`, `nginx.conf` (tested with podman), safe deploy (forced-command script, compose, `ci.yml`, manual `deploy.yml` that builds on the runner), see docs/deploy.md
- [x] `/new-post` skill with templates, post validation, automatic word count and generated `sitemap.xml`
- [x] Home list built from the real manifests (generated `posts/index.json`), cards fully clickable
- [x] Post page `/:lang/post/:id`: manifest + Markdown (with raw HTML) per language, prerendered, translated SEO and `BlogPosting` JSON-LD, one example post
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

### 1. Posts as Markdown (done)

Each post is a folder with one file per language:

```
src/content/posts/
  <guid>/
    manifest.json   # post metadata
    pt.md           # content in Portuguese
    en.md           # content in English
    assets/         # images and files used by the post
```

- [x] Define the `manifest.json` format (`PostManifest`, with optional `updated` and `draft`)
- [x] Define Markdown conventions (see CLAUDE.md, "Posts")
- [x] Create a sample post to validate the structure

## Following steps

### 4. Launch checks (after go live)

- [ ] Run Lighthouse (performance, accessibility, SEO) and fix what shows up
- [ ] Review the Core Web Vitals of the prerendered pages

### 5. Search Console

- [x] `sitemap.xml` generated at build time from the posts, with `<lastmod>` and `hreflang` alternates
- [x] `robots.txt` points to the sitemap
- [ ] Register `rndm.chicovis.dev` in Search Console, add the verification meta tag and submit the sitemap

### 6. Go live (the step-by-step guide is kept locally in `docs/deploy.md`, git-ignored because it names the server)

Safe deploy, same idea as the other projects: GitHub logs into the server over SSH with a dedicated key and user; on the server that key can only run a root-owned script (forced command) that pulls the image we built on the GitHub runner. Done in the repository: `Dockerfile`, `nginx.conf` (tested with podman), `deploy/deploy-rndm.sh` (tested with a fake `docker`: healthy deploy, rollback, tag validation), `deploy/docker-compose.yml`, `ci.yml` and `deploy.yml`.

On the server and on GitHub (in this order):

- [ ] Server: install the script and the compose file root-owned, create the state folder, reuse the existing deploy user (private guide, step 1)
- [ ] Create the deploy key and add it to the deploy user's `authorized_keys`, bound to the forced command (step 2)
- [ ] GitHub: the four `RNDM_DEPLOY_*` secrets, optional `production` environment with reviewers (step 3)
- [ ] DNS: `rndm.chicovis.dev` pointing at the server
- [ ] Run **Deploy rndm** once, then make the `ghcr.io/rafaelkc/rndm` package public, and run it again (step 4)
- [ ] Nginx Proxy Manager: proxy host `rndm.chicovis.dev` → `rndm:80` (or the server's private IP and a published port if NPM runs on another VM), Let's Encrypt, Force SSL, HTTP/2
- [ ] Optional: add the `push` trigger to `deploy.yml` once manual deploys are known to be light on the server
- [ ] Optional: write a blog post about this setup (notes at the end of docs/deploy.md)
