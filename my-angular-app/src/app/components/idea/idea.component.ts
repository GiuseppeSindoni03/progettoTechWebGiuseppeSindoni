import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Idea } from '../../services/idea.service';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser'; // ✅ Importa SafeHtml
import { MarkdownService } from '../../services/markdown.service'; // ✅ Importa il servizio
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-idea',
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.scss'],
  standalone: true,
  imports: [CommonModule] // ✅ Importiamo CommonModule per abilitare i pipe
})
export class IdeaComponent {
  @Input() idea!: Idea;  // 🔹 Riceve un oggetto `Idea` come input
  maxContentLength: number = 200; // 🔹 Limite di caratteri per il testo dell'idea
  convertedContent: SafeHtml = ''; // ✅ Dichiara la variabile
  authorProfileImage: string = '';


  constructor(
    private router: Router, 
    private markdownService :MarkdownService,
    private user: UserService

  ) {}

  ngOnInit() {
    this.convertContent(); // ✅ Converte il contenuto appena viene inizializzato
    this.loadAuthorImage();
  }

  loadAuthorImage() {
    this.user.getUserImageWithId(this.idea.author._id).subscribe(
      (imageUrl: string) => {
        this.authorProfileImage = imageUrl;
      },
      (error: string) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    );
  }

  convertContent() {
    this.convertedContent = this.markdownService.convertToHtml(this.idea.content);
  }

  goToIdeaDetails() {
    this.router.navigate(['/idea', this.idea._id]); // 🔹 Naviga alla pagina dei dettagli
  }

  upvote() {
    console.log(`Upvote per idea: ${this.idea._id}`);
  }

  downvote() {
    console.log(`Downvote per idea: ${this.idea._id}`);
  }

  
}
