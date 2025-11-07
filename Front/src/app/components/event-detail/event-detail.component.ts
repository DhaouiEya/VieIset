import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';

import { Attendee } from '../../models/attendee.model';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule,RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  student: Attendee = { studentId: '', lastName: '' , firstName: ''};
  successMessage = '';
  errorMessage = '';
  alreadyRegistered = false;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEvent(id).subscribe({
        next: (data) => {
          this.event = { ...data, _id: (data as any)._id || data._id };
        },
        error: () => this.errorMessage = 'Impossible de charger cet événement.'
      });
    }
  }

  register(): void {
    if (!this.event?._id) return;

    // ✅ Validation front
    if (!this.student.studentId.trim() || !this.student.lastName.trim()) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      this.successMessage = '';
      return;
    }

    // ✅ Vérifier si l’étudiant est déjà inscrit
    const dejaInscrit = this.event.attendees?.some(
      (a) => a.studentId === this.student.studentId
    );

    if (dejaInscrit) {
      this.errorMessage = 'Vous êtes déjà inscrit à cet événement.';
      this.successMessage = '';
      this.alreadyRegistered = true;
      return;
    }

    // ✅ Inscription
    this.eventService.register(this.event._id, this.student).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! 🎉';
        this.errorMessage = '';
        this.alreadyRegistered = true;
        this.student = { studentId: '', lastName: '', firstName: '' };

        // Ajouter manuellement l’étudiant à la liste locale
        this.event?.attendees?.push({ ...this.student });
      },
      error: (err) => {
        if (err.error?.message?.includes('déjà inscrit')) {
          this.errorMessage = 'Vous êtes déjà inscrit à cet événement.';
          this.alreadyRegistered = true;
        } else {
          this.errorMessage = 'Erreur lors de linscription.';
        }
        this.successMessage = '';
      }
    });
  }
}
