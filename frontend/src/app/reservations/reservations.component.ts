import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
  constructor(private service: AllmyservicesService) {}
  Listreservation: any;
  Listusers: any;
  Listvoyage: any;
  Listcategory: any;

  // Propriétés pour la pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Référence Math pour utilisation dans le template
  Math = Math;

  ngOnInit(): void {
    this.getreservation();
    this.getusers();
    this.getvoyage();
    this.getcategory();
  }

  getreservation() {
    this.service.Allreservations().subscribe(
      (data: any) => {
        console.log(data);
        this.Listreservation = data;
        this.totalItems = Array.isArray(data) ? data.length : 0;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  // Méthodes pour la pagination
  get paginatedReservations() {
    if (!this.Listreservation) return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.Listreservation.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  editreservation(id: String) {
    this.service.oneReservation(id).subscribe(
      (res: any) => {
        console.log('Réservation à modifier:', res);

        Swal.fire({
          html: `
            <div style="border: 1px solid #2563eb; border-radius: 12px; padding: 2rem; background: #fff; position: relative; max-height: 90vh; overflow-y: auto;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1; z-index: 10;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #2563eb; display: flex; align-items: center; gap: 0.5rem; padding-right: 2rem;">
                <i class="ri-edit-line"></i> Modifier la réservation
              </h3>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Client (lecture seule, affiché en info) -->
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; border-left: 4px solid #2563eb;">
                  <p style="margin: 0; font-size: 0.875rem; color: #6b7280; font-weight: 600;">CLIENT</p>
                  <p style="margin: 0.25rem 0 0 0; font-size: 1rem; color: #0a0a0a; font-weight: 500;">
                    <i class="ri-user-line" style="color: #2563eb;"></i> ${
                      res.user?.username || 'N/A'
                    }
                  </p>
                  <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #6b7280;">
                    <i class="ri-mail-line"></i> ${res.user?.email || 'N/A'}
                  </p>
                </div>

                <!-- Date -->
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151;">
                    <i class="ri-calendar-line"></i> Date de réservation
                  </label>
                  <input id="date" type="date" value="${
                    res.date || ''
                  }" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem;">
                </div>

                <!-- Statut de paiement (select stylisé) -->
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151;">
                    <i class="ri-wallet-line"></i> Statut de paiement
                  </label>
                  <select id="paid" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; background: white; cursor: pointer;">
                    <option value="false" ${!res.paid ? 'selected' : ''}>
                      🔴 Non payé
                    </option>
                    <option value="true" ${res.paid ? 'selected' : ''}>
                      🟢 Payé
                    </option>
                  </select>
                </div>

                <!-- Statut de confirmation -->
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151;">
                    <i class="ri-checkbox-circle-line"></i> Statut de confirmation
                  </label>
                  <select id="confirm" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; background: white; cursor: pointer;">
                    <option value="false" ${
                      !res.confirm ? 'selected' : ''
                    }>🕐 En attente</option>
                    <option value="true" ${
                      res.confirm ? 'selected' : ''
                    }>🟢 Confirmé</option>
                  </select>
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Modifier',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#FF2900',
          cancelButtonColor: '#000000',
          width: 550,
          padding: '0',
          background: 'transparent',
          backdrop: 'rgba(0,0,0,0.4)',
          showCloseButton: false,
          didOpen: () => {
            const closeBtn = document.querySelector('.close-modal-btn');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => Swal.close());
            }
          },
          preConfirm: () => {
            const paid = (document.getElementById('paid') as HTMLSelectElement)
              .value;
            const confirm = (
              document.getElementById('confirm') as HTMLSelectElement
            ).value;
            const date = (
              document.getElementById('date') as HTMLInputElement
            ).value.trim();

            if (!date) {
              Swal.showValidationMessage('Veuillez sélectionner une date.');
              return null;
            }
            return { paid, confirm, date, userId: res.user.id };
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const formData = new FormData();
            formData.append('paid', result.value.paid);
            formData.append('confirm', result.value.confirm);
            formData.append('date', result.value.date);

            this.service
              .updateReservation(formData, id, result.value.userId)
              .subscribe(
                (res: any) => {
                  Swal.fire({
                    html: `
                      <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                        <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                          <i class="ri-close-line"></i>
                        </button>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                          <i class="ri-check-line"></i> Modifié !
                        </h3>
                        <p style="color: #0a0a0a;">La réservation a été modifiée avec succès.</p>
                      </div>
                    `,
                    showConfirmButton: false,
                    timer: 2000,
                    width: 500,
                    padding: '0',
                    background: 'transparent',
                    backdrop: 'rgba(0,0,0,0.4)',
                    didOpen: () => {
                      const closeBtn =
                        document.querySelector('.close-modal-btn');
                      if (closeBtn) {
                        closeBtn.addEventListener('click', () => Swal.close());
                      }
                    },
                  });
                  this.getreservation();
                },
                (error: any) => {
                  console.error('update error:', error);
                  Swal.fire({
                    html: `
                      <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                        <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                          <i class="ri-close-line"></i>
                        </button>
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                          <i class="ri-close-circle-line"></i> Erreur
                        </h3>
                        <p style="color: #0a0a0a;">Impossible de modifier la réservation.</p>
                      </div>
                    `,
                    showConfirmButton: false,
                    showCloseButton: false,
                    width: 500,
                    padding: '0',
                    background: 'transparent',
                    backdrop: 'rgba(0,0,0,0.4)',
                    didOpen: () => {
                      const closeBtn =
                        document.querySelector('.close-modal-btn');
                      if (closeBtn) {
                        closeBtn.addEventListener('click', () => Swal.close());
                      }
                    },
                  });
                },
              );
          }
        });
      },
      (error: any) => {
        console.error('Erreur lors du chargement de la réservation', error);
        Swal.fire({
          html: `
            <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-close-circle-line"></i> Erreur
              </h3>
              <p style="color: #0a0a0a;">Impossible de charger la réservation.</p>
            </div>
          `,
          showConfirmButton: false,
          timer: 2000,
          width: 500,
          padding: '0',
          background: 'transparent',
          backdrop: 'rgba(0,0,0,0.4)',
          didOpen: () => {
            const closeBtn = document.querySelector('.close-modal-btn');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => Swal.close());
            }
          },
        });
      },
    );
  }

  viewreservation(id: String) {
    this.service.oneReservation(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        Swal.fire({
          html: `
            <div style="border: 1px solid #0a0a0a; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #0a0a0a;">Détails de la réservation</h3>
              <div style="text-align: left;">
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Date:</strong> ${
                  res.date
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Confirmation:</strong> ${
                  res.confirm
                    ? '<i class="ri-check-line" style="color: #10b981;"></i> Confirmé'
                    : '<i class="ri-time-line" style="color: #f59e0b;"></i> En attente'
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Client:</strong> ${
                  res.user.username
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Email:</strong> ${
                  res.user.email || 'N/A'
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Destination:</strong> ${
                  res.voyage?.name || 'N/A'
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Nombre de personnes:</strong> ${
                  res.nombrePersonnes || 'N/A'
                }</p>
                <p style="margin: 0.75rem 0; font-size: 0.95rem;"><strong>Paiement:</strong> ${
                  res.paid
                    ? '<i class="ri-check-line" style="color: #10b981;"></i> Payé'
                    : '<i class="ri-close-line" style="color: #ef4444;"></i> Non payé'
                }</p>
              </div>
            </div>
          `,
          showConfirmButton: false,
          showCloseButton: false,
          width: 600,
          padding: '0',
          background: 'transparent',
          backdrop: 'rgba(0,0,0,0.4)',
          didOpen: () => {
            const closeBtn = document.querySelector('.close-modal-btn');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => Swal.close());
            }
          },
        });
      },
      (error: any) => {
        console.error('Error fetching data', error);
        Swal.fire({
          html: `
            <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-close-circle-line"></i> Erreur
              </h3>
              <p style="color: #0a0a0a;">Impossible de charger les détails</p>
            </div>
          `,
          showConfirmButton: false,
          showCloseButton: false,
          width: 500,
          padding: '0',
          background: 'transparent',
          backdrop: 'rgba(0,0,0,0.4)',
          didOpen: () => {
            const closeBtn = document.querySelector('.close-modal-btn');
            if (closeBtn) {
              closeBtn.addEventListener('click', () => Swal.close());
            }
          },
        });
      },
    );
  }
  deletereservation(id: String) {
    Swal.fire({
      html: `
        <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-alert-line"></i> Confirmer la suppression
          </h3>
          <p style="margin-bottom: 0.5rem; color: #0a0a0a;">Êtes-vous sûr de vouloir supprimer cette réservation ?</p>
          <p style="color: #ef4444; font-size: 0.875rem;">Cette action est irréversible.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      width: 500,
      padding: '0',
      background: 'transparent',
      backdrop: 'rgba(0,0,0,0.4)',
      showCloseButton: false,
      didOpen: () => {
        const closeBtn = document.querySelector('.close-modal-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => Swal.close());
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteReservation(id).subscribe(
          (res) => {
            console.log('success to delete: ', res);
            this.getreservation();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">La réservation a été supprimée avec succès.</p>
                </div>
              `,
              showConfirmButton: false,
              timer: 2000,
              width: 500,
              padding: '0',
              background: 'transparent',
              backdrop: 'rgba(0,0,0,0.4)',
              didOpen: () => {
                const closeBtn = document.querySelector('.close-modal-btn');
                if (closeBtn) {
                  closeBtn.addEventListener('click', () => Swal.close());
                }
              },
            });
          },
          (error) => {
            console.log('error', error);
            Swal.fire({
              html: `
                <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-close-circle-line"></i> Erreur
                  </h3>
                  <p style="color: #0a0a0a;">Impossible de supprimer la réservation</p>
                </div>
              `,
              showConfirmButton: false,
              showCloseButton: false,
              width: 500,
              padding: '0',
              background: 'transparent',
              backdrop: 'rgba(0,0,0,0.4)',
              didOpen: () => {
                const closeBtn = document.querySelector('.close-modal-btn');
                if (closeBtn) {
                  closeBtn.addEventListener('click', () => Swal.close());
                }
              },
            });
          },
        );
      }
    });
  }

  addreservation() {
    const clientUsers = this.Listusers.filter(
      (user: any) => user.role && user.role.toUpperCase() === 'CLIENT',
    );

    const userOptions = clientUsers
      .map(
        (user: any) =>
          `<option value="${user.id}">${user.username} (${user.email})</option>`,
      )
      .join('');

    const voyageOptions = this.Listvoyage.map(
      (voyage: any) =>
        `<option value="${voyage.id}">${voyage.name} - ${voyage.date}</option>`,
    ).join('');

    const categoryOptions = this.Listcategory.map(
      (cat: any) => `<option value="${cat.id}">${cat.name}</option>`,
    ).join('');

    Swal.fire({
      html: `
        <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-calendar-check-line"></i> Créer une réservation manuelle
          </h3>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-user-line"></i> Client
            </label>
            <select id="iduser" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="">Sélectionner un client</option>
              ${userOptions}
            </select>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-map-pin-line"></i> Voyage
            </label>
            <select id="idvoyage" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="">Sélectionner un voyage</option>
              ${voyageOptions}
            </select>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-folder-line"></i> Catégorie
            </label>
            <select id="idcategory" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="">Sélectionner une catégorie</option>
              ${categoryOptions}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="text-align: left;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                <i class="ri-calendar-line"></i> Date
              </label>
              <input id="date" type="date" class="swal2-input" style="margin: 0; width: 100%;">
            </div>
            <div style="text-align: left;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                <i class="ri-team-line"></i> Nombre de personnes
              </label>
              <input id="nombrePersonnes" type="number" min="1" class="swal2-input" placeholder="1" style="margin: 0; width: 100%;">
            </div>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-wallet-line"></i> Statut de paiement
            </label>
            <select id="paid" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="false">🔴 Non payé</option>
              <option value="true">🟢 Payé</option>
            </select>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-checkbox-circle-line"></i> Statut de confirmation
            </label>
            <select id="confirm" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="false">🕐 En attente</option>
              <option value="true">🟢 Confirmé</option>
            </select>
          </div>

          <div style="background: #e0f2fe; padding: 1rem; border-radius: 8px; border-left: 4px solid #0284c7; margin-top: 1.5rem;">
            <p style="margin: 0; color: #0c4a6e; font-size: 0.875rem;">
              <i class="ri-information-line"></i> <strong>Note:</strong> Cette réservation manuelle sera créée directement sans envoyer d'email de confirmation au client.
            </p>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="ri-check-line"></i> Créer la réservation',
      cancelButtonText: '<i class="ri-close-line"></i> Annuler',
      confirmButtonColor: '#000',
      cancelButtonColor: '#FF2100',
      width: 700,
      padding: '0',
      background: 'transparent',
      backdrop: 'rgba(0,0,0,0.4)',
      showCloseButton: false,
      didOpen: () => {
        const closeBtn = document.querySelector('.close-modal-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => Swal.close());
        }

        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.min = today;
        }
      },
      preConfirm: () => {
        const iduser = (document.getElementById('iduser') as HTMLSelectElement)
          .value;
        const idvoyage = (
          document.getElementById('idvoyage') as HTMLSelectElement
        ).value;
        const idcategory = (
          document.getElementById('idcategory') as HTMLSelectElement
        ).value;
        const date = (document.getElementById('date') as HTMLInputElement)
          .value;
        const nombrePersonnes = (
          document.getElementById('nombrePersonnes') as HTMLInputElement
        ).value;
        const paid = (document.getElementById('paid') as HTMLSelectElement)
          .value;
        const confirm = (
          document.getElementById('confirm') as HTMLSelectElement
        ).value;

        if (!iduser || !idvoyage || !idcategory || !date || !nombrePersonnes) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return null;
        }

        const nbPersonnes = parseInt(nombrePersonnes);
        if (nbPersonnes < 1) {
          Swal.showValidationMessage(
            'Le nombre de personnes doit être supérieur à 0',
          );
          return null;
        }

        return {
          iduser,
          idvoyage,
          idcategory,
          date,
          nombrePersonnes: nbPersonnes,
          paid,
          confirm,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('date', result.value.date);
        formData.append(
          'nombrePersonnes',
          result.value.nombrePersonnes.toString(),
        );
        formData.append('paid', result.value.paid);
        formData.append('confirm', result.value.confirm);

        this.service
          .addReservationManual(
            formData,
            result.value.iduser,
            result.value.idvoyage,
            result.value.idcategory,
          )
          .subscribe(
            (res: any) => {
              this.getreservation();
              const selectedUser = this.Listusers.find(
                (u: any) => u.id == result.value.iduser,
              );
              const selectedVoyage = this.Listvoyage.find(
                (v: any) => v.id == result.value.idvoyage,
              );

              Swal.fire({
                html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Réservation créée !
                  </h3>
                  <p style="color: #0a0a0a;">La réservation pour <strong>${
                    selectedUser?.username || 'le client'
                  }</strong> a été créée avec succès.</p>
                  <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">Voyage: ${
                    selectedVoyage?.name || 'N/A'
                  }</p>
                </div>
              `,
                showConfirmButton: false,
                timer: 3000,
                width: 500,
                padding: '0',
                background: 'transparent',
                backdrop: 'rgba(0,0,0,0.4)',
                didOpen: () => {
                  const closeBtn = document.querySelector('.close-modal-btn');
                  if (closeBtn) {
                    closeBtn.addEventListener('click', () => Swal.close());
                  }
                },
              });
            },
            (error: any) => {
              console.error('Creation error:', error);
              Swal.fire({
                html: `
                <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-close-circle-line"></i> Erreur
                  </h3>
                  <p style="color: #0a0a0a;">Impossible de créer la réservation. ${
                    error.error?.message || ''
                  }</p>
                </div>
              `,
                showConfirmButton: false,
                showCloseButton: false,
                width: 500,
                padding: '0',
                background: 'transparent',
                backdrop: 'rgba(0,0,0,0.4)',
                didOpen: () => {
                  const closeBtn = document.querySelector('.close-modal-btn');
                  if (closeBtn) {
                    closeBtn.addEventListener('click', () => Swal.close());
                  }
                },
              });
            },
          );
      }
    });
  }

  getusers() {
    this.service.Allusers().subscribe(
      (data) => {
        console.log(data);
        this.Listusers = data;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getvoyage() {
    this.service.Allvoyages().subscribe(
      (data) => {
        console.log(data);
        this.Listvoyage = data;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getcategory() {
    this.service.AllCategories().subscribe(
      (data) => {
        console.log(data);
        this.Listcategory = data;
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
