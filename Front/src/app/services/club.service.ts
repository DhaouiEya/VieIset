import { inject, Injectable } from '@angular/core';
import { Club } from '../models/club';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserModel } from '../models/user.model';

const URL = 'http://localhost:9000/api/clubs';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
   private readonly http : HttpClient=inject(HttpClient);
  private authLocalStorageToken = 'authenticationToken';

  constructor() { }
  getClubByResponsable(responsableClubId : string){
    return this.http.get<Club>(`${URL}/Responsable/${responsableClubId}`);
  }
 createClub(formData: FormData) {
  return this.http.post<Club>(URL + '/create', formData);
}


  getClubs():Observable<{ success: boolean, data: Club[] }>{
    return this.http.get<{ success: boolean, data: Club[] }>(URL);
  }
   getClubById(clubId: string): Observable<{ data: { club: Club, posts: any[] } }> {
        const token = this.getToken();

    return this.http.get<{ data: { club: Club, posts: any[] } }>(`${URL}/${clubId}`,{
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
