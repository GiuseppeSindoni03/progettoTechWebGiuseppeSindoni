import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { IdeaListComponent } from '../../components/idea-list/idea-list.component';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent, FooterComponent, IdeaListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
