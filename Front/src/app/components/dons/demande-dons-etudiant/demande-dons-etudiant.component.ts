import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EtudiantBannerComponent } from '../../etudiant-banner/etudiant-banner.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DemandeDonService } from '../../../services/demandedon.service';
import { PublierDemandeDonsComponent } from '../publier-demande-dons/publier-demande-dons.component';

@Component({
  selector: 'app-demande-dons-etudiant',
  standalone: true,
  imports: [
    EtudiantBannerComponent,
    DatePipe,
    TitleCasePipe,
    PublierDemandeDonsComponent,
  ],
  templateUrl: './demande-dons-etudiant.component.html',
  styleUrl: './demande-dons-etudiant.component.css',
})
export class DemandeDonsEtudiantComponent implements OnInit {
  constructor(
    private demandeService: DemandeDonService,
    private cdr: ChangeDetectorRef
  ) {}

  demandesDons: any[]=[];
  donStatusColors: Record<any, string> = {
    EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
    ACCEPTEE: 'bg-green-100 text-green-800',
    REFUSEE: 'bg-red-100 text-red-800',
  };

  ngOnInit(): void {
    this.loadMyDemandes();
  }

  loadMyDemandes() {
    this.demandeService.getMyDemandes().subscribe({
      next: (res) => {
        console.log('resss loadMyDemandes', res);
        this.demandesDons = res;
      },
      error: (err) => console.error(err),
    });
  }

  getDonStatutClass(statut: any): string {
    return this.donStatusColors[statut] || 'bg-gray-100 text-gray-800';
  }

  demandeDonsAjoutee($event: Event) {
    console.log("demande dons faites",$event)
    this.cdr.detectChanges()
    this.demandesDons.unshift($event);
    console.log("demandesDons apres push  ",this.demandesDons)

  }
}
