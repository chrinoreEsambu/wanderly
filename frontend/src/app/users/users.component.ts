import { Component, OnInit } from '@angular/core';
import { AllmyservicesService } from '../services/allmyservices.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  constructor(private service: AllmyservicesService) {}
  Listusers: any;
  ngOnInit(): void {
    this.getusers();
  }
  getusers() {
    this.service.Allusers().subscribe(
      (data) => {
        console.log(data);
        this.Listusers = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewuser(id: String) {
    this.service.oneUser(id).subscribe(
      (res: any) => {
        console.log('Fetched data:', res);
        const imageUrl = `${environment.baseUrl}/user/files/${res.photo}`;
        Swal.fire({
          html: `
            <div style="border: 1px solid #0a0a0a; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Détails de l'utilisateur</h3>
              <div style="text-align: center; margin-bottom: 1rem;">
                <img src="${imageUrl}" alt="Photo" style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%; margin-bottom: 1rem; border: 2px solid #0a0a0a;" />
              </div>
              <div style="text-align: left;">
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Nom d'utilisateur:</strong> ${res.username}</p>
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Email:</strong> ${res.email}</p>
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Prénom:</strong> ${res.firstname}</p>
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Nom:</strong> ${res.lastname}</p>
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Rôle:</strong> <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 4px;">${res.role}</span></p>
                <p style="margin: 0.5rem 0; color: #0a0a0a;"><strong>Téléphone:</strong> ${res.phone}</p>
              </div>
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

  edituser(id: String) {
    this.service.oneUser(id).subscribe(
      (res: any) => {
        console.log('Fetched user:', res);
        const imageUrl = `${environment.baseUrl}/user/files/${res.photo}`;

        Swal.fire({
          html: `
            <div style="border: 1px solid #FF2900; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #FF2900; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-user-settings-line"></i> Modifier l'utilisateur
              </h3>

              <div style="text-align: center; margin-bottom: 1.5rem;">
                <img src="${imageUrl}" alt="Photo actuelle" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid #FF2900;" />
              </div>

              <div style="text-align: left; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                  <i class="ri-user-line"></i> Nom d'utilisateur
                </label>
                <input id="username" class="swal2-input" value="${
                  res.username
                }" style="margin: 0; width: 100%;">
              </div>

              <div style="text-align: left; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                  <i class="ri-mail-line"></i> Email
                </label>
                <input id="email" type="email" class="swal2-input" value="${
                  res.email
                }" style="margin: 0; width: 100%;">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div style="text-align: left;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                    <i class="ri-user-smile-line"></i> Prénom
                  </label>
                  <input id="firstname" class="swal2-input" value="${
                    res.firstname
                  }" style="margin: 0; width: 100%;">
                </div>
                <div style="text-align: left;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                    <i class="ri-user-smile-line"></i> Nom
                  </label>
                  <input id="lastname" class="swal2-input" value="${
                    res.lastname
                  }" style="margin: 0; width: 100%;">
                </div>
              </div>

              <div style="text-align: left; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                  <i class="ri-shield-user-line"></i> Rôle
                </label>
                <select id="role" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
                  <option value="client" ${
                    res.role?.toLowerCase() === 'client' ? 'selected' : ''
                  }>🔵 Client</option>
                  <option value="admin" ${
                    res.role?.toLowerCase() === 'admin' ? 'selected' : ''
                  }>🔴 Administrateur</option>
                </select>
              </div>

              <div style="text-align: left; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                  <i class="ri-phone-line"></i> Téléphone
                </label>
                <input id="phone" type="tel" class="swal2-input" value="${
                  res.phone
                }" style="margin: 0; width: 100%;">
              </div>

              <div style="text-align: left; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                  <i class="ri-image-line"></i> Nouvelle photo (optionnel)
                </label>
                <input id="photo" type="file" accept="image/*" class="swal2-file" style="margin: 0; width: 100%; padding: 0.75rem; border: 2px dashed #d1d5db; border-radius: 8px; background: #f9fafb;">
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">Laissez vide pour garder l'ancienne photo</p>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '<i class="ri-check-line"></i> Modifier',
          cancelButtonText: '<i class="ri-close-line"></i> Annuler',
          confirmButtonColor: '#000',
          cancelButtonColor: '#FF2100',
          width: 650,
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
            const username = (
              document.getElementById('username') as HTMLInputElement
            ).value.trim();
            const email = (
              document.getElementById('email') as HTMLInputElement
            ).value.trim();
            const firstname = (
              document.getElementById('firstname') as HTMLInputElement
            ).value.trim();
            const lastname = (
              document.getElementById('lastname') as HTMLInputElement
            ).value.trim();
            const role = (document.getElementById('role') as HTMLSelectElement)
              .value;
            const phone = (
              document.getElementById('phone') as HTMLInputElement
            ).value.trim();
            const photoInput = document.getElementById(
              'photo'
            ) as HTMLInputElement;
            const photoFile = photoInput?.files?.[0];

            if (
              !username ||
              !email ||
              !firstname ||
              !lastname ||
              !role ||
              !phone
            ) {
              Swal.showValidationMessage(
                'Tous les champs (sauf photo) sont requis'
              );
              return null;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              Swal.showValidationMessage('Email invalide');
              return null;
            }

            return {
              username,
              email,
              firstname,
              lastname,
              role,
              phone,
              photoFile,
            };
          },
        }).then((editResult) => {
          if (editResult.isConfirmed) {
            const formData = new FormData();
            formData.append('username', editResult.value.username);
            formData.append('email', editResult.value.email);
            formData.append('firstname', editResult.value.firstname);
            formData.append('lastname', editResult.value.lastname);
            formData.append('role', editResult.value.role);
            formData.append('phone', editResult.value.phone);

            if (editResult.value.photoFile) {
              formData.append('file', editResult.value.photoFile);
            }

            this.service.updateUser(formData, id).subscribe(
              () => {
                this.getusers();
                Swal.fire({
                  html: `
                    <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                      <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                        <i class="ri-close-line"></i>
                      </button>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-check-line"></i> Modifié !
                      </h3>
                      <p style="color: #0a0a0a;">L'utilisateur a été modifié avec succès.</p>
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
                console.error('Update error:', error);
                Swal.fire({
                  html: `
                    <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                      <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                        <i class="ri-close-line"></i>
                      </button>
                      <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ri-close-circle-line"></i> Erreur
                      </h3>
                      <p style="color: #0a0a0a;">Impossible de modifier l'utilisateur.</p>
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
        console.error('Error fetching user:', error);
        Swal.fire({
          html: `
            <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
              <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                <i class="ri-close-line"></i>
              </button>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-close-circle-line"></i> Erreur
              </h3>
              <p style="color: #0a0a0a;">Impossible de charger les données de l'utilisateur.</p>
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
  adduser() {
    Swal.fire({
      html: `
        <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-user-add-line"></i> Créer un nouvel utilisateur
          </h3>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-user-line"></i> Nom d'utilisateur
            </label>
            <input id="username" class="swal2-input" placeholder="Nom d'utilisateur" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-mail-line"></i> Email
            </label>
            <input id="email" type="email" class="swal2-input" placeholder="email@exemple.com" style="margin: 0; width: 100%;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div style="text-align: left;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                <i class="ri-user-smile-line"></i> Prénom
              </label>
              <input id="firstname" class="swal2-input" placeholder="Prénom" style="margin: 0; width: 100%;">
            </div>
            <div style="text-align: left;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
                <i class="ri-user-smile-line"></i> Nom
              </label>
              <input id="lastname" class="swal2-input" placeholder="Nom" style="margin: 0; width: 100%;">
            </div>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-shield-user-line"></i> Rôle
            </label>
            <select id="role" class="swal2-select" style="margin: 0; width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-family: Inter, sans-serif;">
              <option value="">Sélectionner un rôle</option>
              <option value="client">🔵 Client</option>
              <option value="admin">🔴 Administrateur</option>
            </select>
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-lock-line"></i> Mot de passe
            </label>
            <input id="password" type="password" class="swal2-input" placeholder="Mot de passe" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-phone-line"></i> Téléphone
            </label>
            <input id="phone" type="tel" class="swal2-input" placeholder="+33 6 12 34 56 78" style="margin: 0; width: 100%;">
          </div>

          <div style="text-align: left; margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #0a0a0a; margin-bottom: 0.5rem;">
              <i class="ri-image-line"></i> Photo de profil
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
      width: 650,
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
        const username = (
          document.getElementById('username') as HTMLInputElement
        ).value.trim();
        const email = (
          document.getElementById('email') as HTMLInputElement
        ).value.trim();
        const firstname = (
          document.getElementById('firstname') as HTMLInputElement
        ).value.trim();
        const lastname = (
          document.getElementById('lastname') as HTMLInputElement
        ).value.trim();
        const role = (document.getElementById('role') as HTMLSelectElement)
          .value;
        const password = (
          document.getElementById('password') as HTMLInputElement
        ).value.trim();
        const phone = (
          document.getElementById('phone') as HTMLInputElement
        ).value.trim();
        const photoInput = document.getElementById('photo') as HTMLInputElement;
        const photoFile = photoInput?.files?.[0];

        if (
          !username ||
          !email ||
          !firstname ||
          !lastname ||
          !role ||
          !password ||
          !phone ||
          !photoFile
        ) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return null;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Email invalide');
          return null;
        }

        if (password.length < 6) {
          Swal.showValidationMessage(
            'Le mot de passe doit contenir au moins 6 caractères'
          );
          return null;
        }

        return {
          username,
          email,
          firstname,
          lastname,
          role,
          password,
          phone,
          photoFile,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = new FormData();
        formData.append('username', result.value.username);
        formData.append('email', result.value.email);
        formData.append('firstname', result.value.firstname);
        formData.append('lastname', result.value.lastname);
        formData.append('role', result.value.role);
        formData.append('password', result.value.password);
        formData.append('phone', result.value.phone);
        formData.append('file', result.value.photoFile);

        this.service.addUser(formData).subscribe(
          (res: any) => {
            this.getusers();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Utilisateur créé !
                  </h3>
                  <p style="color: #0a0a0a;">L'utilisateur <strong>${result.value.username}</strong> a été créé avec succès.</p>
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
                  <p style="color: #0a0a0a;">Impossible de créer l'utilisateur. ${
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
          }
        );
      }
    });
  }

  deleteuser(id: String) {
    Swal.fire({
      html: `
        <div style="border: 1px solid #ef4444; border-radius: 12px; padding: 2rem; background: #fff; position: relative;text-align:center"">
          <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
            <i class="ri-close-line"></i>
          </button>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;text-align:center;justify-content: center;">
            <i class="ri-alert-line"></i> Confirmer la suppression
          </h3>
          <p style="margin-bottom: 0.5rem; color: #0a0a0a;">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
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
        this.service.deleteUser(id).subscribe({
          next: (res) => {
            console.log('✓ Utilisateur supprimé:', res);
            this.getusers();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">L'utilisateur a été supprimé avec succès.</p>
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
            this.getusers();
            Swal.fire({
              html: `
                <div style="border: 1px solid #10b981; border-radius: 12px; padding: 2rem; background: #fff; position: relative;">
                  <button class="close-modal-btn" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; line-height: 1;">
                    <i class="ri-close-line"></i>
                  </button>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="ri-check-line"></i> Supprimé !
                  </h3>
                  <p style="color: #0a0a0a;">L'utilisateur a été supprimé avec succès.</p>
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
                  <p style="color: #0a0a0a;">Impossible de supprimer l'utilisateur</p>
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
        });
      }
    });
  }
}
