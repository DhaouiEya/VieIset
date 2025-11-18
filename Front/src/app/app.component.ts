import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarreComponent } from './barre/barre.component';

// import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,BarreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
