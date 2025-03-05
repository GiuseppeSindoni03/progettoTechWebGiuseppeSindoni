import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isUserAuthenticated()) {
      return true; // ✅ Utente autenticato → Permetti l’accesso alla rotta
    } else {
      console.warn("🔴 Accesso negato! Reindirizzamento al login.");
      this.router.navigate(['/']); // 🔹 Reindirizza alla pagina di login
      return false;
    }
  }
}
