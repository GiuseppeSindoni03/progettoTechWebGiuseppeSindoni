import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Idea {
  _id: string;
  title: string;
  content: string;
  contentHtml: string;
  author: { username: string, profileImage: string };
  timestamp: Date;
  comments: { author: { username: string }, content: string, timestamp: Date }[];
  upvotes: number;
  downvotes: number;
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private apiUrl = 'http://localhost:4000/ideas';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Ottiene le idee filtrate per tipo con paginazione
   * @param type Tipo di idee (hot, mainstream, unpopular, newest)
   * @param page Numero della pagina
   * @param limit Numero di idee per pagina (max 10)
   */
  getIdeas(type: string, page: number, limit: number = 10): Observable<Idea[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Idea[]>(`${this.apiUrl}/${type}`, { params });
  }

  /**
   * ✅ Ottiene i dettagli di un'idea specifica per ID
   * @param id ID dell'idea
   */
  getIdeaById(id: string): Observable<Idea> {
    return this.http.get<Idea>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Crea una nuova idea
   * @param idea Oggetto idea con titolo e contenuto
   */
  createIdea(idea: { title: string; content: string }): Observable<{ message: string; data: Idea }> {
    return this.http.post<{ message: string; data: Idea }>(`${this.apiUrl}`, idea);
  }

  /**
   * ✅ Elimina un'idea per ID
   * @param id ID dell'idea da eliminare
   */
  deleteIdea(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

}
