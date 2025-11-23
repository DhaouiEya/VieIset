import { Component, inject } from '@angular/core';
import { FooterHomeComponent } from "../footer-home/footer-home.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-app-bar-home',
  imports: [FooterHomeComponent,RouterOutlet,RouterLink],
  templateUrl: './app-bar-home.component.html',
  styleUrl: './app-bar-home.component.css'
})
export class AppBarHomeComponent {
  viewportScroller=inject(ViewportScroller)
  router=inject(Router)
 scrollToFooter() {
    // Navigue vers la route actuelle puis scroll vers le footer
    this.router.navigate([], { fragment: 'footer' }).then(() => {
      this.viewportScroller.scrollToAnchor('footer');
    });
  }
 scrollToServices() {
  // Navigue vers la route home si nécessaire, puis scroll vers le bloc services
  this.router.navigate(['/home']).then(() => {
    setTimeout(() => {
      this.viewportScroller.scrollToAnchor('bloc');
    }, 100); // délai pour s'assurer que le DOM est chargé
  });
}

}
