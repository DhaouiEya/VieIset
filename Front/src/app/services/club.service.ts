import { inject, Injectable } from '@angular/core';
import { Club } from '../models/club';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = 'http://localhost:9000/api/clubs';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
   private readonly http : HttpClient=inject(HttpClient);

  constructor() { }
  getClubByResponsable(responsableClubId : string){
    return this.http.get<Club>(`${URL}/Responsable/${responsableClubId}`);
  }
  createClub(club: Club){
    return this.http.post<Club>(URL,club);
  }

  getClubs():Observable<{ success: boolean, data: Club[] }>{
    return this.http.get<{ success: boolean, data: Club[] }>(URL);
  }
}
