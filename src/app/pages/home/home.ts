import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PostList } from '../../posts/post-list/post-list';

@Component({
  imports: [PostList, TranslatePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
