import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';
import { HomeReponsableComponent } from "../home-reponsable/home-reponsable.component";

@Component({
  selector: 'app-responsable-dashboard',
  imports: [ResponsableMenuComponent, RouterOutlet, RouterLinkWithHref],
  templateUrl: './responsable-dashboard.component.html',
  styleUrl: './responsable-dashboard.component.css'
})
export class ResponsableDashboardComponent {

  constructor(private router: Router) {}
}
