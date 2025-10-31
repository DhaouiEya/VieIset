import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';
import { FormulairesService } from '../../../services/formulaires.service';
import { DemandeAdhesionService } from '../../../services/demande-adhesion.service';
import { DemandeAdhesion } from '../../../models/demande-adhesion';
import 'lord-icon-element';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-participation-forms',
  imports: [FormsModule, CommonModule, ResponsableMenuComponent],
  templateUrl: './participation-forms.component.html',
  styleUrl: './participation-forms.component.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ParticipationFormsComponent implements OnInit, OnDestroy{
  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }
  // dashboard.component.ts
filterStatus: string = 'all'; // valeurs possibles: 'all', 'acceptée', 'refusée'

  spreadsheetId = '';
  //etudiants: any[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage: number = 0;
  pageSize: number = 10;
  demandes: DemandeAdhesion[] = [];
  // Modal / form state
  showModal = false;
  activeDemande?: DemandeAdhesion | null = null;
  dateInputs: string[] = []; 
  readonly formulairesService : FormulairesService=inject(FormulairesService);
  readonly demandeService : DemandeAdhesionService=inject(DemandeAdhesionService);
  private pollingSubscription?: Subscription;
   ngOnInit() {
     this.chargerDemandesExistantes();
      this.pollingSubscription = interval(1000).subscribe(() => {
      this.chargerDemandesExistantes();
    });
  }

chargerDemandesExistantes() {
  this.isLoading = true;
  this.demandeService.getDemandes().subscribe({
    next: (res) => {
      this.demandes = res || [];
      console.log('Demandes chargées:', this.demandes);
      
    },
    error: (err) => {
      console.error("Erreur lors du chargement des demandes existantes :", err);
     
    }
  });
}

 importerDemandes() {
  if (!this.spreadsheetId.trim()) {
    alert("Veuillez saisir un Spreadsheet ID !");
    return;
  }

  this.isLoading = true;
  this.formulairesService.getDemandeBySheet(this.spreadsheetId).subscribe({
    next: (res) => {
      console.log('Import réussi:', res);
      const nouvellesDemandes = res.data || [];

      // ✅ Fusionner sans doublons (basé sur _id, ou étudiant+club)
      nouvellesDemandes.forEach((nouvelle) => {
        const existe = this.demandes.some(
          (d) =>
            d._id === nouvelle._id ||
            (d.etudiant?._id === nouvelle.etudiant?._id &&
             d.club?._id === nouvelle.club?._id)
        );

        if (!existe) {
          this.demandes.push(nouvelle);
        }
      });

      this.isLoading = false;
      alert("Import réussi !");
      console.log('Demandes après fusion:', this.demandes);
    },
    error: (err) => {
      console.error('Erreur import:', err);
      this.isLoading = false;
    }
  });
}

 
 getPaginatedDemandes(): DemandeAdhesion[] {
    const startIndex = this.currentPage * this.pageSize;
    
    return this.demandes.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.demandes.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  previousPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(total - 1, startPage + 4);

    if (endPage - startPage < 4 && startPage > 0) {
      startPage = Math.max(0, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }

  trackById(index: number, item: any): any {
    return item._id || index;
  }

   // Ouvrir modal pour une demande donnée
  // --- 🟢 Ouvrir le modal pour une demande ---
  openModal(d: DemandeAdhesion) {
    this.activeDemande = d;
    this.dateInputs = ['']; // un champ par défaut
    this.showModal = true;
  }

  // --- 🟢 Ajouter/Supprimer un champ date ---
  addDateField() {
    this.dateInputs.push('');
  }
  removeDateField(index: number) {
    this.dateInputs.splice(index, 1);
  }

  // --- 🟢 Fermer le modal ---
  closeModal() {
    this.showModal = false;
    this.activeDemande = null;
    this.dateInputs = [];
  }

  // --- 🟢 Envoyer les dates au backend ---
  envoyerDates() {
    if (!this.activeDemande) return;

    const isoDates = this.dateInputs
      .map(v => new Date(v).toISOString())
      .filter(v => !isNaN(Date.parse(v)));

    if (isoDates.length === 0) {
       Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Veuillez ajouter au moins une date.'
    });
      return;
    }

    this.demandeService
      .sendDates(this.activeDemande._id!, isoDates)
      .subscribe({
        next: (res) => {
          Swal.fire({
          icon: 'success',
          title: 'Email envoyé',
          html: `Les créneaux ont été envoyés avec succès.`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
          // mettre à jour la demande dans la liste
          const updated = res.demande || res;
          this.demandes = this.demandes.map(d => d._id === updated._id ? updated : d);
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
             Swal.fire('Erreur', err.error?.message || 'Une erreur est survenue', 'error');
        }
      });
  }
  
  getFilteredDemandes() {
  if (this.filterStatus === 'all') {
    return this.demandes;
  }
  return this.demandes.filter(d => d.statut === this.filterStatus);
}

}
