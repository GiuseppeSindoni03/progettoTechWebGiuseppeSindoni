import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../src/environments/environment';

interface LoginResponse {
  status: string;
  data: {
    token: string;
    userResponse: {
      id: string;
      email: string;
    };
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth/login'; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string; user: { id: string; email: string } }> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
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
}
