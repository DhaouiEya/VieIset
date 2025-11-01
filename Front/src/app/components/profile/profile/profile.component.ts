import { AuthService } from './../../../services/auth.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import Swal from 'sweetalert2';
import { passwordValidator } from '../../validators/password.validator';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
   user!: any;
  originalUser: any;
  editable: boolean = false;
  profileForm!: FormGroup;
    hasError = false;
  message = '';


  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.authService.getUserByToken().subscribe((user) => {
      this.user = { ...user };
      this.originalUser = { ...user };
      this.initForm();
    });
  }

  initForm() {
    // Email et password en lecture seule si user.googleId
    const emailValidators = this.user.googleId ? [] : [Validators.required, Validators.email];
    const passwordValidators = this.user.googleId ? [] : [Validators.minLength(6),Validators.maxLength(50)];

    this.profileForm = this.fb.group({
      firstName: [this.user.firstName || '', Validators.required],
      lastName: [this.user.lastName || '', Validators.required],
      email: [this.user.email || '', emailValidators],
      address: [this.user.address || ''],
  password: ['', [Validators.required, passwordValidator]] ,
    });
  }
  lastUpdate = new Date();


  toggleEdit() {
    this.editable = true;
  }

  saveProfile() {
    if (this.profileForm.invalid) return

    const updatedData = { ...this.profileForm.value };

    // Si password vide, on ne l'envoie pas
    if (!updatedData.password) delete updatedData.password;

    this.authService.updateUserProfile(updatedData).subscribe({
      next: () => {
        this.editable = false;
        this.originalUser = { ...updatedData };
        this.initForm();
        Swal.fire({
          icon: 'success',
          title: 'Profil mis à jour',
          text: 'Vos informations ont été sauvegardées avec succès!',
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
         this.hasError = true;
    this.message = err.error?.message || 'Erreur lors de la connexion';
        console.error('Erreur mise à jour profil:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de mettre à jour le profil. Veuillez réessayer.',
          confirmButtonText: 'OK'
        });
      }
    });
  }


  getControlClass(controlName: string): any {
    const control = this.profileForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid && (control?.dirty || control?.touched),
    };
  }

  cancelEdit() {
    this.profileForm.reset(this.originalUser);
    this.editable = false;
  }
}
