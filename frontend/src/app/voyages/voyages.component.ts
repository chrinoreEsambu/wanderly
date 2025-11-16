import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-voyages',
  imports: [CommonModule],
  templateUrl: './voyages.component.html',
  styleUrl: './voyages.component.css',
})
export class VoyagesComponent implements OnInit {
  constructor(private service: AllmyservicesService) {}
  Listvoyage: any;
  Listcategory: any;
  ngOnInit(): void {
    this.getvoyage();
    this.getcategory();
  }

  getvoyage() {
    this.service.Allvoyages().subscribe(
      (data) => {
        console.log(data);
        this.Listvoyage = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewvoyage(id: String) {
    this.service.oneVoyage(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        const imageUrl = res.photoUrl || 'assets/img/placeholder.jpg';
        Swal.fire({
          html: `
            <div style="border: 1px solid #0a0a0a; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Détails du voyage</h3>
              <img src="${imageUrl}" alt="Voyage" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;" />
              <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Nom:</strong> ${
                res.name
              }</p>
              <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Date:</strong> ${
                res.date
              }</p>
              <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Catégorie:</strong> ${
                res.category?.name || 'N/A'
              }</p>
            </div>
          `,
          width: 600,
          showConfirmButton: false,
          showCloseButton: false,
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
      }
    );
  }

  editvoyage(id: String) {
    this.service.oneVoyage(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        Swal.fire({
          html: `
            <div style="border: 1px solid #2563eb; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #2563eb; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-edit-line"></i> Modifier le voyage
              </h3>
              <input id="name" class="swal2-input" placeholder="Nom" value="${res.name}" style="margin: 0.5rem 0;">
              <input id="date" class="swal2-input" type="date" placeholder="Date" value="${res.date}" style="margin: 0.5rem 0;">
              <input id="photo" type="file" class="swal2-file" style="margin: 0.5rem 0;">
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Modifier',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#000',
          cancelButtonColor: '#FF2100',
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
          preConfirm: () => {
            const name = (document.getElementById('name') as HTMLInputElement)
              .value;
            const date = (
              document.getElementById('date') as HTMLInputElement
            ).value
              .trim()
              .toString();
            const photoInput = document.getElementById(
              'photo'
            ) as HTMLInputElement;
            const photoFile = photoInput?.files?.[0];
            if (!name || !date || !photoFile) {
              Swal.showValidationMessage('Tous les champs sont requis');
              return false;
            }
            return { name, date, photoFile };
          },
        }).then((editResult) => {
          if (editResult.isConfirmed) {
            const formData = new FormData();
            formData.append('name', editResult.value.name);
            formData.append('date', editResult.value.date);
            formData.append('file', editResult.value.photoFile);
            this.service.updateVoyage(formData, id).subscribe(
              () => {
                Swal.fire({
                  html: `
                    <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                      <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                        <i class="ri-close-line"></i>
                      </button>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-check-line"></i> Modifié !
                      </h3>
                      <p style="color: #0a0a0a;">Le voyage a été modifié avec succès.</p>
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
                this.getvoyage();
              },
              (error: any) => {
                console.error('Error updating data', error);
                Swal.fire({
                  html: `
                    <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                      <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                        <i class="ri-close-line"></i>
                      </button>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-close-circle-line"></i> Erreur
                      </h3>
                      <p style="color: #0a0a0a;">Impossible de modifier le voyage.</p>
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
              }
            );
          }
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
              <p style="color: #0a0a0a;">Impossible de charger les données.</p>
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
      }
    );
  }

  deletevoyage(id: String) {
    Swal.fire({
      html: `
        <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-alert-line"></i> Confirmer la suppression
          </h3>
          <p style="margin-bottom: 0.5rem; color: #0a0a0a;">Êtes-vous sûr de vouloir supprimer ce voyage ?</p>
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
        this.service.deleteVoyage(id).subscribe({
          next: (res) => {
            console.log('✓ Voyage supprimé:', res);
            this.getvoyage();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">Le voyage a été supprimé avec succès.</p>
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
          error: (error) => {
            console.log('✓ Suppression réussie (texte reçu):', error);
            this.getvoyage();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">Le voyage a été supprimé avec succès.</p>
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
        });
      }
    });
  }

  addvoyage() {
    const categoryOptions = this.Listcategory.map(
      (cat: any) => `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    Swal.fire({
      html: `
        <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-map-pin-add-line"></i> Créer un nouveau voyage
          </h3>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-map-pin-line"></i> Nom du voyage
            </label>
            <input id="name" class="swal2-input" placeholder="Ex: Paris - Tour Eiffel" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-calendar-line"></i> Date du voyage
            </label>
            <input id="date" type="date" class="swal2-input" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-folder-line"></i> Catégorie
            </label>
            <select id="idcat" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="">Sélectionner une catégorie</option>
              ${categoryOptions}
            </select>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-image-line"></i> Photo du voyage
            </label>
            <input id="photo" type="file" accept="image/*" class="swal2-file" style="margin: 0; width: 100%; padding: 0.75rem; border: 2px dashed #d1d5db; border-radius: 8px; background: #f9fafb;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="ri-check-line"></i> Créer',
      cancelButtonText: '<i class="ri-close-line"></i> Annuler',
      confirmButtonColor: '#000',
      cancelButtonColor: '#FF2100',
      width: 600,
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
        const name = (
          document.getElementById('name') as HTMLInputElement
        ).value.trim();
        const date = (
          document.getElementById('date') as HTMLInputElement
        ).value.trim();
        const idcat = (document.getElementById('idcat') as HTMLSelectElement)
          .value;
        const photoInput = document.getElementById('photo') as HTMLInputElement;
        const photoFile = photoInput?.files?.[0];

        if (!name || !date || !photoFile || !idcat) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return null;
        }

        if (name.length < 3) {
          Swal.showValidationMessage(
            'Le nom doit contenir au moins 3 caractères'
          );
          return null;
        }

        return { name, date, photoFile, idcat };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('name', result.value.name);
        formData.append('date', result.value.date);
        formData.append('file', result.value.photoFile);

        this.service.addVoyage(formData, result.value.idcat).subscribe(
          (res: any) => {
            this.getvoyage();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Voyage créé !
                  </h3>
                  <p style="color: #0a0a0a;">Le voyage <strong>${result.value.name}</strong> a été créé avec succès.</p>
                </div>
              `,
              showConfirmButton: false,
              timer: 2500,
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
                  <p style="color: #0a0a0a;">Impossible de créer le voyage.</p>
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
          }
        );
      }
    });
  }

  getcategory() {
    this.service.AllCategories().subscribe(
      (data) => {
        console.log(data);
        this.Listcategory = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
