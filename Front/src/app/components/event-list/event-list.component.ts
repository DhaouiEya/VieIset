import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css' // corrigé
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';

  // Pour le formulaire de création (sans id et attendees)
  newEvent: Omit<Event, 'id' | 'attendees'> = {
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    capacity: 0,
    localisation: '',
    lienImage: ''
  };

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
        this.newEvent = {
          title: '',
          startDate: '',
          endDate: '',
          description: '',
          capacity: 0,
          localisation: '',
          lienImage: ''
        }; // reset formulaire
      },
      error: (err) => {
        console.error('Erreur lors de la création de l’événement', err);
      }
    });
  }
}
