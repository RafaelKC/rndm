import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { LanguageService } from '../../core/language.service';
import { ThemeService } from '../../core/theme.service';
import { LANG_META, Lang, withLang } from '../../i18n/i18n.config';

@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly otherLang = computed<Lang>(() => (this.languageService.lang() === 'en' ? 'pt' : 'en'));
  protected readonly otherLangMeta = computed(() => LANG_META[this.otherLang()]);
  /** Same page in the other language. */
  protected readonly alternatePath = computed(() => withLang(this.url(), this.otherLang()));
}
