import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

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
  errorMessage: string = '';
  passwordVisible: boolean = false;

  constructor(
     private fb: FormBuilder,
     private authService: AuthService, 
     private router: Router,

    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
    
    console.log('LoginComponent constructor()');

    
  }

  ngOnInit() {
    console.log('LoginComponent ngOnInit() - Il componente è stato caricato!');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      //this.toastr.error( 'Compila correttamente tutti i campi.', 'Errore di validazione');;
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // Resetta errori precedenti
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login Success:', response);
        console.log('Response' + response.token)

        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token salvato:', localStorage.getItem('token'));
          this.router.navigate(['/home']).then(() => {
            console.log('Navigazione completata a /home'); // ✅ Debug
          });        }
        else {
          this.errorMessage = 'Errore nel login. Verifica le credenziali.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login Error:', error);
        this.errorMessage = 'Errore nel login. Verifica le credenziali.';
        this.isLoading = false;
      }
    });
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
