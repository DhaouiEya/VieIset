import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Etudiant {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:9000/api/etudiants';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les étudiants
  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }
}
