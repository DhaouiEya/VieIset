import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReclamationService } from '../../../services/reclamation.service';

@Component({
  selector: 'app-publier-reclamation',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './publier-reclamation.component.html',
  styleUrl: './publier-reclamation.component.css'
})
export class PublierReclamationComponent {
    @Output() reclamationAjoutee = new EventEmitter<any>();

  fb = inject(FormBuilder);
  reclamationService = inject(ReclamationService);

  form: FormGroup = this.fb.group({
    sujet: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

   get sujet() {
    return this.form.get('sujet');
  }

  get description() {
    return this.form.get('description');
  }

  ajouterReclamation() {
    if (this.form.invalid) return;
    console.log(this.form.value);
    const data = this.form.value;

    this.reclamationService.createReclamation(data).subscribe({
      next: (res) => {
  this.reclamationAjoutee.emit(res);
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
