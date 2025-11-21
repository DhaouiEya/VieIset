import { inject, Injectable } from '@angular/core';
import { Reclamation } from '../models/reclamation';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

const URL = 'http://localhost:9000/api/reclamations';
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private http :HttpClient=inject(HttpClient);
  authService : AuthService= inject(AuthService);
  constructor() { }
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(URL);
  }
  getReclamationsByEtudiantId(etudiantId: string): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${URL}/etudiant/${etudiantId}`);
  }

   

  createReclamation(data: { sujet: string; description: string }) {
    const userId = this.authService.getUserId(); // 🔥 prend l'id depuis le token

    const body = {
      etudiantId: userId,
      ...data
    };

    return this.http.post(`${URL}/create`, body);
  }
}
