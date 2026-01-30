import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// כאן אנחנו מגדירים איך נראה פרויקט לפי מה שהשרת שולח
export interface Project {
  id: number;           // שינינו מ-_id ל-id
  name: string;
  description?: string;
  team_id: number;      // שינינו מ-teamId ל-team_id (חשוב!)
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/projects';

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