import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/language.service';
import { LANG_META } from '../../i18n/i18n.config';
import { localize } from '../../i18n/localized';
import { Post } from '../post.model';

@Component({
  imports: [TranslatePipe],
  selector: 'app-post-card',
  styleUrl: './post-card.css',
  templateUrl: './post-card.html',
})
export class PostCard {
  readonly post = input.required<Post>();

  private readonly lang = inject(LanguageService).lang;

  protected readonly title = computed(() => localize(this.post().title, this.lang()) ?? '');
  protected readonly summary = computed(() => localize(this.post().summary, this.lang()) ?? '');
  protected readonly isoDate = computed(() => this.post().date.toISOString().slice(0, 10));
  /** Post dates are calendar dates (UTC midnight), so format in UTC to avoid showing the previous day. */
  protected readonly formattedDate = computed(() =>
    new Intl.DateTimeFormat(LANG_META[this.lang()].htmlLang, { dateStyle: 'medium', timeZone: 'UTC' }).format(
      this.post().date,
    ),
  );
  protected readonly words = computed(() => localize(this.post().wordCount, this.lang()));
  protected readonly tags = computed(() =>
    this.post()
      .tags.map((tag) => localize(tag, this.lang()))
      .filter((tag): tag is string => !!tag),
  );
  protected readonly langs = computed(() =>
    this.post().availableLangs.map((code) => ({
      code,
      label: code.toUpperCase(),
      htmlLang: LANG_META[code].htmlLang,
      current: code === this.lang(),
    })),
  );
}
