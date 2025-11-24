import { Component } from '@angular/core';
import { BarreComponent } from '../../../barre/barre.component';
import { ResponsableMenuComponent } from '../../../responsable-club/responsable-menu/responsable-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-clubmanager-dash',
  imports: [BarreComponent,ResponsableMenuComponent,RouterOutlet],
  templateUrl: './clubmanager-dash.component.html',
  styleUrl: './clubmanager-dash.component.css'
})
export class ClubmanagerDashComponent {

}
