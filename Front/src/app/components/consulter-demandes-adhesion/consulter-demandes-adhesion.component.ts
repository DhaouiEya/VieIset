import { Component, inject, OnInit } from '@angular/core';
import { DemandeAdhesionService } from '../../services/demande-adhesion.service';
import { DatePipe } from '@angular/common';
import { DemandeAdhesion } from '../../models/demande-adhesion';

@Component({
  selector: 'app-consulter-demandes-adhesion',
  imports: [DatePipe],
  templateUrl: './consulter-demandes-adhesion.component.html',
  styleUrl: './consulter-demandes-adhesion.component.css'
})
export class ConsulterDemandesAdhesionComponent implements OnInit {
 demandes: DemandeAdhesion[] = [];
  loading = true;

  readonly demandeService :DemandeAdhesionService= inject(DemandeAdhesionService);

  ngOnInit(): void {
    this.chargerDemandes();
  }

  chargerDemandes() {
    this.demandeService.getMesDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
        console.log("DEMANDES REÇUES :", data);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
     
        this.loading = false;
      }
    });
  }
}
