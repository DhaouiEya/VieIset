import { Component, inject, OnInit } from '@angular/core';
import { Reclamation } from '../../models/reclamation';
import { ReclamationService } from '../../services/reclamation.service';
import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reclamations',
  imports: [DatePipe,NgClass,SlicePipe],
  templateUrl: './reclamations.component.html',
  styleUrl: './reclamations.component.css'
})
export class ReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
   descriptionToShow = ''; 
   sujetToShow = '';
  modalService = inject(NgbModal);
  loading = true;
  readonly reclamationService:ReclamationService = inject(ReclamationService);
  constructor() {}
expandedMap: Record<string, boolean> = {};

toggleDescription(id: string) {
  this.expandedMap[id] = !this.expandedMap[id];
}

  openDescription(content: any, description: string) {
    this.descriptionToShow = description;
    this.modalService.open(content, { size: 'lg' });
  }
   openSujet(modal: any, sujet: string) {
    this.sujetToShow = sujet;
    this.modalService.open(modal, { size: 'lg' });
  }
  ngOnInit(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        console.log(this.reclamations);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération réclamations', err);
        this.loading = false;
      }
    });
  }
}