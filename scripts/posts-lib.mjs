// Shared helpers for the post scripts (prepare-posts.mjs).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = join(import.meta.dirname, '..');
export const POSTS_DIR = join(ROOT, 'src/content/posts');
export const LANGS = ['en', 'pt'];
export const SITE_URL = 'https://rndm.chicovis.dev';
export const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Words in a Markdown file, ignoring code blocks, HTML tags and Markdown symbols. */
export function countWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*`|!\[\]()\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Every post folder (folders that have a manifest.json), with its parsed manifest. */
export function readPosts() {
  return readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(POSTS_DIR, entry.name, 'manifest.json')))
    .map((entry) => {
      const dir = join(POSTS_DIR, entry.name);
      const manifestPath = join(dir, 'manifest.json');
      return { id: entry.name, dir, manifestPath, manifest: JSON.parse(readFileSync(manifestPath, 'utf8')) };
    });
}
