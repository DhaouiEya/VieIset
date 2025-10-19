import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { ResponsableMenuComponent } from '../responsable-menu/responsable-menu.component';

@Component({
  selector: 'app-home-reponsable',
  imports: [RouterLink,RouterLinkActive,RouterOutlet, ResponsableMenuComponent,RouterModule],
  templateUrl: './home-reponsable.component.html',
  styleUrl: './home-reponsable.component.css'
})
export class HomeReponsableComponent {

}
