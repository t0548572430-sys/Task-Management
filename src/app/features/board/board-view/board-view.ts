import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute , Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { TaskDialogComponent } from '../task-dialog/task-dialog';
// ייבוא רכיבי Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Task, TasksService } from '../../../core/services/tasks';
import { MatToolbar } from "@angular/material/toolbar";
import { Project, ProjectsService } from '../../../core/services/projects';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatToolbar
],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css'
})
export class BoardViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog); // <-- הזרקת השירות של הדיאלוג
  private projectsService = inject(ProjectsService);
  projectId: any = '';
  allTasks: Task[] = []; // שומר את כל המשימות

  // 3 רשימות נפרדות לתצוגה
  todoTasks = signal<Task[]>([]);
  doingTasks = signal<Task[]>([]);
  doneTasks = signal<Task[]>([]);
  project_id: string | null = null;
  currentProject: Project | undefined;
  
  // משתנה לשמירת ה-ID של הצוות
  parentTeamId: number | null = null;
  // ngOnInit() {
  //   this.projectId = this.route.snapshot.paramMap.get('projectId');
  //   if (this.projectId) {
  //     this.loadTasks();
  //   }
  // }
  ngOnInit() {
    // 1. קבלת המזהה מהכתובת
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    
    console.log('🏁 ngOnInit התחיל. מזהה פרויקט:', this.projectId);

    if (this.projectId) {
      // 2. הפעלה מפורשת של הפונקציות
      console.log('▶️ מפעיל את loadProjectDetails...');
      this.loadProjectDetails();
      
      console.log('▶️ מפעיל את loadTasks...');
      this.loadTasks(); 
    } else {
      console.error('⛔ שגיאה: לא נמצא מזהה פרויקט בכתובת!');
    }
  }

  loadProjectDetails() {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        console.log('📦 פרויקטים הגיעו מהשרת. מחפש את:', this.projectId);
        
        // התיקון הקריטי: (==) כדי לתפוס גם טקסט וגם מספר
        this.currentProject = projects.find(p => p.id == this.projectId);

        if (this.currentProject) {
          // חילוץ המזהה בטוח
          const p = this.currentProject as any;
          this.parentTeamId = p.team_id || p.teamId || p.team;
          
          console.log('✅ הפרויקט נמצא! מזהה הצוות (parentTeamId) עודכן ל:', this.parentTeamId);
        } else {
          console.error('❌ הפרויקט לא נמצא ברשימה!');
        }
      },
      error: (err) => console.error('💥 שגיאה בטעינת פרויקט:', err)
    });
  }

  
  goBackToProjectList() {
    // 1. בדיקה: מה באמת יש בתוך המשתנה הזה?
    console.log('הערך של parentTeamId הוא:', this.parentTeamId);

    if (this.parentTeamId) {
      // אם יש מספר, הניווט חייב לעבוד
      this.router.navigate(['/teams', this.parentTeamId])
        .then(success => {
            if (!success) console.error('הניווט נכשל! בדוק את קובץ ה-routes');
        });
    } else {
      // אם נכנסנו לפה - זה אומר שהמשתנה ריק, ולכן הניווט לא עבד קודם
      alert('שגיאה: חסר מזהה צוות! אי אפשר לחזור.');
    }
  }
  loadTasks() {
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Raw tasks from server:', tasks); // נראה מה באמת הגיע

        // התיקון: שימוש ב-any כדי לגשת לשדה project_id שמגיע מה-DB
        // (גם אם ה-Interface שלנו חושב שזה projectId)
        this.allTasks = tasks.filter((t: any) => {
          // בודקים אם project_id (מהשרת) שווה ל-ID של הפרויקט הנוכחי
          // משתמשים ב-== (שני שווים) כדי שזה יעבוד גם אם אחד הוא טקסט ואחד מספר
          return t.project_id == this.projectId;
        });

        console.log('Tasks left after filter:', this.allTasks); // כמה נשארו?
        this.updateColumns();
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  // פתיחת הדיאלוג
openAddTask() {
    console.log('1. Button Clicked - Opening Dialog'); // בדיקה 1

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('2. Dialog Closed. Result is:', result); // בדיקה 2

      if (result) {
        console.log('3. Result exists, calling createTask...'); // בדיקה 3
        this.createTask(result.title, result.description);
      } else {
        console.warn('3. Dialog closed without saving (Cancel or empty)'); // אזהרה
      }
    });
  }

  // יצירת המשימה ושמירה
 
  createTask(title: string, description: string) {
    const projectIdAsNumber = Number(this.projectId);

    // התיקון הגדול: שימוש בשמות שהשרת דרש בשגיאה
    const newTaskPayload = {
      title: title,                     // השרת ביקש 'title'
      description: description || null,
      status: 'todo',
      projectId: projectIdAsNumber      // השרת ביקש 'projectId' (בלי קו תחתון)
    };

    console.log('Sending to server (Final Fix):', newTaskPayload);

    this.tasksService.createTask(newTaskPayload).subscribe({
      next: (createdTaskFromDB) => {
        console.log('Success!', createdTaskFromDB);
        this.allTasks.push(createdTaskFromDB);
        this.updateColumns();
      },
      error: (err) => {
        console.error('Detailed Error:', err);
        alert('שגיאה: ' + JSON.stringify(err.error));
      }
    });
  }
  // פונקציה שמחלקת את המשימות לעמודות
  updateColumns() {
    this.todoTasks.set(this.allTasks.filter(t => t.status === 'todo'));
    this.doingTasks.set(this.allTasks.filter(t => t.status === 'doing'));
    this.doneTasks.set(this.allTasks.filter(t => t.status === 'done'));
  }
  

