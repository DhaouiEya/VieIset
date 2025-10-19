import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Club } from '../../../models/club';

@Component({
  selector: 'app-post-club',
  imports: [MatButtonModule,MatCardModule,MatIconModule,DatePipe],
  templateUrl: './post-club.component.html',
  styleUrl: './post-club.component.css'
})
export class PostClubComponent {
   @Input() post: any;
  @Input() clubNom!: Club;

 isExpanded = false;
  likes: number = 0;
  liked: boolean = false;


  toggleLike() {
    if(this.liked) {
      this.likes--;
    } else {
      this.likes++;
    }
    this.liked = !this.liked;
  }

 

}
