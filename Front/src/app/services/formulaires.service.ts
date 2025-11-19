import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormulairesService {
 private sheetUrl = 'http://localhost:9000/api/sheets/get-data';
  private mailUrl = 'http://localhost:9000/api/mail/send';
  private baseUrl = 'http://localhost:9000/api/sheets/demandes';

  constructor(private http: HttpClient) {}

  getSheetData(spreadsheetId: string) {
    return this.http.post<any[]>(this.sheetUrl, { spreadsheetId });
  }

  sendMail(data: { email: string; sujet: string; message: string }) {
    return this.http.post(this.mailUrl, data);
  }

    // 🔹 Nouvelle méthode pour récupérer les demandes
  getDemandeBySheet(spreadsheetId: string) {
    return this.http.post<{ data: any[] }>(`${this.baseUrl}`, { spreadsheetId });
  }
}
