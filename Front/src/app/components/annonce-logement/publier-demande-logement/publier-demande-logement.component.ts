import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AnnonceService } from '../../../services/annonce.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publier-demande-logement',
  imports: [ReactiveFormsModule],
  templateUrl: './publier-demande-logement.component.html',
  styleUrl: './publier-demande-logement.component.css',
})
export class PublierDemandeLogementComponent implements OnInit {
    @Output() demandePubliee = new EventEmitter<any>();


  private fb = inject(FormBuilder);
  constructor(private annonceService: AnnonceService) {}

  demandeForm!: FormGroup;

  ngOnInit(): void {
    this.demandeForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  submitDemande(): void {
    console.log("appel fonc")
    if (this.demandeForm.valid) {
    console.log("form vald")

      // L'utilisateur a confirmé, procéder à l'ajout
      this.annonceService.createAnnonce(this.demandeForm.value).subscribe({
        next: (data) => {
               this.demandePubliee.emit(data);
          this.demandeForm.reset();

          Swal.fire({
            icon: 'success',
            title: 'Annonce ajoutée !',
            text: 'Votre annonce a été créée avec succès.',
            showConfirmButton: false,
            timer: 2000,
          });
        },
        error: (err) => {
          console.error("Erreur lors de la création de l'annonce", err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Une erreur est survenue lors de la création de l'annonce.",
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }
}
