// // import { Injectable, inject } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';

// import { HttpClient } from "@angular/common/http";
// import { inject, Injectable } from "@angular/core";

//  export interface Comment {
//    id: number;
//    taskId: number;
//    userId: number;
//    body: string;       // <--- להוסיף את השורה הזו!
//   content?: string;   // אפשר להשאיר כאופציונלי
//    userName?: string;
//    createdAt: string;
// }

// // @Injectable({ providedIn: 'root' })
// // export class CommentsService {
// //   private http = inject(HttpClient);
// //   private apiUrl = 'http://localhost:3000/api/comments';

// //   // שליפת תגובות לפי מזהה משימה
// //   getComments(taskId: number) {
// //     return this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`);
// //   }

// //   // יצירת תגובה חדשה
// // addComment(taskId: number, content: string) {
// //     const payload = {
// //       taskId: taskId,    // השרת ביקש taskId (עם I גדולה)
// //       body: content      // השרת ביקש body במקום content
// //     };
    
// //     console.log('Sending corrected payload:', payload);
// //     return this.http.post<Comment>(this.apiUrl, payload);
// //   }
  
// // }
// @Injectable({ providedIn: 'root' })
// export class CommentsService {
//   private http = inject(HttpClient);
//   private apiUrl = 'http://localhost:3000/api/comments';

//   /**
//    * GET /api/comments?taskId=XXX (מוגן)
//    * ה-Interceptor מוסיף את ה-Token אוטומטית
//    */
  
//   getComments(taskId: number) {
//     return this.http.get<Comment[]>(`${this.apiUrl}?taskId=${taskId}`);
//   }

//   /**
//    * POST /api/comments (מוגן)
//    * שולח body עם taskId וטקסט
//    */
//   addComment(taskId: number, content: string) {
//     const payload = {
//       taskId: taskId,
//       body: content // השרת מצפה לשדה בשם body
//     };
//     return this.http.post<Comment>(this.apiUrl, payload);
//   }
// }

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