import { AuthService } from './../../../services/auth.service';
import { ClubService } from './../../../services/club.service';
import { ActivatedRoute } from '@angular/router';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
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
import { PublicationPostComponent } from "../../../responsable-club/publication-post/publication-post.component";
import { PosteService } from '../../../services/poste.service';
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
  ],
  templateUrl: './espace-club.component.html',
  styleUrl: './espace-club.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EspaceClubComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private clubService: ClubService,
    private posteservice: PosteService,
    private authService :AuthService,
  ) {}
    isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  id_club: any;
  club: Club | any;
  posts: any[] = [];
  user:any;

  ngOnInit(): void {
this.user=this.authService.getUser()?.user;
    console.log("post in post club ",this.posts)

    console.log("user 555 ",this.user)
    this.id_club = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadClubEspace();
  }

  loadClubEspace() {
        this.isLoading.set(true);

    this.clubService.getClubById(this.id_club).subscribe(
      (res)=>{
        console.log("res ",res)
        this.club=res.data.club;
        this.posts=res.data.posts;
        console.log("posttt ",this.posts)
        this.isLoading.set(false);

        console.log(res)
      },
      (err)=>{
this.error.set('Failed to load club data.');
        this.isLoading.set(false);
        console.error(err);
            }
    )
  }


}
