import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { passwordValidator } from '../../components/validators/password.validator';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-role-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './role-modal.component.html',
  styleUrl: './role-modal.component.css',
})
export class RoleModalComponent implements OnInit{
  message = '';

  @Input() etudiant: any;

  @Output() roleUpdated = new EventEmitter<any>();

  roleForm!: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    console.log("etd ",this.etudiant);
 this.roleForm = this.fb.group(
      {
        password: ['', [passwordValidator]],
        cPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validateur custom
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const cPassword = form.get('cPassword')?.value;
    if (password !== cPassword) {
      form.get('cPassword')?.setErrors({ ConfirmPassword: true });
    } else {
      form.get('cPassword')?.setErrors(null);
    }
  }

  getControlClass(controlName: string): any {
    const control = this.roleForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid && (control?.dirty || control?.touched),
    };
  }

  ngOnChanges() {
    if (this.etudiant) {
      this.roleForm.reset();
    }
  }

  submit() {
    if (this.roleForm.invalid) return;

    const { password, confirmPassword } = this.roleForm.value;


    // Ajout automatique de clubManager
    const updatedRoles = [...this.etudiant.role];
    if (!updatedRoles.includes('clubManager')) updatedRoles.push('clubManager');

    const payload: any = { roles: updatedRoles };
    if (this.etudiant.googleId && !this.etudiant.password && password) {
      payload.password = password;
    }

    this.roleUpdated.emit(payload);
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
