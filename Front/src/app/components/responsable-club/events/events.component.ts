import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../../services/event.service';
import { DatePipe } from '@angular/common';
import { Event } from '../../../models/event.model';
import { DetailsParticipantsComponent } from '../details-participants/details-participants.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { UpdateEventComponent } from '../update-event/update-event.component';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [DatePipe,MatIconModule,MatButtonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  showModal = false;
  selectedEvent: Event | null = null;
  readonly eventService = inject(EventService);
  readonly dialog = inject(MatDialog);
  shownewmodal=false;





  ngOnInit(): void {
    this.loadEvents();
  }

 // Ouvre le modal et définit l'événement sélectionné
  opennewModal(event: any) {
    this.selectedEvent = event;
    this.shownewmodal = true;
  }

  // Ferme le modal
  closenewModal() {
    this.shownewmodal = false;
    this.selectedEvent = null;
  }
loadEvents() {
  this.eventService.getEvents().subscribe({
    next: (data) => {
      console.log(" EVENTS REÇUS :", data);  // <-- AJOUTE ÇA
      this.events = data;
    },
    error: (err) => console.error(err)
  });
}





  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
  }

 deleteEvent(event: Event) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Voulez-vous vraiment supprimer l'événement "${event.title}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.eventService.deleteEvent(event._id || '').subscribe({
        next: () => {
          this.loadEvents();
          Swal.fire(
            'Supprimé !',
            'L\'événement a été supprimé.',
            'success'
          );
        },
        error: (err) => {
          console.error(err);
          Swal.fire(
            'Erreur',
            'Une erreur est survenue lors de la suppression.',
            'error'
          );
        }
      });
    }
  });
}
openUpdateEventDialog(event?: Event) {
  const dialogRef = this.dialog.open(UpdateEventComponent, {
    width: '600px',
    height: '600px',
    data: event ? { ...event } : null // si tu passes un event, c'est pour éditer
  });

   dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadEvents(); // recharge la liste automatiquement
    }
  });
}
 // Quand le modal se ferme, on recharge les événements si update réussi

  viewAttendees(event?: Event) {
    const dialogRef = this.dialog.open(DetailsParticipantsComponent, {
      width: '400px',
      disableClose: true,
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadEvents();
    });
  }
//     openImageModal(event: any) {
//   this.selectedEvent = event;
//  // this.selectedEventImage = 'http://localhost:9000' + event.lienImage;
//   this.showImageModal = true;
//    console.log('Modal ouvert pour:', event.title);
// }

// closeImageModal() {
//   this.showImageModal = false;
//  // this.selectedEventImage = null;
// }
}
