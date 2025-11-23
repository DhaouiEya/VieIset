// src/app/services/demandedon.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DemandeDon } from '../models/demande-don.model';   // Import correct

@Injectable({
  providedIn: 'root'
})
export class DemandeDonService {

  private baseUrl = 'http://localhost:9000/api/demandedon';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      throw new Error('Token manquant');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createDemande(formData: FormData): Observable<DemandeDon> {
    return this.http.post<DemandeDon>(this.baseUrl, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        if (err.status === 401) this.authService.logout();
        return throwError(() => err);
      })
    );
  }

  getMyDemandes(): Observable<DemandeDon[]> {
    return this.http.get<DemandeDon[]>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders()
    }).  pipe(
      catchError(err => {
        if (err.status === 401) this.authService.logout();
        return throwError(() => err);
      })
    );
  }

  getAllDemandes(): Observable<DemandeDon[]> {
    return this.http.get<DemandeDon[]>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        if (err.status === 401) this.authService.logout();
        return throwError(() => err);
      })
    );
  }

  updateStatut(id: string, statut: 'ACCEPTEE' | 'REFUSEE'): Observable<DemandeDon> {
    return this.http.patch<DemandeDon>(`${this.baseUrl}/${id}/statut`, { statut }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        if (err.status === 401) this.authService.logout();
        return throwError(() => err);
      })
    );
  }
  getEtudiantsAyantDemande(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.baseUrl}/etudiants-demandes`, { headers });
}

}
