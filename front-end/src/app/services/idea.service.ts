import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { IdeaDTO } from '../models/dto/idea.dto';
import { APIResponse } from '../interceptors/api-response.dto';
import { VoteDTO } from '../models/dto/vote.dto';
import { CommentDTO } from '../models/dto/comment.dto';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = `${environment.serverUrl}/ideas`;

  constructor(private http: HttpClient) {}

  getIdeas(): Observable<IdeaDTO[]> {
    return this.http.get<APIResponse<IdeaDTO[]>>(`${this.apiUrl}`).pipe(
      map(response => response.data)
    );
  }

  getIdeaById(id: string): Observable<IdeaDTO> {
    return this.http.get<APIResponse<IdeaDTO>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getUserIdeas(page: number = 1, limit: number = 10): Observable<IdeaDTO[]> {
    return this.http.get<APIResponse<IdeaDTO[]>>(
      `${this.apiUrl}/my-ideas?page=${page}&limit=${limit}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error("Errore nel recupero delle idee dell'utente:", error);
        return of([]);
      })
    );
  }

  postIdea(title: string, content: string): Observable<IdeaDTO> {
    return this.http.post<APIResponse<IdeaDTO>>(this.apiUrl, { title, content }).pipe(
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


 
  
  getIdeasHome(type: string, page: number = 1, limit: number = 10): Observable<IdeaDTO[]> {
    console.log(`📡 Recupero idee per tipo: ${type}, pagina: ${page}`);

    return this.http.get<APIResponse<IdeaDTO[]>>(
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
    return this.http.get<APIResponse<VoteDTO>>(`${this.apiUrl}/${ideaId}/vote`).pipe(
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
  
  getComments(ideaId: string): Observable<CommentDTO[]> {
    return this.http.get<APIResponse<CommentDTO[]>>(
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