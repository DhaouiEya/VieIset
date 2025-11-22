import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReclamationService } from '../../../services/reclamation.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-reclamation',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    
    MatNativeDateModule,],
  templateUrl: './create-reclamation.component.html',
  styleUrl: './create-reclamation.component.css'
})
export class CreateReclamationComponent {
dialogRef = inject(MatDialogRef<CreateReclamationComponent>);
  fb = inject(FormBuilder);
  reclamationService = inject(ReclamationService);

  form: FormGroup = this.fb.group({
    sujet: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
  });

  submit() {
    if (this.form.invalid) return;

    const data = this.form.value;

    this.reclamationService.createReclamation(data).subscribe({
      next: () => {
        this.dialogRef.close('created');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
