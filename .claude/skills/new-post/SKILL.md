---
name: new-post
description: Create a new blog post for rndm.chicovis.dev. Use when the user wants to write, add or draft a post (review of a movie, series, game or book, a software note, anything), or runs /new-post. Creates the post folder in src/content/posts (manifest.json, en.md/pt.md, assets/) from the templates, writes the content in the right languages and validates it.
argument-hint: "[topic or notes for the post]"
---

# New post

Creates a post in `src/content/posts/<guid>/`. Read the example post first to see the end result:
`src/content/posts/8bb0a6ea-2834-4698-99cf-7ed3d7f1e3a3/`.

## What each thing is

```
src/content/posts/<guid>/
  manifest.json   metadata: title, summary, cover, tags, date, wordCount, availableLangs
  en.md           the post in English   (only the languages listed in availableLangs)
  pt.md           the post in Portuguese
  assets/         every image/file the post uses (the cover too)
```

| Where | What it is |
| --- | --- |
| folder name | The post id and its URL: `/<lang>/post/<guid>`. Always a new GUID (v4). Never rename it later (it breaks links). |
| `manifest.json` → `title` | Title per language. Shown on the card and as the page `h1`. Do not repeat it inside the `.md`. |
| `manifest.json` → `summary` | 1–2 sentences (~155 chars) per language. Shown on the home card **and used as the SEO/Open Graph description**. |
| `manifest.json` → `cover` | Image path relative to the post folder, e.g. `assets/cover.jpg`. Raster (jpg/png/webp), ideally 1200×630: it is the card image, the page banner and the `og:image` for link previews. |
| `manifest.json` → `tags` | List of `{ "en": "...", "pt": "..." }`. Short labels saying what the post is (Movie, Game, Book, Series, Software...). Same tag, both translations. |
| `manifest.json` → `date` | `YYYY-MM-DD`. Sorts the list and is the publication date in SEO. Optional `updated` (same format) after editing a published post; it becomes the sitemap `lastmod`. |
| `manifest.json` → `wordCount` | Leave `{}`: it is computed from the `.md` files by `pnpm posts` (runs automatically on `pnpm start`/`build`). |
| `manifest.json` → `availableLangs` | Languages that have a `.md` file, e.g. `["pt","en"]`. A post in one language only is fine: visitors in the other language get it with a notice. |
| `<lang>.md` | The body, in Markdown. See the rules below. |
| `assets/` | Put images here and reference them as `assets/<file>`; they are published at `/posts/<guid>/assets/<file>`. |

Every descriptive string (`title`, `summary`, tags) is a `{ "en": "...", "pt": "..." }` object. Keys must match `availableLangs`.

## Steps

1. **Collect the input** from the user's message (`$ARGUMENTS`) or ask for what is missing, in one short question:
   - the topic and the main points/opinions (for a review: what it is, what they liked, what they didn't, verdict);
   - languages: `en`, `pt` or both (default: both; if both, write each version natively, not a literal translation);
   - tags (suggest 2–3 that fit: type of media + Review, etc.);
   - date (default: today) and cover (a URL or a file path; if none, use a sample photo).
2. **Create the folder** with a new GUID: `node -e "console.log(crypto.randomUUID())"`, then `mkdir -p src/content/posts/<guid>/assets`.
3. **Cover**: copy the user's file into `assets/`, or download it (`curl -sL -o assets/cover.jpg <url>`). With no cover given, use a sample photo: `https://picsum.photos/seed/<any-word>/1200/630`. Look at the image to make sure it downloaded (a real JPG, not an error page). Keep the `cover` path in the manifest in sync with the file name/extension.
4. **Manifest**: start from `templates/manifest.json` (next to this file), fill in title, summary, tags, date, cover and `availableLangs`. Leave `wordCount` as `{}`.
5. **Content**: start from `templates/post.<lang>.md` for each language, write the real post, and **delete the guide comment at the top**.
6. **Validate**: run `pnpm posts`. It checks the manifest and files, fills `wordCount`, regenerates `src/content/posts/index.json` (git-ignored) and `public/sitemap.xml`. Fix any error it prints and rerun until it passes.
7. **Report** to the user: the post folder, the URLs (`/en/post/<guid>` and/or `/pt/post/<guid>`) and how to preview it (`pnpm start`; restart it so the new post shows up on the home). Mention that `public/sitemap.xml` changed and should be committed with the post. Do **not** commit or push unless asked.

## Writing rules (the `.md` files)

- **Do not write the title** in the Markdown; it comes from the manifest and is the page `h1`.
- **Start headings at `##`** (then `###`); never skip a level and never use `#`.
- **Images**: `![meaningful alt text](assets/file.jpg)`. `alt` is required (accessibility); use `alt=""` only for purely decorative images. Prefer to also give `width`/`height` when using raw `<img>`.
- **Raw HTML is allowed in the middle of the Markdown**: `details`/`summary`, `kbd`, `mark`, `figure`/`figcaption`, `table`, `video`, `audio`, `sup`/`sub`, etc. Angular sanitizes it: `<script>`, `<iframe>`, `style="..."` and `on*="..."` are removed. Leave a blank line around HTML blocks so Markdown keeps working around them.
- **Links**: descriptive text (never "click here"); external links as full `https://` URLs.
- **Code**: fenced blocks with a language (` ```ts `), inline code with backticks.
- **Review posts** work best as: a spoiler-free opening, what worked, what didn't, verdict. Add a spoiler warning before spoilers (a `<details>` is a good way to hide them).
- Write in the author's voice: direct and plain, no filler or marketing tone.
- Everything user-visible stays in the post language; instructions and code comments in this repo stay in English.

## Things to remember

- The same post in both languages must keep the same structure (sections in the same order) and the same images.
- Rename nothing after publishing: the folder name is the URL.
- To edit a published post: change the `.md`, set `updated` in the manifest, rerun `pnpm posts`.
- The page, SEO (translated title/description/Open Graph, `hreflang`, `BlogPosting` JSON-LD) and prerender are automatic: nothing else needs to be configured per post.
