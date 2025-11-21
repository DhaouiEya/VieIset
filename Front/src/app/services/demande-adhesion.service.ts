import { inject, Injectable } from '@angular/core';
import { DemandeAdhesion } from '../models/demande-adhesion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const URL = 'http://localhost:9000/api/demandeAdhesion'; 
@Injectable({
  providedIn: 'root'
})
export class DemandeAdhesionService {
  private readonly http : HttpClient=inject(HttpClient);
  constructor() { }
    getDemandes(): Observable<DemandeAdhesion[]> {
    return this.http.get<DemandeAdhesion[]>(URL + '/demandes');
  }
    getDemande(demandeId: string) {
    return this.http.get<DemandeAdhesion>(`${URL}/demandes/${demandeId}`);
  }

   sendDates(demandeId: string, dates: string[]): Observable<any> {
    return this.http.post(`${URL}/demandes/${demandeId}/envoyer-dates`, { dates });
  }

   getDemandesByEtudiantId(etudiantId: string): Observable<DemandeAdhesion[]> {
    return this.http.get<DemandeAdhesion[]>(
      `${URL}/demandes/${etudiantId}`
    );
  }


}
