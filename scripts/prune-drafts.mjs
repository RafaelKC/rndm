// Runs after `ng build`: removes the files of posts marked `"draft": true` from the build output,
// since the assets glob copies every post folder.
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, readPosts } from './posts-lib.mjs';

const output = join(ROOT, 'dist/rndm/browser/posts');
let removed = 0;
for (const { id, manifest } of readPosts()) {
  const target = join(output, id);
  if (manifest.draft && existsSync(target)) {
    rmSync(target, { recursive: true });
    removed++;
  }
}
console.log(`prune-drafts: ${removed} draft(s) removed from the build output`);
