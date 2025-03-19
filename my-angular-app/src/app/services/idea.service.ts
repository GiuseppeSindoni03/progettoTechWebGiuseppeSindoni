import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


export interface Idea {
  _id: string;
  title: string;
  content: string;
  contentHtml: string
  timestamp: string; 
  author: {
    _id: string;
    username: string;
    profileImage: string;
  };
  comments: Comment[];
  upvotes: number;
  downvotes: number;
}

export interface Comment {
  ideaId: string;
  _id: string;
  author: {
    _id: string;
    username: string;
    profileImage: string;
  };
  content: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = 'http://localhost:4000/ideas';

  constructor(private http: HttpClient) {}

  getIdeas(): Observable<Idea[]> {
    return this.http.get<{ status: string; data: Idea[] }>(`${this.apiUrl}`).pipe(
      map(response => response.data)
    );
  }

  getIdeaById(id: string): Observable<Idea> {
    return this.http.get<{ status: string; data: Idea }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getUserIdeas(page: number = 1, limit: number = 10): Observable<Idea[]> {
    return this.http.get<{ status: string; data: Idea[] }>(
      `${this.apiUrl}/my-ideas?page=${page}&limit=${limit}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error("Errore nel recupero delle idee dell'utente:", error);
        return of([]);
      })
    );
  }

  postIdea(title: string, content: string): Observable<Idea> {
    return this.http.post<{ status: string; data: Idea }>(this.apiUrl, { title, content }).pipe(
      map(response => response.data)
    );
  }

  deleteIdea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(
        error => {
          console.error("Errore durante l'eliminazione dell'idea:", error);
          return throwError(error);
      }));
    }


 
  
  getIdeasHome(type: string, page: number = 1, limit: number = 10): Observable<Idea[]> {
    console.log(`📡 Recupero idee per tipo: ${type}, pagina: ${page}`);

    return this.http.get<{ status: string; data: Idea[], message: string }>(
      `${this.apiUrl}/category/${type}?page=${page}&limit=${limit}`
    ).pipe(
      tap(response => console.log("📦 Risposta ricevuta:", response)),
      map(response => response.data || []), 
      catchError(error => {
        console.error(" Errore API:", error);
        return of([]); 
      })
    );
}

  voteIdea (ideaId: string, vote : number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${ideaId}/vote`, { vote }).pipe(
      catchError(error => {
        console.error("Errore durante il voto:", error);
        return throwError(error);
      })
    );
  }

  getUserVote(ideaId: string): Observable<number> {
    return this.http.get<{ status: string; data: { vote: number } }>(`${this.apiUrl}/${ideaId}/vote`).pipe(
      map(response => response.data.vote),
      catchError(error => {
        console.error("Errore nel recupero del voto:", error);
        return of(0); 
      })
    );
  }

  postComment(ideaId: string, content: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${ideaId}/comments`, { content });
  }
  
  getComments(ideaId: string): Observable<Comment[]> {
    return this.http.get<{ status: string; data: Comment[] }>(
      `${this.apiUrl}/${ideaId}/comments`).pipe(
          map(response => response.data),
          catchError(error => {
            console.error("Errore nel recupero dei commenti:", error);
            return of([]);
          })
        );
  }
  
  deleteComment(ideaId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ideaId}/comments/${commentId}`).pipe(
      catchError(error => {
        console.error("Errore durante l'eliminazione del commento:", error);
        return throwError(error);
      })
    );
  }
  

  
}