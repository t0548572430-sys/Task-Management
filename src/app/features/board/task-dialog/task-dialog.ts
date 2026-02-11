
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