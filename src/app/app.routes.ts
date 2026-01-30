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
    canActivate: [authGuard], // <-- הוספנו את ההגנה כאן!
    children: [
      { path: 'teams', component: TeamListComponent },
      
      // רשימת הפרויקטים של צוות מסוים
      { path: 'teams/:teamId', component: ProjectListComponent },
      
      // לוח המשימות של פרויקט מסוים
      { path: 'projects/:projectId', component: BoardViewComponent },
      
      // ברירת מחדל: אם נכנסים סתם לכתובת הראשי, הולכים לצוותים
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // (אופציונלי) ניתוב לכל כתובת לא מוכרת - זורק ללוגין
  { path: '**', redirectTo: 'login' }
];