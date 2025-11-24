import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Reclamation } from '../../../models/reclamation';
import { AuthService } from '../../../services/auth.service';
import { ReclamationService } from '../../../services/reclamation.service';
import { DatePipe } from '@angular/common';
import { EtudiantBannerComponent } from "../../etudiant-banner/etudiant-banner.component";
import { PublierReclamationComponent } from "../publier-reclamation/publier-reclamation.component";

@Component({
  selector: 'app-mes-reclamations',
  imports: [DatePipe, EtudiantBannerComponent, PublierReclamationComponent],
  templateUrl: './mes-reclamations.component.html',
  styleUrl: './mes-reclamations.component.css'
})
export class MesReclamationsComponent implements  OnInit{

  constructor(private cdr : ChangeDetectorRef) {

  }
    reclamations: Reclamation[] = [];

  private authService :AuthService= inject(AuthService)
  id=this.authService.getUserId();
  readonly reclamationService:ReclamationService = inject(ReclamationService);

  statusColors: Record<any, string> = {
    'Nouvelle': 'bg-blue-100 text-blue-800',
    'En cours': 'bg-yellow-100 text-yellow-800',
    'Résolue': 'bg-green-100 text-green-800',
    'Rejetée': 'bg-red-100 text-red-800'
  };

  getStatutClass(statut: any): string {
    return this.statusColors[statut] || 'bg-gray-100 text-gray-800';
  }

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


  onReclamationAjoutee($event: any) {
    console.log("eee ",$event)
    this.reclamations.unshift($event)
}


}
