import { Component, OnInit, Input } from '@angular/core';
import { IdeaService } from '../../services/idea.service';
import { IdeaDTO } from '../../models/dto/idea.dto';
import { CommonModule } from '@angular/common';
import { IdeaComponent } from '../idea/idea.component';
import { Observable, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IdeaComponent] 
})
export class IdeaListComponent  {
  ideas$: Observable<IdeaDTO[]> = of(); 
  currentPage: number = 1; 
  pageSize: number = 10;
  hasMoreIdeas: boolean = true;


  @Input() filter: string = ''; 
  @Input() authorId: string | null = null;
  @Input() isExpanded: boolean = false;
  @Input() showDeleteButton: boolean = false;

  constructor(
    private ideaService: IdeaService,
    private toastr: ToastrService
  ) {}


  ngOnChanges() {
    this.currentPage = 1;
    this.hasMoreIdeas = true;
    this.loadIdeas();
    
  }

  loadIdeas() {

    if (this.authorId) {
      this.ideas$ = this.ideaService.getUserIdeas(this.currentPage, this.pageSize).pipe(
        tap(ideas => {
          this.hasMoreIdeas = ideas.length === this.pageSize;
          if (ideas.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        })
      );
    } else {
      this.ideas$ = this.ideaService.getIdeasHome(this.filter, this.currentPage, this.pageSize).pipe(
        tap(ideas => {
          this.hasMoreIdeas = ideas.length === this.pageSize;
          if (ideas.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        })
      );
    }
  }


  nextPage() {
    this.currentPage++;
    this.loadIdeas();
    this.scrollToTop();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.hasMoreIdeas = true;
      this.loadIdeas();
      this.scrollToTop();
    }
  }

  resetPage() {
    this.currentPage = 1;
    this.hasMoreIdeas = true;
    this.loadIdeas();
    this.scrollToTop();
  }
  
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  }

  deleteIdea(ideaId: string) {

    if(confirm("Sei sicuro di voler cancellare questa idea?")) {

      this.ideaService.deleteIdea(ideaId).subscribe({
        next:() => {
          this.loadIdeas();
          this.toastr.success("Idea cancellata con successo", "Successo");
        },
        error: (error) => {
          console.error("Errore nella cancellazione dell'idea:", error);
          this.toastr.error("Errore nella cancellazione dell'idea", "Errore");
        }
      });
    }

  }

}