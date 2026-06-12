import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type { Cemetery } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminCemeteries } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminCemeteriesService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ cemeteries: Cemetery[] }>(`${APP_CONFIG.apiBaseUrl}/admin/cemeteries`)
      .pipe(
        map((r) => r.cemeteries),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminCemeteries());
        })
      );
  }
}
