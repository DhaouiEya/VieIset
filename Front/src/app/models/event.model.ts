// src/app/models/event.model.ts
import { Attendee } from './attendee.model';
export interface Event {
  id?: string;          // correspond à _id du backend
  title: string;
  description: string;
  localisation: string;
  startDate: string;    // ou Date si tu convertis côté front
  endDate: string;      // ou Date
  capacity?: number;
  lienImage?:File |string | null  ;
  attendees?: Attendee[];
}
