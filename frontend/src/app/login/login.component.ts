import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private service: AllmyservicesService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  activeTab: 'login' | 'register' = 'login';
  selectedFile: File | null = null;
  returnUrl: string = '/home';

  ngOnInit(): void {
    this.initThemeToggle();

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client'],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.loginForm.reset();
    this.registerForm.reset();
    this.showPassword = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  initThemeToggle(): void {
    setTimeout(() => {
      const themeToggle = document.getElementById('theme-toggle-login');
      const themeIcon = document.getElementById('theme-icon-login');
      const htmlElement = document.documentElement;

      const savedTheme = localStorage.getItem('theme') || 'light';
      htmlElement.classList.add(savedTheme);
      if (themeIcon) {
        themeIcon.className =
          savedTheme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
      }

      if (themeToggle && themeIcon) {
        themeToggle.addEventListener('click', () => {
          const isDark = htmlElement.classList.contains('dark');
          if (isDark) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            themeIcon.className = 'ri-sun-line';
            localStorage.setItem('theme', 'light');
          } else {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            themeIcon.className = 'ri-moon-line';
            localStorage.setItem('theme', 'dark');
          }
        });
      }
    }, 0);
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const data = new FormData();
    data.append('username', this.loginForm.value.username);
    data.append('password', this.loginForm.value.password);

    this.service.login(data).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('📥 Réponse login reçue:', response);
        console.log('🔑 Token reçu:', response.token || response.accessToken);

        this.authService.login(response);

        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          text: `Bienvenue ${response.username}!`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Vérifier d'abord le rôle avant le panier
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          // Pour les clients, vérifier si panier ou dashboard
          const cartCount = this.cartService.getCartCount();
          if (cartCount > 0) {
            this.router.navigate(['/panier']);
          } else {
            this.router.navigate(['/client-dashboard']);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: "Nom d'utilisateur ou mot de passe incorrect",
        });
      },
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach((key) => {
      formData.append(key, this.registerForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.service.addUser(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Votre compte a été créé avec succès! Vous pouvez maintenant vous connecter.',
          timer: 3000,
          showConfirmButton: true,
        }).then(() => {
          this.switchTab('login');
        });
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: "Erreur d'inscription",
          text:
            error.error?.message ||
            "Une erreur est survenue lors de l'inscription",
        });
      },
    });
  }
}
