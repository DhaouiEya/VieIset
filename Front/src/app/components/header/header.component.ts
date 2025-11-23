import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(private authService: AuthService,private router: Router) {}

  menuOpen = false;
  user:any;
  ngOnInit(): void {
    this.user=this.authService.getUser()?.user;


  }

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

logout() {
  this.authService.logout();
}


}
