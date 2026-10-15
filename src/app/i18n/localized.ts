import { DEFAULT_LANG, Lang, SUPPORTED_LANGS } from './i18n.config';

/** Content that may exist in only some languages, e.g. `{ en: 'Movie', pt: 'Filme' }`. */
export type Localized<T = string> = Partial<Record<Lang, T>>;

/** Picks the value for `lang`, falling back to the default language, then to any available one. */
export function localize<T>(value: Localized<T>, lang: Lang): T | undefined {
  return value[lang] ?? value[DEFAULT_LANG] ?? SUPPORTED_LANGS.map((l) => value[l]).find((v) => v !== undefined);
}
