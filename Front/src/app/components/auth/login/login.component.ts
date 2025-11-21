import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { tap, switchMap, of, catchError } from 'rxjs';
import { passwordValidator } from '../../validators/password.validator';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy , AfterViewInit {
  loginForm!: FormGroup;
  hasError = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initializeGoogleSignIn(); //initialise le SDK Google pour afficher le popup One Tap
  }

  ngOnDestroy(): void {
    // Nettoyage pour éviter les memory leaks
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.cancel();
    }
  }
  ngAfterViewInit() {
  this.initializeGoogleSignIn();
}


  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      role: ['etudiant', Validators.required], // par défaut Étudiant

      keepMeLoggedIn: [false],
    });
  }

<<<<<<< HEAD
  onLogin() {
    if (this.loginForm.invalid) return;

    const { email, password, keepMeLoggedIn } = this.loginForm.value;

this.authService.login(email, password, keepMeLoggedIn).subscribe({
  next: (res: any) => {
    console.log("res login ",res)
    if (res.success) {
      localStorage.setItem('token', res.token);

      // Redirection selon rôle
      if (res.user?.role === 'clubManager') {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/sideBar/clubs');
      }
    } else {
      console.log("zzz ",res)
      this.hasError = true;
      this.message = res.error.message || 'Erreur lors de la connexion';
    }
  },
  error: (err: any) => {
    console.error('Erreur serveur :', err);
    this.hasError = true;
    this.message = err.error?.message || 'Erreur lors de la connexion';
=======
  get selectedRole(): string {
    return this.loginForm.get('role')?.value;
>>>>>>> eef56975829c4f039c9e1b0ccd3b384c2d12e2ef
  }

  selectRole(role: string) {
    this.loginForm.get('role')?.setValue(role);
  }

  onLogin() {
     this.hasError = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.hasError = true;
      this.message = 'Veuillez vérifier les informations saisies';
      return;
    }

    const { email, password, role, keepMeLoggedIn } = this.loginForm.value;

    this.authService.login(email, password,role, keepMeLoggedIn).subscribe({
      next: (res: any) => {
        console.log('res login ', res);
        if (res.success) {
          if(this.selectedRole === 'clubManager' && res.user.role.includes('clubManager')){
            this.router.navigateByUrl('/dashboard');
          }
          else if(this.selectedRole === 'etudiant' && res.user.role.includes('etudiant')){
            this.router.navigateByUrl('/clubs');
          }
          else if(this.selectedRole === 'admin' && res.user.role.includes('admin')){
            this.router.navigateByUrl('/admindashboard');
          }

        } else {
          this.hasError = true;
          this.message = res.error.message || 'Erreur lors de la connexion';
        }
      },
      error: (err: any) => {
        console.error('Erreur serveur :', err);
        this.hasError = true;
        this.message = err.error?.message || 'Erreur lors de la connexion';
      },
    });
  }

  getControlClass(controlName: string): any {
    const control = this.loginForm.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid && (control?.dirty || control?.touched),
    };
  }



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


  handleCredentialResponse(response: any) {
      this.hasError = false;

    this.authService
      .googleLogin(
        response.credential,
        this.loginForm.controls['keepMeLoggedIn'].value
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
}
