import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id: number;
  title: string;       // חזרנו ל-title (במקום name)
  description?: string;
  status: string;
  projectId: number;   // שינינו ל-projectId (בלי קו תחתון, לפי השגיאה)
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks';

  // קבלת משימות (אנחנו נסנן לפי פרויקט)
  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: any) {
    return this.http.post<Task>(this.apiUrl, task);
  }

// שינינו את הפרמטר השני ל-payload מסוג any כדי שנוכל לשלוח את המבנה הנקי שלנו
updateTaskStatus(taskId: number, payload: any) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, payload);
  }
  // מחיקת משימה
  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}
