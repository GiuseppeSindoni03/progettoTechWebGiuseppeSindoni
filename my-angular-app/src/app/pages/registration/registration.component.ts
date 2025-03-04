import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  passwordVisible: boolean = false;
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(12)]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    }, 
    { validator: this.passwordMatchValidator });
  }

  /** ✅ Controlla che password e conferma password coincidano */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /** ✅ Toggle per mostrare/nascondere la password */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /** ✅ Gestione della registrazione */
  onSubmit() {
    if (this.registrationForm.invalid) {
      this.showValidationErrors();
      return;
    }

    this.isLoading = true;
    const {
      name, 
      surname,
      username, 
      email, 
      password,
      birthdate,
      gender
    } = this.registrationForm.value;

    console.log('Dati inviati:', this.registrationForm.value);

    this.authService.register({
      name,
      surname,
      username,
      email,
      password,
      birthdate,
      gender
    }).subscribe({
      next: (response) => {
        console.log('Registrazione completata:', response);
        
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



    console.log("Dati inviati:", this.registrationForm.value);

  }


  private showValidationErrors(): void {
    if (this.firstName?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
    if (this.password?.invalid) {
      this.toastr.error('La password deve avere almeno 12 caratteri.', 'Errore di validazione');
    }
    if (this.lastName?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
    if (this.username?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
    if (this.email?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
    if (this.confirmPassword?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
    if (this.birthdate?.invalid) {
      this.toastr.error('Inserisci un\'email valida.', 'Errore di validazione');
    }
  }

  /** ✅ Gestisce gli errori di login */
  private handleLoginError(error: any): void {
    console.error('Errore durante la registrazione:', error);

    let errorMessage = 'Errore imprevisto. Riprova più tardi.';
    if (error.status === 400) {
      errorMessage = 'Email o Username già in uso. Riprova.';
    } else if (error.status === 500) {
      errorMessage = 'Errore del server. Contatta il supporto.';
    }

    this.toastr.error(errorMessage, 'Errore di registrazione');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }
  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get username() {
    return this.registrationForm.get('username');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
  get birthdate() {
    return this.registrationForm.get('birthdate');
  }

}
