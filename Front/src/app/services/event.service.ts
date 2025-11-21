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

  private apiUrl = 'http://localhost:9000/api/events'; // <- corrige l’URL



  constructor(private http: HttpClient) {}

   updateEvent(_id: any, formData: FormData) {
    throw new Error('Method not implemented.');
  }

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
  }




    deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${URL}/${id}`);
  }
    // Créer un poste avec fichiers (FormData)
    createEventWithFiles(formData: FormData): Observable<Event> {
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
   // 🔹 Récupérer tous les participants d'un événement
  getEventParticipants(eventId: string): Observable<any> {
    return this.http.get<any>(`${URL}/${eventId}/participations`);
  }

}
