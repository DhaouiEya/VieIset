import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent  implements OnInit {

    statusMessage = '';

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
        // if (res.success) {
        //   // rediriger vers login après 2s
        //   setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        // }
      },
      error: (err) => {
        console.error(err);
        this.statusMessage = 'Erreur serveur, réessayez plus tard.';
      }
    });
  }
}
