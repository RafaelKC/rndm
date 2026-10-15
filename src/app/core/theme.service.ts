import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CookieService } from './cookie.service';

export type Theme = 'dark' | 'light';

const COOKIE_NAME = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly cookies = inject(CookieService);

  readonly theme = signal<Theme>(this.root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  readonly isLight = computed(() => this.theme() === 'light');

  toggle(): void {
    const next: Theme = this.isLight() ? 'dark' : 'light';
    this.theme.set(next);
    this.root.setAttribute('data-theme', next);
    this.cookies.set(COOKIE_NAME, next);
  }
}
