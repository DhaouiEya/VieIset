import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-detail.component.html',

})
export class EventDetailComponent implements OnInit {
  event?: Event;
  loading = false;
  error = '';
  success = '';

  // déclaration (définitive) ; on initialise dans ngOnInit()
  registerForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private eventSvc: EventService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialise le form ici (après injection de fb)
    this.registerForm = this.fb.group({
      studentId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Id invalide';
      return;
    }

    this.loading = true;
    this.eventSvc.getEvent(id).subscribe({
      next: (e) => {
        this.event = e;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de récupérer l'événement";
        this.loading = false;
      }
    });
  }

  submitRegister() {
    if (!this.event?.id) return;
    if (this.registerForm.invalid) return;

    // on peut typer le payload si tu veux : const payload = this.registerForm.value as { studentId: string, name: string, email: string };
    const payload = this.registerForm.value;

    this.eventSvc.register(this.event.id, payload).subscribe({
      next: () => {
        this.success = 'Inscription réussie !';
        // rafraîchir le détail (optionnel)
        this.eventSvc.getEvent(this.event!.id!).subscribe(e => this.event = e);
      },
      error: () => {
        this.error = "Erreur lors de l'inscription.";
      }
    });
  }
}
