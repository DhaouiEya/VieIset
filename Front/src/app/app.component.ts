import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { CreateClubComponent } from "./components/clubs/create-club/create-club.component";

@Component({
  selector: 'app-root',
  imports: [CreateClubComponent],
  //imports: [RouterOutlet, EventListComponent, CreateClubComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
