import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Participation } from '../../models/participation';
import { EtudiantBannerComponent } from "../etudiant-banner/etudiant-banner.component";


@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule, EtudiantBannerComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css' // corrigé
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  loading = false;
  error = '';
  participations: Participation[] = [];


  constructor(private eventSvc: EventService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.loading = true;
    this.eventSvc.getEvents().subscribe({
      next: (ev) => {
        console.log('Events fetched:', ev);
        this.events = ev;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les événements.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewEvent(event: Event) {
    console.log('Navigating to event with id:', event);
    if (!event._id) return;
    this.router.navigate(['/etudiant/events', event._id]);
  }


   getParticipantPercentage(event: any): number {
    if (!event || event.capacity === 0) {
      return 0;
    }
    return (event.nombreParticipants / event.capacity) * 100;
  }

  // Méthode pour créer un événement
  // addEvent() {
  //   if (!this.newEvent.title || !this.newEvent.startDate) return;
  //   this.eventSvc.createEvent(this.newEvent).subscribe({
  //     next: (ev) => {
  //       this.events.push(ev); // mettre à jour la liste locale
  //       this.newEvent = {
  //         title: '',
  //         startDate: '',
  //         endDate: '',
  //         description: '',
  //         capacity: 0,
  //         localisation: '',
  //         lienImage: ''
  //       }; // reset formulaire
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors de la création de l’événement', err);
  //     }
  //   });
  // }
}
