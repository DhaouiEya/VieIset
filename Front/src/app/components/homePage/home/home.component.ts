import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class HomeComponent {
router =inject(Router); ;
  startAlert() {
    Swal.fire({
      title: "Bienvenue 🎉",
      text: "Choisissez une fonctionnalité pour commencer.",
      icon: "info",
      confirmButtonText: "OK"
    });
  }
login() {
  this.router.navigate(['/home/login']);
}
  openLogin() {
    Swal.fire({
      title: "Connexion",
      text: "Merci de vous identifier pour continuer.",
      icon: "warning",
      confirmButtonText: "Allons-y"
    });
  }
}
