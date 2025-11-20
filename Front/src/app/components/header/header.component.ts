import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthService,private router: Router) {}

  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

logout() {
  this.authService.logout();
}


}
