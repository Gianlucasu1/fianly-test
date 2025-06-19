import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentUser = localStorage.getItem('currentUser');
  
  if (isLoggedIn === 'true' && currentUser) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    router.navigate(['/register']);
    return false;
  }
}; 