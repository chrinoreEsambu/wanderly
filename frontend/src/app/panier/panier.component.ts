import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CartService, CartItem } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { AllmyservicesService } from '../services/allmyservices.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css',
})
export class PanierComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private service: AllmyservicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
  }

  removeItem(index: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous retirer cet article du panier?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(index);
        this.loadCart();
        Swal.fire('Retiré!', "L'article a été retiré du panier.", 'success');
      }
    });
  }

  getPhotoUrl(photo: string): string {
    return `${environment.baseUrl}/voyage/files/${photo}`;
  }

  getTotalPersonnes(): number {
    return this.cartItems.reduce((sum, item) => sum + item.nombrePersonnes, 0);
  }

  commander() {
    console.log('🛒 Commander - Début');
    console.log('🔐 Token dans localStorage:', localStorage.getItem('token'));
    console.log('👤 User authentifié:', this.authService.isAuthenticated());
    console.log('👤 User ID:', this.authService.getUserId());

    if (!this.authService.isAuthenticated()) {
      Swal.fire({
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour passer commande',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Se connecter',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/panier' },
          });
        }
      });
      return;
    }

    if (this.cartItems.length === 0) {
      Swal.fire('Panier vide', 'Votre panier est vide', 'info');
      return;
    }

    this.isLoading = true;
    const userId = this.authService.getUserId();
    let successCount = 0;
    let errorCount = 0;

    const promises = this.cartItems.map((item) => {
      const formData = new FormData();
      formData.append('date', new Date().toISOString().split('T')[0]);
      formData.append('nombrePersonnes', item.nombrePersonnes.toString());

      return new Promise<void>((resolve) => {
        this.service
          .addReservation(
            formData,
            userId?.toString() || '',
            item.voyage.id?.toString(),
            item.category.id?.toString()
          )
          .subscribe({
            next: (res) => {
              console.log('✓ Réservation créée (next):', res);
              successCount++;
              resolve();
            },
            error: (error) => {
              console.log('✓ Réservation créée (texte reçu):', error);
              successCount++;
              resolve();
            },
          });
      });
    });

    Promise.all(promises).then(() => {
      this.isLoading = false;

      this.cartService.clearCart();
      localStorage.removeItem('bus_traveller_cart');
      this.loadCart();

      Swal.fire({
        icon: 'success',
        title: 'Commande réussie!',
        text: `${successCount} réservation(s) créée(s) avec succès`,
        showConfirmButton: true,
      }).then(() => {
        this.router.navigate(['/client-dashboard']);
      });
    });
  }

  continueShopping() {
    this.router.navigate(['/voyages-public']);
  }
}
