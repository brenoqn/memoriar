import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import type { AdminBurialLocationListItem } from '@memoriar/shared';

import { APP_CONFIG } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class AdminBurialLocationsService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http
      .get<{ locations: AdminBurialLocationListItem[] }>(`${APP_CONFIG.apiBaseUrl}/admin/burial-locations`)
      .pipe(
        map((r) => r.locations)
      );
  }
}
