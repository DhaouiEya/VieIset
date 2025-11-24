import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Attendee } from '../models/attendee.model';
import { Participation } from '../models/participation';

 const URL = 'http://localhost:9000/api/events'; // <- corrige l’URL
@Injectable({
  providedIn: 'root'
})

export class EventService {
  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
       const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
 // JWT stocké après login

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(URL, { headers });
  }


//  getEvents(): Observable<Event[]> {
//   return this.http.get<Event[]>(this.apiUrl).pipe(
//     map(events => events.map(e => ({ ...e, id: (e as any)._id })))
//   );
// }
getEventParticipations(eventId: string): Observable<Participation[]> {
  return this.http.get<Participation[]>(`${URL}/${eventId}/participations`);
}

  getEvent(id: string): Observable<any> {
       const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
 // JWT stocké après login

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${URL}/${id}`, { headers });
  }

  createEvent(event: Omit<Event, 'id' | 'attendees'>): Observable<Event> {
    return this.http.post<Event>(URL, event);
  }
    createEventWithFiles(formData: FormData): Observable<Event> {
      return this.http.post<Event>(URL, formData);
    }


  deleteEvent(eventId: string): Observable<Event> {
    return this.http.delete<Event>(`${URL}/${eventId}`);
  }
  updateEvent(eventId: string, event: any): Observable<Event> {
    return this.http.put<Event>(`${URL}/${eventId}`, event);
  }

  register(eventId: string): Observable<any> {
   const token = JSON.parse(localStorage.getItem('authenticationToken') || '{}').authToken;
 // JWT stocké après login

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log("Registering for event with ID:", eventId);
    return this.http.post(`${URL}/${eventId}/register`, {}, { headers });
  }

}
