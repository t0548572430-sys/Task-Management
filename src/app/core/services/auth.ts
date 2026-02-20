import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs/operators';

// הגדרת המודלים לפי מה שהשרת מחזיר
export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://task-management-server-3xfz.onrender.com/api/auth';
  // Signal שמחזיק את המשתמש הנוכחי - זה יעדכן אוטומטית את כל הקומפוננטות
  currentUser = signal<User | null>(null);

  constructor() {
    // בבדיקה ראשונית - ננסה לטעון משתמש מה-LocalStorage אם קיים
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  // התחברות
  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveToStorage(response))
    );
  }

  // הרשמה
  register(credentials: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => this.saveToStorage(response))
    );
  }

  // התנתקות
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('my_teams');
    this.currentUser.set(null);
  }

  // פונקציית עזר לשמירה
  private saveToStorage(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  // קבלת הטוקן (עבור ה-Interceptor שנבנה בהמשך)
  getToken() {
    return localStorage.getItem('token');
  }
}
