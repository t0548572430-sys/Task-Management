import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // ReactiveFormsModule: חובה כדי להשתמש בטפסים חכמים
  imports: [ReactiveFormsModule, 
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // הזרקת שירותים (במקום ב-Constructor - הכתיב החדש)
  private fb = inject(FormBuilder);       // בונה את הטופס
  private authService = inject(AuthService); // השירות שבנינו קודם
  private router = inject(Router); 
         
  // משתנה שמחליט אם אנחנו במצב "התחברות" או "הרשמה"
  isLoginMode = true;
  
  // הודעת שגיאה להצגה למשתמש (אם הסיסמה שגויה למשל)
  errorMessage = '';

  // הגדרת הטופס והשדות שלו
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // שדה חובה + חייב להיות אימייל תקין
    password: ['', [Validators.required, Validators.minLength(6)]], // מינימום 6 תווים
    name: [''] // השם רלוונטי רק בהרשמה
  });

  // פונקציה להחלפת מצב בין התחברות להרשמה
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // איפוס שגיאות במעבר
    
    // אם עוברים להרשמה - שדה השם הופך לחובה. בהתחברות הוא לא רלוונטי.
    const nameControl = this.authForm.get('name');
    if (!this.isLoginMode) {
      nameControl?.setValidators([Validators.required]);
    } else {
      nameControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
  }

  // הפונקציה שקורית כשלוחצים על "שלח"
  onSubmit() {
    if (this.authForm.invalid) return; // אם הטופס לא תקין - אל תעשה כלום

    const { email, password, name } = this.authForm.value;

    // שליחה לשרת (Observable)
    const authObs = this.isLoginMode
      ? this.authService.login({ email, password })      // אם זה התחברות
      : this.authService.register({ email, password, name }); // אם זה הרשמה

    // הרשמה לתשובה מהשרת
    authObs.subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.router.navigate(['/teams']);
      },
      error: (err) => {
        console.error(err);
        
        // בדיקה לפי קוד השגיאה
        if (err.status === 409) {
           this.errorMessage = 'האימייל הזה כבר רשום במערכת.';
        } else if (err.status === 401) {
           this.errorMessage = 'אימייל או סיסמה שגויים.';
        } else {
           this.errorMessage = 'שגיאה בהתחברות. נסה שוב מאוחר יותר.';
        }
      }
    });
  }
}
