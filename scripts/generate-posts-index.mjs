// Writes src/content/posts/index.json: the post ids, newest first, read from each manifest.json.
// The home list loads this file at runtime. Runs before `start`, `build` and `watch`.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = join(import.meta.dirname, '../src/content/posts');

const posts = readdirSync(postsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(postsDir, entry.name, 'manifest.json')))
  .map((entry) => ({
    id: entry.name,
    date: JSON.parse(readFileSync(join(postsDir, entry.name, 'manifest.json'), 'utf8')).date,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

writeFileSync(join(postsDir, 'index.json'), JSON.stringify(posts.map((p) => p.id), null, 2) + '\n');
console.log(`posts index: ${posts.length} post(s)`);
