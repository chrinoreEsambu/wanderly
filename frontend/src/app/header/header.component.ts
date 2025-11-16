import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AllmyservicesService } from '../services/allmyservices.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isAuthenticated = false;
  isAdmin = false;
  isClient = false;
  username = '';
  cartCount = 0;
  showUserMenu = false;
  isDarkMode = false;
  isMobileMenuOpen = false;
  private themeInitialized = false;

  constructor(
    private service: AllmyservicesService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.isClient = this.authService.isClient();
      this.username = user?.username || '';
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
    });
  }

  ngAfterViewInit(): void {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }

    this.initThemeToggle();
  }

  initThemeToggle(): void {
    if (this.themeInitialized) {
      return;
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';

    const htmlElement = document.documentElement;
    if (
      !htmlElement.classList.contains('dark') &&
      !htmlElement.classList.contains('light')
    ) {
      htmlElement.classList.add(savedTheme);
    }

    this.updateThemeIcon();
    this.themeInitialized = true;
  }

  updateThemeIcon(): void {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = this.isDarkMode ? 'ri-moon-line' : 'ri-sun-line';
    }
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

    this.updateThemeIcon();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/home']);
  }

  navigateToDashboard() {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else if (this.isClient) {
      this.router.navigate(['/client-dashboard']);
    }
    this.showUserMenu = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
