import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Idea } from '../../services/idea.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // ✅ Importa SafeHtml
import { UserService } from '../../services/user.service';
import { IdeaService } from '../../services/idea.service';
import { ToastrService } from 'ngx-toastr';


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
  sanitizedContentHtml: SafeHtml = ''; // ✅ Dichiara la variabile
  authorProfileImage: string = '';
  userVote: number = 0;

  constructor(
    private router: Router, 
    private user: UserService,
    private sanitizer: DomSanitizer ,
    private ideaService: IdeaService,
    private toastr: ToastrService

  ) {}

  ngOnInit() {
    this.loadAuthorImage();
    this.sanitizeContent();
    this.getVote();
  }

  loadAuthorImage() {
    this.user.getUserImageWithId(this.idea.author._id).subscribe({
      next: (imageUrl: string) => {
        this.authorProfileImage = imageUrl;
      },
      error: (error: string) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    });
  }

  sanitizeContent() {
    if (this.idea?.contentHtml) { // ✅ Verifica se `contentHtml` è definito prima di usarlo
      this.sanitizedContentHtml = this.sanitizer.bypassSecurityTrustHtml(this.idea.contentHtml);
    } else {
      console.warn("⚠️ Warning: contentHtml non è definito per l'idea", this.idea);
      this.sanitizedContentHtml = ''; // ✅ Evita errori impostando una stringa vuota
    }
  }

  

  goToIdeaDetails() {
    this.router.navigate(['/idea', this.idea._id]); // 🔹 Naviga alla pagina dei dettagli
  }

  upvote() {
    const newVote = 1

    this.ideaService.voteIdea(this.idea._id, newVote).subscribe({
      next: () => {

        if ( this.userVote === 0) {
          this.idea.upvotes++;
          this.userVote = 1;
        }
        else if (this.userVote === 1) {
          
          this.idea.upvotes > 0 ?  this.idea.upvotes-- : this.idea.upvotes = 0;
          this.userVote = 0;
        }
        else {
          this.idea.upvotes++;
          this.idea.downvotes--;
          this.userVote = 1;
        }
        this.idea = { ...this.idea }; 

      },
      error: (error) => this.handleVoteError(error)
    });
  }
  
  downvote() {
    const newVote = -1


    this.ideaService.voteIdea(this.idea._id, newVote).subscribe({
      next: () => {

        if (this.userVote === 0) {
          this.idea.downvotes++;
          this.userVote = -1;
        }
        else if (this.userVote === -1) {
          this.idea.downvotes > 0 ?  this.idea.downvotes-- : this.idea.downvotes = 0;
          this.userVote = 0;
        }
        else {
          this.idea.upvotes--;
          this.idea.downvotes++;
          this.userVote = -1;
        }
        this.idea = { ...this.idea }; 
      
      },
      error: (error) => this.handleVoteError(error)
    });
  }


  handleVoteError(error: any) {
    console.error("Errore nel voto:", error);
    if (error.status === 400) {
      this.toastr.warning(error.error.message, "Errore");
    } else {
      this.toastr.error("Errore nel voto, riprova più tardi", "Errore");
    }
  }

  getVote() {
    this.ideaService.getUserVote(this.idea._id).subscribe(vote => {
      this.userVote = vote; // Aggiorniamo lo stato con il valore dal backend
    });
  }
  
  
  
}
