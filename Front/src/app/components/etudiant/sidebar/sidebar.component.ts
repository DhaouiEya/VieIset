import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';


import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TitleCasePipe } from '@angular/common';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export type MenuItem={
  icon:string,
  label:string,
  route:string
}
@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatBadgeModule,MatListModule,RouterLink,RouterOutlet,MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SidebarComponent implements OnInit {
  menuOpen = false;
   isLoggedIn = false;
   router:Router=inject(Router);
  collapsed = signal(false);
  private authService :AuthService= inject(AuthService)
  id=this.authService.getUserId();

 ngOnInit(): void {
  console.log("id de use connecté ",this.id);
 
  }
  menuItems=signal<MenuItem[]>([
     { icon: 'home', label: 'Home', route: '/employee/dashboard' },
       { icon: 'group', label: 'Clubs', route: '/employee/listeFormations' },
       {  icon: 'events', label: 'Evenements', route: '/employee/formations' },
      {  icon: 'events', label: 'Logements', route: '/employee/profil' }
     
   ])
  // Signal pour la largeur de la sidebar  
  sidenavWidth = computed(() => this.collapsed() ? '74px': '320px');
  hidden =computed(()=>this.collapsed()?'none':'block');

  
toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

createReclamation() {
  this.menuOpen = false;
  this.router.navigate(['/create-reclamation']); // ou ta route
}

viewReclamations() {
  this.menuOpen = false;
  this.router.navigate(['/reclamations']); // ou ta route
}

logout() {
  this.menuOpen = false;
  // ton code logout
  console.log('Déconnexion');
}

}


