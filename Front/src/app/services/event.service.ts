
 const URL = 'http://localhost:9000/api/events';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Attendee } from '../models/attendee.model';



import { Participation } from '../models/participation';

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
  updateEvent(eventId: string, event: any): Observable<Event> {
    return this.http.put<Event>(`${URL}/${eventId}`, event);
  }
    
//   register(eventId: string): Observable<any> {
//    const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
//  // JWT stocké après login

//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//     console.log("Registering for event with ID:", eventId);
//     return this.http.post(`${this.apiUrl}/${eventId}/inscrire`, {}, { headers });
//   }

}
