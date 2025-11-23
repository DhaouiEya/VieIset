import { Component, OnInit } from '@angular/core';
import { Club } from '../../../models/club';
import { ClubService } from '../../../services/club.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clubs-list',
  imports: [ FooterComponent],
  templateUrl: './clubs-list.component.html',
  styleUrl: './clubs-list.component.css',
})
export class ClubsListComponent implements OnInit {
  clubs: Club[] = [];

  constructor(private clubService: ClubService, private router: Router) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubs().subscribe(
      (response: any) => {
        if (response.success) {
          this.clubs = response.data;
        } else {
          console.error('Failed to load clubs');
        }
      },
      (err: any) => {
        console.error('Error loading clubs:', err);
      }
    );
  }

  goToClubSpace(id: string | undefined) {
    this.router.navigate(['/espaceClub', id]);
  }
}
