# rndm

Source code of **[rndm.chicovis.dev](https://rndm.chicovis.dev)**, "Random | Rafael Chicovis": a personal blog for posting all sorts of things. It is the sibling of my personal site, [chicovis.dev](https://chicovis.dev), and shares its look and feel.

## Stack

- [Angular](https://angular.dev) 22 (standalone components, signals)
- Plain CSS with design tokens and utility classes (no CSS framework), dark/light themes
- [ngx-translate](https://github.com/ngx-translate/core): `en` (default) and `pt`, language in the route (`/en/...`, `/pt/...`)
- [Tabler Icons](https://tabler.io/icons) webfont, Inter and Fira Code fonts

## Getting started

Requires Node ≥ 24.15 (or ≥ 22.22.3).

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build in dist/
npm test         # unit tests (Vitest)
```

## Project structure

```
src/
  styles.css        # design tokens, themes, utility and component classes
  index.html        # base SEO, JSON-LD, theme bootstrap
  app/
    core/           # theme, language, cookie and SEO services, route guards
    i18n/           # en/pt dictionaries and ngx-translate setup
    layout/         # header and footer
    shell/          # page layout
public/             # robots.txt, sitemap.xml, favicon
```

## Conventions

- Everything in the repo is written in English; user-facing text is localized in `src/app/i18n`.
- Styling uses only the tokens and classes in `src/styles.css`.
- Accessibility (WCAG 2.2 AA) and SEO are first-class requirements.

See [CLAUDE.md](CLAUDE.md) for the full design-system, accessibility and SEO guidelines, and [ROADMAP.md](ROADMAP.md) for the step-by-step plan.
