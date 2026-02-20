import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Project, ProjectsService } from '../../../core/services/projects';
import { TeamsService } from '../../../core/services/teams';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatFormFieldModule, MatInputModule, 
    MatProgressBarModule, MatToolbarModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private teamsService = inject(TeamsService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  
  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(true);
  currentTeamId: number | null = null; 
  currentTeam = signal<any>(null); 

  showCreateForm = false;
  showMemberForm = false;
  newProjectName = '';
  newProjectDesc = '';
  newMemberEmail = '';

  ngOnInit() {
    const idFromUrl = this.route.snapshot.paramMap.get('teamId');
    this.currentTeamId = idFromUrl ? Number(idFromUrl) : null;
    if (this.currentTeamId) {
      this.loadProjects();
      this.loadTeamDetails();
    }
  }

  loadTeamDetails() {
    this.teamsService.getTeams().subscribe({
      next: (teams) => {
        const foundTeam = teams.find((t: any) => Number(t.id) === Number(this.currentTeamId));
        if (foundTeam) this.currentTeam.set(foundTeam);
      }
    });
  }

  submitAddMember() {
    // שלב בדיקה:
    console.log('--- פונקציית ההוספה הופעלה ---');
    
    const teamId = this.currentTeam()?.id;
    if (!teamId || !this.newMemberEmail) {
      alert('נא להזין מזהה/מייל');
      return;
    }

    this.teamsService.addMemberToTeam(teamId, this.newMemberEmail.trim()).subscribe({
      next: () => {
        alert('החבר נוסף בהצלחה!');
        this.newMemberEmail = '';
        this.showMemberForm = false;
        this.loadTeamDetails();
      },
      error: (err) => {
        alert('שגיאה: ' + (err.error?.error || 'userId required'));
      }
    });
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectsService.getProjects().subscribe({
      next: (allProjects) => {
        this.projects.set(allProjects.filter(p => Number(p.team_id) === Number(this.currentTeamId)));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  createProject() {
    if (!this.newProjectName.trim() || !this.currentTeamId) return;
    this.isLoading.set(true);
    this.projectsService.createProject(this.newProjectName, this.newProjectDesc, this.currentTeamId)
      .subscribe({
        next: (newProject) => {
          this.projects.update(curr => [...curr, newProject]);
          this.newProjectName = '';
          this.newProjectDesc = '';
          this.showCreateForm = false;
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }
  
  openBoard(projectId: number) { this.router.navigate(['/projects', projectId]); }
  goBackToTeams() { this.router.navigate(['/teams']); }
  
  deleteProject(project: Project) {
    if(!confirm(`למחוק את "${project.name}"?`)) return;
    this.projectsService.deleteProject(project.id).subscribe({
      next: () => this.projects.update(list => list.filter(p => p.id !== project.id))
    });
  }
}
