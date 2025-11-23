import { Component } from '@angular/core';
import { FooterHomeComponent } from "../footer-home/footer-home.component";
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-bar-home',
  imports: [FooterHomeComponent,RouterOutlet,RouterLink],
  templateUrl: './app-bar-home.component.html',
  styleUrl: './app-bar-home.component.css'
})
export class AppBarHomeComponent {

}
