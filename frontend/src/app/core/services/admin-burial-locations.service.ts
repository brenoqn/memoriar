import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import type { AdminBurialLocationListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';
import { mockAdminBurialLocations } from '../../mocks/admin.mock';

@Injectable({ providedIn: 'root' })
export class AdminBurialLocationsService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ locations: AdminBurialLocationListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/burial-locations`)
      .pipe(
        map((r) => r.locations),
        catchError((err) => {
          if (!APP_CONFIG.allowMockFallback) return throwError(() => err);
          return of(mockAdminBurialLocations());
        })
      );
  }
}
