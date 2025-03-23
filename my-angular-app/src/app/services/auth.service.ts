import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environments';
import { UserDTO } from '../models/dto/user.dto';
import { APIResponse } from '../interceptors/api-response.dto';
import { AuthResponse } from '../models/dto/auth.dto';
import { RegisterDTO } from '../models/dto/register.dto';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.serverUrl}/auth`;

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), 
    isAuthenticated: this.verifyToken(this.getToken())
  });

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);


  constructor(private http: HttpClient) {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (typeof localStorage !== 'undefined') {
        if (token !== null) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        if (user !== null) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<APIResponse<AuthResponse>>(this.apiUrl + '/login', { email, password }).pipe(
      map(response => {
        if (response.status === 'success' && response.data?.token) {
          return response.data;
        } else {
          throw new Error('Errore nella risposta del server');
        }
      })
    );
  }

  register (regRequest : RegisterDTO ): Observable<AuthResponse> {
    return this.http.post<APIResponse<AuthResponse>>(this.apiUrl + '/register', regRequest).pipe(
      map(response => {
        if (response.status === 'success' && response.data?.token) {
          return response.data;

        } else {
          throw new Error('Errore nella risposta del server');
        }
      }
      )
    );
  }

  
  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = {
      id: decodedToken.id,
      email: decodedToken.email,
      username: decodedToken.username 
    };
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Utente aggiornato in authState:", this.authState());
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
  }

  getUser(): any {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  

  verifyToken(token: string | null): boolean {
    if (!token) return false;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp ? Date.now() < exp * 1000 : false;

    } catch {
      return false;
    }
  }
  

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
  
      this.authState.set({
        user: null,
        token: null,
        isAuthenticated: false
      });
  
      console.log("Logout effettuato con successo!");

  
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  }


  
}
