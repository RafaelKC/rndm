import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, LANG_META, Lang, SUPPORTED_LANGS, isLang } from '../i18n/i18n.config';
import { CookieService } from './cookie.service';

const COOKIE_NAME = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly cookies = inject(CookieService);
  private readonly doc = inject(DOCUMENT);

  /** The language of the current route. */
  readonly lang = signal<Lang>(DEFAULT_LANG);

  /** Saved choice → browser language → default (`en`). Used only to pick a route for `/`. */
  detect(): Lang {
    const saved = this.cookies.get(COOKIE_NAME);
    if (isLang(saved)) return saved;

    const browser = (this.doc.defaultView?.navigator.languages ?? [])
      .map((l) => l.toLowerCase().split('-')[0])
      .find((l): l is Lang => SUPPORTED_LANGS.includes(l as Lang));
    return browser ?? DEFAULT_LANG;
  }

  /** Applies the language of the route. Does not persist (a crawler or shared link is not a choice). */
  apply(lang: Lang): void {
    this.lang.set(lang);
    this.translate.use(lang).subscribe();
    this.doc.documentElement.lang = LANG_META[lang].htmlLang;
  }

  /** Persists an explicit user choice. */
  remember(lang: Lang): void {
    this.cookies.set(COOKIE_NAME, lang);
  }
}
