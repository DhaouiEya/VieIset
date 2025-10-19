import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  first,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

declare const google: any;

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordStrengthMeterComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  hasError!: boolean;
  message: string = 'The registration details are incorrect';

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initializeGoogleSignIn();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ],
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

  submit() {
    this.hasError = false;

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.hasError = true;
      this.message = 'Veuillez vérifier les informations saisies';
      return;
    }

    const registerData = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
    };

    const registerSubscr = this.authService.register(registerData).subscribe({
      next: (res) => {
        console.log('Inscription réussie:', res.success);
        if (res.success) {
          this.router.navigate(['/send-verification-email']);
        }
      },
      error: (err) => {
        console.log('erreur ', err);
        console.error('Erreur inscription:', err);
        this.hasError = true;
        this.message = err.error.message;
      },
    });

    this.unsubscribe.push(registerSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getControlClass(controlName: string): any {
    const control = this.registrationForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid && (control?.dirty || control?.touched),
    };
  }

  // signUpWithGoogle() {
  //   this.socialAuthService
  //     .signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then((user) => {
  //       this.user = user;
  //       // Envoie le token Google à ton backend pour création de compte / login
  //       this.authService.googleLogin(user.idToken).subscribe({
  //         next: (res) => {
  //           console.log('Inscription réussie', res);
  //         },
  //         error: (err) => console.error(err),
  //       });
  //     });
  // }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id:
        '83197880105-fhf7bp7mugj0js4ecjp15c9tcojh45nv.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
          cancel_on_tap_outside: false,

    });



  }

  triggerGoogleSignIn() {
  // Affiche le prompt Google One Tap
  google.accounts.id.prompt((notification: any) => {
    // Si le prompt n'a pas été affiché ou a été ignoré
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Rendu manuel du bouton Google sur ton élément existant
      const button = document.getElementById('googleLoginButton');
      if (button) {
        google.accounts.id.renderButton(button, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
        });
      }
    }
  });
}




  handleCredentialResponse(response: any) {
    const idToken = response.credential;
    const keepMeLoggedIn = false;
    this.authService
      .googleLogin(idToken, keepMeLoggedIn)
      .pipe(
        tap((auth) => {
          if (auth) {
            // Redirection après login réussi
            this.router.navigate(['/clubs']);
          }
        }),
        switchMap((auth) => {
          if (auth) {
            // Récupérer les infos utilisateur si nécessaire
            return this.authService.getUserByToken();
          }
          return of(null);
        }),
        catchError((err) => {
          console.error('Google authentication failed', err);

          this.message = err.error?.message || 'Google authentication failed';

          return of(null);
        })
      )
      .subscribe();
  }
}
