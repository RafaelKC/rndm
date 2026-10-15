import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { LanguageService } from '../../core/language.service';
import { LANG_META } from '../../i18n/i18n.config';
import { localize } from '../../i18n/localized';
import { formatPostDate } from '../../posts/post.model';
import { PostPageData } from '../../posts/post.resolver';

@Component({
  imports: [TranslatePipe],
  selector: 'app-post-page',
  styleUrl: './post.css',
  templateUrl: './post.html',
})
export class PostPage {
  protected readonly lang = inject(LanguageService).lang;
  protected readonly page = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['page'] as PostPageData)),
    { requireSync: true },
  );

  protected readonly contentLang = computed(() => this.page().contentLang);
  protected readonly contentHtmlLang = computed(() => LANG_META[this.contentLang()].htmlLang);
  /** The page language has no version of this post, so another one is shown. */
  protected readonly isFallback = computed(() => this.contentLang() !== this.lang());

  protected readonly title = computed(() => localize(this.page().post.title, this.contentLang()) ?? '');
  protected readonly isoDate = computed(() => this.page().post.date.toISOString().slice(0, 10));
  protected readonly formattedDate = computed(() => formatPostDate(this.page().post.date, this.contentLang()));
  protected readonly words = computed(() => localize(this.page().post.wordCount, this.contentLang()));
  protected readonly tags = computed(() =>
    this.page()
      .post.tags.map((tag) => localize(tag, this.contentLang()))
      .filter((tag): tag is string => !!tag),
  );
}
