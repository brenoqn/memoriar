import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type { AdminBurialCaseListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminBurialCases } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminBurialCasesService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ cases: AdminBurialCaseListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/burial-cases`)
      .pipe(
        map((r) => r.cases),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminBurialCases());
        })
      );
  }
}
