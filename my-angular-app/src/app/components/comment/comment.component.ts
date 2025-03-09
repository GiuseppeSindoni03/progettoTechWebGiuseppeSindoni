import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe} from '@angular/common';
import { UserService } from '../../services/user.service';
import { IdeaService } from '../../services/idea.service';
import { Comment } from '../../services/idea.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-comment',
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {

  authorProfileImage: string = '';
  canDelete: boolean = false;
  

  @Input() comment!: Comment ;
  @Input() ideaId!: string;
  @Output() commentDeleted = new EventEmitter<string>();




  constructor(
    private userService: UserService,
    private ideaService: IdeaService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadAuthorImage();
  }

  loadAuthorImage() {
    this.userService.getUserImageWithId(this.comment.author._id).subscribe({
      next: (imageUrl: string) => {
        this.authorProfileImage = imageUrl;
      },
      error: (error: string) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    });
  }

  deleteComment() {
    this.ideaService.deleteComment(this.ideaId, this.comment._id).subscribe({
      next: () => {
        console.log("✅ Commento eliminato con successo");
        this.commentDeleted.emit(this.comment._id);
      },
      error: (error) => {
        console.error("❌ Errore nell'eliminazione del commento:", error);
        this.toastr.warning( error.error.message, "Errore");
      }
    });
  }

}
