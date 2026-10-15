# rndm.chicovis.dev

Personal blog "Random | Rafael Chicovis" (Angular 22, standalone components, signals, plain CSS, ngx-translate). It is the sibling of the personal site **chicovis.dev** (Astro project in `../rkc`) and must look like the same product: same colors, fonts, icons, header and footer. When in doubt about visuals, check the `<style>` block in `../rkc/src/components/PortfolioContent.astro` and follow it.

## Language conventions

- **Everything in the repo is written in English**: code, identifiers, component names, comments, commit messages, Markdown files (this one included), default texts.
- **User-facing content is localized** to `en` (default) and `pt` (pt-BR). Never hardcode visible text, `aria-label`, `alt` or SEO text in a template or component; add a key to `src/app/i18n/en.ts` **and** `pt.ts` (`pt` is typed against `en`, so a missing key fails the build) and use `{{ 'key' | translate }}`.

## General rules

- **No Tailwind** or any other CSS framework. Styling = tokens + utility/component classes in `src/styles.css` + per-component CSS.
- Never write a raw color, radius, spacing or font (`#ff6b00`, `12px`, `Inter`) in a component. Use tokens. If one is missing, add it to `styles.css` (for both themes, if it is a color).
- Before creating a new class, check whether `styles.css` already has one.
- Standalone components, `inject()`, `signal`/`computed`. One component per folder (`.ts`, `.html`, `.css`). Layout in `src/app/layout/`, cross-cutting services in `src/app/core/`, translations in `src/app/i18n/`.
- No SSR/prerender yet. Base SEO lives in `src/index.html` and per-route SEO in `SeoService`.

## Internationalization (i18n)

- Library: `@ngx-translate/core`. Dictionaries are TypeScript objects bundled in the app (`i18n/en.ts`, `i18n/pt.ts`), loaded synchronously, no HTTP request, no flash of untranslated text. Config: `i18n/i18n.config.ts` (`provideI18n()`, `SUPPORTED_LANGS`, `DEFAULT_LANG`, `LANG_META`, `withLang`, `stripLang`).
- **The language is part of the route**: `/en/...` and `/pt/...`. Each version has its own URL, which is what Google indexes. Child routes go under `:lang` in `app.routes.ts`.
- `/` (and unknown paths) redirect to a language: **saved choice (cookie `lang`) → browser language (`navigator.languages`) → `en`**. See `core/language.guards.ts`.
- `LanguageService.apply()` sets the route's language (translations + `<html lang>`) and does **not** persist. `remember()` saves the cookie and is called only when the user clicks the language badge. A crawler or a shared link is not a user choice.
- The header badge (`EN`/`PT`, like chicovis.dev) links to the same page in the other language.
- Cookies: `theme` (`dark|light`) and `lang` (`en|pt`), both first-party, `Path=/`, `Max-Age` 1 year, `SameSite=Lax` (+ `Secure` on HTTPS), written by `CookieService`. On `chicovis.dev` and its subdomains they are written with `Domain=.chicovis.dev`, so they are **shared with the personal site** (same names, values and attributes on both sides; `Domain` is omitted on `localhost`). They are user-requested preferences, with no tracking and no third parties, so **no consent banner is needed**. If analytics, ads or any tracking are ever added, a consent banner (LGPD/GDPR) becomes mandatory first. Googlebot ignores cookies; it relies on the language in the URL.

## Design system

Single source of truth: `src/styles.css`.

### Theme (dark / light)

- `data-theme="dark|light"` on `<html>`. Default: system preference; the user's choice is saved in the `theme` cookie.
- The inline script in `index.html` applies the theme before first paint (no flash). Do not remove it.
- `ThemeService` (`core/theme.service.ts`) toggles and persists. Do not touch `data-theme` anywhere else.
- Every component must work in both themes using only tokens. Never use `@media (prefers-color-scheme)` in a component.

### Tokens

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--bg-dark` | `#0a0a0a` | `#ffffff` | page background, cards |
| `--bg-light` | `#111111` | `#f4f4f5` | alternate sections, inputs |
| `--accent` | `#ff6b00` | `#e65a00` | highlights, active links, logo |
| `--accent-hover` | `#e65a00` | `#cc5000` | accent hover |
| `--accent-soft` | 10% accent | 10% accent | tag background |
| `--text-dim` | `#cbd5e1` | `#3f3f46` | body text |
| `--white` | `#f8fafc` | `#18181b` | headings, high-contrast text (inverts in light!) |
| `--border` | `#262626` | `#d4d4d8` | borders and dividers |
| `--navbar-bg` | `rgba(10,10,10,.95)` | `rgba(255,255,255,.95)` | header |
| `--on-accent` | `#fff` | `#fff` | text on accent background |

Theme-independent: fonts `--font-sans` (Inter) and `--font-mono` (Fira Code); radii `--radius-sm|md|lg|full` (4/6/12/9999px); spacing `--space-1…10`; `--container` (1000px), `--header-px/py`; `--transition`; `--z-header`, `--z-skip`.

Typography: Inter for everything (weights 400/700/800), Fira Code for section numbers and dates. The "rndm.chicovis.dev" logo is Inter 800, 1.1rem, `--accent`.

### Available classes

Layout: `.container`, `.stack`, `.row`, `.row-wrap`, `.surface`, `.bordered`.
Text: `.accent`, `.text-white`, `.text-dim`, `.font-mono`, `.sr-only`.
Components: `.btn` + `.btn-primary` / `.btn-outline` / `.btn-block`, `.icon-link`, `.icon-btn`, `.badge`, `.tag`, `.tag-pill`, `.card`, `.section-header` (+ `.number`), `.form-group`, `.skip-link`.

