import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const toastCtrl = inject(ToastController);
  const translate = inject(TranslateService);

  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        if (!(err instanceof HttpErrorResponse)) return;

        let messageKey: string;

        if (err.status === 0) {
          messageKey = 'ERRORS.NETWORK';
        } else if (err.status === 401) {
          messageKey = 'ERRORS.UNAUTHORIZED';
        } else if (err.status === 403) {
          messageKey = 'ERRORS.FORBIDDEN';
        } else if (err.status === 404) {
          messageKey = 'ERRORS.NOT_FOUND';
        } else if (err.status >= 500) {
          messageKey = 'ERRORS.SERVER';
        } else {
          messageKey = 'ERRORS.GENERIC';
        }

        const message = translate.instant(messageKey);

        toastCtrl
          .create({
            message,
            duration: 3000,
            position: 'bottom',
            color: 'danger',
          })
          .then((toast) => toast.present());
      },
    }),
  );
}
