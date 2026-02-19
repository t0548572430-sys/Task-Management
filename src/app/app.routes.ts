import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { TeamListComponent } from './features/teams/team-list/team-list';
import { ProjectListComponent } from './features/projects/project-list/project-list';
import { BoardViewComponent } from './features/board/board-view/board-view';
import { authGuard } from './core/guards/auth.guard'; // <-- הייבוא של הגארד

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'teams', component: TeamListComponent },
      { path: 'teams/:teamId', component: ProjectListComponent },
      { path: 'projects/:projectId', component: BoardViewComponent },
      
      // תיקון כאן: מי שמחובר ונכנס לנתיב ריק - שיילך ישר לצוותים
      { path: '', redirectTo: 'teams', pathMatch: 'full' }
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];