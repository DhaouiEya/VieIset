import { ClubService } from './../../../services/club.service';
import { ActivatedRoute } from '@angular/router';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Club } from '../../../models/club';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { PostClubComponent } from '../post-club/post-club.component';
@Component({
  selector: 'app-espace-club',
  imports: [
    DatePipe, // obligatoire pour Angular Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatRippleModule,
    PostClubComponent,
  ],
  templateUrl: './espace-club.component.html',
  styleUrl: './espace-club.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EspaceClubComponent implements OnInit {
      club: Club = {
      nom: 'Club Informatique ISETCH',
      description: 'Un espace pour les passionnés de technologie et de programmation 💻.',
      imageProfil: 'https://media.licdn.com/dms/image/v2/D4D0BAQEB5QqkrEi67g/company-logo_200_200/company-logo_200_200/0/1705913997648/the_team_by_iset_djerba_logo?e=2147483647&v=beta&t=OA4BzPsP_q2MTQnQFsSQ_p4dh1b6mlqN4dY3NLBRcWo',
      imageFond: 'https://images.unsplash.com/photo-1503264116251-35a269479413',
      dateCreation: new Date('2020-09-01'),
      departement: 'Informatique',
      adresse: 'ISET Charguia, Tunis',
      telephone: '+216 22 333 444',
      email: 'clubinfo@isetch.tn',

      reseaux: {
        facebook: 'https://facebook.com/clubinfo.isetch',
        instagram: 'https://instagram.com/clubinfo.isetch'
      },
      manager: 'Ameni Abidi',
    };
   posts = [
      {
        contenu: "Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants !Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants ! v Notre premier atelier sur Angular 🚀 Merci à tous les participants !",
        date: new Date(),
        image: 'https://images.unsplash.com/photo-1503264116251-35a269479413'
      },
      {
        contenu: "Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Notre premier atelier sur Angular 🚀 Merci à tous les participants !Notre premier atelier sur Angular 🚀 Merci à tous les participants ! Formation Docker 🐳 prévue la semaine prochaine ! Inscrivez-vous vite.",
        date: new Date(),
         image: 'https://images.unsplash.com/photo-1503264116251-35a269479413'
      },
      {
        contenu: "Retour sur notre hackathon 2025 — quelle énergie incroyable ⚡!",
        date: new Date(),
        image: 'https://images.unsplash.com/photo-1503264116251-35a269479413'
      }
    ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clubService: ClubService
  ) {}

  id_club: any;
  // club: Club | any;
  // posts: any[] = [];

  ngOnInit(): void {
    this.id_club = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadClubEspace();
  }
  loadClubEspace() {
    this.clubService.getClubById(this.id_club).subscribe(
      (res)=>{
        this.club=res.data.club;
        this.posts=res.data.posts;

        console.log(res)
      },
      (err)=>{
        console.error(err)
      }
    )
  }




}

