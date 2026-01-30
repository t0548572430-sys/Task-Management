import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>הוספת חבר לצוות</h2>
    <mat-dialog-content>
      <div style="margin-bottom: 15px; color: #666;">
        השרת דורש מזהה משתמש (ID).<br>
        אנא הכניסי את המספר המזהה (למשל: 1, 2, 3...)
      </div>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>User ID (מספר)</mat-label>
        <input matInput type="number" [(ngModel)]="targetId" placeholder="למשל: 1" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">ביטול</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!targetId">הוסף</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AddMemberDialogComponent {
  dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  targetId: number | null = null; // משתנה למספר בלבד

  onSave() {
    this.dialogRef.close(this.targetId);
  }

  onCancel() {
    this.dialogRef.close();
  }
}