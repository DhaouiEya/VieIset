import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-etudiant-banner2',
  standalone: true,
  imports: [],
  templateUrl: './etudiant-banner2.component.html',
  styleUrl: './etudiant-banner2.component.css'
})
export class EtudiantBanner2Component {
  @Input() titre: string = "Bienvenue aux Étudiants";
  @Input() description: string = "Découvrez nos ressources et services dédiés aux étudiants pour enrichir votre expérience académique.";

}
