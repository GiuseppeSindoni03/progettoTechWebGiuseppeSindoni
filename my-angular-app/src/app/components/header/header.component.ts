import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
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
  dropdownOpen: boolean = false;

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

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterChanged.emit(this.selectedFilter);
    this.dropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onCreateIdea() {
    //this.router.navigate(['/create']);
  }

  goToProfile() {
    //this.router.navigate(['/profile']);
  }
}


