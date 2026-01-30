// // import { Component, Inject, inject } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { MatButtonModule } from '@angular/material/button';
// // import { MatFormFieldModule } from '@angular/material/form-field';
// // import { MatInputModule } from '@angular/material/input';
// // import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// // // אנחנו מייבאים את Comment ונותנים לו שם ייחודי לצורך הקובץ הזה
// // import { CommentsService, Comment as AppComment } from '../../../core/services/comments';
// // import { MatIcon } from "@angular/material/icon";
// // import { MatDivider } from "@angular/material/divider";
// // import { AuthService } from '../../../core/services/auth';
// // @Component({
// //   selector: 'app-task-dialog',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     FormsModule,
// //     MatButtonModule,
// //     MatFormFieldModule,
// //     MatInputModule,
// //     MatDialogModule,
// //     MatIcon,
// //     MatDivider
// // ],
// //   templateUrl: './task-dialog.html',
// //   styles: [`
// //     .full-width { width: 100%; margin-bottom: 15px; }
// //     mat-dialog-content { min-width: 300px; }
// //   `]
// // })
// // export class TaskDialogComponent {
// //   // נשתמש בזה כדי לסגור את החלון
// //   dialogRef = inject(MatDialogRef<TaskDialogComponent>);
// //   commentsService = inject(CommentsService);
// //   title: string = '';
// //   description: string = '';


// //   // משתנים לתגובות
// //  comments: AppComment[] = [];
// //   newCommentText = '';

// //   constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
// //     if (data) {
// //       this.title = data.title || '';
// //       this.description = data.description || '';
// //     }
// //   }
// //   loadComments(taskId: number) {
// //   this.commentsService.getComments(taskId).subscribe({
// //     next: (res) => {
// //       console.log('התגובות שהגיעו מהשרת:', res); // <--- תוסיפי את זה!
// //       this.comments = res;
// //     },
// //     error: (err) => console.error('שגיאה בטעינת תגובות:', err)
// //   });
// // }
// //   // postComment() {
// //   //   if (!this.newCommentText.trim() || !this.data.id) return;
    
// //   //   this.commentsService.addComment(this.data.id, this.newCommentText).subscribe({
// //   //     next: (comment) => {
// //   //       this.comments.push(comment); // הוספה לרשימה המוצגת מיד
// //   //       this.newCommentText = '';    // איפוס תיבת הטקסט
// //   //     },
// //   //     error: (err) => alert('לא ניתן להוסיף תגובה: ' + err.message)
// //   //   });
// //   // }
// //   postComment() {
// //     if (!this.newCommentText.trim() || !this.data.id) return;
    
// //     // המרה מפורשת למספר כדי למנוע שגיאת 400
// //     const taskIdAsNumber = Number(this.data.id);

// //     this.commentsService.addComment(taskIdAsNumber, this.newCommentText).subscribe({
// //       next: (comment) => {
// //         this.comments.push(comment);
// //         this.newCommentText = '';
// //       },
// //       error: (err) => {
// //         console.error('Full Error Object:', err); // תסתכלי בקונסול מה השרת כותב ב-body
// //         alert('לא ניתן להוסיף תגובה: ' + (err.error?.error || err.message));
// //       }
// //     });
// //   }
// //   onSave() {
// //     // כשהמשתמש לוחץ שמור, אנחנו מחזירים את הנתונים ללוח
// //     this.dialogRef.close({ 
// //       title: this.title, 
// //       description: this.description 
// //     });
// //   }

// //   onCancel() {
// //     this.dialogRef.close(); // סגירה בלי להחזיר כלום
// //   }
// //   // הזרקת ה-AuthService כדי לדעת מי המשתמש המחובר
// // private authService = inject(AuthService);

// // isMyComment(comment: AppComment): boolean {
// //   const currentUser = this.authService.currentUser();
// //   // אם ה-ID של התגובה שווה ל-ID של המשתמש המחובר - זה שלי!
// //   return currentUser ? comment.userId === Number(currentUser.id) : false;
// // }

// // }
// import { Component, inject, OnInit, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { CommentsService, Comment as AppComment } from '../../../core/services/comments';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   selector: 'app-task-dialog',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
//     MatInputModule, MatButtonModule, MatIconModule, MatDividerModule
//   ],
//   templateUrl: './task-dialog.html',
//   styleUrl: './task-dialog.css'
// })
// export class TaskDialogComponent implements OnInit {
//   private commentsService = inject(CommentsService);
//   private authService = inject(AuthService);
//   public dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  
//   // אנחנו מאתחלים את data כדי שלא יהיה null בטעות
//   // constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
//   //   if (!this.data) this.data = { title: '', description: '' };
//   // }
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
//   console.log('Data received in dialog:', data); // אם אין פה id, הצ'אט לא יופיע
//   if (!this.data) this.data = { title: '', description: '' };
// }

//   comments: AppComment[] = [];
//   newCommentText = '';

//   ngOnInit() {
//     // טוענים תגובות רק אם יש ID (כלומר זו משימה קיימת)
//     if (this.data && this.data.id) {
//       this.loadComments(this.data.id);
//     }
//   }

//   loadComments(taskId: number) {
//     this.commentsService.getComments(taskId).subscribe({
//       next: (res) => this.comments = res,
//       error: (err) => console.error('Error loading comments:', err)
//     });
//   }

//   postComment() {
//     if (!this.newCommentText.trim() || !this.data.id) return;
    
//     this.commentsService.addComment(this.data.id, this.newCommentText).subscribe({
//       next: (comment) => {
//         this.comments.push(comment);
//         this.newCommentText = '';
//       },
//       error: (err) => alert('שגיאה בהוספת תגובה')
//     });
//   }

//   isMyComment(comment: any): boolean {
//     const userId = this.authService.currentUser()?.id;
//     return comment.userId == userId || comment.user_id == userId;
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }

//   onSave(): void {
//     // מחזירים את הנתונים המעודכנים לקומפוננטה שפתחה את הדיאלוג
//     this.dialogRef.close(this.data);
//   }
// }

import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommentsService, Comment as AppComment } from '../../../core/services/comments';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.css'
})
export class TaskDialogComponent implements OnInit {
  private commentsService = inject(CommentsService);
  private authService = inject(AuthService);
  public dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  
  comments: AppComment[] = [];
  newCommentText = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (!this.data) this.data = { title: '', description: '' };
  }

  ngOnInit() {
    if (this.data?.id) {
      this.loadComments(this.data.id);
    }
  }

  loadComments(taskId: number) {
    this.commentsService.getComments(taskId).subscribe({
      next: (res) => this.comments = res,
      error: (err) => console.error('Error loading comments:', err)
    });
  }

  postComment() {
    if (!this.newCommentText.trim() || !this.data.id) return;
    this.commentsService.addComment(this.data.id, this.newCommentText).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newCommentText = '';
      },
      error: () => alert('שגיאה בהוספת תגובה')
    });
  }

  isMyComment(comment: any): boolean {
    const userId = this.authService.currentUser()?.id;
    return comment.userId == userId || comment.user_id == userId;
  }

  onSave(): void { this.dialogRef.close(this.data); }
  onCancel(): void { this.dialogRef.close(); }
}