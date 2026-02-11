

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

export interface Comment {
   id: number;
   taskId: number;
   userId: number;
   body: string; 
   userName?: string;
   createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/comments';

  // GET /api/comments?taskId=XXX (מוגן)
  getComments(taskId: number) {
    return this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`);
  }

  // POST /api/comments (מוגן)
  addComment(taskId: number, content: string) {
    return this.http.post<Comment>(this.apiUrl, {
      taskId: taskId,
      body: content
    });
  }
}