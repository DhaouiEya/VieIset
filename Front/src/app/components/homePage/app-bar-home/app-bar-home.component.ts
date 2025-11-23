import { Component } from '@angular/core';
import { FooterHomeComponent } from "../footer-home/footer-home.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../footer/footer.component";
import { AboutUsComponent } from "../about-us/about-us.component";

@Component({
  selector: 'app-app-bar-home',
  imports: [FooterHomeComponent, RouterOutlet, RouterLink],
  templateUrl: './app-bar-home.component.html',
  styleUrl: './app-bar-home.component.css'
})
export class AppBarHomeComponent {

}
