import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  private apiUrl = 'http://localhost:9000/api/users';
    private authLocalStorageToken = 'authenticationToken';


  constructor(private http: HttpClient) {}

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

  // Récupérer tous les étudiants
  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }


  getByFFilteredEtudiants(search: string = '', page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/etudiants`, { params });
  }

   addClubManagerRole(userId: string, password?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/add-club-manager`, { password });
  }


    private getAuthFromLocalStorage(): any | undefined {
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
