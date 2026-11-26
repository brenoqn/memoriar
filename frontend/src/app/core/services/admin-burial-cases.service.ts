import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { AdminBurialCaseListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminBurialCasesService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ cases: AdminBurialCaseListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/burial-cases`)
      .pipe(
        map((r) => r.cases)
      );
  }
}
