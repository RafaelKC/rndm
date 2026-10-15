import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGS } from './i18n/i18n.config';

/**
 * Static prerender: every language home is rendered to HTML at build time.
 * Add each new public route here (with `getPrerenderParams` for dynamic segments such as post slugs).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SUPPORTED_LANGS.map((lang) => ({ lang })),
  },
  // `/` and unknown paths pick a language from the cookie/browser, so they stay client-rendered.
  { path: '**', renderMode: RenderMode.Client },
];
