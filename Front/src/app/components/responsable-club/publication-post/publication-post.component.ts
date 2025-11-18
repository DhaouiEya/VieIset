import { Component, OnInit } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';
import { Poste, PosteService } from '../../../services/poste.service';

@Component({
  selector: 'app-publication-post',
  imports: [DatePipe,ReactiveFormsModule,CommonModule, ResponsableMenuComponent],
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

    constructor(private posteService: PosteService, private fb: FormBuilder) { }

      ngOnInit(): void {
         this.posteForm = this.fb.group({
      titre: ['', Validators.required],
      //description: ['', Validators.required]
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

    // SweetAlert de confirmation
    import('sweetalert2').then((Swal) => {
      Swal.default.fire({
        title: 'Confirmer la publication',
        html: `
          <div style="text-align: left;">
            <p><strong>Titre :</strong> ${this.posteForm.value.titre}</p>
            <p><strong>Description :</strong> ${this.posteForm.value.description}</p>
            ${this.selectedImage ? `<p><strong>Image :</strong> ${this.selectedImage.name}</p>` : ''}
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
    this.posteService.updateEtat(poste._id.toString(), 'cloturé').subscribe({
      next: updatedPost => {
        poste.etat = updatedPost.etat;
        this.loadPostes(); // Recharger la liste pour refléter les changements
      },
      error: err => console.error('Erreur lors de la clôture', err)
    });
  }
}
