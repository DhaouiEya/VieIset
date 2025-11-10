import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResponsableMenuComponent } from '../../../responsable-club/responsable-menu/responsable-menu.component';
import { ClubService } from '../../../services/club.service';
import Swal from 'sweetalert2';
import { DatePipe, NgClass } from '@angular/common';
import { UpdateClubModalComponent } from '../update-club-modal/update-club-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-club',
  standalone: true,
  imports: [ResponsableMenuComponent, DatePipe, NgClass],
  templateUrl: './my-club.component.html',
  styleUrl: './my-club.component.css',
})
export class MyClubComponent implements OnInit {
  constructor(
    private clubService: ClubService,
    private modalService: NgbModal,
     private cdr: ChangeDetectorRef
  ) {}

  clubData: any;

  ngOnInit(): void {
    this.loadClub();
  }

  loadClub() {
    this.clubService.getMonClub().subscribe(
      (res) => {
        if (res.success) {
          this.clubData = res.data;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de charger les informations du club. Veuillez réessayer.',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        console.error('Erreur mise à jour profil:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les informations du club. Veuillez réessayer.',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  toggleClub() {
    const action = this.clubData.actif ? 'désactiver' : 'activer';
    Swal.fire({
      title: `Êtes-vous sûr de vouloir ${action} ce club ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.clubData.actif) {
          this.clubService.desactiverMonClub().subscribe(
            (res) => {
              this.clubData=res.club;
            },
            (err) => {
              Swal.fire('Erreur', err.error.message, 'error');
            }
          );
        } else {
          this.clubService.activerMonClub().subscribe(
            (res) => {
              this.clubData=res.club;
            },
            (err) => {
              Swal.fire('Erreur', err.error.message, 'error');
            }
          );
        }
      }
    });
  }


   openUpdateClub() {
    if (!this.clubData) return;

    const modalRef = this.modalService.open(UpdateClubModalComponent, { centered: true ,size:'lg'});
    modalRef.componentInstance.club = this.clubData; // Envoi les données du club

    modalRef.componentInstance.clubUpdated.subscribe((updatedClub: any) => {
      // On reçoit le club mis à jour depuis le modal
      this.clubData = updatedClub;
      this.cdr.detectChanges();
      Swal.fire('Succès', 'Le club a été mis à jour.', 'success');
      this.modalService.dismissAll();
    });
  }
}
