import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { AdminstatService } from '../../services/adminstat.service';
import { DashboardStats } from '../../models/dashboard-stats';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [RouterOutlet, AdminMenuComponent, FormsModule, DatePipe],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent implements OnInit {

  stats!: DashboardStats;
  adminNotes: string = '';
  lastSaved: Date = new Date();

  // Calendrier personnalisé
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  calendarDays: (Date | null)[] = [];

  // Événements (tu peux charger depuis ton backend plus tard)
  events = [
    { date: new Date(2025, 3, 10), title: "Campagne étudiante #28" }, // Avril 10
    { date: new Date(2025, 3, 18), title: "Gala des clubs" },
    { date: new Date(2025, 3, 15), title: "Réunion administrative" },
    { date: new Date(2025, 3, 20), title: "Fin campagne solidaire" },
  ];

  constructor(private dashboardService: AdminstatService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadNotes();
    this.generateCalendar();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error("Erreur stats", err)
    });
  }

  loadNotes() {
    const saved = localStorage.getItem('admin_notes_v3');
    if (saved) this.adminNotes = saved;
  }

  saveNotes() {
    localStorage.setItem('admin_notes_v3', this.adminNotes);
    this.lastSaved = new Date();
  }

  // === CALENDRIER PERSONNALISÉ ===
  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    // Jours vides avant le 1er
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, day));
    }
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleDateString('fr-FR', { month: 'long' });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  hasEvent(date: Date | null): boolean {
    if (!date) return false;
    return this.events.some(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  }
}
