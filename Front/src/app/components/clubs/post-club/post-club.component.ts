import { PosteService } from './../../../services/poste.service';
import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Club } from '../../../models/club';
import { CommentPostComponent } from "../comment-post/comment-post.component";

@Component({
  selector: 'app-post-club',
  imports: [MatButtonModule, MatCardModule, MatIconModule, DatePipe, CommentPostComponent],
  standalone:true,
  templateUrl: './post-club.component.html',
  styleUrl: './post-club.component.css'
})
export class PostClubComponent implements OnChanges{
   @Input() post: any;
  @Input() club: any;
  isExpanded = false;
  userReaction: 'jaime' | 'jaimePas' | null = null;
  isSubmittingComment = false;
  showComments = false;
  constructor(private postService: PosteService,
    private cdr : ChangeDetectorRef,
  ) {}
 ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] && this.post) {
      this.userReaction = this.post.userReaction; // initialise à chaque fois que le post change
    }
  }
toggleReaction(type: 'jaime' | 'jaimePas') {
  if (this.userReaction === type) {
    this.userReaction = null; // annuler
  } else {
    this.userReaction = type;
  }

  // Mettre à jour localement pour afficher immédiatement la couleur
  this.post.userReaction = this.userReaction;

  this.postService.reactToPost(this.post._id, this.userReaction).subscribe({
    next: (res) => {
      // mettre à jour les compteurs depuis backend
      this.post.nbReactions = res.data.nbReactions;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });
}


  submitComment(commentInput: HTMLInputElement): void {
      const text = commentInput.value.trim();
      if (!text || !this.post) return;

      this.isSubmittingComment = true;
      // this.postService.addComment(this.post._id, text).subscribe({
      //     next: (res) => {
      //      this.cdr.detectChanges();
      //     },
      //     error: (err) => {
      //         console.error('Failed to submit comment', err);
      //         this.isSubmittingComment = false;
      //     }
      // });
  }

}
