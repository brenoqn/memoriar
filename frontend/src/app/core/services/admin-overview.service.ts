import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type { AdminOverview } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminOverview } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminOverviewService {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http
      .get<{ overview: AdminOverview }>(`${APP_CONFIG.apiBaseUrl}/admin/overview`)
      .pipe(
        map((r) => r.overview),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminOverview());
        })
      );
  }
}
