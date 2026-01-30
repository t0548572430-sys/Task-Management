import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService); // אנחנו מזריקים את השירות

  // הבדיקה החדשה: האם יש משתמש מחובר?
  // (אנחנו מסתמכים על זה ששמרנו את פרטי המשתמש ב-Service)
  if (authService.currentUser()) {
    return true; // יש משתמש -> כנס
  } else {
    // אין משתמש -> לך ללוגין
    router.navigate(['/login']);
    return false;
  }
};