import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeAdhesion } from '../models/demande-adhesion';
const URL = 'http://localhost:9000/api/sheet';
@Injectable({
  providedIn: 'root'
})
export class FormulairesService {

 // private mailUrl = 'http://localhost:5000/api/mail/send';

  constructor(private http: HttpClient) {}

  getDemandeBySheet(spreadsheetId: string) {
    return this.http.post<{ success: boolean; message: string; data: DemandeAdhesion[] }>(URL+'/process-sheet', { spreadsheetId });
  }

  // sendMail(data: { email: string; sujet: string; message: string }) {
  //   return this.http.post(this.mailUrl, data);
  // }
}
