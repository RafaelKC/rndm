import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, merge } from 'rxjs';
import { DEFAULT_LANG, LANG_META, Lang, SUPPORTED_LANGS, stripLang } from '../i18n/i18n.config';
import { LanguageService } from './language.service';

export const SITE_URL = 'https://rndm.chicovis.dev';

/**
 * Per-route SEO. A route may set `data: { titleKey, descriptionKey }` (translation keys);
 * otherwise the site defaults (`seo.title`, `seo.description`) are used.
 * Also emits `canonical` and the `hreflang` alternates that tie each language version together.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly languages = inject(LanguageService);

  init(): void {
    merge(
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
      this.translate.onLangChange,
    ).subscribe(() => this.update(this.leaf(this.router.routerState.snapshot.root)));
  }

  private update(route: ActivatedRouteSnapshot): void {
    const lang = this.languages.lang();
    const titleKey: string | undefined = route.data['titleKey'];
    const descriptionKey: string = route.data['descriptionKey'] ?? 'seo.description';
    const siteTitle = this.translate.instant('seo.title');
    const title = titleKey ? `${this.translate.instant(titleKey)} | Rafael Chicovis` : siteTitle;
    const description = this.translate.instant(descriptionKey);
    const rest = stripLang(this.router.url);
    const url = this.pageUrl(lang, rest);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: LANG_META[lang].ogLocale });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    this.setLink('canonical', url);
    for (const l of SUPPORTED_LANGS) {
      this.setLink('alternate', this.pageUrl(l, rest), LANG_META[l].hreflang);
    }
    this.setLink('alternate', this.pageUrl(DEFAULT_LANG, rest), 'x-default');
  }

  private pageUrl(lang: Lang, rest: string): string {
    return `${SITE_URL}/${lang}${rest}${rest ? '' : '/'}`;
  }

  /** Creates or updates `<link rel=... [hreflang=...]>` in the head. */
  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  private leaf(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
