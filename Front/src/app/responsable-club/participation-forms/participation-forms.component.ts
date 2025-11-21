import { Component } from '@angular/core';
import { FormulairesService } from '../../services/formulaires.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';

@Component({
  selector: 'app-participation-forms',
  imports: [FormsModule, CommonModule, ResponsableMenuComponent],
  templateUrl: './participation-forms.component.html',
  styleUrl: './participation-forms.component.css'
})
export class ParticipationFormsComponent {
  spreadsheetId = '';
  etudiants: any[] = [];
  isLoading = false;
  errorMessage = '';
    currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private forms: FormulairesService,
    private http: HttpClient // Ajout de HttpClient
  ) {}

  async chargerSheet() {
    if (!this.spreadsheetId.trim()) {
      this.errorMessage = 'Veuillez entrer un SPREADSHEET_ID valide';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.http.post<any[]>(
        'http://localhost:9000/api/sheets/get-data',
        { spreadsheetId: this.spreadsheetId.trim() }
      ).toPromise();

      this.etudiants = response || [];

      if (this.etudiants.length === 0) {
        this.errorMessage = 'Aucune donnée trouvée dans le sheet';
      } else {
        console.log('Données chargées:', this.etudiants);
      }

    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      this.errorMessage = error.error?.error || 'Erreur lors du chargement';
      this.etudiants = [];
    } finally {
      this.isLoading = false;
    }
  }

  envoyerMail(etudiant: any) {
    const sujet = `Convocation pour le club ${etudiant.club}`;
    const message = `Bonjour ${etudiant.nom}, vous êtes invité à un entretien pour le club ${etudiant.club}.`;

    this.forms.sendMail({ email: etudiant.email, sujet, message })
      .subscribe({
        next: () => alert('Mail envoyé à ' + etudiant.nom),
        error: (err) => {
          console.error('Erreur envoi mail:', err);
          alert('Erreur lors de l\'envoi du mail à ' + etudiant.nom);
        }
      });
  }

  getPaginatedEtudiants() {
    const startIndex = this.currentPage * this.pageSize;
    return this.etudiants.slice(startIndex, startIndex + this.pageSize);
  }

  // Calcul du nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.etudiants.length / this.pageSize);
  }

  // Navigation entre les pages
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // Générer les numéros de page à afficher
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;

    // Afficher au maximum 5 pages
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(total - 1, startPage + 4);

    // Ajuster si on est proche du début
    if (endPage - startPage < 4 && startPage > 0) {
      startPage = Math.max(0, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Autres méthodes existantes
  trackById(index: number, item: any): any {
    return item.id || index;
  }
}
