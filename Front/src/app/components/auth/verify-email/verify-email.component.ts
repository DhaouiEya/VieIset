import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent  implements OnInit {
statusMessage = '';
  verificationSuccess = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


   ngOnInit(): void {
     // Récupérer le token depuis l'URL
     const token = this.route.snapshot.queryParamMap.get('token');
     if (token) {
       this.verifyEmail(token);
     }
   }



  verifyEmail(token: string) {
    this.authService.verifyEmail(token).subscribe({
      next: (res: any) => {
        this.statusMessage = res.message;
        this.verificationSuccess = true;
      },
      error: (err) => {
        console.error("Erreur vérification email :", err.error?.message);
        this.statusMessage = err.error?.message || 'Erreur serveur, réessayez plus tard.';
        this.verificationSuccess = false;
        // Redirection automatique après quelques secondes si voulu
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    });
  }
}
