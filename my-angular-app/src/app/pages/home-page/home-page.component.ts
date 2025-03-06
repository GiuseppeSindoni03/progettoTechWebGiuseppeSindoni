import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { IdeaListComponent } from '../../components/idea-list/idea-list.component';
import { CreatePostModalComponent } from '../../components/create-post-modal/create-post-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, FooterComponent, IdeaListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  isCreatePostModalOpen: boolean = false;

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
}
