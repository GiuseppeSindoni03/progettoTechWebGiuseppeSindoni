import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userProfileImage: string = "";
  selectedFilter: string = 'hot';

  @Output() filterChanged = new EventEmitter<string>();

  constructor(
    private router: Router, 
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserImage().subscribe(
      (imageUrl) => {
        this.userProfileImage = imageUrl; // ✅ Assegna direttamente la stringa
      },
      (error) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    );
  }
  

  goToHome() {
    this.router.navigate(['/home']);
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;
    this.filterChanged.emit(this.selectedFilter);
  }

  onCreateIdea() {
    //this.router.navigate(['/create']);
  }

  goToProfile() {
    //this.router.navigate(['/profile']);
  }
}


