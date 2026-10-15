import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PostCard } from '../post-card/post-card';
import { PostsService } from '../posts.service';

@Component({
  imports: [PostCard, TranslatePipe],
  selector: 'app-post-list',
  styleUrl: './post-list.css',
  templateUrl: './post-list.html',
})
export class PostList {
  protected readonly posts = inject(PostsService).posts;
}
