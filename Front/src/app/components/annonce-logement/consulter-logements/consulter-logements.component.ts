import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnnonceService } from '../../../services/annonce.service';

@Component({
  selector: 'app-consulter-logements',
  imports: [DatePipe],
  templateUrl: './consulter-logements.component.html',
  styleUrl: './consulter-logements.component.css'
})
export class ConsulterLogementsComponent implements OnInit{
[x: string]: any;

  constructor(private annonceService: AnnonceService) { }

  logements:any;

  ngOnInit(): void {
    this.loadAnnonces();
  }

  // Charger toutes les annonces
  loadAnnonces(): void {
    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        console.log("fata ",data)
        this.logements = data;
      },
      error: (err) => console.error('Erreur lors du chargement des annonces', err)
    });
  }
  subject: string = 'Demande concernant votre logement';
  body: string = `Bonjour,

Je vous contacte au sujet de votre logement publié sur la plateforme.

Cordialement,`;

  contacterUser(email:string) {
    // Encode les données pour mailto
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;

    // Ouvre le mail dans le client par défaut
    window.location.href = mailtoLink;
  }



}
