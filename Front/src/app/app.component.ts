import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateClubComponent } from "./components/clubs/create-club/create-club.component";

// import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
