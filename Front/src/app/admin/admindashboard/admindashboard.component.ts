import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-admindashboard',
  imports: [RouterOutlet,AdminMenuComponent],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {

}
