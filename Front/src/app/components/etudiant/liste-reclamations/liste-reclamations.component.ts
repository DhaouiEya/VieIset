import { Component, inject, OnInit } from '@angular/core';
import { Reclamation } from '../../../models/reclamation';
import { DatePipe, SlicePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { ReclamationService } from '../../../services/reclamation.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateReclamationComponent } from '../create-reclamation/create-reclamation.component';
import { EtudiantBannerComponent } from "../../etudiant-banner/etudiant-banner.component";

@Component({
  selector: 'app-liste-reclamations',
  imports: [SlicePipe, DatePipe, EtudiantBannerComponent],
  templateUrl: './liste-reclamations.component.html',
  styleUrl: './liste-reclamations.component.css'
})
export class ListeReclamationsComponent implements OnInit{
  reclamations: Reclamation[] = [];
  descriptionToShow: string = '';
  sujetToShow: string = '';
 modalService = inject(NgbModal);
  private authService :AuthService= inject(AuthService)
  id=this.authService.getUserId();
  readonly reclamationService:ReclamationService = inject(ReclamationService);
  dialog = inject(MatDialog);



  ngOnInit(): void {
    console.log("id de user connecté :",this.id);
    this.loadReclamations();
  }
  loadReclamations() {
    if (!this.id) return;

    this.reclamationService.getReclamationsByEtudiantId(this.id).subscribe({
      next: (data) => {
        this.reclamations = data;
        console.log("reclamations ",data);
      },
      error: (err) => console.error(err)
    });
  }
    openCreateDialog() {
    const dialogRef = this.dialog.open(CreateReclamationComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.loadReclamations();
      }
    });
  }

  openDescription(content: any, description: string) {
    this.descriptionToShow = description;
    this.modalService.open(content, { size: 'lg' });
  }
   openSujet(modal: any, sujet: string) {
    this.sujetToShow = sujet;
    this.modalService.open(modal, { size: 'lg' });
  }

}
