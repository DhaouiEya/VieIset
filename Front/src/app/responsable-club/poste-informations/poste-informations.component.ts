import { CommonModule } from '@angular/common';
import { Component,Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Poste, PosteService } from '../../services/poste.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-poste-informations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './poste-informations.component.html',
  styleUrl: './poste-informations.component.css'
})
export class PosteInformationsComponent implements OnInit {
@Input() poste!: Poste;
  isEditMode = false; // ← Mode lecture/édition
  editForm!: FormGroup;

  selectedImage: File | null = null;
  selectedVideo: File | null = null;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private posteService: PosteService
  ) {}
  getObjectURL(file: File): string {
    return (window as any).URL.createObjectURL(file);
  }
  ngOnInit() {
    this.editForm = this.fb.group({
      titre: [this.poste.titre, Validators.required],
      description: [this.poste.description, Validators.required]
    });
   // this.saveChanges();
  }
  closeModal() {
    this.activeModal.close('close');
  }
  // Passer en mode édition
  enableEdit() {
    this.isEditMode = true;
  }

  // Annuler édition
  cancelEdit() {
    this.isEditMode = false;
    this.editForm.patchValue({
      titre: this.poste.titre,
      description: this.poste.description
    });
    this.selectedImage = null;
    this.selectedVideo = null;
  }

  // Gestion image
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  // Gestion vidéo
  onVideoSelected(event: any) {
    this.selectedVideo = event.target.files[0];
  }

  // Sauvegarder les modifications
  saveChanges() {
    if (this.editForm.invalid) return;

    const formData = new FormData();
    formData.append('titre', this.editForm.value.titre);
    formData.append('description', this.editForm.value.description);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }

    const id = this.poste._id;
    if (!id) {
      import('sweetalert2').then(Swal => {
        Swal.default.fire('Erreur', 'Identifiant du poste manquant, impossible de modifier.', 'error');
      });
      return;
    }

    this.posteService.updatePoste(id, formData).subscribe({
      next: (updatedPoste) => {
        this.poste = updatedPoste;
        this.isEditMode = false;
        this.selectedImage = null;
        this.selectedVideo = null;

        // SweetAlert succès
        import('sweetalert2').then(Swal => {
          Swal.default.fire('Modifié !', 'Le poste a été mis à jour.', 'success');
        });
      },
      error: () => {
        import('sweetalert2').then(Swal => {
          Swal.default.fire('Erreur', 'Impossible de modifier le poste.', 'error');
        });
      }
    });
  }

  // Supprimer le poste
  deletePoste() {
    import('sweetalert2').then(Swal => {
      Swal.default.fire({
        title: 'Supprimer ?',
        text: 'Cette action est irréversible !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then(result => {
        if (result.isConfirmed) {
          const id = this.poste._id;
          if (!id) {
            Swal.default.fire('Erreur', 'Identifiant du poste manquant, impossible de supprimer.', 'error');
            return;
          }
          this.posteService.deletePoste(id).subscribe({
            next: () => {
              this.activeModal.close('deleted');
            },
            error: () => {
              Swal.default.fire('Erreur', 'Impossible de supprimer.', 'error');
            }
          });
        }
      });
    });
  }

}
