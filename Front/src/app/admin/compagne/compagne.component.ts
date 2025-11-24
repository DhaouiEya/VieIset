import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CompagneService } from '../../services/compagne.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { DatePipe, SlicePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { DemandeDonService } from '../../services/demandedon.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'; // ← AJOUTE CETTE LIGNE
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compagne',
  imports: [ReactiveFormsModule, AdminMenuComponent, DatePipe,NgbPaginationModule,NgbModule,SlicePipe],
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent implements OnInit {

  // === Formulaire ===
  compagneForm!: FormGroup;

  // === Données ===
  etudiants: any[] = [];
  compagnes: any[] = [];           // Toutes les campagnes (du serveur)
  campagnesPage: any[] = [];       // Campagnes affichées sur la page courante
  totalCampagnes = 0;

  // === Pagination ===
  currentPage = 1;
  itemsPerPage = 12; // Tu peux changer : 8, 12, 16, 20...

  // === Valeurs temporaires (si besoin pour affichage global) ===
  montantCollecte = 250;
  objectif = 1000;
  progression = 0;

  constructor(
    private fb: FormBuilder,
    private compagneService: CompagneService,
    private userService: UsersService,
    private demandeDonService: DemandeDonService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEtudiantsAvecDemande();
    this.getAllCompagnes(); // Chargera aussi la pagination
  }

  // Initialisation du formulaire + validateur personnalisé
  private initForm(): void {
    this.compagneForm = this.fb.group({
      title: ['aide_etudiant', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      objectif_montant: [0, [Validators.required, Validators.min(1)]],
      beneficiaire: ['', Validators.required]
    }, { validators: this.dateValidator });
  }

  // Validateur personnalisé : dateFin > dateDebut
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const debut = control.get('dateDebut')?.value;
    const fin = control.get('dateFin')?.value;

    if (debut && fin && new Date(debut) >= new Date(fin)) {
      return { dateInvalide: true };
    }
    return null;
  }

  // Chargement des étudiants qui ont une demande (ou tous les étudiants)
  loadEtudiantsAvecDemande(): void {
    this.demandeDonService.getEtudiantsAyantDemande().subscribe({
      next: (res) => {
        this.etudiants = res;
      },
      error: (err) => {
        console.error('Erreur récupération étudiants →', err);
        Swal.fire('Erreur', 'Impossible de charger la liste des bénéficiaires.', 'error');
      }
    });
  }

  // Récupération de toutes les campagnes + mise à jour pagination
  getAllCompagnes(): void {
    this.compagneService.getAllCompagnes().subscribe({
      next: (res: any[]) => {
        this.compagnes = res;
        this.totalCampagnes = res.length;
        this.updatePage(); // Applique la pagination
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', 'Impossible de charger les campagnes.', 'error');
      }
    });
  }

  // Mise à jour des campagnes affichées selon la page courante
  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.campagnesPage = this.compagnes.slice(start, end);
  }

  // Appelée par ngb-pagination (pageChange)
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }

  // --- Helpers pour le template ---
  progressPercent(campagne: any): number {
    if (!campagne.objectif_montant || campagne.objectif_montant <= 0) return 0;
    const percent = (campagne.montant_collecte / campagne.objectif_montant) * 100;
    return Math.min(100, Math.round(percent * 10) / 10); // 1 décimale
  }

  isCompleted(campagne: any): boolean {
    return campagne.montant_collecte >= campagne.objectif_montant;
  }

  // --- Soumission du formulaire ---
  onSubmit(): void {
    if (this.compagneForm.valid) {
      Swal.fire({
        title: 'Publier la campagne ?',
        text: 'Êtes-vous sûr de vouloir publier cette campagne de dons ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, publier',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.compagneService.createCompagne(this.compagneForm.value).subscribe({
            next: (res) => {
              Swal.fire('Succès', 'Campagne publiée avec succès !', 'success');
              this.compagneForm.reset({
                title: 'aide_etudiant',
                objectif_montant: 0
              });
              this.getAllCompagnes(); // Recharge tout (et réinitialise la pagination)
            },
            error: (err) => {
              console.error(err);
              Swal.fire('Erreur', 'Une erreur est survenue lors de la publication.', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Formulaire invalide',
        text: this.getFormErrorMessage(),
        icon: 'warning'
      });
    }
  }

  // Message d'erreur personnalisé
  getFormErrorMessage(): string {
    const form = this.compagneForm;

    if (form.errors?.['dateInvalide']) {
      return 'La date de fin doit être postérieure à la date de début.';
    }

    for (const controlName in form.controls) {
      const control = form.get(controlName);
      if (control?.errors?.['required']) {
        const labels: { [key: string]: string } = {
          title: 'Type de campagne',
          description: 'Description',
          dateDebut: 'Date de début',
          dateFin: 'Date de fin',
          objectif_montant: 'Objectif montant',
          beneficiaire: 'Bénéficiaire'
        };
        return `${labels[controlName] || controlName} est obligatoire.`;
      }
      if (control?.errors?.['min']) {
        return `L'objectif doit être supérieur à 0.`;
      }
    }

    return 'Veuillez corriger les erreurs du formulaire.';
  }

  supprimerCampagne(campagneId: string) {
  Swal.fire({
    title: 'Supprimer cette campagne ?',
    text: 'Cette action est irréversible ! La campagne et tous ses dons seront perdus.',
    icon: 'warning',
    iconColor: '#f8bb86',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '<i class="fas fa-trash me-1"></i> Oui, supprimer',
    cancelButtonText: '<i class="fas fa-times me-1"></i> Annuler',
    reverseButtons: true,
    padding: '2rem',
    backdrop: true,
    allowOutsideClick: false,
    heightAuto: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.compagneService.deleteCompagne(campagneId).subscribe({
        next: () => {
          // Succès avec animation
          Swal.fire({
            title: 'Supprimée !',
            text: 'La campagne a été supprimée avec succès.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: false
          });

          // Recharge les campagnes (et remet la pagination à la page 1)
          this.currentPage = 1;
          this.getAllCompagnes();
        },
        error: (err) => {
          console.error('Erreur suppression campagne:', err);
          Swal.fire({
            title: 'Erreur',
            text: err.error?.message || 'Impossible de supprimer la campagne. Réessayez plus tard.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  });
}
}
