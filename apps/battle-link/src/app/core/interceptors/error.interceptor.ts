import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const apiBase = environment.apiUrl.replace(/\/$/, '');

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  es: {
    NETWORK: 'Sin conexión con el servidor. Comprueba tu red.',
    FORBIDDEN: 'No tienes permiso para realizar esta acción.',
    NOT_FOUND: 'El recurso solicitado no existe.',
    SERVER: 'Error interno del servidor. Inténtalo más tarde.',
    GENERIC: 'Ha ocurrido un error inesperado.',
  },
  en: {
    NETWORK: 'Cannot reach the server. Check your connection.',
    FORBIDDEN: 'You do not have permission to do this.',
    NOT_FOUND: 'The requested resource does not exist.',
    SERVER: 'Internal server error. Please try again later.',
    GENERIC: 'An unexpected error occurred.',
  },
};

function getErrorMessage(status: number): string {
  const lang = localStorage.getItem('battle-link-lang') ?? 'es';
  const msgs = ERROR_MESSAGES[lang] ?? ERROR_MESSAGES['es'];

  if (status === 0) return msgs['NETWORK'];
  if (status === 403) return msgs['FORBIDDEN'];
  if (status === 404) return msgs['NOT_FOUND'];
  if (status >= 500) return msgs['SERVER'];
  return msgs['GENERIC'];
}

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toastCtrl = inject(ToastController);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        if (!(err instanceof HttpErrorResponse)) return;

        const isApiCall = req.url.startsWith(apiBase);
        const isAuthRoute = req.url.includes('/auth/');

        if (isApiCall && !isAuthRoute && err.status === 401) {
          auth.clearSession();
          router.navigate(['/login'], { queryParams: { reason: 'session-expired' } });
          return;
        }

        if (!isApiCall) return;

        toastCtrl
          .create({
            message: getErrorMessage(err.status),
            duration: 3000,
            position: 'bottom',
            color: 'danger',
          })
          .then((toast) => toast.present());
      },
    }),
  );
}
