import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userProfileImage: string = 'default-image.png';
  selectedFilter: string = 'hot';

  @Output() filterChanged = new EventEmitter<string>();

  constructor(
    private router: Router, 
    private userService: UserService
  ) {
    const user = this.userService.getUser();
    if( user ) {
      this.userService.getUserImage().subscribe({
        next: (image) => this.userProfileImage = image
      });
    }
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
    this.router.navigate(['/create']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  getS3ProfileImageUrl(userId: string): string {
    if (this.userProfileImage === 'default-image.png') 
      return 'default-image.png';

    return `https://s3.amazonaws.com/hive-mind-bucket-4107/Images/${userId}/${this.userProfileImage}`;
  }
}
