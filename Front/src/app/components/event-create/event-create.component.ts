import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { RouterModule, Router } from '@angular/router';
import { ResponsableMenuComponent } from '../../responsable-club/responsable-menu/responsable-menu.component';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,ResponsableMenuComponent],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'] // ou inline si tu veux
})
export class EventCreateComponent {
  newEvent: Event = {
    title: '',
    description: '',
    localisation: '',
    startDate: '',
    endDate: '',
    lienImage: '',
    capacity: 0
  };

  error = '';
  loading = false;

  constructor(private eventSvc: EventService, private router: Router) {}

selectedImage: File | null = null;

onFileSelected(event: any) {
  this.selectedImage = event.target.files[0];
}

submit() {
    // Vérifier que tous les champs requis sont remplis
  if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.localisation ||
      !this.newEvent.startDate || !this.newEvent.endDate || !this.newEvent.capacity) {
    this.error = 'Tous les champs doivent être remplis.';
    return;
  }

  // Vérifier que la date de fin est après la date de début
  const start = new Date(this.newEvent.startDate);
  const end = new Date(this.newEvent.endDate);

  if (end <= start) {
    this.error = 'La date de fin doit être supérieure à la date de début.';
    return;
  }
  this.error = '';


  const formData = new FormData();
  formData.append('title', this.newEvent.title);
  formData.append('description', this.newEvent.description);
  formData.append('localisation', this.newEvent.localisation);
  formData.append('startDate', this.newEvent.startDate);
  if (this.newEvent.endDate) formData.append('endDate', this.newEvent.endDate);
  formData.append('capacity', this.newEvent.capacity?.toString() || '0');
  if (this.selectedImage) formData.append('image', this.selectedImage);

  this.loading = true;
  this.eventSvc.createEventWithFiles(formData).subscribe({
    next: (ev) => {
      this.loading = false;
      this.router.navigate(['/events']);
    },
    error: (err) => {
      this.loading = false;
      this.error = 'Erreur lors de la création de l’événement.';
      console.error(err);
    }
  });
 }

}
