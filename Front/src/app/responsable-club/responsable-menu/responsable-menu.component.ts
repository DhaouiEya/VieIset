import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLinkActive, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsable-menu',
  //imports: [CommonModule,RouterLink,RouterModule],
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './responsable-menu.component.html',
  styleUrl: './responsable-menu.component.css'
})
export class ResponsableMenuComponent {
  currentRoute: string = '';

  // constructor(private router: Router) {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.currentRoute = event.url;
  //     }
  //   });
  // }

  // // navigateTo(route: string) {
  // //   this.router.navigate([route]);
  // // }

  // isActive(route: string): boolean {
  //   return this.currentRoute === route;
  // }
}
