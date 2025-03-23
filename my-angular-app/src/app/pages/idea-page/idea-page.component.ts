import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { IdeaComponent } from "../../components/idea/idea.component";
import { IdeaService } from '../../services/idea.service';
import { IdeaDTO } from '../../models/dto/idea.dto';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentsListComponent } from '../../components/comments-list/comments-list.component';

@Component({
  selector: 'app-idea-page',
  imports: [HeaderComponent, IdeaComponent, CommonModule, CommentsListComponent],
  templateUrl: './idea-page.component.html',
  styleUrl: './idea-page.component.scss'
})
export class IdeaPageComponent {

  idea!: IdeaDTO;

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService
  ) {}

  ngOnInit() {
    const ideaId = this.route.snapshot.paramMap.get('id');


    if (ideaId) {
      this.ideaService.getIdeaById(ideaId).subscribe({
        next: (idea) => {
          this.idea = idea;
        },
        error: (error) => {
          console.error("Errore nel recupero dell'idea:", error);
        }
      });
   
  }
 }

}