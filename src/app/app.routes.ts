import { Routes } from '@angular/router';
import { langGuard, notFoundGuard, rootRedirectGuard } from './core/language.guards';

/**
 * Language lives in the URL (`/en/...`, `/pt/...`) so each version has its own crawlable address.
 * Child routes go under `:lang`; give each one `data: { titleKey, descriptionKey }` for SEO.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [rootRedirectGuard], children: [] },
  { path: ':lang', canActivate: [langGuard], children: [] },
  { path: '**', canActivate: [notFoundGuard], children: [] },
];
