import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    surname: string;
    birthdate: Date | string;
    gender: string;
    profileImage: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl: string= 'http://localhost:4000/user';

    private constructor(
        private http: HttpClient
    ) {}

    getUser(): Observable<User> {
        return this.http.get<User>(this.apiUrl);
    }

   
    getUserImage(): Observable<string> {
        return this.http.get<{ status: string, data: { profileImage: string }, message: string }>(`${this.apiUrl}/profile-image`).pipe(
          map(response => {
            return response.data.profileImage; 
          })
        );
      }

      getUserImageWithId(userId: string): Observable<string> {
        return this.http.get<{ status: string, data: { profileImage: string }, message: string }>(`${this.apiUrl}/${userId}/profile-image`).pipe(
          map(response => {
            return response.data.profileImage; 
          })
        );
      }
      

    postUserImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/profile-image`, formData).pipe(
            map(response => response.imageUrl)
        );
    }
}