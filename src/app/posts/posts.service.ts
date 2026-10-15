import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Post, PostManifest, postBaseUrl, toPost } from './post.model';

/** Loads the post list from `/posts/index.json` (generated at build) and each post's manifest. */
@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);

  /** Newest first (the index is already sorted by date). */
  readonly posts = toSignal(
    this.http.get<string[]>('/posts/index.json').pipe(
      switchMap((ids) =>
        forkJoin(
          ids.map((id) =>
            this.http.get<PostManifest>(`${postBaseUrl(id)}/manifest.json`).pipe(map((manifest) => toPost(id, manifest))),
          ),
        ),
      ),
      catchError(() => of<Post[]>([])),
    ),
    { initialValue: [] as Post[] },
  );
}
