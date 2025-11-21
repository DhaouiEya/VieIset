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
import { HeaderComponent } from '../../header/header.component';
import { PosteService } from '../../../services/poste.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-espace-club',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatRippleModule,
    PostClubComponent,
    HeaderComponent,
    FormsModule
  ],
  templateUrl: './espace-club.component.html',
  styleUrl: './espace-club.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EspaceClubComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private clubService: ClubService,
    private posteservice: PosteService
  ) {}

  id_club: any;
  club: Club | any;
  posts: any[] = [];
  token: string = '';

  ngOnInit(): void {

    /** 🔥 Récupération CORRECTE du JWT depuis localStorage */
    const stored = localStorage.getItem('authenticationToken');

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.token = parsed.authToken;  // 👉 On récupère le vrai token
      } catch (e) {
        console.error("Erreur parsing token", e);
      }
    }

    console.log("TOKEN TROUVÉ :", this.token);

    this.id_club = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadClubEspace();
  }

  loadClubEspace() {
    this.clubService.getClubById(this.id_club).subscribe(
      (res) => {
        this.club = res.data.club;
        this.posts = res.data.posts;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  submitComment(post: any) {
    console.log("TOKEN UTILISÉ DANS COMMENT :", this.token);

    if (!post.newComment) return;

    if (!this.token) {
      console.error('Token manquant !');
      return;
    }

    this.posteservice.addComment(post._id, post.newComment, this.token).subscribe(
      (res) => {
        post.comments = res.comments;
        post.newComment = '';
      },
      (err) => console.error(err)
    );
  }

}
