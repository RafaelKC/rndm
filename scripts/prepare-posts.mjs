// Runs before `start`, `build` and `watch`. For every post it:
//   1. validates the manifest and the files it points to (fails the build with a clear message);
//   2. recomputes `wordCount` from the Markdown (so it never has to be maintained by hand);
// then writes
//   - src/content/posts/index.json (ids, newest first), loaded by the home list;
//   - public/sitemap.xml (home pages + posts, with hreflang alternates).
// With --production (used by `pnpm build`), posts with `"draft": true` are left out of both files;
// scripts/prune-drafts.mjs then removes their files from the build output.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { GUID, LANGS, POSTS_DIR, ROOT, SITE_URL, countWords, readPosts } from './posts-lib.mjs';

const hreflang = { en: 'en', pt: 'pt-BR' };
const production = process.argv.includes('--production');
const errors = [];
const allPosts = readPosts();

for (const { id, dir, manifestPath, manifest } of allPosts) {
  const fail = (message) => errors.push(`${id}: ${message}`);
  if (!GUID.test(id)) fail('the folder name must be a GUID');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.date ?? '')) fail('"date" must be YYYY-MM-DD');
  if (manifest.updated !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(manifest.updated)) fail('"updated" must be YYYY-MM-DD');
  if (manifest.draft !== undefined && typeof manifest.draft !== 'boolean') fail('"draft" must be true or false');
  if (!Array.isArray(manifest.availableLangs) || manifest.availableLangs.length === 0) {
    fail('"availableLangs" must list at least one language');
    continue;
  }
  if (!manifest.cover || !existsSync(join(dir, manifest.cover))) fail(`cover not found: ${manifest.cover}`);

  const wordCount = {};
  for (const lang of manifest.availableLangs) {
    if (!LANGS.includes(lang)) fail(`unknown language "${lang}"`);
    const file = join(dir, `${lang}.md`);
    if (!existsSync(file)) {
      fail(`${lang}.md is listed in "availableLangs" but does not exist`);
      continue;
    }
    for (const field of ['title', 'summary']) {
      if (!manifest[field]?.[lang]?.trim()) fail(`"${field}.${lang}" is empty`);
    }
    wordCount[lang] = countWords(readFileSync(file, 'utf8'));
  }
  if (JSON.stringify(manifest.wordCount) !== JSON.stringify(wordCount)) {
    manifest.wordCount = wordCount;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
}

if (errors.length) {
  console.error(`\nInvalid posts:\n${errors.map((e) => `  - ${e}`).join('\n')}\n`);
  process.exit(1);
}

// Drafts are visible while developing, but never published.
const posts = production ? allPosts.filter((p) => !p.manifest.draft) : allPosts;
const sorted = [...posts].sort((a, b) => b.manifest.date.localeCompare(a.manifest.date));
writeFileSync(join(POSTS_DIR, 'index.json'), JSON.stringify(sorted.map((p) => p.id), null, 2) + '\n');

const alternates = (langs, path) =>
  [
    ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${hreflang[l]}" href="${SITE_URL}/${l}${path}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${langs.includes('en') ? 'en' : langs[0]}${path}" />`,
  ].join('\n');

const entry = (lang, langs, path, lastmod) =>
  `  <url>\n    <loc>${SITE_URL}/${lang}${path}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}${alternates(langs, path)}\n  </url>`;

const urls = [
  ...LANGS.map((lang) => entry(lang, LANGS, '/')),
  ...sorted.flatMap(({ id, manifest }) =>
    manifest.availableLangs.map((lang) => entry(lang, manifest.availableLangs, `/post/${id}`, manifest.updated ?? manifest.date)),
  ),
];
writeFileSync(
  join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);

const drafts = allPosts.length - posts.length;
console.log(`posts: ${posts.length} post(s)${drafts ? `, ${drafts} draft(s) left out` : ''}, index.json and sitemap.xml updated`);
