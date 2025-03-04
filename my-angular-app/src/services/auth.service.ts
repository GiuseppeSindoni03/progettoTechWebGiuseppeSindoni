import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  status: string;
  data: {
    token: string;
    userResponse: {
      id: string;
      email: string;
      username:string;
    };
  };
  message: string;
}

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  email: string;
  username: string;
}

interface RegisterRequest  {
  name: string, 
  surname: string, 
  username: string, 
  email: string, 
  password: string, 
  birthdate: string, 
  gender: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/auth'; 

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), // get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getToken()) // verify it's not expired
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

  login(email: string, password: string): Observable<{ token: string; user: { id: string; email: string } }> {
    return this.http.post<LoginResponse>(this.apiUrl + '/login', { email, password }).pipe(
      map(response => {
        if (response.status === 'success' && response.data?.token) {
          return {
            token: response.data.token,
            user: response.data.userResponse
          };
        } else {
          throw new Error('Errore nella risposta del server');
        }
      })
    );
  }

  register (regRequest : RegisterRequest ): Observable<{ token: string; user: { id: string; email: string, username: string} }> {
    return this.http.post<LoginResponse>(this.apiUrl + '/register', regRequest).pipe(
      map(response => {
        if (response.status === 'success' && response.data?.token) {
          return {
            token: response.data.token,
            user: response.data.userResponse
          };
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
      username: decodedToken.username // ✅ Aggiunto username
    };
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });
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
      // ✅ Rimuoviamo i dati da localStorage (solo se disponibile)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
  
      // ✅ Aggiorniamo lo stato dell'autenticazione
      this.authState.set({
        user: null,
        token: null,
        isAuthenticated: false
      });
  
      console.log("✅ Logout effettuato con successo!");

  
    } catch (error) {
      console.error("❌ Errore durante il logout:", error);
    }
  }


  
}
