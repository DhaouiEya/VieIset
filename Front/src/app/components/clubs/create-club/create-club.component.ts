import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Club } from '../../../models/club';
import { ClubService } from '../../../services/club.service';


@Component({
  selector: 'app-create-club',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css'
})
export class CreateClubComponent implements OnInit{
  

  private fb = inject(FormBuilder);
  private readonly clubService : ClubService = inject(ClubService);
  //private router = inject(Router);

  clubForm!: FormGroup;

  ngOnInit(): void {
    console.log('Initialisation du formulaire de création de club');
    this.clubForm = this.fb.group({
    nom: ['', [Validators.required]],
    description: ['', [Validators.required]],
    imageProfil: ['', Validators.required],
    imageFond: ['', Validators.required],
    dateCreation: ['', Validators.required],
    departement: ['', Validators.required],
    adresse: ['', Validators.required],
    telephone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    facebook: [''],
    instagram: [''],
  });
  console.log('Formulaire initialisé :', this.clubForm);
  }

  createClub(event: Event): void {
    console.log('Création du club...');
    event.preventDefault();
    if (this.clubForm.valid) {
      const f = this.clubForm.value;
      console.log('Formulaire valide, données :', f);
      const manager = "670b09f72df8b3a34d82a5a1";
   
    const newClub: Club = {
  nom: f.nom,
  description: f.description,
  imageProfil: f.imageProfil,
  imageFond: f.imageFond,
  dateCreation: f.dateCreation,
  departement: f.departement,
  adresse: f.adresse,
  telephone: f.telephone,
  email: f.email,
  reseaux: {
    facebook: f.facebook,
    instagram: f.instagram
  },
  manager: manager,
  membres: []
};

      console.log(' Données du club envoyées :', newClub);

      this.clubService.createClub(newClub).subscribe(
        () => {
          Swal.fire({
            title: 'Succès',
            text: 'Le club a été créé avec succès 🎉',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
             console.log('Redirection vers la page des clubs...');
            //this.router.navigate(['/admi/clubs']);
          });
        },
        () => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la création du club.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }
}
