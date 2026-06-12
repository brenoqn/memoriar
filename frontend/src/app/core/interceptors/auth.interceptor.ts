import {
  type HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';
import { AdminAuthService } from '../services/admin-auth.service';

function shouldAttachAdminToken(req: HttpRequest<unknown>) {
  const adminPrefix = `${APP_CONFIG.apiBaseUrl}/admin/`;
  const publicPrefix = `${APP_CONFIG.apiBaseUrl}/public/`;

  if (req.url.includes(publicPrefix)) return false;
  if (!req.url.includes(adminPrefix)) return false;
  if (req.url.includes(`${adminPrefix}auth/`)) return false;
  return true;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  if (!shouldAttachAdminToken(req)) return next(req);

  const token = auth.getAccessToken();
  if (!token) return next(req);
  if (req.headers.has('Authorization')) return next(req);

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  ).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403)) {
        auth.clearSession();
        router.navigateByUrl('/admin/login');
      }
      return throwError(() => err);
    })
  );
};
