import { Component, ViewChild } from '@angular/core';
import { EtudiantBannerComponent } from '../../etudiant-banner/etudiant-banner.component';
import { ConsulterLogementsComponent } from "../consulter-logements/consulter-logements.component";
import { PublierDemandeLogementComponent } from "../publier-demande-logement/publier-demande-logement.component";
import { HistoriqueDemandesLogementComponent } from "../historique-demandes-logement/historique-demandes-logement.component";

@Component({
  selector: 'app-tab-logements',
  standalone: true,
  imports: [EtudiantBannerComponent, ConsulterLogementsComponent, PublierDemandeLogementComponent, HistoriqueDemandesLogementComponent],
  templateUrl: './tab-logements.component.html',
  styleUrl: './tab-logements.component.css',
})
export class TabLogementsComponent {
  activeLogementView = 'consulter';
  @ViewChild('historique') historique!: HistoriqueDemandesLogementComponent;

  onDemandePubliee(nouvelleDemande: any) {
    // Appeler une méthode du composant historique pour ajouter la nouvelle demande
    this.historique.ajouterDemande(nouvelleDemande);
  }

  setLogementView(view: 'consulter' | 'demandes'): void {
     this.activeLogementView = view;
  }
}
