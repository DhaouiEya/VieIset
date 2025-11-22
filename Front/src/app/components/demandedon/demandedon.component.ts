import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandeDonService } from '../../services/demandedon.service';
import Swal from 'sweetalert2'; // <-- Import SweetAlert2
import { DatePipe, NgClass } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DemandeDon } from '../../models/demande-don.model';

@Component({
  selector: 'app-demandedon',
  imports: [ReactiveFormsModule,NgClass,DatePipe,HeaderComponent,FooterComponent],
  templateUrl: './demandedon.component.html',
  styleUrl: './demandedon.component.css'
})
export class DemandedonComponent implements OnInit{
demandeForm!: FormGroup;
  myDemandes: DemandeDon[] = [];
  selectedFile!: File | null;

  constructor(private fb: FormBuilder, private demandeService: DemandeDonService) {}

  ngOnInit(): void {
    this.demandeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
      annexe: [null]
    });

    this.loadMyDemandes();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  submitDemande() {
    if (!this.demandeForm.valid) return;

    const formData = new FormData();
    formData.append('title', this.demandeForm.value.title);
    formData.append('description', this.demandeForm.value.description);
    formData.append('montant', this.demandeForm.value.montant.toString());
    if (this.selectedFile) {
      formData.append('annexe', this.selectedFile, this.selectedFile.name);
    }

    this.demandeService.createDemande(formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Demande envoyée !',
          text: 'Votre demande a été soumise avec succès.',
          confirmButtonText: 'OK'
        });
        this.demandeForm.reset();
        this.selectedFile = null;
        this.loadMyDemandes();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible d\'envoyer la demande. Veuillez réessayer.',
          confirmButtonText: 'OK'
        });
        console.error(err);
      }
    });
  }

  loadMyDemandes() {
    this.demandeService.getMyDemandes().subscribe({
      next: (res) => this.myDemandes = res,
      error: (err) => console.error(err)
    });
  }
}

