import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Preference cookies (theme, language). First-party only: `SameSite=Lax`, never
 * sent to third parties, and no tracking, so no consent banner is required.
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
    const secure = this.doc.location?.protocol === 'https:' ? '; Secure' : '';
    this.doc.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${days * 86400}; SameSite=Lax${secure}`;
  }
}
