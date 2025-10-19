import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  imports: [],
    standalone: true,
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
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
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.email = user.email;
      }
    });
  }

  



  resendEmail() {
    const now = Date.now();
    if (now < this.disabledUntil) {
      return; // bouton bloqué
    }

    if (!this.email) {
      this.statusMessage = 'Email manquant.';
      return;
    }

    this.sending = true;
    this.authService.resendVerificationEmail(this.email).subscribe({
      next: (res) => {
        this.statusMessage = res.success
          ? 'Email renvoyé avec succès !'
          : 'Erreur lors de l’envoi.';
        // désactiver bouton 5 min
        this.disabledUntil = Date.now() + 5 * 60 * 1000;
        timer(5 * 60 * 1000).subscribe(() => (this.sending = false));
      },
      error: (err) => {
        console.error(err);
        this.statusMessage = 'Erreur serveur, réessayez plus tard.';
        this.sending = false;
      },
      complete: () => {
        this.sending = false;
      }
    });
  }

  isDisabled(): boolean {
    return Date.now() < this.disabledUntil || this.sending;
  }




}
