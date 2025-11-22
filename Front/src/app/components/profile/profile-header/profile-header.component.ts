import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProfileViewComponent } from "../profile-view/profile-view.component";
import { ProfileEditComponent } from "../profile-edit/profile-edit.component";
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile-header',
  imports: [ProfileViewComponent, ProfileEditComponent,NgClass],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent implements OnInit{
  activeTab = signal<'Overview' | 'Settings'>('Overview');

   user!: any;
    hasError = false;
  message = '';


  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.authService.getUserByToken().subscribe((user) => {
      this.user = user;
    });
  }


  switchToTab(tab: 'Overview' | 'Settings'): void {
    this.activeTab.set(tab);
  }

  handleSaveChanges(updatedData: Partial<any>): void {

       console.log('Données mises à jour reçues du composant enfant :', updatedData);

        this.authService.updateUserProfile(updatedData).subscribe({
          next: (res) => {
         this.user = res.user;
         console.log('Profil mis à jour avec succès:', res);

          this.cdr.detectChanges()

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

}
