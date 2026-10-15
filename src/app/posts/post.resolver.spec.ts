import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { provideI18n } from '../i18n/i18n.config';
import { postResolver } from './post.resolver';

function routeFor(id: string, lang = 'en'): ActivatedRouteSnapshot {
  return { paramMap: { get: (name: string) => ({ id, lang })[name] ?? null } } as unknown as ActivatedRouteSnapshot;
}

function resolve(id: string): Promise<unknown> {
  const result = TestBed.runInInjectionContext(() => postResolver(routeFor(id), {} as RouterStateSnapshot));
  return firstValueFrom(isObservable(result) ? (result as Observable<unknown>) : of(result));
}

describe('postResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideI18n(), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('redirects to the language home when the id is not a GUID', async () => {
    const result = await resolve('nope');
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe('/en');
  });

  it('redirects to the language home when the post does not exist', async () => {
    const pending = resolve('8bb0a6ea-2834-4698-99cf-7ed3d7f1e3a3');
    TestBed.inject(HttpTestingController)
      .expectOne('/posts/8bb0a6ea-2834-4698-99cf-7ed3d7f1e3a3/manifest.json')
      .flush('not found', { status: 404, statusText: 'Not Found' });
    const result = await pending;
    expect(result).toBeInstanceOf(RedirectCommand);
  });
});
