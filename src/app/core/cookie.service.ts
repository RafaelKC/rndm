import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

const SHARED_DOMAIN = 'chicovis.dev';

/**
 * Preference cookies (theme, language). First-party only: `SameSite=Lax`, never
 * sent to third parties, and no tracking, so no consent banner is required.
 *
 * On `chicovis.dev` and its subdomains the cookie is written with `Domain=.chicovis.dev`,
 * so the personal site and this blog share the same theme and language choice.
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly doc = inject(DOCUMENT);

  get(name: string): string | null {
    const prefix = `${name}=`;
    const entry = this.doc.cookie.split('; ').find((c) => c.startsWith(prefix));
    return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
  }

  set(name: string, value: string, days = 365): void {
    const encoded = encodeURIComponent(value);
    const secure = this.doc.location?.protocol === 'https:' ? '; Secure' : '';
    const hostname = this.doc.location?.hostname ?? '';
    const shared = hostname === SHARED_DOMAIN || hostname.endsWith(`.${SHARED_DOMAIN}`);

    if (shared) {
      // Drop a legacy host-only cookie of the same name so it cannot shadow the shared one.
      this.doc.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    }
    const domain = shared ? `; Domain=.${SHARED_DOMAIN}` : '';
    this.doc.cookie = `${name}=${encoded}; Path=/; Max-Age=${days * 86400}; SameSite=Lax${domain}${secure}`;
  }
}
