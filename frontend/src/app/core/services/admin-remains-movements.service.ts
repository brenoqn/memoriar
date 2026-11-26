import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { AdminRemainsMovementListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminRemainsMovementsService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ movements: AdminRemainsMovementListItem[] }>(
        `${APP_CONFIG.apiBaseUrl}/admin/remains-movements`
      )
      .pipe(
        map((r) => r.movements)
      );
  }
}
