import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ClubService } from '../../../services/club.service';
import { CommonModule } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-club-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModalModule,
    // Angular Material - ensure all required modules are imported
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    DragDropModule
  ],
  templateUrl: './update-club-modal.component.html',
  styleUrls: ['./update-club-modal.component.css'],
})
export class UpdateClubModalComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() club: any;
  @Output() clubUpdated = new EventEmitter<any>();
  separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  addOnBlur = true;
  private _liveAnnouncer = inject(LiveAnnouncer);

  uploadingFond = false;
  uploadingProfil = false;
  isDraggingFond = false;
  isDraggingProfil = false;

  clubForm!: FormGroup;

  ngOnInit(): void {
    console.log('club ', this.club);
    this.clubForm = this.fb.group({
      nom: [this.club?.nom || '', Validators.required],
      activites: [this.club?.activites || []], // <-- juste un tableau de string

      description: [this.club?.description || '', Validators.required],
      email: [this.club?.email || '', [Validators.required, Validators.email]],
      telephone: [this.club?.telephone || '', Validators.required],
      adresse: [this.club?.adresse || '', Validators.required],
      departement: [this.club?.departement || ''],
      dateCreation: [
        this.club?.dateCreation ? this.formatDate(this.club.dateCreation) : '',
      ],
      imageFond: [this.club?.imageFond || ''],
      imageProfil: [this.club?.imageProfil || ''],
    });
    console.log('tags ', this.clubForm.controls['activites'].value);
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  saveClub() {
  if (this.clubForm.invalid) return;

  const updatedData = this.clubForm.value;

  this.clubService.updateMonClub(updatedData).subscribe({
    next: (res) => {
      console.log('Club mis à jour:', res);
      this.clubUpdated.emit(res.data);
      this.activeModal.close();
    },
    error: (err) => {
              Swal.fire('Erreur', 'Erreur lors de la mise à jour du club', 'error');

      console.error('Erreur lors de la mise à jour du club:', err);
    }
  });
}


  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  // Méthode pour ajouter une activité
  addActivite(event: any): void {
    const value = (event.value || '').trim();

    if (value) {
      const currentActivites = this.clubForm.get('activites')?.value || [];

      // Éviter les doublons
      if (!currentActivites.includes(value)) {
        const newActivites = [...currentActivites, value];
        this.clubForm.get('activites')?.setValue(newActivites);
        this.cdr.detectChanges(); // Forcer la détection des changements
      }
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // Méthode pour supprimer une activité
  removeActivite(activite: string): void {
    const currentActivites = this.clubForm.get('activites')?.value || [];
    const newActivites = currentActivites.filter((a: string) => a !== activite);
    this.clubForm.get('activites')?.setValue(newActivites);

    this._liveAnnouncer.announce(`Removed ${activite}`);
    this.cdr.detectChanges(); // Forcer la détection des changements
  }

  // Méthode pour éditer une activité
  editActivite(oldActivite: string, event: any): void {
    const value = event.value.trim();
    const currentActivites = this.clubForm.get('activites')?.value || [];

    if (!value) {
      // Si vide, supprimer
      this.removeActivite(oldActivite);
    } else {
      // Mettre à jour l'activité
      const index = currentActivites.indexOf(oldActivite);
      if (index >= 0) {
        const newActivites = [...currentActivites];
        newActivites[index] = value;
        this.clubForm.get('activites')?.setValue(newActivites);
        this.cdr.detectChanges(); // Forcer la détection des changements
      }
    }
  }

// Drag & Drop events
  onDragOver(event: DragEvent, type: 'imageFond' | 'imageProfil') {
    event.preventDefault();
    if (type === 'imageFond') this.isDraggingFond = true;
    else this.isDraggingProfil = true;
  }

  onDragLeave(event: DragEvent, type: 'imageFond' | 'imageProfil') {
    if (type === 'imageFond') this.isDraggingFond = false;
    else this.isDraggingProfil = false;
  }

  onDrop(event: DragEvent, type: 'imageFond' | 'imageProfil') {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files?.length) this.uploadFile(files[0], type);
    if (type === 'imageFond') this.isDraggingFond = false;
    else this.isDraggingProfil = false;
  }

  onFileSelected(event: any, type: 'imageFond' | 'imageProfil') {
    const file = event.target.files[0];
    if (file) this.uploadFile(file, type);
  }

  uploadFile(file: File, type: 'imageFond' | 'imageProfil') {
    if (type === 'imageFond') this.uploadingFond = true;
    else this.uploadingProfil = true;

    const reader = new FileReader();
    reader.onload = () => {
      this.clubForm.patchValue({ [type]: reader.result });
      if (type === 'imageFond') this.uploadingFond = false;
      else this.uploadingProfil = false;
    };
    reader.readAsDataURL(file);
  }

  removeImage(type: 'imageFond' | 'imageProfil') {
    this.clubForm.patchValue({ [type]: '' });
  }
}
