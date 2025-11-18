import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Annonce {
  _id?: string;
  titre: string;
  description: string;
  dateCreation?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  private apiUrl = 'http://localhost:9000/api/annonces'; // adapte l'URL à ton backend

  constructor(private http: HttpClient) { }

  // Récupérer toutes les annonces
  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.apiUrl);
  }

  // Créer une nouvelle annonce
  createAnnonce(annonce: Annonce): Observable<Annonce> {
    return this.http.post<Annonce>(this.apiUrl, annonce);
  }
}
