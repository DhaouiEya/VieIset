// src/app/pages/liste-demande-dons/liste-demande-dons.component.ts
// (ou l'emplacement que tu utilises)

import { Component, OnInit } from '@angular/core';
import { NgClass, CurrencyPipe, DatePipe, CommonModule } from '@angular/common';

import { DemandeDonService } from '../../services/demandedon.service';
import { DemandeDon } from '../../models/demande-don.model';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-liste-demande-dons',
  standalone: true,
  imports: [
    CommonModule,        // obligatoire pour @if / @for
    NgClass,
    CurrencyPipe,
    DatePipe,
    AdminMenuComponent
  ],
  templateUrl: './liste-demande-dons.component.html',
  styleUrl: './liste-demande-dons.component.css'
})
export class ListeDemandeDonsComponent implements OnInit {

  demandes: DemandeDon[] = [];
  loading = true;

  constructor(private demandeService: DemandeDonService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes() {
    this.loading = true;
    this.demandeService.getAllDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-warning text-dark';
      case 'ACCEPTEE':   return 'bg-success';
      case 'REFUSEE':    return 'bg-danger';
      default:           return 'bg-secondary';
    }
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  }

  isPdf(filePath: string): boolean {
    return /\.pdf$/i.test(filePath);
  }

 getFileUrl(annexe?: string): string {
  if (!annexe) return '';
  // Maintenant l'URL est propre et fonctionne à 100%
  return `http://localhost:9000/annexes/${annexe}`;
}

updateStatut(id: string, nouveauStatut: 'ACCEPTEE' | 'REFUSEE') {
  const titre = nouveauStatut === 'ACCEPTEE' ? 'Accepter' : 'Refuser';
  const icone = nouveauStatut === 'ACCEPTEE' ? 'success' : 'error';
  const couleurBouton = nouveauStatut === 'ACCEPTEE' ? '#28a745' : '#dc3545';
  const texteBouton = nouveauStatut === 'ACCEPTEE' ? 'Oui, accepter' : 'Oui, refuser';

  Swal.fire({
    title: `${titre} cette demande ?`,
    text: "Cette action est irréversible",
    icon: nouveauStatut === 'ACCEPTEE' ? 'question' : 'warning',
    showCancelButton: true,
    confirmButtonColor: couleurBouton,
    cancelButtonColor: '#6c757d',
    confirmButtonText: texteBouton,
    cancelButtonText: 'Annuler',
    reverseButtons: true,
    heightAuto: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.demandeService.updateStatut(id, nouveauStatut).subscribe({
        next: (updated) => {
          const demande = this.demandes.find(d => d._id === id);
          if (demande) {
            demande.statut = updated.statut;
          }

          // Message de succès stylé
          Swal.fire({
            icon: icone,
            title: 'Succès!',
            text: `La demande a été ${nouveauStatut === 'ACCEPTEE' ? 'acceptée' : 'refusée'} avec succès.`,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            background: '#fff',
            color: '#333'
          });
        },
        error: (err) => {
          console.error('Erreur mise à jour statut:', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de mettre à jour le statut. Réessayez.',
            confirmButtonColor: '#dc3545'
          });
        }
      });
    }
  });
}
}
