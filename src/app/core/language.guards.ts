import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isLang } from '../i18n/i18n.config';
import { LanguageService } from './language.service';

/** `/` → `/<saved | browser | en>`. */
export const rootRedirectGuard: CanActivateFn = () => {
  const lang = inject(LanguageService).detect();
  return inject(Router).createUrlTree(['/', lang]);
};

/** `/:lang/...` — applies a supported language, otherwise redirects to the detected one. */
export const langGuard: CanActivateFn = (route) => {
  const languages = inject(LanguageService);
  const lang = route.paramMap.get('lang');
  if (isLang(lang)) {
    languages.apply(lang);
    return true;
  }
  return inject(Router).createUrlTree(['/', languages.detect()]);
};

/** Unknown path inside a language (`/pt/nope`) → that language's home. Replace with a 404 page later. */
export const notFoundGuard: CanActivateFn = (_route, state) => {
  const first = state.url.split('/')[1];
  const lang = isLang(first) ? first : inject(LanguageService).detect();
  return inject(Router).createUrlTree(['/', lang]);
};
