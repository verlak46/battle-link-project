import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirige a la app si el usuario ya está autenticado (para rutas como /login). */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ready.then(() => {
    const user = auth.user();
    if (user) {
      router.navigate([user.onboardingCompleted ? '/' : '/onboarding']);
      return false;
    }
    return true;
  });
};
