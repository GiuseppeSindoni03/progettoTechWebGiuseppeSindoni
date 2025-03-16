import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  passwordVisible: boolean = false;

  constructor(
     private fb: FormBuilder,
     private authService: AuthService, 
     private router: Router,
     private toastr: ToastrService

    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
    
    
  }



  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

   

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login Success:', response);
        console.log('Response' + response.token)

        if (response.token) {
          this.authService.updateToken(response.token);
          this.toastr.success(`Puoi ora condividere le tue idee`, `Benvenuto ${this.authService.getUser()?.username}!`);

          console.log('Token salvato:', localStorage.getItem('token'));
          
          this.router.navigate(['/home']).then(() => {
            console.log('Navigazione completata a /home'); 
          });       
        }
      
      },
      error: (error) => {
        this.handleLoginError(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        console.log("Richiesta di Login completata.")
       
      }
    });
  }

 
  private handleLoginError(error: any): void {
    console.error('Errore durante il login:', error);

    let errorMessage = error.error?.message || 'Errore durante il login. Riprova più tardi.';
    
  

    this.toastr.error(errorMessage, 'Errore di login');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
