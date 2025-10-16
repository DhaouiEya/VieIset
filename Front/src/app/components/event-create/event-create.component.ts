import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'] // ou inline si tu veux
})
export class EventCreateComponent {
  newEvent: Event = {
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: 0
  };

  error = '';
  loading = false;

  constructor(private eventSvc: EventService, private router: Router) {}

  submit() {
    if (!this.newEvent.title || !this.newEvent.startDate) {
      this.error = 'Titre et date de début requis.';
      return;
    }
    this.loading = true;
    this.eventSvc.createEvent(this.newEvent).subscribe({
      next: (ev) => {
        this.loading = false;
        this.router.navigate(['/events']); // Retour à la liste après création
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors de la création de l’événement.';
        console.error(err);
      }
    });
  }
}
