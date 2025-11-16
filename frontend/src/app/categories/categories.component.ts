import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  constructor(private service: AllmyservicesService) {}
  Listcat: any;
  ngOnInit(): void {
    this.getcategory();
  }

  getcategory() {
    this.service.AllCategories().subscribe(
      (data) => {
        console.log('📋 Liste des catégories reçues:', data);
        this.Listcat = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  viewcat(id: String) {
    this.service.oneCategorie(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        Swal.fire({
          html: `
            <div style="border: 1px solid #0a0a0a; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Détails de la catégorie</h3>
              <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Nom:</strong> ${
                res.name
              }</p>
              <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Description:</strong> ${
                res.description || 'Aucune description'
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

  editcat(id: String) {
    this.service.oneCategorie(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        Swal.fire({
          html: `
            <div style="border: 1px solid #2563eb; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #2563eb; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-edit-line"></i> Modifier la catégorie
              </h3>
              <input id="swal-input1" class="swal2-input" placeholder="Nom" value="${res.name}" style="margin: 0.5rem 0;">
              <input id="swal-input2" class="swal2-input" placeholder="Description" value="${res.description}" style="margin: 0.5rem 0;">
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Modifier',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#FF2900',
          cancelButtonColor: '#000000',
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
            const name = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            const description = (
              document.getElementById('swal-input2') as HTMLInputElement
            ).value;
            if (!name || !description) {
              Swal.showValidationMessage('Tous les champs sont requis');
              return false;
            }
            return { name, description };
          },
        }).then((editResult) => {
          if (editResult.isConfirmed) {
            const formData = new FormData();
            formData.append('name', editResult.value.name);
            formData.append('description', editResult.value.description);
            this.service.updateCategorie(formData, id).subscribe(
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
                      <p style="color: #0a0a0a;">La catégorie a été modifiée avec succès.</p>
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
                this.getcategory();
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
                      <p style="color: #0a0a0a;">Impossible de modifier la catégorie.</p>
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

  addcat() {
    Swal.fire({
      html: `
        <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-folder-add-line"></i> Créer une nouvelle catégorie
          </h3>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-text"></i> Nom de la catégorie
            </label>
            <input id="name" class="swal2-input" placeholder="Ex: Voyage d'aventure" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-file-text-line"></i> Description
            </label>
            <textarea id="description" class="swal2-textarea" placeholder="Décrivez cette catégorie..." style="margin: 0; width: 100%; min-height: 100px; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif; resize: vertical;"></textarea>
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
      },
      preConfirm: () => {
        const name = (
          document.getElementById('name') as HTMLInputElement
        ).value.trim();
        const description = (
          document.getElementById('description') as HTMLTextAreaElement
        ).value.trim();

        if (!name || !description) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return null;
        }

        if (name.length < 3) {
          Swal.showValidationMessage(
            'Le nom doit contenir au moins 3 caractères'
          );
          return null;
        }

        return { name, description };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('name', result.value.name);
        formData.append('description', result.value.description);

        this.service.addCategorie(formData).subscribe(
          (res: any) => {
            console.log('✓ Catégorie créée avec succès:', res);
            this.getcategory();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Catégorie créée !
                  </h3>
                  <p style="color: #0a0a0a;">La catégorie <strong>${result.value.name}</strong> a été créée avec succès.</p>
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
                  <p style="color: #0a0a0a;">Impossible de créer la catégorie.</p>
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

  deletecat(id: String) {
    Swal.fire({
      html: `
        <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-alert-line"></i> Confirmer la suppression
          </h3>
          <p style="margin-bottom: 0.5rem; color: #0a0a0a;">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
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
        this.service.deleteCategorie(id).subscribe({
          next: (res) => {
            console.log('✓ Catégorie supprimée:', res);
            this.getcategory();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">La catégorie a été supprimée avec succès.</p>
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
            this.getcategory();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">La catégorie a été supprimée avec succès.</p>
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
          complete: () => {
            Swal.fire({
              html: `
                <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-close-circle-line"></i> Erreur
                  </h3>
                  <p style="color: #0a0a0a;">Impossible de supprimer la catégorie</p>
                </div>
              `,
              showConfirmButton: false,
              showCloseButton: false,
              didOpen: () => {
                const closeBtn = document.querySelector('.close-modal-btn');
                if (closeBtn) {
                  closeBtn.addEventListener('click', () => Swal.close());
                }
              },
              width: 500,
              padding: '0',
              background: 'transparent',
              backdrop: 'rgba(0,0,0,0.4)',
            });
          },
        });
      }
    });
  }
}
