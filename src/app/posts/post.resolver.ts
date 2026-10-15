import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { SeoPageData } from '../core/seo.service';
import { LanguageService } from '../core/language.service';
import { DEFAULT_LANG, Lang, isLang } from '../i18n/i18n.config';
import { localize } from '../i18n/localized';
import { GUID_PATTERN, Post, PostManifest, pickContentLang, postBaseUrl, toPost } from './post.model';

export interface PostPageData {
  post: Post;
  /** Language of the Markdown that was loaded (may differ from the page language). */
  contentLang: Lang;
  html: string;
  seo: SeoPageData;
}

/** Loads the manifest and the Markdown for the route's language (or the only one available). */
export const postResolver: ResolveFn<PostPageData | RedirectCommand> = (route) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const languages = inject(LanguageService);

  const routeLang = route.paramMap.get('lang');
  const lang = isLang(routeLang) ? routeLang : languages.lang();
  const id = route.paramMap.get('id') ?? '';
  const notFound = new RedirectCommand(router.createUrlTree(['/', lang]));

  if (!GUID_PATTERN.test(id)) return notFound;

  return http.get<PostManifest>(`${postBaseUrl(id)}/manifest.json`).pipe(
    switchMap((manifest) => {
      const contentLang = pickContentLang(manifest.availableLangs, lang, DEFAULT_LANG);
      return http.get(`${postBaseUrl(id)}/${contentLang}.md`, { responseType: 'text' }).pipe(
        // Lazy: the renderer (marked + highlight.js) is only needed on the post page.
        switchMap((markdown) => from(import('./markdown').then((m) => m.renderMarkdown(markdown, id)))),
        map((html): PostPageData => {
          const post = toPost(id, manifest);
          return {
            post,
            contentLang,
            html,
            seo: {
              title: localize(post.title, contentLang) ?? '',
              description: localize(post.summary, contentLang) ?? '',
              image: post.imageUrl,
              type: 'article',
              lang: contentLang,
              alternateLangs: post.availableLangs,
              published: manifest.date,
              modified: manifest.updated,
            },
          };
        }),
      );
    }),
    catchError(() => of(notFound)),
  );
};
