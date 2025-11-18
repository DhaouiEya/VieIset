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
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from '../../header/header.component';
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
    HeaderComponent
],
  templateUrl: './espace-club.component.html',
  styleUrl: './espace-club.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EspaceClubComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private clubService: ClubService
  ) {}

  id_club: any;
  club: Club | any;
  posts: any[] = [];

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

