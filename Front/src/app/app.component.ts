import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarreComponent } from './barre/barre.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
 
  standalone: true,                    // ✅ obligatoire pour un composant standalone
  imports: [RouterOutlet, BarreComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']    // ✅ pluriel, pas styleUrl
})
export class AppComponent {
  title = 'front';
}
