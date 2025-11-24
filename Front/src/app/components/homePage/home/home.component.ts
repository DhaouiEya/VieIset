import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit{
   images: string[] = [


    'img1.jpeg',
    'img2.jpeg',
    'img3.jpeg',
    'img4.jpeg',
    'img5.jpeg',


  ];
  currentIndex: number = 0;
    ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
     //pour defiler les image
    this.startSlider();
  }
    startSlider() {
    setInterval(() => {
     this.currentIndex = (this.currentIndex + 1) % this.images.length;
   }, 3000);
 }
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
