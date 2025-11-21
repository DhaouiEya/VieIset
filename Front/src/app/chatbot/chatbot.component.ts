import { Component, signal, inject, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private http = inject(HttpClient);

  open = signal(false);
  message = signal('');
  messages = signal<{ sender: 'user' | 'bot', text: string }[]>([]);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggle() {
    this.open.set(!this.open());

    // Ajouter un message de bienvenue si c'est la première ouverture
    if (this.open() && this.messages().length === 0) {
      setTimeout(() => {
        this.messages.set([{ sender: 'bot', text: "Bonjour 👋 "
 }]);
      }, 300);
    }
  }
/*! Je suis votre assistant virtuel de l'ISET Charguia. Posez-moi vos questions sur les clubs, la vie étudiante, les services et tout ce qui concerne l'ISET.*/
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  send() {
    const text = this.message().trim();
    if (!text) return;

    // Ajouter le message de l'utilisateur
    this.messages.update(m => [...m, { sender: 'user', text }]);
    this.message.set('');

    // Simuler une réponse en attendant la vraie réponse de l'API
    this.messages.update(m => [...m, { sender: 'bot', text: '...' }]);

    // Appel à l'API
    this.http.post<{ reply: string }>('http://localhost:5000/api/chat', { message: text })
      .subscribe({
        next: (res) => {
          this.messages.update(m => {
            const arr = [...m];
            if (arr[arr.length - 1].text === '...') arr.pop();
            return [...arr, { sender: 'bot', text: res.reply }];
          });
        },
        error: () => {
          this.messages.update(m => {
            const arr = [...m];
            if (arr[arr.length - 1].text === '...') arr.pop();
            return [...arr, { sender: 'bot', text: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.' }];
          });
        }
      });
  }
}
