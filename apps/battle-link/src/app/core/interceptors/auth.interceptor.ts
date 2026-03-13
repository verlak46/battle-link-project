import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

const apiBase = environment.apiUrl.replace(/\/$/, '');

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (!req.url.startsWith(apiBase) || req.url.includes('/auth/')) {
    return next(req);
  }
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
}
