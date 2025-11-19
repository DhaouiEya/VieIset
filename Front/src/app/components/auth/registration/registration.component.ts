import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  catchError,
  first,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { passwordValidator } from '../../validators/password.validator';

declare const google: any;

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
   PasswordStrengthMeterComponent,RouterLink
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  hasError = false;
  message = '';

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
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
            Validators.required, passwordValidator
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
              this.cdr.detectChanges();

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
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    google.accounts.id.initialize({
      client_id: '83197880105-fhf7bp7mugj0js4ecjp15c9tcojh45nv.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      cancel_on_tap_outside: false,
    });

    // Affiche le bouton Google
    google.accounts.id.renderButton(
      document.getElementById('googleLoginButton'),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
            logo_alignment: 'center' // centre l'icône

      }
    );

    // Prompt automatique (optionnel)
    google.accounts.id.prompt();
  }
}

  triggerGoogleSignIn() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          google.accounts.id.renderButton(
            document.getElementById('googleLoginButton'),
            {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
            }
          );
        }
      });
    }
  }




  handleCredentialResponse(response: any) {
          this.hasError = false;

    const idToken = response.credential;
    const keepMeLoggedIn = false;
 this.authService
      .googleLogin(
        idToken,
        keepMeLoggedIn
      )
      .pipe(
        switchMap(() => this.authService.getUserByToken()),

           tap((user: any) => {
        if (user) {
       console.log("ressss",user)
          const roles: string[] = user.role;

          // Si l'utilisateur n'a pas le rôle autorisé pour Google login
          if (!roles.includes('etudiant')) {
            this.message = 'Google login interdit pour ce rôle.';
            return;
          }
          console.log('Google authentication successful, navigating to clubs');
            this.router.navigateByUrl('/clubs');
        }
      }),

        catchError((error) => {
             this.hasError = true;
          this.message =  error.error?.message || 'Google authentication failed. Please try again.';
      this.cdr.detectChanges();
          console.error('Google authentication failed', error);
          return of(null);
        })
      )
      .subscribe();
  }



}
