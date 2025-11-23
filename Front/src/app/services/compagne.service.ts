import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompagneService {
  private apiUrl = 'http://localhost:9000/api/compagnes';

  constructor(private http: HttpClient) {}

  createCompagne(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllCompagnes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

   // Supprimer une campagne par son ID
  deleteCompagne(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  // Optionnel : mise à jour d'une campagne (si tu en auras besoin plus tard)
  // updateCompagne(id: string, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, data);
  // }
}
