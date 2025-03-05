import { Component, OnInit } from '@angular/core';
import { IdeaService, Idea } from '../../services/idea.service';
import { CommonModule } from '@angular/common';
import { IdeaComponent } from '../idea/idea.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IdeaComponent] // ✅ Importiamo IdeaComponent per utilizzarlo
})
export class IdeaListComponent implements OnInit {
  ideas$: Observable<Idea[]> = of(); // 🔹 Memorizziamo la lista di idee come Observable

  constructor(private ideaService: IdeaService) {}

  ngOnInit() {
    this.ideas$ = this.ideaService.getIdeas(); // ✅ Recuperiamo le idee dal servizio
  }
}
