import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private http = inject(HttpClient);

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(userResponse: any): void {
    console.log('🔐 Réponse backend:', userResponse);

    const user: User = {
      id: userResponse.id,
      username: userResponse.username,
      email: userResponse.email,
      role: userResponse.role,
      token: userResponse.token,
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', userResponse.token);
    this.currentUserSubject.next(user);

    console.log('✅ Token enregistré:', userResponse.token);
    console.log('✅ User enregistré:', user);
  }

  logout(): void {
    console.log('🚪 Déconnexion - Appel au backend');

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get(`${environment.baseUrl}/user/signout`, { headers })
        .subscribe({
          next: () => {
            console.log('✅ Refresh token supprimé côté backend');
            this.clearSession();
          },
          error: (err) => {
            console.warn('⚠️ Erreur lors de la déconnexion backend:', err);
            this.clearSession(); // On nettoie quand même le frontend
          },
        });
    } else {
      this.clearSession();
    }
  }

  private clearSession(): void {
    console.log('🧹 Nettoyage de la session');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin' || this.getUserRole() === 'ADMIN';
  }

  isClient(): boolean {
    return this.getUserRole() === 'client' || this.getUserRole() === 'CLIENT';
  }

  getUserId(): number | null {
    return this.currentUserValue?.id || null;
  }
}
