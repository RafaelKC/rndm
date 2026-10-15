import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { SeoPageData } from '../core/seo.service';
import { LanguageService } from '../core/language.service';
import { DEFAULT_LANG, Lang, isLang } from '../i18n/i18n.config';
import { localize } from '../i18n/localized';
import { renderMarkdown } from './markdown';
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
        map((markdown): PostPageData => {
          const post = toPost(id, manifest);
          return {
            post,
            contentLang,
            html: renderMarkdown(markdown, id),
            seo: {
              title: localize(post.title, contentLang) ?? '',
              description: localize(post.summary, contentLang) ?? '',
              image: post.imageUrl,
              type: 'article',
              lang: contentLang,
              alternateLangs: post.availableLangs,
              published: manifest.date,
            },
          };
        }),
      );
    }),
    catchError(() => of(notFound)),
  );
};
