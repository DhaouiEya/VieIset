import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../../services/event.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-update-event',
  imports: [  
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
     MatNativeDateModule
  ],
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class UpdateEventComponent {
  form: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService = inject(EventService),
    private dialogRef: MatDialogRef<UpdateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public event: any
  ) {
    this.form = this.fb.group({
      title: [event.title, Validators.required],
      description: [event.description, Validators.required],
      localisation: [event.localisation, Validators.required],
      startDate: [event.startDate, Validators.required],
      endDate: [event.endDate, Validators.required],
      capacity: [event.capacity],
    });


    this.previewImage = `http://localhost:9000${event.lienImage}`;

  }

 onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    console.log('Fichier sélectionné :', file); // Affiche les infos du fichier dans la console
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result; 
      console.log('Image preview (base64) :', this.previewImage); // Affiche l'image en base64
    };
    reader.readAsDataURL(file);
  }
}




save() {
  if (this.form.invalid) return;

  const formData = new FormData();
  formData.append('title', this.form.value.title);
  formData.append('description', this.form.value.description);
  formData.append('localisation', this.form.value.localisation);
  formData.append('startDate', this.form.value.startDate);
  formData.append('endDate', this.form.value.endDate);
  formData.append('capacity', this.form.value.capacity);

  if (this.selectedImage) {
    formData.append('lienImage', this.selectedImage); // upload du fichier
  }

  this.eventService.updateEvent(this.event._id, formData).subscribe({
    next: () => {
      Swal.fire({
        title: 'Succès !',
        text: 'Événement mis à jour avec succès 🎉',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      this.dialogRef.close(true);
    },
    error: () => {
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de mettre à jour l’événement ❌',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}

  close() {
    this.dialogRef.close(false);
  }
}
