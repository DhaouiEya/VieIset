import { Component, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { NgModel, FormsModule } from '@angular/forms';
import { RoleModalComponent } from "../role-modal/role-modal.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-list-etudiants',
  imports: [FormsModule,AdminMenuComponent],
  standalone: true,
  templateUrl: './list-etudiants.component.html',
  styleUrl: './list-etudiants.component.css',
})
export class ListEtudiantsComponent {
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  etudiants: any[] = [];

  constructor(private userService: UsersService,
    private modalService: NgbModal,
    private cdr :ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getEtudiants();
  }

  getEtudiants(): void {
    this.userService
      .getByFFilteredEtudiants(this.searchTerm, this.page, this.limit)
      .subscribe(
        (res) => {
          this.etudiants = res.etudiants;
          this.totalPages = res.pagination.pages;
        },
        (err) => console.error(err)
      );
  }

  // Recherche live avec reset de la page
  onSearch(): void {
    this.page = 1; // <-- Important ! Toujours reset la page
    this.getEtudiants();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.page = 1;
    this.getEtudiants();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getEtudiants();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getEtudiants();
    }
  }



  openRoleModal(etudiant: any) {
    const modalRef = this.modalService.open(RoleModalComponent, {
      centered: true
    });
    modalRef.componentInstance.etudiant = etudiant; //a envoyer

    modalRef.componentInstance.roleUpdated.subscribe((roleUpdated: any) => {
     this.userService.addClubManagerRole(etudiant._id, roleUpdated.password).subscribe({
      next: (res) => {
         // SweetAlert succès
        Swal.fire({
          icon: 'success',
          title: 'Rôle ajouté !',
          text: 'Le rôle Club Manager a été ajouté avec succès.',
          timer: 2000,
          showConfirmButton: false,
        });
        modalRef.close();

                this.cdr.detectChanges();
                this.getEtudiants();

      },
      error: (err) => {
        console.error(err);
        // SweetAlert erreur
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Erreur serveur',
        });

      }
    });


    });
  }





}
