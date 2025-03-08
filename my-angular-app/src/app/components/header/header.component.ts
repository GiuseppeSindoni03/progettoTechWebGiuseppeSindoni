import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userProfileImage: string = "";
  selectedFilter: string = 'controverse';
  dropdownOpen: boolean = false;

  @Input() showDropdown: boolean = true; // Mostra/nasconde il menu a tendina
  @Input() showCreateButton: boolean = true; // Mostra/nasconde il bottone "Crea"
  @Output() createIdea = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<string>();
  
  constructor(
    private router: Router, 
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserImage().subscribe({
      next: (imageUrl) => {
        this.userProfileImage = imageUrl; // ✅ Assegna direttamente la stringa
      },
      error: (error) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    });
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
    this.createIdea.emit(); // ✅ Invio l'evento alla Home Page
  }

  goToProfile() {
    console.log("👤 Naviga al profilo utente");
    this.router.navigate(['/me']);
  }
}


