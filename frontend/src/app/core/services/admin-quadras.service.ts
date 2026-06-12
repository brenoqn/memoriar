import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type { AdminQuadraListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminQuadras } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminQuadrasService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ quadras: AdminQuadraListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/quadras`)
      .pipe(
        map((r) => r.quadras),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminQuadras());
        })
      );
  }
}
