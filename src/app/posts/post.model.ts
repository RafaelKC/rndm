import { Lang, LANG_META } from '../i18n/i18n.config';
import { Localized } from '../i18n/localized';

/** Shape of `src/content/posts/<id>/manifest.json`. The folder name is the post id (a GUID). */
export interface PostManifest {
  title: Localized;
  summary: Localized;
  /** Path relative to the post folder, e.g. `assets/cover.png`. */
  cover: string;
  /** Free-form labels hinting at what the post is about (movie, game, book, software...). */
  tags: Localized[];
  /** Calendar date, `YYYY-MM-DD`. */
  date: string;
  wordCount: Localized<number>;
  availableLangs: Lang[];
  /** `YYYY-MM-DD`; set when a published post is edited. */
  updated?: string;
  /** Drafts are visible in development only. */
  draft?: boolean;
}

export interface Post {
  id: string;
  title: Localized;
  summary: Localized;
  imageUrl: string;
  tags: Localized[];
  date: Date;
  wordCount: Localized<number>;
  availableLangs: Lang[];
}

export const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function postBaseUrl(id: string): string {
  return `/posts/${id}`;
}

export function toPost(id: string, manifest: PostManifest): Post {
  return {
    id,
    title: manifest.title,
    summary: manifest.summary,
    imageUrl: `${postBaseUrl(id)}/${manifest.cover}`,
    tags: manifest.tags,
    date: new Date(manifest.date),
    wordCount: manifest.wordCount,
    availableLangs: manifest.availableLangs,
  };
}

/** The language a post is shown in: the requested one, else the default, else the only one available. */
export function pickContentLang(available: Lang[], requested: Lang, fallback: Lang): Lang {
  if (available.includes(requested)) return requested;
  return available.includes(fallback) ? fallback : available[0];
}

/** Post dates are calendar dates (UTC midnight), so format in UTC to avoid showing the previous day. */
export function formatPostDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LANG_META[lang].htmlLang, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}
