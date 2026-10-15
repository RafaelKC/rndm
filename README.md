<div align="center">

🇺🇸 English | [🇧🇷 Português](README.pt-BR.md)

# rndm

**The source code of [rndm.chicovis.dev](https://rndm.chicovis.dev)**, "Random | Rafael Chicovis":<br>
a personal blog for notes, experiments and reviews of movies, series, games and books.

It is the sibling of my personal site, [chicovis.dev](https://chicovis.dev), and shares its look and feel.

</div>

## Screenshots

<!--
  When there are posts, add the images to docs/screenshots/ and replace the placeholders below, e.g.:
  <img src="docs/screenshots/home-dark.png" alt="Home with the post list, dark theme" width="100%">
-->

| Home | Post page |
| :---: | :---: |
| _Screenshot coming soon_ | _Screenshot coming soon_ |

| Dark theme | Light theme |
| :---: | :---: |
| _Screenshot coming soon_ | _Screenshot coming soon_ |

## Features

- **Bilingual** (`en` default, `pt`): the language is part of the URL (`/en/...`, `/pt/...`), with `hreflang` alternates so search engines pair the versions.
- **Dark and light themes**, saved in a cookie shared with chicovis.dev.
- **Posts in Markdown**, one folder per post and one file per language, with raw HTML allowed in the middle of the text. A post in a single language is shown to everyone, with a notice.
- **Static prerender**: every page is generated as full HTML at build time, with no Node server in production.
- **SEO**: translated `title`, `description` and Open Graph per page, canonical URLs, `BlogPosting` JSON-LD, and a `sitemap.xml` generated from the posts.
- **Accessibility first**: semantic HTML, keyboard navigation, visible focus, WCAG 2.2 AA contrast, reduced-motion support.
- **No CSS framework**: a small design system (tokens and classes) copied from the personal site.

## Stack

- [Angular](https://angular.dev) 22: standalone components, signals, static prerender with `@angular/ssr`
- [ngx-translate](https://github.com/ngx-translate/core) for the interface texts
- [marked](https://marked.js.org) to render the posts
- Plain CSS with design tokens, [Tabler Icons](https://tabler.io/icons) webfont, Inter and Fira Code fonts
- [pnpm](https://pnpm.io), [Vitest](https://vitest.dev)

## Getting started

Requires Node ≥ 24.15 (or ≥ 22.22.3) and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm start       # dev server at http://localhost:4200
pnpm build       # production build; static site in dist/rndm/browser/
pnpm test        # unit tests (Vitest)
pnpm posts       # validate the posts and regenerate the post index and sitemap
```

Always use the pnpm scripts (not bare `ng serve`/`ng build`): they run `pnpm posts` first.

## Writing a post

Each post is a folder in `src/content/posts/<guid>/`:

```
<guid>/
  manifest.json   # title, summary, cover, tags, date, availableLangs (per-language texts)
  en.md           # the post in English
  pt.md           # the post in Portuguese
  assets/         # cover and images, referenced from the Markdown as assets/<file>
```

The easiest way to create one is the **`/new-post` skill** for [Claude Code](https://claude.com/claude-code) (`.claude/skills/new-post/`): it explains every file and field, uses the templates, creates the folder and validates it. A new post needs nothing else: the page, the SEO, the prerender and the sitemap entry are automatic.

## Project structure

```
src/
  styles.css          # design tokens, themes, utility and component classes
  index.html          # base SEO, JSON-LD, theme bootstrap
  app/
    core/             # theme, language, cookie and SEO services, route guards
    i18n/             # en/pt dictionaries and ngx-translate setup
    layout/           # header and footer
    pages/            # home and post pages
    posts/            # post model, Markdown rendering, resolver, list and card
    shell/            # page layout
  content/posts/      # the posts (Markdown)
scripts/              # post validation, post index and sitemap generation
.claude/skills/       # the /new-post skill
public/               # robots.txt, sitemap.xml (generated), favicon
```

## Conventions

- Everything in the repository is written in English (code, comments, docs); user-facing text is localized in `src/app/i18n`. The only exception is [README.pt-BR.md](README.pt-BR.md).
- Styling uses only the tokens and classes in `src/styles.css`.
- Accessibility and SEO are first-class requirements.

See [CLAUDE.md](CLAUDE.md) for the full design-system, accessibility and SEO guidelines, and [ROADMAP.md](ROADMAP.md) for the step-by-step plan.
