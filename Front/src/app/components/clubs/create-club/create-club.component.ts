import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // You were missing the Router import!
import Swal from 'sweetalert2';
// import { Club } from '../../../models/club'; // Assuming this import exists and is correct
import { ClubService } from '../../../services/club.service';
import { ResponsableMenuComponent } from '../../../responsable-club/responsable-menu/responsable-menu.component';

@Component({
  selector: 'app-create-club',
  standalone: true, // Assuming a modern Angular project using standalone components
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
    ResponsableMenuComponent

  ],
  providers: [
    provideNativeDateAdapter(), // Required for MatDatepicker
  ],
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateClubComponent implements OnInit {
  // File handlers and previews
  selectedProfil: File | null = null;
  selectedFond: File | null = null;
  previewProfil: string | null = null;
  previewFond: string | null = null;

  // Dependency Injection using `inject`
  private fb = inject(FormBuilder);
  private readonly clubService: ClubService = inject(ClubService);
  private router = inject(Router);
  // private dialogRef = inject(MatDialogRef<CreateClubComponent>); // If this component is used as a dialog, you'll need this line.

  clubForm!: FormGroup;


  ngOnInit(): void {
    console.log('Initialisation du formulaire de création de club');
    this.clubForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageProfil: ['', Validators.required], // Will store the File object or a placeholder
      imageFond: ['', Validators.required], // Will store the File object or a placeholder
      dateCreation: ['', Validators.required],
      departement: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: [
        '',
        [
          Validators.required,Validators.pattern('[2|5|9][0-9]{7}')

        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      facebook: [''],
      instagram: [''],
    });
    console.log('Formulaire initialisé :', this.clubForm);
  }


  onFileSelected(event: any, type: 'profil' | 'fond'): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'profil') {
        this.selectedProfil = file;
        this.previewProfil = reader.result as string;
        // Patch the form value with the File object and validate
        this.clubForm.patchValue({ imageProfil: file });
        this.clubForm.get('imageProfil')?.updateValueAndValidity();
      } else {
        this.selectedFond = file;
        this.previewFond = reader.result as string;
        // Patch the form value with the File object and validate
        this.clubForm.patchValue({ imageFond: file });
        this.clubForm.get('imageFond')?.updateValueAndValidity();
      }
    };
    reader.readAsDataURL(file);
  }

  isSubmitting = false;
  createClub(event: Event): void {
    event.preventDefault();

    if (this.clubForm.valid) {
      const formData = new FormData();

      // Append all form fields (text/date)
      formData.append('nom', this.clubForm.value.nom);
      formData.append('description', this.clubForm.value.description);
      formData.append('dateCreation', this.clubForm.value.dateCreation);
      formData.append('departement', this.clubForm.value.departement);
      formData.append('adresse', this.clubForm.value.adresse);
      formData.append('telephone', this.clubForm.value.telephone);
      formData.append('email', this.clubForm.value.email);
      formData.append('facebook', this.clubForm.value.facebook);
      formData.append('instagram', this.clubForm.value.instagram);

      //  IMPORTANT: You must replace this hardcoded ID with the actual manager ID (e.g., from an authentication service).
      formData.append('manager', '670b09f72df8b3a34d82a5a1');

      // Append files only if they exist
      if (this.selectedProfil) {
        formData.append('imageProfil', this.selectedProfil);
      }
      if (this.selectedFond) {
        formData.append('imageFond', this.selectedFond);
      }
      // Call the service to create the club
      this.clubService.createClub(formData).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Succès',
            text: 'Club créé avec succès 🎉',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          })
            this.isSubmitting = false;
             this.clubForm.reset();
              this.previewProfil = null;
              this.previewFond = null;
              this.selectedProfil = null;
              this.selectedFond = null;
          // If used as a dialog, close it after creation
          // this.dialogRef.close(res);

        },
        error: (err) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la création du club.',
            icon: 'error',
          });
          console.error(err);
        },
      });
    } else {
      // Mark all controls as touched to display validation errors
      this.clubForm.markAllAsTouched();
      Swal.fire({
        title: 'Attention',
        text: 'Veuillez remplir tous les champs requis.',
        icon: 'warning',
      });
    }
  }
}
