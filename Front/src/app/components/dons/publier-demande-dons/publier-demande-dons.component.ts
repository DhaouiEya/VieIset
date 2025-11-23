import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DemandeDonService } from '../../../services/demandedon.service';

@Component({
  selector: 'app-publier-demande-dons',
    standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './publier-demande-dons.component.html',
  styleUrl: './publier-demande-dons.component.css',
})
export class PublierDemandeDonsComponent implements OnInit {
      @Output() demandeDonsAjoutee = new EventEmitter<any>();

  demandeForm!: FormGroup;
  selectedFile!: File | null;

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeDonService
  ) {}

  ngOnInit(): void {
        this.demandeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
      annexe: [null]
    });
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
                this.demandeDonsAjoutee.emit(res);

        Swal.fire({
          icon: 'success',
          title: 'Demande envoyée !',
          text: 'Votre demande a été soumise avec succès.',
          confirmButtonText: 'OK',
        });
        
        this.demandeForm.reset();
        this.selectedFile = null;
        // this.loadMyDemandes();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible d'envoyer la demande. Veuillez réessayer.",
          confirmButtonText: 'OK',
        });
        console.error(err);
      },
    });
  }
}
