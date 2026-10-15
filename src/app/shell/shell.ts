import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Footer } from '../layout/footer/footer';
import { Header } from '../layout/header/header';

@Component({
  imports: [Header, Footer, RouterOutlet, TranslatePipe],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell {}
