import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  imports: [],
  standalone: true,
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css',
})
export class EmailVerificationComponent {
  email: string = ''; // à récupérer depuis le formulaire ou query params
  statusMessage: string = '';
  sending: boolean = false;
  disabledUntil: number = 0;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Récupérer l'email si l'utilisateur est déjà connecté
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.email = user.email;
      }
    });
  }

  resendEmail() {
    const now = Date.now();
    if (now < this.disabledUntil) {
      this.statusMessage =
        'Veuillez patienter avant de pouvoir renvoyer un nouvel email.';

      return; // bouton bloqué
    }
      console.log("email ",this.email)

    if (!this.email) {
      this.statusMessage = 'Adresse email introuvable.';
      return;
    }

    this.sending = true;
    this.authService.resendVerificationEmail(this.email).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.statusMessage =
            'Un email de vérification a été renvoyé. Vous ne pourrez pas en renvoyer un autre avant 1 minute.';
          this.disabledUntil = Date.now() + 1 * 60 * 1000; // 1 min
          timer(1 * 60 * 1000).subscribe(() => (this.sending = false));
        }
      },
      error: (err) => {
        console.error(err);
        // if (err.error?.message === 'Email déjà vérifié') {
        //   this.statusMessage =
        //     'Votre email est déjà vérifié. Redirection en cours...';
        //   setTimeout(() => this.router.navigate(['/dashboard']), 3000);
        // } else{
          this.statusMessage = err.error?.message || 'Erreur serveur, veuillez réessayer plus tard.';
      
        this.sending = false;
      },
      complete: () => {
        this.sending = false;
      },
    });
  }

  isDisabled(): boolean {
    return Date.now() < this.disabledUntil || this.sending;
  }
}
