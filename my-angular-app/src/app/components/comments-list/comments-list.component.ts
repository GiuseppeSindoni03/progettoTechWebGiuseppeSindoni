import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { IdeaService} from '../../services/idea.service';
import { Comment } from '../../services/idea.service';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-comments-list',
  imports: [CommonModule, CommentComponent, ReactiveFormsModule],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss'
})
export class CommentsListComponent {
  comments: Comment[] = [];
  
  @Input() ideaId: string = '';
  
  commentForm = new FormGroup({
    commentContent: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(300)
    ])
  });
  
  constructor(
    private ideaService: IdeaService
  ) {}

  ngOnInit() {
    this.loadComments();
  }

  addComment() {
    if (this.commentForm.invalid) {
      console.warn("Il commento non è valido:", this.commentForm.errors);
      return;
    }

    const newComment = this.commentForm.value.commentContent?.trim() || ''; 

    this.ideaService.postComment(this.ideaId, newComment).subscribe({
      next: (response) => {
        console.log("Commento aggiunto:", response);
        
        
        this.loadComments();
        this.commentForm.reset();
      },
      error: (error) => {
        console.error("Errore nell'aggiunta del commento:", error);
      }
    });
  }

  loadComments() {
    this.ideaService.getComments(this.ideaId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error("Errore nel recupero dei commenti:", error);
      }
    });
  }

  onCommentDeleted(commentId: string) {
    console.log(`Commento eliminato: ${commentId}`);
    this.loadComments(); 
  }
}
