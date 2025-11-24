import { Component } from '@angular/core';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { RouterOutlet } from '@angular/router';
import { BarreComponent } from '../../barre/barre.component';

@Component({
  selector: 'app-admin-dash',
  imports: [AdminMenuComponent,RouterOutlet,BarreComponent],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css'
})
export class AdminDashComponent {

}
