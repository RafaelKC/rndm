import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGS } from './i18n/i18n.config';

/** Post ids are the folder names in `src/content/posts/`. */
function listPostIds(): string[] {
  return readdirSync(join(process.cwd(), 'src/content/posts'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Static prerender: every public route is rendered to HTML at build time.
 * Add each new public route here (with `getPrerenderParams` for dynamic segments).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang/post/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SUPPORTED_LANGS.flatMap((lang) => listPostIds().map((id) => ({ lang, id }))),
  },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SUPPORTED_LANGS.map((lang) => ({ lang })),
  },
  // `/` and unknown paths pick a language from the cookie/browser, so they stay client-rendered.
  { path: '**', renderMode: RenderMode.Client },
];
