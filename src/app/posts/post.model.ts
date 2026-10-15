import { Lang } from '../i18n/i18n.config';
import { Localized } from '../i18n/localized';

export interface Post {
  id: string;
  title: Localized;
  summary: Localized;
  imageUrl: string;
  /** Free-form labels hinting at what the post is about (movie, game, book, software...). */
  tags: Localized[];
  date: Date;
  wordCount: Localized<number>;
  availableLangs: Lang[];
}
