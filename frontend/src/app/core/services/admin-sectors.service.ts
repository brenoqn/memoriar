import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { AdminSectorListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminSectorsService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ sectors: AdminSectorListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/sectors`)
      .pipe(
        map((r) => r.sectors)
      );
  }
}
