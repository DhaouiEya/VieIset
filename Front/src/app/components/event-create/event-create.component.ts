import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { RouterModule, Router } from '@angular/router';
import { ResponsableMenuComponent } from '../../responsable-club/responsable-menu/responsable-menu.component';
import Swal from 'sweetalert2';

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
    console.log("🚀 Début du submit avec event :", this.newEvent);

    // 1️⃣ Validation des champs
    if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.localisation ||
        !this.newEvent.startDate || !this.newEvent.endDate || !this.newEvent.capacity) {

      this.error = 'Tous les champs doivent être remplis.';
      console.error("❌ Champs manquants");

      Swal.fire({
        icon: 'error',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires.'
      });

      return;
    }

    // 2️⃣ Vérification des dates
    const start = new Date(this.newEvent.startDate);
    const end = new Date(this.newEvent.endDate);

    if (end <= start) {
      this.error = 'La date de fin doit être supérieure à la date de début.';

      console.error("❌ Erreur date :", { start, end });

      Swal.fire({
        icon: 'error',
        title: 'Dates invalides',
        text: 'La date de fin doit être après la date de début.'
      });

      return;
    }

    this.error = '';

    // 3️⃣ Construction du FormData
    const formData = new FormData();
    formData.append('title', this.newEvent.title);
    formData.append('description', this.newEvent.description);
    formData.append('localisation', this.newEvent.localisation);
    formData.append('startDate', this.newEvent.startDate);
    if (this.newEvent.endDate) formData.append('endDate', this.newEvent.endDate);
    formData.append('capacity', this.newEvent.capacity.toString());
    if (this.selectedImage) formData.append('image', this.selectedImage);

    console.log("📦 FormData envoyé :", {
      title: this.newEvent.title,
      description: this.newEvent.description,
      localisation: this.newEvent.localisation,
      startDate: this.newEvent.startDate,
      endDate: this.newEvent.endDate,
      capacity: this.newEvent.capacity,
      selectedImage: this.selectedImage
    });

    this.loading = true;

    // 4️⃣ Envoi backend
    this.eventSvc.createEventWithFiles(formData).subscribe({
      next: (ev) => {
        this.loading = false;
        console.log("✅ Événement créé :", ev);

        Swal.fire({
          icon: 'success',
          title: 'Événement créé',
          text: 'Votre événement a été ajouté avec succès !'
        }).then(() => {
          this.router.navigate(['/events']);
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur lors de la création de l’événement.';
        console.error("❌ Erreur backend :", err);

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de l’événement.'
        });
      }
    });
  }

}
