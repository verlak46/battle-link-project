import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const apiBase = environment.apiUrl.replace(/\/$/, '');

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toastCtrl = inject(ToastController);
  const translate = inject(TranslateService);
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

        let messageKey: string;

        if (err.status === 0) {
          messageKey = 'ERRORS.NETWORK';
        } else if (err.status === 403) {
          messageKey = 'ERRORS.FORBIDDEN';
        } else if (err.status === 404) {
          messageKey = 'ERRORS.NOT_FOUND';
        } else if (err.status >= 500) {
          messageKey = 'ERRORS.SERVER';
        } else {
          messageKey = 'ERRORS.GENERIC';
        }

        toastCtrl
          .create({
            message: translate.instant(messageKey),
            duration: 3000,
            position: 'bottom',
            color: 'danger',
          })
          .then((toast) => toast.present());
      },
    }),
  );
}
