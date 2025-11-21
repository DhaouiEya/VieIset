import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeAdhesion } from '../models/demande-adhesion';

@Injectable({
  providedIn: 'root'
})
export class FormulairesService {
 private sheetUrl = 'http://localhost:5000/api/sheet/get-data';
  private mailUrl = 'http://localhost:5000/api/mail/send';

  constructor(private http: HttpClient) {}

  getSheetData(spreadsheetId: string) {
    return this.http.post<DemandeAdhesion[]>(this.sheetUrl, { spreadsheetId });
  }

  sendMail(data: { email: string; sujet: string; message: string }) {
    return this.http.post(this.mailUrl, data);
  }
}
