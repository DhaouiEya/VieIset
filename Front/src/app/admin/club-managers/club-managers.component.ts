import { Component ,OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-club-managers',
  standalone: true,
  imports: [AdminMenuComponent],
  templateUrl: './club-managers.component.html',
  styleUrl: './club-managers.component.css'
})

export class ClubManagersComponent implements OnInit{
  managers: any[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers() {
    this.userService.getClubManagers().subscribe({
      next: (res) => this.managers = res,
      error: (err) => console.error(err)
    });
  }

  removeRole(id: string) {

  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Ce responsable va redevenir étudiant.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, retirer',
    cancelButtonText: 'Annuler'
  }).then((result) => {

    if (result.isConfirmed) {
      this.userService.removeClubManager(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès 🎉',
            text: "Le rôle a été retiré avec succès.",
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

          this.loadManagers(); // rafraîchir la liste
        },
        error: (err) => {
          Swal.fire({
            title: 'Erreur',
            text: err.error?.message || "Une erreur est survenue",
            icon: 'error'
          });
        }
      });
    }

  });

}



}
