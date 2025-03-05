import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 📌 Modello per un'idea
export interface Idea {
  _id: string;
  title: string;
  content: string;
  contentHtml: string
  timestamp: string; // 🔹 Formattata come stringa ISO (può essere una Date se necessario)
  author: {
    _id: string;
    username: string;
    profileImage: string;
  };
  upvotes: number;
  downvotes: number;
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = 'http://localhost:4000/ideas';

  constructor(private http: HttpClient) {}

  // 🔹 Recupera tutte le idee
  getIdeas(): Observable<Idea[]> {
    return this.http.get<{ status: string; data: Idea[] }>(`${this.apiUrl}`).pipe(
      map(response => response.data)
    );
  }

  // 🔹 Recupera un'idea specifica per ID
  getIdeaById(id: string): Observable<Idea> {
    return this.http.get<{ status: string; data: Idea }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // 🔹 Recupera le idee dell'utente autenticato
  getUserIdeas(): Observable<Idea[]> {
    return this.http.get<{ status: string; data: Idea[] }>(`${this.apiUrl}/user`).pipe(
      map(response => response.data)
    );
  }

  // 🔹 Crea una nuova idea
  postIdea(title: string, content: string): Observable<Idea> {
    return this.http.post<{ status: string; data: Idea }>(this.apiUrl, { title, content }).pipe(
      map(response => response.data)
    );
  }

  // 🔹 Cancella un'idea per ID
  deleteIdea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Recupera le idee per la homepage con paginazione e filtro
  getIdeasHome(type: string, page: number = 1, limit: number = 10): Observable<Idea[]> {
    return this.http.get<{ status: string; data: Idea[] }>(
      `${this.apiUrl}/home/${type}?page=${page}&limit=${limit}`
    ).pipe(map(response => response.data));
  }
}
