import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule,RouterLink,PasswordStrengthMeterComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  hasError!: boolean;
  message = '';
  passwordVisible: boolean = false;
  token: string | null = null; // Token extracted from the URL

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    // Get the token from the URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorState = ErrorStates.HasError;
      this.message = 'Invalid or missing token.';
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  initForm() {
    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],

        cPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
        ],
    },
   { validators: this.passwordMatchValidator });
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

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const passwordField: any = document.getElementById('passwordField');
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  submit() {
    if (!this.token) {
      this.errorState = ErrorStates.HasError;
      this.message = 'Invalid or missing token.';
      return;
    }

    if (this.resetPasswordForm.invalid) {
      this.errorState = ErrorStates.HasError;
      this.message = 'Please fill out the form correctly.';
      return;
    }

    this.hasError = false;

    const resetPasswordSubscr = this.authService
      .resetPassword(this.f['password'].value, this.token)
      .pipe(first())
      .subscribe({
        next: (res: any | undefined) => {
          if (res.success) {
            this.errorState = ErrorStates.NoError;
            this.router.navigate(['/login']); // Redirect to login
          } else {
            this.errorState = ErrorStates.HasError;
            if (res.message)
              this.message = res.message;
            else
              this.message = res.error || 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
          }
        },
        error: (err) => {
          this.errorState = ErrorStates.HasError;
          // Check if error has a message property, otherwise use a default message
          this.message = err.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
        }
      });

    this.unsubscribe.push(resetPasswordSubscr);
  }

}
