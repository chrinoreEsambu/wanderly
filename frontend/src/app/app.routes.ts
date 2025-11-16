import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { UsersComponent } from './users/users.component';
import { VoyagesComponent } from './voyages/voyages.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { VoyagesPublicComponent } from './voyages-public/voyages-public.component';
import { PanierComponent } from './panier/panier.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ClientGuard } from './guards/client.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'voyages-public', component: VoyagesPublicComponent },
  { path: 'panier', component: PanierComponent },

  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [ClientGuard],
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardStatsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'voyages', component: VoyagesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'users', component: UsersComponent },
    ],
  },

  { path: 'category', redirectTo: '/admin/categories', pathMatch: 'full' },
  { path: 'user', redirectTo: '/admin/users', pathMatch: 'full' },
  { path: 'voyage', redirectTo: '/admin/voyages', pathMatch: 'full' },
  { path: 'reservation', redirectTo: '/admin/reservations', pathMatch: 'full' },

  { path: '**', redirectTo: '/home' },
];
