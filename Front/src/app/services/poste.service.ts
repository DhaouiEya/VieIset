import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Poste {
  _id?: string;
  titre: string;
  description?: string;
  dateCreation?: string;
  nbReactions?: {
    jaime: number;
    jadore: number;
    jaimePas: number;
  };
  etat?: 'partagé' | 'cloturé' | null;
  lienImage?: string;
  lienVideo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PosteService {
   private apiUrl = 'http://localhost:5000/api/postes'; // adapte si nécessaire

  constructor(private http: HttpClient) { }
  // Créer un poste
  createPoste(poste: Partial<Poste>, partager: boolean = false): Observable<Poste> {
    const body = { ...poste, partager };
    return this.http.post<Poste>(this.apiUrl, body);
  }

  // Créer un poste avec fichiers (FormData)
  createPosteWithFiles(formData: FormData): Observable<Poste> {
    return this.http.post<Poste>(this.apiUrl, formData);
  }
  // Récupérer tous les postes
  getAllPostes(): Observable<Poste[]> {
    return this.http.get<Poste[]>(this.apiUrl);
  }

  // Mettre à jour l'état d'un poste
  updateEtat(_id: string, etat: 'partagé' | 'cloturé'): Observable<Poste> {
    return this.http.put<Poste>(`${this.apiUrl}/${_id}/etat`, { etat });
  }

}
