import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import type { AdminDataQualityResponse } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminDataQuality } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminDataQualityService {
  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http
      .get<AdminDataQualityResponse>(`${APP_CONFIG.apiBaseUrl}/admin/data-quality`)
      .pipe(
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminDataQuality());
        })
      );
  }
}
