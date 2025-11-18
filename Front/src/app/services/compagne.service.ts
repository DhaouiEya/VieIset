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
}
