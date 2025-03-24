import { Component, Input } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { IdeaListComponent } from '../../components/idea-list/idea-list.component';
import { CreatePostModalComponent } from '../../components/create-post-modal/create-post-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, IdeaListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  selectedFilter: string = 'controverse';
  isCreatePostModalOpen: boolean = false;
  

  @Input() filterChanged: string = '';

  constructor(private dialog: MatDialog) {}

  openCreatePostModal() {
    const dialogRef = this.dialog.open(CreatePostModalComponent, {
 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Post creato:', result);
      }
    });
  }

  onFilterChange(newFilter: string) {
    console.log("Filtro cambiato:", newFilter);
    this.selectedFilter = newFilter;
  }
}
