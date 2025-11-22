import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-post',
  imports: [DatePipe],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css'
})
export class CommentPostComponent {

  @Input() comment: any;

}
