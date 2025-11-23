import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-etudiant-banner',
  standalone: true,
  imports: [],
  templateUrl: './etudiant-banner.component.html',
  styleUrl: './etudiant-banner.component.css'
})
export class EtudiantBannerComponent {
  @Input() titre: string = "Bienvenue aux Étudiants";
  @Input() description: string = "Découvrez nos ressources et services dédiés aux étudiants pour enrichir votre expérience académique.";

}
