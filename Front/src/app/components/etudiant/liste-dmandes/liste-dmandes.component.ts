import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DemandeAdhesionService } from '../../../services/demande-adhesion.service';
import { DemandeAdhesion } from '../../../models/demande-adhesion';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-liste-dmandes',
  imports: [NgClass,DatePipe],
  templateUrl: './liste-dmandes.component.html',
  styleUrl: './liste-dmandes.component.css'
})
export class ListeDmandesComponent implements OnInit {

  demandes: DemandeAdhesion[] = [];

  private authService = inject(AuthService);
  private demandeService:DemandeAdhesionService = inject(DemandeAdhesionService);

  idEtudiant = this.authService.getUserId();

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes() {
    if (!this.idEtudiant) return;

    this.demandeService.getDemandesByEtudiantId(this.idEtudiant).subscribe({
      next: (data) => {
        this.demandes = data;
      },
      error: (err) => console.error(err)
    });
  }
}