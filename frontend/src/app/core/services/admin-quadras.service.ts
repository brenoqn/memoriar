import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { AdminQuadraListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminQuadrasService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ quadras: AdminQuadraListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/quadras`)
      .pipe(
        map((r) => r.quadras)
      );
  }
}
