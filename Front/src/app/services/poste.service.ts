import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserModel } from '../models/user.model';

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
  private apiUrl = 'http://localhost:9000/api/postes'; // adapte si nécessaire
  private authLocalStorageToken = 'authenticationToken';

  constructor(private http: HttpClient) { }

  // Méthode privée pour obtenir les headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Créer un poste
  createPoste(poste: Partial<Poste>, partager: boolean = false): Observable<Poste> {
    const body = { ...poste, partager };
    const headers = this.getAuthHeaders();
    return this.http.post<Poste>(this.apiUrl, body, { headers }).pipe(
      catchError(err => {
        console.error('Error creating post:', err);
        return throwError(err);
      })
    );
  }

  // Créer un poste avec fichiers (FormData)
  createPosteWithFiles(formData: FormData): Observable<Poste> {
    const headers = this.getAuthHeaders();
    return this.http.post<Poste>(this.apiUrl, formData, { headers }).pipe(
      catchError(err => {
        console.error('Error creating post with files:', err);
        return throwError(err);
      })
    );
  }

  // Récupérer tous les postes
  getAllPostes(): Observable<Poste[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Poste[]>(this.apiUrl, { headers }).pipe(
      catchError(err => {
        console.error('Error fetching posts:', err);
        return throwError(err);
      })
    );
  }

  // Mettre à jour l'état d'un poste
  updateEtat(_id: string, etat: 'partagé' | 'cloturé'): Observable<Poste> {
    const headers = this.getAuthHeaders();
    return this.http.put<Poste>(`${this.apiUrl}/${_id}/etat`, { etat }, { headers }).pipe(
      catchError(err => {
        console.error('Error updating post state:', err);
        return throwError(err);
      })
    );
  }

  reactToPost(postId: string, reaction: 'jaime' | 'jaimePas' | null): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/react/${postId}`, { reaction }, { headers }).pipe(
      catchError(err => {
        console.error('Error reacting to post:', err);
        return throwError(err);
      })
    );
  }

  // Ajoute ces deux méthodes
  deletePoste(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(err => {
        console.error('Error deleting post:', err);
        return throwError(err);
      })
    );
  }

  updatePoste(id: string, data: any): Observable<Poste> {
    const headers = this.getAuthHeaders();
    return this.http.put<Poste>(`${this.apiUrl}/${id}`, data, { headers }).pipe(
      catchError(err => {
        console.error('Error updating post:', err);
        return throwError(err);
      })
    );
  }

  private getAuthFromLocalStorage(): UserModel | undefined {
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const lsValue = localStorage.getItem(this.authLocalStorageToken);
        if (!lsValue) {
          return undefined;
        }
        const authData = JSON.parse(lsValue);
        return authData;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getToken(): string | undefined {
    const auth = this.getAuthFromLocalStorage();
    return auth?.authToken;
  }
}
