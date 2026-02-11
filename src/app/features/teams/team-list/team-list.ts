import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TeamsService, Team } from '../../../core/services/teams.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// --- Angular Material Imports ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Team, TeamsService } from '../../../core/services/teams';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css'
})
export class TeamListComponent implements OnInit {
  private teamsService = inject(TeamsService);
  public router = inject(Router); // Public כדי שנוכל להשתמש ב-HTML
  private authService = inject(AuthService);
  // ניהול המצב (State) באמצעות Signals
  teams = signal<Team[]>([]);
  isLoading = signal<boolean>(true);

  showCreateForm = false;
  newTeamName = '';

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading.set(true);
    // הקריאה הזו תעבור דרך ה-Interceptor ותקבל טוקן אוטומטית
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        console.log('🔴 הנתונים שהגיעו מהשרת:', data);
        this.teams.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching teams:', err);
        this.isLoading.set(false);
      }
    });
  }


//     if (!this.newTeamName.trim()) return;

//     this.isLoading.set(true);
//     this.teamsService.createTeam(this.newTeamName).subscribe({
//       next: (newTeam) => {
//         // עדכון הרשימה המקומית מיד (בלי קריאה נוספת לשרת)
//         this.teams.update(curr => [...curr, newTeam]);
//         this.newTeamName = '';
//         this.showCreateForm = false;
//         this.isLoading.set(false);
//       },
//       error: (err) => {
//         console.error(err);
//         this.isLoading.set(false);
//         alert('שגיאה ביצירת צוות');
//       }
//     });
//   }
//   private authService = inject(AuthService);

// isOwner(team: any): boolean {
//   const currentUser = this.authService.currentUser();
//   if (!currentUser) return false;

//   // בדיקה מול כל האופציות הנפוצות בלי להדפיס
//   const ownerId = team.owner_id || team.ownerId || team.userId || team.owner;
//   return Number(ownerId) === Number(currentUser.id);
// }
// עדכון פונקציית הבדיקה
isOwner(team: any): boolean {
  // ננסה לבדוק אם יש שדה owner (אולי הוא מופיע בצוותים חדשים)
  if (team.owner_id || team.userId) {
     return Number(team.owner_id || team.userId) === Number(this.authService.currentUser()?.id);
  }
  
  // פתרון עוקף: אם יצרנו את הצוות בדפדפן הזה, נסמן אותו
  const myCreatedTeams = JSON.parse(localStorage.getItem('my_teams') || '[]');
  return myCreatedTeams.includes(team.id);
}

// עדכון פונקציית יצירת הצוות
createTeam() {
  if (!this.newTeamName.trim()) return;
  this.isLoading.set(true);

  this.teamsService.createTeam(this.newTeamName).subscribe({
    next: (newTeam) => {
      // שמירת ה-ID של הצוות החדש ב-LocalStorage כדי שנזהה אותו כמנהלים
      const myCreatedTeams = JSON.parse(localStorage.getItem('my_teams') || '[]');
      myCreatedTeams.push(newTeam.id);
      localStorage.setItem('my_teams', JSON.stringify(myCreatedTeams));

      this.teams.update(current => [...current, newTeam]);
      this.newTeamName = '';
      this.showCreateForm = false;
      this.isLoading.set(false);
      alert('הצוות נוצר בהצלחה!');
    },
    error: () => this.isLoading.set(false)
  });
}
  openProject(teamId: any) {
    console.log('Navigating to team:', teamId);
    this.router.navigate(['/teams', teamId]);
  }
  // אל תשכחי להזריק את ה-TeamsService ב-constructor או עם inject

onAddMember(teamId: number) {
  // פתיחת תיבת קלט קטנה של הדפדפן
  const email = prompt('הזיני את כתובת האימייל של החבר שברצונך להוסיף:');

  // בדיקה שהמשתמש לא לחץ "ביטול" ושהוא הזין מייל
  if (email && email.trim() !== '') {
    this.teamsService.addMemberToTeam(teamId, email.trim()).subscribe({
      next: (res) => {
        alert('החבר נוסף לצוות בהצלחה! 🎉');
      },
      error: (err) => {
        console.error('שגיאה בהוספת חבר:', err);
        // הצגת השגיאה מהשרת (למשל אם המשתמש לא קיים)
        const errorMessage = err.error?.error || 'אופס, משהו השתבש. ודאי שהמייל תקין והמשתמש רשום במערכת.';
        alert('שגיאה: ' + errorMessage);
      }
    });
  }
}
}