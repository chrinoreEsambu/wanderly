import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AllmyservicesService } from '../services/allmyservices.service';
import { CartService } from '../services/cart.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-voyages-public',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './voyages-public.component.html',
  styleUrl: './voyages-public.component.css',
})
export class VoyagesPublicComponent implements OnInit {
  voyages: any[] = [];
  categories: any[] = [];
  isLoading = true;

  constructor(
    private service: AllmyservicesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadVoyages();
    this.loadCategories();
  }

  loadVoyages() {
    this.service.Allvoyages().subscribe({
      next: (data: any) => {
        this.voyages = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement voyages:', error);
        this.isLoading = false;
      },
    });
  }

  loadCategories() {
    this.service.AllCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      },
    });
  }

  addToCart(voyage: any) {
    const categoryOptions = this.categories
      .map((cat: any) => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');

    Swal.fire({
      title: 'Ajouter au panier',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <h3 style="margin-bottom: 1rem;">${voyage.name}</h3>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label for="category" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Catégorie</label>
            <select id="category" class="swal2-select" style="width: 100%;">
              <option value="" disabled selected>Sélectionnez une catégorie</option>
              ${categoryOptions}
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label for="nombrePersonnes" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nombre de personnes</label>
            <input
              id="nombrePersonnes"
              type="number"
              min="1"
              max="10"
              value="1"
              class="swal2-input"
              style="width: 100%; margin: 0;"
              placeholder="Nombre de personnes"
            />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter au panier',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const categoryId = (
          document.getElementById('category') as HTMLSelectElement
        ).value;
        const nombrePersonnes = parseInt(
          (document.getElementById('nombrePersonnes') as HTMLInputElement).value
        );

        if (!categoryId) {
          Swal.showValidationMessage('Veuillez sélectionner une catégorie');
          return false;
        }

        if (!nombrePersonnes || nombrePersonnes < 1) {
          Swal.showValidationMessage(
            'Veuillez entrer un nombre de personnes valide'
          );
          return false;
        }

        const selectedCategory = this.categories.find(
          (c) => c.id == categoryId
        );
        return { categoryId, nombrePersonnes, selectedCategory };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.cartService.addToCart({
          voyage: voyage,
          category: result.value.selectedCategory,
          nombrePersonnes: result.value.nombrePersonnes,
        });

        Swal.fire({
          icon: 'success',
          title: 'Ajouté au panier!',
          text: `${voyage.name} a été ajouté à votre panier`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  getPhotoUrl(photo: string): string {
    return `${environment.baseUrl}/voyage/files/${photo}`;
  }
}
