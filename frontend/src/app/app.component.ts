import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'projetfront';
  showHeader = true;

  constructor(private router: Router) {
    this.initTheme();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showHeader = !event.url.startsWith('/admin');
      });
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
  }
}
