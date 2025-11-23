import { Component, OnInit } from '@angular/core';
import { AnnonceService, Annonce } from '../../services/annonce.service';
import { NgForm } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';
import { EtudiantBannerComponent } from "../etudiant-banner/etudiant-banner.component";

@Component({
  selector: 'app-logement',
  imports: [DatePipe, FormsModule, FooterComponent, EtudiantBannerComponent],
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.css']
})
export class LogementComponent implements OnInit {
  annonces: Annonce[] = [];
  newAnnonce: Annonce = { titre: '', description: '' };

  // Propriétés de pagination
  currentPage = 1;
  itemsPerPage = 5; // Nombre d'annonces par page
  paginatedAnnonces: Annonce[] = [];
  totalPages = 0;

  constructor(private annonceService: AnnonceService) { }

  ngOnInit(): void {
    this.loadAnnonces();
  }

  // Charger toutes les annonces
  loadAnnonces(): void {
    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces = data;
        this.updatePagination();
      },
      error: (err) => console.error('Erreur lors du chargement des annonces', err)
    });
  }

  // Mettre à jour la pagination
  updatePagination(): void {
    this.totalPages = Math.ceil(this.annonces.length / this.itemsPerPage);
    this.updatePaginatedAnnonces();
  }

  // Mettre à jour les annonces paginées
  updatePaginatedAnnonces(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAnnonces = this.annonces.slice(startIndex, endIndex);
  }

  // Aller à une page spécifique
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAnnonces();

      // Faire défiler vers le haut de la liste
      const annoncesList = document.querySelector('.annonces-list');
      if (annoncesList) {
        annoncesList.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Obtenir les numéros de pages à afficher
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si le total est petit
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Afficher une plage de pages autour de la page actuelle
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, this.currentPage + 2);

      // Ajuster pour toujours afficher maxVisiblePages pages
      if (endPage - startPage < maxVisiblePages - 1) {
        if (startPage === 1) {
          endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  // Soumettre le formulaire
  onSubmit(form: NgForm): void {
    // Validation simple
    if (form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Confirmation avant ajout
    Swal.fire({
      title: 'Confirmer l\'ajout',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Titre :</strong> ${this.newAnnonce.titre}</p>
          <p><strong>Description :</strong> ${this.newAnnonce.description}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, ajouter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé, procéder à l'ajout
        this.annonceService.createAnnonce(this.newAnnonce).subscribe({
          next: (data) => {
            this.annonces.unshift(data); // ajoute la nouvelle annonce en haut
            this.newAnnonce = { titre: '', description: '' }; // reset du formulaire
            form.resetForm();

            // Retourner à la première page après l'ajout
            this.currentPage = 1;
            this.updatePagination();

            Swal.fire({
              icon: 'success',
              title: 'Annonce ajoutée !',
              text: 'Votre annonce a été créée avec succès.',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (err) => {
            console.error('Erreur lors de la création de l\'annonce', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la création de l\'annonce.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }
}
