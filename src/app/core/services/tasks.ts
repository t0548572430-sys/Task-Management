import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id: number;
  title: string;       
  description?: string;
  status: string;
  projectId: number;   
}
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private apiUrl = ' https://task-management-server-3xfz.onrender.com';

  // קבלת משימות (אנחנו נסנן לפי פרויקט)
  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: any) {
    return this.http.post<Task>(this.apiUrl, task);
  }

updateTaskStatus(taskId: number, payload: any) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, payload);
  }
  // מחיקת משימה
  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}
