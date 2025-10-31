import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Attendee } from '../models/attendee.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:9000/api/events'; // <- corrige l’URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Omit<Event, 'id' | 'attendees'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }



    // Créer un poste avec fichiers (FormData)
    createEventWithFiles(formData: FormData): Observable<Event> {
      return this.http.post<Event>(this.apiUrl, formData);
    }

  register(eventId: string, student: Attendee): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/register`, student);
  }
}
