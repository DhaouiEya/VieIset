import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  capacity?: number;
  attendeesCount?: number;
}

export interface StudentPayload {
  studentId: number | string;
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:3000/events'; // json-server

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  // Création d'un nouvel événement via POST
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
  }

  // Exemple : inscription d'un étudiant
  register(id: number, studentPayload: StudentPayload): Observable<any> {
    // À adapter si json-server gère les inscriptions
    return this.http.post(`${this.baseUrl}/${id}/register`, studentPayload);
  }
}
