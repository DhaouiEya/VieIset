import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Participation } from '../../models/participation';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  id!:any;

  nombreParticipants:any;
  successMessage = '';
  errorMessage = '';
  alreadyRegistered = false;
  participations: Participation[] = [];
  constructor(
    private eventSvc: EventService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private router: Router,
    private http: HttpClient // ✅ injection manquante
  ) {}

  loadEvent(): void {
    if (this.id) {
      this.eventSvc.getEvent(this.id).subscribe({
        next: (data) => {
          this.alreadyRegistered = data.userInscrit;
          console.log('Event data received:', this.alreadyRegistered  ,data);
          this.nombreParticipants=data.nombreParticipants;
          this.event = data.event;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger cet événement.';
        }
      });

    }
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Event ID from route:', this.id);
    this.loadEvent();
  }

 inscrire(): void {
    this.eventSvc.register(this.id).subscribe({
      next: (res) => {

        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: res.message || 'Vous êtes inscrit à cet événement.',

        });
        this.loadEvent();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de l’inscription.';
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: msg,
          confirmButtonText: 'Fermer'
        });
      }
    });
  }

}
