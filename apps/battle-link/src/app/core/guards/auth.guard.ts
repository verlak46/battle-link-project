import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const targetUrl = state.url;

  return auth.ready.then(() => {
    const user = auth.user();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (!user.onboardingCompleted && targetUrl !== '/onboarding') {
      router.navigate(['/onboarding']);
      return false;
    }

    return true;
  });
};