import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IdeaDTO } from '../../models/dto/idea.dto';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 
import { UserService } from '../../services/user.service';
import { IdeaService } from '../../services/idea.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-idea',
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.scss'],
  standalone: true,
  imports: [CommonModule] 
})
export class IdeaComponent {
  maxContentLength: number = 200;
  sanitizedContentHtml: SafeHtml = ''; 
  authorProfileImage: string = '';
  userVote: number = 0;

  @Input() idea!: IdeaDTO;
  @Input() showComments: boolean = true;
  @Input() isExpanded: boolean = false;
  @Input() showDeleteButton: boolean = false;

  @Output() ideaDeleted = new EventEmitter<string>();


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
    if (this.idea?.contentHtml) { 
      this.sanitizedContentHtml = this.sanitizer.bypassSecurityTrustHtml(this.idea.contentHtml);
    } else {
      console.warn(" Warning: contentHtml non è definito per l'idea", this.idea);
      this.sanitizedContentHtml = ''; 
    }
  }

  

  goToIdeaDetails() {
    this.router.navigate(['/idea', this.idea._id]); 
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
      this.userVote = vote; 
    });
  }

  deleteIdea() {
   this.ideaDeleted.emit(this.idea._id);
  }
  
  
  
  
}