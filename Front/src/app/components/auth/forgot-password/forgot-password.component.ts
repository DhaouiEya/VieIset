import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, HeaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  message = '';
  sent = false;
  resendDisabled = false;
  resendCountdown = 60;
  // private fields
  private unsubscribe: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,

  ) {
  }

  ngOnInit(): void {

    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;

    const forgotPasswordSubscr = this.authService
      .forgotPassword(this.f['email'].value)
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            this.sent = true;
            this.errorState = ErrorStates.NoError;
            this.message =
              'Password reset email sent. Please check your inbox.';
            this.authService.currentUserValue = {
              email: this.f['email'].value,
            } as any;
          } else {

            this.errorState = ErrorStates.HasError;
            console.log("rrr"+result)
            if (result.message) this.message = result.message;
            else
              this.message =
                result.error || 'Une erreur est survenue. Veuillez réessayer.';
          }
        },
        error: (err) => {
          this.errorState = ErrorStates.HasError;
          console.log(err);
          this.message =
            err.error.message ||
            "Une erreur est survenue lors de l'envoi de l'e-mail de réinitialisation.";
        }
      });

    this.unsubscribe.push(forgotPasswordSubscr);
  }

  startResendCountdown() {
    this.resendDisabled = true;
    const interval = setInterval(() => {
      this.resendCountdown--;

      if (this.resendCountdown <= 0) {
        clearInterval(interval);
        this.resendDisabled = false;
        this.resendCountdown = 60; // reset

      }
      this.cdr.detectChanges()

    }, 1000);

  }

  resendEmail() {
    if (this.resendDisabled) return;


    const resendSub = this.authService
      .resendVerificationEmail(this.f['email'].value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          this.message = "L'e-mail de réinitialisation a été renvoyé.";
          this.startResendCountdown();
        },
        error: (error) => {
          this.message = error.error.message || "Erreur lors du renvoi de l'e-mail.";
        }
      });

    this.unsubscribe.push(resendSub);
  }
}
