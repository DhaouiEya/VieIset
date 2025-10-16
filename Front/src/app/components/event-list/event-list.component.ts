import { Component, OnInit } from '@angular/core';
import { EventService, Event } from '../../services/event.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';

  // Pour le formulaire de création
  newEvent: Event = { title: '', startDate: '', description: '' };

  constructor(private eventSvc: EventService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.loading = true;
    this.eventSvc.getEvents().subscribe({
      next: (ev) => {
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
    if (!event.id) return;
    this.router.navigate(['/events', event.id]);
  }

  // Méthode pour créer un événement
  addEvent() {
    if (!this.newEvent.title || !this.newEvent.startDate) return;
    this.eventSvc.createEvent(this.newEvent).subscribe({
      next: (ev) => {
        this.events.push(ev); // mettre à jour la liste locale
        this.newEvent = { title: '', startDate: '', description: '' }; // reset formulaire
      },
      error: (err) => {
        console.error('Erreur lors de la création de l’événement', err);
      }
    });
  }
}