### Icons

Tabler Icons webfont (`@tabler/icons-webfont`, imported in `styles.css`), same as chicovis.dev. Usage: `<i class="ti ti-name" aria-hidden="true"></i>`. An icon on its own needs an accessible label on its parent (`aria-label`); an icon next to text is decorative.

### Header and footer

- Fixed header with blur: logo on the left (link to the current language's home); on the right, a "Site" link to `https://chicovis.dev` (new tab, with `sr-only` text announcing it), the theme toggle and the language badge. No section links.
- Footer: "© {year} Rafael Chicovis. {rights}", centered, 0.7rem, opacity 0.6.
- `Shell` renders: skip-link → header → `<main id="main-content">` (each page renders its own `h1`) → footer, with the footer always at the bottom of the viewport.

## Accessibility (top priority)

Goal: WCAG 2.2 AA on every screen, in both themes and both languages.

- Semantic HTML: one `<h1>` per page, no skipped heading levels, landmarks (`header`, `nav`, `main`, `footer`, `article`, titled `section`). `<button>` for actions, `<a>` for navigation. Never a clickable `div`.
- Everything keyboard-operable with a logical focus order. Focus always visible (global `:focus-visible` outline in `--accent`); never `outline: none` without a replacement.
- Contrast at least 4.5:1 for text (3:1 for large text and UI components). Use the existing token pairs; check any new combination in both themes.
- Images: descriptive `alt`; decorative ones `alt=""`. Always `width`/`height` to avoid layout shift.
- Forms: `<label for>` on every field, text error messages (not color alone) linked with `aria-describedby`, correct `autocomplete`.
- Links opening in a new tab: `rel="noopener noreferrer"` plus a screen-reader notice. Link text must make sense out of context.
- Respect `prefers-reduced-motion` (global rule exists; new animations must honor it). Nothing that flashes.
- `<html lang>` always matches the page language (`LanguageService` keeps it in sync); mark foreign-language snippets with `lang`.
- Responsive with no horizontal scroll from 320px; text resizable to 200%; touch targets ≥ 24×24px (44px preferred).
- `aria-*` only when native HTML cannot do it; no `aria-label` that duplicates visible text. Important dynamic content uses `aria-live`.
- Never rely on color alone to convey information.

## SEO (as good as possible)

- `src/index.html` defines the static defaults (English): `lang`, `title`, `description`, `author`, `robots`, `canonical`, `theme-color` (dark/light), Open Graph, Twitter Card (image `https://chicovis.dev/og-image.jpg`, same as the personal site), JSON-LD (`WebSite` + `Person`, sharing the `@id` with chicovis.dev) and `<noscript>`.
- `SeoService` (`core/seo.service.ts`) updates on every navigation and language change: `title`, `description`, `og:*`, `og:locale`, `twitter:*`, `canonical`, and the **`hreflang` alternates** (`en`, `pt-BR`, `x-default` → `/en/`) so Google knows `/en/x` and `/pt/x` are the same page in two languages. Each language version's canonical points to itself (never to the other language).
- Route SEO is set with translation keys:
  ```ts
  { path: 'posts/:slug', component: Post, data: { titleKey: 'post.title', descriptionKey: 'post.description' } }
  ```
  Every route needs a unique title and description (~155 chars) in both languages. Title format: `"Page | Rafael Chicovis"`.
- `public/robots.txt` and `public/sitemap.xml` (domain `https://rndm.chicovis.dev`). **Every new public route goes in `sitemap.xml`** for both languages, with `xhtml:link` alternates (and `<lastmod>` for posts).
- Posts: JSON-LD `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author` → the Person `@id`, `image`, `inLanguage`) and `og:type=article`.
- Clean, stable, lowercase URLs, with a trailing slash only on the language home (`/en/`). One canonical URL per piece of content. Missing pages show a friendly 404 (not built yet; for now they redirect).
- Performance is SEO (Core Web Vitals): fonts with `display=swap` and `preconnect`, images with dimensions and `loading="lazy"` below the fold, lazy-loaded routes (`loadComponent`), no heavy dependencies.
- Current limitation: the app is client-side rendered. Once there is real content (posts), **add prerender/SSR** (`ng add @angular/ssr`, `outputMode: static`) so crawlers and link previews get full HTML in the right language. Do it before publishing the first post. Static hosting must also serve `index.html` for `/en/*` and `/pt/*`.
- Pending: the chicovis.dev `google-site-verification` does not apply to the subdomain; register `rndm.chicovis.dev` in Search Console and add its own meta tag.

## Commands

- `pnpm start`: dev server (`ng serve`). Restart it after editing `angular.json`.
- `pnpm build`: production build.
- `pnpm test`: tests (Vitest).
- Package manager: **pnpm** (never npm or yarn; do not commit `package-lock.json`). Install with `pnpm install`, add dependencies with `pnpm add`. Native build scripts are allowed in `pnpm-workspace.yaml`.
- Requires Node ≥ 24.15 (or ≥ 22.22.3).

## Checklist before finishing a change

1. Only design-system tokens/classes; no raw values.
2. Works with adequate contrast in dark and light.
3. Keyboard-navigable, visible focus, correct labels.
4. No hardcoded visible text: keys added to both `en.ts` and `pt.ts`.
5. New route: `titleKey`/`descriptionKey` on the route + entries in `sitemap.xml` for both languages.
6. Build and tests pass.
