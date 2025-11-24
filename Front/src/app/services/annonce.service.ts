import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Récupérer toutes les annonces
  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.apiUrl);
  }

  // Créer une nouvelle annonce
  createAnnonce(annonce: Annonce): Observable<Annonce> {
     const token = this.authService.getToken(); // récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Annonce>(this.apiUrl, annonce, { headers });
  }

   getMyAnnonces(): Observable<any> {
    const token = this.authService.getToken(); // récupère le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/my-annonces`, { headers });
  }
}
