import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { DemandeAdhesion } from '../models/demande-adhesion';
const URL = 'http://localhost:9000/api/sheet';
=======

>>>>>>> c56cb58786912246bf60b446e11a300ca5a11c95
@Injectable({
  providedIn: 'root'
})
export class FormulairesService {
<<<<<<< HEAD

 // private mailUrl = 'http://localhost:5000/api/mail/send';

  constructor(private http: HttpClient) {}

  getDemandeBySheet(spreadsheetId: string) {
    return this.http.post<{ success: boolean; message: string; data: DemandeAdhesion[] }>(URL+'/process-sheet', { spreadsheetId });
  }

  // sendMail(data: { email: string; sujet: string; message: string }) {
  //   return this.http.post(this.mailUrl, data);
  // }
=======
 private sheetUrl = 'http://localhost:5000/api/sheet/get-data';
  private mailUrl = 'http://localhost:5000/api/mail/send';

  constructor(private http: HttpClient) {}

  getSheetData(spreadsheetId: string) {
    return this.http.post<any[]>(this.sheetUrl, { spreadsheetId });
  }

  sendMail(data: { email: string; sujet: string; message: string }) {
    return this.http.post(this.mailUrl, data);
  }
>>>>>>> c56cb58786912246bf60b446e11a300ca5a11c95
}
