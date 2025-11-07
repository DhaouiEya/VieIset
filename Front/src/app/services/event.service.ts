import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Attendee } from '../models/attendee.model';
import { Event } from '../models/event';

 const URL = 'http://localhost:9000/api/events';
=======
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Attendee } from '../models/attendee.model';
import { Participation } from '../models/participation.model';

>>>>>>> c56cb58786912246bf60b446e11a300ca5a11c95
@Injectable({
  providedIn: 'root'
})
export class EventService {
<<<<<<< HEAD
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
=======
  private apiUrl = 'http://localhost:9000/api/events'; // <- corrige l’URL

  constructor(private http: HttpClient) {}

 getEvents(): Observable<Event[]> {
  return this.http.get<Event[]>(this.apiUrl).pipe(
    map(events => events.map(e => ({ ...e, id: (e as any)._id })))
  );
}
getEventParticipations(eventId: string): Observable<Participation[]> {
  return this.http.get<Participation[]>(`${this.apiUrl}/${eventId}/participations`);
}

  getEvent(id: string): Observable<Event> {
  return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
    map(e => ({ ...e, id: (e as any)._id }))
  );
  }

  createEvent(event: Omit<Event, 'id' | 'attendees'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
>>>>>>> c56cb58786912246bf60b446e11a300ca5a11c95
  }



    // Créer un poste avec fichiers (FormData)
    createEventWithFiles(formData: FormData): Observable<Event> {
<<<<<<< HEAD
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
=======
      return this.http.post<Event>(this.apiUrl, formData);
    }

  register(eventId: string): Observable<any> {
   const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
 // JWT stocké après login

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log("Registering for event with ID:", eventId);
    return this.http.post(`${this.apiUrl}/${eventId}/inscrire`, {}, { headers });
  }

>>>>>>> c56cb58786912246bf60b446e11a300ca5a11c95
}
