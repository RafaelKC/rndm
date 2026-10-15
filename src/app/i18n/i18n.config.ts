import { Injectable, Provider } from '@angular/core';
import { TranslateLoader, TranslationObject, provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { en } from './en';
import { pt } from './pt';

export const SUPPORTED_LANGS = ['en', 'pt'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Per-language values for `<html lang>`, `hreflang` and `og:locale`. */
export const LANG_META: Record<Lang, { htmlLang: string; hreflang: string; ogLocale: string }> = {
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US' },
  pt: { htmlLang: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR' },
};

export function isLang(value: unknown): value is Lang {
  return SUPPORTED_LANGS.includes(value as Lang);
}

/** `/en/posts/x` + `pt` → `/pt/posts/x`. Query and fragment are dropped. */
export function withLang(url: string, lang: Lang): string {
  return `/${lang}${stripLang(url)}`;
}

/** `/en/posts/x?a=1` → `/posts/x`; `/en` → ``. */
export function stripLang(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
  return path.replace(/^\/(en|pt)(?=\/|$)/, '');
}

const DICTIONARIES: Record<Lang, TranslationObject> = { en, pt };

/** Dictionaries are bundled (no HTTP), so there is no flash of untranslated text. */
@Injectable()
class BundledTranslateLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(DICTIONARIES[isLang(lang) ? lang : DEFAULT_LANG]);
  }
}

export function provideI18n(): Provider[] {
  return provideTranslateService({
    lang: DEFAULT_LANG,
    fallbackLang: DEFAULT_LANG,
    loader: provideTranslateLoader(BundledTranslateLoader),
  });
}
