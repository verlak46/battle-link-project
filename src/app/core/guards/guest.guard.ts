import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redirige a la app si el usuario ya está autenticado (para rutas como /login). */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ready.then(() => {
    if (auth.user()) {
      router.navigate(['/']);
      return false;
    }
    return true;
  });
};
