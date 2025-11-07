import { Component, Inject, inject, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Attendee } from '../../../models/attendee.model';
import { Event } from '../../../models/event';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-details-participants',
  imports: [ MatDialogModule,MatDialogContent,MatButtonModule,MatTableModule],
  templateUrl: './details-participants.component.html',
  styleUrl: './details-participants.component.css'
})
export class DetailsParticipantsComponent implements OnInit {
  participants: Attendee[] = [];
  events:Event[] = [];
  displayedColumns: string[] = ['firstName', 'lastName'];
   align?: 'start' | 'center' | 'end';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // l'événement
    private dialogRef: MatDialogRef<DetailsParticipantsComponent>
  ) {}

  ngOnInit() {
    this.events = this.data || [];
    this.participants = this.data.attendees || [];
    console.log('events:', this.events);
  }

  close() {
    this.dialogRef.close();
  }
}