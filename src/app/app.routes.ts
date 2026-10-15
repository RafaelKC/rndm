import { Routes } from '@angular/router';
import { langGuard, notFoundGuard, rootRedirectGuard } from './core/language.guards';
import { postResolver } from './posts/post.resolver';

/**
 * Language lives in the URL (`/en/...`, `/pt/...`) so each version has its own crawlable address.
 * Child routes go under `:lang`. SEO: give static pages `data: { titleKey, descriptionKey }`; content-driven
 * pages resolve `page.seo` (see `SeoPageData`).
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [rootRedirectGuard], children: [] },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      {
        path: 'post/:id',
        resolve: { page: postResolver },
        loadComponent: () => import('./pages/post/post').then((m) => m.PostPage),
      },
    ],
  },
  { path: '**', canActivate: [notFoundGuard], children: [] },
];
