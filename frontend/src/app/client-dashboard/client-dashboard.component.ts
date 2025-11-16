import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AllmyservicesService } from '../services/allmyservices.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css',
})
export class ClientDashboardComponent implements OnInit {
  reservations: any[] = [];
  isLoading = true;
  userInfo: any = null;

  constructor(
    private service: AllmyservicesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.currentUserValue;
    this.loadReservations();
  }

  loadReservations() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.Allreservations().subscribe({
        next: (data: any) => {
          this.reservations = data.filter((r: any) => r.user.id === userId);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur chargement réservations:', error);
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger vos réservations',
          });
        },
      });
    }
  }

  getConfirmedCount(): number {
    return this.reservations.filter((r) => r.confirm && r.paid).length;
  }

  getPendingCount(): number {
    return this.reservations.filter((r) => !r.confirm).length;
  }

  getStatusBadgeClass(reservation: any): string {
    if (reservation.confirm && reservation.paid) {
      return 'status-confirmed';
    } else if (reservation.confirm && !reservation.paid) {
      return 'status-pending-payment';
    } else {
      return 'status-pending';
    }
  }

  getStatusText(reservation: any): string {
    if (reservation.confirm && reservation.paid) {
      return 'Confirmée et Payée';
    } else if (reservation.confirm && !reservation.paid) {
      return 'Confirmée et en attente de paiement';
    } else {
      return 'En attente de confirmation';
    }
  }

  getPhotoUrl(photo: string): string {
    return `${environment.baseUrl}/voyage/files/${photo}`;
  }

  viewDetails(reservation: any) {
    const imageUrl = reservation.voyage?.photo
      ? this.getPhotoUrl(reservation.voyage.photo)
      : '';

    Swal.fire({
      title: 'Détails de la réservation',
      html: `
        <div style="text-align: left; padding: 1rem;">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="Voyage" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" />`
              : ''
          }

          <div style="margin-bottom: 1rem;">
            <strong style="color: hsl(var(--primary));">Voyage:</strong>
            <p style="margin: 0.25rem 0;">${
              reservation.voyage?.name || 'Non spécifié'
            }</p>
          </div>

          <div style="margin-bottom: 1rem;">
            <strong style="color: hsl(var(--primary));">Catégorie:</strong>
            <p style="margin: 0.25rem 0;">${
              reservation.category?.name || 'Non spécifiée'
            }</p>
          </div>

          <div style="margin-bottom: 1rem;">
            <strong style="color: hsl(var(--primary));">Nombre de personnes:</strong>
            <p style="margin: 0.25rem 0;">${
              reservation.nombrePersonnes || 'Non spécifié'
            }</p>
          </div>

          <div style="margin-bottom: 1rem;">
            <strong style="color: hsl(var(--primary));">Date:</strong>
            <p style="margin: 0.25rem 0;">${reservation.date}</p>
          </div>

          <div style="margin-bottom: 1rem;">
            <strong style="color: hsl(var(--primary));">Statut:</strong>
            <p style="margin: 0.25rem 0;">${this.getStatusText(reservation)}</p>
          </div>

          <div>
            <strong style="color: hsl(var(--primary));">Paiement:</strong>
            <p style="margin: 0.25rem 0;">${
              reservation.paid ? '✅ Payé' : '⏳ En attente'
            }</p>
          </div>
        </div>
      `,
      width: 600,
      showCloseButton: true,
      confirmButtonText: 'Fermer',
    });
  }
}
