import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Output() collapsedChange = new EventEmitter<boolean>();
  isCollapsed = false;
  username = '';
  email = '';
  pendingCount = 0;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // Sur mobile, la sidebar est fermée par défaut
    const isMobile = window.innerWidth < 768;
    const saved = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = isMobile ? true : saved === 'true';

    this.collapsedChange.emit(this.isCollapsed);

    this.authService.currentUser$.subscribe((user) => {
      this.username = user?.username || 'Admin';
      this.email = user?.email || '';
    });

    this.loadPendingReservations();
    this.initTheme();
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.classList.add(savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;

    if (this.isDarkMode) {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
    this.collapsedChange.emit(this.isCollapsed);
  }

  loadPendingReservations(): void {
    this.dashboardService.getPendingCount().subscribe({
      next: (response) => {
        this.pendingCount = response.count;
      },
      error: (err) => {
        console.error('Erreur chargement pending count:', err);
        this.pendingCount = 0;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(): string {
    return this.username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