// moveTask(task: Task, newStatus: string) {
//     const originalStatus = task.status; // גיבוי למקרה של תקלה

//     // 1. נכין חבילה נקייה לשליחה לשרת
//     // אנחנו לוקחים את ה-ID של הפרויקט מה-URL (המשתנה הראשי) כדי לוודא שהוא לא הולך לאיבוד!
//     const cleanPayload = {
//       title: task.title,
//       description: task.description || null,
//       status: newStatus,
//       projectId: Number(this.projectId) // המרה למספר, ושימוש ב-ID הבטוח
//     };

//     console.log('Sending clean update to server:', cleanPayload);

//     // 2. עדכון ויזואלי מיידי (כדי שהמשתמש לא יחכה)
//     const index = this.allTasks.findIndex(t => t.id === task.id);
//     if (index !== -1) {
//       // מעדכנים את המשימה בזיכרון
//       this.allTasks[index] = { ...task, status: newStatus };
//       this.updateColumns();
//     }

//     // 3. שליחה לשרת (PATCH)
//     this.tasksService.updateTaskStatus(task.id, cleanPayload).subscribe({
//       next: () => {
//         console.log('Server saved the update successfully!');
//       },
//       error: (err) => {
//         console.error('Update failed:', err);
//         alert('שגיאה: השינוי לא נשמר בשרת. נסה שוב.');
        
//         // שחזור המצב הקודם במקרה של כישלון
//         this.allTasks[index] = { ...task, status: originalStatus };
//         this.updateColumns();
//       }
//     });
//   }
moveTask(task: Task, newStatus: string) {
    const originalStatus = task.status;

    // 1. הכנת החבילה לשרת - גרסה "בטוחה"
    const cleanPayload = {
      title: task.title,
      // תיקון 1: שרתים לא אוהבים null. נשלח מחרוזת ריקה אם אין תיאור
      description: task.description || "", 
      status: newStatus,
      // תיקון 2: המרה בטוחה למספר
      projectId: Number(this.projectId),
      // תיקון 3 (לביטחון): נשלח גם את הגרסה עם הקו התחתון, למקרה שהשרת מצפה לזה ב-PATCH
      project_id: Number(this.projectId) 
    };

    console.log('🚀 Sending robust payload to server:', cleanPayload);

    // 2. עדכון ויזואלי מיידי
    const index = this.allTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.allTasks[index] = { ...task, status: newStatus };
      this.updateColumns();
    }

    // 3. שליחה לשרת
    this.tasksService.updateTaskStatus(task.id, cleanPayload).subscribe({
      next: (res) => {
        console.log('✅ Update success!', res);
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        
        // בדיקה קריטית: האם השרת נתן לנו רמז למה הוא נכשל?
        if (err.status === 0) {
            alert('שגיאת תקשורת (CORS/Server Crash). בדוק את הטרמינל של השרת!');
        } else {
            alert('שגיאה בשמירה: ' + (err.error?.error || err.message));
        }

        // שחזור המצב הקודם
        this.allTasks[index] = { ...task, status: originalStatus };
        this.updateColumns();
      }
    });
  }

  deleteTask(task: Task) {
    if(!confirm('האם למחוק את המשימה "' + task.title + '"?')) {
      return; // המשתמש התחרט
    }

    // מחיקה מהשרת
    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        // הסרה מהרשימה המקומית כדי שהמשתמש יראה מיד שהיא נעלמה
        this.allTasks = this.allTasks.filter(t => t.id !== task.id);
        this.updateColumns(); // סידור מחדש של העמודות
      },
      error: (err) => alert('שגיאה במחיקה: ' + err.message)
    });
  }
  editTask(task: Task) {
    // 1. פתיחת הדיאלוג עם הנתונים הקיימים (Data)
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { title: task.title, description: task.description } // הנה אנחנו מעבירים את המידע!
    });

    // 2. מה קורה כשלוחצים "שמור"?
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // מכינים את המידע לעדכון
        const updatedPayload = {
          title: result.title,
          description: result.description,
          projectId: Number(this.projectId)
          // אנחנו לא שולחים סטטוס, כי הוא לא השתנה
        };

        // 3. שליחה לשרת (משתמשים באותה פונקציה שכבר תיקנו קודם ל-PATCH)
        this.tasksService.updateTaskStatus(task.id, updatedPayload).subscribe({
          next: () => {
            // עדכון המסך: מציאת המשימה ושינוי הכותרת שלה בזיכרון
            const index = this.allTasks.findIndex(t => t.id === task.id);
            if (index !== -1) {
              this.allTasks[index] = { ...this.allTasks[index], ...updatedPayload };
              this.updateColumns(); // רענון העמודות
            }
          },
          error: (err) => alert('שגיאה בעריכה: ' + err.message)
        });
      }
    });
  }
openComments(task: any) {
  console.log('Opening comments for task:', task); // לבדיקה בקונסול
  this.dialog.open(TaskDialogComponent, {
    width: '500px',
    data: { 
      id: task.id, 
      title: task.title, 
      description: task.description,
      showCommentsOnly: true  // זה מה שמסתיר את שדות העריכה
    }
  });
}
}