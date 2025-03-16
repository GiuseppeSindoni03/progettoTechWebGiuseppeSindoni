import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { IdeaListComponent } from '../../components/idea-list/idea-list.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [HeaderComponent, IdeaListComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  
  userId: string = ''; 
  userUsername: string = '';
  userProfileImage: string = '';

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent; 
  @ViewChild(IdeaListComponent) ideaListComponent!: IdeaListComponent; 
  
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { 
    console.log("DIO CANE")
  }


  ngOnInit() {
    this.userService.getUser().subscribe({
      next: (response) => {
        const user = response.data;

        this.userUsername = user.username;
        this.userId = user._id;

        console.log("Utente: ", this.userUsername + " " + this.userId);
        this.loadUserImage();
      },
      error: (error) => {
        console.error("Errore nel recupero dell'utente:", error);
      }
    });
  }
  
  loadUserImage() {
    this.userService.getUserImage().subscribe({
      next: (imageUrl) => {
        this.userProfileImage = imageUrl;
      },
      error: (error) => {
        console.error("Errore nel recupero dell'immagine profilo:", error);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      this.userService.uploadUserImage(formData).subscribe({
        next: (response) => {
          this.loadUserImage(); 
          this.headerComponent.loadUserImage(); 
          this.ideaListComponent.loadIdeas(); 
        },
        error: (error) => {
          console.error("Errore nel caricamento dell'immagine:", error);
        }
      });
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.toastr.success("Logout effettuato con successo", "Arrivederci!");
    this.router.navigate(['/login']);
  }
}
