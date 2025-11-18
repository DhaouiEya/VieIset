import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CompagneService } from '../../services/compagne.service';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-compagne',
  imports: [ReactiveFormsModule,AdminMenuComponent,DatePipe],
  templateUrl: './compagne.component.html',
  styleUrl: './compagne.component.css'
})
export class CompagneComponent implements OnInit {
compagneForm!: FormGroup;
  etudiants: any[] = [];
  compagnes: any[] = [];

  montantCollecte = 250; // exemple de valeur actuelle
  objectif = 1000;       // exemple de valeur d’objectif
  progression = 0;

  constructor(
    private fb: FormBuilder,
    private compagneService: CompagneService,
    private userService: UsersService

  ) {}
// --- Validation personnalisée ---
dateValidator(control: AbstractControl): ValidationErrors | null {
  const debut = control.get('dateDebut')?.value;
  const fin = control.get('dateFin')?.value;

  if (debut && fin && new Date(debut) > new Date(fin)) {
    return { dateInvalide: true };
  }
  return null;
}
 ngOnInit() {
  this.compagneForm = this.fb.group({
    title: ['aide_etudiant', Validators.required], // ← Ajoutez cette ligne
    description: [''],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    objectif_montant: [0, [Validators.required, Validators.min(1)]],
    beneficiaire: ['', Validators.required]

  }, { validators: this.dateValidator });

  this.getAllCompagnes();
  this.loadEtudiants();
}



getFormErrorMessage() {
  const form = this.compagneForm;

  // Vérification du validateur personnalisé
  if (form.errors?.['dateInvalide']) {
    return '⚠️ La date de fin doit être postérieure à la date de début.';
  }

  // Vérification des champs requis
  for (const controlName in form.controls) {
    const control = form.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `⚠️ Le champ "${controlName}" est obligatoire.`;
      }
      if (control.errors['min']) {
        return `⚠️ La valeur du champ "${controlName}" doit être supérieure à ${control.errors['min'].min}.`;
      }
    }
  }

  return 'Formulaire invalide.';
}


onSubmit() {
  if (this.compagneForm.valid) {
    // SweetAlert de confirmation comme avant
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
            Swal.fire({
              title: 'Succès 🎉',
              text: 'Campagne publiée avec succès !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.compagneForm.reset();
            this.getAllCompagnes();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Erreur ❌',
              text: 'Une erreur est survenue lors de la publication.',
              icon: 'error',
              confirmButtonText: 'Fermer'
            });
          }
        });
      }
    });
  } else {
    Swal.fire({
      title: 'Formulaire invalide ⚠️',
      text: this.getFormErrorMessage(),
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}

 loadEtudiants() {
  this.userService.getAllEtudiants().subscribe({
    next: (res) => {
      this.etudiants = res;
      console.log(this.etudiants); // ✅ log ici à l'intérieur de next
    },
    error: (err) => console.error(err)
  });
}


  getAllCompagnes() {
    this.compagneService.getAllCompagnes().subscribe({
      next: (res) => this.compagnes = res,
      error: (err) => console.error(err)
    });
  }
}
