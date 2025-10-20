import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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


   reactToPost(postId: string, reaction: 'jaime' | 'jaimePas' | null): Observable<any> {
    const token = this.getToken();
    console.log("token : ",token);
    return this.http.put(`${this.apiUrl}/react/${postId}`, { reaction },{
      headers: { Authorization: `Bearer ${token}` }
    });
  }




      private setAuthFromLocalStorage(auth: UserModel): boolean {
      // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (auth && auth.authToken) {
          localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
          return true;
        }
      }
      return false;
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

      getToken() {
      const auth = this.getAuthFromLocalStorage();
      if (!auth || !auth.authToken) {
        return of(undefined);
      }
      return auth.authToken;
    }


}
