import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Attendee } from '../models/attendee.model';
import { Event } from '../models/event';

 const URL = 'http://localhost:9000/api/events';
@Injectable({
  providedIn: 'root'
})
export class EventService {
 // <- corrige l’URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(URL);
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${URL}/${id}`);
  }

  createEvent(event: Omit<Event, 'id' | 'attendees'>): Observable<Event> {
    return this.http.post<Event>(URL, event);
  }



    // Créer un poste avec fichiers (FormData)
    createEventWithFiles(formData: FormData): Observable<Event> {
      return this.http.post<Event>(URL, formData);
    }

  register(eventId: string, student: Attendee): Observable<any> {
    return this.http.post<any>(`${URL}/${eventId}/register`, student);
  }
  deleteEvent(eventId: string): Observable<Event> {
    return this.http.delete<any>(`${URL}/${eventId}`);
  }
  updateEvent(eventId: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${URL}/${eventId}`, event);
  }
}
