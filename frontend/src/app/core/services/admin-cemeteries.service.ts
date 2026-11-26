import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { Cemetery } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminCemeteriesService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ cemeteries: Cemetery[] }>(`${APP_CONFIG.apiBaseUrl}/admin/cemeteries`)
      .pipe(
        map((r) => r.cemeteries)
      );
  }
}
