import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Project {
  id: number;         
  name: string;
  description?: string;
  team_id: number;      
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://task-management-server-3xfz.onrender.com/api/projects';

  getProjects() {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(name: string, description: string, teamId: any) {
    return this.http.post<Project>(this.apiUrl, { 
      name, 
      description, 
      teamId: teamId  // <--- התיקון: מחקנו את הקו התחתון!
    });
  }
  // מחיקת פרויקט לפי מזהה
  deleteProject(projectId: number) {
    return this.http.delete(`${this.apiUrl}/${projectId}`);
  }
}