import { Component, OnInit } from '@angular/core';
import { PosteService, Poste } from '../../services/poste.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';

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
      description: ['', Validators.required]
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
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

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

    this.posteService.createPosteWithFiles(formData).subscribe({
      next: (poste) => {
        console.log('✅ Poste créé et partagé', poste);
        this.posteForm.reset();
        this.selectedImage = null;
        this.selectedVideo = null;
        this.loadPostes();
      },
      error: (err) => console.error('Erreur lors de la création du poste', err)
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
