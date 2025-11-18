import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';


export type MenuItem={
  icon:string,
  label:string,
  route:string
}
@Component({
  selector: 'app-res-side-bar',
  imports: [MatSidenavModule, MatToolbar, MatButtonModule, MatIconModule, MatBadgeModule,MatListModule,RouterLink,RouterOutlet,MatMenuModule],
  templateUrl: './res-side-bar.component.html',
  styleUrl: './res-side-bar.component.css'
})
export class ResSideBarComponent {
    isLoggedIn = false;
  collapsed = signal(false);

 router:Router=inject(Router);
 menuItems=signal<MenuItem[]>([
     { icon: 'dashboard', label: 'Home', route: '/res_club/dashboard' },
      { icon: 'article', label: 'Publications', route: '/res_club/publications' },
      { icon: 'people', label: 'Formulaires', route: '/res_club/participation-forms' },
      { icon: 'group', label: 'Membres', route: '/res_club/membres' },
      { icon: 'event', label: 'Événements', route: '/res_club/consulter-events'},
   ]) ;
  // Signal pour la largeur de la sidebar  
  sidenavWidth = computed(() => this.collapsed() ? '98px': '320px');
  hidden =computed(()=>this.collapsed()?'none':'block');


}
