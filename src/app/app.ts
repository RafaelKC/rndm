import { Component, inject } from '@angular/core';
import { SeoService } from './core/seo.service';
import { Shell } from './shell/shell';

@Component({
  imports: [Shell],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    inject(SeoService).init();
  }
}
