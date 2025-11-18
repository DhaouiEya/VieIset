import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  updateEvent(id: string, eventData: any) {  // <- 'any' ou FormData
  return this.http.put(`${URL}/${id}`, eventData);
}




  
    deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }

  register(eventId: string): Observable<any> {
   const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
 // JWT stocké après login

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log("Registering for event with ID:", eventId);
    return this.http.post(`${URL}/${eventId}/inscrire`, {}, { headers });
  }
   // 🔹 Récupérer tous les participants d'un événement
  getEventParticipants(eventId: string): Observable<any> {
    return this.http.get<any>(`${URL}/${eventId}/participations`);
  }

}
