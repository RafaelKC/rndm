import { Injectable, signal } from '@angular/core';
import { MOCK_POSTS } from './posts.mock';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  /** Newest first. */
  readonly posts = signal<Post[]>([...MOCK_POSTS].sort((a, b) => b.date.getTime() - a.date.getTime()));
}
