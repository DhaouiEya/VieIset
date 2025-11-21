// demandedon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // ← AJOUTE ÇA

export interface DemandeDon {
  _id?: string;
  title: string;
  description: string;
  montant: number;
  statut?: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
  dateDemande?: Date;
  annexe?: string;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeDonService {
  private baseUrl = 'http://localhost:9000/api/demandedon';

  constructor(
    private http: HttpClient,
    private authService: AuthService  // ← Injection du AuthService
  ) {}

  // Récupère le token proprement via AuthService
  private getToken(): string | null {
    const token = this.authService.getToken();
    // getToken() retourne déjà le string ou undefined
    return typeof token === 'string' ? token : null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      console.error('Aucun token trouvé → déconnexion');
      this.authService.logout();
      throw new Error('No token');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createDemande(formData: FormData): Observable<DemandeDon> {
    const headers = this.getAuthHeaders();

    console.log('Token envoyé (extrait) →', headers.get('Authorization')?.substring(0, 40) + '...');

    return this.http.post<DemandeDon>(this.baseUrl, formData, {
      headers
    }).pipe(
      catchError(err => {
        console.error('Erreur création demande:', err);
        if (err.status === 401) {
          alert('Session expirée');
          this.authService.logout();
        }
        return throwError(() => err);
      })
    );
  }

  getMyDemandes(): Observable<DemandeDon[]> {
    return this.http.get<DemandeDon[]>(`${this.baseUrl}/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
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
}
