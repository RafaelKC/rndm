import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, merge } from 'rxjs';
import { DEFAULT_LANG, LANG_META, Lang, SUPPORTED_LANGS, stripLang } from '../i18n/i18n.config';
import { LanguageService } from './language.service';

export const SITE_URL = 'https://rndm.chicovis.dev';
const DEFAULT_IMAGE = 'https://chicovis.dev/og-image.jpg';
const AUTHOR = 'Rafael Chicovis';

/**
 * SEO data for a page whose content comes from a resolver. Put it in the resolved route data
 * as `page.seo` (see `postResolver`). Texts must already be in `lang`, the language of the content.
 */
export interface SeoPageData {
  title: string;
  description: string;
  /** Site-relative (`/posts/...`) or absolute URL. */
  image?: string;
  type?: 'website' | 'article';
  /** Language of the content; the canonical points to this language's URL. */
  lang: Lang;
  /** Languages the page exists in; only these get `hreflang` alternates. */
  alternateLangs: Lang[];
  /** `YYYY-MM-DD`, for articles. */
  published?: string;
}

/**
 * Per-route SEO, translated. A route either sets `data: { titleKey, descriptionKey }` (translation keys),
 * or resolves `page.seo` (`SeoPageData`) for content-driven pages, or falls back to the site defaults.
 * Always emits `canonical`, the `hreflang` alternates that tie each language version together, and,
 * for articles, a `BlogPosting` JSON-LD with `inLanguage`.
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
    const page: SeoPageData | undefined = route.data['page']?.seo;
    const uiLang = this.languages.lang();
    const lang = page?.lang ?? uiLang;
    const alternates = page?.alternateLangs ?? [...SUPPORTED_LANGS];
    const rest = stripLang(this.router.url);

    let title: string;
    let description: string;
    if (page) {
      title = `${page.title} | ${AUTHOR}`;
      description = page.description;
    } else {
      const titleKey: string | undefined = route.data['titleKey'];
      title = titleKey ? `${this.translate.instant(titleKey)} | ${AUTHOR}` : this.translate.instant('seo.title');
      description = this.translate.instant(route.data['descriptionKey'] ?? 'seo.description');
    }
    const url = this.pageUrl(lang, rest);
    const image = this.absolute(page?.image ?? DEFAULT_IMAGE);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: page?.type ?? 'website' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: LANG_META[lang].ogLocale });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    if (page?.published) {
      this.meta.updateTag({ property: 'article:published_time', content: page.published });
    } else {
      this.meta.removeTag('property="article:published_time"');
    }

    this.setCanonical(url);
    this.setAlternates(alternates, lang, rest);
    this.setJsonLd(page, url, image, description);
  }

  private pageUrl(lang: Lang, rest: string): string {
    return `${SITE_URL}/${lang}${rest}${rest ? '' : '/'}`;
  }

  private absolute(url: string): string {
    return url.startsWith('/') ? SITE_URL + url : url;
  }

  private setCanonical(href: string): void {
    this.upsertLink('link[rel="canonical"]', { rel: 'canonical', href });
  }

  /** Replaces all `hreflang` alternates, so a page never keeps those of the previous one. */
  private setAlternates(langs: Lang[], contentLang: Lang, rest: string): void {
    this.doc.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => l.remove());
    for (const l of langs) {
      this.addLink({ rel: 'alternate', hreflang: LANG_META[l].hreflang, href: this.pageUrl(l, rest) });
    }
    const defaultLang = langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : contentLang;
    this.addLink({ rel: 'alternate', hreflang: 'x-default', href: this.pageUrl(defaultLang, rest) });
  }

  /** Article structured data; removed on pages that are not articles. */
  private setJsonLd(page: SeoPageData | undefined, url: string, image: string, description: string): void {
    const id = 'seo-jsonld';
    this.doc.getElementById(id)?.remove();
    if (page?.type !== 'article') return;

    const script = this.doc.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: page.title,
      description,
      image,
      url,
      mainEntityOfPage: url,
      inLanguage: LANG_META[page.lang].htmlLang,
      datePublished: page.published,
      author: { '@id': 'https://chicovis.dev/#person' },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    });
    this.doc.head.appendChild(script);
  }

  private upsertLink(selector: string, attrs: Record<string, string>): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.doc.createElement('link');
      this.doc.head.appendChild(link);
    }
    for (const [name, value] of Object.entries(attrs)) link.setAttribute(name, value);
  }

  private addLink(attrs: Record<string, string>): void {
    const link = this.doc.createElement('link');
    for (const [name, value] of Object.entries(attrs)) link.setAttribute(name, value);
    this.doc.head.appendChild(link);
  }

  private leaf(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
