import { Component, OnInit } from '@angular/core';
import { PosteService, Poste } from '../../services/poste.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';
import { PosteInformationsComponent } from '../poste-informations/poste-informations.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { c } from "../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";

@Component({
  selector: 'app-publication-post',
  imports: [DatePipe, ReactiveFormsModule, CommonModule, ResponsableMenuComponent],
  templateUrl: './publication-post.component.html',
  styleUrl: './publication-post.component.css'
})
export class PublicationPostComponent implements OnInit {
  postes: Poste[] = [];
  posteForm!: FormGroup;
  selectedImage: File | null = null;
  selectedVideo: File | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

    constructor(private posteService: PosteService, private fb: FormBuilder,private modalService: NgbModal) { }

      ngOnInit(): void {
         this.posteForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['']
    });
    this.loadPostes();
  }
    loadPostes() {
    this.posteService.getAllPostes().subscribe(data => {
      this.postes = data;
      this.totalPages = Math.ceil(this.postes.length / this.itemsPerPage);
    });
  }

  get paginatedPostes(): Poste[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.postes.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

    // Gestionnaire pour la sélection d'image
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  // Gestionnaire pour la sélection de vidéo
  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideo = file;
    }
  }

   // Création avec partage immédiat
 partagerPoste() {
    if (this.posteForm.invalid) {
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'warning',
          title: 'Champs obligatoires',
          text: 'Veuillez remplir tous les champs obligatoires.',
          confirmButtonColor: '#3085d6'
        });
      });
      return;
    }

    // Prepare an object URL for the image preview (if provided)
    const imagePreviewUrl: string | null = this.selectedImage ? URL.createObjectURL(this.selectedImage) : null;

    // SweetAlert de confirmation
    import('sweetalert2').then((Swal) => {
      Swal.default.fire({
        title: 'Confirmer la publication',
        html: `
          <div style="text-align: left;">
            <p><strong>Titre :</strong> ${this.posteForm.value.titre}</p>
            <p><strong>Description :</strong> ${this.posteForm.value.description}</p>
            ${this.selectedImage ? `<div><p><strong>Image :</strong> ${this.selectedImage.name}</p><img src="${imagePreviewUrl}" style="max-width:100%;height:auto;display:block;margin-top:10px;border-radius:4px;"/></div>` : ''}
            ${this.selectedVideo ? `<p><strong>Vidéo :</strong> ${this.selectedVideo.name}</p>` : ''}
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, publier !',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.publierPoste();
        }
      }).finally(() => {
        // Revoke the object URL to avoid memory leaks
        if (imagePreviewUrl) {
          try {
            URL.revokeObjectURL(imagePreviewUrl);
          } catch (e) {
            console.debug('Failed to revoke object URL for image preview', e);
          }
        }
      });
    });
  }

  // Méthode séparée pour la publication effective
  private publierPoste() {
    const formData = new FormData();
    formData.append('titre', this.posteForm.value.titre);
    formData.append('description', this.posteForm.value.description);
    formData.append('partager', 'true');

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    // Afficher un indicateur de chargement
    import('sweetalert2').then((Swal) => {
      Swal.default.fire({
        title: 'Publication en cours...',
        text: 'Veuillez patienter',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.default.showLoading();
        }
      });

      this.posteService.createPosteWithFiles(formData).subscribe({
        next: (poste) => {
          Swal.default.fire({
            icon: 'success',
            title: 'Publié !',
            text: 'Votre publication a été partagée avec succès',
            confirmButtonColor: '#3085d6'
          });

          this.posteForm.reset();
          this.selectedImage = null;
          this.selectedVideo = null;
          this.loadPostes();
        },
        error: (err) => {
          console.error('Erreur lors de la création du poste', err);
          Swal.default.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la publication',
            confirmButtonColor: '#d33'
          });
        }
      });
    });
  }



cloturerPoste(poste: Poste) {
  if (!poste._id) return;

  // SweetAlert de confirmation
  import('sweetalert2').then((Swal) => {
    Swal.default.fire({
      title: 'Confirmer la clôture',
      html: `
        <div style="text-align: center;">
          <div style="font-size: 48px; color: #ff6b6b; margin-bottom: 15px;">🔒</div>
          <h4 style="color: #2c3e50; margin-bottom: 10px;">Clôturer cette publication ?</h4>
          <p style="color: #6c757d;">
            <strong>"${poste.titre}"</strong><br>
            Cette action empêchera les nouvelles interactions.
          </p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="fas fa-lock"></i> Oui, clôturer',
      cancelButtonText: '<i class="fas fa-times"></i> Annuler',
      reverseButtons: true,
      customClass: {
        popup: 'custom-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.executerCloture(poste);
      }
    });
  });
}

// Méthode séparée pour exécuter la clôture
private executerCloture(poste: Poste) {
  this.posteService.updateEtat(poste._id!.toString(), 'cloturé').subscribe({
    next: updatedPost => {
      // SweetAlert de succès
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          title: '<span style="color: #28a745">✅ Publication clôturée</span>',
          html: `
            <div style="text-align: center;">
              <p style="color: #495057;">
                La publication <strong>"${poste.titre}"</strong><br>
                a été clôturée avec succès.
              </p>
              <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <small style="color: #6c757d;">
                  <i class="fas fa-info-circle"></i>
                  Les utilisateurs ne peuvent plus interagir avec cette publication.
                </small>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#28a745',
          confirmButtonText: '<i class="fas fa-check"></i> Compris'
        });
      });

      poste.etat = updatedPost.etat;
      this.loadPostes(); // Recharger la liste pour refléter les changements
    },
    error: err => {
      console.error('Erreur lors de la clôture', err);

      // SweetAlert d'erreur
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          title: '<span style="color: #dc3545">❌ Erreur</span>',
          html: `
            <div style="text-align: center;">
              <p style="color: #495057;">
                Une erreur est survenue lors de la clôture de la publication.
              </p>
              <div style="margin-top: 10px; padding: 10px; background: #f8d7da; border-radius: 6px;">
                <small style="color: #721c24;">
                  <i class="fas fa-exclamation-triangle"></i>
                  Veuillez réessayer plus tard.
                </small>
              </div>
            </div>
          `,
          icon: 'error',
          confirmButtonColor: '#dc3545',
          confirmButtonText: '<i class="fas fa-redo"></i> Réessayer'
        });
      });
    }
  });
}

openModal(poste: Poste) {
  const modalRef = this.modalService.open(PosteInformationsComponent, { size: 'lg', centered: true });
  modalRef.componentInstance.poste = poste;

  modalRef.result.then((result) => {
    if (result === 'deleted') {
      this.loadPostes(); // Recharge la liste
    }
  }).catch(() => {});
}
}
