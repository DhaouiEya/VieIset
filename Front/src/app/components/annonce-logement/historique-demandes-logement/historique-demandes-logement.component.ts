import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../../../services/annonce.service';

@Component({
  selector: 'app-historique-demandes-logement',
  standalone:true,
  imports: [DatePipe],
  templateUrl: './historique-demandes-logement.component.html',
  styleUrl: './historique-demandes-logement.component.css'
})
export class HistoriqueDemandesLogementComponent implements OnInit{
  demandes: any[] = [];
  constructor(private annonceService: AnnonceService) { }


  ngOnInit(): void {
    this.loadAnnonces()

  }
    loadAnnonces(): void {
    this.annonceService.getMyAnnonces().subscribe({
      next: (data) => {
        console.log("mes annonces ",data)
        this.demandes = data;
      },
      error: (err) => console.error('Erreur lors du chargement des annonces', err)
    });
  }

    ajouterDemande(demande: any) {
    this.demandes.unshift(demande);
  }


}
